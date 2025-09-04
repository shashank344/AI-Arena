'use server';
/**
 * @fileOverview A flow for formatting LLM responses into clean, short code snippets based on a defined schema.
 *
 * - formatLLMResponse - A function that takes a raw LLM response and formats it according to a specified schema.
 * - FormatLLMResponseInput - The input type for the formatLLMResponse function, including the raw response and the desired schema.
 * - FormatLLMResponseOutput - The output type for the formatLLMResponse function, representing the formatted code snippet.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const FormatLLMResponseInputSchema = z.object({
  rawResponse: z
    .string()
    .describe('The raw, unformatted response from the LLM.'),
  outputSchemaDescription: z
    .string()
    .describe(
      'A description of the desired output schema, guiding the LLM to format the response accordingly.'
    ),
});
export type FormatLLMResponseInput = z.infer<typeof FormatLLMResponseInputSchema>;

// Define the output schema
const FormatLLMResponseOutputSchema = z.object({
  formattedCodeSnippet: z
    .string()
    .describe('The formatted code snippet, adhering to the specified schema.'),
});
export type FormatLLMResponseOutput = z.infer<typeof FormatLLMResponseOutputSchema>;

// Exported function to call the flow
export async function formatLLMResponse(input: FormatLLMResponseInput): Promise<FormatLLMResponseOutput> {
  return formatLLMResponseFlow(input);
}

// Define the prompt
const formatLLMResponsePrompt = ai.definePrompt({
  name: 'formatLLMResponsePrompt',
  input: {schema: FormatLLMResponseInputSchema},
  output: {schema: FormatLLMResponseOutputSchema},
  prompt: `You are a formatting expert whose job is to take an LLM response and format it into a clean, short, usable code snippet.

  The user will provide the raw response, as well as a description of the desired output schema.  You must return a code snippet that adheres to the schema.

  Here is the desired schema:
  {{outputSchemaDescription}}

  Here is the raw response to format:
  {{rawResponse}}`,
});

// Define the flow
const formatLLMResponseFlow = ai.defineFlow(
  {
    name: 'formatLLMResponseFlow',
    inputSchema: FormatLLMResponseInputSchema,
    outputSchema: FormatLLMResponseOutputSchema,
  },
  async input => {
    const {output} = await formatLLMResponsePrompt(input);
    return output!;
  }
);
