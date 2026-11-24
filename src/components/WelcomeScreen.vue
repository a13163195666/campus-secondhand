<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const STORAGE_KEY = 'campus-secondhand:welcome-seen'
const dialog = ref(null)
const route = useRoute()

function open() {
  if (dialog.value && !dialog.value.open) dialog.value.showModal()
}

function showOnFirstHomeVisit() {
  if (route.name !== 'home') return
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return
  } catch {
    // The welcome screen remains usable if storage is unavailable.
  }
  open()
}

onMounted(showOnFirstHomeVisit)
watch(() => route.name, showOnFirstHomeVisit)
defineExpose({ open })

function rememberVisit() {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // Closing the dialog does not depend on storage.
  }
}
</script>

<template>
  <dialog ref="dialog" class="welcome" aria-labelledby="welcome-title" @close="rememberVisit">
    <div class="welcome-art" aria-hidden="true"></div>
    <div class="welcome-content">
      <h2 id="welcome-title">校园二手</h2>
      <p>让闲置好物在校园里继续流转</p>
      <form method="dialog">
        <button autofocus>进入商品首页 <span aria-hidden="true">→</span></button>
      </form>
    </div>
  </dialog>
</template>

<style scoped>
.welcome {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 24px;
  overflow: hidden;
  isolation: isolate;
  border: 0;
  background: linear-gradient(155deg, #203e73, #6794c0);
  color: white;
}
.welcome[open] {
  display: grid;
  place-items: center;
}
.welcome-art {
  position: absolute;
  inset: -3%;
  z-index: -1;
  background:
    linear-gradient(180deg, rgb(13 36 71 / 20%), rgb(13 36 71 / 28%)),
    url('/campus-welcome.webp') center / cover no-repeat;
  animation: sky-drift 18s ease-in-out infinite alternate;
}
.welcome-content {
  text-align: center;
  animation: welcome-in 720ms ease-out both;
}
h2 {
  font-family: 'Songti SC', SimSun, Georgia, serif;
  font-size: clamp(2.75rem, 9vw, 6rem);
  font-weight: 700;
  letter-spacing: 0.14em;
  text-indent: 0.14em;
  line-height: 1.2;
  text-shadow: 0 3px 24px #203b68;
}
p {
  margin-top: 14px;
  font-size: clamp(1rem, 2vw, 1.25rem);
  text-shadow: 0 2px 8px #152e58;
}
button {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  min-height: 48px;
  margin-top: 28px;
  padding: 10px 22px;
  border: 1px solid white;
  border-radius: 999px;
  background: #fafdff;
  color: #24439b;
  font: inherit;
  cursor: pointer;
}
button:active {
  background: #e2edff;
}
button:focus-visible {
  outline: 2px solid white;
  outline-offset: 5px;
}
@keyframes sky-drift {
  from {
    transform: translateX(-1%) scale(1);
  }
  to {
    transform: translateX(1%) scale(1.05);
  }
}
@keyframes welcome-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .welcome-art,
  .welcome-content {
    animation: none;
  }
}
</style>
