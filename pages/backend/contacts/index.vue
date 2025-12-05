<template>
  <div>
    <BackendLayout>
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-bold text-white">ข้อความติดต่อ</h1>
            <p class="text-gray-400 mt-1">จัดการข้อความจากหน้าติดต่อเรา</p>
          </div>
          <div class="flex items-center gap-4">
            <!-- Filter by Status -->
            <select
              v-model="filterStatus"
              class="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
            >
              <option value="">ทั้งหมด</option>
              <option value="new">ใหม่</option>
              <option value="read">อ่านแล้ว</option>
              <option value="replied">ตอบกลับแล้ว</option>
            </select>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-gray-800 rounded-xl p-4">
            <p class="text-gray-400 text-sm">ทั้งหมด</p>
            <p class="text-2xl font-bold text-white">{{ contacts.length }}</p>
          </div>
          <div class="bg-gray-800 rounded-xl p-4">
            <p class="text-gray-400 text-sm">ใหม่</p>
            <p class="text-2xl font-bold text-yellow-400">{{ newCount }}</p>
          </div>
          <div class="bg-gray-800 rounded-xl p-4">
            <p class="text-gray-400 text-sm">อ่านแล้ว</p>
            <p class="text-2xl font-bold text-blue-400">{{ readCount }}</p>
          </div>
          <div class="bg-gray-800 rounded-xl p-4">
            <p class="text-gray-400 text-sm">ตอบกลับแล้ว</p>
            <p class="text-2xl font-bold text-green-400">{{ repliedCount }}</p>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>

        <!-- Contacts List -->
        <div v-else-if="filteredContacts.length > 0" class="space-y-4">
          <div
            v-for="contact in filteredContacts"
            :key="contact.id"
            class="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors cursor-pointer"
            :class="{ 'border-l-4 border-yellow-500': contact.status === 'new' }"
            @click="openDetail(contact)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold text-white">{{ contact.subject || 'ไม่มีหัวข้อ' }}</h3>
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      contact.status === 'new' ? 'bg-yellow-500/20 text-yellow-400' :
                      contact.status === 'read' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    ]"
                  >
                    {{ getStatusLabel(contact.status) }}
                  </span>
                </div>
                <div class="flex items-center gap-4 text-sm text-gray-400 mb-2">
                  <span>{{ contact.name }}</span>
                  <span>{{ contact.email }}</span>
                  <span v-if="contact.phone">{{ contact.phone }}</span>
                </div>
                <p class="text-gray-300 line-clamp-2">{{ contact.message }}</p>
              </div>
              <div class="text-right text-sm text-gray-500 ml-4">
                {{ formatDate(contact.createdAt) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <p class="text-gray-400">ไม่มีข้อความ</p>
        </div>
      </div>
    </BackendLayout>

    <!-- Detail Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showDetailModal && selectedContact"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          @click="closeDetail"
        >
          <div
            class="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            @click.stop
          >
            <!-- Modal Header -->
            <div class="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 class="text-xl font-bold text-white">รายละเอียดข้อความ</h2>
              <button
                @click="closeDetail"
                class="text-gray-400 hover:text-white transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Modal Content -->
            <div class="p-6 space-y-6">
              <!-- Status & Date -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-gray-400">สถานะ:</span>
                  <select
                    v-model="selectedContact.status"
                    @change="updateStatus"
                    class="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1 text-sm"
                  >
                    <option value="new">ใหม่</option>
                    <option value="read">อ่านแล้ว</option>
                    <option value="replied">ตอบกลับแล้ว</option>
                  </select>
                </div>
                <span class="text-gray-500 text-sm">{{ formatDate(selectedContact.createdAt) }}</span>
              </div>

              <!-- Contact Info -->
              <div class="bg-gray-700/50 rounded-lg p-4 space-y-3">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-gray-400 text-sm">ชื่อ</p>
                    <p class="text-white font-medium">{{ selectedContact.name }}</p>
                  </div>
                  <div>
                    <p class="text-gray-400 text-sm">อีเมล</p>
                    <a :href="`mailto:${selectedContact.email}`" class="text-primary-400 hover:text-primary-300">
                      {{ selectedContact.email }}
                    </a>
                  </div>
                  <div v-if="selectedContact.phone">
                    <p class="text-gray-400 text-sm">เบอร์โทร</p>
                    <a :href="`tel:${selectedContact.phone}`" class="text-primary-400 hover:text-primary-300">
                      {{ selectedContact.phone }}
                    </a>
                  </div>
                </div>
              </div>

              <!-- Subject -->
              <div>
                <p class="text-gray-400 text-sm mb-1">หัวข้อ</p>
                <p class="text-white font-medium">{{ selectedContact.subject || 'ไม่มีหัวข้อ' }}</p>
              </div>

              <!-- Message -->
              <div>
                <p class="text-gray-400 text-sm mb-1">ข้อความ</p>
                <div class="bg-gray-700/50 rounded-lg p-4">
                  <p class="text-white whitespace-pre-wrap">{{ selectedContact.message }}</p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 pt-4 border-t border-gray-700">
                <a
                  :href="`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`"
                  class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-white transition-colors"
                  style="background-color: #FF8E00;"
                  @click="markAsReplied"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  ตอบกลับทางอีเมล
                </a>
                <button
                  @click="deleteContact"
                  class="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: ['auth', 'admin']
})

useHead({
  title: 'ข้อความติดต่อ - Backend'
})

const contacts = ref<any[]>([])
const loading = ref(true)
const filterStatus = ref('')
const showDetailModal = ref(false)
const selectedContact = ref<any>(null)

// Stats
const newCount = computed(() => contacts.value.filter(c => c.status === 'new').length)
const readCount = computed(() => contacts.value.filter(c => c.status === 'read').length)
const repliedCount = computed(() => contacts.value.filter(c => c.status === 'replied').length)

// Filtered contacts
const filteredContacts = computed(() => {
  if (!filterStatus.value) return contacts.value
  return contacts.value.filter(c => c.status === filterStatus.value)
})

// Load contacts
const loadContacts = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/contacts')
    contacts.value = response.data || []
  } catch (err) {
    console.error('Failed to load contacts:', err)
  } finally {
    loading.value = false
  }
}

// Format date
const formatDate = (date: any) => {
  if (!date) return '-'
  let d: Date
  if (date._seconds) {
    d = new Date(date._seconds * 1000)
  } else if (date.toDate) {
    d = date.toDate()
  } else {
    d = new Date(date)
  }
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

// Get status label
const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    new: 'ใหม่',
    read: 'อ่านแล้ว',
    replied: 'ตอบกลับแล้ว'
  }
  return labels[status] || status
}

// Open detail modal
const openDetail = async (contact: any) => {
  selectedContact.value = { ...contact }
  showDetailModal.value = true

  // Mark as read if new
  if (contact.status === 'new') {
    try {
      await $fetch(`/api/contacts/${contact.id}`, {
        method: 'PATCH',
        body: { status: 'read' }
      })
      // Update local state
      const index = contacts.value.findIndex(c => c.id === contact.id)
      if (index !== -1) {
        contacts.value[index].status = 'read'
      }
      selectedContact.value.status = 'read'
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }
}

// Close detail modal
const closeDetail = () => {
  showDetailModal.value = false
  selectedContact.value = null
}

// Update status
const updateStatus = async () => {
  if (!selectedContact.value) return

  try {
    await $fetch(`/api/contacts/${selectedContact.value.id}`, {
      method: 'PATCH',
      body: { status: selectedContact.value.status }
    })
    // Update local state
    const index = contacts.value.findIndex(c => c.id === selectedContact.value.id)
    if (index !== -1) {
      contacts.value[index].status = selectedContact.value.status
    }
  } catch (err) {
    console.error('Failed to update status:', err)
  }
}

// Mark as replied
const markAsReplied = async () => {
  if (!selectedContact.value) return
  selectedContact.value.status = 'replied'
  await updateStatus()
}

// Delete contact
const deleteContact = async () => {
  if (!selectedContact.value) return

  if (!confirm('ต้องการลบข้อความนี้หรือไม่?')) return

  try {
    await $fetch(`/api/contacts/${selectedContact.value.id}`, {
      method: 'DELETE'
    })
    // Remove from local state
    contacts.value = contacts.value.filter(c => c.id !== selectedContact.value.id)
    closeDetail()
  } catch (err) {
    console.error('Failed to delete contact:', err)
    alert('ไม่สามารถลบข้อความได้')
  }
}

onMounted(() => {
  loadContacts()
})
</script>
