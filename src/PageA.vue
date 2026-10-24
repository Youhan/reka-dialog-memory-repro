<script setup>
import { onMounted, useTemplateRef } from 'vue'
const background = useTemplateRef('background')
onMounted(() => {
  // WeakRef lets the check observe collection without keeping this element alive.
  window.backgroundProbe = new WeakRef(background.value)
})
</script>

<template>
  <section ref="background" id="reka-retention-probe">
    <h2>Page A</h2>
    <ul><li v-for="n in 1000" :key="n">Background row {{ n }}</li></ul>
  </section>
</template>
