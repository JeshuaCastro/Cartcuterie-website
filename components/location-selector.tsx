"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Pinyon_Script } from "next/font/google"
import Image from "next/image"

const signatureScript = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--signature-script" })

const LOCATION_PREFERENCE_KEY = "location_preference_v2"

export function LocationSelector() {
  const [showModal, setShowModal] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<"la" | "bali" | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const handleLocationSelect = (location: "la" | "bali") => {
    if (selectedLocation) return

    setSelectedLocation(location)
    localStorage.setItem(LOCATION_PREFERENCE_KEY, location)

    window.setTimeout(() => {
      setShowModal(false)

      if (location === "bali" && !pathname?.startsWith("/bali")) {
        router.push("/bali")
      } else if (location === "la" && pathname?.startsWith("/bali")) {
        router.push("/")
      }
    }, 300)
  }

  if (!showModal) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start pt-20 md:items-center md:pt-0 justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      data-location-selector
      role="dialog"
      aria-modal="true"
      style={{ opacity: 1, visibility: "visible" }}
    >
      <div
        className="relative bg-background rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in zoom-in-95 duration-300"
        style={{ opacity: 1, visibility: "visible" }}
      >
        {/* Header */}
        <div className="text-center mb-5">
          <div className="flex justify-center mb-2">
            <svg className="h-8 w-8 text-[#780014]" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
              <path d="M7 3h18l4 6H3l4-6ZM4 10h24v2H4zM6 12h2v9H6zM24 12h2v9h-2zM4 20h24v3H4zM6 23h20v5H6zM1 21h4v2H1z" />
              <circle cx="9" cy="29" r="3" />
              <circle cx="24" cy="28" r="4" />
            </svg>
          </div>
          <h2 className={`text-3xl font-bold text-[#780014] mb-1 ${signatureScript.variable}`} style={{ fontFamily: "var(--signature-script)" }}>
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
            aria-pressed={selectedLocation === "la"}
            className={`group relative overflow-hidden rounded-lg border-2 hover:border-accent transition-all duration-300 p-4 text-left bg-gradient-to-br from-background to-muted/20 hover:shadow-lg hover:scale-[1.02] ${
              selectedLocation === "la" ? "border-accent ring-2 ring-accent/40 shadow-lg scale-[1.02]" : "border-muted"
            }`}
          >
            <div className="relative z-10 flex items-center gap-3">
              <div className="text-2xl">
                <Image src="/images/los-angeles-surfboard-icon.png" alt="" width={24} height={24} className="h-6 w-6 object-contain" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-foreground mb-0.5">
                  Los Angeles
                </h3>
                <p className="text-xs text-muted-foreground">
                  Southern California
                </p>
              </div>
              <span className="text-[#780014] group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>

          {/* Bali Option */}
          <button
            onClick={() => handleLocationSelect("bali")}
            aria-pressed={selectedLocation === "bali"}
            className={`group relative overflow-hidden rounded-lg border-2 hover:border-amber-600 transition-all duration-300 p-4 text-left bg-gradient-to-br from-background to-amber-50/20 hover:shadow-lg hover:scale-[1.02] ${
              selectedLocation === "bali" ? "border-amber-600 ring-2 ring-amber-600/40 shadow-lg scale-[1.02]" : "border-muted"
            }`}
          >
            <div className="relative z-10 flex items-center gap-3">
              <div className="text-2xl">
                <Image src="/images/bali-icon.png" alt="" width={24} height={24} className="h-6 w-6 object-contain" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-foreground mb-0.5">
                  Bali
                </h3>
                <p className="text-xs text-muted-foreground">
                  Indonesia
                </p>
              </div>
              <span className="text-[#780014] group-hover:translate-x-1 transition-transform">→</span>
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
