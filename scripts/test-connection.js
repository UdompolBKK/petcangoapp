/**
 * Test Connection Script
 * ทดสอบการเชื่อมต่อ MySQL และ Firebase ก่อนทำ Migration
 */

import mysql from 'mysql2/promise'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import fs from 'fs'
import { mysqlConfig } from '../mysql.config.js'

console.log('\n' + '='.repeat(80))
console.log('🧪 ทดสอบการเชื่อมต่อ MySQL และ Firebase')
console.log('='.repeat(80) + '\n')

let testsPassed = 0
let testsFailed = 0

// ทดสอบ 1: ตรวจสอบไฟล์ Service Account Key
console.log('📝 Test 1: ตรวจสอบไฟล์ Firebase Service Account Key')
try {
  if (!fs.existsSync('serviceAccountKey.json')) {
    throw new Error('ไม่พบไฟล์ serviceAccountKey.json')
  }

  const serviceAccount = JSON.parse(fs.readFileSync('serviceAccountKey.json', 'utf8'))

  if (!serviceAccount.project_id || !serviceAccount.private_key) {
    throw new Error('ไฟล์ serviceAccountKey.json ไม่ถูกต้อง')
  }

  console.log('✅ พบไฟล์ serviceAccountKey.json และรูปแบบถูกต้อง')
  console.log(`   Project ID: ${serviceAccount.project_id}`)
  testsPassed++
} catch (error) {
  console.error('❌ ล้มเหลว:', error.message)
  testsFailed++
}

// ทดสอบ 2: เชื่อมต่อ Firebase
console.log('\n📝 Test 2: ทดสอบการเชื่อมต่อ Firebase')
try {
  const serviceAccount = JSON.parse(fs.readFileSync('serviceAccountKey.json', 'utf8'))

  initializeApp({
    credential: cert(serviceAccount)
  })

  const db = getFirestore()

  // ทดสอบเขียนและอ่านข้อมูล
  const testRef = db.collection('_test').doc('connection-test')
  await testRef.set({
    message: 'Test connection',
    timestamp: new Date()
  })

  const doc = await testRef.get()
  if (doc.exists) {
    console.log('✅ เชื่อมต่อ Firebase Firestore สำเร็จ')
    console.log('   สามารถอ่านและเขียนข้อมูลได้')

    // ลบข้อมูลทดสอบ
    await testRef.delete()
    testsPassed++
  } else {
    throw new Error('ไม่สามารถอ่านข้อมูลที่เขียน')
  }
} catch (error) {
  console.error('❌ ล้มเหลว:', error.message)
  testsFailed++
}

// ทดสอบ 3: เชื่อมต่อ MySQL
console.log('\n📝 Test 3: ทดสอบการเชื่อมต่อ MySQL')
let connection
try {
  connection = await mysql.createConnection(mysqlConfig)
  console.log('✅ เชื่อมต่อ MySQL สำเร็จ')
  console.log(`   Database: ${mysqlConfig.database}`)
  testsPassed++
} catch (error) {
  console.error('❌ ล้มเหลว:', error.message)
  console.error('   กรุณาตรวจสอบ:')
  console.error('   - MySQL Server ทำงานอยู่หรือไม่')
  console.error('   - username และ password ถูกต้องหรือไม่')
  console.error('   - ฐานข้อมูล dsignweb_petallow มีอยู่หรือไม่')
  testsFailed++
}

// ทดสอบ 4: ตรวจสอบตารางในฐานข้อมูล
if (connection) {
  console.log('\n📝 Test 4: ตรวจสอบตารางในฐานข้อมูล')
  try {
    const tables = [
      'pet_pet_facility',
      'pet_pet_province',
      'pet_pet_blog',
      'pet_pet_hotel'
    ]

    let allTablesExist = true

    for (const table of tables) {
      const [rows] = await connection.execute(
        `SELECT COUNT(*) as count FROM ${table}`
      )
      const count = rows[0].count

      if (count === 0) {
        console.warn(`   ⚠️  ${table}: ไม่มีข้อมูล`)
        allTablesExist = false
      } else {
        console.log(`   ✅ ${table}: พบ ${count} รายการ`)
      }
    }

    if (allTablesExist) {
      testsPassed++
    } else {
      console.warn('   ⚠️  บางตารางไม่มีข้อมูล')
      testsFailed++
    }

  } catch (error) {
    console.error('❌ ล้มเหลว:', error.message)
    console.error('   กรุณาตรวจสอบว่าตารางมีอยู่ในฐานข้อมูล')
    testsFailed++
  }

  // ปิดการเชื่อมต่อ
  await connection.end()
}

// สรุปผล
console.log('\n' + '='.repeat(80))
console.log('📊 สรุปผลการทดสอบ')
console.log('='.repeat(80))
console.log(`✅ ผ่าน: ${testsPassed} tests`)
console.log(`❌ ล้มเหลว: ${testsFailed} tests`)
console.log('='.repeat(80) + '\n')

if (testsFailed === 0) {
  console.log('🎉 ระบบพร้อมสำหรับการ Migration!')
  console.log('\n💡 คำแนะนำ:')
  console.log('   รันคำสั่ง: npm run migrate:all')
  console.log('   หรือ migrate ทีละตาราง:')
  console.log('   - npm run migrate:facilities')
  console.log('   - npm run migrate:provinces')
  console.log('   - npm run migrate:blogs')
  console.log('   - npm run migrate:hotels')
  process.exit(0)
} else {
  console.log('⚠️  กรุณาแก้ไขปัญหาที่พบก่อนทำ Migration')
  console.log('\n💡 วิธีแก้ไข:')

  if (!fs.existsSync('serviceAccountKey.json')) {
    console.log('   1. ดาวน์โหลด Service Account Key จาก Firebase Console')
    console.log('   2. บันทึกเป็น serviceAccountKey.json ที่ root ของโปรเจค')
  }

  console.log('   3. ตรวจสอบว่า MySQL Server ทำงานอยู่')
  console.log('   4. ตรวจสอบ username/password ใน mysqlConfig')
  console.log('   5. ตรวจสอบว่าฐานข้อมูล dsignweb_petallow มีอยู่')

  process.exit(1)
}
