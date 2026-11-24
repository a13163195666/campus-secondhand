<script setup>
import ProductImage from './ProductImage.vue'
import { productStatusLabels } from '../data/productStatus'
// 商品卡片组件（M3 负责维护，首页/个人中心复用）
defineProps({
  product: {
    type: Object,
    required: true,
  },
  showStatus: Boolean,
})
</script>

<template>
  <article class="card">
    <RouterLink :to="{ name: 'product-detail', params: { id: product.id } }" class="card-link">
      <div class="thumb">
        <ProductImage :src="product.image" :category="product.category" />
      </div>
      <div class="body">
        <h3 class="title">{{ product.title }}</h3>
        <p class="meta">{{ product.condition }} · {{ product.category }}</p>
        <p class="price">¥ {{ product.price }}</p>
        <p v-if="showStatus" class="meta">{{ productStatusLabels[product.status] }}</p>
      </div>
    </RouterLink>
    <footer v-if="$slots.actions" class="card-actions"><slot name="actions" /></footer>
  </article>
</template>

<style scoped>
.card {
  display: block;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  overflow: hidden;
  text-decoration: none;
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: var(--shadow-panel);
  transition:
    box-shadow 0.15s,
    border-color 0.15s;
}
.card:hover {
  border-color: #bc9558;
}
.card-link {
  display: block;
  color: inherit;
  text-decoration: none;
}
.card-actions {
  display: flex;
  justify-content: flex-end;
  padding: 0 12px 12px;
}
.thumb {
  height: 120px;
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
  color: var(--color-muted);
}
.price {
  margin: 0;
  color: var(--color-price);
  font-weight: 600;
}
</style>
