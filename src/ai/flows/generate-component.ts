'use server';
/**
 * @fileOverview A flow for generating a React component from a prompt.
 *
 * - generateComponent - A function that takes a prompt and returns a React component as a string.
 * - GenerateComponentInput - The input type for the generateComponent function.
 * - GenerateComponentOutput - The output type for the generateComponent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateComponentInputSchema = z.object({
  prompt: z.string().describe('A description of the component to generate.'),
  componentType: z.string().describe('The type of component to generate (e.g., "form", "card", "page"). This will be determined by a router flow.'),
});
export type GenerateComponentInput = z.infer<typeof GenerateComponentInputSchema>;

const GenerateComponentOutputSchema = z.object({
  component: z
    .string()
    .describe(
      'The generated React component code. This should be a single block of JSX code.'
    ),
});
export type GenerateComponentOutput = z.infer<typeof GenerateComponentOutputSchema>;

export async function generateComponent(input: GenerateComponentInput): Promise<GenerateComponentOutput> {
  return generateComponentFlow(input);
}

const generateComponentPrompt = ai.definePrompt({
  name: 'generateComponentPrompt',
  input: {schema: GenerateComponentInputSchema},
  output: {schema: GenerateComponentOutputSchema},
  prompt: `You are an expert React developer. Generate a single React functional component based on the following prompt.
  
  Your response should be only the code for the component, with no extra explanations or markdown.
  
  The component should use Tailwind CSS for styling and leverage shadcn/ui components and lucide-react icons where appropriate.
  Ensure the component is well-structured, follows modern React best practices, and is production-ready.
  Do not include any 'use client' directives. Components should be server components by default unless client-side interactivity is absolutely required.

  The user wants to create a '{{componentType}}' component. Use this as a hint to generate the most relevant component.

  Prompt:
  {{{prompt}}}`,
});

const generateComponentFlow = ai.defineFlow(
  {
    name: 'generateComponentFlow',
    inputSchema: GenerateComponentInputSchema,
    outputSchema: GenerateComponentOutputSchema,
  },
  async input => {
    const {output} = await generateComponentPrompt(input);
    return output!;
  }
);
