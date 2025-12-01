<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">จัดการโรงแรม</h1>
      <p class="text-gray-400">จัดการข้อมูลโรงแรมและที่พักทั้งหมด</p>
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
            <UIcon name="i-heroicons-building-office-2" class="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">เผยแพร่แล้ว</p>
            <p class="text-3xl font-bold text-emerald-500">{{ stats.published }}</p>
          </div>
          <div class="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-emerald-500" />
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">แนะนำ</p>
            <p class="text-3xl font-bold text-yellow-500">{{ stats.featured }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-star-solid" class="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">แบบร่าง</p>
            <p class="text-3xl font-bold text-gray-400">{{ stats.draft }}</p>
          </div>
          <div class="w-12 h-12 bg-gray-600/10 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-pencil-square" class="w-6 h-6 text-gray-400" />
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
          placeholder="ค้นหา ชื่อโรงแรม, จังหวัด..."
        />

        <USelect
          v-model="filterStatus"
          :options="statusOptions"
          placeholder="สถานะทั้งหมด"
        />

        <USelect
          v-model="filterFeatured"
          :options="featuredOptions"
          placeholder="แนะนำทั้งหมด"
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

    <!-- Hotels Table -->
    <UCard>
      <div v-if="loading" class="p-12 text-center">
        <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 mx-auto mb-4 animate-spin text-emerald-500" />
        <p class="text-gray-400">กำลังโหลด...</p>
      </div>

      <div v-else-if="filteredHotels.length === 0" class="p-12 text-center text-gray-400">
        <UIcon name="i-heroicons-building-office-2" class="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <p class="text-lg font-medium">ไม่พบข้อมูลโรงแรม</p>
      </div>

      <UTable
        v-else
        :columns="columns"
        :rows="filteredHotels"
      >
        <template #name-data="{ row }">
          <div class="flex items-center gap-3">
            <img
              v-if="row.mainImage"
              :src="row.mainImage"
              :alt="row.name"
              class="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <div class="font-medium text-white">{{ row.name }}</div>
              <div class="text-sm text-gray-400">{{ formatDate(row.createdAt) }}</div>
            </div>
          </div>
        </template>

        <template #province-data="{ row }">
          <span class="text-gray-300">{{ typeof row.province === 'object' ? row.province.name : row.province }}</span>
        </template>

        <template #priceStart-data="{ row }">
          <span class="text-gray-300">฿{{ formatPrice(row.priceStart) }}</span>
        </template>

        <template #status-data="{ row }">
          <UBadge
            :color="row.status === 'published' ? 'success' : 'neutral'"
            variant="soft"
          >
            {{ row.status === 'published' ? 'เผยแพร่แล้ว' : 'แบบร่าง' }}
          </UBadge>
        </template>

        <template #isFeatured-data="{ row }">
          <UButton
            :color="row.isFeatured ? 'warning' : 'neutral'"
            variant="soft"
            size="xs"
            :icon="row.isFeatured ? 'i-heroicons-star-solid' : 'i-heroicons-star'"
            @click="toggleFeatured(row.id, row.isFeatured)"
          >
            {{ row.isFeatured ? 'แนะนำ' : 'ไม่แนะนำ' }}
          </UButton>
        </template>

        <template #actions-data="{ row }">
          <div class="flex items-center gap-2">
            <UButton
              color="primary"
              variant="ghost"
              size="xs"
              :to="`/hotel/${row.id}`"
              target="_blank"
            >
              ดู
            </UButton>
            <UButton
              color="error"
              variant="ghost"
              size="xs"
              @click="deleteHotel(row.id)"
            >
              ลบ
            </UButton>
          </div>
        </template>
      </UTable>
    </UCard>
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

const statusOptions = [
  { label: 'ทั้งหมด', value: '' },
  { label: 'เผยแพร่แล้ว', value: 'published' },
  { label: 'แบบร่าง', value: 'draft' }
]

const featuredOptions = [
  { label: 'ทั้งหมด', value: '' },
  { label: 'แนะนำ', value: 'true' },
  { label: 'ไม่แนะนำ', value: 'false' }
]

const columns = [
  {
    key: 'name',
    label: 'โรงแรม'
  },
  {
    key: 'province',
    label: 'จังหวัด'
  },
  {
    key: 'priceStart',
    label: 'ราคา'
  },
  {
    key: 'status',
    label: 'สถานะ'
  },
  {
    key: 'isFeatured',
    label: 'แนะนำ'
  },
  {
    key: 'actions',
    label: 'การกระทำ'
  }
]

const stats = computed(() => {
  return {
    total: hotels.value.length,
    published: hotels.value.filter(h => h.status === 'published').length,
    featured: hotels.value.filter(h => h.isFeatured === true).length,
    draft: hotels.value.filter(h => h.status === 'draft').length
  }
})

const filteredHotels = computed(() => {
  let result = hotels.value

  // Search filter
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    result = result.filter(h => {
      const provinceName = typeof h.province === 'object' ? h.province.name : h.province
      return h.name.toLowerCase().includes(searchLower) ||
        provinceName.toLowerCase().includes(searchLower)
    })
  }

  // Status filter
  if (filterStatus.value) {
    result = result.filter(h => h.status === filterStatus.value)
  }

  // Featured filter
  if (filterFeatured.value) {
    const isFeatured = filterFeatured.value === 'true'
    result = result.filter(h => h.isFeatured === isFeatured)
  }

  return result
})

/**
 * Load hotels
 */
const loadHotels = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/hotels')
    hotels.value = response.data || []
  } catch (error) {
    console.error('Failed to load hotels:', error)
    alert('ไม่สามารถโหลดข้อมูลโรงแรมได้')
  } finally {
    loading.value = false
  }
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
 * Reset filters
 */
const resetFilters = () => {
  search.value = ''
  filterStatus.value = ''
  filterFeatured.value = ''
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
