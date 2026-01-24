import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Terms & Conditions | Cartcuterie",
  description: "Terms and Conditions for Cartcuterie cart rental and catering services.",
}

export default function TermsConditionsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8">
            Terms & Conditions
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm text-muted-foreground">
              <strong>Last Updated:</strong> January 13, 2026
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Cartcuterie's website and services, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">2. Services Description</h2>
              <p>
                Cartcuterie provides mobile cart rental and catering services for events in Los Angeles, California, and Bali, Indonesia. Our services include but are not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cart rental (classic, mobile, ice cream, tropical, etc.)</li>
                <li>Custom cart design and decoration</li>
                <li>Full-service catering options</li>
                <li>Delivery, setup, and pickup services</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. Booking and Reservations</h2>
              
              <h3 className="text-xl font-semibold text-foreground">Quotes</h3>
              <p>
                All quotes are estimates and may be subject to change based on final event details, guest count, and specific requirements.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-4">Downpayments</h3>
              <p>
                A non-refundable 50% downpayment is required to secure your booking.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-4">Payment Terms</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Downpayments (50%) are due upon booking confirmation</li>
                <li>Accepted payment methods: credit card, bank transfer, or as otherwise agreed</li>
                <li>Late downpayments may result in cancellation of services</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Cancellations and Refunds</h2>
              <p>Please refer to our <a href="/refund-policy" className="text-accent hover:underline">Refund Policy</a> for detailed cancellation terms.</p>
              
              <h3 className="text-xl font-semibold text-foreground">General Guidelines:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Downpayments (50%) are non-refundable</li>
                <li>You may reschedule your event (subject to availability)</li>
                <li>Weather-related cancellations will be handled on a case-by-case basis</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">5. Client Responsibilities</h2>
              <p>The client agrees to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate event information (date, time, location, guest count)</li>
                <li>Ensure venue access for delivery and setup</li>
                <li>Provide adequate space and electrical outlets (if required)</li>
                <li>Notify us of any venue restrictions or requirements</li>
                <li>Ensure the venue permits outside catering (if applicable)</li>
                <li>Provide final guest count at least 7 days before the event</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">6. Food Safety and Allergens</h2>
              <p>
                We take food safety seriously and follow all applicable health regulations. However:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Clients must inform us of any dietary restrictions or allergies</li>
                <li>We cannot guarantee complete allergen-free environments</li>
                <li>Cross-contamination may occur in our preparation facilities</li>
                <li>Clients are responsible for informing their guests of ingredients</li>
              </ul>
              <p>
                See our <a href="/disclaimers" className="text-accent hover:underline">Disclaimers</a> for more information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">7. Liability Limitations</h2>
              <p>
                We are not liable for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Damage to venue property not caused by our negligence</li>
                <li>Personal injury not caused by our direct actions</li>
                <li>Lost or stolen personal items</li>
                <li>Events beyond our reasonable control (force majeure)</li>
              </ul>
              <p className="mt-4">
                Clients are strongly encouraged to obtain event insurance to protect against unforeseen circumstances and liabilities.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">8. Intellectual Property</h2>
              <p>
                All content on our website, including images, logos, and designs, are the property of Cartcuterie and protected by copyright laws. You may not use our content without written permission.
              </p>
              
              <h3 className="text-xl font-semibold text-foreground mt-4">Photography Rights</h3>
              <p>
                We reserve the right to photograph events for marketing purposes. If you prefer not to be photographed or have images used, please notify us in writing.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">9. Force Majeure</h2>
              <p>
                We are not liable for failure to perform due to circumstances beyond our reasonable control, including but not limited to: natural disasters, pandemics, government restrictions, labor disputes, or equipment failures.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">10. Changes to Services</h2>
              <p>
                We reserve the right to modify our services, pricing, and policies at any time. Changes will not affect confirmed bookings unless mutually agreed upon.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">11. Governing Law</h2>
              <p>
                These Terms and Conditions are governed by the laws of the State of California, United States, and the laws of Indonesia for Bali-based services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">12. Dispute Resolution</h2>
              <p>
                Any disputes arising from these terms shall first be attempted to be resolved through good faith negotiation. If unresolved, disputes may be submitted to mediation before pursuing legal action.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">13. Contact Information</h2>
              <p>For questions about these Terms and Conditions, please contact us:</p>
              <ul className="list-none space-y-2">
                <li><strong>Email:</strong> <a href="mailto:cartcuteriela@gmail.com" className="text-accent hover:underline">cartcuteriela@gmail.com</a></li>
                <li><strong>Los Angeles Location:</strong> Los Angeles, California, USA</li>
                <li><strong>Bali Location:</strong> Bali, Indonesia</li>
              </ul>
            </section>

            <section className="space-y-4 mt-8 p-6 bg-muted/30 rounded-lg">
              <p className="text-sm">
                By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
