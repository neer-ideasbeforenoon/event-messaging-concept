import type { PosterName } from "@/components/event-posters"
import type { EventConversation, EventInfo } from "@/lib/conversations"

// ponytail: stand-in bookings, so My events reads as a real calendar with a
// handful of events each month. None has an organizer thread yet: opening one
// starts it with the booking attached. December matches the planner in the
// "My booked event" illustration on the inbox: the forum, a supper, a lights
// trail, carols, a run and the ballet.

type Booking = {
  title: string
  // The name as set on the cover, one entry per line.
  lines: string[]
  poster: PosterName
  starts: string
  ends: string
  venue: string
  address: string
  host: string
  organizer: string
  going: number
  booking: string
  about: string
}

const bookings: Booking[] = [
  {
    title: "Lettering Night",
    lines: ["Lettering", "Night"],
    poster: "tiles",
    starts: "2026-10-08T19:00",
    ends: "2026-10-08T21:30",
    venue: "The Print Room",
    address: "Shoreditch, London",
    host: "Type & Tonic",
    organizer: "Nadia Rahman",
    going: 64,
    booking: "1 Workshop seat",
    about:
      "An evening of brush lettering for beginners. Pens, paper and a drink are on the table when you arrive, and you leave with a finished piece.",
  },
  {
    title: "AI in Product: A Fireside Chat",
    lines: ["AI in", "Product"],
    poster: "blocks",
    starts: "2026-10-14T18:30",
    ends: "2026-10-14T20:30",
    venue: "Second Floor Studios",
    address: "Spitalfields, London",
    host: "Product Circle London",
    organizer: "Tom Hale",
    going: 180,
    booking: "1 General ticket",
    about:
      "Two product leads on shipping AI features people trust, followed by open questions from the floor and drinks.",
  },
  {
    title: "Sunday Sketch Walk",
    lines: ["Sunday", "Sketch", "Walk"],
    poster: "sunrise",
    starts: "2026-10-18T10:00",
    ends: "2026-10-18T13:00",
    venue: "Southbank Centre",
    address: "Waterloo, London",
    host: "Urban Sketchers London",
    organizer: "Marta Silva",
    going: 35,
    booking: "1 Walk place",
    about:
      "A slow walk along the river with three stops to draw. Bring a sketchbook; stools are provided at each stop.",
  },
  {
    title: "Jazz in the Crypt",
    lines: ["Jazz in", "the Crypt"],
    poster: "moon",
    starts: "2026-10-24T20:00",
    ends: "2026-10-24T23:00",
    venue: "St Giles Crypt",
    address: "Camberwell, London",
    host: "Crypt Jazz",
    organizer: "Leon Barker",
    going: 120,
    booking: "2 Standing tickets",
    about:
      "A quartet in the vaulted crypt, two sets with a break. The bar is open throughout and doors open half an hour early.",
  },
  {
    title: "Design Systems London #42",
    lines: ["Design", "Systems", "London"],
    poster: "shapes",
    starts: "2026-10-29T18:00",
    ends: "2026-10-29T21:00",
    venue: "The Trampery",
    address: "Old Street, London",
    host: "Design Systems London",
    organizer: "Ola Nowak",
    going: 150,
    booking: "1 Meetup ticket",
    about:
      "Three short talks on tokens, documentation and adoption, then pizza and conversation.",
  },
  {
    title: "Bonfire Night Social",
    lines: ["Bonfire", "Night"],
    poster: "candles",
    starts: "2026-11-05T18:30",
    ends: "2026-11-05T21:30",
    venue: "Victoria Park",
    address: "Hackney, London",
    host: "Hackney Socials",
    organizer: "Ruth Adler",
    going: 300,
    booking: "2 Entry wristbands",
    about:
      "Fireworks over the lake, street food stalls and a bonfire. Wristbands are scanned at the Crown Gate.",
  },
  {
    title: "Research Ops Breakfast",
    lines: ["Research", "Ops", "Breakfast"],
    poster: "blocks",
    starts: "2026-11-19T08:00",
    ends: "2026-11-19T09:30",
    venue: "Barbican Centre",
    address: "Silk Street, London",
    host: "ResearchOps London",
    organizer: "Imran Qureshi",
    going: 70,
    booking: "1 Breakfast ticket",
    about:
      "A breakfast roundtable for people who run research programmes. Coffee and pastries from 07:45.",
  },
  {
    title: "Late Film Club: Slow Cinema",
    lines: ["Late", "Film", "Club"],
    poster: "moon",
    starts: "2026-11-25T19:00",
    ends: "2026-11-25T22:00",
    venue: "The Lumen Screen",
    address: "Dalston, London",
    host: "Lumen Screen",
    organizer: "Clara Benson",
    going: 90,
    booking: "1 Screening seat",
    about:
      "A double bill of slow cinema with a short introduction and a discussion in the bar afterwards.",
  },
  {
    title: "Ceramics Taster Workshop",
    lines: ["Ceramics", "Taster"],
    poster: "tiles",
    starts: "2026-11-28T10:00",
    ends: "2026-11-28T13:00",
    venue: "Clayworks Studio",
    address: "Peckham, London",
    host: "Clayworks Studio",
    organizer: "Hugo Laine",
    going: 12,
    booking: "1 Workshop place",
    about:
      "Three hours on the wheel with a potter. Your pieces are fired and ready to collect two weeks later.",
  },
  {
    title: "Winter Supper Club",
    lines: ["Winter", "Supper", "Club"],
    poster: "sunrise",
    starts: "2026-12-10T19:30",
    ends: "2026-12-10T23:00",
    venue: "The Allotment Kitchen",
    address: "Hackney, London",
    host: "Supper Society",
    organizer: "Bea Morgan",
    going: 40,
    booking: "2 Supper seats",
    about:
      "Five courses from the allotment at one long table. Tell the organizer about any dietary needs ahead of the night.",
  },
  {
    title: "Winter Lights Trail",
    lines: ["Winter", "Lights"],
    poster: "moon",
    starts: "2026-12-12T18:00",
    ends: "2026-12-12T21:00",
    venue: "Riverside Gardens",
    address: "Richmond, London",
    host: "Riverside Gardens",
    organizer: "Owen Price",
    going: 900,
    booking: "2 Timed entry tickets",
    about:
      "A mile-long trail of light installations through the gardens. Entry is timed, so arrive within your half-hour slot.",
  },
  {
    title: "Candlelight Carols",
    lines: ["Candle", "light", "Carols"],
    poster: "candles",
    starts: "2026-12-17T20:00",
    ends: "2026-12-17T21:30",
    venue: "St Martin's Hall",
    address: "Covent Garden, London",
    host: "St Martin's Choir",
    organizer: "Eleanor Hart",
    going: 260,
    booking: "2 Nave seats",
    about:
      "Carols by candlelight with the choir and a brass quartet. Mulled wine is served afterwards.",
  },
  {
    title: "Festive 10K",
    lines: ["Festive", "10K"],
    poster: "run",
    starts: "2026-12-19T08:00",
    ends: "2026-12-19T10:00",
    venue: "Battersea Park",
    address: "Battersea, London",
    host: "Run Club South",
    organizer: "Gemma Clarke",
    going: 1200,
    booking: "1 Runner entry",
    about:
      "Two laps of the park in fancy dress if you like. Bib collection opens at 07:00 by the bandstand.",
  },
  {
    title: "The Nutcracker",
    lines: ["The", "Nut", "cracker"],
    poster: "tiles",
    starts: "2026-12-23T19:00",
    ends: "2026-12-23T21:30",
    venue: "Coliseum Stage",
    address: "West End, London",
    host: "City Ballet Company",
    organizer: "Sofia Lund",
    going: 1100,
    booking: "2 Dress circle seats",
    about:
      "The winter ballet with a live orchestra. Latecomers wait for a suitable break, so plan to arrive early.",
  },
  {
    title: "New Year Sketch Walk",
    lines: ["New Year", "Sketch", "Walk"],
    poster: "sunrise",
    starts: "2027-01-09T10:00",
    ends: "2027-01-09T13:00",
    venue: "Hampstead Heath",
    address: "Hampstead, London",
    host: "Urban Sketchers London",
    organizer: "Marta Silva",
    going: 40,
    booking: "1 Walk place",
    about:
      "The first walk of the year, up to Parliament Hill for the view. Wrap up warm; the route ends at a café.",
  },
  {
    title: "Planning 2027: Product Roundtable",
    lines: ["Planning", "2027"],
    poster: "globe",
    starts: "2027-01-14T18:30",
    ends: "2027-01-14T20:30",
    venue: "Second Floor Studios",
    address: "Spitalfields, London",
    host: "Product Circle London",
    organizer: "Tom Hale",
    going: 60,
    booking: "1 Roundtable seat",
    about:
      "Small tables of eight on setting a year's product bets, each led by a head of product.",
  },
  {
    title: "Type Talks Vol. 12",
    lines: ["Type", "Talks", "Vol. 12"],
    poster: "shapes",
    starts: "2027-01-28T19:00",
    ends: "2027-01-28T21:00",
    venue: "The Type Archive",
    address: "Clerkenwell, London",
    host: "Type & Tonic",
    organizer: "Nadia Rahman",
    going: 110,
    booking: "1 Talk ticket",
    about:
      "Two type designers on revivals and the archive behind them, among the presses and drawers of metal type.",
  },
  {
    title: "Lido Winter Swim",
    lines: ["Lido", "Winter", "Swim"],
    poster: "moon",
    starts: "2027-01-31T08:30",
    ends: "2027-01-31T10:00",
    venue: "Tooting Lido",
    address: "Tooting, London",
    host: "Cold Water Club",
    organizer: "Kit Ramsay",
    going: 80,
    booking: "1 Swim slot",
    about:
      "A guided cold-water dip with a coach, then hot drinks in the sauna. Swimmers must be over 18.",
  },
]

export const bookedEventInfo: Record<string, EventInfo> = Object.fromEntries(
  bookings.map((b) => [
    b.title,
    {
      date: {
        month: format(b.starts, { month: "short" }),
        day: b.starts.slice(8, 10),
      },
      when: `${format(b.starts, { weekday: "long" })}, ${format(b.starts, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`,
      time: `${b.starts.slice(11)} – ${b.ends.slice(11)}`,
      starts: b.starts,
      ends: b.ends,
      venue: b.venue,
      address: b.address,
      host: b.host,
      going: b.going,
      about: b.about,
    },
  ])
)

export const bookedThreads: EventConversation[] = bookings.map((b) => ({
  id: b.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, ""),
  group: "event",
  title: b.title,
  date: bookedEventInfo[b.title].date,
  with: b.organizer,
  subject: "New conversation",
  updated: "",
  booking: b.booking,
  messages: [],
}))

export function coverArtFor(title: string) {
  return bookings.find((b) => b.title === title)
}

// Dates here are wall-clock times at the venue, so they format in UTC.
function format(time: string, options: Intl.DateTimeFormatOptions) {
  return new Date(`${time.slice(0, 10)}T00:00:00Z`).toLocaleDateString(
    "en-GB",
    { timeZone: "UTC", ...options }
  )
}
