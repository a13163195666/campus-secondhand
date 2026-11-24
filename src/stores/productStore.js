import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { initialProducts } from '../data/products'

const STORAGE_KEY = 'campus-secondhand:products'

// 读取本地缓存；缓存损坏或格式不对时回退到初始数据
function loadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [...initialProducts]
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return [...initialProducts]
    return parsed
  } catch {
    return [...initialProducts]
  }
}

export const useProductStore = defineStore('product', () => {
  const products = ref(loadProducts())

  // 任何改动自动写回本地，刷新后仍在
  watch(
    products,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch (error) {
        console.warn('[productStore] 保存到本地失败', error)
      }
    },
    { deep: true },
  )

  function getProducts() {
    return products.value
  }

  function getAvailableProducts() {
    return products.value.filter((p) => p.status === 'available')
  }

  function getProductById(id) {
    return products.value.find((p) => p.id === Number(id))
  }

  function getProductsBySeller(sellerId) {
    return products.value.filter((p) => p.sellerId === Number(sellerId))
  }

  function getProductsByBuyer(buyerId) {
    return products.value.filter((product) => product.buyerId === buyerId)
  }

  function addProduct(product) {
    const maxId = products.value.reduce((max, p) => Math.max(max, p.id), 0)
    const newProduct = {
      id: maxId + 1,
      status: 'available',
      createdAt: new Date().toISOString(),
      ...product,
    }
    const next = [...products.value, newProduct]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    products.value = next
    return newProduct
  }

  function updateProduct(id, changes) {
    const target = getProductById(id)
    if (!target) return null
    const updated = { ...target, ...changes }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(products.value.map((product) => (product === target ? updated : product))),
    )
    Object.assign(target, changes)
    return target
  }

  function buyProduct(id, buyerId) {
    const product = getProductById(id)
    if (!product || product.status !== 'available' || product.sellerId === buyerId) return null
    return updateProduct(id, { status: 'sold', buyerId })
  }

  function removeProduct(id) {
    const index = products.value.findIndex((p) => p.id === Number(id))
    if (index === -1) return false
    products.value.splice(index, 1)
    return true
  }

  return {
    products,
    getProducts,
    getAvailableProducts,
    getProductById,
    getProductsBySeller,
    getProductsByBuyer,
    buyProduct,
    addProduct,
    updateProduct,
    removeProduct,
  }
})
