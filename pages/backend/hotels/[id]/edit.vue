<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-2">
        <NuxtLink
          to="/backend/hotels"
          class="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors"
        >
          <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </NuxtLink>
        <div>
          <h1 class="text-3xl font-bold text-white">แก้ไขโรงแรม</h1>
          <p class="text-gray-400">แก้ไขข้อมูลโรงแรม (Admin)</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-gray-800 rounded-xl p-12 text-center">
      <svg class="w-12 h-12 mx-auto mb-4 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
      <p class="text-gray-400">กำลังโหลดข้อมูล...</p>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="submitForm" class="space-y-6">
      <!-- Basic Information -->
      <div class="bg-gray-800 rounded-xl p-6">
        <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <div class="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          ข้อมูลพื้นฐาน
        </h2>

        <div class="grid gap-6">
          <!-- Hotel Name -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              ชื่อที่พัก
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="เช่น Pet Hotel สุขุมวิท"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <!-- Slug (Read-only) -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Slug (URL)
            </label>
            <input
              v-model="form.slug"
              type="text"
              readonly
              class="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 px-4 text-gray-500 cursor-not-allowed"
            />
            <p class="mt-1 text-sm text-gray-500">Slug ไม่สามารถแก้ไขได้</p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              รายละเอียด
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="อธิบายรายละเอียดที่พัก"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            ></textarea>
          </div>

          <!-- Hotel Type & Pet Types -->
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                ประเภทที่พัก
              </label>
              <select v-model="form.type" class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
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
              <label class="block text-sm font-medium text-gray-300 mb-2">
                สัตว์เลี้ยงที่รับ
              </label>
              <div class="flex flex-wrap gap-3">
                <label class="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input type="checkbox" v-model="form.petTypes" value="dog" class="w-4 h-4 text-emerald-500 bg-gray-700 border-gray-600 rounded">
                  <span class="text-sm">สุนัข</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input type="checkbox" v-model="form.petTypes" value="cat" class="w-4 h-4 text-emerald-500 bg-gray-700 border-gray-600 rounded">
                  <span class="text-sm">แมว</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input type="checkbox" v-model="form.petTypes" value="bird" class="w-4 h-4 text-emerald-500 bg-gray-700 border-gray-600 rounded">
                  <span class="text-sm">นก</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input type="checkbox" v-model="form.petTypes" value="rabbit" class="w-4 h-4 text-emerald-500 bg-gray-700 border-gray-600 rounded">
                  <span class="text-sm">กระต่าย</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input type="checkbox" v-model="form.petTypes" value="other" class="w-4 h-4 text-emerald-500 bg-gray-700 border-gray-600 rounded">
                  <span class="text-sm">อื่นๆ</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Location -->
      <div class="bg-gray-800 rounded-xl p-6">
        <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <div class="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          ที่ตั้ง
        </h2>

        <div class="grid gap-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                จังหวัด
              </label>
              <select v-model="form.province" class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                <option value="">เลือกจังหวัด</option>
                <option v-for="province in provinces" :key="province" :value="province">
                  {{ province }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                เขต/อำเภอ
              </label>
              <input
                v-model="form.district"
                type="text"
                placeholder="เช่น วัฒนา"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              ที่อยู่
            </label>
            <textarea
              v-model="form.address"
              rows="2"
              placeholder="เลขที่ ถนน ซอย แขวง/ตำบล"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Google Maps (URL หรือ Embed Code)
            </label>
            <input
              v-model="form.googleMapsUrl"
              type="text"
              placeholder="https://maps.google.com/... หรือ <iframe>...</iframe>"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      <!-- Contact -->
      <div class="bg-gray-800 rounded-xl p-6">
        <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <div class="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
          </div>
          ข้อมูลติดต่อ
        </h2>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              เบอร์โทรศัพท์
            </label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="0XX-XXX-XXXX"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">อีเมล</label>
            <input v-model="form.email" type="email" placeholder="example@email.com" class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Line ID</label>
            <input v-model="form.lineId" type="text" placeholder="@yourlineid" class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">เว็บไซต์</label>
            <input v-model="form.website" type="url" placeholder="https://www.example.com" class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Facebook</label>
            <input v-model="form.facebook" type="url" placeholder="https://www.facebook.com/yourpage" class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Instagram</label>
            <input v-model="form.instagram" type="text" placeholder="@yourinsta" class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </div>
        </div>
      </div>

      <!-- Price & Services -->
      <div class="bg-gray-800 rounded-xl p-6">
        <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <div class="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          ราคาและบริการ
        </h2>

        <div class="grid gap-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                ราคาเริ่มต้น (บาท/คืน)
              </label>
              <input v-model.number="form.priceStart" type="number" min="0" placeholder="500" class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">ราคาสูงสุด (บาท/คืน)</label>
              <input v-model.number="form.priceEnd" type="number" min="0" placeholder="2000" class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">บริการและสิ่งอำนวยความสะดวก</label>
            <div v-if="facilityOptions.length === 0" class="text-gray-500 text-sm">กำลังโหลด...</div>
            <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label v-for="facility in facilityOptions" :key="facility.value" class="flex items-center gap-2 cursor-pointer text-gray-300">
                <input type="checkbox" v-model="form.facilities" :value="facility.value" class="w-4 h-4 text-emerald-500 bg-gray-700 border-gray-600 rounded">
                <span class="text-sm">{{ facility.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Images -->
      <div class="bg-gray-800 rounded-xl p-6">
        <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <div class="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          รูปภาพ
        </h2>

        <!-- Existing Images -->
        <div v-if="form.existingImages.length > 0" class="mb-6">
          <p class="text-sm text-gray-400 mb-3">รูปภาพปัจจุบัน</p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="(image, index) in form.existingImages"
              :key="'existing-' + index"
              class="relative aspect-square rounded-lg overflow-hidden bg-gray-700 group"
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
              <div v-if="index === 0" class="absolute bottom-2 left-2 px-2 py-1 bg-emerald-500 text-white text-xs rounded-full">
                รูปหลัก
              </div>
            </div>
          </div>
        </div>

        <!-- Upload New Images -->
        <div class="space-y-4">
          <p class="text-sm text-gray-400">เพิ่มรูปภาพใหม่</p>
          <div
            @click="($refs.fileInput as HTMLInputElement).click()"
            @dragover.prevent
            @drop.prevent="handleDrop"
            class="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-500/5 transition-colors"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              class="hidden"
              @change="handleFileSelect"
            />
            <svg class="w-12 h-12 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <p class="text-gray-400 mb-1">คลิกหรือลากไฟล์มาวาง</p>
            <p class="text-sm text-gray-500">รองรับไฟล์ PNG, JPG, WEBP ขนาดไม่เกิน 5MB</p>
          </div>

          <!-- New Image Preview -->
          <div v-if="form.newImageFiles.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="(image, index) in form.newImageFiles"
              :key="'new-' + index"
              class="relative aspect-square rounded-lg overflow-hidden bg-gray-700 group"
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
      <div class="bg-gray-800 rounded-xl p-6">
        <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <div class="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          เวลาทำการ
        </h2>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">เปิด</label>
            <input v-model="form.openTime" type="time" class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">ปิด</label>
            <input v-model="form.closeTime" type="time" class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </div>
        </div>

        <div class="mt-4">
          <label class="flex items-center gap-2 cursor-pointer text-gray-300">
            <input type="checkbox" v-model="form.is24Hours" class="w-4 h-4 text-emerald-500 bg-gray-700 border-gray-600 rounded">
            <span class="text-sm">เปิดให้บริการ 24 ชั่วโมง</span>
          </label>
        </div>
      </div>

      <!-- Admin Settings -->
      <div class="bg-gray-800 rounded-xl p-6">
        <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <div class="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
            </svg>
          </div>
          การตั้งค่า Admin
        </h2>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">สถานะ</label>
            <select v-model="form.status" class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
              <option value="draft">แบบร่าง</option>
              <option value="pending">รอตรวจสอบ</option>
              <option value="published">เผยแพร่แล้ว</option>
              <option value="hidden">ซ่อนอยู่</option>
              <option value="rejected">ไม่ผ่าน</option>
            </select>
          </div>

          <div class="flex items-center">
            <label class="flex items-center gap-3 cursor-pointer text-gray-300">
              <input type="checkbox" v-model="form.isFeatured" class="w-5 h-5 text-yellow-500 bg-gray-700 border-gray-600 rounded">
              <div>
                <span class="text-sm font-medium">แนะนำ</span>
                <p class="text-xs text-gray-500">แสดงในหน้าแรก</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Submit Buttons -->
      <div class="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          :disabled="submitting"
          class="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-50"
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
          to="/backend/hotels"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-xl transition-colors"
        >
          ยกเลิก
        </NuxtLink>
      </div>
    </form>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 rounded-2xl max-w-md w-full p-8 text-center">
        <div class="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2">บันทึกสำเร็จ!</h3>
        <p class="text-gray-400 mb-8">ข้อมูลโรงแรมถูกอัปเดตเรียบร้อยแล้ว</p>
        <button
          @click="goToHotels"
          class="w-full py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
        >
          กลับไปหน้าจัดการโรงแรม
        </button>
      </div>
    </div>

    <!-- Error Modal -->
    <div v-if="showErrorModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 rounded-2xl max-w-md w-full p-8 text-center">
        <div class="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2">เกิดข้อผิดพลาด</h3>
        <p class="text-gray-400 mb-8">{{ errorMessage }}</p>
        <button
          @click="showErrorModal = false"
          class="w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
        >
          ปิด
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'backend'
})

const route = useRoute()
const router = useRouter()
const { user } = useAuth()

const hotelId = route.params.id as string

useHead({
  title: 'แก้ไขโรงแรม | Backend - PetCanGo'
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
  newImageFiles: [] as { file: File; preview: string }[],
  status: 'draft',
  isFeatured: false
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

// Facilities will be loaded from API
const facilityOptions = ref<Array<{ value: string; label: string; icon?: string }>>([])

// Load facilities from database
const loadFacilities = async () => {
  try {
    const response = await $fetch('/api/facilities') as any
    if (response.success && response.data) {
      facilityOptions.value = response.data.map((f: any) => ({
        value: f.slug,
        label: f.name,
        icon: f.icon
      }))
      console.log('Loaded facilities:', facilityOptions.value)
    }
  } catch (err) {
    console.error('Failed to load facilities:', err)
  }
}

// Store original province object for saving
const originalProvince = ref<any>(null)
// Store original facilities for saving
const originalFacilities = ref<any[]>([])

const loadHotel = async () => {
  try {
    loading.value = true
    const response = await $fetch(`/api/hotels/${hotelId}`) as any

    const hotel = response.data
    console.log('Loaded hotel data:', hotel)

    // Populate form
    form.name = hotel.name || ''
    form.slug = hotel.slug || ''

    // Handle description - could be in 'description' or 'shortDescription' or 'content'
    form.description = hotel.description || hotel.shortDescription || ''

    form.type = hotel.type || ''

    // Handle petTypes - could be array of strings or objects
    if (Array.isArray(hotel.petTypes)) {
      form.petTypes = hotel.petTypes.map((pt: any) => typeof pt === 'object' ? pt.slug || pt.value : pt)
    } else if (Array.isArray(hotel.tags)) {
      // Some hotels use 'tags' instead of 'petTypes'
      form.petTypes = hotel.tags.filter((t: string) => ['dog', 'cat', 'bird', 'rabbit', 'other', 'สุนัข', 'แมว', 'นก', 'กระต่าย', 'หมาเข้าได้'].includes(t.toLowerCase()))
    } else {
      form.petTypes = []
    }

    // Handle province - could be object or string
    if (typeof hotel.province === 'object' && hotel.province !== null) {
      originalProvince.value = hotel.province
      form.province = hotel.province.name || ''
    } else {
      form.province = hotel.province || ''
    }

    form.district = hotel.district || hotel.area || ''
    form.address = hotel.address || ''
    form.googleMapsUrl = hotel.googleMapsUrl || hotel.googleMapIframe || ''
    form.phone = hotel.phone || hotel.tel || ''
    form.email = hotel.email || ''
    form.lineId = hotel.lineId || hotel.line || ''
    form.website = hotel.website || ''
    form.facebook = hotel.facebook || ''
    form.instagram = hotel.instagram || ''
    form.priceStart = hotel.priceStart || hotel.price || null
    form.priceEnd = hotel.priceEnd || null

    // Handle facilities - extract slugs from objects
    // Store original facilities for saving back in same format
    originalFacilities.value = hotel.facilities || []
    console.log('Original facilities from DB:', hotel.facilities)

    // Extract facility slugs for checkbox matching
    if (Array.isArray(hotel.facilities)) {
      form.facilities = hotel.facilities.map((f: any) => {
        if (typeof f === 'object') {
          // Get the slug from object - this matches facilityOptions.value
          return f.slug || ''
        }
        // If string, use as-is
        return f
      }).filter(Boolean)
      console.log('Extracted facility slugs:', form.facilities)
    } else {
      form.facilities = []
    }

    form.openTime = hotel.openTime || '09:00'
    form.closeTime = hotel.closeTime || '18:00'
    form.is24Hours = hotel.is24Hours || false

    // Handle images - could be in 'images', 'gallery', or 'mainImage'
    if (Array.isArray(hotel.images) && hotel.images.length > 0) {
      form.existingImages = hotel.images
    } else if (Array.isArray(hotel.gallery)) {
      form.existingImages = hotel.gallery.map((g: any) => typeof g === 'object' ? g.image || g.url : g).filter(Boolean)
    } else if (hotel.mainImage) {
      form.existingImages = [hotel.mainImage]
    } else {
      form.existingImages = []
    }

    form.status = hotel.status || 'draft'
    form.isFeatured = hotel.isFeatured || hotel.featured || false
  } catch (err: any) {
    console.error('Error loading hotel:', err)
    errorMessage.value = 'ไม่สามารถโหลดข้อมูลโรงแรมได้'
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

const goToHotels = () => {
  showSuccessModal.value = false
  router.push('/backend/hotels')
}

const submitForm = async () => {
  try {
    submitting.value = true

    // Upload new images
    const newImageUrls: string[] = []
    for (const imageFile of form.newImageFiles) {
      const formData = new FormData()
      formData.append('file', imageFile.file)
      formData.append('folder', 'hotels')

      const token = user.value ? await user.value.getIdToken() : ''
      const uploadResult = await $fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      }) as any

      if (uploadResult.success && uploadResult.data?.[0]?.url) {
        newImageUrls.push(uploadResult.data[0].url)
      }
    }

    // Combine existing and new images
    const allImages = [...form.existingImages, ...newImageUrls]

    // Determine province value - preserve original object if name hasn't changed
    let provinceValue: any = form.province
    if (originalProvince.value && originalProvince.value.name === form.province) {
      provinceValue = originalProvince.value
    }

    // Update hotel data
    const hotelData: Record<string, any> = {
      name: form.name,
      description: form.description,
      shortDescription: form.description, // Also update shortDescription for compatibility
      type: form.type,
      petTypes: form.petTypes,
      province: provinceValue,
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
      mainImage: allImages[0] || '',
      status: form.status,
      isFeatured: form.isFeatured,
      featured: form.isFeatured // Also update 'featured' field for compatibility
    }

    await $fetch(`/api/hotels/${hotelId}`, {
      method: 'PATCH',
      body: hotelData
    })

    showSuccessModal.value = true
  } catch (err: any) {
    console.error('Error updating hotel:', err)
    errorMessage.value = err.data?.message || 'ไม่สามารถอัปเดตโรงแรมได้ กรุณาลองใหม่อีกครั้ง'
    showErrorModal.value = true
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  // Load facilities first, then hotel data
  await loadFacilities()
  await loadHotel()
})
</script>
