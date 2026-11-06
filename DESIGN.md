# Manifik website

English-language marketing portfolio for a branding studio. Source: Figma WVPnwk9WcQrKTAmWtbYAm9, desktop 2:9 and mobile 16:16. Preserve the approved visual direction. The work grid features Iz Korzinki alongside Crash, ChefGourmet and Lama packaging projects.

## Visual system

Runtime owner: `styles.css` :root. Ink #152C42, ice #E3F0F6, blue #2458E8, paper #F7F8F4, lime #D9FF70, muted #586E7D. Manrope for copy, Space Grotesk for the oversized wordmark, IBM Plex Mono for utility labels. Signature: large Manifik wordmark paired with a loose constellation of transparent outlined service chips.

Desktop: 1440 reference, 56px gutters, featured full-width Onda followed by two projects, three service columns. Mobile: 390 reference, 24px gutters, stacked projects and services, full-screen menu. Responsive breakpoint 700px; intermediate sizes interpolate. SVG source illustrations retained in root; website assets in assets/.

## Interaction and accessibility

Semantic anchor navigation, native dialog menu and brief with Escape/focus restoration, visible focus, reduced-motion support, global visible scrollbars. Brief is an editable local demonstration: no sending endpoint, no invented contacts, no localStorage, no false success state. Submit is disabled with an explicit reason. The Iz Korzinki card links to its case page; the remaining project cards are portfolio previews.

## Motion

Approved addition: short hero entrance, a one-time service-chip drop into a loose overlapping pile, one-time scroll reveals (700ms, 24px), and brief/menu entrance (280–400ms). Services use native disclosure panels and keep one panel open at a time. No scroll hijacking or layout changes. Content remains visible without JavaScript. Reduced motion disables CSS and entry animations; changing the preference cancels active animations.
