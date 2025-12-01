<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <div class="container-custom">
      <div class="flex items-center justify-between py-4">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2 group">
          <span class="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:to-secondary-600 transition-all">🐾 PetCanGo</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-6">
          <NuxtLink
            to="/"
            class="text-gray-700 hover:text-primary-500 transition-colors font-medium"
            active-class="text-primary-500"
          >
            หน้าหลัก
          </NuxtLink>
          <NuxtLink
            to="/all-province"
            class="text-gray-700 hover:text-primary-500 transition-colors font-medium"
            active-class="text-primary-500"
          >
            ที่พักทั้งหมด
          </NuxtLink>
          <NuxtLink
            to="/blogs"
            class="text-gray-700 hover:text-primary-500 transition-colors font-medium"
            active-class="text-primary-500"
          >
            บทความ
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="text-gray-700 hover:text-primary-500 transition-colors font-medium"
            active-class="text-primary-500"
          >
            เกี่ยวกับเรา
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="text-gray-700 hover:text-primary-500 transition-colors font-medium"
            active-class="text-primary-500"
          >
            ติดต่อเรา
          </NuxtLink>
        </nav>

        <!-- Auth Buttons / User Menu -->
        <div class="hidden md:flex items-center space-x-3">
          <!-- Not Logged In -->
          <template v-if="!isAuthenticated">
            <button
              @click="openLoginModal"
              class="btn btn-outline"
            >
              เข้าสู่ระบบ
            </button>
            <NuxtLink
              to="/register"
              class="btn btn-primary"
            >
              ลงทะเบียนฟรี
            </NuxtLink>
          </template>

          <!-- Logged In -->
          <template v-else>
            <div class="relative">
              <button
                @click="toggleUserMenu"
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  :src="user?.photoURL || '/images/default-avatar.png'"
                  :alt="user?.displayName || 'User'"
                  class="w-8 h-8 rounded-full"
                  @error="handleAvatarError"
                />
                <span class="font-medium text-gray-700">
                  {{ user?.displayName || user?.email }}
                </span>
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <!-- User Dropdown Menu -->
              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="isUserMenuOpen"
                  class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                >
                  <!-- Admin Menu (for Admin & Super Admin) -->
                  <template v-if="isAdmin">
                    <div class="px-4 py-2 bg-purple-50 border-b border-purple-100">
                      <p class="text-xs font-semibold text-purple-600 uppercase">
                        {{ isSuperAdmin ? 'Super Admin' : 'Admin' }}
                      </p>
                    </div>
                    <NuxtLink
                      to="/backend"
                      class="block px-4 py-2 text-purple-700 hover:bg-purple-50 transition-colors font-medium flex items-center space-x-2"
                      @click="closeUserMenu"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span>ระบบหลังบ้าน</span>
                    </NuxtLink>
                    <hr class="my-2" />
                  </template>

                  <!-- Regular User Menu -->
                  <NuxtLink
                    to="/dashboard"
                    class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    @click="closeUserMenu"
                  >
                    แดชบอร์ด
                  </NuxtLink>
                  <NuxtLink
                    to="/my-hotels"
                    class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    @click="closeUserMenu"
                  >
                    จัดการที่พัก
                  </NuxtLink>
                  <NuxtLink
                    to="/profile"
                    class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    @click="closeUserMenu"
                  >
                    โปรไฟล์
                  </NuxtLink>
                  <hr class="my-2" />
                  <button
                    @click="handleLogout"
                    class="w-full text-left px-4 py-2 text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              </Transition>
            </div>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <svg
            v-if="!isMobileMenuOpen"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="isMobileMenuOpen"
          class="md:hidden pb-4 border-t mt-2 pt-4"
        >
          <nav class="flex flex-col space-y-3">
            <NuxtLink
              to="/"
              class="text-gray-700 hover:text-primary-500 transition-colors font-medium py-2"
              @click="closeMobileMenu"
            >
              หน้าหลัก
            </NuxtLink>
            <NuxtLink
              to="/all-province"
              class="text-gray-700 hover:text-primary-500 transition-colors font-medium py-2"
              @click="closeMobileMenu"
            >
              ที่พักทั้งหมด
            </NuxtLink>
            <NuxtLink
              to="/blogs"
              class="text-gray-700 hover:text-primary-500 transition-colors font-medium py-2"
              @click="closeMobileMenu"
            >
              บทความ
            </NuxtLink>
            <NuxtLink
              to="/about"
              class="text-gray-700 hover:text-primary-500 transition-colors font-medium py-2"
              @click="closeMobileMenu"
            >
              เกี่ยวกับเรา
            </NuxtLink>
            <NuxtLink
              to="/contact"
              class="text-gray-700 hover:text-primary-500 transition-colors font-medium py-2"
              @click="closeMobileMenu"
            >
              ติดต่อเรา
            </NuxtLink>
            <div class="flex flex-col space-y-2 pt-3 border-t">
              <button
                @click="openLoginModal"
                class="btn btn-outline w-full"
              >
                เข้าสู่ระบบ
              </button>
              <NuxtLink
                to="/register"
                class="btn btn-primary w-full text-center"
                @click="closeMobileMenu"
              >
                ลงทะเบียนฟรี
              </NuxtLink>
            </div>
          </nav>
        </div>
      </Transition>
    </div>

    <!-- Login Modal -->
    <AuthLoginModal
      v-model="showLoginModal"
      @login-success="handleLoginSuccess"
    />
  </header>
</template>

<script setup lang="ts">
const { user, isAuthenticated, isAdmin, isSuperAdmin, logout } = useAuth()
const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const showLoginModal = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const openLoginModal = () => {
  showLoginModal.value = true
  closeMobileMenu()
}

const handleLogout = async () => {
  const success = await logout()
  if (success) {
    closeUserMenu()
    navigateTo('/')
  }
}

const handleLoginSuccess = () => {
  // Refresh page or update UI after successful login
  console.log('Login successful!')
}

const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement
  // Fallback to first letter of name
  img.style.display = 'none'
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      isUserMenuOpen.value = false
    }
  })
})
</script>
