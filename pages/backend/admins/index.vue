<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">จัดการ Admin</h1>
      <p class="text-gray-400">เพิ่มและจัดการ Super Admin และ Admin ของระบบ</p>
    </div>

    <!-- Content -->
    <div>
      <!-- Access Denied for non-Super Admin -->
      <div v-if="!isSuperAdmin" class="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl">
        <p class="font-medium">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
        <p class="text-sm mt-1">เฉพาะ Super Admin เท่านั้นที่สามารถจัดการ Admin ได้</p>
      </div>

      <template v-else>
        <!-- Add Admin Form -->
        <div class="bg-[#0F1419] border border-gray-800 rounded-xl p-6 mb-8">
          <h2 class="text-xl font-bold text-white mb-4">เพิ่ม Admin ใหม่</h2>

          <form @submit.prevent="handleAddAdmin" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="md:col-span-1">
                <label for="email" class="block text-sm font-medium text-gray-400 mb-2">
                  อีเมล
                </label>
                <input
                  id="email"
                  v-model="addForm.email"
                  type="email"
                  required
                  placeholder="admin@example.com"
                  class="w-full px-4 py-2 bg-[#1A1F2E] border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  :disabled="adding"
                />
                <p class="text-xs text-gray-500 mt-1">ผู้ใช้ต้องลงทะเบียนในระบบก่อน</p>
              </div>

              <div class="md:col-span-1">
                <label for="role" class="block text-sm font-medium text-gray-400 mb-2">
                  บทบาท
                </label>
                <select
                  id="role"
                  v-model="addForm.role"
                  class="w-full px-4 py-2 bg-[#1A1F2E] border border-gray-700 rounded-lg text-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  :disabled="adding"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>

              <div class="md:col-span-1 flex items-end">
                <button
                  type="submit"
                  :disabled="adding"
                  class="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <svg
                    v-if="adding"
                    class="animate-spin -ml-1 mr-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ adding ? 'กำลังเพิ่ม...' : 'เพิ่ม Admin' }}
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Admins List -->
        <div class="bg-[#0F1419] border border-gray-800 rounded-xl overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-800">
            <h2 class="text-xl font-bold text-white">รายชื่อ Admin ทั้งหมด</h2>
          </div>

          <div v-if="loading" class="p-12 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p class="text-gray-400">กำลังโหลด...</p>
          </div>

          <div v-else-if="admins.length === 0" class="p-12 text-center text-gray-400">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <p class="text-lg font-medium">ไม่พบ Admin</p>
          </div>

          <table v-else class="w-full">
            <thead class="bg-[#1A1F2E] border-b border-gray-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ผู้ใช้</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">บทบาท</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">วันที่สร้าง</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">การกระทำ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800">
              <tr v-for="admin in admins" :key="admin.id" class="hover:bg-gray-800/50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <img
                      v-if="admin.photoURL"
                      :src="admin.photoURL"
                      :alt="admin.displayName"
                      class="w-10 h-10 rounded-full mr-3"
                    />
                    <div
                      v-else
                      class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mr-3 font-bold"
                    >
                      {{ (admin.displayName || admin.email || 'A')[0].toUpperCase() }}
                    </div>
                    <div>
                      <div class="font-medium text-white">{{ admin.displayName || 'ไม่ระบุชื่อ' }}</div>
                      <div class="text-sm text-gray-400">{{ admin.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'px-3 py-1 text-xs font-semibold rounded-full',
                      admin.role === 'superadmin'
                        ? 'bg-purple-500/10 text-purple-400'
                        : 'bg-blue-500/10 text-blue-400'
                    ]"
                  >
                    {{ admin.role === 'superadmin' ? 'Super Admin' : 'Admin' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-400">
                  {{ formatDate(admin.createdAt) }}
                </td>
                <td class="px-6 py-4">
                  <button
                    v-if="admin.role !== 'superadmin' || canRemoveSuperAdmin(admin)"
                    @click="handleRemoveAdmin(admin)"
                    :disabled="removing === admin.id"
                    class="text-red-400 hover:text-red-300 text-sm font-medium disabled:opacity-50"
                  >
                    {{ removing === admin.id ? 'กำลังลบ...' : 'ลบสิทธิ์ Admin' }}
                  </button>
                  <span v-else class="text-gray-500 text-sm">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'superadmin',
  layout: 'backend'
})

const { user, isSuperAdmin } = useAuth()

const loading = ref(true)
const adding = ref(false)
const removing = ref<string | null>(null)
const admins = ref<any[]>([])

const addForm = ref({
  email: '',
  role: 'admin'
})

/**
 * Load admins
 */
const loadAdmins = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/admins/list')
    admins.value = response.data || []
  } catch (error) {
    console.error('Failed to load admins:', error)
    alert('ไม่สามารถโหลดรายชื่อ Admin ได้')
  } finally {
    loading.value = false
  }
}

/**
 * Add new admin
 */
const handleAddAdmin = async () => {
  try {
    adding.value = true

    await $fetch('/api/admins/add', {
      method: 'POST',
      body: {
        email: addForm.value.email,
        role: addForm.value.role
      }
    })

    alert(`เพิ่ม ${addForm.value.role === 'superadmin' ? 'Super Admin' : 'Admin'} สำเร็จ`)

    // Reset form
    addForm.value = {
      email: '',
      role: 'admin'
    }

    // Reload list
    await loadAdmins()

  } catch (error: any) {
    console.error('Failed to add admin:', error)
    alert(error.data?.message || 'ไม่สามารถเพิ่ม Admin ได้')
  } finally {
    adding.value = false
  }
}

/**
 * Remove admin
 */
const handleRemoveAdmin = async (admin: any) => {
  if (!confirm(`คุณต้องการลบสิทธิ์ Admin ของ ${admin.email} ใช่หรือไม่?`)) {
    return
  }

  try {
    removing.value = admin.id

    await $fetch('/api/admins/remove', {
      method: 'POST',
      body: {
        uid: admin.id
      }
    })

    alert('ลบสิทธิ์ Admin สำเร็จ')
    await loadAdmins()

  } catch (error) {
    console.error('Failed to remove admin:', error)
    alert('ไม่สามารถลบสิทธิ์ Admin ได้')
  } finally {
    removing.value = null
  }
}

/**
 * Check if can remove super admin
 * Super Admin cannot remove themselves
 */
const canRemoveSuperAdmin = (admin: any): boolean => {
  return admin.id !== user.value?.uid
}

/**
 * Format date
 */
const formatDate = (date: any): string => {
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

// Load admins on mount (only if super admin)
onMounted(() => {
  if (isSuperAdmin.value) {
    loadAdmins()
  }
})

// SEO
useHead({
  title: 'จัดการ Admin | Backend - PetCanGo'
})
</script>
