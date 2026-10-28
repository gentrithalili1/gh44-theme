# gh44 palette

The source of truth for every gh44 theme. Edit `tokens.json`, then run
`node scripts/build.mjs` from the repository root. That also redraws the
color squares in [`swatches/`](swatches/).

## Signature

| Name | Role | Dark | Light | Use |
| --- | --- | --- | --- | --- |
| **Terracotta** | Brand | ![terracotta dark](swatches/dark/terracotta.svg) `#E49B80` | ![terracotta light](swatches/light/terracotta.svg) `#A9502F` | Primary actions, focus, the signature, keywords |
| **Sage** | Setup | ![sage dark](swatches/dark/sage.svg) `#B8C5AC` | ![sage light](swatches/light/sage.svg) `#5E7350` | Setup content, strings |
| **Lavender** | Accent | ![lavender dark](swatches/dark/lavender.svg) `#BBA8D9` | ![lavender light](swatches/light/lavender.svg) `#6F58A0` | Tags, badges, highlights, charts, functions |
| **Sand** | Editorial | ![sand dark](swatches/dark/sand.svg) `#E9DDD2` | ![sand light](swatches/light/sand.svg) `#7D5B45` | Warm highlights, not body text |

## Neutrals

| Name | Role | Dark | Light |
| --- | --- | --- | --- |
| **Charcoal** | Canvas | ![charcoal dark](swatches/dark/charcoal.svg) `#1E1F22` | ![charcoal light](swatches/light/charcoal.svg) `#FAF7F3` |
| **Graphite** | Card | ![graphite dark](swatches/dark/graphite.svg) `#25262A` | ![graphite light](swatches/light/graphite.svg) `#F2ECE5` |
| **Slate** | Raised | ![slate dark](swatches/dark/slate.svg) `#2B2D30` | ![slate light](swatches/light/slate.svg) `#EAE2D9` |
| **Pewter** | Border | ![pewter dark](swatches/dark/pewter.svg) `#414349` | ![pewter light](swatches/light/pewter.svg) `#D2C4B6` |
| **Cloud** | Main text | ![cloud dark](swatches/dark/cloud.svg) `#DFE1E5` | ![cloud light](swatches/light/cloud.svg) `#2B2D30` |
| **Silver** | Muted text | ![silver dark](swatches/dark/silver.svg) `#A8ABB2` | ![silver light](swatches/light/silver.svg) `#5F6269` |

## Supporting shades

For interface states.

| Name | Dark | Light | Use |
| --- | --- | --- | --- |
| `slate-hover` | ![slate-hover dark](swatches/dark/slate-hover.svg) `#323439` | ![slate-hover light](swatches/light/slate-hover.svg) `#E2D8CD` | Hover on raised surfaces |
| `slate-active` | ![slate-active dark](swatches/dark/slate-active.svg) `#393B41` | ![slate-active light](swatches/light/slate-active.svg) `#D9CDC0` | Pressed and selected |
| `pewter-soft` | ![pewter-soft dark](swatches/dark/pewter-soft.svg) `#313236` | ![pewter-soft light](swatches/light/pewter-soft.svg) `#E4DAD0` | Subtle dividers |
| `comment` | ![comment dark](swatches/dark/comment.svg) `#868A92` | ![comment light](swatches/light/comment.svg) `#6E6A66` | Comments, placeholders |
| `line-number` | ![line-number dark](swatches/dark/line-number.svg) `#5C5F66` | ![line-number light](swatches/light/line-number.svg) `#A39C94` | Line numbers |
| `disabled` | ![disabled dark](swatches/dark/disabled.svg) `#55585F` | ![disabled light](swatches/light/disabled.svg) `#B3ACA4` | Disabled text and icons |

## Code colors

Only for syntax, diagnostics, and terminals. Keep them out of branding so
terracotta stays distinct.

| Name | Dark | Light | Use |
| --- | --- | --- | --- |
| **Dusty blue** | ![dusty-blue dark](swatches/dark/dusty-blue.svg) `#9FB7CC` | ![dusty-blue light](swatches/light/dusty-blue.svg) `#3F6A8C` | Types, info |
| **Ochre** | ![ochre dark](swatches/dark/ochre.svg) `#DDBE8E` | ![ochre light](swatches/light/ochre.svg) `#8C6A2E` | Numbers, booleans, constants, JSX props, warnings |
| **Rose** | ![rose dark](swatches/dark/rose.svg) `#D99AA6` | ![rose light](swatches/light/rose.svg) `#A4506A` | Parameters, properties, escapes, regex |
| **Seafoam** | ![seafoam dark](swatches/dark/seafoam.svg) `#9CC4C0` | ![seafoam light](swatches/light/seafoam.svg) `#3D7A75` | Symbols, terminal cyan |
| **Red** | ![red dark](swatches/dark/red.svg) `#EB6F6F` | ![red light](swatches/light/red.svg) `#C23B32` | Errors, deletions |

## Syntax at a glance

| Code                                     | Color      |
| ---------------------------------------- | ---------- |
| Keywords, JSX tags                       | Terracotta |
| Strings                                  | Sage       |
| Functions, constructors, enums           | Lavender   |
| Types                                    | Dusty blue |
| Parameters, properties                   | Rose       |
| Numbers, booleans, constants, JSX props  | Ochre      |
| Variables                                | Cloud      |
| Operators, punctuation                   | Silver     |
| Comments                                 | Comment    |

## Using it in CSS

```html
<link rel="stylesheet" href="gh44.css">
```

```css
.button {
  background: var(--gh44-brand);
  color: var(--gh44-charcoal);
}
```

Dark is the default. Add `data-theme="light"` to `<html>` for the light variant.
Every color is available by name (`--gh44-lavender`) and by role (`--gh44-accent`).
