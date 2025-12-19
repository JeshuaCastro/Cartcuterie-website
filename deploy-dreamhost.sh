#!/bin/bash

# DreamHost Deployment Script for Cartcuterie Website
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 Cartcuterie Website - DreamHost Deployment Script"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# ============================================
# Phase 1: Pre-Deployment Checks
# ============================================
echo "Phase 1: Pre-Deployment Checks"
echo "------------------------------"

# Check Node.js version
NODE_VERSION=$(node -v)
print_status "Node.js version: $NODE_VERSION"

if ! command -v npm &> /dev/null; then
    print_error "npm not found. Please install Node.js and npm."
    exit 1
fi

NPM_VERSION=$(npm -v)
print_status "npm version: $NPM_VERSION"

# Check environment file
if [ ! -f ".env.local" ]; then
    print_error ".env.local not found. Please create it with OPENAI_API_KEY and BREVO_API_KEY"
    exit 1
fi
print_status ".env.local file exists"

# Verify required environment variables
if ! grep -q "OPENAI_API_KEY=" .env.local; then
    print_error "OPENAI_API_KEY not found in .env.local"
    exit 1
fi
print_status "OPENAI_API_KEY is set"

if ! grep -q "BREVO_API_KEY=" .env.local; then
    print_warning "BREVO_API_KEY not found in .env.local (emails may not work)"
fi

# Check git status
if [ -d ".git" ]; then
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "Uncommitted changes detected"
        git status --short
    else
        print_status "Git repository is clean"
    fi
else
    print_warning "Not a git repository"
fi

# Check critical files
FILES=("package.json" "next.config.mjs" "tsconfig.json" "public/images")
for file in "${FILES[@]}"; do
    if [ -e "$file" ]; then
        print_status "$file exists"
    else
        print_error "$file is missing"
        exit 1
    fi
done

echo ""

# ============================================
# Phase 2: Install Dependencies
# ============================================
echo "Phase 2: Install Dependencies"
echo "-----------------------------"

print_status "Installing npm packages..."
npm install

print_status "Dependencies installed successfully"
echo ""

# ============================================
# Phase 3: Build Application
# ============================================
echo "Phase 3: Build Application"
echo "-------------------------"

print_status "Running Next.js build..."
npm run build

if [ -d ".next" ]; then
    print_status "Build completed successfully"
else
    print_error "Build failed - .next directory not created"
    exit 1
fi

echo ""

# ============================================
# Phase 4: Optimization
# ============================================
echo "Phase 4: Post-Build Optimization"
echo "--------------------------------"

# Remove node_modules cache
print_status "Cleaning up build cache..."
rm -rf node_modules/.cache 2>/dev/null || true

# Check public images
IMAGE_COUNT=$(find public/images -type f | wc -l)
print_status "Found $IMAGE_COUNT images in public/images"

echo ""

# ============================================
# Phase 5: Production Verification
# ============================================
echo "Phase 5: Production Verification"
echo "-------------------------------"

# Check file sizes
print_status "Build size analysis:"
du -sh .next/

# Verify no sensitive data in build
if grep -r "sk-proj" .next/standalone 2>/dev/null || grep -r "xkeysib" .next/standalone 2>/dev/null; then
    print_error "⚠️ WARNING: API keys found in build output! This is a security risk."
    exit 1
fi
print_status "No API keys detected in build output (secure)"

echo ""

# ============================================
# Phase 6: Summary & Next Steps
# ============================================
echo "✅ Pre-Deployment Verification Complete!"
echo "========================================"
echo ""
echo "📋 Next Steps for DreamHost:"
echo "1. SSH into your DreamHost server"
echo "2. Clone/pull the repository"
echo "3. Run: npm install"
echo "4. Run: npm run build"
echo "5. Set environment variables in DreamHost panel or .env file"
echo "6. Run: npm start (or configure in DreamHost control panel)"
echo "7. Test: https://yourdomain.com"
echo ""
echo "📝 Commands Summary:"
echo "   Build locally:  npm run build"
echo "   Test build:     npm start"
echo "   Development:    npm run dev"
echo ""
echo "🔗 Documentation:"
echo "   DreamHost Guide:  cat DREAMHOST_DEPLOYMENT_CHECKLIST.md"
echo "   Brevo Setup:      cat BREVO_SETUP_CHECKLIST.md"
echo "   Deployment:       cat DEPLOYMENT.md"
echo ""

print_status "Ready for DreamHost deployment! 🚀"
