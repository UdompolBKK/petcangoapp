<template>
  <div v-if="hotel">
    <section class="relative h-[500px] overflow-hidden bg-gray-900">
      <img
        :src="hotel.mainImage || hotel.image || '/images/placeholder-hotel.jpg'"
        :alt="hotel.name"
        class="w-full h-full object-cover opacity-90"
        @error="handleImageError"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

      <div class="absolute bottom-0 left-0 right-0 container-custom pb-12">
        <div class="max-w-6xl mx-auto text-white">
          <nav class="mb-4 text-sm text-white/80">
            <NuxtLink to="/" class="hover:text-white">Home</NuxtLink>
            <span class="mx-2">/</span>
            <NuxtLink to="/all-province" class="hover:text-white">Provinces</NuxtLink>
            <span class="mx-2">/</span>
            <NuxtLink
              v-if="hotel.province"
              :to="`/province/${getProvinceSlug(hotel.province)}`"
              class="hover:text-white"
            >
              {{ getProvinceName(hotel.province) }}
            </NuxtLink>
            <span class="mx-2">/</span>
            <span class="text-white">{{ hotel.name }}</span>
          </nav>

          <h1 class="text-3xl md:text-5xl font-bold mb-4">{{ hotel.name }}</h1>

          <div class="flex flex-wrap items-center gap-4 text-white/90">
            <div v-if="hotel.province" class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {{ getProvinceName(hotel.province) }}
            </div>
            <div v-if="hotel.viewCount" class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              {{ formatNumber(hotel.viewCount) }} views
            </div>
            <div v-if="averageRating > 0" class="flex items-center">
              <svg class="w-5 h-5 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              {{ averageRating.toFixed(1) }} ({{ reviews.length }} reviews)
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12">
      <div class="container-custom">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-8">
              <div class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">About</h2>
                <p v-if="hotel.shortDescription" class="text-gray-700 mb-4">
                  {{ hotel.shortDescription }}
                </p>
                <div v-if="hotel.description" class="text-gray-700 whitespace-pre-line">
                  {{ hotel.description }}
                </div>
              </div>

              <div v-if="hotel.gallery && hotel.gallery.length > 0" class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div
                    v-for="(item, index) in hotel.gallery"
                    :key="index"
                    class="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group"
                    @click="openGallery(index)"
                  >
                    <img
                      :src="item.image || item"
                      :alt="item.alttext || `Gallery image ${index + 1}`"
                      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      @error="handleImageError"
                    />
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                  </div>
                </div>
              </div>

              <div v-if="hotel.facilities && hotel.facilities.length > 0" class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Facilities</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div
                    v-for="(facility, index) in hotel.facilities"
                    :key="index"
                    class="flex items-center text-gray-700"
                  >
                    <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    {{ getFacilityName(facility) }}
                  </div>
                </div>
              </div>

              <div v-if="hotel.address || hotel.location" class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Location</h2>
                <div class="flex items-start text-gray-700">
                  <svg class="w-5 h-5 mr-2 mt-1 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <div>
                    <p v-if="hotel.address">{{ hotel.address }}</p>
                    <p v-if="hotel.province">{{ getProvinceName(hotel.province) }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>

                <div v-if="reviews.length > 0" class="space-y-4">
                  <div v-for="review in reviews" :key="review.id" class="p-4 border border-gray-200 rounded-lg">
                    <div class="flex items-start justify-between mb-2">
                      <div class="flex items-center gap-3">
                        <img
                          :src="review.userPhotoURL || '/common/nouser.jpg'"
                          :alt="review.userName"
                          class="w-10 h-10 rounded-full object-cover"
                          @error="handleImageError"
                        />
                        <div>
                          <p class="font-medium text-gray-900">{{ review.userName }}</p>
                          <div class="flex items-center gap-2">
                            <div class="flex">
                              <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            </div>
                            <span class="text-xs text-gray-500">{{ formatDate(review.createdAt) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p class="text-gray-700 mt-2">{{ review.comment }}</p>
                  </div>
                </div>

                <div v-else class="text-center py-8 text-gray-500">
                  <p>No reviews yet</p>
                </div>
              </div>
            </div>

            <div class="lg:col-span-1">
              <div class="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <div class="mb-6">
                  <div class="text-3xl font-bold text-primary-500 mb-2">
                    {{ formatPrice(hotel.priceStart) }} THB
                  </div>
                  <p class="text-sm text-gray-600">per night (starting from)</p>
                </div>

                <div class="space-y-3 mb-6">
                  <div v-if="hotel.phone" class="flex items-center text-gray-700">
                    <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <a :href="`tel:${hotel.phone}`" class="hover:text-primary-500">{{ hotel.phone }}</a>
                  </div>
                  <div v-if="hotel.email" class="flex items-center text-gray-700">
                    <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <a :href="`mailto:${hotel.email}`" class="hover:text-primary-500">{{ hotel.email }}</a>
                  </div>
                  <div v-if="hotel.website" class="flex items-center text-gray-700">
                    <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                    </svg>
                    <a :href="hotel.website" target="_blank" class="hover:text-primary-500 truncate">Website</a>
                  </div>
                </div>

                <a
                  v-if="hotel.phone"
                  :href="`tel:${hotel.phone}`"
                  class="btn btn-primary w-full mb-3"
                >
                  Call to Book
                </a>

                <a
                  v-if="hotel.website"
                  :href="hotel.website"
                  target="_blank"
                  class="btn btn-outline w-full"
                >
                  Visit Website
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="relatedHotels.length > 0" class="py-12 bg-gray-50">
      <div class="container-custom">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl font-bold text-gray-900 mb-8">More hotels in {{ getProvinceName(hotel.province) }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <HotelCard
              v-for="relatedHotel in relatedHotels"
              :key="relatedHotel.id"
              :hotel="relatedHotel"
            />
          </div>
        </div>
      </div>
    </section>
  </div>

  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
      <p class="text-gray-600">Loading...</p>
    </div>
  </div>

  <!-- Gallery Lightbox Modal with Animation -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showGalleryModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
        @click="closeGallery"
      >
        <!-- Close button -->
        <button
          class="absolute top-4 right-4 text-white/80 hover:text-white z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
          @click="closeGallery"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Previous button -->
        <button
          v-if="currentGalleryIndex > 0"
          class="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
          @click.stop="prevImage"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <!-- Image container with animation -->
        <div class="max-w-6xl max-h-[90vh] w-full mx-4 px-12" @click.stop>
          <Transition
            :name="galleryDirection"
            mode="out-in"
          >
            <img
              :key="currentGalleryIndex"
              :src="getCurrentGalleryImage()"
              :alt="`Gallery image ${currentGalleryIndex + 1}`"
              class="w-full h-full object-contain max-h-[80vh] rounded-lg shadow-2xl"
            />
          </Transition>

          <!-- Image counter -->
          <div class="text-white/80 text-center mt-4 text-sm font-medium">
            {{ currentGalleryIndex + 1 }} / {{ hotel?.gallery?.length || 0 }}
          </div>

          <!-- Thumbnail strip -->
          <div v-if="hotel?.gallery && hotel.gallery.length > 1" class="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
            <button
              v-for="(item, index) in hotel.gallery"
              :key="index"
              class="flex-shrink-0 w-16 h-12 rounded-md overflow-hidden transition-all duration-200"
              :class="index === currentGalleryIndex ? 'ring-2 ring-white opacity-100' : 'opacity-50 hover:opacity-80'"
              @click.stop="goToImage(index)"
            >
              <img
                :src="item.image || item"
                :alt="`Thumbnail ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <!-- Next button -->
        <button
          v-if="hotel?.gallery && currentGalleryIndex < hotel.gallery.length - 1"
          class="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
          @click.stop="nextImage"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const route = useRoute()
const provinceSlug = route.params.provinceSlug as string
const hotelSlug = route.params.hotelSlug as string

const { getHotelBySlug, getHotelsByProvince } = useHotels()
const { getCollection } = useFirestore()
const { trackPageView } = usePageView()
const { setHotelSEO } = useSEO()

const hotel = ref<any>(null)
const relatedHotels = ref<any[]>([])
const reviews = ref<any[]>([])
const showGalleryModal = ref(false)
const currentGalleryIndex = ref(0)
const galleryDirection = ref('slide-right')

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc: number, review: any) => acc + review.rating, 0)
  return sum / reviews.value.length
})

const getProvinceName = (province: any): string => {
  if (typeof province === 'string') return province
  return province?.name || ''
}

const getProvinceSlug = (province: any): string => {
  if (typeof province === 'string') {
    return province.toLowerCase().replace(/\s+/g, '-')
  }
  return province?.slug || province?.id || ''
}

const getFacilityName = (facility: any): string => {
  if (typeof facility === 'string') return facility
  return facility?.name || facility?.label || ''
}

const formatPrice = (price: number): string => {
  return price.toLocaleString('en-US')
}

const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US')
}

const formatDate = (date: string): string => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/common/nouser.jpg'
}

const openGallery = (index: number) => {
  currentGalleryIndex.value = index
  showGalleryModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeGallery = () => {
  showGalleryModal.value = false
  document.body.style.overflow = 'auto'
}

const nextImage = () => {
  if (hotel.value?.gallery && currentGalleryIndex.value < hotel.value.gallery.length - 1) {
    galleryDirection.value = 'slide-right'
    currentGalleryIndex.value++
  }
}

const prevImage = () => {
  if (currentGalleryIndex.value > 0) {
    galleryDirection.value = 'slide-left'
    currentGalleryIndex.value--
  }
}

const goToImage = (index: number) => {
  galleryDirection.value = index > currentGalleryIndex.value ? 'slide-right' : 'slide-left'
  currentGalleryIndex.value = index
}

const getCurrentGalleryImage = () => {
  if (!hotel.value?.gallery || !hotel.value.gallery[currentGalleryIndex.value]) {
    return '/images/placeholder-hotel.jpg'
  }
  const item = hotel.value.gallery[currentGalleryIndex.value]
  return item.image || item
}

const loadReviews = async () => {
  if (!hotel.value?.id) return

  try {
    const allReviews = await getCollection('reviews')
    reviews.value = allReviews
      .filter((review: any) => review.hotelId === hotel.value.id)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error('Error loading reviews:', error)
    reviews.value = []
  }
}

onMounted(async () => {
  const hotelData: any = await getHotelBySlug(hotelSlug)

  if (hotelData) {
    hotel.value = hotelData

    // Set SEO with structured data
    setHotelSEO({
      name: hotelData.name,
      description: hotelData.shortDescription || hotelData.description,
      image: hotelData.mainImage || hotelData.image,
      address: hotelData.address,
      province: hotelData.province?.name,
      priceStart: hotelData.priceStart,
      rating: hotelData.rating,
      reviewCount: hotelData.reviewCount,
      facilities: hotelData.facilities?.map((f: any) => f.name || f),
      phone: hotelData.phone,
      website: hotelData.website,
      slug: `${provinceSlug}/${hotelSlug}`
    })

    // Track pageview
    trackPageView('hotel', hotelData.id)

    if (hotelData.province?.id) {
      const related = await getHotelsByProvince(hotelData.province.id, 4)
      relatedHotels.value = related.filter((h: any) => h.id !== hotelData.id)
    }

    await loadReviews()
  }

  // Add keyboard navigation for gallery
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
  document.body.style.overflow = 'auto'
})

const handleKeyPress = (event: KeyboardEvent) => {
  if (!showGalleryModal.value) return

  if (event.key === 'Escape') {
    closeGallery()
  } else if (event.key === 'ArrowLeft') {
    prevImage()
  } else if (event.key === 'ArrowRight') {
    nextImage()
  }
}

</script>

<style scoped>
/* Slide right animation (next) */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-out;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Slide left animation (prev) */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
