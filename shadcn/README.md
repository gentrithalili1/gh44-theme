# gh44 for shadcn/ui

Light and dark colors for every shadcn component, with lavender as primary,
IBM Plex Sans for text and Lilex for code.

## Install

In a project that ran `npx shadcn@latest init`:

```sh
npx shadcn@latest add https://raw.githubusercontent.com/gentrithalili1/gh44-theme/main/shadcn/r/gh44.json
```

Colors only, keeping your own fonts:

```sh
npx shadcn@latest add https://raw.githubusercontent.com/gentrithalili1/gh44-theme/main/shadcn/r/gh44-theme.json
```

Without the CLI, paste [`gh44.css`](gh44.css) below `@import "tailwindcss";`
and install `@fontsource-variable/ibm-plex-sans` and `@fontsource-variable/lilex`.

To update, run the same command again.

## Example

```tsx
<Button>Save</Button>
<Badge className="bg-success text-success-foreground">Passed</Badge>
<p className="text-muted-foreground">Last updated 2 hours ago</p>
```

## Colors

| Variable               | Light                            | Dark                  | Utilities                               |
| ---------------------- | -------------------------------- | --------------------- | --------------------------------------- |
| `primary`              | lavender `#744DB8`               | lavender `#C1A0F4`    | `bg-primary text-primary-foreground`    |
| `success`              | sage `#4C7B1D`                   | sage `#9EBF7A`        | `bg-success text-success-foreground`    |
| `warning`              | ochre `#916913`                  | ochre `#D4B25E`       | `bg-warning text-warning-foreground`    |
| `info`                 | sky `#0A6BA3`                    | sky `#75ADDB`         | `bg-info text-info-foreground`          |
| `destructive`          | red `#D30A15`                    | red `#FD5D62`         | `text-destructive`, `bg-destructive/10` |
| `background` / `card`  | `#FAF7F3` / `#FAF7F3`            | `#191A1C` / `#202124` | `bg-background`, `bg-card`              |
| `muted-foreground`     | `#5F6269`                        | `#A8ABB2`             | `text-muted-foreground`                 |
| `chart-1` to `chart-5` | lavender, sage, sky, ochre, rose | same                  | `fill-chart-1`                          |

Dark mode turns on with `class="dark"` on `<html>`.

## Edit

These files are generated. Edit [`palette/tokens.json`](../palette/tokens.json) and run `node scripts/build.mjs` from the repository root.
