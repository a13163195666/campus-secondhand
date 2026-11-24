<script setup>
defineProps({
  title: { type: String, required: true },
  message: { type: String, default: '' },
})
</script>

<template>
  <div class="empty-state">
    <p>
      <strong>{{ title }}</strong>
    </p>
    <p v-if="message">{{ message }}</p>
    <slot />
  </div>
</template>

<style scoped>
.empty-state {
  padding: 32px 12px;
  text-align: center;
}
</style>
