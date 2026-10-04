"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Tabs as TabsPrimitive } from "radix-ui"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list relative inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-8 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-nav whitespace-nowrap text-foreground/60 transition-all duration-200 ease-out group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent",
        "data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground",
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        className
      )}
      {...props}
    >
      {/* Above a TabsIndicator, which sits above the trigger's own surface. */}
      <span className="relative z-[1] inline-flex items-center gap-[inherit]">
        {children}
      </span>
    </TabsPrimitive.Trigger>
  )
}

// A surface that slides to the open trigger. Render it first inside
// TabsList and style it as the open trigger's surface. It measures before
// paint and on every resize, and marks the list ready so the open trigger
// hands its surface over (see globals.css). It also tells the Tabs which way
// the last switch went, so the new panel slides in from that side.
function TabsIndicator({ className, ...props }: React.ComponentProps<"span">) {
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useLayoutEffect(() => {
    const indicator = ref.current
    const list = indicator?.parentElement
    if (!indicator || !list) return
    const root = list.closest<HTMLElement>('[data-slot="tabs"]')
    const triggers = () =>
      Array.from(
        list.querySelectorAll<HTMLElement>(':scope > [data-slot="tabs-trigger"]')
      )
    let last = -1

    const place = () => {
      const all = triggers()
      const index = all.findIndex((t) => t.dataset.state === "active")
      const active = all[index]
      if (!active) return
      if (root && last !== -1 && index !== last)
        root.dataset.direction = index > last ? "forward" : "back"
      last = index
      indicator.style.width = `${active.offsetWidth}px`
      indicator.style.height = `${active.offsetHeight}px`
      indicator.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`
    }

    // The first placement jumps; only later moves slide.
    indicator.style.transition = "none"
    place()
    void indicator.offsetWidth
    indicator.style.transition = ""
    list.dataset.indicator = "ready"

    const switched = new MutationObserver(place)
    switched.observe(list, { subtree: true, attributeFilter: ["data-state"] })
    const resized = new ResizeObserver(place)
    resized.observe(list)
    triggers().forEach((t) => resized.observe(t))
    return () => {
      switched.disconnect()
      resized.disconnect()
      delete list.dataset.indicator
    }
  }, [])

  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-slot="tabs-indicator"
      className={cn(
        "pointer-events-none absolute top-0 left-0 z-[1] opacity-0 transition-[transform,width,height] duration-300 ease-fluid group-data-[indicator=ready]/tabs-list:opacity-100 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 outline-none",
        // Only after a switch, never on first load.
        "group-data-[direction]/tabs:animate-in group-data-[direction]/tabs:fade-in group-data-[direction]/tabs:duration-300 group-data-[direction]/tabs:ease-out group-data-[direction=back]/tabs:slide-in-from-left-2 group-data-[direction=forward]/tabs:slide-in-from-right-2 motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsIndicator,
  TabsContent,
  tabsListVariants,
}
