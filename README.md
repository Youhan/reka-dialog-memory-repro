# Reka dialog memory reproduction

Reka 2.11.0 · Vue 3.5.44 · Vue Router 4.6.4

## Run

Requires Node 22.12+ and pnpm 11.2.2.

```sh
pnpm install
pnpm build
pnpm preview
```

## Reproduce

Open the printed URL in a fresh Chrome tab:

1. On **Page A**, open and close the dialog.
2. Navigate to **Page B**. Leave its dialog button alone.
3. In DevTools → Memory, click **Collect garbage**.
4. Click **Check after collecting garbage** on the page.

Original: **Page A element is still alive**.

Avoid inspecting or logging Page A's DOM elements beforehand; DevTools can retain them. For heap inspection, search for `reka-retention-probe` in a snapshot.

## Compare the fix

In another terminal:

```sh
pnpm build:patched
pnpm preview:patched
```

Repeat in a fresh tab. Patched: **Page A element was collected**.

The patch clears `undo` after calling it in `useHideOthers`. The example keeps the dialog root mounted outside `RouterView` and uses `DialogPortal to="#app"`. No third-party scripts are needed.
