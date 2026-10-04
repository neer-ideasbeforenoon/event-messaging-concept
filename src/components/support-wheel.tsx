import {
  CircleAlert,
  Clock,
  CreditCard,
  FileText,
  KeyRound,
  Mail,
  MapPin,
  RotateCcw,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

// A wheel of things the platform team helps with, for the "Customer support"
// entry. The topic in the middle is crisp and on top. The ones above and below
// shrink, fade, and blur as they move away. Decorative only.
//
// It holds still, like the other two entries. On hover of the parent link the
// rows spread and the middle one lifts, with the same quick ease the pile and
// the planner use. Sizes are in wheel widths (cqw).

const topics: { label: string; icon: LucideIcon; tint: string }[] = [
  { label: "Invoice still queued", icon: Clock, tint: "#BF883B" },
  { label: "Card declined at checkout", icon: CreditCard, tint: "#6B3FA0" },
  { label: "Refund a cancelled event", icon: RotateCcw, tint: "#2E7D32" },
  { label: "Company VAT invoice", icon: FileText, tint: "#49778A" },
  { label: "Double charge on an order", icon: CircleAlert, tint: "#D32F2F" },
  { label: "Change my account email", icon: Mail, tint: "#163A52" },
  { label: "Can’t sign in", icon: KeyRound, tint: "#5A6163" },
  { label: "Update billing address", icon: MapPin, tint: "#2F7D8C" },
]

// The topic in the middle: the queued invoice from the sample support ticket.
const ACTIVE = 0
// How far each step away recedes. The row spacing is --step on the wheel, so
// hover can widen it in CSS.
const SHRINK = 0.09

export function SupportWheel({ className }: { className?: string }) {
  const count = topics.length
  return (
    <div
      aria-hidden="true"
      className={cn(
        "@container relative overflow-hidden [--lift:1] [--step:13.5cqw] group-hover:[--lift:1.05] group-hover:[--step:15.5cqw] motion-reduce:group-hover:[--lift:1] motion-reduce:group-hover:[--step:13.5cqw]",
        className
      )}
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)",
      }}
    >
      {topics.map((topic, i) => {
        // Signed distance from the middle, wrapped round the wheel. Rows
        // three or more away are hidden.
        const offset = ((i - ACTIVE + count + count / 2) % count) - count / 2
        const away = Math.abs(offset)
        const centre = offset === 0
        return (
          <div
            key={topic.label}
            style={{
              transform: `translate(-50%, calc(-50% + ${offset} * var(--step))) scale(calc(${1 - away * SHRINK} * ${centre ? "var(--lift)" : 1}))`,
              opacity: away >= 3 ? 0 : 1 - away * 0.2,
              filter: `blur(${away < 2 ? away * 0.4 : away * 0.9}px)`,
              zIndex: 10 - away,
            }}
            className={cn(
              "absolute top-1/2 left-1/2 flex w-[86%] items-center gap-[3.5cqw] rounded-[4cqw] bg-white px-[3.5cqw] text-neutral-12 transition-[transform,height] duration-300 ease-out motion-reduce:transition-none dark:bg-neutral-12 dark:text-neutral-1",
              centre
                ? "h-[17cqw] shadow-[0_12px_28px_rgba(16,19,20,0.22),0_1px_2px_rgba(16,19,20,0.14)]"
                : "h-[15cqw] shadow-[0_4px_12px_rgba(16,19,20,0.12)]"
            )}
          >
            <span
              className="grid size-[9cqw] shrink-0 place-items-center rounded-[2.4cqw] text-white"
              style={{ background: topic.tint }}
            >
              <topic.icon strokeWidth={2} className="size-[5cqw]" />
            </span>
            <span className="truncate text-[clamp(10px,4.8cqw,17px)] leading-none font-medium tracking-[-0.01em]">
              {topic.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
