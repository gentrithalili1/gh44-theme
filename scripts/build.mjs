#!/usr/bin/env node
// Build every gh44 theme from palette/tokens.json.
//
// Run from the repository root:  node scripts/build.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const TOKENS = JSON.parse(readFileSync(join(ROOT, 'palette', 'tokens.json'), 'utf8'))
const VARIANTS = TOKENS.variants
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
function ansi(variant) {
  const c = VARIANTS[variant]
  const isDark = variant === 'dark'
  const normal = {
    black: isDark ? '#3A3C41' : c.cloud,
    red: c.red,
    green: c.sage,
    yellow: c.ochre,
    blue: c['dusty-blue'],
    magenta: c.lavender,
    cyan: c.seafoam,
    white: isDark ? c.cloud : c.pewter,
  }
  const bright = {}
  for (const [key, color] of Object.entries(normal)) {
    bright[key] = isDark
      ? mix({ from: color, to: '#FFFFFF', amount: 0.25 })
      : mix({ from: color, to: '#000000', amount: 0.18 })
  }
  bright.black = isDark ? '#6F737A' : c.comment
  bright.white = isDark ? '#F2F3F5' : '#FFFFFF'
  return { normal, bright }
}

// ---------------------------------------------------------------- Zed

function style(color, { isItalic = false, isBold = false } = {}) {
  return { color, font_style: isItalic ? 'italic' : null, font_weight: isBold ? 700 : null }
}

function zedTheme(variant) {
  const c = VARIANTS[variant]
  const isDark = variant === 'dark'
  const { normal, bright } = ansi(variant)
  const a = (color, amount) => alpha({ color, amount })

  const s = {
    'background.appearance': 'opaque',
    accents: [c.terracotta, c.sage, c.lavender, c['dusty-blue'], c.ochre, c.rose],

    border: c.pewter,
    'border.variant': c['pewter-soft'],
    'border.focused': c.terracotta,
    'border.selected': a(c.terracotta, 0.6),
    'border.transparent': TRANSPARENT,
    'border.disabled': c['pewter-soft'],

    background: c.graphite,
    'surface.background': c.graphite,
    'elevated_surface.background': c.slate,
    'element.background': c.slate,
    'element.hover': c['slate-hover'],
    'element.active': c['slate-active'],
    'element.selected': c['slate-active'],
    'element.disabled': c.slate,
    'drop_target.background': a(c.terracotta, 0.14),
    'ghost_element.background': TRANSPARENT,
    'ghost_element.hover': c.slate,
    'ghost_element.active': c['slate-hover'],
    'ghost_element.selected': c['slate-hover'],
    'ghost_element.disabled': TRANSPARENT,

    text: c.cloud,
    'text.muted': c.silver,
    'text.placeholder': c.comment,
    'text.disabled': c.disabled,
    'text.accent': c.terracotta,
    icon: c.cloud,
    'icon.muted': c.silver,
    'icon.disabled': c.disabled,
    'icon.placeholder': c.comment,
    'icon.accent': c.terracotta,
    'link_text.hover': c.terracotta,

    'title_bar.background': c.graphite,
    'title_bar.inactive_background': c.graphite,
    'status_bar.background': c.graphite,
    'toolbar.background': c.charcoal,
    'tab_bar.background': c.graphite,
    'tab.inactive_background': c.graphite,
    'tab.active_background': c.charcoal,
    'search.match_background': a(c.ochre, isDark ? 0.28 : 0.3),
    'panel.background': c.graphite,
    'panel.focused_border': a(c.terracotta, 0.7),
    'panel.indent_guide': c['pewter-soft'],
    'panel.indent_guide_active': c.pewter,
    'panel.indent_guide_hover': c['line-number'],
    'panel.overlay_background': c.slate,
    'panel.overlay_hover': c['slate-hover'],
    'pane.focused_border': a(c.terracotta, 0.7),
    'pane_group.border': c['pewter-soft'],

    'scrollbar.thumb.background': a(c.silver, 0.18),
    'scrollbar.thumb.hover_background': a(c.silver, 0.32),
    'scrollbar.thumb.active_background': a(c.terracotta, 0.45),
    'scrollbar.thumb.border': TRANSPARENT,
    'scrollbar.track.background': TRANSPARENT,
    'scrollbar.track.border': TRANSPARENT,
    'minimap.thumb.background': a(c.silver, 0.14),
    'minimap.thumb.hover_background': a(c.silver, 0.24),
    'minimap.thumb.active_background': a(c.terracotta, 0.3),
    'minimap.thumb.border': TRANSPARENT,

    'editor.foreground': c.cloud,
    'editor.background': c.charcoal,
    'editor.gutter.background': c.charcoal,
    'editor.subheader.background': c.graphite,
    'editor.active_line.background': a(c.slate, isDark ? 0.75 : 0.6),
    'editor.highlighted_line.background': c.slate,
    'editor.debugger_active_line.background': a(c.ochre, 0.14),
    'editor.line_number': c['line-number'],
    'editor.active_line_number': c.cloud,
    'editor.hover_line_number': c.silver,
    'editor.invisible': c.disabled,
    'editor.wrap_guide': c['pewter-soft'],
    'editor.active_wrap_guide': c.pewter,
    'editor.indent_guide': c['pewter-soft'],
    'editor.indent_guide_active': c.pewter,
    'editor.document_highlight.read_background': a(c['dusty-blue'], 0.14),
    'editor.document_highlight.write_background': a(c.terracotta, 0.16),
    'editor.document_highlight.bracket_background': a(c.terracotta, 0.18),

    'terminal.background': c.charcoal,
    'terminal.foreground': c.cloud,
    'terminal.bright_foreground': isDark ? '#F2F3F5' : '#1E1F22',
    'terminal.dim_foreground': c.comment,
    'terminal.ansi.background': c.charcoal,

    'version_control.added': c.sage,
    'version_control.modified': c['dusty-blue'],
    'version_control.deleted': c.red,
    'version_control.word_added': a(c.sage, 0.25),
    'version_control.word_deleted': a(c.red, 0.25),
    'version_control.conflict_marker.ours': a(c.sage, 0.18),
    'version_control.conflict_marker.theirs': a(c['dusty-blue'], 0.18),
  }
  for (const key of Object.keys(normal)) {
    s[`terminal.ansi.${key}`] = normal[key]
    s[`terminal.ansi.bright_${key}`] = bright[key]
    s[`terminal.ansi.dim_${key}`] = mix({ from: normal[key], to: c.charcoal, amount: 0.4 })
  }

  const statuses = [
    ['conflict', c.lavender], ['created', c.sage], ['deleted', c.red],
    ['error', c.red], ['hidden', c.comment], ['hint', c.comment],
    ['ignored', c['line-number']], ['info', c['dusty-blue']], ['modified', c['dusty-blue']],
    ['predictive', c.comment], ['renamed', c.lavender], ['success', c.sage],
    ['unreachable', c.comment], ['warning', c.ochre],
  ]
  for (const [key, color] of statuses) {
    s[key] = color
    s[`${key}.background`] = a(color, 0.12)
    s[`${key}.border`] = a(color, 0.45)
  }

  const players = [c.terracotta, c.sage, c.lavender, c['dusty-blue'], c.ochre, c.rose, c.seafoam, c.sand]
  s.players = players.map((p, i) => ({
    cursor: p,
    background: p,
    selection: i === 0 ? a(p, isDark ? 0.24 : 0.2) : a(p, 0.22),
  }))

  const italic = { isItalic: true }
  s.syntax = {
    attribute: style(c.ochre),
    boolean: style(c.ochre),
    comment: style(c.comment, italic),
    'comment.doc': style(mix({ from: c.comment, to: c.cloud, amount: 0.25 }), italic),
    constant: style(c.ochre),
    constructor: style(c.lavender),
    embedded: style(c.cloud),
    emphasis: style(c.rose, italic),
    'emphasis.strong': style(c.terracotta, { isBold: true }),
    enum: style(c.lavender),
    function: style(c.lavender),
    hint: style(c.comment),
    keyword: style(c.terracotta),
    label: style(c.lavender),
    link_text: style(c['dusty-blue']),
    link_uri: style(c.sage, italic),
    namespace: style(c.cloud),
    number: style(c.ochre),
    operator: style(c.silver),
    predictive: style(c.comment, italic),
    preproc: style(c.terracotta),
    primary: style(c.cloud),
    property: style(c.rose),
    punctuation: style(c.silver),
    'punctuation.bracket': style(c.silver),
    'punctuation.delimiter': style(c.silver),
    'punctuation.list_marker': style(c.terracotta),
    'punctuation.markup': style(c.terracotta),
    'punctuation.special': style(c.rose),
    selector: style(c.terracotta),
    'selector.pseudo': style(c.lavender),
    string: style(c.sage),
    'string.escape': style(c.rose),
    'string.regex': style(c.rose),
    'string.special': style(c.rose),
    'string.special.symbol': style(c.seafoam),
    tag: style(c.terracotta),
    'text.literal': style(c.sage),
    title: style(c.terracotta, { isBold: true }),
    type: style(c['dusty-blue']),
    'type.builtin': style(c['dusty-blue']),
    variable: style(c.cloud),
    'variable.special': style(c.terracotta, italic),
    'variable.parameter': style(c.rose),
    variant: style(c.lavender),
  }
  return { name: NAMES[variant], appearance: variant, style: s }
}

function buildZed() {
  const family = {
    $schema: 'https://zed.dev/schema/themes/v0.2.0.json',
    name: 'gh44',
    author: TOKENS.author,
    themes: VARIANT_ORDER.map(zedTheme),
  }
  return write({ path: join(ROOT, 'zed', 'themes', 'gh44.json'), content: JSON.stringify(family, null, 2) + '\n' })
}

// ---------------------------------------------------------------- Warp

function buildWarp() {
  return VARIANT_ORDER.map((variant) => {
    const c = VARIANTS[variant]
    const { normal, bright } = ansi(variant)
    const lines = [
      `# ${NAMES[variant]} for Warp. Generated by scripts/build.mjs; edit palette/tokens.json instead.`,
      `name: ${NAMES[variant]}`,
      `accent: '${c.terracotta}'`,
      `cursor: '${c.terracotta}'`,
      `background: '${variant === 'dark' ? c.charcoal : c.graphite}'`,
      `foreground: '${c.cloud}'`,
      `details: ${variant === 'dark' ? 'darker' : 'lighter'}`,
      'terminal_colors:',
      '  normal:',
      ...ANSI_ORDER.map((k) => `    ${k}: '${normal[k]}'`),
      '  bright:',
      ...ANSI_ORDER.map((k) => `    ${k}: '${bright[k]}'`),
    ]
    return write({ path: join(ROOT, 'warp', `gh44-${variant}.yaml`), content: lines.join('\n') + '\n' })
  })
}

// ---------------------------------------------------------------- Slack

// Slack's legacy theme format: 10 comma-separated colors.
// Order: column background, menu hover, active item, active item text, hover item,
// text, active presence, mention badge, top nav background, top nav text.
// One theme from the light palette: Slack derives its dark mode from it.
function slackString() {
  const c = VARIANTS.light
  return [
    c.graphite, c.slate, c['slate-active'], c.cloud, c.slate,
    c.cloud, c.sage, c.terracotta, c.terracotta, c.charcoal,
  ].join(',')
}

function buildSlack() {
  return write({ path: join(ROOT, 'slack', 'gh44.txt'), content: slackString() + '\n' })
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
function linearTheme(variant) {
  const c = VARIANTS[variant]
  const contrast = 30
  return {
    base: lch(c.charcoal),
    accent: lch(c.lavender),
    contrast,
    sidebar: { base: lch(c.graphite), accent: lch(c.lavender), contrast },
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
  ['entity-name-class', 'type'],
  ['entity-other-inherited-class', 'type'],
  ['support-type', 'type'],
  ['support-class', 'type'],
  ['entity-name-tag', 'tag'],
  ['support-class-component', 'tag'],
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
  // <Stack: a type right after the < operator is a JSX tag.
  [
    [
      `${LINEAR_OPERATOR} + [class^="syntax-entity-name-type"]`,
      `${LINEAR_OPERATOR} + .${LINEAR_SYMBOL_LINK} > [class^="syntax-entity-name-type"]`,
    ],
    'tag',
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

function linearUserCss(variant) {
  const c = VARIANTS[variant]
  const { syntax } = zedTheme(variant).style
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
  const isDark = variant === 'dark'
  const deep = VARIANTS.light
  const a = (color, amount) => alpha({ color, amount })
  const diffVars = {
    'editor-background': c.charcoal,
    'editor-background-opaque': c.charcoal,
    'editor-foreground': c.cloud,
    'line-number-fg': c['line-number'],
    'blank-bg': c.graphite,
    'focus-bg': c['slate-hover'],
    'git-added-fg': c.sage,
    'git-deleted-fg': c.red,
    'git-modified-fg': c['dusty-blue'],
    'inserted-bg': a(deep.sage, isDark ? 0.3 : 0.15),
    'inserted-full-line-bg': a(deep.sage, isDark ? 0.3 : 0.15),
    'inserted-inline-bg': a(deep.sage, isDark ? 0.6 : 0.35),
    'removed-bg': a(deep.red, isDark ? 0.3 : 0.15),
    'removed-full-line-bg': a(deep.red, isDark ? 0.3 : 0.15),
    'removed-inline-bg': a(deep.red, isDark ? 0.6 : 0.35),
  }
  const diffRule = [
    '  /* Diff viewer */',
    '  * {',
    ...Object.entries(diffVars).map(([name, value]) => `    --diff-view-${name}: ${value} !important;`),
    '  }',
    '',
    '  [data-diff-sticky-window] {',
    `    background-color: ${c.charcoal} !important;`,
    '  }',
    '',
    // Linear underlines every symbol it can link to with a dotted border; Zed doesn't.
    `  [data-line-text] .${LINEAR_SYMBOL_LINK} {`,
    '    border-bottom-color: transparent !important;',
    '  }',
    '',
    `  [data-line-text] .${LINEAR_SYMBOL_LINK}:hover {`,
    `    border-bottom-color: ${c.comment} !important;`,
    '  }',
  ].join('\n')
  return [
    '/* ==UserStyle==',
    `@name         ${NAMES[variant]} for Linear code blocks`,
    '@namespace    gh44',
    `@version      ${TOKENS.version}`,
    `@description  gh44 syntax colors in Linear code blocks. Generated by scripts/build.mjs.`,
    `@author       ${TOKENS.author}`,
    '==/UserStyle== */',
    '',
    '@-moz-document domain("linear.app") {',
    '  pre,',
    '  pre code {',
    `    background-color: ${c.graphite} !important;`,
    `    color: ${c.cloud} !important;`,
    '  }',
    '',
    rules.join('\n\n'),
    '',
    diffRule,
    '}',
    '',
  ].join('\n')
}

function buildLinear() {
  return VARIANT_ORDER.flatMap((variant) => [
    write({
      path: join(ROOT, 'linear', `gh44-${variant}.json`),
      content: JSON.stringify(linearTheme(variant)) + '\n',
    }),
    write({
      path: join(ROOT, 'linear', `gh44-${variant}.user.css`),
      content: linearUserCss(variant),
    }),
  ])
}

// ---------------------------------------------------------------- Chrome

const rgb = (color) => channels(color)

// Chrome themes don't follow the system mode, so each variant is its own extension.
function chromeManifest(variant) {
  const c = VARIANTS[variant]
  const isDark = variant === 'dark'
  // The tab strip sits behind the active tab, which shares the toolbar color.
  const frame = isDark ? c.charcoal : c.slate
  const toolbar = isDark ? c.slate : c.charcoal
  const omnibox = isDark ? c.charcoal : c.graphite
  return {
    manifest_version: 3,
    name: NAMES[variant],
    version: TOKENS.version,
    description: `Light terracotta on charcoal. ${NAMES[variant]} for Chrome.`,
    theme: {
      colors: {
        frame: rgb(frame),
        frame_inactive: rgb(frame),
        frame_incognito: rgb(frame),
        frame_incognito_inactive: rgb(frame),
        toolbar: rgb(toolbar),
        toolbar_text: rgb(c.cloud),
        toolbar_button_icon: rgb(c.silver),
        tab_text: rgb(c.cloud),
        tab_background_text: rgb(c.silver),
        tab_background_text_inactive: rgb(c.comment),
        tab_background_text_incognito: rgb(c.silver),
        tab_background_text_incognito_inactive: rgb(c.comment),
        bookmark_text: rgb(c.cloud),
        omnibox_background: rgb(omnibox),
        omnibox_text: rgb(c.cloud),
        ntp_background: rgb(c.charcoal),
        ntp_text: rgb(c.cloud),
        ntp_link: rgb(c.terracotta),
      },
    },
  }
}

function buildChrome() {
  return VARIANT_ORDER.map((variant) =>
    write({
      path: join(ROOT, 'chrome', `gh44-${variant}`, 'manifest.json'),
      content: JSON.stringify(chromeManifest(variant), null, 2) + '\n',
    }),
  )
}

// ---------------------------------------------------------------- GitHub

// GitHub's UI reads Primer CSS variables, so the userstyle only overrides those.
// Primer sets them per theme on [data-color-mode], which is why every value is !important.
function githubVars(variant) {
  const c = VARIANTS[variant]
  const isDark = variant === 'dark'
  const { syntax } = zedTheme(variant).style
  const a = (color, amount) => alpha({ color, amount })
  const shade = (color, amount) => mix({ from: color, to: isDark ? '#FFFFFF' : '#000000', amount })
  const inset = isDark ? mix({ from: c.charcoal, to: '#000000', amount: 0.2 }) : c.graphite
  // Solid fills (badges, primary button, toggles) use gh44 Light's deeper colors in
  // both variants, so they carry light text and read as real color on charcoal.
  const deep = VARIANTS.light
  const onEmphasis = deep.charcoal
  const states = {
    accent: 'dusty-blue',
    success: 'sage',
    attention: 'ochre',
    danger: 'red',
    done: 'lavender',
    severe: 'terracotta',
    sponsors: 'rose',
  }
  const contribution = [0.25, 0.5, 0.75, 1].map((amount) =>
    mix({ from: c.graphite, to: c.sage, amount }),
  )
  return {
    'bgColor-default': c.charcoal,
    'bgColor-muted': c.graphite,
    'bgColor-inset': inset,
    'bgColor-emphasis': isDark ? c.pewter : c.cloud,
    'bgColor-inverse': c.cloud,
    'bgColor-disabled': c.slate,
    'bgColor-neutral-emphasis': isDark ? c['line-number'] : c.comment,
    'bgColor-neutral-muted': a(c.comment, 0.2),
    ...Object.fromEntries(
      Object.entries(states).flatMap(([state, name]) => [
        [`bgColor-${state}-emphasis`, deep[name]],
        [`bgColor-${state}-muted`, a(deep[name], isDark ? 0.3 : 0.15)],
        [`borderColor-${state}-emphasis`, c[name]],
        [`borderColor-${state}-muted`, a(c[name], 0.4)],
        [`fgColor-${state}`, c[name]],
      ]),
    ),

    'fgColor-default': c.cloud,
    'fgColor-muted': c.silver,
    'fgColor-neutral': c.silver,
    'fgColor-disabled': c.disabled,
    'fgColor-link': c['dusty-blue'],
    'fgColor-onEmphasis': onEmphasis,
    'fgColor-onInverse': c.charcoal,

    'borderColor-default': c.pewter,
    'borderColor-muted': c['pewter-soft'],
    'borderColor-emphasis': c['line-number'],
    'borderColor-disabled': a(c.disabled, 0.2),

    'control-bgColor-rest': c.slate,
    'control-bgColor-hover': c['slate-hover'],
    'control-bgColor-active': c['slate-active'],
    'control-bgColor-disabled': c.graphite,
    'control-borderColor-selected': c.cloud,
    'control-checked-bgColor-hover': shade(deep['dusty-blue'], 0.1),
    'control-checked-bgColor-active': shade(deep['dusty-blue'], 0.2),
    'control-danger-fgColor-hover': shade(c.red, 0.15),
    'control-danger-bgColor-active': a(c.red, 0.4),
    'control-transparent-bgColor-hover': a(c.comment, 0.2),
    'control-transparent-bgColor-active': a(c.comment, 0.25),
    'control-transparent-bgColor-selected': a(c.comment, 0.2),
    'controlKnob-bgColor-rest': c['slate-hover'],
    'controlKnob-bgColor-checked': onEmphasis,
    'controlTrack-bgColor-rest': inset,
    'controlTrack-bgColor-hover': c['slate-hover'],
    'controlTrack-bgColor-active': c['slate-active'],

    'button-primary-bgColor-rest': deep.sage,
    'button-primary-bgColor-hover': shade(deep.sage, 0.1),
    'button-primary-bgColor-active': shade(deep.sage, 0.2),
    'button-primary-bgColor-disabled': a(deep.sage, 0.4),
    'button-primary-borderColor-disabled': a(deep.sage, 0.4),
    'button-primary-fgColor-rest': onEmphasis,
    'button-primary-fgColor-disabled': a(onEmphasis, 0.6),
    'button-primary-iconColor-rest': onEmphasis,
    'buttonCounter-default-bgColor-rest': c['slate-active'],
    'buttonCounter-primary-bgColor-rest': a(c.charcoal, 0.2),
    'buttonKeybindingHint-default-bgColor-rest': c['slate-active'],
    'buttonKeybindingHint-inactive-bgColor': c['slate-active'],

    'header-bgColor': a(c.graphite, 0.95),
    'header-borderColor-divider': c['line-number'],
    'header-fgColor-default': c.silver,
    'header-fgColor-logo': c.cloud,
    'headerSearch-bgColor': c.charcoal,
    'headerSearch-borderColor': c['slate-active'],

    'overlay-bgColor': c.graphite,
    'overlay-backdrop-bgColor': a(c.charcoal, 0.6),
    'menu-bgColor-active': c.slate,
    'sideNav-bgColor-selected': c.slate,
    'timelineBadge-bgColor': c.slate,
    'selectMenu-bgColor-active': a(c['dusty-blue'], 0.2),
    'selection-bgColor': a(c['dusty-blue'], isDark ? 0.35 : 0.25),
    'underlineNav-borderColor-active': c.terracotta,
    'highlight-neutral-bgColor': a(c.ochre, 0.4),
    'skeletonLoader-bgColor': a(c.comment, 0.2),
    'reactionButton-selected-bgColor-rest': a(c['dusty-blue'], 0.2),
    'reactionButton-selected-bgColor-hover': a(c['dusty-blue'], 0.35),
    'reactionButton-selected-fgColor-hover': c['dusty-blue'],

    'contribution-default-bgColor-0': c.graphite,
    ...Object.fromEntries(contribution.map((color, i) => [`contribution-default-bgColor-${i + 1}`, color])),

    'diffBlob-additionNum-bgColor': a(deep.sage, isDark ? 0.45 : 0.25),
    'diffBlob-additionWord-bgColor': a(deep.sage, isDark ? 0.6 : 0.35),
    'diffBlob-deletionNum-bgColor': a(deep.red, isDark ? 0.45 : 0.25),
    'diffBlob-deletionWord-bgColor': a(deep.red, isDark ? 0.6 : 0.35),
    'diffBlob-hunkLine-bgColor': a(c['dusty-blue'], 0.15),
    'diffBlob-hunkNum-bgColor-rest': a(c['dusty-blue'], 0.3),
    'diffBlob-hunkNum-bgColor-hover': c['dusty-blue'],

    'prettylights-syntax-comment': syntax.comment.color,
    'prettylights-syntax-constant': syntax.constant.color,
    'prettylights-syntax-constantOtherReferenceLink': syntax.link_text.color,
    'prettylights-syntax-entity': syntax.function.color,
    'prettylights-syntax-entityTag': syntax.tag.color,
    'prettylights-syntax-keyword': syntax.keyword.color,
    'prettylights-syntax-string': syntax.string.color,
    'prettylights-syntax-stringRegexp': syntax['string.regex'].color,
    'prettylights-syntax-variable': syntax['variable.parameter'].color,
    'prettylights-syntax-storageModifierImport': c.cloud,
    'prettylights-syntax-bracketHighlighterAngle': c.silver,
    'prettylights-syntax-bracketHighlighterUnmatched': c.red,
    'prettylights-syntax-sublimeLinterGutterMark': c.pewter,
    'prettylights-syntax-metaDiffRange': c.lavender,
    'prettylights-syntax-markup-heading': c['dusty-blue'],
    'prettylights-syntax-markup-list': c.ochre,
    'prettylights-syntax-markup-bold': c.cloud,
    'prettylights-syntax-markup-italic': c.cloud,
    'prettylights-syntax-markup-inserted-bg': a(deep.sage, isDark ? 0.3 : 0.15),
    'prettylights-syntax-markup-inserted-text': c.sage,
    'prettylights-syntax-markup-deleted-bg': a(deep.red, isDark ? 0.3 : 0.15),
    'prettylights-syntax-markup-deleted-text': c.red,
    'prettylights-syntax-markup-changed-bg': a(c.ochre, 0.15),
    'prettylights-syntax-markup-changed-text': c.ochre,
    'prettylights-syntax-markup-ignored-bg': a(c['dusty-blue'], 0.15),
    'prettylights-syntax-markup-ignored-text': c['dusty-blue'],

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
    const decls = Object.entries(githubVars(variant)).map(
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
    '@name         gh44 for GitHub',
    '@namespace    gh44',
    `@version      ${TOKENS.version}`,
    '@description  gh44 colors for GitHub. Follows your GitHub appearance setting. Generated by scripts/build.mjs.',
    `@author       ${TOKENS.author}`,
    '==/UserStyle== */',
    '',
    '@-moz-document domain("github.com") {',
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
  return write({ path: join(ROOT, 'github', 'gh44.user.css'), content: githubUserCss() })
}

// ---------------------------------------------------------------- README images

const MONO = 'JetBrains Mono, SFMono-Regular, Menlo, Consolas, monospace'
const SANS = 'Inter, -apple-system, Segoe UI, Helvetica, Arial, sans-serif'
const CHAR_WIDTH = 8.4 // JetBrains Mono at 14px
const LINE_HEIGHT = 24
const TOP = 76
const GUTTER = 84
const ITALIC = ' font-style="italic"'

// Made-up TypeScript for the Zed preview. Each piece is [text, Zed syntax scope or null].
const ZED_SAMPLE = [
  [['import', 'keyword'], [' { ', 'punctuation'], ['formatTemperature', 'variable'],
    [' } ', 'punctuation'], ['from', 'keyword'], [' ', null], ["'./units'", 'string']],
  [],
  [['type', 'keyword'], [' ', null], ['Forecast', 'type'], [' ', null], ['=', 'operator'],
    [' {', 'punctuation']],
  [['  ', null], ['city', 'property'], [': ', 'punctuation'], ['string', 'type.builtin']],
  [['  ', null], ['highs', 'property'], [': ', 'punctuation'], ['number', 'type.builtin'],
    ['[]', 'punctuation']],
  [['  ', null], ['isRaining', 'property'], [': ', 'punctuation'], ['boolean', 'type.builtin']],
  [['}', 'punctuation']],
  [],
  [['const', 'keyword'], [' ', null], ['MAX_DAYS', 'constant'], [' ', null], ['=', 'operator'],
    [' ', null], ['7', 'number']],
  [],
  [["// Average of the week's highs, rounded", 'comment']],
  [['export', 'keyword'], [' ', null], ['function', 'keyword'], [' ', null],
    ['getWeeklyHigh', 'function'], ['({ ', 'punctuation'], ['city', 'variable.parameter'],
    [', ', 'punctuation'], ['highs', 'variable.parameter'], [' }: ', 'punctuation'],
    ['Forecast', 'type'], ['): ', 'punctuation'], ['string', 'type.builtin'], [' {', 'punctuation']],
  [['  ', null], ['const', 'keyword'], [' ', null], ['week', 'variable'], [' ', null],
    ['=', 'operator'], [' ', null], ['highs', 'variable'], ['.', 'punctuation'],
    ['slice', 'function'], ['(', 'punctuation'], ['0', 'number'], [', ', 'punctuation'],
    ['MAX_DAYS', 'constant'], [')', 'punctuation']],
  [['  ', null], ['const', 'keyword'], [' ', null], ['total', 'variable'], [' ', null],
    ['=', 'operator'], [' ', null], ['week', 'variable'], ['.', 'punctuation'],
    ['reduce', 'function'], ['((', 'punctuation'], ['sum', 'variable.parameter'],
    [', ', 'punctuation'], ['high', 'variable.parameter'], [') ', 'punctuation'],
    ['=>', 'operator'], [' ', null], ['sum', 'variable'], [' ', null], ['+', 'operator'],
    [' ', null], ['high', 'variable'], [', ', 'punctuation'], ['0', 'number'],
    [')', 'punctuation']],
  [],
  [['  ', null], ['return', 'keyword'], [' ', null], ['`', 'string'], ['${', 'punctuation.special'],
    ['city', 'variable'], ['}', 'punctuation.special'], [': ', 'string'], ['${', 'punctuation.special'],
    ['formatTemperature', 'function'], ['(', 'punctuation'], ['total', 'variable'], [' ', null],
    ['/', 'operator'], [' ', null], ['week', 'variable'], ['.', 'punctuation'],
    ['length', 'property'], [')', 'punctuation'], ['}', 'punctuation.special'], ['`', 'string']],
  [['}', 'punctuation']],
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
      ? [`<text x="64" y="${y}" fill="${c['line-number']}" text-anchor="end">${i + 1}</text>`]
      : []
    return [...lineNumber, `<text x="${left}" y="${y}" xml:space="preserve">${spans}</text>`]
  })
  const dots = [c.terracotta, c.ochre, c.sage]
    .map((col, i) => `<circle cx="${28 + i * 20}" cy="24" r="6" fill="${col}"/>`)
    .join('')
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}" font-family="${MONO}" font-size="14">` +
    `<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="12" ` +
    `fill="${c.charcoal}" stroke="${c.pewter}"/>` +
    `<path d="M1 48 H${width - 1}" stroke="${c['pewter-soft']}"/>${dots}` +
    `<text x="${width / 2}" y="29" fill="${c.silver}" text-anchor="middle" ` +
    `font-family="${SANS}" font-size="13">${esc(title)}</text>` +
    `${rows.join('')}${extra}</svg>\n`
  )
}

function zedPreviewSvg(variant) {
  const c = VARIANTS[variant]
  const { syntax } = zedTheme(variant).style
  const lines = ZED_SAMPLE.map((line) =>
    line.map(([text, scope]) => {
      const st = (scope && syntax[scope]) || {}
      return { text, color: st.color ?? c.cloud, isItalic: st.font_style === 'italic' }
    }),
  )
  return windowSvg({ variant, title: `forecast.ts · ${NAMES[variant]}`, lines, hasLineNumbers: true })
}

function warpPreviewSvg(variant) {
  const c = VARIANTS[variant]
  const { normal, bright } = ansi(variant)
  const colors = { ...normal, black: c.comment, prompt: c.terracotta }
  const lines = WARP_SAMPLE.map((line) =>
    line.map(([text, name]) => ({ text, color: name ? colors[name] : c.cloud, isItalic: false })),
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

// ---------------------------------------------------------------- CSS

function buildCss() {
  const block = (variant) =>
    [
      ...Object.entries(VARIANTS[variant]).map(([name, hex]) => `  --gh44-${name}: ${hex};`),
      '',
      ...Object.entries(ROLES).map(([role, name]) => `  --gh44-${role}: var(--gh44-${name});`),
    ].join('\n')

  const css =
    '/* gh44 palette. Generated by scripts/build.mjs; edit palette/tokens.json instead. */\n' +
    '/* Dark is the default. Set data-theme="light" on <html> for the light variant. */\n\n' +
    `:root {\n  color-scheme: dark;\n${block('dark')}\n}\n\n` +
    `:root[data-theme="light"] {\n  color-scheme: light;\n${block('light')}\n}\n`
  return write({ path: join(ROOT, 'palette', 'gh44.css'), content: css })
}

const built = [buildZed(), ...buildWarp(), buildSlack(), ...buildLinear(), ...buildChrome(), buildGithub(), buildCss(), ...buildReadmeImages()]
const swatches = buildSwatches()
for (const path of built) console.log('built', relative(ROOT, path))
console.log('built', swatches.length, 'swatches in palette/swatches')
