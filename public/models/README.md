# 3D Model Placeholder — Aaru & Partner

This folder is for optional custom GLB/GLTF characters.

The website **works perfectly without any models here** — it uses premium
procedural characters by default (no copyrighted assets).

## To use your own models

1. Add your models here:
   - `public/models/aaru.glb`  — for Aaru
   - `public/models/partner.glb` — for her partner

   Only use models you have the rights to (self-made, CC0, or purchased
   with a licence that allows web use).

2. Point to them in `src/data/characters.ts`:

   ```ts
   export const charactersConfig = {
     aaru: {
       name: 'Aarju',
       nickname: 'Aaru',
       glb: '/models/aaru.glb', // ← here
       scale: 1,
       rotationY: 0,
       // ... rest of appearance stays configurable
     },
     partner: {
       glb: '/models/partner.glb',
       // ...
     },
   }
   ```

3. Tune `scale` and `rotationY` so the model stands on the floor facing
   the camera. Lighting, shadows, camera choreography and mobile
   adaptations are handled automatically.

4. Run `npm run build` — the models are lazy-loaded and cached.

## Recommended model specs

- Format: GLB (binary glTF), ~2–5 MB each
- Up axis: Y, forward: -Z (three.js default)
- Height ~1.7 m at scale 1, centred at origin, feet at y=0
- No animations required — idle breathing / blink is procedural;
  if your GLB contains animations they will be ignored unless you
  extend `CharacterPair.tsx` to play them.

## Placeholder architecture

If no GLB is provided, `CharacterFigure.tsx` renders the premium
procedural figures:
- realistic human proportions
- soft skin shading (physical material)
- detailed hair per style (long-wavy, ponytail, short-modern, etc.)
- configurable skin tone, hair color, outfit, accessories
- idle life: breathing, sway, head micro-movement, blinking

See `src/data/characters.ts` for all configurable fields.
