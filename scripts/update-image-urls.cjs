/**
 * Script เพื่ออัปเดต image paths ใน Firestore ให้เป็น full Storage URLs
 * รันด้วย: node scripts/update-image-urls.js
 */

const admin = require('firebase-admin')
const serviceAccount = require('../serviceAccountKey.json')

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'petcangoapp.firebasestorage.app'
})

const db = admin.firestore()
const STORAGE_BUCKET = 'petcangoapp.firebasestorage.app'

/**
 * แปลง path เป็น full Storage URL
 */
function getStorageUrl(path) {
  if (!path) return null

  // ถ้าเป็น URL เต็มรูปแบบแล้ว ให้ return ไปเลย
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  // ลบ leading slash ออก
  let cleanPath = path.startsWith('/') ? path.slice(1) : path

  // ลบ "images/" prefix ออก เพราะใน Storage ไม่มี folder นี้
  if (cleanPath.startsWith('images/')) {
    cleanPath = cleanPath.slice(7)
  }

  // สร้าง full URL
  return `https://storage.googleapis.com/${STORAGE_BUCKET}/media/${cleanPath}`
}

/**
 * อัปเดตรูปภาพของที่พัก (Hotels)
 */
async function updateHotels() {
  console.log('\n🏨 กำลังอัปเดต Hotels...')

  const hotelsSnapshot = await db.collection('hotels').get()
  let updatedCount = 0

  const batch = db.batch()

  hotelsSnapshot.forEach(doc => {
    const hotel = doc.data()
    const updates = {}

    // อัปเดต mainImage
    if (hotel.mainImage && !hotel.mainImage.startsWith('http')) {
      updates.mainImage = getStorageUrl(hotel.mainImage)
    }

    // อัปเดต image
    if (hotel.image && !hotel.image.startsWith('http')) {
      updates.image = getStorageUrl(hotel.image)
    }

    // อัปเดต images array
    if (hotel.images && Array.isArray(hotel.images)) {
      updates.images = hotel.images.map(img => {
        if (typeof img === 'string' && !img.startsWith('http')) {
          return getStorageUrl(img)
        }
        return img
      })
    }

    // อัปเดต gallery
    if (hotel.gallery && Array.isArray(hotel.gallery)) {
      updates.gallery = hotel.gallery.map(item => {
        if (item.image && !item.image.startsWith('http')) {
          return {
            ...item,
            image: getStorageUrl(item.image)
          }
        }
        return item
      })
    }

    if (Object.keys(updates).length > 0) {
      batch.update(doc.ref, updates)
      updatedCount++
      console.log(`  ✓ ${hotel.name || doc.id}`)
    }
  })

  await batch.commit()
  console.log(`✅ อัปเดต ${updatedCount} hotels เสร็จแล้ว`)
}

/**
 * อัปเดตรูปภาพของจังหวัด (Provinces)
 */
async function updateProvinces() {
  console.log('\n🗺️  กำลังอัปเดต Provinces...')

  const provincesSnapshot = await db.collection('provinces').get()
  let updatedCount = 0

  const batch = db.batch()

  provincesSnapshot.forEach(doc => {
    const province = doc.data()
    const updates = {}

    // อัปเดต image
    if (province.image && !province.image.startsWith('http')) {
      updates.image = getStorageUrl(province.image)
    }

    // อัปเดต attractions
    if (province.attractions && Array.isArray(province.attractions)) {
      updates.attractions = province.attractions.map(item => {
        if (item.image && !item.image.startsWith('http')) {
          return {
            ...item,
            image: getStorageUrl(item.image)
          }
        }
        return item
      })
    }

    if (Object.keys(updates).length > 0) {
      batch.update(doc.ref, updates)
      updatedCount++
      console.log(`  ✓ ${province.name || doc.id}`)
    }
  })

  await batch.commit()
  console.log(`✅ อัปเดต ${updatedCount} provinces เสร็จแล้ว`)
}

/**
 * อัปเดตรูปภาพของบล็อก (Blogs)
 */
async function updateBlogs() {
  console.log('\n📝 กำลังอัปเดต Blogs...')

  const blogsSnapshot = await db.collection('blogs').get()
  let updatedCount = 0

  const batch = db.batch()

  blogsSnapshot.forEach(doc => {
    const blog = doc.data()
    const updates = {}

    // อัปเดต featuredImage
    if (blog.featuredImage && !blog.featuredImage.startsWith('http')) {
      updates.featuredImage = getStorageUrl(blog.featuredImage)
    }

    if (Object.keys(updates).length > 0) {
      batch.update(doc.ref, updates)
      updatedCount++
      console.log(`  ✓ ${blog.title || doc.id}`)
    }
  })

  await batch.commit()
  console.log(`✅ อัปเดต ${updatedCount} blogs เสร็จแล้ว`)
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 เริ่มอัปเดต image URLs ใน Firestore...')
  console.log('=' .repeat(50))

  try {
    await updateHotels()
    await updateProvinces()
    await updateBlogs()

    console.log('\n' + '='.repeat(50))
    console.log('✅ อัปเดตทั้งหมดเสร็จสมบูรณ์!')
    console.log('=' .repeat(50))

    process.exit(0)
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
    process.exit(1)
  }
}

// รัน script
main()
