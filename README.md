# New Collection — Shopify Button Handoff

## Animation video reference

https://github.com/user-attachments/assets/be96417c-83aa-45f6-ad8d-3954b703b7a2

[Try the interactive demo](https://keeepwatch.github.io/BB/)

A reusable button for a standard Shopify Liquid theme. No React, build step, or JavaScript libraries required.

## Files

- `index.html` — a single interactive button. To run locally, download and extract the repository, then open this file in a browser. Keep the `assets` folder beside it.
- `snippets/collection-button.liquid` — reusable Shopify snippet.
- `assets/collection-button.css` — appearance, states, and transitions.
- `assets/collection-button.js` — independent floating particles for each button instance.

## Shopify integration

1. Copy the snippet into your theme's `snippets/` directory and the CSS and JavaScript files into `assets/`.
2. Include the assets once inside `<head>` in `layout/theme.liquid`:

```liquid
{{ 'collection-button.css' | asset_url | stylesheet_tag }}
<script src="{{ 'collection-button.js' | asset_url }}" defer></script>
```

3. Load Geist Regular 400 using the project's existing font setup. The demo uses Google Fonts; the component stylesheet does not load external fonts.
4. Render the component where needed:

```liquid
{% render 'collection-button', label: 'New collection', href: routes.all_products_collection_url %}
```

This example links to the all-products collection. Pass the appropriate URL for a specific collection.

For an action button, connect the required action in your theme:

```liquid
{% render 'collection-button', label: 'New collection' %}
```

For a form submission, render inside the relevant `<form>`:

```liquid
{% render 'collection-button', label: 'New collection', type: 'submit' %}
```

For a disabled button:

```liquid
{% render 'collection-button', label: 'New collection', disabled: true %}
```

The component is a custom element. It initializes when inserted into the DOM, including when Shopify's theme editor reloads a section. Removing it stops the animation; reconnecting the same DOM element preserves its particles. CSS is scoped to the component.

State priority: Disabled → Pressed → Focused → Hover → Default. Keyboard focus uses `:focus-visible`; the browser's accessible focus outline is preserved. Touch interaction uses native press behavior without a custom persistent Hover toggle.

## Appearance and states

- Button: **146 × 40 px**, `border-box`, 1 px border, square corners. Dimensions were inferred from the original screenshot's proportions.
- Typography: **Geist Regular 400, 14 px / 16 px**, zero letter spacing, uppercase, centered.

| State | Background | Text | Border | Particles |
| --- | --- | --- | --- | --- |
| Default | Transparent | #121212 | #121212, 1 px | Hidden |
| Hover | #0B0B0B | #F1F1F1 | #121212, 1 px | Visible, floating |
| Pressed | Same as Hover | #F1F1F1 | #DDF964, 1 px | Same as Hover |
| Focused | #DDF964 | #121212 | #121212, 1 px | Hidden |
| Disabled | #D4D4D4 | #636363 | #D4D4D4, 1 px | Hidden |

## Hover animation

- **Default → Hover:** the background and particles fade in on the spot over **300 ms**, with `ease`. Text color also transitions over 300 ms. No slide-in motion on entry.
- **Hover → Default:** the background and particle layer slide **from right to left over 420 ms**, using `cubic-bezier(.22,.61,.36,1)`. The layer is hidden after the slide completes.
- Particles are circles, **5 px in diameter**, color **#C9CECA**, with `mix-blend-mode: difference`. The overlap color changes when particles cross the button text.
- Each instance has **4–8 particles**. The count and initial positions are chosen once when the button is created. Returning the cursor does not generate a new set.
- Each particle floats independently and changes direction randomly, without synchronized repeating paths. Motion stays inside the button.
- Reference motion parameters: **1.8–4 px/s**, with a smoothly changing random direction every **1.4–3.8 seconds**.
- Leaving the button pauses floating motion. Returning resumes from the saved positions.
- With `prefers-reduced-motion`, transitions and floating motion are disabled; all states remain available.
- Reloading the page creates a new particle set. Positions are not persisted across page loads.

Use the video as the reference for animation behavior and Figma for visual styling. The code demonstrates the parameters and logic and may be adapted to the current theme architecture.

## Manual verification

Open the interactive demo or local `index.html`. Hover for 5–10 seconds, press and hold the mouse button, release it, and move the cursor away. Hover again to confirm that particles retain their positions. Move the cursor away and press Tab to check keyboard focus. Use the disabled render example above to verify Disabled.

The video reference is embedded at the top of this README.

## Integration checks

This demo has not been integrated into the actual store theme. Before release, verify theme style compatibility, Geist loading, links and forms, text contrast during transitions, section reloads in the Shopify theme editor, and the target browsers.

## GitHub Pages

The published demo displays one interactive button:

https://keeepwatch.github.io/BB/

Publishing source: **Settings → Pages → Build and deployment → Deploy from a branch → main → / (root)**.
