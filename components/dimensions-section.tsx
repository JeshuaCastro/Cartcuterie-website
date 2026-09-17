"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

export function DimensionsSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const carts = [
    {
      title: "Mobile Cart",
      description: "Compact and efficient design perfect for any venue",
      image: "/images/mobile-cart-dimensions-transparent.png",
      zoomOut: true,
      transparentBackground: true,
    },
    {
      title: "Classic Cart",
      description: "Timeless elegance with premium finishes",
      image: "/images/classic-dimensions.JPEG",
    },
    {
      title: "Ice Cream Cart",
      description: "Premium freezer cart for frozen delights",
      image: "/images/ice-cream-dimensions-front.png",
    },
  ]

  return (
    <section id="dimensions" className="py-10 md:py-20 bg-[#fcfbf8] scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-xl md:text-5xl font-bold text-foreground mb-2 md:mb-4 text-center">
            Our Cart Collection
          </h2>
          <p className="text-xs md:text-lg text-gray-600 text-center mb-5 md:mb-12 max-w-2xl mx-auto">
            Choose from our curated selection of luxury catering carts, each designed to elevate your event.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {carts.map((cart, index) => (
              <div
                key={index}
                className="group overflow-hidden rounded-2xl border border-[#aa9169]/60 bg-[#fcfbf8] p-3 md:p-5 shadow-sm"
              >
                <div className="mb-3 md:mb-4 rounded-xl bg-[#e8dcc8] px-3 py-2.5 md:px-4 md:py-3">
                  <h3 className="font-serif text-base md:text-2xl font-bold text-foreground mb-1 md:mb-2">
                    {cart.title}
                  </h3>
                  <p className="text-xs md:text-base text-gray-600">{cart.description}</p>
                </div>
                <button
                  onClick={() => setSelectedImage(cart.image)}
                  className="relative h-96 w-full rounded-2xl overflow-hidden bg-[#fcfbf8] cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all hover:scale-102"
                  aria-label={`View ${cart.title} dimensions`}
                >
                  <Image
                    src={cart.image}
                    alt={cart.title}
                    fill
                    className={`rounded-2xl object-contain object-center transition-transform duration-300 ${
                      cart.transparentBackground ? "" : "mix-blend-multiply"
                    } ${
                      cart.zoomOut ? "scale-[0.92] group-hover:scale-[0.96]" : "group-hover:scale-105"
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="bg-white/90 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs md:text-sm font-medium text-gray-900">Click to expand</p>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal Overlay */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-gray-900" />
            </button>
            <div className="relative w-full h-[80vh]">
              <Image
                src={selectedImage}
                alt="Expanded dimension view"
                fill
                className="object-contain object-center"
                sizes="90vw"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
