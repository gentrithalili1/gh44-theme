# gh44 for Linear

Linear builds a full theme from a few colors: a background, an accent, and a
contrast level, plus the same for the sidebar. gh44 sets the background to
Charcoal, the sidebar to Graphite, and the accent to Terracotta.

## Install

1. In Linear, open **Settings** → **Preferences** (shortcut `G` then `S`).
2. Under **Interface theme**, choose **Custom**.
3. At the bottom, under **Sharing**, click **Import theme**.
4. Paste one of these and confirm:

   **gh44 Dark**
   ```
   {"base":[11.744,2.222,272.716,1],"accent":[70.918,36.524,45.012,1],"contrast":30,"sidebar":{"base":[15.177,2.834,275.984,1],"accent":[70.918,36.524,45.012,1],"contrast":30}}
   ```

   **gh44 Light**
   ```
   {"base":[97.382,2.356,77.304,1],"accent":[45.291,51.291,45.938,1],"contrast":30,"sidebar":{"base":[93.727,4.326,73.952,1],"accent":[45.291,51.291,45.938,1],"contrast":30}}
   ```

Linear doesn't sync the theme between devices, so set it on desktop, web, and
mobile separately.

## Code blocks

Linear's theme only sets interface colors, so code blocks keep Linear's own
syntax colors. To give them the same colors as the gh44 Zed theme, use the
userstyles in this folder. They work in Linear on the web, not in the desktop
app.

1. Install [Stylus](https://add0n.com/stylus.html) for your browser.
2. Open `gh44-dark.user.css` or `gh44-light.user.css` from this folder in its
   raw view on GitHub. Stylus offers to install it.
3. Click **Install style** and reload Linear.

Use the one that matches the theme you imported.

## Format

Linear doesn't document the import format. It's the format used by community
themes such as Catppuccin: each color is `[lightness, chroma, hue, alpha]` in
CIE LCH, and `contrast` is Linear's contrast setting. The same lines are in
`gh44-dark.json` and `gh44-light.json`.

## Editing

Change `palette/tokens.json` and run `node scripts/build.mjs` from the
repository root.
