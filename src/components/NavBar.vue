<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="navbar">
    <div class="navbar-inner">
      <RouterLink to="/" class="brand">校园二手</RouterLink>
      <nav class="links">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/publish">发布</RouterLink>
        <RouterLink to="/orders">订单</RouterLink>
        <RouterLink to="/profile">个人中心</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  border-bottom: 1px solid var(--color-border);
  background: #fff;
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
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
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
  color: var(--color-text);
  font-size: 14px;
}

.links a.router-link-exact-active {
  background: #f2f2f2;
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
