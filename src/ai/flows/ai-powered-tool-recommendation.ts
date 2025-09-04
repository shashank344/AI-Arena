'use server';

/**
 * @fileOverview AI-Powered Tool Recommendation Flow.
 *
 * This flow uses generative AI to recommend the most appropriate AI models and parameter settings
 * based on the user's prompt, improving the quality and relevance of results.
 *
 * @param {string} prompt - The user's input prompt.
 * @returns {Promise<string>} - A promise that resolves with the AI's recommendations for models and parameters.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ToolRecommendationInputSchema = z.object({
  prompt: z.string().describe('The user input prompt.'),
});
export type ToolRecommendationInput = z.infer<typeof ToolRecommendationInputSchema>;

const ToolRecommendationOutputSchema = z.object({
  recommendations: z.string().describe('AI recommendations for models and parameters.'),
});
export type ToolRecommendationOutput = z.infer<typeof ToolRecommendationOutputSchema>;

export async function recommendTools(input: ToolRecommendationInput): Promise<ToolRecommendationOutput> {
  return recommendToolsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'toolRecommendationPrompt',
  input: {schema: ToolRecommendationInputSchema},
  output: {schema: ToolRecommendationOutputSchema},
  prompt: `You are an AI expert. Your task is to analyze the user's prompt and recommend the most appropriate AI models and parameter settings to improve the quality and relevance of the generated results. Provide specific model names and parameter settings (e.g., temperature, max tokens) along with a brief justification for each recommendation.  The user's prompt is: {{{prompt}}}`,
});

const recommendToolsFlow = ai.defineFlow(
  {
    name: 'recommendToolsFlow',
    inputSchema: ToolRecommendationInputSchema,
    outputSchema: ToolRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
