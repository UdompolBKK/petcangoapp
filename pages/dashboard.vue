<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container-custom">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <!-- Auth Check -->
      <div v-if="!user" class="bg-white rounded-xl shadow-md p-8 text-center">
        <p class="text-gray-600 mb-4">กรุณาเข้าสู่ระบบเพื่อเข้าถึง Dashboard</p>
        <NuxtLink to="/login" class="btn btn-primary">เข้าสู่ระบบ</NuxtLink>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-6">
        <!-- Welcome -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold mb-2">ยินดีต้อนรับ, {{ user.displayName || user.email }}</h2>
          <p class="text-gray-600">จัดการที่พักและข้อมูลของคุณได้ที่นี่</p>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-sm text-gray-500 mb-1">ที่พักของฉัน</h3>
            <p class="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-sm text-gray-500 mb-1">รีวิวที่ได้รับ</h3>
            <p class="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-sm text-gray-500 mb-1">จำนวนเข้าชม</h3>
            <p class="text-3xl font-bold text-gray-900">0</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h3 class="text-lg font-semibold mb-4">การดำเนินการ</h3>
          <div class="flex flex-wrap gap-3">
            <NuxtLink to="/profile" class="btn btn-outline">แก้ไขโปรไฟล์</NuxtLink>
            <button @click="logout" class="btn btn-outline text-primary-500 border-primary-500 hover:bg-primary-50">ออกจากระบบ</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, logout: authLogout } = useAuth()

const logout = async () => {
  await authLogout()
  navigateTo('/login')
}

useHead({
  title: 'Dashboard - PetCanGo'
})
</script>
