# gh44 for Slack

Slack keeps custom themes in your account, not in files. The quickest way in is
Slack's legacy theme import, which takes a single line of colors.

## Install

1. In the Slack desktop app, click your profile picture and open **Preferences**.
2. Open **Appearance** (called **Themes** in some versions) and select
   **Custom theme**.
3. Choose **Import theme**, then **Paste your legacy theme colors**.
4. Paste one of these and click **Apply**:

   **gh44 Dark**
   ```
   #25262A,#2B2D30,#393B41,#DFE1E5,#2B2D30,#DFE1E5,#B8C5AC,#E49B80,#E49B80,#1E1F22
   ```

   **gh44 Light**
   ```
   #F2ECE5,#EAE2D9,#D9CDC0,#2B2D30,#EAE2D9,#2B2D30,#5E7350,#A9502F,#A9502F,#FAF7F3
   ```

5. Turn on Slack's dark mode for gh44 Dark, or light mode for gh44 Light.

Slack's newer theme editor uses fewer colors than the legacy format, so it may
adjust some of them when importing.

## Picking colors by hand

If import isn't available, set the custom theme colors with the color pickers:

| Slack element       | gh44 Dark | gh44 Light |
| ------------------- | --------- | ---------- |
| Window and sidebar  | `#25262A` | `#F2ECE5`  |
| Top bar and accent  | `#E49B80` | `#A9502F`  |
| Selected channel    | `#393B41` | `#D9CDC0`  |
| Text                | `#DFE1E5` | `#2B2D30`  |

## What each color does

The import line lists ten colors in this order: sidebar background, menu hover,
active channel, active channel text, hover item, sidebar text, online
indicator, mention badge, top bar background, and top bar text. The same lines
are in `gh44-dark.txt` and `gh44-light.txt`.

## Editing

Change `palette/tokens.json` and run `node scripts/build.mjs` from the
repository root.
