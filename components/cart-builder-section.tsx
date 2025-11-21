"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { ChevronRight, ChevronLeft, Edit2 } from "lucide-react"
import { useCartBuilder } from "@/components/cart-builder-context"

const cartTypes = [
  {
    id: "classic",
    name: "Classic Cart",
    description: "Elegant white cart with customizable styling",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/floral%20design-9KpOs1iAgKfujQCVjKb8L0OOwjM7eI.jpg",
  },
  {
    id: "mobile",
    name: "Mobile Cart",
    description: "Versatile cart with striped awning",
    image: "/images/mobile-cart.jpg",
  },
]

const cartTops = [
  {
    id: "classic",
    name: "Classic",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/classic-cart-top-l6UDhbSu2q1lxAg1ePipgQSHgHdM1l.jpg",
  },
  {
    id: "umbrella",
    name: "Umbrella",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/umbrlella-top-427DPW30hg2pUc1cZr7sUhyCE0yTaw.jpg",
  },
  {
    id: "bar-top",
    name: "Bar Top",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bar-top-qIfi5wMC8rFO0Y568bTrqtEPXCgcyC.jpg",
  },
]

const designStyles = [
  {
    id: "floral",
    name: "Floral",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/floral%20design-9KpOs1iAgKfujQCVjKb8L0OOwjM7eI.jpg",
  },
  {
    id: "boho",
    name: "Boho",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bohemian%20design-xE3ofDlHoFporpF6pLTLD1PKZKOu48.jpg",
  },
  {
    id: "modern",
    name: "Modern",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/custom-cart-design-bAOEOJaWGztDUDNkFf5pbvBByokm2t.jpg",
  },
  {
    id: "custom",
    name: "Custom",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/catering-3-Z1iLYpJv7q3ql92lsrH55yYLzcZChh.jpg",
  },
]

const cateringOptions = [
  { id: "charcuterie", name: "Charcuterie Board" },
  { id: "dessert", name: "Dessert Bar" },
  { id: "beverage", name: "Beverage Cart" },
  { id: "custom-catering", name: "Custom Catering" },
]

export function CartBuilderSection() {
  const { cartData, updateCartData, resetCartData } = useCartBuilder()
  const [step, setStep] = useState(0)
  const [selectedCartType, setSelectedCartType] = useState(cartData.cartType || "")
  const [selectedCartTop, setSelectedCartTop] = useState(cartData.cartTop || "")
  const [selectedDesign, setSelectedDesign] = useState(cartData.design || "")
  const [selectedCatering, setSelectedCatering] = useState<string[]>(cartData.catering || [])
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cartData.cartType) setSelectedCartType(cartData.cartType)
    if (cartData.cartTop) setSelectedCartTop(cartData.cartTop)
    if (cartData.design) setSelectedDesign(cartData.design)
    if (cartData.catering.length > 0) setSelectedCatering(cartData.catering)
  }, [cartData])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && step > 0) {
        setStep(step - 1)
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "Enter") {
        handleNext()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [step, selectedCartType, selectedCartTop, selectedDesign])

  const handleCateringToggle = (id: string) => {
    setSelectedCatering((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const totalSteps = selectedCartType === "mobile" ? 4 : 5
  const shouldSkipCartTop = selectedCartType === "mobile"

  const scrollToContact = () => {
    updateCartData({
      cartType: selectedCartType,
      cartTop: selectedCartTop,
      design: selectedDesign,
      catering: selectedCatering,
    })
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleNext = () => {
    if (step === 0 && selectedCartType) {
      if (shouldSkipCartTop) {
        setStep(2)
      } else {
        setStep(1)
      }
    } else if (step === 1 && selectedCartTop) {
      setStep(2)
    } else if (step === 2 && selectedDesign) {
      setStep(3)
    } else if (step === 3) {
      setStep(4)
    } else if (step === 4) {
      scrollToContact()
    }
  }

  const handleBack = () => {
    if (step === 2 && shouldSkipCartTop) {
      setStep(0)
    } else if (step > 0) {
      setStep(step - 1)
    }
  }

  const jumpToSlide = (slideIndex: number) => {
    setStep(slideIndex)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      handleNext()
    }

    if (isRightSwipe) {
      handleBack()
    }

    setTouchStart(0)
    setTouchEnd(0)
    setIsDragging(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX)
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setTouchEnd(e.clientX)
    }
  }

  const handleMouseUp = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false)
      return
    }

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      handleNext()
    }

    if (isRightSwipe) {
      handleBack()
    }

    setTouchStart(0)
    setTouchEnd(0)
    setIsDragging(false)
  }

  const displayStep =
    step === 2 && shouldSkipCartTop
      ? 2
      : step === 3 && shouldSkipCartTop
        ? 3
        : step === 4 && shouldSkipCartTop
          ? 4
          : step + 1

  const progress = (displayStep / totalSteps) * 100

  const getNextButtonText = () => {
    if (step === 3) return "Review My Cart"
    if (step === 4) return "Send Inquiry"
    return "Next"
  }

  return (
    <section id="cart-builder" className="py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        <div className="text-center mb-8 md:mb-12 lg:mb-16 space-y-3 md:space-y-4">
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
            Build Your Perfect Cart
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Customize every detail to match your event vision
          </p>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-[60%_40%] lg:gap-12">
          <div className="w-full">
            <div className="mb-6 md:mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-muted-foreground">
                  Step {displayStep} of {totalSteps}
                </span>
                <span className="text-sm font-medium text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-500 ease-out"
                  style={{ width: `${progress}%`, willChange: "transform" }}
                />
              </div>
              <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Cart builder steps">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => jumpToSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent ${
                      i === step ? "w-8 bg-accent" : "w-2 bg-border hover:bg-accent/50"
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                    aria-selected={i === step}
                    role="tab"
                  />
                ))}
              </div>
            </div>

            <Card
              ref={carouselRef}
              className="border-none shadow-2xl bg-card overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => setIsDragging(false)}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              <CardContent className="p-5 md:p-8 lg:p-12">
                {step === 0 && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your cart step 1: Choose cart type"
                  >
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-center">
                      Which cart type would you like?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      {cartTypes.map((cart) => (
                        <button
                          key={cart.id}
                          onClick={() => setSelectedCartType(cart.id)}
                          tabIndex={0}
                          aria-selected={selectedCartType === cart.id}
                          className={`relative group overflow-hidden rounded-xl transition-all duration-300 min-h-[48px] focus:outline-none focus:ring-4 focus:ring-accent ${
                            selectedCartType === cart.id
                              ? "ring-[3px] ring-accent shadow-xl -translate-y-1.5"
                              : "hover:scale-105 hover:shadow-lg active:scale-95"
                          }`}
                          style={{ boxShadow: "0 8px 18px rgba(12,12,12,0.08)", borderRadius: "12px" }}
                        >
                          <div className="relative h-64 md:h-80">
                            <Image
                              src={cart.image || "/placeholder.svg"}
                              alt={cart.name}
                              fill
                              className="object-cover"
                              loading="lazy"
                              sizes="(max-width: 768px) 80vw, 40vw"
                            />
                            {selectedCartType === cart.id && <div className="absolute inset-0 bg-accent/20" />}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                            <p className="font-serif text-xl md:text-2xl font-bold text-white mb-1">{cart.name}</p>
                            <p className="text-white/80 text-sm">{cart.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 1 && !shouldSkipCartTop && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your cart step 2: Choose cart top"
                  >
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-center">
                      Choose Your Cart Top
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {cartTops.map((cart) => (
                        <button
                          key={cart.id}
                          onClick={() => setSelectedCartTop(cart.id)}
                          tabIndex={0}
                          aria-selected={selectedCartTop === cart.id}
                          className={`relative group overflow-hidden rounded-xl transition-all duration-300 min-h-[48px] focus:outline-none focus:ring-4 focus:ring-accent ${
                            selectedCartTop === cart.id
                              ? "ring-[3px] ring-accent shadow-xl -translate-y-1.5"
                              : "hover:scale-105 hover:shadow-lg active:scale-95"
                          }`}
                          style={{ boxShadow: "0 8px 18px rgba(12,12,12,0.08)", borderRadius: "12px" }}
                        >
                          <div className="relative h-56 md:h-64">
                            <Image
                              src={cart.image || "/placeholder.svg"}
                              alt={cart.name}
                              fill
                              className="object-cover"
                              loading="lazy"
                              sizes="(max-width: 768px) 80vw, 30vw"
                            />
                            {selectedCartTop === cart.id && <div className="absolute inset-0 bg-accent/20" />}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <p className="font-serif text-lg md:text-xl font-bold text-white">{cart.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your cart step 3: Choose design style"
                  >
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-center">
                      Choose Your Design Style
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {designStyles.map((design) => (
                        <button
                          key={design.id}
                          onClick={() => setSelectedDesign(design.id)}
                          tabIndex={0}
                          aria-selected={selectedDesign === design.id}
                          className={`relative group overflow-hidden rounded-xl transition-all duration-300 min-h-[48px] focus:outline-none focus:ring-4 focus:ring-accent ${
                            selectedDesign === design.id
                              ? "ring-[3px] ring-accent shadow-xl -translate-y-1.5"
                              : "hover:scale-105 hover:shadow-lg active:scale-95"
                          }`}
                          style={{ boxShadow: "0 8px 18px rgba(12,12,12,0.08)", borderRadius: "12px" }}
                        >
                          <div className="relative h-64 md:h-72" style={{ aspectRatio: "4/3" }}>
                            <Image
                              src={design.image || "/placeholder.svg"}
                              alt={design.name}
                              fill
                              className="object-cover"
                              loading="lazy"
                              sizes="(max-width: 768px) 80vw, 40vw"
                            />
                            {selectedDesign === design.id && <div className="absolute inset-0 bg-accent/20" />}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <p className="font-serif text-lg md:text-xl font-bold text-white">{design.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your cart step 4: Add catering services"
                  >
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-center">
                      Add Catering Services
                    </h3>
                    <div className="space-y-4 max-w-md mx-auto">
                      {cateringOptions.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-3 p-5 rounded-xl border-2 border-border hover:border-accent transition-colors duration-300 cursor-pointer min-h-[56px] focus-within:ring-2 focus-within:ring-accent"
                          onClick={() => handleCateringToggle(option.id)}
                        >
                          <Checkbox
                            id={option.id}
                            checked={selectedCatering.includes(option.id)}
                            onCheckedChange={() => handleCateringToggle(option.id)}
                            className="h-6 w-6"
                          />
                          <Label htmlFor={option.id} className="text-base md:text-lg cursor-pointer flex-1">
                            {option.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your cart step 5: Review and send"
                  >
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-center">
                      Review Your Cart
                    </h3>
                    <div className="space-y-4 max-w-2xl mx-auto">
                      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={cartTypes.find((c) => c.id === selectedCartType)?.image || "/placeholder.svg"}
                            alt="Cart type"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Cart Type</p>
                          <p className="font-bold text-foreground">
                            {cartTypes.find((c) => c.id === selectedCartType)?.name}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => jumpToSlide(0)}
                          className="flex items-center gap-2"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </Button>
                      </div>

                      {!shouldSkipCartTop && selectedCartTop && (
                        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={cartTops.find((c) => c.id === selectedCartTop)?.image || "/placeholder.svg"}
                              alt="Cart top"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Cart Top</p>
                            <p className="font-bold text-foreground">
                              {cartTops.find((c) => c.id === selectedCartTop)?.name}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => jumpToSlide(1)}
                            className="flex items-center gap-2"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      )}

                      {selectedDesign && (
                        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={designStyles.find((d) => d.id === selectedDesign)?.image || "/placeholder.svg"}
                              alt="Design style"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Design Style</p>
                            <p className="font-bold text-foreground">
                              {designStyles.find((d) => d.id === selectedDesign)?.name}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => jumpToSlide(2)}
                            className="flex items-center gap-2"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      )}

                      <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground mb-2">Catering Add-ons</p>
                          {selectedCatering.length > 0 ? (
                            <div className="space-y-1">
                              {selectedCatering.map((id) => (
                                <p key={id} className="font-bold text-foreground">
                                  • {cateringOptions.find((o) => o.id === id)?.name}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground italic">None selected</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => jumpToSlide(3)}
                          className="flex items-center gap-2"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </Button>
                      </div>

                      <div className="text-center p-4 bg-accent/10 rounded-xl">
                        <p className="text-sm text-muted-foreground">Package</p>
                        <p className="font-serif text-xl font-bold text-accent">Custom Quote</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          resetCartData()
                          setStep(0)
                          setSelectedCartType("")
                          setSelectedCartTop("")
                          setSelectedDesign("")
                          setSelectedCatering([])
                        }}
                        className="text-sm"
                      >
                        Start New Build
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-8 md:mt-12 pt-6 md:pt-8 border-t border-border gap-4">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={step === 0}
                    className="rounded-xl min-h-[48px] flex-1 md:flex-none bg-transparent"
                    size="lg"
                  >
                    <ChevronLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={
                      (step === 0 && !selectedCartType) ||
                      (step === 1 && !selectedCartTop && !shouldSkipCartTop) ||
                      (step === 2 && !selectedDesign)
                    }
                    className="bg-foreground text-background hover:bg-foreground/90 rounded-xl min-h-[48px] flex-1 md:flex-none"
                    size="lg"
                  >
                    {getNextButtonText()}
                    {step < 4 && <ChevronRight className="ml-2 h-5 w-5" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-sm text-muted-foreground mt-4 lg:hidden">
              Swipe left or right to navigate • Use arrow keys on desktop
            </p>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <Card className="border-none shadow-2xl bg-card">
                <CardContent className="p-8 space-y-6">
                  <h4 className="font-serif text-2xl font-bold text-foreground text-center">Your Cart Preview</h4>

                  {selectedCartType && (
                    <div className="relative w-full h-64 rounded-xl overflow-hidden">
                      <Image
                        src={cartTypes.find((c) => c.id === selectedCartType)?.image || "/placeholder.svg"}
                        alt="Cart preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-3 text-sm">
                    {selectedCartType && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cart Type:</span>
                        <span className="font-bold">{cartTypes.find((c) => c.id === selectedCartType)?.name}</span>
                      </div>
                    )}
                    {selectedCartTop && !shouldSkipCartTop && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cart Top:</span>
                        <span className="font-bold">{cartTops.find((c) => c.id === selectedCartTop)?.name}</span>
                      </div>
                    )}
                    {selectedDesign && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Design:</span>
                        <span className="font-bold">{designStyles.find((d) => d.id === selectedDesign)?.name}</span>
                      </div>
                    )}
                    {selectedCatering.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Add-ons:</span>
                        <span className="font-bold">{selectedCatering.length} selected</span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={scrollToContact}
                    disabled={!selectedCartType || !selectedDesign}
                    className="w-full bg-accent text-foreground hover:bg-accent/90 rounded-xl min-h-[48px]"
                    size="lg"
                  >
                    Request Quote
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
