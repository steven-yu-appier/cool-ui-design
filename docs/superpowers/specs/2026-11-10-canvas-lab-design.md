# Phosphor FM: interactive HTML inside a 3D CRT

Approved direction: remove the paper experiment. Put the green CRT player from the image reference inside a Three.js monitor on a flat desk. Drag the background to orbit; interact with the screen without moving the camera. Update sharing 4 to this single demo.

## Scene and interaction

A rounded dark CRT enclosure, recessed luminous screen, pedestal, desk, directional shadows and green light spill. Restrict the orbit so the front screen remains visible. Provide front/reset views. Screen-origin pointer gestures do not reach OrbitControls. Use Base UI Autocomplete (with Field labeling), Button, Slider and Checkbox. Autocomplete owns filtering, arrow-key navigation, Enter selection and Escape dismissal; its list is rendered locally inside the drawable HTML subtree rather than a body portal. Keep the original playlist separate from search suggestions. Preserve existing labels without a new accessible-name pass. Verify Tab, Enter/Space, arrow keys and Home/End. Keep search, track selection, play/pause, previous/next, seeking and volume; retain generated Web Audio loops and React state.

## Rendering and geometry

The installed Three.js HTMLTexture implementation still uses an earlier browser API. Use the already verified native 2D drawElementImage route: a nested drawable source canvas renders the live HTML at 1280×1280; CanvasTexture uploads that result to the 3D screen. A shader adds scanlines, RGB fringes, a scan beam, transient glitch and glass edge/vignette. The HTML texture and glass use the same 64×64 convex mesh, bulging 0.42 world units at the center, with view-dependent glass reflection. A superellipse screen boundary and edge-weighted blur/chromatic dispersion approximate the reference. The rendered HTML follows the convex mesh. A flat DOM layout projection remains as the coordinate reference for native focus and Base UI measurements.

Every rendered camera update maps source CSS pixels through screen local coordinates, world, view, projection and viewport. Apply this DOMMatrix to the source canvas with updateElementGeometry as the DOM layout baseline. For pointer input, raycast the actual curved mesh, map the hit UV into that baseline projection, and forward the mapped pointer/click event to the corresponding DOM target. Focus inputs on pointer down and preserve native keyboard events. Mirror compatibility mousedown/up after mapped pointer events when not cancelled so Base UI input-press behavior works; avoid focusing tabIndex=-1 suggestion items. Keep the initial gesture target for dragging and fall back to the reference plane when dragging beyond the screen. Temporarily disable OrbitControls during screen-origin pointer/wheel gestures while preserving event propagation for Base UI React handlers. Fallback to an explicitly labeled DOM player if support, WebGL or native painting fails. Dispose geometry, materials, texture, renderer, controls, observers, listeners and audio context on unmount. Reduced motion disables timed shader effects.

## Sharing 4

Keep the simple HTML/CSS/Canvas introduction, replace the two-demo walkthrough with the CRT, explain the actual two-canvas texture pipeline and projected interaction geometry, and include matching snippets. Remove active paper references from slides, homepage and demo files.

## Verification

Desktop is the target; responsive adaptation is out of scope per user instruction.

TypeScript, scoped ESLint, production build. In a native supporting browser, verify orbit followed by actual screen-coordinate clicks, search, player controls, range drag without orbit, front/reset, effects and DOM preview/fallback. Confirm source text and displayed player remain synchronized. Verify visible curved controls with real pointer coordinates, including search input, playback, slider dragging without orbit and side-angle clicks.
