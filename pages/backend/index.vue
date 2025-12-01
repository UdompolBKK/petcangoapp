<template>
  <div>
    <!-- Page Title -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Dashboard</h1>
      <p class="text-gray-400">Welcome back, {{ user?.displayName || user?.email }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-900/20 border border-red-800 text-red-400 px-6 py-4 rounded-lg">
      {{ error }}
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <!-- Total Customers Card -->
        <div class="bg-[#0F1419] border border-gray-800 rounded-xl p-6 hover:border-emerald-500/50 transition-colors">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
          </div>
          <div>
            <p class="text-gray-400 text-sm mb-1">Total Customers</p>
            <p class="text-3xl font-bold text-white">{{ stats.users }}</p>
          </div>
        </div>

        <!-- Members Card -->
        <div class="bg-[#0F1419] border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
          </div>
          <div>
            <p class="text-gray-400 text-sm mb-1">Hotels</p>
            <p class="text-3xl font-bold text-white">{{ stats.hotels }}</p>
          </div>
        </div>

        <!-- Reviews Card -->
        <div class="bg-[#0F1419] border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <div class="flex items-center space-x-1">
              <span class="text-emerald-500 text-sm font-medium">+33%</span>
            </div>
          </div>
          <div>
            <p class="text-gray-400 text-sm mb-1">Reviews</p>
            <p class="text-3xl font-bold text-white">{{ stats.reviews }}</p>
          </div>
        </div>

        <!-- Provinces Card -->
        <div class="bg-[#0F1419] border border-gray-800 rounded-xl p-6 hover:border-teal-500/50 transition-colors">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div class="flex items-center space-x-1">
              <span class="text-emerald-500 text-sm font-medium">+14%</span>
            </div>
          </div>
          <div>
            <p class="text-gray-400 text-sm mb-1">Provinces</p>
            <p class="text-3xl font-bold text-white">{{ stats.provinces }}</p>
          </div>
        </div>
      </div>

      <!-- Revenue Chart -->
      <div class="bg-[#0F1419] border border-gray-800 rounded-xl p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-white mb-1">Revenue</h2>
            <p class="text-3xl font-bold text-white">฿79,234</p>
          </div>
          <div class="flex items-center space-x-2">
            <button class="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              Daily
            </button>
            <button class="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg">
              Weekly
            </button>
            <button class="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              Monthly
            </button>
          </div>
        </div>

        <!-- Chart Area -->
        <div class="h-64 relative">
          <svg class="w-full h-full" viewBox="0 0 800 250" preserveAspectRatio="none">
            <line x1="0" y1="50" x2="800" y2="50" stroke="#1F2937" stroke-width="1"/>
            <line x1="0" y1="100" x2="800" y2="100" stroke="#1F2937" stroke-width="1"/>
            <line x1="0" y1="150" x2="800" y2="150" stroke="#1F2937" stroke-width="1"/>
            <line x1="0" y1="200" x2="800" y2="200" stroke="#1F2937" stroke-width="1"/>
            <path
              d="M 0,150 Q 100,120 200,100 T 400,80 Q 500,60 600,40 T 800,60"
              fill="none"
              stroke="#10B981"
              stroke-width="2"
            />
            <path
              d="M 0,150 Q 100,120 200,100 T 400,80 Q 500,60 600,40 T 800,60 L 800,250 L 0,250 Z"
              fill="url(#gradient)"
              opacity="0.2"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#10B981;stop-opacity:0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <!-- Super Admin Tools -->
      <div v-if="isSuperAdmin" class="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-700/50 rounded-xl p-6 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-white mb-2">Super Admin Tools</h3>
            <p class="text-purple-200">Manage system administrators</p>
          </div>
          <NuxtLink
            to="/backend/admins"
            class="bg-white hover:bg-gray-100 text-purple-900 font-semibold px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <span>Manage Admins</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Quick Links Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink
          to="/backend/hotels"
          class="bg-[#0F1419] border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all group"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div>
              <p class="text-white font-medium">Manage Hotels</p>
              <p class="text-gray-400 text-sm">{{ stats.hotels }} hotels</p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/backend/reviews"
          class="bg-[#0F1419] border border-gray-800 rounded-xl p-6 hover:border-yellow-500/50 transition-all group"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
              <svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <div>
              <p class="text-white font-medium">Manage Reviews</p>
              <p class="text-gray-400 text-sm">{{ stats.reviews }} reviews</p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/backend/users"
          class="bg-[#0F1419] border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all group"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-white font-medium">Manage Users</p>
              <p class="text-gray-400 text-sm">{{ stats.users }} users</p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/"
          target="_blank"
          class="bg-[#0F1419] border border-gray-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all group"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </div>
            <div>
              <p class="text-white font-medium">View Website</p>
              <p class="text-gray-400 text-sm">Go to frontend</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
  layout: 'backend'
})

useHead({
  title: 'Dashboard - Backend | PetCanGo',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const { user, isSuperAdmin } = useAuth()

const loading = ref(true)
const error = ref<string | null>(null)

const stats = ref({
  hotels: 0,
  blogs: 0,
  provinces: 0,
  facilities: 0,
  users: 0,
  reviews: 0
})

const loadStats = async () => {
  try {
    loading.value = true
    error.value = null

    const [hotelsRes, blogsRes, provincesRes, facilitiesRes, usersRes, reviewsRes] = await Promise.all([
      $fetch('/api/hotels'),
      $fetch('/api/blogs'),
      $fetch('/api/provinces'),
      $fetch('/api/facilities'),
      $fetch('/api/users'),
      $fetch('/api/reviews', { query: { limit: 1000 } })
    ])

    stats.value = {
      hotels: hotelsRes.total || 0,
      blogs: blogsRes.total || 0,
      provinces: provincesRes.total || 0,
      facilities: facilitiesRes.total || 0,
      users: usersRes.total || 0,
      reviews: reviewsRes.data?.length || 0
    }

  } catch (err: any) {
    console.error('Failed to load stats:', err)
    error.value = 'Failed to load dashboard data'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
})
</script>
