<script setup>
defineProps({
  selected: Boolean,
  icon: Boolean,
  productTitle: { type: String, required: true },
})
defineEmits(['toggle'])
</script>

<template>
  <button
    type="button"
    :aria-label="`收藏商品：${productTitle}`"
    :aria-pressed="selected"
    :class="{ icon }"
    @click="$emit('toggle')"
  >
    <span v-if="icon" class="star" aria-hidden="true" />
    <template v-else>{{ selected ? '取消收藏' : '收藏' }}</template>
  </button>
</template>

<style scoped>
button {
  min-height: 44px;
  padding: 8px 14px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: white;
  color: var(--color-brand);
  font: inherit;
  cursor: pointer;
}
.icon {
  display: grid;
  place-items: center;
  width: 44px;
  padding: 0;
  border-radius: 50%;
}
.star {
  position: relative;
  width: 22px;
  height: 22px;
  background: currentColor;
  clip-path: polygon(
    50% 4%,
    64% 34%,
    98% 38%,
    73% 61%,
    80% 95%,
    50% 78%,
    20% 95%,
    27% 61%,
    2% 38%,
    36% 34%
  );
}
.icon[aria-pressed='false'] .star::after {
  position: absolute;
  inset: 3px;
  background: white;
  clip-path: inherit;
  content: '';
}
.icon[aria-pressed='false']:active .star::after {
  background: var(--color-sky);
}
button:active {
  background: var(--color-sky);
}
</style>
