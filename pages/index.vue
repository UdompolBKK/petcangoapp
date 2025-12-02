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

        <!-- Loading State -->
        <div v-if="loading && featuredProvinces.length === 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="aspect-[3/4] rounded-xl bg-gray-200 animate-pulse" />
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

        <!-- Hotel Slider -->
        <HotelSlider
          v-if="newHotels.length > 0"
          :hotels="newHotels"
          :show-arrows="true"
          :show-dots="true"
        />

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

    <!-- List Your Property Section -->
    <section class="py-20 bg-primary-500 text-white relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>

      <div class="container-custom relative z-10">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- Left Content -->
          <div class="text-center md:text-left">
            <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clip-rule="evenodd"/>
              </svg>
              ลงประกาศฟรี 100%
            </div>

            <h2 class="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              เปิดรับจองที่พักสัตว์เลี้ยง<br class="hidden md:block" />
              <span class="text-yellow-300">เริ่มต้นวันนี้!</span>
            </h2>

            <p class="text-lg md:text-xl mb-8 text-white/90 max-w-lg">
              ลงทะเบียนที่พักของคุณกับ PetCanGo ฟรี! เข้าถึงเจ้าของสัตว์เลี้ยงหลายพันคนทั่วประเทศ
            </p>

            <!-- Benefits -->
            <div class="grid grid-cols-2 gap-4 mb-8">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span class="text-sm md:text-base">ลงประกาศง่าย</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span class="text-sm md:text-base">ไม่มีค่าใช้จ่าย</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span class="text-sm md:text-base">จัดการได้เอง</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span class="text-sm md:text-base">แจ้งเตือนทันที</span>
              </div>
            </div>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4">
              <NuxtLink
                v-if="isAuthenticated"
                to="/my-hotels/create"
                class="inline-flex items-center justify-center gap-2 bg-white text-primary-600 hover:bg-primary-600 hover:text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                ลงประกาศที่พักเลย
              </NuxtLink>
              <NuxtLink
                v-else
                to="/login?redirect=/my-hotels/create"
                class="inline-flex items-center justify-center gap-2 bg-white text-primary-600 hover:bg-primary-600 hover:text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                ลงประกาศที่พักเลย
              </NuxtLink>
              <NuxtLink
                v-if="isAuthenticated"
                to="/my-hotels"
                class="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 border-2 border-white/30"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                จัดการที่พักของฉัน
              </NuxtLink>
            </div>
          </div>

          <!-- Right Content - Stats & Image -->
          <div class="hidden md:block">
            <div class="relative">
              <!-- Stats Cards -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-transform">
                  <div class="text-4xl font-bold text-yellow-300 mb-2">500+</div>
                  <div class="text-sm text-white/80">ที่พักทั่วประเทศ</div>
                </div>
                <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-transform">
                  <div class="text-4xl font-bold text-yellow-300 mb-2">77</div>
                  <div class="text-sm text-white/80">จังหวัดครอบคลุม</div>
                </div>
                <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-transform">
                  <div class="text-4xl font-bold text-yellow-300 mb-2">10K+</div>
                  <div class="text-sm text-white/80">ผู้ใช้งานต่อเดือน</div>
                </div>
                <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-transform">
                  <div class="text-4xl font-bold text-yellow-300 mb-2">4.8</div>
                  <div class="text-sm text-white/80">คะแนนเฉลี่ย</div>
                </div>
              </div>

              <!-- Process Steps -->
              <div class="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h4 class="text-lg font-bold mb-4">ขั้นตอนง่ายๆ</h4>
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-yellow-400 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                    <span class="text-sm">สมัครสมาชิก / เข้าสู่ระบบ</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-yellow-400 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                    <span class="text-sm">กรอกข้อมูลที่พักของคุณ</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-yellow-400 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                    <span class="text-sm">รอการอนุมัติจากทีมงาน</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-yellow-400 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm">4</div>
                    <span class="text-sm">เริ่มรับจองได้ทันที!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// ใช้ Firestore composables
const { getFeaturedProvinces } = useProvinces()
const { getNewHotels, getFeaturedHotels } = useHotels()
const { setHomeSEO } = useSEO()
const { isAuthenticated } = useAuth()

// Set comprehensive SEO for homepage
setHomeSEO()

// Loading states
const loading = ref(true)

// Data from Firestore
const featuredProvinces = ref<any[]>([])
const newHotels = ref<any[]>([])
const recommendedHotels = ref<any[]>([])
const latestPosts = ref<any[]>([])

// Fetch data on component mount - แยก fetch แต่ละอันเพื่อไม่ให้ error ตัวหนึ่งทำให้ทั้งหมดพัง
onMounted(async () => {
  loading.value = true

  // Fetch provinces
  try {
    const provinces = await getFeaturedProvinces(4)
    featuredProvinces.value = provinces
  } catch (err) {
    console.error('Error loading provinces:', err)
  }

  // Fetch new hotels
  try {
    const newHotelsData = await getNewHotels(20)
    newHotels.value = newHotelsData
  } catch (err) {
    console.error('Error loading new hotels:', err)
  }

  // Fetch featured hotels
  try {
    const featuredHotelsData = await getFeaturedHotels(20)
    recommendedHotels.value = featuredHotelsData
  } catch (err) {
    console.error('Error loading featured hotels:', err)
  }

  // Fetch blogs from API (avoids Firestore index issues)
  try {
    const response = await $fetch('/api/blogs', {
      params: { limit: 3, status: 'published' }
    }) as any
    latestPosts.value = response.data || []
  } catch (err) {
    console.error('Error loading blogs:', err)
  }

  loading.value = false
})
</script>
