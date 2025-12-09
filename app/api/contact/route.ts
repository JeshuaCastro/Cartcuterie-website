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

    // Create email content
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

    // For now, we'll use a mailto link approach which is client-side
    // In production, you'll want to use a service like SendGrid, Resend, or Nodemailer with SMTP
    
    // Log the submission (you can integrate with email service here)
    console.log("Contact form submission:", {
      name,
      email,
      eventType,
      timestamp: new Date().toISOString(),
    })

    // Return success - the actual email will be sent via mailto: link on client
    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
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
