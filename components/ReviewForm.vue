<template>
  <div class="bg-white rounded-lg p-6 border border-gray-200">
    <h3 class="text-lg font-bold text-gray-900 mb-4">เขียนรีวิว</h3>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Error Message -->
      <div
        v-if="error"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
      >
        {{ error }}
      </div>

      <!-- Rating -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          ให้คะแนน <span class="text-red-500">*</span>
        </label>
        <StarRating
          v-model="form.rating"
          :readonly="false"
          size="lg"
          :show-rating="true"
        />
      </div>

      <!-- Comment -->
      <div>
        <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">
          รีวิวของคุณ <span class="text-red-500">*</span>
        </label>
        <textarea
          id="comment"
          v-model="form.comment"
          rows="4"
          required
          placeholder="บอกเล่าประสบการณ์ของคุณ..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
          :disabled="submitting"
        ></textarea>
        <p class="mt-1 text-xs text-gray-500">อย่างน้อย 10 ตัวอักษร</p>
      </div>

      <!-- Image Upload -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          อัปโหลดรูปภาพ (ไม่บังคับ)
        </label>
        <div class="flex items-center space-x-4">
          <label
            class="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 transition-colors"
          >
            <svg class="w-6 h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="text-sm text-gray-600">เพิ่มรูปภาพ</span>
            <input
              type="file"
              accept="image/*"
              multiple
              class="hidden"
              @change="handleImageUpload"
              :disabled="submitting"
            />
          </label>
          <p class="text-xs text-gray-500">สูงสุด 5 รูป</p>
        </div>

        <!-- Preview Images -->
        <div v-if="previewImages.length > 0" class="grid grid-cols-5 gap-2 mt-4">
          <div
            v-for="(image, index) in previewImages"
            :key="index"
            class="relative group"
          >
            <img
              :src="image"
              alt="Preview"
              class="w-full h-20 object-cover rounded-lg"
            />
            <button
              type="button"
              @click="removeImage(index)"
              class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex space-x-4">
        <button
          type="submit"
          :disabled="submitting || form.rating === 0"
          class="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <svg
            v-if="submitting"
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ submitting ? 'กำลังบันทึก...' : 'บันทึกรีวิว' }}</span>
        </button>

        <button
          v-if="onCancel"
          type="button"
          @click="onCancel"
          :disabled="submitting"
          class="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  hotelId: string
  onCancel?: () => void
}>()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const { user } = useAuth()
const { createReview, error: reviewError } = useReviews()
const { uploadImage } = useFileUpload()

const submitting = ref(false)
const error = ref<string | null>(null)

const form = ref({
  rating: 0,
  comment: '',
  images: [] as File[]
})

const previewImages = ref<string[]>([])

/**
 * Handle image upload
 */
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (!files) return

  // จำกัดไม่เกิน 5 รูป
  const remainingSlots = 5 - form.value.images.length
  const filesToAdd = Array.from(files).slice(0, remainingSlots)

  for (const file of filesToAdd) {
    // Validate image
    if (!file.type.startsWith('image/')) {
      continue
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('รูปภาพต้องมีขนาดไม่เกิน 5 MB')
      continue
    }

    form.value.images.push(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImages.value.push(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Reset input
  target.value = ''
}

/**
 * Remove image
 */
const removeImage = (index: number) => {
  form.value.images.splice(index, 1)
  previewImages.value.splice(index, 1)
}

/**
 * Handle submit
 */
const handleSubmit = async () => {
  if (!user.value) {
    error.value = 'กรุณาเข้าสู่ระบบก่อนเขียนรีวิว'
    return
  }

  if (form.value.rating === 0) {
    error.value = 'กรุณาให้คะแนน'
    return
  }

  if (form.value.comment.length < 10) {
    error.value = 'กรุณาเขียนรีวิวอย่างน้อย 10 ตัวอักษร'
    return
  }

  try {
    submitting.value = true
    error.value = null

    // Upload images to Firebase Storage
    const uploadedImageUrls: string[] = []

    for (const imageFile of form.value.images) {
      const url = await uploadImage(imageFile, 'reviews', props.hotelId)
      if (url) {
        uploadedImageUrls.push(url)
      }
    }

    // Create review
    await createReview({
      hotelId: props.hotelId,
      userId: user.value.uid,
      userName: user.value.displayName || user.value.email?.split('@')[0] || 'ผู้ใช้งาน',
      userPhoto: user.value.photoURL || '',
      rating: form.value.rating,
      comment: form.value.comment,
      images: uploadedImageUrls
    })

    // Reset form
    form.value = {
      rating: 0,
      comment: '',
      images: []
    }
    previewImages.value = []

    emit('success')

  } catch (err: any) {
    console.error('Failed to submit review:', err)
    error.value = reviewError.value || 'ไม่สามารถบันทึกรีวิวได้'
  } finally {
    submitting.value = false
  }
}
</script>
