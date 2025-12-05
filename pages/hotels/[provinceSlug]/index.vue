<template>
  <div v-if="province">
    <!-- Hero Section -->
    <section class="relative h-[400px] overflow-hidden">
      <img
        :src="province.image || '/images/placeholder-province.jpg'"
        :alt="province.name"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

      <div class="absolute bottom-0 left-0 right-0 container-custom pb-12">
        <div class="text-white">
          <!-- Breadcrumb -->
          <nav class="mb-4 text-sm">
            <NuxtLink to="/" class="hover:text-white/80">หน้าหลัก</NuxtLink>
            <span class="mx-2">/</span>
            <NuxtLink to="/hotels" class="hover:text-white/80">ที่พัก</NuxtLink>
            <span class="mx-2">/</span>
            <span>{{ province.name }}</span>
          </nav>

          <h1 class="text-4xl md:text-5xl font-bold mb-4">ที่พักสัตว์เลี้ยงใน{{ province.name }}</h1>

          <div class="flex flex-wrap items-center gap-4 text-white/90">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              {{ province.hotelCount || 0 }} ที่พัก
            </div>
            <div v-if="province.region" class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
              {{ getRegionName(province.region) }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="py-12">
      <div class="container-custom">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2">
            <!-- Description -->
            <div v-if="province.description" class="prose max-w-none mb-8" v-html="province.description"></div>

            <!-- Attractions -->
            <div v-if="province.attractions && province.attractions.length > 0" class="mb-12">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">สถานที่น่าสนใจ</h2>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div
                  v-for="attraction in province.attractions"
                  :key="attraction.slug"
                  class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                >
                  <img
                    v-if="attraction.image"
                    :src="attraction.image"
                    :alt="attraction.name"
                    class="w-full h-32 object-cover rounded-lg mb-3"
                    @error="handleAttractionImageError"
                  />
                  <h3 class="font-bold text-gray-900">{{ attraction.name }}</h3>
                </div>
              </div>
            </div>

            <!-- Hotels in this Province -->
            <div>
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-900">
                  ที่พักใน{{ province.name }}
                </h2>
                <p class="text-gray-600">{{ hotels.length }} ที่พัก</p>
              </div>

              <!-- Hotel Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <HotelCard
                  v-for="hotel in hotels"
                  :key="hotel.id"
                  :hotel="hotel"
                />
              </div>

              <!-- Empty State -->
              <div
                v-if="hotels.length === 0"
                class="text-center py-16 bg-gray-50 rounded-lg"
              >
                <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                <h3 class="text-xl font-bold text-gray-700 mb-2">ยังไม่มีที่พักในจังหวัดนี้</h3>
                <p class="text-gray-500 mb-4">เร็วๆ นี้ เราจะมีที่พักเพิ่มเติม</p>
                <NuxtLink to="/all-province" class="btn btn-outline">
                  ดูจังหวัดอื่น
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <!-- Search in Province -->
            <div class="bg-white rounded-lg shadow-md p-6 sticky top-24 mb-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">ค้นหาที่พักใน{{ province.name }}</h3>
              <form @submit.prevent="handleSearch" class="space-y-4">
                <input
                  v-model="searchKeyword"
                  type="text"
                  placeholder="ชื่อโรงแรม, สถานที่..."
                  class="input"
                />
                <button type="submit" class="w-full btn btn-primary">
                  ค้นหา
                </button>
              </form>
            </div>

            <!-- Nearby Provinces -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">จังหวัดใกล้เคียง</h3>
              <div class="space-y-3">
                <NuxtLink
                  v-for="nearby in nearbyProvinces"
                  :key="nearby.id"
                  :to="`/hotels/${nearby.slug}`"
                  class="block p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-gray-900">{{ nearby.name }}</span>
                    <span class="text-sm text-gray-500">{{ nearby.hotelCount }} ที่พัก</span>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
      <p class="text-gray-600">กำลังโหลด...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const provinceSlug = route.params.provinceSlug as string

// Composables
const { getProvinceBySlug } = useProvinces()
const { getHotelsByProvince } = useHotels()
const { setProvinceSEO } = useSEO()

// Data
const province = ref<any>(null)
const hotels = ref<any[]>([])
const nearbyProvinces = ref([
  { id: '9', name: 'ระยอง', slug: 'rayong', hotelCount: 24 },
  { id: '14', name: 'จันทบุรี', slug: 'chanthaburi', hotelCount: 16 },
  { id: '1', name: 'กรุงเทพมหานคร', slug: 'bangkok', hotelCount: 85 }
])

const searchKeyword = ref('')

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

const handleSearch = () => {
  navigateTo({
    path: '/search',
    query: {
      province: province.value?.name,
      keyword: searchKeyword.value
    }
  })
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/placeholder-province.jpg'
}

const handleAttractionImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/placeholder-attraction.jpg'
}

// Load data from Firestore
onMounted(async () => {
  // Get province data
  const provinceData: any = await getProvinceBySlug(provinceSlug)
  if (provinceData) {
    province.value = provinceData

    // Set SEO with structured data
    setProvinceSEO({
      name: provinceData.name,
      description: provinceData.description,
      image: provinceData.image,
      hotelCount: provinceData.hotelCount,
      region: provinceData.region,
      slug: provinceSlug
    })

    // Get hotels in this province
    const hotelsData = await getHotelsByProvince(provinceData.id)
    hotels.value = hotelsData
  }
})
</script>

<style scoped>
.prose {
  @apply text-gray-700 leading-relaxed;
}

.prose p {
  @apply mb-4;
}
</style>
