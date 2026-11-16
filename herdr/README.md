# gh44 for Herdr

## Install

1. Copy the themes into Herdr's themes folder. From the repository root:

   ```sh
   mkdir -p ~/.config/herdr-app/themes && cp herdr/*.json ~/.config/herdr-app/themes/
   ```

2. Open **Settings → Appearance** and pick **gh44-dark** or **gh44-light**.
   To follow the system's light or dark mode, set `"theme": { "light": "gh44-light", "dark": "gh44-dark" }`
   in `~/.config/herdr-app/settings.json`.
3. For the font, install Lilex from [`fonts/`](../fonts/) and pick it in **Settings**.

## Edit

These files are generated. Edit [`palette/tokens.json`](../palette/tokens.json) and run `node scripts/build.mjs` from the repository root.
