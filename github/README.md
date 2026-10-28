# gh44 for GitHub

A [Stylus](https://add0n.com/stylus.html) userstyle that recolors GitHub with
the gh44 palette: interface, buttons, diffs, contribution graph and code
syntax colors. It follows your GitHub appearance setting, so gh44 Dark shows
when GitHub is dark and gh44 Light when it's light, including **Sync with
system**.

## Install

1. Install [Stylus](https://add0n.com/stylus.html) for your browser.
2. Open `gh44.user.css` from this folder in its raw view on GitHub. Stylus
   offers to install it.
3. Click **Install style** and reload GitHub.

To install from a local clone instead, open the file in the browser with a
`file://` URL. In Chrome, turn on **Allow access to file URLs** for Stylus in
`chrome://extensions` first.

## How it works

GitHub colors everything through Primer CSS variables (`--bgColor-default`,
`--fgColor-accent`, `--prettylights-syntax-keyword`, ...). The userstyle only
overrides those variables, so it survives most GitHub redesigns. Terracotta
replaces GitHub's blue and green as the accent and primary button color.

## Editing

Don't edit `gh44.user.css` directly. Change `palette/tokens.json` and run
`node scripts/build.mjs` from the repository root.
