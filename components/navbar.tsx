"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    { name: "How It Works", id: "how-it-works" },
    { name: "Build Cart", id: "cart-builder" },
    { name: "Gallery", id: "gallery" },
    { name: "Pricing", id: "pricing" },
    { name: "Contact", id: "contact" },
  ]

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
            onClick={() => scrollToSection("hero")}
            className="flex-shrink-0 transition-all duration-300"
          >
            <div className="text-center">
              <div className={`font-bold tracking-widest transition-all duration-300 ${
                isScrolled ? "text-base md:text-lg" : "text-lg md:text-xl"
              } ${isScrolled ? "text-foreground" : "text-white"}`}>
                CARTCUTERIE
              </div>
              <div className={`border-t transition-all duration-300 ${
                isScrolled ? "border-foreground/30" : "border-white/30"
              } my-1`}></div>
              <div className={`font-serif text-xs tracking-tight transition-all duration-300 ${
                isScrolled ? "text-muted-foreground" : "text-white/80"
              }`}>
                catering & rentals
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
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
          <div className="md:hidden py-4 bg-background/95 backdrop-blur-md border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-left px-4 py-2 text-foreground hover:text-accent transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <div className="px-4">
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
