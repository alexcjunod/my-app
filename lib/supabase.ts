import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveGoal(userId: string, goalData: {
  smartGoal: string;
  dailyTasks: string[];
  responses: Record<string, string>;
}) {
  return await supabase
    .from('goals')
    .insert([
      {
        user_id: userId,
        smart_goal: goalData.smartGoal,
        daily_tasks: goalData.dailyTasks,
        responses: goalData.responses,
      }
    ]);
}

export async function updateProgress(userId: string, goalId: string, date: string, completed: boolean) {
  return await supabase
    .from('goal_progress')
    .upsert([
      {
        user_id: userId,
        goal_id: goalId,
        date,
        completed,
      }
    ]);
}

export async function getCurrentGoal(userId: string) {
  console.log('Getting current goal for user:', userId);
  try {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Retrieved goal:', data);
    return data;
  } catch (error) {
    console.error('Error getting current goal:', error);
    return null; // Return null instead of throwing error
  }
}

export async function getGoalProgress(goalId: string) {
  const { data } = await supabase
    .from('goal_progress')
    .select('*')
    .eq('goal_id', goalId)
    .order('date', { ascending: false });
  
  return data;
}

// Add this function to test the connection
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('goals')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase connection test error:', error);
      return false;
    }

    console.log('Supabase connection test successful:', data);
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
}
