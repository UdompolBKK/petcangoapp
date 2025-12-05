<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="container-custom">
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">แพ็คเกจลงทะเบียนที่พัก</h1>
        <p class="text-gray-600 max-w-2xl mx-auto">เลือกแพ็คเกจที่เหมาะสมกับธุรกิจของคุณ</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <!-- Free Plan -->
        <div class="bg-white rounded-xl shadow-md p-8">
          <h3 class="text-xl font-bold mb-2">ฟรี</h3>
          <p class="text-4xl font-bold text-gray-900 mb-6">฿0 <span class="text-base font-normal text-gray-500">/เดือน</span></p>
          <ul class="space-y-3 mb-8">
            <li class="flex items-center text-gray-600">
              <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              ลงทะเบียน 1 ที่พัก
            </li>
            <li class="flex items-center text-gray-600">
              <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              รูปภาพ 5 รูป
            </li>
            <li class="flex items-center text-gray-600">
              <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              แสดงในผลการค้นหา
            </li>
          </ul>
          <NuxtLink to="/register" class="block w-full text-center btn btn-outline">เริ่มต้นใช้งาน</NuxtLink>
        </div>

        <!-- Pro Plan -->
        <div class="bg-primary-500 text-white rounded-xl shadow-lg p-8 transform scale-105">
          <div class="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">แนะนำ</div>
          <h3 class="text-xl font-bold mb-2">Pro</h3>
          <p class="text-4xl font-bold mb-6">฿299 <span class="text-base font-normal opacity-80">/เดือน</span></p>
          <ul class="space-y-3 mb-8">
            <li class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              ลงทะเบียนไม่จำกัด
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              รูปภาพไม่จำกัด
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              แสดงบนหน้าแรก
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              สถิติการเข้าชม
            </li>
          </ul>
          <button class="w-full bg-white text-primary-500 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">เลือกแพ็คเกจนี้</button>
        </div>

        <!-- Business Plan -->
        <div class="bg-white rounded-xl shadow-md p-8">
          <h3 class="text-xl font-bold mb-2">Business</h3>
          <p class="text-4xl font-bold text-gray-900 mb-6">฿799 <span class="text-base font-normal text-gray-500">/เดือน</span></p>
          <ul class="space-y-3 mb-8">
            <li class="flex items-center text-gray-600">
              <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              ทุกอย่างใน Pro
            </li>
            <li class="flex items-center text-gray-600">
              <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              โปรโมทบน Social
            </li>
            <li class="flex items-center text-gray-600">
              <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              รายงานละเอียด
            </li>
            <li class="flex items-center text-gray-600">
              <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              ซัพพอร์ต 24/7
            </li>
          </ul>
          <button class="w-full btn btn-outline">ติดต่อเรา</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO
const { setBasicMeta, setBreadcrumbSchema } = useSEO()

setBasicMeta({
  title: 'แพ็คเกจลงทะเบียนที่พัก - ราคาและบริการ',
  description: 'แพ็คเกจลงทะเบียนที่พักบน PetCanGo เลือกแผนที่เหมาะสมกับธุรกิจของคุณ ตั้งแต่ฟรีจนถึง Business พร้อมฟีเจอร์ครบครัน',
  image: 'https://petcango.com/common/og-image.jpg',
  keywords: ['ลงทะเบียนที่พัก', 'แพ็คเกจโรงแรม', 'petcango pricing', 'ลงประกาศที่พักสัตว์เลี้ยง']
})

setBreadcrumbSchema([
  { name: 'หน้าหลัก', url: '/' },
  { name: 'แพ็คเกจและราคา', url: '/pricing' }
])
</script>
