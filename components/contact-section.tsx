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

  useEffect(() => {
    if (cartData.cartType || cartData.addOn || cartData.hasCatering || cartData.catering.length > 0) {
      setShowCartSummary(true)

      let summary = ""
      if (cartData.cartType) summary += `Cart Type: ${cartTypeNames[cartData.cartType]}`
      if (cartData.addOn) summary += ` · Add Ons: ${addOnNames[cartData.addOn] || cartData.addOn}`
      if (cartData.hasCatering && cartData.catering.length > 0) {
        summary += ` · Add-ons: ${cartData.catering.map((id) => cateringNames[id] || id).join(", ")}`
      } else if (cartData.hasCatering === false) {
        summary += " · Catering: No Catering"
      }

      let message = "I'm interested in the following cart configuration:\n\n"
      if (cartData.cartType) message += `Cart Type: ${cartTypeNames[cartData.cartType] || cartData.cartType}\n`
      if (cartData.addOn) message += `Add Ons: ${addOnNames[cartData.addOn] || cartData.addOn}\n`
      if (cartData.hasCatering && cartData.catering.length > 0) {
        message += `Catering Options: ${cartData.catering.map((id) => cateringNames[id] || id).join(", ")}\n`
      } else if (cartData.hasCatering === false) {
        message += "Catering Options: No Catering\n"
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
    const eventTime = formData.get("event-time") as string
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
      const response = await fetch("/api/contact", {
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
          eventTime,
          location,
          message,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setErrors({ submit: result.error || "Failed to send email. Please try again." })
        return
      }

      setSubmitted(true)
      
      // Store form reference before timeout
      const form = e.currentTarget
      
      setTimeout(() => {
        setSubmitted(false)
        resetCartData()
        setShowCartSummary(false)
        if (form) {
          form.reset()
        }
        setFormMessage("")
        setTouched({})
      }, 5000)
    } catch (error) {
      console.error("Form submission error:", error)
      setErrors({ submit: "An error occurred. Please try again." })
    }
  }

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
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
                  <h3 className="text-xl font-bold text-foreground">Your Cart Summary</h3>
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
                      <p className="font-bold text-sm">{cartTypeNames[cartData.cartType] || cartData.cartType}</p>
                    </div>
                  )}
                  {cartData.addOn && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Add Ons</p>
                      <p className="font-bold text-sm">{addOnNames[cartData.addOn] || cartData.addOn}</p>
                    </div>
                  )}
                  {cartData.hasCatering && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Catering</p>
                      <p className="font-bold text-sm">Yes</p>
                    </div>
                  )}
                  {cartData.hasCatering && cartData.catering.length > 0 && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Add-ons</p>
                      <p className="font-bold text-sm">{cartData.catering.length} selected</p>
                    </div>
                  )}
                  {cartData.hasCatering === false && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Catering</p>
                      <p className="font-bold text-sm">No Catering</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          {/* Contact Form */}
          <Card className="border-none shadow-2xl bg-card mb-12">
            <CardContent className="p-6 md:p-8">
              {submitted ? (
                <div className="text-center py-12 space-y-4 animate-fade-in-up">
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-800">{errors.submit}</p>
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input 
                        id="name" 
                        name="name"
                        required 
                        className={`rounded-lg min-h-[48px] ${touched.name && errors.name ? 'border-red-500' : ''}`}
                        onBlur={() => handleBlur('name')}
                      />
                      {touched.name && errors.name && (
                        <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        required 
                        className={`rounded-lg min-h-[48px] ${touched.email && errors.email ? 'border-red-500' : ''}`}
                        onBlur={() => handleBlur('email')}
                      />
                      {touched.email && errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" className="rounded-lg min-h-[48px]" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-type">Event Type *</Label>
                    <Select name="event-type" required onValueChange={() => handleBlur('eventType')}>
                      <SelectTrigger 
                        id="event-type" 
                        className={`rounded-lg min-h-[48px] ${touched.eventType && errors.eventType ? 'border-red-500' : ''}`}
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-date">Event Date</Label>
                      <Input id="event-date" name="event-date" type="date" className="rounded-lg min-h-[48px]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" name="location" placeholder="Event location" className="rounded-lg min-h-[48px]" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-start-time">Event Start Time</Label>
                      <Input id="event-start-time" name="event-start-time" type="time" className="rounded-lg min-h-[48px]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-end-time">Event End Time</Label>
                      <Input id="event-end-time" name="event-end-time" type="time" className="rounded-lg min-h-[48px]" />
                    </div>
                  </div>

                  {cartData.catering.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="guest-count">Guest Count</Label>
                      <Input 
                        id="guest-count" 
                        name="guest-count" 
                        type="number" 
                        min="1"
                        placeholder="Number of guests" 
                        className="rounded-lg min-h-[48px]" 
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your event vision..."
                      rows={6}
                      className="rounded-lg resize-none"
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-foreground text-background hover:bg-foreground/90 hover:shadow-[0_0_30px_rgba(203,182,130,0.5)] transition-all duration-300 text-lg rounded-xl min-h-[56px] mt-6"
                  >
                    Send Inquiry
                  </Button>
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
