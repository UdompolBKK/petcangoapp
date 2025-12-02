<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">จัดการโรงแรม</h1>
      <p class="text-gray-400">จัดการข้อมูลโรงแรมและที่พักทั้งหมด</p>
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
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
            <p class="text-gray-400 text-sm mb-1">แนะนำ</p>
            <p class="text-3xl font-bold text-yellow-500">{{ stats.featured }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">แบบร่าง</p>
            <p class="text-3xl font-bold text-gray-400">{{ stats.draft }}</p>
          </div>
          <div class="w-12 h-12 bg-gray-600/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-gray-800 rounded-xl p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="search"
            type="text"
            placeholder="ค้นหา ชื่อโรงแรม, จังหวัด..."
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

        <select
          v-model="filterFeatured"
          class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        >
          <option v-for="option in featuredOptions" :key="option.value" :value="option.value">
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

    <!-- Hotels Table -->
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
      <div v-else-if="hotels.length === 0" class="p-12 text-center text-gray-400">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
        <p class="text-lg font-medium">ไม่พบข้อมูลโรงแรม</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-900/50">
            <tr>
              <th class="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">โรงแรม</th>
              <th class="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">จังหวัด</th>
              <th class="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">ราคา</th>
              <th class="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">สถานะ</th>
              <th class="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">แนะนำ</th>
              <th class="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">การกระทำ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="hotel in hotels" :key="hotel.id" class="hover:bg-gray-700/50 transition-colors">
              <!-- Hotel Name -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-4">
                  <img
                    v-if="hotel.mainImage"
                    :src="hotel.mainImage"
                    :alt="hotel.name"
                    class="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-gray-700"
                  />
                  <div
                    v-else
                    class="w-14 h-14 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0"
                  >
                    <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <div class="font-medium text-white truncate max-w-[250px]">{{ hotel.name }}</div>
                    <div class="text-sm text-gray-500">{{ formatDate(hotel.createdAt) }}</div>
                  </div>
                </div>
              </td>

              <!-- Province -->
              <td class="py-4 px-6">
                <span class="text-gray-300">{{ getProvinceName(hotel.province) }}</span>
              </td>

              <!-- Price -->
              <td class="py-4 px-6">
                <span class="text-white font-medium">฿{{ formatPrice(hotel.priceStart || 0) }}</span>
              </td>

              <!-- Status -->
              <td class="py-4 px-6">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                    hotel.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' :
                    hotel.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                    hotel.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                    'bg-gray-600/50 text-gray-400'
                  ]"
                >
                  {{ getStatusLabel(hotel.status) }}
                </span>
              </td>

              <!-- Featured -->
              <td class="py-4 px-6">
                <button
                  @click="toggleFeatured(hotel.id, hotel.isFeatured)"
                  :class="[
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    hotel.isFeatured
                      ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                      : 'bg-gray-600/50 text-gray-400 hover:bg-gray-600'
                  ]"
                >
                  <svg class="w-4 h-4" :fill="hotel.isFeatured ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                  </svg>
                  {{ hotel.isFeatured ? 'แนะนำ' : 'ไม่แนะนำ' }}
                </button>
              </td>

              <!-- Actions -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-2 flex-wrap">
                  <!-- Approve/Reject buttons for pending hotels -->
                  <template v-if="hotel.status === 'pending'">
                    <button
                      @click="approveHotel(hotel)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      อนุมัติ
                    </button>
                    <button
                      @click="openRejectModal(hotel)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                      ปฏิเสธ
                    </button>
                  </template>
                  <NuxtLink
                    :to="`/hotels/${hotel.province?.slug || 'unknown'}/${hotel.slug}`"
                    target="_blank"
                    class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    ดู
                  </NuxtLink>
                  <button
                    @click="deleteHotel(hotel.id)"
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

      <!-- Pagination -->
      <div v-if="hotels.length > 0" class="px-6 py-4 border-t border-gray-700">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm text-gray-400">
            แสดง {{ startItem }}-{{ endItem }} จากทั้งหมด {{ pagination.total }} รายการ
          </p>

          <!-- Pagination Controls -->
          <div class="flex items-center gap-2">
            <!-- First Page -->
            <button
              @click="goToPage(1)"
              :disabled="currentPage === 1"
              class="p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :class="currentPage === 1 ? 'text-gray-600' : 'text-gray-400 hover:text-white hover:bg-gray-700'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
              </svg>
            </button>

            <!-- Previous Page -->
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="!pagination.hasPrev"
              class="p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :class="!pagination.hasPrev ? 'text-gray-600' : 'text-gray-400 hover:text-white hover:bg-gray-700'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>

            <!-- Page Numbers -->
            <div class="flex items-center gap-1">
              <template v-for="page in visiblePages" :key="page">
                <span v-if="page === '...'" class="px-2 text-gray-500">...</span>
                <button
                  v-else
                  @click="goToPage(page as number)"
                  class="min-w-[40px] h-10 rounded-lg text-sm font-medium transition-colors"
                  :class="currentPage === page
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'"
                >
                  {{ page }}
                </button>
              </template>
            </div>

            <!-- Next Page -->
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="!pagination.hasNext"
              class="p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :class="!pagination.hasNext ? 'text-gray-600' : 'text-gray-400 hover:text-white hover:bg-gray-700'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            <!-- Last Page -->
            <button
              @click="goToPage(pagination.totalPages)"
              :disabled="currentPage === pagination.totalPages"
              class="p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :class="currentPage === pagination.totalPages ? 'text-gray-600' : 'text-gray-400 hover:text-white hover:bg-gray-700'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <!-- Page Size Selector -->
          <select
            v-model="pageSize"
            @change="changePageSize"
            class="bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option :value="10">10 ต่อหน้า</option>
            <option :value="20">20 ต่อหน้า</option>
            <option :value="50">50 ต่อหน้า</option>
            <option :value="100">100 ต่อหน้า</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 rounded-2xl max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-white mb-4">ปฏิเสธที่พัก</h3>
        <p class="text-gray-400 mb-4">กรุณาระบุเหตุผลในการปฏิเสธ "{{ rejectingHotel?.name }}"</p>
        <textarea
          v-model="rejectReason"
          rows="4"
          placeholder="เช่น ข้อมูลไม่ครบถ้วน, รูปภาพไม่ชัดเจน, ฯลฯ"
          class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 mb-4"
        ></textarea>
        <div class="flex gap-3">
          <button
            @click="showRejectModal = false"
            class="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
          >
            ยกเลิก
          </button>
          <button
            @click="rejectHotel"
            :disabled="!rejectReason.trim()"
            class="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            ยืนยันปฏิเสธ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'backend'
})

const hotels = ref<any[]>([])
const loading = ref(true)
const search = ref('')
const filterStatus = ref('')
const filterFeatured = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false
})
const stats = ref({
  total: 0,
  published: 0,
  featured: 0,
  draft: 0,
  pending: 0
})

// Reject modal state
const showRejectModal = ref(false)
const rejectingHotel = ref<any>(null)
const rejectReason = ref('')

// Debounce search
let searchTimeout: NodeJS.Timeout | null = null
const debouncedSearch = ref('')

watch(search, (newVal) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = newVal
    currentPage.value = 1
    loadHotels()
  }, 300)
})

watch([filterStatus, filterFeatured], () => {
  currentPage.value = 1
  loadHotels()
})

const statusOptions = [
  { label: 'สถานะทั้งหมด', value: '' },
  { label: 'เผยแพร่แล้ว', value: 'published' },
  { label: 'รอตรวจสอบ', value: 'pending' },
  { label: 'แบบร่าง', value: 'draft' },
  { label: 'ไม่ผ่าน', value: 'rejected' }
]

const featuredOptions = [
  { label: 'แนะนำทั้งหมด', value: '' },
  { label: 'แนะนำ', value: 'true' },
  { label: 'ไม่แนะนำ', value: 'false' }
]

// Calculate visible page numbers
const visiblePages = computed(() => {
  const total = pagination.value.totalPages
  const current = currentPage.value
  const pages: (number | string)[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) pages.push(i)

    if (current < total - 2) pages.push('...')
    pages.push(total)
  }

  return pages
})

// Calculate start/end item numbers
const startItem = computed(() => {
  return (currentPage.value - 1) * pageSize.value + 1
})

const endItem = computed(() => {
  return Math.min(currentPage.value * pageSize.value, pagination.value.total)
})

/**
 * Get province name helper
 */
const getProvinceName = (province: any): string => {
  if (!province) return '-'
  if (typeof province === 'object') return province.name || '-'
  return province
}

/**
 * Load hotels with pagination
 */
const loadHotels = async () => {
  try {
    loading.value = true

    const params: Record<string, any> = {
      page: currentPage.value,
      limit: pageSize.value
    }

    if (debouncedSearch.value) {
      params.search = debouncedSearch.value
    }
    if (filterStatus.value) {
      params.status = filterStatus.value
    }
    if (filterFeatured.value) {
      params.featured = filterFeatured.value
    }

    const response = await $fetch('/api/hotels', { params }) as any

    hotels.value = response.data || []
    if (response.pagination) {
      pagination.value = response.pagination
    }
    if (response.stats) {
      stats.value = response.stats
    }
  } catch (error) {
    console.error('Failed to load hotels:', error)
    alert('ไม่สามารถโหลดข้อมูลโรงแรมได้')
  } finally {
    loading.value = false
  }
}

/**
 * Go to specific page
 */
const goToPage = (page: number) => {
  if (page < 1 || page > pagination.value.totalPages) return
  currentPage.value = page
  loadHotels()
}

/**
 * Change page size
 */
const changePageSize = () => {
  currentPage.value = 1
  loadHotels()
}

/**
 * Toggle featured status
 */
const toggleFeatured = async (hotelId: string, currentStatus: boolean) => {
  try {
    await $fetch(`/api/hotels/${hotelId}/set-featured`, {
      method: 'POST',
      body: {
        isFeatured: !currentStatus
      }
    })

    // Update local data
    const hotel = hotels.value.find(h => h.id === hotelId)
    if (hotel) {
      hotel.isFeatured = !currentStatus
    }
  } catch (error) {
    console.error('Failed to toggle featured:', error)
    alert('ไม่สามารถเปลี่ยนสถานะแนะนำได้')
  }
}

/**
 * Delete hotel
 */
const deleteHotel = async (hotelId: string) => {
  if (!confirm('คุณต้องการลบโรงแรมนี้ใช่หรือไม่?')) {
    return
  }

  try {
    await $fetch(`/api/hotels/${hotelId}`, {
      method: 'DELETE'
    })

    // Remove from local data
    hotels.value = hotels.value.filter(h => h.id !== hotelId)
    alert('ลบโรงแรมสำเร็จ')
  } catch (error) {
    console.error('Failed to delete hotel:', error)
    alert('ไม่สามารถลบโรงแรมได้')
  }
}

/**
 * Get status label
 */
const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    published: 'เผยแพร่แล้ว',
    pending: 'รอตรวจสอบ',
    draft: 'แบบร่าง',
    rejected: 'ไม่ผ่าน'
  }
  return labels[status] || status
}

/**
 * Approve hotel
 */
const approveHotel = async (hotel: any) => {
  if (!confirm(`คุณต้องการอนุมัติ "${hotel.name}" ใช่หรือไม่?`)) {
    return
  }

  try {
    await $fetch(`/api/hotels/${hotel.id}/approve`, {
      method: 'POST'
    })

    // Update local data
    hotel.status = 'published'
    alert('อนุมัติที่พักเรียบร้อย')
  } catch (error) {
    console.error('Failed to approve hotel:', error)
    alert('ไม่สามารถอนุมัติที่พักได้')
  }
}

/**
 * Open reject modal
 */
const openRejectModal = (hotel: any) => {
  rejectingHotel.value = hotel
  rejectReason.value = ''
  showRejectModal.value = true
}

/**
 * Reject hotel
 */
const rejectHotel = async () => {
  if (!rejectingHotel.value || !rejectReason.value.trim()) return

  try {
    await $fetch(`/api/hotels/${rejectingHotel.value.id}/reject`, {
      method: 'POST',
      body: {
        reason: rejectReason.value
      }
    })

    // Update local data
    rejectingHotel.value.status = 'rejected'
    rejectingHotel.value.rejectionReason = rejectReason.value

    showRejectModal.value = false
    rejectingHotel.value = null
    rejectReason.value = ''

    alert('ปฏิเสธที่พักเรียบร้อย')
  } catch (error) {
    console.error('Failed to reject hotel:', error)
    alert('ไม่สามารถปฏิเสธที่พักได้')
  }
}

/**
 * Reset filters
 */
const resetFilters = () => {
  search.value = ''
  debouncedSearch.value = ''
  filterStatus.value = ''
  filterFeatured.value = ''
  currentPage.value = 1
  loadHotels()
}

/**
 * Format price
 */
const formatPrice = (price: number): string => {
  return price.toLocaleString('th-TH')
}

/**
 * Format date
 */
const formatDate = (date: any): string => {
  if (!date) return ''

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
  await loadHotels()
})

// SEO
useHead({
  title: 'จัดการโรงแรม | Backend - PetCanGo'
})
</script>
