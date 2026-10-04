# Event Messages

A concept for the **customer Messages** screen on an event platform.

Attendees use one inbox to talk to other people at an event, to organizers about a booking or enquiry, and to platform support about invoices or their account. The list is split by who will reply — not by a mixed “All / Support / Events” agent view.

This repo designs that screen end to end: it should look finished, and the interactions on it should work. Catalog, booking, payments, and the organizer inbox are out of scope.

Product rules, sample threads, type, and colour live in [PRODUCT.md](./PRODUCT.md).

## What’s on the screen

Three conversation groups share one page. **Event conversations** is the default tab.

| Group | Who replies | Shape |
| --- | --- | --- |
| **People** | A speaker or fellow attendee | One thread per person |
| **Event conversations** | The event organizer | One thread per event (enquiry or booked) |
| **Support** | The platform | Tickets for invoices, payments, account |

From the inbox you can:

- Switch between People, Event conversations, and Support
- Open a conversation and read its thread
- Reply in the open thread
- Toggle light / dark theme

Starting a thread (from Discover, My events, a profile, or billing) is outside this screen. Entry cards on the inbox only point at those places.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- React 19 and TypeScript
- Tailwind CSS 4
- [shadcn/ui](https://ui.shadcn.com) (Radix), components owned under `src/components/ui`
- Inter via `next/font`

Conversation data is local mock data in `src/lib/conversations.ts` — enough to exercise the UI, not a backend.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Layout

```
src/
  app/
    (inbox)/          # Messages inbox (/)
    messages/[id]/    # Open thread
  components/         # Screen UI + shared chrome
  components/ui/      # shadcn primitives
  lib/
    conversations.ts  # Types + mock threads
    attendees.ts
    utils.ts
```

Design tokens (brand blue `#163A52`, type scale, status colours) are in `src/app/globals.css`. Role tokens (`background`, `card`, `primary`, `attention`, …) are what screens should use.

## Design notes

- This is a **customer** inbox. Organizer controls (priority, resolve, internal notes, “visible to the customer”) do not belong here.
- Brand and neutrals are a 12-step ramp with light and dark. Screens consume role tokens; the steps are the scale those roles are built from.
- Sample conversation content (Lisa Wang’s group booking, Emily’s online-pass question, and the rest) is documented in PRODUCT.md and seeded in the mock data.
