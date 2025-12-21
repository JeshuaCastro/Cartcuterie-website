# Cartcuterie Website

Luxury mobile catering carts for unforgettable events across Los Angeles.

## About

Cartcuterie specializes in custom mobile catering carts featuring charcuterie, desserts, beverages, and more. Our interactive cart builder allows clients to design their perfect cart with AI-powered visualization.

## Features

- Interactive cart customization builder
- AI-powered cart visualization using OpenAI DALL-E
- Real-time color and design preview
- Logo upload and overlay
- Mobile-responsive design
- Contact form integration

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- OpenAI API (Image Editing)
- Sharp (Image Processing)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Create a `.env.local` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

- `OPENAI_API_KEY` - Required for AI cart generation
- `GMAIL_USER` - Gmail email address for sending contact form emails
- `GMAIL_APP_PASSWORD` - 16-character Gmail App Password for SMTP authentication

### Setting up Gmail App Password

1. Enable 2-Factor Authentication on your Google Account:
   - Go to [myaccount.google.com](https://myaccount.google.com)
   - Select "Security" from the left menu
   - Enable 2-Step Verification if not already enabled

2. Generate App Password:
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select "Mail" as the app and "Windows Computer" (or your device type)
   - Google will generate a 16-character password
   - Copy this password and add it to `.env.local` as `GMAIL_APP_PASSWORD`

3. Add to `.env.local`:
   ```
   OPENAI_API_KEY=your_api_key_here
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your_16_char_app_password
   ```

## License

© 2025 Cartcuterie. All rights reserved.
