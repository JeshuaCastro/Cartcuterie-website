import assert from "node:assert/strict"
import test from "node:test"
import { formatInquiryTime, renderInquiryDetails } from "./inquiry-email"

test("email contains all event details and preserves message sections", () => {
  const html = renderInquiryDetails({
    name: "Test Customer", email: "test@example.com", phone: "8185550100",
    eventType: "party", eventDate: "2026-10-01", location: "Test Venue",
    eventStartTime: "13:30", eventEndTime: "18:00", guestCount: "75", siteLocation: "la",
    message: "Cart configuration:\n\n♥ Cart Type: Classic Cart\n♥ Add Ons:\n   - Stripe Vinyl Roof - Purple\n♥ Catering:\n   - Candy Cart\n\nPlease provide details.",
  })
  for (const detail of ["Test Customer", "test@example.com", "8185550100", "Party", "2026-10-01", "Test Venue",
    "Event Start Time:</strong> 1:30 PM", "Event End Time:</strong> 6:00 PM", "Guest Count:</strong> 75"]) {
    assert.ok(html.includes(detail), detail)
  }
  assert.ok(html.includes("Cart configuration:<br /><br />♥ Cart Type"))
  assert.ok(html.includes("♥ Add Ons:<br />&nbsp;&nbsp;&nbsp;- Stripe Vinyl Roof - Purple"))
  assert.ok(html.includes("♥ Catering:<br />&nbsp;&nbsp;&nbsp;- Candy Cart"))
})

test("email safely renders customer text without interpreting HTML", () => {
  const html = renderInquiryDetails({ name: "<img>", message: "Flowers & <script>alert(1)</script>\r\nSecond line" })
  assert.ok(html.includes("&lt;img&gt;"))
  assert.ok(html.includes("Flowers &amp; &lt;script&gt;alert(1)&lt;/script&gt;<br />Second line"))
  assert.ok(!html.includes("<script>"))
})

test("times handle midnight, noon, and the legacy Bali field", () => {
  assert.equal(formatInquiryTime("00:00"), "12:00 AM")
  assert.equal(formatInquiryTime("12:00"), "12:00 PM")
  const html = renderInquiryDetails({ siteLocation: "bali", eventTime: "16:30" })
  assert.ok(html.includes("Event Time:</strong> 4:30 PM"))
  assert.ok(!html.includes("Event End Time"))
})