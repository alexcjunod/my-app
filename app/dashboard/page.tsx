import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCurrentGoal } from "@/lib/supabase";
import { testConnection } from "@/lib/supabase";
import { DashboardContent } from "@/components/DashboardContent";
import { ErrorMessage } from "@/components/ui/error-message";
import { DashboardHeader } from "@/components/DashboardHeader";

export default async function DashboardPage() {
  try {
    // Get auth session
    const session = await auth();
    
    // Check if we have a userId
    if (!session || !session.userId) {
      redirect("/");
    }

    // Test Supabase connection first
    const connectionTest = await testConnection();
    if (!connectionTest) {
      throw new Error("Database connection failed");
    }

    // Get the current goal
    const currentGoal = await getCurrentGoal(session.userId);
    console.log("Current Goal:", currentGoal);

    // Even if no goal exists, we still render the dashboard
    return <DashboardContent currentGoal={currentGoal} />;

  } catch (error) {
    console.error("Dashboard Error:", error);
    return (
      <div className="container mx-auto p-6">
        <DashboardHeader />
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-8">
            We couldn't load your goals. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-primary hover:underline"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
}
