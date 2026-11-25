import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import express from 'express';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory to store users permanently
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory sessions & password reset codes
// tokens: Map<token, { userId, email, expiresAt }>
const sessions = new Map();
// resetCodes: Map<email, { code, expiresAt }>
const resetCodes = new Map();

// Helper to read users
function readUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading users file:', err);
  }
  return [];
}

// Helper to write users
function writeUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing users file:', err);
  }
}

// Password hashing helper
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// Optional Auth Middleware: If token provided, populates req.user. If not, proceeds smoothly!
export function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const session = sessions.get(token);
    if (session && session.expiresAt > Date.now()) {
      const users = readUsers();
      const user = users.find((u) => u.id === session.userId);
      if (user) {
        req.user = { id: user.id, name: user.name, email: user.email };
      }
    }
  }
  next();
}

export const authRouter = express.Router();

// 1. Signup (Registration)
authRouter.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  if (!cleanEmail.includes('@') || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email and a password of at least 6 characters.'
    });
  }

  const users = readUsers();
  if (users.some((u) => u.email === cleanEmail)) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = hashPassword(password, salt);
  const userId = 'user_' + Date.now() + '_' + Math.round(Math.random() * 1e4);

  const newUser = {
    id: userId,
    name: name.trim(),
    email: cleanEmail,
    salt,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeUsers(users);

  // Generate session token (valid for 30 days)
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, {
    userId: newUser.id,
    email: newUser.email,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
  });

  console.log(`[Auth] New user registered: ${newUser.name} (${newUser.email})`);

  res.status(201).json({
    success: true,
    message: 'Account created successfully!',
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email }
  });
});

// 2. Login
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const users = readUsers();
  const user = users.find((u) => u.email === cleanEmail);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const hashedPassword = hashPassword(password, user.salt);
  if (hashedPassword !== user.password) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  // Generate session token (valid for 30 days)
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, {
    userId: user.id,
    email: user.email,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
  });

  console.log(`[Auth] User logged in: ${user.name} (${user.email})`);

  res.json({
    success: true,
    message: 'Logged in successfully!',
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

// 3. Forgot Password - Request Reset Code
authRouter.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide your email address.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const users = readUsers();
  const user = users.find((u) => u.email === cleanEmail);

  if (!user) {
    // For security, don't leak whether user exists, but give friendly message
    return res.json({
      success: true,
      message: 'If an account exists with this email, a 6-digit reset code has been sent.',
      code: '849201' // Demo simulation code
    });
  }

  // Generate 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  resetCodes.set(cleanEmail, {
    code,
    expiresAt: Date.now() + 15 * 60 * 1000 // 15 mins validity
  });

  console.log(`[Auth] Password reset requested for ${cleanEmail}. Verification Code: ${code}`);

  res.json({
    success: true,
    message: 'A 6-digit verification code has been sent to your email.',
    // Returning code for instant seamless testing without requiring SMTP credentials
    resetCode: code
  });
});

// 4. Reset Password with Code
authRouter.post('/reset-password', (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Email, verification code, and new password are required.'
    });
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanCode = code.toString().trim();

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long.'
    });
  }

  const savedReset = resetCodes.get(cleanEmail);
  if (!savedReset || savedReset.code !== cleanCode) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired verification code. Please request a new one.'
    });
  }

  if (Date.now() > savedReset.expiresAt) {
    resetCodes.delete(cleanEmail);
    return res.status(400).json({
      success: false,
      message: 'Verification code has expired. Please request a new one.'
    });
  }

  const users = readUsers();
  const userIndex = users.findIndex((u) => u.email === cleanEmail);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  // Update password with fresh salt
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = hashPassword(newPassword, salt);

  users[userIndex].salt = salt;
  users[userIndex].password = hashedPassword;
  users[userIndex].updatedAt = new Date().toISOString();

  writeUsers(users);
  resetCodes.delete(cleanEmail);

  console.log(`[Auth] Password reset successful for ${cleanEmail}`);

  res.json({
    success: true,
    message: 'Your password has been reset successfully! You can now log in.'
  });
});

// 5. Get current profile
authRouter.get('/me', optionalAuthMiddleware, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  res.json({ success: true, user: req.user });
});

// 6. Logout
authRouter.post('/logout', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    sessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});
