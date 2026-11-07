# gh44 for Linear

Two parts: a theme for Linear's interface, and a
[Stylus](https://add0n.com/stylus.html) userstyle that gives code blocks and
diffs the same colors as Zed.

## Interface theme

1. Open **Settings → Preferences → Interface theme** and choose **Custom**.
2. Click **Import theme**, paste a line and confirm.

   **gh44 Dark**

   ```
   {"base":[9.216,1.578,266.503,1],"accent":[71.248,45.254,303.409,1],"contrast":30,"sidebar":{"base":[12.726,2.203,272.678,1],"accent":[71.248,45.254,303.409,1],"contrast":30}}
   ```

   **gh44 Light**

   ```
   {"base":[97.382,2.356,77.304,1],"accent":[41.393,62.23,303.997,1],"contrast":30,"sidebar":{"base":[93.727,4.326,73.952,1],"accent":[41.393,62.23,303.997,1],"contrast":30}}
   ```

Linear keeps one custom theme, so import the other line when you switch modes.

## Code blocks

1. Install [Stylus](https://add0n.com/stylus.html).
2. Open **[gh44.user.css](https://raw.githubusercontent.com/gentrithalili1/gh44-theme/main/linear/gh44.user.css)** and click **Install style**.
3. Reload Linear.

It follows your system appearance. Stylus only runs in the browser, not the
desktop app.

## Edit

These files are generated. Edit [`palette/tokens.json`](../palette/tokens.json) and run `node scripts/build.mjs` from the repository root.
