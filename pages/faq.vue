<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="container-custom max-w-3xl">
      <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">คำถามที่พบบ่อย</h1>

      <div class="space-y-4">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <button
            @click="toggle(index)"
            class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span class="font-semibold text-gray-900">{{ faq.question }}</span>
            <svg
              class="w-5 h-5 text-gray-500 transition-transform"
              :class="{ 'rotate-180': openIndex === index }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div
            v-show="openIndex === index"
            class="px-6 pb-4 text-gray-600"
          >
            {{ faq.answer }}
          </div>
        </div>
      </div>

      <div class="mt-12 text-center">
        <p class="text-gray-600 mb-4">ยังมีคำถามอื่นๆ?</p>
        <NuxtLink to="/contact" class="btn btn-primary">ติดต่อเรา</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { setBasicMeta, setBreadcrumbSchema, setFAQSchema } = useSEO()

const openIndex = ref<number | null>(0)

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}

const faqs = [
  {
    question: 'PetCanGo คืออะไร?',
    answer: 'PetCanGo เป็นแพลตฟอร์มรวบรวมที่พักที่รับสัตว์เลี้ยงทั่วประเทศไทย ช่วยให้คุณค้นหาโรงแรม รีสอร์ท และที่พักที่เป็นมิตรกับสัตว์เลี้ยงได้ง่ายขึ้น'
  },
  {
    question: 'ลงทะเบียนที่พักฟรีไหม?',
    answer: 'ใช่ครับ คุณสามารถลงทะเบียนที่พักได้ฟรี โดยแพ็คเกจฟรีจะได้รูปภาพ 5 รูป และแสดงในผลการค้นหา'
  },
  {
    question: 'สัตว์เลี้ยงประเภทไหนบ้างที่รับ?',
    answer: 'ขึ้นอยู่กับนโยบายของแต่ละที่พัก ส่วนใหญ่จะรับสุนัขและแมว บางที่รับสัตว์เลี้ยงขนาดเล็กอื่นๆ ด้วย กรุณาตรวจสอบรายละเอียดในหน้าที่พัก'
  },
  {
    question: 'จองที่พักผ่าน PetCanGo ได้ไหม?',
    answer: 'ปัจจุบัน PetCanGo เป็นแพลตฟอร์มค้นหาและแสดงข้อมูล การจองให้ติดต่อที่พักโดยตรงผ่านเบอร์โทรหรือลิงก์ที่ให้ไว้'
  },
  {
    question: 'ข้อมูลที่พักอัปเดตบ่อยแค่ไหน?',
    answer: 'เจ้าของที่พักสามารถอัปเดตข้อมูลได้ตลอดเวลา ทีมงานจะตรวจสอบความถูกต้องเป็นระยะ'
  }
]

// SEO
setBasicMeta({
  title: 'คำถามที่พบบ่อย (FAQ) - PetCanGo',
  description: 'คำถามที่พบบ่อยเกี่ยวกับ PetCanGo วิธีค้นหาที่พักสัตว์เลี้ยง การลงทะเบียนที่พัก สัตว์เลี้ยงประเภทไหนที่รับ และอื่นๆ',
  image: 'https://petcango.com/common/og-image.jpg',
  keywords: ['FAQ', 'คำถามที่พบบ่อย', 'PetCanGo', 'ที่พักสัตว์เลี้ยง', 'วิธีใช้งาน']
})

setBreadcrumbSchema([
  { name: 'หน้าหลัก', url: '/' },
  { name: 'คำถามที่พบบ่อย', url: '/faq' }
])

// FAQ Schema for Rich Snippets
setFAQSchema(faqs)
</script>
