import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const KEY = 'campus-secondhand:accounts'
const GUEST_ID = 101

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (Array.isArray(saved?.accounts)) return saved
  } catch {
    // A new session can still be started when local data cannot be read.
  }
  return { accounts: [], currentId: null }
}

function hex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function passwordHash(password, salt) {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 600000, hash: 'SHA-256' },
    key,
    256,
  )
  return hex(new Uint8Array(bits))
}

function validatePassword(password) {
  if (password.length < 8 || password.length > 128) throw new Error('密码须为 8–128 个字符。')
}

export const useAccountStore = defineStore('account', () => {
  const state = ref(load())
  const current = computed(() =>
    state.value.accounts.find(({ id }) => id === state.value.currentId),
  )
  const userId = computed(() => current.value?.id ?? GUEST_ID)

  function save(accounts, currentId) {
    const next = { accounts, currentId }
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      throw new Error('账号信息保存失败，请检查浏览器存储后重试。')
    }
    state.value = next
  }

  async function register(account, nickname, password) {
    const name = account.trim()
    const displayName = nickname.trim()
    if (!/^[\p{L}\p{N}_-]{3,24}$/u.test(name))
      throw new Error('账号须为 3–24 个字母、汉字、数字、下划线或连字符。')
    if (!displayName || displayName.length > 24) throw new Error('昵称须为 1–24 个字符。')
    validatePassword(password)
    const salt = hex(crypto.getRandomValues(new Uint8Array(16)))
    const hash = await passwordHash(password, salt)
    if (state.value.accounts.some((entry) => entry.account === name))
      throw new Error('账号已存在。')
    const id = Date.now() * 4096 + (crypto.getRandomValues(new Uint16Array(1))[0] & 4095)
    save([...state.value.accounts, { id, account: name, nickname: displayName, salt, hash }], id)
  }

  async function login(account, password) {
    const entry = state.value.accounts.find((candidate) => candidate.account === account.trim())
    if (!entry || entry.hash !== (await passwordHash(password, entry.salt)))
      throw new Error('账号或密码错误。')
    save(state.value.accounts, entry.id)
  }

  function logout() {
    save(state.value.accounts, null)
  }

  function updateAccount(entry, changes) {
    save(
      state.value.accounts.map((account) =>
        account.id === entry.id ? { ...account, ...changes } : account,
      ),
      entry.id,
    )
  }

  function updateNickname(nickname) {
    if (!nickname.trim() || nickname.trim().length > 24) throw new Error('昵称须为 1–24 个字符。')
    updateAccount(current.value, { nickname: nickname.trim() })
  }

  async function changePassword(oldPassword, newPassword) {
    validatePassword(newPassword)
    const entry = current.value
    if (entry.hash !== (await passwordHash(oldPassword, entry.salt)))
      throw new Error('原密码错误。')
    const salt = hex(crypto.getRandomValues(new Uint8Array(16)))
    updateAccount(entry, { salt, hash: await passwordHash(newPassword, salt) })
  }

  async function deleteAccount(password) {
    const entry = current.value
    if (entry.hash !== (await passwordHash(password, entry.salt))) throw new Error('密码错误。')
    save(
      state.value.accounts.filter(({ id }) => id !== entry.id),
      null,
    )
  }

  function updateAvatar(avatar) {
    updateAccount(current.value, { avatar })
  }

  function getNickname(id) {
    return state.value.accounts.find((entry) => entry.id === id)?.nickname
  }

  return {
    current,
    userId,
    register,
    login,
    logout,
    updateNickname,
    updateAvatar,
    getNickname,
    changePassword,
    deleteAccount,
  }
})
