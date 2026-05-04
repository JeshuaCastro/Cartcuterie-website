"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Edit2, Sparkles, Upload } from "lucide-react"
import { useCartBuilder, type CartBuilderData } from "@/components/cart-builder-context"

const cartTypes = [
  {
    id: "classic",
    name: "Classic Cart",
    description: "Beautifully crafted wooden cart with decorative wheels",
    image: "/images/mate-juice-cart.jpg",
    eyebrow: "Signature",
    highlights: ["Decorative wheels", "Best for weddings"],
  },
  {
    id: "mobile",
    name: "Mobile Cart",
    description: "Minimalist metal cart with functional wheels",
    image: "/images/yellow-mobile-cart.jpg",
    eyebrow: "Flexible",
    highlights: ["Compact footprint", "Easy event flow"],
  },
  {
    id: "ice-cream",
    name: "Ice Cream Cart",
    description: "Premium freezer cart perfect for frozen treats",
    image: "/images/ice-cream-cart.jpg",
    eyebrow: "Specialty",
    highlights: ["Frozen service", "Built-in functionality"],
  },
]

const addOnOptions = [
  {
    id: "stripe-cloth",
    name: "Stripe Cloth Roof",
    description: "Soft striped canopy for a classic event look",
    eyebrow: "Canopy",
    details: ["Textile feel", "Classic striped silhouette"],
  },
  {
    id: "stripe-vinyl",
    name: "Stripe Vinyl Roof",
    description: "Clean striped vinyl finish for a polished setup",
    eyebrow: "Canopy",
    details: ["Crisp finish", "Polished event styling"],
  },
  {
    id: "floral",
    name: "Floral Arrangement",
    description: "Minimal florals styled onto the cart",
    eyebrow: "Styling",
    details: ["Soft organic texture", "Styled with restraint"],
  },
  {
    id: "custom-wrap",
    name: "Custom Booth Wrap",
    description: "Custom branding or wrap treatment for the cart front",
    eyebrow: "Branding",
    details: ["Front-facing brand moment", "Best paired with a logo upload"],
  },
  {
    id: "none",
    name: "No Add Ons",
    description: "Keep the cart clean and minimal with no add-ons",
    eyebrow: "Minimal",
    details: ["Pure cart silhouette", "No extra styling applied"],
  },
]

const cateringOptions = [
  { id: "charcuterie", name: "Charcuterie/Graze Cart", description: "Cheeses, meats, fruit, and grazing boards" },
  { id: "flower", name: "Flower Cart", description: "Styled blooms and floral offerings" },
  { id: "donut", name: "Donut Cart", description: "Tiered donut displays for events" },
  { id: "fruit", name: "Fruit Cart", description: "Fresh fruit displays and platters" },
  { id: "popcorn", name: "Popcorn Cart", description: "Popcorn service and snack styling" },
  { id: "candy", name: "Candy Cart", description: "Candy jars and sweet table styling" },
  { id: "crepe", name: "Crepe Cart", description: "Crepe service setup" },
  { id: "juice", name: "Juice Cart", description: "Fresh juice service and display" },
  { id: "custom-catering", name: "Custom Catering", description: "Tell us what catering experience you want" },
]

const getStoredAddOn = (cartData: CartBuilderData) => {
  if (cartData.addOn) return cartData.addOn
  if (cartData.roofDecor === "stripe-cloth" || cartData.roofDecor === "stripe-vinyl") return cartData.roofDecor
  if (cartData.design === "floral") return "floral"
  if (cartData.design === "custom" || cartData.design === "custom-wrap") return "custom-wrap"
  return ""
}

const getStoredHasAddOns = (cartData: CartBuilderData) => {
  const storedAddOn = getStoredAddOn(cartData)
  return storedAddOn ? storedAddOn !== "none" : false
}

const mapAddOnToCartData = (addOn: string) => {
  switch (addOn) {
    case "stripe-cloth":
      return { addOn, roofDecor: "stripe-cloth", design: "none" }
    case "stripe-vinyl":
      return { addOn, roofDecor: "stripe-vinyl", design: "none" }
    case "floral":
      return { addOn, roofDecor: "plain", design: "floral" }
    case "custom-wrap":
      return { addOn, roofDecor: "plain", design: "custom-wrap" }
    case "none":
      return { addOn, roofDecor: "plain", design: "none" }
    default:
      return { addOn: "", roofDecor: "plain", design: "none" }
  }
}

export function CartBuilderSection() {
  const [step, setStep] = useState(1)
  const { cartData, updateCartData, generateAICart, isGenerating } = useCartBuilder()
  const [selectedCartType, setSelectedCartType] = useState(cartData.cartType || "")
  const [selectedAddOn, setSelectedAddOn] = useState(getStoredAddOn(cartData))
  const [hasAddOns, setHasAddOns] = useState(getStoredHasAddOns(cartData))
  const [hasCatering, setHasCatering] = useState(cartData.hasCatering)
  const [selectedCatering, setSelectedCatering] = useState<string[]>(cartData.catering || [])
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(cartData.logo || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const totalSteps = 4

  useEffect(() => {
    setSelectedCartType(cartData.cartType || "")
    setSelectedAddOn(getStoredAddOn(cartData))
    setHasAddOns(getStoredHasAddOns(cartData))
    setHasCatering(cartData.hasCatering)
    setSelectedCatering(cartData.catering || [])
    setUploadedLogo(cartData.logo || null)
  }, [cartData])

  const scrollToBuilder = () => {
    const builder = document.getElementById("cart-builder")
    if (builder) {
      const yOffset = -100
      const y = builder.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  const saveSelections = () => {
    const resolvedAddOn = hasAddOns ? selectedAddOn : "none"
    const mappedAddOn = mapAddOnToCartData(resolvedAddOn)
    updateCartData({
      cartType: selectedCartType,
      cartTop: "",
      addOn: mappedAddOn.addOn,
      roofDecor: mappedAddOn.roofDecor,
      design: mappedAddOn.design,
      hasCatering,
      catering: hasCatering ? selectedCatering : [],
      logo: resolvedAddOn === "custom-wrap" ? uploadedLogo : null,
    })
  }

  const handleNext = () => {
    if (step < totalSteps) {
      saveSelections()
      setStep(step + 1)
      setTimeout(() => scrollToBuilder(), 100)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      saveSelections()
      setStep(step - 1)
      setTimeout(() => scrollToBuilder(), 100)
    }
  }

  const handleCartTypeSelect = (typeId: string) => {
    setSelectedCartType(typeId)
    updateCartData({ cartType: typeId, aiGeneratedImage: null })
  }

  const handleAddOnSelect = (addOnId: string) => {
    const mappedAddOn = mapAddOnToCartData(addOnId)
    const nextLogo = addOnId === "custom-wrap" ? uploadedLogo : null

    setHasAddOns(addOnId !== "none")
    setSelectedAddOn(addOnId)
    if (addOnId !== "custom-wrap") {
      setUploadedLogo(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }

    updateCartData({
      addOn: mappedAddOn.addOn,
      roofDecor: mappedAddOn.roofDecor,
      design: mappedAddOn.design,
      logo: nextLogo,
      aiGeneratedImage: null,
    })
  }

  const handleAddOnMode = (enabled: boolean) => {
    if (enabled === hasAddOns) return

    setHasAddOns(enabled)

    if (!enabled) {
      const noAddOn = mapAddOnToCartData("none")
      setSelectedAddOn("none")
      setUploadedLogo(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      updateCartData({
        addOn: noAddOn.addOn,
        roofDecor: noAddOn.roofDecor,
        design: noAddOn.design,
        logo: null,
        aiGeneratedImage: null,
      })
      return
    }

    setSelectedAddOn("")
    setUploadedLogo(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    updateCartData({
      addOn: "",
      roofDecor: "plain",
      design: "none",
      logo: null,
      aiGeneratedImage: null,
    })
  }

  const handleCateringMode = (enabled: boolean) => {
    setHasCatering(enabled)
    if (!enabled) {
      setSelectedCatering([])
      updateCartData({ hasCatering: false, catering: [], aiGeneratedImage: null })
      return
    }
    updateCartData({ hasCatering: true, aiGeneratedImage: null })
  }

  const handleCateringToggle = (optionId: string) => {
    const nextSelection = selectedCatering.includes(optionId)
      ? selectedCatering.filter((item) => item !== optionId)
      : [...selectedCatering, optionId]

    setSelectedCatering(nextSelection)
    updateCartData({ hasCatering: true, catering: nextSelection, aiGeneratedImage: null })
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setUploadedLogo(result)
      updateCartData({ logo: result, aiGeneratedImage: null })
    }
    reader.readAsDataURL(file)
  }

  const scrollToContact = () => {
    saveSelections()
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  const selectedCart = cartTypes.find((cart) => cart.id === selectedCartType)
  const selectedAddOnOption = addOnOptions.find((option) => option.id === selectedAddOn)
  const isNextDisabled =
    (step === 1 && !selectedCartType) ||
    (step === 2 && hasAddOns && !selectedAddOn) ||
    (step === 3 && (hasCatering === undefined || (hasCatering && selectedCatering.length === 0)))

  const getNextButtonLabel = () => {
    if (step === 1) return "Continue to Add Ons"
    if (step === 2) return "Continue to Catering"
    if (step === 3) return "Continue to Review"
    return "Contact Us"
  }

  return (
    <section id="cart-builder" className="py-12 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16 space-y-2.5 md:space-y-4">
          <div className="inline-flex items-center rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/70 md:px-4 md:py-1.5 md:text-[11px] md:tracking-[0.24em]">
            Most clients finish this in under 2 minutes
          </div>
          <h2 className="font-serif text-[2rem] leading-[1.05] md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
            Build Your Cart
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Customize your USA cart inquiry with the same flow and structure as the Bali site.
          </p>
          <div className="w-16 md:w-24 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="max-w-3xl md:max-w-4xl mx-auto mb-6 md:mb-12 rounded-[22px] md:rounded-[28px] border border-border/70 bg-card/80 px-3 py-4 md:px-6 md:py-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-base font-semibold transition-all duration-300 ${
                      step >= stepNum
                        ? "bg-accent text-foreground shadow-[0_10px_24px_rgba(0,0,0,0.08)]"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {stepNum}
                  </div>
                  <p className="text-[9px] md:text-xs mt-1 md:mt-2 text-center font-medium hidden sm:block">
                    {stepNum === 1 && "Choose Cart"}
                    {stepNum === 2 && "Add Ons"}
                    {stepNum === 3 && "Add Catering"}
                    {stepNum === 4 && "Review"}
                  </p>
                </div>
                {stepNum < totalSteps && (
                  <div
                    className={`h-0.5 md:h-1 flex-1 mx-1 md:mx-2 transition-all duration-300 ${
                      step > stepNum ? "bg-accent" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl md:max-w-5xl mx-auto">
          <Card className="overflow-hidden rounded-[28px] md:rounded-[32px] border border-border/70 bg-card shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <CardContent className="p-4 md:p-8 lg:p-10">
              {step === 1 && (
                <div className="space-y-6 md:space-y-8">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:px-4 md:text-[11px] md:tracking-[0.22em]">
                      Step 1 of 4
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Choose Your Cart</h3>
                    <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                      Start with the cart silhouette that best fits your event footprint, service style, and overall look.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3 md:gap-6">
                    {cartTypes.map((cart) => (
                      <Card
                        key={cart.id}
                        className={`group cursor-pointer overflow-hidden rounded-[22px] md:rounded-[28px] border transition-all duration-300 ${
                          selectedCartType === cart.id
                            ? "border-accent shadow-[0_18px_50px_rgba(15,23,42,0.10)] -translate-y-1"
                            : "border-border/70 hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
                        }`}
                        onClick={() => handleCartTypeSelect(cart.id)}
                      >
                        <div className="relative h-40 md:h-52 overflow-hidden bg-muted/20">
                          <Image
                            src={cart.image}
                            alt={cart.name}
                            fill
                            className="object-contain md:object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                          <div className="absolute left-3 top-3 inline-flex items-center rounded-full border border-white/80 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/70 backdrop-blur-sm">
                            {cart.eyebrow}
                          </div>
                        </div>
                        <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1.5">
                              <h4 className="font-bold text-base md:text-xl text-foreground">{cart.name}</h4>
                              <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">{cart.description}</p>
                            </div>
                            <div
                              className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                                selectedCartType === cart.id
                                  ? "border-accent bg-accent shadow-[0_0_0_4px_rgba(0,0,0,0.04)]"
                                  : "border-border bg-background"
                              }`}
                            >
                              <div className={`h-2.5 w-2.5 rounded-full ${selectedCartType === cart.id ? "bg-foreground" : "bg-transparent"}`} />
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {cart.highlights.map((highlight) => (
                              <span
                                key={highlight}
                                className="inline-flex items-center rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[10px] md:text-[11px] font-medium text-foreground/70"
                              >
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 md:space-y-8">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:px-4 md:text-[11px] md:tracking-[0.22em]">
                      Step 2 of 4
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Add Ons</h3>
                    <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                      Choose one styling direction. Each option keeps the process simple and makes the final quote faster to prepare.
                    </p>
                  </div>

                  <div className="max-w-2xl mx-auto space-y-5 md:space-y-8">
                    <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                      <button
                        type="button"
                        className={`rounded-[20px] md:rounded-[26px] border p-4 md:p-6 text-left transition-all duration-300 ${
                          hasAddOns
                            ? "border-accent bg-card shadow-[0_16px_40px_rgba(15,23,42,0.08)] -translate-y-1"
                            : "border-border/70 bg-card hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
                        }`}
                        onClick={() => handleAddOnMode(true)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-3">
                            <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/70">
                              Styling option
                            </span>
                            <div>
                              <h4 className="text-base md:text-lg font-semibold text-foreground">Add Ons</h4>
                              <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">
                                Choose one add-on direction for the cart design.
                              </p>
                            </div>
                          </div>
                          <div
                            className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                              hasAddOns ? "border-accent bg-accent" : "border-border bg-background"
                            }`}
                          >
                            <div className={`h-2.5 w-2.5 rounded-full ${hasAddOns ? "bg-foreground" : "bg-transparent"}`} />
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        className={`rounded-[20px] md:rounded-[26px] border p-4 md:p-6 text-left transition-all duration-300 ${
                          !hasAddOns
                            ? "border-accent bg-card shadow-[0_16px_40px_rgba(15,23,42,0.08)] -translate-y-1"
                            : "border-border/70 bg-card hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
                        }`}
                        onClick={() => handleAddOnMode(false)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-3">
                            <span className="inline-flex items-center rounded-full border border-border bg-muted/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                              Minimal
                            </span>
                            <div>
                              <h4 className="text-base md:text-lg font-semibold text-foreground">No Add Ons</h4>
                              <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">
                                Keep the cart clean with no additional styling applied.
                              </p>
                            </div>
                          </div>
                          <div
                            className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                              !hasAddOns ? "border-accent bg-accent" : "border-border bg-background"
                            }`}
                          >
                            <div className={`h-2.5 w-2.5 rounded-full ${!hasAddOns ? "bg-foreground" : "bg-transparent"}`} />
                          </div>
                        </div>
                      </button>
                    </div>

                    {hasAddOns && (
                      <div className="max-w-4xl mx-auto space-y-5 md:space-y-6">
                        <div className="text-center space-y-1">
                          <p className="font-semibold text-base md:text-lg text-foreground">Select one add-on option</p>
                          <p className="text-sm text-muted-foreground">Choose the one styling direction you want quoted.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                          {addOnOptions.filter((option) => option.id !== "none").map((option) => {
                        const isSelected = selectedAddOn === option.id

                        return (
                          <Card
                            key={option.id}
                            className={`h-full cursor-pointer overflow-hidden rounded-[22px] md:rounded-[28px] border bg-card transition-all duration-300 ${
                              isSelected
                                ? "border-accent shadow-[0_18px_50px_rgba(0,0,0,0.10)] -translate-y-1"
                                : "border-border/70 hover:border-accent/50 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                            }`}
                            onClick={() => handleAddOnSelect(option.id)}
                          >
                            <div className="relative h-full min-h-[180px] md:min-h-[250px] overflow-hidden bg-gradient-to-br from-white via-muted/15 to-white p-4 md:p-6">
                              <div className="absolute inset-x-0 top-0 h-px bg-accent/20" />

                              <div className="relative flex h-full flex-col justify-between gap-6">
                                <div className="space-y-4">
                                  <div className="flex items-start justify-between gap-4">
                                    <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/70 md:text-[11px]">
                                      {option.eyebrow}
                                    </span>
                                    <div
                                      className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                                        isSelected
                                          ? "border-accent bg-accent shadow-[0_0_0_4px_rgba(0,0,0,0.04)]"
                                          : "border-foreground/20 bg-white/70"
                                      }`}
                                    >
                                      <div className={`h-2.5 w-2.5 rounded-full ${isSelected ? "bg-foreground" : "bg-transparent"}`} />
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <h4 className="max-w-[16ch] font-serif text-lg md:text-[30px] leading-tight text-foreground">
                                      {option.name}
                                    </h4>
                                    <p className="max-w-[30rem] text-xs md:text-[15px] leading-relaxed text-foreground/72">
                                      {option.description}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  {option.details.map((detail) => (
                                    <span
                                      key={detail}
                                      className="inline-flex items-center rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] md:text-xs font-medium text-foreground/70 mr-2 mb-2"
                                    >
                                      {detail}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Card>
                        )
                      })}
                        </div>
                      </div>
                    )}
                  </div>

                  {hasAddOns && selectedAddOn === "custom-wrap" && (
                    <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 rounded-[22px] md:rounded-[28px] border border-border/80 bg-card p-4 md:p-6 shadow-[0_16px_42px_rgba(15,23,42,0.06)]">
                      <div className="space-y-1">
                        <div className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/70">
                          Optional branding
                        </div>
                        <h4 className="text-lg font-semibold text-foreground pt-2">Upload your logo</h4>
                        <p className="text-sm text-muted-foreground">
                          Upload a logo if you want the booth wrap reference to include your branding.
                        </p>
                      </div>

                      <div
                        className="rounded-[18px] md:rounded-[22px] border-2 border-dashed border-border bg-muted/15 hover:border-accent p-5 md:p-8 text-center cursor-pointer transition-colors duration-300"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoUpload}
                        />
                        {uploadedLogo ? (
                          <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-4">
                            <Image src={uploadedLogo} alt="Uploaded logo" fill className="object-contain" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 md:w-16 md:h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                            <Upload className="w-7 h-7 md:w-8 md:h-8" />
                          </div>
                        )}
                        <p className="font-medium text-foreground mb-1">{uploadedLogo ? "Change Logo" : "Click to upload logo"}</p>
                        <p className="text-sm text-muted-foreground">PNG, JPG, or SVG</p>
                      </div>

                      {uploadedLogo && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setUploadedLogo(null)
                            updateCartData({ logo: null, aiGeneratedImage: null })
                            if (fileInputRef.current) fileInputRef.current.value = ""
                          }}
                          className="w-full"
                        >
                          Remove Logo
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 md:space-y-8">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:px-4 md:text-[11px] md:tracking-[0.22em]">
                      Step 3 of 4
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Add Catering?</h3>
                    <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                      Let us know whether you want the cart styled only, or paired with catering services for the event.
                    </p>
                  </div>

                  <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
                    <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                      <button
                        type="button"
                        className={`rounded-[22px] md:rounded-[26px] border p-4 md:p-6 text-left transition-all duration-300 ${
                          hasCatering
                            ? "border-accent bg-card shadow-[0_16px_40px_rgba(15,23,42,0.08)] -translate-y-1"
                            : "border-border/70 bg-card hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
                        }`}
                        onClick={() => handleCateringMode(true)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-3">
                            <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/70">
                              Recommended
                            </span>
                            <div>
                              <h4 className="text-base md:text-lg font-semibold text-foreground">Yes, Add Catering</h4>
                              <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">
                                Select one or more service options so we can quote the full experience accurately.
                              </p>
                            </div>
                          </div>
                          <div
                            className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                              hasCatering ? "border-accent bg-accent" : "border-border bg-background"
                            }`}
                          >
                            <div className={`h-2.5 w-2.5 rounded-full ${hasCatering ? "bg-foreground" : "bg-transparent"}`} />
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        className={`rounded-[22px] md:rounded-[26px] border p-4 md:p-6 text-left transition-all duration-300 ${
                          !hasCatering
                            ? "border-accent bg-card shadow-[0_16px_40px_rgba(15,23,42,0.08)] -translate-y-1"
                            : "border-border/70 bg-card hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
                        }`}
                        onClick={() => handleCateringMode(false)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-3">
                            <span className="inline-flex items-center rounded-full border border-border bg-muted/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                              Styling only
                            </span>
                            <div>
                              <h4 className="text-base md:text-lg font-semibold text-foreground">No Catering</h4>
                              <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">
                                Keep the inquiry focused on cart styling and rental only.
                              </p>
                            </div>
                          </div>
                          <div
                            className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                              !hasCatering ? "border-accent bg-accent" : "border-border bg-background"
                            }`}
                          >
                            <div className={`h-2.5 w-2.5 rounded-full ${!hasCatering ? "bg-foreground" : "bg-transparent"}`} />
                          </div>
                        </div>
                      </button>
                    </div>

                    {hasCatering && (
                      <div className="space-y-5 md:space-y-6">
                        <div className="text-center space-y-1">
                          <p className="font-semibold text-base md:text-lg text-foreground">Select your catering options</p>
                          <p className="text-sm text-muted-foreground">Choose every service you want included in the quote.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                          {cateringOptions.map((option) => (
                            <Card
                              key={option.id}
                              className={`cursor-pointer rounded-[20px] md:rounded-[24px] border bg-card transition-all duration-300 ${
                                selectedCatering.includes(option.id)
                                  ? "border-accent shadow-[0_14px_34px_rgba(15,23,42,0.08)] -translate-y-0.5"
                                  : "border-border/70 hover:border-accent/40 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)]"
                              }`}
                              onClick={() => handleCateringToggle(option.id)}
                            >
                              <div className="p-4 md:p-5 flex items-start gap-3 md:gap-4">
                                <Checkbox checked={selectedCatering.includes(option.id)} className="mt-1" />
                                <div className="flex-1">
                                  <div className="inline-flex items-center rounded-full border border-border bg-muted/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                                    Service
                                  </div>
                                  <h4 className="font-bold text-foreground mb-1">{option.name}</h4>
                                  <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">{option.description}</p>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 md:space-y-8">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:px-4 md:text-[11px] md:tracking-[0.22em]">
                      Step 4 of 4
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Review Your Cart</h3>
                    <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                      Confirm your selections, generate a preview if you want one, and continue to the inquiry form when you&apos;re ready.
                    </p>
                  </div>

                  <div className="max-w-2xl mx-auto space-y-4 md:space-y-5">
                    <div className="rounded-[22px] md:rounded-[28px] border border-border/80 bg-card p-4 md:p-6 shadow-[0_18px_44px_rgba(15,23,42,0.06)] space-y-4">
                      <div className="text-center space-y-2">
                        <div className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/70">
                          Preview option
                        </div>
                        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                          Generate a visualization of your chosen cart direction before submitting your inquiry.
                        </p>
                      </div>
                      <Button
                        onClick={async () => {
                          saveSelections()
                          await new Promise((resolve) => setTimeout(resolve, 150))
                          const result = await generateAICart()
                          if (!result) {
                            alert("Failed to generate visualization. Please try again.")
                          }
                        }}
                        disabled={isGenerating}
                        className="w-full bg-accent text-foreground hover:bg-accent/90 font-bold rounded-xl md:rounded-2xl min-h-[52px] md:min-h-[58px] text-sm md:text-lg shadow-[0_16px_36px_rgba(15,23,42,0.10)] transition-all duration-300"
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
                            {cartData.aiGeneratedImage ? "Regenerate AI Visualization" : "Generate AI Visualization"}
                          </>
                        )}
                      </Button>
                      <p className="text-center text-sm text-muted-foreground">
                        Generates a cart preview using your selected add-ons and catering setup.
                      </p>
                    </div>

                    {cartData.aiGeneratedImage && (
                      <div className="relative w-full max-w-2xl mx-auto aspect-square rounded-xl overflow-hidden shadow-2xl mb-6 md:mb-8 border-4 border-accent/30">
                        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-30 bg-accent/90 text-foreground text-[11px] md:text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                          </span>
                          AI Generated Preview
                        </div>

                        <Image src={cartData.aiGeneratedImage} alt="AI Generated Cart" fill className="object-cover" />
                      </div>
                    )}

                    <Card className="rounded-[22px] md:rounded-[28px] border border-border/80 bg-card shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                      <CardContent className="p-4 md:p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/70 bg-muted/20 p-3.5 md:p-4">
                          <div>
                            <h4 className="font-semibold text-xs md:text-sm text-muted-foreground">Cart Type</h4>
                            <p className="text-base md:text-xl font-bold text-foreground">{selectedCart?.name || "Not selected"}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => { setStep(1); setTimeout(() => scrollToBuilder(), 100) }} className="h-9 rounded-full px-3 text-xs">
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>

                        <div className="rounded-2xl border border-border/70 bg-muted/20 p-3.5 md:p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="font-semibold text-xs md:text-sm text-muted-foreground">Add Ons</h4>
                              <p className="text-sm md:text-lg text-foreground">{selectedAddOnOption?.name || "No Add Ons"}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => { setStep(2); setTimeout(() => scrollToBuilder(), 100) }} className="h-9 rounded-full px-3 text-xs">
                              <Edit2 className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-border/70 bg-muted/20 p-3.5 md:p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-xs md:text-sm text-muted-foreground">Catering</h4>
                              {hasCatering ? (
                                <div className="flex flex-wrap gap-2 pt-2">
                                  {selectedCatering.map((type) => (
                                    <span key={type} className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs md:text-sm font-medium text-foreground">
                                      {cateringOptions.find((option) => option.id === type)?.name}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm md:text-lg text-foreground">No Catering</p>
                              )}
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => { setStep(3); setTimeout(() => scrollToBuilder(), 100) }} className="h-9 rounded-full px-3 text-xs">
                              <Edit2 className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>

                        {selectedAddOn === "custom-wrap" && uploadedLogo && (
                          <div className="border-t border-border pt-4">
                            <h4 className="font-semibold text-xs md:text-sm text-muted-foreground mb-3">Uploaded Logo</h4>
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                              <Image src={uploadedLogo} alt="Uploaded logo" fill className="object-contain" />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <div className="text-center space-y-4 rounded-[22px] md:rounded-[28px] border border-border/80 bg-card p-4 md:p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                      <div className="space-y-2">
                        <div className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/70">
                          Final step
                        </div>
                        <p className="text-sm text-muted-foreground">Send your selections and we&apos;ll follow up with pricing and availability.</p>
                      </div>
                      <Button size="lg" className="w-full sm:w-auto text-base md:text-lg px-6 md:px-10 py-5 md:py-6 rounded-xl md:rounded-2xl shadow-[0_14px_34px_rgba(15,23,42,0.08)]" onClick={scrollToContact}>
                        Continue to Inquiry
                      </Button>
                      <p className="text-sm text-muted-foreground">We typically respond within 24 hours.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 md:mt-12 rounded-[20px] md:rounded-[24px] border border-border/70 bg-muted/20 p-3 md:p-5 space-y-3 md:space-y-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={step === 1}
                    className="flex-1 rounded-full px-4 md:px-6 bg-background/70 text-xs md:text-sm min-h-[42px] md:min-h-[46px]"
                  >
                    <ChevronLeft className="mr-1.5 h-4 w-4" />
                    Previous
                  </Button>

                  {step < totalSteps ? (
                    <Button
                      onClick={handleNext}
                      disabled={isNextDisabled}
                      className="flex-1 rounded-full px-4 md:px-6 text-xs md:text-sm min-h-[42px] md:min-h-[46px]"
                    >
                      {getNextButtonLabel()}
                      <ChevronRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={scrollToContact}
                      className="flex-1 rounded-full px-4 md:px-6 text-xs md:text-sm min-h-[42px] md:min-h-[46px]"
                    >
                      Continue to Inquiry
                      <ChevronRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="flex justify-center">
                  <div className="text-xs md:text-sm text-muted-foreground inline-flex items-center justify-center rounded-full border border-border bg-background/70 px-4 py-2">
                    Step {step} of {totalSteps}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
