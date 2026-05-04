"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CartBuilderData {
  cartType: string
  cartTop: string
  addOn: string
  roofDecor: string
  design: string
  hasCatering: boolean
  catering: string[]
  logo?: string | null
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

const initialCartData: CartBuilderData = {
  cartType: "",
  cartTop: "",
  addOn: "",
  roofDecor: "plain",
  design: "none",
  hasCatering: false,
  catering: [],
  logo: null,
  aiGeneratedImage: null,
}

export function CartBuilderProvider({ children }: { children: ReactNode }) {
  const [cartData, setCartData] = useState<CartBuilderData>(initialCartData)
  const [isGenerating, setIsGenerating] = useState(false)

  const normalizeCartData = (value: unknown): CartBuilderData => {
    const parsed = (value as Partial<CartBuilderData>) || {}
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

    return {
      ...initialCartData,
      ...parsed,
      addOn: derivedAddOn,
      hasCatering:
        typeof parsed.hasCatering === "boolean"
          ? parsed.hasCatering
          : Array.isArray(parsed.catering) && parsed.catering.length > 0,
      roofDecor: parsed.roofDecor || initialCartData.roofDecor,
      design: parsed.design || initialCartData.design,
      catering: Array.isArray(parsed.catering) ? parsed.catering : [],
      logo: parsed.logo ?? null,
      aiGeneratedImage: parsed.aiGeneratedImage ?? null,
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem("cartcuterie_builder")
    if (stored) {
      try {
        setCartData(normalizeCartData(JSON.parse(stored)))
      } catch (e) {
        // Failed to parse stored data
      }
    }
  }, [])

  const updateCartData = (data: Partial<CartBuilderData>) => {
    setCartData((prev) => {
      const updated = { ...prev, ...data }
      localStorage.setItem("cartcuterie_builder", JSON.stringify(updated))
      return updated
    })
  }

  const resetCartData = () => {
    setCartData(initialCartData)
    localStorage.removeItem("cartcuterie_builder")
  }

  const loadFromStorage = () => {
    const stored = localStorage.getItem("cartcuterie_builder")
    if (stored) {
      try {
        setCartData(normalizeCartData(JSON.parse(stored)))
      } catch (e) {
        // Failed to parse stored data
      }
    }
  }

  const saveToStorage = () => {
    localStorage.setItem("cartcuterie_builder", JSON.stringify(cartData))
  }

  const generateAICart = async (): Promise<string | null> => {
    setIsGenerating(true)
    try {
      console.log("Sending cart data to AI:", {
        cartType: cartData.cartType,
        cartTop: cartData.cartTop,
        addOn: cartData.addOn,
        roofDecor: cartData.roofDecor,
        design: cartData.design,
        hasCatering: cartData.hasCatering,
        catering: cartData.catering,
      })

      const response = await fetch("/api/generate-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartType: cartData.cartType,
          cartTop: cartData.cartTop,
          roofDecor: cartData.roofDecor,
          design: cartData.design,
          logo: cartData.logo,
          cateringItems: cartData.hasCatering ? cartData.catering : [],
        }),
      })

      const data = await response.json()
      console.log("AI generation response:", data)

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
