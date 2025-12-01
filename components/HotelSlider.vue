<template>
  <div class="hotel-slider relative">
    <!-- Slider Container -->
    <div
      ref="sliderRef"
      class="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 hide-scrollbar"
      @scroll="handleScroll"
    >
      <div
        v-for="hotel in hotels"
        :key="hotel.id"
        class="flex-shrink-0 snap-start"
        :style="{ width: cardWidth }"
      >
        <HotelCard :hotel="hotel" />
      </div>
    </div>

    <!-- Navigation Arrows -->
    <button
      v-if="showArrows && canScrollLeft"
      @click="scrollLeft"
      class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all group"
    >
      <svg class="w-6 h-6 text-gray-600 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
    </button>

    <button
      v-if="showArrows && canScrollRight"
      @click="scrollRight"
      class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all group"
    >
      <svg class="w-6 h-6 text-gray-600 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </button>

    <!-- Dots Indicator -->
    <div v-if="showDots" class="flex justify-center gap-2 mt-4">
      <button
        v-for="(_, index) in totalDots"
        :key="index"
        @click="scrollToIndex(index)"
        class="w-2 h-2 rounded-full transition-all"
        :class="currentDot === index ? 'bg-primary-500 w-6' : 'bg-gray-300 hover:bg-gray-400'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Hotel {
  id: string
  slug?: string
  name: string
  mainImage?: string
  image?: string
  priceStart?: number
  province: any
  shortDescription?: string
  facilities?: any[]
  createdAt?: string
  viewCount?: number
}

interface Props {
  hotels: Hotel[]
  showArrows?: boolean
  showDots?: boolean
  autoplay?: boolean
  autoplayInterval?: number
}

const props = withDefaults(defineProps<Props>(), {
  showArrows: true,
  showDots: true,
  autoplay: false,
  autoplayInterval: 5000
})

const sliderRef = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)
const currentDot = ref(0)
const cardWidth = ref('280px')
const cardsPerView = ref(4)

// Calculate cards per view based on screen size
const updateCardsPerView = () => {
  if (typeof window === 'undefined') return

  const width = window.innerWidth
  if (width < 640) {
    cardsPerView.value = 1
    cardWidth.value = 'calc(100% - 16px)'
  } else if (width < 1024) {
    cardsPerView.value = 2
    cardWidth.value = 'calc(50% - 12px)'
  } else if (width < 1280) {
    cardsPerView.value = 3
    cardWidth.value = 'calc(33.333% - 12px)'
  } else {
    cardsPerView.value = 4
    cardWidth.value = 'calc(25% - 12px)'
  }
}

// Total dots based on hotels and cards per view
const totalDots = computed(() => {
  return Math.ceil(props.hotels.length / cardsPerView.value)
})

// Handle scroll event
const handleScroll = () => {
  if (!sliderRef.value) return

  const { scrollLeft, scrollWidth, clientWidth } = sliderRef.value
  canScrollLeft.value = scrollLeft > 10
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 10

  // Calculate current dot
  const scrollPercentage = scrollLeft / (scrollWidth - clientWidth)
  currentDot.value = Math.round(scrollPercentage * (totalDots.value - 1))
}

// Scroll left
const scrollLeft = () => {
  if (!sliderRef.value) return
  const scrollAmount = sliderRef.value.clientWidth
  sliderRef.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
}

// Scroll right
const scrollRight = () => {
  if (!sliderRef.value) return
  const scrollAmount = sliderRef.value.clientWidth
  sliderRef.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
}

// Scroll to specific dot index
const scrollToIndex = (index: number) => {
  if (!sliderRef.value) return
  const { scrollWidth, clientWidth } = sliderRef.value
  const scrollPerDot = (scrollWidth - clientWidth) / (totalDots.value - 1)
  sliderRef.value.scrollTo({ left: scrollPerDot * index, behavior: 'smooth' })
}

// Autoplay functionality
let autoplayTimer: ReturnType<typeof setInterval> | null = null

const startAutoplay = () => {
  if (!props.autoplay) return

  autoplayTimer = setInterval(() => {
    if (canScrollRight.value) {
      scrollRight()
    } else {
      // Go back to start
      sliderRef.value?.scrollTo({ left: 0, behavior: 'smooth' })
    }
  }, props.autoplayInterval)
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

// Lifecycle
onMounted(() => {
  updateCardsPerView()
  window.addEventListener('resize', updateCardsPerView)

  // Initial scroll check
  nextTick(() => handleScroll())

  // Start autoplay if enabled
  startAutoplay()
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateCardsPerView)
  }
  stopAutoplay()
})
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
