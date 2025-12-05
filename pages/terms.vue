<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="container-custom max-w-3xl">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">ข้อกำหนดการใช้งาน</h1>

      <div class="bg-white rounded-xl shadow-md p-8 prose prose-gray max-w-none">
        <p class="text-gray-600 mb-6">อัปเดตล่าสุด: 1 ธันวาคม 2567</p>

        <h2 class="text-xl font-semibold mt-8 mb-4">1. การยอมรับข้อกำหนด</h2>
        <p>การใช้งาน PetCanGo ถือว่าคุณยอมรับข้อกำหนดการใช้งานทั้งหมด หากไม่ยอมรับ กรุณาหยุดใช้งานเว็บไซต์</p>

        <h2 class="text-xl font-semibold mt-8 mb-4">2. การใช้บริการ</h2>
        <p>คุณตกลงที่จะ:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li>ใช้บริการเพื่อวัตถุประสงค์ที่ถูกกฎหมาย</li>
          <li>ไม่ละเมิดสิทธิ์ของผู้อื่น</li>
          <li>ให้ข้อมูลที่ถูกต้องและเป็นปัจจุบัน</li>
          <li>ไม่พยายามเข้าถึงระบบโดยไม่ได้รับอนุญาต</li>
        </ul>

        <h2 class="text-xl font-semibold mt-8 mb-4">3. บัญชีผู้ใช้</h2>
        <p>คุณมีหน้าที่รักษาความปลอดภัยของบัญชีและรหัสผ่าน และรับผิดชอบต่อกิจกรรมทั้งหมดที่เกิดขึ้นภายใต้บัญชีของคุณ</p>

        <h2 class="text-xl font-semibold mt-8 mb-4">4. เนื้อหาของผู้ใช้</h2>
        <p>เมื่อคุณโพสต์เนื้อหาบนแพลตฟอร์ม คุณให้สิทธิ์แก่ PetCanGo ในการใช้ แสดง และเผยแพร่เนื้อหานั้น คุณรับรองว่าเนื้อหาเป็นของคุณและไม่ละเมิดสิทธิ์ผู้อื่น</p>

        <h2 class="text-xl font-semibold mt-8 mb-4">5. ข้อจำกัดความรับผิดชอบ</h2>
        <p>PetCanGo เป็นแพลตฟอร์มรวบรวมข้อมูล เราไม่รับผิดชอบต่อ:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li>ความถูกต้องของข้อมูลที่พัก</li>
          <li>คุณภาพการบริการของที่พัก</li>
          <li>ข้อพิพาทระหว่างผู้ใช้กับที่พัก</li>
        </ul>

        <h2 class="text-xl font-semibold mt-8 mb-4">6. การเปลี่ยนแปลงข้อกำหนด</h2>
        <p>เราขอสงวนสิทธิ์ในการแก้ไขข้อกำหนดการใช้งานได้ตลอดเวลา การเปลี่ยนแปลงจะมีผลเมื่อประกาศบนเว็บไซต์</p>

        <h2 class="text-xl font-semibold mt-8 mb-4">7. กฎหมายที่ใช้บังคับ</h2>
        <p>ข้อกำหนดนี้อยู่ภายใต้กฎหมายของประเทศไทย ข้อพิพาทใดๆ จะอยู่ในเขตอำนาจศาลไทย</p>

        <h2 class="text-xl font-semibold mt-8 mb-4">8. ติดต่อเรา</h2>
        <p>หากมีคำถาม กรุณาติดต่อ: legal@petcango.com</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO
const { setBasicMeta, setBreadcrumbSchema } = useSEO()

setBasicMeta({
  title: 'ข้อกำหนดการใช้งาน',
  description: 'ข้อกำหนดการใช้งานเว็บไซต์ PetCanGo เงื่อนไขการใช้บริการ สิทธิ์และหน้าที่ของผู้ใช้งาน',
  image: 'https://petcango.com/common/og-image.jpg',
  keywords: ['ข้อกำหนดการใช้งาน', 'terms of service', 'petcango terms']
})

setBreadcrumbSchema([
  { name: 'หน้าหลัก', url: '/' },
  { name: 'ข้อกำหนดการใช้งาน', url: '/terms' }
])
</script>
