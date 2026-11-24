import { ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'campus-secondhand:favorites'

function normalizeId(value) {
  const id = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    const unique = new Map()
    for (const entry of Array.isArray(saved) ? saved : []) {
      const userId = normalizeId(entry?.userId)
      const productId = normalizeId(entry?.productId)
      if (userId && productId) unique.set(`${userId}:${productId}`, { userId, productId })
    }
    return [...unique.values()]
  } catch {
    return []
  }
}

export const useFavoriteStore = defineStore('favorites', () => {
  const favorites = ref(loadFavorites())

  function getFavorites(userId) {
    return favorites.value.filter((entry) => entry.userId === normalizeId(userId))
  }

  function hasFavorite(userId, productId) {
    return getFavorites(userId).some((entry) => entry.productId === normalizeId(productId))
  }

  function setFavorite(user, product, selected) {
    const userId = normalizeId(user)
    const productId = normalizeId(product)
    if (!userId || !productId) return false
    if (hasFavorite(userId, productId) === selected) return true

    const next = selected
      ? [...favorites.value, { userId, productId }]
      : favorites.value.filter((entry) => entry.userId !== userId || entry.productId !== productId)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      favorites.value = next
      return true
    } catch {
      return false
    }
  }

  return { favorites, getFavorites, hasFavorite, setFavorite }
})
