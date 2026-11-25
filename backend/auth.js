import crypto from 'crypto';
import express from 'express';
import { pool } from './db.js';

// Password hashing helper with unique salt
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// Optional Auth Middleware: If token provided, populates req.user from Neon DB. If not, proceeds smoothly!
export async function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const now = Date.now();
      const result = await pool.query(
        `SELECT u.id, u.name, u.email 
         FROM sessions s 
         JOIN users u ON s.user_id = u.id 
         WHERE s.token = $1 AND s.expires_at > $2 
         LIMIT 1`,
        [token, now]
      );

      if (result.rows.length > 0) {
        req.user = result.rows[0];
      }
    } catch (err) {
      console.error('[Auth Middleware Error]:', err.message);
    }
  }
  next();
}

export const authRouter = express.Router();

// 1. Signup (Registration in Neon PostgreSQL)
authRouter.post('/signup', async (req, res) => {
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

  try {
    // Check if user already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [cleanEmail]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = hashPassword(password, salt);
    const userId = 'user_' + Date.now() + '_' + Math.round(Math.random() * 1e4);

    // Insert user into Neon PostgreSQL
    await pool.query(
      `INSERT INTO users (id, name, email, salt, password) 
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, name.trim(), cleanEmail, salt, hashedPassword]
    );

    // Generate session token (valid for 30 days)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    await pool.query(
      `INSERT INTO sessions (token, user_id, email, expires_at) 
       VALUES ($1, $2, $3, $4)`,
      [token, userId, cleanEmail, expiresAt]
    );

    console.log(`[Neon DB] New user registered: ${name} (${cleanEmail})`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully in Neon Database!',
      token,
      user: { id: userId, name: name.trim(), email: cleanEmail }
    });
  } catch (err) {
    console.error('[Signup Error]:', err);
    res.status(500).json({ success: false, message: 'Database error creating account: ' + err.message });
  }
});

// 2. Login (Verified against Neon PostgreSQL)
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [cleanEmail]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = result.rows[0];
    const hashedPassword = hashPassword(password, user.salt);

    if (hashedPassword !== user.password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Generate session token (valid for 30 days)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    await pool.query(
      `INSERT INTO sessions (token, user_id, email, expires_at) 
       VALUES ($1, $2, $3, $4)`,
      [token, user.id, user.email, expiresAt]
    );

    console.log(`[Neon DB] User authenticated: ${user.name} (${user.email})`);

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('[Login Error]:', err);
    res.status(500).json({ success: false, message: 'Database error: ' + err.message });
  }
});

// 3. Forgot Password - Request 6-digit Code (Saved in Neon DB)
authRouter.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide your email address.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const userRes = await pool.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [cleanEmail]);
    if (userRes.rows.length === 0) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, a 6-digit reset code has been sent.',
        resetCode: '729104'
      });
    }

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

    // Upsert into password_resets table in Neon DB
    await pool.query(
      `INSERT INTO password_resets (email, code, expires_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) 
       DO UPDATE SET code = $2, expires_at = $3, created_at = CURRENT_TIMESTAMP`,
      [cleanEmail, code, expiresAt]
    );

    console.log(`[Neon DB] Password reset code generated for ${cleanEmail}: ${code}`);

    res.json({
      success: true,
      message: 'A 6-digit verification code has been generated.',
      resetCode: code
    });
  } catch (err) {
    console.error('[Forgot Password Error]:', err);
    res.status(500).json({ success: false, message: 'Database error: ' + err.message });
  }
});

// 4. Reset Password with Code in Neon DB
authRouter.post('/reset-password', async (req, res) => {
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

  try {
    const resetRes = await pool.query(
      'SELECT * FROM password_resets WHERE email = $1 LIMIT 1',
      [cleanEmail]
    );

    if (resetRes.rows.length === 0 || resetRes.rows[0].code !== cleanCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code. Please request a new one.'
      });
    }

    const resetData = resetRes.rows[0];
    if (Date.now() > Number(resetData.expires_at)) {
      await pool.query('DELETE FROM password_resets WHERE email = $1', [cleanEmail]);
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.'
      });
    }

    // Update user password and salt in Neon PostgreSQL
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = hashPassword(newPassword, salt);

    await pool.query(
      `UPDATE users 
       SET salt = $1, password = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE email = $3`,
      [salt, hashedPassword, cleanEmail]
    );

    // Delete used reset code
    await pool.query('DELETE FROM password_resets WHERE email = $1', [cleanEmail]);

    console.log(`[Neon DB] Password successfully reset for ${cleanEmail}`);

    res.json({
      success: true,
      message: 'Your password has been reset successfully! You can now log in.'
    });
  } catch (err) {
    console.error('[Reset Password Error]:', err);
    res.status(500).json({ success: false, message: 'Database error: ' + err.message });
  }
});

// 5. Get current profile
authRouter.get('/me', optionalAuthMiddleware, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  res.json({ success: true, user: req.user });
});

// 6. Logout
authRouter.post('/logout', async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      await pool.query('DELETE FROM sessions WHERE token = $1', [token]);
    } catch (err) {
      console.error('[Logout Error]:', err.message);
    }
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});
