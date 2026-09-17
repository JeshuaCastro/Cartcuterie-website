import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { escapeEmailHtml, renderInquiryDetails } from "@/lib/inquiry-email"

const attachmentNames = {
  logo: "uploaded-logo",
  decalDesignImage: "uploaded-decal",
  aiGeneratedImage: "ai-visualization",
} as const

function getAttachment(value: unknown, baseName: string) {
  if (typeof value !== "string" || !value) return null

  const match = /^data:(image\/(?:png|jpeg|webp|gif|svg\+xml));base64,([\s\S]+)$/i.exec(value)
  if (!match) return null

  const contentType = match[1].toLowerCase()
  const extension =
    contentType === "image/jpeg"
      ? "jpg"
      : contentType === "image/svg+xml"
        ? "svg"
        : contentType.split("/")[1]
  const content = Buffer.from(match[2].replace(/\s/g, ""), "base64")
  if (content.length === 0 || content.length > 10 * 1024 * 1024) return null

  return {
    filename: `${baseName}.${extension}`,
    content,
    contentType,
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name,
      email,
      phone,
      eventType,
      eventDate,
      eventTime,
      location,
      message,
      siteLocation,
      logo,
      decalDesignImage,
      aiGeneratedImage,
    } = body

    // Validate required fields
    if (!name || !email || !eventType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("Resend API key not configured")
      return NextResponse.json(
        { success: false, error: "Email service not configured" },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const inquiryDetails = renderInquiryDetails(body)

    // Send email to business owner
    // Route to appropriate email based on site location
    const recipientEmail = siteLocation === 'bali' ? 'cartcuteriebali@gmail.com' : 'cartcuteriela@gmail.com'
    const attachments = [
      getAttachment(logo, attachmentNames.logo),
      getAttachment(decalDesignImage, attachmentNames.decalDesignImage),
      getAttachment(aiGeneratedImage, attachmentNames.aiGeneratedImage),
    ].filter((attachment): attachment is NonNullable<typeof attachment> => Boolean(attachment))
    
    const businessEmail = await resend.emails.send({
      from: "Cartcuterie <noreply@cartcuterie.com>",
      to: recipientEmail,
      subject: `New Cart Inquiry from ${name}${siteLocation === 'bali' ? ' (BALI)' : ''}`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #2c3e50;">New Cart Inquiry Submission${siteLocation === 'bali' ? ' - 🌴 BALI LOCATION' : ''}</h2>
            ${inquiryDetails}
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #999;">
              Submitted at: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}
            </p>
          </body>
        </html>
      `,
      replyTo: email,
      attachments,
    })

    if (businessEmail.error) {
      console.error("Error sending business email:", businessEmail.error)
      throw new Error(businessEmail.error.message)
    }

    // Send confirmation email to customer
    const confirmationEmail = await resend.emails.send({
      from: "Cartcuterie <noreply@cartcuterie.com>",
      to: email,
      subject: "We Received Your Cart Inquiry - Cartcuterie",
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #2c3e50;">Thank You for Your Inquiry!</h2>
            <p>Hi ${escapeEmailHtml(name)},</p>
            <p>We've received your cart inquiry and really appreciate your interest in Cartcuterie. Our team will review your request and get back to you shortly with a personalized quote and more details.</p>
            ${inquiryDetails}
            <p style="color: #666;">If you have any questions in the meantime, feel free to reply to this email or contact us directly.</p>
            <p>Best regards,<br><strong>Cartcuterie Team</strong></p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">
              © 2025 Cartcuterie. All rights reserved.
            </p>
          </body>
        </html>
      `,
    })

    if (confirmationEmail.error) {
      console.error("Error sending confirmation email:", confirmationEmail.error)
      throw new Error(confirmationEmail.error.message)
    }

    return NextResponse.json({
      success: true,
      message: "Emails sent successfully",
    })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to send emails" 
      },
      { status: 500 }
    )
  }
}
