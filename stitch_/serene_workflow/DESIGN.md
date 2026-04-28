---
name: Serene Workflow
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3d4947'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#924628'
  on-tertiary: '#ffffff'
  tertiary-container: '#b05e3d'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#773215'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter, Microsoft YaHei, sans-serif
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
  headline-md:
    fontFamily: Inter, Microsoft YaHei, sans-serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-sm:
    fontFamily: Inter, Microsoft YaHei, sans-serif
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  body-main:
    fontFamily: Inter, Microsoft YaHei, sans-serif
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter, Microsoft YaHei, sans-serif
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter, Microsoft YaHei, sans-serif
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 32px
  gutter: 24px
  element-gap: 16px
  section-margin: 48px
---

## Brand & Style

The design system is anchored in the concept of "Administrative Zen." It targets HR professionals and employees in fast-paced corporate environments, aiming to transform the often-stressful task of leave management into a calm, frictionless experience. 

The aesthetic is **Minimalist and Corporate**, prioritizing high legibility and spaciousness. By utilizing a clean white foundation and generous negative space, the interface reduces cognitive load. The emotional response is one of reliability, transparency, and professional ease, ensuring that the software feels like a helpful assistant rather than a complex bureaucratic tool.

## Colors

The palette revolves around a professional **Teal** primary color, chosen for its association with balance and clarity. 

- **Primary:** A refined Teal (#0D9488) used for primary actions and active states.
- **Secondary:** A muted Slate (#64748B) for supportive information and secondary buttons.
- **Surface:** Pure white (#FFFFFF) is the primary background to maintain a "clean paper" feel.
- **Borders:** A soft grey (#E2E8F0) provides structure without visual noise.
- **Status Colors:** Standardized semantic colors for leave approvals: Green (Approved), Amber (Pending), and Red (Rejected), all calibrated to match the softness of the primary teal.

## Typography

This design system utilizes **Inter** paired with **Microsoft YaHei** (or system sans-serif equivalents) to ensure optimal rendering of Chinese characters alongside Latin numerals and text. 

The typographic hierarchy is intentionally restrained. Weight is used sparingly to denote importance, while ample line height (1.5x - 1.6x) is maintained to accommodate the visual density of Hanzi characters. Large, clear headings guide the user through multi-step forms, while small labels are kept crisp and legible for data-heavy leave balance tables.

## Layout & Spacing

The layout follows a **Fixed-Fluid hybrid grid**. Sidebars and navigation elements remain fixed to provide a stable anchor, while the primary content area uses a fluid 12-column grid to maximize the visibility of calendars and leave request lists.

A 4px baseline shift is used to maintain a consistent rhythm. Significant whitespace (32px+) is mandated between functional groups to prevent the interface from feeling "crowded," which is essential for maintaining the minimalist aesthetic during complex data entry.

## Elevation & Depth

Hierarchy is established through **Low-contrast outlines** and **Ambient shadows**. 

- **Level 0 (Base):** The main background using the neutral slate tint.
- **Level 1 (Cards/Containers):** Pure white surfaces with a 1px border (#E2E8F0).
- **Level 2 (Active/Hover):** A very soft, diffused shadow (0px 4px 12px rgba(0,0,0,0.03)) to signify interactable elements like leave request cards or calendar events.
- **Level 3 (Modals):** A deeper but still translucent shadow (0px 10px 30px rgba(0,0,0,0.08)) with a backdrop blur to keep the user focused on the task at hand.

## Shapes

The design system employs a consistent **8px (0.5rem) corner radius** for all primary UI components, including buttons, input fields, and cards. This specific roundedness strikes a balance between professional geometry and a modern, approachable feel. Smaller elements like tags and badges use a fully rounded (pill) shape to distinguish them from functional inputs.

## Components

### Buttons
- **Primary:** Solid Teal background with white text. No gradient. 8px radius.
- **Secondary:** Transparent background with a Teal border and Teal text.
- **Tertiary:** Muted Slate text with no border, used for "Cancel" or less frequent actions.

### Form Inputs
Inputs feature a 1px soft grey border that transitions to Teal on focus. Labels are positioned above the input in a slightly smaller, weighted font. Error states are indicated by a 1px red border and a supportive error message below the field.

### Status Badges
Used for leave status (Approved, Pending, Rejected). These are pill-shaped with a low-opacity background of the semantic color and high-contrast text of the same hue (e.g., light green background with dark green text).

### Leave Cards
Summary cards for individual requests should feature high-contrast headlines and secondary-color subtext. They use a Level 1 elevation, moving to Level 2 on hover to indicate they are clickable for details.

### Date Picker
A critical component that must remain spacious. Active dates use the primary Teal circle, while "Requested Range" uses a very light Teal background tint to connect the start and end dates visually.