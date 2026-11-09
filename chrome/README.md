# gh44 for Chrome

Works in Chrome and other Chromium browsers (Arc, Brave, Edge).

## Install

1. Clone or download this repository.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and select `chrome/gh44-dark` or `chrome/gh44-light`.

Chrome themes don't follow the system mode, so load the other folder to switch.
To remove it, click **Reset to default** in `chrome://settings/appearance`.

## Edit

These files are generated. Edit [`palette/tokens.json`](../palette/tokens.json) and run `node scripts/build.mjs` from the repository root.
