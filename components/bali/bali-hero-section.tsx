"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

export function BaliHeroSection() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/bali-hero.PNG" 
          alt="Tropical cart on beach in Bali" 
          fill 
          className="object-cover"
          priority
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          {/* Bali Badge */}
          <div className="inline-block">
            <span className="px-6 py-2 bg-white/90 backdrop-blur-sm text-amber-900 font-semibold rounded-full text-sm tracking-wider shadow-lg">
              🌴 BALI LOCATION
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white text-balance leading-tight drop-shadow-2xl">
            Tropical Cart Experiences in Bali
          </h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto text-pretty leading-relaxed drop-shadow-lg">
            Luxury mobile carts with island flair, designed and catered for your special event in paradise.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="bg-amber-600 text-white hover:bg-amber-700 hover:shadow-[0_0_30px_rgba(217,119,6,0.5)] transition-all duration-300 text-lg px-8 py-6 rounded-xl"
              onClick={() => scrollToSection("cart-builder")}
            >
              Build Your Bali Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/90 backdrop-blur-sm text-amber-900 border-2 border-white hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 text-lg px-8 py-6 rounded-xl"
              onClick={() => scrollToSection("pricing")}
            >
              View Packages
            </Button>
          </div>

          {/* Location Note */}
          <p className="text-white/80 text-sm pt-4">
            📍 Serving beautiful destinations across Bali
          </p>
        </div>
      </div>
    </section>
  )
}
