<template>
  <div v-if="post">
    <!-- Hero Image -->
    <section class="relative h-[500px] overflow-hidden bg-gray-900">
      <img
        :src="post.featuredImage || '/images/placeholder-blog.jpg'"
        :alt="post.title"
        class="w-full h-full object-cover opacity-80"
        @error="handleImageError"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

      <div class="absolute bottom-0 left-0 right-0 container-custom pb-12">
        <div class="max-w-4xl mx-auto text-white">
          <!-- Breadcrumb -->
          <nav class="mb-4 text-sm text-white/80">
            <NuxtLink to="/" class="hover:text-white">หน้าหลัก</NuxtLink>
            <span class="mx-2">/</span>
            <NuxtLink to="/blogs" class="hover:text-white">บทความ</NuxtLink>
            <span class="mx-2">/</span>
            <span class="text-white">{{ post.title }}</span>
          </nav>

          <!-- Tags -->
          <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Title -->
          <h1 class="text-3xl md:text-5xl font-bold mb-4">{{ post.title }}</h1>

          <!-- Meta -->
          <div class="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              {{ formatDate(post.publishedAt || post.createdAt) }}
            </div>
            <div v-if="post.viewCount" class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              {{ formatNumber(post.viewCount) }} ครั้ง
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="py-16">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- Article Content -->
            <article class="lg:col-span-3">
              <!-- Excerpt -->
              <div v-if="post.excerpt" class="text-xl text-gray-700 font-medium mb-8 pb-8 border-b">
                {{ post.excerpt }}
              </div>

              <!-- Main Content -->
              <div class="prose prose-lg max-w-none" v-html="post.content"></div>

              <!-- Share Buttons -->
              <div class="mt-12 pt-8 border-t">
                <h3 class="text-lg font-bold text-gray-900 mb-4">แชร์บทความนี้</h3>
                <div class="flex flex-wrap gap-3">
                  <button class="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </button>
                  <button class="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    Line
                  </button>
                  <button class="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                    </svg>
                    คัดลอกลิงก์
                  </button>
                </div>
              </div>
            </article>

            <!-- Sidebar -->
            <aside class="lg:col-span-1">
              <!-- Related Posts -->
              <div class="bg-gray-50 rounded-lg p-6 sticky top-24">
                <h3 class="text-lg font-bold text-gray-900 mb-4">บทความที่เกี่ยวข้อง</h3>
                <div class="space-y-4">
                  <NuxtLink
                    v-for="related in relatedPosts"
                    :key="related.id"
                    :to="`/blogs/${related.slug}`"
                    class="block group"
                  >
                    <img
                      :src="related.featuredImage"
                      :alt="related.title"
                      class="w-full h-32 object-cover rounded-lg mb-2 group-hover:opacity-90 transition-opacity"
                      @error="handleImageError"
                    />
                    <h4 class="font-medium text-gray-900 group-hover:text-red-500 transition-colors line-clamp-2">
                      {{ related.title }}
                    </h4>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ formatDate(related.publishedAt || related.createdAt) }}
                    </p>
                  </NuxtLink>
                </div>

                <NuxtLink to="/blogs" class="block mt-6 text-center text-red-500 hover:text-red-600 font-medium">
                  ดูบทความทั้งหมด →
                </NuxtLink>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>

    <!-- More Articles -->
    <section class="py-16 bg-gray-50">
      <div class="container-custom">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">บทความอื่นๆ ที่น่าสนใจ</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogCard
            v-for="otherPost in otherPosts"
            :key="otherPost.id"
            :post="otherPost"
          />
        </div>
      </div>
    </section>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
      <p class="text-gray-600">กำลังโหลด...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

// Mock data - will be replaced with Firebase
const post = ref({
  id: '1',
  title: 'อาหารอะไรดีต่อสุนัข?',
  slug: 'best-food-for-dogs',
  excerpt: 'อาหารหลากหลายประเภทมีสารอาหารที่ต่างกัน มาดูกันว่าอาหารแบบไหนดีที่สุดสำหรับสุนัข',
  featuredImage: '/images/blogs/blog1.jpg',
  content: `
    <h2>อาหารเม็ดสำเร็จรูป (Dry Food)</h2>
    <p>อาหารเม็ดสำเร็จรูปเป็นอาหารที่นิยมมากที่สุดสำหรับสุนัข เพราะสะดวก เก็บได้นาน และมีสารอาหารครบถ้วน</p>

    <h3>ข้อดี:</h3>
    <ul>
      <li>สะดวกในการเก็บรักษา</li>
      <li>ราคาไม่แพง</li>
      <li>ช่วยทำความสะอาดฟัน</li>
      <li>มีสารอาหารครบถ้วน</li>
    </ul>

    <h3>ข้อควรระวัง:</h3>
    <ul>
      <li>เลือกยี่ห้อที่มีคุณภาพ</li>
      <li>ดูส่วนผสมให้ดี</li>
      <li>เหมาะกับอายุของสุนัข</li>
    </ul>

    <h2>อาหารกระป๋อง (Wet Food)</h2>
    <p>อาหารกระป๋องมีความชุ่มชื้นสูง เหมาะสำหรับสุนัขที่ไม่ค่อยดื่มน้ำ หรือมีปัญหาเรื่องฟัน</p>

    <h3>ข้อดี:</h3>
    <ul>
      <li>รสชาติดี สุนัขชอบกิน</li>
      <li>ความชุ่มชื้นสูง</li>
      <li>ย่อยง่าย</li>
      <li>เหมาะกับสุนัขป่วย</li>
    </ul>

    <h2>อาหารสดและอาหารปรุงเอง</h2>
    <p>บางคนชอบทำอาหารให้สุนัขเอง ซึ่งต้องศึกษาสารอาหารที่จำเป็นให้ดี เพื่อให้สุนัขได้รับสารอาหารครบถ้วน</p>

    <h3>ควรมี:</h3>
    <ul>
      <li>โปรตีนจากเนื้อสัตว์</li>
      <li>ผักและผลไม้</li>
      <li>คาร์โบไฮเดรต</li>
      <li>วิตามินและแร่ธาตุ</li>
    </ul>

    <h3>อาหารต้องห้าม:</h3>
    <ul>
      <li>ช็อกโกแลต</li>
      <li>หัวหอม กระเทียม</li>
      <li>องุ่น ลูกเกด</li>
      <li>อะโวคาโด</li>
      <li>ของหวาน สารให้ความหวานเทียม</li>
    </ul>

    <h2>สรุป</h2>
    <p>การเลือกอาหารที่ดีให้สุนัขต้องพิจารณาหลายปัจจัย อย่างอายุ ขนาด สายพันธุ์ และสุขภาพของสุนัขแต่ละตัว ควรปรึกษาสัตวแพทย์เพื่อความเหมาะสม</p>
  `,
  publishedAt: '2024-11-25',
  createdAt: '2024-11-25',
  viewCount: 336,
  tags: ['อาหาร', 'สุนัข', 'สุขภาพ']
})

const relatedPosts = ref([
  {
    id: '3',
    title: 'อาการหายใจหอบของสุนัข',
    slug: 'dog-breathing-problems',
    featuredImage: '/images/blogs/blog3.jpg',
    publishedAt: '2024-11-23',
    createdAt: '2024-11-23'
  },
  {
    id: '5',
    title: 'วิธีฝึกสุนัขให้เชื่อฟัง',
    slug: 'dog-training-tips',
    featuredImage: '/images/blogs/blog5.jpg',
    publishedAt: '2024-11-21',
    createdAt: '2024-11-21'
  }
])

const otherPosts = ref([
  {
    id: '2',
    title: 'พาสุนัขไปทะเลดีอย่างไร?',
    slug: 'taking-dogs-to-beach',
    excerpt: 'เคล็ดลับและข้อควรระวังในการพาสุนัขไปเที่ยวทะเล',
    featuredImage: '/images/blogs/blog2.jpg',
    publishedAt: '2024-11-24',
    createdAt: '2024-11-24',
    viewCount: 289,
    tags: ['ท่องเที่ยว', 'สุนัข']
  },
  {
    id: '4',
    title: 'กฎหมายการเลี้ยงสัตว์ปี 2567',
    slug: 'pet-law-2024',
    excerpt: 'สิ่งที่เจ้าของสัตว์เลี้ยงควรรู้',
    featuredImage: '/images/blogs/blog4.jpg',
    publishedAt: '2024-11-22',
    createdAt: '2024-11-22',
    viewCount: 521,
    tags: ['กฎหมาย']
  },
  {
    id: '6',
    title: 'อาหารห้ามให้แมว 10 อย่าง',
    slug: 'dangerous-foods-for-cats',
    excerpt: 'อาหารที่อันตรายต่อแมว',
    featuredImage: '/images/blogs/blog6.jpg',
    publishedAt: '2024-11-20',
    createdAt: '2024-11-20',
    viewCount: 445,
    tags: ['แมว', 'อาหาร']
  }
])

const formatDate = (date: string): string => {
  const d = new Date(date)
  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatNumber = (num: number): string => {
  return num.toLocaleString('th-TH')
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/placeholder-blog.jpg'
}

// SEO
useHead({
  title: `${post.value.title} - PetCanGo`,
  meta: [
    {
      name: 'description',
      content: post.value.excerpt
    },
    {
      property: 'og:title',
      content: post.value.title
    },
    {
      property: 'og:description',
      content: post.value.excerpt
    },
    {
      property: 'og:image',
      content: post.value.featuredImage
    }
  ]
})
</script>

<style scoped>
.prose {
  @apply text-gray-800 leading-relaxed;
}

.prose h2 {
  @apply text-2xl font-bold text-gray-900 mt-8 mb-4;
}

.prose h3 {
  @apply text-xl font-bold text-gray-900 mt-6 mb-3;
}

.prose p {
  @apply mb-4;
}

.prose ul {
  @apply list-disc list-inside mb-4 ml-4 space-y-2;
}

.prose li {
  @apply text-gray-700;
}
</style>
