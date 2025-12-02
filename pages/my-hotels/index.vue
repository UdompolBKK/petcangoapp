<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <section class="bg-primary-500 text-white py-12">
      <div class="container-custom">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold mb-2">ที่พักของฉัน</h1>
            <p class="text-white/80">จัดการที่พักสัตว์เลี้ยงของคุณ</p>
          </div>
          <NuxtLink
            to="/my-hotels/create"
            class="inline-flex items-center justify-center gap-2 bg-white text-primary-600 hover:bg-primary-100 hover:text-primary-700 font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            เพิ่มที่พักใหม่
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Stats Overview -->
    <section class="py-8">
      <div class="container-custom">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900">{{ stats.total }}</div>
                <div class="text-sm text-gray-500">ที่พักทั้งหมด</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900">{{ stats.published }}</div>
                <div class="text-sm text-gray-500">เผยแพร่แล้ว</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900">{{ stats.pending }}</div>
                <div class="text-sm text-gray-500">รอตรวจสอบ</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900">{{ stats.totalViews }}</div>
                <div class="text-sm text-gray-500">ยอดเข้าชม</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Hotels List -->
    <section class="py-8">
      <div class="container-custom">
        <!-- Filter Tabs -->
        <div class="bg-white rounded-xl shadow-sm mb-6">
          <div class="flex border-b overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="activeTab = tab.value"
              :class="[
                'px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors',
                activeTab === tab.value
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              {{ tab.label }}
              <span
                v-if="tab.count > 0"
                :class="[
                  'ml-2 px-2 py-0.5 rounded-full text-xs',
                  activeTab === tab.value
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-gray-100 text-gray-500'
                ]"
              >
                {{ tab.count }}
              </span>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div class="flex gap-4">
              <div class="w-32 h-24 bg-gray-200 rounded-lg"></div>
              <div class="flex-1 space-y-3">
                <div class="h-5 bg-gray-200 rounded w-1/3"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hotel Cards -->
        <div v-else-if="filteredHotels.length > 0" class="space-y-4">
          <div
            v-for="hotel in filteredHotels"
            :key="hotel.id"
            class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div class="flex flex-col md:flex-row">
              <!-- Image -->
              <div class="md:w-48 h-48 md:h-auto flex-shrink-0">
                <img
                  v-if="hotel.images?.[0]"
                  :src="hotel.images[0]"
                  :alt="hotel.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 p-6">
                <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div class="flex-1">
                    <!-- Status Badge -->
                    <div class="flex items-center gap-2 mb-2">
                      <span :class="getStatusClass(hotel.status)">
                        {{ getStatusLabel(hotel.status) }}
                      </span>
                      <span v-if="hotel.isFeatured" class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                        แนะนำ
                      </span>
                    </div>

                    <!-- Hotel Name -->
                    <h3 class="text-xl font-bold text-gray-900 mb-1">{{ hotel.name }}</h3>

                    <!-- Location -->
                    <p class="text-gray-500 text-sm flex items-center gap-1 mb-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      {{ hotel.district }}, {{ hotel.province }}
                    </p>

                    <!-- Stats -->
                    <div class="flex items-center gap-4 text-sm text-gray-500">
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        {{ hotel.viewCount || 0 }} views
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        {{ formatDate(hotel.createdAt) }}
                      </span>
                    </div>

                    <!-- Rejection Reason -->
                    <div v-if="hotel.status === 'rejected' && hotel.rejectionReason" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p class="text-sm text-red-700">
                        <strong>เหตุผลที่ไม่ผ่านการอนุมัติ:</strong> {{ hotel.rejectionReason }}
                      </p>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex flex-row md:flex-col gap-2">
                    <NuxtLink
                      :to="`/my-hotels/${hotel.id}/edit`"
                      class="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                      แก้ไข
                    </NuxtLink>
                    <NuxtLink
                      v-if="hotel.status === 'published'"
                      :to="`/hotels/${hotel.slug}`"
                      target="_blank"
                      class="flex items-center justify-center gap-2 px-4 py-2 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg transition-colors text-sm font-medium"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                      ดูหน้าเว็บ
                    </NuxtLink>
                    <button
                      @click="confirmDelete(hotel)"
                      class="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm font-medium"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-xl p-12 shadow-sm text-center">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">ยังไม่มีที่พัก</h3>
          <p class="text-gray-500 mb-6">เริ่มต้นลงประกาศที่พักของคุณวันนี้</p>
          <NuxtLink
            to="/my-hotels/create"
            class="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            เพิ่มที่พักใหม่
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-6">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">ยืนยันการลบ</h3>
          <p class="text-gray-500 mb-6">คุณต้องการลบ "{{ hotelToDelete?.name }}" หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้</p>
          <div class="flex gap-3">
            <button
              @click="showDeleteModal = false"
              class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              @click="deleteHotel"
              :disabled="deleting"
              class="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              {{ deleting ? 'กำลังลบ...' : 'ลบที่พัก' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

useHead({
  title: 'ที่พักของฉัน - PetCanGo'
})

const { user } = useAuth()
const loading = ref(true)
const hotels = ref<any[]>([])
const activeTab = ref('all')
const showDeleteModal = ref(false)
const hotelToDelete = ref<any>(null)
const deleting = ref(false)

const stats = computed(() => ({
  total: hotels.value.length,
  published: hotels.value.filter(h => h.status === 'published').length,
  pending: hotels.value.filter(h => h.status === 'pending').length,
  totalViews: hotels.value.reduce((sum, h) => sum + (h.viewCount || 0), 0)
}))

const tabs = computed(() => [
  { value: 'all', label: 'ทั้งหมด', count: stats.value.total },
  { value: 'published', label: 'เผยแพร่แล้ว', count: stats.value.published },
  { value: 'pending', label: 'รอตรวจสอบ', count: stats.value.pending },
  { value: 'draft', label: 'ฉบับร่าง', count: hotels.value.filter(h => h.status === 'draft').length },
  { value: 'rejected', label: 'ไม่ผ่าน', count: hotels.value.filter(h => h.status === 'rejected').length }
])

const filteredHotels = computed(() => {
  if (activeTab.value === 'all') return hotels.value
  return hotels.value.filter(h => h.status === activeTab.value)
})

const loadMyHotels = async () => {
  if (!user.value) return

  try {
    loading.value = true
    const response = await $fetch('/api/my-hotels', {
      headers: {
        'Authorization': `Bearer ${await user.value.getIdToken()}`
      }
    }) as any
    hotels.value = response.data || []
  } catch (err) {
    console.error('Error loading hotels:', err)
  } finally {
    loading.value = false
  }
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    published: 'px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full',
    pending: 'px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full',
    draft: 'px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full',
    rejected: 'px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full'
  }
  return classes[status] || classes.draft
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    published: 'เผยแพร่แล้ว',
    pending: 'รอตรวจสอบ',
    draft: 'ฉบับร่าง',
    rejected: 'ไม่ผ่านการอนุมัติ'
  }
  return labels[status] || status
}

const formatDate = (date: any) => {
  if (!date) return ''
  let d: Date
  if (date._seconds) {
    d = new Date(date._seconds * 1000)
  } else if (date.toDate) {
    d = date.toDate()
  } else {
    d = new Date(date)
  }
  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const confirmDelete = (hotel: any) => {
  hotelToDelete.value = hotel
  showDeleteModal.value = true
}

const deleteHotel = async () => {
  if (!hotelToDelete.value || !user.value) return

  try {
    deleting.value = true
    await $fetch(`/api/my-hotels/${hotelToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${await user.value.getIdToken()}`
      }
    })

    hotels.value = hotels.value.filter(h => h.id !== hotelToDelete.value.id)
    showDeleteModal.value = false
    hotelToDelete.value = null
  } catch (err) {
    console.error('Error deleting hotel:', err)
    alert('ไม่สามารถลบที่พักได้ กรุณาลองใหม่อีกครั้ง')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadMyHotels()
})
</script>
