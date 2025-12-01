<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Error Message -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
    >
      {{ error }}
    </div>

    <!-- Basic Information -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">ข้อมูลพื้นฐาน</h2>

      <div class="space-y-5">
        <!-- Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            ชื่อที่พัก <span class="text-red-500">*</span>
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="เช่น Paradise Pet Resort"
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
            placeholder="paradise-pet-resort (จะสร้างอัตโนมัติถ้าไม่ระบุ)"
            class="input"
            :disabled="loading"
          />
          <p class="mt-1 text-xs text-gray-500">
            URL: petcango.com/hotel/{{ form.slug || 'auto-generated' }}
          </p>
        </div>

        <!-- Province & Region -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="province" class="block text-sm font-medium text-gray-700 mb-2">
              จังหวัด <span class="text-red-500">*</span>
            </label>
            <select
              id="province"
              v-model="form.province"
              required
              class="input"
              :disabled="loading"
            >
              <option value="">เลือกจังหวัด</option>
              <option v-for="province in provinces" :key="province" :value="province">
                {{ province }}
              </option>
            </select>
          </div>

          <div>
            <label for="region" class="block text-sm font-medium text-gray-700 mb-2">
              ภาค
            </label>
            <select
              id="region"
              v-model="form.region"
              class="input"
              :disabled="loading"
            >
              <option value="">เลือกภาค</option>
              <option value="central">ภาคกลาง</option>
              <option value="north">ภาคเหนือ</option>
              <option value="northeast">ภาคตะวันออกเฉียงเหนือ</option>
              <option value="east">ภาคตะวันออก</option>
              <option value="west">ภาคตะวันตก</option>
              <option value="south">ภาคใต้</option>
            </select>
          </div>
        </div>

        <!-- Short Description -->
        <div>
          <label for="shortDescription" class="block text-sm font-medium text-gray-700 mb-2">
            คำอธิบายสั้น <span class="text-red-500">*</span>
          </label>
          <textarea
            id="shortDescription"
            v-model="form.shortDescription"
            required
            rows="3"
            placeholder="สรุปสั้นๆ เกี่ยวกับที่พัก (แสดงในการ์ด)"
            class="input"
            :disabled="loading"
          ></textarea>
          <p class="mt-1 text-xs text-gray-500">
            {{ form.shortDescription.length }}/200 ตัวอักษร
          </p>
        </div>

        <!-- Full Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            คำอธิบายเต็ม
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="6"
            placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับที่พัก"
            class="input"
            :disabled="loading"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Pricing -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">ราคา</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="priceStart" class="block text-sm font-medium text-gray-700 mb-2">
            ราคาเริ่มต้น (บาท/คืน) <span class="text-red-500">*</span>
          </label>
          <input
            id="priceStart"
            v-model.number="form.priceStart"
            type="number"
            min="0"
            required
            placeholder="500"
            class="input"
            :disabled="loading"
          />
        </div>

        <div>
          <label for="priceEnd" class="block text-sm font-medium text-gray-700 mb-2">
            ราคาสูงสุด (บาท/คืน)
          </label>
          <input
            id="priceEnd"
            v-model.number="form.priceEnd"
            type="number"
            min="0"
            placeholder="2000"
            class="input"
            :disabled="loading"
          />
        </div>
      </div>
    </div>

    <!-- Contact Information -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">ข้อมูลติดต่อ</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
            เบอร์โทร
          </label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            placeholder="081-234-5678"
            class="input"
            :disabled="loading"
          />
        </div>

        <div>
          <label for="lineId" class="block text-sm font-medium text-gray-700 mb-2">
            Line ID
          </label>
          <input
            id="lineId"
            v-model="form.lineId"
            type="text"
            placeholder="@hotelname"
            class="input"
            :disabled="loading"
          />
        </div>

        <div class="md:col-span-2">
          <label for="website" class="block text-sm font-medium text-gray-700 mb-2">
            เว็บไซต์
          </label>
          <input
            id="website"
            v-model="form.website"
            type="url"
            placeholder="https://example.com"
            class="input"
            :disabled="loading"
          />
        </div>

        <div class="md:col-span-2">
          <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
            ที่อยู่
          </label>
          <textarea
            id="address"
            v-model="form.address"
            rows="3"
            placeholder="ที่อยู่เต็ม"
            class="input"
            :disabled="loading"
          ></textarea>
        </div>

        <div class="md:col-span-2">
          <label for="mapUrl" class="block text-sm font-medium text-gray-700 mb-2">
            Google Maps URL
          </label>
          <input
            id="mapUrl"
            v-model="form.mapUrl"
            type="url"
            placeholder="https://maps.google.com/..."
            class="input"
            :disabled="loading"
          />
        </div>
      </div>
    </div>

    <!-- Images -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">รูปภาพ</h2>

      <div class="space-y-4">
        <!-- Main Image -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            รูปหลัก <span class="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            @change="handleImageUpload($event, 'mainImage')"
            class="input"
            :disabled="loading"
          />
          <div v-if="form.mainImage" class="mt-2">
            <img :src="form.mainImage" alt="Preview" class="w-full max-w-md h-48 object-cover rounded-lg" />
          </div>
        </div>

        <!-- Gallery Images -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            รูปแกลเลอรี่ (สูงสุด 10 รูป)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            @change="handleGalleryUpload"
            class="input"
            :disabled="loading"
          />
          <div v-if="form.gallery.length > 0" class="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2">
            <div
              v-for="(img, index) in form.gallery"
              :key="index"
              class="relative group"
            >
              <img :src="img" alt="Gallery" class="w-full h-24 object-cover rounded-lg" />
              <button
                type="button"
                @click="removeGalleryImage(index)"
                class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Facilities -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">สิ่งอำนวยความสะดวก</h2>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <label
          v-for="facility in availableFacilities"
          :key="facility.value"
          class="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <input
            v-model="form.facilities"
            type="checkbox"
            :value="facility.value"
            class="rounded text-red-500 focus:ring-red-500"
            :disabled="loading"
          />
          <span class="text-sm">{{ facility.label }}</span>
        </label>
      </div>
    </div>

    <!-- Status & SEO -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">สถานะและ SEO</h2>

      <div class="space-y-4">
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

        <div>
          <label for="metaTitle" class="block text-sm font-medium text-gray-700 mb-2">
            Meta Title (SEO)
          </label>
          <input
            id="metaTitle"
            v-model="form.metaTitle"
            type="text"
            placeholder="จะใช้ชื่อที่พักถ้าไม่ระบุ"
            class="input"
            :disabled="loading"
          />
        </div>

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

    <!-- Submit Buttons -->
    <div class="flex items-center justify-end space-x-3">
      <NuxtLink
        to="/admin/hotels"
        class="btn btn-outline"
      >
        ยกเลิก
      </NuxtLink>
      <button
        type="submit"
        :disabled="loading"
        class="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'กำลังบันทึก...' : (hotelId ? 'อัปเดตที่พัก' : 'สร้างที่พัก') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{
  hotelId?: string
}>()

const emit = defineEmits(['success'])

const loading = ref(false)
const error = ref<string | null>(null)

// Form data
const form = ref({
  name: '',
  slug: '',
  province: '',
  region: '',
  shortDescription: '',
  description: '',
  priceStart: 0,
  priceEnd: 0,
  phone: '',
  lineId: '',
  website: '',
  address: '',
  mapUrl: '',
  mainImage: '',
  gallery: [] as string[],
  facilities: [] as string[],
  status: 'draft',
  metaTitle: '',
  metaDescription: ''
})

// Provinces list
const provinces = ref([
  'กรุงเทพมหานคร', 'ชลบุรี', 'ภูเก็ต', 'เชียงใหม่', 'เชียงราย',
  'กระบี่', 'ปทุมธานี', 'นครราชสีมา', 'ระยอง', 'พัทยา',
  'หัวหิน', 'เพชรบุรี', 'ประจวบคีรีขันธ์', 'สมุทรปราการ', 'นนทบุรี'
])

// Available facilities
const availableFacilities = ref([
  { value: 'wifi', label: 'WiFi' },
  { value: 'parking', label: 'ที่จอดรถ' },
  { value: 'pool', label: 'สระว่ายน้ำ' },
  { value: 'restaurant', label: 'ร้านอาหาร' },
  { value: 'ac', label: 'เครื่องปรับอากาศ' },
  { value: 'tv', label: 'ทีวี' },
  { value: 'fridge', label: 'ตู้เย็น' },
  { value: 'bath', label: 'อ่างอาบน้ำ' },
  { value: 'waterheater', label: 'เครื่องทำน้ำอุ่น' },
  { value: 'fitness', label: 'ฟิตเนส' },
  { value: 'spa', label: 'สปา' },
  { value: 'laundry', label: 'บริการซักผ้า' }
])

// Handle image upload
const handleImageUpload = async (event: Event, field: string) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // TODO: Upload to Firebase Storage
  // For now, create a local preview
  const reader = new FileReader()
  reader.onload = (e) => {
    if (field === 'mainImage') {
      form.value.mainImage = e.target?.result as string
    }
  }
  reader.readAsDataURL(file)
}

// Handle gallery upload
const handleGalleryUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])

  if (form.value.gallery.length + files.length > 10) {
    error.value = 'สามารถอัปโหลดได้สูงสุด 10 รูป'
    return
  }

  // TODO: Upload to Firebase Storage
  // For now, create local previews
  for (const file of files) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.gallery.push(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }
}

// Remove gallery image
const removeGalleryImage = (index: number) => {
  form.value.gallery.splice(index, 1)
}

// Generate slug from name
watch(() => form.value.name, (newName) => {
  if (!props.hotelId && !form.value.slug) {
    form.value.slug = newName
      .toLowerCase()
      .replace(/[^\u0E00-\u0E7Fa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
  }
})

// Submit form
const handleSubmit = async () => {
  error.value = null
  loading.value = true

  try {
    // Validation
    if (!form.value.name || !form.value.province || !form.value.shortDescription) {
      throw new Error('กรุณากรอกข้อมูลที่จำเป็น')
    }

    if (!form.value.mainImage) {
      throw new Error('กรุณาอัปโหลดรูปหลัก')
    }

    // Generate slug if not provided
    if (!form.value.slug) {
      form.value.slug = form.value.name
        .toLowerCase()
        .replace(/[^\u0E00-\u0E7Fa-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
    }

    // TODO: Save to Firestore
    if (props.hotelId) {
      // Update existing hotel
      // await updateDocument('hotels', props.hotelId, form.value)
      console.log('Update hotel:', props.hotelId, form.value)
    } else {
      // Create new hotel
      // await addDocument('hotels', {
      //   ...form.value,
      //   createdAt: new Date().toISOString(),
      //   viewCount: 0
      // })
      console.log('Create hotel:', form.value)
    }

    emit('success')
    navigateTo('/admin/hotels')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

// Load hotel data if editing
onMounted(async () => {
  if (props.hotelId) {
    // TODO: Load from Firestore
    // const hotel = await getDocument('hotels', props.hotelId)
    // if (hotel) {
    //   Object.assign(form.value, hotel)
    // }
  }
})
</script>
