import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, eventType, eventDate, eventTime, location, message } = body

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

    // Send email to business owner
    const businessEmail = await resend.emails.send({
      from: "Cartcuterie <noreply@cartcuterie.la>",
      to: "cartcuteriela@gmail.com",
      subject: `New Cart Inquiry from ${name}`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #2c3e50;">New Cart Inquiry Submission</h2>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
              <p><strong>Event Type:</strong> ${eventType}</p>
              <p><strong>Event Date:</strong> ${eventDate || "Not provided"}</p>
              <p><strong>Event Time:</strong> ${eventTime || "Not provided"}</p>
              <p><strong>Location:</strong> ${location || "Not provided"}</p>
            </div>
            <h3>Message:</h3>
            <p>${message || "No message provided"}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #999;">
              Submitted at: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}
            </p>
          </body>
        </html>
      `,
      replyTo: email,
    })

    if (businessEmail.error) {
      console.error("Error sending business email:", businessEmail.error)
      throw new Error(businessEmail.error.message)
    }

    // Send confirmation email to customer
    const confirmationEmail = await resend.emails.send({
      from: "Cartcuterie <noreply@cartcuterie.la>",
      to: email,
      subject: "We Received Your Cart Inquiry - Cartcuterie",
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #2c3e50;">Thank You for Your Inquiry!</h2>
            <p>Hi ${name},</p>
            <p>We've received your cart inquiry and really appreciate your interest in Cartcuterie. Our team will review your request and get back to you shortly with a personalized quote and more details.</p>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Your Inquiry Details:</h3>
              <p><strong>Event Type:</strong> ${eventType}</p>
              <p><strong>Event Date:</strong> ${eventDate || "TBD"}</p>
              <p><strong>Event Time:</strong> ${eventTime || "TBD"}</p>
              <p><strong>Location:</strong> ${location || "TBD"}</p>
            </div>
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
