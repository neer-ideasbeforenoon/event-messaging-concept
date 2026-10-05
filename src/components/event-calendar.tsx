"use client"

import type { ComponentProps } from "react"
import Link from "next/link"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  MapPin,
  MessageSquare,
} from "lucide-react"
import { MemojiCircle } from "@/components/conversation-meta"
import { EventCard, type MyEvent } from "@/components/event-card"
import { EventCover } from "@/components/event-cover"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

// A month planner, the full-size version of the "My booked event"
// illustration on the inbox. Each booked event is pinned to its day as an
// instant photo of its poster, tilted a little until hovered. The whole photo
// opens the organizer thread. On a phone the days are too narrow for a photo,
// so a day carries a poster thumbnail and the month's cards follow the sheet.
export function EventCalendar({
  events,
  month,
  today,
  onMonthChange,
}: {
  events: MyEvent[]
  // "2026-11"
  month: string
  // "2026-10-04"
  today: string
  onMonthChange: (month: string) => void
}) {
  const inMonth = events.filter((event) => event.date.startsWith(month))
  const year = month.slice(0, 4)
  const monthName = format(`${month}-01`, { month: "long" })
  const days = daysOf(month)

  return (
    <div className="flex flex-col gap-4">
      <section
        aria-label={`${monthName} ${year}`}
        className="rounded-2xl border border-border bg-card/85 p-3 shadow-[0_8px_30px_rgba(16,19,20,0.06)] backdrop-blur-xl sm:p-5"
      >
        <div className="flex items-center justify-between gap-4 px-1 sm:px-0">
          <h2 className="flex items-baseline gap-2 text-[clamp(1.5rem,1.1rem+1.6vw,2.25rem)] leading-none font-bold tracking-[-0.05em] uppercase">
            {monthName}
            <span className="text-muted-foreground">{year}</span>
          </h2>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              aria-label="Previous month"
              onClick={() => onMonthChange(shiftMonth(month, -1))}
              className="rounded-full"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              aria-label="Next month"
              onClick={() => onMonthChange(shiftMonth(month, 1))}
              className="rounded-full"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </Button>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="mt-4 grid grid-cols-7 text-center text-caption font-semibold tracking-[0.08em] text-muted-foreground uppercase sm:mt-5"
        >
          {WEEKDAYS.map((day) => (
            <span key={day}>
              <span className="sm:hidden">{day[0]}</span>
              <span className="hidden sm:inline">{day}</span>
            </span>
          ))}
        </div>

        {/* Not clipped, so a photo can reach past its day. The corner days
            round themselves instead. */}
        <ol className="mt-2 grid grid-cols-7 rounded-xl border-t border-l border-border">
          {days.map((cell, index) => {
            const booked = cell.outside
              ? []
              : inMonth.filter((event) => event.date === cell.date)
            return (
              <li
                key={cell.date}
                className={cn(
                  "relative flex min-h-14 flex-col gap-1 border-r border-b border-border p-1 sm:min-h-28 sm:gap-2 sm:p-2",
                  cell.outside && "bg-well/40",
                  index === 0 && "rounded-tl-xl",
                  index === 6 && "rounded-tr-xl",
                  index === days.length - 7 && "rounded-bl-xl",
                  index === days.length - 1 && "rounded-br-xl"
                )}
              >
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-body-sm font-semibold tabular-nums",
                    cell.outside && "text-muted-foreground/50",
                    cell.date === today && "bg-primary text-primary-foreground"
                  )}
                >
                  <span className="sr-only">
                    {format(cell.date, { weekday: "long", day: "numeric", month: "long" })}
                    {cell.date === today && ", today"}
                  </span>
                  <span aria-hidden="true">{cell.day}</span>
                </span>
                {booked.map((event) => (
                  <PinnedEvent key={event.id} event={event} tilt={index % 2 ? 2 : -2} />
                ))}
              </li>
            )
          })}
        </ol>
      </section>

      {/* The month's events in full, where the days are too narrow. */}
      {inMonth.length > 0 && (
        <ul className="flex flex-col gap-4 sm:hidden">
          {inMonth.map((event) => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
      {inMonth.length === 0 && (
        <p className="px-1 text-muted-foreground">
          Nothing booked in {monthName}.
        </p>
      )}
    </div>
  )
}

// A square instant photo pinned to the day: a white frame, the poster, which
// carries the name, and the time on the strip below. On a phone it is just
// the poster. On wider screens it is a little wider than its day, so it
// overhangs the lines either side the way a photo pinned to a planner would.
// Resting on it, or tabbing to it, opens the event's details beside it. Touch
// has no hover, so a tap goes straight to the thread.
function PinnedEvent({ event, tilt }: { event: MyEvent; tilt: number }) {
  return (
    <HoverCard openDelay={200} closeDelay={120}>
      <HoverCardTrigger asChild>
        <PinnedPhoto event={event} tilt={tilt} />
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="start"
        sideOffset={12}
        collisionPadding={16}
        className="w-[340px] overflow-hidden rounded-2xl border border-border p-0 shadow-[0_24px_60px_-12px_rgba(16,19,20,0.3)] ring-0 dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)]"
      >
        <EventDetails event={event} />
      </HoverCardContent>
    </HoverCard>
  )
}

function PinnedPhoto({
  event,
  tilt,
  ...props
}: { event: MyEvent; tilt: number } & Omit<
  ComponentProps<typeof Link>,
  "href"
>) {
  return (
    <Link
      {...props}
      href={event.href}
      transitionTypes={["nav-forward"]}
      style={{ rotate: `${tilt}deg` }}
      className="group relative z-10 flex aspect-square flex-col sm:-mx-3.5 rounded-[3px] bg-white p-0.5 text-neutral-12 shadow-[0_8px_18px_rgba(16,19,20,0.22),0_1px_2px_rgba(16,19,20,0.16)] outline-none transition-[translate,rotate,box-shadow] duration-300 ease-fluid hover:-translate-y-1 hover:rotate-0! focus-visible:rotate-0! focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none sm:p-1 dark:bg-neutral-12 dark:text-neutral-1"
    >
      <EventCover
        title={event.title}
        className="aspect-auto min-h-0 flex-1 rounded-[2px]"
      />
      <span
        aria-hidden="true"
        className="mt-1 hidden px-0.5 text-[11px] leading-tight font-semibold tabular-nums opacity-70 sm:block"
      >
        {event.time}
      </span>
      <span className="sr-only">
        {event.title}, {event.time}
      </span>
    </Link>
  )
}

// Everything about the booking at a glance: the cover, when and where, who
// hosts it, what was booked, and a way into the organizer thread.
function EventDetails({ event }: { event: MyEvent }) {
  const [organizer, host] = event.hosts
  return (
    <>
      <EventCover title={event.title} className="aspect-[3/2] w-full" />
      <div className="p-4">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-success-surface px-2 py-1 text-badge text-success-foreground">
          <CircleCheck aria-hidden="true" className="size-3.5" />
          {event.booking}
        </p>
        <h3 className="mt-2.5 text-h3">{event.title}</h3>
        <p className="mt-0.5 text-body-sm text-muted-foreground">
          Hosted by {host}
        </p>

        <dl className="mt-4 flex flex-col gap-3 text-body-sm">
          <div className="flex gap-3">
            <dt className="sr-only">When</dt>
            <CalendarDays aria-hidden="true" strokeWidth={1.75} className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <dd>
              <span className="block font-medium">{event.when}</span>
              <span className="block text-muted-foreground">{event.hours}</span>
            </dd>
          </div>
          <div className="flex gap-3">
            <dt className="sr-only">Where</dt>
            <MapPin aria-hidden="true" strokeWidth={1.75} className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <dd>
              <span className="block font-medium">{event.venue}</span>
              <span className="block text-muted-foreground">{event.address}</span>
            </dd>
          </div>
        </dl>

        <p className="mt-4 line-clamp-3 text-body-sm text-foreground/85">
          {event.about}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <span aria-hidden="true" className="flex -space-x-1.5">
            {event.faces.map((face, index) => (
              <MemojiCircle
                key={index}
                emoji={face.emoji}
                tint={face.tint}
                className="relative size-6 text-[15px] ring-2 ring-popover"
              />
            ))}
          </span>
          <span className="text-body-sm text-muted-foreground tabular-nums">
            {(event.faces.length + event.more).toLocaleString("en-GB")} going
          </span>
        </div>

        <Button asChild className="mt-4 h-9 w-full rounded-xl">
          <Link href={event.href} transitionTypes={["nav-forward"]}>
            <MessageSquare aria-hidden="true" />
            Message {organizer.split(" ")[0]}, the organizer
          </Link>
        </Button>
      </div>
    </>
  )
}

// Every day on the sheet, Monday to Sunday, with the ends of the months
// either side filling the first and last weeks.
function daysOf(month: string) {
  const [year, index] = month.split("-").map(Number)
  const lead = (new Date(Date.UTC(year, index - 1, 1)).getUTCDay() + 6) % 7
  const length = new Date(Date.UTC(year, index, 0)).getUTCDate()
  const total = Math.ceil((lead + length) / 7) * 7
  return Array.from({ length: total }, (_, i) => {
    const date = new Date(Date.UTC(year, index - 1, 1 + i - lead))
    return {
      date: date.toISOString().slice(0, 10),
      day: date.getUTCDate(),
      outside: date.getUTCMonth() !== index - 1,
    }
  })
}

export function shiftMonth(month: string, by: number) {
  const [year, index] = month.split("-").map(Number)
  return new Date(Date.UTC(year, index - 1 + by, 1)).toISOString().slice(0, 7)
}

// Dates are days on the venue's calendar, so they format in UTC to stay the
// same day wherever this runs.
function format(date: string, options: Intl.DateTimeFormatOptions) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    ...options,
  })
}
