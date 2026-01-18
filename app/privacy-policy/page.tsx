import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Privacy Policy | Cartcuterie",
  description: "Privacy Policy for Cartcuterie - Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm text-muted-foreground">
              <strong>Last Updated:</strong> January 13, 2026
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">1. Introduction</h2>
              <p>
                Cartcuterie ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-foreground">Personal Information</h3>
              <p>We may collect personal information that you voluntarily provide to us, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and contact information (email, phone number, address)</li>
                <li>Event details (date, location, type of event)</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Communication preferences</li>
                <li>Any other information you choose to provide</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mt-4">Automatically Collected Information</h3>
              <p>When you visit our website, we may automatically collect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Cookie data and similar tracking technologies</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. How We Use Your Information</h2>
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Processing and fulfilling your cart rental and catering orders</li>
                <li>Communicating with you about your events and bookings</li>
                <li>Sending quotes, confirmations, and updates</li>
                <li>Improving our services and customer experience</li>
                <li>Marketing communications (with your consent)</li>
                <li>Complying with legal obligations</li>
                <li>Preventing fraud and ensuring security</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Information Sharing and Disclosure</h2>
              <p>We do not sell your personal information. We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our business (payment processors, email service providers, analytics providers)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition of our business</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">5. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences through your browser settings. For more information, see our <a href="/cookie-policy" className="text-accent hover:underline">Cookie Policy</a>.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">6. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">7. Your Privacy Rights</h2>
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access, correct, or delete your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Restrict or object to processing of your data</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p>To exercise these rights, please contact us at <a href="mailto:cartcuteriela@gmail.com" className="text-accent hover:underline">cartcuteriela@gmail.com</a></p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">8. Children's Privacy</h2>
              <p>
                Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">9. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">10. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">11. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              <ul className="list-none space-y-2">
                <li><strong>Email:</strong> <a href="mailto:cartcuteriela@gmail.com" className="text-accent hover:underline">cartcuteriela@gmail.com</a></li>
                <li><strong>Location:</strong> Los Angeles, California</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
