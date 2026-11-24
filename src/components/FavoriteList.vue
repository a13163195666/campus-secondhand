<script setup>
import { computed, ref, watch } from 'vue'
import EmptyState from './EmptyState.vue'
import FavoriteButton from './FavoriteButton.vue'
import ProductCard from './ProductCard.vue'
import { useFavoriteStore } from '../stores/favoriteStore'
import { useProductStore } from '../stores/productStore'

const props = defineProps({ userId: { type: Number, required: true } })
const favoriteStore = useFavoriteStore()
const productStore = useProductStore()
const failedId = ref(null)
watch(
  () => props.userId,
  () => {
    failedId.value = null
  },
)

const entries = computed(() =>
  favoriteStore.getFavorites(props.userId).map(({ productId }) => {
    const product = productStore.getProductById(productId)
    const visible = product && (product.status !== 'offline' || product.sellerId === props.userId)
    return {
      productId,
      product: visible ? product : null,
      unavailable: product ? '商品已下架' : '商品已删除',
    }
  }),
)

function removeFavorite(productId) {
  failedId.value = favoriteStore.setFavorite(props.userId, productId, false) ? null : productId
}
</script>

<template>
  <section class="favorites" aria-labelledby="favorites-heading">
    <h2 id="favorites-heading">我的收藏</h2>
    <EmptyState v-if="!entries.length" title="还没有收藏商品">
      <RouterLink :to="{ name: 'home' }">去逛逛</RouterLink>
    </EmptyState>
    <ul v-else class="favorites-grid">
      <li v-for="entry in entries" :key="entry.productId">
        <ProductCard v-if="entry.product" :product="entry.product" show-status />
        <p v-else>{{ entry.unavailable }}（编号 {{ entry.productId }}）</p>
        <FavoriteButton
          selected
          :product-title="entry.product?.title ?? `编号 ${entry.productId}`"
          @toggle="removeFavorite(entry.productId)"
        />
        <p v-if="failedId === entry.productId" role="alert">收藏更新失败，请重试。</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.favorites {
  margin-top: 24px;
}
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 230px), 1fr));
  gap: 16px;
  padding: 0;
  margin-top: 12px;
  list-style: none;
}
li {
  display: grid;
  align-content: start;
  gap: 8px;
  min-width: 0;
}
</style>
