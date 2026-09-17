"use client"

import type React from "react"
import { useState, useEffect, useLayoutEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Phone, Mail, MapPin } from "lucide-react"
import { useCartBuilder } from "@/components/cart-builder-context"

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const confirmationRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (submitted) {
      confirmationRef.current?.scrollIntoView({ behavior: "instant", block: "center" })
    }
  }, [submitted])
  const { cartData, resetCartData } = useCartBuilder()
  const [formMessage, setFormMessage] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const cartTypeNames: Record<string, string> = {
    classic: "Classic Cart",
    mobile: "Mobile Cart",
    "ice-cream": "Ice Cream Cart",
  }
  const addOnNames: Record<string, string> = {
    "stripe-cloth": "Stripe Cloth Roof",
    "stripe-vinyl": "Stripe Vinyl Roof",
    floral: "Floral Arrangement",
    "custom-decal": "Custom Decal",
    "custom-wrap": "Custom Booth Wrap",
    none: "No Add Ons",
  }
  const cateringNames: Record<string, string> = {
    charcuterie: "Charcuterie/Graze Cart",
    flower: "Flower Cart",
    donut: "Donut Cart",
    fruit: "Fruit Cart",
    popcorn: "Popcorn Cart",
    candy: "Candy Cart",
    crepe: "Crepe Cart",
    juice: "Juice Cart",
    "custom-catering": "Custom Catering",
  }
  const iceCreamColorNames: Record<string, string> = {
    "yellow-stripe": "Yellow & White Stripe",
    "orange-stripe": "Orange & White Stripe",
    "forest-green-solid": "Forest Green",
    "burgundy-solid": "Burgundy",
    "black-solid": "Black",
    "ivory-solid": "Ivory",
    "black-white-stripe": "Black & White Stripe",
    "white-solid": "White",
    "tan-solid": "Tan",
    "pink-solid": "Pink",
  }
  const iceCreamColorAliases: Array<[string, string]> = [
    ["#ffffff", "white-solid"],
    ["#fff", "white-solid"],
    ["#fffdd0", "ivory-solid"],
    ["#fffff0", "ivory-solid"],
    ["#228b22", "forest-green-solid"],
    ["#800020", "burgundy-solid"],
    ["#1a1a1a", "black-solid"],
    ["#ffd700", "yellow-stripe"],
    ["#f7e7ce", "tan-solid"],
    ["#e2725b", "orange-stripe"],
    ["#ffb6c1", "pink-solid"],
    ["#dcae96", "tan-solid"],
    ["black-white-stripe", "black-white-stripe"],
    ["black and white", "black-white-stripe"],
    ["black/white", "black-white-stripe"],
    ["black", "black-solid"],
    ["charcoal", "black-solid"],
    ["ivory", "ivory-solid"],
    ["cream", "ivory-solid"],
    ["off-white", "ivory-solid"],
    ["white", "white-solid"],
    ["forest green", "forest-green-solid"],
    ["dark green", "forest-green-solid"],
    ["green", "forest-green-solid"],
    ["burgundy", "burgundy-solid"],
    ["maroon", "burgundy-solid"],
    ["wine", "burgundy-solid"],
    ["red", "burgundy-solid"],
    ["yellow", "yellow-stripe"],
    ["gold", "yellow-stripe"],
    ["mustard", "yellow-stripe"],
    ["orange", "orange-stripe"],
    ["terracotta", "orange-stripe"],
    ["coral", "orange-stripe"],
    ["tan", "tan-solid"],
    ["beige", "tan-solid"],
    ["champagne", "tan-solid"],
    ["dusty rose", "tan-solid"],
    ["pink", "pink-solid"],
    ["blush", "pink-solid"],
    ["rose", "pink-solid"],
  ]
  const getIceCreamColorName = (value: string | undefined) => {
    if (!value?.trim()) return "White"

    const normalized = value.trim().toLowerCase().replace(/\s+/g, " ")
    const directName = iceCreamColorNames[normalized]
    if (directName) return directName

    const labelName = Object.entries(iceCreamColorNames).find(([, name]) => name.toLowerCase() === normalized)?.[1]
    if (labelName) return labelName

    const alias = iceCreamColorAliases.find(([name]) => normalized.includes(name))?.[1]
    return iceCreamColorNames[alias || "white-solid"] || "White"
  }
  const getAddOnName = (id: string) =>
    id === "stripe-vinyl" && cartData.colors?.roofColor?.trim()
      ? `${addOnNames[id]} - ${cartData.colors.roofColor.trim()}`
      : addOnNames[id] || id

  useEffect(() => {
    if (cartData.cartType || cartData.addOn || cartData.hasCatering || cartData.catering.length > 0) {
      let message = "I'm interested in the following cart configuration:\n\n"
      if (cartData.cartType) message += `♥ Cart Type: ${cartTypeNames[cartData.cartType] || cartData.cartType}\n`
      if (cartData.cartType === "ice-cream") {
        message += `♥ Canopy Color: ${getIceCreamColorName(cartData.colors?.roofColor)}\n`
      }
      message +=
        cartData.addOns.length > 0
          ? `♥ Add Ons:\n${cartData.addOns.map((id) => `   - ${getAddOnName(id)}`).join("\n")}\n`
          : "♥ Add Ons: No Add Ons\n"
      if (cartData.addOns.includes("custom-decal") && cartData.decalText.trim()) {
        message += `♥ Custom Decal Text: ${cartData.decalText.trim()}\n`
      }
      if (cartData.hasCatering && cartData.catering.length > 0) {
        message += `♥ Catering:\n${cartData.catering.map((id) => `   - ${cateringNames[id] || id}`).join("\n")}\n`
        if (cartData.catering.includes("custom-catering") && cartData.customCateringDetails) {
          message += `♥ Custom Catering Details: ${cartData.customCateringDetails}\n`
        }
      } else if (cartData.hasCatering === false) {
        message += "♥ Catering: No Catering\n"
      }
      message += "\nPlease provide more details about pricing and availability."

      setFormMessage(message)
    }
  }, [cartData])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newErrors: Record<string, string> = {}

    // Validate required fields
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const eventType = formData.get("event-type") as string
    const phone = formData.get("phone") as string
    const eventDate = formData.get("event-date") as string
    const eventStartTime = formData.get("event-start-time") as string
    const eventEndTime = formData.get("event-end-time") as string
    const guestCount = formData.get("guest-count") as string | null
    const location = formData.get("location") as string
    const message = formData.get("message") as string

    if (!name || name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!eventType) {
      newErrors.eventType = "Please select an event type"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    
    try {
      // Send form data to Brevo API via our backend
      const response = await fetch("/finish-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          eventType,
          eventDate,
          eventStartTime,
          eventEndTime,
          guestCount,
          location,
          message,
          siteLocation: "la",
          logo: cartData.logo,
          decalDesignImage: cartData.decalDesignImage,
          aiGeneratedImage: cartData.aiGeneratedImage,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setErrors({ submit: result.error || "Failed to send email. Please try again." })
        return
      }

      setSubmitted(true)
      resetCartData()
      
      // Store form reference before timeout
      const form = e.currentTarget
      
      setTimeout(() => {
        setSubmitted(false)
        if (form) {
          form.reset()
        }
        setFormMessage("")
        setTouched({})
        document.getElementById("hero")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 5000)
    } catch (error) {
      console.error("Form submission error:", error)
      setErrors({ submit: "An error occurred. Please try again." })
    }
  }

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
  }

  return (
    <section id="contact" className="py-6 md:py-24 lg:py-32 bg-[#fcfbf8]">
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Contact Form */}
          <Card className="border-none shadow-2xl bg-card mb-6 md:mb-12">
            <CardContent className="p-4 md:p-8">
              {submitted ? (
                <div ref={confirmationRef} className="text-center py-12 space-y-4 animate-fade-in-up">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Thank You!</h3>
                  <p className="text-muted-foreground">
                    Your inquiry has been received. We'll be in touch within 24 hours!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-800">{errors.submit}</p>
                    </div>
                  )}
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground">Inquiry Form</h3>

                  <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1.5 md:space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input 
                        id="name" 
                        name="name"
                        required 
                        className={`rounded-lg min-h-[42px] md:min-h-[48px] ${touched.name && errors.name ? 'border-red-500' : ''}`}
                        onBlur={() => handleBlur('name')}
                      />
                      {touched.name && errors.name && (
                        <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        required 
                        className={`rounded-lg min-h-[42px] md:min-h-[48px] ${touched.email && errors.email ? 'border-red-500' : ''}`}
                        onBlur={() => handleBlur('email')}
                      />
                      {touched.email && errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 md:space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input id="phone" name="phone" type="tel" required className="rounded-lg min-h-[42px] md:min-h-[48px]" />
                  </div>

                  <div className="space-y-1.5 md:space-y-2">
                    <Label htmlFor="event-type">Event Type *</Label>
                    <Select name="event-type" required onValueChange={() => handleBlur('eventType')}>
                      <SelectTrigger 
                        id="event-type" 
                        className={`rounded-lg min-h-[42px] md:min-h-[48px] ${touched.eventType && errors.eventType ? 'border-red-500' : ''}`}
                      >
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="party">Party</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {touched.eventType && errors.eventType && (
                      <p className="text-xs text-red-500 mt-1">{errors.eventType}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1.5 md:space-y-2">
                      <Label htmlFor="event-date">Event Date *</Label>
                      <Input id="event-date" name="event-date" type="date" required className="rounded-lg min-h-[42px] md:min-h-[48px]" />
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input id="location" name="location" placeholder="Event location" required className="rounded-lg min-h-[42px] md:min-h-[48px]" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1.5 md:space-y-2">
                      <Label htmlFor="event-start-time">Event Start Time *</Label>
                      <Input id="event-start-time" name="event-start-time" type="time" required className="rounded-lg min-h-[42px] md:min-h-[48px]" />
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <Label htmlFor="event-end-time">Event End Time *</Label>
                      <Input id="event-end-time" name="event-end-time" type="time" required className="rounded-lg min-h-[42px] md:min-h-[48px]" />
                    </div>
                  </div>

                  {cartData.catering.length > 0 && (
                    <div className="space-y-1.5 md:space-y-2">
                      <Label htmlFor="guest-count">Guest Count *</Label>
                      <Input 
                        id="guest-count" 
                        name="guest-count" 
                        type="number" 
                        min="1"
                        required
                        placeholder="Number of guests" 
                        className="rounded-lg min-h-[42px] md:min-h-[48px]"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5 md:space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your event vision..."
                      rows={4}
                      required
                      className="rounded-lg resize-none"
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-4 md:mt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      aria-label="Back to cart review"
                      onClick={() => document.getElementById("cart-builder")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 bg-foreground text-background hover:bg-foreground/90 hover:shadow-[0_0_30px_rgba(203,182,130,0.5)] transition-all duration-300 text-base md:text-lg rounded-xl min-h-[48px] md:min-h-[56px]"
                  >
                    Finish Inquiry
                  </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Get in Touch Section - Below Form */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Get in Touch</h3>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1">Phone</p>
                  <a href="tel:8185726316" className="text-muted-foreground hover:text-accent transition-colors">
                    (818) 572-6316
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1">Email</p>
                  <a
                    href="mailto:cartcuteriela@gmail.com"
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    cartcuteriela@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1">Service Area</p>
                  <p className="text-muted-foreground">Los Angeles, Ventura & Orange County</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
