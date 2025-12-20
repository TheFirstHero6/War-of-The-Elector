# Figma Design System Reference

## Overview

This document captures the design system and layout patterns from the design for "War of the Elector".

## /home/thefirsthero6/.local/share/fonts/home/thefirsthero6/.local/share/fonts/home/thefirsthero6/.local/share/fontsColor System

### Primary Colors

- **Background**: `slate-900` (dark theme)
- **Primary Accent**: Gold/Yellow (`#D4AF37` / `yellow-500` / `yellow-600`)
  - Used for: Buttons, borders, text highlights, shadows
- **Text Colors**:
  - Primary: `yellow-300` (headings)
  - Secondary: `yellow-200/80` (navigation links)
  - Body: `gray-200` / `slate-100`
  - Italic/Subtitle: `yellow-200` with italic styling

### Color Usage

- **Backgrounds**:
  - `bg-slate-900` (main background)
  - `bg-slate-800/30` or `bg-slate-800/40` (card backgrounds with opacity)
  - `backdrop-blur-sm` or `backdrop-blur-md` for glass morphism effects
- **Borders**:

  - `border-yellow-600/20` (subtle borders)
  - `border-yellow-600/30` (card borders)
  - `border-yellow-600/40` (accent borders)
  - `border-yellow-600/50` (button borders)

- **Shadows**:
  - `shadow-[0px_0px_15px_0px_rgba(234,179,8,0.4)]` (gold glow)
  - `shadow-[0px_10px_25px_0px_rgba(0,0,0,0.2)]` (card shadows)
  - `shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.3)]` (large cards)

## Typography

### Font Families

- **Headings**: `font-['Cinzel',sans-serif]`
- **Body/Descriptions**: `font-['Playfair_Display',sans-serif]`
- **Script/Special**: `font-['Dancing_Script',sans-serif]`

### Text Styling

- **Headings**:
  - Large: `text-yellow-300` with text shadows
  - Text shadow: `[text-shadow:rgba(234,179,8,0.1)_0px_0px_30px,rgba(234,179,8,0.3)_0px_0px_20px,rgba(234,179,8,0.5)_0px_0px_10px]`
- **Body Text**: `text-gray-200` with `leading-relaxed`
- **Italic Text**: `italic` with `text-yellow-200`

## Layout Structure

### NavBar

- **Position**: Fixed at top (`fixed top-0 left-0 right-0 z-50`)
- **Styling**:
  - `backdrop-blur-md bg-slate-900/80`
  - `border-b border-yellow-600/20`
- **Logo**: Circular with border (`rounded-full border-2 border-yellow-600`)
- **Navigation**: Horizontal links with hover effects
- **Mobile**: Hamburger menu that expands vertically

### Hero Section

- **Height**: Full viewport height (`min-h-screen`)
- **Parallax**: Uses `useScroll` and `useTransform` for scroll-based animations
- **Decorative Corners**: SVG corner decorations at each corner
- **Logo**: Large animated logo (hover rotates 360°, scales 1.1)
- **Buttons**: Two CTA buttons (primary gradient, secondary outlined)

### Feature Cards

- **Dimensions**: `h-[280px] w-full md:w-[264px]`
- **Styling**:
  - `backdrop-blur-sm bg-slate-800/40`
  - `rounded-3xl border border-yellow-600/30`
- **Hover Effects**:
  - `y: -10, scale: 1.05`
  - Border color changes to `border-yellow-500/50`
  - Glow effect appears

### Sections

- **Spacing**: `py-20 px-8`
- **Container**: `max-w-7xl mx-auto`
- **Cards**: Large rounded cards with backdrop blur and gradients

## Component Patterns

### Buttons

#### Primary Button

```tsx
className =
  "px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-['Cinzel',sans-serif] shadow-[0px_0px_15px_0px_rgba(234,179,8,0.3)]";
```

- Gradient background (yellow-500 to yellow-600)
- Dark text (`text-slate-900`)
- Gold glow shadow
- Hover: scale 1.05, y: -5, increased shadow

#### Secondary Button

```tsx
className =
  "px-8 py-4 rounded-xl border-2 border-yellow-600/50 hover:border-yellow-500 text-yellow-300 font-['Cinzel',sans-serif]";
```

- Outlined style
- Transparent background
- Hover: border color intensifies

### Cards

#### Feature Card

```tsx
className =
  "backdrop-blur-sm bg-slate-800/40 rounded-3xl border border-yellow-600/30 group-hover:border-yellow-500/50";
```

- Glass morphism effect
- Subtle borders
- Hover: border color change, scale up, shadow increase

#### Section Card

```tsx
className =
  "backdrop-blur-sm bg-slate-800/30 rounded-3xl border border-yellow-600/40 p-12 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.3)]";
```

- Larger padding
- Stronger border
- Larger shadow

## Animations

### Framer Motion Patterns

- **Initial**: `y: -100` (slide down)
- **Animate**: `y: 0, opacity: 1`
- **Hover**: `scale: 1.05`, `y: -5` or `y: -2`
- **Tap**: `scale: 0.95`
- **Scroll Animations**: Use `useScroll` and `useTransform` for parallax

### Common Transitions

- Duration: `0.6s` to `0.8s` for main animations
- Delay: `0.2s`, `0.4s`, `0.6s`, `0.8s` for staggered effects
- Easing: Default (cubic-bezier)

## Decorative Elements

### Corner Decorations

- SVG path: `M36 34V30H34V34H30V36H34V40H36V36H40V34H36ZM36 4V0H34V4H30V6H34V10H36V6H40V4H36ZM6 34V30H4V34H0V36H4V40H6V36H10V34H6ZM6 4V0H4V4H0V6H4V10H6V6H10V4H6Z`
- Color: `#D4AF37` (gold)
- Opacity: `opacity-10`
- Positioned at corners with rotations (0°, 90°, -90°, 180°)

### Background Pattern

- Animated SVG decorations scattered across page
- Opacity: `opacity-5`
- Floating animation with varying delays

## Responsive Design

### Breakpoints

- Mobile: Base styles (no prefix)
- Tablet/Desktop: `md:` prefix (768px+)

### Mobile Considerations

- Hamburger menu instead of full nav
- Stacked layouts
- Adjusted padding (`py-32 md:py-20`)

## Key Design Tokens

### Border Radius

- Small: `rounded-lg` or `rounded-xl`
- Medium: `rounded-xl` or `rounded-2xl`
- Large: `rounded-3xl`

### Opacity Levels

- Very subtle: `/5` or `/10`
- Subtle: `/20` or `/30`
- Medium: `/40` or `/50`
- Strong: `/80`

### Spacing

- Section padding: `py-20 px-8`
- Card padding: `p-8` or `p-12`
- Button padding: `px-8 py-4`
- Gaps: `gap-6`, `gap-8`, `gap-12`

## Implementation Notes

1. **Glass Morphism**: Always use `backdrop-blur-sm` or `backdrop-blur-md` with semi-transparent backgrounds
2. **Gold Accents**: Use yellow-500/600 for primary actions, yellow-300 for text
3. **Shadows**: Combine box-shadow with gold glow for premium feel
4. **Typography**: Use Cinzel for headings, Playfair Display for body text
5. **Animations**: Keep them subtle and purposeful
6. **Contrast**: Ensure text is readable on dark backgrounds with yellow accents
