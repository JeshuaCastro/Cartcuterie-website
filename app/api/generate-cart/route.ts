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
    const primaryColor = colors?.primary || "#FFFFFF"
    const secondaryColor = colors?.secondary || "#FFD700"
    const roofColor = colors?.roofColor || "#FFFFFF"

    const instructions: string[] = [
      "Generate a professional product photo of this catering cart with the following customizations:",
    ]

    // Skip all color customizations if plain roof is selected
    const isPlainRoof = roofDecor === "plain"

    if (!isPlainRoof) {
      // Color instructions
      if (primaryColor !== "#FFFFFF") {
        instructions.push(`Paint the main cart body in ${primaryColor}.`)
      }
      instructions.push(`Add ${secondaryColor} accents on trim, moulding, and decorative elements.`)

      // Roof/canopy instructions
      if (cartType === "classic" || cartType === "ice-cream") {
        if (roofDecor === "stripe-cloth" || roofDecor === "stripe-vinyl") {
          instructions.push(`Add a striped canopy with alternating ${roofColor} and ${secondaryColor} stripes.`)
        } else if (roofDecor !== "plain") {
          instructions.push(`Add a decorative canopy in ${roofColor} with ${secondaryColor} accents.`)
        }
      } else {
        // Mobile cart
        if (roofDecor === "striped-roof") {
          instructions.push(`Add a modern striped canopy with ${roofColor} and ${secondaryColor} stripes.`)
        } else if (roofDecor === "custom") {
          instructions.push(`Add a custom-designed canopy featuring ${roofColor} and ${secondaryColor}.`)
        }
      }
    } else {
      // Plain roof selected - keep cart in its natural state
      instructions.push("Keep the cart in its clean, natural finish without color customization.")
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
    } else if (design === "custom") {
      instructions.push("Include a centered branding panel area for custom artwork.")
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
    instructions.push("ONLY apply color changes to the cart paint - structure must be preserved exactly.")
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

