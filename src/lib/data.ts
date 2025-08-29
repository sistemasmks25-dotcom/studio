export interface Password {
  id: string;
  name: string;
  username: string;
  passwordValue: string;
  url: string;
  notes: string;
  folder: 'Work' | 'Personal' | 'Uncategorized';
  expiryDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
  department: string;
  lastLogin: string;
}

export interface Department {
  id: string;
  name: string;
  memberCount: number;
}

export const mockPasswords: Password[] = [
  { id: '1', name: 'Google Account', username: 'user@gmail.com', passwordValue: 'supersecret123', url: 'https://accounts.google.com', notes: 'Main account', folder: 'Work', expiryDate: '2024-12-31' },
  { id: '2', name: 'GitHub', username: 'devuser', passwordValue: 'anothersecret!@#', url: 'https://github.com', notes: '', folder: 'Work', expiryDate: '2025-01-15' },
  { id: '3', name: 'Netflix', username: 'user@email.com', passwordValue: 'bingewatcher_pass', url: 'https://netflix.com', notes: 'Shared account', folder: 'Personal', expiryDate: '2024-11-01' },
];

export const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@fortress.com', role: 'Admin', department: 'Management', lastLogin: '2024-07-30T10:00:00Z' },
  { id: '2', name: 'Dev One', email: 'dev1@fortress.com', role: 'User', department: 'Engineering', lastLogin: '2024-07-30T12:30:00Z' },
  { id: '3', name: 'Marketing Guru', email: 'mktg1@fortress.com', role: 'User', department: 'Marketing', lastLogin: '2024-07-29T15:00:00Z' },
];

export const mockDepartments: Department[] = [
  { id: '1', name: 'Engineering', memberCount: 15 },
  { id: '2', name: 'Marketing', memberCount: 8 },
  { id: '3', name: 'Management', memberCount: 3 },
  { id: '4', name: 'Human Resources', memberCount: 5 },
];
