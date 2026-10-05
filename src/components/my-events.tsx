"use client"

import { useState } from "react"
import { CalendarDays, List, Search } from "lucide-react"
import { EventCalendar } from "@/components/event-calendar"
import { EventCard, type MyEvent } from "@/components/event-card"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { fold } from "@/lib/attendees"

export type EventDay = {
  date: string
  label: string
  weekday: string
  events: MyEvent[]
}

export type EventsView = "calendar" | "list"

const views = [
  { value: "calendar", label: "Calendar", icon: CalendarDays },
  { value: "list", label: "List", icon: List },
] as const

// Case and accent blind, across the name, the hosts and the place.
function matches(event: MyEvent, needle: string) {
  return fold([event.title, event.place, ...event.hosts].join(" ")).includes(
    needle
  )
}

// The customer's booked events, as a month calendar or as a list of days.
// Search narrows both. The view lives in ?view= so Back from a thread returns
// to it; the calendar is the default and keeps a bare URL.
export function MyEvents({
  days,
  today,
  initialView,
}: {
  days: EventDay[]
  today: string
  initialView: EventsView
}) {
  const [view, setView] = useState(initialView)
  const [query, setQuery] = useState("")
  const all = days.flatMap((day) => day.events)
  // The calendar opens on the month of the next event.
  const [month, setMonth] = useState((all[0]?.date ?? today).slice(0, 7))

  const needle = fold(query.trim())
  const shownDays = needle
    ? days
        .map((day) => ({
          ...day,
          events: day.events.filter((event) => matches(event, needle)),
        }))
        .filter((day) => day.events.length > 0)
    : days
  const shown = shownDays.flatMap((day) => day.events)

  function search(text: string) {
    setQuery(text)
    // Bring the calendar to the first match when this month has none.
    const next = fold(text.trim())
    const found = all.filter((event) => matches(event, next))
    if (found.length && !found.some((event) => event.date.startsWith(month))) {
      setMonth(found[0].date.slice(0, 7))
    }
  }

  function select(value: string) {
    const next: EventsView = value === "list" ? "list" : "calendar"
    setView(next)
    const url = new URL(window.location.href)
    if (next === "calendar") url.searchParams.delete("view")
    else url.searchParams.set("view", next)
    window.history.replaceState(null, "", url)
  }

  return (
    <Tabs value={view} onValueChange={select} className="gap-0">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-h1">Events</h1>
        <TabsList
          aria-label="View"
          className="h-auto gap-1 rounded-full border border-border bg-card/85 p-1 backdrop-blur-xl group-data-[orientation=horizontal]/tabs:h-auto"
        >
          <TabsIndicator className="rounded-full bg-primary" />
          {views.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="h-8 flex-none rounded-full px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground"
            >
              <Icon aria-hidden="true" strokeWidth={1.75} />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div className="relative mt-5">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => search(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") search("")
          }}
          placeholder="Search by event, host or place"
          aria-label="Search your events"
          className="h-11 rounded-xl border-border bg-card/85 pl-11 shadow-[0_8px_30px_rgba(16,19,20,0.06)] backdrop-blur-xl dark:bg-card/85"
        />
      </div>

      {needle && shown.length === 0 && (
        <p className="mt-6 text-muted-foreground">
          None of your events match “{query.trim()}”.
        </p>
      )}

      <TabsContent value="calendar" className="mt-6">
        <EventCalendar
          events={shown}
          month={month}
          today={today}
          onMonthChange={setMonth}
        />
      </TabsContent>

      <TabsContent value="list" className="mt-8">
        {!needle && shownDays.length === 0 && (
          <p className="text-muted-foreground">
            You haven’t booked any events yet.
          </p>
        )}
        {shownDays.length > 0 && (
          // A dashed rail runs down the left, with a dot at each day.
          <ol className="relative">
            <span
              aria-hidden="true"
              className="absolute top-3 bottom-0 left-[3px] border-l-2 border-dashed border-muted-foreground/25"
            />
            {shownDays.map((day) => (
              <li key={day.date} className="relative pb-8 pl-6 last:pb-0 sm:pl-8">
                <span
                  aria-hidden="true"
                  className="absolute top-2 left-0 size-2 rounded-full bg-muted-foreground/60"
                />
                <h2 className="text-h3">
                  {day.label}{" "}
                  <span className="font-normal text-muted-foreground">
                    {day.weekday}
                  </span>
                </h2>
                <ul className="mt-3.5 flex flex-col gap-4">
                  {day.events.map((event) => (
                    <li key={event.id}>
                      <EventCard event={event} fromList />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        )}
      </TabsContent>
    </Tabs>
  )
}
