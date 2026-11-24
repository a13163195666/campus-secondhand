<script setup>
// 发布页（M4 负责维护）：表单 + 校验 + 提交到共享 store
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/productStore'
import { useAccountStore } from '../stores/accountStore'
import { categories } from '../data/products'
import { acceptedImageTypes, isSupportedImage, readImage } from '../utils/localImage'

const router = useRouter()
const route = useRoute()
const store = useProductStore()
const account = useAccountStore()
const image = ref('')
const imageError = ref('')
const readingImage = ref(false)
let imageSelection = 0

async function selectImage(event) {
  const selection = ++imageSelection
  const file = event.target.files[0]
  image.value = ''
  imageError.value = ''
  readingImage.value = false
  if (!file) return
  if (!isSupportedImage(file)) {
    imageError.value = '请选择 JPG、PNG 或 WebP 图片。'
    return
  }
  readingImage.value = true
  try {
    const result = await readImage(file)
    if (selection === imageSelection) image.value = result
  } catch {
    if (selection === imageSelection) imageError.value = '读取图片失败，请重新选择。'
  } finally {
    if (selection === imageSelection) readingImage.value = false
  }
}

function clearImage(event) {
  event.currentTarget.form.elements.namedItem('product-image').value = ''
  imageSelection++
  image.value = ''
  imageError.value = ''
  readingImage.value = false
}

const defaults = {
  title: '',
  price: '',
  category: '',
  condition: '九成新',
  description: '',
  status: 'available',
}
const form = reactive({ ...defaults })
const editing = computed(() => route.name === 'product-edit')
const ownedProduct = computed(() => {
  if (!editing.value || !/^\d+$/.test(route.params.id)) return null
  const product = store.getProductById(route.params.id)
  return product?.sellerId === account.userId ? product : null
})

const errors = reactive({ title: '', price: '', category: '' })
const submitError = ref('')

watch(
  [() => route.fullPath, () => account.userId],
  () => {
    const product = ownedProduct.value
    Object.assign(form, defaults)
    if (product) {
      for (const field of Object.keys(defaults)) form[field] = product[field] ?? defaults[field]
    }
    imageSelection++
    image.value = product?.image ?? ''
    readingImage.value = false
    imageError.value = ''
    submitError.value = ''
    Object.assign(errors, { title: '', price: '', category: '' })
  },
  { immediate: true },
)

function validate() {
  errors.title = form.title.trim() ? '' : '请输入商品名称'
  errors.category = form.category ? '' : '请选择分类'

  const price = Number(form.price)
  if (form.price === '' || form.price === null) {
    errors.price = '请输入价格'
  } else if (!Number.isFinite(price) || price <= 0) {
    errors.price = '价格必须是大于 0 的数字'
  } else {
    errors.price = ''
  }

  return !errors.title && !errors.price && !errors.category
}

function submit() {
  submitError.value = ''
  if (!validate() || readingImage.value || imageError.value) return
  if (editing.value && !ownedProduct.value) return

  try {
    const changes = {
      title: form.title.trim(),
      price: Number(form.price),
      category: form.category,
      condition: form.condition,
      description: form.description.trim() || '卖家暂未填写描述',
      image: image.value,
    }
    if (editing.value) {
      const product = ownedProduct.value
      store.updateProduct(product.id, {
        ...changes,
        status: product.buyerId ? 'sold' : form.status,
      })
      router.push({ name: 'orders' })
      return
    }
    const created = store.addProduct({ ...changes, sellerId: account.userId })
    router.push({ name: 'product-detail', params: { id: created.id } })
  } catch {
    submitError.value = '保存失败，浏览器存储可能已满。你填写的信息已保留。'
  }
}
</script>

<template>
  <section class="wrap">
    <h1>{{ editing ? '编辑商品' : '发布商品' }}</h1>

    <p v-if="editing && !ownedProduct">
      商品不存在，或你没有权限编辑。<RouterLink to="/orders">返回订单</RouterLink>
    </p>
    <form v-else :key="route.fullPath" class="form sky-panel" @submit.prevent="submit">
      <label class="field">
        <span>商品名称 *</span>
        <input v-model="form.title" type="text" placeholder="如：二手高等数学教材" />
        <em v-if="errors.title" class="error">{{ errors.title }}</em>
      </label>

      <label class="field">
        <span>价格（元）*</span>
        <input v-model="form.price" type="text" inputmode="decimal" placeholder="如：25" />
        <em v-if="errors.price" class="error">{{ errors.price }}</em>
      </label>

      <label class="field">
        <span>分类 *</span>
        <select v-model="form.category">
          <option value="">请选择</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
        <em v-if="errors.category" class="error">{{ errors.category }}</em>
      </label>

      <label class="field">
        <span>成色</span>
        <select v-model="form.condition">
          <option>全新</option>
          <option>九五新</option>
          <option>九成新</option>
          <option>八成新</option>
          <option>七成新</option>
        </select>
      </label>

      <label class="field">
        <span>商品描述</span>
        <textarea v-model="form.description" rows="4" placeholder="简单描述商品情况"></textarea>
      </label>

      <label v-if="editing" class="field">
        <span>出售状态</span>
        <select v-model="form.status" :disabled="Boolean(ownedProduct?.buyerId)">
          <option value="available">在售</option>
          <option value="sold">已卖出</option>
          <option v-if="ownedProduct?.status === 'offline'" value="offline">已下架</option>
        </select>
        <small v-if="ownedProduct?.buyerId">已有购买记录，商品保持已卖出。</small>
      </label>

      <label class="field">
        <span>商品图片（选填，JPG、PNG 或 WebP）</span>
        <input
          name="product-image"
          type="file"
          :accept="acceptedImageTypes"
          @change="selectImage"
        />
      </label>
      <img v-if="image" :src="image" alt="商品图片预览" class="preview" />
      <p v-if="imageError" class="error" role="alert">{{ imageError }}</p>
      <button
        v-if="image || imageError || readingImage"
        type="button"
        class="btn"
        @click="clearImage"
      >
        移除图片
      </button>
      <p v-if="submitError" class="error" role="alert">{{ submitError }}</p>
      <button type="submit" class="btn" :disabled="readingImage">
        {{ editing ? '保存修改' : '发布' }}
      </button>
    </form>
  </section>
</template>

<style scoped>
.wrap {
  max-width: 520px;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 16px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
}
.field input,
.field select,
.field textarea {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}
.error {
  color: var(--color-error);
  font-size: 12px;
  font-style: normal;
}
.btn {
  padding: 10px;
  background: var(--color-brand);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
}
.btn:active {
  background: var(--color-brand-pressed);
}
.field input[type='file'] {
  min-width: 0;
}
.preview {
  align-self: start;
  max-width: 100%;
  max-height: 180px;
  object-fit: contain;
}
</style>
