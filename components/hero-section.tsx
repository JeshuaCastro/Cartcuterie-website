"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

export function HeroSection() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.jpg"
          alt="Luxury catering cart at event"
          fill
          sizes="100vw"
          className="object-cover object-[center_25%] scale-105"
          priority
          quality={95}
          unoptimized
        />
        {/* Reduced overlay for better cart visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />

        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <div className="relative w-[600px] h-[200px]">
            <Image src="/images/cartcuterie-logo.png" alt="" fill className="object-contain" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white text-balance leading-tight"
              style={{ 
                textShadow: '0 0 4px rgba(0,0,0,0.7)'
              }}>
            We Bring the Cart to Your Celebration.
          </h1>

          <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto text-pretty leading-relaxed"
             style={{ 
               textShadow: '0 0 4px rgba(0,0,0,0.7)'
             }}>
            Luxury mobile carts, designed and catered for any event across Los Angeles.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 hover:shadow-[0_0_30px_rgba(203,182,130,0.5)] transition-all duration-300 text-lg px-8 py-6 rounded-xl"
              onClick={() => scrollToSection("cart-builder")}
            >
              Build Your Cart
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-foreground transition-all duration-300 text-lg px-8 py-6 rounded-xl backdrop-blur-sm bg-transparent"
              onClick={() => scrollToSection("gallery")}
            >
              View Gallery
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
