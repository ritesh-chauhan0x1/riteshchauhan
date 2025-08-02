#!/usr/bin/env node

const { google } = require('googleapis');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

console.log('🔧 Google Drive Setup for rites.chauhan11@gmail.com');
console.log('================================================\n');

console.log('📋 Steps to set up Google Drive integration:\n');

console.log('1️⃣ Create Google Cloud Project:');
console.log('   • Go to: https://console.cloud.google.com/');
console.log('   • Create new project or select existing one');
console.log('   • Name: "Ritesh Portfolio Storage"\n');

console.log('2️⃣ Enable Google Drive API:');
console.log('   • In your project, go to "APIs & Services" > "Library"');
console.log('   • Search for "Google Drive API"');
console.log('   • Click "Enable"\n');

console.log('3️⃣ Create OAuth2 Credentials:');
console.log('   • Go to "APIs & Services" > "Credentials"');
console.log('   • Click "Create Credentials" > "OAuth 2.0 Client IDs"');
console.log('   • Application type: "Web application"');
console.log('   • Name: "Portfolio Backend"');
console.log('   • Authorized redirect URIs: http://localhost:3000/auth/google/callback');
console.log('   • Download the JSON file\n');

console.log('4️⃣ Create Portfolio Folder in Google Drive:');
console.log('   • Go to: https://drive.google.com/');
console.log('   • Create new folder: "Portfolio Assets"');
console.log('   • Note the folder ID from the URL\n');

console.log('5️⃣ Update your .env file with these values:\n');

const envTemplate = `
# Google Drive Configuration for rites.chauhan11@gmail.com
GOOGLE_DRIVE_EMAIL=rites.chauhan11@gmail.com
GOOGLE_CLIENT_ID=your-client-id-from-credentials.json
GOOGLE_CLIENT_SECRET=your-client-secret-from-credentials.json
GOOGLE_DRIVE_FOLDER_ID=your-portfolio-folder-id-from-drive-url
STORAGE_TYPE=google-drive

# Note: Access and refresh tokens will be generated after first authentication
# GOOGLE_ACCESS_TOKEN=will-be-generated
# GOOGLE_REFRESH_TOKEN=will-be-generated
`;

console.log(envTemplate);

console.log('6️⃣ Test the setup:');
console.log('   • Restart your server: npm start');
console.log('   • Visit: http://localhost:3000/auth/google');
console.log('   • Complete OAuth flow');
console.log('   • Copy the generated tokens to your .env file\n');

console.log('📁 Folder Structure in Google Drive:');
console.log('   Portfolio Assets/');
console.log('   ├── photos/          # Profile and gallery photos');
console.log('   ├── projects/        # Project screenshots');
console.log('   ├── memories/        # Video memories');
console.log('   └── documents/       # Resume and other docs\n');

console.log('🔒 Security Notes:');
console.log('   • Keep your .env file secure and never commit it to git');
console.log('   • Your Google account (rites.chauhan11@gmail.com) will have access');
console.log('   • Files uploaded will be stored in your personal Google Drive');
console.log('   • You can revoke access anytime in Google Account settings\n');

console.log('✨ Benefits of Google Drive integration:');
console.log('   • Unlimited storage (within your Google Drive quota)');
console.log('   • Automatic backup and sync');
console.log('   • Access files from anywhere');
console.log('   • Built-in version control');
console.log('   • Free hosting for images and documents\n');

// Interactive setup
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🚀 Ready to start setup? (y/n): ');

rl.question('', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        console.log('\n🌐 Opening Google Cloud Console...');
        
        const { exec } = require('child_process');
        const url = 'https://console.cloud.google.com/';
        
        // Open browser based on platform
        let cmd = '';
        if (process.platform === 'win32') {
            cmd = `start ${url}`;
        } else if (process.platform === 'darwin') {
            cmd = `open ${url}`;
        } else {
            cmd = `xdg-open ${url}`;
        }
        
        exec(cmd, (error) => {
            if (error) {
                console.log(`\n📋 Please manually open: ${url}`);
            }
        });
        
        console.log('\n📝 Follow the steps above to complete the setup!');
        console.log('💾 When ready, add the credentials to your .env file and restart the server.');
    } else {
        console.log('\n📖 Setup instructions are available above when you\'re ready!');
    }
    
    rl.close();
});

console.log('\n' + '='.repeat(60));
console.log('📞 Need help? Check the setup guide or restart this script!');
console.log('='.repeat(60) + '\n');
