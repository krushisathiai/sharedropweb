# sharedropapi

Backend Cloud Relay REST API for **ShareDrop** — Real-Time Cross-Device & Cross-Network File Transfer.

---

## 🌟 Key Features

- **Cross-Network File Relay:** Transfer files across different cities, cellular data (4G/5G), and home Wi-Fi.
- **6-Digit Key Routing:** 6-digit PIN routing for instant, anonymous downloads.
- **Automated Cleanup:** Staged files are automatically purged after 10 minutes for security and disk management.
- **Optional User Accounts:** Non-mandatory login, registration, and password reset via PBKDF2 cryptography.

---

## 📡 REST API Endpoints

### File Transfer
- `POST /api/upload` — Upload single or multiple files (generates 6-digit key).
- `GET /api/transfer/:key` — Fetch transfer metadata by 6-digit key.
- `GET /api/download/:key/:fileId` — Stream download file directly to device.
- `DELETE /api/transfer/:key` — Manually delete a transfer.
- `GET /api/health` — Service health check.

### Optional Authentication
- `POST /api/auth/signup` — Create free account.
- `POST /api/auth/login` — Sign in with email & password.
- `POST /api/auth/forgot-password` — Request 6-digit password reset code.
- `POST /api/auth/reset-password` — Set new password using verification code.
- `GET /api/auth/me` — Get current logged-in profile.
- `POST /api/auth/logout` — Invalidate session token.
- `GET /api/user/transfers` — List active transfers for authenticated user.

---

## 🚀 Running the API

```bash
# Install dependencies
npm install

# Start server
npm start
```

Default port is `5000` (or dynamic `process.env.PORT` on cloud hosts like Render / Railway / Heroku).
