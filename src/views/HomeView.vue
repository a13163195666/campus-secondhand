<script setup>
// 首页（M2 负责维护）：商品列表 + 关键词搜索 + 分类筛选 + 价格排序
import { computed, ref } from 'vue'
import { useProductStore } from '../stores/productStore'
import { categories } from '../data/products'
import ProductCard from '../components/ProductCard.vue'

const store = useProductStore()

const keyword = ref('')
const category = ref('')
const sortOrder = ref('')

const list = computed(() => {
  let result = store.getAvailableProducts()

  const kw = keyword.value.trim()
  if (kw) {
    result = result.filter((p) => p.title.includes(kw))
  }
  if (category.value) {
    result = result.filter((p) => p.category === category.value)
  }
  if (sortOrder.value === 'asc') {
    result = [...result].sort((a, b) => a.price - b.price)
  } else if (sortOrder.value === 'desc') {
    result = [...result].sort((a, b) => b.price - a.price)
  }
  return result
})
</script>

<template>
  <section>
    <h1>商品首页</h1>

    <div class="filters">
      <input
        v-model="keyword"
        type="text"
        placeholder="搜索商品名称，如：教材"
        class="input"
      />
      <select v-model="category" class="input">
        <option value="">全部分类</option>
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>
      <select v-model="sortOrder" class="input">
        <option value="">默认排序</option>
        <option value="asc">价格从低到高</option>
        <option value="desc">价格从高到低</option>
      </select>
    </div>

    <p v-if="list.length === 0" class="empty">没有找到匹配的商品，换个关键词试试。</p>

    <div v-else class="grid">
      <ProductCard v-for="p in list" :key="p.id" :product="p" />
    </div>
  </section>
</template>

<style scoped>
.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 16px 0 20px;
}
.input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}
input.input {
  flex: 1;
  min-width: 200px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.empty {
  padding: 40px 0;
  text-align: center;
  color: #6b7280;
}
</style>
