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
              <h2 className="text-2xl font-bold text-foreground">1. Deposit Policy</h2>
              <p>
                All bookings require a deposit to secure your event date. This deposit is <strong>non-refundable</strong> under all circumstances, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Client-initiated cancellations</li>
                <li>Changes to event date or details</li>
                <li>Weather conditions (see Weather Policy below)</li>
                <li>Force majeure events</li>
              </ul>
              <p>
                The deposit amount varies by package and location but typically ranges from 25-50% of the total service cost.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">2. Cancellation Timeline</h2>
              
              <div className="bg-muted/30 p-6 rounded-lg space-y-4">
                <h3 className="text-xl font-semibold text-foreground">More Than 60 Days Before Event</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Deposit is non-refundable</li>
                  <li>Remaining balance: 75% refund</li>
                  <li>Option to reschedule within 12 months (subject to availability)</li>
                </ul>
              </div>

              <div className="bg-muted/30 p-6 rounded-lg space-y-4">
                <h3 className="text-xl font-semibold text-foreground">30-60 Days Before Event</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Deposit is non-refundable</li>
                  <li>Remaining balance: 50% refund</li>
                  <li>Option to reschedule within 6 months (subject to availability and rescheduling fee)</li>
                </ul>
              </div>

              <div className="bg-muted/30 p-6 rounded-lg space-y-4">
                <h3 className="text-xl font-semibold text-foreground">15-29 Days Before Event</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Deposit is non-refundable</li>
                  <li>Remaining balance: 25% refund</li>
                  <li>Rescheduling subject to availability and 25% rescheduling fee</li>
                </ul>
              </div>

              <div className="bg-muted/30 p-6 rounded-lg space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Less Than 15 Days Before Event</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>No refund available</li>
                  <li>Full payment is due regardless of cancellation</li>
                  <li>No rescheduling options</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. Weather Policy</h2>
              <p>
                We understand that weather can impact outdoor events. However, as a service business that blocks calendar dates:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Weather-related cancellations follow the same cancellation timeline above</li>
                <li>We recommend purchasing event insurance to cover weather-related cancellations</li>
                <li>We will work with you to provide covered alternatives when possible</li>
                <li>Rain or wind does not automatically qualify for a refund</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-foreground mt-4">Extreme Weather Exceptions</h3>
              <p>In cases of extreme weather (hurricanes, severe storms, government-issued warnings):</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full credit towards a future booking within 12 months</li>
                <li>Or 50% refund of remaining balance (deposit non-refundable)</li>
                <li>Determination of "extreme weather" at Cartcuterie's discretion</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Changes to Booking</h2>
              
              <h3 className="text-xl font-semibold text-foreground">Date Changes</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>First date change: $100 rescheduling fee (subject to availability)</li>
                <li>Subsequent date changes: $250 rescheduling fee</li>
                <li>Must be requested at least 30 days before original event date</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mt-4">Package Changes</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Upgrades: Price difference plus 10% fee</li>
                <li>Downgrades: No refund on price difference; original deposit applied</li>
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
              <h2 className="text-2xl font-bold text-foreground">5. Service Issues and Refunds</h2>
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
              <h2 className="text-2xl font-bold text-foreground">6. Refund Processing</h2>
              <p>Approved refunds will be processed as follows:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refunds issued to original payment method</li>
                <li>Processing time: 7-14 business days</li>
                <li>Bank processing may take an additional 3-5 business days</li>
                <li>Refunds for international payments (Bali): May take up to 21 days</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">7. Force Majeure</h2>
              <p>
                In the event of circumstances beyond our reasonable control (pandemic, natural disaster, government restrictions, etc.):
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We will work with you to reschedule within 18 months</li>
                <li>Deposit will be transferred to new date</li>
                <li>If rescheduling is not possible, 50% refund of total paid (deposit non-refundable)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">8. Client-Caused Issues</h2>
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
              <h2 className="text-2xl font-bold text-foreground">9. International Services (Bali)</h2>
              <p>
                Additional terms for Bali-based services:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Deposits for Bali services are strictly non-refundable due to import/preparation costs</li>
                <li>Currency exchange rate fluctuations may affect final pricing</li>
                <li>Refunds processed in IDR may be subject to exchange rate at time of refund</li>
                <li>Additional bank fees may apply for international refunds</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">10. Dispute Resolution</h2>
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
                  <li>Purchasing event cancellation insurance</li>
                  <li>Reading our full Terms & Conditions</li>
                  <li>Confirming all details at least 14 days before your event</li>
                  <li>Understanding that deposits are investments in securing your date</li>
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
