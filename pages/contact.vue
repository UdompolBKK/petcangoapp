<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="container-custom max-w-3xl">
      <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">ติดต่อเรา</h1>

      <div class="bg-white rounded-xl shadow-md p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ชื่อ</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="ชื่อของคุณ"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">หัวข้อ</label>
            <input
              v-model="form.subject"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="หัวข้อที่ต้องการติดต่อ"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ข้อความ</label>
            <textarea
              v-model="form.message"
              rows="5"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="รายละเอียดที่ต้องการติดต่อ"
            />
          </div>

          <button
            type="submit"
            :disabled="sending"
            class="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            {{ sending ? 'กำลังส่ง...' : 'ส่งข้อความ' }}
          </button>
        </form>

        <!-- Contact Info -->
        <div class="mt-8 pt-8 border-t border-gray-200">
          <h3 class="text-lg font-semibold mb-4">ช่องทางอื่นๆ</h3>
          <div class="space-y-3 text-gray-600">
            <p>Email: contact@petcango.com</p>
            <p>Facebook: PetCanGo Thailand</p>
            <p>Line: @petcango</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const sending = ref(false)

const handleSubmit = async () => {
  sending.value = true
  // TODO: Implement form submission
  await new Promise(resolve => setTimeout(resolve, 1000))
  alert('ขอบคุณสำหรับข้อความ เราจะติดต่อกลับโดยเร็วที่สุด')
  form.value = { name: '', email: '', subject: '', message: '' }
  sending.value = false
}

useHead({
  title: 'ติดต่อเรา - PetCanGo'
})
</script>
