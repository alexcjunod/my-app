"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatFlow } from "@/components/ChatFlow";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

const EXAMPLE_GOALS = [
  "I want to lose weight",
  "I want to learn to code",
  "I want to save money",
  "I want to read more books",
  "I want to learn a new language"
];

const EXAMPLE_RESPONSES = {
  "I want to lose weight": {
    specific: "To achieve this goal, I will specifically run 5 kilometers every day",
    measurable: "I will track my progress by measuring my weight weekly and recording my running times",
    achievable: "The steps I can realistically commit to are running daily and maintaining a healthy diet",
    relevant: "This goal is important to me because I want to improve my health and fitness",
    timebound: "I want to achieve this goal by losing 10kg in the next 6 months"
  },
  // ... other example responses stay the same
};

interface GoalInputFormProps {
  showHeader?: boolean;
  showBanner?: boolean;
  variant?: "default" | "compact";
}

export function GoalInputForm({ 
  showHeader = true, 
  showBanner = true,
  variant = "default" 
}: GoalInputFormProps) {
  const { user, isLoaded } = useUser();
  const [initialPrompt, setInitialPrompt] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [responses, setResponses] = useState<Record<string, string>>({});

  const randomExample = EXAMPLE_GOALS[Math.floor(Math.random() * EXAMPLE_GOALS.length)];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to create a goal");
      return;
    }
    if (initialPrompt.trim()) {
      setShowChat(true);
    }
  };

  const handleBack = () => {
    setShowChat(false);
    setResponses({});
  };

  const generateRandomGoal = () => {
    const randomGoal = EXAMPLE_GOALS[Math.floor(Math.random() * EXAMPLE_GOALS.length)];
    setInitialPrompt(randomGoal);
    if (EXAMPLE_RESPONSES[randomGoal]) {
      setResponses(EXAMPLE_RESPONSES[randomGoal]);
      setShowChat(true);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={variant === "compact" ? "" : "max-w-4xl mx-auto px-4 py-12"}>
      {showHeader && (
        <>
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            SMART Goal Setting
          </h1>
          {showBanner && (
            <p className="text-center text-lg mb-12 text-muted-foreground">
              Transform your aspirations into achievable goals with our structured approach.
            </p>
          )}
        </>
      )}
      {!showChat ? (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-background/95 backdrop-blur-lg rounded-lg p-8 shadow-2xl ring-1 ring-primary/10 transition-all duration-300">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <label htmlFor="goal" className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  What would you like to achieve?
                </label>
                <Input
                  id="goal"
                  placeholder={`e.g., ${randomExample}`}
                  value={initialPrompt}
                  onChange={(e) => setInitialPrompt(e.target.value)}
                  className="w-full text-lg py-6 bg-background/50 border-2 border-primary/20 focus:border-primary rounded-lg transition-all duration-300 placeholder:text-muted-foreground/50"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  type="submit" 
                  className="flex-1 text-lg py-8 bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 rounded-lg shadow-lg hover:shadow-xl"
                >
                  Begin SMART Process
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={generateRandomGoal}
                  className="flex-1 text-lg py-8 border-2 hover:bg-primary/10 transition-all duration-300 transform hover:scale-105 rounded-lg shadow-lg hover:shadow-xl"
                >
                  Try an Example
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-background/95 backdrop-blur-lg rounded-lg p-8 shadow-2xl ring-1 ring-primary/10 transition-all duration-300">
          <ChatFlow 
            initialPrompt={initialPrompt} 
            onBack={handleBack}
            initialResponses={responses}
          />
        </div>
      )}
    </div>
  );
}