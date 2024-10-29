import { DashboardHeader } from "@/components/DashboardHeader";
import { GoalInputForm } from "@/components/GoalInputForm";

export default function CreateGoalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 to-white">
      <div className="container mx-auto p-6">
        <DashboardHeader showStreak={false} />
        <div className="max-w-3xl mx-auto mt-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Create New Goal</h1>
          <div className="bg-white rounded-xl shadow-sm p-8">
            <GoalInputForm 
              showHeader={false} 
              showBanner={false} 
              variant="compact"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
