<template>
  <div>
    <!-- Hero Section with Search -->
    <HomeHero />

    <!-- Featured Provinces Section -->
    <section class="py-16 bg-gray-50">
      <div class="container-custom">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">จังหวัดยอดนิยม</h2>
            <p class="text-gray-600 mt-2">สำรวจที่พักสัตว์เลี้ยงทั่วประเทศไทย</p>
          </div>
          <NuxtLink
            to="/all-province"
            class="btn btn-outline hidden md:inline-flex items-center"
          >
            ดูทั้งหมด
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
        </div>

        <!-- Province Carousel -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProvinceCard
            v-for="province in featuredProvinces"
            :key="province.id"
            :province="province"
          />
        </div>

        <!-- View All Button (Mobile) -->
        <div class="mt-8 text-center md:hidden">
          <NuxtLink to="/all-province" class="btn btn-outline">
            ดูทั้งหมด
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- New Hotels Section -->
    <section class="py-16">
      <div class="container-custom">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">ที่พักใหม่</h2>
            <p class="text-gray-600 mt-2">ที่พักที่เพิ่งเข้าร่วมล่าสุด</p>
          </div>
          <NuxtLink
            to="/hotels"
            class="btn btn-outline hidden md:inline-flex items-center"
          >
            ดูทั้งหมด
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <HotelCard
            v-for="hotel in newHotels"
            :key="hotel.id"
            :hotel="hotel"
          />
        </div>

        <div class="mt-8 text-center md:hidden">
          <NuxtLink to="/hotels" class="btn btn-outline">
            ดูทั้งหมด
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Recommended Hotels Section -->
    <section class="py-16 bg-gray-50">
      <div class="container-custom">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">ที่พักแนะนำ</h2>
            <p class="text-gray-600 mt-2">ที่พักยอดนิยมที่ได้รับความสนใจมากที่สุด</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <HotelCard
            v-for="hotel in recommendedHotels"
            :key="hotel.id"
            :hotel="hotel"
          />
        </div>
      </div>
    </section>

    <!-- Blog Posts Section -->
    <section class="py-16">
      <div class="container-custom">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">บทความล่าสุด</h2>
            <p class="text-gray-600 mt-2">เคล็ดลับและความรู้เกี่ยวกับการเลี้ยงสัตว์</p>
          </div>
          <NuxtLink
            to="/blogs"
            class="btn btn-outline hidden md:inline-flex items-center"
          >
            ดูทั้งหมด
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogCard
            v-for="post in latestPosts"
            :key="post.id"
            :post="post"
          />
        </div>

        <div class="mt-8 text-center md:hidden">
          <NuxtLink to="/blogs" class="btn btn-outline">
            ดูทั้งหมด
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-red-500 to-pink-500 text-white">
      <div class="container-custom text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          เป็นเจ้าของที่พักหรือไม่?
        </h2>
        <p class="text-lg md:text-xl mb-8 text-white/90">
          ลงทะเบียนที่พักของคุณกับเราฟรี เข้าถึงผู้ใช้งานหลายพันคน
        </p>
        <NuxtLink
          to="/register"
          class="inline-block bg-white text-red-500 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition-colors duration-200"
        >
          ลงทะเบียนฟรีเลย
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// ใช้ Firestore composables
const { getFeaturedProvinces } = useProvinces()
const { getNewHotels, getFeaturedHotels } = useHotels()
const { getLatestBlogs } = useBlogs()

// Loading states
const loading = ref(true)
const error = ref(null)

// Data from Firestore
const featuredProvinces = ref([])
const newHotels = ref([])
const recommendedHotels = ref([])
const latestPosts = ref([])

// Fetch data on component mount
onMounted(async () => {
  try {
    loading.value = true

    // Fetch all data in parallel
    const [provinces, newHotelsData, featuredHotelsData, blogs] = await Promise.all([
      getFeaturedProvinces(4),
      getNewHotels(20),  // ที่พักใหม่ 20 อัน
      getFeaturedHotels(20),  // ที่พักแนะนำ (featured) 20 อัน
      getLatestBlogs(3)
    ])

    featuredProvinces.value = provinces
    newHotels.value = newHotelsData
    recommendedHotels.value = featuredHotelsData
    latestPosts.value = blogs

  } catch (err: any) {
    console.error('Error loading data:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
})

// SEO Meta Tags
useHead({
  title: 'PetCanGo - ค้นหาที่พักสัตว์เลี้ยง โรงแรมรับสุนัข แมว กว่า 550+ แห่ง',
  meta: [
    {
      name: 'description',
      content: 'แพลตฟอร์มค้นหาที่พักสัตว์เลี้ยงที่ใหญ่ที่สุดในประเทศไทย รวบรวมโรงแรมและรีสอร์ทที่รับสัตว์เลี้ยงกว่า 550+ แห่ง ครอบคลุม 31 จังหวัด'
    },
    {
      property: 'og:title',
      content: 'PetCanGo - ค้นหาที่พักสัตว์เลี้ยง'
    },
    {
      property: 'og:description',
      content: 'แพลตฟอร์มค้นหาที่พักสัตว์เลี้ยงที่ใหญ่ที่สุดในประเทศไทย'
    }
  ]
})
</script>
