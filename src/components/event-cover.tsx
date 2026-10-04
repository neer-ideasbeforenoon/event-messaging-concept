import type { CSSProperties, ReactNode } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Key art for an event, the way an organizer's listing would carry it: the
// host and year along the top, the name set big, the dates and city along
// the bottom, over art in the event's own style. Everything is sized in
// container widths (cqw), so the same cover reads as a hero in the details
// panel and as a thumbnail in a list.

type Cover = {
  ground: string
  ink: string
  top: [string, string]
  lines: string[]
  bottom: [string, string]
  art: ReactNode
}

// Organizer-supplied key art, shown as is. The type is part of the image.
const photos: Record<string, string> = {
  "Global Reach Summit": "/global-reach-summit.jpg",
}

const covers: Record<string, Cover> = {
  "Design Futures Forum": {
    ground: "#F1E4C8",
    ink: "#17181C",
    top: ["Design Futures", "Ed. 07"],
    lines: ["Design", "Futures", "Forum"],
    bottom: ["06 Dec 2026", "Glasgow"],
    art: <BauhausArt />,
  },
  "DesignOps Meetup Berlin": {
    ground: "#121316",
    ink: "#F4F5F0",
    top: ["DesignOps Berlin", "No. 31"],
    lines: ["DesignOps", "Meetup", "Berlin"],
    bottom: ["22 Jan 2027", "Kreuzberg"],
    art: <GridArt />,
  },
  "Product Leaders Summit 2026": {
    ground: "linear-gradient(170deg, #FFE2B8 0%, #F7A774 48%, #E0664F 100%)",
    ink: "#2B1308",
    top: ["Product Leaders Collective", "2026"],
    lines: ["Product", "Leaders", "Summit"],
    bottom: ["12 Nov 2026", "Amsterdam"],
    art: <SunriseArt />,
  },
}

// Fine film grain, so the flat fills read as printed rather than vector.
const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export function EventCover({
  title,
  className,
}: {
  title: string
  className?: string
}) {
  const photo = photos[title]
  if (photo) {
    return (
      <div
        aria-hidden="true"
        className={cn("relative aspect-video overflow-hidden select-none", className)}
      >
        {/* The thumbnail is square, so it crops to the people at the table. */}
        <Image
          src={photo}
          alt=""
          fill
          sizes="(min-width: 1024px) 420px, 100vw"
          className="object-cover object-[72%_50%]"
        />
      </div>
    )
  }

  const cover = covers[title]
  if (!cover) return null

  return (
    <div
      aria-hidden="true"
      style={{ background: cover.ground, color: cover.ink } as CSSProperties}
      className={cn(
        "@container relative isolate aspect-[4/3] overflow-hidden select-none",
        className
      )}
    >
      <div className="absolute inset-0 -z-10">{cover.art}</div>

      <div className="flex h-full flex-col p-[6.5cqw]">
        <div className="flex items-center justify-between gap-[3cqw] @max-[160px]:hidden text-[3.1cqw] leading-none font-semibold tracking-[0.16em] uppercase opacity-85">
          <span className="truncate">{cover.top[0]}</span>
          <span className="shrink-0">{cover.top[1]}</span>
        </div>

        <p className="mt-[6cqw] @max-[160px]:mt-0 text-[12.5cqw] leading-[0.86] font-bold tracking-[-0.055em]">
          {cover.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        <div className="mt-auto flex @max-[160px]:hidden items-end justify-between gap-[3cqw] border-t border-current/25 pt-[3.2cqw] text-[3.6cqw] leading-none font-semibold tracking-[-0.01em]">
          <span>{cover.bottom[0]}</span>
          <span className="opacity-80">{cover.bottom[1]}</span>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{ backgroundImage: grain, backgroundSize: "160px 160px" }}
      />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgb(0_0_0/0.18),inset_0_1px_0_rgb(255_255_255/0.12)]" />
    </div>
  )
}

// A print-shop composition: a big disc, a slab and a wedge, overprinted.
function BauhausArt() {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className="size-full"
    >
      <circle cx="318" cy="110" r="92" fill="#E4572E" />
      <rect
        x="250"
        y="150"
        width="132"
        height="132"
        fill="#1F3E8C"
        style={{ mixBlendMode: "multiply" }}
      />
      <path d="M186 300 248 192 310 300z" fill="#F2B134" />
      <circle cx="372" cy="34" r="10" fill="#17181C" />
      <path d="M232 52h46" stroke="#17181C" strokeWidth="6" />
    </svg>
  )
}

// A dot grid with one lit tile, like a component library at night.
function GridArt() {
  const dots = []
  for (let x = 14; x < 400; x += 22) {
    for (let y = 14; y < 300; y += 22) {
      dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" />)
    }
  }
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className="size-full"
    >
      <g fill="#FFFFFF" fillOpacity="0.16">
        {dots}
      </g>
      <rect x="292" y="150" width="80" height="80" rx="10" fill="#C8F45A" />
      <rect
        x="210"
        y="172"
        width="66"
        height="66"
        rx="10"
        fill="none"
        stroke="#C8F45A"
        strokeOpacity="0.7"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      <rect x="316" y="92" width="44" height="44" rx="8" fill="#FFFFFF" fillOpacity="0.1" />
    </svg>
  )
}

// A low sun behind the bands of a sunrise.
function SunriseArt() {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className="size-full"
    >
      <circle cx="320" cy="200" r="88" fill="#FFF1D6" fillOpacity="0.85" />
      {[204, 222, 240, 258, 276].map((y, i) => (
        <rect
          key={y}
          x="200"
          y={y}
          width="220"
          height={6 + i * 2}
          fill="#E0664F"
          fillOpacity={0.55 + i * 0.1}
        />
      ))}
    </svg>
  )
}
