# gh44 palette

The source of truth for every gh44 theme. Edit `tokens.json`, then run
`node scripts/build.mjs` from the repository root. That rebuilds every theme
and redraws the color squares in [`swatches/`](swatches/).

## How the names work

Tokens come in three layers. Apps should use the top two.

| Layer | Example | Meaning |
| --- | --- | --- |
| **Roles** | `primary`, `success`, `danger` | What a color is for. Change a role in `tokens.json` and every theme follows. |
| **Neutrals** | `bg`, `fg-muted`, `border` | Named by job, so `fg` is the main text color in both light and dark. |
| **Hues** | `lavender`, `sage`, `red` | Named by color. Each has the steps below. |

## Roles

| Role | Hue |
| --- | --- |
| `primary` | lavender |
| `brand` | terracotta |
| `success` | sage |
| `warning` | ochre |
| `danger` | red |
| `info` | blue |
| `editorial` | sand |

## Neutrals

| Token | Dark | Light | Use |
| --- | --- | --- | --- |
| `bg` | ![bg dark](swatches/dark/bg.svg) `#1E1F22` | ![bg light](swatches/light/bg.svg) `#FAF7F3` | Page background |
| `bg-subtle` | ![bg-subtle dark](swatches/dark/bg-subtle.svg) `#25262A` | ![bg-subtle light](swatches/light/bg-subtle.svg) `#F2ECE5` | Cards, sidebars, code blocks |
| `surface` | ![surface dark](swatches/dark/surface.svg) `#2B2D30` | ![surface light](swatches/light/surface.svg) `#EAE2D9` | Raised controls, inputs |
| `surface-hover` | ![surface-hover dark](swatches/dark/surface-hover.svg) `#323439` | ![surface-hover light](swatches/light/surface-hover.svg) `#E2D8CD` | Hover on raised surfaces |
| `surface-active` | ![surface-active dark](swatches/dark/surface-active.svg) `#393B41` | ![surface-active light](swatches/light/surface-active.svg) `#D9CDC0` | Pressed and selected |
| `border` | ![border dark](swatches/dark/border.svg) `#414349` | ![border light](swatches/light/border.svg) `#D2C4B6` | Borders, inputs |
| `border-subtle` | ![border-subtle dark](swatches/dark/border-subtle.svg) `#313236` | ![border-subtle light](swatches/light/border-subtle.svg) `#E4DAD0` | Dividers |
| `fg` | ![fg dark](swatches/dark/fg.svg) `#DFE1E5` | ![fg light](swatches/light/fg.svg) `#2B2D30` | Main text |
| `fg-muted` | ![fg-muted dark](swatches/dark/fg-muted.svg) `#A8ABB2` | ![fg-muted light](swatches/light/fg-muted.svg) `#5F6269` | Secondary text |
| `fg-subtle` | ![fg-subtle dark](swatches/dark/fg-subtle.svg) `#868A92` | ![fg-subtle light](swatches/light/fg-subtle.svg) `#6E6A66` | Placeholders, comments |
| `fg-faint` | ![fg-faint dark](swatches/dark/fg-faint.svg) `#5C5F66` | ![fg-faint light](swatches/light/fg-faint.svg) `#A39C94` | Line numbers, hints |
| `fg-disabled` | ![fg-disabled dark](swatches/dark/fg-disabled.svg) `#55585F` | ![fg-disabled light](swatches/light/fg-disabled.svg) `#B3ACA4` | Disabled text and icons |

## Hues

| Token | Dark | Light | Use |
| --- | --- | --- | --- |
| `terracotta` | ![terracotta dark](swatches/dark/terracotta.svg) `#E49B80` | ![terracotta light](swatches/light/terracotta.svg) `#A9502F` | Brand, keywords, JSX tags |
| `sage` | ![sage dark](swatches/dark/sage.svg) `#B8C5AC` | ![sage light](swatches/light/sage.svg) `#5E7350` | Success, strings |
| `lavender` | ![lavender dark](swatches/dark/lavender.svg) `#BBA8D9` | ![lavender light](swatches/light/lavender.svg) `#6F58A0` | Primary actions, focus, functions |
| `sand` | ![sand dark](swatches/dark/sand.svg) `#E9DDD2` | ![sand light](swatches/light/sand.svg) `#7D5B45` | Warm editorial highlights |
| `blue` | ![blue dark](swatches/dark/blue.svg) `#9FB7CC` | ![blue light](swatches/light/blue.svg) `#3F6A8C` | Info, links, types |
| `ochre` | ![ochre dark](swatches/dark/ochre.svg) `#DDBE8E` | ![ochre light](swatches/light/ochre.svg) `#8C6A2E` | Warnings, numbers, constants, JSX props |
| `rose` | ![rose dark](swatches/dark/rose.svg) `#D99AA6` | ![rose light](swatches/light/rose.svg) `#A4506A` | Parameters, properties, regex |
| `seafoam` | ![seafoam dark](swatches/dark/seafoam.svg) `#9CC4C0` | ![seafoam light](swatches/light/seafoam.svg) `#3D7A75` | Symbols, terminal cyan |
| `red` | ![red dark](swatches/dark/red.svg) `#EB6F6F` | ![red light](swatches/light/red.svg) `#C23B32` | Errors, deletions |

### Vivid hues

The same hues with more chroma, for status that has to stand out in app UIs
(check marks, pending dots, badges). GitHub uses them for every status color.
Code and terminal themes keep the base hues.

| Token | Dark | Light |
| --- | --- | --- |
| `terracotta-vivid` | ![terracotta-vivid dark](swatches/dark/terracotta-vivid.svg) `#FE8B60` | ![terracotta-vivid light](swatches/light/terracotta-vivid.svg) `#B94000` |
| `sage-vivid` | ![sage-vivid dark](swatches/dark/sage-vivid.svg) `#A4D074` | ![sage-vivid light](swatches/light/sage-vivid.svg) `#497C15` |
| `lavender-vivid` | ![lavender-vivid dark](swatches/dark/lavender-vivid.svg) `#C29EF7` | ![lavender-vivid light](swatches/light/lavender-vivid.svg) `#744BBB` |
| `sand-vivid` | ![sand-vivid dark](swatches/dark/sand-vivid.svg) `#F2DBC6` | ![sand-vivid light](swatches/light/sand-vivid.svg) `#8D532A` |
| `blue-vivid` | ![blue-vivid dark](swatches/dark/blue-vivid.svg) `#68BCFE` | ![blue-vivid light](swatches/light/blue-vivid.svg) `#026BA6` |
| `ochre-vivid` | ![ochre-vivid dark](swatches/dark/ochre-vivid.svg) `#FBB42A` | ![ochre-vivid light](swatches/light/ochre-vivid.svg) `#936705` |
| `rose-vivid` | ![rose-vivid dark](swatches/dark/rose-vivid.svg) `#F389A1` | ![rose-vivid light](swatches/light/rose-vivid.svg) `#B93667` |
| `seafoam-vivid` | ![seafoam-vivid dark](swatches/dark/seafoam-vivid.svg) `#2BD5CB` | ![seafoam-vivid light](swatches/light/seafoam-vivid.svg) `#077F78` |
| `red-vivid` | ![red-vivid dark](swatches/dark/red-vivid.svg) `#FF5A60` | ![red-vivid light](swatches/light/red-vivid.svg) `#D50310` |

### Steps

Every hue and role comes in these steps:

| Step | Example | Use |
| --- | --- | --- |
| base | `lavender` | Text and icons on `bg`. Soft in dark, deep in light. |
| `-solid` | `lavender-solid` | Fills that carry text, like buttons and badges. The deep shade in both variants. Put `on-solid` text on it. |
| `-subtle` | `lavender-subtle` | Tinted backgrounds, like callouts and diff lines. |
| `-vivid` | `lavender-vivid` | Like base, with more chroma. Status icons and text that have to stand out. |
| `-vivid-solid` | `lavender-vivid-solid` | Like `-solid`, with more chroma. Status badges. Put `on-solid` text on it. |

## Syntax at a glance

| Code | Color |
| --- | --- |
| Keywords, JSX tags | terracotta |
| Strings | sage |
| Functions, constructors, enums | lavender |
| Types | blue |
| Parameters, properties | rose |
| Numbers, booleans, constants, JSX props | ochre |
| Variables | `fg` |
| Operators, punctuation | `fg-muted` |
| Comments | `fg-subtle` |

## Using it in CSS

For shadcn/ui projects, use [`shadcn/`](../shadcn/) instead. For anything else:

```html
<link rel="stylesheet" href="gh44.css">
```

```css
.button {
  background: var(--gh44-primary-solid);
  color: var(--gh44-on-solid);
  border-radius: var(--gh44-radius);
  font-family: var(--gh44-font-sans);
}

.note {
  background: var(--gh44-info-subtle);
  color: var(--gh44-fg);
}

code {
  font-family: var(--gh44-font-mono);
}
```

`gh44.css` follows the system setting. Put `class="dark"` or `class="light"` (or
`data-theme="dark"` / `"light"`) on `<html>` to force a variant.
