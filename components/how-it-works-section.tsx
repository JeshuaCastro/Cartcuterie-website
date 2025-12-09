"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const steps = [
  {
    number: "01",
    title: "Choose Your Cart Top",
    description: "Select your cart base — from sleek bar top to chic umbrella style.",
    image: "/images/mate-juice-cart.jpg",
  },
  {
    number: "02",
    title: "Add a Design Theme",
    description: "Match your event with a curated or custom decor style.",
    image: "/images/catering-3.jpg",
  },
  {
    number: "03",
    title: "Include Catering Services",
    description: "Complete your setup with food, drinks, or treats tailored to your vibe.",
    image: "/images/Charcuterie.JPG",
  },
]

export function HowItWorksSection() {
  const scrollToBuilder = () => {
    document.getElementById("cart-builder")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-foreground text-balance">Just 3 Easy Steps</h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-card overflow-hidden group"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={step.image}
                  alt={`Step ${step.number}: ${step.title} - ${step.description}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  style={{
                    objectPosition: index === 0 ? 'center 20%' : index === 2 ? 'center 80%' : 'center center'
                  }}
                />
                <div className="absolute top-4 left-4 w-16 h-16 bg-accent rounded-full flex items-center justify-center shadow-lg">
                  <span className="font-serif text-2xl font-bold text-foreground">{step.number}</span>
                </div>
              </div>
              <CardContent className="p-8 space-y-3">
                <h3 className="font-serif text-2xl font-bold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 hover:shadow-[0_0_30px_rgba(203,182,130,0.5)] transition-all duration-300 text-lg px-8 py-6 rounded-xl"
            onClick={scrollToBuilder}
          >
            Start Building
          </Button>
        </div>
      </div>
    </section>
  )
}
