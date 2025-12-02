<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <NuxtLink
            to="/backend/blogs"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
          </NuxtLink>
          <h1 class="text-3xl font-bold text-white">แก้ไขบทความ</h1>
        </div>
        <p class="text-gray-400">แก้ไขข้อมูลบทความ</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <svg class="w-12 h-12 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-900/20 border border-red-800 text-red-400 px-6 py-4 rounded-lg">
      {{ error }}
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Title -->
          <div class="bg-gray-800 rounded-xl p-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              หัวข้อบทความ <span class="text-red-400">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              placeholder="ใส่หัวข้อบทความ"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <!-- Slug -->
          <div class="bg-gray-800 rounded-xl p-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Slug (URL)
            </label>
            <input
              v-model="form.slug"
              type="text"
              placeholder="slug-url-of-article"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <p class="text-xs text-gray-500 mt-2">ใช้สำหรับ URL เช่น /blogs/slug-url-of-article</p>
          </div>

          <!-- Excerpt -->
          <div class="bg-gray-800 rounded-xl p-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              คำอธิบายย่อ
            </label>
            <textarea
              v-model="form.excerpt"
              rows="3"
              placeholder="คำอธิบายสั้นๆ เกี่ยวกับบทความ"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
            />
          </div>

          <!-- Content -->
          <div class="bg-gray-800 rounded-xl p-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              เนื้อหา <span class="text-red-400">*</span>
            </label>
            <textarea
              v-model="form.content"
              rows="15"
              required
              placeholder="เนื้อหาบทความ (รองรับ HTML)"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none font-mono text-sm"
            />
            <p class="text-xs text-gray-500 mt-2">รองรับ HTML tags เช่น &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt; เป็นต้น</p>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Status -->
          <div class="bg-gray-800 rounded-xl p-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              สถานะ
            </label>
            <select
              v-model="form.status"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="draft">แบบร่าง</option>
              <option value="published">เผยแพร่</option>
            </select>
          </div>

          <!-- Featured Image -->
          <div class="bg-gray-800 rounded-xl p-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              รูปภาพหน้าปก
            </label>
            <div v-if="form.featuredImage" class="mb-4">
              <img
                :src="form.featuredImage"
                alt="Featured"
                class="w-full h-40 object-cover rounded-lg"
              />
            </div>
            <input
              v-model="form.featuredImage"
              type="url"
              placeholder="URL รูปภาพ"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <!-- Category -->
          <div class="bg-gray-800 rounded-xl p-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              หมวดหมู่
            </label>
            <input
              v-model="form.category"
              type="text"
              placeholder="เช่น เคล็ดลับ, รีวิว"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <!-- Tags -->
          <div class="bg-gray-800 rounded-xl p-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <input
              v-model="tagsInput"
              type="text"
              placeholder="แยกด้วยเครื่องหมาย ,"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <p class="text-xs text-gray-500 mt-2">เช่น: สุนัข, แมว, ที่พัก</p>
          </div>

          <!-- Actions -->
          <div class="bg-gray-800 rounded-xl p-6 space-y-3">
            <button
              type="submit"
              :disabled="saving"
              class="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg v-if="saving" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span>{{ saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง' }}</span>
            </button>

            <NuxtLink
              to="/backend/blogs"
              class="w-full block text-center bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              ยกเลิก
            </NuxtLink>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'backend'
})

const route = useRoute()
const blogId = route.params.id as string

const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)

const form = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  category: '',
  status: 'draft',
  tags: [] as string[]
})

const tagsInput = ref('')

// Load blog data
const loadBlog = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await $fetch(`/api/blogs/${blogId}`) as any

    if (response.data) {
      const blog = response.data
      form.value = {
        title: blog.title || '',
        slug: blog.slug || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        featuredImage: blog.featuredImage || '',
        category: blog.category || '',
        status: blog.status || 'draft',
        tags: blog.tags || []
      }
      tagsInput.value = (blog.tags || []).join(', ')
    }
  } catch (err: any) {
    console.error('Failed to load blog:', err)
    error.value = err.message || 'ไม่สามารถโหลดข้อมูลบทความได้'
  } finally {
    loading.value = false
  }
}

// Handle form submit
const handleSubmit = async () => {
  try {
    saving.value = true

    // Parse tags
    const tags = tagsInput.value
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)

    await $fetch(`/api/blogs/${blogId}`, {
      method: 'PATCH',
      body: {
        ...form.value,
        tags,
        updatedAt: new Date().toISOString(),
        publishedAt: form.value.status === 'published' ? new Date().toISOString() : null
      }
    })

    alert('บันทึกสำเร็จ')
    navigateTo('/backend/blogs')
  } catch (err: any) {
    console.error('Failed to save blog:', err)
    alert(err.message || 'ไม่สามารถบันทึกได้')
  } finally {
    saving.value = false
  }
}

// Load data on mount
onMounted(() => {
  loadBlog()
})

// SEO
useHead({
  title: 'แก้ไขบทความ | Backend - PetCanGo'
})
</script>
