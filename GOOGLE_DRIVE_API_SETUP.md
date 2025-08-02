# 🚀 Google Drive API Key Setup & Bug Fixes

## 🔧 **Issues Found and Fixed:**

### 1. Git Line Ending Error
- **Error**: `LF will be replaced by CRLF`
- **Fix**: Configure Git to handle line endings properly

### 2. Online Status Connection Error
- **Issue**: Google Drive connection failing
- **Fix**: Implement proper API key authentication

### 3. Cloud Storage Integration Bugs
- **Issues**: Multiple connection and upload errors
- **Fix**: Enhanced error handling and fallback systems

---

## 📝 **Step 1: Fix Git Line Endings**

```bash
# Configure Git for Windows
git config --global core.autocrlf true
git config --global core.eol crlf

# Or add to .gitattributes file
echo "* text=auto" > .gitattributes
echo "*.env text eol=crlf" >> .gitattributes
```

---

## 🔑 **Step 2: Google Drive API Key Setup**

### Get Your API Key:
1. **Go to**: [Google Cloud Console](https://console.cloud.google.com/)
2. **Sign in**: rites.chauhan11@gmail.com
3. **Create Project**: "Ritesh Portfolio Cloud"
4. **Enable API**: Google Drive API
5. **Create Credentials**: API Key (not OAuth2)
6. **Restrict Key**: HTTP referrers (websites)

### Add Allowed URLs:
```
http://localhost:3000/*
https://localhost:3000/*
https://riteshchauhan.pages.dev/*
```

---

## ⚙️ **Step 3: Update Configuration**

### Update .env file:
```env
# Google Drive API Configuration
GOOGLE_DRIVE_EMAIL=rites.chauhan11@gmail.com
GOOGLE_DRIVE_API_KEY=your-actual-api-key-here
GOOGLE_DRIVE_FOLDER_ID=1BmMRHyBgvfKGOYOH8mZGUJOb8Lk9Y8Kg
STORAGE_TYPE=google-drive

# Remove OAuth (not needed for API key method)
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# GOOGLE_ACCESS_TOKEN=
# GOOGLE_REFRESH_TOKEN=
```

---

## 🛠️ **Step 4: Create Enhanced Cloud Storage**

Creating improved cloud storage with API key support...
