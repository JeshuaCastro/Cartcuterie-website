# Production Troubleshooting Guide - DreamHost

This guide helps you diagnose and fix issues that may occur after deployment on DreamHost.

## 🔍 Quick Diagnostics

### Check if Application is Running

**Via SSH:**
```bash
ps aux | grep npm
# Should show: npm start or node

# Check port 3000
netstat -tlnp | grep 3000
# Should show: LISTEN 0.0.0.0:3000
```

**Via Browser:**
- Visit: `https://yourdomain.com`
- Open DevTools (F12) → Console tab
- Check for any error messages

### View Application Logs

**In DreamHost Control Panel:**
1. Go to Cloud Services → Node.js
2. Click your application
3. View Application Logs (last 100 lines)

**Via SSH:**
```bash
# If using PM2:
pm2 logs

# If using nohup:
tail -f app.log

# Check npm logs:
npm logs
```

---

## 🐛 Common Issues & Solutions

### ❌ Issue 1: "Cannot GET /"

**Problem:** Homepage returns 404 error

**Causes:**
- Build didn't complete
- `.next` folder is missing
- Wrong port configuration

**Solution:**
```bash
# Rebuild the application
npm run build

# Verify .next folder exists
ls -la .next/

# Check if running on correct port (3000 by default)
curl http://localhost:3000
```

---

### ❌ Issue 2: "OpenAI API key is not configured"

**Problem:** AI cart generation shows error

**Causes:**
- `OPENAI_API_KEY` not set in environment
- Wrong API key (starts with `sk-proj-`)
- API key expired or out of credits

**Solution:**
```bash
# Check .env file has the key
cat .env | grep OPENAI_API_KEY

# If not set, add it:
echo "OPENAI_API_KEY=your_key_here" >> .env

# Restart application:
npm stop
npm start
```

**Verify API Key:**
1. Go to https://platform.openai.com/api-keys
2. Check API key exists and is active
3. Verify account has credits (https://platform.openai.com/account/billing/overview)

---

### ❌ Issue 3: Images Not Loading (404 errors)

**Problem:** Gallery images show broken image icons

**Causes:**
- `/public/images` folder not deployed
- Images deleted or missing
- Incorrect file paths in code

**Solution:**
```bash
# Verify images exist
ls -la public/images/ | head -20

# Count images
ls public/images/ | wc -l
# Should be 15+ images

# Check for specific images:
ls public/images/mate-juice-cart.jpg
ls public/images/yellow-mobile-cart.jpg

# If missing, restore from Git:
git checkout public/images/
```

**In browser:**
- Right-click broken image → Inspect
- Check Network tab for actual URL
- Verify 404 error vs other issues

---

### ❌ Issue 4: Contact Form Doesn't Send Emails

**Problem:** Form shows success but no emails received

**Causes:**
- `BREVO_API_KEY` not set
- Email addresses not verified in Brevo
- Brevo account out of credits
- Firewall blocking API calls

**Solution:**
```bash
# 1. Verify BREVO_API_KEY is set
cat .env | grep BREVO_API_KEY

# 2. Check Brevo account
# Go to: https://app.brevo.com/dashboard

# 3. Verify sender email
# Settings → Senders & Signatures
# Ensure noreply@cartcuterie.com is verified

# 4. Check API calls work
curl -X POST https://api.brevo.com/v3/smtp/email \
  -H "api-key: your_key_here" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

**Common Brevo Errors:**
- "Invalid sender": Sender email not verified
- "Insufficient credits": Account has no remaining emails
- "Invalid API key": Wrong or expired key
- "Missing recipient": Recipient email is empty

---

### ❌ Issue 5: Application Crashes/Won't Start

**Problem:** DreamHost shows application error or won't stay running

**Causes:**
- Memory leak
- Uncaught exception
- Missing dependency
- Out of disk space

**Solution:**
```bash
# 1. Check available disk space
df -h

# 2. Check memory usage
free -h

# 3. Try starting manually to see error
npm start
# Watch for error messages

# 4. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 5. Rebuild
npm run build

# 6. Check Node.js version compatibility
node -v
npm -v
# Should be: Node 18+, npm 9+

# 7. Check for TypeScript errors
npm run build 2>&1 | head -50
```

---

### ❌ Issue 6: Slow Performance / High Memory Usage

**Problem:** Site loads slowly or crashes under light load

**Causes:**
- Memory leak in code
- Too many background processes
- Large images not optimized
- Database queries slow (N/A - no DB)

**Solution:**
```bash
# Monitor memory
watch -n 1 'ps aux | grep node'

# Check process details
top -p $(pgrep -f "npm start")

# Restart to clear memory
npm stop
npm start

# Check image sizes
du -h public/images/* | sort -h | tail -20

# Optimize images (if needed)
# Use ImageOptim or similar tool offline
```

---

### ❌ Issue 7: SSL/HTTPS Not Working

**Problem:** Site shows "Not Secure" or SSL error

**Causes:**
- SSL certificate not configured
- Wrong domain pointed
- DNS not propagated

**Solution:**
```bash
# Check SSL certificate
curl -v https://yourdomain.com 2>&1 | grep -i certificate

# In DreamHost:
1. Dashboard → Domains
2. Select your domain
3. Ensure SSL is enabled (should be automatic with Let's Encrypt)
4. Wait 5-10 minutes for DNS propagation

# Force renew certificate
certbot renew --force-renewal
```

---

### ❌ Issue 8: "Connection Refused" or "Can't reach server"

**Problem:** Browser shows "Could not connect to server"

**Causes:**
- Application not running
- Port blocked by firewall
- Wrong port in configuration
- DNS not resolved

**Solution:**
```bash
# 1. Check if app is running
ps aux | grep node
ps aux | grep npm

# 2. Check port is listening
netstat -tlnp | grep 3000

# 3. Try localhost
curl http://localhost:3000

# 4. Check firewall
# In DreamHost: Security → IP Whitelist
# Ensure your IP is allowed

# 5. Restart application
npm stop
npm start

# 6. Check DNS
nslookup yourdomain.com
# Should return DreamHost server IP
```

---

### ❌ Issue 9: Color Customization Not Working

**Problem:** Color picker doesn't save or apply colors

**Causes:**
- ColorPicker component not imported
- State management issue
- Browser cache

**Solution:**
```bash
# Clear browser cache
# In browser: Ctrl+Shift+Delete → Clear browsing data

# Check component exists
grep -r "ColorPicker" components/

# Check imports
grep -r "import.*ColorPicker" components/

# Restart dev server and rebuild
npm run build
npm start
```

---

### ❌ Issue 10: AI Generation Produces Bad Images

**Problem:** AI-generated cart images look wrong or corrupted

**Causes:**
- OpenAI API is generating but with issues
- Image processing (Sharp) failing
- Base image corrupted

**Solution:**
```bash
# Check base images exist
ls -la public/images/mate-juice-cart.jpg
ls -la public/images/yellow-mobile-cart.jpg

# Verify image integrity
file public/images/mate-juice-cart.jpg

# Check API response in browser console
# Open DevTools → Console
# Look for error messages from /api/generate-cart

# Test OpenAI connection
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

---

## 🔧 Advanced Troubleshooting

### Enable Verbose Logging

```bash
# Set debug environment variable
export DEBUG=*

# Or add to .env:
NODE_DEBUG=http,https
DEBUG=*

# Restart and watch logs
npm start
```

### Check Network Connectivity

```bash
# Test internet connection
ping -c 3 8.8.8.8

# Test API access
curl -I https://api.openai.com/
curl -I https://api.brevo.com/

# DNS resolution
nslookup api.openai.com
```

### Database/Storage Diagnostics (N/A)

This application doesn't use a database. All data is:
- Stored locally in `/public/images/`
- Sent via API calls (Brevo for email, OpenAI for AI)
- Processed in memory

### Performance Profiling

```bash
# Monitor CPU and memory
top -b -n 1 | head -20

# See what files are using most space
du -hs * | sort -rh | head -10

# Check node memory usage over time
node --max-old-space-size=4096 node_modules/.bin/next start
```

---

## 📊 Health Check Endpoint (Optional)

Create a simple health check endpoint in `app/api/health/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV,
  })
}
```

Then test with:
```bash
curl https://yourdomain.com/api/health
```

---

## 📞 Getting Help

### When Something Fails:

1. **Collect Information:**
   ```bash
   npm -v
   node -v
   npm start 2>&1 | tee error.log
   ```

2. **Check Logs:**
   - DreamHost panel → Application logs
   - Browser DevTools → Console tab
   - Browser Network tab → API calls

3. **Search Known Issues:**
   - Next.js: https://github.com/vercel/next.js/issues
   - Brevo: https://support.brevo.com/
   - OpenAI: https://platform.openai.com/docs/guides/error-codes

4. **Contact Support:**
   - DreamHost: support.dreamhost.com
   - Next.js: https://nextjs.org/docs
   - Brevo: https://support.brevo.com/
   - OpenAI: https://help.openai.com/

---

## ✅ Health Check Checklist

Run this when you suspect issues:

- [ ] Application is running: `ps aux | grep npm`
- [ ] Port 3000 is listening: `netstat -tlnp | grep 3000`
- [ ] Homepage loads: `curl http://localhost:3000`
- [ ] HTTPS works: `curl https://yourdomain.com`
- [ ] Images load: Check in browser
- [ ] Contact form works: Test submission
- [ ] AI generation works: Try uploading logo
- [ ] Emails send: Check inbox
- [ ] No console errors: F12 → Console
- [ ] Memory usage normal: `top` shows < 500MB

---

**Remember:** Most issues are related to:
1. Missing environment variables
2. Deployment/file issues
3. API key problems

Check `.env` file first! 🔍
