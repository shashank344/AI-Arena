// @/app/actions.ts
'use server';

import { formatLLMResponse } from '@/ai/flows/format-llm-responses';
import { recommendTools } from '@/ai/flows/ai-powered-tool-recommendation';
import { generateComponent } from '@/ai/flows/generate-component';
import { z } from 'zod';

const promptSchema = z.string().min(1, 'Prompt cannot be empty.');

export async function generateComponentAction(prompt: string) {
  const validatedPrompt = promptSchema.safeParse(prompt);
  if (!validatedPrompt.success) {
    throw new Error(validatedPrompt.error.errors[0].message);
  }

  try {
    const response = await generateComponent({ prompt });
    return response.component;
  } catch (error) {
    console.error("Error generating component:", error);
    return "Error: Could not generate the component.";
  }
}

export async function generateUiAction(prompt: string) {
  const validatedPrompt = promptSchema.safeParse(prompt);
  if (!validatedPrompt.success) {
    throw new Error(validatedPrompt.error.errors[0].message);
  }

  try {
    const response = await generateComponent({ 
      prompt: `Create a new React component for a UI element based on the following description: ${prompt}. The component should be visually appealing and ready for production.`
    });
    return response.component;
  } catch (error) {
    console.error("Error generating UI:", error);
    return "Error: Could not generate the UI component.";
  }
}

export async function getRecommendationAction(prompt: string) {
  const validatedPrompt = promptSchema.safeParse(prompt);
  if (!validatedPrompt.success) {
    return { recommendations: 'Please enter a prompt to get recommendations.' };
  }
  
  try {
    const result = await recommendTools({ prompt });
    return result;
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return { recommendations: "Error: Could not fetch recommendations." };
  }
}
