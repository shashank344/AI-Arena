'use server';

import { formatLLMResponse } from '@/ai/flows/format-llm-responses';
import { recommendTools } from '@/ai/flows/ai-powered-tool-recommendation';
import { generateComponent } from '@/ai/flows/generate-component';
import { routePrompt } from '@/ai/flows/prompt-router';
import { generateProductDescription } from '@/ai/flows/generate-product-description';
import { z } from 'zod';

const promptSchema = z.string().min(1, 'Prompt cannot be empty.');
const generateDescriptionSchema = z.object({
    productName: z.string().min(1, 'Product name cannot be empty.'),
    keywords: z.string().min(1, 'Keywords cannot be empty.'),
});

export async function generateComponentAction(prompt: string) {
  const validatedPrompt = promptSchema.safeParse(prompt);
  if (!validatedPrompt.success) {
    throw new Error(validatedPrompt.error.errors[0].message);
  }

  try {
    const { componentType } = await routePrompt({ prompt });
    const response = await generateComponent({ prompt, componentType });
    return response.component;
  } catch (error) {
    console.error("Error generating component:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred while generating the component.");
  }
}

export async function generateUiAction(prompt: string) {
  const validatedPrompt = promptSchema.safeParse(prompt);
  if (!validatedPrompt.success) {
    throw new Error(validatedPrompt.error.errors[0].message);
  }

  try {
    const response = await generateComponent({ 
      prompt: `Create a new React component for a UI element based on the following description: ${prompt}. The component should be visually appealing and ready for production.`,
      componentType: 'ui-element'
    });
    return response.component;
  } catch (error) {
    console.error("Error generating UI:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred while generating the UI component.");
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
    if (error instanceof Error) {
      throw new Error(`Could not fetch recommendations: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching recommendations.");
  }
}

export async function generateDescriptionAction(input: { productName: string, keywords: string }) {
    const validationResult = generateDescriptionSchema.safeParse(input);
    if (!validationResult.success) {
        throw new Error(validationResult.error.errors.map(e => e.message).join(', '));
    }

    try {
        const result = await generateProductDescription(input);
        return result.description;
    } catch (error) {
        console.error("Error generating product description:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("An unknown error occurred while generating the product description.");
    }
}
