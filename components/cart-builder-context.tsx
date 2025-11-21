"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CartBuilderData {
  cartType: string
  cartTop: string
  design: string
  catering: string[]
}

interface CartBuilderContextType {
  cartData: CartBuilderData
  updateCartData: (data: Partial<CartBuilderData>) => void
  resetCartData: () => void
  loadFromStorage: () => void
  saveToStorage: () => void
}

const CartBuilderContext = createContext<CartBuilderContextType | undefined>(undefined)

const initialCartData: CartBuilderData = {
  cartType: "",
  cartTop: "",
  design: "",
  catering: [],
}

export function CartBuilderProvider({ children }: { children: ReactNode }) {
  const [cartData, setCartData] = useState<CartBuilderData>(initialCartData)

  useEffect(() => {
    const stored = localStorage.getItem("cartcuterie_builder")
    if (stored) {
      try {
        setCartData(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse stored cart data", e)
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
        console.error("Failed to parse stored cart data", e)
      }
    }
  }

  const saveToStorage = () => {
    localStorage.setItem("cartcuterie_builder", JSON.stringify(cartData))
  }

  return (
    <CartBuilderContext.Provider value={{ cartData, updateCartData, resetCartData, loadFromStorage, saveToStorage }}>
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
