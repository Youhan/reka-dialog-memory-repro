<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import ExampleDialog from './ExampleDialog.vue'
const patched = __PATCHED__
const result = ref('Not checked')
function checkCollection() {
  result.value = window.backgroundProbe?.deref() ? 'Page A element is still alive' : 'Page A element was collected'
}
</script>

<template>
  <header>
    <h1>Completed dialog cleanup retains background elements</h1>
    <p>{{ patched ? 'Patched Reka' : 'Original Reka' }}</p>
    <nav><RouterLink to="/a" data-testid="page-a">Page A</RouterLink> · <RouterLink to="/b" data-testid="page-b">Page B</RouterLink></nav>
    <p>Open and close the dialog on Page A, then go to Page B and collect garbage in Chrome DevTools.</p>
    <button @click="checkCollection" data-testid="check-collection">Check after collecting garbage</button>
    <p aria-live="polite" data-testid="collection-result">{{ result }}</p>
  </header>
  <RouterView />
  <ExampleDialog />
</template>
