import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const isDev = process.env.NODE_ENV === "development"
const log = (...args: any[]) => isDev && console.log(...args)
const logError = (...args: any[]) => console.error(...args)

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    if (!apiKey) {
      logError("GOOGLE_GENERATIVE_AI_API_KEY is not set in environment variables")
      return NextResponse.json(
        {
          success: false,
          error: "Google API key is not configured. Please contact support.",
        },
        { status: 500 }
      )
    }

    const body = await req.json()
    const { cartType, cartTop, roofDecor, design, colors, logo, cateringItems, baseImage, location } = body

    log("=== AI CART GENERATION REQUEST (Gemini 3 Pro Image) ===")
    log("Cart Type:", cartType)
    log("Cart Top:", cartTop)
    log("Roof Decor:", roofDecor)
    log("Design:", design)
    log("Colors:", colors)
    log("Logo:", logo ? "Yes" : "No")
    log("Catering:", cateringItems)
    log("Base Image:", baseImage)
    log("Location:", location)
    log("=======================================================")

    // Validate cartType
    if (!cartType) {
      logError("Missing cartType in request body")
      return NextResponse.json(
        {
          success: false,
          error: "Cart type is required",
        },
        { status: 400 }
      )
    }

    // Determine which base image to use
    let baseImagePath: string
    let imageFileName: string
    
    // If baseImage is provided (from Bali site), use it directly
    if (baseImage) {
      // Remove leading slash and 'images/' if present
      imageFileName = baseImage.replace(/^\/?(images\/)?/, '')
      baseImagePath = path.join(process.cwd(), "public", "images", imageFileName)
      log("Using provided base image:", imageFileName)
    } else if (cartType === "classic") {
      imageFileName = "Classic-cart-ai-base.jpg"
      baseImagePath = path.join(process.cwd(), "public", "images", imageFileName)
    } else if (cartType === "ice-cream") {
      imageFileName = "ice-cream-cart.jpg"
      baseImagePath = path.join(process.cwd(), "public", "images", imageFileName)
    } else if (cartType === "mobile") {
      imageFileName = "yellow-mobile-cart.jpg"
      baseImagePath = path.join(process.cwd(), "public", "images", imageFileName)
    } else {
      // Default to mobile if unknown type
      logError(`Unknown cart type: ${cartType}, defaulting to mobile`)
      imageFileName = "yellow-mobile-cart.jpg"
      baseImagePath = path.join(process.cwd(), "public", "images", imageFileName)
    }

    log("Selected base image path:", baseImagePath)

    // Check if base image exists
    let imageBuffer: Buffer
    try {
      if (!fs.existsSync(baseImagePath)) {
        logError(`Base image not found at: ${baseImagePath}`)
        logError("Directory contents:", fs.readdirSync(path.join(process.cwd(), "public", "images")).join(", "))
        return NextResponse.json(
          {
            success: false,
            error: `Base image not found: ${imageFileName}`,
          },
          { status: 500 }
        )
      }

      log("✓ Base image file exists")

      // Read base image and convert to base64
      imageBuffer = fs.readFileSync(baseImagePath)
    } catch (fsError: any) {
      logError("File system error:", fsError)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to read image file: ${fsError.message}`,
        },
        { status: 500 }
      )
    }

    const base64Image = imageBuffer.toString("base64")
    const imageMediaType = "image/jpeg"

    log("✓ Base image converted to base64, size:", base64Image.length, "bytes")

    // Build the prompt for Gemini 3 Pro Image
    const primaryColor = typeof colors?.primary === "string" && colors.primary.trim() ? colors.primary.trim() : null
    const secondaryColor = typeof colors?.secondary === "string" && colors.secondary.trim() ? colors.secondary.trim() : null
    const roofColor = typeof colors?.roofColor === "string" && colors.roofColor.trim() ? colors.roofColor.trim() : null

    const instructions: string[] = [
      "Generate a professional product photo of this catering cart with the following customizations:",
    ]

    // Skip all color customizations for Bali. US color instructions only run when explicit colors are provided.
    const isPlainRoof = !roofDecor || roofDecor === "plain"
    const isBaliLocation = location === "bali"
    const hasColorCustomization = Boolean(primaryColor || secondaryColor || roofColor)

    if (!isBaliLocation && hasColorCustomization) {
      if (primaryColor && primaryColor !== "#FFFFFF") {
        instructions.push(`Paint the main cart body in ${primaryColor}.`)
      }
      if (secondaryColor) {
        instructions.push(`Add ${secondaryColor} accents on trim, moulding, and decorative elements.`)
      }
    }

    if (!isBaliLocation) {
      if (cartType === "classic" || cartType === "ice-cream") {
        if (roofDecor === "stripe-cloth" || roofDecor === "stripe-vinyl") {
          if (roofColor && secondaryColor) {
            instructions.push(`Add a striped canopy with alternating ${roofColor} and ${secondaryColor} stripes.`)
          } else {
            instructions.push(
              `Add a ${roofDecor === "stripe-cloth" ? "striped cloth" : "striped vinyl"} canopy while keeping the cart body unchanged and avoiding any added side tables or external structures.`
            )
          }
        } else if (!isPlainRoof) {
          if (roofColor && secondaryColor) {
            instructions.push(`Add a decorative canopy in ${roofColor} with ${secondaryColor} accents.`)
          } else {
            instructions.push("Add the selected canopy style while preserving the cart's existing body color and structure.")
          }
        }
      } else if (cartType === "mobile") {
        if (roofDecor === "striped-roof") {
          if (roofColor && secondaryColor) {
            instructions.push(`Add a modern striped canopy with ${roofColor} and ${secondaryColor} stripes.`)
          } else {
            instructions.push("Add a modern striped canopy while keeping the cart body color and footprint unchanged.")
          }
        } else if (roofDecor === "custom") {
          if (roofColor && secondaryColor) {
            instructions.push(`Add a custom-designed canopy featuring ${roofColor} and ${secondaryColor}.`)
          } else {
            instructions.push("Add the selected canopy treatment while keeping the original cart body unchanged.")
          }
        }
      }

      if (isPlainRoof && !hasColorCustomization) {
        instructions.push("Keep the cart in its clean, natural finish without color customization.")
      }
    }

    // Design/decoration instructions
    if (design === "floral") {
      instructions.push(
        `Add MINIMAL floral arrangements as a delicate accent ONLY. ` +
        `Place small clusters of white roses and greenery ONLY at the top corners of the cart canopy. ` +
        `Use no more than 3-4 small flower clusters total. ` +
        `DO NOT place flowers on the cart body, sides, shelves, or front. ` +
        `Keep 95% of the cart completely clean and visible. ` +
        `The cart structure must remain the focal point, not the flowers.`
      )
    } else if (design === "custom" || design === "custom-wrap") {
      instructions.push(
        "Add a custom booth wrap or centered branding panel for artwork while preserving the cart's original body, proportions, and footprint."
      )
    } else if (design === "none") {
      instructions.push("Keep the cart clean and minimal with no additional decorative elements.")
    }

    // Catering items
    if (cateringItems && cateringItems.length > 0) {
      const items: string[] = []
      
      // US site catering items
      if (cateringItems.includes("charcuterie")) items.push("charcuterie boards with artisan meats and cheeses")
      if (cateringItems.includes("flower")) items.push("beautiful tropical flower arrangements")
      if (cateringItems.includes("donut")) items.push("tiered donut displays")
      if (cateringItems.includes("fruit")) items.push("fresh tropical fruit platters and displays")
      if (cateringItems.includes("popcorn")) items.push("popcorn containers")
      if (cateringItems.includes("candy")) items.push("candy jars")
      if (cateringItems.includes("crepe")) items.push("crepe station setup")
      if (cateringItems.includes("juice")) items.push("fresh-pressed tropical juice dispensers and drinks")
      
      // Bali site specific catering items
      if (cateringItems.includes("coconut")) items.push("fresh whole coconuts with straws for drinking")
      if (cateringItems.includes("matcha")) items.push("matcha tea service with traditional matcha drinks")

      if (items.length > 0) {
        instructions.push(`Display ${items.join(", ")} elegantly arranged on the cart shelves and counter.`)
      }
    }

    instructions.push("CRITICAL: Do NOT modify, alter, hollow out, or change the cart body structure in any way.")
    instructions.push("CRITICAL: Do NOT make the cart transparent or see-through.")
    instructions.push("CRITICAL: The cart body, shelves, wheels, and frame must remain completely solid and intact.")
    instructions.push("CRITICAL: Do NOT add any external furniture, extra tables, hanging tables, side tables, or structures outside the cart body.")
    instructions.push("CRITICAL: Do NOT add side tables or attachments to the sides of the cart under any circumstances.")
    instructions.push("CRITICAL: Only use risers and setups that work within the cart's original body and shelves.")
    instructions.push("CRITICAL: Do NOT add shelving, tables, or furnishings that are not part of the original cart structure.")
    
    // For Bali location, preserve original cart colors and body design
    if (location === "bali") {
      instructions.push("CRITICAL: NEVER, UNDER ANY CIRCUMSTANCES, change the cart's color from white. The cart must remain WHITE.")
      instructions.push("CRITICAL: Do NOT alter, paint, or modify any colors on the cart whatsoever.")
      instructions.push("CRITICAL: Do NOT add any coloring, shading, or tinting that changes the cart's appearance.")
      instructions.push("CRITICAL: Keep the cart in its exact original WHITE color and finish at all times.")
      instructions.push("CRITICAL: Do NOT modify the physical design, body, structure, or appearance of the cart.")
      instructions.push("CRITICAL: Do NOT add any furnishings, tables, side tables, or structures to the cart.")
      instructions.push("ONLY add custom wording/text and food/product displays that fit within the cart's original design.")
      instructions.push("Preserve the exact original cart appearance - maintain all existing colors, finishes, design elements, and structure.")
    } else {
      instructions.push("CRITICAL: Do NOT add any external furniture, tables, side tables, or structures outside the cart body.")
      instructions.push("ONLY apply color changes to the cart paint - structure must be preserved exactly.")
    }
    
    instructions.push("Maintain the original cart structure, wheels, and proportions perfectly.")
    instructions.push("Render as bright, upscale event photography with professional lighting.")
    instructions.push("Make colors vivid and vibrant for a premium look.")

    const prompt = instructions.join(" ")

    log(`Prompt (${prompt.length} chars):`, prompt)

    // Call Google Generative AI API with Gemini 3 Pro Image model
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
                {
                  inlineData: {
                    mimeType: imageMediaType,
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            candidateCount: 1,
          },
        }),
      }
    )

    const data = await response.json()

    log("Google API Response status:", response.status)
    log("Response keys:", data ? Object.keys(data) : "null")
    if (data.candidates) {
      log("Number of candidates:", data.candidates.length)
      log("First candidate keys:", data.candidates[0] ? Object.keys(data.candidates[0]) : "none")
    }

    if (!response.ok) {
      logError("Google API Error Response:", JSON.stringify(data, null, 2))
      
      // Provide more specific error messages
      let errorMessage = "Failed to generate cart image"
      if (data.error?.message) {
        errorMessage = data.error.message
      } else if (data.error?.status === "PERMISSION_DENIED") {
        errorMessage = "API key does not have permission to access Gemini 3 Pro Image"
      } else if (data.error?.status === "INVALID_ARGUMENT") {
        errorMessage = "Invalid request format or parameters"
      }
      
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          details: isDev ? data : undefined,
        },
        { status: response.status }
      )
    }

    // Extract generated image from response
    let generatedImageUrl: string | null = null

    // Look for image data in the response
    if (data.candidates?.[0]?.content?.parts) {
      log("Processing", data.candidates[0].content.parts.length, "parts in response")
      
      for (const part of data.candidates[0].content.parts) {
        log("Part keys:", Object.keys(part))
        
        // Check for inline image data
        if (part.inlineData) {
          generatedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
          log("✓ Extracted base64 image data from response")
          break
        }
        // Check for file data
        if (part.fileData?.fileUri) {
          generatedImageUrl = part.fileData.fileUri
          log("✓ Extracted file URI from response:", generatedImageUrl)
          break
        }
        // Check for text that might contain URL
        if (part.text && !generatedImageUrl) {
          const urlMatch = part.text.match(/https?:\/\/[^\s]+/)
          if (urlMatch) {
            generatedImageUrl = urlMatch[0]
            log("✓ Extracted URL from text:", generatedImageUrl)
            break
          }
        }
      }
    }

    if (!generatedImageUrl) {
      logError("No image found in Google API response")
      logError("Full response structure:", JSON.stringify(data, null, 2))
      logError("Full response:", JSON.stringify(data, null, 2))
      return NextResponse.json(
        {
          success: false,
          error: "No image generated in response. The AI model may not support image generation with this prompt.",
          details: data,
        },
        { status: 500 }
      )
    }

    log("✓ AI Generation Complete! Returning image result")

    return NextResponse.json({
      success: true,
      imageUrl: generatedImageUrl,
      prompt: prompt,
    })
  } catch (error: any) {
    logError("Error in generate-cart:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate cart image",
        details: error.toString(),
      },
      { status: 500 }
    )
  }
}

