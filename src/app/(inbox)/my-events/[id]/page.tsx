import type { ReactNode } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CircleCheck, MessageSquare } from "lucide-react"
import {
  CalendarTile,
  InitialsAvatar,
  MemojiCircle,
} from "@/components/conversation-meta"
import { EventCover } from "@/components/event-cover"
import { GoingDialog } from "@/components/going-dialog"
import { PageTransition } from "@/components/page-transition"
import { DetailRow, MapTile } from "@/components/thread-details"
import { Button } from "@/components/ui/button"
import { attendeesAt } from "@/lib/attendees"
import { bookedEvents, peopleAt } from "@/lib/conversations"
import { cn } from "@/lib/utils"

// Faces shown before the rest collapse into a count.
const FACES = 5

function find(id: string) {
  return bookedEvents().find(({ thread }) => thread.id === id)
}

export function generateStaticParams() {
  return bookedEvents().map(({ thread }) => ({ id: thread.id }))
}

export async function generateMetadata(
  props: PageProps<"/my-events/[id]">,
): Promise<Metadata> {
  const booked = find((await props.params).id)
  return { title: booked?.thread.title ?? "Event" }
}

// A booked event in full: the cover beside when and where, the booking, who
// hosts it and who is going. The message button beside the organizer opens
// their thread, and Back from there returns here.
export default async function EventDetailsPage(
  props: PageProps<"/my-events/[id]">,
) {
  const booked = find((await props.params).id)
  if (!booked) notFound()
  const fromList = (await props.searchParams).view === "list"
  const { thread, event } = booked
  const organizer = thread.with

  // People the customer already talks to lead the row of faces.
  const known = peopleAt(thread.title)
  const faces = [...known, ...attendeesAt(thread.title)].slice(0, FACES)

  return (
    <PageTransition>
      <main className="mx-auto max-w-4xl px-4 pt-6 pb-12 sm:px-8 sm:pt-10">
        <Button
          asChild
          variant="ghost"
          className="-ml-2 h-9 rounded-full px-3 text-muted-foreground hover:text-foreground"
        >
          <Link
            href={fromList ? "/my-events?view=list" : "/my-events"}
            transitionTypes={["nav-back"]}
          >
            <ArrowLeft aria-hidden="true" />
            My events
          </Link>
        </Button>

        {/* Two columns from md: the cover with About under it, then the
            rest. On a phone the columns dissolve into one stack, ordered so
            About follows when and where. */}
        <article className="mt-4 flex flex-col rounded-3xl border border-border bg-card/85 p-4 shadow-[0_8px_30px_rgba(16,19,20,0.06)] backdrop-blur-xl sm:p-6 md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-8">
          <div className="contents md:sticky md:top-24 md:block md:self-start">
            <EventCover
              title={thread.title}
              className="order-1 rounded-2xl shadow-[0_8px_24px_-8px_rgba(16,19,20,0.35)] ring-1 ring-neutral-12/[0.06] dark:ring-white/[0.06]"
            />
            <Section title="About" className="order-3 md:border-t-0 md:pt-0">
              <p className="text-pretty text-foreground/90">{event.about}</p>
            </Section>
          </div>

          <div className="contents min-w-0 md:block">
            <div className="order-2 mt-6 md:mt-0">
              {thread.booking && (
                <p className="inline-flex items-center gap-1.5 rounded-full bg-success-surface px-2 py-1 text-badge text-success-foreground">
                  <CircleCheck aria-hidden="true" className="size-3.5" />
                  {thread.booking}
                </p>
              )}
              <h1 className="mt-3 text-h1 text-pretty">{thread.title}</h1>
              <p className="mt-1 text-muted-foreground">
                Hosted by {event.host}
              </p>

              <div className="mt-6 flex flex-col gap-4">
                <DetailRow
                  tile={
                    <CalendarTile date={event.date} className="sm:size-14" />
                  }
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

            <div className="order-4">
              <Section title="Organizer">
                <div className="flex items-center gap-3">
                  <InitialsAvatar name={organizer} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{organizer}</p>
                    <p className="truncate text-body-sm text-muted-foreground">
                      Organizer, {event.host}
                    </p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="icon-lg"
                    className="rounded-full bg-card"
                  >
                    <Link
                      href={`/messages/${thread.id}?from=event:${thread.id}`}
                      transitionTypes={["nav-forward"]}
                      aria-label={`Message ${organizer}, the organizer`}
                      title={`Message ${organizer.split(" ")[0]}`}
                    >
                      <MessageSquare aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </Section>

              <Section title="Going">
                <div className="flex items-center gap-3">
                  {/* The faces, then everyone else as a count, overlapping
                      like the cards on My events. */}
                  <span
                    aria-hidden="true"
                    className="flex flex-1 items-center -space-x-2"
                  >
                    {faces.map((face) => (
                      <MemojiCircle
                        key={face.id}
                        emoji={face.emoji}
                        tint={face.tint}
                        className="relative size-8 text-[20px] ring-2 ring-card"
                      />
                    ))}
                    {event.going > faces.length && (
                      <span className="relative flex h-8 min-w-8 items-center justify-center rounded-full bg-primary px-2.5 text-badge font-semibold text-primary-foreground tabular-nums ring-2 ring-card">
                        +{(event.going - faces.length).toLocaleString("en-GB")}
                      </span>
                    )}
                  </span>
                  <span className="sr-only">
                    {event.going.toLocaleString("en-GB")} going
                  </span>
                  <GoingDialog
                    eventId={thread.id}
                    event={thread.title}
                    going={event.going}
                    host={event.host}
                    organizer={organizer}
                    booked={Boolean(thread.booking)}
                    known={known}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full bg-card px-3"
                    >
                      View list
                    </Button>
                  </GoingDialog>
                </div>
              </Section>
            </div>
          </div>
        </article>
      </main>
    </PageTransition>
  )
}

function Section({
  title,
  aside,
  className,
  children,
}: {
  title: string
  aside?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section className={cn("mt-6 border-t border-border pt-5", className)}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-caption font-medium text-muted-foreground">
          {title}
        </h2>
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
