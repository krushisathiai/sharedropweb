/**
 * ShareDrop Intelligent Troubleshooting & Support Knowledge Base
 * English Knowledge Engine supporting English, Hindi, and Hinglish queries.
 */

export const QUICK_PROMPTS = [
  {
    id: 'download_issue',
    label: '📥 File not downloading?',
    query: 'download not working',
  },
  {
    id: 'key_expired',
    label: '🔑 Key expired or invalid?',
    query: 'key expired or invalid key',
  },
  {
    id: 'cross_network',
    label: '🌍 How to transfer between different cities & networks?',
    query: 'how to transfer different networks pune to sangamner',
  },
  {
    id: 'qr_camera',
    label: '📷 Camera / QR scanner not opening?',
    query: 'camera permission qr code scanner not working',
  },
  {
    id: 'history_empty',
    label: '🔒 Why is transfer history empty?',
    query: 'why is transfer history empty data missing',
  },
  {
    id: 'server_wake',
    label: '⏳ Server slow or connecting?',
    query: 'server connecting slow render wakeup',
  },
  {
    id: 'file_limits',
    label: '📁 File size limits & supported types?',
    query: 'file size limits supported formats',
  },
];

export const KNOWLEDGE_RULES = [
  // 1. Camera / QR Code Scanner Issues
  {
    id: 'camera_qr',
    primaryKeywords: ['camera', 'scan', 'scanner', 'qr', 'qrcode', 'permission', 'black screen', 'lens'],
    secondaryKeywords: ['open', 'allow', 'video', 'photo', 'kam', 'chalu'],
    response: {
      title: '📷 Camera & QR Scanner Troubleshooting',
      text: `If the QR scanner or camera is not opening on your device, follow these steps:

1. **Allow Camera Permissions**:
   - In your browser (Chrome/Safari), tap the **Lock icon 🔒** or settings icon beside the website address bar.
   - Tap **Permissions** -> Toggle **Camera** to **Allow**.
   - Refresh the page and tap the scanner again.
2. **Switch to Rear/Front Camera**:
   - On mobile phones, tap the **Switch Camera 🔄** button at the top-right of the scanner window to toggle to your back camera.
3. **Alternative Option (No Camera Needed)**:
   - You can enter the **6-digit key** manually into the box, or click **"Upload QR Image"** to scan from a photo or screenshot.`,
      action: { label: 'Open Receive & Scan', path: '/receive' },
      tips: ['Tip: Browser camera access strictly requires a secure HTTPS connection.'],
    },
  },

  // 2. 6-Digit Key Expired / Invalid Key
  {
    id: 'key_issues',
    primaryKeywords: ['key', 'digit', 'expire', 'expired', 'invalid', 'wrong key', 'galat', 'code', 'pin'],
    secondaryKeywords: ['not found', 'error', 'wrong', 'bata raha', 'khatam', 'digits'],
    response: {
      title: '🔑 6-Digit Key Invalid or Expired',
      text: `If you see an "Invalid Key" or "Transfer Expired" message:

1. **10-Minute Ephemeral Expiration**:
   - For privacy and storage security, anonymous transfer keys expire after **10 minutes**.
   - If the timer has lapsed, the staged files are automatically deleted and the sender must re-upload.
2. **Double-Check Digits**:
   - Make sure all 6 digits were entered correctly without spaces (e.g. 482910).
3. **Sender Upload Status**:
   - Confirm that the sender reached 100% upload completion and generated the key before you attempted to download.`,
      action: { label: 'Enter 6-Digit Key', path: '/receive' },
      tips: ['Tip: Sign up for a free account to unlock extended key validities up to 24 hours!'],
    },
  },

  // 3. Cross-Network Sharing (Pune to Sangamner)
  {
    id: 'cross_network',
    primaryKeywords: ['pune', 'sangamner', 'different network', 'alag alag', 'dur', 'distance', 'city', 'location', 'cross network'],
    secondaryKeywords: ['network', 'mobile data', '4g', '5g', 'wifi', 'hotspot', 'cellular', 'cities'],
    response: {
      title: '🌍 Cross-Network & Long-Distance Transfer',
      text: `**Yes, absolutely! ShareDrop works across different networks, mobile carriers, and cities!**

- **How It Works**:
  - The sender can be in **Pune** using mobile cellular data (4G/5G Jio/Airtel).
  - The recipient can be in **Sangamner** (or anywhere globally) using home Wi-Fi or mobile data.
  - No shared local Wi-Fi or Bluetooth pairing is needed! Transfers flow seamlessly through our central cloud relay.
- **Quick Steps**:
  1. Sender selects files on the **Send** page and generates a **6-Digit Key** or **QR Code**.
  2. Sender shares the key with the recipient over WhatsApp or Call.
  3. Recipient enters the 6 digits on the **Receive** page -> **Automatic download begins immediately!**`,
      action: { label: 'Start Sending Files', path: '/send' },
      tips: ['Both devices do NOT need to be on the same Wi-Fi. Central cloud relay handles cross-network delivery.'],
    },
  },

  // 4. Download Not Working / Auto Download Issue
  {
    id: 'download_issue',
    primaryKeywords: ['download', 'donaold', 'downlod', 'receive', 'automatic', 'auto download', 'install', 'save'],
    secondaryKeywords: ['not downloading', 'nahi ho raha', 'fail', 'failed', 'stuck', 'ruka hai', 'error', 'popup'],
    response: {
      title: '📥 Automatic Download Troubleshooting',
      text: `If your files are not downloading automatically:

1. **Enter All 6 Digits**:
   - The download initiates **automatically** as soon as the 6th digit is typed or the QR code is scanned.
2. **Allow Browser Popups & Downloads**:
   - If your mobile browser blocks automatic downloads, click the **Lock 🔒 icon** in your address bar and select **"Always allow downloads"**.
3. **Manual Download Fallback**:
   - If your browser blocked the automatic trigger, simply click the **"Download Now"** button displayed on your screen.
4. **Sender Upload Verification**:
   - Confirm with the sender that their file upload reached 100% and did not fail prematurely.`,
      action: { label: 'Go to Receive Page', path: '/receive' },
      tips: ['Tip: On mobile devices, files will be saved directly into your device Downloads folder.'],
    },
  },

  // 5. Transfer History Issues (Why is it empty / privacy)
  {
    id: 'history_issue',
    primaryKeywords: ['history', 'purana', 'record', 'blank', 'khali', 'empty', 'show nahi', 'dekh nahi', 'privacy', 'data leak'],
    secondaryKeywords: ['purani', 'pehle', 'kaha gaya', 'where', 'lost', 'account'],
    response: {
      title: '🔒 Private Transfer History',
      text: `**Transfer history is strictly isolated per registered user account:**

- **Why is history empty?**:
  - To protect your personal privacy, transfer history is only saved when you are **logged in**.
  - If you use ShareDrop as an anonymous guest, no transfer records are stored in the browser, preventing unauthorized users on this device from seeing your files.
- **How to view and save history**:
  1. Sign in to your ShareDrop account (or create a free account).
  2. Any file you send or receive while logged in will be privately stored under your personal profile.
  3. No other user can ever view your transfer history.`,
      action: { label: 'Sign In to View History', path: '/login' },
      tips: ['Creating an account is 100% free and takes less than 30 seconds.'],
    },
  },

  // 6. Server Connecting / Render Cold Start
  {
    id: 'server_health',
    primaryKeywords: ['server', 'render', 'connecting', 'slow', 'offline', 'load', 'loading', 'chalu nahi', 'api', 'server down'],
    secondaryKeywords: ['speed', 'band', 'server down', 'lag', 'relay'],
    response: {
      title: '⏳ Central Relay Server Connection',
      text: `ShareDrop's cloud backend is hosted on **Render Cloud**:

- **Free-Tier Sleep Mode**:
  - If the service has been idle for over 15 minutes, the cloud backend enters a sleep state to conserve resources.
- **Wake-up Duration**:
  - The first request can take approximately **30 to 45 seconds** to wake up.
- Once the green **"Connected"** status displays, all subsequent transfers will run at full speed!`,
      action: { label: 'Check Relay Status', path: '/' },
      tips: ['Tip: If a transfer times out during server sleep, refresh the page and try again after 20 seconds.'],
    },
  },

  // 7. File Size Limits & File Types
  {
    id: 'file_limits',
    primaryKeywords: ['size', 'limit', 'badi file', 'mb', 'gb', 'maximum', 'large file', 'formats', 'types'],
    secondaryKeywords: ['video', 'photo', 'pdf', 'zip', 'file', 'type', 'capacity'],
    response: {
      title: '📁 Supported Files & Size Limits',
      text: `**All file formats are fully supported without compression:**

- **Supported Media**:
  - High-resolution Videos (MP4, MKV, MOV, AVI)
  - Original Photos (RAW, PNG, JPG, HEIC)
  - Documents (PDF, Word, Excel, PPT)
  - Compressed Archives (ZIP, RAR, 7Z, TAR)
  - Applications (APK, DMG, EXE)
- **Recommended Size**:
  - Up to **100MB – 500MB** per batch provides maximum web browser stability and instant download speeds.
  - Multi-file batch selection is fully supported.`,
      action: { label: 'Select Files to Send', path: '/send' },
      tips: ['Unlike messaging apps, ShareDrop does not compress or downscale your 4K videos or RAW photos.'],
    },
  },

  // 8. Account, Password & Login
  {
    id: 'account_login',
    primaryKeywords: ['login', 'signin', 'sign in', 'signup', 'register', 'account', 'password', 'forgot', 'reset'],
    secondaryKeywords: ['email', 'auth', 'pass', 'logout', 'profile'],
    response: {
      title: '👤 Account & Authentication',
      text: `Account details and benefits:

- **Is an account required?**:
  - **No!** Sending and receiving files is completely free, anonymous, and requires no account.
- **Benefits of Creating an Account**:
  - Private Transfer History
  - Extended Key Validity (up to 24 hours)
  - Multi-device sync
- **Forgot Password?**:
  - Head to the **Forgot Password** page, enter your registered email address, and reset your password securely.`,
      action: { label: 'Sign In / Register', path: '/login' },
      tips: ['All user passwords are encrypted using PBKDF2 cryptography with Neon PostgreSQL.'],
    },
  },

  // 9. Developer & Project Details
  {
    id: 'creator_info',
    primaryKeywords: ['vaibhav', 'sonawane', 'who made', 'developer', 'creator', 'kisne banaya', 'owner', 'author'],
    secondaryKeywords: ['about', 'team', 'contact'],
    response: {
      title: '⚡ About ShareDrop & Developer',
      text: `ShareDrop is developed by **Vaibhav Sonawane**.

Engineered as a clean, high-speed, cross-network file sharing platform inspired by Send Anywhere. It enables instant cloud relay transfers across different networks and geographic locations (such as Pune to Sangamner) with 6-digit keys, QR codes, and automatic downloads.`,
      action: { label: 'Explore ShareDrop Home', path: '/' },
      tips: ['Built with modern React 19, Tailwind CSS, Express, and Neon PostgreSQL.'],
    },
  },
];

/**
 * Intelligent matcher that scores user query against knowledge rules.
 * Always replies with structured, professional English answers.
 */
export function getAssistantResponse(userQuery, context = {}) {
  const cleanQuery = (userQuery || '').toLowerCase().trim();

  if (!cleanQuery) {
    return {
      title: '👋 Welcome to ShareDrop AI Support',
      text: 'How can I assist you with your file transfer today? Ask any question regarding file downloads, 6-digit keys, QR scanning, or cross-network transfers.',
      action: null,
      tips: ['Tip: You can select any quick topic below or type your problem directly.'],
    };
  }

  // Greetings check
  const greetings = ['hi', 'hello', 'hey', 'namaste', 'salam', 'kasa ahes', 'kaise ho', 'help', 'good morning', 'good evening'];
  if (greetings.includes(cleanQuery) || cleanQuery.length < 3) {
    return {
      title: '👋 Hello! How can I assist you today?',
      text: `Welcome to ShareDrop Support!

Are you having an issue sending or receiving files? Tell me what happened, or tap any common topic below:
- 📥 File is not downloading automatically
- 🔑 6-Digit key is invalid or expired
- 🌍 Transferring between different cities or networks
- 📷 QR code camera permission issue`,
      action: { label: 'Send Files Now', path: '/send' },
      tips: ['Tap any prompt below or type your issue in the message box.'],
    };
  }

  // Score each rule based on keyword matches
  let bestMatch = null;
  let highestScore = 0;

  const queryWords = cleanQuery.split(/[\s,?.!]+/);

  const checkMatch = (kw) => {
    if (kw.includes(' ')) {
      return cleanQuery.includes(kw);
    }
    if (queryWords.includes(kw)) {
      return true;
    }
    if (kw.length >= 5 && cleanQuery.includes(kw)) {
      return true;
    }
    return false;
  };

  for (const rule of KNOWLEDGE_RULES) {
    let score = 0;
    if (rule.primaryKeywords) {
      for (const kw of rule.primaryKeywords) {
        if (checkMatch(kw)) {
          score += 5;
        }
      }
    }
    if (rule.secondaryKeywords) {
      for (const kw of rule.secondaryKeywords) {
        if (checkMatch(kw)) {
          score += 2;
        }
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = rule;
    }
  }

  // If match found with confidence
  if (bestMatch && highestScore >= 3) {
    return bestMatch.response;
  }

  // Fallback intelligent response in English
  return {
    title: '🤔 How can I best help you?',
    text: `You asked: "${userQuery}"

To help resolve your issue, please select what you are trying to do:
1. **Sending Files**:
   - Go to the **Send** page -> Select files -> Wait for 100% upload -> Share the 6-digit key.
2. **Receiving Files**:
   - Go to the **Receive** page -> Enter the 6-digit key -> **Automatic download will start**.
3. **Cross-Network Sharing**:
   - ShareDrop connects devices anywhere (e.g. Pune to Sangamner) across 4G, 5G, and Wi-Fi.

Choose one of the common topics below for instant step-by-step guidance:`,
    action: { label: 'Go to Receive Page', path: '/receive' },
    tips: ['Tip: If you saw an error message, typing the exact error words helps me give a precise solution.'],
  };
}
