import { GoogleGenAI, Modality } from "@google/genai"
import sharp from "sharp"
import fs from "fs"
import path from "path"
import { NextRequest, NextResponse } from "next/server"
import {
  buildCartPrompt,
  cartBaseAssetNames,
  resolveAddOns,
  selectIceCreamBase,
  supportedCateringItems,
  type CartColors,
  type IceCreamQuadrant,
} from "@/lib/cart-ai"
import {
  compositeArtwork,
  compositeFloralArrangement,
  compositeGeneratedLayers,
  getGeneratedPreviewLayers,
  type PreviewLayer,
} from "@/lib/cart-preview"

const MAX_INLINE_IMAGE_BYTES = 8 * 1024 * 1024
const SUPPORTED_UPLOAD_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"])

class RequestValidationError extends Error {
  status = 400
}

interface InlineImage {
  mimeType: string
  data: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

function getStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())) : []
}

async function createTextDecal(text: string): Promise<InlineImage> {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
  const fontSize = Math.max(46, Math.min(150, Math.floor(1300 / Math.max(text.length * 0.7, 8))))
  const svg = Buffer.from(
    `<svg width="1400" height="400" xmlns="http://www.w3.org/2000/svg"><text x="700" y="215" text-anchor="middle" dominant-baseline="middle" font-family="Georgia, Times New Roman, serif" font-size="${fontSize}" font-weight="600" fill="#171717">${escaped}</text></svg>`
  )
  const trimmed = await sharp(svg).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
  const metadata = await sharp(trimmed).metadata()
  const horizontalPadding = Math.ceil((metadata.width || 1) * 0.75)
  const verticalPadding = Math.ceil((metadata.height || 1) * 0.75)
  const png = await sharp(trimmed)
    .extend({
      left: horizontalPadding,
      right: horizontalPadding,
      top: verticalPadding,
      bottom: verticalPadding,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()
  return { mimeType: "image/png", data: png.toString("base64") }
}

function getMimeType(filePath: string): string {
  switch (path.extname(filePath).toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg"
    case ".webp":
      return "image/webp"
    case ".gif":
      return "image/gif"
    case ".svg":
    case ".svgz":
      return "image/svg+xml"
    default:
      return "image/png"
  }
}

function resolvePreviewBaseAsset(fileName: string): string {
  const runtimeName =
    fileName === cartBaseAssetNames.classic
      ? "classic.png"
      : fileName === cartBaseAssetNames.mobile
        ? "mobile.jpeg"
        : fileName.startsWith("2_")
          ? "ice-cream-2.png"
          : fileName.startsWith("3_")
            ? "ice-cream-3.png"
            : fileName.startsWith("4_")
              ? "ice-cream-4.png"
              : null
  if (!runtimeName) throw new Error(`Unsupported preview base asset: ${fileName}`)

  const root = path.resolve(process.cwd(), "public", "images", "preview-bases")
  const resolved = path.resolve(root, runtimeName)
  if (!fs.existsSync(resolved)) {
    throw new Error(`Reference asset is unavailable from the published preview assets: ${runtimeName}`)
  }
  return resolved
}

function resolveProvidedBaseImage(baseImage: string): string {
  const relativeName = baseImage.replace(/^\/?(?:images\/)?/, "")
  if (!relativeName || relativeName.includes("\0")) {
    throw new RequestValidationError("Unsupported base image")
  }

  const imageRoot = path.resolve(process.cwd(), "public", "images")
  const resolved = path.resolve(imageRoot, relativeName)
  if (resolved !== imageRoot && !resolved.startsWith(`${imageRoot}${path.sep}`)) {
    throw new RequestValidationError("Unsupported base image")
  }
  if (!fs.existsSync(resolved)) {
    throw new RequestValidationError("Selected base image is unavailable")
  }
  return resolved
}

async function readBaseImage(
  cartType: string,
  baseImage: string | undefined,
  roofColor: string | undefined,
  location: string | undefined
): Promise<{ image: InlineImage; iceCreamRoofLabel?: string; iceCreamQuadrant?: IceCreamQuadrant }> {
  // Bali intentionally keeps its existing caller-provided base-image flow.
  if (location === "bali" && baseImage) {
    const filePath = resolveProvidedBaseImage(baseImage)
    const buffer = await fs.promises.readFile(filePath)
    return {
      image: {
        mimeType: getMimeType(filePath),
        data: buffer.toString("base64"),
      },
    }
  }

  if (cartType === "classic") {
    const filePath = resolvePreviewBaseAsset(cartBaseAssetNames.classic)
    const buffer = await fs.promises.readFile(filePath)
    return {
      image: {
        mimeType: "image/png",
        data: buffer.toString("base64"),
      },
    }
  }

  if (cartType === "mobile") {
    const filePath = resolvePreviewBaseAsset(cartBaseAssetNames.mobile)
    const buffer = await fs.promises.readFile(filePath)
    return {
      image: {
        mimeType: "image/jpeg",
        data: buffer.toString("base64"),
      },
    }
  }

  if (cartType === "ice-cream") {
    const selection = selectIceCreamBase(roofColor)
    const filePath = resolvePreviewBaseAsset(selection.fileName)
    const buffer = await sharp(filePath)
      .extract({
        left: selection.left,
        top: selection.top,
        width: selection.width,
        height: selection.height,
      })
      .png()
      .toBuffer()

    return {
      image: {
        mimeType: "image/png",
        data: buffer.toString("base64"),
      },
      iceCreamRoofLabel:
        selection.matchedRoofColor || !roofColor ? selection.label : undefined,
      iceCreamQuadrant: selection.quadrant,
    }
  }

  throw new RequestValidationError("A supported cart type or Bali base image is required")
}

async function parseUploadedImage(value: unknown, fieldName: string): Promise<InlineImage | null> {
  if (value == null || value === "") return null
  if (typeof value !== "string") {
    throw new RequestValidationError(`${fieldName} must be an image data URL`)
  }

  const match = /^data:([^;,]+)(?:;[^,]*)?;base64,([\s\S]+)$/i.exec(value)
  if (!match) {
    throw new RequestValidationError(`${fieldName} must be a supported image data URL`)
  }

  const mimeType = match[1].toLowerCase()
  if (!SUPPORTED_UPLOAD_TYPES.has(mimeType)) {
    throw new RequestValidationError(`${fieldName} must be PNG, JPG, WEBP, GIF, or SVG`)
  }

  const base64 = match[2].replace(/\s/g, "")
  if (!/^[a-z\d+/]*={0,2}$/i.test(base64) || base64.length === 0) {
    throw new RequestValidationError(`${fieldName} contains invalid image data`)
  }

  let buffer: Buffer
  try {
    buffer = Buffer.from(base64, "base64")
  } catch {
    throw new RequestValidationError(`${fieldName} contains invalid image data`)
  }

  if (buffer.length === 0 || buffer.length > MAX_INLINE_IMAGE_BYTES) {
    throw new RequestValidationError(`${fieldName} is too large or empty`)
  }

  if (mimeType === "image/svg+xml") {
    try {
      buffer = await sharp(buffer).png().toBuffer()
    } catch {
      throw new RequestValidationError(`${fieldName} contains an invalid SVG image`)
    }
  }

  if (buffer.length > MAX_INLINE_IMAGE_BYTES) {
    throw new RequestValidationError(`${fieldName} is too large`)
  }

  try {
    const metadata = await sharp(buffer).metadata()
    if (!metadata.format) throw new Error("unknown image format")
  } catch {
    throw new RequestValidationError(`${fieldName} contains an invalid image`)
  }

  return {
    mimeType: mimeType === "image/svg+xml" ? "image/png" : mimeType,
    data: buffer.toString("base64"),
  }
}

function getErrorStatus(error: unknown): number {
  if (error instanceof RequestValidationError) return error.status
  if (isRecord(error) && typeof error.status === "number" && error.status >= 400 && error.status <= 599) {
    return error.status
  }
  return 500
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!isRecord(body)) throw new RequestValidationError("Invalid request body")

    const cartType = getString(body.cartType)
    if (!cartType) throw new RequestValidationError("Cart type is required")

    const location = getString(body.location)
    const baseImage = body.baseImage == null ? undefined : getString(body.baseImage)
    if (body.baseImage != null && !baseImage) {
      throw new RequestValidationError("Unsupported base image")
    }

    const colors = isRecord(body.colors) ? (body.colors as CartColors) : undefined
    const roofColor = getString(colors?.roofColor)
    const roofDecor = getString(body.roofDecor)
    const design = getString(body.design)
    const suppliedAddOns = Array.isArray(body.addOns) ? getStringArray(body.addOns) : undefined
    const addOns = resolveAddOns({
      cartType,
      roofDecor,
      design,
      addOns: suppliedAddOns,
    })
    const selectedDecal = addOns.includes("custom-decal")
    const decalText = selectedDecal ? getString(body.decalText)?.slice(0, 120) : undefined
    const selectedLogo = addOns.includes("custom-wrap")
    const suppliedCateringItems = getStringArray(body.cateringItems)
    const hasCatering =
      body.hasCatering === false
        ? false
        : body.hasCatering === true
          ? true
          : suppliedCateringItems.length > 0
    const cateringItems = hasCatering
      ? suppliedCateringItems.filter((item) => supportedCateringItems.includes(item))
      : []
    const customCateringDetails =
      cateringItems.includes("custom-catering") && hasCatering ? getString(body.customCateringDetails) : undefined
    const customWording = getString(body.customWording)
    const isBali = location === "bali"
    const hasFlowerCart = !isBali && cateringItems.includes("flower")

    const [uploadedDecal, logo, base] = await Promise.all([
      selectedDecal ? parseUploadedImage(body.decalDesignImage, "Decal design") : Promise.resolve(null),
      selectedLogo || isBali ? parseUploadedImage(body.logo, "Logo") : Promise.resolve(null),
      readBaseImage(cartType, baseImage, roofColor, location),
    ])
    const decal = uploadedDecal || (decalText ? await createTextDecal(decalText) : null)
    const isTextDecal = Boolean(decalText && !uploadedDecal)

    if (selectedDecal && !decal) {
      throw new RequestValidationError("Custom Decal requires text or an uploaded image")
    }

    const prompt = buildCartPrompt({
      cartType,
      cartTop: getString(body.cartTop),
      roofDecor,
      design,
      addOns,
      colors,
      cateringItems,
      customCateringDetails,
      customWording,
      location,
      hasDecal: Boolean(decal),
      decalWillBeComposited: Boolean(decal && !isBali),
      hasLogo: Boolean(logo),
      logoWillBeComposited: Boolean(logo && !isBali),
      iceCreamRoofLabel: base.iceCreamRoofLabel,
    })

    const inlineImageBytes = [base.image, decal, logo]
      .filter((image): image is InlineImage => Boolean(image))
      .reduce((total, image) => total + Buffer.byteLength(image.data, "base64"), 0)
    if (inlineImageBytes > MAX_INLINE_IMAGE_BYTES) {
      throw new RequestValidationError("The selected images are too large to process together")
    }

    const baseBuffer = Buffer.from(base.image.data, "base64")
    const hasCateringVisual = cateringItems.some((item) => item !== "custom-catering") || Boolean(customCateringDetails)
    const hasStripeVisual = (addOns.includes("stripe-cloth") || addOns.includes("stripe-vinyl")) && Boolean(roofColor)
    const previewLayers: PreviewLayer[] = getGeneratedPreviewLayers({
      hasStripeVisual,
      hasCateringVisual,
      hasBrandingVisual: Boolean(selectedLogo && logo),
    })

    // A plain cart preview, decal-only preview, or floral-only preview never
    // needs an image model. This also makes the locked-base guarantee
    // byte-for-byte for the no-add-on/no-catering path.
    if (!isBali && previewLayers.length === 0) {
      let outputBuffer: Buffer | null = null
      if (decal) {
        outputBuffer = await compositeArtwork(
          baseBuffer,
          Buffer.from(decal.data, "base64"),
          cartType,
          base.iceCreamQuadrant,
          { verticalOffset: isTextDecal ? -0.18 : 0 }
        )
      }
      if (addOns.includes("floral")) {
        outputBuffer = await compositeFloralArrangement(outputBuffer || baseBuffer, cartType)
      }
      return NextResponse.json({
        success: true,
        imageUrl: outputBuffer
          ? `data:image/png;base64,${outputBuffer.toString("base64")}`
          : `data:${base.image.mimeType};base64,${base.image.data}`,
        prompt,
      })
    }

    const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY
    const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL
    if (!apiKey || !baseUrl) {
      throw new Error("Gemini AI integration is not configured")
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        apiVersion: "",
        baseUrl,
      },
    })

    const parts = [
      { text: prompt },
      {
        inlineData: {
          mimeType: base.image.mimeType,
          data: base.image.data,
        },
      },
    ]
    if (decal && isBali) {
      parts.push({
        inlineData: {
          mimeType: decal.mimeType,
          data: decal.data,
        },
      })
    }
    if (logo && isBali) {
      parts.push({
        inlineData: {
          mimeType: logo.mimeType,
          data: logo.data,
        },
      })
    }
    if (hasFlowerCart) {
      const flowerReference = await fs.promises.readFile(
        path.resolve(process.cwd(), "public", "images", "flower-cart-catering-reference.jpeg")
      )
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: flowerReference.toString("base64"),
        },
      })
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{ role: "user", parts }],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    })

    const imagePart = response.candidates?.[0]?.content?.parts?.find((part) => part.inlineData?.data)
    if (!imagePart?.inlineData?.data) {
      throw new Error("No image was returned by the Gemini image model")
    }

    const generatedMimeType = imagePart.inlineData.mimeType || "image/png"
    const generatedBuffer = Buffer.from(imagePart.inlineData.data, "base64")
    let outputBuffer: Buffer
    if (isBali) {
      // Preserve the existing Bali behavior and response image directly.
      outputBuffer = generatedBuffer
    } else if (hasCateringVisual && (!hasStripeVisual || hasFlowerCart)) {
      // Catering displays need their full natural height above the countertop.
      // A selected flower rack stands beside the cart, outside countertop masks.
      // Use the complete AI edit of the supplied base instead of clipping it
      // into the cart's narrow tabletop mask.
      outputBuffer = await sharp(generatedBuffer).png().toBuffer()
    } else {
      // When a stripe treatment is selected, the base cart stays pixel-locked
      // outside the explicit roof and catering-display regions. This prevents
      // the image model from changing wheels, handles, panels, or hardware.
      outputBuffer = await compositeGeneratedLayers(baseBuffer, generatedBuffer, cartType, previewLayers, base.iceCreamQuadrant)
    }
    if (!isBali && decal) {
      outputBuffer = await compositeArtwork(
        outputBuffer,
        Buffer.from(decal.data, "base64"),
        cartType,
        base.iceCreamQuadrant,
        { verticalOffset: isTextDecal ? -0.18 : 0 }
      )
    }
    if (!isBali && logo) {
      outputBuffer = await compositeArtwork(outputBuffer, Buffer.from(logo.data, "base64"), cartType, base.iceCreamQuadrant)
    }
    if (!isBali && addOns.includes("floral")) {
      outputBuffer = await compositeFloralArrangement(outputBuffer, cartType)
    }

    return NextResponse.json({
      success: true,
      imageUrl: isBali
        ? `data:${generatedMimeType};base64,${imagePart.inlineData.data}`
        : `data:image/png;base64,${outputBuffer.toString("base64")}`,
      prompt,
    })
  } catch (error) {
    const status = getErrorStatus(error)
    const message = error instanceof Error ? error.message : "Failed to generate cart image"
    if (status >= 500) {
      console.error("Cart visualization generation failed")
    }

    return NextResponse.json(
      {
        success: false,
        error: status === 500 ? "Failed to generate cart image. Please try again." : message,
      },
      { status }
    )
  }
}