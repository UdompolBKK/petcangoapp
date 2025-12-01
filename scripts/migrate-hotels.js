/**
 * Migration Script: Hotels
 * ย้ายข้อมูลที่พักจาก MySQL ไปยัง Firestore
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import mysql from 'mysql2/promise'
import { mysqlConfig } from '../mysql.config.js'
import { readFileSync } from 'fs'

// ตั้งค่า Firebase Admin
const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'))

initializeApp({
  credential: cert(serviceAccount)
})

const db = getFirestore()

// Helper: Parse JSON safely
function parseJSON(jsonString, defaultValue = null) {
  if (!jsonString) return defaultValue

  try {
    return JSON.parse(jsonString)
  } catch (e) {
    console.warn('  ⚠️  ไม่สามารถ parse JSON:', e.message)
    return defaultValue
  }
}

async function migrateHotels() {
  console.log('🚀 เริ่มต้น Migration: Hotels')

  let connection

  try {
    // เชื่อมต่อ MySQL
    connection = await mysql.createConnection(mysqlConfig)
    console.log('✅ เชื่อมต่อ MySQL สำเร็จ')

    // โหลดข้อมูล provinces และ facilities เพื่อ mapping
    console.log('📥 โหลดข้อมูล provinces และ facilities...')

    const provincesMap = {}
    const provincesSnapshot = await db.collection('provinces').get()
    provincesSnapshot.forEach(doc => {
      const data = doc.data()
      provincesMap[data.oldId] = {
        id: doc.id,
        name: data.name,
        slug: data.slug
      }
    })
    console.log(`  ✓ โหลด ${Object.keys(provincesMap).length} จังหวัด`)

    const facilitiesMap = {}
    const facilitiesSnapshot = await db.collection('facilities').get()
    facilitiesSnapshot.forEach(doc => {
      const data = doc.data()
      facilitiesMap[data.oldId] = {
        id: doc.id,
        name: data.name,
        slug: data.slug,
        icon: data.icon
      }
    })
    console.log(`  ✓ โหลด ${Object.keys(facilitiesMap).length} สิ่งอำนวยความสะดวก`)

    // ดึงข้อมูลจาก pet_pet_hotel
    const [hotels] = await connection.execute(
      'SELECT * FROM pet_pet_hotel ORDER BY id'
    )

    console.log(`\n📊 พบข้อมูล ${hotels.length} รายการ`)
    console.log('⏳ กำลังประมวลผล... (อาจใช้เวลาสักครู่)\n')

    let count = 0
    let batchCount = 0
    let batch = db.batch()

    for (const hotel of hotels) {
      // สร้าง document reference
      const docRef = db.collection('hotels').doc()

      // Parse content JSON
      const content = parseJSON(hotel.content, [])

      // Parse gallery JSON
      const gallery = parseJSON(hotel.gallery, [])

      // Parse facility array
      let facilityIds = parseJSON(hotel.facility, [])
      if (!Array.isArray(facilityIds)) {
        facilityIds = []
      }

      // Map facilities
      const facilities = facilityIds
        .map(id => facilitiesMap[id.toString()])
        .filter(f => f !== undefined)

      // Map province
      const province = provincesMap[hotel.province?.toString()] || null

      // Parse tags - ใน MySQL เป็น comma-separated string
      let tags = []
      if (hotel.tags) {
        if (typeof hotel.tags === 'string') {
          // ถ้าเป็น string ให้ split ด้วย comma
          tags = hotel.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        } else {
          // ถ้าเป็น array อยู่แล้ว
          tags = Array.isArray(hotel.tags) ? hotel.tags : []
        }
      }

      // Parse วันที่
      const createdAt = hotel.created_at ? new Date(hotel.created_at) : new Date()
      const updatedAt = hotel.updated_at ? new Date(hotel.updated_at) : new Date()

      // เตรียมข้อมูล
      const data = {
        oldId: hotel.id.toString(),
        name: hotel.name || '',
        slug: hotel.slug || '',

        // Images
        mainImage: hotel.image || '',
        gallery: gallery.map(g => ({
          image: g.image || '',
          alttext: g.alttext || ''
        })),

        // Content
        content: content,
        shortDescription: hotel.mincontent || '',

        // Location
        province: province ? {
          id: province.id,
          name: province.name,
          slug: province.slug
        } : null,
        address: hotel.address || '',
        zipcode: hotel.zipcode || '',
        area: hotel.area || '',
        googleMapIframe: hotel.googlemap || '',

        // Pricing
        priceStart: parseInt(hotel.pricestart) || 0,
        petPrice: hotel.petprice || null,

        // Contact
        phone: hotel.phone || '',

        // Facilities
        facilities: facilities.map(f => ({
          id: f.id,
          name: f.name,
          slug: f.slug,
          icon: f.icon
        })),

        // Meta
        tags: tags,
        priority: hotel.priority || null,
        postedBy: hotel.postby || null,
        viewCount: 0, // จะอัปเดทีหลัง

        // Status
        status: 'published',
        featured: false,

        // Timestamps
        createdAt: createdAt,
        updatedAt: updatedAt
      }

      batch.set(docRef, data)
      count++
      batchCount++

      // แสดงความคืบหน้าทุกๆ 50 รายการ
      if (count % 50 === 0) {
        console.log(`  ⏳ ประมวลผลแล้ว ${count}/${hotels.length} รายการ...`)
      }

      // Firestore batch จำกัดที่ 500 operations
      if (batchCount >= 500) {
        await batch.commit()
        console.log(`  💾 บันทึก batch (${count} รายการแล้ว)`)
        batch = db.batch()
        batchCount = 0
      }
    }

    // บันทึก batch สุดท้าย
    if (batchCount > 0) {
      await batch.commit()
    }

    console.log(`\n✅ Migration สำเร็จ! ย้ายข้อมูล ${count} รายการ`)

    // อัปเดต hotelCount ในแต่ละจังหวัด
    console.log('\n📊 กำลังนับจำนวนที่พักในแต่ละจังหวัด...')
    const provinceCounts = {}
    const hotelsSnapshot = await db.collection('hotels').get()
    hotelsSnapshot.forEach(doc => {
      const provinceId = doc.data().province?.id
      if (provinceId) {
        provinceCounts[provinceId] = (provinceCounts[provinceId] || 0) + 1
      }
    })

    // อัปเดต provinces
    const updateBatch = db.batch()
    for (const [provinceId, count] of Object.entries(provinceCounts)) {
      const provinceRef = db.collection('provinces').doc(provinceId)
      updateBatch.update(provinceRef, { hotelCount: count })
    }
    await updateBatch.commit()
    console.log('  ✓ อัปเดตจำนวนที่พักในจังหวัดเรียบร้อย')

    // สรุปตามจังหวัด (Top 10)
    console.log('\n📋 จังหวัดที่มีที่พักมากที่สุด (Top 10):')
    const sortedProvinces = Object.entries(provinceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    for (const [provinceId, count] of sortedProvinces) {
      const provinceDoc = await db.collection('provinces').doc(provinceId).get()
      const provinceName = provinceDoc.data()?.name || 'ไม่ทราบชื่อ'
      console.log(`  ${count.toString().padStart(3)} ที่ - ${provinceName}`)
    }

    // แสดงตัวอย่างข้อมูล
    console.log('\n📋 ตัวอย่างที่พักที่ย้าย:')
    const exampleSnapshot = await db.collection('hotels').limit(3).get()
    exampleSnapshot.forEach(doc => {
      const data = doc.data()
      console.log(`\n  📍 ${data.name}`)
      console.log(`     จังหวัด: ${data.province?.name || '-'}`)
      console.log(`     ราคา: ${data.priceStart} บาท/คืน`)
      console.log(`     สิ่งอำนวยความสะดวก: ${data.facilities.length} รายการ`)
      console.log(`     รูปภาพ: ${data.gallery.length + 1} รูป (รวมรูปหลัก)`)
    })

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
    throw error
  } finally {
    if (connection) {
      await connection.end()
      console.log('\n✅ ปิดการเชื่อมต่อ MySQL')
    }
  }
}

// รันสคริปต์
migrateHotels()
  .then(() => {
    console.log('\n🎉 Migration Hotels เสร็จสิ้น!')
    console.log('\n💡 ขั้นตอนถัดไป:')
    console.log('  1. ตรวจสอบข้อมูลใน Firestore Console')
    console.log('  2. ย้ายรูปภาพไปยัง Firebase Storage')
    console.log('  3. อัปเดต URL รูปภาพในฐานข้อมูล')
    console.log('  4. ทดสอบการแสดงผลบนเว็บไซต์')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💥 Migration ล้มเหลว:', error)
    process.exit(1)
  })
