"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"

export interface CartBuilderData {
  cartType: string
  cartTop: string
  addOn: string
  addOns: string[]
  roofDecor: string
  design: string
  hasCatering: boolean
  catering: string[]
  customCateringDetails: string
  colors?: {
    primary?: string
    secondary?: string
    roofColor?: string
    [key: string]: string | undefined
  }
  logo?: string | null
  decalText: string
  decalDesignImage?: string | null
  aiGeneratedImage?: string | null
}

interface CartBuilderContextType {
  cartData: CartBuilderData
  updateCartData: (data: Partial<CartBuilderData>) => void
  resetCartData: () => void
  loadFromStorage: () => void
  saveToStorage: () => void
  generateAICart: () => Promise<string | null>
  isGenerating: boolean
}

const CartBuilderContext = createContext<CartBuilderContextType | undefined>(undefined)
const CART_STORAGE_KEY = "cartcuterie_builder"

const initialCartData: CartBuilderData = {
  cartType: "",
  cartTop: "",
  addOn: "",
  addOns: [],
  roofDecor: "plain",
  design: "none",
  hasCatering: false,
  catering: [],
  customCateringDetails: "",
  logo: null,
  decalText: "",
  decalDesignImage: null,
  aiGeneratedImage: null,
}

function readStoredCartData(): string | null {
  try {
    return localStorage.getItem(CART_STORAGE_KEY)
  } catch {
    return null
  }
}

function persistCartData(data: CartBuilderData): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.warn("Cart selections could not be saved to local storage; continuing with in-memory state.", error)
  }
}

function clearStoredCartData(): void {
  try {
    localStorage.removeItem(CART_STORAGE_KEY)
  } catch {
    // In-memory state is still reset when browser storage is unavailable.
  }
}

export function CartBuilderProvider({ children }: { children: ReactNode }) {
  const [cartData, setCartData] = useState<CartBuilderData>(initialCartData)
  const cartDataRef = useRef<CartBuilderData>(initialCartData)
  const [isGenerating, setIsGenerating] = useState(false)

  const normalizeCartData = (value: unknown): CartBuilderData => {
    const parsed = (value as Partial<CartBuilderData>) || {}
    const hasExplicitAddOns = Array.isArray(parsed.addOns)
    const derivedAddOn =
      parsed.addOn ||
      (parsed.roofDecor === "stripe-cloth" || parsed.roofDecor === "stripe-vinyl"
        ? parsed.roofDecor
        : parsed.design === "floral"
          ? "floral"
          : parsed.design === "custom" || parsed.design === "custom-wrap"
            ? "custom-wrap"
            : parsed.design === "none"
              ? "none"
              : "")
    const derivedAddOns = Array.isArray(parsed.addOns)
      ? parsed.addOns
      : derivedAddOn && derivedAddOn !== "none"
        ? derivedAddOn.split(",").filter(Boolean)
        : []
    const effectiveAddOn = hasExplicitAddOns ? (derivedAddOns.length > 0 ? derivedAddOns.join(",") : "none") : derivedAddOn
    const hasCatering = typeof parsed.hasCatering === "boolean" ? parsed.hasCatering : Array.isArray(parsed.catering) && parsed.catering.length > 0
    const catering = hasCatering && Array.isArray(parsed.catering) ? parsed.catering : []

    return {
      ...initialCartData,
      ...parsed,
      addOn: effectiveAddOn,
      addOns: derivedAddOns,
      hasCatering,
      roofDecor: parsed.roofDecor || initialCartData.roofDecor,
      design: parsed.design || initialCartData.design,
      catering,
      customCateringDetails: hasCatering && catering.includes("custom-catering") ? parsed.customCateringDetails || "" : "",
      logo: derivedAddOns.includes("custom-wrap") ? parsed.logo ?? null : null,
      decalText: derivedAddOns.includes("custom-decal") ? parsed.decalText || "" : "",
      decalDesignImage: derivedAddOns.includes("custom-decal") ? parsed.decalDesignImage ?? null : null,
      aiGeneratedImage: parsed.aiGeneratedImage ?? null,
    }
  }

  // Selections restored from a previous visit keep the user's progress,
  // except add-ons: the builder always opens with add-ons unselected so
  // nothing appears pre-clicked on entry. Add-ons apply only when the
  // user explicitly picks them during this visit.
  const withoutRestoredAddOns = (data: CartBuilderData): CartBuilderData => ({
    ...data,
    addOn: "",
    addOns: [],
    roofDecor: initialCartData.roofDecor,
    design: initialCartData.design,
    logo: null,
    decalText: "",
    decalDesignImage: null,
  })

  useEffect(() => {
    const stored = readStoredCartData()
    if (stored) {
      try {
        const restored = withoutRestoredAddOns(normalizeCartData(JSON.parse(stored)))
        cartDataRef.current = restored
        setCartData(restored)
        persistCartData(restored)
      } catch (e) {
        // Failed to parse stored data
      }
    }
  }, [])

  const updateCartData = (data: Partial<CartBuilderData>) => {
    const updated = { ...cartDataRef.current, ...data }
    cartDataRef.current = updated
    setCartData(updated)
    persistCartData(updated)
  }

  const resetCartData = () => {
    cartDataRef.current = initialCartData
    setCartData(initialCartData)
    clearStoredCartData()
  }

  const loadFromStorage = () => {
    const stored = readStoredCartData()
    if (stored) {
      try {
        const restored = withoutRestoredAddOns(normalizeCartData(JSON.parse(stored)))
        cartDataRef.current = restored
        setCartData(restored)
      } catch (e) {
        // Failed to parse stored data
      }
    }
  }

  const saveToStorage = () => {
    persistCartData(cartDataRef.current)
  }

  const generateAICart = async (): Promise<string | null> => {
    setIsGenerating(true)
    try {
      // Read the synchronous ref so a Generate click always uses the latest
      // selections, even when browser storage is full or unavailable.
      const requestCartData = cartDataRef.current

      console.log("Sending cart data to AI:", {
        cartType: requestCartData.cartType,
        cartTop: requestCartData.cartTop,
        addOn: requestCartData.addOn,
        roofDecor: requestCartData.roofDecor,
        design: requestCartData.design,
        hasCatering: requestCartData.hasCatering,
        catering: requestCartData.catering,
      })

      const response = await fetch("/generate-cart-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartType: requestCartData.cartType,
          cartTop: requestCartData.cartTop,
          roofDecor: requestCartData.roofDecor,
          design: requestCartData.design,
          addOns: requestCartData.addOns,
          colors: requestCartData.colors,
          logo: requestCartData.logo,
          decalText: requestCartData.decalText,
          decalDesignImage: requestCartData.decalDesignImage,
          hasCatering: requestCartData.hasCatering,
          customCateringDetails: requestCartData.customCateringDetails,
          cateringItems: requestCartData.hasCatering ? requestCartData.catering : [],
        }),
      })

      const data = await response.json()

      if (data.success && data.imageUrl) {
        updateCartData({ aiGeneratedImage: data.imageUrl })
        return data.imageUrl
      } else {
        console.error("AI generation failed:", data.error, data.details)
        alert(`AI generation failed: ${data.error || "Unknown error"}`)
        return null
      }
    } catch (error) {
      console.error("AI generation error:", error)
      alert(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`)
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <CartBuilderContext.Provider
      value={{ cartData, updateCartData, resetCartData, loadFromStorage, saveToStorage, generateAICart, isGenerating }}
    >
      {children}
    </CartBuilderContext.Provider>
  )
}

export function useCartBuilder() {
  const context = useContext(CartBuilderContext)
  if (context === undefined) {
    throw new Error("useCartBuilder must be used within a CartBuilderProvider")
  }
  return context
}
