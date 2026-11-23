import { ref } from 'vue'
import { defineStore } from 'pinia'
import { categories, currentUserId, initialProducts } from '../data/products'

const STORAGE_KEY = 'campus-secondhand:products'
const statuses = ['available', 'offline', 'sold']

function isProduct(p) {
  return (
    p &&
    Number.isSafeInteger(p.id) &&
    p.id > 0 &&
    Number.isSafeInteger(p.sellerId) &&
    typeof p.title === 'string' &&
    p.title.trim() &&
    Number.isFinite(p.price) &&
    p.price > 0 &&
    categories.includes(p.category) &&
    ['condition', 'description', 'image', 'createdAt'].every((key) => typeof p[key] === 'string') &&
    statuses.includes(p.status)
  )
}

function loadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw !== null) {
      const saved = JSON.parse(raw)
      // 空数组是合法结果：用户删除过的商品不能在刷新后重新出现。
      if (
        Array.isArray(saved) &&
        saved.every(isProduct) &&
        new Set(saved.map((p) => p.id)).size === saved.length
      ) {
        return saved
      }
    }
  } catch {
    // 缓存无法读取或解析时，仍然允许打开页面。
  }
  return initialProducts.map((p) => ({ ...p }))
}

export const useProductStore = defineStore('product', () => {
  const products = ref(loadProducts())

  // 先写本地，再更新页面。setItem 失败会抛出异常，由页面提示并保留输入。
  function save(next) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    products.value = next
  }

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

  function addProduct(fields) {
    const maxId = products.value.reduce((max, p) => Math.max(max, p.id), 0)
    const product = {
      ...fields,
      sellerId: currentUserId,
      id: Math.max(Date.now(), maxId + 1),
      status: 'available',
      createdAt: new Date().toISOString(),
    }
    if (!isProduct(product)) throw new Error('请检查商品信息。')
    save([...products.value, product])
    return product
  }

  // 卖家操作默认以 101 执行。M5 下单时可显式传入买家编号。
  function updateProduct(id, changes, actorId = currentUserId) {
    const product = getProductById(id)
    if (!product) return null
    if (product.status === 'sold') throw new Error('已售商品不能修改或重新上架。')

    if (changes.status === 'sold') {
      if (
        ![101, 102].includes(actorId) ||
        actorId === product.sellerId ||
        product.status !== 'available' ||
        Object.keys(changes).length !== 1
      ) {
        throw new Error('当前商品不能下单。')
      }
    } else if (product.sellerId !== currentUserId || actorId !== currentUserId) {
      throw new Error('只能修改自己发布的商品。')
    }

    const updated = {
      ...product,
      ...changes,
      id: product.id,
      sellerId: product.sellerId,
      createdAt: product.createdAt,
    }
    if (!isProduct(updated)) throw new Error('请检查商品信息。')
    save(products.value.map((p) => (p.id === product.id ? updated : p)))
    return updated
  }

  function removeProduct(id) {
    const product = getProductById(id)
    if (!product) return false
    if (product.sellerId !== currentUserId) throw new Error('只能删除自己发布的商品。')
    save(products.value.filter((p) => p.id !== product.id))
    return true
  }

  return {
    products,
    getProducts,
    getAvailableProducts,
    getProductById,
    getProductsBySeller,
    addProduct,
    updateProduct,
    removeProduct,
  }
})
