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

## Code colors

Herdr's Files panel colors code from terminal colors. To use the same code colors as Zed,
clone the panel's mod and point it at [`gh44-syntax.js`](gh44-syntax.js). From the repository root:

```sh
herdr-app do mod.clone '{"name":"files","as":"gh44-files"}'
cp herdr/gh44-syntax.js ~/.config/herdr-app/mods/gh44-files/
cd ~/.config/herdr-app/mods/gh44-files
sed -i '' -e '1a\
import { gh44Syntax } from "./gh44-syntax.js";' -e 's/syntax: { keyword: t.ansi5/syntax: gh44Syntax(t) ?? { keyword: t.ansi5/' main.js
herdr-app check .
```

Then use `gh44-files` in place of `files` in your layout (`"content": { "mod": "gh44-files" }`).
Other themes keep Herdr's own code colors. After `node scripts/build.mjs`, copy
`gh44-syntax.js` again.

## Edit

These files are generated. Edit [`palette/tokens.json`](../palette/tokens.json) and run `node scripts/build.mjs` from the repository root.
