const fs = require('fs');
const path = require('path');

// Ensure dist folder exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy index.html
const indexSrc = path.join(__dirname, 'index.html');
const indexDist = path.join(distDir, 'index.html');
if (fs.existsSync(indexSrc)) {
  fs.copyFileSync(indexSrc, indexDist);
  console.log('✓ Copied index.html to dist/');
}

// Create src folder in dist and copy all source files
const srcDir = path.join(__dirname, 'src');
const distSrcDir = path.join(distDir, 'src');

if (!fs.existsSync(distSrcDir)) {
  fs.mkdirSync(distSrcDir, { recursive: true });
}

// Copy all files from src to dist/src
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    
    if (fs.statSync(srcFile).isDirectory()) {
      copyDir(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

if (fs.existsSync(srcDir)) {
  copyDir(srcDir, distSrcDir);
  console.log('✓ Copied src/ to dist/src/');
}

console.log('✓ Frontend build complete!');