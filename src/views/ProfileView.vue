<script setup>
import { computed, ref } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { currentUserId } from '../data/products'
import { useProductStore } from '../stores/productStore'

const store = useProductStore()
const mine = computed(() => store.getProductsBySeller(currentUserId))
const message = ref('')
const labels = { available: '在售', offline: '已下架', sold: '已售出' }

function toggleStatus(product) {
  const status = product.status === 'available' ? 'offline' : 'available'
  try {
    store.updateProduct(product.id, { status })
    message.value = '《' + product.title + '》' + (status === 'offline' ? '已下架。' : '已上架。')
  } catch {
    message.value = '状态保存失败，请重试。'
  }
}

function remove(product) {
  if (!window.confirm('确定删除《' + product.title + '》吗？')) return
  try {
    store.removeProduct(product.id)
    message.value = '已删除《' + product.title + '》。'
  } catch {
    message.value = '删除失败，请重试。'
  }
}
</script>

<template>
  <section>
    <h1>个人中心</h1>
    <h2>我的发布（{{ mine.length }}）</h2>
    <p role="status">{{ message }}</p>
    <p v-if="!mine.length">你还没有发布商品。<RouterLink to="/publish">去发布</RouterLink></p>
    <ul v-else class="products">
      <li v-for="product in mine" :key="product.id">
        <ProductCard :product="product" />
        <div class="actions">
          <span>{{ labels[product.status] }}</span>
          <template v-if="product.status !== 'sold'">
            <RouterLink :to="{ path: '/publish', query: { edit: product.id } }">编辑</RouterLink>
            <button type="button" @click="toggleStatus(product)">
              {{ product.status === 'available' ? '下架' : '重新上架' }}
            </button>
          </template>
          <button type="button" @click="remove(product)">删除</button>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.products {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
  gap: 16px;
  list-style: none;
  padding: 0;
}
.products li {
  min-width: 0;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-top: 8px;
}
.actions button {
  cursor: pointer;
}
</style>
