<script setup>
import { computed, ref } from 'vue'
import EmptyState from '../components/EmptyState.vue'
import ProductCard from '../components/ProductCard.vue'
import { useAccountStore } from '../stores/accountStore'
import { useProductStore } from '../stores/productStore'

const account = useAccountStore()
const products = useProductStore()
const showingUploads = ref(true)
const entries = computed(() =>
  showingUploads.value
    ? products.getProductsBySeller(account.userId)
    : products.getProductsByBuyer(account.userId),
)
</script>

<template>
  <section>
    <div class="heading">
      <h1>我的订单</h1>
      <div class="filters" role="group" aria-label="订单分类">
        <button type="button" :aria-pressed="showingUploads" @click="showingUploads = true">
          我上传的
        </button>
        <button type="button" :aria-pressed="!showingUploads" @click="showingUploads = false">
          我买到的
        </button>
      </div>
    </div>
    <EmptyState
      v-if="!entries.length"
      :title="showingUploads ? '还没有发布商品' : '暂无购买记录'"
    />
    <div v-else class="grid">
      <ProductCard v-for="product in entries" :key="product.id" :product="product" show-status>
        <template v-if="showingUploads" #actions>
          <RouterLink class="edit-link" :to="{ name: 'product-edit', params: { id: product.id } }"
            >编辑商品</RouterLink
          >
        </template>
      </ProductCard>
    </div>
  </section>
</template>

<style scoped>
.heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
.filters {
  display: flex;
  gap: 4px;
}
.filters button {
  padding: 6px 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-brand);
  background: var(--color-surface);
  font: inherit;
  cursor: pointer;
}
.filters button[aria-pressed='true'] {
  background: var(--color-sky);
  box-shadow: inset 0 -2px #bb8b42;
  font-weight: 700;
}
.edit-link {
  padding: 4px 9px;
  border-radius: 6px;
  background: var(--color-sky);
  text-decoration: none;
  font-size: 13px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr));
  gap: 16px;
}
</style>
