#!/usr/bin/env node
// Build every gh44 theme from palette/tokens.json.
//
// Run from the repository root:  node scripts/build.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { crc32, deflateSync } from 'node:zlib'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const TOKENS = JSON.parse(readFileSync(join(ROOT, 'palette', 'tokens.json'), 'utf8'))
// Each variant has neutral colors named by job (bg, fg, border) and hues named by color.
// Themes read one flat map per variant: VARIANTS.dark.bg, VARIANTS.dark.lavender.
const VARIANTS = Object.fromEntries(
  Object.entries(TOKENS.variants).map(([variant, { neutral, hue }]) => [variant, { ...neutral, ...hue }]),
)
const ROLES = TOKENS.roles
const NAMES = { dark: 'gh44 Dark', light: 'gh44 Light' }
const VARIANT_ORDER = ['dark', 'light']
const ANSI_ORDER = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']
const TRANSPARENT = '#00000000'

const hex2 = (n) => Math.round(n).toString(16).toUpperCase().padStart(2, '0')
const channels = (color) => [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16))

function mix({ from, to, amount }) {
  const a = channels(from)
  const b = channels(to)
  return '#' + a.map((x, i) => hex2(x + (b[i] - x) * amount)).join('')
}

function alpha({ color, amount }) {
  return color + hex2(amount * 255)
}

function write({ path, content }) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
  return path
}

// 16 ANSI colors shared by Zed's terminal and Warp.

function ansi({ variant }) {
  const c = VARIANTS[variant]
  const isDark = variant === 'dark'
  const normal = {
    black: isDark ? c['surface-active'] : c.fg,
    red: c.red,
    green: c.sage,
    yellow: c.ochre,
    blue: c.sky,
    magenta: c.lavender,
    cyan: c.seafoam,
    white: isDark ? c.fg : c.border,
  }
  const bright = {}
  for (const [key, color] of Object.entries(normal)) {
    bright[key] = isDark
      ? mix({ from: color, to: '#FFFFFF', amount: 0.25 })
      : mix({ from: color, to: '#000000', amount: 0.18 })
  }
  bright.black = c['fg-subtle']
  bright.white = isDark ? c.fg : c.bg
  return { normal, bright }
}

// ---------------------------------------------------------------- Code

function codeColors({ variant }) {
  const c = VARIANTS[variant]
  return {
    fg: c['fg-code'],
    lineNumber: c['fg-faint'],
    added: c.sage,
    deleted: c.red,
    modified: c.sky,
    addedLine: alpha({ color: c.sage, amount: 0.12 }),
    deletedLine: alpha({ color: c.red, amount: 0.12 }),
    modifiedLine: alpha({ color: c.sky, amount: 0.12 }),
    addedWord: alpha({ color: c.sage, amount: 0.25 }),
    deletedWord: alpha({ color: c.red, amount: 0.25 }),
  }
}

// ---------------------------------------------------------------- Zed

function style(color, { isItalic = false, isBold = false } = {}) {
  return { color, font_style: isItalic ? 'italic' : null, font_weight: isBold ? 700 : null }
}

function zedTheme({ variant }) {
  const c = VARIANTS[variant]
  const isDark = variant === 'dark'
  const { normal, bright } = ansi({ variant })
  const code = codeColors({ variant })
  const a = (color, amount) => alpha({ color, amount })

  const s = {
    'background.appearance': 'opaque',
    accents: [c.clay, c.sage, c.lavender, c.sky, c.ochre, c.rose],

    border: c.border,
    'border.variant': c['border-subtle'],
    'border.focused': c.clay,
    'border.selected': a(c.clay, 0.6),
    'border.transparent': TRANSPARENT,
    'border.disabled': c['border-subtle'],

    background: c['bg-subtle'],
    'surface.background': c['bg-subtle'],
    'elevated_surface.background': c.surface,
    'element.background': c.surface,
    'element.hover': c['surface-hover'],
    'element.active': c['surface-active'],
    'element.selected': c['surface-active'],
    'element.disabled': c.surface,
    'drop_target.background': a(c.clay, 0.14),
    'ghost_element.background': TRANSPARENT,
    'ghost_element.hover': c.surface,
    'ghost_element.active': c['surface-hover'],
    'ghost_element.selected': c['surface-hover'],
    'ghost_element.disabled': TRANSPARENT,

    text: c.fg,
    'text.muted': c['fg-muted'],
    'text.placeholder': c['fg-subtle'],
    'text.disabled': c['fg-disabled'],
    'text.accent': c.clay,
    icon: c.fg,
    'icon.muted': c['fg-muted'],
    'icon.disabled': c['fg-disabled'],
    'icon.placeholder': c['fg-subtle'],
    'icon.accent': c.clay,
    'link_text.hover': c.clay,

    'title_bar.background': c['bg-subtle'],
    'title_bar.inactive_background': c['bg-subtle'],
    'status_bar.background': c['bg-subtle'],
    'toolbar.background': c.bg,
    'tab_bar.background': c['bg-subtle'],
    'tab.inactive_background': c['bg-subtle'],
    'tab.active_background': c.bg,
    'search.match_background': a(c.ochre, isDark ? 0.28 : 0.3),
    'panel.background': c['bg-subtle'],
    'panel.focused_border': a(c.clay, 0.7),
    'panel.indent_guide': c['border-subtle'],
    'panel.indent_guide_active': c.border,
    'panel.indent_guide_hover': c['fg-faint'],
    'panel.overlay_background': c.surface,
    'panel.overlay_hover': c['surface-hover'],
    'pane.focused_border': a(c.clay, 0.7),
    'pane_group.border': c['border-subtle'],

    'scrollbar.thumb.background': a(c['fg-muted'], 0.18),
    'scrollbar.thumb.hover_background': a(c['fg-muted'], 0.32),
    'scrollbar.thumb.active_background': a(c.clay, 0.45),
    'scrollbar.thumb.border': TRANSPARENT,
    'scrollbar.track.background': TRANSPARENT,
    'scrollbar.track.border': TRANSPARENT,
    'minimap.thumb.background': a(c['fg-muted'], 0.14),
    'minimap.thumb.hover_background': a(c['fg-muted'], 0.24),
    'minimap.thumb.active_background': a(c.clay, 0.3),
    'minimap.thumb.border': TRANSPARENT,

    'editor.foreground': code.fg,
    'editor.background': c.bg,
    'editor.gutter.background': c.bg,
    'editor.subheader.background': c['bg-subtle'],
    'editor.active_line.background': a(c.surface, isDark ? 0.75 : 0.6),
    'editor.highlighted_line.background': c.surface,
    'editor.debugger_active_line.background': a(c.ochre, 0.14),
    'editor.line_number': c['fg-faint'],
    'editor.active_line_number': c.fg,
    'editor.hover_line_number': c['fg-muted'],
    'editor.invisible': c['fg-disabled'],
    'editor.wrap_guide': c['border-subtle'],
    'editor.active_wrap_guide': c.border,
    'editor.indent_guide': c['border-subtle'],
    'editor.indent_guide_active': c.border,
    'editor.document_highlight.read_background': a(c.sky, 0.14),
    'editor.document_highlight.write_background': a(c.clay, 0.16),
    'editor.document_highlight.bracket_background': a(c.clay, 0.18),

    'terminal.background': c.bg,
    'terminal.foreground': c.fg,
    'terminal.bright_foreground': c.fg,
    'terminal.dim_foreground': c['fg-subtle'],
    'terminal.ansi.background': c.bg,

    'version_control.added': code.added,
    'version_control.modified': code.modified,
    'version_control.deleted': code.deleted,
    'version_control.word_added': code.addedWord,
    'version_control.word_deleted': code.deletedWord,
    'version_control.conflict_marker.ours': a(c.sage, 0.18),
    'version_control.conflict_marker.theirs': a(c.sky, 0.18),
  }
  for (const key of Object.keys(normal)) {
    s[`terminal.ansi.${key}`] = normal[key]
    s[`terminal.ansi.bright_${key}`] = bright[key]
    s[`terminal.ansi.dim_${key}`] = mix({ from: normal[key], to: c.bg, amount: 0.4 })
  }

  const statuses = [
    ['conflict', c.lavender], ['created', c.sage], ['deleted', c.red],
    ['error', c.red], ['hidden', c['fg-subtle']], ['hint', c['fg-subtle']],
    ['ignored', c['fg-faint']], ['info', c.sky], ['modified', c.sky],
    ['predictive', c['fg-subtle']], ['renamed', c.lavender], ['success', c.sage],
    ['unreachable', c['fg-subtle']], ['warning', c.ochre],
  ]
  for (const [key, color] of statuses) {
    s[key] = color
    s[`${key}.background`] = a(color, 0.12)
    s[`${key}.border`] = a(color, 0.45)
  }

  const players = [c.clay, c.sage, c.lavender, c.sky, c.ochre, c.rose, c.seafoam]
  s.players = players.map((p, i) => ({
    cursor: p,
    background: p,
    selection: i === 0 ? a(p, isDark ? 0.24 : 0.2) : a(p, 0.22),
  }))

  // Code roles. Swap hues here to try another mix.
  const r = {
    keyword: c.clay,
    function: c.sky,
    type: c.lavender,
    component: c.seafoam,
    string: c.sage,
    literal: c.rose,
  }
  s.syntax = {
    attribute: style(code.fg),
    boolean: style(r.literal),
    comment: style(c['fg-subtle']),
    'comment.doc': style(mix({ from: c['fg-subtle'], to: c.fg, amount: 0.25 })),
    constant: style(code.fg),
    'constant.builtin': style(r.literal),
    constructor: style(code.fg),
    embedded: style(code.fg),
    emphasis: style(c.rose, { isItalic: true }),
    'emphasis.strong': style(c.clay, { isBold: true }),
    enum: style(code.fg),
    function: style(r.function),
    hint: style(c['fg-subtle']),
    keyword: style(r.keyword),
    label: style(c.sky),
    link_text: style(c.lavender),
    link_uri: style(c.sage),
    namespace: style(code.fg),
    number: style(r.literal),
    operator: style(c['fg-muted']),
    predictive: style(c['fg-subtle']),
    preproc: style(r.keyword),
    primary: style(code.fg),
    property: style(code.fg),
    punctuation: style(c['fg-muted']),
    'punctuation.bracket': style(c['fg-muted']),
    'punctuation.delimiter': style(c['fg-muted']),
    'punctuation.list_marker': style(c.clay),
    'punctuation.markup': style(c.clay),
    'punctuation.special': style(c.rose),
    selector: style(c.clay),
    'selector.pseudo': style(c.sky),
    string: style(r.string),
    'string.escape': style(c.rose),
    'string.regex': style(c.rose),
    'string.special': style(c.rose),
    'string.special.symbol': style(c.seafoam),
    tag: style(r.keyword),
    'tag.component': style(r.component),
    'text.literal': style(r.string),
    title: style(c.clay, { isBold: true }),
    type: style(r.type),
    'type.class': style(r.component),
    'type.builtin': style(r.keyword),
    variable: style(code.fg),
    'variable.special': style(r.keyword),
    'variable.parameter': style(code.fg),
    variant: style(c.sky),
  }
  return { name: NAMES[variant], appearance: variant, style: s }
}

function buildZed() {
  const family = {
    $schema: 'https://zed.dev/schema/themes/v0.2.0.json',
    name: 'gh44',
    author: TOKENS.author,
    themes: VARIANT_ORDER.map((variant) => zedTheme({ variant })),
  }
  return write({ path: join(ROOT, 'zed', 'themes', 'gh44.json'), content: JSON.stringify(family, null, 2) + '\n' })
}

// ---------------------------------------------------------------- Warp

function buildWarp() {
  return VARIANT_ORDER.map((variant) => {
      const c = VARIANTS[variant]
      const { normal, bright } = ansi({ variant })
      const name = NAMES[variant]
      const lines = [
        `# ${name} for Warp. Generated by scripts/build.mjs; edit palette/tokens.json instead.`,
        `name: ${name}`,
        `accent: '${c.clay}'`,
        `cursor: '${c.clay}'`,
        `background: '${variant === 'dark' ? c.bg : c['bg-subtle']}'`,
        `foreground: '${c.fg}'`,
        `details: ${variant === 'dark' ? 'darker' : 'lighter'}`,
        'terminal_colors:',
        '  normal:',
        ...ANSI_ORDER.map((k) => `    ${k}: '${normal[k]}'`),
        '  bright:',
        ...ANSI_ORDER.map((k) => `    ${k}: '${bright[k]}'`),
      ]
      const file = `gh44-${variant}.yaml`
      return write({ path: join(ROOT, 'warp', file), content: lines.join('\n') + '\n' })
    })
}

// ---------------------------------------------------------------- Slack

// Slack's legacy theme format: 10 comma-separated colors.
// Order: column background, menu hover, active item, active item text, hover item,
// text, active presence, mention badge, top nav background, top nav text.
// Slack keeps one custom theme, so each variant is its own line, pasted by hand.
// The mention badge carries Slack's white text, so it uses gh44 Light's deep clay.
function slackString({ variant }) {
  const c = VARIANTS[variant]
  const deep = VARIANTS.light
  return [
    c['bg-subtle'], c.surface, c['surface-active'], c.fg, c.surface,
    c.fg, c.sage, deep.clay, c.bg, c.fg,
  ].join(',')
}

function buildSlack() {
  return VARIANT_ORDER.map((variant) =>
    write({ path: join(ROOT, 'slack', `gh44-${variant}.txt`), content: slackString({ variant }) + '\n' }),
  )
}

// ---------------------------------------------------------------- Linear

// sRGB hex to CSS lch() (CIE LCH, D50), the color space Linear's theme generator uses.
function lch(color) {
  const [r, g, b] = channels(color).map((v) => {
    const x = v / 255
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
  })
  // Linear sRGB to XYZ D50 (Bradford-adapted from D65).
  const xyz = [
    0.4360747 * r + 0.3850649 * g + 0.1430804 * b,
    0.2225045 * r + 0.7168786 * g + 0.0606169 * b,
    0.0139322 * r + 0.0971045 * g + 0.7141733 * b,
  ]
  const white = [0.96422, 1, 0.82521]
  const [fx, fy, fz] = xyz.map((v, i) => {
    const t = v / white[i]
    return t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116
  })
  const l = 116 * fy - 16
  const a = 500 * (fx - fy)
  const bb = 200 * (fy - fz)
  const hue = (Math.atan2(bb, a) * 180) / Math.PI
  const round = (n) => Math.round(n * 1000) / 1000
  return [round(l), round(Math.hypot(a, bb)), round((hue + 360) % 360), 1]
}

// Linear's custom theme import: base, accent, and contrast, with the same for the sidebar.
// Linear derives every other color from these.
function linearTheme({ variant }) {
  const c = VARIANTS[variant]
  const contrast = 30
  return {
    base: lch(c.bg),
    accent: lch(c.lavender),
    contrast,
    sidebar: { base: lch(c['bg-subtle']), accent: lch(c.lavender), contrast },
  }
}

// Linear's theme doesn't reach code blocks, so they get a Stylus userstyle instead.
// Linear colors code two ways, and the userstyle covers both:
// - Editor code blocks and diffs: one span per token whose class is the TextMate
//   scope, like <span class="syntax-keyword-control-import">.
// - Read-only <pre> blocks: spans with an inline color, like
//   <span class="sx-14rh7hd" style="--x-color: #E394DC">.
// Scopes match by prefix, like editor themes. Later, longer prefixes win, so keep
// each one after the shorter prefix it refines. Each entry is [scope prefix, Zed scope].
const LINEAR_SYNTAX_SCOPES = [
  ['comment', 'comment'],
  ['string', 'string'],
  ['string-regexp', 'string.regex'],
  ['constant', 'constant'],
  ['constant-numeric', 'number'],
  ['constant-language', 'boolean'],
  ['keyword', 'keyword'],
  ['keyword-operator', 'operator'],
  ['storage', 'keyword'],
  ['variable', 'variable'],
  ['variable-parameter', 'variable.parameter'],
  ['variable-other-property', 'property'],
  ['variable-other-object-property', 'property'],
  // Linear tags every const local this way; Zed only colors real constants.
  ['variable-other-constant', 'variable'],
  ['support-variable-property', 'property'],
  ['meta-object-literal-key', 'property'],
  ['entity-name-function', 'function'],
  ['support-function', 'function'],
  ['entity-name-type', 'type'],
  ['entity-name-class', 'type.class'],
  ['entity-other-inherited-class', 'type.class'],
  ['support-type', 'type'],
  ['support-type-primitive', 'type.builtin'],
  ['support-class', 'type'],
  ['entity-name-tag', 'tag'],
  ['support-class-component', 'tag.component'],
  ['entity-other-attribute-name', 'attribute'],
  ['punctuation', 'punctuation'],
  ['markup-heading', 'title'],
  ['markup-bold', 'emphasis.strong'],
  ['markup-italic', 'emphasis'],
  ['markup-quote', 'comment'],
  ['markup-underline-link', 'link_text'],
  ['markup-inline-raw', 'string'],
  ['markup-inserted', 'string'],
  ['markup-deleted', 'boolean'],
]
// Diff viewer: the wrapper span (dotted underline) around symbols Linear can link to.
const LINEAR_SYMBOL_LINK = 'sx-p9b3b8'
// Linear gives some Zed categories one class, so these tell them apart by the
// neighboring token. Each entry is [selector, Zed scope].
// Symbols Linear can link to sit inside a wrapper span, so each rule has both forms.
const LINEAR_OPERATOR = '[class^="syntax-keyword-operator"]'
const LINEAR_SYNTAX_CONTEXT = [
  // <Stack: a type right after the < operator is a JSX component.
  [
    [
      `${LINEAR_OPERATOR} + [class^="syntax-entity-name-type"]`,
      `${LINEAR_OPERATOR} + .${LINEAR_SYMBOL_LINK} > [class^="syntax-entity-name-type"]`,
    ],
    'tag.component',
  ],
  // gap="4": a property right before = is a JSX attribute.
  [
    [
      `[class^="syntax-variable-other-property"]:has(+ ${LINEAR_OPERATOR})`,
      `.${LINEAR_SYMBOL_LINK}:has(+ ${LINEAR_OPERATOR}) > [class^="syntax-variable-other-property"]`,
    ],
    'attribute',
  ],
]
// Read-only blocks: [Zed scope, Linear's light and dark inline colors].
const LINEAR_INLINE_COLORS = [
  ['keyword', ['#9532A4', '#E394DC']],
  ['string', ['#025F8C', '#00C5F0']],
  ['boolean', ['#BF1420', '#EC3B40']],
  ['function', ['#00755C', '#25F8CA']],
  ['type', ['#A74002', '#EB6E3D']],
  ['property', ['#8A5D00', '#FCE27D']],
  ['number', ['#00264D', '#2482D8']],
]
// In read-only blocks, comments, meta and tags use classes for Linear's muted label color.
const LINEAR_CODE_MUTED = ['sx-d5ldbw', 'sx-sy73al']
const LINEAR_CODE_TOKEN = 'sx-14rh7hd'

function linearVariantCss({ variant }) {
  const c = VARIANTS[variant]
  const { syntax } = zedTheme({ variant }).style
  const rule = ({ selectors, name }) => {
    const st = syntax[name]
    const decls = [`color: ${st.color} !important;`]
    decls.push(`font-style: ${st.font_style ?? 'normal'} !important;`)
    if (st.font_weight) decls.push(`font-weight: ${st.font_weight} !important;`)
    return `  ${selectors.join(',\n  ')} {\n    ${decls.join('\n    ')}\n  }`
  }
  const scopeRules = LINEAR_SYNTAX_SCOPES.map(([prefix, name]) =>
    rule({ selectors: [`[class^="syntax-${prefix}"]`, `[class*=" syntax-${prefix}"]`], name }),
  )
  const block = ':is(pre, code)'
  const inlineRules = LINEAR_INLINE_COLORS.map(([name, colors]) =>
    rule({
      selectors: colors.map((hex) => `${block} .${LINEAR_CODE_TOKEN}[style*="${hex}" i]`),
      name,
    }),
  )
  const mutedRule = rule({
    selectors: LINEAR_CODE_MUTED.map((cls) => `${block} .${cls}`),
    name: 'comment',
  })
  const contextRules = LINEAR_SYNTAX_CONTEXT.map(([selectors, name]) => rule({ selectors, name }))
  const rules = [...scopeRules, ...contextRules, mutedRule, ...inlineRules]
  // The diff viewer reads --diff-view-* variables that Linear sets at runtime. Set them
  // on every element so they win over whichever ancestor Linear puts them on.
  const code = codeColors({ variant })
  const diffVars = {
    'editor-background': c.bg,
    'editor-background-opaque': c.bg,
    'editor-foreground': code.fg,
    'line-number-fg': code.lineNumber,
    'blank-bg': c['bg-subtle'],
    'focus-bg': c['surface-hover'],
    'git-added-fg': code.added,
    'git-deleted-fg': code.deleted,
    'git-modified-fg': code.modified,
    'inserted-bg': code.addedLine,
    'inserted-full-line-bg': code.addedLine,
    'inserted-inline-bg': code.addedWord,
    'removed-bg': code.deletedLine,
    'removed-full-line-bg': code.deletedLine,
    'removed-inline-bg': code.deletedWord,
  }
  const diffRule = [
    '  /* Diff viewer */',
    '  * {',
    ...Object.entries(diffVars).map(([name, value]) => `    --diff-view-${name}: ${value} !important;`),
    '  }',
    '',
    '  [data-diff-sticky-window] {',
    `    background-color: ${c.bg} !important;`,
    '  }',
    '',
    // Linear underlines every symbol it can link to with a dotted border; Zed doesn't.
    `  [data-line-text] .${LINEAR_SYMBOL_LINK} {`,
    '    border-bottom-color: transparent !important;',
    '  }',
    '',
    `  [data-line-text] .${LINEAR_SYMBOL_LINK}:hover {`,
    `    border-bottom-color: ${c['fg-subtle']} !important;`,
    '  }',
  ].join('\n')
  const body = [
    '  pre,',
    '  pre code {',
    `    background-color: ${c['bg-subtle']} !important;`,
    `    color: ${c.fg} !important;`,
    '  }',
    '',
    rules.join('\n\n'),
    '',
    diffRule,
  ].join('\n')
  const indent = (text) => text.split('\n').map((line) => (line ? `  ${line}` : line)).join('\n')
  // Each variant only applies in its own system mode, so one style follows the system.
  return [`  @media (prefers-color-scheme: ${variant}) {`, indent(body), '  }'].join('\n')
}

function linearUserCss() {
  return [
    '/* ==UserStyle==',
    `@name         gh44 for Linear code blocks`,
    '@namespace    gh44',
    `@version      ${TOKENS.version}`,
    `@description  gh44 syntax colors for Linear's code blocks and diffs. Follows your system appearance. Generated by scripts/build.mjs.`,
    `@author       ${TOKENS.author}`,
    '==/UserStyle== */',
    '',
    '@-moz-document domain("linear.app") {',
    '  /* Code font */',
    '  pre,',
    '  code,',
    '  [data-line-text] {',
    `    font-family: ${TOKENS.font.mono.stack} !important;`,
    '  }',
    '',
    VARIANT_ORDER.map((variant) => linearVariantCss({ variant })).join('\n\n'),
    '}',
    '',
  ].join('\n')
}

// A custom theme per variant, imported by hand. The userstyle follows the system.
function buildLinear() {
  return [
    ...VARIANT_ORDER.map((variant) =>
      write({
        path: join(ROOT, 'linear', `gh44-${variant}.json`),
        content: JSON.stringify(linearTheme({ variant })) + '\n',
      }),
    ),
    write({ path: join(ROOT, 'linear', 'gh44.user.css'), content: linearUserCss() }),
  ]
}

// ---------------------------------------------------------------- Chrome

const rgb = (color) => channels(color)

// Chrome themes don't follow the system mode, so each variant is its own extension.
function chromeManifest({ variant }) {
  const c = VARIANTS[variant]
  const isDark = variant === 'dark'
  // The tab strip sits behind the active tab, which shares the toolbar color.
  const frame = isDark ? c.bg : c.surface
  const toolbar = isDark ? c.surface : c.bg
  const omnibox = isDark ? c.bg : c['bg-subtle']
  return {
    manifest_version: 3,
    name: NAMES[variant],
    version: TOKENS.version,
    description: `${NAMES[variant]} for Chrome: warm neutrals with clay accents.`,
    icons: { 128: 'icon-128.png' },
    theme: {
      colors: {
        frame: rgb(frame),
        frame_inactive: rgb(frame),
        frame_incognito: rgb(frame),
        frame_incognito_inactive: rgb(frame),
        toolbar: rgb(toolbar),
        toolbar_text: rgb(c.fg),
        toolbar_button_icon: rgb(c['fg-muted']),
        tab_text: rgb(c.fg),
        tab_background_text: rgb(c['fg-muted']),
        tab_background_text_inactive: rgb(c['fg-subtle']),
        tab_background_text_incognito: rgb(c['fg-muted']),
        tab_background_text_incognito_inactive: rgb(c['fg-subtle']),
        bookmark_text: rgb(c.fg),
        omnibox_background: rgb(omnibox),
        omnibox_text: rgb(c.fg),
        ntp_background: rgb(c.bg),
        ntp_text: rgb(c.fg),
        ntp_link: rgb(c.clay),
      },
    },
  }
}

// The Chrome Web Store needs a 128px icon: a clay dot on the variant's background.
function chromeIcon({ variant }) {
  const c = VARIANTS[variant]
  const size = 128
  const [bg, dot] = [channels(c.bg), channels(c.clay)]
  const row = (y) => {
    const pixels = Array.from({ length: size }, (_, x) => {
      const isDot = Math.hypot(x + 0.5 - size / 2, y + 0.5 - size / 2) < size * 0.3
      return isDot ? dot : bg
    })
    return Buffer.from([0, ...pixels.flat()])
  }
  const raw = Buffer.concat(Array.from({ length: size }, (_, y) => row(y)))
  const chunk = (type, data) => {
    const body = Buffer.concat([Buffer.from(type), data])
    const length = Buffer.alloc(4)
    length.writeUInt32BE(data.length)
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(body))
    return Buffer.concat([length, body, crc])
  }
  const header = Buffer.alloc(13)
  header.writeUInt32BE(size, 0)
  header.writeUInt32BE(size, 4)
  header.set([8, 2, 0, 0, 0], 8)
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function buildChrome() {
  return VARIANT_ORDER.flatMap((variant) => {
      const dir = join(ROOT, 'chrome', `gh44-${variant}`)
      return [
        write({
          path: join(dir, 'manifest.json'),
          content: JSON.stringify(chromeManifest({ variant }), null, 2) + '\n',
        }),
        write({ path: join(dir, 'icon-128.png'), content: chromeIcon({ variant }) }),
      ]
    })
}

// ---------------------------------------------------------------- GitHub

// GitHub's UI reads Primer CSS variables, so the userstyle only overrides those.
// Primer sets them per theme on [data-color-mode], which is why every value is !important.
function githubVars({ variant }) {
  const c = VARIANTS[variant]
  const isDark = variant === 'dark'
  const { syntax } = zedTheme({ variant }).style
  const code = codeColors({ variant })
  const a = (color, amount) => alpha({ color, amount })
  const shade = (color, amount) => mix({ from: color, to: isDark ? '#FFFFFF' : '#000000', amount })
  const inset = isDark ? mix({ from: c.bg, to: '#000000', amount: 0.2 }) : c['bg-subtle']
  // Solid fills (badges, primary button, toggles) use gh44 Light's deeper colors in
  // both variants, so they carry light text and read as real color on charcoal.
  const deep = VARIANTS.light
  const onEmphasis = deep.bg
  const states = {
    accent: 'sky',
    success: 'sage',
    open: 'sage',
    attention: 'ochre',
    danger: 'red',
    closed: 'red',
    done: 'lavender',
    upsell: 'lavender',
    severe: 'clay',
    sponsors: 'rose',
  }
  const contribution = [0.25, 0.5, 0.75, 1].map((amount) =>
    mix({ from: c['bg-subtle'], to: c.sage, amount }),
  )
  return {
    'bgColor-default': c.bg,
    'bgColor-muted': c['bg-subtle'],
    'bgColor-inset': inset,
    'bgColor-emphasis': isDark ? c.border : c.fg,
    'bgColor-inverse': c.fg,
    'bgColor-disabled': c.surface,
    'bgColor-neutral-emphasis': isDark ? c['fg-faint'] : c['fg-subtle'],
    'bgColor-neutral-muted': a(c['fg-subtle'], 0.2),
    ...Object.fromEntries(
      Object.entries(states).flatMap(([state, hue]) => [
        [`bgColor-${state}-emphasis`, deep[hue]],
        [`bgColor-${state}-muted`, a(deep[hue], isDark ? 0.3 : 0.15)],
        [`borderColor-${state}-emphasis`, c[hue]],
        [`borderColor-${state}-muted`, a(c[hue], 0.4)],
        [`fgColor-${state}`, c[hue]],
      ]),
    ),

    'fgColor-default': c.fg,
    'fgColor-muted': c['fg-muted'],
    'fgColor-neutral': c['fg-muted'],
    'fgColor-disabled': c['fg-disabled'],
    'fgColor-link': c.sky,
    'fgColor-onEmphasis': onEmphasis,
    'fgColor-onInverse': c.bg,

    'borderColor-default': c.border,
    'borderColor-muted': c['border-subtle'],
    'borderColor-emphasis': c['fg-faint'],
    'borderColor-disabled': a(c['fg-disabled'], 0.2),

    'control-bgColor-rest': c.surface,
    'control-bgColor-hover': c['surface-hover'],
    'control-bgColor-active': c['surface-active'],
    'control-bgColor-disabled': c['bg-subtle'],
    'control-borderColor-selected': c.fg,
    'control-checked-bgColor-rest': deep.sky,
    'control-checked-bgColor-hover': shade(deep.sky, 0.1),
    'control-checked-bgColor-active': shade(deep.sky, 0.2),
    'control-checked-borderColor-rest': deep.sky,
    'control-danger-fgColor-rest': c.red,
    'control-danger-fgColor-hover': shade(c.red, 0.15),
    'control-danger-bgColor-hover': a(c.red, 0.15),
    'control-danger-bgColor-active': a(c.red, 0.4),
    'control-transparent-bgColor-hover': a(c['fg-subtle'], 0.2),
    'control-transparent-bgColor-active': a(c['fg-subtle'], 0.25),
    'control-transparent-bgColor-selected': a(c['fg-subtle'], 0.2),
    'controlKnob-bgColor-rest': c['surface-hover'],
    'controlKnob-bgColor-checked': onEmphasis,
    'controlTrack-bgColor-rest': inset,
    'controlTrack-bgColor-hover': c['surface-hover'],
    'controlTrack-bgColor-active': c['surface-active'],

    'button-primary-bgColor-rest': deep.sage,
    'button-primary-bgColor-hover': shade(deep.sage, 0.1),
    'button-primary-bgColor-active': shade(deep.sage, 0.2),
    'button-primary-bgColor-disabled': a(deep.sage, 0.4),
    'button-primary-borderColor-disabled': a(deep.sage, 0.4),
    'button-danger-fgColor-rest': c.red,
    'button-danger-iconColor-rest': c.red,
    'button-danger-bgColor-hover': deep.red,
    'button-danger-bgColor-active': shade(deep.red, 0.1),
    'button-danger-fgColor-hover': onEmphasis,
    'button-danger-iconColor-hover': onEmphasis,
    'button-primary-fgColor-rest': onEmphasis,
    'button-primary-fgColor-disabled': a(onEmphasis, 0.6),
    'button-primary-iconColor-rest': onEmphasis,
    'buttonCounter-default-bgColor-rest': c['surface-active'],
    'buttonCounter-primary-bgColor-rest': a(c.bg, 0.2),
    'buttonKeybindingHint-default-bgColor-rest': c['surface-active'],
    'buttonKeybindingHint-inactive-bgColor': c['surface-active'],

    'header-bgColor': a(c['bg-subtle'], 0.95),
    'header-borderColor-divider': c['fg-faint'],
    'header-fgColor-default': c['fg-muted'],
    'header-fgColor-logo': c.fg,
    'headerSearch-bgColor': c.bg,
    'headerSearch-borderColor': c['surface-active'],

    'overlay-bgColor': c['bg-subtle'],
    'overlay-backdrop-bgColor': a(c.bg, 0.6),
    'menu-bgColor-active': c.surface,
    'sideNav-bgColor-selected': c.surface,
    'timelineBadge-bgColor': c.surface,
    'selectMenu-bgColor-active': a(c.sky, 0.2),
    'selection-bgColor': a(c.sky, isDark ? 0.35 : 0.25),
    'underlineNav-borderColor-active': c.clay,
    'highlight-neutral-bgColor': a(c.ochre, 0.4),
    'skeletonLoader-bgColor': a(c['fg-subtle'], 0.2),
    'reactionButton-selected-bgColor-rest': a(c.sky, 0.2),
    'reactionButton-selected-bgColor-hover': a(c.sky, 0.35),
    'reactionButton-selected-fgColor-hover': c.sky,

    'contribution-default-bgColor-0': c['bg-subtle'],
    ...Object.fromEntries(contribution.map((color, i) => [`contribution-default-bgColor-${i + 1}`, color])),

    'codeMirror-fgColor': code.fg,
    'codeMirror-lineNumber-fgColor': code.lineNumber,
    'codeMirror-matchingBracket-fgColor': code.fg,

    'diffBlob-additionLine-bgColor': code.addedLine,
    'diffBlob-additionNum-bgColor': code.addedWord,
    'diffBlob-additionWord-bgColor': code.addedWord,
    'diffBlob-deletionLine-bgColor': code.deletedLine,
    'diffBlob-deletionNum-bgColor': code.deletedWord,
    'diffBlob-deletionWord-bgColor': code.deletedWord,
    ...Object.fromEntries(
      ['addition', 'deletion'].flatMap((kind) =>
        ['Line', 'Num', 'Word'].map((part) => [`diffBlob-${kind}${part}-fgColor`, code.fg]),
      ),
    ),
    'diffBlob-hunkLine-bgColor': a(c.sky, 0.15),
    'diffBlob-hunkNum-bgColor-rest': a(c.sky, 0.3),
    'diffBlob-hunkNum-bgColor-hover': c.sky,

    'prettylights-syntax-comment': syntax.comment.color,
    // GitHub's TSX highlighting gives attributes, operators, properties and constants one
    // class (pl-c1), PascalCase names another (pl-v) and types a third (pl-smi). These
    // pick the Zed color that matches most of what each class covers in JSX.
    'prettylights-syntax-constant': code.fg,
    'prettylights-syntax-constantOtherReferenceLink': syntax.link_text.color,
    'prettylights-syntax-entity': syntax.function.color,
    'prettylights-syntax-entityTag': syntax.tag.color,
    'prettylights-syntax-keyword': syntax.keyword.color,
    'prettylights-syntax-string': syntax.string.color,
    'prettylights-syntax-stringRegexp': syntax['string.regex'].color,
    'prettylights-syntax-variable': syntax['tag.component'].color,
    'prettylights-syntax-storageModifierImport': syntax.type.color,
    'prettylights-syntax-bracketHighlighterAngle': c['fg-muted'],
    'prettylights-syntax-bracketHighlighterUnmatched': c.red,
    'prettylights-syntax-sublimeLinterGutterMark': c.border,
    'prettylights-syntax-metaDiffRange': c.lavender,
    'prettylights-syntax-markup-heading': syntax.title.color,
    'prettylights-syntax-markup-list': syntax['punctuation.list_marker'].color,
    'prettylights-syntax-markup-bold': c.fg,
    'prettylights-syntax-markup-italic': c.fg,
    'prettylights-syntax-markup-inserted-bg': code.addedLine,
    'prettylights-syntax-markup-inserted-text': code.added,
    'prettylights-syntax-markup-deleted-bg': code.deletedLine,
    'prettylights-syntax-markup-deleted-text': code.deleted,
    'prettylights-syntax-markup-changed-bg': code.modifiedLine,
    'prettylights-syntax-markup-changed-text': code.modified,
    'prettylights-syntax-markup-ignored-bg': a(c.sky, 0.15),
    'prettylights-syntax-markup-ignored-text': c.sky,

    'codeMirror-syntax-fgColor-comment': syntax.comment.color,
    'codeMirror-syntax-fgColor-constant': syntax.constant.color,
    'codeMirror-syntax-fgColor-entity': syntax.function.color,
    'codeMirror-syntax-fgColor-keyword': syntax.keyword.color,
    'codeMirror-syntax-fgColor-storage': syntax.keyword.color,
    'codeMirror-syntax-fgColor-string': syntax.string.color,
    'codeMirror-syntax-fgColor-support': syntax.type.color,
    'codeMirror-syntax-fgColor-variable': syntax['variable.parameter'].color,
  }
}

// Follows GitHub's own appearance setting: dark, light, or sync with system.
function githubUserCss() {
  const block = ({ selector, variant, indent }) => {
    const pad = ' '.repeat(indent)
    const decls = Object.entries(githubVars({ variant })).map(
      ([name, value]) => `${pad}  --${name}: ${value} !important;`,
    )
    return [
      `${pad}${selector} {`,
      `${pad}  color-scheme: ${variant};`,
      ...decls,
      `${pad}}`,
    ].join('\n')
  }
  return [
    '/* ==UserStyle==',
    `@name         gh44 for GitHub`,
    '@namespace    gh44',
    `@version      ${TOKENS.version}`,
    '@description  gh44 colors for GitHub. Follows your GitHub appearance setting. Generated by scripts/build.mjs.',
    `@author       ${TOKENS.author}`,
    '==/UserStyle== */',
    '',
    '@-moz-document domain("github.com") {',
    '  /* Code font */',
    '  :root {',
    `    --fontStack-monospace: ${TOKENS.font.mono.stack} !important;`,
    '  }',
    '',
    block({ selector: '[data-color-mode="dark"]', variant: 'dark', indent: 2 }),
    '',
    block({ selector: '[data-color-mode="light"]', variant: 'light', indent: 2 }),
    '',
    '  @media (prefers-color-scheme: dark) {',
    block({ selector: '[data-color-mode="auto"]', variant: 'dark', indent: 4 }),
    '  }',
    '',
    '  @media (prefers-color-scheme: light) {',
    block({ selector: '[data-color-mode="auto"]', variant: 'light', indent: 4 }),
    '  }',
    '}',
    '',
  ].join('\n')
}

function buildGithub() {
  return [write({ path: join(ROOT, 'github', 'gh44.user.css'), content: githubUserCss() })]
}

// ---------------------------------------------------------------- README images

const MONO = TOKENS.font.mono.stack.replaceAll('"', "'")
const SANS = TOKENS.font.sans.stack.replaceAll('"', "'")
const CHAR_WIDTH = 8.4 // Lilex at 14px
const LINE_HEIGHT = 24
const TOP = 76
const GUTTER = 84
const ITALIC = ' font-style="italic"'

// Made-up React component for the Zed preview. Each line is a list of [text, Zed syntax scope].
// Plain text (spaces, names Zed leaves uncolored) uses null.
const kw = (text) => [text, 'keyword']
const punc = (text) => [text, 'punctuation']
const ZED_SAMPLE = [
  [kw('import'), punc(' { '), ['useState', 'function'], punc(' } '), kw('from'), [' ', null], ["'react'", 'string']],
  [],
  [kw('interface'), [' ', null], ['BadgeProps', 'type'], punc(' {')],
  [['  label', 'property'], punc(': '), ['string', 'type.builtin']],
  [['  count', 'property'], punc(': '), ['number', 'type.builtin']],
  [['  isActive', 'property'], punc('?: '), ['boolean', 'type.builtin']],
  [punc('}')],
  [],
  [['// Keeps the badge short: 120 becomes 99+', 'comment']],
  [kw('const'), [' ', null], ['formatCount', 'function'], [' ', null], ['=', 'operator'], punc(' ('),
    ['count', 'variable.parameter'], punc(': '), ['number', 'type.builtin'], punc(') '), ['=>', 'operator'],
    [' ', null], ['count', 'variable'], [' ', null], ['>', 'operator'], [' ', null], ['99', 'number'],
    [' ', null], ['?', 'operator'], [' ', null], ["'99+'", 'string'], [' ', null], [':', 'operator'],
    [' ', null], ['String', 'type'], punc('('), ['count', 'variable'], punc(')')],
  [],
  [kw('export'), [' ', null], kw('function'), [' ', null], ['Badge', 'function'], punc('({ '),
    ['label', 'variable.parameter'], punc(', '), ['count', 'variable.parameter'], punc(', '),
    ['isActive', 'variable.parameter'], [' ', null], ['=', 'operator'], [' ', null], ['false', 'boolean'],
    punc(' }: '), ['BadgeProps', 'type'], punc(') {')],
  [['  ', null], kw('const'), punc(' ['), ['isOpen', 'variable'], punc(', '), ['setIsOpen', 'function'],
    punc('] '), ['=', 'operator'], [' ', null], ['useState', 'function'], punc('('), ['false', 'boolean'], punc(')')],
  [],
  [['  ', null], kw('return'), punc(' (')],
  [['    ', null], punc('<'), ['button', 'tag'], [' ', null], ['className', 'attribute'], ['=', 'operator'],
    ['"badge"', 'string'], [' ', null], ['onClick', 'attribute'], ['=', 'operator'], punc('{() '),
    ['=>', 'operator'], [' ', null], ['setIsOpen', 'function'], punc('(!'), ['isOpen', 'variable'], punc(')}>')],
  [['      ', null], punc('<'), ['Icon', 'tag.component'], [' ', null], ['name', 'attribute'],
    ['=', 'operator'], ['"bell"', 'string'], punc(' />')],
  [['      ', null], punc('<'), ['span', 'tag'], punc('>{'), ['label', 'variable'], punc('}</'), ['span', 'tag'], punc('>')],
  [['      ', null], punc('{'), ['isActive', 'variable'], [' ', null], ['&&', 'operator'], [' ', null], punc('<'),
    ['Count', 'tag.component'], [' ', null], ['value', 'attribute'], ['=', 'operator'], punc('{'),
    ['formatCount', 'function'], punc('('), ['count', 'variable'], punc(')} />}')],
  [['    ', null], punc('</'), ['button', 'tag'], punc('>')],
  [['  ', null], punc(')')],
  [punc('}')],
]

// Made-up terminal session for the Warp preview. Each piece is [text, ANSI color name or null].
const WARP_SAMPLE = [
  [['~/projects/forecast', 'blue'], ['  ', null], ['main', 'magenta']],
  [['❯ ', 'prompt'], ['git status --short', null]],
  [[' M ', 'red'], ['src/forecast.ts', null]],
  [['?? ', 'red'], ['src/units.ts', null]],
  [],
  [['~/projects/forecast', 'blue'], ['  ', null], ['main', 'magenta']],
  [['❯ ', 'prompt'], ['pnpm test', null]],
  [[' ✓ ', 'green'], ['src/forecast.test.ts ', null], ['(6 tests) ', 'black'], ['12ms', 'yellow']],
  [[' ✓ ', 'green'], ['src/units.test.ts ', null], ['(4 tests) ', 'black'], ['8ms', 'yellow']],
  [[' ✗ ', 'red'], ['src/alerts.test.ts ', null], ['(1 failed) ', 'red'], ['5ms', 'yellow']],
  [],
  [[' Tests  ', 'black'], ['10 passed', 'green'], [' | ', 'black'], ['1 failed', 'red'],
    [' (11)', 'black']],
]

const esc = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

// An editor or terminal window with colored lines of monospace text.
// Each line is a list of { text, color, isItalic } pieces.
function windowSvg({ variant, title, lines, hasLineNumbers, extraHeight = 0, extra = '' }) {
  const c = VARIANTS[variant]
  const left = hasLineNumbers ? GUTTER : 28
  const longest = Math.max(0, ...lines.map((line) => line.reduce((n, p) => n + [...p.text].length, 0)))
  const width = Math.round(left + longest * CHAR_WIDTH + 40)
  const height = TOP + lines.length * LINE_HEIGHT + 20 + extraHeight
  const rows = lines.flatMap((line, i) => {
    const y = TOP + i * LINE_HEIGHT
    const spans = line
      .map((p) => `<tspan fill="${p.color}"${p.isItalic ? ITALIC : ''}>${esc(p.text)}</tspan>`)
      .join('')
    const lineNumber = hasLineNumbers
      ? [`<text x="64" y="${y}" fill="${c['fg-faint']}" text-anchor="end">${i + 1}</text>`]
      : []
    return [...lineNumber, `<text x="${left}" y="${y}" xml:space="preserve">${spans}</text>`]
  })
  const dots = [c.clay, c.ochre, c.sage]
    .map((col, i) => `<circle cx="${28 + i * 20}" cy="24" r="6" fill="${col}"/>`)
    .join('')
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}" font-family="${MONO}" font-size="14">` +
    `<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="12" ` +
    `fill="${c.bg}" stroke="${c.border}"/>` +
    `<path d="M1 48 H${width - 1}" stroke="${c['border-subtle']}"/>${dots}` +
    `<text x="${width / 2}" y="29" fill="${c['fg-muted']}" text-anchor="middle" ` +
    `font-family="${SANS}" font-size="13">${esc(title)}</text>` +
    `${rows.join('')}${extra}</svg>\n`
  )
}

function zedPreviewSvg(variant) {
  const c = VARIANTS[variant]
  const { syntax } = zedTheme({ variant }).style
  const lines = ZED_SAMPLE.map((line) =>
    line.map(([text, scope]) => {
      const st = (scope && syntax[scope]) || {}
      return { text, color: st.color ?? c.fg, isItalic: st.font_style === 'italic' }
    }),
  )
  return windowSvg({ variant, title: `Badge.tsx · ${NAMES[variant]}`, lines, hasLineNumbers: true })
}

function warpPreviewSvg(variant) {
  const c = VARIANTS[variant]
  const { normal, bright } = ansi({ variant })
  const colors = { ...normal, black: c['fg-subtle'], prompt: c.clay }
  const lines = WARP_SAMPLE.map((line) =>
    line.map(([text, name]) => ({ text, color: name ? colors[name] : c.fg, isItalic: false })),
  )
  // The 16 ANSI colors as two rows of squares under the session.
  const y = TOP + lines.length * LINE_HEIGHT + 4
  const squares = [normal, bright]
    .flatMap((palette, row) =>
      ANSI_ORDER.map(
        (k, col) =>
          `<rect x="${28 + col * 30}" y="${y + row * 30}" width="22" height="22" rx="5" ` +
          `fill="${palette[k]}" stroke="#808080" stroke-opacity="0.35"/>`,
      ),
    )
    .join('')
  return windowSvg({
    variant,
    title: `Warp · ${NAMES[variant]}`,
    lines,
    hasLineNumbers: false,
    extraHeight: 64,
    extra: squares,
  })
}

function buildReadmeImages() {
  return VARIANT_ORDER.flatMap((variant) => [
    write({ path: join(ROOT, 'assets', `zed-${variant}.svg`), content: zedPreviewSvg(variant) }),
    write({ path: join(ROOT, 'assets', `warp-${variant}.svg`), content: warpPreviewSvg(variant) }),
  ])
}

// ---------------------------------------------------------------- Swatches

// One small SVG per color, for the palette README.
function buildSwatches() {
  return Object.entries(VARIANTS).flatMap(([variant, colors]) =>
    Object.entries(colors).map(([name, hex]) =>
      write({
        path: join(ROOT, 'palette', 'swatches', variant, `${name}.svg`),
        content:
          '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">' +
          `<rect x="0.5" y="0.5" width="19" height="19" rx="4" fill="${hex}" ` +
          'stroke="#808080" stroke-opacity="0.45"/></svg>\n',
      }),
    ),
  )
}

// ---------------------------------------------------------------- Design system

const HUES = Object.keys(TOKENS.variants.dark.hue)
const NEUTRALS = Object.keys(TOKENS.variants.dark.neutral)

// Every hue comes in these steps:
//   lavender         text and icons on bg (light enough on dark, dark enough on light)
//   lavender-solid   fills that carry on-solid text, the same deep color in both variants
//   lavender-subtle  tinted backgrounds, like callouts and diff lines
function scale({ variant }) {
  const c = VARIANTS[variant]
  const solid = VARIANTS.light
  const subtle = variant === 'dark' ? 0.3 : 0.15
  return {
    ...Object.fromEntries(NEUTRALS.map((name) => [name, c[name]])),
    'on-solid': solid.bg,
    ...Object.fromEntries(
      HUES.flatMap((hue) => [
        [hue, c[hue]],
        [`${hue}-solid`, solid[hue]],
        [`${hue}-subtle`, alpha({ color: solid[hue], amount: subtle })],
      ]),
    ),
  }
}

const STEPS = ['', '-solid', '-subtle']

function buildCss() {
  const block = ({ selector, variant }) =>
    [
      `${selector} {`,
      `  color-scheme: ${variant};`,
      ...Object.entries(scale({ variant })).map(([name, value]) => `  --gh44-${name}: ${value};`),
      '',
      // Roles sit in every variant block so a nested .dark section resolves them too.
      ...Object.entries(ROLES).flatMap(([role, hue]) =>
        STEPS.map((step) => `  --gh44-${role}${step}: var(--gh44-${hue}${step});`),
      ),
      '}',
    ].join('\n')
  const roles = [
    ':root {',
    `  --gh44-font-sans: ${TOKENS.font.sans.stack};`,
    `  --gh44-font-mono: ${TOKENS.font.mono.stack};`,
    `  --gh44-radius: ${TOKENS.radius};`,
    '}',
  ].join('\n')
  const css = [
    '/* gh44 design tokens. Generated by scripts/build.mjs; edit palette/tokens.json instead.',
    ' *',
    ' * Follows the system setting. Force a variant with class="dark" or class="light"',
    ' * (or data-theme="dark" / "light") on <html>.',
    ' */',
    '',
    roles,
    '',
    block({ selector: ':root,\n.light,\n[data-theme="light"]', variant: 'light' }),
    '',
    block({ selector: '.dark,\n[data-theme="dark"]', variant: 'dark' }),
    '',
    '@media (prefers-color-scheme: dark) {',
    block({ selector: ':root:not(.light):not([data-theme="light"])', variant: 'dark' })
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n'),
    '}',
    '',
  ].join('\n')
  return write({ path: join(ROOT, 'palette', 'gh44.css'), content: css })
}

// ---------------------------------------------------------------- shadcn

// Fills the variables every shadcn component reads, plus success, warning and info.
// Primary, destructive and the status colors use the plain hue with bg as text, so
// they're a soft color with dark text in dark mode and a deep color with light text in
// light mode. shadcn also uses them as text on a tint of themselves (bg-destructive/10
// text-destructive), which the plain hue reads well in.
function shadcnVars({ variant }) {
  const t = scale({ variant })
  const role = (name) => t[ROLES[name]]
  const isDark = variant === 'dark'
  return {
    background: t.bg,
    foreground: t.fg,
    // Light cards match the page and stand out by their border, so status text on a
    // card keeps AA contrast. Dark cards sit one step up.
    card: isDark ? t['bg-subtle'] : t.bg,
    'card-foreground': t.fg,
    popover: isDark ? t.surface : t.bg,
    'popover-foreground': t.fg,
    primary: role('primary'),
    'primary-foreground': t.bg,
    secondary: t.surface,
    'secondary-foreground': t.fg,
    muted: t['bg-subtle'],
    'muted-foreground': t['fg-muted'],
    accent: t['surface-hover'],
    'accent-foreground': t.fg,
    destructive: role('danger'),
    'destructive-foreground': t.bg,
    success: role('success'),
    'success-foreground': t.bg,
    warning: role('warning'),
    'warning-foreground': t.bg,
    info: role('info'),
    'info-foreground': t.bg,
    border: t.border,
    input: t.border,
    ring: role('primary'),
    'chart-1': t.lavender,
    'chart-2': t.sage,
    'chart-3': t.sky,
    'chart-4': t.ochre,
    'chart-5': t.rose,
    sidebar: t['bg-subtle'],
    'sidebar-foreground': t.fg,
    'sidebar-primary': role('primary'),
    'sidebar-primary-foreground': t.bg,
    'sidebar-accent': t['surface-hover'],
    'sidebar-accent-foreground': t.fg,
    'sidebar-border': t['border-subtle'],
    'sidebar-ring': role('primary'),
  }
}

// Tailwind v4 utilities for the variables shadcn's own setup doesn't map.
const SHADCN_THEME = {
  'color-success': 'var(--success)',
  'color-success-foreground': 'var(--success-foreground)',
  'color-warning': 'var(--warning)',
  'color-warning-foreground': 'var(--warning-foreground)',
  'color-info': 'var(--info)',
  'color-info-foreground': 'var(--info-foreground)',
  'color-destructive-foreground': 'var(--destructive-foreground)',
}

const ITEM_SCHEMA = 'https://ui.shadcn.com/schema/registry-item.json'

// Two items, both installed by name. shadcn only overwrites existing variables for the
// item you name, not for its registryDependencies, so each item carries everything itself.
//   gh44        colors + IBM Plex Sans for text and Lilex for code
//   gh44-theme  colors only, for projects that keep their own font
const FONT_PACKAGES = ['@fontsource-variable/ibm-plex-sans', '@fontsource-variable/lilex']

function shadcnItems() {
  const colors = {
    light: { radius: TOKENS.radius, ...shadcnVars({ variant: 'light' }) },
    dark: shadcnVars({ variant: 'dark' }),
  }
  // The full CSS value. @fontsource-variable names the family "<name> Variable".
  const fontSans = `'${TOKENS.font.sans.family} Variable', ui-sans-serif, sans-serif`
  const fontMono = `'${TOKENS.font.mono.family} Variable', ui-monospace, monospace`
  const label = 'gh44'
  const theme = {
    $schema: ITEM_SCHEMA,
    name: 'gh44-theme',
    type: 'registry:theme',
    title: `${label} colors`,
    description: `${label} colors for shadcn/ui, light and dark, with lavender as primary.`,
    author: TOKENS.author,
    cssVars: { theme: SHADCN_THEME, ...colors },
  }
  const full = {
    $schema: ITEM_SCHEMA,
    name: 'gh44',
    type: 'registry:theme',
    title: label,
    description: `${label} colors, IBM Plex Sans and Lilex for shadcn/ui, light and dark.`,
    author: TOKENS.author,
    dependencies: FONT_PACKAGES,
    css: Object.fromEntries(FONT_PACKAGES.map((name) => [`@import "${name}"`, {}])),
    cssVars: {
      theme: { ...SHADCN_THEME, 'font-sans': fontSans, 'font-mono': fontMono },
      ...colors,
    },
  }
  return [full, theme]
}

// The same theme as plain CSS, for projects that don't use the shadcn CLI.
function shadcnCss() {
  const vars = (variant) =>
    Object.entries(shadcnVars({ variant })).map(([name, value]) => `  --${name}: ${value};`)
  return [
    `/* gh44 for shadcn/ui. Generated by scripts/build.mjs; edit palette/tokens.json instead.`,
    ' * Paste below your Tailwind import, or install with the shadcn CLI (see README.md).',
    ' */',
    '',
    ':root {',
    `  --radius: ${TOKENS.radius};`,
    `  --font-sans: ${TOKENS.font.sans.stack};`,
    `  --font-mono: ${TOKENS.font.mono.stack};`,
    ...vars('light'),
    '}',
    '',
    '.dark {',
    ...vars('dark'),
    '}',
    '',
    '@theme inline {',
    ...Object.entries(SHADCN_THEME).map(([name, value]) => `  --${name}: ${value};`),
    '}',
    '',
  ].join('\n')
}

function buildShadcn() {
  return [
    ...shadcnItems().map((item) =>
      write({
        path: join(ROOT, 'shadcn', 'r', `${item.name}.json`),
        content: JSON.stringify(item, null, 2) + '\n',
      }),
    ),
    write({ path: join(ROOT, 'shadcn', 'gh44.css'), content: shadcnCss() }),
  ]
}

const built = [buildZed(), ...buildWarp(), ...buildSlack(), ...buildLinear(), ...buildChrome(), ...buildGithub(), buildCss(), ...buildShadcn(), ...buildReadmeImages()]
const swatches = buildSwatches()
for (const path of built) console.log('built', relative(ROOT, path))
console.log('built', swatches.length, 'swatches in palette/swatches')
