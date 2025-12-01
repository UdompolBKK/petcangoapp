# ☁️ Cloud Functions Guide - ต้องใช้หรือไม่?

## 🎯 สรุป: **ไม่จำเป็นต้องใช้ตอนนี้**

---

## ✅ ระบบนี้ทำงานได้โดยไม่ต้องใช้ Cloud Functions

### เหตุผล:

1. **Nuxt 3 มี Server-side ในตัว**
   - มี API routes (`/server/api/`)
   - มี Server middleware
   - มี Server utils
   - Deploy ร่วมกับ app

2. **Firebase Client SDK ใช้งานได้โดยตรง**
   - Read operations (ดึงข้อมูล)
   - Write operations (เขียนข้อมูล - ผ่าน Security Rules)
   - Authentication
   - Storage upload

3. **ระบบเป็น Read-heavy**
   - ส่วนใหญ่เป็นการดึงข้อมูลแสดงผล
   - Write น้อย (เฉพาะ Admin)
   - ไม่มี complex business logic

---

## 🏗️ สถาปัตยกรรมที่แนะนำ (ไม่ใช้ Cloud Functions)

```
┌─────────────────────────────────────────────┐
│           Nuxt 3 Application                │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Client-side (Browser)              │   │
│  │  ├─ pages/                          │   │
│  │  ├─ components/                     │   │
│  │  └─ composables/                    │   │
│  │     ├─ useFirebase.ts              │   │
│  │     ├─ useHotels.ts  ───────┐      │   │
│  │     └─ useBlogs.ts          │      │   │
│  └────────────────────────────┼────────┘   │
│                                │            │
│  ┌────────────────────────────┼────────┐   │
│  │  Server-side (Nuxt Server) │        │   │
│  │  ├─ server/api/            │        │   │
│  │  │  ├─ hotels/create.post.ts       │   │
│  │  │  └─ blogs/create.post.ts        │   │
│  │  └─ server/utils/          │        │   │
│  │     └─ firebase-admin.ts   │        │   │
│  └────────────────────────────┼────────┘   │
└─────────────────────────────┬─┼────────────┘
                              │ │
                              ▼ ▼
                    ┌─────────────────────┐
                    │   Firebase          │
                    │  ├─ Firestore       │
                    │  ├─ Auth            │
                    │  └─ Storage         │
                    └─────────────────────┘
```

---

## 📝 ตัวอย่างการใช้งาน

### 1. **Read Data (Client-side)**

```typescript
// composables/useHotels.ts
export const useHotels = () => {
  const { getCollection } = useFirestore()

  const getNewHotels = async (limit = 10) => {
    return await getCollection(
      'hotels',
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(limit)
    )
  }

  return { getNewHotels }
}
```

```vue
<!-- pages/index.vue -->
<script setup>
const { getNewHotels } = useHotels()
const hotels = ref([])

onMounted(async () => {
  hotels.value = await getNewHotels(10)
})
</script>
```

---

### 2. **Write Data - Admin (Server-side API)**

```typescript
// server/api/hotels/create.post.ts
import { getAdminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const db = getAdminFirestore()

  const hotelRef = await db.collection('hotels').add({
    ...body,
    createdAt: new Date(),
    status: 'published'
  })

  return { success: true, id: hotelRef.id }
})
```

```typescript
// Admin page ใช้งาน
const createHotel = async (hotelData) => {
  const response = await $fetch('/api/hotels/create', {
    method: 'POST',
    body: hotelData
  })

  return response
}
```

---

### 3. **Image Upload (Client-side)**

```typescript
// composables/useFirebaseStorage.ts
export const useFirebaseStorage = () => {
  const { storage } = useFirebase()

  const uploadImage = async (file: File, path: string) => {
    const storageRef = ref(storage, path)
    const uploadTask = await uploadBytes(storageRef, file)
    return await getDownloadURL(uploadTask.ref)
  }

  return { uploadImage }
}
```

---

## ⚠️ เมื่อไหร่ควรใช้ Cloud Functions?

### Use Cases ที่ต้องใช้:

#### 1. **Image Optimization (แนะนำ!)**

```javascript
// functions/index.js
const functions = require('firebase-functions')
const sharp = require('sharp')

exports.generateThumbnail = functions.storage.onFinalize(async (object) => {
  const filePath = object.name

  // Skip if not an image or already a thumbnail
  if (!filePath.match(/\.(jpg|jpeg|png)$/i) || filePath.includes('_thumb')) {
    return
  }

  // Generate thumbnail
  const bucket = admin.storage().bucket()
  const file = bucket.file(filePath)

  const [fileBuffer] = await file.download()
  const thumbnailBuffer = await sharp(fileBuffer)
    .resize(300, 300, { fit: 'cover' })
    .toBuffer()

  const thumbPath = filePath.replace(/(\.[^.]+)$/, '_thumb$1')
  await bucket.file(thumbPath).save(thumbnailBuffer)
})
```

**ประโยชน์:**
- สร้าง thumbnail อัตโนมัติ
- Optimize รูปภาพ (resize, compress)
- ลด bandwidth

---

#### 2. **Scheduled Tasks**

```javascript
// ลบข้อมูลเก่าทุกวัน
exports.cleanupOldDrafts = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    const db = admin.firestore()
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 30) // 30 วันที่แล้ว

    const snapshot = await db.collection('blogs')
      .where('status', '==', 'draft')
      .where('createdAt', '<', cutoff)
      .get()

    const batch = db.batch()
    snapshot.docs.forEach(doc => batch.delete(doc.ref))
    await batch.commit()

    console.log(`Deleted ${snapshot.size} old drafts`)
  })
```

**ประโยชน์:**
- Cleanup old data
- Generate reports
- Send notifications

---

#### 3. **Webhooks & Integrations**

```javascript
// รับ webhook จาก payment gateway
exports.paymentWebhook = functions.https.onRequest(async (req, res) => {
  const { orderId, status } = req.body

  if (status === 'paid') {
    await admin.firestore()
      .collection('bookings')
      .doc(orderId)
      .update({ paymentStatus: 'paid', paidAt: new Date() })
  }

  res.send({ received: true })
})
```

---

#### 4. **Analytics & Aggregations**

```javascript
// นับจำนวน hotels เมื่อมีการเพิ่ม/ลบ
exports.updateHotelCount = functions.firestore
  .document('hotels/{hotelId}')
  .onCreate(async (snap, context) => {
    const hotel = snap.data()
    const provinceId = hotel.province.id

    await admin.firestore()
      .collection('provinces')
      .doc(provinceId)
      .update({
        hotelCount: admin.firestore.FieldValue.increment(1)
      })
  })
```

---

## 💰 เปรียบเทียบต้นทุน

### **Nuxt Server Routes (ฟรี)**
```
✅ ไม่มีค่าใช้จ่ายเพิ่ม
✅ รันบน Nuxt hosting (Vercel, Netlify, etc.)
✅ ไม่มี cold start
```

### **Cloud Functions (เสียค่าใช้จ่าย)**
```
💰 $0.40 per million invocations
💰 $0.0000025 per GB-second
⚠️  Cold start: 1-3 seconds
```

**ตัวอย่าง:**
- 1 million requests/month = $0.40
- ถ้าใช้ Nuxt Server = $0

---

## 🚀 แผนการทำงานที่แนะนำ

### **Phase 1: Launch (ตอนนี้)**

**ไม่ใช้ Cloud Functions**

✅ ใช้:
- Nuxt Server API Routes
- Firebase Client SDK
- Firebase Security Rules

```bash
# Structure
/server/api/
  ├── hotels/
  │   ├── create.post.ts
  │   ├── update.patch.ts
  │   └── delete.delete.ts
  └── blogs/
      └── create.post.ts
```

---

### **Phase 2: Optimization (อนาคต)**

**เพิ่ม Cloud Functions เฉพาะที่จำเป็น**

✅ ใช้สำหรับ:
1. Image optimization (thumbnail generation)
2. Scheduled cleanup tasks
3. Analytics aggregations

```bash
# Setup Cloud Functions
npm install -g firebase-tools
firebase init functions
```

```javascript
// functions/index.js
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

// Image optimization
exports.generateThumbnail = functions.storage.onFinalize(...)

// Scheduled tasks
exports.dailyCleanup = functions.pubsub.schedule('every 24 hours').onRun(...)

// Webhooks
exports.paymentWebhook = functions.https.onRequest(...)
```

---

## 📋 สรุปคำแนะนำ

### **สำหรับระบบนี้:**

1. **ตอนนี้ (Launch):**
   - ❌ **ไม่ต้องใช้** Cloud Functions
   - ✅ ใช้ Nuxt Server Routes
   - ✅ ใช้ Firebase Client SDK
   - ✅ Deploy บน Vercel/Netlify

2. **อนาคต (Optimization):**
   - ✅ เพิ่ม Cloud Functions สำหรับ:
     - Image optimization
     - Scheduled tasks
     - Webhooks
   - ✅ Deploy Functions แยกต่างหาก

---

## 🎯 Quick Decision Tree

```
ต้องการ background task? (thumbnail, cleanup, etc.)
├─ Yes → ใช้ Cloud Functions
└─ No  → ใช้ Nuxt Server Routes

ต้องการ scheduled task? (daily report, etc.)
├─ Yes → ใช้ Cloud Functions
└─ No  → ใช้ Nuxt Server Routes

ต้องการ webhook? (payment, notification, etc.)
├─ Yes → ใช้ Cloud Functions
└─ No  → ใช้ Nuxt Server Routes

เป็น CRUD operation? (create, read, update, delete)
├─ Yes → ใช้ Nuxt Server Routes
└─ No  → พิจารณา Cloud Functions
```

---

## 📚 เอกสารเพิ่มเติม

- [Nuxt Server Routes](https://nuxt.com/docs/guide/directory-structure/server)
- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Cloud Functions Pricing](https://cloud.google.com/functions/pricing)

---

## ✅ Checklist สำหรับ Launch

- [x] ตั้งค่า Nuxt Server Routes
- [x] สร้าง Firebase Admin utils
- [x] สร้าง API endpoints สำหรับ Admin
- [x] ตั้งค่า Firebase Security Rules
- [ ] ทดสอบ CRUD operations
- [ ] Deploy to Vercel/Netlify

**Cloud Functions:**
- [ ] ไม่จำเป็นสำหรับ Phase 1
- [ ] พิจารณาเพิ่มใน Phase 2 (Image optimization)
