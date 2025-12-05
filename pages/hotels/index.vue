<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container-custom py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">ที่พักทั้งหมด</h1>
        <p class="text-gray-600">รวมที่พักที่รับสัตว์เลี้ยงทั่วประเทศไทย</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="i in 12" :key="i" class="aspect-[4/3] rounded-xl bg-gray-200 animate-pulse" />
      </div>

      <!-- Hotels Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <HotelCard
          v-for="hotel in hotels"
          :key="hotel.id"
          :hotel="hotel"
        />
      </div>

      <!-- Empty State -->
      <div v-if="!loading && hotels.length === 0" class="text-center py-16">
        <p class="text-gray-500">ไม่พบที่พัก</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { getNewHotels } = useHotels()
const { setBasicMeta, setBreadcrumbSchema, setItemListSchema, siteUrl } = useSEO()

const hotels = ref<any[]>([])
const loading = ref(true)

// SEO
setBasicMeta({
  title: 'ที่พักสัตว์เลี้ยงทั้งหมด - โรงแรม รีสอร์ท วิลล่า ทั่วไทย',
  description: 'รวมที่พักที่รับสัตว์เลี้ยงทั่วประเทศไทย กว่า 550+ แห่ง โรงแรม รีสอร์ท วิลล่า พร้อมรีวิวจากผู้ใช้จริง ค้นหาง่าย จองสะดวก พาน้องเที่ยวได้ทุกที่',
  keywords: ['ที่พักสัตว์เลี้ยง', 'โรงแรมหมาเข้าได้', 'รีสอร์ทพาหมาเข้าได้', 'pet friendly hotel', 'ที่พักพาแมวเข้าได้', 'โรงแรมรับสัตว์เลี้ยง', 'ที่พักหมาแมว']
})

setBreadcrumbSchema([
  { name: 'หน้าหลัก', url: '/' },
  { name: 'ที่พักทั้งหมด', url: '/hotels' }
])

onMounted(async () => {
  try {
    hotels.value = await getNewHotels(50)

    // Set ItemList Schema for SEO
    if (hotels.value.length > 0) {
      setItemListSchema(
        hotels.value.slice(0, 10).map((hotel, index) => ({
          name: hotel.name,
          url: `/hotels/${hotel.province?.slug}/${hotel.slug}`,
          image: hotel.mainImage || hotel.image,
          position: index + 1
        }))
      )
    }
  } catch (err) {
    console.error('Error loading hotels:', err)
  } finally {
    loading.value = false
  }
})
</script>
