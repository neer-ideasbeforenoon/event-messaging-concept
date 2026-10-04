"use client"

import { useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Headset,
  History,
  KeyRound,
  Lock,
  MessageCircleQuestionMark,
  ReceiptText,
  RotateCcw,
  Ticket,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  bookedEvents,
  conversations,
  type SupportTicket,
} from "@/lib/conversations"
import {
  MAX_MESSAGE,
  newTicketHref,
  supportTopics,
  type SupportTopic,
} from "@/lib/support"
import { cn } from "@/lib/utils"

const icons: Record<SupportTopic["id"], LucideIcon> = {
  tickets: Ticket,
  refund: RotateCcw,
  invoice: ReceiptText,
  payment: CreditCard,
  account: KeyRound,
  other: MessageCircleQuestionMark,
}

// The incoming step slides in from the side it lives on, with a light blur,
// the way one page of a wizard replaces the other.
const enter = {
  forward:
    "animate-in duration-250 ease-fluid fade-in blur-in-[3px] slide-in-from-right-2 motion-reduce:animate-none",
  back: "animate-in duration-250 ease-fluid fade-in blur-in-[3px] slide-in-from-left-2 motion-reduce:animate-none",
}

// Starting a ticket with the platform team, from the Customer support entry.
// Two steps. First the customer picks a topic, which names the ticket, so
// there is no subject line. Then they write, with the message field first
// and focused, so it is plain where to type. The booking is an optional row
// of chips under it. Two notes steer the customer before they send: an open
// ticket about the same booking, and, for "Something else", that the
// organizer answers questions about the event itself.
// The draft and the step survive closing the dialog, so a stray click loses
// nothing.
export function SupportDialog({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [topicId, setTopicId] = useState<SupportTopic["id"] | null>(null)
  const [step, setStep] = useState<"topic" | "message">("topic")
  const [direction, setDirection] = useState<keyof typeof enter>("forward")
  // An event title, or empty when it is not about a booking.
  const [booking, setBooking] = useState("")
  const [message, setMessage] = useState("")
  const [missing, setMissing] = useState(false)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const topic = supportTopics.find((t) => t.id === topicId)
  const bookings = bookedEvents()
  const event = topic?.asksBooking && booking ? booking : undefined
  const organizer = bookings.find((b) => b.thread.title === event)?.thread
  const openTicket = conversations.find(
    (c): c is SupportTicket => c.group === "support" && c.event === event
  )

  function go(next: typeof step) {
    setDirection(next === "message" ? "forward" : "back")
    setStep(next)
  }

  // Send stays enabled. An empty message says what is missing and puts the
  // caret where it goes, instead of a grey button that never explains itself.
  function send() {
    if (!topic) return
    if (!message.trim()) {
      setMissing(true)
      messageRef.current?.focus()
      return
    }
    router.push(
      newTicketHref({
        topic: topic.id,
        event,
        message: message.trim(),
        at: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }),
      { transitionTypes: ["nav-forward"] }
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={cn(
          "flex max-h-[calc(100dvh-1rem)] flex-col gap-0 overflow-hidden rounded-3xl bg-card p-0 text-body shadow-[0_24px_60px_-12px_rgba(16,19,20,0.3)] ring-border sm:max-h-[min(48rem,calc(100dvh-4rem))] sm:max-w-xl",
          "ease-fluid data-closed:duration-150 data-closed:zoom-out-96 data-open:duration-250 data-open:zoom-in-96",
          // A sheet from the bottom edge on a phone.
          "max-sm:top-auto max-sm:bottom-0 max-sm:max-w-full max-sm:translate-y-0 max-sm:rounded-b-none max-sm:data-closed:slide-out-to-bottom-8 max-sm:data-open:slide-in-from-bottom-8",
          "[&>[data-slot=dialog-close]]:top-4 [&>[data-slot=dialog-close]]:right-4 [&>[data-slot=dialog-close]]:size-9 [&>[data-slot=dialog-close]]:rounded-full [&>[data-slot=dialog-close]_svg]:size-5"
        )}
      >
        {step === "topic" || !topic ? (
          <div key="topic" className={cn("flex min-h-0 flex-col", enter[direction])}>
            <Header
              title="How can we help?"
              description="Pick what it’s about. The platform team usually replies within a few hours."
            />
            <ul className="scrollbar-none grid min-h-0 gap-2 overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:grid-cols-2 sm:px-7 sm:pb-7">
              {supportTopics.map((t) => {
                const Icon = icons[t.id]
                const chosen = t.id === topicId
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      // Coming back, the topic the customer left keeps focus.
                      autoFocus={chosen}
                      onClick={() => {
                        setTopicId(t.id)
                        go("message")
                      }}
                      className={cn(
                        "group/topic flex h-full w-full items-start gap-3 rounded-2xl border border-border bg-card p-3.5 text-left outline-none transition-[background-color,border-color] duration-200 hover:border-neutral-7 hover:bg-hover/50 focus-visible:ring-3 focus-visible:ring-ring/50 dark:hover:border-neutral-9",
                        chosen && "border-mark"
                      )}
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-well text-mark transition-colors group-hover/topic:bg-primary group-hover/topic:text-primary-foreground">
                        <Icon aria-hidden="true" className="size-4.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{t.label}</span>
                        <span className="mt-0.5 block text-body-sm text-muted-foreground">
                          {t.hint}
                        </span>
                      </span>
                      <ChevronRight
                        aria-hidden="true"
                        className="mt-2.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-fluid group-hover/topic:translate-x-0.5 group-hover/topic:text-foreground motion-reduce:transition-none"
                      />
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : (
          <form
            key="message"
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            className={cn("flex min-h-0 flex-1 flex-col", enter[direction])}
          >
            <Header
              title={topic.label}
              description="Tell us what’s going on. We’ll reply in this inbox, under Support."
            />

            <div className="scrollbar-none flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain px-5 pt-1 pb-6 sm:px-7">
              <div>
                <label htmlFor="support-message" className="mb-2 block font-semibold">
                  Your message
                </label>
                <Textarea
                  ref={messageRef}
                  id="support-message"
                  autoFocus
                  value={message}
                  maxLength={MAX_MESSAGE}
                  aria-invalid={missing || undefined}
                  aria-describedby={missing ? "support-missing" : "support-privacy"}
                  onChange={(e) => {
                    setMessage(e.target.value)
                    if (e.target.value.trim()) setMissing(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault()
                      send()
                    }
                  }}
                  placeholder={topic.placeholder}
                  className="max-h-64 min-h-36 rounded-2xl bg-card px-3.5 py-3 dark:bg-hover"
                />
                <div className="mt-2 flex items-start justify-between gap-3 text-caption">
                  {missing ? (
                    <p id="support-missing" role="alert" className="text-destructive dark:text-destructive-11">
                      Write a few words so the team knows how to help.
                    </p>
                  ) : (
                    <p id="support-privacy" className="flex items-center gap-1.5 text-muted-foreground">
                      <Lock aria-hidden="true" className="size-3.5 shrink-0" />
                      Only you and the platform team can see this.
                    </p>
                  )}
                  {message.length > MAX_MESSAGE - 200 && (
                    <p className="shrink-0 text-muted-foreground tabular-nums">
                      {MAX_MESSAGE - message.length} left
                    </p>
                  )}
                </div>
              </div>

              {topic.asksBooking && (
                <fieldset>
                  <legend className="mb-2 flex w-full items-baseline gap-2 font-semibold">
                    Related booking
                    <span className="text-caption font-normal text-muted-foreground">
                      Optional
                    </span>
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {bookings.map(({ thread }) => (
                      <label
                        key={thread.id}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card py-1.5 pr-3.5 pl-1.5 text-body-sm transition-colors hover:bg-hover/50 has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground has-focus-visible:ring-3 has-focus-visible:ring-ring/50 dark:has-checked:border-brand-10"
                      >
                        {/* A chip picked again is let go, so "none" needs
                            no chip of its own. */}
                        <input
                          type="radio"
                          name="booking"
                          value={thread.title}
                          checked={booking === thread.title}
                          onChange={() => setBooking(thread.title)}
                          onClick={() => booking === thread.title && setBooking("")}
                          className="sr-only"
                        />
                        <span className="rounded-full bg-well px-2 py-0.5 text-caption font-medium tabular-nums [label:has(:checked)_&]:bg-white/15">
                          {thread.date.month} {Number(thread.date.day)}
                        </span>
                        <span className="font-medium">{thread.title}</span>
                      </label>
                    ))}
                  </div>

                  {openTicket && (
                    <Callout key={openTicket.id} icon={History}>
                      You already have a ticket about this booking, “
                      {openTicket.subject}”.{" "}
                      <CalloutLink href={`/messages/${openTicket.id}`}>
                        Continue that conversation
                      </CalloutLink>
                    </Callout>
                  )}
                  {/* Venue, schedule and access are the organizer's to
                      answer. Said where the customer is most likely to ask
                      the wrong team, next to the booking that finds them. */}
                  {topic.id === "other" && (
                    <Callout icon={MessageCircleQuestionMark}>
                      About the venue, schedule, access, or the name on a
                      ticket? The event’s organizer answers those directly.{" "}
                      {organizer ? (
                        <CalloutLink href={`/messages/${organizer.id}`}>
                          Message {organizer.with}
                        </CalloutLink>
                      ) : (
                        "Pick the booking to find them."
                      )}
                    </Callout>
                  )}
                </fieldset>
              )}

            </div>

            <footer className="flex items-center justify-between gap-3 border-t border-border bg-well/50 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5 sm:py-4">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => go("topic")}
                className="h-11 gap-1 rounded-xl pr-3.5 pl-2 text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft aria-hidden="true" className="size-4.5" />
                Change topic
              </Button>
              <Button type="submit" size="lg" className="h-11 gap-2 rounded-xl px-5">
                Send to support
                <ArrowRight aria-hidden="true" />
              </Button>
            </footer>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Header({ title, description }: { title: string; description: string }) {
  return (
    <header className="shrink-0 px-5 pt-5 pb-5 sm:px-7 sm:pt-7">
      <p className="flex items-center gap-2 text-caption font-medium text-muted-foreground">
        <span className="flex size-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Headset aria-hidden="true" className="size-3.5" />
        </span>
        Platform support
      </p>
      <DialogTitle className="mt-3 pr-8 text-h1">{title}</DialogTitle>
      <DialogDescription className="mt-1 text-body text-muted-foreground">
        {description}
      </DialogDescription>
    </header>
  )
}

function Callout({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <p className="mt-3 flex animate-in gap-2.5 rounded-2xl bg-info-surface p-3.5 text-body-sm text-info-foreground duration-300 ease-fluid fade-in slide-in-from-top-1 motion-reduce:animate-none">
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  )
}

function CalloutLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      transitionTypes={["nav-forward"]}
      className="inline-flex items-center gap-1 font-semibold underline-offset-2 hover:underline focus-visible:underline focus-visible:outline-none"
    >
      {children}
      <ArrowRight aria-hidden="true" className="size-3.5" />
    </Link>
  )
}
