<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Error Message -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
    >
      {{ error }}
    </div>

    <!-- ข้อมูลพื้นฐาน -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">ข้อมูลพื้นฐาน</h2>

      <div class="space-y-5">
        <!-- ชื่อบทความ -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            ชื่อบทความ <span class="text-red-500">*</span>
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            placeholder="เช่น อาหารอะไรดีต่อสุนัข?"
            class="input"
            :disabled="loading"
          />
        </div>

        <!-- Slug -->
        <div>
          <label for="slug" class="block text-sm font-medium text-gray-700 mb-2">
            Slug (URL)
          </label>
          <input
            id="slug"
            v-model="form.slug"
            type="text"
            placeholder="best-food-for-dogs (จะสร้างอัตโนมัติถ้าไม่ระบุ)"
            class="input"
            :disabled="loading"
          />
          <p class="mt-1 text-xs text-gray-500">
            URL: petcango.com/blogs/{{ form.slug || 'auto-generated' }}
          </p>
        </div>

        <!-- คำอธิบายสั้น -->
        <div>
          <label for="excerpt" class="block text-sm font-medium text-gray-700 mb-2">
            คำอธิบายสั้น <span class="text-red-500">*</span>
          </label>
          <textarea
            id="excerpt"
            v-model="form.excerpt"
            required
            rows="3"
            placeholder="สรุปสั้นๆ เกี่ยวกับบทความ (แสดงในการ์ด)"
            class="input"
            :disabled="loading"
          ></textarea>
          <p class="mt-1 text-xs text-gray-500">
            {{ form.excerpt.length }}/300 ตัวอักษร
          </p>
        </div>

        <!-- เนื้อหาบทความ -->
        <div>
          <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
            เนื้อหาบทความ <span class="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            v-model="form.content"
            required
            rows="15"
            placeholder="เขียนเนื้อหาบทความที่นี่... (รองรับ HTML)"
            class="input font-mono text-sm"
            :disabled="loading"
          ></textarea>
          <p class="mt-1 text-xs text-gray-500">
            รองรับ HTML tags: &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;, &lt;img&gt;
          </p>
        </div>
      </div>
    </div>

    <!-- รูปภาพ -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">รูปภาพ</h2>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          รูปหน้าปก <span class="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="image/*"
          @change="handleImageUpload"
          class="input"
          :disabled="loading"
        />
        <div v-if="form.featuredImage" class="mt-2">
          <img :src="form.featuredImage" alt="Preview" class="w-full max-w-2xl h-64 object-cover rounded-lg" />
        </div>
      </div>
    </div>

    <!-- แท็ก -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">แท็ก</h2>

      <div>
        <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
          แท็กบทความ (แยกด้วยเครื่องหมายจุลภาค)
        </label>
        <input
          id="tags"
          v-model="tagsText"
          type="text"
          placeholder="เช่น อาหาร, สุนัข, สุขภาพ"
          class="input"
          :disabled="loading"
        />
        <div v-if="form.tags.length > 0" class="mt-3 flex flex-wrap gap-2">
          <span
            v-for="(tag, index) in form.tags"
            :key="index"
            class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center space-x-2"
          >
            <span>{{ tag }}</span>
            <button
              type="button"
              @click="removeTag(index)"
              class="hover:text-red-900"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </span>
        </div>
      </div>
    </div>

    <!-- สถานะและ SEO -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">สถานะและ SEO</h2>

      <div class="space-y-4">
        <!-- สถานะ -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
            สถานะ
          </label>
          <select
            id="status"
            v-model="form.status"
            class="input"
            :disabled="loading"
          >
            <option value="draft">แบบร่าง</option>
            <option value="published">เผยแพร่</option>
          </select>
        </div>

        <!-- วันที่เผยแพร่ -->
        <div>
          <label for="publishedAt" class="block text-sm font-medium text-gray-700 mb-2">
            วันที่เผยแพร่
          </label>
          <input
            id="publishedAt"
            v-model="form.publishedAt"
            type="date"
            class="input"
            :disabled="loading"
          />
          <p class="mt-1 text-xs text-gray-500">
            เว้นว่างไว้เพื่อใช้วันที่ปัจจุบัน
          </p>
        </div>

        <!-- Meta Title -->
        <div>
          <label for="metaTitle" class="block text-sm font-medium text-gray-700 mb-2">
            Meta Title (SEO)
          </label>
          <input
            id="metaTitle"
            v-model="form.metaTitle"
            type="text"
            placeholder="จะใช้ชื่อบทความถ้าไม่ระบุ"
            class="input"
            :disabled="loading"
          />
        </div>

        <!-- Meta Description -->
        <div>
          <label for="metaDescription" class="block text-sm font-medium text-gray-700 mb-2">
            Meta Description (SEO)
          </label>
          <textarea
            id="metaDescription"
            v-model="form.metaDescription"
            rows="3"
            placeholder="จะใช้คำอธิบายสั้นถ้าไม่ระบุ"
            class="input"
            :disabled="loading"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- ปุ่มส่งฟอร์ม -->
    <div class="flex items-center justify-end space-x-3">
      <NuxtLink
        to="/admin/blogs"
        class="btn btn-outline"
      >
        ยกเลิก
      </NuxtLink>
      <button
        type="submit"
        :disabled="loading"
        class="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'กำลังบันทึก...' : (blogId ? 'อัปเดตบทความ' : 'เผยแพร่บทความ') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{
  blogId?: string
}>()

const emit = defineEmits(['success'])

const loading = ref(false)
const error = ref<string | null>(null)

// Form data
const form = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  tags: [] as string[],
  status: 'draft',
  publishedAt: '',
  metaTitle: '',
  metaDescription: ''
})

const tagsText = ref('')

// จัดการอัปโหลดรูปภาพ
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // TODO: อัปโหลดไปยัง Firebase Storage
  // สำหรับตอนนี้ สร้าง preview ในเครื่อง
  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.featuredImage = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

// ลบแท็ก
const removeTag = (index: number) => {
  form.value.tags.splice(index, 1)
  tagsText.value = form.value.tags.join(', ')
}

// สร้าง slug จากชื่อ
watch(() => form.value.title, (newTitle) => {
  if (!props.blogId && !form.value.slug) {
    form.value.slug = newTitle
      .toLowerCase()
      .replace(/[^\u0E00-\u0E7Fa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
  }
})

// อัปเดตแท็กจาก text input
watch(tagsText, (newText) => {
  if (newText) {
    form.value.tags = newText
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag)
  } else {
    form.value.tags = []
  }
})

// ส่งฟอร์ม
const handleSubmit = async () => {
  error.value = null
  loading.value = true

  try {
    // ตรวจสอบข้อมูล
    if (!form.value.title || !form.value.excerpt || !form.value.content) {
      throw new Error('กรุณากรอกข้อมูลที่จำเป็น')
    }

    if (!form.value.featuredImage) {
      throw new Error('กรุณาอัปโหลดรูปหน้าปก')
    }

    // สร้าง slug ถ้าไม่ได้ระบุ
    if (!form.value.slug) {
      form.value.slug = form.value.title
        .toLowerCase()
        .replace(/[^\u0E00-\u0E7Fa-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
    }

    // กำหนดวันที่เผยแพร่
    if (form.value.status === 'published' && !form.value.publishedAt) {
      form.value.publishedAt = new Date().toISOString().split('T')[0]
    }

    // TODO: บันทึกลง Firestore
    if (props.blogId) {
      // อัปเดตบทความที่มีอยู่
      // await updateDocument('blogs', props.blogId, form.value)
      console.log('อัปเดตบทความ:', props.blogId, form.value)
    } else {
      // สร้างบทความใหม่
      // await addDocument('blogs', {
      //   ...form.value,
      //   createdAt: new Date().toISOString(),
      //   viewCount: 0
      // })
      console.log('สร้างบทความใหม่:', form.value)
    }

    emit('success')
    navigateTo('/admin/blogs')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

// โหลดข้อมูลบทความถ้าเป็นการแก้ไข
onMounted(async () => {
  if (props.blogId) {
    // TODO: โหลดจาก Firestore
    // const blog = await getDocument('blogs', props.blogId)
    // if (blog) {
    //   Object.assign(form.value, blog)
    //   tagsText.value = blog.tags?.join(', ') || ''
    // }
  }
})
</script>
