"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"

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
const BALI_CART_STORAGE_KEY = "cartcuterie_bali_builder"

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

function readStoredCartData(): string | null {
  try {
    return localStorage.getItem(BALI_CART_STORAGE_KEY)
  } catch {
    return null
  }
}

function persistCartData(data: BaliCartBuilderData): void {
  try {
    localStorage.setItem(BALI_CART_STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.warn("Cart selections could not be saved to local storage; continuing with in-memory state.", error)
  }
}

function clearStoredCartData(): void {
  try {
    localStorage.removeItem(BALI_CART_STORAGE_KEY)
  } catch {
    // In-memory state is still reset when browser storage is unavailable.
  }
}

export function BaliCartBuilderProvider({ children }: { children: ReactNode }) {
  const [cartData, setCartData] = useState<BaliCartBuilderData>(initialCartData)
  const cartDataRef = useRef<BaliCartBuilderData>(initialCartData)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const stored = readStoredCartData()
    if (stored) {
      try {
        const restored = JSON.parse(stored)
        cartDataRef.current = restored
        setCartData(restored)
      } catch (e) {
        // Failed to parse stored data
      }
    }
  }, [])

  const updateCartData = (data: Partial<BaliCartBuilderData>) => {
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
        const restored = JSON.parse(stored)
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
      const requestCartData = cartDataRef.current

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

      const response = await fetch("/generate-cart-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartType: cartTypeMapping[requestCartData.cartType] || requestCartData.cartType,
          baseImage: baseImageMapping[requestCartData.cartType],
          customWording: requestCartData.hasCustomWording ? requestCartData.customWording : undefined,
          logo: requestCartData.logoFile,
          colors: requestCartData.colors,
          cateringItems: requestCartData.cateringTypes,
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
