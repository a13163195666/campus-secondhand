<script setup>
// 商品卡片组件（M3 负责维护，首页/个人中心复用）
defineProps({
  product: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <RouterLink :to="`/product/${product.id}`" class="card">
    <div class="thumb">{{ product.category }}</div>
    <div class="body">
      <h3 class="title">{{ product.title }}</h3>
      <p class="meta">{{ product.condition }} · {{ product.category }}</p>
      <p class="price">¥ {{ product.price }}</p>
    </div>
  </RouterLink>
</template>

<style scoped>
.card {
  display: block;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  background: #fff;
  transition: box-shadow 0.15s;
}
.card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}
.thumb {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef2ff;
  color: #6366f1;
  font-size: 14px;
}
.body {
  padding: 12px;
}
.title {
  margin: 0 0 6px;
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.meta {
  margin: 0 0 8px;
  font-size: 12px;
  color: #6b7280;
}
.price {
  margin: 0;
  color: #dc2626;
  font-weight: 600;
}
</style>
