import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Cookie Policy | Cartcuterie",
  description: "Learn about how Cartcuterie uses cookies and similar tracking technologies.",
}

export default function CookiePolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8">
            Cookie Policy
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm text-muted-foreground">
              <strong>Last Updated:</strong> January 13, 2026
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are stored on your device when you visit a website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">2. How We Use Cookies</h2>
              <p>We use cookies for the following purposes:</p>
              
              <h3 className="text-xl font-semibold text-foreground">Essential Cookies</h3>
              <p>These cookies are necessary for the website to function properly:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Session management and security</li>
                <li>Cart builder data persistence (localStorage)</li>
                <li>Form data retention</li>
                <li>User preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mt-4">Analytics Cookies</h3>
              <p>These help us understand how visitors interact with our website:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Page views and visitor counts</li>
                <li>Traffic sources and referrals</li>
                <li>User behavior and navigation patterns</li>
                <li>Device and browser information</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mt-4">Marketing Cookies</h3>
              <p>These cookies track your activity to provide relevant advertisements:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Retargeting campaigns</li>
                <li>Social media integration</li>
                <li>Conversion tracking</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. Types of Cookies We Use</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full border border-border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-foreground font-semibold border-b">Cookie Name</th>
                      <th className="px-4 py-3 text-left text-foreground font-semibold border-b">Purpose</th>
                      <th className="px-4 py-3 text-left text-foreground font-semibold border-b">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-3">cartcuterie_builder</td>
                      <td className="px-4 py-3">Stores cart builder selections</td>
                      <td className="px-4 py-3">Persistent</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3">cartcuterie_bali_builder</td>
                      <td className="px-4 py-3">Stores Bali cart builder selections</td>
                      <td className="px-4 py-3">Persistent</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3">cookie_consent</td>
                      <td className="px-4 py-3">Remembers cookie preferences</td>
                      <td className="px-4 py-3">1 year</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3">_ga, _gid</td>
                      <td className="px-4 py-3">Google Analytics tracking</td>
                      <td className="px-4 py-3">2 years / 24 hours</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Third-Party Cookies</h2>
              <p>We may use third-party services that set their own cookies, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Google Analytics:</strong> For website analytics</li>
                <li><strong>Social Media Platforms:</strong> For sharing and integration</li>
                <li><strong>Payment Processors:</strong> For secure transactions</li>
              </ul>
              <p>
                These third parties have their own privacy policies and cookie practices, which we encourage you to review.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">5. Managing Your Cookie Preferences</h2>
              
              <h3 className="text-xl font-semibold text-foreground">Browser Settings</h3>
              <p>You can control cookies through your browser settings:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mt-4">Cookie Consent Banner</h3>
              <p>
                When you first visit our website, you can choose to accept or decline non-essential cookies through our cookie consent banner.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">6. Impact of Disabling Cookies</h2>
              <p>If you disable cookies, some features of our website may not function properly:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cart builder selections may not be saved</li>
                <li>Website preferences may not be remembered</li>
                <li>Some interactive features may be limited</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">7. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. Please check this page regularly for updates.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">8. Contact Us</h2>
              <p>If you have questions about our use of cookies, please contact us:</p>
              <ul className="list-none space-y-2">
                <li><strong>Email:</strong> <a href="mailto:cartcuteriela@gmail.com" className="text-accent hover:underline">cartcuteriela@gmail.com</a></li>
              </ul>
            </section>

            <section className="space-y-4 mt-8 p-6 bg-muted/30 rounded-lg">
              <p className="text-sm">
                For more information about how we handle your personal data, please see our <a href="/privacy-policy" className="text-accent hover:underline">Privacy Policy</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
