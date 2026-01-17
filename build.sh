#!/bin/bash
echo "🚀 Custom Vercel Build Script Started"

# Force install correct versions
echo "📦 Installing correct dependency versions..."
npm install ajv@8.12.0 ajv-keywords@5.1.0 schema-utils@4.0.1 --no-save --legacy-peer-deps

# Fix the module path issue
echo "🔧 Fixing module paths..."
find node_modules/ajv-keywords -name "*.js" -type f -exec sed -i "s|require('ajv/dist/compile/codegen')|require('ajv/lib/compile/codegen')|g" {} \;

# Run the build
echo "🏗️ Building application..."
CI=false GENERATE_SOURCEMAP=false SKIP_PREFLIGHT_CHECK=true DISABLE_ESLINT_PLUGIN=true react-scripts build

echo "✅ Build completed!"