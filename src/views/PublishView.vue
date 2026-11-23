<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductForm from '../components/ProductForm.vue'
import { currentUserId } from '../data/products'
import { useProductStore } from '../stores/productStore'

const route = useRoute()
const router = useRouter()
const store = useProductStore()
const error = ref('')

// 复用已有 /publish 路由。带 edit 参数时，表单进入编辑模式。
const editing = computed(() => route.query.edit !== undefined)
const product = computed(() => store.getProductById(route.query.edit))
const canEdit = computed(
  () => product.value?.sellerId === currentUserId && product.value.status !== 'sold',
)
watch(
  () => route.query.edit,
  () => {
    error.value = ''
  },
)

function save(fields) {
  error.value = ''
  try {
    if (editing.value) {
      if (!canEdit.value || !store.updateProduct(product.value.id, fields)) {
        error.value = '该商品无法编辑。'
        return
      }
    } else {
      store.addProduct({ ...fields, image: '' })
    }
  } catch {
    error.value = '保存失败，请检查浏览器的本地存储后重试。你填写的内容已保留。'
    return
  }
  router.push(editing.value ? '/profile' : '/')
}
</script>

<template>
  <section class="wrap">
    <h1>{{ editing ? '编辑商品' : '发布商品' }}</h1>
    <ProductForm
      v-if="!editing || canEdit"
      :key="route.fullPath"
      :product="editing ? product : null"
      :error="error"
      @save="save"
    />
    <div v-else>
      <p>该商品不存在、已售出或属于其他卖家，无法编辑。</p>
      <RouterLink to="/profile">返回个人中心</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.wrap {
  max-width: 520px;
}
</style>
