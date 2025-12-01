<template>
  <div>
    <!-- Page Header -->
    <section class="bg-gradient-to-r from-red-500 to-pink-500 text-white py-16">
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
                  ? 'bg-red-500 text-white'
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
                  ? 'bg-red-500 text-white'
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
            แสดง <span class="font-bold text-red-500">{{ filteredPosts.length }}</span> บทความ
          </p>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <BlogCard
            v-for="post in filteredPosts"
            :key="post.id"
            :post="post"
          />
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredPosts.length === 0"
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
const hasMore = ref(true)

// Mock data - will be replaced with Firebase
const posts = ref([
  {
    id: '1',
    title: 'อาหารอะไรดีต่อสุนัข?',
    slug: 'best-food-for-dogs',
    excerpt: 'อาหารหลากหลายประเภทมีสารอาหารที่ต่างกัน มาดูกันว่าอาหารแบบไหนดีที่สุดสำหรับสุนัข',
    featuredImage: '/images/blogs/blog1.jpg',
    publishedAt: '2024-11-25',
    createdAt: '2024-11-25',
    viewCount: 336,
    tags: ['อาหาร', 'สุนัข', 'สุขภาพ']
  },
  {
    id: '2',
    title: 'พาสุนัขไปทะเลดีอย่างไร?',
    slug: 'taking-dogs-to-beach',
    excerpt: 'เคล็ดลับและข้อควรระวังในการพาสุนัขไปเที่ยวทะเล',
    featuredImage: '/images/blogs/blog2.jpg',
    publishedAt: '2024-11-24',
    createdAt: '2024-11-24',
    viewCount: 289,
    tags: ['ท่องเที่ยว', 'สุนัข', 'ทะเล']
  },
  {
    id: '3',
    title: 'อาการหายใจหอบของสุนัข',
    slug: 'dog-breathing-problems',
    excerpt: 'ทำไมสุนัขถึงหายใจหอบ และควรรับมืออย่างไร',
    featuredImage: '/images/blogs/blog3.jpg',
    publishedAt: '2024-11-23',
    createdAt: '2024-11-23',
    viewCount: 412,
    tags: ['สุขภาพ', 'สุนัข']
  },
  {
    id: '4',
    title: 'กฎหมายการเลี้ยงสัตว์ปี 2567',
    slug: 'pet-law-2024',
    excerpt: 'สิ่งที่เจ้าของสัตว์เลี้ยงควรรู้เกี่ยวกับกฎหมายฉบับใหม่',
    featuredImage: '/images/blogs/blog4.jpg',
    publishedAt: '2024-11-22',
    createdAt: '2024-11-22',
    viewCount: 521,
    tags: ['กฎหมาย', 'สัตว์เลี้ยง']
  },
  {
    id: '5',
    title: 'วิธีฝึกสุนัขให้เชื่อฟัง',
    slug: 'dog-training-tips',
    excerpt: 'เทคนิคและวิธีการฝึกสุนัขให้เชื่อฟังและมีพฤติกรรมที่ดี',
    featuredImage: '/images/blogs/blog5.jpg',
    publishedAt: '2024-11-21',
    createdAt: '2024-11-21',
    viewCount: 398,
    tags: ['การฝึก', 'สุนัข', 'พฤติกรรม']
  },
  {
    id: '6',
    title: 'อาหารห้ามให้แมว 10 อย่าง',
    slug: 'dangerous-foods-for-cats',
    excerpt: 'อาหารที่อันตรายต่อแมวที่คุณควรหลีกเลี่ยง',
    featuredImage: '/images/blogs/blog6.jpg',
    publishedAt: '2024-11-20',
    createdAt: '2024-11-20',
    viewCount: 445,
    tags: ['อาหาร', 'แมว', 'สุขภาพ']
  },
  {
    id: '7',
    title: 'เตรียมตัวพาสัตว์เลี้ยงขึ้นเครื่องบิน',
    slug: 'flying-with-pets',
    excerpt: 'ขั้นตอนและเอกสารที่จำเป็นในการพาสัตว์เลี้ยงขึ้นเครื่องบิน',
    featuredImage: '/images/blogs/blog7.jpg',
    publishedAt: '2024-11-19',
    createdAt: '2024-11-19',
    viewCount: 567,
    tags: ['ท่องเที่ยว', 'เครื่องบิน', 'สัตว์เลี้ยง']
  },
  {
    id: '8',
    title: 'วัคซีนสุนัขที่จำเป็นต้องฉีด',
    slug: 'essential-dog-vaccines',
    excerpt: 'รายการวัคซีนสำคัญที่สุนัขทุกตัวควรได้รับ',
    featuredImage: '/images/blogs/blog8.jpg',
    publishedAt: '2024-11-18',
    createdAt: '2024-11-18',
    viewCount: 623,
    tags: ['สุขภาพ', 'วัคซีน', 'สุนัข']
  },
  {
    id: '9',
    title: 'ดูแลแมวอ้วนให้ผอม',
    slug: 'cat-weight-loss',
    excerpt: 'วิธีการลดน้ำหนักแมวอย่างปลอดภัยและมีประสิทธิภาพ',
    featuredImage: '/images/blogs/blog9.jpg',
    publishedAt: '2024-11-17',
    createdAt: '2024-11-17',
    viewCount: 388,
    tags: ['สุขภาพ', 'แมว', 'น้ำหนัก']
  }
])

const filteredPosts = computed(() => {
  let result = [...posts.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Sort
  if (sortBy.value === 'latest') {
    result.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
  } else if (sortBy.value === 'popular') {
    result.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
  }

  return result
})

const loadMore = () => {
  // TODO: Implement pagination
  console.log('Load more posts')
  hasMore.value = false
}
</script>
