// @/app/actions.ts
'use server';

import { formatLLMResponse } from '@/ai/flows/format-llm-responses';
import { recommendTools } from '@/ai/flows/ai-powered-tool-recommendation';
import { z } from 'zod';

const promptSchema = z.string().min(1, 'Prompt cannot be empty.');

export async function generateResponseAction(prompt: string) {
  const validatedPrompt = promptSchema.safeParse(prompt);
  if (!validatedPrompt.success) {
    throw new Error(validatedPrompt.error.errors[0].message);
  }

  // Simulate a delay for getting a raw response from a model
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // This is a mock "raw" response that we will format.
  const rawResponse = `Based on your prompt about "${prompt}", here's a relevant code snippet. This is a simple implementation of a functional component in React.
  \`\`\`jsx
  import React from 'react';
  
  function FeatureComponent() {
    return (
      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-lg font-bold">Feature: ${prompt}</h3>
        <p className="mt-2 text-gray-600">
          This component demonstrates the implementation of the requested feature.
        </p>
      </div>
    );
  }
  
  export default FeatureComponent;
  \`\`\`
  This example can be expanded with more complex logic.`;

  try {
    const formatted = await formatLLMResponse({
      rawResponse: rawResponse,
      outputSchemaDescription: 'A React functional component as a JSX code snippet, extracted from the raw text. Only include the code block.'
    });
    // A simple regex to extract the code block if the formatter includes markdown syntax
    const codeMatch = formatted.formattedCodeSnippet.match(/```(?:jsx|javascript|typescript|tsx)?\n([\s\S]*?)```/);
    return codeMatch ? codeMatch[1].trim() : formatted.formattedCodeSnippet;

  } catch (error) {
    console.error("Error formatting LLM response:", error);
    return "Error: Could not format the AI response.";
  }
}

export async function getRecommendationAction(prompt: string) {
  const validatedPrompt = promptSchema.safeParse(prompt);
  if (!validatedPrompt.success) {
    return { recommendations: 'Please enter a prompt to get recommendations.' };
  }
  
  // Simulate a slight delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const result = await recommendTools({ prompt });
    return result;
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return { recommendations: "Error: Could not fetch recommendations." };
  }
}
