# gh44 fonts

The fonts the gh44 themes are set up for.

| Font                                                         | Folder                         | Use  | License                    |
| ------------------------------------------------------------ | ------------------------------ | ---- | -------------------------- |
| [Lilex](https://github.com/mishamyrt/Lilex)                  | [`Lilex/`](Lilex/)             | Code | [OFL](Lilex/OFL.txt)       |
| [IBM Plex Sans](https://github.com/IBM/plex)                 | [`IBMPlexSans/`](IBMPlexSans/) | Text | [OFL](IBMPlexSans/OFL.txt) |

Each font ships as a variable font, so one file covers every weight. They're
the same fonts Zed ships as `.ZedMono` and `.ZedSans`. The variable IBM Plex
Sans installs as **IBM Plex Sans Var**; the themes accept either name.

## Install

macOS: open each `.ttf` file and click **Install Font**, or copy them in:

```sh
cp fonts/Lilex/*.ttf fonts/IBMPlexSans/*.ttf ~/Library/Fonts/
```

Linux:

```sh
mkdir -p ~/.local/share/fonts && cp fonts/Lilex/*.ttf fonts/IBMPlexSans/*.ttf ~/.local/share/fonts/ && fc-cache -f
```

Windows: right-click each `.ttf` file and choose **Install**.

## Per app

| App                | Code  | Text          | How                                                       |
| ------------------ | ----- | ------------- | --------------------------------------------------------- |
| Zed                | Lilex | IBM Plex Sans | Bundled as `.ZedMono` / `.ZedSans`, see `zed/README.md`   |
| Warp               | Lilex | -             | Settings → Appearance → Text → Terminal font              |
| GitHub, Linear     | Lilex | Site's own    | The gh44 userstyles set code blocks and diffs             |
| shadcn/ui, web     | Lilex | IBM Plex Sans | `font-mono` and `font-sans`, or `--gh44-font-*` variables |
| Chrome, Slack      | -     | -             | Themes can't set fonts                                    |
