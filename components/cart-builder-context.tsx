"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CartBuilderData {
  cartType: string
  cartTop: string
  roofDecor: string
  design: string
  catering: string[]
  logo?: string | null
  colors?: {
    primary?: string
    secondary?: string
    roofColor?: string
  }
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
  roofDecor: "",
  design: "",
  catering: [],
  logo: null,
  colors: {
    primary: "",
    secondary: "",
    roofColor: "",
  },
  aiGeneratedImage: null,
}

export function CartBuilderProvider({ children }: { children: ReactNode }) {
  const [cartData, setCartData] = useState<CartBuilderData>(initialCartData)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("cartcuterie_builder")
    if (stored) {
      try {
        setCartData(JSON.parse(stored))
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
        setCartData(JSON.parse(stored))
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
        roofDecor: cartData.roofDecor,
        design: cartData.design,
        colors: cartData.colors,
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
          colors: cartData.colors,
          logo: cartData.logo,
          cateringItems: cartData.catering,
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
