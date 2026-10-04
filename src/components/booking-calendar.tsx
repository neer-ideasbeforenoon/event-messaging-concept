import type { CSSProperties } from "react"
import { Poster, type PosterName } from "@/components/event-posters"
import { cn } from "@/lib/utils"

// A paper month planner for the "My booked event" entry. Booked days carry a
// chip, and two of them have an instant photo pinned over the cell, the same
// posters the "Before you book" pile uses. Decorative only.
//
// The sheet is cropped and fades out under week four, so it reads as a page
// rather than a working calendar. Sizes are in stack widths (cqw), so it
// scales with the card. On hover of the parent link the photos lift and the
// sheet straightens.

// December 2026 starts on a Tuesday. Weeks run Monday to Sunday.
const MONTH = "December"
const YEAR = "2026"
const LEAD = ["30"]
const DAYS = 31
const TRAIL = ["01", "02", "03"]

const bookings: Record<number, { label: string; time: string }> = {
  6: { label: "Forum", time: "9:30" },
  10: { label: "Supper", time: "7:30" },
  12: { label: "Lights", time: "6:00" },
  17: { label: "Carols", time: "8:00" },
  19: { label: "Run", time: "8:00" },
  23: { label: "Ballet", time: "7:00" },
}

const pins: Record<
  number,
  { poster: PosterName; left: string; top: string; r: string; hr: string }
> = {
  // Design Futures Forum, the booking in the sample threads.
  6: { poster: "shapes", left: "-4%", top: "62%", r: "8deg", hr: "13deg" },
  17: { poster: "candles", left: "40%", top: "58%", r: "-7deg", hr: "-12deg" },
}

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

export function BookingCalendar({ className }: { className?: string }) {
  const cells = [
    ...LEAD.map((day) => ({ day, outside: true, date: 0 })),
    ...Array.from({ length: DAYS }, (_, i) => ({
      day: String(i + 1),
      outside: false,
      date: i + 1,
    })),
    ...TRAIL.map((day) => ({ day, outside: true, date: 0 })),
  ]

  return (
    <div
      aria-hidden="true"
      className={cn("@container relative overflow-hidden", className)}
      style={{
        maskImage: "linear-gradient(to bottom, #000 80%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, #000 80%, transparent)",
      }}
    >
      <div className="absolute inset-x-[4%] top-[4cqw] -rotate-[1.5deg] rounded-[2.5cqw] bg-white p-[4cqw] text-neutral-12 shadow-[0_10px_24px_rgba(16,19,20,0.16),0_1px_2px_rgba(16,19,20,0.14)] transition-[rotate] duration-300 ease-out group-hover:rotate-0 motion-reduce:transition-none dark:bg-neutral-12 dark:text-neutral-1">
        <div className="flex items-baseline justify-between text-[7.5cqw] leading-none font-bold tracking-[-0.05em] uppercase">
          <span>{MONTH}</span>
          <span>{YEAR}</span>
        </div>

        <div className="mt-[4cqw] grid grid-cols-7 text-center text-[2.6cqw] font-semibold uppercase opacity-70">
          {WEEKDAYS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="mt-[1.5cqw] grid grid-cols-7 border-t border-l border-current/15">
          {cells.map((cell, i) => {
            const booking = bookings[cell.date]
            const pin = pins[cell.date]
            return (
              <div
                key={i}
                className="relative h-[11cqw] border-r border-b border-current/15 p-[0.9cqw]"
              >
                <span
                  className={cn(
                    "block text-[3cqw] leading-none font-bold tabular-nums",
                    cell.outside && "opacity-30"
                  )}
                >
                  {cell.day}
                </span>
                {booking && (
                  <span className="mt-[0.9cqw] block truncate rounded-[0.6cqw] bg-brand-9 px-[0.7cqw] py-[0.35cqw] text-[clamp(5px,1.75cqw,9px)] leading-tight font-semibold text-white uppercase">
                    {booking.label}
                    <span className="block font-medium opacity-75">
                      {booking.time}
                    </span>
                  </span>
                )}
                {pin && (
                  <div
                    style={
                      {
                        left: pin.left,
                        top: pin.top,
                        "--r": pin.r,
                        "--hr": pin.hr,
                      } as CSSProperties
                    }
                    className="absolute z-10 w-[16cqw] rotate-(--r) rounded-[2px] bg-white p-[0.8cqw] pb-[2.6cqw] shadow-[0_8px_18px_rgba(16,19,20,0.22),0_1px_2px_rgba(16,19,20,0.16)] transition-[translate,rotate] duration-300 ease-out group-hover:-translate-y-[1.5cqw] group-hover:rotate-(--hr) motion-reduce:transition-none dark:bg-neutral-12"
                  >
                    <Poster name={pin.poster} className="rounded-[1px]" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
