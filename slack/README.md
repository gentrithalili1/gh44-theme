# gh44 for Slack

Slack keeps custom themes in your account, not in files. The quickest way in is
Slack's legacy theme import, which takes a single line of colors.

gh44 has one Slack theme. Slack derives its dark mode from it, so it follows
your system's light and dark mode.

## Install

1. In the Slack desktop app, click your profile picture and open **Preferences**.
2. Open **Appearance** (called **Themes** in some versions) and set the color
   mode to **Sync with OS setting**.
3. Select **Custom theme**, choose **Import theme**, then **Paste your legacy
   theme colors**.
4. Paste this and click **Apply**:

   ```
   #F2ECE5,#EAE2D9,#D9CDC0,#2B2D30,#EAE2D9,#2B2D30,#497C15,#B94000,#A9502F,#FAF7F3
   ```

Slack's newer theme editor uses fewer colors than the legacy format, so it may
adjust some of them when importing.

## Picking colors by hand

If import isn't available, set the custom theme colors with the color pickers:

| Slack element      | Color     |
| ------------------ | --------- |
| Window and sidebar | `#F2ECE5` |
| Top bar and accent | `#A9502F` |
| Selected channel   | `#D9CDC0` |
| Text               | `#2B2D30` |

## What each color does

The import line lists ten colors in this order: sidebar background, menu hover,
active channel, active channel text, hover item, sidebar text, online
indicator, mention badge, top bar background, and top bar text. The same line
is in `gh44.txt`. The online indicator and mention badge use the vivid sage and
terracotta, so they stand out.

## Editing

Change `palette/tokens.json` and run `node scripts/build.mjs` from the
repository root.
