# Brevo Email Integration Guide

This guide explains how to set up and use Brevo (formerly Sendinblue) for sending emails from your Cartcuterie website.

## Overview

The website now uses **Brevo** to handle all transactional emails:
- **Customer Inquiry Emails**: Sent to `cartcuteriela@gmail.com` when someone submits the contact form
- **Confirmation Emails**: Sent to customers confirming receipt of their inquiry

## Setup Instructions

### Step 1: Get Your Brevo API Key

1. Go to [https://app.brevo.com/](https://app.brevo.com/)
2. Sign up or log in to your account
3. Navigate to **Settings** → **Keys & API**
4. Copy your **API Key** (you'll see a "Copy to clipboard" icon)

### Step 2: Add API Key to Environment Variables

1. Open your `.env.local` file in the project root:
   ```bash
   # .env.local
   OPENAI_API_KEY=your_openai_key_here
   BREVO_API_KEY=your_brevo_api_key_here
   ```

2. Replace `your_brevo_api_key_here` with your actual API key from Step 1

3. **Important**: Never commit `.env.local` to GitHub (it's in `.gitignore`)

### Step 3: Verify Sender Email in Brevo

Before emails can be sent, you need to verify your sender email address in Brevo:

1. Log in to [Brevo](https://app.brevo.com/)
2. Go to **Senders & Signatures** (usually under Settings)
3. Add and verify the sender email: `noreply@cartcuterie.com`
4. Or use any email address you control and have verified with Brevo

**Note**: If you want to use a different sender email, update it in `/app/api/contact/route.ts`:
```typescript
sender: {
  name: "Cartcuterie Website",
  email: "noreply@cartcuterie.com", // Change this to your verified sender email
},
```

### Step 4: Update Reply-To Email (Optional)

The default reply-to email is the customer's email address. If you want to change this, update the contact form in `/components/contact-section.tsx`.

## How It Works

### Customer Submission Flow

1. **User fills out contact form** on the website
2. **Form data sent to** `/api/contact` endpoint
3. **Brevo sends two emails**:
   - **To Business**: Email sent to `cartcuteriela@gmail.com` with full inquiry details
   - **To Customer**: Confirmation email sent to customer's email address
4. **User sees success message** on the website

### Email Content

#### Business Owner Email
- **Subject**: `New Cart Inquiry from [Customer Name]`
- **Content**: Full inquiry details including:
  - Customer name, email, phone
  - Event type, date, and location
  - Custom message
  - Cart configuration (if selected)
  - Submission timestamp

#### Customer Confirmation Email
- **Subject**: `We Received Your Cart Inquiry - Cartcuterie`
- **Content**: Professional confirmation with:
  - Thank you message
  - Echo of their inquiry details
  - Assurance of response within 24 hours
  - Professional branding

## Configuration

### Changing the Business Email

Update the recipient email in `/app/api/contact/route.ts`:

```typescript
to: [
  {
    email: "your-new-email@example.com", // Change this
    name: "Cartcuterie Team",
  },
],
```

### Customizing Email Templates

Edit the HTML templates in `/app/api/contact/route.ts`:

**Business Email Template** (lines ~60-90):
```typescript
htmlContent: `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <!-- Customize this HTML -->
    </body>
  </html>
`,
```

**Customer Confirmation Template** (lines ~110-140):
```typescript
htmlContent: `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <!-- Customize this HTML -->
    </body>
  </html>
`,
```

## Testing

### Local Development

1. Ensure `.env.local` has your `BREVO_API_KEY`
2. Start the dev server: `npm run dev`
3. Fill out the contact form at `http://localhost:3000/#contact`
4. Submit the form
5. Check both your business email and the test email address for emails

### Troubleshooting

**"Email service not configured" error**:
- Verify `BREVO_API_KEY` is set in `.env.local`
- Restart the dev server after adding the environment variable

**"Failed to send email" error**:
- Check your API key is correct
- Verify the sender email is added and verified in Brevo
- Check Brevo account has enough email credits

**Emails not arriving**:
- Check spam/junk folders
- Verify email addresses in Brevo dashboard
- Check Brevo logs for bounces or delivery failures

## Production Deployment

### On Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `BREVO_API_KEY`
   - **Value**: Your Brevo API key
5. Redeploy your project: `git push` to main branch

### On DreamHost

1. SSH into your server
2. Edit `.env` file in your project directory
3. Add: `BREVO_API_KEY=your_key_here`
4. Restart Node.js application

## Brevo Account Features

### Email Limits
- **Free plan**: 300 emails/day
- **Starter**: 20,000 emails/month
- **Business**: Custom limits

Check your current usage at [Brevo Dashboard](https://app.brevo.com/dashboard)

### Monitoring & Analytics

View email delivery status and statistics:
1. Log in to Brevo
2. Go to **Transactional** → **Emails**
3. See delivery status, opens, clicks, and bounces

### Contact Support

- **Documentation**: https://developers.brevo.com/docs
- **Support**: https://support.brevo.com/
- **Status Page**: https://status.brevo.com/

## API Reference

### Endpoint

```
POST https://api.brevo.com/v3/smtp/email
```

### Headers

```
api-key: your_brevo_api_key
Content-Type: application/json
```

### Request Body

```json
{
  "sender": {
    "name": "Sender Name",
    "email": "sender@example.com"
  },
  "to": [
    {
      "email": "recipient@example.com",
      "name": "Recipient Name"
    }
  ],
  "subject": "Email Subject",
  "htmlContent": "<html><body>Email content</body></html>",
  "replyTo": {
    "email": "reply@example.com",
    "name": "Reply Name"
  }
}
```

## Security Best Practices

1. **Never commit API keys**: Use `.env.local` (in `.gitignore`)
2. **Rotate keys regularly**: Generate new keys in Brevo every 90 days
3. **Use environment variables**: Never hardcode sensitive data
4. **Monitor usage**: Check Brevo dashboard for unusual activity
5. **Verify emails**: Ensure all sender addresses are verified in Brevo

## Next Steps

1. ✅ Add `BREVO_API_KEY` to `.env.local`
2. ✅ Verify sender email in Brevo
3. ✅ Test contact form submission
4. ✅ Check email delivery
5. ✅ Deploy to production with environment variables set
6. ✅ Monitor email delivery and engagement

## Frequently Asked Questions

**Q: Can I send emails from multiple addresses?**
A: Yes, add and verify multiple sender emails in Brevo settings, then update the sender email in the API code.

**Q: What's the maximum email size?**
A: Brevo supports up to 100 MB email size with attachments (though typically limited by provider).

**Q: Can I schedule emails?**
A: The current implementation sends emails immediately. Scheduling requires additional API calls.

**Q: Do I need to handle unsubscribes?**
A: For transactional emails like order confirmations, unsubscribe is not required. For marketing emails, you'll need to manage unsubscribe lists.

**Q: What happens if an email fails to send?**
A: The form will show an error message. Check Brevo logs for details about the failure.

## References

- [Brevo Official Website](https://www.brevo.com/)
- [Brevo API Documentation](https://developers.brevo.com/)
- [Brevo Pricing](https://www.brevo.com/pricing/)
- [Email Best Practices](https://developers.brevo.com/docs/transactional-email)
