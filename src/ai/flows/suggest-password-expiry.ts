'use server';

/**
 * @fileOverview A password expiry suggestion AI agent.
 *
 * - suggestPasswordExpiry - A function that suggests a password expiry date based on password strength and usage patterns.
 * - SuggestPasswordExpiryInput - The input type for the suggestPasswordExpiry function.
 * - SuggestPasswordExpiryOutput - The return type for the suggestPasswordExpiry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPasswordExpiryInputSchema = z.object({
  password: z.string().describe('The password to analyze.'),
  lastChangedDate: z.string().describe('The last date the password was changed (ISO format).'),
  usageFrequency: z
    .number()
    .describe('How often the password is used (e.g., logins per week).'),
});
export type SuggestPasswordExpiryInput = z.infer<typeof SuggestPasswordExpiryInputSchema>;

const SuggestPasswordExpiryOutputSchema = z.object({
  expiryDate: z
    .string()
    .describe('The suggested expiry date for the password (ISO format).'),
  reason: z
    .string()
    .describe('The reasoning behind the suggested expiry date, including password strength analysis.'),
});
export type SuggestPasswordExpiryOutput = z.infer<typeof SuggestPasswordExpiryOutputSchema>;

export async function suggestPasswordExpiry(
  input: SuggestPasswordExpiryInput
): Promise<SuggestPasswordExpiryOutput> {
  return suggestPasswordExpiryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPasswordExpiryPrompt',
  input: {schema: SuggestPasswordExpiryInputSchema},
  output: {schema: SuggestPasswordExpiryOutputSchema},
  prompt: `You are an AI assistant that analyzes password strength and usage patterns to suggest an optimal expiry date.

  Given the following information, determine a suitable expiry date for the password. Consider factors such as password complexity, length, and how frequently it is used.
  If the password is weak or the usage is high, suggest a sooner expiry date. If the password is strong and usage is low, suggest a later expiry date.

  Password: {{{password}}}
  Last Changed Date: {{{lastChangedDate}}}
  Usage Frequency: {{{usageFrequency}}} logins per week

  Respond with a JSON object that includes the suggested expiry date (expiryDate) in ISO format (YYYY-MM-DD) and a brief reason (reason) for the suggestion.
  `,
});

const suggestPasswordExpiryFlow = ai.defineFlow(
  {
    name: 'suggestPasswordExpiryFlow',
    inputSchema: SuggestPasswordExpiryInputSchema,
    outputSchema: SuggestPasswordExpiryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
