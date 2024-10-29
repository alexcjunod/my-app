import { UserButton } from "@clerk/nextjs";
import { Search, Bell } from "lucide-react";

interface DashboardHeaderProps {
  showStreak?: boolean;
}

export function DashboardHeader({ showStreak = false }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between py-4 px-6 bg-white/50 backdrop-blur-sm rounded-lg mb-8">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <nav className="flex gap-6">
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">Courses</a>
          <a href="#" className="text-sm font-medium bg-black text-white px-3 py-1 rounded-full">Dashboard</a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">Schedule</a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">Message</a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">Support</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Bell className="w-5 h-5 text-muted-foreground" />
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonBox: 'hover:bg-accent',
              userButtonTrigger: 'text-foreground',
            }
          }}
        />
      </div>
    </header>
  );
}
