<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Top Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/backend" class="text-gray-600 hover:text-gray-900">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </NuxtLink>
            <h1 class="text-2xl font-bold text-gray-900">จัดการ Users</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">{{ currentUser?.email }}</span>
            <button
              @click="handleLogout"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header & Search -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">ผู้ใช้งาน</h2>
          <p class="text-gray-600">จำนวนทั้งหมด {{ users.length }} คน</p>
        </div>
        <button
          @click="loadUsers"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>รีเฟรช</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {{ error }}
      </div>

      <!-- Users Table -->
      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ผู้ใช้
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                อีเมล
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                เบอร์โทร
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                วันที่สมัคร
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img
                    v-if="user.photoURL"
                    :src="user.photoURL"
                    :alt="user.displayName"
                    class="h-10 w-10 rounded-full"
                  />
                  <div
                    v-else
                    class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold"
                  >
                    {{ (user.displayName || user.email || 'U')[0].toUpperCase() }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.displayName || 'ไม่ระบุชื่อ' }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ user.id }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.phone || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                  ]"
                >
                  {{ user.role || 'user' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  v-if="user.role !== 'admin'"
                  @click="setAdmin(user.id, true)"
                  class="text-purple-600 hover:text-purple-900"
                  title="ตั้งเป็น Admin"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  v-else
                  @click="setAdmin(user.id, false)"
                  class="text-gray-600 hover:text-gray-900"
                  title="ยกเลิก Admin"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <button
                  @click="deleteUser(user.id)"
                  class="text-red-600 hover:text-red-900"
                  title="ลบผู้ใช้"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="users.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่พบผู้ใช้งาน</h3>
          <p class="mt-1 text-sm text-gray-500">ยังไม่มีผู้ใช้งานในระบบ</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Protect this page with admin middleware
definePageMeta({
  middleware: ['admin']
})

// SEO
useHead({
  title: 'จัดการ Users - Backend',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow'
    }
  ]
})

const { user: currentUser, logout } = useAuth()

const loading = ref(true)
const error = ref<string | null>(null)
const users = ref<any[]>([])

/**
 * Load users
 */
const loadUsers = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await $fetch('/api/users', {
      query: { limit: 100 }
    })

    users.value = response.data || []

  } catch (err: any) {
    console.error('Failed to load users:', err)
    error.value = 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้'
  } finally {
    loading.value = false
  }
}

/**
 * Set admin role
 */
const setAdmin = async (uid: string, isAdmin: boolean) => {
  if (!confirm(`คุณต้องการ${isAdmin ? 'ตั้ง' : 'ยกเลิก'} admin role ใช่หรือไม่?`)) {
    return
  }

  try {
    await $fetch(`/api/users/${uid}/set-admin`, {
      method: 'POST',
      body: { isAdmin }
    })

    alert(`${isAdmin ? 'ตั้ง' : 'ยกเลิก'} admin role สำเร็จ`)
    await loadUsers()

  } catch (err: any) {
    console.error('Failed to set admin role:', err)
    alert('ไม่สามารถเปลี่ยน role ได้')
  }
}

/**
 * Delete user
 */
const deleteUser = async (uid: string) => {
  if (!confirm('คุณต้องการลบผู้ใช้นี้ใช่หรือไม่? (ไม่สามารถย้อนกลับได้)')) {
    return
  }

  try {
    await $fetch(`/api/users/${uid}`, {
      method: 'DELETE'
    })

    alert('ลบผู้ใช้สำเร็จ')
    await loadUsers()

  } catch (err: any) {
    console.error('Failed to delete user:', err)
    alert('ไม่สามารถลบผู้ใช้ได้')
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
    month: 'short',
    day: 'numeric'
  }).format(d)
}

/**
 * Handle logout
 */
const handleLogout = async () => {
  const success = await logout()
  if (success) {
    navigateTo('/login')
  }
}

// Load users on mount
onMounted(() => {
  loadUsers()
})
</script>
