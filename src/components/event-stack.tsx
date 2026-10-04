import type { CSSProperties } from "react"
import { Poster, type PosterName } from "@/components/event-posters"
import { cn } from "@/lib/utils"

// A loose pile of event cards for the "Before you book" entry. Each card is
// an instant photo of an event listing: poster art, then the event and date
// on the frame. Decorative only, so it is hidden from assistive tech.
//
// Positions are percentages of the stack, so the pile keeps its shape at any
// card width. On hover of the parent link the pile fans out a little.

type Pile = {
  left: string
  top: string
  // Resting rotation, hover rotation, and hover nudge.
  r: string
  hr: string
  dx: string
  dy: string
}

type StackEvent = {
  title: string
  meta: string
  poster: PosterName
  pile: Pile
}

const events: StackEvent[] = [
  {
    title: "Lisbon Food Week",
    meta: "Mar 04 · Lisbon",
    poster: "tiles",
    pile: {
      left: "2%",
      top: "18%",
      r: "-9deg",
      hr: "-13deg",
      dx: "-10%",
      dy: "4%",
    },
  },
  {
    title: "Harbour Jazz Nights",
    meta: "Feb 20 · Bristol",
    poster: "moon",
    pile: {
      left: "22%",
      top: "4%",
      r: "5deg",
      hr: "8deg",
      dx: "-6%",
      dy: "-6%",
    },
  },
  {
    title: "Product Leaders Summit",
    meta: "Feb 12 · Amsterdam",
    poster: "sunrise",
    pile: {
      left: "55%",
      top: "3%",
      r: "-5deg",
      hr: "-8deg",
      dx: "6%",
      dy: "-6%",
    },
  },
  {
    title: "City Night Run 10K",
    meta: "Apr 11 · Manchester",
    poster: "run",
    pile: {
      left: "75%",
      top: "17%",
      r: "9deg",
      hr: "13deg",
      dx: "10%",
      dy: "4%",
    },
  },
  {
    title: "DesignOps Meetup Berlin",
    meta: "Jan 22 · Berlin",
    poster: "blocks",
    pile: {
      left: "13%",
      top: "44%",
      r: "3deg",
      hr: "-2deg",
      dx: "-8%",
      dy: "8%",
    },
  },
  {
    title: "Design Futures Forum",
    meta: "Dec 06 · Glasgow",
    poster: "shapes",
    pile: {
      left: "63%",
      top: "45%",
      r: "6deg",
      hr: "10deg",
      dx: "8%",
      dy: "8%",
    },
  },
  {
    title: "Global Reach Summit",
    meta: "Nov 18 · London",
    poster: "globe",
    pile: {
      left: "39%",
      top: "29%",
      r: "-3deg",
      hr: "0deg",
      dx: "0%",
      dy: "-4%",
    },
  },
]

export function EventStack({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative", className)}>
      {/* A 16:10 board, centred, so the pile keeps its proportions however
          tall the card grows. Sizes inside are in board widths (cqw). */}
      <div className="@container absolute inset-x-0 top-1/2 aspect-[16/10] -translate-y-1/2">
        {events.map((event) => (
          <div
            key={event.title}
            style={
              {
                left: event.pile.left,
                top: event.pile.top,
                "--r": event.pile.r,
                "--hr": event.pile.hr,
                "--dx": event.pile.dx,
                "--dy": event.pile.dy,
              } as CSSProperties
            }
            className="absolute w-[24%] rotate-(--r) rounded-[3px] bg-white p-[0.9cqw] pb-0 text-neutral-12 shadow-[0_10px_24px_rgba(16,19,20,0.16),0_1px_2px_rgba(16,19,20,0.14)] transition-[translate,rotate] duration-300 ease-out group-hover:translate-x-(--dx) group-hover:translate-y-(--dy) group-hover:rotate-(--hr) motion-reduce:transition-none dark:bg-neutral-12 dark:text-neutral-1"
          >
            <Poster name={event.poster} className="rounded-[1px]" />
            <div className="px-[0.2cqw] pt-[1.3cqw] pb-[2.2cqw] leading-tight">
              <p className="truncate text-[clamp(7px,1.75cqw,11px)] font-semibold tracking-[-0.01em]">
                {event.title}
              </p>
              <p className="mt-px truncate text-[clamp(6px,1.45cqw,9.5px)] opacity-60">
                {event.meta}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
