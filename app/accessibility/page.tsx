import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Accessibility Statement | Cartcuterie",
  description: "Cartcuterie's commitment to digital accessibility for all users.",
}

export default function AccessibilityPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8">
            Accessibility Statement
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm text-muted-foreground">
              <strong>Last Updated:</strong> January 13, 2026
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Our Commitment</h2>
              <p>
                Cartcuterie is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Conformance Status</h2>
              <p>
                We aim to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>. These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Accessibility Features</h2>
              <p>Our website includes the following accessibility features:</p>
              
              <h3 className="text-xl font-semibold text-foreground">Navigation & Structure</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Logical heading hierarchy (H1-H6)</li>
                <li>Keyboard navigation support</li>
                <li>Skip to main content links</li>
                <li>Consistent navigation across pages</li>
                <li>Clear focus indicators</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mt-4">Visual Design</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sufficient color contrast ratios (WCAG AA compliant)</li>
                <li>Resizable text up to 200% without loss of functionality</li>
                <li>Responsive design for various screen sizes</li>
                <li>Clear visual indicators for interactive elements</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mt-4">Content</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Descriptive alt text for all images</li>
                <li>ARIA labels for interactive components</li>
                <li>Semantic HTML markup</li>
                <li>Clear and simple language</li>
                <li>Properly labeled form fields</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mt-4">Interactive Elements</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>All functionality available via keyboard</li>
                <li>Visible focus states</li>
                <li>Error messages clearly identified</li>
                <li>Form validation with descriptive messages</li>
                <li>Accessible dropdown menus and modals</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Assistive Technologies</h2>
              <p>Our website is designed to be compatible with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Screen readers (JAWS, NVDA, VoiceOver)</li>
                <li>Screen magnification software</li>
                <li>Speech recognition software</li>
                <li>Keyboard-only navigation</li>
                <li>Alternative input devices</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Browser Compatibility</h2>
              <p>Our website works best with modern browsers:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Google Chrome (latest version)</li>
                <li>Mozilla Firefox (latest version)</li>
                <li>Apple Safari (latest version)</li>
                <li>Microsoft Edge (latest version)</li>
              </ul>
              <p className="text-sm italic">
                Note: Older browser versions may not support all accessibility features.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Known Limitations</h2>
              <p>
                Despite our best efforts to ensure accessibility, there may be some limitations. Known issues include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Third-party embedded content (Instagram feed) may have limited accessibility</li>
                <li>Some images are decorative and may not provide value to screen reader users</li>
                <li>PDF documents may not be fully accessible (we're working on this)</li>
              </ul>
              <p>
                We are actively working to address these limitations and improve accessibility across all content.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Continuous Improvement</h2>
              <p>
                We are committed to continuous improvement and regularly:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Audit our website for accessibility compliance</li>
                <li>Test with assistive technologies</li>
                <li>Gather feedback from users with disabilities</li>
                <li>Update our practices based on latest WCAG guidelines</li>
                <li>Train our team on accessibility best practices</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Accessibility Assistance</h2>
              <p>
                If you need assistance accessing any content or have difficulty using any features on our website, we're here to help:
              </p>
              
              <div className="bg-accent/10 p-6 rounded-lg space-y-3">
                <h3 className="text-xl font-semibold text-foreground">Alternative Formats</h3>
                <p>
                  We can provide information in alternative formats upon request, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Large print documents</li>
                  <li>Plain text format</li>
                  <li>Audio descriptions</li>
                  <li>Simplified language versions</li>
                </ul>
              </div>

              <div className="bg-accent/10 p-6 rounded-lg space-y-3 mt-4">
                <h3 className="text-xl font-semibold text-foreground">Personal Assistance</h3>
                <p>
                  Our team is available to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Answer questions about our services via phone or email</li>
                  <li>Help you complete booking forms</li>
                  <li>Provide detailed descriptions of our cart options</li>
                  <li>Accommodate special requirements for your event</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Third-Party Content</h2>
              <p>
                Some content on our website is provided by third parties (e.g., social media feeds, payment processors). While we strive to ensure these services are accessible, we cannot always guarantee the accessibility of third-party content.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Feedback & Contact</h2>
              <p>
                We welcome your feedback on the accessibility of our website. If you encounter accessibility barriers, please let us know:
              </p>
              
              <div className="bg-muted/30 p-6 rounded-lg space-y-3">
                <ul className="list-none space-y-3">
                  <li>
                    <strong>Email:</strong>{" "}
                    <a href="mailto:cartcuteriela@gmail.com?subject=Accessibility Feedback" className="text-accent hover:underline">
                      cartcuteriela@gmail.com
                    </a>
                  </li>
                  <li>
                    <strong>Subject Line:</strong> "Accessibility Feedback"
                  </li>
                  <li>
                    <strong>Response Time:</strong> We will respond within 2 business days
                  </li>
                </ul>
              </div>

              <p className="mt-4">
                Please include the following in your message:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The page URL where you experienced the issue</li>
                <li>A description of the accessibility barrier</li>
                <li>Your preferred contact method</li>
                <li>Any assistive technology you were using</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Formal Complaints</h2>
              <p>
                If you are not satisfied with our response to your accessibility concern, you may:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request escalation to our management team</li>
                <li>File a complaint with relevant disability rights organizations</li>
                <li>Contact accessibility advocacy groups in your region</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Technical Specifications</h2>
              <p>
                Our website relies on the following technologies for accessibility:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>HTML5</li>
                <li>WAI-ARIA (Accessible Rich Internet Applications)</li>
                <li>CSS3</li>
                <li>JavaScript (with graceful degradation)</li>
                <li>Next.js framework with accessibility optimizations</li>
              </ul>
            </section>

            <section className="space-y-4 mt-8 p-6 bg-muted/30 rounded-lg">
              <h3 className="text-xl font-semibold text-foreground">Our Promise</h3>
              <p>
                Accessibility is an ongoing commitment. We strive to make Cartcuterie's website and services accessible to all users, regardless of ability. Your feedback helps us improve, and we are dedicated to making necessary adjustments to ensure everyone can enjoy our luxury cart experiences.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
