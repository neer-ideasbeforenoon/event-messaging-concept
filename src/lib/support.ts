import {
  bookedEvents,
  customerName,
  type SupportTicket,
} from "@/lib/conversations"

// What the customer can ask platform support about, most asked first: the
// things a ticketing platform owns, from delivering tickets to taking the
// money. Each topic names the ticket it opens, so the customer never has to
// write a subject line. Account questions are never about one booking, so
// they skip that question. Event questions (venue, schedule, access, the
// name on a ticket) belong to the organizer; "Something else" says so.
export const supportTopics = [
  {
    id: "tickets",
    label: "I can’t find my tickets",
    hint: "Not in your email or under My events",
    ticket: "Tickets for",
    placeholder:
      "For example: I booked two passes on Monday but the tickets never arrived.",
    asksBooking: true,
  },
  {
    id: "refund",
    label: "Cancel or get a refund",
    hint: "Cancel a booking, or check on a refund",
    ticket: "Refund for",
    placeholder:
      "For example: I can no longer attend. Can I cancel and get my money back?",
    asksBooking: true,
  },
  {
    id: "payment",
    label: "Payment problem",
    hint: "Declined card or a double charge",
    ticket: "Payment for",
    placeholder: "For example: I was charged twice for one order.",
    asksBooking: true,
  },
  {
    id: "invoice",
    label: "Invoice or receipt",
    hint: "Company details, VAT, missing invoice",
    ticket: "Invoice for",
    placeholder:
      "For example: please add Northwind Studio and our VAT number to the invoice.",
    asksBooking: true,
  },
  {
    id: "account",
    label: "Account and sign-in",
    hint: "Sign-in codes, your email, notifications",
    ticket: "",
    placeholder: "For example: the sign-in code never reaches my inbox.",
    asksBooking: false,
  },
  {
    id: "other",
    label: "Something else",
    hint: "Anything else about using the platform",
    ticket: "Question about",
    placeholder: "Tell us what’s going on.",
    asksBooking: true,
  },
] as const

export type SupportTopic = (typeof supportTopics)[number]

export const NEW_TICKET = "new-ticket"
export const MAX_MESSAGE = 2000

// ponytail: there is no backend, so a new ticket rides to its thread in the
// URL and is rebuilt on the server. It does not join the inbox list, and the
// message sits in browser history. Swap for a server action that stores the
// ticket and redirects to its id.
export function newTicketHref(ticket: {
  topic: string
  event?: string
  message: string
  at: string
}) {
  const query = new URLSearchParams({ topic: ticket.topic, at: ticket.at })
  if (ticket.event) query.set("event", ticket.event)
  query.set("message", ticket.message)
  return `/messages/${NEW_TICKET}?${query}`
}

type Query = Record<string, string | string[] | undefined>

// The query is whatever is in the address bar, so every part is checked: the
// topic and event must be ones the customer could pick, and the message is
// trimmed and capped.
export function newTicket(id: string, query: Query): SupportTicket | undefined {
  if (id !== NEW_TICKET) return undefined
  const read = (key: string) => [query[key]].flat()[0]?.trim() ?? ""
  const topic = supportTopics.find((t) => t.id === read("topic"))
  const message = read("message").slice(0, MAX_MESSAGE)
  if (!topic || !message) return undefined
  const event = topic.asksBooking
    ? bookedEvents().find((b) => b.thread.title === read("event"))?.thread
        .title
    : undefined
  // The customer's own clock, sent with the ticket. Today, so no day.
  const at = /^\d{2}:\d{2}$/.test(read("at")) ? read("at") : ""
  const firstLine = message.split("\n")[0]

  return {
    id,
    group: "support",
    title: event ? `${topic.ticket} ${event}` : topic.label,
    event,
    with: "Platform support",
    subject: firstLine.length > 60 ? `${firstLine.slice(0, 59)}…` : firstLine,
    updated: at,
    messages: [
      { from: "me", body: message, time: at },
      {
        from: "them",
        body: `Thanks, ${customerName}. We’ve got your message and someone from the platform team will reply here, usually within a few hours. There’s nothing else you need to send.`,
        time: at,
      },
    ],
  }
}
