<script setup>
import { computed, ref } from 'vue'
import { useAccountStore } from '../stores/accountStore'

const props = defineProps({ productId: { type: Number, required: true } })
const account = useAccountStore()
const key = 'campus-secondhand:comments'

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(key))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

const comments = ref(load())
const visible = computed(() =>
  comments.value.filter((entry) => entry.productId === props.productId),
)
const draft = ref('')
const error = ref('')

function submit() {
  const text = draft.value.trim()
  if (!text || text.length > 500) {
    error.value = '请输入 1–500 个字的评论。'
    return
  }
  const next = [
    { productId: props.productId, author: account.current?.nickname ?? '访客', text },
    ...load(),
  ]
  try {
    localStorage.setItem(key, JSON.stringify(next))
  } catch {
    error.value = '评论保存失败，请重试。'
    return
  }
  comments.value = next
  draft.value = ''
  error.value = ''
}
</script>

<template>
  <aside class="comments sky-panel" aria-labelledby="comments-heading">
    <h2 id="comments-heading">商品评论</h2>
    <form @submit.prevent="submit">
      <label for="comment">写评论</label>
      <textarea id="comment" v-model="draft" maxlength="500" rows="3" required />
      <button type="submit">发表评论</button>
      <p v-if="error" role="alert">{{ error }}</p>
    </form>
    <p v-if="!visible.length">暂无评论。</p>
    <ul v-else aria-live="polite">
      <li v-for="(entry, index) in visible" :key="index">
        <strong>{{ entry.author }}</strong>
        <p>{{ entry.text }}</p>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.comments {
  align-self: start;
  overflow-wrap: anywhere;
}
h2 {
  font-size: 1.15rem;
}
form {
  display: grid;
  gap: 8px;
  margin: 12px 0;
}
textarea {
  width: 100%;
  font: inherit;
}
button {
  justify-self: start;
  padding: 8px 12px;
  border: 1px solid var(--color-brand);
  border-radius: 6px;
  background: white;
  color: var(--color-brand);
  font: inherit;
  cursor: pointer;
}
button:active {
  background: var(--color-sky);
}
ul {
  padding: 0;
  list-style: none;
}
li {
  padding: 8px 0;
  border-top: 1px solid var(--color-border);
}
li p {
  white-space: pre-wrap;
}
</style>
