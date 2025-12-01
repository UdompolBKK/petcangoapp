<template>
  <div>
    <!-- Page Header -->
    <section class="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-16">
      <div class="container-custom">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            บทความและเคล็ดลับ
          </h1>
          <p class="text-lg md:text-xl text-white/90">
            ความรู้เกี่ยวกับการเลี้ยงสัตว์เลี้ยงและการท่องเที่ยว
          </p>
        </div>
      </div>
    </section>

    <!-- Filter & Search -->
    <section class="py-8 bg-gray-50 border-b">
      <div class="container-custom">
        <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
          <!-- Search -->
          <div class="w-full md:w-96">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="ค้นหาบทความ..."
                class="input pr-10"
              />
              <svg class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Sort -->
          <div class="flex gap-2">
            <button
              @click="sortBy = 'latest'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                sortBy === 'latest'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              ]"
            >
              ล่าสุด
            </button>
            <button
              @click="sortBy = 'popular'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                sortBy === 'popular'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              ]"
            >
              ยอดนิยม
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog Grid -->
    <section class="py-16">
      <div class="container-custom">
        <!-- Stats -->
        <div class="mb-8">
          <p class="text-gray-600">
            แสดง <span class="font-bold text-primary-500">{{ filteredPosts.length }}</span> บทความ
          </p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 6" :key="i" class="bg-white rounded-xl overflow-hidden shadow-sm">
            <div class="aspect-video bg-gray-200 animate-pulse"/>
            <div class="p-5 space-y-3">
              <div class="h-6 bg-gray-200 rounded animate-pulse"/>
              <div class="h-4 bg-gray-200 rounded w-3/4 animate-pulse"/>
              <div class="h-4 bg-gray-200 rounded w-1/2 animate-pulse"/>
            </div>
          </div>
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <BlogCard
            v-for="post in filteredPosts"
            :key="post.id"
            :post="post"
          />
        </div>

        <!-- Empty State -->
        <div
          v-if="!loading && filteredPosts.length === 0"
          class="text-center py-16"
        >
          <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3 class="text-xl font-bold text-gray-700 mb-2">ไม่พบบทความ</h3>
          <p class="text-gray-500">ลองค้นหาด้วยคำอื่นดูนะครับ</p>
        </div>

        <!-- Load More -->
        <div v-if="filteredPosts.length > 0 && hasMore" class="mt-12 text-center">
          <button
            @click="loadMore"
            class="btn btn-outline"
          >
            โหลดบทความเพิ่มเติม
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO
useHead({
  title: 'บทความและเคล็ดลับการเลี้ยงสัตว์ - PetCanGo',
  meta: [
    {
      name: 'description',
      content: 'บทความและความรู้เกี่ยวกับการเลี้ยงสัตว์เลี้ยง การดูแลสุขภาพสุนัขแมว และเคล็ดลับการพาสัตว์เลี้ยงเที่ยว'
    }
  ]
})

const searchQuery = ref('')
const sortBy = ref<'latest' | 'popular'>('latest')
const hasMore = ref(false)
const loading = ref(true)
const posts = ref<any[]>([])

// Load blogs from API (avoids Firestore index issues)
const loadBlogs = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/blogs', {
      params: { limit: 50, status: 'published' }
    }) as any

    let blogs = response.data || []

    // Sort by popular if selected
    if (sortBy.value === 'popular') {
      blogs = blogs.sort((a: any, b: any) => (b.viewCount || 0) - (a.viewCount || 0))
    }

    posts.value = blogs
  } catch (err) {
    console.error('Error loading blogs:', err)
  } finally {
    loading.value = false
  }
}

// Watch sort change
watch(sortBy, () => {
  loadBlogs()
})

// Load on mount
onMounted(() => {
  loadBlogs()
})

const filteredPosts = computed(() => {
  let result = [...posts.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((post: any) => {
      const titleMatch = post.title?.toLowerCase().includes(query)
      const excerptMatch = post.excerpt?.toLowerCase().includes(query)
      const tagsMatch = post.tags?.some((tag: string) => tag.toLowerCase().includes(query))
      return titleMatch || excerptMatch || tagsMatch
    })
  }

  return result
})

const loadMore = () => {
  // TODO: Implement pagination
  console.log('Load more posts')
  hasMore.value = false
}
</script>
