# 🚀 DreamHost Deployment - Quick Start

**Your site is production-ready! Follow these exact steps to deploy.**

---

## ⚡ 5-Minute Setup

### Step 1: DreamHost Account Setup
1. Log in to **panel.dreamhost.com**
2. **Cloud Services** → **Node.js**
3. Click **Create Application**
4. Fill in:
   - **Application Name**: `cartcuterie`
   - **Node.js Version**: `20.x` (or latest 18+)
   - **Domain**: Your domain name
   - **Port**: `3000`
5. Click **Create**
6. Wait for "Ready" status (5-10 minutes)

### Step 2: SSH & Clone Repository
```bash
# SSH into your DreamHost server
ssh dreamhost-username@your-server-ip

# Navigate to your app directory
cd /path/to/your/app

# Clone your repository
git clone https://github.com/JeshuaCastro/v0-cartcuterie-website-design.git
cd v0-cartcuterie-website-design
```

### Step 3: Set Environment Variables
```bash
# Create .env file
nano .env

# Add these three lines (paste your actual keys):
OPENAI_API_KEY=sk-proj-xxxxxxxxxx
BREVO_API_KEY=xkeysib-xxxxxxxxxxxx
NODE_ENV=production

# Save: Ctrl+X → Y → Enter
```

### Step 4: Install & Build
```bash
# Install dependencies
npm install

# Build application
npm run build

# Verify build succeeded
ls -la .next/
# Should see: .next folder with contents
```

### Step 5: Start Application

**Option A: DreamHost Panel** (Recommended)
- Go back to DreamHost panel
- Your app should be listed
- Click **Restart** or **Start**
- Wait 30-60 seconds

**Option B: SSH Command**
```bash
npm start
```

### Step 6: Verify It Works
1. Wait 2-3 minutes for DNS propagation
2. Visit: `https://yourdomain.com`
3. You should see the Cartcuterie homepage
4. Check:
   - [ ] Images load
   - [ ] Cart builder works
   - [ ] Contact form appears
   - [ ] HTTPS works (green lock icon)

---

## ✅ Deployment Checklist

Before deploying, ensure:

- [ ] Both API keys added to `.env`
- [ ] Build completes without errors: `npm run build`
- [ ] GitHub has latest code pushed
- [ ] `.env.local` NOT committed to GitHub
- [ ] All images are in `/public/images/`

---

## 🧪 After Deployment Tests

### Test 1: Homepage
```bash
curl https://yourdomain.com | head -20
# Should show HTML content
```

### Test 2: Images Load
- Visit https://yourdomain.com
- Open DevTools (F12) → Network tab
- Scroll down and check images load without 404 errors

### Test 3: Contact Form
1. Fill out the form
2. Submit
3. Check:
   - Success message appears
   - Check email inbox for confirmation
   - Check cartcuteriela@gmail.com for inquiry email

### Test 4: AI Generation
1. Select cart type in cart builder
2. Go through all steps
3. Upload a logo
4. Click "Generate AI Visualization"
5. Wait for image to generate (30-60 seconds)

---

## 🆘 If Something Goes Wrong

### Application Won't Start
```bash
# SSH into server
ssh dreamhost-username@your-server-ip

# Check what's wrong
cd /path/to/app
npm start

# If you see errors, run these:
rm -rf node_modules package-lock.json
npm install
npm run build
npm start
```

### Images Not Loading
```bash
# Verify images exist
ls -la public/images/ | wc -l
# Should show 15+ images

# If missing:
git clone https://github.com/JeshuaCastro/v0-cartcuterie-website-design.git
cd v0-cartcuterie-website-design
git pull origin main
```

### Emails Not Sending
1. Verify `BREVO_API_KEY` is in `.env` file:
   ```bash
   cat .env | grep BREVO_API_KEY
   ```
2. Go to https://app.brevo.com/dashboard
3. Check sender email is verified
4. Check account has email credits

### API Errors
1. Verify both API keys are correct:
   - OpenAI key starts with `sk-proj-`
   - Brevo key starts with `xkeysib-`
2. Check keys haven't expired
3. Verify account has credits

---

## 📞 Support Resources

If you get stuck:

1. **DreamHost Docs**: https://help.dreamhost.com/hc/en-us/articles/215319108
2. **Next.js Docs**: https://nextjs.org/docs/deployment
3. **Brevo Support**: https://support.brevo.com/
4. **OpenAI Help**: https://help.openai.com/

---

## 📋 Full Documentation

For detailed information, see:
- **DREAMHOST_DEPLOYMENT_CHECKLIST.md** - Comprehensive 6-phase guide
- **PRODUCTION_TROUBLESHOOTING.md** - Solutions for 10+ common issues
- **BREVO_SETUP_CHECKLIST.md** - Email configuration
- **DEPLOYMENT.md** - General deployment info

---

## ✨ What's Pre-Configured For You

✅ **Build Optimizations**
- Minified production build
- Image optimization enabled
- Static assets cached for 1 year
- Security headers configured
- No source maps in production

✅ **Environment**
- Node 18+ ready
- Both API services configured
- Error handling implemented
- Logging optimized for production

✅ **Testing**
- Build verified to work
- All features tested
- No API keys in build output
- Production-ready code

---

## 🎉 After Successful Deployment

Congratulations! Your site is live! Now:

1. **Monitor Performance**
   - Check DreamHost app logs regularly
   - Monitor API usage (OpenAI + Brevo)
   - Set up alerts for API costs

2. **Keep It Updated**
   - Pull updates from GitHub: `git pull origin main`
   - Rebuild: `npm run build`
   - Restart: `npm stop && npm start`

3. **Regular Backups**
   - DreamHost provides backups
   - Also backup `.env` file separately
   - Keep API keys safe

---

**Questions? See PRODUCTION_TROUBLESHOOTING.md or DREAMHOST_DEPLOYMENT_CHECKLIST.md**

**Your site is ready to go! 🚀**
