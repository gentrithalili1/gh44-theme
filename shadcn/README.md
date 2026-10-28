# gh44 for shadcn/ui

The gh44 theme for any [shadcn/ui](https://ui.shadcn.com) project: TanStack
Start, Next.js, Vite, React Router, Astro. It sets every color shadcn
components read, in light and dark, with lavender as the primary color and
JetBrains Mono as the font.

## Install

In a project that already ran `npx shadcn@latest init`:

```sh
npx shadcn@latest add https://raw.githubusercontent.com/gentrithalili1/gh44-theme/main/shadcn/r/gh44.json
```

This writes the colors into your CSS file, installs
`@fontsource-variable/jetbrains-mono`, and sets it as `font-sans` and
`font-mono`. Components you add afterwards (`npx shadcn@latest add button card`)
come out in gh44.

To keep your own font, install the colors only:

```sh
npx shadcn@latest add https://raw.githubusercontent.com/gentrithalili1/gh44-theme/main/shadcn/r/gh44-theme.json
```

### Shorter names

Add the registry to `components.json` once:

```json
{
  "registries": {
    "@gh44": "https://raw.githubusercontent.com/gentrithalili1/gh44-theme/main/shadcn/r/{name}.json"
  }
}
```

Then install with `npx shadcn@latest add @gh44/gh44`.

### Without the CLI

Paste [`gh44.css`](gh44.css) below `@import "tailwindcss";` in your CSS file, and
install `@fontsource-variable/jetbrains-mono` yourself.

## Updating

Run the same `add` command again. It overwrites the gh44 variables with the
latest values. GitHub caches raw files for about 5 minutes after a push.

## Dark mode

shadcn switches on a `dark` class on `<html>`. Add it from your theme toggle,
or set it before the page paints so there's no flash:

```html
<script>
  const isDark = localStorage.theme === 'dark' ||
    (!localStorage.theme && matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark)
</script>
```

## What you get

Every shadcn variable, plus three status colors shadcn doesn't have:

| Variable | Light | Dark | Utilities |
| --- | --- | --- | --- |
| `primary` | lavender `#6F58A0` | lavender `#BBA8D9` | `bg-primary text-primary-foreground` |
| `success` | sage `#5E7350` | sage `#B8C5AC` | `bg-success text-success-foreground` |
| `warning` | ochre `#8C6A2E` | ochre `#DDBE8E` | `bg-warning text-warning-foreground` |
| `info` | blue `#3F6A8C` | blue `#9FB7CC` | `bg-info text-info-foreground` |
| `destructive` | red `#C23B32` | red `#EB6F6F` | `text-destructive`, `bg-destructive/10` |
| `background` / `card` | `#FAF7F3` / `#F2ECE5` | `#1E1F22` / `#25262A` | `bg-background`, `bg-card` |
| `muted-foreground` | `#5F6269` | `#A8ABB2` | `text-muted-foreground` |
| `chart-1` to `chart-5` | lavender, sage, blue, ochre, rose | same | `fill-chart-1` |

Primary, destructive and the status colors are a deep shade with light text in
light mode and a soft shade with dark text in dark mode. Every text and
background pair passes WCAG AA (4.5:1).

## Editing

Don't edit the files in this folder. Change `palette/tokens.json` and run
`node scripts/build.mjs` from the repository root.
