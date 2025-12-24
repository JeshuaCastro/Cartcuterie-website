"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { ChevronRight, ChevronLeft, Edit2, Sparkles } from "lucide-react"
import { useCartBuilder } from "@/components/cart-builder-context"
import { ColorPicker } from "@/components/ui/color-picker"

const cartTypes = [
  {
    id: "classic",
    name: "Classic Cart",
    description: "beautifully crafted wooden cart with decorative wheels",
    image: "/images/mate-juice-cart.jpg",
  },
  {
    id: "mobile",
    name: "Mobile Cart",
    description: "minimalist metal cart with functional wheels",
    image: "/images/yellow-mobile-cart.jpg",
  },
  {
    id: "ice-cream",
    name: "Ice Cream Cart",
    description: "premium freezer cart perfect for frozen treats",
    image: "/images/ice-cream-cart.jpg",
  },
]

const cartTops = [
  {
    id: "classic-roof",
    name: "Classic Roof",
    image: "/images/classic-cart-top.jpg",
  },
  {
    id: "bar-top",
    name: "Bar Top",
    image: "/images/wedding.jpg",
  },
  {
    id: "umbrella",
    name: "Umbrella",
    image: "/images/umbrella-top.jpg",
  },
]

const roofDecorsClassic = [
  {
    id: "plain",
    name: "Plain",
    image: "/images/mate-juice-cart.jpg",
  },
  {
    id: "stripe-cloth",
    name: "Stripe Cloth Roof",
    image: "/images/Green-mobile-cart.jpg",
  },
  {
    id: "stripe-vinyl",
    name: "Stripe Vinyl Roof",
    image: "/images/nudestix.jpg",
  },
]

const roofDecorsMobile = [
  {
    id: "custom",
    name: "Custom",
    image: "/images/tommy-cart.JPEG",
  },
  {
    id: "striped-roof",
    name: "Striped Roof",
    image: "/images/laneige-cart.JPG",
  },
  {
    id: "plain",
    name: "Plain Cart",
    image: "/images/mate-juice-cart.jpg",
  },
]

const roofDecors = roofDecorsClassic

const designStyles = [
  {
    id: "floral",
    name: "Floral",
    image: "/images/Flower-cart-design.jpg",
  },
  {
    id: "custom",
    name: "Custom",
    image: "/images/Popcorn-cart.jpg",
  },
  {
    id: "none",
    name: "No Design",
    image: "/images/mate-juice-cart.jpg",
  },
]

const cateringOptions = [
  { id: "charcuterie", name: "Charcuterie/Graze Cart" },
  { id: "flower", name: "Flower Cart" },
  { id: "donut", name: "Donut Cart" },
  { id: "fruit", name: "Fruit Cart" },
  { id: "popcorn", name: "Popcorn Cart" },
  { id: "candy", name: "Candy Cart" },
  { id: "crepe", name: "Crepe Cart" },
  { id: "juice", name: "Juice Cart" },
  { id: "custom-catering", name: "Custom Catering" },
]

export function CartBuilderSection() {
  const { cartData, updateCartData, resetCartData, generateAICart, isGenerating } = useCartBuilder()
  const [step, setStep] = useState(0)
  const [selectedCartType, setSelectedCartType] = useState(cartData.cartType || "")
  const [selectedCartTop, setSelectedCartTop] = useState(cartData.cartTop || "")
  const [selectedRoofDecor, setSelectedRoofDecor] = useState(cartData.roofDecor || "")
  const [selectedDesign, setSelectedDesign] = useState(cartData.design || "")
  const [selectedCatering, setSelectedCatering] = useState<string[]>(cartData.catering || [])
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(cartData.logo || null)
  const [primaryColor, setPrimaryColor] = useState(cartData.colors?.primary || "#FFFFFF")
  const [secondaryColor, setSecondaryColor] = useState(cartData.colors?.secondary || "#FFFFFF")
  const [roofColor, setRoofColor] = useState(cartData.colors?.roofColor || "#FFFFFF")
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cartData.cartType) setSelectedCartType(cartData.cartType)
    if (cartData.cartTop) setSelectedCartTop(cartData.cartTop)
    if (cartData.roofDecor) setSelectedRoofDecor(cartData.roofDecor)
    if (cartData.design) setSelectedDesign(cartData.design)
    if (cartData.catering.length > 0) setSelectedCatering(cartData.catering)
    if (cartData.logo) setUploadedLogo(cartData.logo)
    if (cartData.colors?.primary) setPrimaryColor(cartData.colors.primary)
    if (cartData.colors?.secondary) setSecondaryColor(cartData.colors.secondary)
    if (cartData.colors?.roofColor) setRoofColor(cartData.colors.roofColor)
  }, [cartData])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && step > 0) {
        handleBack()
      } else if (e.key === "ArrowRight" && step < totalSteps - 1) {
        handleNext()
      } else if (e.key === "Enter") {
        handleNext()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [step])

  // Scroll to section when step changes - DISABLED to prevent auto-scroll
  // useEffect(() => {
  //   if (sectionRef.current) {
  //     setTimeout(() => {
  //       sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  //     }, 100)
  //   }
  // }, [step])

  const handleCateringToggle = (id: string) => {
    setSelectedCatering((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setUploadedLogo(result)
        updateCartData({ logo: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const getCartSteps = () => {
    if (selectedCartType === "mobile") return 7
    if (selectedCartType === "ice-cream") return 6 // Roof decor, design, colors, logo, and review
    return 8 // Classic cart
  }
  
  const totalSteps = getCartSteps()
  const isMobileCart = selectedCartType === "mobile"
  const isIceCreamCart = selectedCartType === "ice-cream"

  const scrollToContact = () => {
    updateCartData({
      cartType: selectedCartType,
      cartTop: selectedCartTop,
      roofDecor: selectedRoofDecor,
      design: selectedDesign,
      catering: selectedCatering,
      logo: uploadedLogo,
      colors: {
        primary: primaryColor,
        secondary: secondaryColor,
        roofColor: roofColor,
      },
    })
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleNext = useCallback(() => {
    let nextStep = step + 1

    // Step 0: Select Cart Type
    if (step === 0 && selectedCartType) {
      updateCartData({ cartType: selectedCartType })
      nextStep = 1
    }
    // Ice Cream Cart: Step 1 is Roof Decor, Step 2 is Design, Step 3 is Colors, Step 4 is Logo, Step 5 is Review
    else if (isIceCreamCart) {
      if (step === 0) {
        nextStep = 1 // Go to roof decor selection
      } else if (step === 1) {
        if (selectedRoofDecor) {
          updateCartData({ roofDecor: selectedRoofDecor })
          // Plain roof skips colors only, not design
          nextStep = 2 // Always go to design
        } else {
          return
        }
      } else if (step === 2) {
        if (selectedDesign) {
          updateCartData({ design: selectedDesign })
          // Check if plain roof was selected earlier - if so, skip colors
          if (selectedRoofDecor === "plain") {
            nextStep = 4 // Skip colors, go to logo
          } else {
            nextStep = 3 // Go to colors
          }
        } else {
          return
        }
      } else if (step === 3) {
        updateCartData({
          colors: {
            primary: primaryColor,
            secondary: secondaryColor,
            roofColor: roofColor,
          },
        })
        nextStep = 4 // Go to logo
      } else if (step === 4) {
        // Logo step is optional - can skip without uploading
        updateCartData({ logo: uploadedLogo })
        nextStep = 5 // Go to review
      } else if (step === 5) {
        scrollToContact()
        return
      }
    }
    // Step 1: Select Cart Top (Classic only) OR Roof Decor (Mobile)
    else if (step === 1) {
      if (isMobileCart) {
        // Mobile: step 1 is roof decor
        if (selectedRoofDecor) {
          updateCartData({ roofDecor: selectedRoofDecor })
          // Plain roof always goes to design (doesn't skip design)
          nextStep = 2 // Go to design
        } else {
          return
        }
      } else {
        // Classic: step 1 is cart top
        if (selectedCartTop) {
          updateCartData({ cartTop: selectedCartTop })
          nextStep = 2 // Goes to roof decor selection
        } else {
          return
        }
      }
    }
    // Step 2: Select Roof Decor (Classic only) OR Design (Mobile)
    else if (step === 2) {
      if (isMobileCart) {
        // Mobile: step 2 is design
        if (selectedDesign) {
          updateCartData({ design: selectedDesign })
          // Check if plain roof was selected earlier - if so, skip colors
          if (selectedRoofDecor === "plain") {
            nextStep = 4 // Skip colors, go to catering
          } else {
            nextStep = 3 // Go to colors
          }
        } else {
          return
        }
      } else {
        // Classic: step 2 is roof decor
        if (selectedRoofDecor) {
          updateCartData({ roofDecor: selectedRoofDecor })
          // Plain roof always goes to design (doesn't skip design)
          nextStep = 3 // Go to design
        } else {
          return
        }
      }
    }
    // Step 3: Select Design (Classic only) OR Colors (Mobile)
    else if (step === 3) {
      if (isMobileCart) {
        // Mobile: step 3 is colors
        updateCartData({
          colors: {
            primary: primaryColor,
            secondary: secondaryColor,
            roofColor: roofColor,
          },
        })
        nextStep = 4 // Goes to catering
      } else {
        // Classic: step 3 is design
        if (selectedDesign) {
          updateCartData({ design: selectedDesign })
          // Check if plain roof was selected earlier - if so, skip colors
          if (selectedRoofDecor === "plain") {
            nextStep = 5 // Skip colors, go to catering
          } else {
            nextStep = 4 // Go to colors
          }
        } else {
          return
        }
      }
    }
    // Step 4: Customize Colors (Classic only) OR Catering (Mobile)
    else if (step === 4) {
      if (isMobileCart) {
        // Mobile: step 4 is catering
        updateCartData({ catering: selectedCatering })
        nextStep = 5 // Goes to logo
      } else {
        // Classic: step 4 is colors
        updateCartData({
          colors: {
            primary: primaryColor,
            secondary: secondaryColor,
            roofColor: roofColor,
          },
        })
        nextStep = 5 // Goes to catering
      }
    }
    // Step 5: Add Catering (Classic only) OR Logo (Mobile)
    else if (step === 5) {
      if (isMobileCart) {
        // Mobile: step 5 is logo (optional - can skip)
        updateCartData({ logo: uploadedLogo })
        nextStep = 6 // Goes to review
      } else {
        // Classic: step 5 is catering
        updateCartData({ catering: selectedCatering })
        nextStep = 6 // Goes to logo
      }
    }
    // Step 6: Add Logo (Classic only) OR Review (Mobile)
    else if (step === 6) {
      if (isMobileCart) {
        // Mobile: step 6 is review - finish
        scrollToContact()
        return
      } else {
        // Classic: step 6 is logo
        updateCartData({ logo: uploadedLogo })
        nextStep = 7 // Goes to review
      }
    }
    // Step 7: Review (Classic only)
    else if (step === 7) {
      scrollToContact()
      return
    }

    if (nextStep < totalSteps) {
      setStep(nextStep)
    }
  }, [
    step,
    selectedCartType,
    isMobileCart,
    isIceCreamCart,
    selectedCartTop,
    selectedRoofDecor,
    selectedDesign,
    primaryColor,
    secondaryColor,
    roofColor,
    selectedCatering,
    uploadedLogo,
    updateCartData,
    totalSteps,
  ])

  const handleBack = useCallback(() => {
    if (step > 0) {
      setStep(step - 1)
    }
  }, [step])

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
    if (!touchStart || !touchEnd) {
      setIsDragging(false)
      return
    }

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 100 // Increased threshold from 50 to 100
    const isRightSwipe = distance < -100 // Increased threshold from -50 to -100

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
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
    const isLeftSwipe = distance > 100 // Increased threshold
    const isRightSwipe = distance < -100 // Increased threshold

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handleBack()
    }

    setTouchStart(0)
    setTouchEnd(0)
    setIsDragging(false)
  }

  const getNextButtonText = () => {
    if (step === 0) return "Select Cart Type"
    if (isIceCreamCart) {
      if (step === 1) return "Select Roof Decor"
      if (step === 2) return "Customize Colors"
      if (step === 3) return "Send to Email"
      return "Next"
    }
    if (step === 1) {
      return isMobileCart ? "Select Roof Decor" : "Select Cart Top"
    }
    if (step === 2) {
      return isMobileCart ? "Select Design" : "Select Roof Decor"
    }
    if (step === 3) {
      return isMobileCart ? "Customize Colors" : "Select Design"
    }
    if (step === 4) {
      return isMobileCart ? "Add Catering" : "Customize Colors"
    }
    if (step === 5) {
      return isMobileCart ? "Add Logo" : "Add Catering"
    }
    if (step === 6) {
      return isMobileCart ? "Send to Email" : "Add Logo"
    }
    if (step === 7) return "Send to Email"
    return "Next"
  }

  return (
    <section ref={sectionRef} id="cart-builder" className="py-20 px-4 md:px-8 bg-background scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                  Build Your Cart
                </h2>
                <p className="text-sm text-muted-foreground">
                  Step {step + 1} of {totalSteps}
                </p>
              </div>

              <div className="bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-500 ease-out"
                  style={{ width: `${((step + 1) / totalSteps) * 100}%`, willChange: "transform" }}
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
              <CardContent className="p-5 md:p-8 lg:p-12 min-h-96">
                {step === 0 && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your cart step 1: Choose cart type"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center">
                      Which cart type would you like?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                      {cartTypes.map((cart, index) => (
                        <button
                          key={cart.id}
                          onClick={() => {
                            setSelectedCartType(cart.id)
                            setTimeout(() => handleNext(), 100)
                          }}
                          tabIndex={0}
                          aria-selected={selectedCartType === cart.id}
                          className={`relative group overflow-hidden rounded-xl transition-all duration-300 min-h-[56px] md:min-h-[48px] touch-manipulation focus:outline-none focus:ring-4 focus:ring-accent ${
                            selectedCartType === cart.id
                              ? "ring-[3px] ring-accent shadow-xl -translate-y-1.5"
                              : "hover:scale-105 hover:shadow-lg active:scale-95"
                          }`}
                          style={{ boxShadow: "0 8px 18px rgba(12,12,12,0.08)", borderRadius: "12px" }}
                        >
                          <div className="relative h-64 md:h-80">
                            <Image
                              src={cart.image}
                              alt={`${cart.name} - ${cart.description}`}
                              fill
                              className="object-contain bg-muted/20"
                              sizes="(max-width: 768px) 100vw, 50vw"
                              priority={index < 2}
                            />
                            {selectedCartType === cart.id && <div className="absolute inset-0 bg-accent/20" />}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                            <p className="text-xl md:text-2xl font-bold text-white mb-1">{cart.name}</p>
                            <p className="text-white/80 text-sm">{cart.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 1: Cart Top (Classic) OR Roof Decor (Mobile) OR Roof Top (Ice Cream) */}
                {step === 1 && !isMobileCart && !isIceCreamCart && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your cart step 2: Choose cart top"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center">
                      Choose Your Cart Top
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                      {cartTops.map((cart) => (
                        <button
                          key={cart.id}
                          onClick={() => {
                            setSelectedCartTop(cart.id)
                            setTimeout(() => handleNext(), 100)
                          }}
                          tabIndex={0}
                          aria-selected={selectedCartTop === cart.id}
                          className={`relative group overflow-hidden rounded-xl transition-all duration-300 min-h-[48px] focus:outline-none focus:ring-4 focus:ring-accent ${
                            selectedCartTop === cart.id
                              ? "ring-[3px] ring-accent shadow-xl -translate-y-1.5"
                              : "hover:scale-105 hover:shadow-lg active:scale-95"
                          }`}
                          style={{ boxShadow: "0 8px 18px rgba(12,12,12,0.08)", borderRadius: "12px" }}
                        >
                          <div className="relative h-64 md:h-80 w-full">
                            <Image
                              src={cart.image || "/placeholder.svg"}
                              alt={cart.name}
                              fill
                              className="object-contain bg-muted/20"
                              loading="lazy"
                              sizes="(max-width: 768px) 90vw, 33vw"
                            />
                            {selectedCartTop === cart.id && <div className="absolute inset-0 bg-accent/20" />}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                            <p className="text-xl md:text-2xl font-bold text-white mb-1">{cart.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && !isMobileCart && !isIceCreamCart && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your cart step 3: Choose roof decor"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center">
                      Choose Your Roof Decor
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-2 md:px-4">
                      {roofDecorsClassic.map((decor) => (
                        <button
                          key={decor.id}
                          onClick={() => {
                            setSelectedRoofDecor(decor.id)
                            setTimeout(() => handleNext(), 100)
                          }}
                          tabIndex={0}
                          aria-selected={selectedRoofDecor === decor.id}
                          className={`relative group overflow-hidden rounded-xl transition-all duration-300 min-h-[48px] focus:outline-none focus:ring-4 focus:ring-accent ${
                            selectedRoofDecor === decor.id
                              ? "ring-[3px] ring-accent shadow-xl -translate-y-1.5"
                              : "hover:scale-105 hover:shadow-lg active:scale-95"
                          }`}
                          style={{ boxShadow: "0 8px 18px rgba(12,12,12,0.08)", borderRadius: "12px" }}
                        >
                          <div className="relative h-72 md:h-96 w-full">
                            <Image
                              src={decor.image || "/placeholder.svg"}
                              alt={decor.name}
                              fill
                              className="object-contain bg-muted/20"
                              loading="lazy"
                              sizes="(max-width: 768px) 90vw, 30vw"
                            />
                            {selectedRoofDecor === decor.id && <div className="absolute inset-0 bg-accent/20" />}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                            <p className="text-xl md:text-2xl font-bold text-white mb-1">{decor.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 1 && isMobileCart && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your cart step 2: Choose roof decor"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center">
                      Choose Your Roof Decor
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                      {roofDecorsMobile.map((decor) => (
                        <button
                          key={decor.id}
                          onClick={() => {
                            setSelectedRoofDecor(decor.id)
                            setTimeout(() => handleNext(), 100)
                          }}
                          tabIndex={0}
                          aria-selected={selectedRoofDecor === decor.id}
                          className={`relative group overflow-hidden rounded-xl transition-all duration-300 min-h-[48px] focus:outline-none focus:ring-4 focus:ring-accent ${
                            selectedRoofDecor === decor.id
                              ? "ring-[3px] ring-accent shadow-xl -translate-y-1.5"
                              : "hover:scale-105 hover:shadow-lg active:scale-95"
                          }`}
                          style={{ boxShadow: "0 8px 18px rgba(12,12,12,0.08)", borderRadius: "12px" }}
                        >
                          <div className="relative h-64 md:h-80 w-full">
                            <Image
                              src={decor.image || "/placeholder.svg"}
                              alt={decor.name}
                              fill
                              className="object-contain bg-muted/20"
                              loading="lazy"
                              sizes="(max-width: 768px) 90vw, 33vw"
                            />
                            {selectedRoofDecor === decor.id && <div className="absolute inset-0 bg-accent/20" />}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                            <p className="text-xl md:text-2xl font-bold text-white mb-1">{decor.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 1 && isIceCreamCart && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your ice cream cart step 1: Choose roof decor"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center">
                      Choose Your Roof Decor
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                      {roofDecorsClassic.map((decor) => (
                        <button
                          key={decor.id}
                          onClick={() => {
                            setSelectedRoofDecor(decor.id)
                            setTimeout(() => handleNext(), 100)
                          }}
                          tabIndex={0}
                          aria-selected={selectedRoofDecor === decor.id}
                          className={`relative group overflow-hidden rounded-xl transition-all duration-300 min-h-[48px] focus:outline-none focus:ring-4 focus:ring-accent ${
                            selectedRoofDecor === decor.id
                              ? "ring-[3px] ring-accent shadow-xl -translate-y-1.5"
                              : "hover:scale-105 hover:shadow-lg active:scale-95"
                          }`}
                          style={{ boxShadow: "0 8px 18px rgba(12,12,12,0.08)", borderRadius: "12px" }}
                        >
                          <div className="relative h-64 md:h-80 w-full">
                            <Image
                              src={decor.image || "/placeholder.svg"}
                              alt={decor.name}
                              fill
                              className="object-contain bg-muted/20"
                              loading="lazy"
                              sizes="(max-width: 768px) 90vw, 33vw"
                            />
                            {selectedRoofDecor === decor.id && <div className="absolute inset-0 bg-accent/20" />}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                            <p className="text-xl md:text-2xl font-bold text-white mb-1">{decor.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && isMobileCart && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your cart step 2: Choose design style"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center">
                      Choose Your Design Style
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {designStyles.map((design) => (
                        <button
                          key={design.id}
                          onClick={() => {
                            setSelectedDesign(design.id)
                            setTimeout(() => handleNext(), 100)
                          }}
                          tabIndex={0}
                          aria-selected={selectedDesign === design.id}
                          className={`relative group overflow-hidden rounded-xl transition-all duration-300 min-h-[48px] focus:outline-none focus:ring-4 focus:ring-accent ${
                            selectedDesign === design.id
                              ? "ring-[3px] ring-accent shadow-xl -translate-y-1.5"
                              : "hover:scale-105 hover:shadow-lg active:scale-95"
                          }`}
                          style={{ boxShadow: "0 8px 18px rgba(12,12,12,0.08)", borderRadius: "12px" }}
                        >
                          <div className="relative h-64 md:h-80">
                            <Image
                              src={design.image || "/placeholder.svg"}
                              alt={design.name}
                              fill
                              className={design.id === "floral" ? "object-contain" : "object-cover"}
                              loading="lazy"
                              sizes="(max-width: 768px) 80vw, 40vw"
                            />
                            {selectedDesign === design.id && <div className="absolute inset-0 bg-accent/20" />}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                            <p className="text-xl md:text-2xl font-bold text-white mb-1">{design.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && !isMobileCart && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your cart step 4: Choose design style"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center">
                      Choose Your Design Style
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {designStyles.map((design) => (
                        <button
                          key={design.id}
                          onClick={() => {
                            setSelectedDesign(design.id)
                            setTimeout(() => handleNext(), 100)
                          }}
                          tabIndex={0}
                          aria-selected={selectedDesign === design.id}
                          className={`relative group overflow-hidden rounded-xl transition-all duration-300 min-h-[48px] focus:outline-none focus:ring-4 focus:ring-accent ${
                            selectedDesign === design.id
                              ? "ring-[3px] ring-accent shadow-xl -translate-y-1.5"
                              : "hover:scale-105 hover:shadow-lg active:scale-95"
                          }`}
                          style={{ boxShadow: "0 8px 18px rgba(12,12,12,0.08)", borderRadius: "12px" }}
                        >
                          <div className="relative h-64 md:h-80">
                            <Image
                              src={design.image || "/placeholder.svg"}
                              alt={design.name}
                              fill
                              className={design.id === "floral" ? "object-contain" : "object-cover"}
                              loading="lazy"
                              sizes="(max-width: 768px) 80vw, 40vw"
                            />
                            {selectedDesign === design.id && <div className="absolute inset-0 bg-accent/20" />}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                            <p className="text-xl md:text-2xl font-bold text-white mb-1">{design.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ice Cream Design Step - Step 2 */}
                {step === 2 && isIceCreamCart && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your ice cream cart step 2: Choose design style"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center">
                      Choose Your Design Style
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {designStyles.map((design) => (
                        <button
                          key={design.id}
                          onClick={() => {
                            setSelectedDesign(design.id)
                            setTimeout(() => handleNext(), 100)
                          }}
                          tabIndex={0}
                          aria-selected={selectedDesign === design.id}
                          className={`relative group overflow-hidden rounded-xl transition-all duration-300 min-h-[48px] focus:outline-none focus:ring-4 focus:ring-accent ${
                            selectedDesign === design.id
                              ? "ring-[3px] ring-accent shadow-xl -translate-y-1.5"
                              : "hover:scale-105 hover:shadow-lg active:scale-95"
                          }`}
                          style={{ boxShadow: "0 8px 18px rgba(12,12,12,0.08)", borderRadius: "12px" }}
                        >
                          <div className="relative h-64 md:h-80">
                            <Image
                              src={design.image || "/placeholder.svg"}
                              alt={design.name}
                              fill
                              className={design.id === "floral" ? "object-contain" : "object-cover"}
                              loading="lazy"
                              sizes="(max-width: 768px) 80vw, 40vw"
                            />
                            {selectedDesign === design.id && <div className="absolute inset-0 bg-accent/20" />}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                            <p className="text-xl md:text-2xl font-bold text-white mb-1">{design.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && isMobileCart && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your cart step 4: Customize colors"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center">
                      Customize Your Colors
                    </h3>
                    <p className="text-center text-muted-foreground max-w-lg mx-auto">
                      Choose your cart's color palette to match your event theme. The roof will have classic alternating
                      stripes using your selected colors.
                    </p>

                    <div className="space-y-8 max-w-2xl mx-auto">
                      <ColorPicker
                        id="primary-color"
                        label="Primary Cart Body Color"
                        value={primaryColor}
                        onChange={(color) => {
                          setPrimaryColor(color)
                          updateCartData({
                            colors: { ...cartData.colors, primary: color },
                          })
                        }}
                      />

                      <ColorPicker
                        id="secondary-color"
                        label="Secondary/Accent Color (Trim & Details)"
                        value={secondaryColor}
                        onChange={(color) => {
                          setSecondaryColor(color)
                          updateCartData({
                            colors: { ...cartData.colors, secondary: color },
                          })
                        }}
                      />

                      {selectedCartType !== "mobile" && (
                        <div className="space-y-3">
                          <ColorPicker
                            id="roof-color"
                            label="Roof Stripe Color (alternates with secondary)"
                            value={roofColor}
                            onChange={(color) => {
                              setRoofColor(color)
                              updateCartData({
                                colors: { ...cartData.colors, roofColor: color },
                              })
                            }}
                          />
                          <p className="text-sm text-muted-foreground italic pl-1">
                            💡 Your roof will have classic stripes alternating between this color and your secondary
                            color
                          </p>
                        </div>
                      )}

                      <div className="pt-6 border-t border-border">
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                          <div>
                            <p className="font-medium text-foreground">Selected Color Palette</p>
                            <p className="text-sm text-muted-foreground">
                              Preview your cart's colors
                              {selectedCartType !== "mobile" && " (stripes on roof)"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <div
                              className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
                              style={{ backgroundColor: primaryColor }}
                              title="Primary Body"
                            />
                            <div
                              className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
                              style={{ backgroundColor: secondaryColor }}
                              title="Secondary/Accent"
                            />
                            {selectedCartType !== "mobile" && (
                              <div
                                className="w-12 h-12 rounded-lg border-2 border-border shadow-sm relative overflow-hidden"
                                title="Roof Stripes"
                              >
                                <div
                                  className="absolute inset-0 w-1/2 left-0"
                                  style={{ backgroundColor: roofColor }}
                                />
                                <div
                                  className="absolute inset-0 w-1/2 right-0"
                                  style={{ backgroundColor: secondaryColor }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && isIceCreamCart && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your ice cream cart step 3: Customize colors"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center">
                      Customize Your Colors
                    </h3>
                    <p className="text-center text-muted-foreground max-w-lg mx-auto">
                      Choose your cart's color palette to match your event theme.
                    </p>

                    <div className="space-y-8 max-w-2xl mx-auto">
                      <ColorPicker
                        id="primary-color-ice"
                        label="Primary Cart Body Color"
                        value={primaryColor}
                        onChange={(color) => {
                          setPrimaryColor(color)
                          updateCartData({
                            colors: { ...cartData.colors, primary: color },
                          })
                        }}
                      />

                      <ColorPicker
                        id="secondary-color-ice"
                        label="Secondary/Accent Color (Trim & Details)"
                        value={secondaryColor}
                        onChange={(color) => {
                          setSecondaryColor(color)
                          updateCartData({
                            colors: { ...cartData.colors, secondary: color },
                          })
                        }}
                      />

                      <div className="pt-6 border-t border-border">
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                          <div>
                            <p className="font-medium text-foreground">Selected Color Palette</p>
                            <p className="text-sm text-muted-foreground">
                              Preview your custom colors below
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <div
                              className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
                              style={{ backgroundColor: primaryColor }}
                              title="Primary Color"
                            />
                            <div
                              className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
                              style={{ backgroundColor: secondaryColor }}
                              title="Secondary Color"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ice Cream Logo Step - Step 4 */}
                {step === 4 && isIceCreamCart && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your ice cream cart step 4: Upload your logo"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center">
                      Add Your Logo or Branding
                    </h3>
                    <p className="text-center text-muted-foreground max-w-lg mx-auto">
                      Upload your logo or custom branding to personalize your cart (optional).
                    </p>

                    <div className="space-y-6 max-w-2xl mx-auto">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                setUploadedLogo(reader.result as string)
                                updateCartData({ logo: reader.result as string })
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          className="hidden"
                          id="ice-logo-upload"
                        />
                        <label
                          htmlFor="ice-logo-upload"
                          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent transition-colors min-h-[200px]"
                        >
                          {uploadedLogo ? (
                            <div className="relative w-full h-48">
                              <Image
                                src={uploadedLogo}
                                alt="Uploaded logo"
                                fill
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <>
                              <svg
                                className="w-16 h-16 text-muted-foreground mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <p className="text-foreground font-medium mb-1">Click to upload your logo</p>
                              <p className="text-sm text-muted-foreground">PNG, JPG or SVG (max. 5MB)</p>
                            </>
                          )}
                        </label>
                      </div>

                      {uploadedLogo && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setUploadedLogo(null)
                            updateCartData({ logo: null })
                          }}
                          className="w-full"
                        >
                          Remove Logo
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {step === 4 && !isMobileCart && !isIceCreamCart && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your cart step 5: Customize colors"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center">
                      Customize Your Colors
                    </h3>
                    <p className="text-center text-muted-foreground max-w-lg mx-auto">
                      Choose your cart's color palette to match your event theme. The roof will have classic alternating
                      stripes using your selected colors.
                    </p>

                    <div className="space-y-8 max-w-2xl mx-auto">
                      <ColorPicker
                        id="primary-color"
                        label="Primary Cart Body Color"
                        value={primaryColor}
                        onChange={(color) => {
                          setPrimaryColor(color)
                          updateCartData({
                            colors: { ...cartData.colors, primary: color },
                          })
                        }}
                      />

                      <ColorPicker
                        id="secondary-color"
                        label="Secondary/Accent Color (Trim & Details)"
                        value={secondaryColor}
                        onChange={(color) => {
                          setSecondaryColor(color)
                          updateCartData({
                            colors: { ...cartData.colors, secondary: color },
                          })
                        }}
                      />

                      <div className="space-y-3">
                        <ColorPicker
                          id="roof-color"
                          label="Roof Stripe Color (alternates with secondary)"
                          value={roofColor}
                          onChange={(color) => {
                            setRoofColor(color)
                            updateCartData({
                              colors: { ...cartData.colors, roofColor: color },
                            })
                          }}
                        />
                        <p className="text-sm text-muted-foreground italic pl-1">
                          💡 Your roof will have classic stripes alternating between this color and your secondary
                          color
                        </p>
                      </div>

                      <div className="pt-6 border-t border-border">
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                          <div>
                            <p className="font-medium text-foreground">Selected Color Palette</p>
                            <p className="text-sm text-muted-foreground">
                              Preview your cart's colors (stripes on roof)
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <div
                              className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
                              style={{ backgroundColor: primaryColor }}
                              title="Primary Body"
                            />
                            <div
                              className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
                              style={{ backgroundColor: secondaryColor }}
                              title="Secondary/Accent"
                            />
                            <div
                              className="w-12 h-12 rounded-lg border-2 border-border shadow-sm relative overflow-hidden"
                              title="Roof Stripes"
                            >
                              <div
                                className="absolute inset-0 w-1/2 left-0"
                                style={{ backgroundColor: roofColor }}
                              />
                              <div
                                className="absolute inset-0 w-1/2 right-0"
                                style={{ backgroundColor: secondaryColor }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && isMobileCart && !isIceCreamCart && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your cart step 5: Add catering services"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center">
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

                {step === 5 && !isMobileCart && !isIceCreamCart && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your cart step 6: Add catering services"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center">
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

                {step === 5 && isMobileCart && !isIceCreamCart && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your cart step 6: Add your branding"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center">
                      Add Your Branding
                    </h3>
                    <p className="text-center text-muted-foreground max-w-md mx-auto">
                      Upload your logo to see how it looks on your custom cart.
                    </p>

                    <div className="max-w-md mx-auto">
                      <div
                        className="border-2 border-dashed border-border hover:border-accent rounded-xl p-8 text-center cursor-pointer transition-colors duration-300 bg-muted/20"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoUpload}
                        />
                        {uploadedLogo ? (
                          <div className="relative w-32 h-32 mx-auto mb-4">
                            <Image
                              src={uploadedLogo || "/placeholder.svg"}
                              alt="Uploaded logo"
                              fill
                              className="object-contain"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-background border shadow-sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setUploadedLogo(null)
                                updateCartData({ logo: null })
                                if (fileInputRef.current) fileInputRef.current.value = ""
                              }}
                            >
                              ×
                            </Button>
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-8 h-8"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                              />
                            </svg>
                          </div>
                        )}
                        <p className="font-medium text-foreground mb-1">
                          {uploadedLogo ? "Change Logo" : "Click to upload logo"}
                        </p>
                        <p className="text-sm text-muted-foreground">PNG, JPG or SVG (max 5MB)</p>
                      </div>
                    </div>
                  </div>
                )}

                {step === 6 && !isMobileCart && !isIceCreamCart && (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label="Build your cart step 7: Add your branding"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center">
                      Add Your Branding
                    </h3>
                    <p className="text-center text-muted-foreground max-w-md mx-auto">
                      Upload your logo to see how it looks on your custom cart.
                    </p>

                    <div className="max-w-md mx-auto">
                      <div
                        className="border-2 border-dashed border-border hover:border-accent rounded-xl p-8 text-center cursor-pointer transition-colors duration-300 bg-muted/20"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoUpload}
                        />
                        {uploadedLogo ? (
                          <div className="relative w-32 h-32 mx-auto mb-4">
                            <Image
                              src={uploadedLogo || "/placeholder.svg"}
                              alt="Uploaded logo"
                              fill
                              className="object-contain"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-background border shadow-sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setUploadedLogo(null)
                                updateCartData({ logo: null })
                                if (fileInputRef.current) fileInputRef.current.value = ""
                              }}
                            >
                              ×
                            </Button>
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-8 h-8"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                              />
                            </svg>
                          </div>
                        )}
                        <p className="font-medium text-foreground mb-1">
                          {uploadedLogo ? "Change Logo" : "Click to upload logo"}
                        </p>
                        <p className="text-sm text-muted-foreground">PNG, JPG or SVG (max 5MB)</p>
                      </div>
                    </div>
                  </div>
                )}

                {(step === 6 && isMobileCart) || (step === 7 && !isMobileCart && !isIceCreamCart) || (step === 3 && isIceCreamCart) ? (
                  <div
                    className="space-y-6 md:space-y-8 animate-fade-in-up"
                    role="region"
                    aria-label={isMobileCart ? "Build your cart step 7: Review and send" : isIceCreamCart ? "Build your ice cream cart step 4: Review and send" : "Build your cart step 8: Review and send"}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center">
                      Review Your Cart
                    </h3>
                    
                    {/* AI Generation Button */}
                    <div className="max-w-2xl mx-auto mb-8">
                      <Button
                        onClick={async () => {
                          // Ensure all data is saved before generation
                          updateCartData({
                            cartType: selectedCartType,
                            cartTop: selectedCartTop,
                            roofDecor: selectedRoofDecor,
                            design: selectedDesign,
                            catering: selectedCatering,
                            logo: uploadedLogo,
                            colors: {
                              primary: primaryColor,
                              secondary: secondaryColor,
                              roofColor: roofColor,
                            },
                          })
                          // Small delay to ensure state is updated
                          await new Promise(resolve => setTimeout(resolve, 200))
                          const result = await generateAICart()
                          if (!result) {
                            alert("Failed to generate visualization. Please try again.")
                          }
                        }}
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-foreground font-bold rounded-xl min-h-[56px] text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        size="lg"
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-foreground mr-3" />
                            Generating Your Custom Cart...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Generate AI Visualization
                          </>
                        )}
                      </Button>
                      <p className="text-center text-sm text-muted-foreground mt-3">
                        Transforms your actual cart photo with your exact customizations (striped roof, colors, florals,
                        and catering setup)
                      </p>
                    </div>
                    
                    {/* AI Rendered Preview */}
                    {cartData.aiGeneratedImage && (
                      <div className="relative w-full max-w-2xl mx-auto aspect-square rounded-xl overflow-hidden shadow-2xl mb-8 border-4 border-accent/30">
                        <div className="absolute top-4 left-4 z-30 bg-accent/90 text-foreground text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                          </span>
                          AI Generated Preview
                        </div>
                        
                        <Image
                          src={cartData.aiGeneratedImage || "/placeholder.svg"}
                          alt="AI Generated Cart"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

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

                      {!isMobileCart && !isIceCreamCart && selectedCartTop && (
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

                      {selectedRoofDecor && (
                        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={
                                (isMobileCart 
                                  ? roofDecorsMobile.find((d) => d.id === selectedRoofDecor)?.image 
                                  : roofDecorsClassic.find((d) => d.id === selectedRoofDecor)?.image)
                                || "/placeholder.svg"
                              }
                              alt="Roof decor"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Roof Decor</p>
                            <p className="font-bold text-foreground">
                              {isMobileCart 
                                ? roofDecorsMobile.find((d) => d.id === selectedRoofDecor)?.name 
                                : roofDecorsClassic.find((d) => d.id === selectedRoofDecor)?.name}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => jumpToSlide(isMobileCart ? 1 : 2)}
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
                            onClick={() => jumpToSlide(isMobileCart ? 2 : isIceCreamCart ? 2 : 3)}
                            className="flex items-center gap-2"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      )}

                      {(primaryColor || secondaryColor || roofColor) && (
                        <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-2">Color Customization</p>
                            <div className="flex gap-3">
                              {primaryColor && (
                                <div className="flex flex-col items-center gap-1">
                                  <div
                                    className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
                                    style={{ backgroundColor: primaryColor }}
                                  />
                                  <span className="text-xs text-muted-foreground">Body</span>
                                </div>
                              )}
                              {secondaryColor && (
                                <div className="flex flex-col items-center gap-1">
                                  <div
                                    className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
                                    style={{ backgroundColor: secondaryColor }}
                                  />
                                  <span className="text-xs text-muted-foreground">Accent</span>
                                </div>
                              )}
                              {roofColor && !isIceCreamCart && (
                                <div className="flex flex-col items-center gap-1">
                                  <div className="w-12 h-12 rounded-lg border-2 border-border shadow-sm relative overflow-hidden">
                                    <div
                                      className="absolute inset-0 w-1/2 left-0"
                                      style={{ backgroundColor: roofColor }}
                                    />
                                    <div
                                      className="absolute inset-0 w-1/2 right-0"
                                      style={{ backgroundColor: secondaryColor }}
                                    />
                                  </div>
                                  <span className="text-xs text-muted-foreground">Roof</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => jumpToSlide(isMobileCart ? 3 : isIceCreamCart ? 3 : 4)}
                            className="flex items-center gap-2"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      )}

                      {!isIceCreamCart && (
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
                            onClick={() => jumpToSlide(isMobileCart ? 4 : 5)}
                            className="flex items-center gap-2"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      )}

                      {uploadedLogo && (
                        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={uploadedLogo}
                              alt="Your logo"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Logo/Branding</p>
                            <p className="font-bold text-foreground">Custom Logo</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => jumpToSlide(isMobileCart ? 5 : isIceCreamCart ? 4 : 6)}
                            className="flex items-center gap-2"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

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
                      (step === 1 && isMobileCart && !selectedRoofDecor) ||
                      (step === 1 && !isMobileCart && !selectedCartTop) ||
                      (step === 2 && isMobileCart && !selectedDesign) ||
                      (step === 2 && !isMobileCart && !selectedRoofDecor) ||
                      (step === 3 && isMobileCart && false) ||
                      (step === 3 && !isMobileCart && !selectedDesign)
                    }
                    className="bg-foreground text-background hover:bg-foreground/90 rounded-xl min-h-[48px] flex-1 md:flex-none"
                    size="lg"
                  >
                    {getNextButtonText()}
                    {step < totalSteps - 1 && <ChevronRight className="ml-2 h-5 w-5" />}
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
                  <h4 className="text-2xl font-bold text-foreground text-center">Your Cart Preview</h4>

                  {selectedCartType && (
                    <div className="relative w-full h-64 rounded-xl overflow-hidden">
                      <Image
                        src={cartTypes.find((c) => c.id === selectedCartType)?.image || "/placeholder.svg"}
                        alt="Cart preview"
                        fill
                        className="object-cover"
                      />
                      {uploadedLogo && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <div className="relative w-[30%] h-[30%] filter drop-shadow-lg">
                             <Image
                              src={uploadedLogo}
                              alt="Your Brand"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-3 text-sm">
                    {selectedCartType && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cart Type:</span>
                        <span className="font-bold">{cartTypes.find((c) => c.id === selectedCartType)?.name}</span>
                      </div>
                    )}
                    {selectedCartTop && !isMobileCart && (
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
