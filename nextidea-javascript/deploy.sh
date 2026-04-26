#!/bin/bash
# ==============================================
# Next Idea Solution - cPanel Deployment Script
# ==============================================
# Run this script on your cPanel server via SSH
# or Terminal in cPanel

echo "🚀 Starting deployment..."

# Step 1: Install dependencies (production only)
echo "📦 Installing production dependencies..."
npm ci --omit=dev

# Step 2: Build the project
echo "🔨 Building Next.js (standalone mode)..."
NODE_OPTIONS="--max-old-space-size=512" npm run build

# Step 3: Prepare standalone directory
echo "📁 Preparing standalone output..."

# Copy public assets to standalone
if [ -d ".next/standalone" ]; then
  cp -r public .next/standalone/public 2>/dev/null || true
  cp -r .next/static .next/standalone/.next/static 2>/dev/null || true
  cp server.js .next/standalone/server.js 2>/dev/null || true
  cp ecosystem.config.js .next/standalone/ecosystem.config.js 2>/dev/null || true
  cp .env .next/standalone/.env 2>/dev/null || true
  cp .env.local .next/standalone/.env.local 2>/dev/null || true
  echo "✅ Standalone output ready at .next/standalone/"
else
  echo "❌ Build failed - .next/standalone not found"
  exit 1
fi

# Step 4: Create logs directory
mkdir -p logs

echo ""
echo "============================================"
echo "✅ Build complete!"
echo "============================================"
echo ""
echo "To start the server:"
echo "  Option 1 (Direct):  NODE_OPTIONS='--max-old-space-size=256' node .next/standalone/server.js"
echo "  Option 2 (PM2):     pm2 start ecosystem.config.js"
echo "  Option 3 (cPanel):  Use 'Setup Node.js App' in cPanel"
echo ""
echo "Server will run on port: ${PORT:-3000}"
echo ""
