<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <section class="bg-primary-500 text-white py-8">
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
            <h1 class="text-2xl md:text-3xl font-bold">แก้ไขที่พัก</h1>
            <p class="text-white/80">แก้ไขข้อมูลที่พักของคุณ</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="py-12">
      <div class="container-custom max-w-4xl">
        <div class="bg-white rounded-xl shadow-sm p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p class="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <section v-else class="py-8">
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

              <!-- Slug (Read-only) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL)
                </label>
                <input
                  v-model="form.slug"
                  type="text"
                  readonly
                  class="input bg-gray-100 cursor-not-allowed text-gray-600"
                />
                <p class="mt-1 text-sm text-gray-500">Slug ไม่สามารถแก้ไขได้หลังจากสร้างที่พักแล้ว</p>
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
                  placeholder="อธิบายรายละเอียดที่พักของคุณ"
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

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
                <input v-model="form.email" type="email" placeholder="example@email.com" class="input" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Line ID</label>
                <input v-model="form.lineId" type="text" placeholder="@yourlineid" class="input" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">เว็บไซต์</label>
                <input v-model="form.website" type="url" placeholder="https://www.example.com" class="input" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <input v-model="form.facebook" type="url" placeholder="https://www.facebook.com/yourpage" class="input" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input v-model="form.instagram" type="text" placeholder="@yourinsta" class="input" />
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
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    ราคาเริ่มต้น (บาท/คืน) <span class="text-primary-500">*</span>
                  </label>
                  <input v-model.number="form.priceStart" type="number" required min="0" placeholder="500" class="input" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ราคาสูงสุด (บาท/คืน)</label>
                  <input v-model.number="form.priceEnd" type="number" min="0" placeholder="2000" class="input" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">บริการและสิ่งอำนวยความสะดวก</label>
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

            <!-- Existing Images -->
            <div v-if="form.existingImages.length > 0" class="mb-6">
              <p class="text-sm text-gray-600 mb-3">รูปภาพปัจจุบัน</p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  v-for="(image, index) in form.existingImages"
                  :key="'existing-' + index"
                  class="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
                >
                  <img :src="image" class="w-full h-full object-cover" />
                  <button
                    @click="removeExistingImage(index)"
                    type="button"
                    class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                  <div v-if="index === 0" class="absolute bottom-2 left-2 px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                    รูปหลัก
                  </div>
                </div>
              </div>
            </div>

            <!-- Upload New Images -->
            <div class="space-y-4">
              <p class="text-sm text-gray-600">เพิ่มรูปภาพใหม่</p>
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

              <!-- New Image Preview -->
              <div v-if="form.newImageFiles.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  v-for="(image, index) in form.newImageFiles"
                  :key="'new-' + index"
                  class="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
                >
                  <img :src="image.preview" class="w-full h-full object-cover" />
                  <button
                    @click="removeNewImage(index)"
                    type="button"
                    class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                  <div class="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                    ใหม่
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
                <label class="block text-sm font-medium text-gray-700 mb-2">เปิด</label>
                <input v-model="form.openTime" type="time" class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ปิด</label>
                <input v-model="form.closeTime" type="time" class="input" />
              </div>
            </div>

            <div class="mt-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="form.is24Hours" class="w-4 h-4 text-primary-500 rounded">
                <span class="text-sm">เปิดให้บริการ 24 ชั่วโมง</span>
              </label>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              <svg v-if="submitting" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ submitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข' }}
            </button>
            <NuxtLink
              to="/my-hotels"
              class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-8 rounded-xl transition-colors"
            >
              ยกเลิก
            </NuxtLink>
          </div>
        </form>
      </div>
    </section>

    <!-- Success Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="goToMyHotels"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">บันทึกสำเร็จ!</h3>
            <p class="text-gray-600 mb-8">ข้อมูลที่พักของคุณถูกอัปเดตเรียบร้อยแล้ว</p>
            <button
              @click="goToMyHotels"
              class="w-full py-3 px-6 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
            >
              กลับไปที่จัดการที่พัก
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Error Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showErrorModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showErrorModal = false"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">เกิดข้อผิดพลาด</h3>
            <p class="text-gray-600 mb-8">{{ errorMessage }}</p>
            <button
              @click="showErrorModal = false"
              class="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const route = useRoute()
const router = useRouter()
const { user } = useAuth()

const hotelId = route.params.id as string

useHead({
  title: 'แก้ไขที่พัก - PetCanGo'
})

const loading = ref(true)
const submitting = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

const form = reactive({
  name: '',
  slug: '',
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
  existingImages: [] as string[],
  newImageFiles: [] as { file: File; preview: string }[]
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

const loadHotel = async () => {
  if (!user.value) return

  try {
    loading.value = true
    const response = await $fetch(`/api/my-hotels/${hotelId}`, {
      headers: {
        'Authorization': `Bearer ${await user.value.getIdToken()}`
      }
    }) as any

    const hotel = response.data

    // Populate form
    form.name = hotel.name || ''
    form.slug = hotel.slug || ''
    form.description = hotel.description || ''
    form.type = hotel.type || ''
    form.petTypes = hotel.petTypes || []
    form.province = hotel.province || ''
    form.district = hotel.district || ''
    form.address = hotel.address || ''
    form.googleMapsUrl = hotel.googleMapsUrl || ''
    form.phone = hotel.phone || ''
    form.email = hotel.email || ''
    form.lineId = hotel.lineId || ''
    form.website = hotel.website || ''
    form.facebook = hotel.facebook || ''
    form.instagram = hotel.instagram || ''
    form.priceStart = hotel.priceStart || null
    form.priceEnd = hotel.priceEnd || null
    form.facilities = hotel.facilities || []
    form.openTime = hotel.openTime || '09:00'
    form.closeTime = hotel.closeTime || '18:00'
    form.is24Hours = hotel.is24Hours || false
    form.existingImages = hotel.images || []
  } catch (err: any) {
    console.error('Error loading hotel:', err)
    errorMessage.value = 'ไม่สามารถโหลดข้อมูลที่พักได้'
    showErrorModal.value = true
  } finally {
    loading.value = false
  }
}

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
      errorMessage.value = `ไฟล์ ${file.name} ใหญ่เกินไป (สูงสุด 5MB)`
      showErrorModal.value = true
      continue
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      form.newImageFiles.push({
        file,
        preview: e.target?.result as string
      })
    }
    reader.readAsDataURL(file)
  }
}

const removeExistingImage = (index: number) => {
  form.existingImages.splice(index, 1)
}

const removeNewImage = (index: number) => {
  form.newImageFiles.splice(index, 1)
}

const goToMyHotels = () => {
  showSuccessModal.value = false
  router.push('/my-hotels')
}

const submitForm = async () => {
  if (!user.value) {
    errorMessage.value = 'กรุณาเข้าสู่ระบบก่อน'
    showErrorModal.value = true
    return
  }

  if (form.petTypes.length === 0) {
    errorMessage.value = 'กรุณาเลือกสัตว์เลี้ยงที่รับอย่างน้อย 1 ประเภท'
    showErrorModal.value = true
    return
  }

  try {
    submitting.value = true

    // Upload new images
    const newImageUrls: string[] = []
    for (const imageFile of form.newImageFiles) {
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

      if (uploadResult.success && uploadResult.data?.[0]?.url) {
        newImageUrls.push(uploadResult.data[0].url)
      }
    }

    // Combine existing and new images
    const allImages = [...form.existingImages, ...newImageUrls]

    // Update hotel data
    const hotelData = {
      name: form.name,
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
      images: allImages,
      mainImage: allImages[0] || ''
    }

    await $fetch(`/api/my-hotels/${hotelId}`, {
      method: 'PUT',
      body: hotelData,
      headers: {
        'Authorization': `Bearer ${await user.value.getIdToken()}`
      }
    })

    showSuccessModal.value = true
  } catch (err: any) {
    console.error('Error updating hotel:', err)
    errorMessage.value = err.data?.message || 'ไม่สามารถอัปเดตที่พักได้ กรุณาลองใหม่อีกครั้ง'
    showErrorModal.value = true
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadHotel()
})
</script>
