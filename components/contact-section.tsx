"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, MapPin, Edit2, X } from "lucide-react"
import { useCartBuilder } from "@/components/cart-builder-context"

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const { cartData, resetCartData } = useCartBuilder()
  const [formMessage, setFormMessage] = useState("")
  const [showCartSummary, setShowCartSummary] = useState(false)

  useEffect(() => {
    if (cartData.cartType || cartData.cartTop || cartData.design || cartData.catering.length > 0) {
      setShowCartSummary(true)

      const cartTypeNames: Record<string, string> = {
        classic: "Classic Cart",
        mobile: "Mobile Cart",
      }
      const cartTopNames: Record<string, string> = {
        classic: "Classic",
        umbrella: "Umbrella",
        "bar-top": "Bar Top",
      }
      const designNames: Record<string, string> = {
        floral: "Floral",
        boho: "Boho",
        modern: "Modern",
        custom: "Custom",
      }
      const cateringNames: Record<string, string> = {
        charcuterie: "Charcuterie Board",
        dessert: "Dessert Bar",
        beverage: "Beverage Cart",
        "custom-catering": "Custom Catering",
      }

      let summary = ""
      if (cartData.cartType) summary += `Cart Type: ${cartTypeNames[cartData.cartType]}`
      if (cartData.cartTop) summary += ` · Top: ${cartTopNames[cartData.cartTop]}`
      if (cartData.design) summary += ` · Design: ${designNames[cartData.design]}`
      if (cartData.catering.length > 0) {
        summary += ` · Add-ons: ${cartData.catering.map((id) => cateringNames[id] || id).join(", ")}`
      }

      let message = "I'm interested in the following cart configuration:\n\n"
      if (cartData.cartType) message += `Cart Type: ${cartTypeNames[cartData.cartType] || cartData.cartType}\n`
      if (cartData.cartTop) message += `Cart Top: ${cartTopNames[cartData.cartTop] || cartData.cartTop}\n`
      if (cartData.design) message += `Design Style: ${designNames[cartData.design] || cartData.design}\n`
      if (cartData.catering.length > 0) {
        message += `Catering Options: ${cartData.catering.map((id) => cateringNames[id] || id).join(", ")}\n`
      }
      message += "\nPlease provide more details about pricing and availability."

      setFormMessage(message)
    }
  }, [cartData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      resetCartData()
      setShowCartSummary(false)
    }, 5000)
  }

  const scrollToBuilder = () => {
    document.getElementById("cart-builder")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="contact" className="py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        <div className="text-center mb-8 md:mb-12 lg:mb-16 space-y-3 md:space-y-4">
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
            Let's Start Planning Your Cart
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Tell us about your event, and we'll make it unforgettable
          </p>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
        </div>

        {showCartSummary && (
          <div className="max-w-3xl mx-auto mb-8">
            <Card className="border-2 border-accent/50 bg-accent/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl font-bold text-foreground">Your Cart Summary</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={scrollToBuilder} className="flex items-center gap-2">
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowCartSummary(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {cartData.cartType && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Cart Type</p>
                      <p className="font-bold text-sm">{cartData.cartType === "classic" ? "Classic" : "Mobile"}</p>
                    </div>
                  )}
                  {cartData.cartTop && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Cart Top</p>
                      <p className="font-bold text-sm capitalize">{cartData.cartTop}</p>
                    </div>
                  )}
                  {cartData.design && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Design</p>
                      <p className="font-bold text-sm capitalize">{cartData.design}</p>
                    </div>
                  )}
                  {cartData.catering.length > 0 && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Add-ons</p>
                      <p className="font-bold text-sm">{cartData.catering.length} selected</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Left Side - Info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Get in Touch</h3>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're planning an intimate gathering or a grand celebration, we're here to bring your vision to
                life with our luxury mobile carts.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1">Phone</p>
                  <a href="tel:8184223138" className="text-muted-foreground hover:text-accent transition-colors">
                    (818) 422-3138
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1">Email</p>
                  <a
                    href="mailto:info@cartcuterie.com"
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    info@cartcuterie.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1">Service Area</p>
                  <p className="text-muted-foreground">Los Angeles, Ventura & Orange County</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <Card className="border-none shadow-2xl bg-card">
            <CardContent className="p-6 md:p-8">
              {submitted ? (
                <div className="text-center py-12 space-y-4 animate-fade-in-up">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">Thank You!</h3>
                  <p className="text-muted-foreground">
                    Your inquiry has been received. We'll be in touch within 24 hours!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input id="name" required className="rounded-lg min-h-[48px]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" required className="rounded-lg min-h-[48px]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" className="rounded-lg min-h-[48px]" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-type">Event Type *</Label>
                      <Select required>
                        <SelectTrigger id="event-type" className="rounded-lg min-h-[48px]">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wedding">Wedding</SelectItem>
                          <SelectItem value="party">Party</SelectItem>
                          <SelectItem value="corporate">Corporate</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-date">Event Date</Label>
                      <Input id="event-date" type="date" className="rounded-lg min-h-[48px]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Event location" className="rounded-lg min-h-[48px]" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your event vision..."
                      rows={6}
                      className="rounded-lg resize-none"
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                    />
                  </div>

                  <div className="md:relative fixed bottom-0 left-0 right-0 md:p-0 p-4 bg-card md:bg-transparent md:shadow-none shadow-[0_-4px_12px_rgba(0,0,0,0.1)] z-10">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-foreground text-background hover:bg-foreground/90 hover:shadow-[0_0_30px_rgba(203,182,130,0.5)] transition-all duration-300 text-lg rounded-xl min-h-[56px]"
                    >
                      Send Inquiry
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
