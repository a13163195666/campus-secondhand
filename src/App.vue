<script setup>
import { ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import NavBar from './components/NavBar.vue'
import WelcomeScreen from './components/WelcomeScreen.vue'

const router = useRouter()
const welcome = ref(null)

async function showWelcome() {
  await router.push({ name: 'home' })
  if (router.currentRoute.value.name === 'home') welcome.value?.open()
}
</script>

<template>
  <NavBar @show-welcome="showWelcome" />
  <WelcomeScreen ref="welcome" />
  <main class="page">
    <RouterView />
  </main>
</template>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}
</style>
