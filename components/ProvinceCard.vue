<template>
  <NuxtLink
    :to="`/province/${province.slug}`"
    class="block group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all"
  >
    <!-- Background Image -->
    <div class="relative overflow-hidden aspect-[3/4]">
      <img
        :src="province.image || '/images/placeholder-province.jpg'"
        :alt="province.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        @error="handleImageError"
      />

      <!-- Overlay Gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

      <!-- Content -->
      <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
        <!-- Province Name -->
        <h3 class="text-2xl font-bold mb-2 transform transition-transform group-hover:translate-y-[-4px]">
          {{ province.name }}
        </h3>

        <!-- Hotel Count -->
        <div class="flex items-center text-sm mb-3">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          <span>{{ province.hotelCount || 0 }} ที่พัก</span>
        </div>

        <!-- Region Badge -->
        <div
          v-if="province.region"
          class="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium"
        >
          {{ getRegionName(province.region) }}
        </div>

        <!-- Attractions (if available) -->
        <div
          v-if="province.attractions && province.attractions.length > 0"
          class="mt-3 pt-3 border-t border-white/20"
        >
          <p class="text-xs text-white/80 line-clamp-2">
            {{ province.attractions.map(a => a.name).join(' • ') }}
          </p>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Attraction {
  name: string
  slug: string
  image?: string
}

interface Province {
  id: string
  name: string
  slug: string
  image?: string
  region?: string
  hotelCount?: number
  attractions?: Attraction[]
}

interface Props {
  province: Province
}

const props = defineProps<Props>()

const regionNames: Record<string, string> = {
  north: 'ภาคเหนือ',
  south: 'ภาคใต้',
  east: 'ภาคตะวันออก',
  west: 'ภาคตะวันตก',
  middle: 'ภาคกลาง',
  'east-north': 'ภาคตะวันออกเฉียงเหนือ'
}

const getRegionName = (region: string): string => {
  return regionNames[region] || region
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/common/nouser.jpg'
}
</script>
