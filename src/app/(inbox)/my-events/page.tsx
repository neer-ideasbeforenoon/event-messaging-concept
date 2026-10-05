import type { Metadata } from "next"
import { connection } from "next/server"
import { MyEvents, type EventDay } from "@/components/my-events"
import { PageTransition } from "@/components/page-transition"
import { attendeesAt } from "@/lib/attendees"
import { bookedEvents, peopleAt } from "@/lib/conversations"

export const metadata: Metadata = { title: "My events" }

// Faces shown on a card before the rest collapse into a count.
const FACES = 5

// The customer's booked events, soonest first, on a month calendar or grouped
// by day in a list. Each event opens its details page, and the organizer
// thread from there. This is where the "My booked event" entry on the inbox
// leads.
export default async function MyEventsPage(props: PageProps<"/my-events">) {
  const view = (await props.searchParams).view === "list" ? "list" : "calendar"

  // "Today" and "Tomorrow" depend on the day the page is viewed.
  await connection()
  const now = new Date()
  const today = localDate(now)
  const tomorrow = localDate(new Date(now.getTime() + 86_400_000))

  const days: EventDay[] = []
  for (const { thread, event } of bookedEvents()) {
    const [date, time] = event.starts.split("T")

    // People the customer already talks to lead the row of faces.
    const faces = [...peopleAt(thread.title), ...attendeesAt(thread.title)]
      .slice(0, FACES)
      .map(({ emoji, tint }) => ({ emoji, tint }))

    const card = {
      id: thread.id,
      href: `/messages/${thread.id}?from=my-events`,
      detailsHref: `/my-events/${thread.id}`,
      title: thread.title,
      date,
      time,
      hosts: [thread.with, event.host],
      place: `${event.venue}, ${event.address.split(", ").at(-1)}`,
      faces,
      more: event.going - faces.length,
      when: event.when,
      hours: event.time,
      venue: event.venue,
      address: event.address,
      booking: thread.booking ?? "",
      about: event.about,
    }

    const day = days.at(-1)
    if (day?.date === date) {
      day.events.push(card)
      continue
    }
    days.push({
      date,
      label:
        date === today
          ? "Today"
          : date === tomorrow
          ? "Tomorrow"
          : formatDay(date, today.slice(0, 4)),
      weekday: format(date, { weekday: "long" }),
      events: [card],
    })
  }

  return (
    <PageTransition>
      <main className="mx-auto max-w-4xl px-4 pt-6 pb-12 sm:px-8 sm:pt-10">
        <MyEvents days={days} today={today} initialView={view} />
      </main>
    </PageTransition>
  )
}

// YYYY-MM-DD on the server's calendar.
function localDate(date: Date) {
  return date.toLocaleDateString("en-CA")
}

// Event dates are wall-clock dates at the venue, so they format in UTC to
// stay the same day wherever the server runs.
function format(date: string, options: Intl.DateTimeFormatOptions) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    ...options,
  })
}

// "6 Dec", with the year only once it is not this year: "22 Jan 2027".
function formatDay(date: string, thisYear: string) {
  return format(date, {
    day: "numeric",
    month: "short",
    year: date.startsWith(thisYear) ? undefined : "numeric",
  })
}
