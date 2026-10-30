# gh44 for GitHub

A [Stylus](https://add0n.com/stylus.html) userstyle that recolors GitHub with
the gh44 palette: interface, buttons, diffs, contribution graph and code
syntax colors. It follows your GitHub appearance setting, so gh44 Dark shows
when GitHub is dark and gh44 Light when it's light, including **Sync with
system**.

## Install

1. Install [Stylus](https://add0n.com/stylus.html) for your browser.
2. Click **[Install gh44 for GitHub](https://raw.githubusercontent.com/gentrithalili1/gh44-theme/main/github/gh44.user.css)**.
   Stylus opens its install page.
3. Click **Install style** and reload GitHub.

The link opens the raw file. To find it yourself, open `gh44.user.css` in this
folder on GitHub and click **Raw** at the top right of the file.

## Update

Open the install link again, click **Reinstall style** and reload GitHub.
GitHub caches raw files for a few minutes, so a change just pushed can take
about 5 minutes to show up.

To install from a local clone instead, open the file in the browser with a
`file://` URL. In Chrome, turn on **Allow access to file URLs** for Stylus in
`chrome://extensions` first.

## How it works

GitHub colors everything through Primer CSS variables (`--bgColor-default`,
`--fgColor-accent`, `--prettylights-syntax-keyword`, ...). The userstyle only
overrides those variables, so it survives most GitHub redesigns. Dusty blue
replaces GitHub's blue for links and selection, and sage replaces its green.
Status colors use the vivid hues so they stand out: checks, pending dots, PR
state badges, the merge and danger buttons, checkboxes, the contribution graph
and the active tab underline. Links and selection keep the base hues. Code and
diffs use the same colors as gh44 in Zed: syntax, text, and the added and
deleted tints. Dark mode lifts the page background and text slightly.
Solid badges and buttons use gh44 Light's deeper colors in both modes, so they
carry light text.

## Editing

Don't edit `gh44.user.css` directly. Change `palette/tokens.json` and run
`node scripts/build.mjs` from the repository root.
