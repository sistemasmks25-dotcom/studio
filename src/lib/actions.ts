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
  password: Omit<Password, 'id' | 'usageFrequency'> & { id?: string }
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
  return db.all("SELECT u.*, d.name as department FROM users u JOIN departments d ON u.departmentId = d.id ORDER BY u.name");
}

export async function saveUser(
  user: Omit<User, 'id' | 'lastLogin' | 'status' | 'department'> & { id?: string }
) {
    const db = await dbPromise;
    const { id, name, email, role, departmentId } = user;

    try {
        if (id) {
            await db.run(
                'UPDATE users SET name = ?, role = ?, departmentId = ? WHERE id = ?',
                name, role, departmentId, id
            );
        } else {
            const existingUser = await db.get('SELECT id FROM users WHERE email = ?', email);
            if(existingUser) {
                return { error: 'A user with this email already exists.' };
            }
            await db.run(
                'INSERT INTO users (id, name, email, role, departmentId, lastLogin, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                randomUUID(), name, email, role, departmentId, new Date().toISOString(), 'Active'
            );
        }
        return { success: true };
    } catch (error) {
        console.error('Error saving user:', error);
        return { error: 'Failed to save user.' };
    }
}

export async function deactivateUser(id: string) {
    const db = await dbPromise;
    try {
        await db.run("UPDATE users SET status = 'Inactive' WHERE id = ?", id);
        return { success: true };
    } catch (error) {
        console.error('Error deactivating user:', error);
        return { error: 'Failed to deactivate user.' };
    }
}


export async function getDepartments(): Promise<Department[]> {
  const db = await dbPromise;
  return db.all(
    "SELECT d.id, d.name, (SELECT COUNT(*) FROM users u WHERE u.departmentId = d.id AND u.status = 'Active') as memberCount FROM departments d ORDER BY d.name"
  );
}

export async function saveDepartment(
  department: Omit<Department, 'memberCount'> & { id?: string }
) {
  const db = await dbPromise;
  const { id, name } = department;

  try {
    if (id) {
      // Update existing department
      await db.run('UPDATE departments SET name = ? WHERE id = ?', name, id);
    } else {
      // Insert new department
      await db.run(
        'INSERT INTO departments (id, name) VALUES (?, ?)',
        randomUUID(),
        name
      );
    }
    return { success: true };
  } catch (error) {
    console.error('Error saving department:', error);
    return { error: 'Failed to save department.' };
  }
}

export async function deleteDepartment(id: string) {
  const db = await dbPromise;
  try {
    // Optional: Check if department is empty before deleting
    const users = await db.get('SELECT COUNT(*) as count FROM users WHERE departmentId = ?', id);
    if (users.count > 0) {
        return { error: 'Cannot delete department with assigned users.' };
    }
    await db.run('DELETE FROM departments WHERE id = ?', id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting department:', error);
    return { error: 'Failed to delete department.' };
  }
}
