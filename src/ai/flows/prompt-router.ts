'use server';
/**
 * @fileOverview A flow for routing a user's prompt to the appropriate tool or sub-flow.
 *
 * - routePrompt - A function that takes a user prompt and determines the type of component to generate.
 * - PromptRouterInput - The input type for the routePrompt function.
 * - PromptRouterOutput - The output type for the routePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PromptRouterInputSchema = z.object({
  prompt: z.string().describe('The user input prompt.'),
});
export type PromptRouterInput = z.infer<typeof PromptRouterInputSchema>;

const PromptRouterOutputSchema = z.object({
  componentType: z
    .string()
    .describe('The type of component to generate (e.g., "form", "card", "page", "authentication", "other").'),
});
export type PromptRouterOutput = z.infer<typeof PromptRouterOutputSchema>;

export async function routePrompt(input: PromptRouterInput): Promise<PromptRouterOutput> {
  return promptRouterFlow(input);
}

const promptRouterPrompt = ai.definePrompt({
  name: 'promptRouterPrompt',
  input: {schema: PromptRouterInputSchema},
  output: {schema: PromptRouterOutputSchema},
  prompt: `You are a prompt routing expert. Your job is to analyze the user's prompt and determine what kind of web component they want to create.

  Categorize the prompt into one of the following types: "form", "card", "page", "authentication", or "other".

  Prompt:
  {{{prompt}}}`,
});

const promptRouterFlow = ai.defineFlow(
  {
    name: 'promptRouterFlow',
    inputSchema: PromptRouterInputSchema,
    outputSchema: PromptRouterOutputSchema,
  },
  async input => {
    const {output} = await promptRouterPrompt(input);
    return output!;
  }
);
