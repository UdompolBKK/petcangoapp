/**
 * Migration Script: Images to Firebase Storage
 * อัปโหลดรูปภาพจาก local storage ไปยัง Firebase Storage
 * และอัปเดต URL ในฐานข้อมูล Firestore
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { readFileSync, existsSync, statSync, readdirSync } from 'fs'
import { join, extname, relative } from 'path'

// ตั้งค่า Firebase Admin
const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'))

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.firebasestorage.app`
})

const db = getFirestore()
const bucket = getStorage().bucket()

// กำหนด path ของโฟลเดอร์ storage
const STORAGE_PATH = '/Users/udompolthivakorakot/Desktop/media'
const OLD_URL_PREFIX = '' // URL ใน Firestore เป็น relative path เช่น /nakornnayok/thiwtara/thiwtara1.png

/**
 * อัปโหลดไฟล์ไปยัง Firebase Storage
 */
async function uploadFile(localPath, storagePath) {
  try {
    if (!existsSync(localPath)) {
      console.warn(`  ⚠️  ไม่พบไฟล์: ${localPath}`)
      return null
    }

    // อัปโหลดไฟล์
    await bucket.upload(localPath, {
      destination: storagePath,
      metadata: {
        cacheControl: 'public, max-age=31536000', // Cache 1 ปี
      },
    })

    // สร้าง public URL
    const file = bucket.file(storagePath)
    await file.makePublic()

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`
    return publicUrl
  } catch (error) {
    console.error(`  ❌ อัปโหลดไฟล์ล้มเหลว: ${localPath}`, error.message)
    return null
  }
}

/**
 * ค้นหาไฟล์รูปภาพทั้งหมดในโฟลเดอร์ (recursive)
 */
function getAllImageFiles(dir, fileList = []) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.JPG', '.JPEG', '.PNG', '.GIF', '.WEBP', '.SVG']

  const files = readdirSync(dir, { withFileTypes: true })

  for (const file of files) {
    const fullPath = join(dir, file.name)

    if (file.isDirectory()) {
      getAllImageFiles(fullPath, fileList)
    } else if (imageExtensions.includes(extname(file.name))) {
      fileList.push(fullPath)
    }
  }

  return fileList
}

/**
 * อัปโหลดรูปภาพทั้งหมดจากโฟลเดอร์
 */
async function uploadAllImages() {
  console.log('🚀 เริ่มต้น Migration: Images to Firebase Storage')
  console.log(`📂 Source: ${STORAGE_PATH}`)
  console.log(`☁️  Destination: gs://${bucket.name}/`)
  console.log('')

  // ค้นหาไฟล์รูปภาพทั้งหมด
  const files = getAllImageFiles(STORAGE_PATH)

  console.log(`📊 พบรูปภาพทั้งหมด: ${files.length} ไฟล์`)
  console.log('⏳ กำลังอัปโหลด... (อาจใช้เวลานาน)\n')

  const urlMap = new Map() // เก็บ mapping ระหว่าง old URL -> new URL
  let uploadedCount = 0
  let failedCount = 0
  let skippedCount = 0

  for (let i = 0; i < files.length; i++) {
    const localPath = files[i]
    const relativePath = relative(STORAGE_PATH, localPath)
    const storagePath = `hotels/${relativePath}`

    // สร้าง old URL pattern (Firestore ใช้ leading slash + relative path)
    const oldUrl = `/${relativePath.replace(/\\/g, '/')}`

    // แสดงความคืบหน้าทุกๆ 50 ไฟล์
    if ((i + 1) % 50 === 0) {
      console.log(`  ⏳ [${i + 1}/${files.length}] อัปโหลดแล้ว ${uploadedCount} | ข้าม ${skippedCount} | ล้มเหลว ${failedCount}`)
    }

    // ตรวจสอบว่าไฟล์มีอยู่ใน Storage แล้วหรือไม่
    const file = bucket.file(storagePath)
    const [exists] = await file.exists()

    if (exists) {
      // ถ้ามีแล้ว ใช้ URL เดิม
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`
      urlMap.set(oldUrl, publicUrl)
      skippedCount++
      console.log(`  ⏭️  ข้าม: ${relativePath} (มีอยู่แล้ว)`)
      continue
    }

    // อัปโหลดไฟล์
    console.log(`  📤 อัปโหลด: ${relativePath}`)
    const newUrl = await uploadFile(localPath, storagePath)

    if (newUrl) {
      urlMap.set(oldUrl, newUrl)
      uploadedCount++
      console.log(`  ✅ สำเร็จ: ${relativePath}`)
    } else {
      failedCount++
      console.log(`  ❌ ล้มเหลว: ${relativePath}`)
    }
  }

  console.log(`\n✅ อัปโหลดเสร็จสิ้น!`)
  console.log(`  📤 อัปโหลดสำเร็จ: ${uploadedCount} ไฟล์`)
  console.log(`  ⏭️  ข้ามไฟล์ที่มีอยู่แล้ว: ${skippedCount} ไฟล์`)
  console.log(`  ❌ ล้มเหลว: ${failedCount} ไฟล์`)
  console.log(`  📝 URL Mappings: ${urlMap.size} รายการ\n`)

  return urlMap
}

/**
 * อัปเดต URL ในฐานข้อมูล Firestore
 */
async function updateDatabaseUrls(urlMap) {
  console.log('📝 กำลังอัปเดต URL ในฐานข้อมูล...\n')

  let updatedCount = 0

  // อัปเดต Hotels
  console.log('🏨 อัปเดต Hotels...')
  const hotelsSnapshot = await db.collection('hotels').get()
  const hotelBatch = db.batch()
  let hotelUpdateCount = 0

  for (const doc of hotelsSnapshot.docs) {
    const data = doc.data()
    let hasChanges = false
    const updates = {}

    // อัปเดต mainImage (รองรับทั้ง relative path และ old path)
    if (data.mainImage) {
      const newUrl = urlMap.get(data.mainImage)
      if (newUrl) {
        updates.mainImage = newUrl
        hasChanges = true
      }
    }

    // อัปเดต image field ด้วย
    if (data.image) {
      const newUrl = urlMap.get(data.image)
      if (newUrl) {
        updates.image = newUrl
        hasChanges = true
      }
    }

    // อัปเดต images array
    if (data.images && Array.isArray(data.images)) {
      const updatedImages = data.images.map(img => {
        if (typeof img === 'string') {
          const newUrl = urlMap.get(img)
          return newUrl || img
        }
        return img
      })

      if (JSON.stringify(updatedImages) !== JSON.stringify(data.images)) {
        updates.images = updatedImages
        hasChanges = true
      }
    }

    // อัปเดต gallery
    if (data.gallery && Array.isArray(data.gallery)) {
      const updatedGallery = data.gallery.map(item => {
        if (item.image) {
          const newUrl = urlMap.get(item.image)
          if (newUrl) {
            return { ...item, image: newUrl }
          }
        }
        return item
      })

      if (JSON.stringify(updatedGallery) !== JSON.stringify(data.gallery)) {
        updates.gallery = updatedGallery
        hasChanges = true
      }
    }

    if (hasChanges) {
      hotelBatch.update(doc.ref, updates)
      hotelUpdateCount++
    }
  }

  if (hotelUpdateCount > 0) {
    await hotelBatch.commit()
    console.log(`  ✅ อัปเดต ${hotelUpdateCount} hotels`)
    updatedCount += hotelUpdateCount
  }

  // อัปเดต Blogs
  console.log('📰 อัปเดต Blogs...')
  const blogsSnapshot = await db.collection('blogs').get()
  const blogBatch = db.batch()
  let blogUpdateCount = 0

  for (const doc of blogsSnapshot.docs) {
    const data = doc.data()
    let hasChanges = false
    const updates = {}

    // อัปเดต featuredImage
    if (data.featuredImage && data.featuredImage.startsWith('/storage/app/media/')) {
      const newUrl = urlMap.get(data.featuredImage)
      if (newUrl) {
        updates.featuredImage = newUrl
        hasChanges = true
      }
    }

    // อัปเดต URL ใน content (HTML)
    if (data.content) {
      let updatedContent = data.content
      let contentChanged = false

      for (const [oldUrl, newUrl] of urlMap.entries()) {
        if (updatedContent.includes(oldUrl)) {
          updatedContent = updatedContent.replaceAll(oldUrl, newUrl)
          contentChanged = true
        }
      }

      if (contentChanged) {
        updates.content = updatedContent
        hasChanges = true
      }
    }

    if (hasChanges) {
      blogBatch.update(doc.ref, updates)
      blogUpdateCount++
    }
  }

  if (blogUpdateCount > 0) {
    await blogBatch.commit()
    console.log(`  ✅ อัปเดต ${blogUpdateCount} blogs`)
    updatedCount += blogUpdateCount
  }

  // อัปเดต Provinces
  console.log('🗺️  อัปเดต Provinces...')
  const provincesSnapshot = await db.collection('provinces').get()
  const provinceBatch = db.batch()
  let provinceUpdateCount = 0

  for (const doc of provincesSnapshot.docs) {
    const data = doc.data()
    let hasChanges = false
    const updates = {}

    // อัปเดต image
    if (data.image && data.image.startsWith('/storage/app/media/')) {
      const newUrl = urlMap.get(data.image)
      if (newUrl) {
        updates.image = newUrl
        hasChanges = true
      }
    }

    // อัปเดต attractions
    if (data.attractions && Array.isArray(data.attractions)) {
      const updatedAttractions = data.attractions.map(item => {
        if (item.image && item.image.startsWith('/storage/app/media/')) {
          const newUrl = urlMap.get(item.image)
          if (newUrl) {
            return { ...item, image: newUrl }
          }
        }
        return item
      })

      if (JSON.stringify(updatedAttractions) !== JSON.stringify(data.attractions)) {
        updates.attractions = updatedAttractions
        hasChanges = true
      }
    }

    if (hasChanges) {
      provinceBatch.update(doc.ref, updates)
      provinceUpdateCount++
    }
  }

  if (provinceUpdateCount > 0) {
    await provinceBatch.commit()
    console.log(`  ✅ อัปเดต ${provinceUpdateCount} provinces`)
    updatedCount += provinceUpdateCount
  }

  // อัปเดต Facilities
  console.log('🏷️  อัปเดต Facilities...')
  const facilitiesSnapshot = await db.collection('facilities').get()
  const facilityBatch = db.batch()
  let facilityUpdateCount = 0

  for (const doc of facilitiesSnapshot.docs) {
    const data = doc.data()
    let hasChanges = false
    const updates = {}

    // อัปเดต icon
    if (data.icon && data.icon.startsWith('/storage/app/media/')) {
      const newUrl = urlMap.get(data.icon)
      if (newUrl) {
        updates.icon = newUrl
        hasChanges = true
      }
    }

    if (hasChanges) {
      facilityBatch.update(doc.ref, updates)
      facilityUpdateCount++
    }
  }

  if (facilityUpdateCount > 0) {
    await facilityBatch.commit()
    console.log(`  ✅ อัปเดต ${facilityUpdateCount} facilities`)
    updatedCount += facilityUpdateCount
  }

  console.log(`\n✅ อัปเดต URL ในฐานข้อมูลเสร็จสิ้น! (${updatedCount} documents)\n`)
}

/**
 * Main function
 */
async function migrateImages() {
  try {
    // ตรวจสอบว่าโฟลเดอร์ storage มีอยู่จริง
    if (!existsSync(STORAGE_PATH)) {
      throw new Error(`ไม่พบโฟลเดอร์: ${STORAGE_PATH}`)
    }

    console.log('=' .repeat(80))
    console.log('🖼️  PetCanGo - Image Migration to Firebase Storage')
    console.log('=' .repeat(80) + '\n')

    // 1. อัปโหลดรูปภาพทั้งหมด
    const urlMap = await uploadAllImages()

    // 2. อัปเดต URL ในฐานข้อมูล
    await updateDatabaseUrls(urlMap)

    console.log('=' .repeat(80))
    console.log('🎉 Image Migration เสร็จสิ้นสมบูรณ์!')
    console.log('=' .repeat(80) + '\n')

    console.log('💡 ขั้นตอนถัดไป:')
    console.log('  1. ตรวจสอบรูปภาพใน Firebase Storage Console')
    console.log('  2. ทดสอบการแสดงผลรูปภาพบนเว็บไซต์')
    console.log('  3. ตั้งค่า CORS สำหรับ Firebase Storage (ถ้าจำเป็น)')
    console.log('  4. ลบโฟลเดอร์ storage เก่าออก (หลังจากทดสอบเรียบร้อย)\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Migration ล้มเหลว:', error)
    process.exit(1)
  }
}

// รันสคริปต์
migrateImages()
