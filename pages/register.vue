<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-16">
    <div class="container-custom">
      <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-3">ลงทะเบียนฟรี</h1>
          <p class="text-gray-600">สร้างบัญชีเพื่อเริ่มใช้งาน PetCanGo</p>
        </div>

        <!-- Registration Card -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <!-- Social Registration -->
          <div class="mb-8">
            <button
              @click="handleGoogleSignup"
              :disabled="loading"
              class="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>ลงทะเบียนด้วย Google</span>
            </button>
          </div>

          <!-- Divider -->
          <div class="relative mb-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-gray-500">หรือลงทะเบียนด้วยอีเมล</span>
            </div>
          </div>

          <!-- Registration Form -->
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Error Message -->
            <div
              v-if="error"
              class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              {{ error }}
            </div>

            <!-- Success Message -->
            <div
              v-if="success"
              class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm"
            >
              ลงทะเบียนสำเร็จ! กำลังนำทางไปหน้าหลัก...
            </div>

            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                ชื่อ-นามสกุล
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                placeholder="ชื่อของคุณ"
                class="input"
                :disabled="loading"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                อีเมล
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                placeholder="example@email.com"
                class="input"
                :disabled="loading"
              />
            </div>

            <!-- Phone (Optional) -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                เบอร์โทร (ไม่บังคับ)
              </label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="081-234-5678"
                class="input"
                :disabled="loading"
              />
            </div>

            <!-- Password -->
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
                class="input"
                :disabled="loading"
              />
              <p class="mt-1 text-xs text-gray-500">รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร</p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                ยืนยันรหัสผ่าน
              </label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                class="input"
                :disabled="loading"
              />
            </div>

            <!-- Terms & Conditions -->
            <div class="flex items-start">
              <input
                id="terms"
                v-model="form.acceptTerms"
                type="checkbox"
                required
                class="mt-1 h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                :disabled="loading"
              />
              <label for="terms" class="ml-2 text-sm text-gray-700">
                ฉันยอมรับ
                <NuxtLink to="/terms" class="text-red-500 hover:text-red-600">เงื่อนไขการใช้งาน</NuxtLink>
                และ
                <NuxtLink to="/privacy" class="text-red-500 hover:text-red-600">นโยบายความเป็นส่วนตัว</NuxtLink>
              </label>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full btn btn-primary py-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
              <span>{{ loading ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชี' }}</span>
            </button>
          </form>

          <!-- Login Link -->
          <div class="mt-6 text-center text-sm text-gray-600">
            มีบัญชีอยู่แล้ว?
            <button
              @click="showLogin"
              class="text-red-500 hover:text-red-600 font-medium"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </div>

        <!-- Benefits -->
        <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <h3 class="font-bold text-gray-900 mb-2">บันทึกที่พักโปรด</h3>
            <p class="text-sm text-gray-600">เก็บที่พักที่ชอบไว้ดูทีหลัง</p>
          </div>

          <div class="text-center">
            <div class="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <h3 class="font-bold text-gray-900 mb-2">ลงทะเบียนที่พักฟรี</h3>
            <p class="text-sm text-gray-600">เจ้าของที่พักสามารถลงทะเบียนฟรี</p>
          </div>

          <div class="text-center">
            <div class="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
            </div>
            <h3 class="font-bold text-gray-900 mb-2">แจ้งเตือนโปรโมชัน</h3>
            <p class="text-sm text-gray-600">รับข่าวสารและโปรโมชันพิเศษ</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO
useHead({
  title: 'ลงทะเบียนฟรี - PetCanGo',
  meta: [
    {
      name: 'description',
      content: 'สร้างบัญชี PetCanGo ฟรี เพื่อบันทึกที่พักโปรด และลงทะเบียนที่พักของคุณ'
    }
  ]
})

const { signUpWithEmail, signInWithGoogle, loading, error: authError } = useAuth()

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const error = ref<string | null>(null)
const success = ref(false)

const handleSubmit = async () => {
  error.value = null

  // Validation
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'รหัสผ่านไม่ตรงกัน'
    return
  }

  if (form.value.password.length < 6) {
    error.value = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
    return
  }

  if (!form.value.acceptTerms) {
    error.value = 'กรุณายอมรับเงื่อนไขการใช้งาน'
    return
  }

  // Create account
  const credential = await signUpWithEmail(form.value.email, form.value.password)

  if (credential) {
    try {
      // บันทึกข้อมูล user profile ลง Firestore
      await $fetch('/api/users/create', {
        method: 'POST',
        body: {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: form.value.name,
          phone: form.value.phone || '',
          role: 'user',
          createdAt: new Date().toISOString()
        }
      })

      success.value = true

      // Redirect to homepage after 2 seconds
      setTimeout(() => {
        navigateTo('/')
      }, 2000)
    } catch (err: any) {
      console.error('Failed to create user profile:', err)
      error.value = 'สร้างบัญชีสำเร็จแล้ว แต่ไม่สามารถบันทึกข้อมูลได้'
    }
  } else {
    error.value = authError.value
  }
}

const handleGoogleSignup = async () => {
  error.value = null
  const credential = await signInWithGoogle()

  if (credential) {
    try {
      // บันทึกข้อมูล user profile ลง Firestore (ถ้ายังไม่มี)
      await $fetch('/api/users/create', {
        method: 'POST',
        body: {
          uid: credential.user.uid,
          email: credential.user.email || '',
          displayName: credential.user.displayName || '',
          photoURL: credential.user.photoURL || '',
          phone: '',
          role: 'user',
          createdAt: new Date().toISOString()
        }
      })

      success.value = true
      setTimeout(() => {
        navigateTo('/')
      }, 1000)
    } catch (err: any) {
      // ถ้า user มีอยู่แล้วก็ไม่เป็นไร
      console.log('User profile may already exist:', err)
      success.value = true
      setTimeout(() => {
        navigateTo('/')
      }, 1000)
    }
  } else {
    error.value = authError.value
  }
}

const showLogin = () => {
  navigateTo('/login')
}
</script>
