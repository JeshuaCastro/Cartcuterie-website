"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

export function LocationSelector() {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const locationPreference = localStorage.getItem("location_preference")
    const currentLocation = pathname?.startsWith("/bali") ? "bali" : "la"
    
    if (!locationPreference) {
      // Show modal after 500ms delay for first-time visitors
      const timer = setTimeout(() => setShowModal(true), 500)
      return () => clearTimeout(timer)
    }
  }, [pathname])

  const handleLocationSelect = (location: "la" | "bali") => {
    localStorage.setItem("location_preference", location)
    setShowModal(false)
    
    if (location === "bali" && !pathname?.startsWith("/bali")) {
      router.push("/bali")
    } else if (location === "la" && pathname?.startsWith("/bali")) {
      router.push("/")
    }
  }

  if (!showModal) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-background rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="flex justify-center mb-2">
            <MapPin className="h-8 w-8 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">
            Welcome to Cartcuterie
          </h2>
          <p className="text-muted-foreground text-sm">
            Choose your location
          </p>
        </div>

        {/* Location Options */}
        <div className="grid gap-3">
          {/* LA / USA Option */}
          <button
            onClick={() => handleLocationSelect("la")}
            className="group relative overflow-hidden rounded-lg border-2 border-muted hover:border-accent transition-all duration-300 p-4 text-left bg-gradient-to-br from-background to-muted/20 hover:shadow-lg hover:scale-[1.02]"
          >
            <div className="relative z-10 flex items-center gap-3">
              <div className="text-2xl">🇺🇸</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-0.5">
                  Los Angeles
                </h3>
                <p className="text-xs text-muted-foreground">
                  Southern California
                </p>
              </div>
              <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>

          {/* Bali Option */}
          <button
            onClick={() => handleLocationSelect("bali")}
            className="group relative overflow-hidden rounded-lg border-2 border-muted hover:border-amber-600 transition-all duration-300 p-4 text-left bg-gradient-to-br from-background to-amber-50/20 hover:shadow-lg hover:scale-[1.02]"
          >
            <div className="relative z-10 flex items-center gap-3">
              <div className="text-2xl">🌴</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-0.5">
                  Bali
                </h3>
                <p className="text-xs text-muted-foreground">
                  Indonesia
                </p>
              </div>
              <span className="text-amber-600 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Switch anytime via navigation
        </p>
      </div>
    </div>
  )
}
