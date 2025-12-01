/**
 * Migration Script: Provinces
 * ย้ายข้อมูลจังหวัดจาก MySQL ไปยัง Firestore
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

// แปลงภาคจากภาษาอังกฤษเป็นไทย
const regionMap = {
  'north': 'ภาคเหนือ',
  'south': 'ภาคใต้',
  'east': 'ภาคตะวันออก',
  'west': 'ภาคตะวันตก',
  'middle': 'ภาคกลาง',
  'east-north': 'ภาคตะวันออกเฉียงเหนือ'
}

async function migrateProvinces() {
  console.log('🚀 เริ่มต้น Migration: Provinces')

  let connection

  try {
    // เชื่อมต่อ MySQL
    connection = await mysql.createConnection(mysqlConfig)
    console.log('✅ เชื่อมต่อ MySQL สำเร็จ')

    // ดึงข้อมูลจาก pet_pet_province
    const [provinces] = await connection.execute(
      'SELECT * FROM pet_pet_province ORDER BY id'
    )

    console.log(`📊 พบข้อมูล ${provinces.length} รายการ`)

    // เตรียม batch write
    const batch = db.batch()
    let count = 0

    for (const province of provinces) {
      // สร้าง document reference
      const docRef = db.collection('provinces').doc()

      // Parse tags JSON
      let attractions = []
      if (province.tags) {
        try {
          const parsedTags = JSON.parse(province.tags)
          if (Array.isArray(parsedTags)) {
            attractions = parsedTags.map(tag => ({
              name: tag.name || '',
              slug: tag.slug || '',
              image: tag.image || ''
            }))
          }
        } catch (e) {
          console.warn(`  ⚠️  ไม่สามารถ parse tags สำหรับ ${province.name}:`, e.message)
        }
      }

      // เตรียมข้อมูล
      const data = {
        oldId: province.id.toString(),
        name: province.name || '',
        slug: province.slug || '',
        description: province.content || '',
        image: province.image || '',
        region: province.park || 'middle',
        regionTh: regionMap[province.park] || 'ภาคกลาง',
        attractions: attractions,
        hotelCount: 0, // จะอัปเดทีหลังจากนับจาก hotels

        // Nested set fields (ถ้ามีการใช้งาน)
        nestLeft: province.nest_left || null,
        nestRight: province.nest_right || null,
        nestDepth: province.nest_depth || null,
        parentId: province.parent_id || null,

        createdAt: new Date(),
        updatedAt: new Date()
      }

      batch.set(docRef, data)
      count++

      console.log(`  ✓ เพิ่ม: ${province.name} (ภาค: ${data.regionTh}, สถานที่: ${attractions.length})`)

      // Firestore batch จำกัดที่ 500 operations
      if (count % 500 === 0) {
        await batch.commit()
        console.log(`  💾 บันทึก batch ${count} รายการ`)
      }
    }

    // บันทึก batch สุดท้าย
    if (count % 500 !== 0) {
      await batch.commit()
    }

    console.log(`\n✅ Migration สำเร็จ! ย้ายข้อมูล ${count} รายการ`)

    // สรุปตามภูมิภาค
    console.log('\n📋 สรุปตามภูมิภาค:')
    const regionCounts = {}
    const snapshot = await db.collection('provinces').get()
    snapshot.forEach(doc => {
      const region = doc.data().regionTh
      regionCounts[region] = (regionCounts[region] || 0) + 1
    })

    Object.entries(regionCounts).forEach(([region, count]) => {
      console.log(`  - ${region}: ${count} จังหวัด`)
    })

    // แสดงตัวอย่างข้อมูล
    console.log('\n📋 ตัวอย่างข้อมูลที่ย้าย:')
    const exampleSnapshot = await db.collection('provinces').limit(5).get()
    exampleSnapshot.forEach(doc => {
      const data = doc.data()
      console.log(`  - ${data.name} (${data.regionTh}) - สถานที่: ${data.attractions.length}`)
    })

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
    throw error
  } finally {
    if (connection) {
      await connection.end()
      console.log('✅ ปิดการเชื่อมต่อ MySQL')
    }
  }
}

// รันสคริปต์
migrateProvinces()
  .then(() => {
    console.log('\n🎉 Migration เสร็จสิ้น!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💥 Migration ล้มเหลว:', error)
    process.exit(1)
  })
