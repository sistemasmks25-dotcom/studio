'use server';

import {
  suggestPasswordExpiry,
  SuggestPasswordExpiryInput,
} from '@/ai/flows/suggest-password-expiry';
import { dbPromise } from '@/lib/db';
import { Department, Password, User } from './data';
import { randomUUID } from 'crypto';

export async function getPasswordExpirySuggestion(
  input: SuggestPasswordExpiryInput
) {
  try {
    const result = await suggestPasswordExpiry(input);
    return result;
  } catch (error) {
    console.error('Error getting password expiry suggestion:', error);
    return { error: 'Failed to get suggestion. Please try again.' };
  }
}

export async function getPasswords(): Promise<Password[]> {
  const db = await dbPromise;
  return db.all('SELECT * FROM passwords');
}

export async function savePassword(
  password: Omit<Password, 'id'> & { id?: string }
) {
  const db = await dbPromise;
  const { id, name, username, passwordValue, url, notes, folder, expiryDate } =
    password;

  try {
    if (id) {
      // Update existing password
      await db.run(
        'UPDATE passwords SET name = ?, username = ?, passwordValue = ?, url = ?, notes = ?, folder = ?, expiryDate = ? WHERE id = ?',
        name,
        username,
        passwordValue,
        url,
        notes,
        folder,
        expiryDate,
        id
      );
    } else {
      // Insert new password
      await db.run(
        'INSERT INTO passwords (id, name, username, passwordValue, url, notes, folder, expiryDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        randomUUID(),
        name,
        username,
        passwordValue,
        url,
        notes,
        folder,
        expiryDate
      );
    }
    return { success: true };
  } catch (error) {
    console.error('Error saving password:', error);
    return { error: 'Failed to save password.' };
  }
}

export async function getUsers(): Promise<User[]> {
  const db = await dbPromise;
  return db.all('SELECT * FROM users');
}

export async function getDepartments(): Promise<Department[]> {
  const db = await dbPromise;
  return db.all(
    'SELECT d.id, d.name, count(u.id) as memberCount FROM departments d LEFT JOIN users u ON d.name = u.department GROUP BY d.id, d.name'
  );
}
