/**
 * Reorganize Storage Script
 * จัดระเบียบไฟล์จาก media/* ไปยังโครงสร้างแบบ entity-based
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { readFileSync } from 'fs'

const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'))

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.firebasestorage.app`
})

const db = getFirestore()
const bucket = getStorage().bucket()

/**
 * คัดลอกและย้ายไฟล์
 */
async function moveFile(oldPath, newPath) {
  try {
    const sourceFile = bucket.file(oldPath)
    const [exists] = await sourceFile.exists()

    if (!exists) {
      console.warn(`  ⚠️  ไม่พบไฟล์: ${oldPath}`)
      return null
    }

    // คัดลอกไปยัง path ใหม่
    await sourceFile.copy(bucket.file(newPath))

    // ลบไฟล์เก่า (optional - comment ออกถ้าไม่ต้องการลบ)
    // await sourceFile.delete()

    const newUrl = `https://storage.googleapis.com/${bucket.name}/${newPath}`
    console.log(`  ✅ ย้าย: ${oldPath} → ${newPath}`)

    return newUrl
  } catch (error) {
    console.error(`  ❌ Error moving ${oldPath}:`, error.message)
    return null
  }
}

/**
 * Reorganize Hotels
 */
async function reorganizeHotels() {
  console.log('\n🏨 จัดระเบียบรูปภาพ Hotels...')

  const hotelsSnapshot = await db.collection('hotels').get()
  let count = 0

  for (const doc of hotelsSnapshot.docs) {
    const hotel = doc.data()
    const hotelId = doc.id
    const updates = {}

    // ย้าย mainImage
    if (hotel.mainImage && hotel.mainImage.includes('/media/')) {
      const oldPath = hotel.mainImage.split('/').slice(-2).join('/')
      const newPath = `hotels/${hotelId}/main${getExtension(oldPath)}`

      const newUrl = await moveFile(oldPath, newPath)
      if (newUrl) {
        updates.mainImage = newUrl
      }
    }

    // ย้าย gallery
    if (hotel.gallery && Array.isArray(hotel.gallery)) {
      const updatedGallery = []

      for (let i = 0; i < hotel.gallery.length; i++) {
        const item = hotel.gallery[i]

        if (item.image && item.image.includes('/media/')) {
          const oldPath = item.image.split('/').slice(-2).join('/')
          const newPath = `hotels/${hotelId}/gallery/${i + 1}${getExtension(oldPath)}`

          const newUrl = await moveFile(oldPath, newPath)
          updatedGallery.push({
            ...item,
            image: newUrl || item.image
          })
        } else {
          updatedGallery.push(item)
        }
      }

      if (updatedGallery.length > 0) {
        updates.gallery = updatedGallery
      }
    }

    // อัปเดตฐานข้อมูล
    if (Object.keys(updates).length > 0) {
      await doc.ref.update(updates)
      count++
      console.log(`  ✓ อัปเดต: ${hotel.name}`)
    }
  }

  console.log(`✅ จัดระเบียบ ${count} hotels เสร็จสิ้น`)
}

/**
 * Reorganize Blogs
 */
async function reorganizeBlogs() {
  console.log('\n📰 จัดระเบียบรูปภาพ Blogs...')

  const blogsSnapshot = await db.collection('blogs').get()
  let count = 0

  for (const doc of blogsSnapshot.docs) {
    const blog = doc.data()
    const blogId = doc.id
    const updates = {}

    // ย้าย featuredImage
    if (blog.featuredImage && blog.featuredImage.includes('/media/')) {
      const oldPath = blog.featuredImage.split('/').slice(-2).join('/')
      const newPath = `blogs/${blogId}/featured${getExtension(oldPath)}`

      const newUrl = await moveFile(oldPath, newPath)
      if (newUrl) {
        updates.featuredImage = newUrl
      }
    }

    // อัปเดตรูปใน content (ถ้ามี)
    if (blog.content && blog.content.includes('/media/')) {
      // TODO: Parse HTML และแทนที่ URL รูปภาพ
      // ตอนนี้ข้ามไปก่อน
    }

    // อัปเดตฐานข้อมูล
    if (Object.keys(updates).length > 0) {
      await doc.ref.update(updates)
      count++
      console.log(`  ✓ อัปเดต: ${blog.title}`)
    }
  }

  console.log(`✅ จัดระเบียบ ${count} blogs เสร็จสิ้น`)
}

/**
 * Reorganize Provinces
 */
async function reorganizeProvinces() {
  console.log('\n🗺️  จัดระเบียบรูปภาพ Provinces...')

  const provincesSnapshot = await db.collection('provinces').get()
  let count = 0

  for (const doc of provincesSnapshot.docs) {
    const province = doc.data()
    const provinceId = doc.id
    const updates = {}

    // ย้าย image
    if (province.image && province.image.includes('/media/')) {
      const oldPath = province.image.split('/').slice(-2).join('/')
      const newPath = `provinces/${provinceId}/cover${getExtension(oldPath)}`

      const newUrl = await moveFile(oldPath, newPath)
      if (newUrl) {
        updates.image = newUrl
      }
    }

    // ย้าย attractions images
    if (province.attractions && Array.isArray(province.attractions)) {
      const updatedAttractions = []

      for (let i = 0; i < province.attractions.length; i++) {
        const attraction = province.attractions[i]

        if (attraction.image && attraction.image.includes('/media/')) {
          const oldPath = attraction.image.split('/').slice(-2).join('/')
          const newPath = `provinces/${provinceId}/attractions/${i + 1}${getExtension(oldPath)}`

          const newUrl = await moveFile(oldPath, newPath)
          updatedAttractions.push({
            ...attraction,
            image: newUrl || attraction.image
          })
        } else {
          updatedAttractions.push(attraction)
        }
      }

      if (updatedAttractions.length > 0) {
        updates.attractions = updatedAttractions
      }
    }

    // อัปเดตฐานข้อมูล
    if (Object.keys(updates).length > 0) {
      await doc.ref.update(updates)
      count++
      console.log(`  ✓ อัปเดต: ${province.name}`)
    }
  }

  console.log(`✅ จัดระเบียบ ${count} provinces เสร็จสิ้น`)
}

/**
 * Reorganize Facilities
 */
async function reorganizeFacilities() {
  console.log('\n🏷️  จัดระเบียบรูปภาพ Facilities...')

  const facilitiesSnapshot = await db.collection('facilities').get()
  let count = 0

  for (const doc of facilitiesSnapshot.docs) {
    const facility = doc.data()
    const facilityId = doc.id
    const updates = {}

    // ย้าย icon
    if (facility.icon && facility.icon.includes('/media/')) {
      const oldPath = facility.icon.split('/').slice(-2).join('/')
      const newPath = `facilities/${facilityId}/icon${getExtension(oldPath)}`

      const newUrl = await moveFile(oldPath, newPath)
      if (newUrl) {
        updates.icon = newUrl
      }
    }

    // อัปเดตฐานข้อมูล
    if (Object.keys(updates).length > 0) {
      await doc.ref.update(updates)
      count++
      console.log(`  ✓ อัปเดต: ${facility.name}`)
    }
  }

  console.log(`✅ จัดระเบียบ ${count} facilities เสร็จสิ้น`)
}

/**
 * Helper: ดึง file extension
 */
function getExtension(path) {
  const match = path.match(/\.[^.]+$/)
  return match ? match[0] : '.jpg'
}

/**
 * Main function
 */
async function reorganizeStorage() {
  console.log('=' .repeat(80))
  console.log('🔄 เริ่มจัดระเบียบ Storage')
  console.log('=' .repeat(80))

  try {
    await reorganizeHotels()
    await reorganizeBlogs()
    await reorganizeProvinces()
    await reorganizeFacilities()

    console.log('\n' + '=' .repeat(80))
    console.log('🎉 จัดระเบียบ Storage เสร็จสิ้น!')
    console.log('=' .repeat(80))

    console.log('\n💡 ขั้นตอนถัดไป:')
    console.log('  1. ตรวจสอบไฟล์ใน Firebase Storage Console')
    console.log('  2. ทดสอบการแสดงผลรูปภาพบนเว็บไซต์')
    console.log('  3. ลบไฟล์เก่าใน media/* (ถ้าต้องการ)')

    process.exit(0)
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
    process.exit(1)
  }
}

reorganizeStorage()
