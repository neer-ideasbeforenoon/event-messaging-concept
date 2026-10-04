import type { ReactNode } from "react"
import Link from "next/link"
import {
  ChevronRight,
  CircleCheck,
  Clock,
  Headset,
  MessageSquareText,
  Ticket,
} from "lucide-react"
import {
  CalendarTile,
  InitialsAvatar,
  MemojiCircle,
  StatusBadge,
} from "@/components/conversation-meta"
import { EventCover } from "@/components/event-cover"
import { EventPanelTabs } from "@/components/event-panel-tabs"
import {
  customerEmoji,
  customerName,
  customerTint,
  eventThread,
  events,
  peopleAt,
  personContext,
  threadHref,
  type Conversation,
  type EventConversation,
  type PersonConversation,
  type SupportTicket,
} from "@/lib/conversations"
import { cn } from "@/lib/utils"

// The right-hand panel of an open thread. It answers "what is this about and
// who is here" so the chat column only has to carry the conversation: the
// event for an organizer thread, the person for a direct thread, the ticket
// for support.
// Its links to other threads carry the trail, the threads opened on the way
// here ending with this one, so Back from there returns here.
export function ThreadDetails({
  conversation,
  trail,
}: {
  conversation: Conversation
  trail: string[]
}) {
  if (conversation.group === "event") {
    return <EventDetails conversation={conversation} trail={trail} />
  }
  if (conversation.group === "person") {
    return <PersonDetails conversation={conversation} trail={trail} />
  }
  return <SupportDetails conversation={conversation} trail={trail} />
}

function EventDetails({
  conversation,
  trail,
}: {
  conversation: EventConversation
  trail: string[]
}) {
  const event = events[conversation.title]

  const overview = (
    <>
      <div className="p-5">
        <EventCover
          title={conversation.title}
          className="rounded-2xl shadow-[0_8px_24px_-8px_rgba(16,19,20,0.35)] ring-1 ring-neutral-12/[0.06] dark:ring-white/[0.06]"
        />
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <h2 className="text-h2">{conversation.title}</h2>
          <StatusBadge conversation={conversation} />
        </div>
        <p className="mt-1 text-muted-foreground">Hosted by {event.host}</p>

        <div className="mt-5 flex flex-col gap-4">
          <DetailRow
            tile={<CalendarTile date={event.date} className="sm:size-14" />}
            primary={event.when}
            secondary={event.time}
          />
          <DetailRow
            tile={<MapTile place={event.venue} />}
            primary={event.venue}
            secondary={event.address}
          />
        </div>
      </div>

      <Section title="About">
        <p className="text-pretty text-foreground/90">{event.about}</p>
      </Section>

      {/* The person who replies in this thread, ahead of the booking they
          would attach. */}
      <Section title="Organizer">
        <div className="flex items-center gap-3">
          <InitialsAvatar name={conversation.with} />
          <div className="min-w-0">
            <p className="font-medium">{conversation.with}</p>
            <p className="truncate text-body-sm text-muted-foreground">
              Organizer, {event.host}
            </p>
          </div>
        </div>
      </Section>

      <Section title="Your booking">
        {conversation.booking ? (
          <Notice
            icon={CircleCheck}
            className="bg-success-surface text-success-foreground"
            title={conversation.booking}
            body="Attached to this conversation."
          />
        ) : (
          <Notice
            icon={Ticket}
            className="bg-well text-foreground"
            title="Not booked yet"
            body="If you book this event, the booking attaches to this conversation."
          />
        )}
      </Section>
    </>
  )

  return (
    <EventPanelTabs
      overview={overview}
      event={conversation.title}
      going={event.going}
      host={event.host}
      organizer={conversation.with}
      booked={Boolean(conversation.booking)}
      known={peopleAt(conversation.title)}
      trail={trail}
    />
  )
}

function PersonDetails({
  conversation,
  trail,
}: {
  conversation: PersonConversation
  trail: string[]
}) {
  return (
    <>
      <div className="flex flex-col items-center px-5 pt-8 pb-6 text-center">
        <MemojiCircle
          emoji={conversation.emoji}
          tint={conversation.tint}
          className="relative size-24 text-[60px]"
        />
        <h2 className="mt-4 text-h2">{conversation.title}</h2>
        <div className="mt-2">
          <StatusBadge conversation={conversation} />
        </div>
        <p className="mt-2 text-muted-foreground">
          {personContext(conversation)}
        </p>
      </div>

      <Section title="Where you’ll meet">
        <EventCard title={conversation.event} trail={trail} />
      </Section>

      <Section title="In this conversation">
        <Participants
          other={
            <MemojiCircle
              emoji={conversation.emoji}
              tint={conversation.tint}
              className="relative size-9 text-[22px]"
            />
          }
          name={conversation.with}
          role={conversation.role}
        />
      </Section>
    </>
  )
}

function SupportDetails({
  conversation,
  trail,
}: {
  conversation: SupportTicket
  trail: string[]
}) {
  const opened = conversation.messages[0]?.time

  return (
    <>
      <div className="p-5">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.15)]">
          <Headset aria-hidden="true" className="size-6" />
        </span>
        <h2 className="mt-4 text-h2">{conversation.title}</h2>
        <p className="mt-1 text-muted-foreground">
          A ticket with the platform team
        </p>
        <div className="mt-5 flex flex-col gap-4">
          <DetailRow
            tile={<IconTile icon={MessageSquareText} />}
            primary={conversation.subject}
            secondary="Topic"
          />
          {opened && (
            <DetailRow
              tile={<IconTile icon={Clock} />}
              primary={opened.includes(",") ? opened : `Today, ${opened}`}
              secondary="Opened"
            />
          )}
        </div>
      </div>

      {conversation.event && (
        <Section title="About this event">
          <EventCard title={conversation.event} trail={trail} />
        </Section>
      )}

      <Section title="In this conversation">
        <Participants
          other={
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Headset aria-hidden="true" className="size-4" />
            </span>
          }
          name={conversation.with}
          role="Platform team"
        />
      </Section>
    </>
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

// A row in the Luma pattern: a small square tile, then a strong line and a
// quiet line beside it.
function DetailRow({
  tile,
  primary,
  secondary,
}: {
  tile: ReactNode
  primary: string
  secondary: string
}) {
  return (
    <div className="flex items-center gap-4">
      {tile}
      <div className="min-w-0">
        <p className="font-medium">{primary}</p>
        <p className="text-body-sm text-muted-foreground">{secondary}</p>
      </div>
    </div>
  )
}

// The same size and paper as the calendar tile, so the rows line up.
const tileClassName =
  "flex size-14 shrink-0 rounded-xl bg-linear-to-b from-white to-neutral-1 shadow-[0_1px_1px_rgb(16_19_20/0.04),0_2px_6px_-2px_rgb(16_19_20/0.14)] ring-1 ring-neutral-12/[0.07] dark:from-neutral-6 dark:to-neutral-4 dark:shadow-[0_2px_6px_-2px_rgb(0_0_0/0.5)] dark:ring-white/[0.07]"

// A street map cut to the tile, with the venue pinned in the middle: a
// river, a park, main roads and side streets. Each venue turns the same
// streets to its own angle, so two events never share a map. The pin stays
// upright.
function MapTile({ place }: { place: string }) {
  const turn =
    ([...place].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 8) * 45

  return (
    <span
      aria-hidden="true"
      className={cn(tileClassName, "relative overflow-hidden")}
    >
      <svg viewBox="0 0 56 56" className="size-full">
        <rect width="56" height="56" className="fill-[#ECEFE9] dark:fill-[#1F2426]" />
        <g transform={`rotate(${turn} 28 28)`}>
          <rect x="31" y="-6" width="20" height="17" rx="2" className="fill-[#CFE3C2] dark:fill-[#203328]" />
          <rect x="4" y="36" width="14" height="12" rx="2" className="fill-[#CFE3C2] dark:fill-[#203328]" />
          <path
            d="M-10 44 C 8 38, 18 50, 34 42 S 58 30, 70 36"
            fill="none"
            strokeWidth="7"
            className="stroke-[#B9D5EA] dark:stroke-[#1A3245]"
          />
          <g fill="none" strokeLinecap="round" className="stroke-white dark:stroke-[#3A4144]">
            <path d="M-6 13H62M-6 30H62M21-6V62M44-6V62" strokeWidth="1.25" />
            <path d="M-6 22H62M10-6V62M33-6V62" strokeWidth="0.75" />
            <path d="M-8 -2 62 52" strokeWidth="2.75" />
          </g>
          <path
            d="M-8 -2 62 52"
            fill="none"
            strokeWidth="1"
            className="stroke-[#F3D9A4] dark:stroke-[#5C5340]"
          />
        </g>
      </svg>
      {/* Pin, with its point on the centre of the map. */}
      <svg
        viewBox="0 0 24 24"
        className="absolute top-1/2 left-1/2 size-6 -translate-x-1/2 -translate-y-full drop-shadow-[0_2px_2px_rgb(16_19_20/0.35)]"
      >
        <path
          d="M12 23s-8-7.6-8-13.2A8 8 0 0 1 20 9.8C20 15.4 12 23 12 23z"
          className="fill-primary stroke-white dark:stroke-neutral-12"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="10" r="3" fill="#FFFFFF" />
      </svg>
    </span>
  )
}

function IconTile({ icon: Icon }: { icon: typeof Clock }) {
  return (
    <span aria-hidden="true" className={cn(tileClassName, "items-center justify-center")}>
      <Icon className="size-5 text-muted-foreground" />
    </span>
  )
}


function Notice({
  icon: Icon,
  title,
  body,
  className,
}: {
  icon: typeof Ticket
  title: string
  body: string
  className?: string
}) {
  return (
    <div className={cn("flex gap-3 rounded-xl p-3", className)}>
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-0.5 text-body-sm opacity-80">{body}</p>
      </div>
    </div>
  )
}


// Always two: the customer, and whoever replies.
function Participants({
  other,
  name,
  role,
}: {
  other: ReactNode
  name: string
  role: string
}) {
  return (
    <ul className="flex flex-col gap-3">
      <li className="flex items-center gap-3">
        <MemojiCircle
          emoji={customerEmoji}
          tint={customerTint}
          className="relative size-9 text-[22px]"
        />
        <div className="min-w-0">
          <p className="font-medium">{customerName}</p>
          <p className="text-body-sm text-muted-foreground">You</p>
        </div>
      </li>
      <li className="flex items-center gap-3">
        {other}
        <div className="min-w-0">
          <p className="font-medium">{name}</p>
          <p className="truncate text-body-sm text-muted-foreground">{role}</p>
        </div>
      </li>
    </ul>
  )
}

const rowLinkClassName =
  "group flex items-center gap-3 rounded-xl px-2 py-2 outline-none transition-colors hover:bg-hover/60 focus-visible:ring-3 focus-visible:ring-ring/50"


// The event a person or ticket mentions. It opens the organizer thread when
// the customer has one, and is plain otherwise.
function EventCard({ title, trail }: { title: string; trail: string[] }) {
  const event = events[title]
  const thread = eventThread(title)
  if (!event) return <p className="font-medium">{title}</p>

  const body = (
    <>
      <EventCover
        title={title}
        className="aspect-square w-12 shrink-0 rounded-lg ring-1 ring-neutral-12/[0.06] dark:ring-white/[0.06]"
      />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-body-sm text-muted-foreground">
          {event.date.month} {Number(event.date.day)} · {event.address}
        </p>
      </div>
    </>
  )

  return thread ? (
    <Link
      href={threadHref(thread.id, trail)}
      transitionTypes={["nav-forward"]}
      className={cn(rowLinkClassName, "-mx-2")}
    >
      {body}
      <ChevronRight
        aria-hidden="true"
        className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
      />
    </Link>
  ) : (
    <div className="flex items-center gap-3">{body}</div>
  )
}
