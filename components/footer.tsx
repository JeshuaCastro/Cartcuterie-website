import { Instagram, Facebook, Mail } from "lucide-react"
import Image from "next/image"

const footerLinks = [
  { name: "Home", href: "#hero" },
  { name: "Gallery", href: "#gallery" },
  { name: "Pricing", href: "#pricing" },
  { name: "Build Your Cart", href: "#cart-builder" },
  { name: "Contact", href: "#contact" },
]

const instagramImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/catering-3-Z1iLYpJv7q3ql92lsrH55yYLzcZChh.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/floral%20design-9KpOs1iAgKfujQCVjKb8L0OOwjM7eI.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/custom-cart-design-bAOEOJaWGztDUDNkFf5pbvBByokm2t.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Catering-2-m7P1lYQu7A8VtxpGuBGiTSnoLXM9xj.jpeg",
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <div className="relative h-16 w-48 mb-4">
              <Image
                src="/images/cartcuterie-logo.png"
                alt="Cartcuterie"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
            <p className="text-background/80 leading-relaxed">
              Luxury mobile catering carts for unforgettable events across Los Angeles.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/cartcuterie.la"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-accent/20 hover:bg-accent flex items-center justify-center transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-accent/20 hover:bg-accent flex items-center justify-center transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="mailto:info@cartcuterie.com"
                className="w-10 h-10 rounded-full bg-accent/20 hover:bg-accent flex items-center justify-center transition-colors duration-300"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xl font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-background/80 hover:text-accent transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Instagram Preview */}
          <div>
            <h4 className="font-serif text-xl font-bold mb-4">Follow Us</h4>
            <div className="grid grid-cols-2 gap-2">
              {instagramImages.map((src, index) => (
                <a
                  key={index}
                  href="https://instagram.com/cartcuterie.la"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square rounded-lg overflow-hidden group"
                >
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={`Instagram post ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/20 text-center space-y-2">
          <p className="text-background/60 text-sm">© 2025 Cartcuterie. All rights reserved.</p>
          <p className="text-accent text-sm italic">Designed with love in Los Angeles</p>
        </div>
      </div>
    </footer>
  )
}
