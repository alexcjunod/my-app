import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateSmartGoal } from "@/lib/replicate";
import { saveGoal } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    console.log('API Route - Start');
    const session = await auth();
    const userId = session.userId;
    console.log('API Route - UserId:', userId);

    if (!userId) {
      console.error('No userId found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { responses, initialPrompt } = await req.json();
    console.log('Received request:', { responses, initialPrompt });
    
    try {
      // Generate SMART goal using Replicate
      console.log('Calling Replicate...');
      const goal = await generateSmartGoal(responses, initialPrompt);
      console.log('Replicate response:', goal);

      if (!goal || !goal.smartGoal || !goal.dailyTasks) {
        throw new Error('Invalid goal format received from AI');
      }

      // Save to Supabase
      console.log('Saving to Supabase...');
      const saveResult = await saveGoal(userId, {
        smartGoal: goal.smartGoal,
        dailyTasks: goal.dailyTasks,
        responses,
      });
      console.log('Save result:', saveResult);

      return NextResponse.json({
        success: true,
        smartGoal: goal.smartGoal,
        dailyTasks: goal.dailyTasks,
      });

    } catch (error) {
      console.error('Detailed error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to generate goal' }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + (error.message || 'Unknown error') }, 
      { status: 500 }
    );
  }
}
