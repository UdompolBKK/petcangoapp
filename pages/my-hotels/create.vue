<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <section class="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-8">
      <div class="container-custom">
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/my-hotels"
            class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </NuxtLink>
          <div>
            <h1 class="text-2xl md:text-3xl font-bold">ลงประกาศที่พักใหม่</h1>
            <p class="text-white/80">กรอกข้อมูลที่พักของคุณเพื่อลงประกาศฟรี</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Form -->
    <section class="py-8">
      <div class="container-custom max-w-4xl">
        <form @submit.prevent="submitForm" class="space-y-8">
          <!-- Basic Information -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              ข้อมูลพื้นฐาน
            </h2>

            <div class="grid gap-6">
              <!-- Hotel Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อที่พัก <span class="text-primary-500">*</span>
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="เช่น Pet Hotel สุขุมวิท"
                  class="input"
                />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  รายละเอียด <span class="text-primary-500">*</span>
                </label>
                <textarea
                  v-model="form.description"
                  required
                  rows="4"
                  placeholder="อธิบายรายละเอียดที่พักของคุณ บริการที่มี สิ่งอำนวยความสะดวก ฯลฯ"
                  class="input"
                ></textarea>
              </div>

              <!-- Hotel Type -->
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    ประเภทที่พัก <span class="text-primary-500">*</span>
                  </label>
                  <select v-model="form.type" required class="input">
                    <option value="">เลือกประเภท</option>
                    <option value="hotel">โรงแรมสัตว์เลี้ยง</option>
                    <option value="boarding">รับฝากเลี้ยง</option>
                    <option value="daycare">รับเลี้ยงรายวัน</option>
                    <option value="clinic">คลินิก/โรงพยาบาล</option>
                    <option value="grooming">ร้านอาบน้ำตัดขน</option>
                    <option value="cafe">คาเฟ่สัตว์เลี้ยง</option>
                    <option value="other">อื่นๆ</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    สัตว์เลี้ยงที่รับ <span class="text-primary-500">*</span>
                  </label>
                  <div class="flex flex-wrap gap-3">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" v-model="form.petTypes" value="dog" class="w-4 h-4 text-primary-500 rounded">
                      <span class="text-sm">สุนัข</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" v-model="form.petTypes" value="cat" class="w-4 h-4 text-primary-500 rounded">
                      <span class="text-sm">แมว</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" v-model="form.petTypes" value="bird" class="w-4 h-4 text-primary-500 rounded">
                      <span class="text-sm">นก</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" v-model="form.petTypes" value="rabbit" class="w-4 h-4 text-primary-500 rounded">
                      <span class="text-sm">กระต่าย</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" v-model="form.petTypes" value="other" class="w-4 h-4 text-primary-500 rounded">
                      <span class="text-sm">อื่นๆ</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Location -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              ที่ตั้ง
            </h2>

            <div class="grid gap-6">
              <div class="grid md:grid-cols-2 gap-6">
                <!-- Province -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    จังหวัด <span class="text-primary-500">*</span>
                  </label>
                  <select v-model="form.province" required class="input">
                    <option value="">เลือกจังหวัด</option>
                    <option v-for="province in provinces" :key="province" :value="province">
                      {{ province }}
                    </option>
                  </select>
                </div>

                <!-- District -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    เขต/อำเภอ <span class="text-primary-500">*</span>
                  </label>
                  <input
                    v-model="form.district"
                    type="text"
                    required
                    placeholder="เช่น วัฒนา"
                    class="input"
                  />
                </div>
              </div>

              <!-- Address -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  ที่อยู่ <span class="text-primary-500">*</span>
                </label>
                <textarea
                  v-model="form.address"
                  required
                  rows="2"
                  placeholder="เลขที่ ถนน ซอย แขวง/ตำบล"
                  class="input"
                ></textarea>
              </div>

              <!-- Google Maps Link -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  ลิงก์ Google Maps
                </label>
                <input
                  v-model="form.googleMapsUrl"
                  type="url"
                  placeholder="https://maps.google.com/..."
                  class="input"
                />
                <p class="mt-1 text-sm text-gray-500">วางลิงก์จาก Google Maps เพื่อให้ลูกค้าหาที่พักได้ง่าย</p>
              </div>
            </div>
          </div>

          <!-- Contact -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              ข้อมูลติดต่อ
            </h2>

            <div class="grid md:grid-cols-2 gap-6">
              <!-- Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  เบอร์โทรศัพท์ <span class="text-primary-500">*</span>
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  required
                  placeholder="0XX-XXX-XXXX"
                  class="input"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  อีเมล
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="example@email.com"
                  class="input"
                />
              </div>

              <!-- Line ID -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Line ID
                </label>
                <input
                  v-model="form.lineId"
                  type="text"
                  placeholder="@yourlineid"
                  class="input"
                />
              </div>

              <!-- Website -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  เว็บไซต์
                </label>
                <input
                  v-model="form.website"
                  type="url"
                  placeholder="https://www.example.com"
                  class="input"
                />
              </div>

              <!-- Facebook -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  v-model="form.facebook"
                  type="url"
                  placeholder="https://www.facebook.com/yourpage"
                  class="input"
                />
              </div>

              <!-- Instagram -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  v-model="form.instagram"
                  type="text"
                  placeholder="@yourinsta"
                  class="input"
                />
              </div>
            </div>
          </div>

          <!-- Price & Services -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              ราคาและบริการ
            </h2>

            <div class="grid gap-6">
              <div class="grid md:grid-cols-2 gap-6">
                <!-- Price Start -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    ราคาเริ่มต้น (บาท/คืน) <span class="text-primary-500">*</span>
                  </label>
                  <input
                    v-model.number="form.priceStart"
                    type="number"
                    required
                    min="0"
                    placeholder="500"
                    class="input"
                  />
                </div>

                <!-- Price End -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    ราคาสูงสุด (บาท/คืน)
                  </label>
                  <input
                    v-model.number="form.priceEnd"
                    type="number"
                    min="0"
                    placeholder="2000"
                    class="input"
                  />
                </div>
              </div>

              <!-- Services/Facilities -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  บริการและสิ่งอำนวยความสะดวก
                </label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <label v-for="facility in facilityOptions" :key="facility.value" class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="form.facilities" :value="facility.value" class="w-4 h-4 text-primary-500 rounded">
                    <span class="text-sm">{{ facility.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Images -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              รูปภาพ
            </h2>

            <!-- Image Upload -->
            <div class="space-y-4">
              <div
                @click="$refs.fileInput.click()"
                @dragover.prevent
                @drop.prevent="handleDrop"
                class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-colors"
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  multiple
                  class="hidden"
                  @change="handleFileSelect"
                />
                <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                <p class="text-gray-600 mb-1">คลิกหรือลากไฟล์มาวาง</p>
                <p class="text-sm text-gray-400">รองรับไฟล์ PNG, JPG, WEBP ขนาดไม่เกิน 5MB</p>
              </div>

              <!-- Image Preview -->
              <div v-if="form.imageFiles.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  v-for="(image, index) in form.imageFiles"
                  :key="index"
                  class="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
                >
                  <img :src="image.preview" class="w-full h-full object-cover" />
                  <button
                    @click="removeImage(index)"
                    type="button"
                    class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                  <div
                    v-if="index === 0"
                    class="absolute bottom-2 left-2 px-2 py-1 bg-primary-500 text-white text-xs rounded-full"
                  >
                    รูปหลัก
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Operating Hours -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              เวลาทำการ
            </h2>

            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  เปิด
                </label>
                <input
                  v-model="form.openTime"
                  type="time"
                  class="input"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  ปิด
                </label>
                <input
                  v-model="form.closeTime"
                  type="time"
                  class="input"
                />
              </div>
            </div>

            <div class="mt-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="form.is24Hours" class="w-4 h-4 text-primary-500 rounded">
                <span class="text-sm">เปิดให้บริการ 24 ชั่วโมง</span>
              </label>
            </div>
          </div>

          <!-- Terms -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-yellow-800 mb-2">ข้อตกลงและเงื่อนไข</h3>
                <ul class="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                  <li>ข้อมูลที่พักจะถูกตรวจสอบโดยทีมงานก่อนเผยแพร่</li>
                  <li>กรุณากรอกข้อมูลที่ถูกต้องและเป็นปัจจุบัน</li>
                  <li>รูปภาพต้องเป็นรูปจริงของสถานที่</li>
                  <li>การลงประกาศเท็จจะถูกลบออกจากระบบ</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-xl transition-colors disabled:opacity-50"
            >
              <svg v-if="submitting" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
              {{ submitting ? 'กำลังส่ง...' : 'ส่งเพื่อตรวจสอบ' }}
            </button>
            <button
              type="button"
              @click="saveDraft"
              :disabled="submitting"
              class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-8 rounded-xl transition-colors disabled:opacity-50"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
              </svg>
              บันทึกฉบับร่าง
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

useHead({
  title: 'ลงประกาศที่พักใหม่ - PetCanGo'
})

const { user } = useAuth()
const router = useRouter()

const submitting = ref(false)

const form = reactive({
  name: '',
  description: '',
  type: '',
  petTypes: [] as string[],
  province: '',
  district: '',
  address: '',
  googleMapsUrl: '',
  phone: '',
  email: '',
  lineId: '',
  website: '',
  facebook: '',
  instagram: '',
  priceStart: null as number | null,
  priceEnd: null as number | null,
  facilities: [] as string[],
  openTime: '09:00',
  closeTime: '18:00',
  is24Hours: false,
  imageFiles: [] as { file: File; preview: string }[]
})

const provinces = [
  'กรุงเทพมหานคร', 'กระบี่', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร',
  'ขอนแก่น', 'จันทบุรี', 'ฉะเชิงเทรา', 'ชลบุรี', 'ชัยนาท',
  'ชัยภูมิ', 'ชุมพร', 'เชียงราย', 'เชียงใหม่', 'ตรัง',
  'ตราด', 'ตาก', 'นครนายก', 'นครปฐม', 'นครพนม',
  'นครราชสีมา', 'นครศรีธรรมราช', 'นครสวรรค์', 'นนทบุรี', 'นราธิวาส',
  'น่าน', 'บึงกาฬ', 'บุรีรัมย์', 'ปทุมธานี', 'ประจวบคีรีขันธ์',
  'ปราจีนบุรี', 'ปัตตานี', 'พระนครศรีอยุธยา', 'พะเยา', 'พังงา',
  'พัทลุง', 'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์',
  'แพร่', 'ภูเก็ต', 'มหาสารคาม', 'มุกดาหาร', 'แม่ฮ่องสอน',
  'ยโสธร', 'ยะลา', 'ร้อยเอ็ด', 'ระนอง', 'ระยอง',
  'ราชบุรี', 'ลพบุรี', 'ลำปาง', 'ลำพูน', 'เลย',
  'ศรีสะเกษ', 'สกลนคร', 'สงขลา', 'สตูล', 'สมุทรปราการ',
  'สมุทรสงคราม', 'สมุทรสาคร', 'สระแก้ว', 'สระบุรี', 'สิงห์บุรี',
  'สุโขทัย', 'สุพรรณบุรี', 'สุราษฎร์ธานี', 'สุรินทร์', 'หนองคาย',
  'หนองบัวลำภู', 'อ่างทอง', 'อำนาจเจริญ', 'อุดรธานี', 'อุตรดิตถ์',
  'อุทัยธานี', 'อุบลราชธานี'
]

const facilityOptions = [
  { value: 'aircon', label: 'แอร์' },
  { value: 'cctv', label: 'กล้อง CCTV' },
  { value: 'playground', label: 'สนามเด็กเล่น' },
  { value: 'grooming', label: 'บริการอาบน้ำตัดขน' },
  { value: 'pickup', label: 'บริการรับ-ส่ง' },
  { value: 'vet', label: 'สัตวแพทย์' },
  { value: 'swimming', label: 'สระว่ายน้ำ' },
  { value: 'training', label: 'ฝึกสุนัข' },
  { value: 'daycare', label: 'เลี้ยงรายวัน' },
  { value: 'food', label: 'อาหารพร้อม' },
  { value: 'medicine', label: 'บริการป้อนยา' },
  { value: 'webcam', label: 'ดูผ่านกล้องออนไลน์' }
]

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    addFiles(Array.from(input.files))
  }
}

const handleDrop = (event: DragEvent) => {
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

const addFiles = (files: File[]) => {
  const imageFiles = files.filter(file => file.type.startsWith('image/'))

  for (const file of imageFiles) {
    if (file.size > 5 * 1024 * 1024) {
      alert(`ไฟล์ ${file.name} ใหญ่เกินไป (สูงสุด 5MB)`)
      continue
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      form.imageFiles.push({
        file,
        preview: e.target?.result as string
      })
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = (index: number) => {
  form.imageFiles.splice(index, 1)
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const submitForm = async () => {
  if (!user.value) {
    alert('กรุณาเข้าสู่ระบบก่อน')
    return
  }

  if (form.petTypes.length === 0) {
    alert('กรุณาเลือกสัตว์เลี้ยงที่รับอย่างน้อย 1 ประเภท')
    return
  }

  try {
    submitting.value = true

    // Upload images first
    const imageUrls: string[] = []
    for (const imageFile of form.imageFiles) {
      const formData = new FormData()
      formData.append('file', imageFile.file)
      formData.append('folder', 'hotels')

      const uploadResult = await $fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${await user.value.getIdToken()}`
        }
      }) as any

      if (uploadResult.url) {
        imageUrls.push(uploadResult.url)
      }
    }

    // Create hotel data
    const hotelData = {
      name: form.name,
      slug: generateSlug(form.name) + '-' + Date.now(),
      description: form.description,
      type: form.type,
      petTypes: form.petTypes,
      province: form.province,
      district: form.district,
      address: form.address,
      googleMapsUrl: form.googleMapsUrl,
      phone: form.phone,
      email: form.email,
      lineId: form.lineId,
      website: form.website,
      facebook: form.facebook,
      instagram: form.instagram,
      priceStart: form.priceStart,
      priceEnd: form.priceEnd,
      facilities: form.facilities,
      openTime: form.is24Hours ? '00:00' : form.openTime,
      closeTime: form.is24Hours ? '23:59' : form.closeTime,
      is24Hours: form.is24Hours,
      images: imageUrls,
      mainImage: imageUrls[0] || '',
      status: 'pending' // Requires admin approval
    }

    await $fetch('/api/my-hotels', {
      method: 'POST',
      body: hotelData,
      headers: {
        'Authorization': `Bearer ${await user.value.getIdToken()}`
      }
    })

    alert('ส่งข้อมูลที่พักเรียบร้อยแล้ว รอการตรวจสอบจากทีมงาน')
    router.push('/my-hotels')
  } catch (err: any) {
    console.error('Error creating hotel:', err)
    alert(err.data?.message || 'ไม่สามารถสร้างที่พักได้ กรุณาลองใหม่อีกครั้ง')
  } finally {
    submitting.value = false
  }
}

const saveDraft = async () => {
  if (!user.value) {
    alert('กรุณาเข้าสู่ระบบก่อน')
    return
  }

  try {
    submitting.value = true

    // Upload images first
    const imageUrls: string[] = []
    for (const imageFile of form.imageFiles) {
      const formData = new FormData()
      formData.append('file', imageFile.file)
      formData.append('folder', 'hotels')

      const uploadResult = await $fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${await user.value.getIdToken()}`
        }
      }) as any

      if (uploadResult.url) {
        imageUrls.push(uploadResult.url)
      }
    }

    // Create hotel data as draft
    const hotelData = {
      name: form.name || 'ฉบับร่าง',
      slug: generateSlug(form.name || 'draft') + '-' + Date.now(),
      description: form.description,
      type: form.type,
      petTypes: form.petTypes,
      province: form.province,
      district: form.district,
      address: form.address,
      googleMapsUrl: form.googleMapsUrl,
      phone: form.phone,
      email: form.email,
      lineId: form.lineId,
      website: form.website,
      facebook: form.facebook,
      instagram: form.instagram,
      priceStart: form.priceStart,
      priceEnd: form.priceEnd,
      facilities: form.facilities,
      openTime: form.is24Hours ? '00:00' : form.openTime,
      closeTime: form.is24Hours ? '23:59' : form.closeTime,
      is24Hours: form.is24Hours,
      images: imageUrls,
      mainImage: imageUrls[0] || '',
      status: 'draft'
    }

    await $fetch('/api/my-hotels', {
      method: 'POST',
      body: hotelData,
      headers: {
        'Authorization': `Bearer ${await user.value.getIdToken()}`
      }
    })

    alert('บันทึกฉบับร่างเรียบร้อยแล้ว')
    router.push('/my-hotels')
  } catch (err: any) {
    console.error('Error saving draft:', err)
    alert(err.data?.message || 'ไม่สามารถบันทึกฉบับร่างได้ กรุณาลองใหม่อีกครั้ง')
  } finally {
    submitting.value = false
  }
}
</script>
