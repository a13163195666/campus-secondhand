<script setup>
// 首页（M2 负责维护）：商品列表 + 关键词搜索 + 分类筛选 + 价格排序
import { computed, ref } from 'vue'
import { useProductStore } from '../stores/productStore'
import { categories } from '../data/products'
import ProductCard from '../components/ProductCard.vue'
import FavoriteButton from '../components/FavoriteButton.vue'
import { useAccountStore } from '../stores/accountStore'
import { useFavoriteStore } from '../stores/favoriteStore'

const store = useProductStore()
const account = useAccountStore()
const favorites = useFavoriteStore()
const favoriteError = ref('')

function toggleFavorite(productId) {
  const selected = favorites.hasFavorite(account.userId, productId)
  favoriteError.value = favorites.setFavorite(account.userId, productId, !selected)
    ? ''
    : '收藏更新失败，请重试。'
}

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
    result.sort((a, b) => a.price - b.price)
  } else if (sortOrder.value === 'desc') {
    result.sort((a, b) => b.price - a.price)
  }
  return result
})
</script>

<template>
  <section>
    <div class="home-heading">
      <h1>商品首页</h1>
      <RouterLink to="/publish" class="publish-link" aria-label="发布商品" title="发布商品" />
    </div>

    <div class="filters">
      <input
        v-model="keyword"
        type="text"
        aria-label="搜索商品名称"
        placeholder="搜索商品名称，如：教材"
        class="input"
      />
      <select v-model="category" class="input" aria-label="商品分类">
        <option value="">全部分类</option>
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>
      <select v-model="sortOrder" class="input" aria-label="价格排序">
        <option value="">默认排序</option>
        <option value="asc">价格从低到高</option>
        <option value="desc">价格从高到低</option>
      </select>
    </div>

    <p v-if="favoriteError" role="alert">{{ favoriteError }}</p>
    <p v-if="list.length === 0" class="empty">没有找到匹配的商品，换个关键词试试。</p>

    <div v-else class="grid">
      <div v-for="p in list" :key="p.id" class="product">
        <ProductCard :product="p" />
        <FavoriteButton
          class="card-favorite"
          icon
          :product-title="p.title"
          :selected="favorites.hasFavorite(account.userId, p.id)"
          @toggle="toggleFavorite(p.id)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: clamp(120px, 18vw, 210px);
  padding: clamp(16px, 4vw, 42px);
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background:
    linear-gradient(90deg, rgb(21 46 88 / 86%), rgb(21 46 88 / 20%)),
    #315689 url('/campus-welcome.webp') center 70% / cover;
  box-shadow: var(--shadow-panel);
  color: white;
}
.publish-link {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  position: relative;
  background: var(--color-background);
  color: var(--color-brand-pressed);
  flex-shrink: 0;
  text-decoration: none;
}
.publish-link:active {
  background: var(--color-sky);
}
.publish-link::before,
.publish-link::after {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 16px;
  height: 2px;
  border-radius: 2px;
  background: currentColor;
  content: '';
}
.publish-link::after {
  transform: rotate(90deg);
}
.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 16px 0 20px;
}
.input {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
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
.product {
  position: relative;
  min-width: 0;
}
.card-favorite {
  position: absolute;
  top: 8px;
  right: 8px;
}
.empty {
  padding: 40px 0;
  text-align: center;
  color: var(--color-muted);
}
</style>
