# Plan for the app

## Plans

1. Setup an app with shadcn ui (with tailwind)
    1. Folder structure 
        
        ```jsx
        - src
          - components
            - ui // from shadcn
            - blocks // for reusable, falling-blocks, selectable
            - demos // a registry for demo examples
            - docs // components for documenting, e.g. slide template, slide controls, component preview (with codeblock)
          - pages
            - home // the home page which shows the slides
        ```
    2. Tech stack
       1. Framework: Vite + React 19 + Typescript + Tanstack Router
       2. UI: shadcn ui + tailwind
       3. States: jotai
2. Build a slide template that has
    1. Component demo
    2. The code of the component 
    3. Page should be considered as a slide: Next/previous buttons that can jump to next/previous page
3. Build selectable: a drag to select component (See Drag to Select section below)
    1. Selectable: the wrapper, container, context provider (use jotai for atom states).
    3. Selectable.Overlay: the overlay box when user is dragging. Slottable
    4. Selectable.Item: the item that can be selected. Slottable. On right click to cancel selection 
    5. Selectable.Toolbar: A floating container that only shows when mouse up (drag stop). Slottable. User can get information on how many items (or exact item ids) that is selected and can render some tool buttons for batch update actions
    6. How to cancel all selection?
4. Build falling blocks 
5. Build example: selectable + dnd
    1. List reordering 
6. Build example: selectable + dnd + falling blocks (as drop zone)

## Component: Slide template

A slide template should consists of 

1. Component demo
2. The code snippet of the component. The code string will be a part of the component prop.
3. Should have control buttons next/previous, pointing to the ID of the slide. Beautiful animation when switching the slides

## Component: Drag to Select

There is already one version there:
[@notion-kit/selectable](https://github.com/steeeee0223/notion-kit/tree/main/packages/selectable) with its examples
[Examples](https://github.com/steeeee0223/notion-kit/tree/main/apps/storybook/src/stories/ui/selectable)

You could copy the version here and possibly update it.

## Component: Falling blocks

There is a version here.

```tsx
import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const FallingLogos = ({ logos }) => {
  const sceneRef = useRef(null);
  const engineRef = useRef(Matter.Engine.create());
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // 1. Intersection Observer to trigger animation
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasStarted(true);
      },
      { threshold: 0.5 } // Trigger when 50% visible
    );

    if (sceneRef.current) observer.observe(sceneRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter;
    const engine = engineRef.current;
    const container = sceneRef.current;
    const cw = container.clientWidth;
    const ch = container.clientHeight;

    // 2. Setup Renderer
    const render = Render.create({
      element: container,
      engine: engine,
      options: {
        width: cw,
        height: ch,
        wireframes: false, // Set to false to see colors/textures
        background: 'transparent',
      }
    });

    // 3. Create Boundaries (Floor and Walls)
    const floor = Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true });
    const leftWall = Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true });
    const rightWall = Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true });

    // 4. Create Logo Bodies
    const logoBodies = logos.map((logoUrl, i) => {
      return Bodies.rectangle(
        Math.random() * cw, // Random X start
        -100 - (i * 50),    // Staggered Y start (above the view)
        60, 60,             // Size of logo
        {
          restitution: 0.6, // Bounciness
          render: {
            sprite: { texture: logoUrl, xScale: 0.5, yScale: 0.5 }
          }
        }
      );
    });

    Composite.add(engine.world, [floor, leftWall, rightWall, ...logoBodies]);

    // 5. Run the engine
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, [hasStarted, logos]);

  return (
    <div 
      ref={sceneRef} 
      style={{ width: '100%', height: '400px', position: 'relative', overflow: 'hidden' }} 
    />
  );
};
```