<template>
  <div class="blog-page">
    <template v-if="post">
    <!-- Hero Image -->
    <section class="relative h-[500px] overflow-hidden bg-gray-900">
      <img
        :src="post.featuredImage || '/images/placeholder-blog.jpg'"
        :alt="`${post.title} - บทความ PetCanGo`"
        :title="post.title"
        loading="lazy"
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
              <!-- Main Image -->
              <div v-if="mainImage" class="mb-8">
                <img
                  :src="mainImage"
                  :alt="`${post.title} - รูปภาพประกอบบทความ`"
                  :title="post.title"
                  loading="lazy"
                  class="w-full h-auto rounded-lg shadow-md"
                  @error="handleImageError"
                />
              </div>

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
                  <button @click="shareOnFacebook" class="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </button>
                  <button @click="shareOnLine" class="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                    </svg>
                    Line
                  </button>
                  <button @click="copyLink" class="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                    </svg>
                    {{ copyText }}
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
                      :alt="`${related.title} - บทความที่เกี่ยวข้อง`"
                      :title="related.title"
                      loading="lazy"
                      class="w-full h-32 object-cover rounded-lg mb-2 group-hover:opacity-90 transition-opacity"
                      @error="handleImageError"
                    />
                    <h4 class="font-medium text-gray-900 group-hover:text-primary-500 transition-colors line-clamp-2">
                      {{ related.title }}
                    </h4>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ formatDate(related.publishedAt || related.createdAt) }}
                    </p>
                  </NuxtLink>
                </div>

                <NuxtLink to="/blogs" class="block mt-6 text-center text-primary-500 hover:text-primary-600 font-medium">
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
    </template>

    <!-- Loading State -->
    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p class="text-gray-600">กำลังโหลด...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { getBlogBySlug, getLatestBlogs } = useBlogs()
const { setArticleSEO } = useSEO()
const { trackPageView } = usePageView()

// Data
const post = ref<any>(null)
const relatedPosts = ref<any[]>([])
const otherPosts = ref<any[]>([])
const isLoading = ref(true)

// Fallback mock data if blog not found
const mockPost = {
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
}

// Main image computed - use featuredImage or image field
const mainImage = computed(() => {
  if (!post.value) return ''
  return post.value.featuredImage || post.value.image || post.value.coverImage || ''
})

// Share functions
const copyText = ref('คัดลอกลิงก์')

const shareOnFacebook = () => {
  const url = encodeURIComponent(window.location.href)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400')
}

const shareOnLine = () => {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(post.value?.title || '')
  window.open(`https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`, '_blank', 'width=600,height=400')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copyText.value = 'คัดลอกแล้ว!'
    setTimeout(() => {
      copyText.value = 'คัดลอกลิงก์'
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

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

// Load blog data from Firestore
onMounted(async () => {
  isLoading.value = true

  try {
    // Get blog by slug
    const blogData = await getBlogBySlug(slug)

    if (blogData) {
      post.value = blogData

      // Set SEO with structured data
      setArticleSEO({
        title: blogData.title,
        excerpt: blogData.excerpt,
        image: blogData.featuredImage,
        publishedAt: blogData.publishedAt || blogData.createdAt,
        modifiedAt: blogData.updatedAt,
        tags: blogData.tags,
        slug: slug
      })

      // Track pageview
      trackPageView('blog', blogData.id)
    } else {
      // Use mock data if not found
      post.value = mockPost
    }

    // Get other posts for sidebar and bottom section
    const latestBlogs = await getLatestBlogs(6)
    const filtered = latestBlogs.filter((b: any) => b.slug !== slug)
    relatedPosts.value = filtered.slice(0, 2)
    otherPosts.value = filtered.slice(2, 5)

  } catch (error) {
    console.error('Error loading blog:', error)
    post.value = mockPost
  }

  isLoading.value = false
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
