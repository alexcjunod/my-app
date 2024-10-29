"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";

interface CreateGoalButtonProps {
  variant?: "default" | "outline";
}

export function CreateGoalButton({ variant = "default" }: CreateGoalButtonProps) {
  const router = useRouter();

  return (
    <Button 
      variant={variant}
      onClick={() => router.push("/create-goal")}
      className="w-10 h-10 rounded-full p-0"
    >
      <PlusCircle className="h-5 w-5" />
    </Button>
  );
}
