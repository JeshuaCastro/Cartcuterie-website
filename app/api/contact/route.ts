import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, eventType, eventDate, location, message } = body

    // Validate required fields
    if (!name || !email || !eventType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get Brevo API key from environment variables
    const brevoApiKey = process.env.BREVO_API_KEY
    if (!brevoApiKey) {
      console.error("BREVO_API_KEY is not set in environment variables")
      console.error("Available env vars:", Object.keys(process.env).filter(k => k.includes('BREVO') || k.includes('API')))
      return NextResponse.json(
        { success: false, error: "Email service not configured - API key missing from environment" },
        { status: 500 }
      )
    }
    
    // Log successful key detection (partial)
    console.log("✓ BREVO_API_KEY found in environment variables")

    // Create email content for the business owner
    const emailContent = `
New Contact Form Submission from Cartcuterie Website

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Event Type: ${eventType}
Event Date: ${eventDate || "Not provided"}
Location: ${location || "Not provided"}

Message:
${message || "No message provided"}

---
Submitted at: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}
    `.trim()

    // Send email via Brevo API to business owner
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": brevoApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Cartcuterie Website",
          email: "noreply@cartcuterie.com",
        },
        to: [
          {
            email: "cartcuteriela@gmail.com",
            name: "Cartcuterie Team",
          },
        ],
        subject: `New Cart Inquiry from ${name}`,
        htmlContent: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #2c3e50;">New Cart Inquiry Submission</h2>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
                <p><strong>Event Type:</strong> ${eventType}</p>
                <p><strong>Event Date:</strong> ${eventDate || "Not provided"}</p>
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
        replyTo: {
          email: email,
          name: name,
        },
      }),
    })

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.json()
      console.error("Brevo API error:", errorData)
      return NextResponse.json(
        { success: false, error: "Failed to send email" },
        { status: 500 }
      )
    }

    // Send confirmation email to customer
    const confirmationResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": brevoApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Cartcuterie",
          email: "noreply@cartcuterie.com",
        },
        to: [
          {
            email: email,
            name: name,
          },
        ],
        subject: "We Received Your Cart Inquiry - Cartcuterie",
        htmlContent: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #2c3e50;">Thank You for Your Inquiry!</h2>
              <p>Hi ${name},</p>
              <p>We've received your cart inquiry and really appreciate your interest in Cartcuterie. Our team will review your request and get back to you shortly with a personalized quote and more details.</p>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Your Inquiry Details:</h3>
                <p><strong>Event Type:</strong> ${eventType}</p>
                <p><strong>Event Date:</strong> ${eventDate || "TBD"}</p>
                <p><strong>Location:</strong> ${location || "TBD"}</p>
              </div>
              <p>If you have any questions in the meantime, feel free to reach out to us directly.</p>
              <p style="margin-top: 30px;">
                Best regards,<br>
                <strong>The Cartcuterie Team</strong>
              </p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="font-size: 12px; color: #999; text-align: center;">
                © 2025 Cartcuterie. All rights reserved.
              </p>
            </body>
          </html>
        `,
      }),
    })

    if (!confirmationResponse.ok) {
      console.warn("Failed to send confirmation email to customer")
      // Don't fail the request if confirmation email fails - the main email was sent
    }

    // Log the submission
    console.log("Contact form submission sent via Brevo:", {
      name,
      email,
      eventType,
      timestamp: new Date().toISOString(),
    })

    // Return success
    return NextResponse.json({
      success: true,
      message: "Form submitted successfully. We'll be in touch soon!",
      emailContent,
    })
  } catch (error: any) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process form submission" },
      { status: 500 }
    )
  }
}
