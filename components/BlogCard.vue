<template>
  <article class="bg-white overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300" style="border-radius: 5px;">
    <!-- Featured Image -->
    <NuxtLink :to="`/blogs/${post.slug}`" class="block relative bg-gray-100">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="`${post.title} - บทความ PetCanGo`"
        :title="post.title"
        loading="lazy"
        class="w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
        @error="handleImageError"
      />
      <div v-else class="w-full aspect-video flex items-center justify-center text-gray-300">
        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </div>
    </NuxtLink>

    <!-- Content -->
    <div class="p-6">
      <!-- Category Tag -->
      <div v-if="post.category" class="mb-3">
        <span class="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full" style="background-color: #FF8E00;">
          {{ post.category }}
        </span>
      </div>

      <!-- Title -->
      <NuxtLink :to="`/blogs/${post.slug}`">
        <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-orange-500 transition-colors">
          {{ post.title }}
        </h3>
      </NuxtLink>

      <!-- Excerpt -->
      <p
        v-if="post.excerpt"
        class="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed"
      >
        {{ post.excerpt }}
      </p>

      <!-- Tags -->
      <div
        v-if="post.tags && post.tags.length > 0"
        class="flex flex-wrap gap-2 mb-4"
      >
        <span
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          class="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <!-- Meta Info -->
        <div class="flex items-center gap-4 text-xs text-gray-500">
          <!-- Date -->
          <div v-if="formattedDate" class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span>{{ formattedDate }}</span>
          </div>

          <!-- View Count -->
          <div v-if="post.viewCount" class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            <span>{{ formatNumber(post.viewCount) }}</span>
          </div>
        </div>

        <!-- Read More Button -->
        <NuxtLink
          :to="`/blogs/${post.slug}`"
          class="inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:opacity-80"
          style="color: #FF8E00;"
        >
          <span>Read more</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  featuredImage?: string
  image?: string
  coverImage?: string
  category?: string
  publishedAt?: any
  createdAt?: any
  viewCount?: number
  tags?: string[]
}

interface Props {
  post: BlogPost
}

const props = defineProps<Props>()

const imageUrl = computed(() => {
  return props.post.featuredImage || props.post.image || props.post.coverImage || ''
})

const formattedDate = computed(() => {
  const date = props.post.publishedAt || props.post.createdAt
  if (!date) return ''

  let d: Date

  if (date.toDate && typeof date.toDate === 'function') {
    d = date.toDate()
  } else if (date._seconds) {
    d = new Date(date._seconds * 1000)
  } else if (typeof date === 'string') {
    d = new Date(date)
  } else if (date instanceof Date) {
    d = date
  } else {
    return ''
  }

  if (isNaN(d.getTime())) return ''

  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>
