import { ViewTransition, type ReactNode } from "react"

// Opening a thread slides forward, Back slides back (see the nav-* rules in
// globals.css). A navigation with no direction, like the browser's own back
// button, crossfades. Wrap each page, not a layout: layouts persist across
// navigations, so they never enter or leave.
const motion = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "page-fade",
}

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={motion} exit={motion} default="none">
      {children}
    </ViewTransition>
  )
}
