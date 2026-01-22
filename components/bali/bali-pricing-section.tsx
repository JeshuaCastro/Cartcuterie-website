"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const packages = [
  {
    name: "Basic Cart Package",
    price: "4.2M IDR",
    description: "Essential cart rental with complete setup service",
    features: [
      "Cart rental for your event",
      "Delivery to your location",
      "Professional setup & pickup",
      "Custom cart decal",
      "Custom roof design",
    ],
    popular: false,
  },
  {
    name: "Premium Cart Package",
    price: "6M+ IDR",
    description: "Complete experience with full-service catering",
    features: [
      "Everything in Basic Package",
      "Full-service catering included",
      "Your choice of catering options",
      "Professional staff service",
      "Premium presentation & styling",
    ],
    popular: true,
  },
]

export function BaliPricingSection() {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToBuilder = () => {
    document.getElementById("cart-builder")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="pricing" className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-[#2E5A3B] text-balance">
            Bali Cart Packages
          </h2>
          <p className="text-xl text-[#2E5A3B]/80 max-w-2xl mx-auto text-pretty leading-relaxed">
            Choose the perfect package for your island celebration
          </p>
          <div className="w-24 h-1 bg-[#2E5A3B] mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {packages.map((pkg, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                pkg.popular
                  ? "border-2 border-[#2E5A3B] shadow-xl scale-105 bg-gradient-to-br from-white to-green-50"
                  : "border border-green-200 hover:border-[#4A7C59] bg-white"
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-[#2E5A3B] text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}

              <CardHeader className="text-center space-y-4 pb-6">
                <CardTitle className="font-serif text-3xl text-[#2E5A3B]">{pkg.name}</CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-[#4A7C59]">{pkg.price}</div>
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-[#2E5A3B] mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    pkg.popular
                      ? "bg-[#2E5A3B] hover:bg-[#254A2F] text-white"
                      : "bg-green-100 hover:bg-green-200 text-[#2E5A3B]"
                  } transition-all duration-300`}
                  size="lg"
                  onClick={scrollToBuilder}
                >
                  Select {pkg.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="max-w-3xl mx-auto">
          <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-300">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="font-serif text-2xl font-bold text-[#2E5A3B]">
                Need a Custom Quote?
              </h3>
              <p className="text-[#2E5A3B]/90 leading-relaxed">
                Every event is unique! Contact us for personalized pricing based on your specific needs, guest count, and catering preferences.
              </p>
              <Button
                variant="outline"
                size="lg"
                className="border-[#2E5A3B] text-[#2E5A3B] hover:bg-[#2E5A3B] hover:text-white transition-all duration-300"
                onClick={scrollToContact}
              >
                Get Custom Quote
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Notes */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            * Prices in Indonesian Rupiah (IDR). Additional charges may apply for remote locations.
          </p>
        </div>
      </div>
    </section>
  )
}
