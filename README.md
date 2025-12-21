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
- `RESEND_API_KEY` - Required for sending contact form emails via Resend

### Setting up Resend for Email

1. Create a Resend account at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add your domain to Resend and configure DNS records (for verified sender domain)
4. Add to `.env.local`:
   ```
   OPENAI_API_KEY=your_api_key_here
   RESEND_API_KEY=your_resend_api_key
   ```
5. Deploy to Vercel and add the `RESEND_API_KEY` environment variable in Vercel dashboard

Contact form emails will be sent from `noreply@cartcuterie.la` to both the business and customer.

## License

© 2025 Cartcuterie. All rights reserved.
