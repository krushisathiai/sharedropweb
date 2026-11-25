import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRouter, optionalAuthMiddleware } from './auth.js';
import { initDb } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Dynamic PORT for cloud hosting (Render, Railway, Heroku, VPS, etc.)
const PORT = process.env.PORT || 5000;

// Initialize Neon PostgreSQL database schema on startup
initDb().catch((err) => console.error('[Neon DB Init Failed]:', err.message));

// Enable CORS for all origins so any mobile device on ANY network (4G/5G/WiFi) can access
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-transfer-key', 'Authorization']
}));

app.use(express.json());
// Optional authentication: extracts req.user if token provided, but never blocks anonymous users!
app.use(optionalAuthMiddleware);
app.use('/api/auth', authRouter);

// Temporary upload directory on hosted server
const UPLOADS_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// In-memory key-to-transfer map
// transfers: Map<key, { key, files: [], createdAt, expiresAt, downloadedCount, totalSize }>
const transfers = new Map();

// Multer disk storage: stores uploaded files in a folder named after the 6-digit key
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let key = req.headers['x-transfer-key'];
    if (!key) {
      key = generateUniqueKey();
      req.transferKey = key;
    }
    const transferDir = path.join(UPLOADS_DIR, key);
    if (!fs.existsSync(transferDir)) {
      fs.mkdirSync(transferDir, { recursive: true });
    }
    cb(null, transferDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    const safeExt = path.extname(file.originalname);
    cb(null, uniqueSuffix + safeExt);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 1024 * 5 // 5 GB limit per file for large videos & documents
  }
});

// Generate 6-digit numerical key (100000 to 999999)
function generateUniqueKey() {
  let key;
  do {
    key = Math.floor(100000 + Math.random() * 900000).toString();
  } while (transfers.has(key));
  return key;
}

// Automatic cleanup: deletes files and keys when expired (runs every 30 seconds)
setInterval(() => {
  const now = Date.now();
  for (const [key, transfer] of transfers.entries()) {
    if (now > transfer.expiresAt) {
      console.log(`[Auto-Clean] Key ${key} expired. Deleting files from server.`);
      deleteTransferFiles(key);
      transfers.delete(key);
    }
  }
}, 30 * 1000);

function deleteTransferFiles(key) {
  const transferDir = path.join(UPLOADS_DIR, key);
  try {
    if (fs.existsSync(transferDir)) {
      fs.rmSync(transferDir, { recursive: true, force: true });
    }
  } catch (err) {
    console.error(`Error deleting transfer files for key ${key}:`, err.message);
  }
}

// 1. Health check & status endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    serverType: 'Hosted Relay Server (Different Networks Supported)',
    activeTransfers: transfers.size,
    timestamp: new Date().toISOString()
  });
});

// 2. Upload endpoint: Receives files from Sender (Any network / 4G / 5G / WiFi)
app.post('/api/upload', (req, res) => {
  const key = generateUniqueKey();
  req.headers['x-transfer-key'] = key;

  const uploadMiddleware = upload.array('files', 50);

  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error('[Upload Error]:', err);
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files received' });
    }

    const durationMinutes = parseInt(req.body.durationMinutes || 10, 10);
    const expiresAt = Date.now() + durationMinutes * 60 * 1000;

    const filesMeta = req.files.map((f, idx) => ({
      id: idx.toString(),
      name: f.originalname,
      size: f.size,
      mimetype: f.mimetype,
      filename: f.filename,
      path: f.path
    }));

    const totalSize = filesMeta.reduce((acc, f) => acc + f.size, 0);

    const transferData = {
      key,
      files: filesMeta,
      totalSize,
      createdAt: Date.now(),
      expiresAt,
      downloadCount: 0,
      senderIp: req.ip || req.headers['x-forwarded-for'] || 'Remote Device',
      userId: req.user ? req.user.id : null,
      userEmail: req.user ? req.user.email : null
    };

    transfers.set(key, transferData);
    console.log(`[New Transfer] Key: ${key} | Files: ${filesMeta.length} | Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB | User: ${req.user ? req.user.email : 'Anonymous'} | Sender IP: ${transferData.senderIp}`);

    res.json({
      success: true,
      key,
      fileCount: filesMeta.length,
      files: filesMeta.map(f => ({ id: f.id, name: f.name, size: f.size, mimetype: f.mimetype })),
      totalSize,
      expiresAt,
      shareUrl: `/receive?key=${key}`
    });
  });
});

// 3. Metadata endpoint: Receiver enters 6-digit key from ANY network in the world
app.get('/api/transfer/:key', (req, res) => {
  const key = req.params.key.trim().replace(/\s+/g, '');
  const transfer = transfers.get(key);

  if (!transfer) {
    return res.status(404).json({
      success: false,
      message: 'Invalid 6-digit key or transfer has expired.'
    });
  }

  if (Date.now() > transfer.expiresAt) {
    deleteTransferFiles(key);
    transfers.delete(key);
    return res.status(410).json({
      success: false,
      message: 'This 6-digit key has expired (10 minutes limit reached).'
    });
  }

  res.json({
    success: true,
    transfer: {
      key: transfer.key,
      files: transfer.files.map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        mimetype: f.mimetype
      })),
      totalSize: transfer.totalSize,
      createdAt: transfer.createdAt,
      expiresAt: transfer.expiresAt,
      downloadCount: transfer.downloadCount
    }
  });
});

// 4. Download endpoint: Receiver downloads the video/document to their device
app.get('/api/download/:key/:fileId', (req, res) => {
  const key = req.params.key.trim().replace(/\s+/g, '');
  const fileId = req.params.fileId;
  const transfer = transfers.get(key);

  if (!transfer) {
    return res.status(404).send('Transfer not found or expired.');
  }

  if (Date.now() > transfer.expiresAt) {
    deleteTransferFiles(key);
    transfers.delete(key);
    return res.status(410).send('Transfer has expired.');
  }

  const fileMeta = transfer.files.find(f => f.id === fileId);
  if (!fileMeta || !fs.existsSync(fileMeta.path)) {
    return res.status(404).send('File not found on server.');
  }

  transfer.downloadCount += 1;
  console.log(`[Download Success] File: "${fileMeta.name}" | Key: ${key} | Receiver IP: ${req.ip || req.headers['x-forwarded-for']}`);

  res.download(fileMeta.path, fileMeta.name);
});

// 5. Get user's own active transfers (if logged in)
app.get('/api/user/transfers', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const userTransfers = [];
  for (const [key, transfer] of transfers.entries()) {
    if (transfer.userId === req.user.id) {
      userTransfers.push({
        key: transfer.key,
        files: transfer.files.map(f => ({ id: f.id, name: f.name, size: f.size, mimetype: f.mimetype })),
        totalSize: transfer.totalSize,
        createdAt: transfer.createdAt,
        expiresAt: transfer.expiresAt,
        downloadCount: transfer.downloadCount
      });
    }
  }

  res.json({ success: true, transfers: userTransfers });
});

// 6. Delete transfer manually
app.delete('/api/transfer/:key', (req, res) => {
  const key = req.params.key.trim().replace(/\s+/g, '');
  if (transfers.has(key)) {
    deleteTransferFiles(key);
    transfers.delete(key);
    return res.json({ success: true, message: 'Transfer cancelled and deleted from server.' });
  }
  res.status(404).json({ success: false, message: 'Transfer not found.' });
});

// 6. Serve static frontend files when deployed as a unified service
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    // If request didn't match any /api route, send SPA index.html
    if (!req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
  console.log(`[Static Host] Serving production frontend build from ${distPath}`);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🌐 SendAnywhere Global Transfer Server Started!`);
  console.log(`🚀 Port: ${PORT}`);
  console.log(`📡 Ready to transfer between different networks (4G/5G/WiFi)`);
  console.log(`=======================================================`);
});
