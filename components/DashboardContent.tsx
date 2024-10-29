"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { GoalCalendar } from "@/components/GoalCalendar";
import { CreateGoalButton } from "@/components/CreateGoalButton";
import { ErrorMessage } from "@/components/ui/error-message";
import { Activity, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";

interface Goal {
  id: string;
  smart_goal: string;
  daily_tasks: string[];
  user_id: string;
  responses: {
    timebound: string;
    specific: string;
  };
}

interface DashboardContentProps {
  currentGoal: Goal | null;
}

export function DashboardContent({ currentGoal }: DashboardContentProps) {
  const [completedTasksState, setCompletedTasksState] = useState<Record<string, number[]>>({});

  const handleTasksUpdate = (dateKey: string, completedIndices: number[]) => {
    setCompletedTasksState(prev => ({
      ...prev,
      [dateKey]: completedIndices
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto p-6">
        <DashboardHeader showStreak={!!currentGoal} />
        
        <div className="grid grid-cols-12 gap-6">
          {/* Current Goals Section - Left Column */}
          <div className="col-span-4 space-y-6">
            {/* Today's Tasks */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Today's Tasks</h2>
                <CreateGoalButton variant="outline" />
              </div>
              {currentGoal ? (
                <GoalCalendar 
                  goal={currentGoal} 
                  variant="expanded"
                  onTasksUpdate={handleTasksUpdate}
                  completedTasksState={completedTasksState}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    Let's set your first goal
                  </p>
                  <CreateGoalButton />
                </div>
              )}
            </div>
          </div>

          {/* Activity Section */}
          <div className="col-span-4 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Activity</h2>
              <select className="text-sm text-muted-foreground border rounded-md px-2 py-1">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            <div className="flex items-baseline gap-1 mb-8">
              <div className="text-4xl font-bold">
                {currentGoal?.daily_tasks?.length || 0}
              </div>
              <div className="text-muted-foreground">daily tasks</div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const dateKey = format(date, 'yyyy-MM-dd');
                const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                const completedTasks = currentGoal?.daily_tasks?.length || 0;
                const completedCount = completedTasksState[dateKey]?.length || 0;
                const progressPercentage = completedTasks > 0 ? (completedCount / completedTasks) * 100 : 0;

                return (
                  <div key={i} className="space-y-2">
                    <div className="h-24 bg-gray-100 rounded-md relative overflow-hidden">
                      <div 
                        className={`absolute bottom-0 w-full transition-all duration-300
                          ${isToday ? 'bg-indigo-500' : 'bg-indigo-600'}`}
                        style={{ 
                          height: `${progressPercentage}%`,
                          opacity: completedCount > 0 ? 1 : 0.3
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                        {completedCount}/{completedTasks}
                      </div>
                    </div>
                    <div className={`text-xs text-center ${
                      isToday 
                        ? 'text-indigo-600 font-semibold' 
                        : 'text-muted-foreground'
                    }`}>
                      {format(date, 'EEE')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Statistics */}
          <div className="col-span-4 bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Progress statistics</h2>
            <div className="space-y-6">
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[64%] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Activity className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-sm text-muted-foreground">In progress</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold">14</div>
                  <div className="text-sm text-muted-foreground">Upcoming</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 