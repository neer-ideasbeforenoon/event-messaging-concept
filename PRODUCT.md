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
| `text-display` | 36–56 fluid / 600 | 1.08 | -0.03em | Landing greeting |
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

Brand step 9 is `#163A52`. Neutrals carry a quiet blue undertone so the page belongs to that blue. White on `#163A52` is 11.92:1. The blue on the dark page is 1.57:1, so in dark the blue is a ground only and the mark is `neutral-12`.

| Step | Light brand | Dark brand | Light neutral | Dark neutral |
| --- | --- | --- | --- | --- |
| 1 | `#F6F9FA` | `#060C10` | `#EEF4F6` | `#050708` |
| 2 | `#DCE4EB` | `#080F16` | `#DEE8ED` | `#101314` |
| 3 | `#C2D1DD` | `#08141D` | `#D6DFE2` | `#181B1C` |
| 4 | `#A8BECF` | `#091923` | `#CCD6DB` | `#1D2021` |
| 5 | `#8FABC1` | `#0A1C28` | `#C9D3D8` | `#222627` |
| 6 | `#7698B2` | `#0C202F` | `#B3BDC2` | `#272C2E` |
| 7 | `#5D86A4` | `#0C2535` | `#9DA7AC` | `#2D3132` |
| 8 | `#437496` | `#0F293C` | `#889297` | `#323739` |
| 9 | `#163A52` | `#163A52` | `#737D82` | `#5A6163` |
| 10 | `#0E2A3D` | `#375D77` | `#5F696E` | `#858E93` |
| 11 | `#081F2F` | `#8BA3B5` | `#4C565B` | `#B4BEC3` |
| 12 | `#061621` | `#D4E0E9` | `#101314` | `#DEE8ED` |

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
| `attention` | `brand-9` | `brand-11` mixed 40% toward `brand-10` | Unread dot, pulsing. Brand blue that still reads on the dark page. |

The surface order is well, then page, then card, in both modes.

Status families are the same 12-step shape. Step 9 stays put in dark. A status region uses its surface and foreground pair.

| Family | Step 9 | Light surface / foreground | Dark surface / foreground |
| --- | --- | --- | --- |
| `warning` | `#BF883B` | `warning-2` / `warning-12` | `warning-4` / `warning-12` |
| `info` | `#49778A` | `info-2` / `info-12` | `info-4` / `info-12` |
| `success` | `#2E7D32` | `success-2` / `success-12` | `success-4` / `success-12` |
| `destructive` | `#D32F2F` | `destructive-2` / `#FFFFFF` on the solid | `destructive-4` / `#FFFFFF` on the solid |

## Who the screen is for

A customer. They use Messages to talk to other people, such as speakers and fellow attendees, to an event organizer, or to the platform's back office.

## Three groups

The inbox is split by who will reply. All three groups sit on this same screen, as People, Event conversations, and Support, in that order. Event conversations is the default.

### People

Direct threads with another person, such as a speaker or a fellow attendee. There is one thread per person.

The person replies for themselves, so the row shows their name, who they are to the customer (for example "Speaker, Design Futures Forum"), and the latest message. A thread can mention an event, but it is not the organizer's thread for that event, so it stays in People.

### Event conversations

Threads with an event organizer. There is one thread per event.

A thread can start before booking, when the customer asks about group rates, accessibility, or what is included. It can also start after booking, when the customer asks about attending. If they write before booking and later book the same event, that stays one thread, and the booking is attached once it exists.

Each row shows the event, the organizer, and the latest message. A row can be labeled Enquiry or Booked. That label is not its own section.

### Support

Tickets with the platform, for invoices, payments, or the account. A ticket can mention an event, and the row can show that event. The other party is still the platform, so the ticket stays in Support.

## Interactions on this screen

- Switch between people, event conversations, and support.
- Select a conversation and read its thread.
- Reply in the open thread.

Starting a thread from an event card, from a booking, from a speaker or attendee profile, or from account and billing is outside this screen. Those entries only explain where a thread comes from.

## What not to copy from the earlier wireframe

The shared wireframe is an organizer and support-agent inbox. It uses All, Support, and Events tabs, plus Priority, Resolve, Reply, Note, and "Visible to the customer." Those controls are for the person answering. They do not belong on the customer screen. The All, Support, and Events tabs mix two different recipients and make the list hard to read.

Use the wireframe as sample conversation content:

- Lisa Wang, enquiry about Global React Summit 2027. Subject: group booking for 8 people. She asks for eight Conference Passes on one invoice. The organizer replies that there is 15% off from six seats, one invoice for the eight, and a seven-day hold.
- Emily Rodriguez asks whether an online pass covers attendance.
- Product Leaders Summit 2026, about an invoice that has been queued.
- DesignOps Meetup Berlin, Alex Thompson, about a side entrance.

## Scope

Design this Messages screen visually and make its interactions work. Do not build the catalog, booking, payments, or the organizer inbox.
