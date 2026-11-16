# gh44 palette

Every gh44 theme is built from [`tokens.json`](tokens.json).

## Use in CSS

Import [`gh44.css`](gh44.css). It follows the system mode; add `class="dark"`
or `class="light"` on `<html>` to force one.

```css
@import "gh44.css";

body {
  background: var(--gh44-bg);
  color: var(--gh44-fg);
  font-family: var(--gh44-font-sans);
}

.badge {
  background: var(--gh44-sage-subtle);
  color: var(--gh44-sage);
}

.button {
  background: var(--gh44-lavender-solid);
  color: var(--gh44-on-solid);
}
```

Each hue has three steps: `--gh44-sage` for text, `--gh44-sage-solid` for fills
with `--gh44-on-solid` text, and `--gh44-sage-subtle` for tinted backgrounds.

## Neutrals

| Token            | Dark                                                               | Light                                                                |
| ---------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `bg`             | ![bg dark](swatches/dark/bg.svg) `#101114`                         | ![bg light](swatches/light/bg.svg) `#FAF7F3`                         |
| `bg-subtle`      | ![bg-subtle dark](swatches/dark/bg-subtle.svg) `#17181C`           | ![bg-subtle light](swatches/light/bg-subtle.svg) `#F2ECE5`           |
| `surface`        | ![surface dark](swatches/dark/surface.svg) `#1D1F22`               | ![surface light](swatches/light/surface.svg) `#EAE2D9`               |
| `surface-hover`  | ![surface-hover dark](swatches/dark/surface-hover.svg) `#24262B`   | ![surface-hover light](swatches/light/surface-hover.svg) `#E2D8CD`   |
| `surface-active` | ![surface-active dark](swatches/dark/surface-active.svg) `#2B2D33` | ![surface-active light](swatches/light/surface-active.svg) `#D9CDC0` |
| `border-subtle`  | ![border-subtle dark](swatches/dark/border-subtle.svg) `#232428`   | ![border-subtle light](swatches/light/border-subtle.svg) `#E4DAD0`   |
| `border`         | ![border dark](swatches/dark/border.svg) `#33353B`                 | ![border light](swatches/light/border.svg) `#D2C4B6`                 |
| `fg-disabled`    | ![fg-disabled dark](swatches/dark/fg-disabled.svg) `#55585F`       | ![fg-disabled light](swatches/light/fg-disabled.svg) `#B3ACA4`       |
| `fg-faint`       | ![fg-faint dark](swatches/dark/fg-faint.svg) `#5C5F66`             | ![fg-faint light](swatches/light/fg-faint.svg) `#A39C94`             |
| `fg-subtle`      | ![fg-subtle dark](swatches/dark/fg-subtle.svg) `#868A92`           | ![fg-subtle light](swatches/light/fg-subtle.svg) `#6E6A66`           |
| `fg-muted`       | ![fg-muted dark](swatches/dark/fg-muted.svg) `#A8ABB2`             | ![fg-muted light](swatches/light/fg-muted.svg) `#5F6269`             |
| `fg-code`        | ![fg-code dark](swatches/dark/fg-code.svg) `#CCCED3`               | ![fg-code light](swatches/light/fg-code.svg) `#2B2D30`               |
| `fg`             | ![fg dark](swatches/dark/fg.svg) `#DFE1E5`                         | ![fg light](swatches/light/fg.svg) `#2B2D30`                         |

## Hues

| Token      | Dark                                                   | Light                                                    |
| ---------- | ------------------------------------------------------ | -------------------------------------------------------- |
| `clay`     | ![clay dark](swatches/dark/clay.svg) `#C59172`         | ![clay light](swatches/light/clay.svg) `#B64309`         |
| `ochre`    | ![ochre dark](swatches/dark/ochre.svg) `#D4B25E`       | ![ochre light](swatches/light/ochre.svg) `#916913`       |
| `sage`     | ![sage dark](swatches/dark/sage.svg) `#9EBF7A`         | ![sage light](swatches/light/sage.svg) `#4C7B1D`         |
| `seafoam`  | ![seafoam dark](swatches/dark/seafoam.svg) `#5CB8A2`   | ![seafoam light](swatches/light/seafoam.svg) `#157E77`   |
| `sky`      | ![sky dark](swatches/dark/sky.svg) `#75ADDB`           | ![sky light](swatches/light/sky.svg) `#0A6BA3`           |
| `lavender` | ![lavender dark](swatches/dark/lavender.svg) `#C1A0F4` | ![lavender light](swatches/light/lavender.svg) `#744DB8` |
| `rose`     | ![rose dark](swatches/dark/rose.svg) `#F08BA2`         | ![rose light](swatches/light/rose.svg) `#B73A68`         |
| `red`      | ![red dark](swatches/dark/red.svg) `#FD5D62`           | ![red light](swatches/light/red.svg) `#D30A15`           |
