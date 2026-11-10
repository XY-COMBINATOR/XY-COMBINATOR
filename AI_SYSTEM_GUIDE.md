# AI SYSTEM & ARCHITECTURE GUIDE FOR XY COMBINATOR

## 1. Project Overview & Mission
XY Combinator is an award-grade design and engineering showcase site built with React 18, Vite, Three.js (React Three Fiber), GLSL custom fluid shaders, GSAP ScrollTrigger, and Lenis smooth scrolling. The project is engineered for maximum performance (60–120 fps across devices), zero security vulnerabilities, full responsive adaptation from mobile screens to ultra-wide displays, and clean, readable code with extensive developer comments.

---

## 2. Full Architecture & Directory Structure

```
XY COMBINATOR/
├── index.html                   # Production HTML entry with WCAG-compliant viewport & security policies
├── vercel.json                  # Production HTTP security headers (CSP, HSTS, X-Frame-Options, etc.)
├── package.json                 # Dependencies, build scripts, and engine specifications
├── vite.config.js               # Shader bundling plugin & module alias configuration
├── AI_SYSTEM_GUIDE.md           # Master AI and developer architecture guide (this file)
│
├── public/                      # Static assets served at root
│   ├── favicon.ico              # Multi-resolution favicon
│   ├── site.webmanifest         # PWA manifest with updated XY Combinator identity
│   ├── robots.txt               # Search crawler indexing directives
│   ├── sitemap.xml              # XML Sitemap mapping canonical URLs
│   ├── fonts/                   # High-performance WOFF2 fonts (Neue Haas Grotesk, Fraunces)
│   ├── gallery/                 # High-resolution concept mockup imagery (optimized WebP)
│   ├── projects/                # Visual concept renders and showcase media
│   └── other/                   # Ambient noise textures and HDR lighting maps
│
└── src/                         # Source code
    ├── main.jsx                 # Concurrent root initialization with target element verification
    ├── App.jsx                  # Main application orchestrator (WebGL + Lenis + Layout)
    ├── XyApp.jsx                # Standalone lightweight SPA alternative with Motion animations
    │
    ├── shims/                   # Universal compatibility shims
    │   ├── next-link.jsx        # Semantic anchor wrapper with clean prop passthrough
    │   ├── next-router.js       # Router stub with browser history synchronization
    │   ├── next-head.jsx        # Document head mutation manager
    │   ├── next-image.jsx       # Responsive image element wrapper
    │   ├── next-dynamic.jsx     # Lazy component loader with React Suspense fallback
    │   ├── next-seo.js          # Dynamic document title & description synchronization
    │   └── vercel-analytics.jsx # Named Vercel Analytics client stub
    │
    └── giats/                   # Core portfolio engine
        ├── store.js             # Global Zustand reactive state store
        ├── constants/           # Structured data for works, projects, and concepts
        ├── hooks/               # Custom hooks for scroll, viewport, and responsive lifecycle
        ├── components/          # Reusable UI, DOM, and WebGL components
        │   ├── canvas/          # Three.js 3D scenes, shaders, and fluid dynamics
        │   ├── dom/             # Navbar, footer, custom scrollbar, and intro loader
        │   └── animationComponents/ # Kinetic typography and title reveal primitives
        └── styles/              # SCSS styling engine with fluid responsive viewport formulas
```

---

## 3. Technology Stack & Key Libraries

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Runtime / Framework | React | 18.3.1 | Component lifecycle and virtual DOM tree |
| Build Tool | Vite | 8.3.0 | Ultra-fast HMR and tree-shaken production bundles |
| 3D Graphics | Three.js + R3F | 0.167.1 / 8.17.10 | 3D canvas rendering and custom GLSL background shaders |
| Physics & Dynamics | Custom GLSL Fluid | GLSL ES 3.0 | Real-time Navier-Stokes curl, advection, and pressure solvers |
| Animation Engine | GSAP + ScrollTrigger | 3.12.5 | Smooth scroll-synchronized timelines |
| Smooth Scrolling | Lenis | 1.1.18 | Hardware-accelerated inertial smooth scrolling |
| State Management | Zustand | 4.5.5 | Lightweight reactive store without extraneous re-renders |
| Styling Preprocessor | SCSS & CSS Modules | 1.69.4 | Scoped component styling with fluid mobile/desktop viewport math |

---

## 4. State Management (`src/giats/store.js`)

The Zustand store exposes the following reactive variables:
- `lenis`: The active Lenis instance for programmatic smooth scrolling, halting, and resuming.
- `isLoading`: Boolean controlling the intro loader overlay.
- `introOut`: Boolean indicating completion of the kinetic intro sequence.
- `isMenuOpen`: Fullscreen navigation drawer open/close state.
- `fluidColor`: Active hex/RGB color matrix for the WebGL fluid disturbance effect.
- `isAbout`: Dynamic route/section marker for theme color shifts.

---

## 5. Security Architecture (Enterprise Grade)

1. **Content Security Policy (CSP)**:
   - Configured in `vercel.json`.
   - Restricts script execution to self, trusted Google Fonts, and Vercel Analytics.
   - Forbids untrusted iframe embedding (`frame-ancestors 'none'`).
   - Disallows insecure plugin execution (`object-src 'none'`).

2. **HTTP Defensive Headers**:
   - `X-Frame-Options: DENY` (anti-clickjacking mitigation).
   - `X-Content-Type-Options: nosniff` (strict MIME sniffing mitigation).
   - `Referrer-Policy: strict-origin-when-cross-origin` (prevents path leakage on outbound navigation).
   - `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()` (disables unused hardware sensors).
   - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (enforces modern TLS).
   - `X-XSS-Protection: 1; mode=block` (legacy XSS defense).

3. **External Link Sanitization**:
   - Every external anchor tag enforces `rel="noopener noreferrer"` and `target="_blank"`.
   - Protects against window.opener reverse tabnabbing attacks.

4. **Input & DOM Sanitization**:
   - Zero unsanitized `dangerouslySetInnerHTML` injections.
   - JSON-LD structured data is statically generated without dynamic string evaluation.

---

## 6. Performance & Responsive Optimization Guidelines

- **Zero Forced Reflow**: Eliminated continuous `getBoundingClientRect()` calls inside `requestAnimationFrame` by replacing them with high-efficiency `IntersectionObserver` triggers and throttled scroll listeners.
- **Fluid Layout Formulas**: Layout dimensions leverage CSS variables (`--layout-columns-count`, `--layout-columns-gap`, `--layout-margin`) calculated via `mobile-vw` and `desktop-vw` Sass functions.
- **Accessible Viewport**: Enforces `viewport="width=device-width, initial-scale=1.0, maximum-scale=5.0"` allowing pinch-to-zoom for WCAG 2.1 compliance.
- **Hardware Acceleration**: Transform and opacity properties are isolated to composited layers with `will-change: transform, opacity`.
- **Keyboard Navigation**: Modal dialogs, drawer menus, and scrollbars support `Escape`, `ArrowUp/Down`, `PageUp/Down`, `Home`, `End`, and `Spacebar`.

---

## 7. UX, Typography & Motion Refinements

1. **Dash-Free Branding Constraint**:
   - Browser tab titles, OpenGraph titles, meta descriptions, and schema entries strictly omit hyphens or dashes (`-`).
   - The canonical title format is `XY Combinator Design & Engineering Studio`.
   - Dynamic title formatting strips all hyphens/en-dashes/em-dashes via regex `replace(/[-—–]/g, ' ')`.

2. **Universal Content Selectability & Visual Highlighting**:
   - Text everywhere in Hero (`.badge`, `.headline`, `.line`), Manifesto, Showcase, and Footer (`.email`, `.title`, `.middleContainer`, `.location`, `.availability`, `.rights`) is fully selectable and copyable (`user-select: text !important;`).
   - Active text selections glow in brand high-contrast neon green (`::selection { background-color: #98ff03; color: #050505; }`).
   - Background canvas layers and non-interactive watermarks are strictly protected (`pointer-events: none !important; user-select: none !important;`) so they never intercept cursor interactions.

3. **Interactive Marquee Hover & Touch Pause Control**:
   - Marquee carousels for Selected Projects and Visual Concepts automatically pause when hovered (`:hover`) or touched on mobile devices (`onTouchStart`).
   - Includes an explicit interactive pause/resume pill button (`❚❚ Paused` / `Hover to pause`) in each strip header, allowing visitors and prospective clients to examine project artwork at their own pace without cards moving away.

4. **Swiped Card Layer Section Transitions**:
   - Sections employ an elevated physical card-stacking hierarchy.
   - `#work` (Selected Creations) swipes up over `#studio` with rounded top corners (`border-top-left-radius: clamp(32px, 4vw, 60px)`) and a deep atmospheric shadow (`box-shadow: 0 -35px 90px rgba(0, 0, 0, 0.95)`).
   - `#expertise` (Our Expertise) similarly swipes up over `#work` with an overlapping negative margin (`margin-top: clamp(-56px, -6vw, -90px)`), creating an award-grade tactile card-swipe transition.

5. **Restored Fixed Top Navigation & Buttons**:
   - Restored original header behavior where the navigation bar and its buttons (`GET IN TOUCH` with magnetic cursor ball animation, and `MenuButton`) remain steadily accessible and are not hidden on scroll.

6. **Sequential Studio Manifesto Reveal**:
   - The "Hey, we're XY Combinator!" manifesto items in `Clients/Index.jsx` reveal sequentially as the user scrolls into view, listening to both Lenis scroll and native window scroll for maximum responsiveness.

7. **Footer Mailto & Kinetic Thread Wave**:
   - Clicking `contact@xycombinator.com` directly invokes native mail clients (`mailto:contact@xycombinator.com`).
   - Hovering the link triggers an elastic `@keyframes threadWave` oscillation that vibrates up and down like a plucked musical thread.

8. **Image Drag Prevention**:
   - All brand imagery and showcase artwork enforce `draggable={false}` / `-webkit-user-drag: none;`, preventing ghost dragging artifacts.

---

## 8. Instructions for Future AI Assistants
When extending or updating this repository:
1. Always preserve clean code architecture with comprehensive explanatory comments.
2. Ensure responsive breakpoints (`$mobile-breakpoint: 812px`) are respected across every new layout component.
3. Validate that any new outbound link includes `rel="noopener noreferrer"`.
4. Keep all asset references synchronized with modern WebP and WOFF2 formats.
5. Avoid hardcoding magic numbers; leverage design tokens in `variables.scss` and `colors.scss`.
6. Enforce zero dashes in document and brand titles.
