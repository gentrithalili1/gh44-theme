# gh44 for Chrome

gh44 theme for [Google Chrome](https://www.google.com/chrome/) and other
Chromium browsers (Arc, Brave, Edge). Chrome themes don't follow your system's
dark or light mode, so each variant is its own theme.

## Install

1. Clone or download this repository.
2. Open `chrome://extensions` and turn on **Developer mode** (top right).
3. Click **Load unpacked** and select `chrome/gh44-dark` or `chrome/gh44-light`.

Chrome applies the theme right away. To switch variants, load the other folder.
To go back to the default, open `chrome://settings/appearance` and click
**Reset to default**.

## Editing

Don't edit the `manifest.json` files directly. Change `palette/tokens.json` and
run `node scripts/build.mjs` from the repository root.
