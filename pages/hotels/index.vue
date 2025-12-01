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

const hotels = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    hotels.value = await getNewHotels(50)
  } catch (err) {
    console.error('Error loading hotels:', err)
  } finally {
    loading.value = false
  }
})

useHead({
  title: 'ที่พักทั้งหมด - PetCanGo'
})
</script>
