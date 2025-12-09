# Cartcuterie Website - Deployment Guide

## Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager
- OpenAI API key (for AI cart generation feature)

## Environment Variables

Create a `.env.local` file (or configure in your hosting provider) with:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### Getting Your OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Create a new API key
4. Copy the key and add it to your environment variables

## DreamHost Deployment

### Option 1: Deploy as a Node.js Application

1. **Build the Application**
   ```bash
   npm install
   npm run build
   ```

2. **Set Environment Variables in DreamHost**
   - Log into DreamHost panel
   - Navigate to your application settings
   - Add environment variable:
     - `OPENAI_API_KEY` = your OpenAI API key

3. **Start the Application**
   ```bash
   npm start
   ```
   The app will run on port 3000 by default

4. **Configure Node.js App in DreamHost**
   - Set Node version: 18 or higher
   - Set start command: `npm start`
   - Set port: 3000 (or your preferred port)

### Option 2: Deploy as Static Export (Limited Features)

⚠️ **Note**: Static export will NOT support:
- AI cart generation (requires server-side API routes)
- Form submission backend
- Dynamic image optimization

If you need these features, use Option 1 (Node.js deployment).

## Vercel Deployment (Recommended Alternative)

Vercel is optimized for Next.js and offers easier deployment:

1. **Connect Repository**
   - Push code to GitHub
   - Import project in Vercel dashboard

2. **Set Environment Variables**
   - Add `OPENAI_API_KEY` in Vercel project settings

3. **Deploy**
   - Vercel auto-deploys on push to main branch

## Testing Production Build Locally

```bash
npm run build
npm start
```

Visit http://localhost:3000

## Required Files Checklist

✅ All source files committed
✅ `.env.local` NOT committed (use `.env.example` as template)
✅ `package.json` with all dependencies
✅ `next.config.mjs` with proper configuration
✅ `/public/images/` folder with all images

## Post-Deployment Verification

1. ✅ Homepage loads correctly
2. ✅ All images display properly
3. ✅ Cart builder navigation works
4. ✅ Contact form submits
5. ✅ AI cart generation works (test with logo upload)

## Troubleshooting

### AI Generation Not Working
- Verify `OPENAI_API_KEY` is set correctly
- Check API key has credits/billing enabled
- Check server logs for API errors

### Images Not Loading
- Ensure `/public/images/` folder is deployed
- Check Next.js image optimization is enabled
- Verify image paths use correct format

### Build Fails
- Run `npm install` to ensure dependencies are installed
- Check Node.js version (18+ required)
- Review build logs for specific errors

## Support

For deployment issues:
- DreamHost: Check their Node.js hosting documentation
- Next.js: https://nextjs.org/docs/deployment
- Vercel: https://vercel.com/docs
