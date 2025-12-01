<template>
  <NuxtLink
    :to="`/blogs/${post.slug}`"
    class="card group"
  >
    <!-- Featured Image -->
    <div class="relative overflow-hidden aspect-video">
      <img
        :src="post.featuredImage || '/images/placeholder-blog.jpg'"
        :alt="post.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        @error="handleImageError"
      />
    </div>

    <!-- Content -->
    <div class="p-5">
      <!-- Title -->
      <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-500 transition-colors">
        {{ post.title }}
      </h3>

      <!-- Excerpt -->
      <p
        v-if="post.excerpt"
        class="text-sm text-gray-600 mb-4 line-clamp-3"
      >
        {{ post.excerpt }}
      </p>

      <!-- Footer: Meta Info -->
      <div class="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
        <!-- Date -->
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          {{ formatDate(post.publishedAt || post.createdAt) }}
        </div>

        <!-- View Count -->
        <div
          v-if="post.viewCount"
          class="flex items-center"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          {{ formatNumber(post.viewCount) }}
        </div>
      </div>

      <!-- Tags -->
      <div
        v-if="post.tags && post.tags.length > 0"
        class="flex flex-wrap gap-2 mt-3"
      >
        <span
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          class="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  featuredImage?: string
  publishedAt?: string
  createdAt?: string
  viewCount?: number
  tags?: string[]
}

interface Props {
  post: BlogPost
}

const props = defineProps<Props>()

const formatDate = (date: string | undefined): string => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/placeholder-blog.jpg'
}
</script>
