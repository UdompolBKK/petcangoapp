<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="closeModal"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>

        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="modelValue"
              class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
              @click.stop
            >
              <!-- Close Button -->
              <button
                @click="closeModal"
                class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>

              <!-- Header -->
              <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">เข้าสู่ระบบ</h2>
                <p class="text-gray-600">ยินดีต้อนรับกลับสู่ PetCanGo</p>
              </div>

              <!-- Social Login Buttons -->
              <div class="mb-6">
                <button
                  @click="handleGoogleLogin"
                  :disabled="loading"
                  class="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>เข้าสู่ระบบด้วย Google</span>
                </button>
              </div>

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
              <form @submit.prevent="handleEmailLogin" class="space-y-4">
                <!-- Error Message -->
                <div
                  v-if="error"
                  class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                >
                  {{ error }}
                </div>

                <!-- Email Input -->
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

                <!-- Password Input -->
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
                </div>

                <!-- Forgot Password Link -->
                <div class="text-right">
                  <a href="#" class="text-sm text-primary-500 hover:text-primary-600">
                    ลืมรหัสผ่าน?
                  </a>
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
                  <span>{{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}</span>
                </button>
              </form>

              <!-- Sign Up Link -->
              <div class="mt-6 text-center text-sm text-gray-600">
                ยังไม่มีบัญชี?
                <NuxtLink
                  to="/register"
                  class="text-primary-500 hover:text-primary-600 font-medium"
                  @click="closeModal"
                >
                  สมัครสมาชิก
                </NuxtLink>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'login-success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { signInWithEmail, signInWithGoogle, loading, error } = useAuth()

const form = ref({
  email: '',
  password: ''
})

const closeModal = () => {
  emit('update:modelValue', false)
  // Reset form
  form.value = {
    email: '',
    password: ''
  }
  error.value = null
}

const handleEmailLogin = async () => {
  const credential = await signInWithEmail(form.value.email, form.value.password)

  if (credential) {
    emit('login-success')
    closeModal()
  }
}

const handleGoogleLogin = async () => {
  const credential = await signInWithGoogle()

  if (credential) {
    emit('login-success')
    closeModal()
  }
}
</script>
