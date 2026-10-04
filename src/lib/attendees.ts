// ponytail: a stand-in guest list. Each event draws its attendees from a
// seeded generator, so the same event always lists the same people on the
// server and in the browser. Swap for the event's real guest list once there
// is a backend.

import {
  customerName,
  eventThread,
  events,
  peopleAt,
  type PersonConversation,
} from "@/lib/conversations"

export type Attendee = {
  id: string
  name: string
  headline: string
  emoji: string
  tint: string
}

const FIRST = [
  "Amara", "Ben", "Chloé", "Dev", "Elif", "Felix", "Grace", "Hiro", "Ines",
  "Jamal", "Kira", "Leo", "Mei", "Nikhil", "Olivia", "Pablo", "Quinn", "Rosa",
  "Samir", "Tara", "Umar", "Vera", "Wei", "Ximena", "Yusuf", "Zoe", "Aisha",
  "Bruno", "Camille", "Diego", "Esther", "Farah", "Gabriel", "Hana", "Isaac",
  "Julia", "Kofi", "Lena", "Mateo", "Noor", "Oscar", "Priyanka", "Rafael",
  "Sana", "Tomás", "Uma", "Viktor", "Yara",
]

const LAST = [
  "Adeyemi", "Bauer", "Castillo", "Dubois", "Eriksen", "Fernandes", "Gupta",
  "Hughes", "Ibrahim", "Jensen", "Kowalski", "Lindqvist", "Moreau", "Nakamura",
  "Okonkwo", "Park", "Quintero", "Rossi", "Silva", "Tanaka", "Ueda", "Varga",
  "Walsh", "Xu", "Yilmaz", "Zhang", "Andersson", "Bianchi", "Chen", "Duarte",
  "Evans", "Fischer", "García", "Haddad", "Iyer", "Kaur", "Larsen", "Mensah",
  "Novak", "O’Brien", "Patel", "Reyes", "Sato", "Thompson", "Vogel", "Wright",
]

const ROLES = [
  "Product Designer", "Head of Growth", "Engineering Manager", "Founder",
  "Product Manager", "Marketing Lead", "UX Researcher", "Data Scientist",
  "Brand Designer", "Partnerships Lead", "CTO", "Content Strategist",
  "Localization Lead", "Sales Director", "Design Ops Lead", "Developer Advocate",
]

const COMPANIES = [
  "Northwind", "Lumen Labs", "Fieldnote", "Harbor & Co", "Brightline",
  "Kettle", "Atlas Freight", "Orbitly", "Paperplane", "Cobalt Bank",
  "Tandem Health", "Verdant", "Mosaic Studio", "Quill", "Parallel", "Hearth",
]

const FACES = [
  "👩🏻", "👨🏽", "🧑🏾", "👩🏼‍🦰", "👨🏿", "🧔🏻", "👩🏾‍🦱", "👱🏽‍♂️", "🧑🏻‍🦱",
  "👩🏽‍🦳", "👨🏼‍🦲", "🧕🏽", "👳🏾‍♂️", "👩🏿", "🧑🏼", "👨🏻‍🦰",
]

const TINTS = [
  "#C3A6F0", "#F3A6C0", "#8EC5F2", "#F7B98A", "#7FD3C9", "#F5D36E",
  "#8FCFA0", "#F29B8F", "#9FB8D6", "#B9C9F5",
]

// mulberry32: small, fast, and the same sequence for the same seed.
function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seedFrom(text: string) {
  let hash = 2166136261
  for (const char of text) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  return hash
}

export function attendeesFor(
  event: string,
  count: number,
  exclude: string[] = []
): Attendee[] {
  const next = random(seedFrom(event))
  const pick = <T>(list: T[]) => list[Math.floor(next() * list.length)]
  const taken = new Set(exclude)
  const people: Attendee[] = []

  // Capped below the number of name pairs, so the loop always ends.
  const total = Math.min(count, FIRST.length * LAST.length - taken.size)
  while (people.length < total) {
    const name = `${pick(FIRST)} ${pick(LAST)}`
    if (taken.has(name)) continue
    taken.add(name)
    people.push({
      id: `${slug(event)}-${people.length}`,
      name,
      headline: `${pick(ROLES)} · ${pick(COMPANIES)}`,
      emoji: pick(FACES),
      tint: pick(TINTS),
    })
  }
  return people.sort((a, b) => a.name.localeCompare(b.name, "en"))
}

// Everyone going to an event besides the people the customer already talks
// to, the organizer, and the customer. The customer counts toward the total
// once booked.
export function attendeesAt(event: string) {
  const known = peopleAt(event)
  const thread = eventThread(event)
  const booked = thread?.group === "event" && Boolean(thread.booking)
  return attendeesFor(
    event,
    events[event].going - known.length - (booked ? 1 : 0),
    [...known.map((person) => person.with), customerName, thread?.with ?? ""]
  )
}

// A thread the customer has not started yet, with someone going to an event.
// It has no messages until the customer sends the first one.
export function newThreadWith(id: string): PersonConversation | undefined {
  const event = Object.keys(events).find((title) =>
    id.startsWith(`${slug(title)}-`)
  )
  const attendee = event && attendeesAt(event).find((a) => a.id === id)
  if (!event || !attendee) return undefined
  return {
    id,
    group: "person",
    role: "Attendee",
    event,
    emoji: attendee.emoji,
    tint: attendee.tint,
    title: attendee.name,
    with: attendee.name,
    subject: attendee.headline,
    updated: "",
    messages: [],
  }
}

function slug(text: string) {
  return fold(text).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

// Case and accent blind, so "sofia" finds Sofía.
export function fold(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
}
