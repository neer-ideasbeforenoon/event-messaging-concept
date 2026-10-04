import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ReceiptText,
  UsersRound,
} from "lucide-react"
import {
  ConversationMarker,
  StatusBadge,
  UnreadDot,
} from "@/components/conversation-meta"
import { ConversationTabs } from "@/components/conversation-tabs"
import { BookingCalendar } from "@/components/booking-calendar"
import { EventStack } from "@/components/event-stack"
import { PageTransition } from "@/components/page-transition"
import { SupportWheel } from "@/components/support-wheel"
import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  conversations,
  customerName,
  toTab,
  withYou,
  type Conversation,
} from "@/lib/conversations"
// These explain where each kind of thread starts. Starting one is outside
// this screen, so each links to the place that owns the entry point.
const entries = [
  {
    title: "Before you book",
    description: "Ask about the event, group rates or what’s included.",
    cta: "Contact an organizer",
    href: "/discover",
    illustration: <EventStack />,
  },
  {
    title: "My booked event",
    description: "Talk about arrival, accessibility or your attendance.",
    cta: "Choose a booking",
    href: "/my-events",
    illustration: <BookingCalendar />,
  },
  {
    title: "Customer support",
    description: "Get platform help with invoices or your account.",
    cta: "Contact platform support",
    href: "/profile",
    illustration: <SupportWheel />,
  },
]

const groups = [
  {
    id: "people",
    title: "People",
    icon: UsersRound,
    items: conversations.filter((c) => c.group === "person"),
  },
  {
    id: "events",
    title: "Event conversations",
    shortTitle: "Events",
    icon: CalendarDays,
    items: conversations.filter((c) => c.group === "event"),
  },
  {
    id: "support",
    title: "Support",
    icon: ReceiptText,
    items: conversations.filter((c) => c.group === "support"),
  },
]

const tabsClassName =
  "mt-4 gap-0 overflow-hidden rounded-2xl border border-border bg-card/85 shadow-[0_8px_30px_rgba(16,19,20,0.06)] backdrop-blur-xl"

export default async function MessagesPage(props: PageProps<"/">) {
  const initialTab = toTab((await props.searchParams).tab)

  const tabsBody = (
    <>
      <div className="flex items-center gap-4 border-b border-border bg-well/60 px-4 py-3 sm:px-6">
        <TabsList
          aria-label="Conversations"
          className="gap-2 bg-transparent p-0 group-data-[orientation=horizontal]/tabs:h-auto"
        >
          {/* The brand pill slides from chip to chip. Under it, the open
              chip keeps the card surface the others have. */}
          <TabsIndicator className="rounded-full bg-primary" />
          {groups.map((group) => (
            <TabsTrigger
              key={group.id}
              value={group.id}
              data-tab={group.id}
              className="h-auto flex-none gap-2 rounded-full border border-border bg-card px-3 py-1.5 [--tab-rest-border:var(--border)] [--tab-rest:var(--card)] hover:bg-hover data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none dark:data-[state=active]:border-primary dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground sm:px-4"
            >
              <group.icon
                aria-hidden="true"
                strokeWidth={1.75}
                className="hidden size-4 sm:block"
              />
              {/* Three tabs fit a phone only with the short name. */}
              {group.shortTitle ? (
                <>
                  <span className="sm:hidden">{group.shortTitle}</span>
                  <span className="hidden sm:inline">{group.title}</span>
                </>
              ) : (
                group.title
              )}
              {/* Under 375px the counts would push Support out of the
                  container, so only the unread dots stay. */}
              <span className="rounded-full bg-hover px-2 py-0.5 text-badge tabular-nums text-muted-foreground max-[374px]:hidden">
                {group.items.length}
              </span>
              {group.items.some((c) => c.unread) && (
                <UnreadDot />
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {groups.map((group) => (
        <TabsContent key={group.id} value={group.id}>
          <ul className="divide-y divide-border">
            {group.items.map((conversation) => (
              <li key={conversation.id}>
                <ConversationRow conversation={conversation} />
              </li>
            ))}
          </ul>
        </TabsContent>
      ))}
    </>
  )

  return (
    <PageTransition>
      <main className="mx-auto max-w-5xl px-4 pt-6 pb-12 sm:px-8 sm:pt-10">
        <h1 className="max-w-[18ch] text-display">
          Inbox
        </h1>

        {/* Three equal cards with short illustrations, so the recent
            conversations still start inside the first screen. */}
        <ul className="mt-8 grid gap-4 md:grid-cols-3 lg:mt-10 lg:gap-6">
          {entries.map((entry) => (
            <li key={entry.title}>
              <EntryCard entry={entry} />
            </li>
          ))}
        </ul>

        <section aria-labelledby="recent" className="mt-10 lg:mt-12">
          <h2 id="recent" className="text-h3">
            Recent conversations
          </h2>

          {/* One frosted container over the sky. The tabs split the list by
              who will reply, so people, organizers, and the platform team
              never mix. */}
          <ConversationTabs initialTab={initialTab} className={tabsClassName}>
            {tabsBody}
          </ConversationTabs>
        </section>
      </main>
    </PageTransition>
  )
}

// Same frosted surface as the conversation list, so the entries and the
// threads they lead to read as one screen. The whole card is the link. Each
// opens on a picture of where the thread starts: a pile of events to ask
// about, the month you have booked, or the things the platform team helps
// with. Every picture shares one 16:10 frame, so the three cards line up.
function EntryCard({ entry }: { entry: (typeof entries)[number] }) {
  return (
    <Link
      href={entry.href}
      className="group relative isolate flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-border bg-card/85 p-5 shadow-[0_8px_30px_rgba(16,19,20,0.06)] outline-none backdrop-blur-xl transition-colors hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50 sm:p-6"
    >
      {/* A soft brand glow that rises a little way from the bottom edge on
          hover or focus. It sits behind the content. In dark the brand solid
          is too close to the card, so the glow uses the lighter brand step. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-linear-to-t from-brand-9/35 via-brand-9/10 to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 dark:from-brand-10/60 dark:via-brand-10/20"
      />
      <div className="aspect-[16/10] [&>*]:size-full">{entry.illustration}</div>
      <div className="flex-1">
        <h2 className="text-h3">{entry.title}</h2>
        <p className="mt-1.5 text-muted-foreground">{entry.description}</p>
      </div>
      <span className="inline-flex items-center gap-1.5 text-btn text-mark">
        {entry.cta}
        <ArrowRight
          aria-hidden="true"
          strokeWidth={2}
          className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      </span>
    </Link>
  )
}

function ConversationRow({ conversation }: { conversation: Conversation }) {
  return (
    <Link
      href={`/messages/${conversation.id}`}
      transitionTypes={["nav-forward"]}
      className="group flex items-center gap-4 px-4 py-4 outline-none transition-colors hover:bg-hover/60 focus-visible:bg-hover/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset sm:gap-6 sm:px-6"
    >
      <ConversationMarker conversation={conversation} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-h3">{conversation.title}</p>
          <StatusBadge conversation={conversation} />
        </div>
        <p className="mt-1 truncate text-muted-foreground">
          {conversation.group === "person"
            ? withYou(conversation)
            : conversation.with}{" "}
          · {conversation.subject}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-6">
        {conversation.unread && (
          <UnreadDot />
        )}
        <span
          className={
            conversation.unread
              ? "text-body-sm font-semibold"
              : "text-body-sm text-muted-foreground"
          }
        >
          {conversation.updated}
        </span>
        <ArrowUpRight
          aria-hidden="true"
          strokeWidth={1.5}
          className="hidden size-6 text-foreground transition-transform duration-200 ease-fluid group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none sm:block"
        />
      </div>
    </Link>
  )
}
