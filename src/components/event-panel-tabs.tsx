"use client"

import { useMemo, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { ChevronRight, Search, X } from "lucide-react"
import {
  InitialsAvatar,
  MemojiCircle,
  StatusBadge,
  UnreadDot,
} from "@/components/conversation-meta"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { attendeesAt, fold, type Attendee } from "@/lib/attendees"
import {
  customerEmoji,
  customerName,
  customerTint,
  eventThread,
  threadHref,
  type PersonConversation,
} from "@/lib/conversations"
import { cn } from "@/lib/utils"

const PAGE = 40

// The open tab is a brand pill, like the conversation tabs in the inbox. The
// pill slides between triggers (TabsIndicator); the open trigger only paints
// it itself until the pill is measured.
const pill =
  "h-full rounded-full hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_1px_2px_rgb(16_19_20/0.2)] data-[state=active]:hover:text-primary-foreground dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground dark:data-[state=active]:ring-1 dark:data-[state=active]:ring-brand-10"

// The event panel of an organizer thread, in three tabs: the event itself,
// everyone going, and the people going whom the customer already talks to.
// Every attendee is a link: to the thread the customer already has with them,
// or to a new one.
export function EventPanelTabs({
  overview,
  event,
  going,
  host,
  organizer,
  booked,
  known,
  trail,
}: {
  overview: ReactNode
  event: string
  going: number
  host: string
  organizer: string
  booked: boolean
  known: PersonConversation[]
  trail: string[]
}) {
  const [tab, setTab] = useState("overview")
  const [query, setQuery] = useState("")
  const [shown, setShown] = useState(PAGE)
  const rootRef = useRef<HTMLDivElement>(null)

  const others = useMemo(() => attendeesAt(event), [event])

  function select(value: string) {
    setTab(value)
    // The panel scrolls as a whole. A new tab starts at its top.
    rootRef.current?.closest("aside")?.scrollTo({ top: 0 })
  }

  return (
    <div ref={rootRef}>
      <Tabs value={tab} onValueChange={select} className="gap-0">
        <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-xl">
          <TabsList className="w-full rounded-full bg-well p-1 group-data-[orientation=horizontal]/tabs:h-10">
            <TabsIndicator className="rounded-full bg-primary shadow-[0_1px_2px_rgb(16_19_20/0.2)] dark:ring-1 dark:ring-brand-10" />
            <TabsTrigger value="overview" className={pill}>
              Overview
            </TabsTrigger>
            <TabsTrigger value="attendees" className={pill}>
              Attendees
            </TabsTrigger>
            <TabsTrigger value="messages" className={pill}>
              Messages
              {/* The brand dot would vanish on the brand pill, and the open
                  tab already shows what is new. */}
              {known.some((person) => person.unread) && (
                <UnreadDot className="in-data-[state=active]:hidden" />
              )}
            </TabsTrigger>
          </TabsList>

          {tab === "attendees" && (
            <div className="relative animate-in duration-300 ease-fluid fade-in slide-in-from-top-1 motion-reduce:animate-none">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setShown(PAGE)
                }}
                placeholder="Search by name, role or company"
                aria-label="Search attendees"
                className="h-9 rounded-xl bg-card pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery("")
                    setShown(PAGE)
                  }}
                  className="absolute top-1/2 right-1 -translate-y-1/2 rounded-full"
                >
                  <X aria-hidden="true" />
                </Button>
              )}
            </div>
          )}
        </div>

        <TabsContent value="overview">
          {overview}
          <Section title="Going" aside={`${going}`}>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {known.map((person) => (
                  <MemojiCircle
                    key={person.id}
                    emoji={person.emoji}
                    tint={person.tint}
                    className="relative size-8 text-[20px] ring-2 ring-card"
                  />
                ))}
                {others.slice(0, 4 - Math.min(known.length, 3)).map((person) => (
                  <MemojiCircle
                    key={person.id}
                    emoji={person.emoji}
                    tint={person.tint}
                    className="relative size-8 text-[20px] ring-2 ring-card"
                  />
                ))}
              </div>
              <p className="min-w-0 text-body-sm text-muted-foreground">
                {known.length > 0
                  ? `${known.map((p) => p.with.split(" ")[0]).join(", ")} and ${going - known.length} others`
                  : `${going} people`}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => select("attendees")}
              className="mt-4 w-full rounded-xl bg-card"
            >
              See all attendees
            </Button>
          </Section>
        </TabsContent>

        <TabsContent value="attendees">
          <AttendeeList
            query={query}
            event={event}
            going={going}
            host={host}
            organizer={organizer}
            booked={booked}
            known={known}
            others={others}
            trail={trail}
            shown={shown}
            onShowMore={() => setShown((n) => n + PAGE)}
          />
        </TabsContent>

        <TabsContent value="messages">
          <MessageList event={event} known={known} trail={trail} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AttendeeList({
  query,
  event,
  going,
  host,
  organizer,
  booked,
  known,
  others,
  trail,
  shown,
  onShowMore,
}: {
  query: string
  event: string
  going: number
  host: string
  organizer: string
  booked: boolean
  known: PersonConversation[]
  others: Attendee[]
  trail: string[]
  shown: number
  onShowMore: () => void
}) {
  const q = fold(query.trim())
  const matches = (...fields: string[]) =>
    !q || fields.some((field) => fold(field).includes(q))

  const hostThread = eventThread(event)
  const showHost = matches(organizer, host, "host organizer")
  const people = known.filter((p) => matches(p.with, p.role, p.subject))
  const showYou = booked && matches(customerName, "you")
  const rest = others.filter((a) => matches(a.name, a.headline))
  const results =
    people.length + rest.length + (showYou ? 1 : 0) + (showHost ? 1 : 0)

  if (q && results === 0) {
    return (
      <div className="px-5 py-12 text-center">
        <p className="font-medium">No one matches “{query.trim()}”</p>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Try a first name, a role or a company.
        </p>
      </div>
    )
  }

  return (
    <div className="pb-4">
      <p
        aria-live="polite"
        className="px-5 pt-4 text-caption text-muted-foreground"
      >
        {q
          ? `${results} ${results === 1 ? "result" : "results"}`
          : `${going} going`}
      </p>

      {showHost && hostThread && (
        <Group title="Host">
          <PersonRow
            href={threadHref(hostThread.id, trail)}
            avatar={<InitialsAvatar name={organizer} />}
            name={organizer}
            detail={`Organizer · ${host}`}
            badge={<Badge className="bg-primary text-primary-foreground dark:ring-1 dark:ring-brand-10">Host</Badge>}
          />
        </Group>
      )}

      {people.length > 0 && (
        <Group title="People you’ve messaged">
          {people.map((person) => (
            <PersonRow
              key={person.id}
              href={threadHref(person.id, trail)}
              avatar={
                <MemojiCircle
                  emoji={person.emoji}
                  tint={person.tint}
                  className="relative size-9 text-[22px]"
                />
              }
              name={person.with}
              detail={person.subject}
              badge={<StatusBadge conversation={person} />}
            />
          ))}
        </Group>
      )}

      {(showYou || rest.length > 0) && (
        <Group title={q ? "Going" : "Everyone going"}>
          {showYou && (
            <PersonRow
              avatar={
                <MemojiCircle
                  emoji={customerEmoji}
                  tint={customerTint}
                  className="relative size-9 text-[22px]"
                />
              }
              name={customerName}
              detail="You"
            />
          )}
          {rest.slice(0, shown).map((person, index) => (
            <PersonRow
              key={person.id}
              revealed={index >= PAGE}
              href={threadHref(person.id, trail)}
              avatar={
                <MemojiCircle
                  emoji={person.emoji}
                  tint={person.tint}
                  className="relative size-9 text-[22px]"
                />
              }
              name={person.name}
              detail={person.headline}
            />
          ))}
          {rest.length > shown && (
            <li className="px-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onShowMore}
                className="w-full rounded-xl text-mark"
              >
                Show {Math.min(PAGE, rest.length - shown)} more
              </Button>
            </li>
          )}
        </Group>
      )}
    </div>
  )
}

function MessageList({
  event,
  known,
  trail,
}: {
  event: string
  known: PersonConversation[]
  trail: string[]
}) {
  if (known.length === 0) {
    return (
      <div className="px-5 py-12 text-center">
        <p className="font-medium">No conversations yet</p>
        <p className="mt-1 text-body-sm text-muted-foreground">
          When you message someone going to {event}, they show up here.
        </p>
      </div>
    )
  }

  return (
    <div className="pb-4">
      <p className="px-5 pt-4 text-caption text-muted-foreground">
        People going to {event} you’ve talked to
      </p>
      <ul className="mt-2 flex flex-col px-3">
        {known.map((person) => {
          const last = person.messages.at(-1)
          return (
            <li key={person.id}>
              <Link
                href={threadHref(person.id, trail)}
                transitionTypes={["nav-forward"]}
                className="group flex items-start gap-3 rounded-xl px-2 py-3 outline-none transition-colors hover:bg-hover/60 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <MemojiCircle
                  emoji={person.emoji}
                  tint={person.tint}
                  className="relative size-10 text-[24px]"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={cn("truncate", person.unread ? "font-semibold" : "font-medium")}>
                      {person.with}
                    </p>
                    <span
                      className={cn(
                        "ml-auto shrink-0 text-caption",
                        person.unread ? "font-semibold" : "text-muted-foreground"
                      )}
                    >
                      {person.updated}
                    </span>
                  </div>
                  <p className="text-body-sm text-muted-foreground">
                    {person.role} · {person.subject}
                  </p>
                  {last && (
                    <div className="mt-1 flex items-start gap-2">
                      <p
                        className={cn(
                          "line-clamp-2 min-w-0 flex-1 text-body-sm",
                          person.unread ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {last.from === "me" ? "You: " : ""}
                        {last.body}
                      </p>
                      {person.unread && <UnreadDot className="mt-1.5" />}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Section({
  title,
  aside,
  children,
}: {
  title: string
  aside?: string
  children: ReactNode
}) {
  return (
    <section className="border-t border-border px-5 py-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-caption font-medium text-muted-foreground">
          {title}
        </h3>
        {aside && (
          <span className="text-caption tabular-nums text-muted-foreground">
            {aside}
          </span>
        )}
      </div>
      {children}
    </section>
  )
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-4">
      <h3 className="px-5 text-caption font-medium text-muted-foreground">
        {title}
      </h3>
      <ul className="mt-1 flex flex-col px-3">{children}</ul>
    </section>
  )
}

function PersonRow({
  avatar,
  name,
  detail,
  badge,
  href,
  revealed,
}: {
  avatar: ReactNode
  name: string
  detail: string
  badge?: ReactNode
  href?: string
  // Added by Show more, so it eases in rather than appearing.
  revealed?: boolean
}) {
  const body = (
    <>
      {avatar}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{name}</p>
          {badge}
        </div>
        <p className="truncate text-body-sm text-muted-foreground">{detail}</p>
      </div>
    </>
  )

  return (
    <li
      className={cn(
        revealed &&
          "animate-in duration-300 ease-fluid fade-in slide-in-from-bottom-1 motion-reduce:animate-none"
      )}
    >
      {href ? (
        <Link
          href={href}
          transitionTypes={["nav-forward"]}
          className="group flex items-center gap-3 rounded-xl px-2 py-2 outline-none transition-colors hover:bg-hover/60 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {body}
          <ChevronRight
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </Link>
      ) : (
        <div className="flex items-center gap-3 px-2 py-2">{body}</div>
      )}
    </li>
  )
}
