"use client"

import { useRef } from "react"
import { ImageIcon, Paperclip, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Attachment } from "@/lib/conversations"

export const MAX_ATTACHMENTS = 10
const MAX_BYTES = 25 * 1024 * 1024

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Turns picked or dropped files into attachments, keeping to the size and
// count limits. The error names what was left out.
// ponytail: files stay in the browser as object URLs. Nothing is uploaded,
// so a shared file is gone on reload. Swap for an upload once there is a
// backend.
export function toAttachments(files: File[], alreadyStaged: number) {
  const fits = files.filter((file) => file.size <= MAX_BYTES)
  const taken = fits.slice(0, Math.max(0, MAX_ATTACHMENTS - alreadyStaged))
  const error =
    fits.length < files.length
      ? "Files over 25 MB were left out."
      : taken.length < fits.length
        ? `You can share up to ${MAX_ATTACHMENTS} at a time.`
        : ""
  const attachments: Attachment[] = taken.map((file) => ({
    name: file.name,
    size: file.size,
    kind: file.type.startsWith("image/") ? "image" : "file",
    url: URL.createObjectURL(file),
  }))
  return { attachments, error }
}

const OPTIONS = [
  {
    label: "Photos",
    hint: "From your library",
    Icon: ImageIcon,
    accept: "image/*",
  },
  {
    label: "Files",
    hint: "PDFs, documents, sheets",
    Icon: Paperclip,
    accept: undefined,
  },
] as const

// The + in the composer. It opens a menu above itself, and each option opens
// the system picker for that kind of file.
export function AttachMenu({ onPick }: { onPick: (files: File[]) => void }) {
  const inputs = useRef<Record<string, HTMLInputElement | null>>({})

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="Share photos or files"
            className="shrink-0 rounded-xl text-muted-foreground hover:bg-hover hover:text-foreground aria-expanded:bg-hover aria-expanded:text-foreground [&_svg]:transition-transform aria-expanded:[&_svg]:rotate-45 motion-reduce:[&_svg]:transition-none"
          >
            <Plus aria-hidden="true" className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="start"
          sideOffset={10}
          alignOffset={-6}
          className="w-72 rounded-2xl p-1.5 shadow-[0_8px_30px_rgba(16,19,20,0.12)]"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2.5 pt-1.5 pb-1">
              Share
            </DropdownMenuLabel>
            {OPTIONS.map(({ label, hint, Icon }) => (
              <DropdownMenuItem
                key={label}
                onSelect={() => inputs.current[label]?.click()}
                className="h-10 gap-3 rounded-xl px-2.5 focus:bg-hover"
              >
                <Icon aria-hidden="true" className="size-4.5 text-mark" />
                <span className="font-medium">{label}</span>
                <span className="min-w-0 truncate text-muted-foreground">
                  {hint}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {OPTIONS.map(({ label, accept }) => (
        <input
          key={label}
          ref={(el) => {
            inputs.current[label] = el
          }}
          type="file"
          accept={accept}
          multiple
          hidden
          onChange={(event) => {
            onPick(Array.from(event.target.files ?? []))
            event.target.value = ""
          }}
        />
      ))}
    </>
  )
}
