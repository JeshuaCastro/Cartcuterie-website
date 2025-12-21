import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Cartcuterie | Luxury Mobile Catering Carts in Los Angeles",
  description:
    "Premium mobile catering and event cart service for weddings, corporate events, and upscale parties across Los Angeles, Ventura & Orange County.",
  keywords: ["catering", "mobile cart", "Los Angeles catering", "event catering", "wedding cart", "charcuterie cart"],
  authors: [{ name: "Cartcuterie" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  openGraph: {
    title: "Cartcuterie | Luxury Mobile Catering Carts",
    description: "Premium mobile catering carts for unforgettable events in Los Angeles",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
