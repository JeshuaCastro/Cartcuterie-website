"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function BaliDimensionsSection() {
  return (
    <section id="dimensions" className="py-24 md:py-32 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-[#2E5A3B] text-balance">
            Cart Dimensions
          </h2>
          <p className="text-xl text-[#2E5A3B]/80 max-w-2xl mx-auto text-pretty leading-relaxed">
            Detailed measurements to help you plan your event space
          </p>
          <div className="w-24 h-1 bg-[#2E5A3B] mx-auto rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-green-200 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src="/images/bali-dimensions.jpg"
                  alt="Cart dimensions and measurements"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Need custom dimensions or have space constraints? Let us know in your inquiry!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
