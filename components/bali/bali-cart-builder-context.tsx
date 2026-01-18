"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface BaliCartBuilderData {
  cartType: string // plain, stripe, tropical
  hasCustomWording: boolean
  customWording: string
  logoFile?: string | null
  colors: {
    primary: string
    secondary: string
  }
  hasCatering: boolean
  cateringTypes: string[] // charcuterie, coconut, flower, juice, fruit, matcha
  guestCount: number
  packageType: string // basic, premium
  location: string // always 'bali'
  aiGeneratedImage?: string | null
}

interface BaliCartBuilderContextType {
  cartData: BaliCartBuilderData
  updateCartData: (data: Partial<BaliCartBuilderData>) => void
  resetCartData: () => void
  loadFromStorage: () => void
  saveToStorage: () => void
  generateAICart: () => Promise<string | null>
  isGenerating: boolean
}

const BaliCartBuilderContext = createContext<BaliCartBuilderContextType | undefined>(undefined)

const initialCartData: BaliCartBuilderData = {
  cartType: "",
  hasCustomWording: false,
  customWording: "",
  logoFile: null,
  colors: {
    primary: "#ffffff",
    secondary: "#D97706",
  },
  hasCatering: false,
  cateringTypes: [],
  guestCount: 0,
  packageType: "basic",
  location: "bali",
}

export function BaliCartBuilderProvider({ children }: { children: ReactNode }) {
  const [cartData, setCartData] = useState<BaliCartBuilderData>(initialCartData)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("cartcuterie_bali_builder")
    if (stored) {
      try {
        setCartData(JSON.parse(stored))
      } catch (e) {
        // Failed to parse stored data
      }
    }
  }, [])

  const updateCartData = (data: Partial<BaliCartBuilderData>) => {
    setCartData((prev) => {
      const updated = { ...prev, ...data }
      localStorage.setItem("cartcuterie_bali_builder", JSON.stringify(updated))
      return updated
    })
  }

  const resetCartData = () => {
    setCartData(initialCartData)
    localStorage.removeItem("cartcuterie_bali_builder")
  }

  const loadFromStorage = () => {
    const stored = localStorage.getItem("cartcuterie_bali_builder")
    if (stored) {
      try {
        setCartData(JSON.parse(stored))
      } catch (e) {
        // Failed to parse stored data
      }
    }
  }

  const saveToStorage = () => {
    localStorage.setItem("cartcuterie_bali_builder", JSON.stringify(cartData))
  }

  const generateAICart = async (): Promise<string | null> => {
    setIsGenerating(true)
    try {
      // Map Bali cart types to descriptive names for AI and base images
      const cartTypeMapping: Record<string, string> = {
        plain: "Plain white cart with clean minimalist design",
        stripe: "Cart with yellow and white striped canopy awning",
        tropical: "Cart with natural thatched palm leaf roof (tropical Bali style)",
      }

      const baseImageMapping: Record<string, string> = {
        plain: "/images/plain-bali-cart.jpg",
        stripe: "/images/bali-stripe-cart.jpg",
        tropical: "/images/tropical-cart.jpg",
      }

      const response = await fetch("/api/generate-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartType: cartTypeMapping[cartData.cartType] || cartData.cartType,
          baseImage: baseImageMapping[cartData.cartType],
          customWording: cartData.hasCustomWording ? cartData.customWording : undefined,
          colors: cartData.colors,
          logo: cartData.logoFile,
          cateringItems: cartData.cateringTypes,
          location: "bali",
        }),
      })

      const data = await response.json()

      if (data.success && data.imageUrl) {
        updateCartData({ aiGeneratedImage: data.imageUrl })
        return data.imageUrl
      } else {
        console.error("AI generation failed:", data.error)
        return null
      }
    } catch (error) {
      console.error("AI generation error:", error)
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <BaliCartBuilderContext.Provider
      value={{
        cartData,
        updateCartData,
        resetCartData,
        loadFromStorage,
        saveToStorage,
        generateAICart,
        isGenerating,
      }}
    >
      {children}
    </BaliCartBuilderContext.Provider>
  )
}

export function useBaliCartBuilder() {
  const context = useContext(BaliCartBuilderContext)
  if (!context) {
    throw new Error("useBaliCartBuilder must be used within a BaliCartBuilderProvider")
  }
  return context
}
