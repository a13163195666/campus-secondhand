<script setup>
import { ref, watch } from 'vue'
import { useAccountStore } from '../stores/accountStore'
import { acceptedImageTypes, isSupportedImage, readImage } from '../utils/localImage'

const store = useAccountStore()
const mode = ref('')
const account = ref('')
const nickname = ref('')
const password = ref('')
const oldPassword = ref('')
const newPassword = ref('')
const deletionPassword = ref('')
const busy = ref(false)
const error = ref('')
const message = ref('')

watch(
  () => store.current?.id,
  () => {
    nickname.value = store.current?.nickname ?? ''
    password.value = ''
    oldPassword.value = ''
    newPassword.value = ''
    deletionPassword.value = ''
    mode.value = ''
  },
  { immediate: true },
)

function switchMode(next) {
  mode.value = next
  password.value = ''
  error.value = ''
  message.value = ''
}

async function run(action, success) {
  if (busy.value) return
  busy.value = true
  error.value = ''
  message.value = ''
  try {
    await action()
    message.value = success
  } catch (failure) {
    error.value = failure.message || '操作失败，请重试。'
  } finally {
    busy.value = false
  }
}

function authenticate() {
  if (mode.value === 'register') {
    return run(
      () => store.register(account.value, nickname.value, password.value),
      '注册成功，已登录。',
    )
  }
  return run(() => store.login(account.value, password.value), '已登录。')
}

function saveNickname() {
  return run(() => {
    store.updateNickname(nickname.value)
    nickname.value = store.current.nickname
  }, '昵称已保存。')
}

async function uploadAvatar(event) {
  const input = event.target
  const file = input.files[0]
  input.value = ''
  if (!file) return

  await run(async () => {
    if (!isSupportedImage(file)) {
      throw new Error('请选择 JPG、PNG 或 WebP 图片。')
    }
    const avatar = await readImage(file).catch(() => {
      throw new Error('头像读取失败，请重新选择。')
    })
    store.updateAvatar(avatar)
  }, '头像已保存。')
}

function savePassword() {
  return run(async () => {
    await store.changePassword(oldPassword.value, newPassword.value)
    oldPassword.value = ''
    newPassword.value = ''
  }, '密码已修改。')
}

function removeAccount() {
  if (!window.confirm('确定永久注销本地账号？已发布的商品和收藏记录仍会保留。')) return
  return run(() => store.deleteAccount(deletionPassword.value), '账号已注销。')
}
</script>

<template>
  <section>
    <h1>个人中心</h1>
    <p>演示账号仅保存在此浏览器。请使用演示密码。</p>

    <div class="account-panel sky-panel">
      <p v-if="message" role="status">{{ message }}</p>
      <p v-if="error" class="error" role="alert">{{ error }}</p>

      <div v-if="!store.current && !mode">
        <p>未注册？请点击注册。已有账号可以登录。</p>
        <div class="buttons">
          <button type="button" @click="switchMode('register')">注册</button>
          <button type="button" @click="switchMode('login')">登录</button>
        </div>
      </div>
      <form v-else-if="!store.current" @submit.prevent="authenticate">
        <h2>{{ mode === 'register' ? '注册' : '登录' }}</h2>
        <label>
          账号
          <input v-model="account" required maxlength="24" autocomplete="username" />
        </label>
        <label v-if="mode === 'register'">
          昵称
          <input v-model="nickname" required maxlength="24" autocomplete="nickname" />
        </label>
        <label>
          密码
          <input
            v-model="password"
            type="password"
            required
            maxlength="128"
            :autocomplete="mode === 'register' ? 'new-password' : 'current-password'"
          />
        </label>
        <div class="buttons">
          <button :disabled="busy" type="submit">
            {{ mode === 'register' ? '注册' : '登录' }}
          </button>
          <button :disabled="busy" type="button" @click="switchMode('')">返回</button>
        </div>
      </form>

      <template v-else>
        <img
          v-if="store.current.avatar"
          :src="store.current.avatar"
          alt="我的头像"
          class="avatar"
        />
        <label>
          上传头像（JPG、PNG 或 WebP）
          <input type="file" :accept="acceptedImageTypes" :disabled="busy" @change="uploadAvatar" />
        </label>
        <p>账号：{{ store.current.account }}</p>
        <p>昵称：{{ store.current.nickname }}</p>
        <details name="profile-settings" class="setting">
          <summary>修改昵称</summary>
          <form @submit.prevent="saveNickname">
            <label>
              新昵称
              <input v-model="nickname" required maxlength="24" autocomplete="nickname" />
            </label>
            <button :disabled="busy" type="submit">保存昵称</button>
          </form>
        </details>

        <details name="profile-settings" class="setting">
          <summary>修改密码</summary>
          <form @submit.prevent="savePassword">
            <label>
              原密码
              <input
                v-model="oldPassword"
                type="password"
                required
                maxlength="128"
                autocomplete="current-password"
              />
            </label>
            <label>
              新密码
              <input
                v-model="newPassword"
                type="password"
                required
                minlength="8"
                maxlength="128"
                autocomplete="new-password"
              />
            </label>
            <button :disabled="busy" type="submit">修改密码</button>
          </form>
        </details>

        <button :disabled="busy" type="button" @click="run(store.logout, '已退出登录。')">
          退出登录
        </button>

        <details name="profile-settings" class="setting">
          <summary>注销账号</summary>
          <form @submit.prevent="removeAccount">
            <label>
              确认密码
              <input
                v-model="deletionPassword"
                type="password"
                required
                maxlength="128"
                autocomplete="current-password"
              />
            </label>
            <button :disabled="busy" type="submit" class="danger">注销账号</button>
          </form>
        </details>
      </template>
    </div>
  </section>
</template>

<style scoped>
.account-panel {
  display: grid;
  justify-items: start;
  gap: 12px;
  max-width: 480px;
  margin-top: 16px;
  overflow-wrap: anywhere;
}
form,
label {
  display: grid;
  gap: 6px;
}
form {
  width: 100%;
  justify-items: start;
  gap: 10px;
}
label {
  width: 100%;
}
input {
  min-width: 0;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font: inherit;
}
h2 {
  font-size: 1.1rem;
}
.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.setting {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}
.setting summary {
  padding: 10px 14px;
  color: var(--color-brand);
  font-weight: 600;
  cursor: pointer;
}
.setting[open] summary {
  border-bottom: 1px solid var(--color-border);
}
.setting form {
  padding: 12px 14px;
}
.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
}
button {
  padding: 8px 14px;
  border: 1px solid currentColor;
  border-radius: 6px;
  background: #fff;
  color: var(--color-brand);
  font: inherit;
  cursor: pointer;
}
button:active {
  background: var(--color-sky);
}
button.danger,
.error {
  color: var(--color-error);
}
</style>
