'use server';
/**
 * @fileOverview A flow for generating a generic text response from a prompt.
 *
 * - generateText - A function that takes a prompt and returns a text response.
 * - GenerateTextInput - The input type for the generateText function.
 * - GenerateTextOutput - The output type for the generateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTextInputSchema = z.object({
  prompt: z.string().describe('A prompt for the model to respond to.'),
});
export type GenerateTextInput = z.infer<typeof GenerateTextInputSchema>;

const GenerateTextOutputSchema = z.object({
  response: z.string().describe('The generated text response.'),
});
export type GenerateTextOutput = z.infer<typeof GenerateTextOutputSchema>;

export async function generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
  return generateTextFlow(input);
}

const generateTextPrompt = ai.definePrompt({
  name: 'generateTextPrompt',
  input: {schema: GenerateTextInputSchema},
  output: {schema: GenerateTextOutputSchema},
  prompt: `You are a helpful AI assistant. Respond to the following prompt.

  Prompt:
  {{{prompt}}}`,
});

const generateTextFlow = ai.defineFlow(
  {
    name: 'generateTextFlow',
    inputSchema: GenerateTextInputSchema,
    outputSchema: GenerateTextOutputSchema,
  },
  async input => {
    const {output} = await generateTextPrompt(input);
    return output!;
  }
);
