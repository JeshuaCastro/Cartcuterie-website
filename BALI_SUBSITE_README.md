# Bali Location Subsite

## Overview
The Bali location subsite is accessible at `/bali` and provides a specialized cart rental and catering experience tailored for events in Bali, Indonesia.

## Key Features

### 1. **Cart Types (Bali-Specific)**
- **Plain Cart**: Clean white cart
- **Stripe Cart**: Cart with stripe cloth awning
- **Tropical Cart**: Cart with thatched roof (authentic island style)

### 2. **Catering Options**
The Bali site offers unique catering options:
- 🧀 Charcuterie Cart
- 🥥 Coconut Cart
- 🌺 Flower Cart
- 🍹 Juice Cart
- 🍍 Fruit Cart
- 🍵 Matcha Cart

### 3. **Pricing Packages**

#### Basic Cart Package: 4.2M IDR
- Cart rental for your event
- Delivery to your location
- Professional setup & pickup
- Custom cart decal
- Custom roof design

#### Premium Cart Package: 6M+ IDR
- Everything in Basic Package
- Full-service catering included
- Your choice of catering options
- Professional staff service
- Premium presentation & styling

### 4. **User Flow**
1. **Choose Cart** - Select from Plain, Stripe, or Tropical
2. **Custom Wording** - Add personalized text or logo to the cart
3. **Add Catering** - Optionally select catering options and guest count
4. **Review & Contact** - Review selections and submit inquiry

## Technical Implementation

### File Structure
```
app/
  bali/
    page.tsx                 # Main Bali page

components/
  bali/
    bali-cart-builder-context.tsx    # State management for Bali cart builder
    bali-cart-builder-section.tsx    # Interactive cart builder
    bali-hero-section.tsx             # Hero section with Bali theming
    bali-pricing-section.tsx          # Bali-specific pricing
    bali-contact-section.tsx          # Contact form with location identifier
```

### Shared Components
The following components are reused from the main site:
- Navbar (with location switcher)
- How It Works Section
- Gallery Section
- Testimonials Section
- Footer

### Location Identifier
All contact form submissions from the Bali site include `siteLocation: 'bali'` to help distinguish inquiries:
- Email subject includes "(BALI)" tag
- Business owner email shows "🌴 BALI LOCATION" header
- Separate cart builder state (stored in `cartcuterie_bali_builder`)

## Design DNA
The Bali site maintains the main site's design DNA while adding tropical flair:
- **Colors**: Amber and orange tones (tropical sunset theme)
- **Typography**: Same serif fonts for consistency
- **Layout**: Identical structure to main site
- **Components**: Same UI components with Bali-specific styling

## Navigation
- Users can switch between LA and Bali sites using the navbar button
- Desktop: Location button in top navigation
- Mobile: Location switch in mobile menu

## API Integration
Uses the same API endpoints with location identifier:
- `/api/contact` - Handles both LA and Bali inquiries (via `siteLocation` parameter)

## Future Enhancements
- Custom logo upload functionality
- Bali-specific image gallery
- Multiple currency support (IDR/USD)
- WhatsApp integration for Bali timezone
- Localized content (Bahasa Indonesia option)

## Accessing the Site
- **Production**: `yourdomain.com/bali`
- **Development**: `http://localhost:3000/bali`

## Notes
- Placeholder images are used until actual Bali cart photos are available
- Instagram feed remains the same across both sites
- Dimensions section is excluded from Bali site per requirements
