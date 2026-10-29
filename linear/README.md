# gh44 for Linear

Two ways to use gh44 in Linear:

- **Userstyle (full theme, web):** a [Stylus](https://add0n.com/stylus.html)
  userstyle that recolors Linear's interface and code blocks. It follows your
  system appearance, so gh44 Dark shows in dark mode and gh44 Light in light
  mode.
- **Custom theme (interface only, desktop app too):** Linear's own theme
  import. It colors the interface but not code blocks, and doesn't switch with
  the system.

## Userstyle

1. In Linear, open **Settings** → **Preferences** (shortcut `G` then `S`) and
   set **Interface theme** to **System**.
2. Install [Stylus](https://add0n.com/stylus.html) for your browser.
3. Click **[Install gh44 for Linear](https://raw.githubusercontent.com/gentrithalili1/gh44-theme/main/linear/gh44.user.css)**.
   Stylus opens its install page.
4. Click **Install style** and reload Linear.

The link opens the raw file. To find it yourself, open `gh44.user.css` in this
folder on GitHub and click **Raw** at the top right of the file. Stylus only
runs in the browser, so the userstyle doesn't reach the desktop app.

To update, open the install link again, click **Reinstall style** and reload
Linear. GitHub caches raw files for a few minutes, so a change just pushed can
take about 5 minutes to show up.

## Custom theme

1. In Linear, open **Settings** → **Preferences**.
2. Under **Interface theme**, choose **Custom**.
3. At the bottom, under **Sharing**, click **Import theme**.
4. Paste this and confirm:

   ```
   {"base":[97.382,2.356,77.304,1],"accent":[42.252,42.335,301.399,1],"contrast":30,"sidebar":{"base":[93.727,4.326,73.952,1],"accent":[42.252,42.335,301.399,1],"contrast":30}}
   ```

Linear doesn't sync the theme between devices, so set it on desktop, web, and
mobile separately.

## How it works

The userstyle overrides the CSS variables Linear colors its interface with
(`--color-bg-primary`, `--color-text-primary`, ...), its diff viewer variables
(`--diff-view-*`) and the classes on code tokens. The accent color isn't
covered yet, so selected items and buttons keep Linear's own accent.

The custom theme uses Linear's undocumented import format, the same one
community themes such as Catppuccin use: each color is
`[lightness, chroma, hue, alpha]` in CIE LCH, and `contrast` is Linear's
contrast setting. The same line is in `gh44.json`.

## Editing

Don't edit `gh44.user.css` directly. Change `palette/tokens.json` and run
`node scripts/build.mjs` from the repository root.
