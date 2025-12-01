<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">🐾 PetCanGo</h1>
        <h2 class="text-2xl font-bold text-gray-300">เข้าสู่ระบบ</h2>
        <p class="mt-2 text-gray-400">ค้นหาที่พักสำหรับสัตว์เลี้ยงของคุณ</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <!-- Error Message -->
        <div
          v-if="error"
          class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
        >
          {{ error }}
        </div>

        <!-- Success Message -->
        <div
          v-if="successMessage"
          class="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm"
        >
          {{ successMessage }}
        </div>

        <!-- Google Login -->
        <button
          @click="handleGoogleLogin"
          :disabled="loading"
          class="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>เข้าสู่ระบบด้วย Google</span>
        </button>

        <!-- Divider -->
        <div class="relative mb-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500">หรือ</span>
          </div>
        </div>

        <!-- Email/Password Form -->
        <form @submit.prevent="handleEmailLogin" class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              อีเมล
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="your@email.com"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              :disabled="loading"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              รหัสผ่าน
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              :disabled="loading"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg
              v-if="loading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}</span>
          </button>
        </form>

        <!-- Register Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            ยังไม่มีบัญชี?
            <NuxtLink to="/register" class="text-primary-500 hover:text-primary-600 font-medium">
              สมัครสมาชิก
            </NuxtLink>
          </p>
        </div>

        <!-- Back to Home -->
        <div class="mt-4 text-center">
          <NuxtLink
            to="/"
            class="text-sm text-gray-600 hover:text-gray-800"
          >
            ← กลับสู่หน้าหลัก
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO
useHead({
  title: 'เข้าสู่ระบบ - PetCanGo',
  meta: [
    {
      name: 'description',
      content: 'เข้าสู่ระบบ PetCanGo เพื่อค้นหาและจองที่พักสำหรับสัตว์เลี้ยงของคุณ'
    }
  ]
})

const { signInWithEmail, signInWithGoogle, loading, error: authError, isAdmin } = useAuth()

const form = ref({
  email: '',
  password: ''
})

const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

/**
 * Redirect based on user role
 */
const redirectAfterLogin = async () => {
  // รอให้ Firebase โหลด user claims
  await new Promise(resolve => setTimeout(resolve, 500))

  // ตรวจสอบ role
  if (isAdmin.value) {
    successMessage.value = 'เข้าสู่ระบบสำเร็จ! กำลังนำไปยังหน้า Backend...'
    setTimeout(() => {
      navigateTo('/backend')
    }, 1000)
  } else {
    successMessage.value = 'เข้าสู่ระบบสำเร็จ!'
    setTimeout(() => {
      navigateTo('/')
    }, 1000)
  }
}

/**
 * Ensure user profile exists in Firestore
 */
const ensureUserProfile = async (credential: any) => {
  try {
    // ตรวจสอบว่ามี user profile ใน Firestore หรือยัง
    await $fetch(`/api/users/${credential.user.uid}`)
  } catch {
    // ถ้ายังไม่มี ให้สร้างใหม่
    try {
      await $fetch('/api/users/create', {
        method: 'POST',
        body: {
          uid: credential.user.uid,
          email: credential.user.email || '',
          displayName: credential.user.displayName || credential.user.email?.split('@')[0] || '',
          photoURL: credential.user.photoURL || '',
          phone: '',
          role: 'user',
          createdAt: new Date().toISOString()
        }
      })
    } catch (err) {
      console.error('Failed to create user profile:', err)
    }
  }
}

/**
 * Handle Email Login
 */
const handleEmailLogin = async () => {
  error.value = null
  successMessage.value = null

  const credential = await signInWithEmail(form.value.email, form.value.password)

  if (credential) {
    await ensureUserProfile(credential)
    await redirectAfterLogin()
  } else {
    error.value = authError.value
  }
}

/**
 * Handle Google Login
 */
const handleGoogleLogin = async () => {
  error.value = null
  successMessage.value = null

  const credential = await signInWithGoogle()

  if (credential) {
    await ensureUserProfile(credential)
    await redirectAfterLogin()
  } else {
    error.value = authError.value
  }
}
</script>
