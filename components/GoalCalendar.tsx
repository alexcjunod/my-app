"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { updateProgress } from "@/lib/supabase";
import { format, addMonths, parseISO } from "date-fns";

interface GoalCalendarProps {
  goal: {
    id: string;
    smart_goal: string;
    daily_tasks: string[];
    user_id: string;
    responses: {
      timebound: string;
    };
  };
  variant?: "default" | "expanded";
  onTasksUpdate?: (dateKey: string, completedIndices: number[]) => void;
  completedTasksState?: Record<string, number[]>;
}

export function GoalCalendar({ 
  goal, 
  variant = "default",
  onTasksUpdate,
  completedTasksState = {}
}: GoalCalendarProps) {
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>({});
  const [currentStreak, setCurrentStreak] = useState(0);
  const today = new Date();
  const dateKey = format(today, 'yyyy-MM-dd');

  const handleTaskComplete = async (taskIndex: number) => {
    const newTaskState = {
      ...completedTasks,
      [taskIndex]: !completedTasks[taskIndex]
    };
    setCompletedTasks(newTaskState);

    // Get array of completed task indices
    const completedIndices = Object.entries(newTaskState)
      .filter(([_, isCompleted]) => isCompleted)
      .map(([index]) => parseInt(index));

    // Notify parent component
    onTasksUpdate?.(dateKey, completedIndices);

    try {
      await updateProgress(goal.user_id, goal.id, dateKey, completedIndices.length === goal.daily_tasks.length);
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  // Initialize completed tasks from props
  useEffect(() => {
    const todaysTasks = completedTasksState[dateKey] || [];
    const newState: Record<number, boolean> = {};
    todaysTasks.forEach(index => {
      newState[index] = true;
    });
    setCompletedTasks(newState);
  }, [completedTasksState, dateKey]);

  // Extract the main goal from the SMART goal string
  const mainGoal = goal.responses.specific || "Complete your daily tasks";

  return (
    <div className="space-y-4">
      {/* Goal Card */}
      <div className={`p-4 bg-indigo-600 text-white rounded-lg ${variant === "expanded" ? "min-h-[120px]" : ""}`}>
        <h3 className={`font-medium mb-2 ${variant === "expanded" ? "text-lg" : "line-clamp-2"}`}>
          {mainGoal}
        </h3>
        <div className="text-sm opacity-90">Today's Tasks</div>
      </div>
      
      {/* Tasks List */}
      <div className="space-y-2">
        {goal.daily_tasks.map((task, index) => (
          <div 
            key={index} 
            className={`flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors
              ${variant === "expanded" ? "min-h-[60px]" : ""}`}
          >
            <Checkbox
              checked={completedTasks[index]}
              onCheckedChange={() => handleTaskComplete(index)}
              id={`task-${index}`}
              className="data-[state=checked]:bg-indigo-600"
            />
            <label
              htmlFor={`task-${index}`}
              className={`cursor-pointer flex-1 ${variant === "expanded" ? "text-base" : "text-sm"}`}
            >
              {task}
            </label>
          </div>
        ))}
      </div>

      {/* Progress Footer */}
      <div className="flex justify-between items-center text-sm text-muted-foreground pt-4 border-t">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <span>Today's Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🔥</span>
          <span>{currentStreak} day streak</span>
        </div>
      </div>
    </div>
  );
} 