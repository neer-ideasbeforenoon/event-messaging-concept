"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, CircleUser, Compass, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

// This repo designs Messages and the customer's booked events. Discover and
// Profile are shown so the bar reads as the real app, but they are not links
// and go nowhere.
const sections = [
  { id: "discover", label: "Discover", icon: Compass },
  { id: "my-events", label: "My events", icon: Calendar, href: "/my-events" },
  { id: "messages", label: "Messages", icon: MessageSquare, href: "/" },
  { id: "profile", label: "Profile", icon: CircleUser },
]

// Switching sections is animated by the page's view transition, not by CSS
// transitions, so the bar moves on the same clock as the page. The pill has
// one name, so it slides from the old section to the new one. Each icon has
// its own name, so it glides to its new place. Each label has its own name,
// so the old one fades out where it was and the new one fades in where it
// lands. Timing is in globals.css (.tab-*).
function vt(name: string, className: string) {
  return { viewTransitionName: name, viewTransitionClass: className }
}

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
      {sections.map(({ id, label, icon: Icon, href }, index) => {
        const icon = (
          <Icon
            aria-hidden="true"
            className="relative size-4 shrink-0"
            style={vt(`tab-icon-${id}`, "tab-move")}
          />
        )

        if (!href) {
          return (
            <a key={id} role="link" aria-disabled="true" className={iconTab}>
              {icon}
              <span className="sr-only">{label}</span>
            </a>
          )
        }

        // The open section carries its name in a pill. The others stay icons.
        const open = index === current

        return (
          <Link
            key={id}
            href={href}
            aria-current={open ? "page" : undefined}
            // Both sections read the URL on the server, so they are dynamic
            // and Next would only prefetch the layout. Prefetch the whole
            // page, so the slide starts on the click instead of after a
            // server render.
            prefetch
            // Like the conversation tabs, the page slides in from the side
            // of the section you picked. nav-section keeps the header still
            // while it does (see globals.css).
            transitionTypes={
              current === -1 || open
                ? undefined
                : [index > current ? "nav-forward" : "nav-back", "nav-section"]
            }
            className={cn(
              "relative inline-flex h-8 shrink-0 items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              open
                ? "gap-1.5 pr-3 pl-2.5 text-nav font-semibold whitespace-nowrap text-mark"
                : "w-8 justify-center text-muted-foreground transition-colors hover:bg-white/40 hover:text-foreground dark:hover:bg-white/10"
            )}
          >
            {open && (
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-white/55 backdrop-blur-md dark:bg-white/15"
                style={vt("tab-pill", "tab-move")}
              />
            )}
            {icon}
            {open ? (
              <span
                className="relative"
                style={vt(`tab-label-${id}`, "tab-label")}
              >
                {label}
              </span>
            ) : (
              <span className="sr-only">{label}</span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
