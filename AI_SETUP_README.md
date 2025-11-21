# CartCuterie AI Cart Builder - Setup Instructions

## Overview
This application now features an AI-powered cart visualization system that generates photorealistic cart images based on user customizations using OpenAI's DALL-E 3 API.

## Features Added

### 1. **Color Customization (Step 4)**
- Primary cart color picker
- Secondary/accent color picker
- Roof color picker
- 12 preset colors + custom hex color input
- Real-time color preview

### 2. **AI Image Generation**
- Generates custom cart visualizations using DALL-E 3
- Creates images based on:
  - Cart type (Classic/Mobile)
  - Cart top style (Stripe Cloth/Vinyl Roof)
  - Design style (Floral/Custom)
  - Color customization (Primary, Secondary, Roof colors)
  - Logo branding
  - Catering service visualization
- High-quality (HD) 1024x1024 photorealistic images
- Natural style for realistic event cart appearance

### 3. **Updated Cart Builder Flow**
Now 6-7 steps (depending on cart type):
1. Choose Cart Type
2. Choose Cart Top (skipped for Mobile cart)
3. Choose Design Style
4. **NEW: Customize Colors**
5. Add Catering Services
6. **NEW: Upload Logo/Branding**
7. **NEW: Review & Generate AI Visualization**

## Setup Instructions

### 1. Install Dependencies
```bash
npm install openai --legacy-peer-deps
```

### 2. Set Up OpenAI API Key

Create a `.env.local` file in the project root:
```bash
OPENAI_API_KEY=sk-your-api-key-here
```

**To get an OpenAI API key:**
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it into `.env.local`
5. Add billing information to your OpenAI account (DALL-E 3 is a paid API)

### 3. Pricing Information

**DALL-E 3 Pricing (as of 2024):**
- HD quality (1024x1024): ~$0.08 per image
- Standard quality: ~$0.04 per image

**Cost Management Tips:**
- Each AI generation costs approximately $0.08
- Users should only generate when ready to finalize
- Consider implementing rate limiting for production
- Monitor usage in OpenAI dashboard

### 4. Production Considerations

#### Security
- Never commit `.env.local` to version control
- The `.gitignore` file already excludes `.env.local` and `.env`
- Use environment variables in your deployment platform (Vercel, Netlify, etc.)

#### Rate Limiting
Consider adding rate limiting to prevent abuse:
```typescript
// Example: Add to API route
const MAX_GENERATIONS_PER_SESSION = 5;
```

#### Error Handling
The current implementation includes:
- API error handling
- User feedback for failed generations
- Loading states during generation

#### Alternative Base Image Approach
The user mentioned `classic-cart-ai-base.jpg` - if you want to use this as a base image for composite editing (rather than pure AI generation), you could:

1. Use OpenAI's image edit endpoint instead of generation
2. Upload the base image with a mask
3. Have AI modify specific areas (colors, branding, etc.)

This approach would be more consistent but requires different implementation:
```typescript
const response = await openai.images.edit({
  image: fs.createReadStream("classic-cart-ai-base.jpg"),
  mask: fs.createReadStream("mask.png"),
  prompt: "Add the specified colors and branding",
  n: 1,
  size: "1024x1024"
});
```

## File Structure

```
app/
  api/
    generate-cart/
      route.ts          # API endpoint for AI generation
components/
  cart-builder-section.tsx    # Updated with color customization
  cart-builder-context.tsx    # Updated with AI generation logic
  ui/
    color-picker.tsx    # New color picker component
.env.local            # OpenAI API key (create this)
.gitignore           # Already configured to exclude .env files
```

## Testing

1. Start the development server:
```bash
npm run dev
```

2. Navigate to the cart builder section

3. Complete all customization steps:
   - Select cart type
   - Select cart top (if applicable)
   - Select design style
   - **Choose your colors**
   - Add catering options
   - Upload a logo
   - Click "Generate AI Visualization"

4. Wait 10-30 seconds for the AI to generate your custom cart image

## Troubleshooting

### "Failed to generate AI visualization"
- Check that your OpenAI API key is correctly set in `.env.local`
- Verify you have billing enabled on your OpenAI account
- Check the browser console for specific error messages
- Check the terminal/server logs for API errors

### API Rate Limits
- OpenAI has rate limits per minute
- If you hit the limit, wait a minute and try again
- Consider implementing a queue system for production

### Image Quality Issues
- Current settings use `quality: "hd"` for best results
- Adjust the prompt in `route.ts` for different styles
- Consider A/B testing different prompt structures

## Customization

### Modify AI Prompt
Edit `/app/api/generate-cart/route.ts` to customize how the AI interprets user selections:

```typescript
let prompt = `Create a photorealistic, high-quality image of a ${cartType} cart...`
// Add your custom prompt logic here
```

### Add More Color Presets
Edit `/components/ui/color-picker.tsx`:

```typescript
const commonColors = [
  { name: "Your Color", value: "#HEXCODE" },
  // ...
]
```

### Change Image Size
Edit the API route:

```typescript
size: "1024x1024", // Options: 1024x1024, 1792x1024, 1024x1792
```

## Future Enhancements

Consider implementing:
1. **Image caching** - Save generated images to prevent regeneration
2. **Multiple variations** - Generate 2-3 options per configuration
3. **Edit history** - Allow users to save/compare different designs
4. **Download functionality** - Let users download their AI-generated cart
5. **Share functionality** - Generate shareable links with cart designs
6. **Admin panel** - Monitor API usage and costs

## Support

For issues or questions:
1. Check the OpenAI API status page
2. Review server logs for detailed error messages
3. Verify all environment variables are set correctly
4. Ensure the Node.js OpenAI SDK is properly installed
