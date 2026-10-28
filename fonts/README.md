# gh44 fonts

The fonts the gh44 themes are set up for.

| Font                                                 | Folder                             | Use  | License                      |
| ---------------------------------------------------- | ---------------------------------- | ---- | ---------------------------- |
| [JetBrains Mono](https://www.jetbrains.com/lp/mono/) | [`JetBrainsMono/`](JetBrainsMono/) | Code | [OFL](JetBrainsMono/OFL.txt) |

Each font ships as a variable font, so one file covers every weight.

## Install

macOS: open each `.ttf` file and click **Install Font**, or copy them in:

```sh
cp fonts/JetBrainsMono/*.ttf ~/Library/Fonts/
```

Linux:

```sh
mkdir -p ~/.local/share/fonts && cp fonts/JetBrainsMono/*.ttf ~/.local/share/fonts/ && fc-cache -f
```

Windows: right-click each `.ttf` file and choose **Install**.
