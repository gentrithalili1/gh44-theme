# gh44 theme

One theme, every tool.

| Folder                 | What's inside                                                  |
| ---------------------- | -------------------------------------------------------------- |
| [`zed/`](zed/)         | Editor theme for Zed                                           |
| [`warp/`](warp/)       | Terminal theme for Warp                                        |
| [`slack/`](slack/)     | Sidebar theme for Slack                                        |
| [`linear/`](linear/)   | Interface theme for Linear                                     |
| [`chrome/`](chrome/)   | Browser theme for Chrome                                       |
| [`github/`](github/)   | Stylus userstyle for GitHub                                    |
| [`palette/`](palette/) | Every color with hex values, plus `gh44.css` for web projects  |
| [`fonts/`](fonts/)     | JetBrains Mono, the font the themes are set up for             |

Each folder has its own README with a preview and install steps.

## How it's built

[`palette/tokens.json`](palette/tokens.json) is the only file to edit. One
command rebuilds every theme and preview:

```sh
node scripts/build.mjs
```

## License

MIT
