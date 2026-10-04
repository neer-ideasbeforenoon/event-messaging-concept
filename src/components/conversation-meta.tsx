import { Ticket } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  customerEmoji,
  initials,
  customerTint,
  type Conversation,
  type PersonConversation,
} from "@/lib/conversations"
import { cn } from "@/lib/utils"

// Two people talking for a person, calendar tile for an event thread, brand
// tile for a support ticket. The marker tells the customer who will reply before
// they read the row.
export function ConversationMarker({
  conversation,
  className,
}: {
  conversation: Conversation
  className?: string
}) {
  if (conversation.group === "person") {
    return <PeopleTile conversation={conversation} className={className} />
  }

  if (conversation.group === "event") {
    return <CalendarTile date={conversation.date} className={className} />
  }

  return <ReceiptTile className={className} />
}

// Two overlapping circles, like a chat between two people: the customer
// behind at the top left, the other person in front at the bottom right. Each
// is a face on its own colour ground, the way Memoji sit in Messages. Circles
// where the other markers are square, so a person reads apart from an event
// or a ticket at a glance. Sizes are fixed pixels, never percentages of the
// tile, so each stays a true circle. The front rim matches the card, so it
// sits on the back circle like a sticker.
function PeopleTile({
  conversation,
  className,
}: {
  conversation: PersonConversation
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative size-14 shrink-0 select-none sm:size-16",
        className
      )}
    >
      <MemojiCircle
        emoji={customerEmoji}
        tint={customerTint}
        className="top-0 left-0 size-[34px] text-[22px] sm:size-[38px] sm:text-[25px]"
        // The front circle covers the lower right, so the face leans away.
        faceClassName="-translate-x-[8%] -translate-y-[6%]"
      />
      <MemojiCircle
        emoji={conversation.emoji}
        tint={conversation.tint}
        className="right-0 bottom-0 size-10 text-[26px] ring-2 ring-card sm:size-[46px] sm:text-[30px]"
      />
    </div>
  )
}

// A whole face centred on a colour ground that is lighter at the top, with a
// soft top highlight, a hairline and a small shadow, so it reads as a lit
// disc rather than a flat sticker.
export function MemojiCircle({
  emoji,
  tint,
  className,
  faceClassName,
}: {
  emoji: string
  tint: string
  className?: string
  faceClassName?: string
}) {
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(to bottom, color-mix(in oklab, ${tint} 50%, white), ${tint})`,
      }}
      className={cn(
        "absolute flex aspect-square items-center justify-center overflow-hidden rounded-full leading-none shadow-[inset_0_1px_0_rgb(255_255_255/0.45),inset_0_0_0_0.5px_rgb(16_19_20/0.08),0_1px_3px_rgb(16_19_20/0.16)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_1px_4px_rgb(0_0_0/0.5)]",
        className
      )}
    >
      <span className={cn("translate-y-[4%]", faceClassName)}>{emoji}</span>
    </span>
  )
}

// A paper receipt for a platform ticket, built like the calendar page: a slip
// with a torn edge and printed lines, a second slip tucked behind it, and a
// raised brand badge with a ticket, so it reads as a support ticket rather
// than the bill itself. Dark keeps the paper dark, one step above the
// card. The drop shadows sit on the wrapper so they follow the torn edge.
function ReceiptTile({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative size-14 shrink-0 [filter:drop-shadow(0_0_0.5px_rgb(16_19_20/0.3))_drop-shadow(0_2px_3px_rgb(16_19_20/0.12))] sm:size-16 dark:[filter:drop-shadow(0_0_0.5px_rgb(255_255_255/0.18))_drop-shadow(0_2px_4px_rgb(0_0_0/0.5))]",
        className
      )}
    >
      <div className="receipt-edge absolute inset-x-2.5 top-1.5 bottom-0.5 origin-bottom -translate-x-0.5 -rotate-[8deg] rounded-t-md bg-neutral-4 sm:inset-x-3 dark:bg-neutral-7" />
      <div className="receipt-edge absolute inset-x-2 top-0.5 bottom-0.5 flex flex-col gap-[3px] rounded-t-md bg-linear-to-b from-white to-neutral-1 px-[6px] pt-[7px] sm:inset-x-2.5 sm:gap-1 sm:px-[7px] sm:pt-2 dark:from-neutral-6 dark:to-neutral-4">
        <span className="h-[3px] w-3/5 rounded-full bg-primary dark:bg-brand-11" />
        <span className="mt-0.5 h-[2px] w-full rounded-full bg-neutral-5 dark:bg-neutral-9" />
        <span className="h-[2px] w-4/5 rounded-full bg-neutral-5 dark:bg-neutral-9" />
        <span className="my-0.5 border-t border-dashed border-neutral-6 dark:border-neutral-9" />
        <span className="h-[2px] w-2/5 rounded-full bg-neutral-6 dark:bg-neutral-9" />
      </div>
      <span className="absolute right-0.5 bottom-0.5 flex size-5 items-center justify-center rounded-full bg-linear-to-b from-brand-8 to-brand-9 text-[11px] leading-none font-bold text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_0_0_2px_var(--card),0_2px_3px_rgb(16_19_20/0.25)] sm:size-[22px] sm:text-xs dark:from-brand-10 dark:to-brand-9">
        <Ticket className="size-3 -rotate-12 sm:size-[13px]" strokeWidth={2.5} />
      </span>
    </div>
  )
}

// A tear-off calendar page: a slim brand band with the month, the day on the
// page below, and the edge of the next sheet showing underneath. The page is a
// soft top-lit gradient on a hairline, so it reads as paper rather than a box.
// Dark keeps the page dark, one step above the card, so it never glares.
export function CalendarTile({
  date,
  className,
}: {
  date: { month: string; day: string }
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative size-14 shrink-0 sm:size-16", className)}
    >
      <div className="absolute inset-x-1.5 -bottom-[3px] h-4 rounded-b-[10px] bg-neutral-3 ring-1 ring-neutral-12/[0.06] dark:bg-neutral-7 dark:ring-white/[0.06]" />
      <div className="relative flex size-full flex-col overflow-hidden rounded-xl bg-linear-to-b from-white to-neutral-1 text-foreground shadow-[0_1px_1px_rgb(16_19_20/0.04),0_2px_6px_-2px_rgb(16_19_20/0.14)] ring-1 ring-neutral-12/[0.07] dark:from-neutral-6 dark:to-neutral-4 dark:shadow-[0_2px_6px_-2px_rgb(0_0_0/0.5)] dark:ring-white/[0.07]">
        <div className="flex h-[18px] shrink-0 items-center justify-center bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.12),inset_0_-1px_0_rgb(0_0_0/0.18)] sm:h-5">
          <span className="text-[10px] leading-none font-semibold tracking-[0.14em] uppercase sm:text-[11px]">
            {date.month}
          </span>
        </div>
        <span className="flex flex-1 items-center justify-center pb-px text-[24px] leading-none font-semibold tracking-[-0.04em] tabular-nums sm:text-[28px]">
          {Number(date.day)}
        </span>
      </div>
    </div>
  )
}

// Something new is waiting. A solid brand dot with a soft halo, and a ring
// that pulses out of it. Reduced motion keeps the dot and drops the pulse.
export function UnreadDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex size-2 shrink-0", className)}>
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-attention rounded-full bg-attention motion-reduce:hidden"
      />
      <span className="relative size-2 rounded-full bg-attention shadow-[0_0_0_3px_color-mix(in_oklab,var(--attention)_18%,transparent)]" />
      <span className="sr-only">Unread</span>
    </span>
  )
}

export function StatusBadge({ conversation }: { conversation: Conversation }) {
  if (conversation.group === "person") {
    return conversation.role === "Speaker" ? (
      <Badge className="bg-primary text-primary-foreground dark:ring-1 dark:ring-brand-10">
        Speaker
      </Badge>
    ) : (
      <Badge className="bg-hover text-foreground">Attendee</Badge>
    )
  }
  if (conversation.group !== "event") return null
  return conversation.booking ? (
    <Badge className="bg-success-surface text-success-foreground">Booked</Badge>
  ) : (
    <Badge className="bg-info-surface text-info-foreground">Enquiry</Badge>
  )
}

// An organizer, who has no face of their own on the platform.
export function InitialsAvatar({ name }: { name: string }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-badge text-primary-foreground dark:ring-1 dark:ring-brand-10">
      {initials(name)}
    </span>
  )
}
