# Brevo Email Integration - Setup Checklist

## Quick Start Guide

Follow these steps to activate Brevo email sending on your site:

### 1. Get Your Brevo API Key ⚙️

- [ ] Go to https://app.brevo.com/
- [ ] Log in (or create an account if you don't have one)
- [ ] Navigate to **Settings** → **Keys & API**
- [ ] Copy your **API Key**
- [ ] Keep it safe (don't share it!)

### 2. Add API Key to Environment Variables 🔑

Edit your `.env.local` file and add:

```bash
OPENAI_API_KEY=sk-proj-... (already set)
BREVO_API_KEY=paste_your_api_key_here
```

Replace `paste_your_api_key_here` with your actual Brevo API key from Step 1.

**File location**: `/Users/jeshuacastro/v0-cartcuterie-website-design/.env.local`

### 3. Verify Your Sender Email in Brevo 📧

- [ ] Log in to https://app.brevo.com/
- [ ] Go to **Senders & Signatures** (under Settings)
- [ ] Click **Add a new sender**
- [ ] Add email: `noreply@cartcuterie.com` (or any email you own)
- [ ] Verify the email through the confirmation link
- [ ] Wait for verification (usually instant or within a few hours)

**Alternative**: If you prefer to use a different email address:
1. Verify it in Brevo
2. Update `/app/api/contact/route.ts` line ~47:
   ```typescript
   email: "your-email@example.com" // Change to your verified email
   ```

### 4. Test Your Setup 🧪

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3000 (wait for it to compile)

3. Scroll to the **"Let's Start Planning Your Cart"** section

4. Fill out the contact form with:
   - Name: Test Name
   - Email: your-email@example.com
   - Event Type: Any option
   - Message: Testing email integration

5. Click **Send Inquiry**

6. Check for two emails:
   - **Business email**: Check `cartcuteriela@gmail.com` inbox
   - **Confirmation email**: Check the email you entered in the form

### 5. Verify Email Delivery 📬

**If emails arrive**:
✅ You're all set! The integration is working correctly.

**If emails don't arrive**:
1. Check spam/junk folder
2. Verify the API key is correct in `.env.local`
3. Confirm sender email is verified in Brevo
4. Check browser console for error messages
5. Check server logs for error details

### 6. Production Deployment 🚀

#### For Vercel:
1. Go to https://vercel.com/dashboard
2. Select your project
3. **Settings** → **Environment Variables**
4. Add:
   - **Name**: `BREVO_API_KEY`
   - **Value**: Your Brevo API key from Step 1
5. Redeploy (just push to GitHub)

#### For DreamHost or other hosting:
1. SSH into your server
2. Edit `.env` file in project root
3. Add: `BREVO_API_KEY=your_key_here`
4. Restart Node.js application
5. Verify emails are sending

### 7. Monitor Email Performance 📊

- Log into https://app.brevo.com/dashboard
- Check **Emails** section for:
  - Number of emails sent
  - Delivery status
  - Opens and clicks
  - Bounces or failures

### Need Help?

**Common Issues**:

| Problem | Solution |
|---------|----------|
| "Email service not configured" | Add `BREVO_API_KEY` to `.env.local` and restart dev server |
| "Failed to send email" | Verify sender email is confirmed in Brevo |
| Emails go to spam | Check Brevo account settings and sender reputation |
| No confirmation email sent | Check Brevo API key permissions |

**Resources**:
- [Brevo Documentation](https://developers.brevo.com/)
- [Full Integration Guide](./BREVO_INTEGRATION.md)
- [Brevo Support](https://support.brevo.com/)

---

**Once you complete the setup, contact form emails will automatically:**
1. Send to `cartcuteriela@gmail.com` with all inquiry details
2. Send a professional confirmation to the customer
3. Include cart configuration details (if user customized a cart)
4. Format emails with professional HTML styling
5. Track delivery and engagement in Brevo dashboard
