const { spawn } = require('child_process');
const path = require('path');

const projectRoot = process.argv[2] || '.';

// Run BMAD initialization
console.log('🚀 Initializing BMAD for Tribunal project...');
