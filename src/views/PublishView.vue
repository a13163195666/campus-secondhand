<script setup>
// 发布页（M4 负责维护）：表单 + 校验 + 提交到共享 store
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../stores/productStore'
import { categories } from '../data/products'

const router = useRouter()
const store = useProductStore()

const form = reactive({
  title: '',
  price: '',
  category: '',
  condition: '九成新',
  description: '',
})

const errors = reactive({ title: '', price: '', category: '' })
const submitError = ref('')

function validate() {
  errors.title = form.title.trim() ? '' : '请输入商品名称'
  errors.category = form.category ? '' : '请选择分类'

  const price = Number(form.price)
  if (form.price === '' || form.price === null) {
    errors.price = '请输入价格'
  } else if (Number.isNaN(price) || price <= 0) {
    errors.price = '价格必须是大于 0 的数字'
  } else {
    errors.price = ''
  }

  return !errors.title && !errors.price && !errors.category
}

function submit() {
  submitError.value = ''
  if (!validate()) return

  try {
    const created = store.addProduct({
      title: form.title.trim(),
      price: Number(form.price),
      category: form.category,
      condition: form.condition,
      description: form.description.trim() || '卖家暂未填写描述',
      image: '',
      sellerId: 101,
    })
    router.push(`/product/${created.id}`)
  } catch {
    submitError.value = '发布失败，请重试。你填写的内容已保留。'
  }
}
</script>

<template>
  <section class="wrap">
    <h1>发布商品</h1>

    <form class="form" @submit.prevent="submit">
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

      <p v-if="submitError" class="error">{{ submitError }}</p>
      <button type="submit" class="btn">发布</button>
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
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}
.error {
  color: #dc2626;
  font-size: 12px;
  font-style: normal;
}
.btn {
  padding: 10px;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
}
.btn:hover {
  background: #4338ca;
}
</style>
