"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, MapPin } from "lucide-react"
import { useBaliCartBuilder } from "@/components/bali/bali-cart-builder-context"

export function BaliContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const { cartData, resetCartData } = useBaliCartBuilder()
  const [formMessage, setFormMessage] = useState("")
  const [showCartSummary, setShowCartSummary] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [eventType, setEventType] = useState("")

  useEffect(() => {
    if (cartData.cartType || cartData.hasCatering) {
      setShowCartSummary(true)

      const cartTypeNames: Record<string, string> = {
        plain: "Plain Cart",
        stripe: "Stripe Cart",
        tropical: "Tropical Cart",
      }

      const cateringNames: Record<string, string> = {
        charcuterie: "Charcuterie",
        coconut: "Coconut Cart",
        flower: "Flower Cart",
        juice: "Juice Cart",
        fruit: "Fruit Cart",
        matcha: "Matcha Cart",
      }

      let summary = "🌴 BALI CART INQUIRY\n\n"
      if (cartData.cartType) summary += `Cart Type: ${cartTypeNames[cartData.cartType]}\n`
      if (cartData.customWording) summary += `Custom Wording: ${cartData.customWording}\n`
      if (cartData.hasCatering) {
        summary += `Catering: Yes\n`
        if (cartData.cateringTypes.length > 0) {
          summary += `Catering Types: ${cartData.cateringTypes
            .map((id) => cateringNames[id])
            .join(", ")}\n`
        }
        if (cartData.guestCount > 0) {
          summary += `Guest Count: ${cartData.guestCount}\n`
        }
      }
      summary += `Package: ${cartData.hasCatering ? "Premium (6M+ IDR)" : "Basic (4.2M IDR)"}\n`

      setFormMessage(summary)
    }
  }, [cartData])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const eventDate = formData.get("eventDate") as string
    const eventTime = formData.get("eventTime") as string
    const location = formData.get("location") as string
    const message = formMessage + "\n\n" + (formData.get("message") as string)

    // Validation
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = "Name is required"
    if (!email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email address"
    if (!eventType) newErrors.eventType = "Event type is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    try {
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
          siteLocation: "bali", // Location identifier
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setErrors({ submit: result.error || "Failed to send email. Please try again." })
        return
      }

      setSubmitted(true)

      const form = e.currentTarget

      setTimeout(() => {
        setSubmitted(false)
        resetCartData()
        setShowCartSummary(false)
        setEventType("")
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
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  return (
    <section id="contact" className="py-24 md:py-32 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-[#2E5A3B] text-balance">
            Let's Create Your Perfect Cart
          </h2>
          <p className="text-xl text-[#2E5A3B]/80 max-w-2xl mx-auto">
            Share your event details and we'll get back to you with a custom quote
          </p>
          <div className="w-24 h-1 bg-[#2E5A3B] mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="border-2 border-green-200 shadow-xl">
            <CardContent className="p-8">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="text-6xl mb-4">🌴</div>
                  <h3 className="text-3xl font-bold text-[#2E5A3B]">Terima Kasih!</h3>
                  <p className="text-lg text-muted-foreground">
                    We've received your inquiry and will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your full name"
                        required
                        onBlur={() => handleBlur("name")}
                        className={errors.name && touched.name ? "border-red-500" : ""}
                      />
                      {errors.name && touched.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        onBlur={() => handleBlur("email")}
                        className={errors.email && touched.email ? "border-red-500" : ""}
                      />
                      {errors.email && touched.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+1 (818) 572-6316" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="eventType">
                        Event Type <span className="text-red-500">*</span>
                      </Label>
                      <Select value={eventType} onValueChange={setEventType} required>
                        <SelectTrigger id="eventType" className={errors.eventType && touched.eventType ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wedding">Wedding</SelectItem>
                          <SelectItem value="birthday">Birthday</SelectItem>
                          <SelectItem value="corporate">Corporate Event</SelectItem>
                          <SelectItem value="beach-party">Beach Party</SelectItem>
                          <SelectItem value="villa-event">Villa Event</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.eventType && touched.eventType && (
                        <p className="text-sm text-red-500">{errors.eventType}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Event Date</Label>
                      <Input id="eventDate" name="eventDate" type="date" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Event Location in Bali</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="e.g., Seminyak, Ubud, Canggu..."
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventStartTime">Event Start Time</Label>
                      <Input id="eventStartTime" name="eventStartTime" type="time" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="eventEndTime">Event End Time</Label>
                      <Input id="eventEndTime" name="eventEndTime" type="time" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Details</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your vision..."
                      rows={4}
                      defaultValue={showCartSummary ? formMessage : ""}
                    />
                  </div>

                  {errors.submit && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#2E5A3B] hover:bg-[#254A2F] text-white text-lg py-6"
                  >
                    Send Inquiry
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="border-2 border-green-200 shadow-xl bg-gradient-to-br from-white to-green-50">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-2xl font-bold text-[#2E5A3B]">Get in Touch</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Mail className="h-6 w-6 text-[#2E5A3B]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#2E5A3B]">Email</p>
                      <a
                        href="mailto:cartcuteriebali@gmail.com"
                        className="text-muted-foreground hover:text-[#2E5A3B] transition-colors"
                      >
                        cartcuteriebali@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Phone className="h-6 w-6 text-[#2E5A3B]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#2E5A3B]">Phone</p>
                      <a href="tel:8185726316" className="text-muted-foreground hover:text-[#2E5A3B] transition-colors">
                        (818) 572-6316
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <MapPin className="h-6 w-6 text-[#2E5A3B]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#2E5A3B]">Location</p>
                      <p className="text-muted-foreground">Serving all of Bali</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 shadow-xl bg-gradient-to-br from-[#2E5A3B] to-[#4A7C59] text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Why Choose Our Bali Carts?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">🌴</span>
                    <span>Authentic tropical designs perfect for island events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">✨</span>
                    <span>Professional setup and full-service catering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">🎨</span>
                    <span>Customizable to match your event theme</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">📸</span>
                    <span>Instagram-worthy presentations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
