# 🔄 Database Migration Scripts

สคริปต์สำหรับย้ายข้อมูลจาก MySQL (OctoberCMS) ไปยัง Firebase Firestore

## 📋 รายการไฟล์

- `migrate-facilities.js` - ย้ายสิ่งอำนวยความสะดวก (~15 รายการ)
- `migrate-provinces.js` - ย้ายจังหวัด (31 จังหวัด)
- `migrate-blogs.js` - ย้ายบทความ (~30+ บทความ)
- `migrate-hotels.js` - ย้ายที่พัก (550+ ที่พัก)
- `migrate-all.js` - รันทั้งหมดตามลำดับ
- `migrate-images.js` - ย้ายรูปภาพไปยัง Firebase Storage (TODO)

## 🚀 การใช้งาน

### ข้อกำหนดเบื้องต้น

1. **MySQL Server ต้องทำงานอยู่**
   ```bash
   # ตรวจสอบว่า MySQL Server ทำงานอยู่
   mysql -u root -p
   ```

2. **Firebase Admin SDK**
   - ดาวน์โหลด Service Account Key จาก Firebase Console
   - บันทึกเป็นไฟล์ `serviceAccountKey.json` ที่ root ของโปรเจค

3. **ติดตั้ง Dependencies**
   ```bash
   npm install
   ```

### การตั้งค่า MySQL Connection

แก้ไขการตั้งค่าใน `mysqlConfig` ในแต่ละไฟล์:

```javascript
const mysqlConfig = {
  host: 'localhost',      // หรือ IP ของ MySQL Server
  user: 'root',           // username
  password: '',           // password
  database: 'dsignweb_petallow'  // ชื่อฐานข้อมูล
}
```

### รัน Migration

#### 1. รันทีละอัน (แนะนำสำหรับการทดสอบ)

```bash
# ย้ายสิ่งอำนวยความสะดวกก่อน
npm run migrate:facilities

# ย้ายจังหวัด
npm run migrate:provinces

# ย้ายบทความ
npm run migrate:blogs

# ย้ายที่พัก (ใช้เวลานาน ~5-10 นาที)
npm run migrate:hotels
```

#### 2. รันทั้งหมดพร้อมกัน

```bash
npm run migrate:all
```

## 📊 ลำดับการ Migration

**สำคัญ!** ต้องรันตามลำดับนี้:

1. ✅ **Facilities** - ต้องทำก่อนเพราะ Hotels ใช้ข้อมูลนี้
2. ✅ **Provinces** - ต้องทำก่อนเพราะ Hotels ใช้ข้อมูลนี้
3. ✅ **Blogs** - อิสระ รันเมื่อไหร่ก็ได้
4. ✅ **Hotels** - ต้องรันหลังจาก Facilities และ Provinces

## 🗂️ โครงสร้างข้อมูลใน Firestore

### Collection: `facilities`
```javascript
{
  oldId: "2",
  name: "WiFi",
  slug: "wifi",
  icon: "/icons/wifi.png",
  order: 2,
  hotelCount: 0,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Collection: `provinces`
```javascript
{
  oldId: "1",
  name: "ปทุมธานี",
  slug: "pathum-thani",
  description: "...",
  image: "/province/image.jpg",
  region: "middle",
  regionTh: "ภาคกลาง",
  attractions: [
    { name: "...", slug: "...", image: "..." }
  ],
  hotelCount: 25,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Collection: `blogs`
```javascript
{
  oldId: "1",
  title: "อาหารอะไรดีต่อสุนัข?",
  slug: "best-food-for-dogs",
  content: "<html>...</html>",
  excerpt: "...",
  featuredImage: "/blogs/blog1.jpg",
  status: "published",
  tags: [],
  viewCount: 0,
  publishedAt: Timestamp,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Collection: `hotels`
```javascript
{
  oldId: "1",
  name: "โรงแรมฟอร์เลิฟรีสอร์ท",
  slug: "...",
  mainImage: "/hotel/hotel1.jpg",
  gallery: [
    { image: "/hotel/1.jpg", alttext: "" }
  ],
  content: [
    { type: "text", header: "...", innercontent: "..." }
  ],
  shortDescription: "...",
  province: {
    id: "provinceDocId",
    name: "ปทุมธานี",
    slug: "pathum-thani"
  },
  address: "...",
  priceStart: 240,
  phone: "...",
  facilities: [
    { id: "facilityDocId", name: "WiFi", slug: "wifi", icon: "..." }
  ],
  status: "published",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## ⚠️ ข้อควรระวัง

1. **Firestore Limits**
   - Batch write จำกัดที่ 500 operations
   - สคริปต์จัดการอัตโนมัติแล้ว

2. **Data Validation**
   - ตรวจสอบข้อมูลใน Firestore Console หลัง migrate
   - บางฟิลด์อาจเป็น null ถ้าข้อมูลต้นทางไม่สมบูรณ์

3. **Character Encoding**
   - ตรวจสอบ UTF-8 encoding ของ MySQL
   - ภาษาไทยต้องแสดงผลถูกต้อง

4. **Images**
   - รูปภาพยังไม่ได้ย้ายไป Firebase Storage
   - ยังเป็น path เดิมจาก server เก่า
   - ต้องรัน `migrate-images.js` แยก

## 🔍 การตรวจสอบผลลัพธ์

### 1. ใน Firebase Console
```
https://console.firebase.google.com/
→ Firestore Database
→ ตรวจสอบแต่ละ collection
```

### 2. นับจำนวนเอกสาร
- facilities: ~15 documents
- provinces: 31 documents
- blogs: ~30+ documents
- hotels: 550+ documents

### 3. ตรวจสอบ Relationships
- Hotels → มี province object (populated)
- Hotels → มี facilities array (populated)
- Provinces → มี hotelCount ที่ถูกต้อง

## 🐛 Troubleshooting

### ❌ Error: Cannot connect to MySQL
```bash
# ตรวจสอบว่า MySQL Server ทำงาน
sudo service mysql status

# เริ่ม MySQL Server
sudo service mysql start
```

### ❌ Error: Firebase Admin not initialized
```bash
# ตรวจสอบว่ามีไฟล์ serviceAccountKey.json
ls serviceAccountKey.json

# ตรวจสอบว่าไฟล์ valid JSON
cat serviceAccountKey.json | python -m json.tool
```

### ❌ Error: Cannot parse JSON
- ตรวจสอบข้อมูลในฟิลด์ที่มีปัญหา
- สคริปต์จะข้ามและแสดง warning

## 📝 Logs

สคริปต์จะแสดง:
- ✅ จำนวนข้อมูลที่ย้ายสำเร็จ
- ⚠️ Warning สำหรับข้อมูลที่มีปัญหา
- 📊 สรุปผลตามหมวดหมู่
- 📋 ตัวอย่างข้อมูลที่ย้าย

## ✨ ขั้นตอนถัดไป

หลังจาก migrate เสร็จ:

1. ✅ ตรวจสอบข้อมูลใน Firestore Console
2. ✅ รัน `npm run migrate:images` (ถ้ามี)
3. ✅ อัปเดต path รูปภาพในฐานข้อมูล
4. ✅ ทดสอบเว็บไซต์
5. ✅ ตั้งค่า Firestore Indexes (ถ้าจำเป็น)
6. ✅ ตั้งค่า Security Rules

## 🆘 ขอความช่วยเหลือ

หากพบปัญหา:
1. ตรวจสอบ console logs
2. ตรวจสอบข้อมูลใน MySQL
3. ตรวจสอบข้อมูลใน Firestore
4. ติดต่อทีมพัฒนา
