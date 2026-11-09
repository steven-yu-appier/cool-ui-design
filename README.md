# Cool ui design

## Get started

Run with `pnpm dev`.

## Try the HTML-in-Canvas demo

Open `/demos/html-in-canvas` for the holographic control panel.
The layout targets a laptop browser.

1. Check for **NATIVE API ACTIVE** in the projection settings. Unsupported browsers show an interactive DOM preview instead.
2. Enter a station name, adjust signal power, and transmit a signal.
3. Turn off **Uplink** to disable transmission.
4. Switch between **DOM** and **Canvas**. The form values and transmission count stay intact.
5. Change the phosphor color, pause the orbit, or adjust the Y-axis rotation. Hover or focus inside the panel to steady it while interacting.
6. Expand **UNDER THE HOOD** to show the rendering code during a talk.

The demo draws a `drawable` DOM subtree into a native 2D canvas with `drawElementImage()`. The browser updates the image on `paint` events and synchronizes hit testing. CSS perspective supplies the 3D pose. No screenshot library or 3D dependency is required.

See the [official HTML-in-Canvas guide](https://developer.chrome.com/docs/web-platform/html-in-canvas/2d) for browser API details.

## Try the spatial HTML map

Open `/demos/holographic-map` on a laptop browser. The map uses MapLibre GL JS and OpenFreeMap vector tiles and requires an internet connection.

1. Select landmarks or click the map to open one card per location. Select an open projection to bring its card forward. Close individual cards with **×**.
2. Zoom the map. Cards keep their CSS pixel dimensions. Hover or focus a card to reveal its pin effect and tilt; overlapping cards have a staggered stack.
3. Enter a field note, or switch the card to **AREA SCANNER** to change its HTML chart and run a simulated scan. Each location retains its own state when changing renderer or focusing another card.
4. Lower **PROJECTION ALTITUDE** and toggle **Building occlusion** to compare shared depth testing with an always-visible projection.
5. Change **HOLOGRAM SHADER**, then switch to **DOM overlay** to compare native GPU textures with ordinary HTML.

In native mode, each card is a `drawable` child of the map's actual WebGL canvas. `texElementSubImage2D()` uploads the live HTML, a custom layer draws it with a holographic shader, and `updateElementGeometry()` synchronizes the input coordinates. Pin lines and animated rings use the same WebGL context. Unsupported browsers display a labeled DOM preview.

Building footprints and available heights come from open map data. Missing heights use an illustrative fallback. Landmark descriptions are curated, notes remain in the current page session, and scanner results are a visual interaction demo.

The pin interaction takes visual inspiration from [shadcn.io 3D Pin](https://www.shadcn.io/ui/pin-3d). It is implemented here in the native WebGL layer; the site’s component is not installed.

Depth occlusion currently affects the GPU image. HTML hit testing uses the projected card boundary and does not subtract pixels hidden by buildings. Turn off **Building occlusion** when demonstrating controls that a building obscures. This demo uses fixed-size screen-facing cards anchored to 3D coordinates; hover and stacking apply their own tilt.
