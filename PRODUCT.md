# Messages

Customer-facing messaging inside an event platform. This repo designs one screen: the customer's Messages inbox. The screen should look finished and the interactions on it should work.

## Stack

- Next.js (App Router)
- React and TypeScript
- Tailwind CSS
- shadcn/ui, on the Radix base, with components owned in `src/components/ui`

Use shadcn components and theme tokens for the interface. Add a component with the shadcn CLI when the screen needs it.

## Type

Inter only, weights 400, 500, 600, and 700. Loaded once with `next/font`. Body, headings, and mono all use Inter.

| Class | Size / weight | Line height | Tracking | Use |
| --- | --- | --- | --- | --- |
| `text-h1` | 24 / 700 | 1.3 | -0.01em | Page title |
| `text-h2` | 20 / 600 | 1.3 | -0.01em | Section |
| `text-h3` | 16 / 600 | 1.3 | -0.01em | Card title |
| `text-body` | 14 / 400 | 1.5 | — | Body. This is the default on `body`. |
| `text-body-sm` | 13 / 400 | 1.5 | — | Supporting |
| `text-caption` | 12 / 400 | 1.5 | — | Meta |
| `text-btn` | 14 / 600 | 1.5 | — | Buttons |
| `text-nav` | 14 / 500 | 1.5 | — | Nav |
| `text-badge` | 12 / 500 | 1 | — | Badge |

A new size is two edits: the `--text-*` tokens in `src/app/globals.css`, and `FONT_SIZE_KEYS` in `src/lib/utils.ts`. An unregistered key is read as a text colour, and `cn()` then drops the element's real foreground.

## Colour

Each family is a 12-step ramp in `src/app/globals.css`. Step 9 is the solid, the same hex in light and dark. Steps 1–8 are washes. Steps 10–12 run darker in light. In dark the ramp flips, so step 12 is the light ink and step 9 stays the solid. Screens use the role tokens. The steps are the scale those roles are built from.

Brand step 9 is `#1A4F3B`. Neutrals carry a quiet green undertone so the page belongs to that green. White on `#1A4F3B` is 9.44:1. The green on the dark page is 1.98:1, so in dark the green is a ground only and the mark is `neutral-12`.

| Step | Light brand | Dark brand | Light neutral | Dark neutral |
| --- | --- | --- | --- | --- |
| 1 | `#F6F9F7` | `#060D09` | `#EFF4F0` | `#050706` |
| 2 | `#DBE6E1` | `#07110D` | `#E1E9E2` | `#111311` |
| 3 | `#C1D4CB` | `#071610` | `#D8DFD9` | `#191B19` |
| 4 | `#A7C2B5` | `#091B13` | `#CFD7D0` | `#1E201E` |
| 5 | `#8DB0A0` | `#091F16` | `#CCD4CD` | `#232623` |
| 6 | `#749E8B` | `#0A241A` | `#B6BEB7` | `#282C29` |
| 7 | `#5A8D77` | `#0A291D` | `#A0A8A1` | `#2E312E` |
| 8 | `#3F7C63` | `#0B2E21` | `#8B938C` | `#333734` |
| 9 | `#1A4F3B` | `#1A4F3B` | `#767E77` | `#5C615C` |
| 10 | `#183C2E` | `#35634F` | `#626A63` | `#878F89` |
| 11 | `#133024` | `#8AA799` | `#4F5750` | `#B6BFB8` |
| 12 | `#10251C` | `#D3E2DB` | `#101311` | `#E1E9E2` |

| Role | Light | Dark | Use |
| --- | --- | --- | --- |
| `background` | `neutral-2` | `neutral-2` | Page |
| `well` | `neutral-3` | `neutral-1` | Quiet sunken ground |
| `hover` | `neutral-4` | `neutral-6` | Hovered ground under a control |
| `card` | `#FFFFFF` | `neutral-3` | Cards |
| `foreground` | `neutral-12` | `neutral-12` | Headings and body |
| `muted-foreground` | `neutral-11` | `neutral-11` | Captions. Clears 4.5:1 on page, card, and hover. |
| `border` | `neutral-5` | `neutral-8` | Hairline |
| `primary` | `brand-9` | `brand-9` | Brand ground. Buttons. |
| `mark` | `brand-9` | `neutral-12` | Brand as type, icons, and focus |
| `ring` | `brand-9` | `neutral-12` | Focus ring |

The surface order is well, then page, then card, in both modes.

Status families are the same 12-step shape. Step 9 stays put in dark. A status region uses its surface and foreground pair.

| Family | Step 9 | Light surface / foreground | Dark surface / foreground |
| --- | --- | --- | --- |
| `warning` | `#BF883B` | `warning-2` / `warning-12` | `warning-4` / `warning-12` |
| `info` | `#49778A` | `info-2` / `info-12` | `info-4` / `info-12` |
| `success` | `#2E7D32` | `success-2` / `success-12` | `success-4` / `success-12` |
| `destructive` | `#D32F2F` | `destructive-2` / `#FFFFFF` on the solid | `destructive-4` / `#FFFFFF` on the solid |

## Who the screen is for

A customer. They use Messages to talk to an event organizer, or to the platform's back office.

## Two groups

The inbox is split by who will reply. Both groups sit on this same screen.

### Event conversations

Threads with an event organizer. There is one thread per event.

A thread can start before booking, when the customer asks about group rates, accessibility, or what is included. It can also start after booking, when the customer asks about attending. If they write before booking and later book the same event, that stays one thread, and the booking is attached once it exists.

Each row shows the event, the organizer, and the latest message. A row can be labeled Enquiry or Booked. That label is not its own section.

### Support

Tickets with the platform, for invoices, payments, or the account. A ticket can mention an event, and the row can show that event. The other party is still the platform, so the ticket stays in Support.

## Interactions on this screen

- Switch between event conversations and support.
- Select a conversation and read its thread.
- Reply in the open thread.

Starting a thread from an event card, from a booking, or from account and billing is outside this screen. Those entries only explain where a thread comes from.

## What not to copy from the earlier wireframe

The shared wireframe is an organizer and support-agent inbox. It uses All, Support, and Events tabs, plus Priority, Resolve, Reply, Note, and "Visible to the customer." Those controls are for the person answering. They do not belong on the customer screen. The All, Support, and Events tabs mix two different recipients and make the list hard to read.

Use the wireframe as sample conversation content:

- Lisa Wang, enquiry about Global React Summit 2027. Subject: group booking for 8 people. She asks for eight Conference Passes on one invoice. The organizer replies that there is 15% off from six seats, one invoice for the eight, and a seven-day hold.
- Emily Rodriguez asks whether an online pass covers attendance.
- Product Leaders Summit 2026, about an invoice that has been queued.
- DesignOps Meetup Berlin, Alex Thompson, about a side entrance.

## Scope

Design this Messages screen visually and make its interactions work. Do not build the catalog, booking, payments, or the organizer inbox.
