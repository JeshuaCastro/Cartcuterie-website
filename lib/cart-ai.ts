export interface CartColors {
  primary?: string
  secondary?: string
  roofColor?: string
  [key: string]: string | undefined
}

export type IceCreamQuadrant = "top-left" | "top-right" | "bottom-left" | "bottom-right"

export interface IceCreamBaseSelection {
  fileName: string
  quadrant: IceCreamQuadrant
  left: number
  top: number
  width: number
  height: number
  label: string
  matchedRoofColor: boolean
}

const QUADRANT_SIZE = 627

const iceCreamReferences: Record<string, IceCreamBaseSelection> = {
  "yellow-stripe": {
    fileName: "2_C2B73297-11EC-431E-AEA4-BFA828A8B76E_1789163522459.png",
    quadrant: "top-left",
    left: 0,
    top: 0,
    width: QUADRANT_SIZE,
    height: QUADRANT_SIZE,
    label: "yellow-and-white striped",
    matchedRoofColor: true,
  },
  "orange-stripe": {
    fileName: "2_C2B73297-11EC-431E-AEA4-BFA828A8B76E_1789163522459.png",
    quadrant: "top-right",
    left: QUADRANT_SIZE,
    top: 0,
    width: QUADRANT_SIZE,
    height: QUADRANT_SIZE,
    label: "orange-and-white striped",
    matchedRoofColor: true,
  },
  "forest-green-solid": {
    fileName: "2_C2B73297-11EC-431E-AEA4-BFA828A8B76E_1789163522459.png",
    quadrant: "bottom-left",
    left: 0,
    top: QUADRANT_SIZE,
    width: QUADRANT_SIZE,
    height: QUADRANT_SIZE,
    label: "forest green solid",
    matchedRoofColor: true,
  },
  "burgundy-solid": {
    fileName: "2_C2B73297-11EC-431E-AEA4-BFA828A8B76E_1789163522459.png",
    quadrant: "bottom-right",
    left: QUADRANT_SIZE,
    top: QUADRANT_SIZE,
    width: QUADRANT_SIZE,
    height: QUADRANT_SIZE,
    label: "burgundy solid",
    matchedRoofColor: true,
  },
  "black-solid": {
    fileName: "3_12C8894F-B48E-4104-B7B9-23350BD79634_1789163522459.png",
    quadrant: "top-left",
    left: 0,
    top: 0,
    width: QUADRANT_SIZE,
    height: QUADRANT_SIZE,
    label: "black solid",
    matchedRoofColor: true,
  },
  "ivory-solid": {
    fileName: "3_12C8894F-B48E-4104-B7B9-23350BD79634_1789163522459.png",
    quadrant: "top-right",
    left: QUADRANT_SIZE,
    top: 0,
    width: QUADRANT_SIZE,
    height: QUADRANT_SIZE,
    label: "ivory solid",
    matchedRoofColor: true,
  },
  "black-white-stripe": {
    fileName: "3_12C8894F-B48E-4104-B7B9-23350BD79634_1789163522459.png",
    quadrant: "bottom-left",
    left: 0,
    top: QUADRANT_SIZE,
    width: QUADRANT_SIZE,
    height: QUADRANT_SIZE,
    label: "black-and-white striped",
    matchedRoofColor: true,
  },
  "white-solid": {
    fileName: "3_12C8894F-B48E-4104-B7B9-23350BD79634_1789163522459.png",
    quadrant: "bottom-right",
    left: QUADRANT_SIZE,
    top: QUADRANT_SIZE,
    width: QUADRANT_SIZE,
    height: QUADRANT_SIZE,
    label: "white solid",
    matchedRoofColor: true,
  },
  "tan-solid": {
    fileName: "4_0031962D-1F24-4CC1-9CB9-015EFDEA962B_1789163522459.png",
    quadrant: "bottom-left",
    left: 0,
    top: QUADRANT_SIZE,
    width: QUADRANT_SIZE,
    height: QUADRANT_SIZE,
    label: "tan solid",
    matchedRoofColor: true,
  },
  "pink-solid": {
    fileName: "4_0031962D-1F24-4CC1-9CB9-015EFDEA962B_1789163522459.png",
    quadrant: "bottom-right",
    left: QUADRANT_SIZE,
    top: QUADRANT_SIZE,
    width: QUADRANT_SIZE,
    height: QUADRANT_SIZE,
    label: "pink solid",
    matchedRoofColor: true,
  },
}

const defaultIceCreamReference = iceCreamReferences["white-solid"]

export const cartBaseAssetNames = {
  classic: "0_7A49DAF0-5894-4897-9B50-3B3C221004BE_1789163522459.png",
  mobile: "1_58EFC0F0-98F2-4887-BE57-0946F2F86296_1789163522459.jpeg",
} as const

const namedColorAliases: Array<[string, string]> = [
  ["black-white-stripe", "black-white-stripe"],
  ["black and white", "black-white-stripe"],
  ["black/white", "black-white-stripe"],
  ["black", "black-solid"],
  ["charcoal", "black-solid"],
  ["ivory", "ivory-solid"],
  ["cream", "ivory-solid"],
  ["off-white", "ivory-solid"],
  ["white", "white-solid"],
  ["forest green", "forest-green-solid"],
  ["dark green", "forest-green-solid"],
  ["green", "forest-green-solid"],
  ["burgundy", "burgundy-solid"],
  ["maroon", "burgundy-solid"],
  ["wine", "burgundy-solid"],
  ["red", "burgundy-solid"],
  ["yellow", "yellow-stripe"],
  ["gold", "yellow-stripe"],
  ["mustard", "yellow-stripe"],
  ["orange", "orange-stripe"],
  ["terracotta", "orange-stripe"],
  ["coral", "orange-stripe"],
  ["tan", "tan-solid"],
  ["beige", "tan-solid"],
  ["champagne", "tan-solid"],
  ["dusty rose", "tan-solid"],
  ["pink", "pink-solid"],
  ["blush", "pink-solid"],
  ["rose", "pink-solid"],
]

const hexColorAliases: Record<string, string> = {
  "#ffffff": "white-solid",
  "#fff": "white-solid",
  "#fffdd0": "ivory-solid",
  "#fffff0": "ivory-solid",
  "#228b22": "forest-green-solid",
  "#800020": "burgundy-solid",
  "#1a1a1a": "black-solid",
  "#ffd700": "yellow-stripe",
  "#f7e7ce": "tan-solid",
  "#e2725b": "orange-stripe",
  "#ffb6c1": "pink-solid",
  "#dcae96": "tan-solid",
}

function getRoofReferenceKey(roofColor: string | undefined): string | null {
  if (typeof roofColor !== "string" || !roofColor.trim()) return null

  const normalized = roofColor.trim().toLowerCase().replace(/\s+/g, " ")
  if (Object.prototype.hasOwnProperty.call(iceCreamReferences, normalized)) return normalized
  const exactHex = hexColorAliases[normalized]
  if (exactHex) return exactHex

  const alias = namedColorAliases.find(([name]) => normalized.includes(name))
  return alias?.[1] ?? null
}

export function selectIceCreamBase(roofColor?: string): IceCreamBaseSelection {
  const referenceKey = getRoofReferenceKey(roofColor)
  const selected = referenceKey ? iceCreamReferences[referenceKey] : defaultIceCreamReference

  return {
    ...selected,
    matchedRoofColor: Boolean(referenceKey),
  }
}

export interface CartPromptInput {
  cartType: string
  cartTop?: string
  roofDecor?: string
  design?: string
  addOns?: string[]
  colors?: CartColors | null
  cateringItems?: string[]
  customCateringDetails?: string
  customWording?: string
  location?: string
  hasDecal?: boolean
  decalWillBeComposited?: boolean
  hasLogo?: boolean
  logoWillBeComposited?: boolean
  iceCreamRoofLabel?: string
}

const cateringDescriptions: Record<string, string> = {
  charcuterie: "charcuterie boards with artisan meats and cheeses",
  flower: "beautiful tropical flower arrangements",
  donut: "tiered donut displays",
  fruit: "fresh tropical fruit platters and displays",
  popcorn: "popcorn containers",
  candy: "candy jars",
  crepe: "crepe station setup",
  juice: "fresh-pressed tropical juice dispensers and drinks",
  coconut: "fresh whole coconuts with straws for drinking",
  matcha: "matcha tea service with traditional matcha drinks",
}

export const supportedCateringItems = [...Object.keys(cateringDescriptions), "custom-catering"]

export const supportedAddOns = ["stripe-cloth", "stripe-vinyl", "floral", "custom-decal", "custom-wrap"] as const

export type SupportedAddOn = (typeof supportedAddOns)[number]

export function resolveAddOns(input: CartPromptInput): string[] {
  // An explicitly supplied empty array is authoritative. This prevents stale
  // roofDecor/design values from re-enabling a previously removed add-on.
  if (Array.isArray(input.addOns)) return input.addOns.filter((item) => supportedAddOns.includes(item as SupportedAddOn))

  const derived: string[] = []
  if (input.roofDecor === "stripe-cloth" || input.roofDecor === "stripe-vinyl") {
    derived.push(input.roofDecor)
  }
  if (input.design === "floral") derived.push("floral")
  if (input.design === "custom" || input.design === "custom-wrap") derived.push("custom-wrap")
  return derived
}

export function buildCartPrompt(input: CartPromptInput): string {
  const hasFlowerCart = input.location !== "bali" && Boolean(input.cateringItems?.includes("flower"))
  const instructions: string[] = [
    "Edit the supplied base product photograph into a professional catering-cart visualization.",
    "Use the first supplied image as the base reference and preserve the exact cart identity, background, camera perspective, lighting context, silhouette, shape, proportions, wheels, roof, shelves, frame, and solid construction.",
    "Only apply explicitly selected customizations and the selected catering setup. If a detail is not explicitly selected, leave it unchanged.",
    hasFlowerCart
      ? "Do not redesign the cart, replace the base photograph, or make the cart transparent or see-through. The only permitted external structure is the explicitly selected flower display described below."
      : "Do not redesign the cart, replace the base photograph, add external furniture, add side tables, add structures outside the cart, or make the cart transparent or see-through.",
    "Do not recolor the cart body, trim, frame, wheels, accents, or any other existing surface unless an explicit roof treatment below requests it.",
  ]

  const addOns = resolveAddOns(input)
  const roofColor = typeof input.colors?.roofColor === "string" ? input.colors.roofColor.trim() : ""
  const isBali = input.location === "bali"

  if (input.iceCreamRoofLabel) {
    instructions.push(
      `The supplied ice-cream base is the provided ${input.iceCreamRoofLabel} reference. Preserve that roof treatment and the rest of that exact cart reference.`
    )
  }

  if (isBali) {
    instructions.push(
      "Preserve the Bali flow exactly: keep the supplied Bali cart's existing colors, roof, finish, structure, and design unchanged."
    )
    if (input.customWording?.trim()) {
      instructions.push(`Apply this exact custom wording in a tasteful, legible placement that fits the original cart: "${input.customWording.trim()}".`)
    }
  } else {
    const hasStripeCloth = addOns.includes("stripe-cloth")
    const hasStripeVinyl = addOns.includes("stripe-vinyl")

    if (hasStripeVinyl) {
      instructions.push(
        roofColor
          ? `Using the supplied base image of the customer's selected cart, apply narrow alternating white and ${roofColor} stripes as a vinyl surface treatment directly onto the EXISTING rigid roof only. The stripe colors must be white plus ${roofColor}. Never remove or replace the rigid roof, never turn it into a different roof, and preserve its original silhouette and supports. Outside the roof surface, reproduce the supplied base photograph without changing a single cart detail, including every panel, trim piece, wheel, handle, bracket, shelf, support, and item of hardware.`
          : "The vinyl stripe option is selected, but no roof color was explicitly saved. Do not invent a color; preserve the existing rigid roof and apply no random stripe color."
      )
    } else if (hasStripeCloth) {
      instructions.push(
        roofColor
          ? `Add a ${roofColor} and white striped cloth covering over the EXISTING roof only. The cloth may cover the roof surface, but must not remove or replace the underlying rigid roof, supports, silhouette, or cart structure.`
          : "The cloth stripe option is selected, but no roof color was explicitly saved. Do not invent colors; preserve the existing roof and do not add random stripes."
      )
    } else {
      instructions.push("Preserve the existing roof exactly; do not invent or recolor a roof treatment.")
    }
  }

  // Bali keeps its existing model-driven flow. The fixed arrangement overlay
  // is intentionally limited to the locked classic, mobile, and ice-cream
  // preview bases below.
  if (isBali && addOns.includes("floral")) {
    instructions.push(
      "Add only a minimal floral accent: no more than 3-4 small clusters of white flowers and greenery at the top canopy corners. Keep the cart body, shelves, front, and sides clean and unobstructed."
    )
  }

  const hasSelectedDecal = Boolean(input.hasDecal && addOns.includes("custom-decal"))
  const hasSelectedLogo = Boolean(input.hasLogo && (addOns.includes("custom-wrap") || isBali))

  if (hasSelectedDecal && input.decalWillBeComposited) {
    instructions.push(
      "Do not add, copy, redraw, or duplicate the customer's decal in the AI edit. Leave the cart's front body panel clear and unchanged because the exact uploaded decal will be composited once, centered on that panel after generation."
    )
  } else if (hasSelectedDecal) {
    instructions.push(
      "The second supplied image is the customer's decal artwork. Apply that exact artwork, preserving its lettering, logo, colors, and composition as faithfully as the image model permits. Place it small and centered on the cart's front flat panel, like the existing GELATO front-panel treatment; do not enlarge it, redraw it, replace it with invented text, or wrap it around the sides."
    )
  } else if (addOns.includes("custom-decal")) {
    instructions.push("A custom decal option is selected but no supported decal image was supplied, so do not invent artwork or text.")
  }

  if (hasSelectedLogo && input.logoWillBeComposited) {
    instructions.push(
      "Do not add, copy, redraw, reposition, or duplicate the customer's logo in the AI edit. Leave the cart's front body panel clear because the exact supplied logo will be composited once at the calculated horizontal and vertical center of that panel after generation."
    )
  } else if (hasSelectedLogo) {
    instructions.push(
      "Use the supplied logo only as a restrained front-facing branding treatment that fits the original flat panel. Preserve the supplied artwork and do not create additional branding elsewhere."
    )
  } else if (addOns.includes("custom-wrap")) {
    instructions.push("A custom wrap option is selected but no supported logo image was supplied, so do not invent a logo or artwork.")
  }

  const cateringItems = (input.cateringItems || [])
    .filter((item) => !(hasFlowerCart && item === "flower"))
    .map((item) => cateringDescriptions[item])
    .filter((item): item is string => Boolean(item))
  if (cateringItems.length > 0) {
    instructions.push(
      `Arrange ${cateringItems.join(", ")} neatly on top of the existing cart countertop or serving surface. Render each display at its natural full height above the counter; do not crop, flatten, or force the catering into a thin tabletop strip. Keep the roof, poles, wheels, cart body, and cart structure unchanged.`
    )
  }
  if (input.customCateringDetails?.trim()) {
    instructions.push(
      `CUSTOM CATERING DESIGN BRIEF: Generate a realistic catering setup based specifically on the customer's exact description: "${input.customCateringDetails.trim()}". Place that generated setup where catering normally goes: neatly on top of the selected base cart's existing countertop or serving surface. Keep the complete setup at a natural, usable scale above the counter without flattening or cropping it. Do not place it beside, behind, beneath, or attached to the cart. Do not invent unrelated catering items beyond what is reasonably required to visualize the customer's description. Preserve the selected base cart's body, panels, trim, wheels, roof, poles, hardware, proportions, colors, and existing details unchanged except for other explicitly selected customizations.`
    )
  }
  if (hasFlowerCart) {
    instructions.push(
      "FLOWER CART CATERING: The final supplied image is the flower display reference, not a replacement cart or background. Place one freestanding white three-tier flower rack on the floor immediately to the VIEWER'S RIGHT of the selected base cart. Match the reference's stepped white metal frame and rows of tall tapered white buckets filled with blue and cream hydrangeas, pink roses and carnations, white baby's breath and daisies, eucalyptus and leafy greenery. Show the entire flower setup at a natural scale beside the cart, not on the countertop, not on the left, and not as decorations attached to the cart. Keep the cart's panels, wheels, trim, hardware, roof, colors, proportions and existing details unchanged except for other explicitly selected customizations. Do not copy the reference room, flooring, background furniture or text."
    )
  }

  instructions.push(
    "Keep the base photo and cart recognizable, preserve all original proportions and wheels, and render a polished upscale event photograph. This is an AI visualization, so prioritize faithful editing over inventing new design elements."
  )

  return instructions.join(" ")
}