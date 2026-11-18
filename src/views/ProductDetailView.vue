<script setup>
// 详情页（M3 负责维护）：按路由 id 取商品，无效 id 给出提示
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '../stores/productStore'

const route = useRoute()
const store = useProductStore()

const product = computed(() => store.getProductById(route.params.id))

const statusText = {
  available: '在售',
  offline: '已下架',
  sold: '已售出',
}
</script>

<template>
  <section>
    <RouterLink to="/" class="back">← 返回首页</RouterLink>

    <div v-if="!product" class="empty">
      <h1>商品不存在</h1>
      <p>该商品可能已被删除，或链接有误。</p>
      <RouterLink to="/">回到首页看看其他商品</RouterLink>
    </div>

    <div v-else class="detail">
      <div class="thumb">{{ product.category }}</div>
      <div class="info">
        <h1>{{ product.title }}</h1>
        <p class="price">¥ {{ product.price }}</p>
        <p class="meta">
          <span class="tag">{{ product.category }}</span>
          <span class="tag">{{ product.condition }}</span>
          <span class="tag">{{ statusText[product.status] || product.status }}</span>
        </p>
        <h3>商品描述</h3>
        <p>{{ product.description }}</p>
        <h3>卖家信息</h3>
        <p>卖家编号：{{ product.sellerId }}（模拟用户）</p>
        <p class="time">发布时间：{{ product.createdAt }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.back {
  display: inline-block;
  margin-bottom: 16px;
  color: #4f46e5;
  text-decoration: none;
}
.detail {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
}
.thumb {
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef2ff;
  color: #6366f1;
  border-radius: 10px;
}
.price {
  color: #dc2626;
  font-size: 24px;
  font-weight: 700;
}
.meta {
  display: flex;
  gap: 8px;
}
.tag {
  padding: 2px 10px;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 12px;
  color: #374151;
}
.time {
  color: #9ca3af;
  font-size: 12px;
}
.empty {
  text-align: center;
  padding: 60px 0;
}
@media (max-width: 640px) {
  .detail {
    grid-template-columns: 1fr;
  }
}
</style>
