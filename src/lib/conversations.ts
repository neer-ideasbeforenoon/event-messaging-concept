// A photo or file shared in a thread. The url points at the file itself.
export type Attachment = {
  name: string
  size: number
  kind: "image" | "file"
  url: string
}

export type Message = {
  from: "me" | "them"
  body: string
  time: string
  attachments?: Attachment[]
}

type Base = {
  id: string
  title: string
  // The person or team who replies.
  with: string
  subject: string
  updated: string
  unread?: boolean
  messages: Message[]
}

// One thread per event, with the organizer. A booking attaches once it
// exists, so an enquiry becomes Booked without starting a new thread.
export type EventConversation = Base & {
  group: "event"
  date: { month: string; day: string }
  booking?: string
}

// A ticket with the platform. It can mention an event and still stays here.
export type SupportTicket = Base & {
  group: "support"
  event?: string
}

// A direct thread with another person, such as a speaker or a fellow
// attendee. The person replies for themselves, so the title is their name.
// The event says where the customer knows them from. The emoji and tint make
// their avatar: a face on a colour ground, as Memoji sit in Messages.
export type PersonConversation = Base & {
  group: "person"
  role: "Speaker" | "Attendee"
  event: string
  emoji: string
  tint: string
}

export type Conversation =
  | PersonConversation
  | EventConversation
  | SupportTicket

// "You and Maya": the thread is between the customer and this one person.
export function withYou(conversation: PersonConversation) {
  return `You and ${conversation.with.split(" ")[0]}`
}

export function personContext(conversation: PersonConversation) {
  return conversation.role === "Speaker"
    ? `Speaker at ${conversation.event}`
    : `Also going to ${conversation.event}`
}

// The inbox tabs, in order, as they appear in ?tab=. Shared by the page,
// which reads the tab on the server, and the client tabs, which write it.
export const TABS = ["people", "events", "support"] as const
export type Tab = (typeof TABS)[number]
export const DEFAULT_TAB: Tab = "events"

export function toTab(value: unknown): Tab {
  return TABS.find((tab) => tab === value) ?? DEFAULT_TAB
}

export const customerName = "Neer"
export const customerEmoji = "🧑"
export const customerTint = "#9FB8D6"

export const conversations: Conversation[] = [
  {
    id: "maya-okafor",
    group: "person",
    title: "Maya Okafor",
    role: "Speaker",
    event: "Design Futures Forum",
    emoji: "👩🏾‍🦱",
    tint: "#C3A6F0",
    with: "Maya Okafor",
    subject: "Slides from the panel",
    updated: "09:58",
    unread: true,
    messages: [
      {
        from: "me",
        body: "Hi Maya, I'm looking forward to your panel on design systems. Will the slides be shared afterwards?",
        time: "08:31",
      },
      {
        from: "them",
        body: "Thanks Neer! They'll go up on the event page the day after. Happy to send you the case study PDF directly too.",
        time: "09:58",
      },
    ],
  },
  {
    id: "priya-raman",
    group: "person",
    title: "Priya Raman",
    role: "Speaker",
    event: "Product Leaders Summit 2026",
    emoji: "👩🏽",
    tint: "#F3A6C0",
    with: "Priya Raman",
    subject: "Seats in the roadmapping workshop",
    updated: "08:14",
    unread: true,
    messages: [
      {
        from: "me",
        body: "Hi Priya, is there still room in your roadmapping workshop? I'd love to bring a real roadmap to work on.",
        time: "07:52",
      },
      {
        from: "them",
        body: "There are a few seats left. Sign up from the session page, and yes, bring your roadmap. We'll pull it apart together.",
        time: "08:14",
      },
    ],
  },
  {
    id: "daniel-kim",
    group: "person",
    title: "Daniel Kim",
    role: "Attendee",
    event: "Global Reach Summit",
    emoji: "👨🏻",
    tint: "#8EC5F2",
    with: "Daniel Kim",
    subject: "Sharing a cab from the airport",
    updated: "Yesterday",
    unread: true,
    messages: [
      {
        from: "them",
        body: "Hi Neer, my flight lands at 08:40 on the 18th too. Want to split a cab to the venue?",
        time: "Yesterday, 21:06",
      },
    ],
  },
  {
    id: "sofia-martinez",
    group: "person",
    title: "Sofía Martínez",
    role: "Speaker",
    event: "Global Reach Summit",
    emoji: "👩🏻‍🦰",
    tint: "#F7B98A",
    with: "Sofía Martínez",
    subject: "Pricing in your talk",
    updated: "Oct 2",
    messages: [
      {
        from: "me",
        body: "I'm coming to your talk on launching in new markets. Will you cover pricing in local currencies?",
        time: "Oct 2, 10:20",
      },
      {
        from: "them",
        body: "Yes, about ten minutes on it, with two case studies. Bring your questions for the Q&A.",
        time: "Oct 2, 13:45",
      },
    ],
  },
  {
    id: "kwame-mensah",
    group: "person",
    title: "Kwame Mensah",
    role: "Attendee",
    event: "Design Futures Forum",
    emoji: "🧑🏿",
    tint: "#7FD3C9",
    with: "Kwame Mensah",
    subject: "Portfolio swap over lunch",
    updated: "Oct 1",
    messages: [
      {
        from: "them",
        body: "Hi Neer, saw you're at Design Futures. Up for swapping portfolio feedback over lunch?",
        time: "Oct 1, 09:02",
      },
      {
        from: "me",
        body: "I'd like that. Lunch on day one?",
        time: "Oct 1, 09:30",
      },
      {
        from: "them",
        body: "Day one works. I'll find you at the registration desk.",
        time: "Oct 1, 09:41",
      },
    ],
  },
  {
    id: "hannah-schulz",
    group: "person",
    title: "Hannah Schulz",
    role: "Attendee",
    event: "DesignOps Meetup Berlin",
    emoji: "👱🏼‍♀️",
    tint: "#F5D36E",
    with: "Hannah Schulz",
    subject: "A ticket I can't use",
    updated: "Sep 30",
    messages: [
      {
        from: "them",
        body: "Hi Neer, I can't make the Berlin meetup any more. Do you know anyone who'd like my ticket?",
        time: "Sep 30, 17:15",
      },
      {
        from: "me",
        body: "A colleague might. Can the ticket go to someone else?",
        time: "Sep 30, 17:40",
      },
      {
        from: "them",
        body: "Yes, the organizer can change the name on it. Send me their email whenever.",
        time: "Sep 30, 18:02",
      },
    ],
  },
  {
    id: "jonas-weber",
    group: "person",
    title: "Jonas Weber",
    role: "Attendee",
    event: "DesignOps Meetup Berlin",
    emoji: "🧔🏼",
    tint: "#8FCFA0",
    with: "Jonas Weber",
    subject: "Coffee before doors",
    updated: "Sep 29",
    messages: [
      {
        from: "them",
        body: "Hey Neer, saw you're going to the Berlin meetup too. Fancy a coffee near the tram stop before doors?",
        time: "Sep 29, 18:12",
      },
      {
        from: "me",
        body: "Sounds good. There's a café by the side entrance. Shall we say 17:00?",
        time: "Sep 29, 18:40",
      },
      { from: "them", body: "17:00 it is. See you there.", time: "Sep 29, 18:44" },
    ],
  },
  {
    id: "arjun-mehta",
    group: "person",
    title: "Arjun Mehta",
    role: "Speaker",
    event: "Product Leaders Summit 2026",
    emoji: "👨🏽‍🦱",
    tint: "#F29B8F",
    with: "Arjun Mehta",
    subject: "Reading before the session",
    updated: "Sep 26",
    messages: [
      {
        from: "me",
        body: "Looking forward to your session on product metrics. Is there anything I should read beforehand?",
        time: "Sep 26, 11:10",
      },
      {
        from: "them",
        body: "Thanks Neer! Skim the North Star issue of my newsletter. The session builds on it, and I'll link it here the week before.",
        time: "Sep 26, 15:32",
      },
    ],
  },
  {
    id: "global-reach-summit",
    group: "event",
    title: "Global Reach Summit",
    date: { month: "Nov", day: "18" },
    with: "Lisa Wang",
    subject: "Group booking for 8",
    updated: "10:42",
    unread: true,
    messages: [
      {
        from: "me",
        body: "Hi Lisa, there are eight of us hoping to come to Global Reach Summit. Could we get eight Conference Passes on one invoice?",
        time: "09:15",
      },
      {
        from: "them",
        body: "Hi Neer, happy to help. Groups of six or more get 15% off Conference Passes, and I can put all eight on a single invoice. I've held eight seats for you for seven days while you check with your team.",
        time: "10:42",
      },
    ],
  },
  {
    id: "design-futures-forum",
    group: "event",
    title: "Design Futures Forum",
    date: { month: "Dec", day: "06" },
    with: "Emily Rodriguez",
    subject: "Accessibility at the venue",
    updated: "Yesterday",
    booking: "2 General Admission passes",
    messages: [
      {
        from: "me",
        body: "We've booked two passes. One of us uses a wheelchair. Is there step-free access to the main hall, and is there accessible seating?",
        time: "Yesterday, 14:02",
      },
      {
        from: "them",
        body: "Yes. The main hall is step-free from the Halle Street entrance, and there's a lift to the mezzanine. I've reserved two aisle seats in row C under your booking.",
        time: "Yesterday, 16:20",
      },
    ],
  },
  {
    id: "designops-meetup-berlin",
    group: "event",
    title: "DesignOps Meetup Berlin",
    date: { month: "Jan", day: "22" },
    with: "Alex Thompson",
    subject: "Using the side entrance",
    updated: "Sep 28",
    booking: "1 Meetup ticket",
    messages: [
      {
        from: "me",
        body: "Is the side entrance open for attendees? It's closer to the tram stop.",
        time: "Sep 28, 11:30",
      },
      {
        from: "them",
        body: "It is. The side entrance opens at 17:30, half an hour before doors. Show your ticket there and you'll go straight in.",
        time: "Sep 28, 12:05",
      },
      { from: "me", body: "Perfect, thank you!", time: "Sep 28, 12:09" },
    ],
  },
  {
    id: "invoice-design-futures",
    group: "support",
    title: "Invoice for Design Futures",
    event: "Design Futures Forum",
    with: "Platform support",
    subject: "Company details on my invoice",
    updated: "Yesterday",
    messages: [
      {
        from: "me",
        body: "Could you add my company name and VAT number to the invoice for Design Futures Forum? It's Northwind Studio, VAT DE 294 117 380.",
        time: "Yesterday, 09:48",
      },
      {
        from: "them",
        body: "Done. The invoice now shows Northwind Studio and your VAT number. You'll find the new PDF under Profile, and the old one has been voided.",
        time: "Yesterday, 11:15",
      },
    ],
  },
  {
    id: "invoice-product-leaders",
    group: "support",
    title: "Invoice for Product Leaders Summit",
    event: "Product Leaders Summit 2026",
    with: "Platform support",
    subject: "Invoice not received",
    updated: "Sep 30",
    messages: [
      {
        from: "me",
        body: "I paid for Product Leaders Summit 2026 last week but haven't received an invoice yet.",
        time: "Sep 30, 15:40",
      },
      {
        from: "them",
        body: "Your payment went through on 24 September. The invoice is queued and will reach your inbox within two working days. There's nothing else you need to do.",
        time: "Sep 30, 16:02",
      },
    ],
  },
]

// What the details panel shows about an event, keyed by its title. A thread
// names its event by title, so people, organizer, and support threads that
// mention the same event all find the same details.
export type EventInfo = {
  date: { month: string; day: string }
  when: string
  time: string
  venue: string
  address: string
  host: string
  going: number
  about: string
}

export const events: Record<string, EventInfo> = {
  "Global Reach Summit": {
    date: { month: "Nov", day: "18" },
    when: "Wednesday, 18 November 2026",
    time: "09:00 – Fri 20 Nov, 17:30",
    venue: "Riverside Exhibition Centre",
    address: "Royal Victoria Dock, London",
    host: "Global Reach Events",
    going: 640,
    about:
      "Three days on taking products and teams into new markets. Talks and workshops cover localization, international pricing, and hiring across time zones, with an expo floor of 60 exhibitors. A Conference Pass includes every session, lunch on all three days, and the opening-night reception.",
  },
  "Design Futures Forum": {
    date: { month: "Dec", day: "06" },
    when: "Sunday, 6 December 2026",
    time: "09:30 – 17:00",
    venue: "Clyde Hall",
    address: "Halle Street, Glasgow",
    host: "Design Futures",
    going: 280,
    about:
      "A one-day forum on where design practice is heading, now in its seventh edition. The programme mixes short talks with small-group critiques, and closes with a panel on design leadership. General Admission includes all sessions, lunch, and the evening drinks.",
  },
  "DesignOps Meetup Berlin": {
    date: { month: "Jan", day: "22" },
    when: "Friday, 22 January 2027",
    time: "18:00 – 21:00",
    venue: "Werkhalle",
    address: "Kreuzberg, Berlin",
    host: "DesignOps Berlin",
    going: 96,
    about:
      "An evening meetup for people who run design teams and the systems behind them. Two lightning talks on tooling and team rituals, then open discussion over food and drinks. Talks are in English.",
  },
  "Product Leaders Summit 2026": {
    date: { month: "Nov", day: "12" },
    when: "Thursday, 12 November 2026",
    time: "09:00 – 18:00",
    venue: "Pier 7 Conference Centre",
    address: "Amsterdam",
    host: "Product Leaders Collective",
    going: 520,
    about:
      "A day for heads of product and the people working towards it. Sessions cover strategy, roadmapping under pressure, and building product culture, with roundtables in the afternoon. Breakfast, lunch, and the closing reception are included.",
  },
}

// People the customer already has a thread with who are going to this event.
export function peopleAt(event: string) {
  return conversations.filter(
    (c): c is PersonConversation => c.group === "person" && c.event === event
  )
}

// The organizer thread for an event, when the customer has one.
export function eventThread(event: string) {
  return conversations.find((c) => c.group === "event" && c.title === event)
}

// The threads opened on the way to this one, oldest first. It rides along in
// ?from= so Back retraces the customer's path, even after a reload.
export function readTrail(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  return value ? value.split(",").filter(Boolean) : []
}

// A link from one thread to another carries the path so far. Going to a
// thread already on the path cuts it back to that point, so it never loops.
export function threadHref(id: string, trail: string[]) {
  const at = trail.indexOf(id)
  const path = at === -1 ? trail : trail.slice(0, at)
  return path.length
    ? `/messages/${id}?from=${path.join(",")}`
    : `/messages/${id}`
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
}
