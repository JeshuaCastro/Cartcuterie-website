# DreamHost Pre-Deployment Checklist ✅

**This checklist ensures your Cartcuterie website will deploy and run flawlessly on DreamHost.**

---

## 🚀 Phase 1: Pre-Deployment Checks (Do These FIRST)

### ✅ 1. Build & Test Locally
- [ ] Run `npm install` (ensure all dependencies installed)
- [ ] Run `npm run build` (verify build completes without errors)
- [ ] Run `npm start` (test production build locally)
- [ ] Visit http://localhost:3000 and verify:
  - [ ] Homepage loads completely
  - [ ] All images display (gallery, hero, cart builder)
  - [ ] Contact form is visible and functional
  - [ ] Cart builder can be navigated
  - [ ] No console errors (F12 → Console tab)

### ✅ 2. Environment Variables
- [ ] `.env.local` has `OPENAI_API_KEY` (for AI generation)
- [ ] `.env.local` has `BREVO_API_KEY` (for email sending)
- [ ] Both keys are valid and have active credits
- [ ] `.env.local` is in `.gitignore` (never committed to GitHub)
- [ ] `.env.example` exists with template (does NOT have real keys)

### ✅ 3. Git Repository Status
- [ ] All code committed to GitHub
- [ ] No uncommitted changes: `git status` shows "nothing to commit"
- [ ] Latest commit pushed: `git push origin main`
- [ ] Check GitHub repo is up to date: https://github.com/JeshuaCastro/v0-cartcuterie-website-design

### ✅ 4. Critical Files Verification
- [ ] `package.json` has Node engine requirement: `"node": ">=18.0.0"`
- [ ] `next.config.mjs` exists and is properly configured
- [ ] `tsconfig.json` exists
- [ ] `/public/images/` folder has all images:
  - [ ] mate-juice-cart.jpg
  - [ ] yellow-mobile-cart.jpg
  - [ ] Green-mobile-cart.jpg
  - [ ] catering-3.jpg
  - [ ] Charcuterie.JPG
  - [ ] All other gallery images
- [ ] No large node_modules in public folder

### ✅ 5. API Endpoints Test
- [ ] Contact form test:
  - Fill out form at http://localhost:3000/#contact
  - Submit and verify success message
  - Check console for no errors
- [ ] AI Generation test:
  - Build a cart in cart-builder
  - Upload a logo
  - Click "Generate AI Visualization"
  - Verify AI response works

---

## 📋 Phase 2: DreamHost Setup

### ✅ 6. DreamHost Account & Application Setup

1. **Create Node.js Application**
   - [ ] Log into DreamHost panel (panel.dreamhost.com)
   - [ ] Go to **Cloud Services** → **Node.js**
   - [ ] Click **Create Application**
   - [ ] Set application name: `cartcuterie` or `cartcuterie-website`
   - [ ] Select Node.js version: **20.x** (or latest 18+)
   - [ ] Domain: Point to your domain or subdomain
   - [ ] Port: **3000** (default)
   - [ ] Note the server IP and SSH credentials

2. **Domains & SSL**
   - [ ] Ensure domain is pointing to DreamHost nameservers
   - [ ] SSL certificate auto-provisioned (DreamHost provides free Let's Encrypt)
   - [ ] Wait 5-10 minutes for DNS propagation

### ✅ 7. SSH Access & File Transfer

1. **SSH into DreamHost Server**
   ```bash
   ssh user@your-server-ip
   # Or use DreamHost's web terminal
   ```

2. **Clone Repository**
   ```bash
   cd /path/to/your/app
   git clone https://github.com/JeshuaCastro/v0-cartcuterie-website-design.git
   cd v0-cartcuterie-website-design
   ```

3. **Create `.env` File**
   ```bash
   # SSH into server and create:
   nano .env
   
   # Add these lines (get values from your notes):
   OPENAI_API_KEY=your_key_here
   BREVO_API_KEY=your_key_here
   NODE_ENV=production
   
   # Save: Ctrl+X, then Y, then Enter
   ```

### ✅ 8. Install Dependencies & Build

1. **Install Node Modules**
   ```bash
   npm install
   # Or: npm ci (uses exact versions from package-lock.json)
   ```

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Verify Build Output**
   - [ ] Build should complete without errors
   - [ ] `.next` folder created
   - [ ] No TypeScript errors shown

---

## ⚡ Phase 3: Start & Configure Application

### ✅ 9. Start Application

**Option A: DreamHost Control Panel** (Recommended)
- [ ] In DreamHost panel, set:
  - **Start Command**: `npm start`
  - **Node Version**: 18+ (18, 20, or latest)
  - **Port**: 3000
- [ ] Click "Restart" or "Start Application"
- [ ] Wait 30-60 seconds for startup

**Option B: Manual Command** (SSH)
```bash
npm start
# Or: nohup npm start > app.log 2>&1 &
```

### ✅ 10. Verify Application is Running

1. **Check Process**
   ```bash
   ps aux | grep node
   # Should show: next start
   ```

2. **Test Locally on Server**
   ```bash
   curl http://localhost:3000
   # Should return HTML content
   ```

3. **Test from Browser**
   - [ ] Visit: `https://yourdomain.com`
   - [ ] Homepage should load
   - [ ] Images should display
   - [ ] No "Connection Refused" errors

### ✅ 11. Monitor Application

**Set Up Auto-Restart** (if application crashes):
```bash
# Edit supervisord or use DreamHost's auto-restart feature
# Or use a process manager like PM2:
npm install -g pm2
pm2 start npm --name "cartcuterie" -- start
pm2 startup
pm2 save
```

---

## 🧪 Phase 4: Testing on Production

### ✅ 12. Full Site Test

Navigate through your site and test:

1. **Homepage & Navigation** ✓
   - [ ] Page loads quickly
   - [ ] All sections visible
   - [ ] Navigation links work
   - [ ] No console errors

2. **Gallery Section** ✓
   - [ ] All 15 images load
   - [ ] Images display correctly
   - [ ] No broken images (404 errors)

3. **Cart Builder** ✓
   - [ ] Step 1: Select cart type
   - [ ] Step 2: Select cart top (if classic)
   - [ ] Step 3: Select design style
   - [ ] Step 4: Customize colors with color picker
   - [ ] Step 5: Add catering services
   - [ ] Step 6: Upload logo
   - [ ] Step 7: Generate AI visualization (should create image)
   - [ ] Can navigate back and edit selections

4. **AI Generation** ✓
   - [ ] Upload a logo
   - [ ] Click "Generate AI Visualization"
   - [ ] Wait for processing (30-60 seconds)
   - [ ] AI-generated image displays with badge
   - [ ] No error messages

5. **Contact Form** ✓
   - [ ] Fill out form with test data
   - [ ] Submit form
   - [ ] Success message appears
   - [ ] Check email inbox for:
     - [ ] Business email to `cartcuteriela@gmail.com`
     - [ ] Confirmation email to test address
   - [ ] Both emails have correct formatting

6. **Error Scenarios** ✓
   - [ ] Try submitting contact form with invalid email
   - [ ] Verify error message displays
   - [ ] Try accessing non-existent page (should show 404)

### ✅ 13. Performance Check

- [ ] Page loads in < 3 seconds
- [ ] Images lazy-load properly
- [ ] No memory leaks (check DreamHost memory usage)
- [ ] Database queries are fast (N/A - no database)
- [ ] API responses are fast

### ✅ 14. Security Checks

- [ ] HTTPS enabled (green lock icon in browser)
- [ ] No API keys exposed in frontend code
- [ ] No sensitive data in localStorage
- [ ] CORS headers properly configured
- [ ] Content-Security-Policy headers set

---

## 🔧 Phase 5: Optimization & Cleanup

### ✅ 15. Optimize for Production

1. **Update Application Settings**
   ```bash
   # In .env file:
   NODE_ENV=production
   ```

2. **Enable Caching Headers**
   - Images cache for 30 days
   - Static assets cache for 1 year
   - (Next.js handles this automatically)

3. **Monitor Logs**
   ```bash
   # Check DreamHost application logs
   # Or use: tail -f app.log
   ```

### ✅ 16. Document Production Setup

- [ ] Save DreamHost login credentials securely
- [ ] Document server IP address
- [ ] Document SSH access method
- [ ] Document deployment procedure
- [ ] Document rollback procedure

---

## 🚨 Phase 6: Emergency Procedures

### If Something Goes Wrong:

**Application Won't Start**
```bash
# Check logs
npm start  # Run manually to see errors
tail -f app.log  # Check error logs

# Common fixes:
rm -rf node_modules package-lock.json
npm install
npm run build
npm start
```

**Images Not Loading**
- Check `/public/images/` folder exists with all images
- Verify Next.js image paths are correct
- Check browser network tab for 404 errors

**API Keys Not Working**
- Verify `.env` file has correct keys
- Check keys haven't expired
- Verify API services are accessible from DreamHost (may need firewall whitelist)

**Emails Not Sending**
- Verify `BREVO_API_KEY` in `.env`
- Check Brevo API key is valid
- Check sender email is verified in Brevo
- View Brevo logs for delivery failures

**Database/Storage Issues**
- This app doesn't use a database
- All images stored locally in `/public/images/`
- Contact form uses Brevo API (cloud-based)

---

## ✅ Final Deployment Checklist

Before declaring success:

- [ ] Homepage loads at `https://yourdomain.com`
- [ ] All images display without 404 errors
- [ ] Cart builder works (all 7 steps functional)
- [ ] AI generation creates images successfully
- [ ] Contact form submits and sends emails
- [ ] Both business and customer emails received
- [ ] HTTPS/SSL working (green lock icon)
- [ ] No console errors (check F12 developer tools)
- [ ] Mobile responsive (test on phone)
- [ ] Site loads in < 3 seconds
- [ ] Application auto-restarts if it crashes
- [ ] Regular backups configured in DreamHost

---

## 📞 Support & Resources

**If you encounter issues:**

1. Check DreamHost Control Panel → Application Logs
2. SSH into server and check npm errors:
   ```bash
   npm start  # See real-time errors
   ```
3. Check application is running:
   ```bash
   ps aux | grep npm
   ```
4. Review these resources:
   - DreamHost Node.js Docs: https://help.dreamhost.com/hc/en-us/articles/215319108
   - Next.js Deployment: https://nextjs.org/docs/deployment
   - Brevo API Issues: https://support.brevo.com/
   - OpenAI API Issues: https://platform.openai.com/docs/guides/error-codes

---

**You're all set! Your Cartcuterie website is ready for production! 🎉**
