import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function setup() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS passwords (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT NOT NULL,
      passwordValue TEXT NOT NULL,
      url TEXT,
      notes TEXT,
      folder TEXT NOT NULL,
      expiryDate TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL,
        departmentId TEXT,
        lastLogin TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Active',
        FOREIGN KEY (departmentId) REFERENCES departments(id)
    );

    CREATE TABLE IF NOT EXISTS departments (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
    );
  `);

  const departments = await db.get('SELECT COUNT(*) as count FROM departments');
  if (departments.count === 0) {
    await db.run("INSERT INTO departments (id, name) VALUES (?, ?)", '1', 'Engineering');
    await db.run("INSERT INTO departments (id, name) VALUES (?, ?)", '2', 'Marketing');
    await db.run("INSERT INTO departments (id, name) VALUES (?, ?)", '3', 'Management');
    await db.run("INSERT INTO departments (id, name) VALUES (?, ?)", '4', 'Human Resources');
  }

  const passwords = await db.get('SELECT COUNT(*) as count FROM passwords');
  if (passwords.count === 0) {
    await db.run("INSERT INTO passwords (id, name, username, passwordValue, url, notes, folder, expiryDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", '1', 'Google Account', 'user@gmail.com', 'supersecret123', 'https://accounts.google.com', 'Main account', 'Work', '2024-12-31');
    await db.run("INSERT INTO passwords (id, name, username, passwordValue, url, notes, folder, expiryDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", '2', 'GitHub', 'devuser', 'anothersecret!@#', 'https://github.com', '', 'Work', '2025-01-15');
    await db.run("INSERT INTO passwords (id, name, username, passwordValue, url, notes, folder, expiryDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", '3', 'Netflix', 'user@email.com', 'bingewatcher_pass', 'https://netflix.com', 'Shared account', 'Personal', '2024-11-01');
  }

  const users = await db.get('SELECT COUNT(*) as count FROM users');
  if (users.count === 0) {
    await db.run("INSERT INTO users (id, name, email, role, departmentId, lastLogin, status) VALUES (?, ?, ?, ?, ?, ?, ?)", '1', 'Admin User', 'admin@fortress.com', 'Admin', '3', '2024-07-30T10:00:00Z', 'Active');
    await db.run("INSERT INTO users (id, name, email, role, departmentId, lastLogin, status) VALUES (?, ?, ?, ?, ?, ?, ?)", '2', 'Dev One', 'dev1@fortress.com', 'User', '1', '2024-07-30T12:30:00Z', 'Active');
    await db.run("INSERT INTO users (id, name, email, role, departmentId, lastLogin, status) VALUES (?, ?, ?, ?, ?, ?, ?)", '3', 'Marketing Guru', 'mktg1@fortress.com', 'User', '2', '2024-07-29T15:00:00Z', 'Active');
  }
  
  return db;
}

export const dbPromise = setup();
