<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  src: { type: String, default: '' },
  category: { type: String, default: '' },
  alt: { type: String, default: '' },
  naturalRatio: Boolean,
})

const failed = ref(false)
watch(
  () => props.src,
  () => {
    failed.value = false
  },
)
</script>

<template>
  <div class="product-image" :class="{ 'natural-ratio': naturalRatio }">
    <img v-if="src && !failed" :src="src" :alt="alt" @error="failed = true" />
    <span v-else aria-hidden="true">{{ category }}</span>
  </div>
</template>

<style scoped>
.product-image {
  display: grid;
  place-items: center;
  height: 100%;
  overflow: hidden;
  background: var(--color-sky);
  color: var(--color-brand);
}
.product-image:has(> span) {
  background: #f6ebce;
}
img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.natural-ratio,
.natural-ratio img {
  height: auto;
}
.natural-ratio span {
  display: grid;
  place-items: center;
  min-height: 220px;
}
</style>
