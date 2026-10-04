import Link from "next/link"
import { MapPin } from "lucide-react"
import { MemojiCircle } from "@/components/conversation-meta"
import { EventCover } from "@/components/event-cover"
import { initials } from "@/lib/conversations"

export type MyEvent = {
  id: string
  href: string
  title: string
  // The day and start time on the venue's clock: "2026-12-06", "09:30".
  date: string
  time: string
  // The organizer first, then the organization hosting the event.
  hosts: string[]
  place: string
  faces: { emoji: string; tint: string }[]
  more: number
  // In full, for the details that open on hover in the calendar.
  when: string
  hours: string
  venue: string
  address: string
  booking: string
  about: string
}

// A booked event as a card. The whole card opens the organizer thread, and
// the poster runs the full height of the card beside the details.
export function EventCard({ event }: { event: MyEvent }) {
  return (
    <Link
      href={event.href}
      transitionTypes={["nav-forward"]}
      className="group flex gap-4 rounded-2xl border border-border bg-card/85 p-3 pl-4 shadow-[0_8px_30px_rgba(16,19,20,0.06)] outline-none backdrop-blur-xl transition-colors hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50 sm:gap-6 sm:p-4 sm:pl-5"
    >
      <div className="min-w-0 flex-1 py-1">
        <p className="text-muted-foreground tabular-nums">{event.time}</p>
        <h3 className="mt-1 text-h2 text-pretty">{event.title}</h3>

        <p className="mt-2 flex items-center gap-2 text-muted-foreground">
          {/* The organizer sits in front, so their initials stay whole. */}
          <span aria-hidden="true" className="flex shrink-0 -space-x-1">
            {event.hosts.map((host, index) => (
              <span
                key={host}
                style={{ zIndex: event.hosts.length - index }}
                className="relative flex size-[22px] items-center justify-center rounded-full bg-primary text-[9px] leading-none font-semibold text-primary-foreground ring-2 ring-card"
              >
                {initials(host)}
              </span>
            ))}
          </span>
          <span className="min-w-0 truncate">By {event.hosts.join(" & ")}</span>
        </p>

        <p className="mt-1.5 flex items-center gap-2 text-muted-foreground">
          <MapPin aria-hidden="true" strokeWidth={1.75} className="size-5 shrink-0" />
          <span className="min-w-0 truncate">{event.place}</span>
        </p>

        <div className="mt-4 flex items-center">
          <span aria-hidden="true" className="flex -space-x-1.5">
            {event.faces.map((face, index) => (
              <MemojiCircle
                key={index}
                emoji={face.emoji}
                tint={face.tint}
                className="relative size-6 text-[15px] ring-2 ring-card"
              />
            ))}
          </span>
          <span
            aria-hidden="true"
            className="relative -ml-1.5 rounded-full bg-hover px-2 py-1 text-badge font-semibold tabular-nums ring-2 ring-card"
          >
            +{event.more}
          </span>
          <span className="sr-only">
            {event.faces.length + event.more} going
          </span>
        </div>
      </div>

      <div className="relative w-28 shrink-0 self-stretch overflow-hidden rounded-xl ring-1 ring-neutral-12/[0.06] sm:w-48 dark:ring-white/[0.08]">
        <EventCover
          title={event.title}
          className="absolute inset-0 aspect-auto size-full transition-transform duration-500 ease-fluid group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
    </Link>
  )
}
