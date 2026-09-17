import sharp from "sharp"
import fs from "fs"
import path from "path"

export type PreviewLayer = "stripe" | "catering" | "floral" | "branding"
export type IceCreamQuadrant = "top-left" | "top-right" | "bottom-left" | "bottom-right"

export interface NormalizedPreviewRegion {
  layer: PreviewLayer
  points: Array<[number, number]>
}

interface NormalizedBodyPanel {
  x: number
  y: number
  width: number
  height: number
}

/*
 * These are intentionally conservative, cart-specific edit regions. They
 * describe surfaces where a generated treatment may be placed; everything
 * outside them remains the selected reference image.
 */
const regionsByCartType: Record<string, Record<PreviewLayer, NormalizedPreviewRegion[]>> = {
  classic: {
    stripe: [
      {
        layer: "stripe",
        points: [
          [0.273, 0.095],
          [0.783, 0.095],
          [0.815, 0.224],
          [0.235, 0.224],
        ],
      },
    ],
    catering: [
      {
        layer: "catering",
        points: [
          [0.24, 0.28],
          [0.78, 0.28],
          [0.8, 0.59],
          [0.2, 0.59],
        ],
      },
    ],
    floral: [
      {
        layer: "floral",
        points: [
          [0.18, 0.095],
          [0.33, 0.095],
          [0.33, 0.24],
          [0.18, 0.24],
        ],
      },
      {
        layer: "floral",
        points: [
          [0.67, 0.095],
          [0.82, 0.095],
          [0.82, 0.24],
          [0.67, 0.24],
        ],
      },
    ],
    branding: [
      {
        layer: "branding",
        points: [
          [0.28, 0.63],
          [0.7, 0.63],
          [0.7, 0.7],
          [0.28, 0.7],
        ],
      },
    ],
  },
  mobile: {
    stripe: [
      {
        layer: "stripe",
        points: [
          [0.138, 0.217],
          [0.827, 0.217],
          [0.827, 0.293],
          [0.138, 0.293],
        ],
      },
    ],
    catering: [
      {
        layer: "catering",
        points: [
          [0.2, 0.35],
          [0.78, 0.35],
          [0.83, 0.607],
          [0.145, 0.607],
        ],
      },
    ],
    floral: [
      {
        layer: "floral",
        points: [
          [0.138, 0.217],
          [0.3, 0.217],
          [0.3, 0.293],
          [0.138, 0.293],
        ],
      },
      {
        layer: "floral",
        points: [
          [0.665, 0.217],
          [0.827, 0.217],
          [0.827, 0.293],
          [0.665, 0.293],
        ],
      },
    ],
    branding: [
      {
        layer: "branding",
        points: [
          [0.16, 0.625],
          [0.81, 0.625],
          [0.81, 0.71],
          [0.16, 0.71],
        ],
      },
    ],
  },
  "ice-cream": {
    stripe: [
      {
        layer: "stripe",
        points: [
          [0.204, 0.064],
          [0.797, 0.064],
          [0.821, 0.24],
          [0.167, 0.24],
        ],
      },
    ],
    catering: [
      {
        layer: "catering",
        points: [
          [0.18, 0.3],
          [0.45, 0.3],
          [0.45, 0.58],
          [0.18, 0.58],
        ],
      },
    ],
    floral: [
      {
        layer: "floral",
        points: [
          [0.08, 0.06],
          [0.28, 0.06],
          [0.28, 0.25],
          [0.08, 0.25],
        ],
      },
      {
        layer: "floral",
        points: [
          [0.72, 0.06],
          [0.92, 0.06],
          [0.92, 0.25],
          [0.72, 0.25],
        ],
      },
    ],
    branding: [
      {
        layer: "branding",
        points: [
          [0.2, 0.61],
          [0.45, 0.61],
          [0.45, 0.7],
          [0.2, 0.7],
        ],
      },
    ],
  },
}

const bodyPanels: Record<string, NormalizedBodyPanel> = {
  classic: { x: 0.28, y: 0.59, width: 0.5, height: 0.23 },
  mobile: { x: 0.16, y: 0.605, width: 0.67, height: 0.17 },
  "ice-cream": { x: 0.25, y: 0.56, width: 0.48, height: 0.25 },
}

const iceCreamBodyPanels: Record<IceCreamQuadrant, NormalizedBodyPanel> = {
  "top-left": bodyPanels["ice-cream"],
  "top-right": bodyPanels["ice-cream"],
  "bottom-left": bodyPanels["ice-cream"],
  "bottom-right": bodyPanels["ice-cream"],
}

/*
 * The three approved ice-cream collages are cropped at the same 627px
 * quadrant boundaries. Keep the quadrant as an explicit part of the geometry
 * contract so a future asset with a shifted quadrant cannot silently reuse a
 * different crop's mask.
 */
const iceCreamQuadrantRegions: Record<IceCreamQuadrant, Record<PreviewLayer, NormalizedPreviewRegion[]>> = {
  "top-left": regionsByCartType["ice-cream"],
  "top-right": regionsByCartType["ice-cream"],
  "bottom-left": regionsByCartType["ice-cream"],
  "bottom-right": regionsByCartType["ice-cream"],
}

/*
 * Floral arrangements are an approved, photographed accessory rather than an
 * AI-generated layer. These placements are measured against the published
 * base canvases: the pot sits on the floor at the viewer's left and the
 * arrangement stays clear of the center of the cart. Keep the whole base
 * canvas as the output; only the accessory is resized for each framing.
 */
interface FloralPlacement {
  width: number
  left: number
  floorY: number
}

const floralPlacements: Record<string, FloralPlacement> = {
  classic: { width: 0.29, left: 0, floorY: 0.928 },
  mobile: { width: 0.29, left: 0, floorY: 0.824 },
  "ice-cream": { width: 0.37, left: 0, floorY: 0.93 },
}

const floralArrangementCandidates = [
  path.resolve(process.cwd(), "public", "images", "floral-arrangement-cutout.png"),
  path.resolve(process.cwd(), "artifacts", "cartcuterie", "public", "images", "floral-arrangement-cutout.png"),
]

function getCartRegions(cartType: string, variant?: IceCreamQuadrant): Record<PreviewLayer, NormalizedPreviewRegion[]> | undefined {
  if (cartType === "ice-cream" && variant) return iceCreamQuadrantRegions[variant]
  return regionsByCartType[cartType]
}

export function getExplicitAllowedRegions(
  cartType: string,
  layers: PreviewLayer[],
  variant?: IceCreamQuadrant
): NormalizedPreviewRegion[] {
  const cartRegions = getCartRegions(cartType, variant)
  if (!cartRegions) throw new Error(`No locked preview geometry exists for cart type: ${cartType}`)

  return layers.flatMap((layer) => cartRegions[layer] || [])
}

/**
 * Floral is deliberately absent from generated preview layers. It is always
 * composited from the fixed photographed cutout after any selected AI edit.
 */
export function getGeneratedPreviewLayers(options: {
  hasStripeVisual: boolean
  hasCateringVisual: boolean
  hasBrandingVisual: boolean
}): PreviewLayer[] {
  const layers: PreviewLayer[] = []
  if (options.hasStripeVisual) layers.push("stripe")
  if (options.hasCateringVisual) layers.push("catering")
  if (options.hasBrandingVisual) layers.push("branding")
  return layers
}

async function readImageSize(buffer: Buffer): Promise<{ width: number; height: number }> {
  const metadata = await sharp(buffer).metadata()
  if (!metadata.width || !metadata.height) throw new Error("Preview image has no readable dimensions")
  return { width: metadata.width, height: metadata.height }
}

function regionPath(region: NormalizedPreviewRegion, width: number, height: number): string {
  return region.points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${Math.round(x * width)} ${Math.round(y * height)}`)
    .join(" ") + " Z"
}

export async function createAllowedRegionMask(
  width: number,
  height: number,
  regions: NormalizedPreviewRegion[]
): Promise<Buffer> {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new Error("Preview mask dimensions must be positive integers")
  }

  const paths = regions.map((region) => `<path d="${regionPath(region, width, height)}" fill="#ffffff"/>`).join("")
  return sharp(Buffer.from(`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${paths}</svg>`))
    .png()
    .toBuffer()
}

/**
 * Composite a generated image only in the explicit regions for its selected
 * layers. The base image is never sent through an image model in this step.
 */
export async function compositeGeneratedLayers(
  baseBuffer: Buffer,
  generatedBuffer: Buffer,
  cartType: string,
  layers: PreviewLayer[],
  variant?: IceCreamQuadrant
): Promise<Buffer> {
  if (layers.length === 0) return baseBuffer

  const baseSize = await readImageSize(baseBuffer)
  const regions = getExplicitAllowedRegions(cartType, layers, variant)
  const mask = await createAllowedRegionMask(baseSize.width, baseSize.height, regions)
  const generated = await sharp(generatedBuffer)
    .resize(baseSize.width, baseSize.height, { fit: "fill" })
    .ensureAlpha()
    .png()
    .toBuffer()
  const maskedGenerated = await sharp(generated)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer()

  return sharp(baseBuffer).ensureAlpha().composite([{ input: maskedGenerated }]).png().toBuffer()
}

/**
 * Place the customer's actual artwork on the front panel. This function does
 * not call an image model or redraw the uploaded pixels.
 */
export async function compositeArtwork(
  baseBuffer: Buffer,
  artworkBuffer: Buffer,
  cartType: string,
  _variant?: IceCreamQuadrant,
  options: { verticalOffset?: number } = {}
): Promise<Buffer> {
  const baseSize = await readImageSize(baseBuffer)
  const panel =
    cartType === "ice-cream" && _variant
      ? iceCreamBodyPanels[_variant]
      : bodyPanels[cartType]
  if (!panel) throw new Error(`No locked body-panel geometry exists for cart type: ${cartType}`)

  const panelLeft = Math.round(baseSize.width * panel.x)
  const panelTop = Math.round(baseSize.height * panel.y)
  const panelWidth = Math.max(1, Math.round(baseSize.width * panel.width))
  const panelHeight = Math.max(1, Math.round(baseSize.height * panel.height))
  const horizontalMargin = Math.round(panelWidth * 0.12)
  const verticalMargin = Math.round(panelHeight * 0.18)
  const width = Math.max(1, panelWidth - horizontalMargin * 2)
  const height = Math.max(1, panelHeight - verticalMargin * 2)
  const artwork = await sharp(artworkBuffer)
    .resize(width, height, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()

  return sharp(baseBuffer)
    .ensureAlpha()
    .composite([
      {
        input: artwork,
        left: panelLeft + horizontalMargin,
        top: panelTop + verticalMargin + Math.round(panelHeight * (options.verticalOffset || 0)),
      },
    ])
    .png()
    .toBuffer()
}

/**
 * Composite the fixed photographed floral arrangement onto the selected
 * non-Bali cart. Unlike generated layers, this never sends the arrangement or
 * base image through an image model.
 */
export async function compositeFloralArrangement(baseBuffer: Buffer, cartType: string): Promise<Buffer> {
  const placement = floralPlacements[cartType]
  if (!placement) throw new Error(`No locked floral geometry exists for cart type: ${cartType}`)
  const floralArrangementPath = floralArrangementCandidates.find((candidate) => fs.existsSync(candidate))
  if (!floralArrangementPath) {
    throw new Error("The fixed floral arrangement asset is unavailable")
  }

  const baseSize = await readImageSize(baseBuffer)
  const arrangement = await sharp(floralArrangementPath)
    .resize(Math.max(1, Math.round(baseSize.width * placement.width)), undefined, { fit: "contain" })
    .png()
    .toBuffer()
  const arrangementSize = await readImageSize(arrangement)
  const left = Math.max(0, Math.round(baseSize.width * placement.left))
  const top = Math.max(0, Math.round(baseSize.height * placement.floorY) - arrangementSize.height)

  return sharp(baseBuffer)
    .ensureAlpha()
    .composite([{ input: arrangement, left, top }])
    .png()
    .toBuffer()
}