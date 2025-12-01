<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">จัดการรีวิว</h1>
      <p class="text-gray-500">จัดการรีวิวและความคิดเห็นจากผู้ใช้งาน</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-[#111111] border border-gray-800/50 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm mb-1">ทั้งหมด</p>
            <p class="text-3xl font-bold text-white">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-[#111111] border border-gray-800/50 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm mb-1">คะแนนเฉลี่ย</p>
            <p class="text-3xl font-bold text-yellow-400">{{ stats.averageRating.toFixed(1) }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-[#111111] border border-gray-800/50 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm mb-1">มีรูปภาพ</p>
            <p class="text-3xl font-bold text-emerald-400">{{ stats.withImages }}</p>
          </div>
          <div class="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-[#111111] border border-gray-800/50 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm mb-1">วันนี้</p>
            <p class="text-3xl font-bold text-purple-400">{{ stats.today }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-[#111111] border border-gray-800/50 rounded-xl p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="search"
            type="text"
            placeholder="ค้นหา ชื่อโรงแรม, ผู้รีวิว..."
            class="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
        </div>

        <select
          v-model="filterRating"
          class="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
        >
          <option v-for="option in ratingOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>

        <select
          v-model="filterImages"
          class="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
        >
          <option v-for="option in imageOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>

        <button
          @click="resetFilters"
          class="w-full bg-[#0a0a0a] hover:bg-[#1a1a1a] border border-gray-800 rounded-xl py-2.5 px-4 text-white font-medium transition-all"
        >
          รีเซ็ต
        </button>
      </div>
    </div>

    <!-- Reviews List -->
    <div class="bg-[#111111] border border-gray-800/50 rounded-xl overflow-hidden">
      <!-- Loading -->
      <div v-if="loading" class="p-12 text-center">
        <svg class="w-12 h-12 mx-auto mb-4 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
        <p class="text-gray-500">กำลังโหลด...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredReviews.length === 0" class="p-12 text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
        <p class="text-lg font-medium text-gray-400">ไม่พบรีวิว</p>
      </div>

      <!-- Reviews -->
      <div v-else class="divide-y divide-gray-800/50">
        <div
          v-for="review in filteredReviews"
          :key="review.id"
          class="p-6 hover:bg-[#1a1a1a]/50 transition-colors"
        >
          <div class="flex items-start gap-4">
            <!-- User Avatar -->
            <img
              v-if="review.userPhoto"
              :src="review.userPhoto"
              :alt="review.userName"
              class="w-12 h-12 rounded-full flex-shrink-0 object-cover"
            />
            <div
              v-else
              class="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-lg font-bold flex-shrink-0"
            >
              {{ (review.userName || 'U')[0].toUpperCase() }}
            </div>

            <!-- Review Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <h4 class="font-semibold text-white">{{ review.userName || 'ผู้ใช้งาน' }}</h4>
                  <p class="text-sm text-gray-500">{{ formatDate(review.createdAt) }}</p>
                </div>
                <!-- Star Rating -->
                <div class="flex gap-0.5">
                  <svg
                    v-for="i in 5"
                    :key="i"
                    class="w-4 h-4"
                    :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-700'"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>

              <!-- Hotel Name -->
              <NuxtLink
                :to="`/hotel/${review.hotelId}`"
                target="_blank"
                class="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 font-medium mb-2 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                {{ getHotelName(review.hotelId) }}
              </NuxtLink>

              <!-- Comment -->
              <p v-if="review.comment" class="text-gray-300 mb-3 leading-relaxed">
                {{ review.comment }}
              </p>

              <!-- Images -->
              <div v-if="review.images && review.images.length > 0" class="flex flex-wrap gap-2 mb-4">
                <img
                  v-for="(image, index) in review.images"
                  :key="index"
                  :src="image"
                  :alt="`Review image ${index + 1}`"
                  class="w-20 h-20 object-cover rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
                />
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-3 pt-3 border-t border-gray-800/50">
                <button
                  @click="deleteReview(review.id, review.hotelId)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  ลบรีวิว
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="filteredReviews.length > 0" class="px-6 py-4 border-t border-gray-800/50">
        <p class="text-sm text-gray-500">
          แสดง {{ filteredReviews.length }} รีวิว จากทั้งหมด {{ reviews.length }} รีวิว
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'backend'
})

const reviews = ref<any[]>([])
const hotels = ref<any[]>([])
const loading = ref(true)
const search = ref('')
const filterRating = ref('')
const filterImages = ref('')

const ratingOptions = [
  { label: 'คะแนนทั้งหมด', value: '' },
  { label: '5 ดาว', value: '5' },
  { label: '4 ดาว', value: '4' },
  { label: '3 ดาว', value: '3' },
  { label: '2 ดาว', value: '2' },
  { label: '1 ดาว', value: '1' }
]

const imageOptions = [
  { label: 'รูปภาพทั้งหมด', value: '' },
  { label: 'มีรูปภาพ', value: 'true' },
  { label: 'ไม่มีรูปภาพ', value: 'false' }
]

const stats = computed(() => {
  const total = reviews.value.length
  const averageRating = total > 0
    ? reviews.value.reduce((sum, r) => sum + r.rating, 0) / total
    : 0
  const withImages = reviews.value.filter(r => r.images && r.images.length > 0).length

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayReviews = reviews.value.filter(r => {
    const reviewDate = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt)
    reviewDate.setHours(0, 0, 0, 0)
    return reviewDate.getTime() === today.getTime()
  })

  return {
    total,
    averageRating,
    withImages,
    today: todayReviews.length
  }
})

const filteredReviews = computed(() => {
  let result = reviews.value

  if (search.value) {
    const searchLower = search.value.toLowerCase()
    result = result.filter(r => {
      const hotelName = getHotelName(r.hotelId).toLowerCase()
      const userName = (r.userName || '').toLowerCase()
      const comment = (r.comment || '').toLowerCase()
      return hotelName.includes(searchLower) ||
             userName.includes(searchLower) ||
             comment.includes(searchLower)
    })
  }

  if (filterRating.value) {
    const rating = parseInt(filterRating.value)
    result = result.filter(r => r.rating === rating)
  }

  if (filterImages.value) {
    const hasImages = filterImages.value === 'true'
    result = result.filter(r => {
      const reviewHasImages = r.images && r.images.length > 0
      return reviewHasImages === hasImages
    })
  }

  return result.sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)
    return dateB - dateA
  })
})

const loadReviews = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/reviews', {
      query: { limit: 1000 }
    })
    reviews.value = response.data || []
  } catch (error) {
    console.error('Failed to load reviews:', error)
    alert('ไม่สามารถโหลดรีวิวได้')
  } finally {
    loading.value = false
  }
}

const loadHotels = async () => {
  try {
    const response = await $fetch('/api/hotels')
    hotels.value = response.data || []
  } catch (error) {
    console.error('Failed to load hotels:', error)
  }
}

const getHotelName = (hotelId: string): string => {
  const hotel = hotels.value.find(h => h.id === hotelId)
  return hotel ? hotel.name : 'โรงแรม'
}

const deleteReview = async (reviewId: string, hotelId: string) => {
  if (!confirm('คุณต้องการลบรีวิวนี้ใช่หรือไม่?')) {
    return
  }

  try {
    await $fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE'
    })
    reviews.value = reviews.value.filter(r => r.id !== reviewId)
    alert('ลบรีวิวสำเร็จ')
  } catch (error) {
    console.error('Failed to delete review:', error)
    alert('ไม่สามารถลบรีวิวได้')
  }
}

const resetFilters = () => {
  search.value = ''
  filterRating.value = ''
  filterImages.value = ''
}

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
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

onMounted(async () => {
  await Promise.all([loadReviews(), loadHotels()])
})

useHead({
  title: 'จัดการรีวิว | Backend - PetCanGo'
})
</script>
