/**
 * Migration Script: Facilities
 * ย้ายข้อมูลสิ่งอำนวยความสะดวกจาก MySQL ไปยัง Firestore
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

async function migrateFacilities() {
  console.log('🚀 เริ่มต้น Migration: Facilities')

  let connection

  try {
    // เชื่อมต่อ MySQL
    connection = await mysql.createConnection(mysqlConfig)
    console.log('✅ เชื่อมต่อ MySQL สำเร็จ')

    // ดึงข้อมูลจาก pet_pet_facility
    const [facilities] = await connection.execute(
      'SELECT * FROM pet_pet_facility ORDER BY id'
    )

    console.log(`📊 พบข้อมูล ${facilities.length} รายการ`)

    // เตรียม batch write
    const batch = db.batch()
    let count = 0

    for (const facility of facilities) {
      // สร้าง document reference
      const docRef = db.collection('facilities').doc()

      // เตรียมข้อมูล
      const data = {
        oldId: facility.id.toString(),
        name: facility.name || '',
        slug: facility.slug || '',
        icon: facility.icon || '',
        order: facility.id,
        hotelCount: 0, // จะอัปเดตทีหลังจากนับจาก hotels
        createdAt: new Date(),
        updatedAt: new Date()
      }

      batch.set(docRef, data)
      count++

      console.log(`  ✓ เพิ่ม: ${facility.name} (ID: ${facility.id})`)

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

    // แสดงตัวอย่างข้อมูล
    console.log('\n📋 ตัวอย่างข้อมูลที่ย้าย:')
    const snapshot = await db.collection('facilities').limit(5).get()
    snapshot.forEach(doc => {
      const data = doc.data()
      console.log(`  - ${data.name} (${data.slug})`)
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
migrateFacilities()
  .then(() => {
    console.log('\n🎉 Migration เสร็จสิ้น!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💥 Migration ล้มเหลว:', error)
    process.exit(1)
  })
