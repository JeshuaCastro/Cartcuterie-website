import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Disclaimers | Cartcuterie",
  description: "Important disclaimers regarding Cartcuterie services, food safety, and liability.",
}

export default function DisclaimersPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8">
            Disclaimers
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm text-muted-foreground">
              <strong>Last Updated:</strong> January 13, 2026
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-r-lg">
              <p className="text-amber-900 font-semibold">
                Please read these disclaimers carefully before booking our services. By using Cartcuterie's services, you acknowledge and accept these terms.
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">1. Food Safety & Allergen Disclaimer</h2>
              
              <h3 className="text-xl font-semibold text-foreground">Allergen Information</h3>
              <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                <p className="text-red-900 font-semibold mb-3">⚠️ IMPORTANT ALLERGEN NOTICE</p>
                <ul className="list-disc pl-6 space-y-2 text-red-900">
                  <li>Our catering services may contain or come into contact with common allergens including: milk, eggs, wheat, soy, peanuts, tree nuts, fish, and shellfish</li>
                  <li>We <strong>cannot guarantee</strong> allergen-free food preparation</li>
                  <li>Cross-contamination may occur in our facilities and during transport</li>
                  <li>Clients must inform guests of all ingredients and potential allergens</li>
                  <li>We are <strong>not liable</strong> for allergic reactions</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-foreground mt-4">Food Handling</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>All food is prepared in accordance with local health department regulations</li>
                <li>Food temperatures are maintained during transport and service</li>
                <li>Once food is delivered and set up, food safety becomes the client's responsibility</li>
                <li>We recommend consuming all perishable items within 2 hours of service</li>
                <li>Leftover food is the client's responsibility and should be refrigerated promptly</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mt-4">Dietary Restrictions</h3>
              <p>
                While we make every effort to accommodate dietary restrictions:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Requests must be made at least 14 days in advance</li>
                <li>We cannot guarantee 100% compliance for severe allergies</li>
                <li>Vegan, vegetarian, and gluten-free options may be available (ask in advance)</li>
                <li>Religious dietary requirements (halal, kosher) should be discussed during booking</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">2. Service Limitations</h2>
              
              <h3 className="text-xl font-semibold text-foreground">Equipment & Setup</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cart appearance may vary slightly from photos due to seasonal decorations and availability</li>
                <li>Setup requires adequate space and level ground</li>
                <li>Electrical outlets must be within 25 feet if power is needed</li>
                <li>We are not responsible for venue-related setup issues</li>
                <li>Inclement weather may require alternative setup arrangements</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mt-4">Staffing</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Staff assignments are at Cartcuterie's discretion</li>
                <li>We cannot guarantee specific staff members for your event</li>
                <li>Staff are trained professionals but not medical personnel</li>
                <li>Staff will not serve intoxicated guests</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. Liability Limitations</h2>
              
              <div className="bg-muted/30 p-6 rounded-lg">
                <p className="font-semibold text-foreground mb-3">Cartcuterie is NOT liable for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Personal injury or illness</strong> not directly caused by our gross negligence</li>
                  <li><strong>Allergic reactions</strong> or food sensitivities</li>
                  <li><strong>Property damage</strong> at the venue unless caused by our direct negligence</li>
                  <li><strong>Lost or stolen items</strong> during events</li>
                  <li><strong>Guest behavior</strong> or intoxication</li>
                  <li><strong>Venue issues</strong> (power outages, access problems, etc.)</li>
                  <li><strong>Weather conditions</strong> affecting outdoor events</li>
                  <li><strong>Third-party vendor failures</strong> (venues, other caterers, etc.)</li>
                  <li><strong>Photographic results</strong> or social media appearance</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-foreground mt-4">Maximum Liability</h3>
              <p>
                In any event, Cartcuterie's total liability shall not exceed the total amount paid by the client for the specific event in question.
              </p>
              
              <p className="text-sm italic mt-4">
                Note: Clients are strongly encouraged to obtain their own event insurance to protect against unforeseen circumstances.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Photography & Media Release</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>We may photograph events for marketing purposes unless you opt-out in writing</li>
                <li>Images may be used on our website, social media, and promotional materials</li>
                <li>We do not compensate for use of event photos</li>
                <li>Client may request removal of specific images within 30 days of posting</li>
                <li>Guest faces may be blurred or cropped in marketing materials</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">5. Pricing & Quote Accuracy</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Prices quoted are estimates and may change based on final details</li>
                <li>Currency exchange rates (for Bali services) may fluctuate</li>
                <li>Additional fees may apply for remote locations, difficult access, or special requests</li>
                <li>Prices are subject to change until contract is signed and deposit paid</li>
                <li>Sales tax and service charges are additional where applicable</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">6. Weather & Outdoor Events</h2>
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <p className="text-blue-900 font-semibold mb-3">☔ Weather Disclaimer</p>
                <ul className="list-disc pl-6 space-y-2 text-blue-900">
                  <li>We operate rain or shine unless extreme conditions exist</li>
                  <li>Light rain does not constitute grounds for cancellation</li>
                  <li>Clients should have backup plans for outdoor events</li>
                  <li>We recommend event insurance for weather-related concerns</li>
                  <li>We will provide covered alternatives when possible but cannot guarantee weather protection</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">7. International Services (Bali)</h2>
              <p>Additional disclaimers for Bali-based services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Services subject to Indonesian laws and regulations</li>
                <li>Import restrictions may affect available ingredients or equipment</li>
                <li>Language barriers may occasionally affect communication</li>
                <li>Cultural customs should be respected during service</li>
                <li>Travel to remote areas in Bali may incur additional charges</li>
                <li>Local holidays may affect service availability</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">8. Force Majeure</h2>
              <p>
                We are not liable for failure to perform services due to circumstances beyond our reasonable control, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Natural disasters (earthquakes, floods, hurricanes)</li>
                <li>Pandemics or public health emergencies</li>
                <li>Government restrictions or mandates</li>
                <li>Labor disputes or strikes</li>
                <li>Equipment failures beyond our control</li>
                <li>Supplier failures or shortages</li>
                <li>Acts of terrorism or civil unrest</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">9. Health & Safety Compliance</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>We maintain all required health permits and licenses</li>
                <li>Staff are trained in food safety protocols</li>
                <li>We follow current health guidelines and regulations</li>
                <li>Clients must disclose any venue-specific health requirements</li>
                <li>We reserve the right to refuse service if health standards cannot be met</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">10. Alcohol Service (Where Applicable)</h2>
              <p>If alcohol service is included:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We will not serve minors or intoxicated individuals</li>
                <li>Valid ID may be required</li>
                <li>Client is responsible for obtaining necessary alcohol licenses/permits</li>
                <li>We are not liable for guest behavior related to alcohol consumption</li>
                <li>Service may be discontinued if guests become unruly</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">11. Intellectual Property</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Custom cart designs remain Cartcuterie's intellectual property</li>
                <li>Clients may not reproduce our unique cart designs commercially</li>
                <li>Logo usage on carts is for event purposes only</li>
                <li>We respect client trademarks and copyrights</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">12. No Medical or Legal Advice</h2>
              <p>
                Cartcuterie does not provide medical, legal, or professional advice. Information provided is for general purposes only. Consult appropriate professionals for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dietary restrictions and allergies (consult a physician)</li>
                <li>Event permits and licenses (consult legal counsel)</li>
                <li>Food safety for compromised immune systems (consult healthcare provider)</li>
                <li>Event insurance (consult insurance agent)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">13. Accuracy of Information</h2>
              <p>
                While we strive for accuracy:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Website content is for informational purposes</li>
                <li>Errors or omissions may occur</li>
                <li>Photos may not represent exact current offerings</li>
                <li>Prices and availability are subject to change</li>
                <li>Confirm all details before booking</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">14. Insurance Recommendation</h2>
              <div className="bg-accent/10 p-6 rounded-lg">
                <p className="font-semibold text-foreground mb-3">💡 Strongly Recommended</p>
                <p>
                  We highly recommend that clients purchase event cancellation and liability insurance to protect against:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Weather-related cancellations</li>
                  <li>Illness or emergency cancellations</li>
                  <li>Property damage or personal injury claims</li>
                  <li>Vendor no-shows (general coverage, not specific to us)</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">15. Contact for Questions</h2>
              <p>
                If you have questions about these disclaimers or need clarification:
              </p>
              <ul className="list-none space-y-2">
                <li><strong>Email:</strong> <a href="mailto:cartcuteriela@gmail.com" className="text-accent hover:underline">cartcuteriela@gmail.com</a></li>
                <li><strong>Subject:</strong> "Disclaimers Question"</li>
              </ul>
            </section>

            <section className="space-y-4 mt-8 p-6 bg-red-50 border-l-4 border-red-600 rounded-r-lg">
              <p className="text-red-900 font-semibold">
                These disclaimers are part of our <a href="/terms-conditions" className="text-red-700 underline hover:text-red-800">Terms & Conditions</a>. By booking with Cartcuterie, you acknowledge that you have read, understood, and agree to these disclaimers.
              </p>
              <p className="text-red-900 text-sm mt-2">
                If you do not agree with any part of these disclaimers, please do not use our services.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
