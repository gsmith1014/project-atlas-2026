# CorVista Health — Design System

CorVista Health is an AI-powered cardiovascular diagnostic platform. The CorVista System is an FDA-cleared, non-invasive, point-of-care test that brings gold-standard cardiovascular and pulmonary diagnostic capability into the doctor's office — no stress, radiation, or contrast required. A single signal capture from a patient at rest is processed in the cloud and returns a multi-disease report (currently CAD + PH, with HF/PCWP submitted and INOCA in breakthrough designation) in minutes.

The company is at a late-clinical / commercial-readiness stage: ~10,000+ patients tested, 95+ patents, 20+ publications, headquartered at 3 Bethesda Metro Center, Suite 700, Bethesda, MD 20814, corvista.com.

## Products represented in this system

CorVista is essentially **one platform** with surfaces that ladder up to it. Materials in this project represent:

1. **CorVista System hardware + clinician workflow** — the bedside capture device ("CorVista Capture") and the web portal where reports are read ("CorVista Reports").
2. **Marketing collateral** — letter / tabloid posters used at conferences (ATS, ACC) and for sales calls, and a master investor / company-overview deck (14 slides).
3. **Brand identity** — logo lockups, color, and type used across all touchpoints.

There is no public product UI / Figma / codebase included in this brief — the UI kit is reconstructed from the **CorVista Reports** screenshot that appears in the investor deck's "How it works" diagram and the **Capture** device imagery. All other product surfaces are inferred from the workflow narrative and marked as best-effort recreations.

## Sources

All sources are local uploads in `uploads/` (provided in the original brief):

| File | Type | What it taught us |
|---|---|---|
| `CVH_Logo_HEX-212935[43250].png` | Brand mark | Primary lockup: "COR♥VISTA HEALTH" — navy + sky V mark. Filename encodes the navy hex `#212935`. |
| `CVH_White.png` | Brand mark | All-white lockup for use on dark / photographic backgrounds. |
| `Untitled design-108.png` | Brand mark | Wordmark only (no "HEALTH") in navy — used when the "Health" descriptor is redundant. |
| `Untitled design-109.png` | Reference design | Editorial leadership-announcement social card on parchment — shows the headline + italic-blue pull-word treatment, eyebrow / footer mono labels, and photo-frame on navy. |
| `Tabloid - 1.pdf` | Poster | Mission statement, parchment + dark navy split. Demonstrates the all-mono body-copy treatment for editorial posters. |
| `Tabloid - 2.pdf` | Poster | "One test. Clearer answers for breathless patients." — full workflow infographic on dark navy with ECG waveform background. |
| `Tabloid - 3.pdf` | Poster | "Behind every breath, a question." — ATS 2026 PH conference poster on dark navy. |
| `Letter - 3.pdf` | Sales sheet | "PH presents like everything else." — half-dark / half-light split layout. |
| `Letter - 5.pdf` | Sales sheet | "From dyspnea to direction in minutes." — light-only three-step explainer with badge icons. |
| `CorVista_Master_Non-Con_May26.pdf` | 14-slide investor deck | Definitive source for slide layouts, colors, data viz, and tone. |

No Figma file, no codebase, no public site copy was provided. If you have those, drop them in `uploads/` and re-run the design-system pass — the UI kit in particular will benefit from real source.

---

## Index — what's in this folder

```
README.md                    ← you are here
SKILL.md                     ← Agent-Skill manifest (download for Claude Code)
colors_and_type.css          ← CSS custom properties + semantic utilities

assets/
  logos/                     ← PNG logo lockups (color + white + wordmark)
  imagery/                   ← Reference posters and source imagery
preview/                     ← Design System tab cards
pdf_renders/                 ← PNG renders of the source PDFs, for visual reference

ui_kits/
  reports-portal/            ← CorVista Reports web portal (clinician-facing)
  device-capture/            ← Capture device companion screens
  marketing/                 ← Marketing-site landing patterns

slides/                      ← Slide templates derived from the investor deck
```

---

## Content fundamentals

CorVista's voice is **clinically confident, plainspoken, and pragmatic**. It is written for cardiologists, pulmonologists, internists, and the executives who fund and reimburse them. Read alongside the master deck and tabloids in `pdf_renders/` to feel the cadence.

### Tone

- **Direct, not promotional.** Every claim sits on a footnote. Sentences are short and load-bearing. "Fewer tests. Earlier answers. Better care." is exactly the rhythm — three nouns, three periods, no adjectives.
- **Patient-centered, not product-centered.** Headlines lead with the patient situation, not the device: *"For breathless patients."* *"Behind every breath, a question."* *"From dyspnea to direction in minutes."* The product enters second.
- **Numbers do the heavy lifting.** Almost every section pairs a claim with a hero number: `2.26 yrs`, `82%`, `>99% NPV`, `~$1,200 saved per case`. Numbers are styled big and blue; the explanatory sentence sits underneath, smaller and grey.
- **Clinical, never cute.** No exclamation marks. No emoji. No metaphors that aren't anchored in cardiology. The closest the brand gets to a metaphor is "behind every breath, a question" — and even that resolves to a clinical decision in the next sentence.

### Casing

- **Sentence case** for headlines and body. *"FDA-cleared proof points provide foundation for platform expansion."* Not title case.
- **UPPERCASE + tracked + mono** for eyebrow labels and meta data — `PROBLEM`, `SOLUTION`, `MARKET OPPORTUNITY`, `0 1 D O C T O R ' S O F F I C E`. Always paired with a sky-blue underline or color.
- **ALL CAPS in body copy** is reserved for FDA / acronym terms: `CAD`, `PH`, `HFpEF`, `INOCA`, `NPV`, `PCWP`, `CCTA`, `CPT III`. Spell out on first reference, then abbreviate.
- The product is **CorVista** (camel-cap, single word). The company is **CorVista Health**. The device family uses Title Case: **CorVista Capture**, **CorVista Cloud**, **CorVista Reports**.

### Person and address

- **Third person** when describing the system: *"CorVista changes the starting point…"*, *"The CorVista System brings gold-standard…"*
- **Second person ("you")** when speaking to the clinician — almost always in poster headlines or CTAs: *"Now you can answer it at the point of care."* *"See a demo of the CorVista System."*
- **First-person plural ("we / our")** appears only in mission statements and leadership announcements: *"Our mission."* *"Strengthening how we grow."*

### Punctuation quirks

- **Em-dash, spaced (` — `)** is the workhorse: *"a single, non-invasive test that delivers actionable insights in minutes."* *"Fewer tests — earlier answers — better care."*
- **Italics on a single word** for emphasis, often in sky-blue. The leadership poster does *"Strengthening how we ​**grow**​."* with `grow` italic + sky-blue.
- **Trailing period on headline fragments** — *"Behind every breath, a question."* — gives the brand its declarative weight. Use them.

### Vocabulary worth borrowing

- "Point-of-care" / "at the point of care" — appears in nearly every headline.
- "Gold-standard"
- "Differential" (medical sense — *"PH belongs on the differential"*)
- "Workup" (the cardiology workflow)
- "First-test" / "smarter first test"
- "Breakthrough Designated"
- "FDA-cleared" — always with that hyphen, always before the noun.

### Vocabulary to avoid

- "Revolutionary," "disrupting," "AI-powered," "synergy," "unlock potential" — too marketing-y for the brand.
- Patient anecdotes / first names — CorVista talks about *cohorts*, not Karen.
- Emoji — never.
- Metaphors involving non-clinical objects (rockets, lightbulbs, journeys).

---

## Visual foundations

CorVista is **editorial medtech** — closer to *The Atlantic* or a peer-reviewed journal cover than to a typical SaaS dashboard. The vocabulary is restrained: one big idea per surface, lots of negative space, two type families doing all the work, three or four colors.

### Color

- The brand sits on **deep navy `#212935`** as its anchor. Posters are typically full-bleed navy, with a thin parchment or white slice for the contact / mission strip.
- **Sky `#5DB4E8`** is the only "color" color. It carries the V mark, all eyebrow labels, italic emphasis words, stats, icons, links. Never used as a flat background — always as ink on navy or accent on light.
- **Parchment `#F4EFE6`** is the editorial cream. Used for posters and social cards where the brand wants to feel like a publication, not a product. Pairs only with navy ink.
- **Slate `#F2F4F7`** is the deck / product background. Almost-white but with a cool tint — never use pure white as the page background in deck contexts.
- **Accents are rare**: gold `#F3B51A` for big dollar callouts (the *$1.8T* projection on the problem slide), coral `#D85528` for "THE PROBLEM" labels and urgency stats, green `#2BC48A` for affirmative checkmarks. Use no more than one accent per surface.
- Do **not** invent new colors. Do **not** use gradients of two brand colors. The only gradient the brand allows itself is the soft heart-anatomy hero on slide 1 of the master deck — and that's a photographic / generative-art piece, not a color treatment.

### Typography

- **Display + body now use different families.** Display is **Sora** (Google Fonts) — clean geometric proportions, generous counters, modern editorial feel. Body is **Manrope** (Google Fonts) — slightly tighter and warmer, optimized for paragraph copy. Source files use **Söhne** (Klim Type, commercial); both Sora and Manrope substitute well. **Flag for the user: confirm whether Söhne licenses can be supplied; if so, swap the `@import` in `colors_and_type.css` and update `--cv-font-display` / `--cv-font-body`.**
- **Mono** is used heavily — eyebrows, meta footers, sometimes the entire body copy on a poster (see Tabloid 1's mission statement). This system uses **Geist Mono** (Google Fonts) for its clean, slightly geometric character that pairs well with Sora and Manrope.
- **Headlines are big, multi-line, and breathe.** 56–96px on posters, 36–48px on slides. Always sentence case. Tracking is tight (-1% to -1.5%) on display sizes.
- **Italics are intentional.** Italic = emphasis. One word per headline. Often in sky-blue.
- **Eyebrow labels are mono, uppercase, tracked +18%**, and live above the headline with a 2px sky underline — see "PROBLEM", "SOLUTION", "TECHNOLOGY", etc. on every deck slide.

### Layout

- **Generous margins.** Posters use ~6–8% side margins. Slides use ~5% (60px on a 1280px slide).
- **Strict grids, asymmetric content.** The leadership poster splits 60/40 vertical. The "PH presents like everything else" sales sheet splits 50/50 dark/light. Slides are 12-column with a strong left-anchored eyebrow + headline pattern.
- **One big idea per surface.** Never two competing headlines.
- **Fixed elements:** logo top-left at ~5% inset, page number / `corvista.com` bottom-right or bottom-center.

### Backgrounds

- Three options, picked deliberately:
  1. **Solid navy `--cv-ink-deep`** — for editorial posters and section dividers.
  2. **Slate `--cv-slate-bg`** — for slides and product surfaces. Cards on top are white.
  3. **Parchment `--cv-parchment`** — for "leadership / company / culture" pieces only.
- A subtle, low-opacity **ECG waveform** runs as a background motif on navy surfaces (visible on Tabloid 2 and 3). It's not a watermark, it's a faint horizontal line — under 8% opacity, behind everything.
- No full-bleed lifestyle photography on slides — the deck uses one editorial photo per slide *at most*, framed as a rectangle with a small rounded corner.
- Occasional **dot-grid / particle texture** on dark surfaces (very faint, see slide 1 of master deck).

### Imagery

- **Cool, slightly de-saturated.** Photos lean cyan/navy in shadows. No warm tones unless the surface is parchment.
- **Real clinical settings** — exam rooms, clinicians at work, real headshots. No stock smiling business people.
- **Isometric line illustrations** for product workflow (see Tabloid 2's "Doctor's Office" room). Always white-stroke on navy, 1.5–2px strokes, no fills.
- **The "V" heart mark** is the only repeating brand glyph. Use it as the favicon, loading state, or as a tracker on long-scrolling materials.

### Borders & dividers

- **Hairlines: 1px, `--cv-border` (`#DCE1E8`)** on light, `--cv-border-dark` (`#1B2C40`) on navy.
- **Sky underline (2px)** is the brand's signature divider — it sits under section labels.
- **Vertical sky bar (2–3px)** on the left edge of pull-quote callout boxes (see "Specialist champions validate CorVista…" slide).

### Corner radii

- **6px** for cards, panels, image frames, input fields.
- **2–4px** for inline badges, small buttons.
- **Pill (999px)** for FDA-status badges only (`FDA-CLEARED`, `BREAKTHROUGH DESIGNATED`).
- Never `border-radius: 12px+`. Never asymmetric radii.

### Shadows & elevation

- **Soft, low-contrast shadows.** Cards on slate use `--cv-shadow-1` (1–3px y, ~6% opacity). Modals use `--cv-shadow-3`.
- **No shadows on dark surfaces.** Use a 1px `--cv-border-dark` hairline instead, or a `--cv-sky` left-bar accent.
- **No inner shadows.** No neumorphism. No "glassy" treatments.

### Transparency & blur

- **Very rarely.** The brand is almost entirely solid surfaces. The only transparent treatments allowed:
  - The dot-grid texture overlay on navy (under 8% opacity).
  - The ECG waveform motif (under 8% opacity).
  - A 0.6 alpha black scrim under photographic content if text must overlay.
- **No backdrop-filter blur.** No glassmorphism.

### Buttons & interactive states

- **Primary button** — solid `--cv-ink` background, white text, 6px radius, 12px × 20px padding. On hover, background goes to `--cv-ink-deep`. On press, background `--cv-ink-deepest` and translates down 1px.
- **Secondary button** — 1px `--cv-ink` border, transparent fill, ink text. On hover, fill becomes `--cv-slate-100`.
- **Sky CTA** (rare, used on dark surfaces) — solid `--cv-sky` background, navy text.
- **Hover on links / nav items** — color shifts to `--cv-sky`, no underline (the brand uses position + color, not underlines, for affordance).
- **Press state** — subtle scale `0.98` and 1px translation, never a "ripple" or "splash."
- **Focus ring** — 2px `--cv-sky` outline with 2px offset.

### Motion

- **House easing** — `cubic-bezier(0.2, 0.7, 0.2, 1)` — calm, slightly damped. Available as `--cv-ease`.
- **Durations** — 150ms for micro (hover/focus), 220ms for component-level, 420ms for scene transitions. No bouncy springs.
- **Fades and short translates only.** No flips, no rotations, no parallax. The brand is poised, not playful.
- **Pulse / heartbeat** on the V mark is allowed as a loading state — very subtle (`scale(1) → scale(1.04) → scale(1)` over 1.2s, sky-blue glow).

### Layout rules of thumb

- Logo top-left. Page meta (date / section) top-right in mono. Footer bottom-left for legal / source citations.
- All citations live as small mono footnotes at the bottom of the surface — never inline.
- Pages don't end without a logo or the V mark somewhere.

---

## Iconography

CorVista's icon language is **minimal, white-line, on navy**. Icons are functional, not decorative.

### What the brand uses

- **Lucide icons (CDN-loaded)** are the closest match to the stroke weight, geometry, and "lab-clean" feel of what appears in the source materials. Use Lucide as the default icon set. Load from CDN:
  ```html
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
  ```
  Or use the static SVG sprite from `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/`.
- **Stroke weight**: 1.5–2px. Match the weight in Lucide's default (1.5px) for body icons; use 2px for hero icons (the workflow steps on Tabloid 2).
- **Color**: white on navy, navy on light, sky on either as accent. No multi-color icons.
- **Size**: 16px for inline, 24px for nav, 32–48px for feature illustration, 64–96px for the workflow-step badges.

### Brand-specific glyphs

- **The "V" heart mark** is the only brand-specific icon. Available as `assets/logos/corvista-wordmark-navy.png` (use this for crops). For an isolated mark, crop the "V" character out of the logo or use it as a generative element.
- **Badge icons** in workflow diagrams (DR, CV, Dx) are simply 32px navy rounded squares with the abbreviation in sky-blue mono. See `ui_kits/marketing/WorkflowBadge.jsx`.

### What's NOT used

- **Emoji**: never. Not in headlines, not in body, not in chat-style microcopy.
- **Filled icons**: rarely. The brand reads as outlined / stroked.
- **Custom illustration**: only the isometric "doctor's office" room on Tabloid 2 — that piece is bespoke and not re-deployable as a general illustration system.
- **Unicode special chars as icons** (✓ ✗ ★): allowed sparingly for affirmative checks in dense data tables; otherwise use the Lucide `check` / `x-circle` icon.

### Substitution disclosure

> **The exact icon set used in CorVista source files is not packaged with this brief.** Lucide is the closest stylistic match available from a CDN. If CorVista has a custom icon library (likely lives in their internal Figma), please share it and we will replace the Lucide references in `ui_kits/*/*.jsx`.

---

## Font substitution notice

> **Söhne (Klim Type Foundry) is the suspected display + body family in CorVista source materials.** Söhne is a paid license and is not redistributable. This system substitutes **Sora** for display and **Manrope** for body — both from Google Fonts. If you have Söhne licensed, drop the WOFF2 files into `fonts/` and update the `@font-face` block at the top of `colors_and_type.css` — the rest of the system will pick it up automatically.
>
> **Mono is `Geist Mono` (Google Fonts).** Picked for its clean geometric character. If the real CorVista mono is confirmed (likely IBM Plex Mono or similar), update `--cv-font-mono`.

---

## How to use this system

1. **Linking the CSS** — every HTML artifact should `<link rel="stylesheet" href="../colors_and_type.css" />` (adjust depth). All tokens are CSS custom properties on `:root`.
2. **Building a slide** — start from `slides/index.html` and clone a section. Pick a layout (title / problem / data-grid / quote / leadership) and replace content.
3. **Building a product screen** — start from `ui_kits/reports-portal/index.html` (the clinician-facing CorVista Reports web app) — it has the nav, header, layout grid, and component palette wired up.
4. **Building a poster** — clone the markup of a tabloid in `slides/` (PosterTabloid.jsx) or compose from scratch using the type and color tokens directly.

When in doubt: less, larger, blacker. The brand likes confident silence.
