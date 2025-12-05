<template>
  <div ref="cardRef" class="hotel-card">
    <NuxtLink
      :to="`/hotels/${getProvinceSlug(hotel.province)}/${hotel.slug || hotel.id}`"
      class="block group bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
      :class="{ 'animate-fade-in': isVisible }"
    >
      <!-- Image with Skeleton -->
      <div class="relative overflow-hidden aspect-[4/3]">
        <!-- Skeleton Loader -->
        <div
          v-if="!imageLoaded"
          class="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"
        />
        <!-- Actual Image - Always render but use lazy loading -->
        <img
          :src="hotel.mainImage || hotel.image || '/images/placeholder-hotel.jpg'"
          :alt="hotel.name"
          loading="lazy"
          class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
          @load="imageLoaded = true"
          @error="handleImageError"
        />

        <!-- View Count Badge -->
        <div
          v-if="hotel.viewCount"
          class="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          {{ formatNumber(hotel.viewCount) }}
        </div>

        <!-- Price Badge -->
        <div
          v-if="hotel.priceStart"
          class="absolute top-3 right-3 bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
        >
          เริ่มต้น ฿{{ formatPrice(hotel.priceStart) }}
        </div>

        <!-- Province Badge -->
        <div
          v-if="getProvinceName(hotel.province)"
          class="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-800 shadow-md"
        >
          📍 {{ getProvinceName(hotel.province) }}
        </div>
      </div>

      <!-- Content -->
      <div class="p-4">
        <!-- Hotel Name -->
        <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
          {{ hotel.name }}
        </h3>

        <!-- Rating -->
        <div
          v-if="hotel.rating && hotel.reviewCount"
          class="flex items-center gap-1.5 mb-2"
        >
          <div class="flex items-center">
            <svg
              v-for="i in 5"
              :key="i"
              class="w-4 h-4"
              :class="i <= Math.round(hotel.rating) ? 'text-yellow-400' : 'text-gray-300'"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-700">{{ hotel.rating.toFixed(1) }}</span>
          <span class="text-xs text-gray-500">({{ hotel.reviewCount }} รีวิว)</span>
        </div>

        <!-- Short Description -->
        <p
          v-if="hotel.shortDescription"
          class="text-sm text-gray-600 mb-3 line-clamp-2"
        >
          {{ hotel.shortDescription }}
        </p>

        <!-- Facilities Icons (if available) -->
        <div
          v-if="getFacilityNames(hotel.facilities).length > 0"
          class="flex flex-wrap gap-2 mb-3"
        >
          <span
            v-for="(facility, index) in getFacilityNames(hotel.facilities).slice(0, 3)"
            :key="index"
            class="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
          >
            <svg class="w-3 h-3 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            {{ facility }}
          </span>
          <span
            v-if="getFacilityNames(hotel.facilities).length > 3"
            class="inline-flex items-center text-xs text-gray-500 px-2 py-1"
          >
            +{{ getFacilityNames(hotel.facilities).length - 3 }} อื่นๆ
          </span>
        </div>

        <!-- Footer: Location & Date -->
        <div class="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div class="flex items-center font-medium">
            <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            {{ getProvinceName(hotel.province) }}
          </div>
          <div v-if="hotel.createdAt" class="text-gray-400">
            {{ formatDate(hotel.createdAt) }}
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useLazyLoad } from '~/composables/useLazyLoad'

interface Province {
  id: string
  name: string
  slug?: string
}

interface Hotel {
  id: string
  slug?: string
  name: string
  mainImage?: string
  image?: string
  priceStart?: number
  province: Province | string
  shortDescription?: string
  facilities?: any[]
  createdAt?: string
  viewCount?: number
  rating?: number
  reviewCount?: number
}

interface Props {
  hotel: Hotel
}

const props = defineProps<Props>()

// Lazy load
const { isVisible, observe } = useLazyLoad()
const cardRef = ref<HTMLElement | null>(null)
const imageLoaded = ref(false)

onMounted(() => {
  if (cardRef.value) {
    observe(cardRef.value)
  }
})

const formatPrice = (price: number): string => {
  return price.toLocaleString('th-TH')
}

const formatNumber = (num: number): string => {
  return num.toLocaleString('th-TH')
}

const formatDate = (date: any): string => {
  if (!date) return ''

  let d: Date

  // Handle Firestore Timestamp
  if (date.toDate && typeof date.toDate === 'function') {
    d = date.toDate()
  } else if (date._seconds || date.seconds) {
    d = new Date((date._seconds || date.seconds) * 1000)
  } else if (typeof date === 'string') {
    d = new Date(date)
  } else if (date instanceof Date) {
    d = date
  } else {
    return ''
  }

  if (isNaN(d.getTime())) return ''

  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getProvinceName = (province: Province | string): string => {
  if (typeof province === 'string') {
    return province
  }
  return province?.name || ''
}

const getProvinceSlug = (province: Province | string): string => {
  if (typeof province === 'string') {
    return province.toLowerCase().replace(/\s+/g, '-')
  }
  return province?.slug || province?.id || ''
}

const getFacilityNames = (facilities: any[]): string[] => {
  if (!facilities || !Array.isArray(facilities)) return []
  return facilities.map(f => {
    if (typeof f === 'string') return f
    return f?.name || f?.label || ''
  }).filter(Boolean)
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/common/nouser.jpg'
}
</script>
