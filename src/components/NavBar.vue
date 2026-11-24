<script setup>
import { RouterLink } from 'vue-router'

defineEmits(['show-welcome'])
</script>

<template>
  <header class="navbar">
    <div class="navbar-inner">
      <button type="button" class="brand" @click="$emit('show-welcome')">校园二手</button>
      <nav class="links">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/orders">订单</RouterLink>
        <RouterLink to="/favorites">收藏</RouterLink>
        <RouterLink to="/profile">个人中心</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.navbar-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand {
  padding: 3px;
  border: 0;
  background: transparent;
  font: inherit;
  font-weight: 700;
  color: var(--color-brand);
  cursor: pointer;
}

.links {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.links a {
  padding: 6px 12px;
  border-radius: 6px;
  text-decoration: none;
  color: var(--color-brand);
  font-size: 14px;
}

.links a.router-link-exact-active {
  background: var(--color-sky);
  box-shadow: inset 0 -2px #bb8b42;
  font-weight: 600;
}

@media (max-width: 480px) {
  .navbar-inner {
    height: auto;
    flex-direction: column;
    align-items: flex-start;
    padding: 12px 16px;
  }
}
</style>
