

# Project Overview
This guide outlines the steps to create a web app that allows users to input a prompt, generate a SMART goal through interactive chat, and track progress on that goal. The app features a conversational interface that helps users refine their goals according to SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound), displays them in a calendar view for daily tracking, and includes animations for enhanced user experience.

## Technologies Used
- **Frontend**: Next.js (UI & Routing), Shadcn (components and styling), Lucid (animations)
- **Backend/Database**: Supabase (storage and user data)
- **Model Integration**: Replicate (SMART goal generation)
- **Authentication**: Clerk (user login)

---

# Feature Requirements

### 1. Form for SMART Goal Input
   - **Initial Prompt**: Users enter a general goal (e.g., "I want to lose weight").
   - **Interactive Chat Flow**: Guide users through each SMART criterion in sequence:
     - **Specific**: Ask for a specific action related to the goal (e.g., “What specific action will help you achieve this goal?”).
     - **Measurable**: Ask how the goal can be tracked (e.g., “How will you measure progress?”).
     - **Achievable**: Prompt users for actionable steps they can commit to.
     - **Relevant**: Confirm the importance or personal relevance of the goal.
     - **Time-bound**: Define a timeline or daily commitment.
   - **Generate SMART Goal**: Once all criteria are met, consolidate responses into a formatted SMART goal using the Replicate model.

### 2. Goal Generation with Replicate Model
   - **Model Integration**: Configure a button in each step of the chat flow that calls the Replicate model API to validate the user’s responses and generate feedback or suggestions.
   - **Structured Output**: Format the SMART goal to include:
     - Specific, measurable daily tasks (e.g., “Skip snacks” for weight loss).
     - Aspects such as relevance and timeline that help the user visualize and commit to their goal.
   - **Loading Animations**: Use Lucid to show loading animations or placeholders while the model processes inputs.

### 3. Calendar Integration for SMART Goal Tracking
   - **Calendar Component**: Display each generated SMART goal in a calendar view.
   - **Daily Check-offs**: Include checkboxes users can tick off each day.
   - **Data Persistence**: Use Supabase to store goals and track progress.

### 4. Streak Counter
   - **Streak Calculation**: Add a streak counter that shows the consecutive days a goal has been completed.
   - **Streak Reset**: Reset streak if a day is missed; update streak based on daily checkboxes.

### 5. Goal Editing and Tracking
   - **Editable SMART Goals**: Allow users to edit their SMART goals and save changes to Supabase.
   - **Daily Tracking**: Ensure check-off data persists each day to support accurate streak counts.

### 6. User Experience Enhancements
   - **Engaging UI**: Use Shadcn for consistent styling across components.
   - **Interactive Animations**: Include animations for button clicks, transitions between SMART criteria in the chat, and goal generation.
   - **Visual Feedback**: Show confirmation messages or visual cues as users complete each SMART criterion.

### 7. SMART Goal Requirements
   - **Daily Tasks**: Ensure the generated SMART goal includes actionable, simple daily tasks.
   - **User Guidance**: Guide the user if the entered prompt isn’t specific enough to generate a SMART goal, and suggest edits where necessary.

---

# Relevant Documentation
## How to use Replicate SMART goal generation model

Set the REPLICATE_API_TOKEN environment variable

export REPLICATE_API_TOKEN=r8_PE8**********************************

Visibility

Copy
Learn more about authentication

Install Replicate’s Node.js client library

npm install replicate

Copy
Learn more about setup
Run meta/meta-llama-3-8b-instruct using Replicate’s API. Check out the model's schema for an overview of inputs and outputs.

import Replicate from "replicate";
const replicate = new Replicate();

const input = {
    prompt: "Johnny has 8 billion parameters. His friend Tommy has 70 billion parameters. What does this mean when it comes to speed?",
    max_new_tokens: 512,
    prompt_template: "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n"
};

for await (const event of replicate.stream("meta/meta-llama-3-8b-instruct", { input })) {
  process.stdout.write(`${event}`)
};

//=> "The number of parameters in a neural network can impact ...

Copy
Learn more
- **Replicate API Docs**: For API integration and setting up prompt templates.
- **Supabase Documentation**: For storing user data, goals, and tracking progress.
- **Clerk Documentation**: For setting up user authentication.

---

# Current File Structure

- **`/pages`**: Main pages (Home, Login, Dashboard)
- **`/components`**:
   - `GoalInputForm` (for initial prompt entry)
   - `ChatFlow` (for interactive SMART goal conversation)
   - `CalendarView` (for daily tracking)
   - `StreakCounter` (for motivation)
- **`/lib`**: API and configuration files (Replicate, Supabase)
- **`/styles`**: Shadcn-based component styling
- **`/utils`**: Helper functions for streak calculation, goal validation, etc.

---

This Markdown document provides an interactive structure and technical requirements to build a conversational SMART goal-setting app using Cursor. Let me know if you’d like additional detail in any section!