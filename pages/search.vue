<template>
  <div>
    <!-- Search Header -->
    <section class="bg-primary-500 text-white py-12">
      <div class="container-custom">
        <h1 class="text-3xl md:text-4xl font-bold mb-6">ผลการค้นหา</h1>

        <!-- Search Form -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <form @submit.prevent="handleSearch" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Province -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                จังหวัด
              </label>
              <select v-model="searchParams.province" class="input">
                <option value="">ทุกจังหวัด</option>
                <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                <option value="ชลบุรี">ชลบุรี</option>
                <option value="ภูเก็ต">ภูเก็ต</option>
                <option value="เชียงใหม่">เชียงใหม่</option>
                <option value="กระบี่">กระบี่</option>
                <option value="ปทุมธานี">ปทุมธานี</option>
                <!-- Add more provinces -->
              </select>
            </div>

            <!-- Keyword -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ค้นหา
              </label>
              <input
                v-model="searchParams.keyword"
                type="text"
                placeholder="ชื่อโรงแรม, สถานที่..."
                class="input"
              />
            </div>

            <!-- Search Button -->
            <div class="flex items-end">
              <button
                type="submit"
                class="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                ค้นหา
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Results -->
    <section class="py-12">
      <div class="container-custom">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Filters Sidebar -->
          <aside class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 class="text-lg font-bold text-gray-900 mb-4">ตัวกรอง</h3>

              <!-- Price Range -->
              <div class="mb-6">
                <h4 class="font-medium text-gray-900 mb-3">ราคา (บาท/คืน)</h4>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      v-model="filters.priceRange"
                      type="radio"
                      value="all"
                      class="mr-2"
                    />
                    <span class="text-sm text-gray-700">ทั้งหมด</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="filters.priceRange"
                      type="radio"
                      value="0-500"
                      class="mr-2"
                    />
                    <span class="text-sm text-gray-700">0 - 500 บาท</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="filters.priceRange"
                      type="radio"
                      value="501-1000"
                      class="mr-2"
                    />
                    <span class="text-sm text-gray-700">501 - 1,000 บาท</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="filters.priceRange"
                      type="radio"
                      value="1001-2000"
                      class="mr-2"
                    />
                    <span class="text-sm text-gray-700">1,001 - 2,000 บาท</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="filters.priceRange"
                      type="radio"
                      value="2001+"
                      class="mr-2"
                    />
                    <span class="text-sm text-gray-700">2,001 บาทขึ้นไป</span>
                  </label>
                </div>
              </div>

              <!-- Facilities -->
              <div class="mb-6">
                <h4 class="font-medium text-gray-900 mb-3">สิ่งอำนวยความสะดวก</h4>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      v-model="filters.facilities"
                      type="checkbox"
                      value="wifi"
                      class="mr-2"
                    />
                    <span class="text-sm text-gray-700">Wifi</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="filters.facilities"
                      type="checkbox"
                      value="parking"
                      class="mr-2"
                    />
                    <span class="text-sm text-gray-700">ที่จอดรถ</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="filters.facilities"
                      type="checkbox"
                      value="pool"
                      class="mr-2"
                    />
                    <span class="text-sm text-gray-700">สระว่ายน้ำ</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="filters.facilities"
                      type="checkbox"
                      value="restaurant"
                      class="mr-2"
                    />
                    <span class="text-sm text-gray-700">ร้านอาหาร</span>
                  </label>
                </div>
              </div>

              <!-- Clear Filters -->
              <button
                @click="clearFilters"
                class="w-full text-sm text-primary-500 hover:text-primary-600 font-medium"
              >
                ล้างตัวกรอง
              </button>
            </div>
          </aside>

          <!-- Results Grid -->
          <div class="lg:col-span-3">
            <!-- Results Header -->
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">
                  <template v-if="searchParams.keyword || searchParams.province">
                    ผลการค้นหา
                    <span v-if="searchParams.keyword" class="text-primary-500">"{{ searchParams.keyword }}"</span>
                    <span v-if="searchParams.province">ใน{{ searchParams.province }}</span>
                  </template>
                  <template v-else>
                    ที่พักทั้งหมด
                  </template>
                </h2>
                <p class="text-gray-600 mt-1">
                  พบ <span class="font-bold text-primary-500">{{ filteredResults.length }}</span> ที่พัก
                </p>
              </div>

              <!-- Sort -->
              <select
                v-model="sortBy"
                class="input w-auto"
              >
                <option value="latest">ล่าสุด</option>
                <option value="price-low">ราคาต่ำ - สูง</option>
                <option value="price-high">ราคาสูง - ต่ำ</option>
                <option value="popular">ยอดนิยม</option>
              </select>
            </div>

            <!-- Results Grid -->
            <div v-if="filteredResults.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <HotelCard
                v-for="hotel in filteredResults"
                :key="hotel.id"
                :hotel="hotel"
              />
            </div>

            <!-- Empty State -->
            <div
              v-else
              class="text-center py-16 bg-gray-50 rounded-lg"
            >
              <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <h3 class="text-xl font-bold text-gray-700 mb-2">ไม่พบที่พักที่ตรงกับเงื่อนไข</h3>
              <p class="text-gray-500 mb-4">ลองค้นหาด้วยคำอื่น หรือเปลี่ยนตัวกรอง</p>
              <button
                @click="clearFilters"
                class="btn btn-outline"
              >
                ล้างตัวกรอง
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { setBasicMeta, setBreadcrumbSchema } = useSEO()

// Dynamic SEO based on search query
const searchTitle = computed(() => {
  const province = route.query.province as string
  const keyword = route.query.keyword as string
  if (province && keyword) {
    return `ค้นหา "${keyword}" ใน${province} - ที่พักสัตว์เลี้ยง`
  } else if (province) {
    return `ที่พักสัตว์เลี้ยงใน${province}`
  } else if (keyword) {
    return `ค้นหา "${keyword}" - ที่พักสัตว์เลี้ยง`
  }
  return 'ค้นหาที่พักสัตว์เลี้ยงทั่วประเทศไทย'
})

// SEO
setBasicMeta({
  title: searchTitle.value,
  description: 'ค้นหาที่พักที่รับสัตว์เลี้ยงทั่วประเทศไทย กรองตามจังหวัด ราคา และสิ่งอำนวยความสะดวก โรงแรม รีสอร์ท วิลล่า พร้อมรีวิวจากผู้ใช้จริง',
  image: 'https://petcango.com/common/og-image.jpg',
  keywords: ['ค้นหาที่พักสัตว์เลี้ยง', 'โรงแรมหมาเข้าได้', 'รีสอร์ทพาหมาเข้าได้', 'pet friendly hotel', 'ที่พักหมาแมว']
})

setBreadcrumbSchema([
  { name: 'หน้าหลัก', url: '/' },
  { name: 'ค้นหา', url: '/search' }
])

const searchParams = ref({
  province: (route.query.province as string) || '',
  keyword: (route.query.keyword as string) || ''
})

const filters = ref({
  priceRange: 'all',
  facilities: [] as string[]
})

const sortBy = ref('latest')

// Mock data - will be replaced with Firebase
const allHotels = ref([
  {
    id: '1',
    name: 'Paradise Pet Resort',
    image: '/images/hotels/hotel5.jpg',
    priceStart: 1800,
    province: 'ชลบุรี',
    shortDescription: 'รีสอร์ทสำหรับสัตว์เลี้ยง พร้อมสนามเล่นขนาดใหญ่',
    facilities: ['wifi', 'parking', 'pool'],
    createdAt: '2024-11-20',
    viewCount: 245
  },
  {
    id: '2',
    name: 'Green Valley Hotel',
    image: '/images/hotels/hotel6.jpg',
    priceStart: 2200,
    province: 'นครราชสีมา',
    shortDescription: 'โรงแรมกลางธรรมชาติ เหมาะกับการพักผ่อน',
    facilities: ['wifi', 'parking', 'restaurant'],
    createdAt: '2024-11-19',
    viewCount: 189
  },
  {
    id: '3',
    name: 'โรงแรมฟอร์เลิฟรีสอร์ท',
    image: '/images/hotels/hotel1.jpg',
    priceStart: 240,
    province: 'ปทุมธานี',
    shortDescription: 'โรงแรมฟอร์เลิฟรีสอร์ท ตั้งอยู่ในอำเภอ ธัญญบุรีรังสิตคลอง 8',
    facilities: ['wifi', 'parking', 'pool', 'restaurant'],
    createdAt: '2024-11-25',
    viewCount: 532
  },
  {
    id: '4',
    name: 'Mountain View Resort',
    image: '/images/hotels/hotel7.jpg',
    priceStart: 2800,
    province: 'เชียงราย',
    shortDescription: 'รีสอร์ทวิวภูเขา บรรยากาศสงบ',
    facilities: ['wifi', 'parking', 'pool'],
    createdAt: '2024-11-18',
    viewCount: 312
  }
])

const filteredResults = computed(() => {
  let results = [...allHotels.value]

  // Province filter
  if (searchParams.value.province) {
    results = results.filter(hotel =>
      hotel.province.includes(searchParams.value.province)
    )
  }

  // Keyword filter
  if (searchParams.value.keyword) {
    const keyword = searchParams.value.keyword.toLowerCase()
    results = results.filter(hotel =>
      hotel.name.toLowerCase().includes(keyword) ||
      hotel.province.toLowerCase().includes(keyword) ||
      hotel.shortDescription.toLowerCase().includes(keyword)
    )
  }

  // Price range filter
  if (filters.value.priceRange !== 'all') {
    const [min, max] = filters.value.priceRange.split('-').map(n => parseInt(n) || Infinity)
    results = results.filter(hotel => {
      if (max === Infinity) {
        return hotel.priceStart >= min
      }
      return hotel.priceStart >= min && hotel.priceStart <= max
    })
  }

  // Facilities filter
  if (filters.value.facilities.length > 0) {
    results = results.filter(hotel =>
      filters.value.facilities.every(facility =>
        hotel.facilities.includes(facility)
      )
    )
  }

  // Sort
  if (sortBy.value === 'price-low') {
    results.sort((a, b) => a.priceStart - b.priceStart)
  } else if (sortBy.value === 'price-high') {
    results.sort((a, b) => b.priceStart - a.priceStart)
  } else if (sortBy.value === 'popular') {
    results.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
  } else if (sortBy.value === 'latest') {
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  return results
})

const handleSearch = () => {
  // Update URL query params
  navigateTo({
    path: '/search',
    query: {
      province: searchParams.value.province || undefined,
      keyword: searchParams.value.keyword || undefined
    }
  })
}

const clearFilters = () => {
  filters.value.priceRange = 'all'
  filters.value.facilities = []
}

// Watch route query changes
watch(
  () => route.query,
  (newQuery) => {
    searchParams.value.province = (newQuery.province as string) || ''
    searchParams.value.keyword = (newQuery.keyword as string) || ''
  }
)
</script>
