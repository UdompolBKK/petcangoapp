<template>
  <section class="relative bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-20">
    <div class="container-custom">
      <div class="max-w-3xl mx-auto text-center">
        <!-- Main Heading -->
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          ค้นหาที่พักที่รับสัตว์เลี้ยง
        </h1>
        <p class="text-lg md:text-xl mb-8 text-white/90">
          รวบรวมโรงแรมและรีสอร์ทที่รับสัตว์เลี้ยงกว่า <span class="font-bold">550+</span> แห่ง ทั่วประเทศไทย
        </p>

        <!-- Search Form -->
        <div class="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <form @submit.prevent="handleSearch" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Province Search -->
              <div class="relative">
                <label for="province" class="block text-left text-gray-700 font-medium mb-2">
                  เลือกจังหวัด
                </label>
                <select
                  id="province"
                  v-model="searchQuery.province"
                  class="input appearance-none pr-10"
                >
                  <option value="">ทุกจังหวัด</option>
                  <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                  <option value="ชลบุรี">ชลบุรี</option>
                  <option value="ภูเก็ต">ภูเก็ต</option>
                  <option value="เชียงใหม่">เชียงใหม่</option>
                  <option value="กระบี่">กระบี่</option>
                  <!-- More provinces will be loaded from database -->
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 pt-8 text-gray-700">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>

              <!-- Keyword Search -->
              <div>
                <label for="keyword" class="block text-left text-gray-700 font-medium mb-2">
                  ค้นหาที่พัก
                </label>
                <input
                  id="keyword"
                  v-model="searchQuery.keyword"
                  type="text"
                  placeholder="ชื่อโรงแรม, ที่ตั้ง..."
                  class="input"
                />
              </div>
            </div>

            <!-- Search Button -->
            <button
              type="submit"
              class="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <span>ค้นหาที่พัก</span>
            </button>
          </form>
        </div>

        <!-- Quick Stats -->
        <div class="mt-12 grid grid-cols-3 gap-8 text-center">
          <div>
            <div class="text-3xl md:text-4xl font-bold">550+</div>
            <div class="text-white/80 text-sm md:text-base mt-1">ที่พัก</div>
          </div>
          <div>
            <div class="text-3xl md:text-4xl font-bold">31+</div>
            <div class="text-white/80 text-sm md:text-base mt-1">จังหวัด</div>
          </div>
          <div>
            <div class="text-3xl md:text-4xl font-bold">220K+</div>
            <div class="text-white/80 text-sm md:text-base mt-1">ผู้เข้าชม</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
      <div class="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full"></div>
      <div class="absolute top-20 right-20 w-32 h-32 bg-white rounded-full"></div>
      <div class="absolute bottom-10 left-1/4 w-24 h-24 bg-white rounded-full"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface SearchQuery {
  province: string
  keyword: string
}

const searchQuery = ref<SearchQuery>({
  province: '',
  keyword: ''
})

const handleSearch = () => {
  // Navigate to search results page with query params
  const query: Record<string, string> = {}

  if (searchQuery.value.province) {
    query.province = searchQuery.value.province
  }

  if (searchQuery.value.keyword) {
    query.keyword = searchQuery.value.keyword
  }

  navigateTo({
    path: '/search',
    query
  })
}
</script>
