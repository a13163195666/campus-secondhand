<script setup>
import FavoriteList from '../components/FavoriteList.vue'
import { useAccountStore } from '../stores/accountStore'

const store = useAccountStore()
</script>

<template>
  <FavoriteList :user-id="store.userId" />
</template>
