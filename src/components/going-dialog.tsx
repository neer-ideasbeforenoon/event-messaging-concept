"use client"

import { useMemo, useRef, useState, type ReactNode } from "react"
import { Search, X } from "lucide-react"
import { AttendeeList } from "@/components/event-panel-tabs"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { attendeesAt } from "@/lib/attendees"
import type { PersonConversation } from "@/lib/conversations"

const PAGE = 40

// Everyone going to an event, from its page: the same list as the Attendees
// tab of the organizer thread, with search pinned above it. Each person opens
// a thread with them, and Back from there returns to the event's page.
export function GoingDialog({
  eventId,
  event,
  going,
  host,
  organizer,
  booked,
  known,
  children,
}: {
  eventId: string
  event: string
  going: number
  host: string
  organizer: string
  booked: boolean
  known: PersonConversation[]
  children: ReactNode
}) {
  const [query, setQuery] = useState("")
  const [shown, setShown] = useState(PAGE)
  const listRef = useRef<HTMLDivElement>(null)
  const others = useMemo(() => attendeesAt(event), [event])

  function search(value: string) {
    setQuery(value)
    setShown(PAGE)
    listRef.current?.scrollTo({ top: 0 })
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) search("")
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-[min(720px,calc(100dvh-2rem))] flex-col gap-0 overflow-hidden rounded-3xl p-0 sm:max-w-lg">
        <div className="flex flex-col gap-4 border-b border-border p-5 pb-4">
          <div className="pr-8">
            <DialogTitle className="text-h2">People going</DialogTitle>
            <DialogDescription className="mt-0.5 text-body-sm text-muted-foreground">
              {going.toLocaleString("en-GB")} going to {event}
            </DialogDescription>
          </div>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => search(e.target.value)}
              placeholder="Search by name, role or company"
              aria-label="Search people going"
              className="h-10 rounded-xl bg-card pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Clear search"
                onClick={() => search("")}
                className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full"
              >
                <X aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>

        <div
          ref={listRef}
          className="min-h-0 flex-1 scrollbar-none overflow-y-auto overscroll-contain"
        >
          <AttendeeList
            query={query}
            event={event}
            going={going}
            host={host}
            organizer={organizer}
            booked={booked}
            known={known}
            others={others}
            trail={[`event:${eventId}`]}
            shown={shown}
            onShowMore={() => setShown((n) => n + PAGE)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
