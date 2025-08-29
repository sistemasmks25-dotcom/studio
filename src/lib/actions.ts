"use server";

import { suggestPasswordExpiry, SuggestPasswordExpiryInput } from "@/ai/flows/suggest-password-expiry";
import { dbPromise } from "@/lib/db";
import { Department, Password, User } from "./data";

export async function getPasswordExpirySuggestion(input: SuggestPasswordExpiryInput) {
    try {
        const result = await suggestPasswordExpiry(input);
        return result;
    } catch (error) {
        console.error("Error getting password expiry suggestion:", error);
        return { error: "Failed to get suggestion. Please try again." };
    }
}

export async function getPasswords(): Promise<Password[]> {
    const db = await dbPromise;
    return db.all("SELECT * FROM passwords");
}

export async function getUsers(): Promise<User[]> {
    const db = await dbPromise;
    return db.all("SELECT * FROM users");
}

export async function getDepartments(): Promise<Department[]> {
    const db = await dbPromise;
    return db.all("SELECT d.id, d.name, count(u.id) as memberCount FROM departments d LEFT JOIN users u ON d.name = u.department GROUP BY d.id, d.name");
}
