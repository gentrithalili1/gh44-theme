# gh44 for Linear

Linear builds a full theme from a few colors: a background, an accent, and a
contrast level, plus the same for the sidebar. gh44 sets the background to
bg, the sidebar to bg-subtle, and the accent to Lavender.

## Install

1. In Linear, open **Settings** → **Preferences** (shortcut `G` then `S`).
2. Under **Interface theme**, choose **Custom**.
3. At the bottom, under **Sharing**, click **Import theme**.
4. Paste this and confirm:

   ```
   {"base":[97.382,2.356,77.304,1],"accent":[42.252,42.335,301.399,1],"contrast":30,"sidebar":{"base":[93.727,4.326,73.952,1],"accent":[42.252,42.335,301.399,1],"contrast":30}}
   ```

gh44 has one Linear theme, built from the light palette, the same as Slack.

Linear doesn't sync the theme between devices, so set it on desktop, web, and
mobile separately.

## Code blocks

Linear's theme only sets interface colors, so code blocks keep Linear's own
syntax colors. To give them the same colors as the gh44 Zed theme, use the
userstyles in this folder. They work in Linear on the web, not in the desktop
app.

1. Install [Stylus](https://add0n.com/stylus.html) for your browser.
2. Install both styles. Each one only applies in its own system mode, so code
   blocks switch with light and dark mode. Stylus opens its install page.
   - **[Install gh44 Dark for Linear](https://raw.githubusercontent.com/gentrithalili1/gh44-theme/main/linear/gh44-dark.user.css)**
   - **[Install gh44 Light for Linear](https://raw.githubusercontent.com/gentrithalili1/gh44-theme/main/linear/gh44-light.user.css)**
3. Click **Install style** and reload Linear.

The links open the raw files. To find them yourself, open `gh44-dark.user.css`
or `gh44-light.user.css` in this folder on GitHub and click **Raw** at the top
right of the file.

To update, open the install link again, click **Reinstall style** and reload
Linear. GitHub caches raw files for a few minutes, so a change just pushed can
take about 5 minutes to show up.

## Format

Linear doesn't document the import format. It's the format used by community
themes such as Catppuccin: each color is `[lightness, chroma, hue, alpha]` in
CIE LCH, and `contrast` is Linear's contrast setting. The same line is in
`gh44.json`.

## Editing

Change `palette/tokens.json` and run `node scripts/build.mjs` from the
repository root.
