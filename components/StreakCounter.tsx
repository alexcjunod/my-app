"use client";

import { useEffect, useState } from "react";
import { getGoalProgress } from "@/lib/supabase";

export function StreakCounter() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const calculateStreak = async () => {
      try {
        const progress = await getGoalProgress("current-goal-id"); // We'll need to pass this properly
        if (!progress) return;

        let currentStreak = 0;
        const today = new Date();
        
        // Sort progress by date in descending order
        const sortedProgress = progress.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // Calculate streak
        for (const entry of sortedProgress) {
          if (entry.completed) {
            currentStreak++;
          } else {
            break;
          }
        }

        setStreak(currentStreak);
      } catch (error) {
        console.error('Failed to calculate streak:', error);
      }
    };

    calculateStreak();
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>🔥</span>
      <span>{streak} day streak</span>
    </div>
  );
} 