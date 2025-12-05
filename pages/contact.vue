<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="container-custom max-w-3xl">
      <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">ติดต่อเรา</h1>

      <div class="bg-white rounded-xl shadow-md p-8">
        <!-- Success Message -->
        <div
          v-if="submitted"
          class="text-center py-12"
        >
          <div class="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style="background-color: #FF8E00;">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">ขอบคุณสำหรับข้อความ!</h2>
          <p class="text-gray-600 mb-6">เราได้รับข้อความของคุณแล้ว และจะติดต่อกลับโดยเร็วที่สุด</p>
          <button
            @click="resetForm"
            class="px-6 py-2 text-white font-medium rounded-lg transition-colors"
            style="background-color: #FF8E00;"
          >
            ส่งข้อความอีกครั้ง
          </button>
        </div>

        <!-- Contact Form -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Error Message -->
          <div
            v-if="errorMessage"
            class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
          >
            {{ errorMessage }}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ชื่อ <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="ชื่อของคุณ"
                :disabled="sending"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                เบอร์โทรศัพท์
              </label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="081-234-5678"
                :disabled="sending"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              อีเมล <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="email@example.com"
              :disabled="sending"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              หัวข้อ <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.subject"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="หัวข้อที่ต้องการติดต่อ"
              :disabled="sending"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ข้อความ <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.message"
              rows="5"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="รายละเอียดที่ต้องการติดต่อ"
              :disabled="sending"
            />
          </div>

          <button
            type="submit"
            :disabled="sending"
            class="w-full text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 shadow-md hover:shadow-lg flex items-center justify-center"
            style="background-color: #FF8E00;"
          >
            <svg
              v-if="sending"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ sending ? 'กำลังส่ง...' : 'ส่งข้อความ' }}
          </button>
        </form>

        <!-- Contact Info -->
        <div class="mt-8 pt-8 border-t border-gray-200">
          <h3 class="text-lg font-semibold mb-4">ช่องทางอื่นๆ</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex items-center gap-3 text-gray-600">
              <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">Email</p>
                <p class="font-medium">contact@petcango.com</p>
              </div>
            </div>

            <div class="flex items-center gap-3 text-gray-600">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">Facebook</p>
                <p class="font-medium">PetCanGo Thailand</p>
              </div>
            </div>

            <div class="flex items-center gap-3 text-gray-600">
              <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">Line</p>
                <p class="font-medium">@petcango</p>
              </div>
            </div>
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
  phone: '',
  subject: '',
  message: ''
})

const sending = ref(false)
const submitted = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  sending.value = true
  errorMessage.value = ''

  try {
    await $fetch('/api/contacts/create', {
      method: 'POST',
      body: {
        name: form.value.name,
        email: form.value.email,
        phone: form.value.phone,
        subject: form.value.subject,
        message: form.value.message
      }
    })

    submitted.value = true

  } catch (err: any) {
    console.error('Failed to submit contact form:', err)
    errorMessage.value = err.data?.message || 'ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง'
  } finally {
    sending.value = false
  }
}

const resetForm = () => {
  form.value = { name: '', email: '', phone: '', subject: '', message: '' }
  submitted.value = false
  errorMessage.value = ''
}

useHead({
  title: 'ติดต่อเรา - PetCanGo'
})
</script>
