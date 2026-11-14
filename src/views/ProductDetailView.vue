<script setup>
import { useRoute } from 'vue-router'

// M3 负责：按 route.params.id 取商品、展示完整信息、处理无效 id、下单入口
const route = useRoute()
const productId = route.params.id
</script>

<template>
  <section>
    <h1>商品详情</h1>
    <p>当前商品 id：{{ productId }}</p>
  </section>
</template>
