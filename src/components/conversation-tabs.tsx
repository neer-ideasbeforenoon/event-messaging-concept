"use client"

import { useState, type ComponentProps } from "react"
import { Tabs } from "@/components/ui/tabs"
import { DEFAULT_TAB, toTab, type Tab } from "@/lib/conversations"

// The open tab lives in ?tab= so Back from a thread returns to its tab, and a
// refresh or shared link keeps it. Events is the default and keeps a bare URL.
// The page reads ?tab= on the server, so the right list is in the first HTML
// and there is a single Tabs from the start, never a placeholder swapped out
// after load.
export function ConversationTabs({
  initialTab,
  ...props
}: Omit<
  ComponentProps<typeof Tabs>,
  "value" | "defaultValue" | "onValueChange"
> & { initialTab: Tab }) {
  // Local state switches the list on click. The URL is written alongside it,
  // so the list never waits on the router to catch up.
  const [tab, setTab] = useState(initialTab)

  function select(value: string) {
    const next = toTab(value)
    setTab(next)
    const url = new URL(window.location.href)
    if (next === DEFAULT_TAB) url.searchParams.delete("tab")
    else url.searchParams.set("tab", next)
    // Next syncs its router with a native replaceState, so Back from a thread
    // lands on this tab.
    window.history.replaceState(null, "", url)
  }

  return <Tabs {...props} value={tab} onValueChange={select} />
}
