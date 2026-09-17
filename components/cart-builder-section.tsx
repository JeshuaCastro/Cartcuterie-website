"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { Pinyon_Script } from "next/font/google"
import signatureStyles from "./signature-card.module.css"
import { ChevronDown, ChevronLeft, ChevronRight, Edit2, Heart, Sparkles, Upload } from "lucide-react"
import { useCartBuilder, type CartBuilderData } from "@/components/cart-builder-context"

const signatureScript = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--signature-script",
})

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
    image: "/images/ice-cream-cart-homepage.jpeg",
    eyebrow: "Specialty",
    highlights: ["Built-in functionality", "Functional wheels"],
  },
]

const iceCreamColorOptions = [
  {
    id: "yellow-stripe",
    label: "Yellow & White Stripe",
    image: "/images/ice-cream-options/yellow-stripe.png",
  },
  {
    id: "orange-stripe",
    label: "Orange & White Stripe",
    image: "/images/ice-cream-options/orange-stripe.png",
  },
  {
    id: "forest-green-solid",
    label: "Forest Green",
    image: "/images/ice-cream-options/forest-green-solid.png",
  },
  {
    id: "burgundy-solid",
    label: "Burgundy",
    image: "/images/ice-cream-options/burgundy-solid.png",
  },
  {
    id: "black-solid",
    label: "Black",
    image: "/images/ice-cream-options/black-solid.png",
  },
  {
    id: "ivory-solid",
    label: "Ivory",
    image: "/images/ice-cream-options/ivory-solid.png",
  },
  {
    id: "black-white-stripe",
    label: "Black & White Stripe",
    image: "/images/ice-cream-options/black-white-stripe.png",
  },
  {
    id: "white-solid",
    label: "White",
    image: "/images/ice-cream-options/white-solid.png",
  },
  {
    id: "tan-solid",
    label: "Tan",
    image: "/images/ice-cream-options/tan-solid.png",
  },
  {
    id: "pink-solid",
    label: "Pink",
    image: "/images/ice-cream-options/pink-solid.png",
  },
] as const

const defaultIceCreamColor = "white-solid"

const iceCreamColorAliases: Array<[string, (typeof iceCreamColorOptions)[number]["id"]]> = [
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

const iceCreamHexAliases: Record<string, (typeof iceCreamColorOptions)[number]["id"]> = {
  "#ffffff": "white-solid",
  "#fff": "white-solid",
  "#fffdd0": "ivory-solid",
  "#fffff0": "ivory-solid",
  "#228b22": "forest-green-solid",
  "#800020": "burgundy-solid",
  "#1a1a1a": "black-solid",
  "#ffd700": "yellow-stripe",
  "#f7e7ce": "tan-solid",
  "#e2725b": "orange-stripe",
  "#ffb6c1": "pink-solid",
  "#dcae96": "tan-solid",
}

const getIceCreamColorOption = (value: string | undefined) => {
  if (typeof value !== "string" || !value.trim()) return undefined

  const normalized = value.trim().toLowerCase().replace(/\s+/g, " ")
  const directMatch = iceCreamColorOptions.find((option) => option.id === normalized)
  if (directMatch) return directMatch

  const labelMatch = iceCreamColorOptions.find((option) => option.label.toLowerCase() === normalized)
  if (labelMatch) return labelMatch

  const hexMatch = iceCreamHexAliases[normalized]
  const aliasMatch = iceCreamColorAliases.find(([alias]) => normalized.includes(alias))?.[1]
  return iceCreamColorOptions.find((option) => option.id === (hexMatch || aliasMatch))
}

const isIceCreamColor = (value: string | undefined) => Boolean(getIceCreamColorOption(value))

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
    id: "custom-decal",
    name: "Custom Decal",
    description: "Small-to-medium custom wording applied directly to the cart body",
    eyebrow: "Branding",
    details: ["Personalized lettering", "Sized for a refined finish"],
  },
  {
    id: "custom-wrap",
    name: "Custom Booth Wrap",
    description: "Custom branding or wrap treatment for the cart",
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
  {
    id: "charcuterie",
    name: "Charcuterie/Graze Cart",
    description: "Cheeses, meats, fruit, and grazing boards",
  },
  {
    id: "flower",
    name: "Flower Cart",
    description: "Styled blooms and floral offerings",
  },
  {
    id: "donut",
    name: "Donut Cart",
    description: "Tiered donut displays for events",
  },
  {
    id: "fruit",
    name: "Fruit Cart",
    description: "Fresh fruit displays and platters",
  },
  {
    id: "popcorn",
    name: "Popcorn Cart",
    description: "Popcorn service and snack styling",
  },
  {
    id: "candy",
    name: "Candy Cart",
    description: "Candy jars and sweet table styling",
  },
  { id: "crepe", name: "Crepe Cart", description: "Crepe service setup" },
  {
    id: "juice",
    name: "Juice Cart",
    description: "Fresh juice service and display",
  },
  {
    id: "custom-catering",
    name: "Custom Catering",
    description: "Tell us what catering experience you want",
  },
]

const getStoredAddOn = (cartData: CartBuilderData) => {
  if (cartData.addOn) return cartData.addOn
  if (cartData.roofDecor === "stripe-cloth" || cartData.roofDecor === "stripe-vinyl") return cartData.roofDecor
  if (cartData.design === "floral") return "floral"
  if (cartData.design === "custom" || cartData.design === "custom-wrap") return "custom-wrap"
  return ""
}

const getStoredAddOns = (cartData: CartBuilderData) => {
  if (Array.isArray(cartData.addOns) && cartData.addOns.length > 0) return cartData.addOns
  const storedAddOn = getStoredAddOn(cartData)
  return storedAddOn && storedAddOn !== "none" ? storedAddOn.split(",").filter(Boolean) : []
}

const getStoredHasAddOns = (cartData: CartBuilderData) => {
  return getStoredAddOns(cartData).length > 0
}

const mapAddOnsToCartData = (addOns: string[]) => {
  const roofDecor = addOns.includes("stripe-cloth") ? "stripe-cloth" : addOns.includes("stripe-vinyl") ? "stripe-vinyl" : "plain"
  const design = addOns.includes("custom-wrap") ? "custom-wrap" : addOns.includes("floral") ? "floral" : "none"

  return {
    addOn: addOns.length > 0 ? addOns.join(",") : "none",
    addOns,
    roofDecor,
    design,
  }
}

export function CartBuilderSection() {
  const [step, setStep] = useState(1)
  const { cartData, updateCartData, generateAICart, isGenerating } = useCartBuilder()
  const [selectedCartType, setSelectedCartType] = useState(cartData.cartType || "")
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(getStoredAddOns(cartData))
  const [hasAddOns, setHasAddOns] = useState(getStoredHasAddOns(cartData))
  const [hasCatering, setHasCatering] = useState(cartData.hasCatering)
  const [selectedCatering, setSelectedCatering] = useState<string[]>(cartData.catering || [])
  const [customCateringDetails, setCustomCateringDetails] = useState(cartData.customCateringDetails || "")
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(cartData.logo || null)
  const [decalText, setDecalText] = useState(cartData.decalText || "")
  const [uploadedDecalDesign, setUploadedDecalDesign] = useState<string | null>(cartData.decalDesignImage || null)
  const [isIceCreamColorPickerOpen, setIsIceCreamColorPickerOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const decalFileInputRef = useRef<HTMLInputElement>(null)

  const totalSteps = 4
  const [maxVisitedStep, setMaxVisitedStep] = useState(1)

  useEffect(() => {
    setSelectedCartType(cartData.cartType || "")
    setSelectedAddOns(getStoredAddOns(cartData))
    setHasAddOns(getStoredHasAddOns(cartData))
    setHasCatering(cartData.hasCatering)
    setSelectedCatering(cartData.catering || [])
    setCustomCateringDetails(cartData.customCateringDetails || "")
    setUploadedLogo(cartData.logo || null)
    setDecalText(cartData.decalText || "")
    setUploadedDecalDesign(cartData.decalDesignImage || null)
    if (cartData.cartType !== "ice-cream") setIsIceCreamColorPickerOpen(false)
  }, [cartData])

  const scrollToBuilder = () => {
    const builder = document.getElementById("cart-builder")
    if (builder) {
      const yOffset = -100
      const y = builder.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  const saveSelections = (cartTypeOverride?: string) => {
    const resolvedAddOns = hasAddOns ? selectedAddOns : []
    const mappedAddOn = mapAddOnsToCartData(resolvedAddOns)
    updateCartData({
      cartType: cartTypeOverride ?? selectedCartType,
      cartTop: "",
      addOn: mappedAddOn.addOn,
      addOns: mappedAddOn.addOns,
      roofDecor: mappedAddOn.roofDecor,
      design: mappedAddOn.design,
      hasCatering,
      catering: hasCatering ? selectedCatering : [],
      customCateringDetails: hasCatering && selectedCatering.includes("custom-catering") ? customCateringDetails : "",
      logo: resolvedAddOns.includes("custom-wrap") ? uploadedLogo : null,
      decalText: resolvedAddOns.includes("custom-decal") ? decalText : "",
      decalDesignImage: resolvedAddOns.includes("custom-decal") ? uploadedDecalDesign : null,
    })
  }

  const handleNext = () => {
    if (step < totalSteps) {
      saveSelections()
      setMaxVisitedStep((visited) => Math.max(visited, step + 1))
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

  const handleStepJump = (stepNum: number) => {
    if (stepNum === step || stepNum < 1 || stepNum > maxVisitedStep) return
    saveSelections()
    setStep(stepNum)
    setTimeout(() => scrollToBuilder(), 100)
  }

  const handleCartTypeSelect = (typeId: string) => {
    setSelectedCartType(typeId)
    setIsIceCreamColorPickerOpen(false)

    const nextAddOns =
      typeId === "ice-cream"
        ? selectedAddOns.filter((id) => id !== "stripe-cloth" && id !== "stripe-vinyl")
        : selectedAddOns
    if (typeId === "ice-cream") {
      setSelectedAddOns(nextAddOns)
      setHasAddOns(nextAddOns.length > 0)
    }

    const roofColor = cartData.colors?.roofColor
    const colors =
      typeId === "ice-cream"
        ? {
            ...cartData.colors,
            roofColor: getIceCreamColorOption(roofColor)?.id || defaultIceCreamColor,
          }
        : selectedCartType === "ice-cream" && cartData.colors
          ? { ...cartData.colors, roofColor: undefined }
          : cartData.colors

    updateCartData({
      cartType: typeId,
      colors,
      aiGeneratedImage: null,
      ...(typeId === "ice-cream" ? mapAddOnsToCartData(nextAddOns) : {}),
    })
  }

  const handleCartCardDoubleClick = (typeId: string) => {
    handleCartTypeSelect(typeId)
    saveSelections(typeId)
    setMaxVisitedStep((visited) => Math.max(visited, 2))
    setStep(2)
    setTimeout(() => scrollToBuilder(), 100)
  }

  const handleIceCreamColorSelect = (colorId: string) => {
    if (!isIceCreamColor(colorId)) return

    updateCartData({
      colors: {
        ...cartData.colors,
        roofColor: colorId,
      },
      aiGeneratedImage: null,
    })
  }

  const handleAddOnSelect = (addOnId: string) => {
    if (selectedCartType === "ice-cream" && (addOnId === "stripe-cloth" || addOnId === "stripe-vinyl")) return

    const isRemoving = selectedAddOns.includes(addOnId)
    let nextAddOns = isRemoving ? selectedAddOns.filter((id) => id !== addOnId) : [...selectedAddOns, addOnId]

    if (!isRemoving && addOnId === "stripe-cloth") {
      nextAddOns = nextAddOns.filter((id) => id !== "stripe-vinyl")
    } else if (!isRemoving && addOnId === "stripe-vinyl") {
      nextAddOns = nextAddOns.filter((id) => id !== "stripe-cloth")
    }

    if (!isRemoving && addOnId === "custom-wrap") {
      nextAddOns = nextAddOns.filter((id) => id !== "stripe-vinyl" && id !== "custom-decal")
    } else if (!isRemoving && (addOnId === "stripe-vinyl" || addOnId === "custom-decal")) {
      nextAddOns = nextAddOns.filter((id) => id !== "custom-wrap")
    }

    const mappedAddOn = mapAddOnsToCartData(nextAddOns)
    const nextLogo = nextAddOns.includes("custom-wrap") ? uploadedLogo : null
    const nextDecalText = nextAddOns.includes("custom-decal") ? decalText : ""
    const nextDecalDesign = nextAddOns.includes("custom-decal") ? uploadedDecalDesign : null

    setHasAddOns(true)
    setSelectedAddOns(nextAddOns)
    if (!nextAddOns.includes("custom-wrap")) {
      setUploadedLogo(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
    if (!nextAddOns.includes("custom-decal")) {
      setDecalText("")
      setUploadedDecalDesign(null)
      if (decalFileInputRef.current) decalFileInputRef.current.value = ""
    }

    updateCartData({
      addOn: mappedAddOn.addOn,
      addOns: mappedAddOn.addOns,
      roofDecor: mappedAddOn.roofDecor,
      design: mappedAddOn.design,
      logo: nextLogo,
      decalText: nextDecalText,
      decalDesignImage: nextDecalDesign,
      aiGeneratedImage: null,
    })
  }

  const handleAddOnMode = (enabled: boolean) => {
    if (enabled === hasAddOns) return

    setHasAddOns(enabled)

    if (!enabled) {
      const noAddOn = mapAddOnsToCartData([])
      setSelectedAddOns([])
      setUploadedLogo(null)
      setDecalText("")
      setUploadedDecalDesign(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      if (decalFileInputRef.current) decalFileInputRef.current.value = ""
      updateCartData({
        addOn: noAddOn.addOn,
        addOns: noAddOn.addOns,
        roofDecor: noAddOn.roofDecor,
        design: noAddOn.design,
        logo: null,
        decalText: "",
        decalDesignImage: null,
        aiGeneratedImage: null,
      })
      return
    }

    setSelectedAddOns([])
    setUploadedLogo(null)
    setDecalText("")
    setUploadedDecalDesign(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (decalFileInputRef.current) decalFileInputRef.current.value = ""
  }

  const handleCateringMode = (enabled: boolean) => {
    setHasCatering(enabled)
    if (!enabled) {
      setSelectedCatering([])
      setCustomCateringDetails("")
      updateCartData({
        hasCatering: false,
        catering: [],
        customCateringDetails: "",
        aiGeneratedImage: null,
      })
      return
    }
    updateCartData({ hasCatering: true, aiGeneratedImage: null })
  }

  const handleCateringToggle = (optionId: string) => {
    const nextSelection = selectedCatering.includes(optionId) ? selectedCatering.filter((item) => item !== optionId) : [...selectedCatering, optionId]

    setSelectedCatering(nextSelection)
    if (!nextSelection.includes("custom-catering")) {
      setCustomCateringDetails("")
    }
    updateCartData({
      hasCatering: true,
      catering: nextSelection,
      customCateringDetails: nextSelection.includes("custom-catering") ? customCateringDetails : "",
      aiGeneratedImage: null,
    })
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

  const handleDecalDesignUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setDecalText("")
      setUploadedDecalDesign(result)
      updateCartData({ decalText: "", decalDesignImage: result, aiGeneratedImage: null })
    }
    reader.readAsDataURL(file)
  }

  const scrollToContact = () => {
    saveSelections()
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  const selectedCart = cartTypes.find((cart) => cart.id === selectedCartType)
  const selectedIceCreamColor = getIceCreamColorOption(cartData.colors?.roofColor) || iceCreamColorOptions.find((option) => option.id === defaultIceCreamColor)!
  const selectedAddOnOptions = addOnOptions.filter((option) => selectedAddOns.includes(option.id))
  const isNextDisabled =
    (step === 1 && !selectedCartType) ||
    (step === 2 &&
      hasAddOns &&
      (selectedAddOns.length === 0 ||
        (selectedAddOns.includes("stripe-vinyl") && !cartData.colors?.roofColor?.trim()) ||
        (selectedAddOns.includes("custom-decal") && !decalText.trim() && !uploadedDecalDesign))) ||
    (step === 3 && (hasCatering === undefined || (hasCatering && selectedCatering.length === 0)))

  const getNextButtonLabel = () => {
    if (step === 1) return "Continue to Add Ons"
    if (step === 2) return "Continue to Catering"
    if (step === 3) return "Continue to Review"
    return "Contact Us"
  }

  return (
    <section
      id="cart-builder"
      className={`scroll-mt-16 bg-[#fcfbf8] pt-5 pb-10 md:scroll-mt-20 md:pt-8 md:pb-14 lg:pt-10 lg:pb-16 ${step === 1 ? "[&_h2]:text-[#24211d] [&_h3]:text-[#24211d] [&_h4]:text-[#24211d] [&_p]:text-[#49443d]" : ""}`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-5 md:mb-8 space-y-2 md:space-y-3">
          <h2 className="font-serif text-[26px] leading-[1.05] md:text-[36px] lg:text-[44px] font-bold text-foreground text-balance">Build Your Cart</h2>
          <div className="w-16 md:w-24 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="max-w-3xl md:max-w-4xl mx-auto mb-3 md:mb-5 rounded-[20px] md:rounded-[24px] border border-border/70 bg-card/80 px-3 py-2 md:px-5 md:py-3 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNum) => {
              const stepLabel = stepNum === 1 ? "Choose Cart" : stepNum === 2 ? "Add Ons" : stepNum === 3 ? "Add Catering" : "Review"
              const isClickable = stepNum !== step && stepNum <= maxVisitedStep
              return (
                <div key={stepNum} className="flex items-center flex-1">
                  <button
                    type="button"
                    disabled={!isClickable}
                    onClick={() => handleStepJump(stepNum)}
                    aria-label={isClickable ? `Go back to step ${stepNum}: ${stepLabel}` : `Step ${stepNum}: ${stepLabel}`}
                    aria-current={step === stepNum ? "step" : undefined}
                    title={isClickable ? `Go back to ${stepLabel}` : undefined}
                    className={`flex flex-col items-center flex-1 rounded-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      isClickable ? "cursor-pointer hover:opacity-75" : "cursor-default"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-semibold transition-all duration-300 ${
                        step >= stepNum ? "bg-accent text-foreground shadow-[0_10px_24px_rgba(0,0,0,0.08)]" : "bg-muted text-muted-foreground"
                      } ${isClickable ? "ring-2 ring-accent/40 ring-offset-2 ring-offset-background" : ""}`}
                    >
                      {stepNum}
                    </div>
                    <p className="text-[9px] md:text-xs mt-1 md:mt-2 text-center font-medium hidden sm:block">
                      {stepLabel}
                    </p>
                  </button>
                  {stepNum < totalSteps && <div className={`h-0.5 md:h-1 flex-1 mx-1 md:mx-2 transition-all duration-300 ${step > stepNum ? "bg-accent" : "bg-muted"}`} />}
                </div>
              )
            })}
          </div>
        </div>

        <div className="max-w-3xl md:max-w-4xl mx-auto">
          <Card
            className={`overflow-hidden rounded-[24px] md:rounded-[28px] border border-border/70 ${step === 1 ? "bg-[#f7f4ee] !pt-1.5 md:!pt-0" : "bg-card"} shadow-[0_24px_80px_rgba(15,23,42,0.08)]`}
          >
            <CardContent className={step === 1 ? "px-3 pt-3 pb-4 md:px-5 md:pt-5 md:pb-6 lg:px-6 lg:pt-6 lg:pb-7" : "p-4 md:p-6 lg:p-7"}>
              {step === 1 && (
                <div className="cart-step-enter">
                  <div className="text-center space-y-2 mb-2 md:mb-3">
                    <div className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:px-4 md:text-[11px] md:tracking-[0.22em]">
                      Step 1 of 4
                    </div>
                    <h3 className="text-[22px] md:text-2xl lg:text-[28px] font-serif font-bold text-foreground">Choose Your Cart</h3>
                    <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                      Start with the cart silhouette that best fits your event footprint, service style, and overall look.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:gap-6 max-w-3xl mx-auto">
                    {cartTypes.map((cart) => (
                      <div key={cart.id} className="flex flex-col min-w-0">
                        <h4 className="pt-0 pb-1.5 md:pt-1 md:pb-4 text-center text-base md:text-lg font-serif font-bold leading-snug text-foreground/70">{cart.eyebrow}</h4>
                        <Card
                          className={`group cursor-pointer overflow-hidden rounded-[22px] md:rounded-[28px] border bg-white transition-all duration-300 flex flex-col gap-3 md:gap-6 py-3 md:py-6 ${
                            cart.id === "classic" ? `${signatureStyles.signature} ${signatureScript.variable}` : `${signatureStyles.horizontal} ${signatureScript.variable}`
                          } ${
                            selectedCartType === cart.id
                              ? "border-accent !bg-[#f8eef3] ring-2 ring-accent/60 ring-offset-2 ring-offset-[#f7f4ee] shadow-[0_18px_50px_rgba(15,23,42,0.10)] -translate-y-1"
                              : "border-border/70 hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
                          }`}
                          onClick={() => handleCartTypeSelect(cart.id)}
                          onDoubleClick={() => handleCartCardDoubleClick(cart.id)}
                          title="Double-click to continue to Add Ons"
                        >
                          <div className="w-full shrink-0 px-0 md:px-6 py-1 md:py-3">
                            <div className="relative mx-auto w-[88%] h-[min(38vw,150px)] md:w-full md:h-72">
                              <Image
                                src={cart.image}
                                alt={cart.name}
                                fill={cart.id !== "classic"}
                                width={cart.id === "classic" ? 1080 : undefined}
                                height={cart.id === "classic" ? 1350 : undefined}
                                unoptimized={cart.id === "classic"}
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                className="object-contain object-center p-0 md:p-1 transition-transform duration-500 group-hover:scale-[1.03]"
                              />
                              {cart.id === "ice-cream" && (
                                <span className="absolute left-1/2 top-[64%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-sans text-[9px] not-italic" style={{ color: "#0d211b" }}>
                                  GELATO
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="px-3 py-1.5 md:p-6 space-y-2 md:space-y-4 flex-1 flex flex-col justify-center">
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1.5">
                                <h4 className="font-bold text-base md:text-xl text-foreground">{cart.name}</h4>
                                <p className="text-sm leading-relaxed text-muted-foreground">{cart.description}</p>
                              </div>
                              <div
                                className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                                  selectedCartType === cart.id ? "border-accent bg-accent shadow-[0_0_0_4px_rgba(0,0,0,0.04)]" : "border-border bg-background"
                                }`}
                              >
                                <div className={`h-2.5 w-2.5 rounded-full ${selectedCartType === cart.id ? "bg-foreground" : "bg-transparent"}`} />
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {cart.highlights.map((highlight) => (
                                <span
                                  key={highlight}
                                  className="inline-flex items-center rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[11px] md:text-xs font-medium text-foreground/70"
                                >
                                  {highlight}
                                </span>
                              ))}
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>

                   <div className="cart-collapse" data-open={selectedCartType === "ice-cream"} aria-hidden={!(selectedCartType === "ice-cream")}>
                     <div className="cart-collapse-inner">
                       <div className="pt-2 md:pt-3">
                         <div className="max-w-2xl mx-auto">
                       <button
                         type="button"
                         aria-controls="ice-cream-color-options"
                         aria-expanded={isIceCreamColorPickerOpen}
                         aria-label={`Choose ice cream cart canopy color. Currently ${selectedIceCreamColor.label}`}
                         data-testid="button-ice-cream-color-toggle"
                         className="w-full rounded-[18px] md:rounded-[22px] border border-accent bg-[#f8eef3] p-3.5 md:p-5 text-left ring-2 ring-accent/60 ring-offset-2 ring-offset-[#f7f4ee] shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-all duration-300"
                         onClick={() => setIsIceCreamColorPickerOpen((open) => !open)}
                       >
                         <div className="flex flex-row items-center justify-between gap-3 sm:gap-4">
                           <div className="space-y-1.5">
                            <h4 className="text-base md:text-lg font-bold text-foreground">
                              Canopy Color
                            </h4>
                             <p className="text-xs md:text-sm text-foreground/70">Currently selected: {selectedIceCreamColor.label}</p>
                           </div>
                           <div className="flex items-center gap-3">
                             <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent bg-accent shadow-[0_0_0_4px_rgba(0,0,0,0.04)]">
                               <div className="h-2.5 w-2.5 rounded-full bg-foreground" />
                             </div>
                             <ChevronDown className={`h-5 w-5 shrink-0 text-foreground transition-transform duration-300 ${isIceCreamColorPickerOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                           </div>
                         </div>
                       </button>

                       <div className="cart-collapse" data-open={isIceCreamColorPickerOpen} aria-hidden={!(isIceCreamColorPickerOpen)}>
                         <div className="cart-collapse-inner">
                           <div className="pt-3 md:pt-4">
                         <div
                           id="ice-cream-color-options"
                           role="radiogroup"
                           aria-label="Ice cream cart canopy color options"
                           data-testid="radiogroup-ice-cream-colors"
                           className="max-h-96 space-y-2 overflow-y-auto rounded-[20px] border border-border/70 bg-card p-2 shadow-[0_16px_40px_rgba(15,23,42,0.06)] md:space-y-3 md:p-3"
                         >
                           {iceCreamColorOptions.map((option) => {
                             const isSelected = selectedIceCreamColor.id === option.id

                             return (
                               <button
                                 key={option.id}
                                 type="button"
                                 role="radio"
                                 aria-checked={isSelected}
                                 aria-label={`Select ${option.label} canopy`}
                                 data-testid={`radio-ice-cream-color-${option.id}`}
                                 className={`flex w-full items-center gap-3 rounded-[16px] border p-2 text-left transition-all duration-300 md:gap-4 md:p-3 ${
                                   isSelected
                                     ? "border-accent !bg-[#f8eef3] ring-2 ring-accent/60 ring-offset-1 ring-offset-background shadow-[0_12px_28px_rgba(0,0,0,0.08)]"
                                     : "border-border/70 bg-card hover:border-accent/50 hover:bg-muted/20"
                                 }`}
                                 onClick={() => handleIceCreamColorSelect(option.id)}
                               >
                                 <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-[12px] border border-border/60 bg-muted/20 md:h-20 md:w-24">
                                   <Image
                                     src={option.image}
                                     alt={`${option.label} ice cream cart canopy`}
                                     fill
                                     sizes="96px"
                                     className="object-contain"
                                     data-testid={`img-ice-cream-color-${option.id}`}
                                   />
                                 </div>
                                 <span className="min-w-0 flex-1 text-sm font-semibold text-foreground md:text-base">{option.label}</span>
                                 <span
                                   className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                                     isSelected ? "border-accent bg-accent shadow-[0_0_0_4px_rgba(0,0,0,0.04)]" : "border-foreground/20 bg-white/70"
                                   }`}
                                   aria-hidden="true"
                                 >
                                   <span className={`h-2.5 w-2.5 rounded-full ${isSelected ? "bg-foreground" : "bg-transparent"}`} />
                                 </span>
                               </button>
                             )
                           })}
                         </div>
                           </div>
                         </div>
                       </div>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5 md:space-y-6 cart-step-enter">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:px-4 md:text-[11px] md:tracking-[0.22em]">
                      Step 2 of 4
                    </div>
                    <h3 className="text-[22px] md:text-2xl lg:text-[28px] font-serif font-bold text-foreground">Add Ons</h3>
                  </div>

                  <div className="max-w-2xl mx-auto">
                    <div className="grid sm:grid-cols-2 gap-x-3 gap-y-0 md:gap-x-4">
                      <button
                        type="button"
                        className={`w-full self-start rounded-[18px] md:rounded-[22px] border p-3.5 md:p-5 text-left transition-all duration-300 ${
                          hasAddOns
                            ? "border-accent !bg-[#f8eef3] ring-2 ring-accent/60 ring-offset-2 ring-offset-background shadow-[0_16px_40px_rgba(15,23,42,0.08)] -translate-y-1"
                            : "border-border/70 bg-card hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
                        }`}
                        onClick={() => handleAddOnMode(true)}
                      >
                        <div className="flex flex-row items-center justify-between gap-3 sm:gap-4">
                          <div className="min-w-0 flex-1 space-y-3">
                            <div>
                              <h4
                                className={`text-xl md:text-2xl font-semibold leading-[1.3] pb-1 break-words text-foreground ${signatureScript.variable}`}
                                style={{
                                  fontFamily: "var(--signature-script)",
                                }}
                              >
                                Add Ons
                              </h4>
                            </div>
                          </div>
                          <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${hasAddOns ? "border-accent bg-accent" : "border-border bg-background"}`}>
                            <div className={`h-2.5 w-2.5 rounded-full ${hasAddOns ? "bg-foreground" : "bg-transparent"}`} />
                          </div>
                        </div>
                      </button>

                      <div className="cart-collapse sm:col-span-2" data-open={hasAddOns} aria-hidden={!hasAddOns}>
                        <div className="cart-collapse-inner">
                          <div className="pt-3 md:pt-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                            {addOnOptions
                              .filter(
                                (option) =>
                                  option.id !== "none" &&
                                  (selectedCartType !== "ice-cream" ||
                                    (option.id !== "stripe-cloth" && option.id !== "stripe-vinyl"))
                              )
                              .map((option) => {
                                const isSelected = selectedAddOns.includes(option.id)
                                const isFullWidth = option.id === "custom-wrap"

                                return (
                                  <div key={option.id} className={option.id === "custom-wrap" ? "w-full min-w-0 sm:col-span-2" : "w-full min-w-0"}>
                                    <Card
                                      className={`${option.id === "stripe-vinyl" ? "" : "h-full"} cursor-pointer overflow-hidden rounded-[16px] md:rounded-[18px] border bg-card py-0 transition-all duration-300 ${
                                        isSelected
                                          ? "border-accent !bg-[#f8eef3] ring-2 ring-accent/60 ring-offset-2 ring-offset-background shadow-[0_18px_50px_rgba(0,0,0,0.10)] -translate-y-1"
                                          : "border-border/70 hover:border-accent/50 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                                      }`}
                                      onClick={() => handleAddOnSelect(option.id)}
                                    >
                                      <div className={`relative h-full overflow-hidden py-2 pl-3 pr-10 ${isSelected ? "bg-[#f8eef3]" : "bg-gradient-to-br from-white via-muted/15 to-white"}`}>
                                        <div className="absolute inset-x-0 top-0 h-px bg-accent/20" />
                                        <div
                                          className={`absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-300 ${
                                            isSelected ? "border-accent bg-accent shadow-[0_0_0_4px_rgba(0,0,0,0.04)]" : "border-foreground/20 bg-white/70"
                                          }`}
                                        >
                                          <div className={`h-2 w-2 rounded-full ${isSelected ? "bg-foreground" : "bg-transparent"}`} />
                                        </div>

                                        <div className="space-y-1 min-w-0 flex-1">
                                          <h4 className={`break-words pr-1 font-serif text-sm md:text-base leading-snug text-foreground ${isFullWidth ? "text-center" : ""}`}>{option.name}</h4>
                                          <p className={`break-words text-[11px] md:text-xs leading-relaxed text-foreground/72 ${isFullWidth ? "text-center" : ""}`}>{option.description}</p>
                                        </div>
                                      </div>
                                    </Card>

                                    <div className="cart-collapse" data-open={option.id === "stripe-vinyl" && isSelected} aria-hidden={!(option.id === "stripe-vinyl" && isSelected)}>
                                      <div className="cart-collapse-inner">
                                        <div className="pt-3 md:pt-4">
                                          <div className="flex items-center gap-3 rounded-[20px] md:rounded-[22px] border border-border/80 bg-card p-4 md:p-5 shadow-[0_16px_42px_rgba(15,23,42,0.06)]">
                                            <label htmlFor="vinyl-roof-color" className="block shrink-0 text-[10px] md:text-xs leading-relaxed text-foreground/72">
                                              Color:
                                            </label>
                                            <input
                                              id="vinyl-roof-color"
                                              type="text"
                                              value={cartData.colors?.roofColor || ""}
                                              onChange={(event) =>
                                                updateCartData({
                                                  colors: {
                                                    ...cartData.colors,
                                                    roofColor: event.target.value,
                                                  },
                                                  aiGeneratedImage: null,
                                                })
                                              }
                                              placeholder="Enter your color"
                                              maxLength={50}
                                              className="flex h-8 w-full min-w-0 max-w-xs rounded-md border-2 border-accent/60 bg-white px-2 py-1 text-[10px] md:text-xs leading-relaxed text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                          </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`w-full self-start rounded-[18px] md:rounded-[22px] border p-3.5 md:p-5 text-left transition-all duration-300 sm:col-start-2 sm:row-start-1 ${
                          !hasAddOns
                            ? "border-accent !bg-[#f8eef3] ring-2 ring-accent/60 ring-offset-2 ring-offset-background shadow-[0_16px_40px_rgba(15,23,42,0.08)] -translate-y-1"
                            : "border-border/70 bg-card hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
                        }`}
                        onClick={() => handleAddOnMode(false)}
                      >
                        <div className="flex flex-row items-center justify-between gap-3 sm:gap-4">
                          <div className="min-w-0 flex-1 space-y-3">
                            <div>
                              <h4
                                className={`text-xl md:text-2xl font-semibold leading-[1.3] pb-1 break-words text-foreground ${signatureScript.variable}`}
                                style={{
                                  fontFamily: "var(--signature-script)",
                                }}
                              >
                                No Add Ons
                              </h4>
                            </div>
                          </div>
                          <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${!hasAddOns ? "border-accent bg-accent" : "border-border bg-background"}`}>
                            <div className={`h-2.5 w-2.5 rounded-full ${!hasAddOns ? "bg-foreground" : "bg-transparent"}`} />
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="cart-collapse" data-open={hasAddOns && selectedAddOns.includes("custom-decal")} aria-hidden={!(hasAddOns && selectedAddOns.includes("custom-decal"))}>
                    <div className="cart-collapse-inner">
                      <div className="pt-3 md:pt-4">
                    <div className="space-y-4 md:space-y-6 rounded-[20px] md:rounded-[24px] border border-border/80 bg-card p-4 md:p-5 shadow-[0_16px_42px_rgba(15,23,42,0.06)]">
                      <div className="space-y-2">
                        <label htmlFor="decal-text" className="font-serif text-[13px] font-bold text-foreground">Decal text</label>
                        <Textarea
                          id="decal-text"
                          value={decalText}
                          maxLength={120}
                          rows={2}
                          placeholder="Enter the exact text for your decal"
                          className="text-sm placeholder:text-sm placeholder:text-muted-foreground"
                          onChange={(event) => {
                            const value = event.target.value
                            setDecalText(value)
                            if (value) {
                              setUploadedDecalDesign(null)
                              if (decalFileInputRef.current) decalFileInputRef.current.value = ""
                            }
                            updateCartData({
                              decalText: value,
                              decalDesignImage: value ? null : uploadedDecalDesign,
                              aiGeneratedImage: null,
                            })
                          }}
                        />
                      </div>

                      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        <div className="h-px flex-1 bg-border" />
                        Or upload an image
                        <div className="h-px flex-1 bg-border" />
                      </div>

                      <div
                        className="rounded-[18px] md:rounded-[22px] border-2 border-dashed border-border bg-muted/15 hover:border-accent p-5 md:p-8 text-center cursor-pointer transition-colors duration-300"
                        onClick={() => decalFileInputRef.current?.click()}
                      >
                        <input ref={decalFileInputRef} type="file" className="hidden" accept="image/*" onChange={handleDecalDesignUpload} />
                        {uploadedDecalDesign ? (
                          <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-4">
                            <Image src={uploadedDecalDesign} alt="Uploaded decal design" fill className="object-contain" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 md:w-16 md:h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                            <Upload className="w-7 h-7 md:w-8 md:h-8" />
                          </div>
                        )}
                        <p className="font-medium text-foreground mb-1">{uploadedDecalDesign ? "Change Design" : "Click to upload design"}</p>
                        <p className="text-sm text-muted-foreground">PNG, JPG, or SVG</p>
                      </div>

                      {uploadedDecalDesign && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setUploadedDecalDesign(null)
                            updateCartData({
                              decalDesignImage: null,
                              aiGeneratedImage: null,
                            })
                            if (decalFileInputRef.current) decalFileInputRef.current.value = ""
                          }}
                          className="w-full"
                        >
                          Remove Design
                        </Button>
                      )}
                    </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5 md:space-y-6 cart-step-enter">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:px-4 md:text-[11px] md:tracking-[0.22em]">
                      Step 3 of 4
                    </div>
                    <h3 className="text-[22px] md:text-2xl lg:text-[28px] font-serif font-bold text-foreground">Add Catering?</h3>
                  </div>

                  <div className="max-w-2xl mx-auto">
                    <div className="grid sm:grid-cols-2 gap-x-3 gap-y-0 md:gap-x-4">
                        <button
                          type="button"
                          className={`w-full self-start rounded-[18px] md:rounded-[22px] border p-3.5 md:p-5 text-left transition-all duration-300 ${
                            hasCatering
                              ? "border-accent !bg-[#f8eef3] ring-2 ring-accent/60 ring-offset-2 ring-offset-background shadow-[0_16px_40px_rgba(15,23,42,0.08)] -translate-y-1"
                              : "border-border/70 bg-card hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
                          }`}
                          onClick={() => handleCateringMode(true)}
                        >
                          <div className="flex flex-row items-center justify-between gap-3 sm:gap-4">
                            <div className="min-w-0 flex-1 space-y-3">
                              <div>
                                <h4
                                  className={`text-xl md:text-2xl font-semibold leading-[1.3] pb-1 break-words text-foreground ${signatureScript.variable}`}
                                  style={{
                                    fontFamily: "var(--signature-script)",
                                  }}
                                >
                                  Add Catering
                                </h4>
                              </div>
                            </div>
                            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${hasCatering ? "border-accent bg-accent" : "border-border bg-background"}`}>
                              <div className={`h-2.5 w-2.5 rounded-full ${hasCatering ? "bg-foreground" : "bg-transparent"}`} />
                            </div>
                          </div>
                        </button>
                      <button
                        type="button"
                        className={`w-full self-start rounded-[18px] md:rounded-[22px] border p-3.5 md:p-5 text-left transition-all duration-300 ${
                          !hasCatering
                            ? "border-accent !bg-[#f8eef3] ring-2 ring-accent/60 ring-offset-2 ring-offset-background shadow-[0_16px_40px_rgba(15,23,42,0.08)] -translate-y-1"
                            : "border-border/70 bg-card hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
                        }`}
                        onClick={() => handleCateringMode(false)}
                      >
                        <div className="flex flex-row items-center justify-between gap-3 sm:gap-4">
                          <div className="min-w-0 flex-1 space-y-3">
                            <div>
                              <h4
                                className={`text-xl md:text-2xl font-semibold leading-[1.3] pb-1 break-words text-foreground ${signatureScript.variable}`}
                                style={{
                                  fontFamily: "var(--signature-script)",
                                }}
                              >
                                No Catering
                              </h4>
                            </div>
                          </div>
                          <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${!hasCatering ? "border-accent bg-accent" : "border-border bg-background"}`}>
                            <div className={`h-2.5 w-2.5 rounded-full ${!hasCatering ? "bg-foreground" : "bg-transparent"}`} />
                          </div>
                        </div>
                      </button>
                    </div>
                            <div className="cart-collapse" data-open={hasCatering} aria-hidden={!(hasCatering)}>
                              <div className="cart-collapse-inner">
                                <div className="pt-3 md:pt-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                                  {cateringOptions.map((option) => {
                                    const isSelected = selectedCatering.includes(option.id)
                                const isFullWidth = option.id === "custom-catering"

                                    return (
                                      <Card
                                        key={option.id}
                                        className={`${option.id === "custom-catering" ? "sm:col-span-2 " : ""}h-full cursor-pointer overflow-hidden rounded-[16px] md:rounded-[18px] border bg-card py-0 transition-all duration-300 ${
                                          isSelected
                                            ? "border-accent !bg-[#f8eef3] ring-2 ring-accent/60 ring-offset-2 ring-offset-background shadow-[0_18px_50px_rgba(0,0,0,0.10)] -translate-y-1"
                                            : "border-border/70 hover:border-accent/50 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                                        }`}
                                        onClick={() => handleCateringToggle(option.id)}
                                      >
                                        <div className={`relative h-full overflow-hidden py-2 pl-3 pr-10 ${isSelected ? "bg-[#f8eef3]" : "bg-gradient-to-br from-white via-muted/15 to-white"}`}>
                                          <div className="absolute inset-x-0 top-0 h-px bg-accent/20" />
                                          <div
                                            className={`absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-300 ${
                                              isSelected ? "border-accent bg-accent shadow-[0_0_0_4px_rgba(0,0,0,0.04)]" : "border-foreground/20 bg-white/70"
                                            }`}
                                          >
                                            <div className={`h-2 w-2 rounded-full ${isSelected ? "bg-foreground" : "bg-transparent"}`} />
                                          </div>

                                          <div className="space-y-1 min-w-0 flex-1">
                                            <h4
                                              className={`break-words pr-1 font-serif text-sm md:text-base leading-snug text-foreground ${isFullWidth ? "text-center" : ""}`}
                                            >
                                              {option.name}
                                            </h4>
                                            <p className={`break-words text-[11px] md:text-xs leading-relaxed text-foreground/72 ${isFullWidth ? "text-center" : ""}`}>{option.description}</p>
                                          </div>
                                        </div>
                                      </Card>
                                    )
                                  })}
                                </div>

                                <div className="cart-collapse" data-open={hasCatering && selectedCatering.includes("custom-catering")} aria-hidden={!(hasCatering && selectedCatering.includes("custom-catering"))}>
                                  <div className="cart-collapse-inner">
                                    <div className="pt-3 md:pt-4">
                                    <Textarea
                                      id="custom-catering-details"
                                      value={customCateringDetails}
                                      onChange={(event) => {
                                        const value = event.target.value
                                        setCustomCateringDetails(value)
                                        updateCartData({
                                          customCateringDetails: value,
                                          aiGeneratedImage: null,
                                        })
                                      }}
                                      placeholder="Describe the catering experience you want"
                                      className="min-h-28 resize-y"
                                    />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              </div>
                            </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-5 md:space-y-6 cart-step-enter">
                  <div className="text-center space-y-3">
                    <h3 className="text-[22px] md:text-2xl lg:text-[28px] font-serif font-bold text-foreground">Review Your Cart</h3>
                  </div>

                  <div className="max-w-2xl mx-auto space-y-4 md:space-y-5">
                    <div className="rounded-[22px] md:rounded-[28px] border border-border/80 bg-card p-4 md:p-6 shadow-[0_18px_44px_rgba(15,23,42,0.06)] space-y-4">
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
                        className="w-full bg-accent text-foreground hover:bg-accent/90 font-bold rounded-xl md:rounded-2xl min-h-[48px] md:min-h-[52px] text-sm md:text-lg shadow-[0_16px_36px_rgba(15,23,42,0.10)] transition-all duration-300"
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
                    </div>

                    {cartData.aiGeneratedImage && (
                      <div className="w-full max-w-2xl mx-auto mb-6 md:mb-8">
                        <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl border-4 border-accent/30">
                          <div className="absolute top-3 left-3 md:top-4 md:left-4 z-30 bg-accent/90 text-foreground text-[11px] md:text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            AI Generated Preview
                          </div>

                          <Image src={cartData.aiGeneratedImage} alt="AI Generated Cart" fill className="object-cover" />
                        </div>
                        <p className="mt-4 rounded-xl border border-accent/30 bg-[#f8eef3] px-4 py-3 text-center text-xs leading-relaxed text-foreground/75 md:text-sm">
                          This AI-generated image is for inspiration only and may not reflect the exact final setup. To see
                          our actual work, visit our{" "}
                          <a href="#gallery" className="font-bold text-[#976781] underline underline-offset-4 hover:text-foreground">
                            Gallery
                          </a>
                          .
                        </p>
                      </div>
                    )}

                    <Card className="rounded-[22px] md:rounded-[28px] border border-border/80 bg-card shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                      <CardContent className="p-4 md:p-5">
                        <div className="flex items-start justify-between gap-3 border-b border-border/70 pb-4 md:pb-5">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm md:text-base font-bold uppercase tracking-[0.16em] leading-snug text-muted-foreground">Cart Type</h4>
                            <p className="mt-2 flex items-start gap-2 pl-3 pr-1 text-sm md:text-base font-normal leading-relaxed text-foreground">
                              <Heart className="mt-1 h-4 w-4 shrink-0 fill-[#976781] text-[#976781]" />
                              <span className="min-w-0 flex-1 break-words">{selectedCart?.name || "Not selected"}</span>
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setStep(1)
                              setTimeout(() => scrollToBuilder(), 100)
                            }}
                            className="h-9 shrink-0 rounded-full px-3 text-xs"
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>

                        {selectedCartType === "ice-cream" && (
                          <div className="flex items-start justify-between gap-3 border-b border-border/70 py-4 md:py-5">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm md:text-base font-bold uppercase tracking-[0.16em] leading-snug text-muted-foreground">Canopy Color</h4>
                              <p className="mt-2 flex items-start gap-2 pl-3 pr-1 text-sm md:text-base font-normal leading-relaxed text-foreground">
                                <Heart className="mt-1 h-4 w-4 shrink-0 fill-[#976781] text-[#976781]" />
                                <span data-testid="text-ice-cream-color-review" className="min-w-0 flex-1 break-words">{selectedIceCreamColor.label}</span>
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setStep(1)
                                setIsIceCreamColorPickerOpen(true)
                                setTimeout(() => scrollToBuilder(), 100)
                              }}
                              className="h-9 shrink-0 rounded-full px-3 text-xs"
                            >
                              <Edit2 className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        )}

                        <div className="flex items-start justify-between gap-3 border-b border-border/70 py-4 md:py-5">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm md:text-base font-bold uppercase tracking-[0.16em] leading-snug text-muted-foreground">Add Ons</h4>
                            <div className="mt-2 space-y-2 pl-3 pr-1 text-sm md:text-base font-normal leading-relaxed text-foreground">
                              {(selectedAddOnOptions.length > 0
                                ? selectedAddOnOptions.map((option) =>
                                    option.id === "stripe-vinyl" && cartData.colors?.roofColor?.trim()
                                      ? `${option.name} - ${cartData.colors.roofColor.trim()}`
                                      : option.name
                                  )
                                : ["No Add Ons"]
                              ).map((name) => (
                                <p key={name} className="flex items-start gap-2">
                                  <Heart className="mt-1 h-4 w-4 shrink-0 fill-[#976781] text-[#976781]" />
                                  <span className="min-w-0 flex-1 break-words">{name}</span>
                                </p>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setStep(2)
                              setTimeout(() => scrollToBuilder(), 100)
                            }}
                            className="h-9 shrink-0 rounded-full px-3 text-xs"
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>

                        <div className="flex items-start justify-between gap-3 pt-4 md:pt-5">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm md:text-base font-bold uppercase tracking-[0.16em] leading-snug text-muted-foreground">Catering</h4>
                            <div className="mt-2 space-y-2 pl-3 pr-1 text-sm md:text-base font-normal leading-relaxed text-foreground">
                              {(hasCatering ? selectedCatering.map((type) => cateringOptions.find((option) => option.id === type)?.name).filter(Boolean) : ["No Catering"]).map((name) => (
                                <p key={name} className="flex items-start gap-2">
                                  <Heart className="mt-1 h-4 w-4 shrink-0 fill-[#976781] text-[#976781]" />
                                  <span className="min-w-0 flex-1 break-words">{name}</span>
                                </p>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setStep(3)
                              setTimeout(() => scrollToBuilder(), 100)
                            }}
                            className="h-9 shrink-0 rounded-full px-3 text-xs"
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>

                        {selectedAddOns.includes("custom-wrap") && uploadedLogo && (
                          <div className="border-t border-border pt-4">
                            <h4 className="font-semibold text-xs md:text-sm text-muted-foreground mb-3">Uploaded Logo</h4>
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                              <Image src={uploadedLogo} alt="Uploaded logo" fill className="object-contain" />
                            </div>
                          </div>
                        )}

                        {selectedAddOns.includes("custom-decal") && uploadedDecalDesign && (
                          <div className="border-t border-border pt-4">
                            <h4 className="font-semibold text-xs md:text-sm text-muted-foreground mb-3">Uploaded Decal Design</h4>
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                              <Image src={uploadedDecalDesign} alt="Uploaded decal design" fill className="object-contain" />
                            </div>
                          </div>
                        )}

                        {selectedAddOns.includes("custom-decal") && decalText.trim() && (
                          <div className="border-t border-border pt-4">
                            <h4 className="font-semibold text-xs md:text-sm text-muted-foreground mb-1">Custom Decal Text</h4>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{decalText.trim()}</p>
                          </div>
                        )}

                        {selectedCatering.includes("custom-catering") && customCateringDetails && (
                          <div className="border-t border-border pt-4">
                            <h4 className="font-semibold text-xs md:text-sm text-muted-foreground mb-1">Custom Catering Details</h4>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{customCateringDetails}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              <div className="mt-6 md:mt-8 rounded-[20px] md:rounded-[24px] border border-border/70 bg-muted/20 p-3 md:p-4 space-y-3 md:space-y-4">
                {step < totalSteps ? (
                  <>
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

                      <Button onClick={handleNext} disabled={isNextDisabled} className="flex-1 rounded-full px-4 md:px-6 text-xs md:text-sm min-h-[42px] md:min-h-[46px]">
                        {getNextButtonLabel()}
                        <ChevronRight className="ml-1.5 h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex justify-center">
                      <div className="text-xs md:text-sm text-muted-foreground inline-flex items-center justify-center rounded-full border border-border bg-background/70 px-4 py-2">
                        Step {step} of {totalSteps}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3 text-center">
                    <Button onClick={scrollToContact} className="w-full rounded-full px-4 md:px-6 text-sm md:text-base min-h-[46px] md:min-h-[50px]">
                      Finish Inquiry
                      <ChevronRight className="ml-1.5 h-4 w-4" />
                    </Button>
                    <p className="text-sm text-muted-foreground">We typically respond within 24 hours.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
