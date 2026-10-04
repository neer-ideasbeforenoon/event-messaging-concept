import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

// Stand-in poster art for the sample events. The same event shows the same
// poster wherever it appears, so the pile and the calendar read as one set.
// Each draws on a 100×100 board over its ground colour.

const posters = {
  globe: {
    ground: "radial-gradient(120% 90% at 50% 20%,#25587A,#0E2A3D)",
    art: <GlobeArt />,
  },
  shapes: { ground: "#F3E3C3", art: <ShapesArt /> },
  blocks: { ground: "#1C1D22", art: <BlockArt /> },
  sunrise: {
    ground: "linear-gradient(180deg,#FFD9A8,#E8735F)",
    art: <SunriseArt />,
  },
  moon: { ground: "linear-gradient(180deg,#0B2E3A,#145266)", art: <MoonArt /> },
  tiles: { ground: "#F4EDE0", art: <TilesArt /> },
  run: { ground: "#2A1E5C", art: <RunArt /> },
  candles: {
    ground: "radial-gradient(90% 80% at 50% 70%,#5A2A1A,#1A0E0A)",
    art: <CandleArt />,
  },
} satisfies Record<string, { ground: string; art: ReactNode }>

export type PosterName = keyof typeof posters

export function Poster({
  name,
  className,
}: {
  name: PosterName
  className?: string
}) {
  return (
    <div
      className={cn("aspect-square overflow-hidden", className)}
      style={{ background: posters[name].ground }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="block size-full"
      >
        {posters[name].art}
      </svg>
    </div>
  )
}

function GlobeArt() {
  return (
    <g fill="none" stroke="#A8C6DD" strokeWidth="1.2">
      <circle cx="50" cy="54" r="30" fill="#163A52" />
      <ellipse cx="50" cy="54" rx="11" ry="30" />
      <ellipse cx="50" cy="54" rx="22" ry="30" />
      <path d="M20 54h60M24 39h52M24 69h52" />
      <circle cx="68" cy="34" r="3" fill="#F2C14E" stroke="none" />
      <circle cx="32" cy="70" r="2" fill="#F2C14E" stroke="none" />
      <path d="M68 34Q50 20 32 70" stroke="#F2C14E" strokeDasharray="2 2" />
    </g>
  )
}

function ShapesArt() {
  return (
    <g>
      <circle cx="38" cy="42" r="22" fill="#E4572E" />
      <rect x="46" y="44" width="34" height="34" fill="#163A52" />
      <path d="M20 82 34 58 48 82z" fill="#F2B134" />
      <circle cx="80" cy="22" r="5" fill="#163A52" />
    </g>
  )
}

function BlockArt() {
  const dots = []
  for (let x = 8; x < 100; x += 12) {
    for (let y = 8; y < 100; y += 12) {
      dots.push(
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="0.9"
          fill="#ffffff"
          opacity="0.25"
        />,
      )
    }
  }
  return (
    <g>
      {dots}
      <rect x="20" y="18" width="40" height="58" fill="#E63946" />
      <circle
        cx="64"
        cy="64"
        r="20"
        fill="none"
        stroke="#F1FAEE"
        strokeWidth="3"
      />
      <rect x="60" y="20" width="16" height="16" fill="#F1FAEE" />
    </g>
  )
}

function SunriseArt() {
  return (
    <g>
      <circle cx="50" cy="64" r="24" fill="#FFF3E0" />
      <rect x="0" y="64" width="100" height="36" fill="#7A3B5E" />
      <path
        d="M0 72h100M0 80h100M0 88h100"
        stroke="#E8735F"
        strokeWidth="1.5"
        opacity="0.7"
      />
    </g>
  )
}

function MoonArt() {
  return (
    <g>
      <circle cx="62" cy="34" r="16" fill="#F6E7B4" />
      <circle cx="69" cy="29" r="14" fill="#0E3846" />
      <g fill="none" stroke="#5FB3B3" strokeWidth="2" strokeLinecap="round">
        <path d="M0 66q12-8 25 0t25 0 25 0 25 0" />
        <path d="M0 78q12-8 25 0t25 0 25 0 25 0" opacity="0.7" />
        <path d="M0 90q12-8 25 0t25 0 25 0 25 0" opacity="0.4" />
      </g>
      <circle cx="22" cy="24" r="1.2" fill="#F6E7B4" />
      <circle cx="36" cy="14" r="0.9" fill="#F6E7B4" />
    </g>
  )
}

function TilesArt() {
  const tiles = []
  for (let x = 0; x < 100; x += 25) {
    for (let y = 0; y < 100; y += 25) {
      tiles.push(
        <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
          <rect
            width="25"
            height="25"
            fill="none"
            stroke="#1D5FA8"
            strokeWidth="0.8"
          />
          <path
            d="M12.5 3 22 12.5 12.5 22 3 12.5z"
            fill="none"
            stroke="#1D5FA8"
            strokeWidth="1.2"
          />
          <circle cx="12.5" cy="12.5" r="2.4" fill="#1D5FA8" />
        </g>,
      )
    }
  }
  return (
    <g>
      {tiles}
      <circle cx="50" cy="50" r="20" fill="#D9480F" />
      <circle
        cx="50"
        cy="50"
        r="12"
        fill="none"
        stroke="#F4EDE0"
        strokeWidth="2"
      />
    </g>
  )
}

function RunArt() {
  return (
    <g>
      <g stroke="#B6F35C" strokeWidth="5" strokeLinecap="round">
        <path d="M-10 90 60 20" opacity="0.25" />
        <path d="M10 100 80 30" opacity="0.5" />
        <path d="M30 110 110 30" />
      </g>
      <text
        x="10"
        y="34"
        fill="#FFFFFF"
        fontSize="22"
        fontWeight="700"
        letterSpacing="-1"
      >
        10K
      </text>
    </g>
  )
}

function CandleArt() {
  return (
    <g>
      <circle cx="50" cy="38" r="26" fill="#F2B134" opacity="0.18" />
      {[30, 50, 70].map((x, i) => (
        <g key={x}>
          <rect x={x - 5} y={48 + i * 4 - (i === 1 ? 10 : 0)} width="10" height="60" fill="#F6E7B4" />
          <path
            d={`M${x} ${36 + i * 4 - (i === 1 ? 10 : 0)}q5 7 0 11q-5-4 0-11z`}
            fill="#F2B134"
          />
        </g>
      ))}
    </g>
  )
}
