# gh44 for Linear

gh44 for Linear has two parts:

- **Custom theme (interface):** gh44 Dark and gh44 Light for Linear's own
  theme import. Linear keeps one custom theme at a time, so import the one
  that matches your system mode and switch by hand.
- **Userstyle (code blocks, web):** a [Stylus](https://add0n.com/stylus.html)
  userstyle that gives code blocks and diffs the same colors as gh44 in Zed,
  syntax and diff tints included. It follows your system appearance.

## Custom theme

1. In Linear, open **Settings** → **Preferences** (shortcut `G` then `S`).
2. Under **Interface theme**, choose **Custom**.
3. At the bottom, under **Sharing**, click **Import theme**.
4. Paste one of these and confirm:

   **gh44 Dark**
   ```
   {"base":[11.744,2.222,272.716,1],"accent":[70.976,47.994,303.946,1],"contrast":30,"sidebar":{"base":[15.177,2.834,275.984,1],"accent":[70.976,47.994,303.946,1],"contrast":30}}
   ```

   **gh44 Light**
   ```
   {"base":[97.382,2.356,77.304,1],"accent":[41.124,65.003,304.177,1],"contrast":30,"sidebar":{"base":[93.727,4.326,73.952,1],"accent":[41.124,65.003,304.177,1],"contrast":30}}
   ```

When your system switches mode, import the other one. Linear doesn't sync the
theme between devices, so set it on desktop, web, and mobile separately.

## Code blocks

Linear's theme only sets interface colors, so code blocks keep Linear's own
syntax colors. The userstyle gives them the gh44 colors on Linear's website.
Stylus only runs in the browser, so it doesn't reach the desktop app.

1. Install [Stylus](https://add0n.com/stylus.html) for your browser.
2. Click **[Install gh44 for Linear code blocks](https://raw.githubusercontent.com/gentrithalili1/gh44-theme/main/linear/gh44.user.css)**.
   Stylus opens its install page.
3. Click **Install style** and reload Linear.

The link opens the raw file. To find it yourself, open `gh44.user.css` in this
folder on GitHub and click **Raw** at the top right of the file.

To update, open the install link again, click **Reinstall style** and reload
Linear. GitHub caches raw files for a few minutes, so a change just pushed can
take about 5 minutes to show up.

## How it works

The userstyle overrides Linear's diff viewer variables (`--diff-view-*`) and
the classes on code tokens, matched by TextMate scope prefix like editor
themes.

The custom theme uses Linear's undocumented import format, the same one
community themes such as Catppuccin use: each color is
`[lightness, chroma, hue, alpha]` in CIE LCH, and `contrast` is Linear's
contrast setting. The same lines are in `gh44-dark.json` and `gh44-light.json`.

## Editing

Don't edit `gh44.user.css` directly. Change `palette/tokens.json` and run
`node scripts/build.mjs` from the repository root.
