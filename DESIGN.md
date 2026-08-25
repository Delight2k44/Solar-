---
version: alpha
name: Vortex Energy Design System
description: Engineering-first design system for a premium South African renewable energy and technology platform.
colors:
  background-primary: "#0E1311"
  background-secondary: "#141A17"
  background-surface: "#1A221E"
  background-surface-hover: "#222B26"
  background-light: "#F8F9F8"
  background-light-surface: "#FFFFFF"
  foreground-primary: "#FFFFFF"
  foreground-secondary: "#9EADA5"
  foreground-muted: "#6B7B73"
  foreground-dark: "#111815"
  foreground-dark-muted: "#526058"
  brand-green: "#1B4D3E"
  brand-green-bright: "#286D58"
  brand-green-subtle: "#122E25"
  accent-solar: "#D97706"
  accent-solar-muted: "#92400E"
  border-dark: "#24302A"
  border-dark-subtle: "#1B2420"
  border-light: "#E2E8E4"
  status-success: "#10B981"
  status-warning: "#F59E0B"
  status-info: "#3B82F6"
typography:
  sans:
    fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  mono:
    fontFamily: "'JetBrains Mono', 'SFMono-Regular', Consolas, Menlo, monospace"
rounded:
  base: "4px"
  sm: "2px"
  md: "6px"
  lg: "8px"
spacing:
  base: "16px"
---

## Overview

Vortex Energy Technologies is an engineering-driven renewable energy company operating in South Africa. The design language combines high-precision technical discipline with confident, restrained Scandinavian and German architectural minimalism.

## Visual Foundations

### 1. Palette Rules
- **Dominant Surfaces**: Deep charcoal-tinted greens and slate blacks (`#0E1311`, `#141A17`) paired with crisp white architectural backgrounds (`#FFFFFF`, `#F8F9F8`) for high-contrast legibility.
- **Accents**: Botanical dark energy green (`#1B4D3E`) as primary brand anchor; restrained warm solar amber (`#D97706`) strictly for telemetry metrics, key CTA badges, and real-time status indicators.
- **Prohibited**: Absolutely NO purple/blue neon gradients, NO glowing cyan borders, NO floating blobs, NO rainbow badges.

### 2. Typography & Hierarchy
- **Primary Typeface**: Plus Jakarta Sans / Inter for clear, editorial clarity.
- **Monospace Typeface**: JetBrains Mono for electrical specifications (kVA, kWp, kWh, MPPT, V, A, Hz, ZAR figures).
- **Hierarchy**:
  - `Display / Eyebrow`: Uppercase, tracking-wide (0.05em - 0.1em), font-semibold, 11px - 13px.
  - `H1`: 36px - 56px, bold, tight tracking (-0.02em), editorial and grounded.
  - `H2`: 28px - 36px, semibold.
  - `H3`: 20px - 24px, medium to semibold.
  - `Body`: 15px - 16px, line-height 1.6, balanced contrast.
  - `Data Labels`: 12px - 14px, uppercase or muted for rapid technical scanning.

### 3. Surface & Elevation
- Flat, clean structural planes separated by crisp 1px hairline borders (`#24302A` on dark, `#E2E8E4` on light).
- Restrained corner radius (4px - 6px max).
- Minimal shadows: only subtle `0 1px 3px rgba(0,0,0,0.1)` on interactive hover states. Zero heavy diffuse neon glows.
- Zero frosted glassmorphism or blur effects.

### 4. Verified Content & Transparency
- All unsupplied credentials, reviews, and partner logos must display clear, elegant CMS placeholder badges (`[Certification / Partner Placeholder]`, `[Customer review will appear here]`).
- Every calculation (Configurator, Payback Calculator, Sizing engine) carries a prominent engineering estimate disclaimer.
- Telemetry interfaces clearly display `Monitoring connection pending` or `Mock Telemetry Mode`.
