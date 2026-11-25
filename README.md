# ShareDrop - Real-Time Cross-Device & Cross-Network File Transfer

A modern, high-performance file sharing web application inspired by **Send Anywhere**.
Transfer any video, document, photo, or archive between different devices and across completely **different networks** (4G/5G mobile data, home Wi-Fi, office broadband) using a temporary **6-digit key** and **QR code**.

---

## 🌟 Key Features

- **Cross-Network Support:** Sender on 4G/5G mobile cellular, recipient on Wi-Fi in any city or country.
- **Instant 6-Digit Key & QR Code:** Fast, simple, and anonymous transfer with 10-minute auto-expiry.
- **Original File Quality:** 100% bit-for-bit uncompressed transfer for 4K videos, RAW photos, and heavy documents.
- **Zero Registration:** No passwords, emails, or phone numbers required.
- **Responsive White Aesthetic:** Clean, minimalist UI built with Tailwind CSS.
- **Universal Formats:** Videos (MP4, MKV), Documents (PDF, DOCX, XLSX), Photos, ZIP archives.

---

## 📁 Project Architecture

```
sharedrop/
├── backend/                   # Dedicated backend folder
│   ├── index.js               # Express + Multer REST API & auto-cleanup
│   └── package.json           # Backend dependencies
├── src/                       # Frontend React application
│   ├── components/            # Reusable UI components
│   │   ├── Navbar.jsx         # Header navigation with status
│   │   ├── Footer.jsx         # Footer with trust badges
│   │   ├── SendCard.jsx       # File dropzone & 6-digit key trigger
│   │   ├── ReceiveCard.jsx    # 6-digit PIN input & paste button
│   │   ├── KeyDisplayModal.jsx# Large key display & QR code
│   │   ├── FileReceiveModal.jsx# Download single or all files
│   │   └── Toast.jsx          # Notification toasts
│   ├── pages/                 # Full pages with React Router
│   │   ├── Home.jsx           # Landing page with 3-step guide & FAQ
│   │   ├── SendPage.jsx       # Dedicated /send page
│   │   ├── ReceivePage.jsx    # Dedicated /receive page (with ?key=...)
│   │   └── HistoryPage.jsx    # Local transfer history (/history)
│   ├── services/
│   │   └── api.js             # API service with custom hosted URL support
│   ├── context/
│   │   └── TransferContext.jsx# Global state management
│   ├── utils/
│   │   ├── formatters.js      # Byte & time formatters
│   │   └── fileIcons.jsx      # Type-specific icons & badges
│   ├── App.jsx                # Router setup
│   └── index.css              # Tailwind CSS imports
├── dist/                      # Production frontend build
└── package.json               # Root scripts
```

---

## 🚀 Running Locally

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Run both Backend & Frontend concurrently
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 🌐 Free Cloud Hosting (Render / Railway / VPS)

When hosted on the internet, devices across different networks can transfer files seamlessly.

### Render.com Setup
1. Push your repository to GitHub.
2. Create a **New Web Service** on Render.com.
3. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Deploy and start transferring files between phones and computers worldwide!
