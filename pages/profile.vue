<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container-custom max-w-5xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">โปรไฟล์ของฉัน</h1>
        <p class="text-gray-600 mt-2">จัดการข้อมูลส่วนตัวและดูประวัติกิจกรรมของคุณ</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {{ error }}
      </div>

      <!-- Profile Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Card (Left Sidebar) -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <div class="text-center">
              <!-- Avatar with Edit Button -->
              <div class="relative inline-block">
                <img
                  v-if="profile.photoURL"
                  :src="profile.photoURL"
                  :alt="profile.displayName"
                  class="h-28 w-28 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                />
                <div
                  v-else
                  class="h-28 w-28 rounded-full text-white text-4xl font-bold flex items-center justify-center mx-auto border-4 border-white shadow-lg"
                  style="background-color: #FF8E00;"
                >
                  {{ (profile.displayName || profile.email || 'U')[0].toUpperCase() }}
                </div>

                <!-- Edit Photo Button -->
                <button
                  @click="openPhotoUpload"
                  class="absolute bottom-0 right-0 bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-full shadow-md transition-colors border border-gray-200"
                  title="เปลี่ยนรูปโปรไฟล์"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </button>

                <!-- Hidden File Input -->
                <input
                  ref="photoInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handlePhotoChange"
                />
              </div>

              <!-- Uploading Indicator -->
              <div v-if="uploadingPhoto" class="mt-3 text-sm text-gray-500 flex items-center justify-center gap-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                กำลังอัพโหลด...
              </div>

              <!-- Name -->
              <h2 class="mt-4 text-xl font-bold text-gray-900">
                {{ profile.displayName || 'ไม่ระบุชื่อ' }}
              </h2>
              <p class="text-gray-600 text-sm mt-1">{{ profile.email }}</p>

              <!-- Role Badge -->
              <span
                :class="[
                  'inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold',
                  profile.role === 'superadmin'
                    ? 'bg-red-100 text-red-800'
                    : profile.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                ]"
              >
                {{ getRoleLabel(profile.role) }}
              </span>

              <!-- Stats -->
              <div class="mt-6 grid grid-cols-2 gap-4 text-center">
                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="text-2xl font-bold text-gray-900">{{ userReviews.length }}</div>
                  <div class="text-xs text-gray-500">รีวิว</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="text-2xl font-bold text-gray-900">{{ userHotels.length }}</div>
                  <div class="text-xs text-gray-500">โรงแรม</div>
                </div>
              </div>

              <!-- Member Since -->
              <p class="text-gray-500 text-sm mt-4">
                สมาชิกตั้งแต่ {{ formatDate(profile.createdAt) }}
              </p>
            </div>

            <!-- Quick Links -->
            <div class="mt-6 pt-6 border-t border-gray-200 space-y-2">
              <NuxtLink
                v-if="isAdmin"
                to="/backend"
                class="w-full flex items-center justify-center space-x-2 text-white px-4 py-2.5 rounded-lg transition-colors"
                style="background-color: #FF8E00;"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>หน้า Backend</span>
              </NuxtLink>

              <button
                @click="handleLogout"
                class="w-full flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content (Right Side with Tabs) -->
        <div class="lg:col-span-2">
          <!-- Tab Navigation -->
          <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="border-b border-gray-200">
              <nav class="flex -mb-px">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                    'flex-1 py-4 px-6 text-center font-medium text-sm transition-colors border-b-2',
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  <div class="flex items-center justify-center gap-2">
                    <component :is="tab.icon" class="w-5 h-5" />
                    {{ tab.name }}
                  </div>
                </button>
              </nav>
            </div>

            <!-- Tab Content -->
            <div class="p-6">
              <!-- Tab: ข้อมูลส่วนตัว -->
              <div v-if="activeTab === 'profile'">
                <!-- Success Message -->
                <div
                  v-if="successMessage"
                  class="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  {{ successMessage }}
                </div>

                <!-- Edit Form -->
                <form @submit.prevent="handleUpdate" class="space-y-5">
                  <div>
                    <label for="displayName" class="block text-sm font-medium text-gray-700 mb-2">
                      ชื่อ-นามสกุล
                    </label>
                    <input
                      id="displayName"
                      v-model="form.displayName"
                      type="text"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      :disabled="updating"
                    />
                  </div>

                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                      อีเมล
                    </label>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      disabled
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    />
                    <p class="mt-1 text-xs text-gray-500">ไม่สามารถเปลี่ยนอีเมลได้</p>
                  </div>

                  <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                      เบอร์โทร
                    </label>
                    <input
                      id="phone"
                      v-model="form.phone"
                      type="tel"
                      placeholder="081-234-5678"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      :disabled="updating"
                    />
                  </div>

                  <div>
                    <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                      ที่อยู่
                    </label>
                    <textarea
                      id="address"
                      v-model="form.address"
                      rows="3"
                      placeholder="ที่อยู่ของคุณ"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      :disabled="updating"
                    ></textarea>
                  </div>

                  <div>
                    <label for="bio" class="block text-sm font-medium text-gray-700 mb-2">
                      เกี่ยวกับฉัน
                    </label>
                    <textarea
                      id="bio"
                      v-model="form.bio"
                      rows="3"
                      placeholder="เล่าเกี่ยวกับตัวคุณและสัตว์เลี้ยงของคุณ"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      :disabled="updating"
                    ></textarea>
                  </div>

                  <div class="flex gap-3 pt-2">
                    <button
                      type="submit"
                      :disabled="updating"
                      class="flex-1 text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
                      style="background-color: #FF8E00;"
                    >
                      <svg
                        v-if="updating"
                        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{{ updating ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง' }}</span>
                    </button>

                    <button
                      type="button"
                      @click="resetForm"
                      :disabled="updating"
                      class="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </form>
              </div>

              <!-- Tab: ประวัติ -->
              <div v-else-if="activeTab === 'history'">
                <!-- Sub Tabs for History -->
                <div class="flex gap-2 mb-6">
                  <button
                    @click="historySubTab = 'reviews'"
                    :class="[
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      historySubTab === 'reviews'
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                  >
                    รีวิวของฉัน ({{ userReviews.length }})
                  </button>
                  <button
                    @click="historySubTab = 'hotels'"
                    :class="[
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      historySubTab === 'hotels'
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                  >
                    โรงแรมที่โพสต์ ({{ userHotels.length }})
                  </button>
                </div>

                <!-- Reviews List -->
                <div v-if="historySubTab === 'reviews'">
                  <div v-if="loadingHistory" class="flex justify-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  </div>

                  <div v-else-if="userReviews.length === 0" class="text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                    </svg>
                    <p class="text-gray-500">คุณยังไม่มีรีวิว</p>
                    <NuxtLink to="/hotels" class="mt-4 inline-block text-primary-500 hover:text-primary-600 font-medium">
                      ค้นหาโรงแรมเพื่อรีวิว →
                    </NuxtLink>
                  </div>

                  <div v-else class="space-y-4">
                    <div
                      v-for="review in userReviews"
                      :key="review.id"
                      class="bg-gray-50 rounded-lg p-4"
                    >
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <NuxtLink
                            :to="`/hotels/${review.hotel?.province?.slug || 'thailand'}/${review.hotel?.slug || review.hotelId}`"
                            class="font-medium text-gray-900 hover:text-primary-500"
                          >
                            {{ review.hotel?.name || 'โรงแรม' }}
                          </NuxtLink>
                          <div class="flex items-center gap-2 mt-1">
                            <div class="flex">
                              <svg
                                v-for="i in 5"
                                :key="i"
                                class="w-4 h-4"
                                :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            </div>
                            <span class="text-xs text-gray-500">{{ formatDate(review.createdAt) }}</span>
                          </div>
                          <p class="text-gray-600 text-sm mt-2">{{ review.comment }}</p>
                        </div>
                        <img
                          v-if="review.hotel?.mainImage"
                          :src="review.hotel.mainImage"
                          :alt="review.hotel?.name"
                          class="w-16 h-16 rounded-lg object-cover ml-4"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Hotels List -->
                <div v-else-if="historySubTab === 'hotels'">
                  <div v-if="loadingHistory" class="flex justify-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  </div>

                  <div v-else-if="userHotels.length === 0" class="text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                    <p class="text-gray-500">คุณยังไม่ได้โพสต์โรงแรม</p>
                    <NuxtLink to="/my-hotels/create" class="mt-4 inline-block text-primary-500 hover:text-primary-600 font-medium">
                      เพิ่มโรงแรมของคุณ →
                    </NuxtLink>
                  </div>

                  <div v-else class="space-y-4">
                    <div
                      v-for="hotel in userHotels"
                      :key="hotel.id"
                      class="bg-gray-50 rounded-lg p-4"
                    >
                      <div class="flex items-start gap-4">
                        <img
                          :src="hotel.mainImage || hotel.image || '/images/placeholder-hotel.jpg'"
                          :alt="hotel.name"
                          class="w-20 h-20 rounded-lg object-cover"
                        />
                        <div class="flex-1">
                          <div class="flex items-start justify-between">
                            <div>
                              <NuxtLink
                                :to="`/hotels/${hotel.province?.slug || 'thailand'}/${hotel.slug || hotel.id}`"
                                class="font-medium text-gray-900 hover:text-primary-500"
                              >
                                {{ hotel.name }}
                              </NuxtLink>
                              <p class="text-sm text-gray-500 mt-1">
                                📍 {{ hotel.province?.name || 'ไม่ระบุ' }}
                              </p>
                            </div>
                            <span
                              :class="[
                                'px-2 py-1 rounded-full text-xs font-medium',
                                hotel.status === 'published'
                                  ? 'bg-green-100 text-green-700'
                                  : hotel.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              ]"
                            >
                              {{ getStatusLabel(hotel.status) }}
                            </span>
                          </div>
                          <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span v-if="hotel.viewCount">👁 {{ hotel.viewCount }} views</span>
                            <span v-if="hotel.priceStart">฿{{ formatPrice(hotel.priceStart) }}/คืน</span>
                            <span>{{ formatDate(hotel.createdAt) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

// Protect this page - require authentication
definePageMeta({
  middleware: ['auth']
})

// SEO
useHead({
  title: 'โปรไฟล์ - PetCanGo',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow'
    }
  ]
})

const { user, logout, isAdmin } = useAuth()
const { storage } = useFirebase()
const { getCollection } = useFirestore()

// State
const loading = ref(true)
const updating = ref(false)
const uploadingPhoto = ref(false)
const loadingHistory = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const profile = ref<any>({})
const photoInput = ref<HTMLInputElement | null>(null)

const userReviews = ref<any[]>([])
const userHotels = ref<any[]>([])

// Tabs
const activeTab = ref('profile')
const historySubTab = ref('reviews')

const tabs = [
  { id: 'profile', name: 'ข้อมูลส่วนตัว', icon: 'UserIcon' },
  { id: 'history', name: 'ประวัติ', icon: 'ClockIcon' }
]

// Form
const form = ref({
  displayName: '',
  email: '',
  phone: '',
  address: '',
  bio: ''
})

// Tab icons (inline SVG)
const UserIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`
}

const ClockIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
}

/**
 * Load user profile
 */
const loadProfile = async () => {
  if (!user.value) return

  try {
    loading.value = true
    error.value = null

    const response = await $fetch(`/api/users/${user.value.uid}`)
    profile.value = response.data

    // Populate form
    form.value = {
      displayName: profile.value.displayName || '',
      email: profile.value.email || '',
      phone: profile.value.phone || '',
      address: profile.value.address || '',
      bio: profile.value.bio || ''
    }

  } catch (err: any) {
    console.error('Failed to load profile:', err)
    error.value = 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้'
  } finally {
    loading.value = false
  }
}

/**
 * Load user history (reviews & hotels)
 */
const loadHistory = async () => {
  if (!user.value) return

  try {
    loadingHistory.value = true

    // Load user's reviews
    const allReviews = await getCollection('reviews')
    const myReviews = allReviews.filter((r: any) => r.userId === user.value?.uid)

    // Get hotel info for each review
    const allHotels = await getCollection('hotels')
    userReviews.value = myReviews.map((review: any) => ({
      ...review,
      hotel: allHotels.find((h: any) => h.id === review.hotelId)
    })).sort((a: any, b: any) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt)
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt)
      return dateB - dateA
    })

    // Load user's hotels
    userHotels.value = allHotels
      .filter((h: any) => h.ownerId === user.value?.uid || h.createdBy === user.value?.uid)
      .sort((a: any, b: any) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt)
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt)
        return dateB - dateA
      })

  } catch (err) {
    console.error('Failed to load history:', err)
  } finally {
    loadingHistory.value = false
  }
}

/**
 * Open photo upload dialog
 */
const openPhotoUpload = () => {
  photoInput.value?.click()
}

/**
 * Handle photo change
 */
const handlePhotoChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file || !user.value) return

  // Validate file
  if (!file.type.startsWith('image/')) {
    alert('กรุณาเลือกไฟล์รูปภาพ')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('ไฟล์ต้องมีขนาดไม่เกิน 5MB')
    return
  }

  try {
    uploadingPhoto.value = true

    // Upload to Firebase Storage
    const fileName = `profile_${user.value.uid}_${Date.now()}.${file.name.split('.').pop()}`
    const fileRef = storageRef(storage, `users/${user.value.uid}/${fileName}`)

    await uploadBytes(fileRef, file)
    const downloadURL = await getDownloadURL(fileRef)

    // Update user profile
    await $fetch(`/api/users/${user.value.uid}`, {
      method: 'PATCH',
      body: { photoURL: downloadURL }
    })

    // Reload profile
    await loadProfile()

    successMessage.value = 'อัพโหลดรูปโปรไฟล์สำเร็จ!'
    setTimeout(() => { successMessage.value = null }, 3000)

  } catch (err) {
    console.error('Failed to upload photo:', err)
    alert('ไม่สามารถอัพโหลดรูปได้')
  } finally {
    uploadingPhoto.value = false
    // Reset input
    if (photoInput.value) {
      photoInput.value.value = ''
    }
  }
}

/**
 * Update profile
 */
const handleUpdate = async () => {
  if (!user.value) return

  try {
    updating.value = true
    successMessage.value = null

    await $fetch(`/api/users/${user.value.uid}`, {
      method: 'PATCH',
      body: {
        displayName: form.value.displayName,
        phone: form.value.phone,
        address: form.value.address,
        bio: form.value.bio
      }
    })

    successMessage.value = 'บันทึกข้อมูลสำเร็จ!'
    await loadProfile()

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = null
    }, 3000)

  } catch (err: any) {
    console.error('Failed to update profile:', err)
    alert('ไม่สามารถบันทึกข้อมูลได้')
  } finally {
    updating.value = false
  }
}

/**
 * Reset form
 */
const resetForm = () => {
  form.value = {
    displayName: profile.value.displayName || '',
    email: profile.value.email || '',
    phone: profile.value.phone || '',
    address: profile.value.address || '',
    bio: profile.value.bio || ''
  }
}

/**
 * Get role label
 */
const getRoleLabel = (role: string): string => {
  const labels: Record<string, string> = {
    superadmin: 'Super Admin',
    admin: 'ผู้ดูแลระบบ',
    user: 'สมาชิก'
  }
  return labels[role] || 'สมาชิก'
}

/**
 * Get status label
 */
const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    published: 'เผยแพร่',
    pending: 'รอตรวจสอบ',
    draft: 'ฉบับร่าง'
  }
  return labels[status] || status
}

/**
 * Format date
 */
const formatDate = (date: any) => {
  if (!date) return '-'

  let d: Date
  if (date.toDate) {
    d = date.toDate()
  } else if (date._seconds) {
    d = new Date(date._seconds * 1000)
  } else {
    d = new Date(date)
  }

  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(d)
}

/**
 * Format price
 */
const formatPrice = (price: number): string => {
  return price.toLocaleString('th-TH')
}

/**
 * Handle logout
 */
const handleLogout = async () => {
  const success = await logout()
  if (success) {
    navigateTo('/')
  }
}

// Watch for tab changes to load history
watch(activeTab, (newTab) => {
  if (newTab === 'history' && userReviews.value.length === 0 && userHotels.value.length === 0) {
    loadHistory()
  }
})

// Load profile on mount
onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.container-custom {
  @apply px-4 mx-auto;
}
</style>
