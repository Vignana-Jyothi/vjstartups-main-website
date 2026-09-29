# VJ Startups v10 — experience-first homepage

This is a deeper art-direction pass built around one idea: **the life of an idea**.

The goal is not to accumulate interactions. Each major motion system has a narrative role:

- Timed intro: a quiet “system boot” before the experience begins.
- Fluid hero: the idea exists before it has a fixed shape.
- Cursor-following reveal: hidden copy is discovered through exploration.
- Fluid → crisp typography: uncertainty becomes definition.
- “Where are you now?”: a practical orientation layer, not a gimmick.
- Seven-stage pinned journey: scroll itself becomes the startup process.
- Three-lens spherical choreography: Problem / Build / Impact orbit around the user as one venture system; the SVG venture-loop rotates with the same scroll progress.
- Hub portal: browse the three entry points without a repeated card grid.
- Work field: process artifacts respond to depth/pointer movement.
- Venture selector: one changing story instead of a static collection of cards.
- Ecosystem network: people and resources are represented as a connected system.
- Community feed: momentum is shown as activity, not just statistics.
- Large editorial footer: the website closes as a final visual scene.

## Interaction stack

- Lenis for smooth, inertial scrolling.
- requestAnimationFrame-based pointer physics.
- CSS masks, organic border-radius morphing, SVG geometry, and transform-based spatial choreography.
- IntersectionObserver reveals.
- Reduced-motion fallback.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production note

Replace placeholder Unsplash photography with VJ Startups-owned founder photography, startup/product imagery, research material, logos, and real case-study content. The visual system is intentionally prepared for that material rather than relying on generic stock photography.


## v11 visual corrections

- Centered the Three Lenses spherical system mathematically, fixing the right-biased card placement.
- Added a layered centered orbital background, halo, secondary loops and particles.
- Added a subtle central VJ anchor so the three images orbit a meaningful point.
- Shifted the BUILD image cluster to the right so the D is visibly readable on desktop.
- Reworked the ecosystem into a richer planetary system with a breathing core, nested orbit rings, orbit markers, node motion and depth cues.


## v12 Hero correction

The hero was rebuilt around a strict visual hierarchy. The headline is now four spatially separated lines rather than one stacked block occupying the same z-space as the image. The organic image stage sits centrally behind the typography but no longer carries competing text. The cursor reveal is constrained to a small lens and only appears where the pointer is, while the orbital geometry remains background decoration. Mobile uses a separate composition and scaled typography.


## v13 targeted corrections from visual review

- Replaced the four-word 2×2 Fluid → Form wall with a single-word cinematic morph so only one concept reads clearly at a time.
- Kept the Three Lenses spiral system intact, but moved the title upward and strengthened the centered VJ / ONE VENTURE core so the center is the focal point.
- Shifted the BUILD image cluster farther right on desktop/tablet/mobile so the full BUILD word remains readable.
- Replaced the passive planetary network with continuously orbiting nodes and particles, layered ellipses, a breathing central core, moving orbital markers, and a subtle halo.
- Reworked the pink CTA into spaced foreground word pairs and four recognizable background words rather than one ambiguous overlapping string.
- Centered the oversized VJ STARTUPS footer identity and centered the supporting footer navigation.
- Improved the cursor reveal in the hero to use a compact, high-contrast lime lens so the hidden text is actually legible during exploration.


## v14 network redesign

Removed the planetary/hub visual entirely. The ecosystem is now expressed as a centered flowing network weave: several large organic curves, moving particles, labels that travel along the field, a soft radial light field, and a small ecosystem wordmark. There is no VJ/ONE VENTURE circle in the middle. The intent is to share the visual grammar of the strongest spiral section without turning the network into a generic solar-system graphic.


## v14 network correction

The previous planetary graphic was removed. The network now uses a centered flowing weave of large asymmetric curves, layered blurred strokes, gradient ribbon motion, dotted trajectories, moving connection points and restrained ecosystem labels. The visual has an empty center instead of a logo/planet so the section belongs to the same editorial motion language as the spiral experience.


## v16 visual pass

- Replaced the loading screen with a restrained interactive boot sequence: changing phase, live meter, orbiting geometry, active system states, ghost typography, signal bars and drifting particles.
- Reduced the hero cursor blob substantially so it reads as an accent rather than a focal object.
- Redesigned the hero hidden-copy lens so the revealed message has a clear editorial hierarchy instead of plain center text.
- Dropped the Three Lenses title/spiral system slightly to restore breathing room.
- Rebuilt the Network scene as a pinned flowing weave. As the user scrolls down, the upper and lower weave halves separate, the center opens, and a new momentum statement rises through the opening.
- Added node displacement, central opening cue, richer SVG ribbon choreography, and a deliberate transition panel.


## v18 rollback-and-refine pass

This version intentionally restores the visual composition from the earlier good baseline rather than stacking the disruptive v17 changes on top of it.

- Restored the previous Hero geometry, spacing, headline treatment, and restrained reveal behavior.
- Restored the previous Network weave geometry with the original clean flowing curves and split behavior. No extra v17 diagonal/ribbon clutter is retained.
- Kept the earlier Work image positioning where BUILD remains readable.
- Kept the earlier Three Lenses breathing position.
- Added only a navigation auto-hide/reveal behavior to prevent the fixed header from sitting awkwardly over immersive scenes.
- Added a subtle reduction in image aggression behind the hero type; no new hero layers or typography blocks.
