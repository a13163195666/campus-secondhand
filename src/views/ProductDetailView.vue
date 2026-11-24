<script setup>
// 详情页（M3 负责维护）：按路由 id 取商品，无效 id 给出提示
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import EmptyState from '../components/EmptyState.vue'
import FavoriteButton from '../components/FavoriteButton.vue'
import ProductImage from '../components/ProductImage.vue'
import { productStatusLabels } from '../data/productStatus'
import { useFavoriteStore } from '../stores/favoriteStore'
import { useAccountStore } from '../stores/accountStore'
import ProductComments from '../components/ProductComments.vue'
import { useProductStore } from '../stores/productStore'

const route = useRoute()
const store = useProductStore()

const favoriteStore = useFavoriteStore()
const account = useAccountStore()
const sellerNickname = computed(() => {
  const id = product.value?.sellerId
  return account.getNickname(id) ?? { 101: '校园小卖家', 102: '二手好物' }[id] ?? '校园卖家'
})
const saveFailed = ref(false)
const purchaseFeedback = ref('')
const product = computed(() => {
  const id = route.params.id
  return typeof id === 'string' && /^\d+$/.test(id) ? store.getProductById(id) : undefined
})
const hidden = computed(
  () => product.value?.status === 'offline' && product.value.sellerId !== account.userId,
)
const selected = computed(() => favoriteStore.hasFavorite(account.userId, product.value?.id))
watch(
  () => route.params.id,
  () => {
    saveFailed.value = false
    purchaseFeedback.value = ''
  },
)

function toggleFavorite() {
  if (!product.value || hidden.value || (!selected.value && product.value.status !== 'available'))
    return
  saveFailed.value = !favoriteStore.setFavorite(account.userId, product.value.id, !selected.value)
}

function buyProduct() {
  try {
    purchaseFeedback.value = store.buyProduct(product.value.id, account.userId)
      ? '购买成功，可在订单的「我买到的」查看。'
      : '该商品当前无法购买。'
  } catch {
    purchaseFeedback.value = '购买记录保存失败，请重试。'
  }
}
</script>

<template>
  <section>
    <RouterLink to="/" class="back">← 返回首页</RouterLink>

    <EmptyState
      v-if="!product || hidden"
      :title="hidden ? '商品已下架' : '商品不存在'"
      :message="hidden ? '这件商品目前无法查看。' : '该商品可能已被删除，或链接有误。'"
    />

    <div v-else class="detail">
      <div class="thumb">
        <ProductImage
          :key="product.id"
          :src="product.image"
          :category="product.category"
          :alt="product.title"
          natural-ratio
        />
      </div>
      <div class="info sky-panel">
        <h1>{{ product.title }}</h1>
        <p class="price">¥ {{ product.price }}</p>
        <p class="meta">
          <span class="tag">{{ product.category }}</span>
          <span class="tag">{{ product.condition }}</span>
          <span class="tag">{{ productStatusLabels[product.status] || product.status }}</span>
        </p>
        <div v-if="selected || product.status === 'available'" class="actions">
          <FavoriteButton
            :selected="selected"
            :product-title="product.title"
            @toggle="toggleFavorite"
          />
          <p v-if="saveFailed" role="alert">收藏更新失败，请重试。</p>
          <button
            v-if="product.status === 'available' && product.sellerId !== account.userId"
            class="buy"
            type="button"
            @click="buyProduct"
          >
            模拟购买
          </button>
        </div>
        <p v-if="purchaseFeedback" role="status">{{ purchaseFeedback }}</p>
        <h2>商品描述</h2>
        <p>{{ product.description }}</p>
        <h2>卖家信息</h2>
        <p>卖家昵称：{{ sellerNickname }}</p>
        <p class="time">发布时间：{{ product.createdAt }}</p>
      </div>
      <ProductComments :key="product.id" :product-id="product.id" />
    </div>
  </section>
</template>

<style scoped>
.back {
  display: inline-block;
  margin-bottom: 16px;
  color: var(--color-brand);
  text-decoration: none;
}
.detail {
  display: grid;
  grid-template-columns: minmax(0, 240px) minmax(0, 1fr) minmax(0, 300px);
  gap: 24px;
}
.thumb {
  align-self: start;
  overflow: hidden;
  border-radius: 10px;
}
.price {
  color: var(--color-price);
  font-size: 24px;
  font-weight: 700;
}
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tag {
  padding: 2px 10px;
  background: var(--color-sky);
  border-radius: 4px;
  font-size: 12px;
  color: var(--color-brand);
}
.time {
  color: var(--color-muted);
  font-size: 12px;
}
.info {
  overflow-wrap: anywhere;
}
.info h2 {
  margin-top: 16px;
  font-size: 1.1rem;
}
.actions {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.buy {
  min-height: 44px;
  padding: 8px 14px;
  border: 0;
  border-radius: 6px;
  background: var(--color-brand);
  color: white;
  font: inherit;
  cursor: pointer;
}
.buy:active {
  background: var(--color-brand-pressed);
}
@media (max-width: 800px) {
  .detail {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
