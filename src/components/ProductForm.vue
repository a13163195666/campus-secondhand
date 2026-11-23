<script setup>
import { reactive } from 'vue'
import { categories } from '../data/products'

const props = defineProps({
  product: { type: Object, default: null },
  error: { type: String, default: '' },
})
const emit = defineEmits(['save'])

// 编辑时复制字段：只有点“保存修改”才会动到 store 里的原商品。
const form = reactive({
  title: props.product?.title ?? '',
  price: String(props.product?.price ?? ''),
  category: props.product?.category ?? '',
  condition: props.product?.condition ?? '九成新',
  description: props.product?.description ?? '',
})
const errors = reactive({ title: '', price: '', category: '' })

function submit() {
  const title = form.title.trim()
  const rawPrice = form.price.trim()
  const price = Number(rawPrice)
  errors.title = title ? '' : '请输入商品名称'
  errors.category = categories.includes(form.category) ? '' : '请选择分类'
  errors.price =
    /^\d+(?:\.\d{1,2})?$/.test(rawPrice) && Number.isFinite(price) && price > 0
      ? ''
      : '请输入大于 0 的金额，最多保留两位小数'
  if (errors.title || errors.category || errors.price) return

  emit('save', {
    title,
    price,
    category: form.category,
    condition: form.condition,
    description: form.description.trim() || '卖家暂未填写描述',
  })
}
</script>

<template>
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

    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <button type="submit" class="btn">{{ product ? '保存修改' : '发布' }}</button>
  </form>
</template>

<style scoped>
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
