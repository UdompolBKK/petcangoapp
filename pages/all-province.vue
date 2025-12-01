<template>
  <div>
    <!-- Page Header -->
    <section class="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-16">
      <div class="container-custom">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            เลือกจังหวัดที่ต้องการเที่ยว
          </h1>
          <p class="text-lg md:text-xl text-white/90">
            ค้นพบที่พักสัตว์เลี้ยงทั่วประเทศไทย {{ totalProvinces }} จังหวัด
          </p>
        </div>
      </div>
    </section>

    <!-- Filter by Region -->
    <section class="py-8 bg-gray-50 border-b">
      <div class="container-custom">
        <div class="flex flex-wrap gap-3 justify-center">
          <button
            @click="filterRegion = null"
            :class="[
              'px-6 py-2 rounded-full font-medium transition-colors',
              filterRegion === null
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            ]"
          >
            ทั้งหมด
          </button>
          <button
            v-for="region in regions"
            :key="region.value"
            @click="filterRegion = region.value"
            :class="[
              'px-6 py-2 rounded-full font-medium transition-colors',
              filterRegion === region.value
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            ]"
          >
            {{ region.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- Provinces Grid -->
    <section class="py-16">
      <div class="container-custom">
        <!-- Stats -->
        <div class="mb-8 text-center">
          <p class="text-gray-600">
            แสดง <span class="font-bold text-primary-500">{{ filteredProvinces.length }}</span> จังหวัด
          </p>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProvinceCard
            v-for="province in filteredProvinces"
            :key="province.id"
            :province="province"
          />
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredProvinces.length === 0"
          class="text-center py-16"
        >
          <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3 class="text-xl font-bold text-gray-700 mb-2">ไม่พบจังหวัด</h3>
          <p class="text-gray-500">ลองเลือกภูมิภาคอื่นดูนะครับ</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Composables
const { getAllProvinces } = useProvinces()

// Data
const provinces = ref([])
const filterRegion = ref<string | null>(null)

const regions = [
  { value: 'middle', label: 'ภาคกลาง' },
  { value: 'north', label: 'ภาคเหนือ' },
  { value: 'east-north', label: 'ภาคตะวันออกเฉียงเหนือ' },
  { value: 'east', label: 'ภาคตะวันออก' },
  { value: 'south', label: 'ภาคใต้' },
  { value: 'west', label: 'ภาคตะวันตก' }
]

// Load data from Firestore
onMounted(async () => {
  const provincesData = await getAllProvinces()
  provinces.value = provincesData
})

// Computed
const filteredProvinces = computed(() => {
  if (!filterRegion.value) {
    return provinces.value
  }
  return provinces.value.filter(p => p.region === filterRegion.value)
})

const totalProvinces = computed(() => provinces.value.length)

// SEO
useHead({
  title: 'ที่พักสัตว์เลี้ยงทั่วประเทศไทย - PetCanGo',
  meta: [
    {
      name: 'description',
      content: 'ค้นหาที่พักที่รับสัตว์เลี้ยงทั่วประเทศไทย ครอบคลุมทุกจังหวัด ทั้งภาคเหนือ ภาคกลาง ภาคตะวันออก ภาคใต้ และภาคตะวันออกเฉียงเหนือ'
    }
  ]
})
</script>
