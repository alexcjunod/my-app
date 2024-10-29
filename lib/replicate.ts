import Replicate from "replicate";

export async function generateSmartGoal(responses: Record<string, string>, initialPrompt: string) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error('REPLICATE_API_TOKEN is not set');
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const prompt = `
    Create a SMART goal and daily tasks based on these inputs:
    Initial Goal: ${initialPrompt}
    Specific: ${responses.specific}
    Measurable: ${responses.measurable}
    Achievable: ${responses.achievable}
    Relevant: ${responses.relevant}
    Time-bound: ${responses.timebound}

    Respond with a valid JSON object in this exact format, with no additional text or formatting:
    {"smartGoal":"Run 5 kilometers daily for 6 months to lose 10 kilos by December 31st, 2024","dailyTasks":["Complete 5km run","Track weight and running time","Prepare running gear for next day"]}
  `;

  try {
    console.log('Calling Replicate with prompt:', prompt);
    
    // Add timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('API call timed out')), 30000);
    });

    // Use a different, faster model
    const modelPromise = replicate.run(
      "mistralai/mistral-7b-instruct-v0.1",
      {
        input: {
          prompt,
          temperature: 0.1, // Lower temperature for more consistent output
          max_new_tokens: 500,
          top_p: 1,
          presence_penalty: 0,
          frequency_penalty: 0,
          system_prompt: "You are a helpful assistant that always responds with valid JSON objects. Never include any additional text or formatting in your response."
        }
      }
    );

    // Race between timeout and API call
    const output = await Promise.race([modelPromise, timeoutPromise]);
    console.log('Raw Replicate output:', output);

    // Clean and parse the output
    let outputText = '';
    if (Array.isArray(output)) {
      outputText = output.join('').trim();
    } else if (typeof output === 'string') {
      outputText = output.trim();
    }

    // Try to extract JSON from the response
    const jsonMatch = outputText.match(/\{.*\}/s);
    if (!jsonMatch) {
      console.log('No JSON found in response, using fallback');
      return createFallbackResponse(responses);
    }

    try {
      const jsonStr = jsonMatch[0].replace(/\n/g, '').replace(/\s+/g, ' ');
      console.log('Cleaned JSON string:', jsonStr);
      const formattedOutput = JSON.parse(jsonStr);

      if (!formattedOutput.smartGoal || !Array.isArray(formattedOutput.dailyTasks)) {
        console.log('Invalid JSON structure, using fallback');
        return createFallbackResponse(responses);
      }

      return {
        smartGoal: formattedOutput.smartGoal,
        dailyTasks: formattedOutput.dailyTasks
      };
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return createFallbackResponse(responses);
    }
  } catch (error) {
    console.error('Replicate API error:', error);
    return createFallbackResponse(responses);
  }
}

function createFallbackResponse(responses: Record<string, string>) {
  return {
    smartGoal: `${responses.specific} to ${responses.measurable} by ${responses.timebound}`,
    dailyTasks: [
      `Complete ${responses.achievable}`,
      "Track progress daily",
      "Review and adjust plan weekly"
    ]
  };
}
