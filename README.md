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
