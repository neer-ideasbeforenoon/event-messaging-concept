"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronDown, PanelRight, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Both cards of an open thread share the same frosted surface over the sky.
const card =
  "bg-card/85 backdrop-blur-xl sm:rounded-3xl sm:border sm:border-border sm:shadow-[0_24px_60px_-12px_rgba(16,19,20,0.18)] dark:sm:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)]"

// An open thread is two frosted cards over the sky: the chat on the left and
// the details panel on the right. From lg the panel sits beside the chat at a
// fixed width, and from xl the two split 70/30. Below lg the panel slides
// over the chat from a button in the header.
export function ThreadLayout({
  backHref,
  backLabel = "Back to Messages",
  heading,
  detailsLabel,
  details,
  children,
}: {
  backHref: string
  backLabel?: string
  heading: ReactNode
  detailsLabel: string
  details: ReactNode
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [more, setMore] = useState(false)
  const asideRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // The panel hides its scrollbar, so it says when there is more below: a
  // fade over the bottom edge and a pill that scrolls on. Both go once the
  // end is in view. Content changes height when a tab switches, so a resize
  // of the content re-checks too.
  useEffect(() => {
    const aside = asideRef.current
    const content = contentRef.current
    if (!aside || !content) return
    const check = () =>
      setMore(aside.scrollHeight - aside.scrollTop - aside.clientHeight > 8)
    check()
    aside.addEventListener("scroll", check, { passive: true })
    const observer = new ResizeObserver(check)
    observer.observe(aside)
    observer.observe(content)
    return () => {
      aside.removeEventListener("scroll", check)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [open])

  return (
    <div className="relative mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 gap-5 overflow-hidden sm:rounded-3xl lg:overflow-visible">
      <section
        aria-label="Conversation"
        className={cn("flex min-w-0 flex-1 flex-col xl:flex-7", card)}
      >
        <header className="flex min-h-16 shrink-0 items-center gap-2 border-b border-border px-3 pt-[max(0.625rem,env(safe-area-inset-top))] pb-2.5 sm:gap-3 sm:px-5 sm:py-3">
          <Button asChild variant="ghost" size="icon" className="-ml-1 rounded-full text-muted-foreground hover:text-foreground">
            <Link
              href={backHref}
              transitionTypes={["nav-back"]}
              aria-label={backLabel}
            >
              <ArrowLeft aria-hidden="true" className="size-5" />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">{heading}</div>
          <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={detailsLabel}
            aria-controls="thread-details"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="rounded-full lg:hidden"
          >
            <PanelRight aria-hidden="true" className="size-5" />
          </Button>
          <ThemeToggle />
          </div>
        </header>
        {children}
      </section>

      {/* Scrim behind the sliding panel. Escape and the close button also
          dismiss it, so the click target needs no keyboard role. */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={cn(
          "absolute inset-0 z-10 bg-neutral-12/25 transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        ref={asideRef}
        id="thread-details"
        aria-label={detailsLabel}
        className={cn(
          "absolute inset-y-0 right-0 z-20 w-full max-w-sm scrollbar-none overflow-y-auto overscroll-contain border-l border-border bg-card transition-[translate,visibility] duration-300 ease-out motion-reduce:transition-none",
          "lg:visible lg:static lg:z-auto lg:w-[340px] lg:max-w-none lg:shrink-0 lg:translate-x-0 xl:w-auto xl:flex-3",
          "lg:rounded-3xl lg:border lg:border-border lg:bg-card/85 lg:shadow-[0_24px_60px_-12px_rgba(16,19,20,0.18)] lg:backdrop-blur-xl dark:lg:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)]",
          open ? "visible translate-x-0" : "invisible translate-x-full"
        )}
      >
        {/* Not sticky: an event panel pins its own tab bar to the top. */}
        <div className="flex justify-end p-2 lg:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="Close details"
            onClick={() => setOpen(false)}
            className="rounded-full"
          >
            <X aria-hidden="true" className="size-5" />
          </Button>
        </div>
        <div ref={contentRef}>{details}</div>

        {/* Pinned to the bottom of the panel while there is more to read.
            The negative margin keeps it from adding space at the end. */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none sticky bottom-0 -mt-24 flex h-24 items-end justify-center bg-linear-to-b from-transparent via-card/70 to-card pb-4 transition-opacity duration-300 motion-reduce:transition-none",
            more ? "opacity-100" : "opacity-0"
          )}
        >
          <button
            type="button"
            tabIndex={-1}
            onClick={() =>
              asideRef.current?.scrollBy({
                top: asideRef.current.clientHeight * 0.7,
                behavior: "smooth",
              })
            }
            className={cn(
              "inline-flex items-center gap-1 rounded-full border border-border bg-card py-1.5 pr-2.5 pl-3 text-caption font-medium text-muted-foreground shadow-[0_4px_12px_-2px_rgb(16_19_20/0.18)] transition-colors hover:text-foreground dark:shadow-[0_4px_12px_-2px_rgb(0_0_0/0.5)]",
              more && "pointer-events-auto"
            )}
          >
            More below
            <ChevronDown aria-hidden="true" className="size-3.5 animate-bounce [animation-iteration-count:2] motion-reduce:animate-none" />
          </button>
        </div>
      </aside>
    </div>
  )
}
