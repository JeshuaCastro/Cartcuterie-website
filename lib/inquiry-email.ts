export function escapeEmailHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!)
}

export function formatInquiryTime(value: unknown): string {
  const time = String(value ?? "")
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time)
  if (!match) return time
  const hour = Number(match[1])
  return `${hour % 12 || 12}:${match[2]} ${hour < 12 ? "AM" : "PM"}`
}

export function renderInquiryDetails(input: Record<string, unknown>): string {
  const row = (label: string, value: unknown) =>
    `<p style="margin: 8px 0; overflow-wrap: anywhere;"><strong>${label}:</strong> ${escapeEmailHtml(value || "Not provided")}</p>`
  const section = (title: string, content: string) =>
    `<div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;"><h3 style="margin: 0 0 12px;">${title}</h3>${content}</div>`
  const eventTypes: Record<string, string> = { wedding: "Wedding", party: "Party", corporate: "Corporate", other: "Other" }
  const hasSeparateTimes = input.siteLocation !== "bali" || input.eventStartTime || input.eventEndTime
  const timeRows = hasSeparateTimes
    ? row("Event Start Time", formatInquiryTime(input.eventStartTime || input.eventTime)) +
      row("Event End Time", formatInquiryTime(input.eventEndTime))
    : row("Event Time", formatInquiryTime(input.eventTime))
  // HTML emails collapse whitespace; explicit breaks preserve the form's
  // sections, heart bullets, and indented add-on/catering lists in mail clients.
  const message = escapeEmailHtml(input.message || "No message provided")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/^ +/, (spaces) => "&nbsp;".repeat(spaces.length)))
    .join("<br />")
  return section("Contact Details",
    row("Name", input.name) + row("Email", input.email) + row("Phone", input.phone)) +
    section("Event Details",
      row("Event Type", eventTypes[String(input.eventType)] || input.eventType) +
      row("Event Date", input.eventDate) +
      row("Location", input.location) + timeRows +
      (input.siteLocation === "bali" && !input.guestCount ? "" : row("Guest Count", input.guestCount))) +
    section("Message & Cart Configuration",
      `<p style="margin: 0; line-height: 1.7; overflow-wrap: anywhere;">${message}</p>`)
}