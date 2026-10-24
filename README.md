# Reka dialog cleanup retention reproduction

Vue 3.5.44, Vue Router 4.6.4, Reka UI 2.11.0. No Nuxt, analytics, external requests or deliberately retained DOM references. The diagnostic probe uses only WeakRef.

## Run

Use Node 22.12+ and pnpm 11.2.2. Corepack can select the packageManager version in package.json.

```sh
pnpm install
pnpm build
pnpm preview
```

Open the URL printed by Vite in a fresh Chrome tab. Use the production build above; development tools and HMR can retain extra objects. In StackBlitz, open the preview in its own window before profiling. Local Chrome is the verified environment; the StackBlitz-hosted preview has not been verified.

## Reproduce

1. On Page A, click **Open dialog**, then **Close dialog**.
2. Click **Page B**. Page A's section is now unmounted.
3. Open Chrome DevTools → Memory → **Collect garbage**. Click **Check after collecting garbage** in the page. The original build reports that Page A is still alive.
4. Take a heap snapshot and search for `reka-retention-probe`. Inspect the detached section and its retainers. Its 1,000 list items are also retained.

Avoid selecting Page A's elements in Elements or evaluating/logging DOM objects in the console before collection: DevTools can itself retain them. The check button returns a string, never a DOM object. The button does not trigger garbage collection; use DevTools first.

## Compare the proposed fix

In a second terminal:

```sh
pnpm build:patched
pnpm preview:patched
```

Open the second URL in a fresh tab and repeat the same steps. Page A is collected. The patched Vite build changes only the two completed-cleanup sites in Reka's installed `dist/shared/useHideOthers.js`:

```js
if (undo) {
  undo()
  undo = undefined
}
```

The original build uses Reka unchanged. The patched build applies a build-time transform, checks that both expected sites exist, and leaves node_modules unchanged. This is a diagnostic patch, not a complete proposal for every target-replacement or nested-modal lifecycle.

As another control, reload the original page and navigate directly from A to B without opening the dialog. Page A is collected.

## Why this layout matters

`ExampleDialog.vue` uses `DialogPortal to="#app"`, placing dialog content beside the routed page. `hideOthers` therefore captures Page A's section while the modal is open. The dialog root stays mounted outside RouterView when routes change. After close, the completed cleanup function still retains the background elements it hid.

The default portal-to-body case is not what this example tests. Do not omit the custom portal target when reproducing it.

## Verified result

Chromium 153.0.8010.12, production builds, fresh context for every case, two explicit collections after navigation:

| Case | Page A section after GC | Total DOM nodes |
| --- | --- | ---: |
| Original, dialog opened and closed | Retained, both runs | 2,097 |
| Patched, dialog opened and closed | Collected, both runs | 91 |
| Original, dialog never opened | Collected | 60 |

Heap snapshots show 1,000 detached `<li>` elements in the original and none in the patched case. Total DOM counts include the still-visible page and dialog-related nodes, not just detached nodes. No browser page errors occurred. This demonstrates retention of a previous page; it does not establish unbounded growth or that every dialog arrangement is affected.

## Links

- Repository: https://github.com/Youhan/reka-dialog-memory-repro
- Open in StackBlitz: https://stackblitz.com/github/Youhan/reka-dialog-memory-repro

The StackBlitz configuration starts the original production build. The hosted preview has not been verified; local Chrome is the tested way to inspect heap snapshots.
