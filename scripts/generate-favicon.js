const { convertToFile } = require('@vercel/og');
const path = require('path');
const fs = require('fs');

const svgContent = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="6" fill="#1e3a5f"/>
  <path d="M16 6L8 10.5L16 15L24 10.5L16 6Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M8 21.5L16 26L24 21.5" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M8 16L16 20.5L24 16" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
</svg>
`;

const outputPath = path.join(process.argv[2] || '.', 'public', 'favicon.svg');

fs.writeFileSync(outputPath, svgContent);
console.log('✓ Favicon created at', outputPath);
