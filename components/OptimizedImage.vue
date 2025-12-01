<template>
  <div ref="containerRef" class="optimized-image" :class="containerClass">
    <!-- Placeholder/Skeleton while loading -->
    <div
      v-if="!isLoaded && !hasError"
      class="absolute inset-0 bg-gray-200 animate-pulse"
      :class="placeholderClass"
    >
      <slot name="placeholder">
        <div class="w-full h-full flex items-center justify-center text-gray-400">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </slot>
    </div>

    <!-- Error state -->
    <div
      v-if="hasError"
      class="absolute inset-0 bg-gray-100 flex items-center justify-center"
      :class="errorClass"
    >
      <slot name="error">
        <div class="text-center text-gray-400">
          <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-xs">Image not found</span>
        </div>
      </slot>
    </div>

    <!-- Main Image -->
    <img
      v-show="isLoaded && !hasError"
      ref="imageRef"
      :src="shouldLoad ? optimizedSrc : undefined"
      :srcset="shouldLoad && srcset ? srcset : undefined"
      :sizes="sizes"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="eager ? 'eager' : 'lazy'"
      :decoding="eager ? 'sync' : 'async'"
      :fetchpriority="priority"
      class="transition-opacity duration-300"
      :class="[imageClass, { 'opacity-0': !isLoaded, 'opacity-100': isLoaded }]"
      @load="handleLoad"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  // Lazy loading options
  eager?: boolean
  threshold?: number
  // Style classes
  containerClass?: string
  imageClass?: string
  placeholderClass?: string
  errorClass?: string
  // SEO & Performance
  priority?: 'high' | 'low' | 'auto'
  sizes?: string
  // Fallback
  fallback?: string
}

const props = withDefaults(defineProps<Props>(), {
  eager: false,
  threshold: 0.1,
  priority: 'auto',
  fallback: '/images/placeholder.svg'
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
}>()

const containerRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const isLoaded = ref(false)
const hasError = ref(false)
const shouldLoad = ref(props.eager)

// Compute optimized src (Firebase Storage URLs are already optimized)
const optimizedSrc = computed(() => {
  if (!props.src) return props.fallback

  // If Firebase Storage URL, return as-is (Firebase already handles optimization)
  if (props.src.includes('firebasestorage.googleapis.com')) {
    return props.src
  }

  // For local images or other URLs
  return props.src
})

// Generate srcset for responsive images (if width is known)
const srcset = computed(() => {
  if (!props.src || !props.width) return undefined

  // Skip srcset for Firebase URLs (they handle their own optimization)
  if (props.src.includes('firebasestorage.googleapis.com')) {
    return undefined
  }

  // For local images, could generate multiple sizes
  // This is a placeholder - actual implementation depends on image processing setup
  return undefined
})

// Intersection Observer for lazy loading
onMounted(() => {
  if (props.eager || shouldLoad.value) {
    return
  }

  if (!containerRef.value) return

  // Use Intersection Observer for lazy loading
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          shouldLoad.value = true
          observer.disconnect()
        }
      })
    },
    {
      rootMargin: '50px', // Load images 50px before they enter viewport
      threshold: props.threshold
    }
  )

  observer.observe(containerRef.value)

  onUnmounted(() => {
    observer.disconnect()
  })
})

const handleLoad = (event: Event) => {
  isLoaded.value = true
  emit('load', event)
}

const handleError = (event: Event) => {
  hasError.value = true

  // Try fallback image
  if (props.fallback && imageRef.value && imageRef.value.src !== props.fallback) {
    imageRef.value.src = props.fallback
    hasError.value = false
  } else {
    emit('error', event)
  }
}
</script>

<style scoped>
.optimized-image {
  position: relative;
  overflow: hidden;
}
</style>
