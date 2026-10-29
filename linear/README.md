# gh44 for Linear

gh44 for Linear has two parts:

- **Custom theme (interface):** Linear's own theme import colors the
  interface, on web, desktop and mobile. Linear keeps one custom theme and
  hides its light and dark options while it's selected, so it doesn't switch
  with the system.
- **Userstyle (code blocks, web):** a [Stylus](https://add0n.com/stylus.html)
  userstyle that gives code blocks and diffs the gh44 Zed syntax colors. It
  follows your system appearance.

Linear builds its interface from hashed CSS variables (`--sx-1gxylln`) that
can change between releases, so a userstyle can't theme the interface reliably.

## Userstyle

1. Install [Stylus](https://add0n.com/stylus.html) for your browser.
2. Click **[Install gh44 for Linear](https://raw.githubusercontent.com/gentrithalili1/gh44-theme/main/linear/gh44.user.css)**.
   Stylus opens its install page.
3. Click **Install style** and reload Linear.

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

The userstyle overrides Linear's diff viewer variables (`--diff-view-*`) and
the classes on code tokens, matched by TextMate scope prefix like editor
themes.

The custom theme uses Linear's undocumented import format, the same one
community themes such as Catppuccin use: each color is
`[lightness, chroma, hue, alpha]` in CIE LCH, and `contrast` is Linear's
contrast setting. The same line is in `gh44.json`.

## Editing

Don't edit `gh44.user.css` directly. Change `palette/tokens.json` and run
`node scripts/build.mjs` from the repository root.
