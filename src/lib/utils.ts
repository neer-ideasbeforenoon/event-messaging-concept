import { createCn } from "cn/config"

// Keep in sync with the text tokens in src/app/globals.css. An unregistered
// custom size is treated as a text colour, and cn() then drops the real colour.
const FONT_SIZE_KEYS = [
  "display",
  "h1",
  "h2",
  "h3",
  "body",
  "body-sm",
  "caption",
  "btn",
  "nav",
  "badge",
]

export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: FONT_SIZE_KEYS }],
    },
  },
})
