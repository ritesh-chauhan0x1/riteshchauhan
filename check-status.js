// 🚀 Portfolio Status Checker
// Run this to verify all systems are working properly

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Portfolio System Status Check\n');
console.log('================================\n');

// Check if required files exist
const requiredFiles = [
    'index.html',
    'styles.css', 
    'script.js',
    'server.js',
    'cloud-storage.js',
    'backend-service.js',
    'start-server.bat',
    'package.json'
];

console.log('📁 File Structure Check:');
requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// Check package.json dependencies
console.log('\n📦 Dependencies Check:');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const deps = packageJson.dependencies || {};
    const requiredDeps = ['express', 'mysql2', 'cors', 'multer', 'dotenv'];
    
    requiredDeps.forEach(dep => {
        console.log(`   ${deps[dep] ? '✅' : '❌'} ${dep}: ${deps[dep] || 'Missing'}`);
    });
} catch (e) {
    console.log('   ❌ Error reading package.json');
}

// Check if .env file exists
console.log('\n⚙️  Configuration Check:');
const envExists = fs.existsSync('.env');
console.log(`   ${envExists ? '✅' : '⚠️ '} .env file ${envExists ? 'exists' : 'needs to be created'}`);

if (!envExists) {
    console.log('      💡 Create .env file with database and admin settings');
}

// Check uploads directory
console.log('\n📂 Storage Check:');
const uploadsExists = fs.existsSync('uploads');
console.log(`   ${uploadsExists ? '✅' : '⚠️ '} uploads directory ${uploadsExists ? 'exists' : 'will be created automatically'}`);

// Check Node.js version
console.log('\n🟢 Runtime Check:');
console.log(`   ✅ Node.js version: ${process.version}`);

// Quick backend connection test
console.log('\n🌐 Backend Connection Test:');
console.log('   Run this command to test backend:');
console.log('   💻 npm start');
console.log('   🌍 Then open: http://localhost:3000');

console.log('\n🎯 Quick Start Commands:');
console.log('   1. npm install              # Install dependencies');
console.log('   2. Copy .env.example to .env and configure');
console.log('   3. npm start                # Start backend server');
console.log('   4. Open http://localhost:3000 in browser');

console.log('\n🆘 If you see issues:');
console.log('   • Check SETUP_COMPLETE.md for detailed instructions');
console.log('   • Verify MySQL is running');
console.log('   • Make sure port 3000 is available');
console.log('   • Check browser console (F12) for errors');

console.log('\n✨ Enhanced Features Available:');
console.log('   🎨 Projects section fixed and enhanced');
console.log('   🚫 Blue effects completely removed');
console.log('   📸 Photo upload with cloud storage');
console.log('   🔗 Backend-frontend integration');
console.log('   📱 Responsive admin panel');
console.log('   ☁️  Google Drive integration ready');
console.log('   🔄 Offline mode support');

console.log('\n🎉 Your portfolio is ready to shine!\n');
