import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Refund Policy | Cartcuterie",
  description: "Refund and cancellation policy for Cartcuterie cart rental and catering services.",
}

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8">
            Refund & Cancellation Policy
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm text-muted-foreground">
              <strong>Last Updated:</strong> January 13, 2026
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">1. Downpayment Policy</h2>
              <p>
                All bookings require a 50% downpayment to secure your event date. This downpayment is <strong>non-refundable</strong> under all circumstances, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Client-initiated cancellations</li>
                <li>Changes to event date or details</li>
                <li>Weather conditions (see Weather Policy below)</li>
                <li>Force majeure events</li>
              </ul>
              <p>
                If you need to cancel, the 50% downpayment is non-refundable, but we offer the option to reschedule your event (subject to availability).
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">2. Weather Policy</h2>
              <p>
                We understand that weather can impact outdoor events. However, as a service business that blocks calendar dates:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The 50% downpayment is non-refundable for weather-related cancellations</li>
                <li>We offer the option to reschedule (subject to availability)</li>
                <li>We recommend purchasing event insurance to cover weather-related cancellations</li>
                <li>We will work with you to provide covered alternatives when possible</li>
                <li>Rain or wind does not automatically qualify for a refund</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-foreground mt-4">Extreme Weather Exceptions</h3>
              <p>In cases of extreme weather (hurricanes, severe storms, government-issued warnings):</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full credit towards a future booking within 12 months</li>
                <li>Or 50% refund of remaining balance (downpayment non-refundable)</li>
                <li>Determination of "extreme weather" at Cartcuterie's discretion</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. Changes to Booking</h2>
              
              <h3 className="text-xl font-semibold text-foreground">Date Changes</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Date changes are free of charge (subject to availability)</li>
                <li>Must be requested as soon as possible</li>
                <li>We will do our best to accommodate your preferred new date</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mt-4">Package Changes</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>We are happy to update your package and adjust the price accordingly</li>
                <li>Upgrades: Price difference will be added to final payment</li>
                <li>Downgrades: Price difference will be credited; original downpayment applied</li>
                <li>Changes must be finalized at least 14 days before event</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mt-4">Guest Count Changes</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Final guest count due 7 days before event</li>
                <li>Increases: Additional charges apply</li>
                <li>Decreases: Minimum guest count charges may apply; no refund below minimum</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Service Issues and Refunds</h2>
              <p>
                If we fail to provide the agreed-upon services due to our fault, we will:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Offer immediate resolution or substitution at the event</li>
                <li>Provide partial refund for specific undelivered services</li>
                <li>Full refund only if we completely fail to show up (rare)</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-foreground mt-4">Claims Process</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Service issues must be reported within 48 hours of event</li>
                <li>Photo or video evidence may be required</li>
                <li>We will investigate and respond within 7 business days</li>
                <li>Refund determinations are at Cartcuterie's discretion</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">5. Refund Processing</h2>
              <p>Approved refunds will be processed as follows:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refunds issued to original payment method</li>
                <li>Processing time: 7-14 business days</li>
                <li>Bank processing may take an additional 3-5 business days</li>
                <li>Refunds for international payments (Bali): May take up to 21 days</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">6. Force Majeure</h2>
              <p>
                In the event of circumstances beyond our reasonable control (pandemic, natural disaster, government restrictions, etc.):
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We will work with you to reschedule within 18 months</li>
                <li>Downpayment will be transferred to new date</li>
                <li>If rescheduling is not possible, 50% refund of total paid (downpayment non-refundable)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">7. Client-Caused Issues</h2>
              <p>No refunds will be issued for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Incorrect venue information provided by client</li>
                <li>Venue access issues not communicated in advance</li>
                <li>Client no-show or late arrival affecting setup</li>
                <li>Client failure to obtain necessary permits</li>
                <li>Last-minute changes requested day-of event</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">8. International Services (Bali)</h2>
              <p>
                Additional terms for Bali-based services:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Downpayments for Bali services are strictly non-refundable due to import/preparation costs</li>
                <li>Currency exchange rate fluctuations may affect final pricing</li>
                <li>Refunds processed in IDR may be subject to exchange rate at time of refund</li>
                <li>Additional bank fees may apply for international refunds</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">9. Dispute Resolution</h2>
              <p>
                If you disagree with our refund decision:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact us within 7 days of our decision</li>
                <li>Provide detailed explanation and any additional evidence</li>
                <li>We will review and provide final decision within 14 days</li>
                <li>Final decisions are binding</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">11. Recommendations</h2>
              <div className="bg-accent/10 p-6 rounded-lg">
                <p className="font-semibold text-foreground mb-2">We Strongly Recommend:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Reading our full Terms & Conditions</li>
                  <li>Confirming all details at least 14 days before your event</li>
                  <li>Understanding that downpayments are investments in securing your date</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">12. Contact Us</h2>
              <p>For refund requests or questions about this policy:</p>
              <ul className="list-none space-y-2">
                <li><strong>Email:</strong> <a href="mailto:cartcuteriela@gmail.com" className="text-accent hover:underline">cartcuteriela@gmail.com</a></li>
                <li><strong>Subject Line:</strong> "Refund Request - [Your Event Date]"</li>
              </ul>
            </section>

            <section className="space-y-4 mt-8 p-6 bg-muted/30 rounded-lg">
              <p className="text-sm">
                This policy is part of our <a href="/terms-conditions" className="text-accent hover:underline">Terms & Conditions</a>. By booking with Cartcuterie, you acknowledge and accept this Refund Policy.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
