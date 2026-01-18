"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Link from "next/link"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent")
    if (!consent) {
      // Show banner after 1 second delay
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted")
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "declined")
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-foreground/95 backdrop-blur-md shadow-2xl border-t border-accent/20 animate-slide-up">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🍪</span>
              <div>
                <h3 className="text-lg font-bold text-background">We Value Your Privacy</h3>
                <p className="text-sm text-background/80 leading-relaxed">
                  We use cookies to enhance your browsing experience, remember your cart selections, and analyze site traffic. 
                  By clicking "Accept All," you consent to our use of cookies.{" "}
                  <Link href="/cookie-policy" className="text-accent hover:underline font-semibold">
                    Learn more
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={handleDecline}
              className="border-background text-black hover:bg-background hover:text-black rounded-lg"
            >
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              className="bg-accent text-foreground hover:bg-accent/90 rounded-lg font-semibold"
            >
              Accept All
            </Button>
            <button
              onClick={handleDecline}
              className="absolute top-4 right-4 md:relative md:top-0 md:right-0 p-2 text-background/60 hover:text-background transition-colors"
              aria-label="Close cookie banner"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-background/10">
          <div className="flex flex-wrap gap-4 text-xs text-background/60">
            <Link href="/privacy-policy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-conditions" className="hover:text-accent transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href="/cookie-policy" className="hover:text-accent transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
