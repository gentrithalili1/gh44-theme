# gh44 for Warp

gh44 theme for the [Warp](https://www.warp.dev) terminal.

<picture>
  <source media="(prefers-color-scheme: light)" srcset="../assets/warp-light.svg">
  <img alt="A terminal session in gh44 Dark in Warp" src="../assets/warp-dark.svg">
</picture>

## Install

1. Create Warp's themes folder.

   macOS:

   ```sh
   mkdir -p ~/.warp/themes
   ```

   Linux:

   ```sh
   mkdir -p ${XDG_DATA_HOME:-$HOME/.local/share}/warp-terminal/themes
   ```

   Windows (PowerShell):

   ```powershell
   New-Item -Path "$env:APPDATA\warp\Warp\data\themes\" -ItemType Directory
   ```

2. Copy both theme files into it. On macOS, from the repository root:

   ```sh
   cp warp/gh44-dark.yaml warp/gh44-light.yaml ~/.warp/themes/
   ```

3. Open **Settings → Appearance → Themes** and pick **gh44 Dark**. For the
   font, see [Font](#font).

Warp can take a few minutes to notice a new themes folder the first time.
Restarting Warp speeds that up.

## Font

gh44 uses Lilex for code, the font Zed ships as `.ZedMono`. Warp themes can't
set a font, so set it once:

1. Install Lilex from [`fonts/`](../fonts/). On macOS, from the repository root:

   ```sh
   cp fonts/Lilex/*.ttf ~/Library/Fonts/
   ```

2. Restart Warp, open **Settings → Appearance → Text** and pick **Lilex** as
   the terminal font.

## Editing

The YAML files are generated. Change `palette/tokens.json` and run
`node scripts/build.mjs` from the repository root.
