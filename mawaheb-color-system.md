# Mawaheb Platform — Color System & Implementation Guide

> This document is the single source of truth for all colors used across the Mawaheb Foundation internal platform. Apply every token, role, and rule defined here consistently across all components, pages, and states.

---

## 1. Brand Identity

| Property | Value |
|---|---|
| Foundation | Mawaheb Foundation (مؤسسة مواهب) |
| Mission | Nurturing gifted youth, preparing them to lead the future |
| Direction | Supports both LTR (English) and RTL (Arabic) |
| Visual character | Prestigious, warm, trustworthy — not cold or purely corporate |

The two core brand colors are **Forest Green** (authority, growth, nurture) and **Golden Amber** (excellence, achievement, awards). All neutral surfaces use a **warm parchment tone** rather than pure gray to maintain a prestigious and editorial feel.

---

## 2. CSS Custom Properties — Full Token Set

Paste this block into your global stylesheet (e.g. `globals.css`, `variables.css`, or `:root` in your design system entry point). Every color in the platform must reference one of these variables — no hardcoded hex values anywhere else.

```css
:root {

  /* ─── Brand — Forest Green ─────────────────────────────── */
  --color-brand-50:   #EAF3EC;
  --color-brand-100:  #C2DFC8;
  --color-brand-200:  #92C49C;
  --color-brand-400:  #4E9963;
  --color-brand-600:  #296E42;
  --color-brand-800:  #1A3A2A;
  --color-brand-900:  #0D2018;

  /* ─── Accent — Golden Amber ────────────────────────────── */
  --color-accent-50:  #FDF6E3;
  --color-accent-100: #F9E4A0;
  --color-accent-200: #F0C95A;
  --color-accent-400: #D4A843;
  --color-accent-600: #B07A1A;
  --color-accent-800: #7A5A0A;
  --color-accent-900: #3D2D04;

  /* ─── Neutral — Warm Parchment ─────────────────────────── */
  --color-neutral-50:  #FAFAF7;
  --color-neutral-100: #F5F3EE;
  --color-neutral-200: #E8E4D8;
  --color-neutral-300: #C8C3B2;
  --color-neutral-500: #9A9588;
  --color-neutral-700: #5E5A52;
  --color-neutral-900: #2E2C28;

  /* ─── Semantic — Success ───────────────────────────────── */
  --color-success-bg:     #EAF3EC;
  --color-success-border: #92C49C;
  --color-success-text:   #296E42;
  --color-success-dark:   #1A3A2A;

  /* ─── Semantic — Warning ───────────────────────────────── */
  --color-warning-bg:     #FEF0E6;
  --color-warning-border: #F0B880;
  --color-warning-text:   #C05B1A;
  --color-warning-dark:   #5A2A0A;

  /* ─── Semantic — Error / Danger ────────────────────────── */
  --color-error-bg:     #FDECEC;
  --color-error-border: #F0BABA;
  --color-error-text:   #C03030;
  --color-error-dark:   #5A1010;

  /* ─── Semantic — Info / Award ──────────────────────────── */
  --color-award-bg:     #FDF6E3;
  --color-award-border: #F0C95A;
  --color-award-text:   #B07A1A;
  --color-award-dark:   #3D2D04;

  /* ─── Surface hierarchy ────────────────────────────────── */
  --surface-nav:       #0D2018;   /* deepest — sidebar background */
  --surface-header:    #1A3A2A;   /* dark header bar */
  --surface-page:      #F5F3EE;   /* page / app background */
  --surface-card:      #FAFAF7;   /* card, panel, modal background */
  --surface-overlay:   rgba(13, 32, 24, 0.55); /* modal backdrop */

  /* ─── Text roles ───────────────────────────────────────── */
  --text-primary:      #2E2C28;   /* headings, body, labels */
  --text-secondary:    #5E5A52;   /* descriptions, subtitles */
  --text-muted:        #9A9588;   /* placeholders, timestamps, disabled */
  --text-inverse:      #FAFAF7;   /* text on dark brand backgrounds */
  --text-brand:        #296E42;   /* links, active states, CTAs */
  --text-accent:       #B07A1A;   /* award labels, gold highlights */

  /* ─── Border / divider roles ───────────────────────────── */
  --border-subtle:     #E8E4D8;   /* row dividers, section separators (0.5px) */
  --border-default:    #C8C3B2;   /* card borders, input outlines (0.5px) */
  --border-strong:     #9A9588;   /* emphasis borders (0.5px) */
  --border-brand:      #296E42;   /* active tab, focused input (2px) */
  --border-accent:     #D4A843;   /* award card highlight (1px) */
  --border-error:      #E04040;   /* error input state (1px) */

  /* ─── Interactive — Buttons ────────────────────────────── */
  --btn-primary-bg:        #1A3A2A;
  --btn-primary-text:      #EAF3EC;
  --btn-primary-hover-bg:  #296E42;

  --btn-secondary-bg:      #EAF3EC;
  --btn-secondary-text:    #1A3A2A;
  --btn-secondary-border:  #92C49C;
  --btn-secondary-hover-bg:#C2DFC8;

  --btn-accent-bg:         #D4A843;
  --btn-accent-text:       #3D2D04;
  --btn-accent-hover-bg:   #F0C95A;

  --btn-danger-bg:         #FDECEC;
  --btn-danger-text:       #C03030;
  --btn-danger-border:     #F0BABA;
  --btn-danger-hover-bg:   #F7C1C1;

  --btn-disabled-bg:       #E8E4D8;
  --btn-disabled-text:     #9A9588;

  /* ─── Form inputs ──────────────────────────────────────── */
  --input-bg:              #FAFAF7;
  --input-border:          #C8C3B2;
  --input-text:            #2E2C28;
  --input-placeholder:     #9A9588;
  --input-border-focus:    #296E42;
  --input-bg-error:        #FDECEC;
  --input-border-error:    #E04040;
  --input-label:           #5E5A52;

  /* ─── Typography ───────────────────────────────────────── */
  --font-sans:   'Inter', 'IBM Plex Sans Arabic', system-ui, sans-serif;
  --font-mono:   'JetBrains Mono', 'Fira Code', monospace;

  /* ─── Radius ───────────────────────────────────────────── */
  --radius-sm:   6px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-full: 9999px;

  /* ─── Spacing scale (base 4px) ─────────────────────────── */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;

}
```

---

## 3. Color Palette Reference

### 3.1 Forest Green (Primary brand)

| Stop | Hex | Usage |
|------|-----|-------|
| 50 | `#EAF3EC` | Success backgrounds, hover fills, tinted panels |
| 100 | `#C2DFC8` | Badge backgrounds, soft highlights |
| 200 | `#92C49C` | Progress bars, borders on tinted cards |
| 400 | `#4E9963` | Progress fill, icon fills, mid-tone accents |
| 600 | `#296E42` | Links, active states, secondary CTAs |
| 800 | `#1A3A2A` | Primary button, header bar, active nav item bg |
| 900 | `#0D2018` | Sidebar background, deepest nav surface |

### 3.2 Golden Amber (Achievement accent)

| Stop | Hex | Usage |
|------|-----|-------|
| 50 | `#FDF6E3` | Award card background, talent highlight panel |
| 100 | `#F9E4A0` | Avatar background for top-talent students |
| 200 | `#F0C95A` | Stars, badge fills, award icon fills |
| 400 | `#D4A843` | Gold CTA button, award badge, star rating |
| 600 | `#B07A1A` | Award text, gold label text on light bg |
| 800 | `#7A5A0A` | Dark gold text on very light bg |
| 900 | `#3D2D04` | Text on gold button bg |

### 3.3 Warm Parchment (Neutral)

| Stop | Hex | Usage |
|------|-----|-------|
| 50 | `#FAFAF7` | Card / panel background |
| 100 | `#F5F3EE` | Page / app background |
| 200 | `#E8E4D8` | Row dividers, subtle borders |
| 300 | `#C8C3B2` | Card borders, input outlines |
| 500 | `#9A9588` | Placeholder text, muted labels |
| 700 | `#5E5A52` | Secondary body text, descriptions |
| 900 | `#2E2C28` | Primary text, headings |

---

## 4. Surface Hierarchy

Apply surfaces in this order from deepest to highest:

```
Layer 0 — App background    #F5F3EE   (--surface-page)
Layer 1 — Card / Panel      #FAFAF7   (--surface-card)
Layer 2 — Sidebar nav       #0D2018   (--surface-nav)
Layer 3 — Header / topbar   #1A3A2A   (--surface-header)
Layer 4 — Modal backdrop    rgba(13, 32, 24, 0.55)   (--surface-overlay)
```

**Rule:** Never place a `--surface-card` element directly on another `--surface-card`. Always nest card → page background → card to maintain depth separation.

---

## 5. Text Role Rules

| Token | Hex | When to use |
|---|---|---|
| `--text-primary` | `#2E2C28` | All headings, body copy, labels, table cell text |
| `--text-secondary` | `#5E5A52` | Subtitles, descriptions, helper text, sidebar item labels |
| `--text-muted` | `#9A9588` | Placeholders, timestamps, disabled states, captions |
| `--text-inverse` | `#FAFAF7` | Any text rendered on `--surface-nav` or `--surface-header` |
| `--text-brand` | `#296E42` | Hyperlinks, active nav items, primary CTA text |
| `--text-accent` | `#B07A1A` | Award labels, gold-tier indicators, talent tags |

**Rule:** Never place `--text-primary` or `--text-secondary` on a colored (brand or accent) background. Use `--text-inverse` on dark green and the corresponding ramp-900 stop on gold/tinted backgrounds.

---

## 6. Semantic Color Usage

### 6.1 Success
```
Background:  --color-success-bg      #EAF3EC
Border:      --color-success-border  #92C49C
Text:        --color-success-text    #296E42
```
Use for: completion banners, enrolled badges, positive metric deltas, green checkmarks.

### 6.2 Warning
```
Background:  --color-warning-bg      #FEF0E6
Border:      --color-warning-border  #F0B880
Text:        --color-warning-text    #C05B1A
```
Use for: pending review badges, approaching deadline alerts, moderate issues.

### 6.3 Error / Danger
```
Background:  --color-error-bg        #FDECEC
Border:      --color-error-border    #F0BABA
Text:        --color-error-text      #C03030
```
Use for: form validation errors, access denied alerts, destructive action confirmations, suspension badges.

### 6.4 Award / Info (Gold)
```
Background:  --color-award-bg        #FDF6E3
Border:      --color-award-border    #F0C95A
Text:        --color-award-text      #B07A1A
```
Use for: top-performer cards, award metrics, gifted-tier badges, achievement modals.

---

## 7. Component Color Rules

### 7.1 Buttons

| Variant | Background | Text | Hover bg | Border |
|---|---|---|---|---|
| Primary | `#1A3A2A` | `#EAF3EC` | `#296E42` | none |
| Secondary | `#EAF3EC` | `#1A3A2A` | `#C2DFC8` | `#92C49C` 0.5px |
| Gold / Award | `#D4A843` | `#3D2D04` | `#F0C95A` | none |
| Danger | `#FDECEC` | `#C03030` | `#F7C1C1` | `#F0BABA` 0.5px |
| Disabled | `#E8E4D8` | `#9A9588` | no hover | none |

**Rules:**
- Border radius: `--radius-md` (8px) for all buttons
- Padding: `8px 18px` for default, `6px 14px` for small, `10px 24px` for large
- Never use a gradient on buttons
- Disabled buttons must have `cursor: not-allowed` and no hover effect

### 7.2 Badges / Pills

| Badge | Background | Text |
|---|---|---|
| Active | `#EAF3EC` | `#296E42` |
| Enrolled | `#C2DFC8` | `#0D2018` |
| Completed | `#92C49C` | `#0D2018` |
| Top talent | `#F9E4A0` | `#3D2D04` |
| Featured | `#1A3A2A` | `#C2DFC8` |
| Pending | `#FEF0E6` | `#C05B1A` |
| Suspended | `#FDECEC` | `#C03030` |
| Archived / Draft | `#FAFAF7` | `#5E5A52` + border `#C8C3B2` 0.5px |

**Rules:**
- Border radius: `--radius-full` (pill shape)
- Font size: 11–12px, font weight: 500
- Padding: `3px 10px`
- Never use plain black text on any colored badge background

### 7.3 Form Inputs

| State | Background | Border | Text |
|---|---|---|---|
| Default | `#FAFAF7` | `#C8C3B2` 0.5px | `#2E2C28` |
| Focus | `#FAFAF7` | `#296E42` 2px | `#2E2C28` |
| Filled / valid | `#FAFAF7` | `#92C49C` 0.5px | `#2E2C28` |
| Error | `#FDECEC` | `#E04040` 1px | `#2E2C28` |
| Disabled | `#E8E4D8` | `#C8C3B2` 0.5px | `#9A9588` |
| Placeholder text | — | — | `#9A9588` |
| Label text | — | — | `#5E5A52` |

**Rules:**
- Border radius: `--radius-md` (8px)
- Height: 36px for default inputs, 32px for compact/table inputs
- Error message text: `#C03030`, font size 11px, margin-top 3px

### 7.4 Navigation Sidebar

```
Background:           #0D2018   (--surface-nav)
Logo / brand mark:    #D4A843   (gold on dark)
Nav item — default:   transparent bg, #92C49C text
Nav item — hover:     #1A3A2A bg, #C2DFC8 text
Nav item — active:    #1A3A2A bg, #EAF3EC text, left border 2px #D4A843
Icon fill — default:  #4E9963
Icon fill — active:   #EAF3EC
User avatar bg:       #296E42, text #EAF3EC
```

### 7.5 Top Header Bar

```
Background:     #1A3A2A   (--surface-header)
Page title:     #FAFAF7   font-size 15px, weight 500
Subtitle/meta:  #92C49C   font-size 11px
Icon buttons:   #4E9963 fill, hover #EAF3EC
Live badge:     #EAF3EC bg, #296E42 text
```

### 7.6 Cards & Panels

```
Background:     #FAFAF7   (--surface-card)
Border:         #E8E4D8   0.5px
Border radius:  --radius-lg (12px)
Padding:        16px 20px (default), 12px (compact/dashboard)
```

Award / highlighted card variant:
```
Background:     #FDF6E3
Border:         #F0C95A   0.5px
```

### 7.7 Metric / Stat Cards

```
Background:     #FAFAF7
Border:         #E8E4D8   0.5px
Border radius:  --radius-md (8px) or --radius-lg (12px)
Label:          #9A9588   font-size 10–11px
Value:          #2E2C28   font-size 20–24px, weight 500
Delta positive: #296E42   font-size 10px
Delta warning:  #C05B1A   font-size 10px
```

Award metric card variant (use when the metric is award-related):
```
Background:     #FDF6E3
Border:         #F0C95A   0.5px
Label:          #B07A1A
Value:          #3D2D04
```

### 7.8 Tables

```
Header row bg:      #F5F3EE
Header text:        #5E5A52   font-size 11px, weight 500, uppercase, letter-spacing 0.06em
Row bg — default:   transparent
Row bg — hover:     #EAF3EC
Row bg — selected:  #C2DFC8
Row border:         #E8E4D8   0.5px bottom
Cell text:          #2E2C28   font-size 13px
```

### 7.9 Alert / Notification Banners

Structure: `left border 3px solid [color] + background [semantic bg] + text [semantic text]`

```
Success:  border #296E42,  bg #EAF3EC,  text #1A3A2A
Award:    border #D4A843,  bg #FDF6E3,  text #3D2D04
Warning:  border #E07A2A,  bg #FEF0E6,  text #5A2A0A
Error:    border #E04040,  bg #FDECEC,  text #5A1010
```

**Rules:**
- Border radius: `--radius-md`, border-left only → use `border-radius: 0` when only left border is present
- Padding: `10px 14px`
- Font size: 13px

### 7.10 Progress Bars

```
Track bg:   #0D2018 (on dark surface) or #E8E4D8 (on light surface)
Fill — default:   #4E9963
Fill — award:     #D4A843
Fill — warning:   #E07A2A
Height:     4–6px
Border radius: --radius-full
```

---

## 8. Typography

### 8.1 Font stack

```css
font-family: 'Inter', 'IBM Plex Sans Arabic', system-ui, sans-serif;
```

Use `IBM Plex Sans Arabic` or `Noto Sans Arabic` for Arabic/RTL content. The same size scale applies in both directions.

### 8.2 Type scale

| Role | Size | Weight | Color | Line height |
|---|---|---|---|---|
| Display | 32px | 500 | `--text-primary` | 1.2 |
| H1 | 24px | 500 | `--text-primary` | 1.3 |
| H2 | 20px | 500 | `--text-primary` | 1.35 |
| H3 | 16px | 500 | `--text-primary` | 1.4 |
| Body | 14px | 400 | `--text-primary` | 1.7 |
| Small / Caption | 12px | 400 | `--text-secondary` | 1.5 |
| Label / Section heading | 11px | 500 | `--text-muted` | 1.4 |

Label / section headings use `text-transform: uppercase; letter-spacing: 0.07em`.

### 8.3 Rules
- Only two weights across the whole platform: **400** (regular) and **500** (medium). Never use 600, 700, or bold — they read as heavy against the warm neutral background.
- Sentence case everywhere. Never ALL CAPS for headings (labels/section titles are the only uppercase exception, at 11px).
- Minimum font size: **11px**. Never go below this.

---

## 9. RTL / Arabic Support

All components must support `dir="rtl"`. Apply the following adjustments when RTL is active:

```css
[dir="rtl"] .sidebar       { right: 0; left: auto; }
[dir="rtl"] .alert-banner  { border-left: none; border-right: 3px solid; }
[dir="rtl"] .nav-item-active { border-left: none; border-right: 2px solid var(--color-accent-400); }
[dir="rtl"] .input          { text-align: right; }
```

All colors, backgrounds, and spacing remain identical in RTL. Only directional layout properties flip.

---

## 10. Dark Mode (Optional / Future)

If dark mode is implemented, use these swaps. All other rules remain the same.

| Light value | Dark equivalent |
|---|---|
| `--surface-page` `#F5F3EE` | `#0D1A10` |
| `--surface-card` `#FAFAF7` | `#132218` |
| `--surface-nav` `#0D2018` | `#070F0B` |
| `--surface-header` `#1A3A2A` | `#0D2018` |
| `--text-primary` `#2E2C28` | `#EAF3EC` |
| `--text-secondary` `#5E5A52` | `#92C49C` |
| `--text-muted` `#9A9588` | `#4E9963` |
| `--border-subtle` `#E8E4D8` | `#1A3A2A` |
| `--border-default` `#C8C3B2` | `#296E42` |

Brand and accent ramps remain the same — only surfaces and text shift.

---

## 11. Do's and Don'ts

### Do
- Always use a CSS variable from this file — never hardcode a hex value in a component
- Use `--text-inverse` (`#FAFAF7`) for all text on `--surface-nav` and `--surface-header`
- Use the 900 ramp stop for text placed on a 50-stop tinted background (e.g., gold text on gold card)
- Use `--radius-full` for all badges and pills
- Maintain 0.5px borders on cards and inputs — do not use 1px borders for default states
- Use `--color-accent-400` (`#D4A843`) only for achievement-related UI (awards, stars, top-talent indicators) — not for general decoration

### Don't
- Don't use plain `black` (`#000000`) or `white` (`#FFFFFF`) anywhere — always use the warm neutral ramps
- Don't place two cards with `--surface-card` background directly adjacent without a `--surface-page` gap between them
- Don't use more than two semantic colors in a single component
- Don't use the gold accent color for primary navigation or structural UI — it is reserved for achievement meaning only
- Don't use `font-weight: 700` or `bold` anywhere
- Don't add gradients, drop shadows, or glow effects — all surfaces are flat
- Don't use rounded corners on single-sided borders (e.g., `border-left` alerts must have `border-radius: 0`)

---

## 12. Quick Reference Cheat Sheet

```
BRAND DARK    #0D2018   sidebar bg
BRAND         #1A3A2A   header, primary button, active nav
BRAND MID     #296E42   links, active state, focus ring
BRAND LIGHT   #EAF3EC   success bg, button text, tinted panel

GOLD          #D4A843   award button, star, badge fill
GOLD TEXT     #B07A1A   text on gold background
GOLD BG       #FDF6E3   award card background

PAGE BG       #F5F3EE   app / page background
CARD BG       #FAFAF7   card, panel, modal
BORDER        #E8E4D8   row divider, subtle border
BORDER MED    #C8C3B2   card border, input outline

TEXT          #2E2C28   primary — headings, body
TEXT SEC      #5E5A52   secondary — descriptions
TEXT MUTED    #9A9588   muted — placeholders, captions
TEXT INV      #FAFAF7   inverse — text on dark bg

SUCCESS       #296E42 / #EAF3EC
WARNING       #C05B1A / #FEF0E6
ERROR         #C03030 / #FDECEC
AWARD         #B07A1A / #FDF6E3
```

---

*Document version: 1.0 — Mawaheb Foundation Platform*
*Maintain this file as the single source of truth. All updates to colors must be reflected here first before any component is changed.*
