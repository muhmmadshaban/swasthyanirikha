const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting Vercel build process...');

try {
  // Step 1: Fix dependencies
  require('./fix-deps.js');
  
  // Step 2: Build the project
  console.log('🏗️  Building project...');
  execSync('CI=false GENERATE_SOURCEMAP=false SKIP_PREFLIGHT_CHECK=true DISABLE_ESLINT_PLUGIN=true react-scripts build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: '--max-old-space-size=4096'
    }
  });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}