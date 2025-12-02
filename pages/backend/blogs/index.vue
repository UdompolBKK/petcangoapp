<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">จัดการบทความ</h1>
        <p class="text-gray-400">จัดการบทความและเคล็ดลับทั้งหมด</p>
      </div>
      <NuxtLink
        to="/backend/blogs/create"
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        เพิ่มบทความ
      </NuxtLink>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">ทั้งหมด</p>
            <p class="text-3xl font-bold text-white">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">เผยแพร่แล้ว</p>
            <p class="text-3xl font-bold text-emerald-500">{{ stats.published }}</p>
          </div>
          <div class="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">แบบร่าง</p>
            <p class="text-3xl font-bold text-yellow-500">{{ stats.draft }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">ยอดดู</p>
            <p class="text-3xl font-bold text-purple-500">{{ formatNumber(stats.totalViews) }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-gray-800 rounded-xl p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="search"
            type="text"
            placeholder="ค้นหา ชื่อบทความ..."
            class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <select
          v-model="filterStatus"
          class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        >
          <option v-for="option in statusOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>

        <button
          @click="resetFilters"
          class="w-full bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg py-2.5 px-4 text-white font-medium transition-colors"
        >
          รีเซ็ต
        </button>
      </div>
    </div>

    <!-- Blogs Table -->
    <div class="bg-gray-800 rounded-xl overflow-hidden">
      <!-- Loading -->
      <div v-if="loading" class="p-12 text-center">
        <svg class="w-12 h-12 mx-auto mb-4 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
        <p class="text-gray-400">กำลังโหลด...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredBlogs.length === 0" class="p-12 text-center text-gray-400">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
        </svg>
        <p class="text-lg font-medium">ไม่พบบทความ</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-900/50">
            <tr>
              <th class="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">บทความ</th>
              <th class="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">ยอดดู</th>
              <th class="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">สถานะ</th>
              <th class="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">วันที่</th>
              <th class="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">การกระทำ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="blog in filteredBlogs" :key="blog.id" class="hover:bg-gray-700/50 transition-colors">
              <!-- Blog Title -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-4">
                  <img
                    v-if="blog.featuredImage"
                    :src="blog.featuredImage"
                    :alt="blog.title"
                    class="w-16 h-12 rounded-lg object-cover flex-shrink-0 bg-gray-700"
                  />
                  <div
                    v-else
                    class="w-16 h-12 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0"
                  >
                    <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <div class="font-medium text-white truncate max-w-[300px]">{{ blog.title }}</div>
                    <div class="text-sm text-gray-500 truncate max-w-[300px]">{{ blog.excerpt }}</div>
                  </div>
                </div>
              </td>

              <!-- View Count -->
              <td class="py-4 px-6">
                <span class="text-gray-300">{{ formatNumber(blog.viewCount || 0) }}</span>
              </td>

              <!-- Status Switch -->
              <td class="py-4 px-6">
                <button
                  @click="toggleStatus(blog)"
                  :disabled="blog.toggling"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
                  :class="blog.status === 'published' ? 'bg-emerald-500' : 'bg-gray-600'"
                >
                  <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    :class="blog.status === 'published' ? 'translate-x-6' : 'translate-x-1'"
                  />
                </button>
              </td>

              <!-- Date -->
              <td class="py-4 px-6">
                <span class="text-gray-400 text-sm">{{ formatDate(blog.createdAt) }}</span>
              </td>

              <!-- Actions -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-2">
                  <!-- View -->
                  <NuxtLink
                    :to="`/blogs/${blog.slug}`"
                    target="_blank"
                    class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                    ดู
                  </NuxtLink>

                  <!-- Edit -->
                  <NuxtLink
                    :to="`/backend/blogs/${blog.id}/edit`"
                    class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-600/50 text-gray-300 hover:bg-gray-600 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    แก้ไข
                  </NuxtLink>

                  <!-- Delete -->
                  <button
                    @click="deleteBlog(blog)"
                    class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    ลบ
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'backend'
})

const blogs = ref<any[]>([])
const loading = ref(true)
const search = ref('')
const filterStatus = ref('')

const stats = ref({
  total: 0,
  published: 0,
  draft: 0,
  totalViews: 0
})

const statusOptions = [
  { label: 'สถานะทั้งหมด', value: '' },
  { label: 'เผยแพร่แล้ว', value: 'published' },
  { label: 'แบบร่าง', value: 'draft' }
]

/**
 * Load blogs from API
 */
const loadBlogs = async () => {
  try {
    loading.value = true

    const response = await $fetch('/api/blogs', {
      params: { limit: 100, all: 'true' }
    }) as any

    blogs.value = response.data || []

    // Calculate stats
    stats.value = {
      total: blogs.value.length,
      published: blogs.value.filter((b: any) => b.status === 'published').length,
      draft: blogs.value.filter((b: any) => b.status === 'draft').length,
      totalViews: blogs.value.reduce((sum: number, b: any) => sum + (b.viewCount || 0), 0)
    }
  } catch (error) {
    console.error('Failed to load blogs:', error)
    alert('ไม่สามารถโหลดข้อมูลบทความได้')
  } finally {
    loading.value = false
  }
}

/**
 * Filtered blogs
 */
const filteredBlogs = computed(() => {
  let result = [...blogs.value]

  // Search filter
  if (search.value) {
    const query = search.value.toLowerCase()
    result = result.filter((blog: any) => {
      return blog.title?.toLowerCase().includes(query) ||
             blog.excerpt?.toLowerCase().includes(query)
    })
  }

  // Status filter
  if (filterStatus.value) {
    result = result.filter((blog: any) => blog.status === filterStatus.value)
  }

  return result
})

/**
 * Toggle blog status
 */
const toggleStatus = async (blog: any) => {
  const newStatus = blog.status === 'published' ? 'draft' : 'published'

  // Set loading state
  blog.toggling = true

  try {
    await $fetch(`/api/blogs/${blog.id}`, {
      method: 'PATCH',
      body: {
        status: newStatus,
        publishedAt: newStatus === 'published' ? new Date().toISOString() : null
      }
    })

    // Update local data
    blog.status = newStatus

    // Recalculate stats
    stats.value = {
      ...stats.value,
      published: blogs.value.filter((b: any) => b.status === 'published').length,
      draft: blogs.value.filter((b: any) => b.status === 'draft').length
    }
  } catch (error) {
    console.error('Failed to toggle status:', error)
  } finally {
    blog.toggling = false
  }
}

/**
 * Delete blog
 */
const deleteBlog = async (blog: any) => {
  if (!confirm(`คุณต้องการลบบทความ "${blog.title}" ใช่หรือไม่?`)) {
    return
  }

  try {
    await $fetch(`/api/blogs/${blog.id}`, {
      method: 'DELETE'
    })

    // Remove from local data
    blogs.value = blogs.value.filter((b: any) => b.id !== blog.id)

    // Recalculate stats
    stats.value = {
      total: blogs.value.length,
      published: blogs.value.filter((b: any) => b.status === 'published').length,
      draft: blogs.value.filter((b: any) => b.status === 'draft').length,
      totalViews: blogs.value.reduce((sum: number, b: any) => sum + (b.viewCount || 0), 0)
    }

    alert('ลบบทความสำเร็จ')
  } catch (error) {
    console.error('Failed to delete blog:', error)
    alert('ไม่สามารถลบบทความได้')
  }
}

/**
 * Reset filters
 */
const resetFilters = () => {
  search.value = ''
  filterStatus.value = ''
}

/**
 * Format number
 */
const formatNumber = (num: number): string => {
  return num.toLocaleString('th-TH')
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
    month: 'short',
    day: 'numeric'
  }).format(d)
}

// Load data on mount
onMounted(async () => {
  await loadBlogs()
})

// SEO
useHead({
  title: 'จัดการบทความ | Backend - PetCanGo'
})
</script>
