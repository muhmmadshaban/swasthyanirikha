const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔧 Fixing dependency conflicts for Vercel...');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Create a backup of original package.json
fs.writeFileSync('package.json.backup', JSON.stringify(packageJson, null, 2));

// Modify package.json to force correct versions
packageJson.dependencies = {
  ...packageJson.dependencies,
  'ajv': '8.12.0',
  'ajv-keywords': '5.1.0',
  'schema-utils': '4.0.1'
};

// Add resolutions at the top level (npm 8+)
packageJson.overrides = {
  "ajv": "8.12.0",
  "ajv-keywords": "5.1.0",
  "schema-utils": {
    "ajv": "8.12.0",
    "ajv-keywords": "5.1.0"
  }
};

// Add engines to force Node 18
packageJson.engines = {
  "node": "18.x",
  "npm": ">=8.0.0"
};

// Write modified package.json
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

console.log('✅ Modified package.json');
console.log('📦 Installing fixed dependencies...');

try {
  // Force install specific versions
  execSync('npm install ajv@8.12.0 ajv-keywords@5.1.0 --no-save --legacy-peer-deps', { stdio: 'inherit' });
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  console.log('✅ Dependencies fixed successfully');
} catch (error) {
  console.error('❌ Failed to fix dependencies, restoring original package.json');
  fs.writeFileSync('package.json', fs.readFileSync('package.json.backup', 'utf8'));
  process.exit(1);
}