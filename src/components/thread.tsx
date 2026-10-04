"use client"

import { Fragment, useEffect, useRef, useState } from "react"
import { FileText, Lock, SendHorizontal, X } from "lucide-react"
import {
  AttachMenu,
  formatSize,
  toAttachments,
} from "@/components/attach-menu"
import { InitialsAvatar } from "@/components/conversation-meta"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Attachment, Message } from "@/lib/conversations"
import { cn } from "@/lib/utils"

// "Yesterday, 21:06" is a day and a clock time. A bare "09:15" is today.
function splitTime(time: string) {
  const comma = time.lastIndexOf(", ")
  return comma === -1
    ? { day: "Today", clock: time }
    : { day: time.slice(0, comma), clock: time.slice(comma + 2) }
}

// ponytail: replies live in component state, so they reset on reload and
// the inbox row does not pick them up. Swap for a server action once there
// is a backend.
export function Thread({
  initialMessages,
  replyTo,
  recipientRole,
  privacyNote,
  emptyNote,
}: {
  initialMessages: Message[]
  replyTo: string
  recipientRole: string
  privacyNote: string
  // Shown in a new thread until the first message is sent.
  emptyNote?: string
}) {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState("")
  // Photos and files picked from the + menu wait in the composer until send.
  const [staged, setStaged] = useState<Attachment[]>([])
  const [attachError, setAttachError] = useState("")
  const [dragging, setDragging] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sent = messages.length > initialMessages.length

  // Open on the latest message. A reply the customer sends glides into view.
  useEffect(() => {
    const el = scrollRef.current
    el?.scrollTo({ top: el.scrollHeight, behavior: sent ? "smooth" : "auto" })
  }, [messages.length, sent])

  function now() {
    return new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  function send() {
    const body = draft.trim()
    if (!body && !staged.length) return
    setMessages((current) => [
      ...current,
      {
        from: "me",
        body,
        time: now(),
        ...(staged.length && { attachments: staged }),
      },
    ])
    setDraft("")
    setStaged([])
    setAttachError("")
  }

  function stage(files: File[]) {
    if (!files.length) return
    const { attachments, error } = toAttachments(files, staged.length)
    setStaged((current) => [...current, ...attachments])
    setAttachError(error)
  }

  function unstage(url: string) {
    URL.revokeObjectURL(url)
    setStaged((current) => current.filter((item) => item.url !== url))
    setAttachError("")
  }

  return (
    <>
      <div
        ref={scrollRef}
        className="scrollbar-none min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        <ol
          role="log"
          aria-label="Messages"
          className="mx-auto flex max-w-3xl flex-col px-4 py-6 sm:px-8 sm:py-8"
        >
          {messages.length === 0 && (
            <li className="py-12 text-center">
              <p className="font-medium">
                Say hello to {replyTo.split(" ")[0]}
              </p>
              {emptyNote && (
                <p className="mt-1 text-body-sm text-muted-foreground">
                  {emptyNote}
                </p>
              )}
            </li>
          )}
          {messages.map((message, index) => {
            const mine = message.from === "me"
            const { day, clock } = splitTime(message.time)
            const newDay =
              index === 0 || splitTime(messages[index - 1].time).day !== day
            // Back-to-back messages from one sender read as one turn.
            const firstOfTurn =
              newDay || messages[index - 1].from !== message.from
            return (
              <Fragment key={index}>
                {newDay && (
                  <li className="sticky top-3 z-10 my-4 flex justify-center first:mt-0">
                    <span className="rounded-full border border-border bg-card/90 px-3 py-1 text-caption font-medium text-muted-foreground shadow-[0_1px_2px_rgba(16,19,20,0.06)] backdrop-blur">
                      {day}
                    </span>
                  </li>
                )}
                <li
                  className={cn(
                    "flex max-w-[85%] gap-2.5 sm:max-w-[75%]",
                    firstOfTurn ? "mt-5" : "mt-1",
                    newDay && "mt-0",
                    mine && "self-end",
                    index >= initialMessages.length &&
                      "animate-in duration-300 fade-in slide-in-from-bottom-2 motion-reduce:animate-none"
                  )}
                >
                  {!mine && (
                    <div className={cn("self-end", !firstOfTurn && "invisible")}>
                      <InitialsAvatar name={replyTo} />
                    </div>
                  )}
                  <div className={cn("flex min-w-0 flex-col gap-1", mine ? "items-end" : "items-start")}>
                    {firstOfTurn && (
                      <p className="px-1 text-caption text-muted-foreground">
                        <span className="font-medium text-foreground/80">
                          {mine ? "You" : replyTo}
                        </span>{" "}
                        <span className="tabular-nums">{clock}</span>
                      </p>
                    )}
                    {message.attachments && (
                      <SharedFiles
                        attachments={message.attachments}
                        mine={mine}
                      />
                    )}
                    {message.body && (
                      <p
                        title={firstOfTurn ? undefined : clock}
                        className={cn(
                          "rounded-2xl px-4 py-2.5 leading-relaxed whitespace-pre-wrap",
                          mine
                            ? "rounded-br-md bg-primary text-primary-foreground"
                            : "rounded-bl-md border border-border bg-background dark:border-transparent dark:bg-hover"
                        )}
                      >
                        {message.body}
                      </p>
                    )}
                  </div>
                </li>
              </Fragment>
            )
          })}
        </ol>
      </div>

      {/* The composer docks to the bottom of the container. It names who
          the reply goes to and who can read it, so a customer never wonders
          whether the platform or other attendees see the thread. */}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          send()
        }}
        className="shrink-0 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-8 sm:pt-4 sm:pb-5"
      >
        <div className="mx-auto max-w-3xl">
        <div
          onDragOver={(event) => {
            if (!event.dataTransfer.types.includes("Files")) return
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node))
              setDragging(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            stage(Array.from(event.dataTransfer.files))
          }}
          className={cn(
            "group relative flex flex-col rounded-2xl border border-border bg-background p-1.5 shadow-[0_1px_2px_rgba(16,19,20,0.04)] transition-shadow focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-hover",
            dragging && "border-ring ring-3 ring-ring/50"
          )}
        >
          {/* The sharp stroke and, under it, a wider blurred copy as a halo. */}
          {["stroke-[3] blur-[2px] [--glow-opacity:0.2]", "stroke-[1.5]"].map((stroke) => (
            <svg
              key={stroke}
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute -inset-px size-[calc(100%+2px)] overflow-visible fill-none text-brand-8 motion-reduce:hidden dark:text-brand-11",
                stroke
              )}
            >
              <rect
                pathLength={100}
                x={1.5}
                y={1.5}
                rx={17.5}
                stroke="currentColor"
                strokeLinecap="round"
                className="h-[calc(100%-3px)] w-[calc(100%-3px)] opacity-0 group-focus-within:animate-composer-glow"
              />
            </svg>
          ))}
          {staged.length > 0 && (
            <ul
              aria-label="Ready to send"
              className="scrollbar-none flex gap-2 overflow-x-auto px-1.5 pt-2.5 pb-2"
            >
              {staged.map((item) => (
                <StagedItem
                  key={item.url}
                  item={item}
                  onRemove={() => unstage(item.url)}
                />
              ))}
            </ul>
          )}
          <div className="flex items-end gap-2">
            <AttachMenu onPick={stage} />
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault()
                  send()
                }
              }}
              aria-label={`Reply to ${replyTo}`}
              placeholder={`Message ${replyTo.split(" ")[0]}…`}
              rows={1}
              autoFocus={initialMessages.length === 0}
              className="max-h-40 min-h-10 resize-none border-0 bg-transparent px-1 py-2 shadow-none focus-visible:ring-0 dark:bg-transparent"
            />
            <Button
              type="submit"
              size="icon-lg"
              disabled={!draft.trim() && !staged.length}
              aria-label={`Send to ${replyTo}`}
              className="shrink-0 rounded-xl"
            >
              <SendHorizontal aria-hidden="true" />
            </Button>
          </div>
        </div>
        {attachError && (
          <p role="alert" className="mt-2 px-1 text-caption text-destructive">
            {attachError}
          </p>
        )}
        <p className="mt-2 flex items-center gap-1.5 px-1 text-caption text-muted-foreground">
          <Lock aria-hidden="true" className="size-3.5 shrink-0" />
          <span className="min-w-0 truncate sm:whitespace-normal">
            To <span className="font-medium text-foreground/80">{replyTo}</span>
            , {recipientRole.toLowerCase()}. {privacyNote}
          </span>
        </p>
        </div>
      </form>
    </>
  )
}

// A picked photo or file, waiting in the composer. Photos show as a square
// thumbnail, files as a small card.
function StagedItem({
  item,
  onRemove,
}: {
  item: Attachment
  onRemove: () => void
}) {
  return (
    <li className="relative shrink-0 animate-in duration-200 fade-in zoom-in-95 motion-reduce:animate-none">
      {item.kind === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element -- object URL
        <img
          src={item.url}
          alt={item.name}
          className="size-14 rounded-xl border border-border object-cover"
        />
      ) : (
        <div className="flex h-14 w-52 items-center gap-2.5 rounded-xl border border-border bg-card p-2 pr-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-well text-mark">
            <FileText aria-hidden="true" className="size-4.5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-body-sm font-medium">
              {item.name}
            </span>
            <span className="block text-caption text-muted-foreground tabular-nums">
              {formatSize(item.size)}
            </span>
          </span>
        </div>
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${item.name}`}
        className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-foreground text-background shadow-sm outline-none hover:bg-foreground/80 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <X aria-hidden="true" className="size-3" />
      </button>
    </li>
  )
}

// Photos sit in a grid of thumbnails. Files are cards the customer can open.
function SharedFiles({
  attachments,
  mine,
}: {
  attachments: Attachment[]
  mine: boolean
}) {
  const images = attachments.filter((item) => item.kind === "image")
  const files = attachments.filter((item) => item.kind === "file")
  return (
    <div className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}>
      {images.length > 0 && (
        <div
          className={cn(
            "grid gap-1",
            images.length > 1 ? "w-72 max-w-full grid-cols-2" : "w-64 max-w-full"
          )}
        >
          {images.map((item, index) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "overflow-hidden rounded-2xl border border-border outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                images.length > 1 && "aspect-square",
                images.length % 2 === 1 && index === images.length - 1 && images.length > 1 && "col-span-2 aspect-[2/1]"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- object URL */}
              <img src={item.url} alt={item.name} className="size-full object-cover" />
            </a>
          ))}
        </div>
      )}
      {files.map((item) => (
        <a
          key={item.url}
          href={item.url}
          download={item.name}
          className="flex w-64 max-w-full items-center gap-3 rounded-2xl border border-border bg-card p-2.5 pr-4 outline-none transition-colors hover:bg-hover focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-well text-mark">
            <FileText aria-hidden="true" className="size-4.5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-medium">{item.name}</span>
            <span className="block text-caption text-muted-foreground tabular-nums">
              {formatSize(item.size)}
            </span>
          </span>
        </a>
      ))}
    </div>
  )
}
