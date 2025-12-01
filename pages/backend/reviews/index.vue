<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">จัดการรีวิว</h1>
      <p class="text-gray-400">จัดการรีวิวและความคิดเห็นจากผู้ใช้งาน</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">ทั้งหมด</p>
            <p class="text-3xl font-bold text-white">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-chat-bubble-left-right" class="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">คะแนนเฉลี่ย</p>
            <p class="text-3xl font-bold text-yellow-500">{{ stats.averageRating.toFixed(1) }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-star-solid" class="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">มีรูปภาพ</p>
            <p class="text-3xl font-bold text-emerald-500">{{ stats.withImages }}</p>
          </div>
          <div class="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-photo" class="w-6 h-6 text-emerald-500" />
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">วันนี้</p>
            <p class="text-3xl font-bold text-purple-500">{{ stats.today }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-calendar" class="w-6 h-6 text-purple-500" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Filters -->
    <UCard class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass"
          placeholder="ค้นหา ชื่อโรงแรม, ผู้รีวิว..."
        />

        <USelect
          v-model="filterRating"
          :options="ratingOptions"
          placeholder="คะแนนทั้งหมด"
        />

        <USelect
          v-model="filterImages"
          :options="imageOptions"
          placeholder="รูปภาพทั้งหมด"
        />

        <UButton
          variant="outline"
          color="neutral"
          block
          @click="resetFilters"
        >
          รีเซ็ต
        </UButton>
      </div>
    </UCard>

    <!-- Reviews List -->
    <UCard>
      <div v-if="loading" class="p-12 text-center">
        <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 mx-auto mb-4 animate-spin text-emerald-500" />
        <p class="text-gray-400">กำลังโหลด...</p>
      </div>

      <div v-else-if="filteredReviews.length === 0" class="p-12 text-center text-gray-400">
        <UIcon name="i-heroicons-chat-bubble-left-right" class="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <p class="text-lg font-medium">ไม่พบรีวิว</p>
      </div>

      <div v-else class="divide-y divide-gray-800">
        <div
          v-for="review in filteredReviews"
          :key="review.id"
          class="p-6 hover:bg-gray-800/30 transition-colors"
        >
          <div class="flex items-start gap-4">
            <!-- User Avatar -->
            <img
              v-if="review.userPhoto"
              :src="review.userPhoto"
              :alt="review.userName"
              class="w-12 h-12 rounded-full flex-shrink-0"
            />
            <div
              v-else
              class="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg font-bold flex-shrink-0"
            >
              {{ (review.userName || 'U')[0].toUpperCase() }}
            </div>

            <!-- Review Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <h4 class="font-semibold text-white">{{ review.userName || 'ผู้ใช้งาน' }}</h4>
                  <p class="text-sm text-gray-400">{{ formatDate(review.createdAt) }}</p>
                </div>
                <div class="flex gap-1">
                  <UIcon
                    v-for="i in 5"
                    :key="i"
                    name="i-heroicons-star-solid"
                    :class="i <= review.rating ? 'text-yellow-500' : 'text-gray-600'"
                    class="w-4 h-4"
                  />
                </div>
              </div>

              <!-- Hotel Name -->
              <NuxtLink
                :to="`/hotel/${review.hotelId}`"
                target="_blank"
                class="text-sm text-blue-400 hover:text-blue-300 font-medium mb-2 inline-block"
              >
                {{ getHotelName(review.hotelId) }}
              </NuxtLink>

              <!-- Comment -->
              <p v-if="review.comment" class="text-gray-300 mb-3">
                {{ review.comment }}
              </p>

              <!-- Images -->
              <div v-if="review.images && review.images.length > 0" class="grid grid-cols-4 gap-2 mb-3">
                <img
                  v-for="(image, index) in review.images"
                  :key="index"
                  :src="image"
                  :alt="`Review image ${index + 1}`"
                  class="w-full h-20 object-cover rounded-lg"
                />
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2 pt-3 border-t border-gray-800">
                <UButton
                  color="error"
                  variant="ghost"
                  size="xs"
                  @click="deleteReview(review.id, review.hotelId)"
                >
                  ลบรีวิว
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UCard>
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
  { label: 'ทั้งหมด', value: '' },
  { label: '5 ดาว', value: '5' },
  { label: '4 ดาว', value: '4' },
  { label: '3 ดาว', value: '3' },
  { label: '2 ดาว', value: '2' },
  { label: '1 ดาว', value: '1' }
]

const imageOptions = [
  { label: 'ทั้งหมด', value: '' },
  { label: 'มีรูปภาพ', value: 'true' },
  { label: 'ไม่มีรูปภาพ', value: 'false' }
]

const stats = computed(() => {
  const total = reviews.value.length
  const averageRating = total > 0
    ? reviews.value.reduce((sum, r) => sum + r.rating, 0) / total
    : 0
  const withImages = reviews.value.filter(r => r.images && r.images.length > 0).length

  // Today's reviews
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

  // Search filter
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

  // Rating filter
  if (filterRating.value) {
    const rating = parseInt(filterRating.value)
    result = result.filter(r => r.rating === rating)
  }

  // Images filter
  if (filterImages.value) {
    const hasImages = filterImages.value === 'true'
    result = result.filter(r => {
      const reviewHasImages = r.images && r.images.length > 0
      return reviewHasImages === hasImages
    })
  }

  // Sort by newest first
  return result.sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)
    return dateB - dateA
  })
})

/**
 * Load reviews
 */
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

/**
 * Load hotels for hotel names
 */
const loadHotels = async () => {
  try {
    const response = await $fetch('/api/hotels')
    hotels.value = response.data || []
  } catch (error) {
    console.error('Failed to load hotels:', error)
  }
}

/**
 * Get hotel name by ID
 */
const getHotelName = (hotelId: string): string => {
  const hotel = hotels.value.find(h => h.id === hotelId)
  return hotel ? hotel.name : 'โรงแรม'
}

/**
 * Delete review
 */
const deleteReview = async (reviewId: string, hotelId: string) => {
  if (!confirm('คุณต้องการลบรีวิวนี้ใช่หรือไม่?')) {
    return
  }

  try {
    await $fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE'
    })

    // Remove from local data
    reviews.value = reviews.value.filter(r => r.id !== reviewId)
    alert('ลบรีวิวสำเร็จ')
  } catch (error) {
    console.error('Failed to delete review:', error)
    alert('ไม่สามารถลบรีวิวได้')
  }
}

/**
 * Reset filters
 */
const resetFilters = () => {
  search.value = ''
  filterRating.value = ''
  filterImages.value = ''
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
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

// Load data on mount
onMounted(async () => {
  await Promise.all([loadReviews(), loadHotels()])
})

// SEO
useHead({
  title: 'จัดการรีวิว | Backend - PetCanGo'
})
</script>
