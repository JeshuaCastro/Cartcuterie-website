"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Instagram, X, ChevronLeft, ChevronRight } from "lucide-react"

const galleryImages = [
  {
    src: "/images/yellow-mobile-cart.jpg",
    title: "Yellow Mobile Cart",
    caption: "Yellow Mobile Cart",
    category: "Mobile Carts",
    location: "Los Angeles, CA",
  },
  {
    src: "/images/catering-3.jpg",
    title: "Patisserie Cart",
    caption: "Patisserie Cart",
    category: "Events",
    location: "Pasadena, CA",
  },
  {
    src: "/images/Green-mobile-cart.jpg",
    title: "Green Mobile Cart",
    caption: "Green Mobile Cart",
    category: "Mobile Carts",
    location: "Santa Monica, CA",
  },
  {
    src: "/images/mate-juice-cart.jpg",
    title: "Mate Juice Cart",
    caption: "Mate Juice Cart",
    category: "Corporate",
    location: "Venice, CA",
  },
  {
    src: "/images/Better-me-cart.JPG",
    title: "BetterMe Event",
    caption: "BetterMe Event",
    category: "Corporate",
    location: "Beverly Hills, CA",
  },
  {
    src: "/images/spotify-event.jpg",
    title: "Spotify Event",
    caption: "Spotify Event",
    category: "Corporate",
    location: "Los Angeles, CA",
  },
  {
    src: "/images/custom-cart-design.jpg",
    title: "Custom Branding",
    caption: "Custom Branding",
    category: "Corporate",
    location: "Downtown LA",
  },
  {
    src: "/images/alice-olivia.jpg",
    title: "Alice + Olivia",
    caption: "Alice + Olivia",
    category: "Fashion",
    location: "West Hollywood, CA",
  },
  {
    src: "/images/catering-2.jpeg",
    title: "Catering Service",
    caption: "Catering Service",
    category: "Parties",
    location: "Santa Monica, CA",
  },
  {
    src: "/images/Popcorn-cart.jpg",
    title: "Popcorn Cart",
    caption: "Popcorn Cart",
    category: "Snacks",
    location: "Hollywood, CA",
  },
  {
    src: "/images/nudestix.jpg",
    title: "Nudestix Event",
    caption: "Nudestix Event",
    category: "Beauty",
    location: "Los Angeles, CA",
  },
  {
    src: "/images/sendero-cart.jpg",
    title: "Sendero Event",
    caption: "Sendero Event",
    category: "Corporate",
    location: "Los Angeles, CA",
  },
  {
    src: "/images/malibu-event.jpg",
    title: "Private Event",
    caption: "Private Event",
    category: "Parties",
    location: "Malibu, CA",
  },
  {
    src: "/images/Charcuterie.JPG",
    title: "Charcuterie Spread",
    caption: "Charcuterie Spread",
    category: "Catering",
    location: "Los Angeles, CA",
  },
  {
    src: "/images/popcorn.JPG",
    title: "Popcorn Treats",
    caption: "Popcorn Treats",
    category: "Snacks",
    location: "Los Angeles, CA",
  },
]

export function GallerySection() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  return (
    <section id="gallery" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-foreground text-balance">
            Events We've Styled
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            From intimate weddings to grand celebrations
          </p>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-2 max-w-7xl mx-auto">
          {galleryImages.map((image, index) => (
            <button
              key={index}
              onClick={() => openLightbox(index)}
              className="group relative overflow-hidden aspect-square bg-muted animate-fade-in-up rounded-lg md:rounded-none"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.caption}
                fill
                className="object-cover object-center md:object-center group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 text-white">
                  <p className="text-sm md:text-xl font-bold mb-1">{image.category}</p>
                  <p className="text-xs md:text-sm text-white/80">{image.location}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-300 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 rounded-xl group bg-transparent min-h-[48px]"
            asChild
          >
            <a href="https://instagram.com/cartcuterie.la" target="_blank" rel="noopener noreferrer">
              <Instagram className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              View Full Gallery on Instagram
            </a>
          </Button>
        </div>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-accent transition-colors z-10"
          >
            <X className="h-8 w-8" />
          </button>

          <button onClick={prevImage} className="absolute left-4 text-white hover:text-accent transition-colors z-10">
            <ChevronLeft className="h-12 w-12" />
          </button>

          <button onClick={nextImage} className="absolute right-4 text-white hover:text-accent transition-colors z-10">
            <ChevronRight className="h-12 w-12" />
          </button>

          <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={galleryImages[currentImageIndex].src}
                alt={`${galleryImages[currentImageIndex].title} - Full view of ${galleryImages[currentImageIndex].category} cart at event`}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white text-center">
              <p className="text-xl md:text-2xl font-bold mb-2">
                {galleryImages[currentImageIndex].caption}
              </p>
              <p className="text-sm md:text-base text-white/80">
                {galleryImages[currentImageIndex].category} • {galleryImages[currentImageIndex].location}
              </p>
              <p className="text-sm text-white/60 mt-2">
                {currentImageIndex + 1} / {galleryImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
