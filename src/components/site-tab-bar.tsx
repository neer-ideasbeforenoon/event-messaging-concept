"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, CircleUser, Compass, MessageSquare } from "lucide-react"

// This repo designs Messages only. The other sections are shown so the bar
// reads as the real app, but they are not links and go nowhere.
const sectionsBefore = [
  { label: "Discover", icon: Compass },
  { label: "My events", icon: Calendar },
]
const sectionsAfter = [{ label: "Profile", icon: CircleUser }]

function InertTab({
  label,
  icon: Icon,
}: {
  label: string
  icon: typeof Compass
}) {
  return (
    <a
      role="link"
      aria-disabled="true"
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground"
    >
      <Icon aria-hidden="true" className="size-4" />
      <span className="sr-only">{label}</span>
    </a>
  )
}

export function SiteTabBar() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-auto flex max-w-full items-center rounded-full border border-white/50 bg-white/25 p-1 shadow-[0_8px_30px_rgba(16,19,20,0.10)] backdrop-blur-xl dark:border-white/15 dark:bg-white/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
    >
      {sectionsBefore.map((section) => (
        <InertTab key={section.label} {...section} />
      ))}
      {/* Always the selected section. From a thread it returns to the inbox. */}
      <Link
        href="/"
        aria-current={pathname === "/" ? "page" : undefined}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-white/55 pr-3 pl-2.5 text-nav font-semibold whitespace-nowrap text-mark backdrop-blur-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-white/15"
      >
        <MessageSquare aria-hidden="true" className="size-4" />
        Messages
      </Link>
      {sectionsAfter.map((section) => (
        <InertTab key={section.label} {...section} />
      ))}
    </nav>
  )
}
