"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const packages = [
  {
    name: "Cart Only Package",
    description: "Delivery, setup, and pickup included.",
    details: "Perfect for those who want to handle their own catering and styling details.",
    pricing: [
      { name: "Wooden Cart", price: "$425" },
      { name: "Mobile Cart", price: "$500" },
      { name: "Ice Cream Cart", price: "$850", note: "(freezer included)" },
    ],
  },
  {
    name: "Cart + Design Package",
    description: "Includes decor customization and event styling.",
    details: "Let us bring your vision to life with custom florals, themed accessories, and professional styling.",
    popular: true,
  },
  {
    name: "Full Experience Package",
    description: "Includes cart, design, and complete catering service.",
    details: "The ultimate luxury experience with full-service catering, premium ingredients, and dedicated staff.",
  },
]

export function PricingSection() {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="pricing" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-foreground text-balance">
            Packages Made to Fit Your Event
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Every event is unique, and so is our pricing
          </p>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {packages.map((pkg, index) => (
            <Card
              key={index}
              className={`relative border-2 transition-all duration-300 hover:shadow-2xl ${
                pkg.popular ? "border-accent shadow-xl scale-105 md:scale-110" : "border-border hover:border-accent"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-foreground px-6 py-1 rounded-full text-sm font-bold shadow-lg">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-2xl font-bold text-foreground mb-3 uppercase tracking-wide">{pkg.name}</CardTitle>
                <p className="text-muted-foreground text-base leading-relaxed">{pkg.description}</p>
              </CardHeader>
              <CardContent className="space-y-4 pb-8">
                <div className="h-px bg-accent/30 w-16 mx-auto" />
                <p className="text-muted-foreground text-sm leading-relaxed text-center px-4">{pkg.details}</p>
                {pkg.pricing && (
                  <div className="space-y-2 mt-6 pt-4 border-t border-border">
                    {pkg.pricing.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-foreground font-medium">{item.name}</span>
                        <div className="text-right">
                          <span className="font-bold text-accent">{item.price}</span>
                          {item.note && <p className="text-xs text-muted-foreground">{item.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12 max-w-2xl mx-auto">
          Pricing varies based on event size, location, customization level, and service duration. All packages include
          delivery within Los Angeles County.
        </p>

        <div className="text-center mt-8">
          <Button
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 hover:shadow-[0_0_30px_rgba(203,182,130,0.5)] transition-all duration-300 text-lg px-8 py-6 rounded-xl"
            onClick={scrollToContact}
          >
            Request a Custom Quote
          </Button>
        </div>
      </div>
    </section>
  )
}
