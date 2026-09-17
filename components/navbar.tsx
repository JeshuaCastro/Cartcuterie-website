"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const logoTouchStartY = useRef<number | null>(null)
  const logoTouchMoved = useRef(false)
  const pathname = usePathname()
  const isBaliSite = pathname?.startsWith("/bali")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setIsMobileMenuOpen(false)
  }

  const navLinks = [
    { name: "Home", id: "hero" },
    { name: "Build Cart", id: "cart-builder" },
    { name: "Dimensions", id: "dimensions", hideOnBali: true },
    { name: "Gallery", id: "gallery" },
    { name: "Pricing", id: "pricing" },
    { name: "Contact", id: "contact" },
  ]

  const visibleNavLinks = navLinks.filter(link => !(isBaliSite && link.hideOnBali))

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? "h-16" : "h-20"}`}
        >
          {/* Logo */}
          <button
            type="button"
            onTouchStart={(event) => {
              logoTouchStartY.current = event.touches[0]?.clientY ?? null
              logoTouchMoved.current = false
            }}
            onTouchMove={(event) => {
              const currentY = event.touches[0]?.clientY
              if (
                logoTouchStartY.current !== null &&
                currentY !== undefined &&
                Math.abs(currentY - logoTouchStartY.current) > 8
              ) {
                logoTouchMoved.current = true
              }
            }}
            onTouchCancel={() => {
              logoTouchStartY.current = null
              logoTouchMoved.current = false
            }}
            onClick={(event) => {
              if (logoTouchMoved.current) {
                event.preventDefault()
                logoTouchStartY.current = null
                logoTouchMoved.current = false
                return
              }

              logoTouchStartY.current = null
              scrollToSection("hero")
            }}
            className="flex-shrink-0 transition-all duration-300"
          >
            <Image
              src="/images/cartcuterie-header-logo.png"
              alt="Cartcuterie Catering & Rentals"
              width={1022}
              height={400}
              priority
              className={`h-auto transition-all duration-300 ${
                isScrolled ? "w-[102px] md:w-[112px]" : "w-[116px] md:w-[126px]"
              } ${isScrolled ? "" : "brightness-0 invert"}`}
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {visibleNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`text-sm font-medium transition-colors duration-300 hover:text-accent ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}
              >
                {link.name}
              </button>
            ))}
            
            {/* Bali Location Link */}
            {!isBaliSite && (
              <Link href="/bali">
                <Button
                  variant="outline"
                  className={`text-sm font-medium transition-colors duration-300 border-2 bg-transparent ${
                    isScrolled 
                      ? "border-[#780014] text-[#780014] hover:bg-[#780014] hover:text-white" 
                      : "border-white text-white hover:bg-white hover:text-[#780014] backdrop-blur-sm"
                  }`}
                >
                  🌴 Bali
                </Button>
              </Link>
            )}
            
            {isBaliSite && (
              <Link href="/">
                <Button
                  variant="outline"
                  className={`text-sm font-medium transition-colors duration-300 border-2 ${
                    isScrolled 
                      ? "border-foreground text-foreground hover:bg-foreground hover:text-background" 
                      : "border-white bg-white/90 text-foreground hover:bg-white hover:text-foreground backdrop-blur-sm"
                  }`}
                >
                  LA / USA
                </Button>
              </Link>
            )}
            
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-accent text-foreground hover:bg-accent/90 rounded-xl"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 ${isScrolled ? "text-foreground" : "text-white"}`}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden rounded-[28px] overflow-hidden p-3 bg-white/95 backdrop-blur-md border border-accent/30 shadow-xl">
            <div className="flex flex-col gap-2 rounded-2xl border border-[#780014] bg-[#780014]/95 p-3 shadow-sm">
              <div className="px-4 pb-2">
                {/* Location Switch at Top */}
                {!isBaliSite ? (
                  <Link href="/bali">
                    <Button
                      variant="outline"
                      className="w-full border-2 border-white bg-transparent text-white hover:bg-white hover:text-[#780014]"
                    >
                      🌴 Switch to Bali
                    </Button>
                  </Link>
                ) : (
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="w-full border-2 border-foreground text-foreground hover:bg-foreground hover:text-background"
                    >
                      Switch to LA / USA
                    </Button>
                  </Link>
                )}
              </div>
              <div className="h-px bg-accent/30 mx-4 my-1" />
              {visibleNavLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-center px-5 py-3 rounded-xl bg-[#FFF078] text-[#780014] border-2 border-white text-sm font-normal shadow-sm hover:bg-[#FFF078]/90 hover:shadow-md transition-all"
                >
                  {link.name}
                </button>
              ))}
              <div className="h-px bg-accent/30 mx-4 my-1" />
              <div className="px-4 pt-1">
                <Button
                  onClick={() => scrollToSection("contact")}
                  className="w-full bg-accent text-foreground hover:bg-accent/90 rounded-xl"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
