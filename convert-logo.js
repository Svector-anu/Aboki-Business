// convert-logo.js
// Converts SVG logo to PNG for Farcaster manifest

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertSvgToPng() {
  const inputPath = path.join(__dirname, 'public/assets/icons/logo.svg');
  const outputPath = path.join(__dirname, 'public/assets/icons/logo.png');
  
  try {
    // Read SVG file
    const svgBuffer = fs.readFileSync(inputPath);
    
    // Convert to PNG at 512x512 (Farcaster recommended size)
    await sharp(svgBuffer)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent background
      })
      .png()
      .toFile(outputPath);
    
    console.log('✅ Successfully converted logo.svg to logo.png');
    console.log(`📍 Output: ${outputPath}`);
    console.log('🔗 Use this URL in manifest: https://app.aboki.xyz/assets/icons/logo.png');
    
  } catch (error) {
    console.error('❌ Error converting SVG to PNG:', error.message);
    console.log('\n💡 Make sure sharp is installed: npm install sharp');
  }
}

convertSvgToPng();