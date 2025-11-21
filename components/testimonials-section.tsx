"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useState, useEffect } from "react"

const testimonials = [
  {
    name: "Marissa G.",
    event: "Wedding Reception",
    text: "Cartcuterie made our wedding feel like a dream — guests couldn't stop talking about it! The attention to detail was incredible.",
    rating: 5,
  },
  {
    name: "Jason R.",
    event: "Corporate Event",
    text: "The setup was Instagram-perfect and effortless. Totally worth it for our company celebration.",
    rating: 5,
  },
  {
    name: "Emily & David",
    event: "Anniversary Party",
    text: "From start to finish, the team was professional and creative. Our guests were blown away by the beautiful cart display.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Decorative Quote Mark */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-accent/10 text-[200px] font-serif leading-none pointer-events-none">
        "
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-foreground text-balance">
            What Our Clients Say
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-2xl bg-card">
            <CardContent className="p-8 md:p-12">
              <div className="space-y-6 animate-fade-in-up" key={currentIndex}>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-accent text-accent" />
                  ))}
                </div>

                <blockquote className="text-xl md:text-2xl text-center text-foreground font-serif italic leading-relaxed">
                  "{testimonials[currentIndex].text}"
                </blockquote>

                <div className="text-center pt-4">
                  <p className="font-bold text-foreground text-lg">{testimonials[currentIndex].name}</p>
                  <p className="text-muted-foreground text-sm">{testimonials[currentIndex].event}</p>
                </div>
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? "w-8 bg-accent" : "w-2 bg-border"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
