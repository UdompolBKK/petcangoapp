# 📊 สรุป Migration Scripts ที่สร้างแล้ว

## ✅ ไฟล์ที่สร้างเสร็จแล้ว

### 📂 Scripts หลัก (scripts/)

1. **test-connection.js** - ทดสอบการเชื่อมต่อก่อน migrate
   - ตรวจสอบ Firebase Service Account Key
   - ทดสอบเชื่อมต่อ Firestore
   - ทดสอบเชื่อมต่อ MySQL
   - ตรวจสอบตารางและนับจำนวนข้อมูล

2. **migrate-facilities.js** - ย้ายสิ่งอำนวยความสะดวก
   - จำนวน: ~15 รายการ
   - เวลา: ~5 วินาที
   - Collection: `facilities`

3. **migrate-provinces.js** - ย้ายจังหวัด
   - จำนวน: 31 จังหวัด
   - เวลา: ~10 วินาที
   - Collection: `provinces`
   - มีการ parse tags (สถานที่ท่องเที่ยว)
   - แปลงภาค (north, south, east, etc.)

4. **migrate-blogs.js** - ย้ายบทความ
   - จำนวน: ~30+ บทความ
   - เวลา: ~15 วินาที
   - Collection: `blogs`
   - แปลงสถานะ (published/draft)

5. **migrate-hotels.js** - ย้ายที่พัก
   - จำนวน: 550+ ที่พัก
   - เวลา: ~5-10 นาที
   - Collection: `hotels`
   - Parse JSON: content, gallery, facilities
   - Populate province และ facilities
   - อัปเดต hotelCount ในจังหวัด

6. **migrate-all.js** - รันทั้งหมดตามลำดับ
   - รัน facilities → provinces → blogs → hotels
   - แสดงความคืบหน้า
   - สรุปผลท้ายสุด

### 📖 เอกสาร

1. **scripts/README.md** - คู่มือสำหรับ scripts
   - การใช้งาน
   - โครงสร้างข้อมูล
   - Troubleshooting

2. **MIGRATION_GUIDE.md** - คู่มือทีละขั้นตอน
   - เตรียมความพร้อม
   - การตั้งค่า
   - การรัน migration
   - การแก้ไขปัญหา
   - Checklist

3. **MIGRATION_SUMMARY.md** - ไฟล์นี้

---

## 🚀 วิธีใช้งาน

### ขั้นตอนที่ 1: ติดตั้ง Dependencies

```bash
npm install
```

### ขั้นตอนที่ 2: เตรียม Service Account Key

1. ดาวน์โหลดจาก Firebase Console
2. บันทึกเป็น `serviceAccountKey.json` ที่ root

### ขั้นตอนที่ 3: ทดสอบการเชื่อมต่อ

```bash
npm run migrate:test
```

ถ้าผ่านทุก test จะได้ผลลัพธ์:
```
✅ ผ่าน: 4 tests
❌ ล้มเหลว: 0 tests
🎉 ระบบพร้อมสำหรับการ Migration!
```

### ขั้นตอนที่ 4: รัน Migration

**แนะนำ:** รันทั้งหมดพร้อมกัน
```bash
npm run migrate:all
```

**หรือ:** รันทีละอัน
```bash
npm run migrate:facilities
npm run migrate:provinces
npm run migrate:blogs
npm run migrate:hotels
```

---

## 📊 ข้อมูลที่จะย้าย

| ตาราง MySQL | Collection Firestore | จำนวน | เวลา |
|-------------|---------------------|-------|------|
| pet_pet_facility | facilities | ~15 | ~5s |
| pet_pet_province | provinces | 31 | ~10s |
| pet_pet_blog | blogs | ~30+ | ~15s |
| pet_pet_hotel | hotels | 550+ | ~5-10m |
| **รวม** | **4 collections** | **~626** | **~10m** |

---

## 🔄 การแปลงข้อมูล

### Facilities
```
MySQL → Firestore
{
  id → oldId (string)
  name → name
  slug → slug
  icon → icon
  + order (number)
  + hotelCount (number, default: 0)
  + createdAt, updatedAt
}
```

### Provinces
```
MySQL → Firestore
{
  id → oldId (string)
  name → name
  slug → slug
  content → description
  image → image
  park → region (ภาษาอังกฤษ)
  + regionTh (ภาษาไทย)
  tags (JSON) → attractions (array)
  + hotelCount (จากการนับ hotels)
  + createdAt, updatedAt
}
```

### Blogs
```
MySQL → Firestore
{
  id → oldId (string)
  name → title
  slug → slug
  content → content (HTML)
  mindes → excerpt
  image → featuredImage
  status (1/0) → status (published/draft)
  category → category
  + tags (array, default: [])
  + viewCount (default: 0)
  + publishedAt
  + createdAt, updatedAt
}
```

### Hotels
```
MySQL → Firestore
{
  id → oldId (string)
  name → name
  slug → slug
  image → mainImage
  gallery (JSON) → gallery (array of objects)
  content (JSON) → content (array)
  mincontent → shortDescription
  province (ID) → province (object with id, name, slug)
  address → address
  zipcode → zipcode
  area → area
  googlemap → googleMapIframe
  pricestart → priceStart (number)
  petprice → petPrice
  phone → phone
  facility (JSON array) → facilities (array of objects)
  tags (JSON) → tags (array)
  priority → priority
  postby → postedBy
  + viewCount (default: 0)
  + status (default: published)
  + featured (default: false)
  + createdAt, updatedAt
}
```

---

## ✨ Features พิเศษ

### 1. Batch Processing
- แบ่งเป็น batch ละ 500 operations (ตาม Firestore limit)
- แสดงความคืบหน้าทุกๆ 50 รายการ

### 2. Data Validation
- ตรวจสอบและ parse JSON safely
- แสดง warning ถ้า parse ไม่ได้
- ใช้ default value ถ้าข้อมูลไม่สมบูรณ์

### 3. Data Enrichment
- Populate province object ใน hotels
- Populate facilities array ใน hotels
- นับและอัปเดต hotelCount ใน provinces
- แปลงภาคเป็นทั้งภาษาอังกฤษและไทย

### 4. Progress Reporting
- แสดงความคืบหน้าแบบ real-time
- สรุปผลแต่ละขั้นตอน
- แสดงตัวอย่างข้อมูลที่ย้าย
- สรุป Top 10 จังหวัดที่มีที่พักมากที่สุด

---

## 🎯 ผลลัพธ์ที่คาดหวัง

### ใน Firebase Console

**Collection: facilities**
- 15 documents
- แต่ละ document มี: name, slug, icon, order, hotelCount

**Collection: provinces**
- 31 documents
- แต่ละ document มี: name, slug, region, regionTh, attractions[], hotelCount

**Collection: blogs**
- 30+ documents
- แต่ละ document มี: title, slug, content, excerpt, featuredImage, status

**Collection: hotels**
- 550+ documents
- แต่ละ document มี: name, slug, mainImage, gallery[], province{}, facilities[], etc.

### Relationships

**Hotels ↔ Provinces:**
```javascript
// Hotel document มี
{
  province: {
    id: "provinceDocId",
    name: "ชลบุรี",
    slug: "chonburi"
  }
}

// Province document มี
{
  hotelCount: 120  // นับจำนวนที่พักในจังหวัดนี้
}
```

**Hotels ↔ Facilities:**
```javascript
// Hotel document มี
{
  facilities: [
    {
      id: "facilityDocId",
      name: "WiFi",
      slug: "wifi",
      icon: "/icons/wifi.png"
    },
    // ...
  ]
}
```

---

## ⚠️ ข้อควรระวัง

1. **รูปภาพ**
   - ยังไม่ได้ย้ายไป Firebase Storage
   - ยังเป็น path จาก server เก่า
   - ต้องอัปเดตทีหลัง

2. **View Count**
   - ตั้งเป็น 0 ทั้งหมด
   - ถ้าต้องการข้อมูลจริง ต้อง migrate จาก pet_pet_pageview

3. **Tags/Categories**
   - บางฟิลด์เป็น array ว่าง
   - ต้องเพิ่มทีหลัง

4. **Author Info**
   - ไม่มี user system ยัง
   - authorId และ authorName เป็น null

---

## 📞 Next Steps หลัง Migration

1. ✅ ตรวจสอบข้อมูลใน Firestore Console
2. ✅ ทดสอบเว็บไซต์ `npm run dev`
3. ⬜ ย้ายรูปภาพไป Firebase Storage
4. ⬜ อัปเดต path รูปภาพในฐานข้อมูล
5. ⬜ ตั้งค่า Firestore Security Rules
6. ⬜ ตั้งค่า Firestore Indexes
7. ⬜ Migrate view counts (ถ้าต้องการ)
8. ⬜ Migrate reviews (ถ้าต้องการ)
9. ⬜ ทดสอบฟีเจอร์ทั้งหมด
10. ⬜ Deploy to production

---

## 🔗 ลิงก์ที่เป็นประโยชน์

- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

**หมายเหตุ:** Migration scripts เหล่านี้ออกแบบมาให้รันได้หลายครั้ง แต่จะสร้างข้อมูลซ้ำใน Firestore ถ้ารันซ้ำโดยไม่ลบข้อมูลเก่า
