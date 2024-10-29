"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface CalendarViewProps {
  smartGoal: string;
  dailyTasks: string[];
}

export function CalendarView({ smartGoal, dailyTasks }: CalendarViewProps) {
  const [completedDays, setCompletedDays] = useState<Record<string, boolean>>({});
  const [currentStreak, setCurrentStreak] = useState(0);

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const toggleDay = (day: number) => {
    const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${day}`;
    setCompletedDays(prev => {
      const updated = { ...prev, [dateKey]: !prev[dateKey] };
      calculateStreak(updated);
      return updated;
    });
  };

  const calculateStreak = (completed: Record<string, boolean>) => {
    // Calculate streak logic here
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Goal Tracking</h2>
      <p className="mb-4">{smartGoal}</p>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Daily Tasks:</h3>
        <ul className="list-disc pl-4">
          {dailyTasks.map((task, index) => (
            <li key={index}>{task}</li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map(day => (
          <div key={day} className="text-center">
            <Checkbox
              checked={completedDays[`${today.getFullYear()}-${today.getMonth() + 1}-${day}`]}
              onCheckedChange={() => toggleDay(day)}
              disabled={day > today.getDate()}
            />
            <div className="text-sm">{day}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-lg font-medium">Current Streak: {currentStreak} days</p>
      </div>
    </Card>
  );
}
