"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { ChevronRight, ChevronLeft, Upload, Sparkles } from "lucide-react"
import { useBaliCartBuilder } from "@/components/bali/bali-cart-builder-context"

const cartTypes = [
  {
    id: "plain",
    name: "Plain Cart",
    description: "Plain white cart - clean and classic",
    image: "/images/plain-bali-cart.jpg",
  },
  {
    id: "stripe",
    name: "Stripe Cart",
    description: "Cart with stripe cloth awning - vibrant and fun",
    image: "/images/bali-stripe-cart.jpg",
  },
  {
    id: "tropical",
    name: "Tropical Cart",
    description: "Cart with thatched roof - authentic island style",
    image: "/images/tropical-cart.jpg",
  },
]

const cateringOptions = [
  {
    id: "charcuterie",
    name: "Charcuterie Cart",
    description: "Artisan meats, cheeses, and accompaniments",
    emoji: "🧀",
  },
  {
    id: "coconut",
    name: "Coconut Cart",
    description: "Fresh coconuts and tropical drinks",
    emoji: "🥥",
  },
  {
    id: "flower",
    name: "Flower Cart",
    description: "Beautiful floral arrangements",
    emoji: "🌺",
  },
  {
    id: "juice",
    name: "Juice Cart",
    description: "Fresh-pressed tropical juices",
    emoji: "🍹",
  },
  {
    id: "fruit",
    name: "Fruit Cart",
    description: "Exotic tropical fruit displays",
    emoji: "🍍",
  },
  {
    id: "matcha",
    name: "Matcha Cart",
    description: "Premium matcha drinks and treats",
    emoji: "🍵",
  },
]

export function BaliCartBuilderSection() {
  const [step, setStep] = useState(1)
  const { cartData, updateCartData, generateAICart, isGenerating } = useBaliCartBuilder()

  const totalSteps = 4 // cart, wording, catering, review

  const scrollToBuilder = () => {
    const builder = document.getElementById("cart-builder")
    if (builder) {
      const yOffset = -100 // Offset for navbar
      const y = builder.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
      // Scroll to top of cart builder on mobile
      setTimeout(() => scrollToBuilder(), 100)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
      // Scroll to top of cart builder on mobile
      setTimeout(() => scrollToBuilder(), 100)
    }
  }

  const handleCartTypeSelect = (typeId: string) => {
    updateCartData({ cartType: typeId })
  }

  const handleCateringToggle = (hasCatering: boolean) => {
    updateCartData({ hasCatering, cateringTypes: [] })
  }

  const handleCateringTypeToggle = (typeId: string) => {
    const currentTypes = cartData.cateringTypes || []
    const newTypes = currentTypes.includes(typeId)
      ? currentTypes.filter((t) => t !== typeId)
      : [...currentTypes, typeId]
    updateCartData({ cateringTypes: newTypes })
  }

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="cart-builder" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-[#2E5A3B] text-balance">
            Build Your Bali Cart
          </h2>
          <p className="text-lg md:text-xl text-[#2E5A3B]/80 max-w-2xl mx-auto">
            Customize your perfect cart experience in just a few steps
          </p>
          <div className="w-20 md:w-24 h-1 bg-[#2E5A3B] mx-auto rounded-full" />
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl md:max-w-4xl mx-auto mb-8 md:mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-base font-semibold transition-all duration-300 ${
                      step >= stepNum
                        ? "bg-[#2E5A3B] text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {stepNum}
                  </div>
                  <p className="text-[10px] md:text-xs mt-1 md:mt-2 text-center font-medium hidden sm:block">
                    {stepNum === 1 && "Choose Cart"}
                    {stepNum === 2 && "Custom Wording"}
                    {stepNum === 3 && "Add Catering"}
                    {stepNum === 4 && "Review"}
                  </p>
                </div>
                {stepNum < 4 && (
                  <div
                    className={`h-0.5 md:h-1 flex-1 mx-1 md:mx-2 transition-all duration-300 ${
                      step > stepNum ? "bg-[#2E5A3B]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl md:max-w-5xl mx-auto">
          <Card className="border-2 border-green-200 shadow-xl">
            <CardContent className="p-4 md:p-8 lg:p-12">
              {/* Step 1: Choose Cart Type */}
              {step === 1 && (
                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <h3 className="text-3xl font-serif font-bold text-[#2E5A3B]">
                      💡 Choose Your Cart
                    </h3>
                    <p className="text-muted-foreground">
                      Select the cart style that matches your event vibe
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                    {cartTypes.map((cart) => (
                      <Card
                        key={cart.id}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-xl overflow-hidden ${
                          cartData.cartType === cart.id
                            ? "ring-4 ring-[#2E5A3B] shadow-lg scale-105"
                            : "hover:ring-2 hover:ring-[#4A7C59]"
                        }`}
                        onClick={() => handleCartTypeSelect(cart.id)}
                      >
                        <div className="relative h-48 md:h-48 bg-gray-100">
                          <Image
                            src={cart.image}
                            alt={cart.name}
                            fill
                            className="object-contain md:object-cover"
                          />
                        </div>
                        <div className="p-4 md:p-6 space-y-1 md:space-y-2">
                          <h4 className="font-bold text-lg md:text-xl text-[#2E5A3B]">{cart.name}</h4>
                          <p className="text-xs md:text-sm text-muted-foreground">{cart.description}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Custom Wording */}
              {step === 2 && (
                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <h3 className="text-3xl font-serif font-bold text-[#2E5A3B]">
                      💡 Add Custom Wording?
                    </h3>
                    <p className="text-muted-foreground">
                      Personalize your cart with custom text or logo
                    </p>
                  </div>

                  <div className="max-w-2xl mx-auto space-y-8">
                    {/* Yes/No Toggle */}
                    <div className="flex items-center justify-center gap-8">
                      <Button
                        variant={cartData.hasCustomWording ? "default" : "outline"}
                        size="lg"
                        className={
                          cartData.hasCustomWording
                            ? "bg-[#2E5A3B] hover:bg-[#254A2F]"
                            : "border-[#4A7C59] hover:border-[#2E5A3B]"
                        }
                        onClick={() => updateCartData({ hasCustomWording: true })}
                      >
                        Yes, Add Wording
                      </Button>
                      <Button
                        variant={!cartData.hasCustomWording ? "default" : "outline"}
                        size="lg"
                        className={
                          !cartData.hasCustomWording
                            ? "bg-gray-600 hover:bg-gray-700"
                            : "border-gray-300 hover:border-gray-500"
                        }
                        onClick={() => updateCartData({ hasCustomWording: false, customWording: "" })}
                      >
                        No Custom Wording
                      </Button>
                    </div>

                    {/* Wording Options */}
                    {cartData.hasCustomWording && (
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="wording" className="text-lg font-semibold">
                            What would you like to put on the cart?
                          </Label>
                          <Textarea
                            id="wording"
                            placeholder="Example: 'Sarah & John's Wedding' or 'Welcome to Paradise'"
                            value={cartData.customWording}
                            onChange={(e) => updateCartData({ customWording: e.target.value })}
                            className="min-h-[120px] text-lg"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-lg font-semibold">Or attach your logo</Label>
                          <div className="border-2 border-dashed border-[#4A7C59] rounded-lg p-8 text-center hover:border-[#2E5A3B] transition-colors cursor-pointer">
                            <Upload className="mx-auto h-12 w-12 text-[#2E5A3B] mb-3" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload your logo (Coming soon)
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Add Catering */}
              {step === 3 && (
                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <h3 className="text-3xl font-serif font-bold text-[#2E5A3B]">
                      💡 Add Catering?
                    </h3>
                    <p className="text-muted-foreground">
                      Enhance your cart with delicious catering options
                    </p>
                  </div>

                  <div className="max-w-2xl mx-auto space-y-8">
                    {/* Catering Yes/No */}
                    <div className="flex items-center justify-center gap-8">
                      <Button
                        variant={cartData.hasCatering ? "default" : "outline"}
                        size="lg"
                        className={
                          cartData.hasCatering
                            ? "bg-[#2E5A3B] hover:bg-[#254A2F]"
                            : "border-[#4A7C59] hover:border-[#2E5A3B]"
                        }
                        onClick={() => handleCateringToggle(true)}
                      >
                        Yes, Add Catering
                      </Button>
                      <Button
                        variant={!cartData.hasCatering ? "default" : "outline"}
                        size="lg"
                        className={
                          !cartData.hasCatering
                            ? "bg-gray-600 hover:bg-gray-700"
                            : "border-gray-300 hover:border-gray-500"
                        }
                        onClick={() => handleCateringToggle(false)}
                      >
                        No Catering
                      </Button>
                    </div>

                    {/* Catering Options */}
                    {cartData.hasCatering && (
                      <div className="space-y-6">
                        <p className="text-center font-semibold text-lg">
                          👉🏼 Select your catering options:
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">
                          {cateringOptions.map((option) => (
                            <Card
                              key={option.id}
                              className={`cursor-pointer transition-all duration-300 ${
                                cartData.cateringTypes?.includes(option.id)
                                  ? "ring-2 ring-[#2E5A3B] bg-green-50"
                                  : "hover:ring-2 hover:ring-[#4A7C59]"
                              }`}
                              onClick={() => handleCateringTypeToggle(option.id)}
                            >
                              <div className="p-4 flex items-start gap-3">
                                <Checkbox
                                  checked={cartData.cateringTypes?.includes(option.id)}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-2xl">{option.emoji}</span>
                                    <h4 className="font-bold text-[#2E5A3B]">{option.name}</h4>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {option.description}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>

                        {/* Guest Count */}
                        {cartData.cateringTypes && cartData.cateringTypes.length > 0 && (
                          <div className="bg-green-50 rounded-lg p-6 space-y-3">
                            <Label htmlFor="guestCount" className="text-lg font-semibold">
                              How many people would you like to cater to?
                            </Label>
                            <Input
                              id="guestCount"
                              type="number"
                              min="1"
                              placeholder="Enter guest count"
                              value={cartData.guestCount || ""}
                              onChange={(e) =>
                                updateCartData({ guestCount: parseInt(e.target.value) || 0 })
                              }
                              className="text-lg"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <h3 className="text-3xl font-serif font-bold text-[#2E5A3B]">
                      Review Your Cart
                    </h3>
                    <p className="text-muted-foreground">
                      Everything looks perfect? Let's get in touch!
                    </p>
                  </div>

                  <div className="max-w-xl mx-auto space-y-4">
                    {/* Generate AI Button */}
                    <div className="space-y-3">
                      <Button
                        onClick={async () => {
                          const result = await generateAICart()
                          if (!result) {
                            alert("Failed to generate visualization. Please try again.")
                          }
                        }}
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-[#2E5A3B] to-[#4A7C59] hover:from-[#254A2F] hover:to-[#3D6349] text-white font-bold rounded-xl min-h-[56px] text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        size="lg"
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                            Generating Your Custom Cart...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            {cartData.aiGeneratedImage ? "Regenerate AI Visualization" : "Generate AI Visualization"}
                          </>
                        )}
                      </Button>
                      <p className="text-center text-sm text-muted-foreground">
                        Transforms your cart with your exact customizations (colors, wording, and catering setup)
                      </p>
                    </div>

                    {/* AI Rendered Preview */}
                    {cartData.aiGeneratedImage && (
                      <div className="relative w-full max-w-2xl mx-auto aspect-square rounded-xl overflow-hidden shadow-2xl mb-8 border-4 border-[#2E5A3B]/30">
                        <div className="absolute top-4 left-4 z-30 bg-[#2E5A3B]/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                          </span>
                          AI Generated Preview
                        </div>
                        
                        <Image
                          src={cartData.aiGeneratedImage}
                          alt="AI Generated Cart"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Cart Summary */}
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
                      <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-xs md:text-sm text-muted-foreground">
                              Cart Type
                            </h4>
                            <p className="text-lg md:text-xl font-bold text-[#2E5A3B] capitalize">
                              {cartData.cartType || "Not selected"}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => { setStep(1); setTimeout(() => scrollToBuilder(), 100) }} className="h-8 text-xs">
                            Edit
                          </Button>
                        </div>

                        <div className="border-t border-green-200 pt-3 md:pt-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-xs md:text-sm text-muted-foreground">
                                Custom Wording
                              </h4>
                              {cartData.hasCustomWording ? (
                                <p className="text-sm md:text-lg text-[#2E5A3B]">
                                  {cartData.customWording || "Not specified yet"}
                                </p>
                              ) : (
                                <p className="text-sm md:text-lg text-[#2E5A3B] italic">No custom wording</p>
                              )}
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => { setStep(2); setTimeout(() => scrollToBuilder(), 100) }} className="h-8 text-xs">
                              Edit
                            </Button>
                          </div>
                        </div>

                        <div className="border-t border-green-200 pt-3 md:pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm text-muted-foreground">
                                Catering
                              </h4>
                              {cartData.hasCatering ? (
                                <div className="space-y-2">
                                  <p className="text-lg font-bold text-[#2E5A3B]">Yes</p>
                                  {cartData.cateringTypes && cartData.cateringTypes.length > 0 && (
                                    <ul className="text-sm space-y-1">
                                      {cartData.cateringTypes.map((type) => {
                                        const option = cateringOptions.find((o) => o.id === type)
                                        return (
                                          <li key={type} className="flex items-center gap-2">
                                            <span>{option?.emoji}</span>
                                            <span>{option?.name}</span>
                                          </li>
                                        )
                                      })}
                                    </ul>
                                  )}
                                  {cartData.guestCount > 0 && (
                                    <p className="text-sm text-muted-foreground">
                                      For {cartData.guestCount} guests
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-lg text-[#2E5A3B]">No</p>
                              )}
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => { setStep(3); setTimeout(() => scrollToBuilder(), 100) }} className="h-8 text-xs">
                              Edit
                            </Button>
                          </div>
                        </div>

                        <div className="border-t border-green-200 pt-4">
                          <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                            Estimated Package
                          </h4>
                          <p className="text-2xl font-bold text-[#2E5A3B]">
                            {cartData.hasCatering ? "Premium Package" : "Basic Package"}
                          </p>
                          <p className="text-xl font-semibold text-[#4A7C59]">
                            {cartData.hasCatering ? "6M+ IDR" : "4.2M IDR"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* CTA */}
                    <div className="text-center space-y-4">
                      <Button
                        size="lg"
                        className="bg-[#2E5A3B] hover:bg-[#254A2F] text-white text-xl px-12 py-6"
                        onClick={scrollToContact}
                      >
                        Get Your Custom Quote
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        We'll contact you within 24 hours with a detailed quote
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-green-200">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={step === 1}
                  className="border-[#4A7C59]"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                <div className="text-sm text-muted-foreground">
                  Step {step} of {totalSteps}
                </div>

                {step < totalSteps ? (
                  <Button
                    onClick={handleNext}
                    className="bg-[#2E5A3B] hover:bg-[#254A2F]"
                    disabled={step === 1 && !cartData.cartType}
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={scrollToContact}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Contact Us
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
