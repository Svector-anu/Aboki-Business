// convert-logo.js
// Converts logo to 1024x1024 PNG without alpha channel for Farcaster

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertLogoForFarcaster() {
  const inputPath = path.join(__dirname, 'public/assets/icons/logo.png');
  const outputPath = path.join(__dirname, 'public/assets/icons/logo-1024.png');
  
  try {
    // Convert to 1024x1024 PNG without alpha channel (white background)
    await sharp(inputPath)
      .resize(1024, 1024, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 } // White opaque background
      })
      .flatten({ background: { r: 255, g: 255, b: 255 } }) // Remove alpha channel
      .png()
      .toFile(outputPath);
    
    console.log('✅ Successfully created logo-1024.png');
    console.log(`📍 Output: ${outputPath}`);
    console.log('🔗 Use this URL in manifest: https://app.aboki.xyz/assets/icons/logo-1024.png');
    console.log('\n⚠️  Important: Update the manifest form to use logo-1024.png instead of logo.png');
    
  } catch (error) {
    console.error('❌ Error converting logo:', error.message);
  }
}

convertLogoForFarcaster();