"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, CircleUser, Compass, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

// This repo designs Messages and the customer's booked events. Discover and
// Profile are shown so the bar reads as the real app, but they are not links
// and go nowhere.
const sections = [
  { label: "Discover", icon: Compass },
  { label: "My events", icon: Calendar, href: "/my-events" },
  { label: "Messages", icon: MessageSquare, href: "/" },
  { label: "Profile", icon: CircleUser },
]

const iconTab =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground"

export function SiteTabBar() {
  const pathname = usePathname()
  const current = sections.findIndex((s) => s.href === pathname)

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-auto flex max-w-full items-center rounded-full border border-white/50 bg-white/25 p-1 shadow-[0_8px_30px_rgba(16,19,20,0.10)] backdrop-blur-xl dark:border-white/15 dark:bg-white/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
    >
      {sections.map(({ label, icon: Icon, href }, index) => {
        if (!href) {
          return (
            <a key={label} role="link" aria-disabled="true" className={iconTab}>
              <Icon aria-hidden="true" className="size-4" />
              <span className="sr-only">{label}</span>
            </a>
          )
        }

        // The open section carries its name in a pill. The others stay
        // icons. Switching folds one name away as the next opens, in step
        // with the page slide, so the pill flows across instead of jumping.
        const open = index === current

        return (
          <Link
            key={label}
            href={href}
            aria-current={open ? "page" : undefined}
            // Like the conversation tabs, the page slides in from the side
            // of the section you picked. nav-section keeps the header still
            // while it does (see globals.css).
            transitionTypes={
              current === -1 || open
                ? undefined
                : [index > current ? "nav-forward" : "nav-back", "nav-section"]
            }
            className={cn(
              "inline-flex h-8 shrink-0 items-center rounded-full px-2 text-nav font-semibold whitespace-nowrap outline-none transition-[background-color,color,padding] duration-400 ease-fluid focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none",
              open
                ? "bg-white/55 pr-3 pl-2.5 text-mark backdrop-blur-md dark:bg-white/15"
                : "text-muted-foreground hover:bg-white/40 hover:text-foreground dark:hover:bg-white/10"
            )}
          >
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            <span
              className={cn(
                "grid transition-[grid-template-columns,opacity] duration-400 ease-fluid motion-reduce:transition-none",
                open ? "grid-cols-[1fr]" : "grid-cols-[0fr] opacity-0"
              )}
            >
              <span className="min-w-0 overflow-hidden pl-1.5">{label}</span>
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
