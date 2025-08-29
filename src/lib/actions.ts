"use server";

import { suggestPasswordExpiry, SuggestPasswordExpiryInput } from "@/ai/flows/suggest-password-expiry";

export async function getPasswordExpirySuggestion(input: SuggestPasswordExpiryInput) {
    try {
        const result = await suggestPasswordExpiry(input);
        return result;
    } catch (error) {
        console.error("Error getting password expiry suggestion:", error);
        return { error: "Failed to get suggestion. Please try again." };
    }
}
