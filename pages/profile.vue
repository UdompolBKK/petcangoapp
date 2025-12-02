<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container-custom max-w-4xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">โปรไฟล์ของฉัน</h1>
        <p class="text-gray-600 mt-2">จัดการข้อมูลส่วนตัวของคุณ</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {{ error }}
      </div>

      <!-- Profile Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Card -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <!-- Avatar -->
              <div class="relative inline-block">
                <img
                  v-if="profile.photoURL"
                  :src="profile.photoURL"
                  :alt="profile.displayName"
                  class="h-24 w-24 rounded-full mx-auto"
                />
                <div
                  v-else
                  class="h-24 w-24 rounded-full bg-primary-500 text-white text-3xl font-bold flex items-center justify-center mx-auto"
                >
                  {{ (profile.displayName || profile.email || 'U')[0].toUpperCase() }}
                </div>
              </div>

              <!-- Name -->
              <h2 class="mt-4 text-xl font-bold text-gray-900">
                {{ profile.displayName || 'ไม่ระบุชื่อ' }}
              </h2>
              <p class="text-gray-600 text-sm mt-1">{{ profile.email }}</p>

              <!-- Role Badge -->
              <span
                :class="[
                  'inline-block mt-4 px-3 py-1 rounded-full text-xs font-semibold',
                  profile.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                ]"
              >
                {{ profile.role === 'admin' ? 'ผู้ดูแลระบบ' : 'สมาชิก' }}
              </span>

              <!-- Member Since -->
              <p class="text-gray-500 text-sm mt-4">
                สมาชิกตั้งแต่ {{ formatDate(profile.createdAt) }}
              </p>
            </div>

            <!-- Quick Links -->
            <div class="mt-6 pt-6 border-t border-gray-200 space-y-2">
              <NuxtLink
                v-if="isAdmin"
                to="/backend"
                class="w-full flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>หน้า Backend</span>
              </NuxtLink>

              <button
                @click="handleLogout"
                class="w-full flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Profile Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-6">ข้อมูลส่วนตัว</h3>

            <!-- Success Message -->
            <div
              v-if="successMessage"
              class="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
            >
              {{ successMessage }}
            </div>

            <!-- Edit Form -->
            <form @submit.prevent="handleUpdate" class="space-y-5">
              <div>
                <label for="displayName" class="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อ-นามสกุล
                </label>
                <input
                  id="displayName"
                  v-model="form.displayName"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  :disabled="updating"
                />
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  อีเมล
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  disabled
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
                <p class="mt-1 text-xs text-gray-500">ไม่สามารถเปลี่ยนอีเมลได้</p>
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                  เบอร์โทร
                </label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  placeholder="081-234-5678"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  :disabled="updating"
                />
              </div>

              <div>
                <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                  ที่อยู่
                </label>
                <textarea
                  id="address"
                  v-model="form.address"
                  rows="3"
                  placeholder="ที่อยู่ของคุณ"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  :disabled="updating"
                ></textarea>
              </div>

              <div>
                <label for="bio" class="block text-sm font-medium text-gray-700 mb-2">
                  เกี่ยวกับฉัน
                </label>
                <textarea
                  id="bio"
                  v-model="form.bio"
                  rows="3"
                  placeholder="เล่าเกี่ยวกับตัวคุณและสัตว์เลี้ยงของคุณ"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  :disabled="updating"
                ></textarea>
              </div>

              <div class="flex space-x-4">
                <button
                  type="submit"
                  :disabled="updating"
                  class="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
                >
                  <svg
                    v-if="updating"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ updating ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง' }}</span>
                </button>

                <button
                  type="button"
                  @click="resetForm"
                  :disabled="updating"
                  class="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Protect this page - require authentication
definePageMeta({
  middleware: ['auth']
})

// SEO
useHead({
  title: 'โปรไฟล์ - PetCanGo',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow'
    }
  ]
})

const { user, logout, isAdmin } = useAuth()

const loading = ref(true)
const updating = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const profile = ref<any>({})

const form = ref({
  displayName: '',
  email: '',
  phone: '',
  address: '',
  bio: ''
})

/**
 * Load user profile
 */
const loadProfile = async () => {
  if (!user.value) return

  try {
    loading.value = true
    error.value = null

    const response = await $fetch(`/api/users/${user.value.uid}`)
    profile.value = response.data

    // Populate form
    form.value = {
      displayName: profile.value.displayName || '',
      email: profile.value.email || '',
      phone: profile.value.phone || '',
      address: profile.value.address || '',
      bio: profile.value.bio || ''
    }

  } catch (err: any) {
    console.error('Failed to load profile:', err)
    error.value = 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้'
  } finally {
    loading.value = false
  }
}

/**
 * Update profile
 */
const handleUpdate = async () => {
  if (!user.value) return

  try {
    updating.value = true
    successMessage.value = null

    await $fetch(`/api/users/${user.value.uid}`, {
      method: 'PATCH',
      body: {
        displayName: form.value.displayName,
        phone: form.value.phone,
        address: form.value.address,
        bio: form.value.bio
      }
    })

    successMessage.value = 'บันทึกข้อมูลสำเร็จ!'
    await loadProfile()

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = null
    }, 3000)

  } catch (err: any) {
    console.error('Failed to update profile:', err)
    alert('ไม่สามารถบันทึกข้อมูลได้')
  } finally {
    updating.value = false
  }
}

/**
 * Reset form
 */
const resetForm = () => {
  form.value = {
    displayName: profile.value.displayName || '',
    email: profile.value.email || '',
    phone: profile.value.phone || '',
    address: profile.value.address || '',
    bio: profile.value.bio || ''
  }
}

/**
 * Format date
 */
const formatDate = (date: any) => {
  if (!date) return '-'

  let d: Date
  if (date.toDate) {
    d = date.toDate()
  } else if (date._seconds) {
    d = new Date(date._seconds * 1000)
  } else {
    d = new Date(date)
  }

  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(d)
}

/**
 * Handle logout
 */
const handleLogout = async () => {
  const success = await logout()
  if (success) {
    navigateTo('/')
  }
}

// Load profile on mount
onMounted(() => {
  loadProfile()
})
</script>
