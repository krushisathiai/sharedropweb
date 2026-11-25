/**
 * ShareDrop Intelligent Troubleshooting & Support Knowledge Base
 * Supports queries in Hinglish, Hindi, and English.
 */

export const QUICK_PROMPTS = [
  {
    id: 'download_issue',
    label: '📥 File Download nahi ho raha?',
    query: 'download nahi ho raha',
  },
  {
    id: 'key_expired',
    label: '🔑 Key expired / Invalid key error?',
    query: 'key expired invalid key',
  },
  {
    id: 'cross_network',
    label: '🌍 Pune to Sangamner transfer kaise karein?',
    query: 'pune sangamner different network kaise bheje',
  },
  {
    id: 'qr_camera',
    label: '📷 Camera / QR Scan kaam nahi kar raha?',
    query: 'camera open nahi ho raha qr code scan',
  },
  {
    id: 'history_blank',
    label: '🔒 History kyu nahi dikh rahi?',
    query: 'history blank hai data nahi dikh raha',
  },
  {
    id: 'server_wake',
    label: '⏳ Server slow ya connecting aa raha hai?',
    query: 'server connecting render slow',
  },
];

export const KNOWLEDGE_RULES = [
  // 1. Camera / QR Code Scanner Issues (Put specific devices first)
  {
    id: 'camera_qr',
    primaryKeywords: ['camera', 'scan', 'scanner', 'qr', 'qrcode', 'permission', 'black screen'],
    secondaryKeywords: ['open', 'kam', 'allow', 'chalu', 'photo', 'video', 'lens'],
    response: {
      title: '📷 Camera & QR Code Troubleshooting',
      text: `Agar QR code scanner me camera open nahi ho raha:

1. **Camera Permission Allow Karein**:
   - Browser me URL ke paas Lock 🔒 icon par tap karein -> **Permissions** -> **Camera: Allow**.
2. **Back / Front Camera Switch**:
   - Scanner modal me upar right side par **Camera Switch 🔄** button hai, usse Back Camera par switch karein.
3. **Alternative Option (No Camera Needed)**:
   - Agar camera kaam nahi kar raha, toh simple **6-Digit Key** type karein ya **"Upload QR Image"** option use karein.`,
      action: { label: 'Open Receive & Scan', path: '/receive' },
      tips: ['HTTPS connection me hi camera permission enable hoti hai (Vercel deployment par HTTPS automatic rehta hai).'],
    },
  },

  // 2. 6-Digit Key Expired / Invalid Key
  {
    id: 'key_issues',
    primaryKeywords: ['key', 'digit', 'expire', 'expired', 'invalid', 'wrong key', 'galat', 'code', 'pin'],
    secondaryKeywords: ['not found', 'error', 'wrong', 'bata raha', 'khatam'],
    response: {
      title: '🔑 6-Digit Key Invalid / Expired Solution',
      text: `Agar "Invalid Key" ya "Transfer Expired" dikh raha hai:

1. **10 Minute Expiry**: Security aur storage safety ke liye guest users ki 6-digit key **10 minutes** tak valid rehti hai. Agar 10 min ho gaye hain, toh sender ko dobara send karna padega.
2. **Digit Re-check**: Key me sirf numbers (0-9) hote hain. Verify karein ki koi digit miss nahi hua hai.
3. **Sender Upload Check**: Confirm karein ki sender ka upload 100% finish ho chuka tha aur usne browser tab close nahi kiya tha jab tak key generate nahi hui.`,
      action: { label: 'Enter 6-Digit Key', path: '/receive' },
      tips: ['Free account create karke login karein — logged-in users ko 24 hours tak ki validity milti hai!'],
    },
  },

  // 3. Cross-Network Sharing (Pune to Sangamner)
  {
    id: 'cross_network',
    primaryKeywords: ['pune', 'sangamner', 'different network', 'alag alag', 'dur', 'distance', 'city', 'location', 'shehar'],
    secondaryKeywords: ['network', 'mobile data', '4g', '5g', 'wifi', 'hotspot', 'bheje'],
    response: {
      title: '🌍 Cross-Network & Long-Distance Transfer',
      text: `**Haan bilkul! ShareDrop kisi bhi network aur kisi bhi city me kaam karta hai!**

- **Kaise Kaam Karta Hai**: Sender chahe Pune me ho (Airtel/Jio) aur Receiver Sangamner me ho (Wi-Fi/Mobile Data), transfer 100% kaam karega!
- **Steps**:
  1. Sender **Send** page par file upload karega.
  2. Upload complete hote hi ek **6-Digit Key** aur **QR Code** generate hoga.
  3. Sender WhatsApp ya Call par receiver ko 6-digit key batayega (ya QR code share karega).
  4. Receiver apne mobile me **Receive** page par 6 digits dalega -> **Automatic Download shuru ho jayega!**`,
      action: { label: 'Start Sending Files', path: '/send' },
      tips: ['Dono users ko same Wi-Fi par hone ki bilkul zaroorat nahi hai. Ye Central Cloud Relay se chalta hai!'],
    },
  },

  // 4. Download Not Working / Auto Download Issue
  {
    id: 'download_issue',
    primaryKeywords: ['download', 'donaold', 'downlod', 'receive', 'automatic', 'auto download', 'install'],
    secondaryKeywords: ['nahi ho raha', 'not downloading', 'fail', 'failed', 'stuck', 'ruka hai', 'error'],
    response: {
      title: '📥 File Automatic Download Solution',
      text: `Agar file download nahi ho rahi hai, toh ye 3 steps check karein:

1. **6 Digits Enter Karein**: 6-digit key daalte hi download **automatically start** ho jata hai.
2. **Browser Popup / Permission Check**:
   - Chrome/Safari me agar popup block hai, toh URL bar me lock 🔒 ya popup icon par click karke **"Always allow downloads"** karein.
   - Agar automatic download start nahi hua, toh screen par aane wale **"Download Now"** button par click karein.
3. **Key Check**: Sender ne transfer complete kiya hai ya nahi ye confirm karein. File upload 100% hone ke baad hi receiver download kar sakta hai.`,
      action: { label: 'Go to Receive Page', path: '/receive' },
      tips: ['Tip: Mobile browser me desktop mode off rakhein taaki file seedha Downloads folder me jaye.'],
    },
  },

  // 5. Transfer History Issues
  {
    id: 'history_issue',
    primaryKeywords: ['history', 'purana', 'record', 'blank', 'khali', 'show nahi', 'dekh nahi', 'data leak', 'kisi ka bhi'],
    secondaryKeywords: ['purani', 'pehle', 'kaha gaya', 'privacy'],
    response: {
      title: '🔒 Private Transfer History',
      text: `**Privacy Update**: ShareDrop me transfer history sirf logged-in user ko dikhti hai aur 100% private rehti hai!

- **Agar history blank dikh rahi hai**:
  1. Pehle **Sign In / Log In** karein.
  2. Login hone ke baad jo bhi files aap send ya receive karenge, wo aapke private account me save hongi.
  3. Kisi doosre user ka data aapko nahi dikhega, aur aapka data kisi aur ko nahi dikhega.
- **Anonymous Transfers**: Agar aap bina login kiye file send/receive karte hain, toh privacy ke liye browser me koi record save nahi hota.`,
      action: { label: 'Sign In to Your Account', path: '/login' },
      tips: ['Sign up bilkul free hai! Ek baar account bana lein taaki aapka transfer history save rahe.'],
    },
  },

  // 6. Server Connecting / Render Cold Start
  {
    id: 'server_health',
    primaryKeywords: ['server', 'render', 'connecting', 'slow', 'offline', 'load', 'loading', 'chalu nahi', 'api'],
    secondaryKeywords: ['speed', 'band', 'down', 'lag'],
    response: {
      title: '⏳ Server Connection & Cold-Start Info',
      text: `ShareDrop ka cloud backend **Render Cloud** par hosted hai:

- **Free Tier Wake-up**: Agar kisine 15 minutes tak server use nahi kiya ho, toh Render backend sleep mode me chala jata hai.
- **Solution**: Pehli request par server ko wake up hone me lagbhag **30 se 45 seconds** lag sakte hain.
- Ek baar green **"Connected"** ya **"Any Network"** status aa jaye, toh uske baad sabhi transfers high speed se honge!`,
      action: { label: 'Check Server Status', path: '/' },
      tips: ['Agar error aaye toh page refresh karein aur 20-30 seconds baad dobara try karein.'],
    },
  },

  // 7. File Size Limits & File Types
  {
    id: 'file_limits',
    primaryKeywords: ['size', 'limit', 'badi file', 'mb', 'gb', 'maximum', 'kitna bhej'],
    secondaryKeywords: ['video', 'photo', 'pdf', 'zip', 'file', 'type'],
    response: {
      title: '📁 Supported Files & Size Limits',
      text: `**Sabhi types ki files supported hain:**
- **Formats**: Photos (JPG, PNG), Videos (MP4, MKV), Documents (PDF, Word, Excel), ZIP, APK, etc.
- **Recommended Size**:
  - Single transfer ke liye **up to 100MB - 500MB** fast aur reliable speed deta hai.
  - Multiple files ek saath select karke send kar sakte hain.`,
      action: { label: 'Select Files to Send', path: '/send' },
      tips: ['Badi files ke liye fast Wi-Fi ya 5G connection use karein taaki upload jaldi complete ho.'],
    },
  },

  // 8. Account, Password & Login
  {
    id: 'account_login',
    primaryKeywords: ['login', 'signin', 'sign in', 'signup', 'register', 'account', 'password', 'forgot', 'reset'],
    secondaryKeywords: ['email', 'auth', 'pass', 'logout'],
    response: {
      title: '👤 Account & Password Help',
      text: `Account related help:

- **Kya Login karna compulsory hai?**: Nahi! File send aur receive bina kisi login ke bilkul FREE aur instant kaam karta hai.
- **Account ke Fayde**:
  - Private Transfer History
  - 24 Hours tak ki extended key validity
  - Multi-device sync
- **Password Reset**: Agar password bhool gaye hain, toh **Forgot Password** page par jaakar apna email daalein aur password reset karein.`,
      action: { label: 'Go to Sign In', path: '/login' },
      tips: ['Neon PostgreSQL secure database me aapka account encrypted format me safe rehta hai.'],
    },
  },

  // 9. Who developed / credits
  {
    id: 'creator_info',
    primaryKeywords: ['vaibhav', 'sonawane', 'who made', 'developer', 'creator', 'kisne banaya', 'owner'],
    secondaryKeywords: ['about', 'team'],
    response: {
      title: '⚡ About ShareDrop & Developer',
      text: `ShareDrop is developed by **Vaibhav Sonawane**.

Designed as a modern, high-speed, cross-network file sharing alternative inspired by Send Anywhere. It allows direct cloud relay transfers across different networks and locations (like Pune to Sangamner) with automatic downloads and 6-digit keys.`,
      action: { label: 'Explore Home', path: '/' },
      tips: ['Developed with React 19, Tailwind CSS, Express, and Neon PostgreSQL.'],
    },
  },
];

/**
 * Intelligent matcher that scores user query against knowledge rules.
 */
export function getAssistantResponse(userQuery, context = {}) {
  const cleanQuery = (userQuery || '').toLowerCase().trim();

  if (!cleanQuery) {
    return {
      title: '👋 Namaste! Main ShareDrop AI Assistant hoon.',
      text: 'Aapko file transfer, download, 6-digit key, ya scanner me koi bhi dikkat aa rahi ho toh mujhe batayein. Main aapki poori help karunga!\n\nAap neeche diye gaye quick topics me se bhi select kar sakte hain.',
      action: null,
      tips: ['Tip: Aap Hindi, Hinglish, ya English me koi bhi sawaal pooch sakte hain.'],
    };
  }

  // Greetings check
  const greetings = ['hi', 'hello', 'hey', 'namaste', 'salam', 'kasa ahes', 'kaise ho', 'help', 'madad'];
  if (greetings.includes(cleanQuery) || cleanQuery.length < 3) {
    return {
      title: '👋 Hello! Kaise help kar sakta hoon aapki?',
      text: `ShareDrop assistant me aapka swagat hai! 

Aapko file bhejne me, receive karne me, ya 6-digit code me koi issue aa raha hai? Mujhe batayein, ya neeche quick options par tap karein:
- 📥 File download nahi ho rahi
- 🔑 Key expire ya invalid bata raha hai
- 🌍 Pune se Sangamner kaise bhejein
- 📷 QR camera permission issue`,
      action: { label: 'Send Files Now', path: '/send' },
      tips: ['Type your problem or tap any quick button below.'],
    };
  }

  // Score each rule based on keyword matches
  let bestMatch = null;
  let highestScore = 0;

  for (const rule of KNOWLEDGE_RULES) {
    let score = 0;
    if (rule.primaryKeywords) {
      for (const kw of rule.primaryKeywords) {
        if (cleanQuery.includes(kw)) {
          score += 5;
        }
      }
    }
    if (rule.secondaryKeywords) {
      for (const kw of rule.secondaryKeywords) {
        if (cleanQuery.includes(kw)) {
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

  // Fallback intelligent response
  return {
    title: '🤔 Main aapka issue samajhne ki koshish kar raha hoon',
    text: `Aapne poocha: "${userQuery}"

Agar aapko transfer me problem aa rahi hai, toh kripya batayein:
1. **Kya aap File Bhej rahe hain (Send)?**
   - File select karein -> Upload complete hone par 6-digit key banegi.
2. **Kya aap File Receive kar rahe hain?**
   - 6-digit key daalein -> File **automatically download** ho jayegi.
3. **Kya Sender & Receiver alag network / city me hain?**
   - ShareDrop Pune se Sangamner ya kisi bhi doosre shehar me perfectly kaam karta hai.

Aap neeche quick button se apna issue choose kar sakte hain:`,
    action: { label: 'Go to Receive', path: '/receive' },
    tips: ['Agar koi specific error code ya message aa raha hai, toh wahi exact message type karein.'],
  };
}
