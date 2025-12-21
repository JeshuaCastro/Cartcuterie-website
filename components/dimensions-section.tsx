"use client"

import Image from "next/image"

export function DimensionsSection() {
  const carts = [
    {
      title: "Mobile Cart",
      description: "Compact and efficient design perfect for any venue",
      image: "/images/mobile-dimensions.JPG",
    },
    {
      title: "Classic Cart",
      description: "Timeless elegance with premium finishes",
      image: "/images/classic-dimensions.JPEG",
    },
  ]

  return (
    <section id="dimensions" className="py-20 bg-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
            Our Cart Collection
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Choose from our curated selection of luxury catering carts, each designed to elevate your event.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {carts.map((cart, index) => (
              <div key={index} className="group overflow-hidden rounded-lg">
                <div className="mb-4">
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                    {cart.title}
                  </h3>
                  <p className="text-gray-600">{cart.description}</p>
                </div>
                <button
                  onClick={() => window.open(cart.image, '_blank')}
                  className="relative h-96 w-full rounded-lg overflow-hidden bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                  aria-label={`View ${cart.title} dimensions in fullscreen`}
                >
                  <Image
                    src={cart.image}
                    alt={cart.title}
                    fill
                    className="object-contain object-center group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="bg-white/90 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-sm font-medium text-gray-900">Click to expand</p>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
