# PetCanGo - Database Analysis & Migration Plan

## 📊 Database Overview

**Database Name**: `dsignweb_petallow`
**Platform**: OctoberCMS 1 (Laravel-based)
**Total Hotels**: 550+
**Total Provinces**: 31
**Total Blog Posts**: ~30+

---

## 🗄️ Core Tables Analysis

### 1. `pet_pet_hotel` - โรงแรม/ที่พัก

**โครงสร้างตาราง:**
```sql
- id (int)
- name (text) - ชื่อโรงแรม
- slug (text) - URL slug
- image (text) - รูปหลัก
- content (text) - เนื้อหาแบบ JSON array
- gallery (text) - รูปภาพแกลเลอรี่ JSON array
- facility (text) - สิ่งอำนวยความสะดวก JSON array
- address (text) - ที่อยู่
- province (text) - รหัสจังหวัด
- zipcode (text)
- area (text)
- mincontent (text) - คำอธิบายสั้น
- googlemap (text) - iframe Google Maps
- pricestart (int) - ราคาเริ่มต้น
- phone (text) - เบอร์โทร
- tags (text)
- petprice (text) - ค่าสัตว์เลี้ยง
- postby (text) - ผู้โพส
- priority (int) - ลำดับความสำคัญ
- created_at, updated_at
```

**ตัวอย่างข้อมูล:**
- โรงแรมฟอร์เลิฟรีสอร์ท (ID: 1)
- ราคาเริ่มต้น: 240 บาท
- Province: ปทุมธานี
- มี 11 สิ่งอำนวยความสะดวก
- มีแกลเลอรี่ 7 รูป

**ข้อมูลพิเศษ:**
- `content` เป็น JSON array ที่มี type: "text" กับ header และ innercontent
- `facility` เป็น array ของ ID สิ่งอำนวยความสะดวก เช่น ["2","3","4"...]
- `gallery` เป็น array ของ objects {image, alttext}

---

### 2. `pet_pet_blog` - บทความ

**โครงสร้างตาราง:**
```sql
- id (int)
- name (text) - ชื่อบทความ
- slug (text)
- content (text) - HTML content
- mindes (text) - คำอธิบายสั้น/excerpt
- image (text) - featured image
- status (int)
- category (int)
- created_at, updated_at
```

**ตัวอย่างบทความ:**
1. "อาหารอะได้ดีต่อสุนัข?"
2. "พาสุนัขไปทะเลดีอย่างไร?"
3. "อาการหายใจหอบของสุนัข"
4. "กฎหมายการเลี้ยงสัตว์ปี 2567"
... (รวม 12+ บทความ)

---

### 3. `pet_pet_province` - จังหวัด

**โครงสร้างตาราง:**
```sql
- id (int)
- name (text) - ชื่อจังหวัด
- slug (text)
- content (text) - คำอธิบายจังหวัด
- image (text) - รูปภาพ
- park (text) - ภาค (north, south, east, west, middle, east-north)
- tags (text) - JSON array ของสถานที่น่าสนใจ
- nest_left, nest_right, nest_depth, parent_id (nested set structure)
```

**จังหวัดที่มี (31 จังหวัด):**
1. ปทุมธานี (ID: 1)
2. ลพบุรี (ID: 2)
3. กาญจนบุรี (ID: 3) - มี tags เช่น เขื่อนศรีนครินทร์, แม่น้ำแควใหญ่
4. สระบุรี (ID: 4)
5. เพชรบุรี (ID: 5) - มี tags: ชะอำ, หาดเจ้าสำราญ
6. ประจวบคีรีขันธ์ (ID: 7) - มี tags: หัวหิน, ปราณบุรี
7. ชลบุรี (ID: 8) - มี tags: พัทยา, เกาะสีชัง, เกาะล้าน
8. จันทบุรี (ID: 9)
9. ตราด (ID: 10)
10. ระยอง (ID: 11)
... และอีกมากมาย

**การจัดภาค:**
- `north`: เชียงใหม่, เชียงราย, แพร่, พิษณุโลก, นครสวรรค์, ชุมพร
- `south`: เพชรบุรี, ประจวบคีรีขันธ์, ภูเก็ต, กระบี่, สุราษฎร์ธานี
- `east`: ชลบุรี, จันทบุรี, ตราด, ระยอง
- `middle`: ปทุมธานี, ลพบุรี, สระบุรี, นครปฐม, สมุทรสงคราม, ราชบุรี, สุพรรณบุรี
- `east-north`: นครราชสีมา, อุบลราชธานี, อุดรธานี

---

### 4. `pet_pet_facility` - สิ่งอำนวยความสะดวก

**โครงสร้างตาราง:**
```sql
- id (int)
- name (text) - ชื่อสิ่งอำนวยความสะดวก
- slug (text)
- icon (text) - ไอคอน
```

**ตัวอย่าง:**
- Wifi
- ที่จอดรถ
- สระว่ายน้ำ
- ร้านอาหาร
- โทรทัศน์
... (15+ items)

---

### 5. Additional Tables

**`pet_pet_feature`** - คุณสมบัติเด่น
**`pet_pet_appear`** - ลักษณะภายนอก
**`pet_pet_formdata`** - ข้อมูลฟอร์ม
**`pet_pet_pageview`** - สถิติการเข้าชม (220,850+ views)
**`pet_pet_reviewhotel`** - รีวิวโรงแรม
**`pet_pet_tagfocus`, `pet_pet_tagpage`** - ระบบ tags

---

## 🔄 Firebase Data Structure Design

### Firestore Collections

#### 1. `hotels`
```javascript
{
  id: "auto-generated-id",
  name: "โรงแรมฟอร์เลิฟรีสอร์ท",
  slug: "โรงแรมฟอร์เลิฟรีสอร์ท",
  mainImage: "/hotel/hotel1-min.jpg",

  // Rich content
  content: [
    {
      type: "text",
      header: "เกี่ยวกับโรงแรม",
      innercontent: "<p>HTML content...</p>"
    }
  ],

  // Gallery
  gallery: [
    { image: "/hotel/hotel1-min.jpg", alttext: "" },
    { image: "/hotel/8.jpg", alttext: "" }
  ],

  // Location
  province: {
    id: "1",
    name: "ปทุมธานี",
    slug: "pathum-thani"
  },
  address: "11/8 หมู่ที่ 4, ตำบล ลำผักกูด อำเภอธัญบุรี",
  zipcode: null,
  area: null,
  googleMapIframe: "<iframe src='...'></iframe>",

  // Details
  shortDescription: "โรงแรมฟอร์เลิฟรีสอร์ท ตั้งอยู่ในอำเภอ ธัญญบุรีรังสิตคลอง 8...",
  price: {
    start: 240,
    petFee: null // or number
  },

  // Contact
  phone: "025461115",

  // Facilities
  facilities: ["wifi", "parking", "pool", "restaurant"...],
  // หรือ populate เต็ม
  facilitiesDetails: [
    { id: "2", name: "Wifi", icon: "/icon.png" },
    { id: "3", name: "ที่จอดรถ", icon: "/icon2.png" }
  ],

  // Meta
  tags: [],
  priority: null,
  postedBy: null,
  viewCount: 0,

  // Timestamps
  createdAt: timestamp,
  updatedAt: timestamp,

  // SEO
  featured: false,
  status: "published" // draft, published
}
```

#### 2. `provinces`
```javascript
{
  id: "auto-generated-id",
  oldId: "1", // for migration reference
  nameTh: "ปทุมธานี",
  nameEn: "Pathum Thani",
  slug: "pathum-thani",

  // Content
  description: "<p>ปทุมธานี พื้นที่ปริมณฑลของกรุงเทพฯ...</p>",
  image: "/province/beautiful-shot-mekong-river.jpg",

  // Region
  region: "middle", // north, south, east, west, middle, east-north

  // Tags (สถานที่น่าสนใจ)
  attractions: [
    {
      name: "เขื่อนศรีนครินทร์",
      slug: "srinakarindam",
      image: "/karnchanaburi/srinakarindam.png"
    }
  ],

  // Stats
  hotelCount: 0, // computed field or counter

  // Nested set (if needed)
  nestLeft: 17,
  nestRight: 18,
  nestDepth: 0,
  parentId: null,

  // Timestamps
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 3. `posts` (Blog)
```javascript
{
  id: "auto-generated-id",
  title: "อาหารอะได้ดีต่อสุนัข?",
  slug: "อาหารอะได้ดีต่อสุนัข",

  // Content
  content: "<h2>อาหารเม็ดสำเร็จรูป...</h2>",
  excerpt: "อาหารหลากหลายประเภทมีสารอาหารที่ต่างกัน...",
  featuredImage: "/blogs/blog1-min.jpg",

  // Meta
  category: null, // or category object
  tags: ["อาหาร", "สุนัข", "สุขภาพ"],

  // Stats
  viewCount: 0,

  // Author
  authorId: null, // user ID if needed

  // Status
  status: "published", // draft, published

  // Timestamps
  publishedAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 4. `facilities`
```javascript
{
  id: "auto-generated-id",
  oldId: "2", // for reference
  name: "Wifi",
  slug: "wifi",
  icon: "/icons/wifi.png",
  order: 1
}
```

#### 5. `users` (Optional - for owners)
```javascript
{
  uid: "firebase-auth-uid",
  email: "user@example.com",
  displayName: "Hotel Owner",
  role: "hotel_owner", // user, hotel_owner, admin
  phoneNumber: "0812345678",
  hotels: ["hotel-id-1", "hotel-id-2"], // owned hotels
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 6. `pageviews` (Analytics)
```javascript
{
  id: "auto-generated-id",
  totalViews: 220850,
  updatedAt: timestamp
}
```

---

## 📦 Migration Scripts Needed

### 1. **Province Migration**
```javascript
// scripts/migrate-provinces.js
- Read from SQL: pet_pet_province
- Transform park => region
- Parse tags JSON
- Create Firestore documents
- Keep oldId for reference
```

### 2. **Hotels Migration**
```javascript
// scripts/migrate-hotels.js
- Read from SQL: pet_pet_hotel
- Parse content JSON
- Parse gallery JSON
- Parse facility array
- Map province ID to province document
- Upload images to Firebase Storage (if needed)
- Create Firestore documents
```

### 3. **Blog Posts Migration**
```javascript
// scripts/migrate-posts.js
- Read from SQL: pet_pet_blog
- Clean HTML content
- Upload images to Firebase Storage
- Create Firestore documents
```

### 4. **Facilities Migration**
```javascript
// scripts/migrate-facilities.js
- Simple mapping from SQL to Firestore
```

---

## 🎯 Implementation Priority

### Phase 1: Data Migration (Week 1)
1. ✅ Setup Firebase collections
2. ⬜ Migrate provinces (31 records)
3. ⬜ Migrate facilities (~15 records)
4. ⬜ Migrate hotels (550+ records)
5. ⬜ Migrate blog posts (~30 records)

### Phase 2: Core Pages (Week 2)
1. ⬜ Homepage
   - Hero section with search
   - Featured provinces carousel
   - New hotels section
   - Blog preview section

2. ⬜ Province Pages
   - `/all-province` - Province listing with carousel
   - `/province/[slug]` - Province detail with hotels

3. ⬜ Hotel Pages
   - `/hotel/[id]` - Hotel detail page
   - Gallery viewer
   - Google Maps integration

### Phase 3: Blog & Search (Week 3)
1. ⬜ Blog listing `/blogs`
2. ⬜ Blog detail `/blogs/[slug]`
3. ⬜ Search functionality
4. ⬜ Filter by province

### Phase 4: User Features (Week 4)
1. ⬜ Authentication
2. ⬜ Hotel registration form
3. ⬜ User dashboard
4. ⬜ Hotel management

---

## 🚀 Next Steps

1. **คุณต้องการเริ่มจากไหน?**
   - Migration scripts?
   - UI Components?
   - Specific features?

2. **Missing Information:**
   - ยังไม่มี facilities table data
   - ยังไม่มีรูปภาพ (ต้อง copy จาก server เดิม)
   - User management system ต้องการไหม?

3. **Questions:**
   - ต้องการ admin dashboard สำหรับจัดการ content ไหม?
   - ต้องการระบบจองห้องด้วยไหม หรือแค่แสดงข้อมูล?
   - ต้องการ SEO optimization แบบไหน?

**พร้อมเริ่มได้เลยครับ! บอกผมว่าอยากเริ่มจากส่วนไหนก่อน** 🚀
