import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import fs from "fs"
import path from "path"
import sharp from "sharp"
import { Buffer } from "buffer"

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.error("OPENAI_API_KEY is not set in environment variables")
      return NextResponse.json(
        {
          success: false,
          error: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file.",
        },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    })

    const body = await req.json()
    const { cartType, cartTop, design, colors, logo, cateringItems } = body

    console.log("=== AI CART GENERATION REQUEST ===")
    console.log("Cart Type:", cartType)
    console.log("Cart Top:", cartTop)
    console.log("Design:", design)
    console.log("Colors:", colors)
    console.log("Catering:", cateringItems)
    console.log("=================================")

    // Determine which base image to use
    const baseImagePath =
      cartType === "classic"
        ? path.join(process.cwd(), "public/images/Classic-cart-ai-base.jpg")
        : path.join(process.cwd(), "public/images/yellow-mobile-cart.jpg")

    console.log("Selected base image path:", baseImagePath)

    // Check if base image exists
    if (!fs.existsSync(baseImagePath)) {
      console.error(`Base image not found at: ${baseImagePath}`)
      return NextResponse.json(
        {
          success: false,
          error: `Base image not found. Please ensure ${cartType === "classic" ? "Classic-cart-ai-base.jpg" : "yellow-mobile-cart.jpg"} exists in public/images/`,
        },
        { status: 500 }
      )
    }

    console.log("✓ Base image file exists")

    // Process image to make it square and convert to PNG with alpha channel (required by OpenAI)
    const processedImageBuffer = await sharp(baseImagePath)
      .resize(1024, 1024, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .ensureAlpha()
      .png()
      .toBuffer()

    // Create a File-like object for the OpenAI API
    const imageFile = new File([new Uint8Array(processedImageBuffer)], "cart.png", { type: "image/png" })

    // CRITICAL FIX #1: Create mask with EXACT same dimensions as processed image (1024x1024)
    // The mask MUST be exactly the same size or the API silently fails
    const whiteMaskBuffer = await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }, // Fully transparent so every pixel is editable
      },
    })
      .ensureAlpha() // Ensure RGBA format
      .png()
      .toBuffer()

    const maskFile = new File([new Uint8Array(whiteMaskBuffer)], "mask.png", { type: "image/png" })
    console.log("✓ Created 1024x1024 transparent mask (exact dimensions match)")

    console.log(`Processing ${cartType} cart with:`, {
      cartTop,
      design,
      colors,
      hasCatering: cateringItems?.length > 0,
    })

    // Build an aggressive, specific edit prompt while respecting the 1000 character limit
    // DALL-E image editing requires concise yet forceful instructions
    const accentColor = colors?.secondary || "#d4af37"
    const roofStripeColor = colors?.roofColor || accentColor

    const structuralInstructions: string[] = [
      "Keep cart geometry identical to the reference photo — same perspective and proportions.",
      "Keep both wheels exactly as shown with the original spoke pattern and bright white paint.",
      "Keep legs, side shelf, and handle in their original positions; recolor only, never reshape or remove.",
    ]

    const stylingInstructions: string[] = []
    if (cartType === "classic") {
      if (cartTop === "stripe-cloth") {
        stylingInstructions.push(`Add a cloth awning on the existing posts with bold stripes in ${roofStripeColor} and ${accentColor}.`)
      } else if (cartTop === "stripe-vinyl") {
        stylingInstructions.push(`Add a vinyl canopy on the existing posts with bold stripes in ${roofStripeColor} and ${accentColor}.`)
      } else {
        stylingInstructions.push(`Add a striped canopy on the existing posts with alternating ${roofStripeColor} and ${accentColor} bands.`)
      }
    } else if (cartTop) {
      stylingInstructions.push(`Add a modern canopy using the current support frame and highlight it in ${roofStripeColor} and ${accentColor}.`)
    }

    const primaryColor = colors?.primary || "#FFFFFF"
    if (primaryColor !== "#FFFFFF") {
      stylingInstructions.push(`Repaint the body panels and countertop in ${primaryColor} while keeping the wheels bright white.`)
    } else {
      stylingInstructions.push("Keep the cart body bright white and pristine while leaving the wheel color untouched.")
    }

    stylingInstructions.push(`Add ${accentColor} accents to trim moulding, canopy posts, and vertical supports — never paint the wheels.`)
    stylingInstructions.push("Keep the left side shelf fully attached with its original outline, ready for staging items.")
    stylingInstructions.push("Do not alter the cart frame, wheels, legs, or side table; only layer color and decor onto the structure.")

    const decorInstructions: string[] = []
    if (design === "floral") {
      decorInstructions.push(`Add lush ${accentColor} floral garlands along the roof edge and cascading arrangements on the front corners.`)
    } else if (design === "custom") {
      decorInstructions.push("Add a centered framed branding panel ready for custom artwork.")
    }

    if (logo) {
      decorInstructions.push("Keep the front panel clean so the uploaded client logo can sit prominently in the center.")
    }

    if (cateringItems && cateringItems.length > 0) {
      const cateringLabels: string[] = []
      if (cateringItems.includes("charcuterie")) {
        cateringLabels.push("artfully arranged charcuterie boards")
      }
      if (cateringItems.includes("dessert")) {
        cateringLabels.push("tiered dessert stands with macarons and cupcakes")
      }
      if (cateringItems.includes("beverage")) {
        cateringLabels.push("beverage dispensers with matching glassware")
      }
      if (cateringItems.includes("custom-catering")) {
        cateringLabels.push("bespoke gourmet platters")
      }

      if (cateringLabels.length > 0) {
        decorInstructions.push(`Stage ${cateringLabels.join(", ")} across the counter and shelves with abundant detail.`)
      }
    } else {
      decorInstructions.push("Style the shelves with elegant serving props, linens, and decorative jars for a premium feel.")
    }

    const stagingInstructions: string[] = [
      "Set the cart inside an upscale indoor wedding or event space with soft ambient lighting and subtle guests in the background.",
      "Match the reference camera angle so the upgraded styling is obvious while the structure stays identical.",
    ]

    const rebuildInstructions = () => [
      ...structuralInstructions,
      ...stylingInstructions,
      ...decorInstructions,
      ...stagingInstructions,
    ]

    const header = "IMPORTANT: Modify this image; do not return the original photo."
    const priorityLine = "Keep the cart structure, then apply these styling upgrades:";
    const footer = "Render as bright wedding/event photography with obvious, vibrant edits.";
    const MAX_PROMPT_LENGTH = 900

    const buildPrompt = (steps: string[]) => {
      const body = steps.map((line, index) => `${index + 1}. ${line}`).join("\n")
      return `${header}\n${priorityLine}\n${body}\n${footer}`.trim()
    }

    let promptSteps = rebuildInstructions()
    if (promptSteps.length === 0) {
      promptSteps = ["Decorate the cart with upscale event props for a luxury service."]
    }

    let prompt = buildPrompt(promptSteps)

    while (prompt.length > MAX_PROMPT_LENGTH) {
      let removedStep: string | undefined
      if (stagingInstructions.length > 0) {
        removedStep = stagingInstructions.pop()
      } else if (decorInstructions.length > 0) {
        removedStep = decorInstructions.pop()
      } else if (stylingInstructions.length > structuralInstructions.length) {
        removedStep = stylingInstructions.pop()
      } else {
        break
      }

      if (removedStep) {
        console.warn("Removed prompt step to meet length limit:", removedStep)
      }

      promptSteps = rebuildInstructions()
      prompt = buildPrompt(promptSteps)
    }

    if (prompt.length > 1000) {
      console.warn("Prompt still above hard limit; truncating tail.")
      prompt = `${prompt.slice(0, 995)}...`
    }

    console.log(`Prompt length: ${prompt.length}`)

    console.log("EDIT PROMPT:", prompt)

    // Use DALL-E 2 for image editing (DALL-E 3 doesn't support editing)
    // CRITICAL: Include mask parameter to force edits to apply
    const response = await openai.images.edit({
      model: "gpt-image-1",
      image: imageFile as any,
      mask: maskFile as any, // Fully transparent mask makes entire image editable
      prompt,
      n: 1,
      size: "1024x1024",
    })

    if (!response?.data || response.data.length === 0) {
      console.error("OpenAI edit response had no data", response)
      throw new Error("OpenAI returned an empty response payload")
    }

    const editedResult = response.data[0]
    const resultKeys = Object.keys(editedResult || {})
    console.log("OpenAI edit response keys:", resultKeys)

    let imageUrl = editedResult?.url ?? null
    const base64Image = editedResult?.b64_json ?? null

    let finalImageBuffer: Buffer | null = null

    if (base64Image) {
      finalImageBuffer = Buffer.from(base64Image, "base64")
    } else if (imageUrl) {
      try {
        const imageResponse = await fetch(imageUrl)
        const arrayBuffer = await imageResponse.arrayBuffer()
        finalImageBuffer = Buffer.from(arrayBuffer)
      } catch (fetchError) {
        console.error("Failed to fetch image from URL", fetchError)
      }
    }

    if (!finalImageBuffer) {
      console.error("OpenAI edit response missing usable image data", editedResult)
      throw new Error("No image content returned from OpenAI")
    }

    // If a logo was uploaded, overlay it onto the cart front panel
    if (logo) {
      try {
        const logoMatch = logo.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/)
        if (logoMatch) {
          const [, , logoBase64] = logoMatch
          const logoBuffer = Buffer.from(logoBase64, "base64")

          // Resize logo to fit nicely on the cart front panel (approximate positioning)
          const logoWidth = 720
          const logoHeight = 320

          const processedLogo = await sharp(logoBuffer)
            .resize({
              width: logoWidth,
              height: logoHeight,
              fit: "contain",
              background: { r: 255, g: 255, b: 255, alpha: 0 },
            })
            .png()
            .toBuffer()

          const logoLeft = Math.round((1024 - logoWidth) / 2)
          const logoTop = 520

          finalImageBuffer = await sharp(finalImageBuffer)
            .composite([
              {
                input: processedLogo,
                top: logoTop,
                left: logoLeft,
              },
            ])
            .png()
            .toBuffer()

          console.log("✓ Overlayed uploaded logo onto edited cart image")
        } else {
          console.warn("Logo format unsupported; expected base64 data URI")
        }
      } catch (logoError) {
        console.error("Failed to overlay logo onto image", logoError)
      }
    }

    const finalImageBase64 = finalImageBuffer.toString("base64")
    imageUrl = `data:image/png;base64,${finalImageBase64}`

    console.log("✓ AI Edit Complete! Returning image result")

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      prompt: prompt,
    })
  } catch (error: any) {
    console.error("Error editing cart image:", error)

    // Enhanced error logging
    if (error.status === 401) {
      console.error("Authentication failed. API key is invalid or expired.")
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to edit cart image",
        details: error.status ? `Status: ${error.status}` : undefined,
      },
      { status: error.status || 500 }
    )
  }
}

