# Design System Document: The Editorial Sanctuary

## 1. Overview & Creative North Star
**Creative North Star: The Modern Scriptorium**
This design system is a rejection of the "app-like" clutter found in modern digital products. It is an editorial-first framework designed for deep contemplation. We are not building a utility; we are building a sanctuary. 

The system moves beyond the rigid, boxy grid of standard web apps. By utilizing intentional asymmetry, expansive negative space, and tonal layering, we create a "High-End Editorial" experience. The goal is to make the user feel as though they are engaging with a masterfully typeset physical volume, translated into a fluid, digital medium. The interface should "breathe," retreating when the user begins to read and appearing only as a whisper when navigation is required.

---

## 2. Colors & Tonal Depth
Our palette is rooted in the organic. We use a base of soft parchment and deep charcoal to ground the reading experience, with olive and gold accents to guide the eye.

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders for sectioning or containment. 
Boundaries must be defined through:
- **Background Color Shifts:** A `surface-container-low` (`#f6f3ee`) section sitting on a `surface` (`#fcf9f4`) background.
- **Negative Space:** Using the spacing scale to create mental boundaries without physical lines.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of fine paper.
- **Level 1 (Base):** `surface` (`#fcf9f4`) for the main reading canvas.
- **Level 2 (Navigation/Context):** `surface-container` (`#f0ede8`) for sidebars or secondary controls.
- **Level 3 (Interactive Elements):** `surface-container-high` (`#ebe8e3`) for active cards or modals.

### The "Glass & Gradient" Rule
To add a "soul" to the digital interface, use Glassmorphism for floating UI (like a bottom player bar or a floating search head). 
- **Effect:** Use `surface-container-lowest` at 80% opacity with a `24px` backdrop blur.
- **CTAs:** For primary actions, use a subtle linear gradient from `primary` (`#4b6026`) to `primary-container` (`#63793c`) at a 135-degree angle. This prevents the olive green from feeling flat.

---

## 3. Typography
The typographic soul of this system lies in the tension between the modern utility of **Manrope** and the literary elegance of **Newsreader**.

- **The Voice (Scripture):** Use **Newsreader** for all scripture text (`body-lg`, `body-md`). It is designed for long-form legibility. High-contrast headlines (`display-lg`) should also use Newsreader to feel like a title page.
- **The Scaffold (UI):** Use **Manrope** for navigation, labels, and metadata. It provides a clean, neutral contrast to the serif "content," ensuring the user always knows what is "the word" and what is "the interface."
- **Optical Sizing:** For `display-lg` titles, decrease the letter spacing by `-0.02em` to create a tighter, premium editorial look.

---

## 4. Elevation & Depth
Traditional drop shadows are too "digital." We achieve depth through **Tonal Layering**.

- **The Layering Principle:** Place a `surface-container-lowest` (`#ffffff`) card on a `surface-container-low` (`#f6f3ee`) background to create a soft, natural lift.
- **Ambient Shadows:** If a floating element (like a context menu) requires a shadow, it must be extra-diffused. 
    - *Spec:* `0px 12px 32px rgba(28, 28, 25, 0.06)`. The shadow color is a tinted version of `on-surface`, never pure black.
- **The "Ghost Border" Fallback:** If a boundary is strictly required for accessibility, use `outline-variant` (`#c8c7ba`) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary-container`), white text, `md` (`0.375rem`) corner radius. High-end buttons should feel substantial but not bulky.
- **Secondary:** No fill. Use `label-md` in `primary` color with a `Ghost Border`.
- **Tertiary:** Text-only. Use `label-md` in `secondary` (`#725a38`) for a muted gold accent.

### Interactive Scripture Cards
- **Forbid Dividers:** Never use a horizontal line to separate verses or chapters. Use `1.5rem` of vertical whitespace or a shift to `surface-container-lowest`.
- **Corner Radius:** Use `lg` (`0.5rem`) for cards to give a soft, approachable feel.

### Progress & Highlights
- **Reading Progress:** Use a slim, 2px bar in `secondary` (`#725a38`) at the very top of the viewport.
- **Scripture Highlights:** Instead of a harsh "marker" look, use a background of `primary-fixed` (`#d2eca2`) with a `0.125rem` (sm) corner radius around the text.

### Inputs & Search
- **Minimalist Search:** A single line of text in `headline-sm` (Manrope). No bounding box. Use the `outline-variant` as a subtle underline that expands from the center when focused.

---

## 6. Do’s and Don’ts

### Do:
- **Embrace Asymmetry:** Place a chapter title (`display-md`) off-center to create an editorial, non-template look.
- **Prioritize Negative Space:** If you think there is enough padding, add 25% more.
- **Use Tonal Transitions:** Transition between sections using background color shifts rather than lines.

### Don't:
- **Don't use 100% Black:** Always use `on-surface` (`#1c1c19`) for text to maintain a soft, parchment-like contrast.
- **Don't use Standard Shadows:** Avoid the "Material Design" default shadows. Stick to Tonal Layering or Ambient Shadows.
- **Don't Over-Animate:** Transitions should be slow, "fade-and-slide" motions (300ms–500ms) that mimic the turning of a page. No "bouncy" or "snappy" easing.

---

## 7. Accessibility
- **Contrast:** Ensure all `on-surface-variant` text meets WCAG AA standards against `surface` backgrounds.
- **Touch Targets:** Minimum touch target for all interactive icons (like bookmarking or sharing) is `44x44px`, even if the icon itself is visually smaller.
- **Readability:** Maintain a line-height of `1.6` for all `Newsreader` body text to prevent eye fatigue during contemplative reading.