const fs = require('fs');
const path = require('path');

// Ensure dist folder exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy index.html to dist
const indexPath = path.join(__dirname, 'index.html');
const distIndexPath = path.join(distDir, 'index.html');

if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, distIndexPath);
  console.log('Built frontend to dist/');
} else {
  console.log('index.html not found');
}