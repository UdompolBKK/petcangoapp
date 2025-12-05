<template>
  <div>
    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">จัดการ Facilities</h1>
        <p class="text-gray-400">จัดการสิ่งอำนวยความสะดวกของโรงแรม</p>
      </div>
      <button
        @click="openCreateModal"
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        เพิ่ม Facility
      </button>
    </div>

    <!-- Facilities Grid -->
    <div class="bg-gray-800 rounded-xl overflow-hidden">
      <!-- Loading -->
      <div v-if="loading" class="p-12 text-center">
        <svg class="w-12 h-12 mx-auto mb-4 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
        <p class="text-gray-400">กำลังโหลด...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="facilities.length === 0" class="p-12 text-center text-gray-400">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <p class="text-lg font-medium">ยังไม่มี Facilities</p>
        <p class="text-sm mt-2">คลิกปุ่ม "เพิ่ม Facility" เพื่อเริ่มต้น</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-900/50">
            <tr>
              <th class="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">Icon</th>
              <th class="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">ชื่อ</th>
              <th class="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">Slug</th>
              <th class="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">การกระทำ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="facility in facilities" :key="facility.id" class="hover:bg-gray-700/50 transition-colors">
              <!-- Icon -->
              <td class="py-4 px-6">
                <div class="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    v-if="facility.icon"
                    :src="facility.icon"
                    :alt="facility.name"
                    class="w-8 h-8 object-contain"
                  />
                  <svg v-else class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
              </td>

              <!-- Name -->
              <td class="py-4 px-6">
                <span class="text-white font-medium">{{ facility.name }}</span>
              </td>

              <!-- Slug -->
              <td class="py-4 px-6">
                <code class="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded text-sm">{{ facility.slug }}</code>
              </td>

              <!-- Actions -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-2">
                  <button
                    @click="openEditModal(facility)"
                    class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    แก้ไข
                  </button>
                  <button
                    @click="deleteFacility(facility)"
                    class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    ลบ
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 rounded-2xl max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-white mb-6">
          {{ editingFacility ? 'แก้ไข Facility' : 'เพิ่ม Facility ใหม่' }}
        </h3>

        <form @submit.prevent="saveFacility" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              ชื่อ <span class="text-emerald-500">*</span>
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              placeholder="เช่น มีทีวี, Wifi, เครื่องปรับอากาศ"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <!-- Slug -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Slug <span class="text-emerald-500">*</span>
            </label>
            <input
              v-model="formData.slug"
              type="text"
              required
              placeholder="เช่น tv, wifi, aircon"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <p class="mt-1 text-xs text-gray-500">ใช้ภาษาอังกฤษ ตัวพิมพ์เล็ก ไม่มีเว้นวรรค</p>
          </div>

          <!-- Icon URL -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Icon URL
            </label>
            <input
              v-model="formData.icon"
              type="text"
              placeholder="/0_facility/icon_facility_wifi.png"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <p class="mt-1 text-xs text-gray-500">URL ของรูปไอคอน</p>
          </div>

          <!-- Icon Preview -->
          <div v-if="formData.icon" class="flex items-center gap-3">
            <span class="text-sm text-gray-400">ตัวอย่าง:</span>
            <div class="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
              <img :src="formData.icon" class="w-8 h-8 object-contain" />
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {{ saving ? 'กำลังบันทึก...' : 'บันทึก' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'backend'
})

useHead({
  title: 'จัดการ Facilities | Backend - PetCanGo'
})

interface Facility {
  id: string
  name: string
  slug: string
  icon?: string
}

const facilities = ref<Facility[]>([])
const loading = ref(true)
const showModal = ref(false)
const saving = ref(false)
const editingFacility = ref<Facility | null>(null)

const formData = reactive({
  name: '',
  slug: '',
  icon: ''
})

// Load facilities
const loadFacilities = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/facilities') as any
    if (response.success) {
      facilities.value = response.data
    }
  } catch (error) {
    console.error('Failed to load facilities:', error)
    alert('ไม่สามารถโหลดข้อมูลได้')
  } finally {
    loading.value = false
  }
}

// Open create modal
const openCreateModal = () => {
  editingFacility.value = null
  formData.name = ''
  formData.slug = ''
  formData.icon = ''
  showModal.value = true
}

// Open edit modal
const openEditModal = (facility: Facility) => {
  editingFacility.value = facility
  formData.name = facility.name
  formData.slug = facility.slug
  formData.icon = facility.icon || ''
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  editingFacility.value = null
}

// Auto-generate slug from name
watch(() => formData.name, (newName) => {
  if (!editingFacility.value && newName) {
    // Simple slug generation - convert to lowercase, replace spaces with underscore
    formData.slug = newName
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
  }
})

// Save facility
const saveFacility = async () => {
  if (!formData.name || !formData.slug) {
    alert('กรุณากรอกชื่อและ Slug')
    return
  }

  try {
    saving.value = true

    const data = {
      name: formData.name,
      slug: formData.slug,
      icon: formData.icon || null
    }

    if (editingFacility.value) {
      // Update existing
      await $fetch(`/api/facilities/${editingFacility.value.id}`, {
        method: 'PATCH',
        body: data
      })
    } else {
      // Create new
      await $fetch('/api/facilities/create', {
        method: 'POST',
        body: data
      })
    }

    closeModal()
    await loadFacilities()
    alert(editingFacility.value ? 'แก้ไขสำเร็จ' : 'เพิ่มสำเร็จ')
  } catch (error: any) {
    console.error('Failed to save facility:', error)
    alert(error.data?.message || 'ไม่สามารถบันทึกได้')
  } finally {
    saving.value = false
  }
}

// Delete facility
const deleteFacility = async (facility: Facility) => {
  if (!confirm(`คุณต้องการลบ "${facility.name}" ใช่หรือไม่?`)) {
    return
  }

  try {
    await $fetch(`/api/facilities/${facility.id}`, {
      method: 'DELETE'
    })
    await loadFacilities()
    alert('ลบสำเร็จ')
  } catch (error) {
    console.error('Failed to delete facility:', error)
    alert('ไม่สามารถลบได้')
  }
}

onMounted(() => {
  loadFacilities()
})
</script>
