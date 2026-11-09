# gh44 for Slack

## Install

1. Open **Preferences → Appearance** and set the color mode to match the line you paste.
2. Choose **Custom theme → Import theme → Paste your legacy theme colors**.
3. Paste a line and click **Apply**.

   **gh44 Dark**

   ```
   #202124,#26282A,#34363B,#DFE1E5,#26282A,#DFE1E5,#9EBF7A,#B64309,#191A1C,#DFE1E5
   ```

   **gh44 Light**

   ```
   #F2ECE5,#EAE2D9,#D9CDC0,#2B2D30,#EAE2D9,#2B2D30,#4C7B1D,#B64309,#FAF7F3,#2B2D30
   ```

Slack keeps one custom theme, so paste the other line when you switch modes.

The ten colors are: sidebar, menu hover, active item, active item text, hover
item, sidebar text, online dot, mention badge, top bar, top bar text.

## Edit

These files are generated. Edit [`palette/tokens.json`](../palette/tokens.json) and run `node scripts/build.mjs` from the repository root.
