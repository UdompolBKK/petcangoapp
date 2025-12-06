<template>
  <section class="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
    <!-- Background Images with Parallax -->
    <div class="absolute inset-0 z-0">
      <!-- Image Slideshow -->
      <div class="absolute inset-0">
        <transition-group name="fade" tag="div" class="relative w-full h-full">
          <div
            v-for="(image, index) in heroImages"
            v-show="currentImageIndex === index"
            :key="index"
            class="absolute inset-0"
          >
            <img
              :src="image.src"
              :alt="image.alt"
              class="w-full h-full object-cover transform scale-110 transition-transform duration-[10000ms]"
              :class="{ 'scale-100': currentImageIndex === index }"
              loading="eager"
            />
          </div>
        </transition-group>
      </div>

      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

      <!-- Animated Particles -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
        <div class="particle particle-4"></div>
        <div class="particle particle-5"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="container-custom relative z-10">
      <div class="max-w-4xl mx-auto text-center text-white">
        <!-- Main Heading -->
        <h1 class="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 animate-fade-in-up leading-tight">
          ค้นหาที่พัก<br class="md:hidden" />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
            ที่รับสัตว์เลี้ยง
          </span>
        </h1>

        <p class="text-lg md:text-xl mb-10 text-white/90 animate-fade-in-up animation-delay-200 max-w-2xl mx-auto">
          รวบรวมโรงแรมและรีสอร์ทที่รับสัตว์เลี้ยงกว่า <span class="font-bold text-yellow-300">550+</span> แห่ง ทั่วประเทศไทย
        </p>

        <!-- Realtime Search Form -->
        <div class="animate-fade-in-up animation-delay-400">
          <div ref="searchContainer" class="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 md:p-6 max-w-2xl mx-auto">
            <!-- Search Input -->
            <div class="relative">
              <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input
                ref="searchInput"
                v-model="query"
                type="text"
                placeholder="ค้นหาที่พัก, จังหวัด, โรงแรม..."
                class="w-full text-gray-900 text-lg py-4 pl-14 pr-14 rounded-xl border-2 border-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 outline-none"
                @focus="handleFocus"
                @input="handleInput"
                @keydown.escape="closeSearch"
                @keydown.enter="handleEnter"
                @keydown.down.prevent="navigateResults(1)"
                @keydown.up.prevent="navigateResults(-1)"
              />

              <!-- Clear Button -->
              <button
                v-if="query"
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                @click="clearSearch"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <!-- Loading Spinner -->
              <div
                v-if="isSearching"
                class="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <svg class="animate-spin w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>

            <!-- Search Results Dropdown -->
            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <div
                v-if="showResults && (results.length > 0 || (query.length >= 2 && !isSearching))"
                class="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 max-h-[60vh] overflow-y-auto"
              >
                <!-- Results List -->
                <div v-if="results.length > 0">
                  <!-- Group by type -->
                  <template v-for="(group, groupType) in groupedResults" :key="groupType">
                    <div v-if="group.length > 0">
                      <!-- Group Header -->
                      <div class="px-4 py-2 bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {{ getGroupLabel(groupType as string) }}
                      </div>

                      <!-- Group Items -->
                      <NuxtLink
                        v-for="(item, index) in group"
                        :key="item.id"
                        :to="item.url"
                        class="flex items-center px-4 py-3 hover:bg-primary-50 transition-colors border-b border-gray-100 last:border-0"
                        :class="{ 'bg-primary-50': selectedIndex === getGlobalIndex(groupType as string, index) }"
                        @click="handleResultClick(item)"
                      >
                        <!-- Image/Icon -->
                        <div class="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gray-100 mr-4">
                          <img
                            v-if="item.image"
                            :src="item.image"
                            :alt="item.title"
                            class="w-full h-full object-cover"
                            @error="handleImageError"
                          />
                          <div v-else class="w-full h-full flex items-center justify-center">
                            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path v-if="item.type === 'province'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                              <path v-else-if="item.type === 'hotel'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                            </svg>
                          </div>
                        </div>

                        <!-- Content -->
                        <div class="flex-1 min-w-0 text-left">
                          <p class="text-base font-medium text-gray-900 truncate">{{ item.title }}</p>
                          <p class="text-sm text-gray-500 truncate">{{ item.subtitle }}</p>
                        </div>

                        <!-- Type Badge -->
                        <span
                          :class="[
                            'ml-3 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap',
                            getTypeBadgeClass(item.type)
                          ]"
                        >
                          {{ getTypeLabel(item.type) }}
                        </span>
                      </NuxtLink>
                    </div>
                  </template>
                </div>

                <!-- No Results -->
                <div v-else-if="query.length >= 2 && !isSearching" class="px-4 py-8 text-center">
                  <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-gray-500 text-sm">ไม่พบผลลัพธ์สำหรับ "{{ query }}"</p>
                  <p class="text-gray-400 text-xs mt-1">ลองค้นหาด้วยคำอื่น</p>
                </div>
              </div>
            </Transition>

            <!-- Quick Search Tags -->
            <div v-if="!showResults" class="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span class="text-gray-500 text-sm">ยอดนิยม:</span>
              <button
                v-for="tag in popularTags"
                :key="tag"
                type="button"
                class="text-sm px-3 py-1 bg-gray-100 hover:bg-primary-100 hover:text-primary-600 text-gray-600 rounded-full transition-colors duration-200"
                @click="quickSearch(tag)"
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
      <div class="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
        <div class="w-1.5 h-3 bg-white/80 rounded-full animate-scroll-down"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { SearchResult } from '~/composables/useGlobalSearch'

const { results, isSearching, debouncedSearch, clearSearch: clearSearchResults, loadSearchData } = useGlobalSearch()
const router = useRouter()

const searchContainer = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const query = ref('')
const showResults = ref(false)
const selectedIndex = ref(-1)
const currentImageIndex = ref(0)

const heroImages = [
  {
    src: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1920&q=80',
    alt: 'สุนัขน่ารักกับเจ้าของ'
  },
  {
    src: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1920&q=80',
    alt: 'สุนัขวิ่งเล่นบนชายหาด'
  },
  {
    src: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1920&q=80',
    alt: 'สัตว์เลี้ยงน่ารัก'
  },
  {
    src: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1920&q=80',
    alt: 'แมวและสุนัขพักผ่อน'
  }
]

const popularTags = ['กรุงเทพ', 'ชลบุรี', 'เชียงใหม่', 'ภูเก็ต', 'หัวหิน']

// Group results by type
const groupedResults = computed(() => {
  const groups: Record<string, SearchResult[]> = {
    province: [],
    hotel: [],
    blog: []
  }

  results.value.forEach((item) => {
    if (groups[item.type]) {
      groups[item.type].push(item)
    }
  })

  return groups
})

// Get global index for keyboard navigation
const getGlobalIndex = (type: string, localIndex: number): number => {
  let offset = 0
  const order = ['province', 'hotel', 'blog']

  for (const t of order) {
    if (t === type) break
    offset += groupedResults.value[t]?.length || 0
  }

  return offset + localIndex
}

// Image slideshow
let slideInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  slideInterval = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % heroImages.length
  }, 6000)

  // Click outside to close
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (e: MouseEvent) => {
  if (searchContainer.value && !searchContainer.value.contains(e.target as Node)) {
    showResults.value = false
  }
}

// Handle input changes
const handleInput = () => {
  selectedIndex.value = -1
  debouncedSearch(query.value)
}

// Handle focus
const handleFocus = () => {
  showResults.value = true
  loadSearchData()
}

// Close search
const closeSearch = () => {
  showResults.value = false
  searchInput.value?.blur()
}

// Clear search
const clearSearch = () => {
  query.value = ''
  clearSearchResults()
  selectedIndex.value = -1
  searchInput.value?.focus()
}

// Navigate results with keyboard
const navigateResults = (direction: number) => {
  const totalResults = results.value.length
  if (totalResults === 0) return

  selectedIndex.value += direction

  if (selectedIndex.value < 0) {
    selectedIndex.value = totalResults - 1
  } else if (selectedIndex.value >= totalResults) {
    selectedIndex.value = 0
  }
}

// Handle enter key
const handleEnter = () => {
  if (selectedIndex.value >= 0 && selectedIndex.value < results.value.length) {
    const item = results.value[selectedIndex.value]
    handleResultClick(item)
  } else if (results.value.length > 0) {
    handleResultClick(results.value[0])
  } else if (query.value) {
    // Navigate to search page
    router.push({ path: '/search', query: { keyword: query.value } })
  }
}

// Handle result click
const handleResultClick = (item: SearchResult) => {
  showResults.value = false
  query.value = ''
  clearSearchResults()
  router.push(item.url)
}

// Quick search
const quickSearch = (tag: string) => {
  query.value = tag
  showResults.value = true
  loadSearchData()
  debouncedSearch(tag, 100)
}

// Handle image error
const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}

// Get group label
const getGroupLabel = (type: string): string => {
  const labels: Record<string, string> = {
    province: 'จังหวัด',
    hotel: 'ที่พัก',
    blog: 'บทความ'
  }
  return labels[type] || type
}

// Get type label
const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    province: 'จังหวัด',
    hotel: 'ที่พัก',
    blog: 'บทความ'
  }
  return labels[type] || type
}

// Get type badge class
const getTypeBadgeClass = (type: string): string => {
  const classes: Record<string, string> = {
    province: 'bg-blue-100 text-blue-700',
    hotel: 'bg-primary-100 text-primary-700',
    blog: 'bg-green-100 text-green-700'
  }
  return classes[type] || 'bg-gray-100 text-gray-700'
}
</script>

<style scoped>
/* Fade transition for images */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animation classes */
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out forwards;
  opacity: 0;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-600 {
  animation-delay: 0.6s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scroll indicator animation */
@keyframes scrollDown {
  0%, 100% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(8px);
    opacity: 0.5;
  }
}

.animate-scroll-down {
  animation: scrollDown 1.5s ease-in-out infinite;
}

/* Floating particles */
.particle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: float 15s infinite ease-in-out;
}

.particle-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.particle-2 {
  top: 60%;
  left: 20%;
  width: 15px;
  height: 15px;
  animation-delay: 2s;
}

.particle-3 {
  top: 30%;
  right: 15%;
  width: 8px;
  height: 8px;
  animation-delay: 4s;
}

.particle-4 {
  bottom: 30%;
  right: 25%;
  width: 12px;
  height: 12px;
  animation-delay: 6s;
}

.particle-5 {
  bottom: 20%;
  left: 30%;
  animation-delay: 8s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0.3;
  }
  25% {
    transform: translate(20px, -30px) rotate(90deg);
    opacity: 0.6;
  }
  50% {
    transform: translate(-10px, -50px) rotate(180deg);
    opacity: 0.3;
  }
  75% {
    transform: translate(15px, -20px) rotate(270deg);
    opacity: 0.5;
  }
}
</style>
