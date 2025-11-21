"use client"

import { Label } from "@/components/ui/label"
import { useState } from "react"

interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
  id: string
}

const commonColors = [
  { name: "White", value: "#FFFFFF" },
  { name: "Cream/Ivory", value: "#FFFDD0" },
  { name: "Sage Green", value: "#9CAF88" },
  { name: "Forest Green", value: "#228B22" },
  { name: "Dusty Rose", value: "#DCAE96" },
  { name: "Burgundy", value: "#800020" },
  { name: "Navy Blue", value: "#1E3A8A" },
  { name: "Sky Blue", value: "#87CEEB" },
  { name: "Black", value: "#1A1A1A" },
  { name: "Charcoal", value: "#36454F" },
  { name: "Gold", value: "#FFD700" },
  { name: "Champagne", value: "#F7E7CE" },
  { name: "Terracotta", value: "#E2725B" },
  { name: "Coral", value: "#FF7F50" },
  { name: "Lavender", value: "#E6E6FA" },
  { name: "Blush Pink", value: "#FFB6C1" },
]

export function ColorPicker({ label, value, onChange, id }: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(value || "#FFFFFF")

  const handleColorSelect = (color: string) => {
    onChange(color)
    setCustomColor(color)
  }

  return (
    <div className="space-y-3">
      <Label htmlFor={id} className="text-base font-medium">
        {label}
      </Label>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {commonColors.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => handleColorSelect(color.value)}
            className={`relative h-12 rounded-lg border-2 transition-all duration-200 ${
              value === color.value
                ? "border-accent ring-2 ring-accent/30 scale-105"
                : "border-border hover:border-accent/50 hover:scale-105"
            }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
          >
            {value === color.value && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-5 h-5 drop-shadow-lg"
                  fill="none"
                  stroke={color.value === "#FFFFFF" || color.value === "#FFFFF0" ? "#000000" : "#FFFFFF"}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Label htmlFor={`${id}-custom`} className="text-sm text-muted-foreground">
          Custom:
        </Label>
        <div className="flex items-center gap-2 flex-1">
          <input
            type="color"
            id={`${id}-custom`}
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value)
              handleColorSelect(e.target.value)
            }}
            className="h-10 w-20 rounded-lg border-2 border-border cursor-pointer"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value)
              handleColorSelect(e.target.value)
            }}
            placeholder="#FFFFFF"
            className="flex-1 h-10 px-3 rounded-lg border-2 border-border focus:border-accent focus:outline-none font-mono text-sm"
          />
        </div>
      </div>
    </div>
  )
}
