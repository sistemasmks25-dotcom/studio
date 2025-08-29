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
  department: string; // The name of the department
  departmentId: string;
  lastLogin: string;
  status: 'Active' | 'Inactive';
}

export interface Department {
  id: string;
  name: string;
  memberCount: number;
}
