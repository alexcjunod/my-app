"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft } from "lucide-react";
import { generateSmartGoal } from "@/lib/replicate";
import { saveGoal } from "@/lib/supabase";
import { CalendarView } from "@/components/CalendarView";
import { useRouter } from "next/navigation";

type SmartCriteria = "specific" | "measurable" | "achievable" | "relevant" | "timebound";

const SMART_CRITERIA = {
  specific: {
    question: "What specific action will help you achieve this goal?",
    description: "Make your goal clear and specific. Instead of 'get fit', think 'exercise regularly'. What exactly do you want to accomplish?",
    placeholder: "To achieve this goal, I will specifically..."
  },
  measurable: {
    question: "How will you measure progress towards this goal?",
    description: "Define concrete criteria for measuring progress. This could be numbers, quantities, or clear indicators of progress.",
    placeholder: "I will track my progress by measuring..."
  },
  achievable: {
    question: "What actionable steps can you commit to?",
    description: "Your goal should be realistic and attainable. Break it down into smaller, manageable steps.",
    placeholder: "The steps I can realistically commit to are..."
  },
  relevant: {
    question: "Why is this goal important to you?",
    description: "Ensure your goal matters to you and aligns with your other objectives.",
    placeholder: "This goal is important to me because..."
  },
  timebound: {
    question: "When do you want to achieve this goal by?",
    description: "Set a clear deadline or timeframe. This creates urgency and helps you stay focused.",
    placeholder: "I want to achieve this goal by..."
  },
};

const SMART_STEPS = ["specific", "measurable", "achievable", "relevant", "timebound"] as const;

interface ChatFlowProps {
  initialPrompt: string;
  onBack?: () => void;
  initialResponses?: Record<string, string>;
}

export function ChatFlow({ initialPrompt, onBack, initialResponses = {} }: ChatFlowProps) {
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState<SmartCriteria>("specific");
  const [responses, setResponses] = useState<Record<SmartCriteria, string>>(
    initialResponses as Record<SmartCriteria, string> || {
      specific: "",
      measurable: "",
      achievable: "",
      relevant: "",
      timebound: "",
    }
  );
  const [currentResponse, setCurrentResponse] = useState<string>(
    (initialResponses?.[currentStep as keyof typeof initialResponses] as string) || 
    SMART_CRITERIA[currentStep].placeholder.split('...')[0] || 
    ""
  );
  const [generatedGoal, setGeneratedGoal] = useState<{
    smartGoal: string;
    dailyTasks: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const currentStepIndex = SMART_STEPS.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / SMART_STEPS.length) * 100;

  const handleBack = () => {
    if (currentStepIndex > 0) {
      const previousStep = SMART_STEPS[currentStepIndex - 1];
      setCurrentStep(previousStep);
      setCurrentResponse(responses[previousStep]);
    } else if (onBack) {
      onBack();
    }
  };

  const handleNext = async () => {
    const trimmedResponse = (currentResponse || "").trim();
    if (!trimmedResponse && currentStepIndex < SMART_STEPS.length - 1) {
      return;
    }

    setResponses((prev) => ({ ...prev, [currentStep]: trimmedResponse }));

    if (currentStepIndex < SMART_STEPS.length - 1) {
      const nextStep = SMART_STEPS[currentStepIndex + 1];
      setCurrentStep(nextStep);
      const nextResponse = responses[nextStep] || SMART_CRITERIA[nextStep].placeholder.split('...')[0] || "";
      setCurrentResponse(nextResponse);
    } else {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/generate-goal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            responses,
            initialPrompt,
          }),
          credentials: 'same-origin'
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate goal');
        }
        
        setGeneratedGoal(data);
        setShowSuccess(true);
        
        // Wait for animation and then redirect
        await new Promise(resolve => setTimeout(resolve, 3000));
        window.location.href = '/dashboard';

      } catch (error) {
        console.error('Error details:', error);
        setError(error.message || 'Failed to generate goal. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Add default text handling
  const getDefaultText = (step: SmartCriteria) => {
    return SMART_CRITERIA[step].placeholder.split('...')[0];
  };

  // Initialize response with default text
  const initializeResponse = (step: SmartCriteria) => {
    if (!responses[step]) {
      setCurrentResponse(getDefaultText(step));
    }
  };

  // Handle step changes
  useEffect(() => {
    initializeResponse(currentStep);
  }, [currentStep]);

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentResponse.trim() && !isLoading) {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <span className="text-sm text-muted-foreground">
            Step {currentStepIndex + 1} of {SMART_STEPS.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="p-6 min-h-[400px] flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Let's make your goal SMART</h2>
        <div className="space-y-4 flex-1">
          <p className="font-medium text-sm text-muted-foreground">Your initial goal: {initialPrompt}</p>
          
          {/* Previous responses - Scrollable if many */}
          {currentStepIndex > 0 && (
            <div className="space-y-2 max-h-[120px] overflow-y-auto mb-4 pr-2">
              {SMART_STEPS.slice(0, currentStepIndex).map((step) => (
                <div key={step} className="p-3 bg-muted rounded-md">
                  <p className="text-xs font-medium text-muted-foreground">
                    {SMART_CRITERIA[step].question}
                  </p>
                  <p className="text-sm">{responses[step]}</p>
                </div>
              ))}
            </div>
          )}

          {/* Current question */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium capitalize">
                {currentStep}
              </h3>
              <p className="text-sm text-muted-foreground">
                {SMART_CRITERIA[currentStep].description}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {SMART_CRITERIA[currentStep].question}
              </label>
              <Input
                value={currentResponse}
                onChange={(e) => setCurrentResponse(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={(e) => {
                  const input = e.target;
                  if (currentResponse === getDefaultText(currentStep)) {
                    input.setSelectionRange(input.value.length, input.value.length);
                  }
                }}
                className="w-full"
                placeholder={SMART_CRITERIA[currentStep].placeholder}
              />
            </div>
          </div>
        </div>

        {/* Button Section - Fixed at bottom */}
        <div className="mt-6">
          <Button 
            onClick={handleNext} 
            className="w-full"
            disabled={!(currentResponse || "").trim() || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Generating Goal...
              </div>
            ) : (
              currentStep === "timebound" ? "Generate SMART Goal" : "Next"
            )}
          </Button>
          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}
        </div>
      </Card>

      {/* Success Modal */}
      {showSuccess && generatedGoal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
            <h3 className="text-xl font-semibold text-center">Goal Generated Successfully!</h3>
            <div className="space-y-2">
              <p className="font-medium">Your SMART Goal:</p>
              <p className="text-muted-foreground">{generatedGoal.smartGoal}</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Daily Tasks:</p>
              <ul className="list-disc pl-4 text-muted-foreground">
                {generatedGoal.dailyTasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Redirecting to dashboard in a moment...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
