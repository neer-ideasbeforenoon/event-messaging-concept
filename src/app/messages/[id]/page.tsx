import { notFound } from "next/navigation"
import { InitialsAvatar, StatusBadge } from "@/components/conversation-meta"
import { PageTransition } from "@/components/page-transition"
import { Thread } from "@/components/thread"
import { ThreadDetails } from "@/components/thread-details"
import { ThreadLayout } from "@/components/thread-layout"
import { newThreadWith } from "@/lib/attendees"
import {
  conversations,
  eventThread,
  newOrganizerThread,
  personContext,
  readTrail,
  threadHref,
  withYou,
  type Conversation,
} from "@/lib/conversations"
import { newTicket } from "@/lib/support"

// Existing threads are built ahead. A new thread with someone going to an
// event, or with the organizer of a booked event, and a support ticket just
// sent from the inbox render on request.
export function generateStaticParams() {
  return conversations.map(({ id }) => ({ id }))
}

// Who the reply goes to, who can read the thread, and what the details panel
// is about, in the customer's words.
function recipient(conversation: Conversation) {
  switch (conversation.group) {
    case "event":
      return {
        role: "Event organizer",
        privacy: "Only you and the organizer can see this conversation.",
        details: "Event details",
      }
    case "person":
      return {
        role: conversation.role,
        privacy: `Only you and ${conversation.with.split(" ")[0]} can see this conversation.`,
        details: `About ${conversation.with.split(" ")[0]}`,
      }
    case "support":
      return {
        role: "Platform team",
        privacy: "Only you and platform support can see this ticket.",
        details: "Ticket details",
      }
  }
}

export default async function ConversationPage(
  props: PageProps<"/messages/[id]">
) {
  const { id } = await props.params
  const query = await props.searchParams
  const existing = conversations.find((c) => c.id === id)
  const conversation =
    existing ??
    newThreadWith(id) ??
    newOrganizerThread(id) ??
    newTicket(id, query)
  if (!conversation) notFound()

  // Back returns to the thread this one was opened from, if any.
  const from = readTrail(query.from)
  const trail = from.filter(
    (step) =>
      step !== id &&
      (conversations.some((c) => c.id === step) ||
        newThreadWith(step) ||
        newOrganizerThread(step))
  )
  const previous = trail.at(-1)

  // Without a path, a new thread was opened from the event's attendee list,
  // so back returns there.
  const organizerThread =
    !existing && conversation.group === "person"
      ? eventThread(conversation.event)
      : undefined
  const backHref = previous
    ? threadHref(previous, trail.slice(0, -1))
    : from.at(-1) === "my-events"
    ? "/my-events"
    : organizerThread
    ? `/messages/${organizerThread.id}`
    : {
        person: "/?tab=people",
        event: "/",
        support: "/?tab=support",
      }[conversation.group]

  const { role, privacy, details } = recipient(conversation)

  return (
    <PageTransition>
      <main className="flex h-dvh flex-col sm:px-6 sm:py-6 lg:py-8">
        <ThreadLayout
          backHref={backHref}
          backLabel={
            backHref === "/my-events" ? "Back to My events" : undefined
          }
          detailsLabel={details}
          details={
            <ThreadDetails
              conversation={conversation}
              trail={[...trail, conversation.id]}
            />
          }
          heading={
            <div className="flex min-w-0 items-center gap-3">
              <InitialsAvatar name={conversation.with} />
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2">
                  <h1 className="truncate text-h3">{conversation.title}</h1>
                  <StatusBadge conversation={conversation} />
                </div>
                <p className="flex min-w-0 items-center gap-1.5 text-body-sm text-muted-foreground">
                  <span className="shrink-0 font-medium text-foreground/80">
                    {conversation.group === "person"
                      ? withYou(conversation)
                      : conversation.with}
                    {conversation.group === "event" && (
                      <span className="font-normal text-muted-foreground">, organizer</span>
                    )}
                  </span>
                  <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-muted-foreground/50" />
                  <span className="truncate">{conversation.subject}</span>
                </p>
              </div>
            </div>
          }
        >
          <Thread
            key={conversation.id}
            initialMessages={conversation.messages}
            replyTo={conversation.with}
            recipientRole={role}
            privacyNote={privacy}
            emptyNote={
              conversation.group === "person"
                ? personContext(conversation)
                : undefined
            }
          />
        </ThreadLayout>
      </main>
    </PageTransition>
  )
}
