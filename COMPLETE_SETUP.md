# 🚀 Complete Portfolio Setup Guide
## For: rites.chauhan11@gmail.com

### 📋 **Current Status:**
- ✅ Portfolio code ready with Google Drive integration
- ✅ Environment configuration set for `rites.chauhan11@gmail.com`
- ⚠️ Node.js needs to be installed
- ⚠️ Google Drive API credentials needed
- ⚠️ Dependencies need to be installed

---

## 🛠️ **Step 1: Install Node.js**

### Option A: Download Installer (Recommended)
1. **Go to**: [https://nodejs.org/](https://nodejs.org/)
2. **Download**: LTS version (Latest stable)
3. **Run installer** and follow the prompts
4. **Restart** your PowerShell/Command Prompt
5. **Verify installation**: 
   ```powershell
   node -v
   npm -v
   ```

### Option B: Using Chocolatey (if you have it)
```powershell
choco install nodejs
```

### Option C: Using Winget
```powershell
winget install OpenJS.NodeJS
```

---

## 🔑 **Step 2: Get Google Drive API Credentials**

### 2.1: Google Cloud Console Setup
1. **Go to**: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. **Sign in** with: `rites.chauhan11@gmail.com`
3. **Create new project**: "Ritesh Portfolio"

### 2.2: Enable APIs
1. **Navigate**: APIs & Services → Library
2. **Enable**: Google Drive API
3. **Enable**: Google Sheets API (optional, for analytics)

### 2.3: Create OAuth Credentials
1. **Go to**: APIs & Services → Credentials
2. **Create Credentials** → OAuth client ID
3. **Configure OAuth consent screen** if prompted:
   - User Type: External
   - App name: "Ritesh Portfolio"
   - User support email: `rites.chauhan11@gmail.com`
   - Developer contact: `rites.chauhan11@gmail.com`
4. **Application type**: Web application
5. **Authorized redirect URIs**: 
   ```
   http://localhost:3000/auth/google/callback
   https://riteshchauhan.pages.dev/auth/google/callback
   ```
6. **Download JSON** or copy Client ID and Client Secret

---

## 🔧 **Step 3: Configure Your Portfolio**

### 3.1: Update Environment Variables
Open `.env` file and update:
```env
# Replace with your actual Google credentials
GOOGLE_CLIENT_ID=your-client-id-from-google-console
GOOGLE_CLIENT_SECRET=your-client-secret-from-google-console

# Already configured for your account
GOOGLE_DRIVE_EMAIL=rites.chauhan11@gmail.com
GOOGLE_DRIVE_FOLDER_ID=1BmMRHyBgvfKGOYOH8mZGUJOb8Lk9Y8Kg
STORAGE_TYPE=google-drive
```

### 3.2: Install Dependencies
```powershell
npm install
```

### 3.3: Start the Server
```powershell
npm start
```

---

## 🌐 **Step 4: Complete Google Drive Authentication**

1. **Start your server**: `npm start`
2. **Open**: [http://localhost:3000](http://localhost:3000)
3. **Go to**: Admin panel → Settings → Google Drive
4. **Click**: "Connect Google Drive"
5. **Authorize** the application with `rites.chauhan11@gmail.com`
6. **Confirm**: Green status showing "Connected"

---

## 🗂️ **Your Google Drive Structure**
```
Google Drive (rites.chauhan11@gmail.com)
└── Ritesh Portfolio (ID: 1BmMRHyBgvfKGOYOH8mZGUJOb8Lk9Y8Kg)
    ├── photos/
    ├── videos/
    ├── documents/
    └── projects/
```

---

## 🚀 **Quick Start Commands**
```powershell
# After Node.js is installed:
cd c:\Users\rites\riteshchauhan
npm install
npm start

# Then open: http://localhost:3000
```

---

## 🆘 **Troubleshooting**

### Node.js Issues
- **Error**: "node is not recognized"
- **Solution**: Restart PowerShell after installation

### Google Drive Issues
- **Error**: "OAuth client not found"
- **Solution**: Double-check Client ID and Secret in `.env`

### Permission Issues
- **Error**: "Access denied"
- **Solution**: Make sure you're using `rites.chauhan11@gmail.com` account

---

## 🎯 **What You'll Get**
- ✅ Portfolio hosted locally and online
- ✅ Google Drive cloud storage for all assets
- ✅ Admin panel for content management
- ✅ Automatic backup to Google Drive
- ✅ Professional cloud storage solution

---

**Need Help?** All your files are ready and configured for `rites.chauhan11@gmail.com`!
