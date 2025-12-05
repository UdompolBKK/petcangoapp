# PetCanGo - Project Context for Claude

## ภาพรวมโปรเจค
**PetCanGo** คือแพลตฟอร์มค้นหาที่พักที่รับสัตว์เลี้ยงในประเทศไทย

## Tech Stack
- **Frontend:** Nuxt 3 + Vue 3 + TypeScript
- **Backend:** Nuxt Server Routes (54 API endpoints)
- **Database:** Firebase Firestore
- **Auth:** Firebase Authentication (Email/Password, Google OAuth)
- **Storage:** Firebase Storage
- **Styling:** Tailwind CSS + SCSS
- **Deployment:** Vercel (region: sin1)

## โครงสร้างหลัก
```
pages/           # 32 หน้า
├── hotels/      # รายการและรายละเอียดโรงแรม
├── blogs/       # บทความ
├── my-hotels/   # จัดการโรงแรมของ user
├── backend/     # Admin dashboard (ต้อง admin role)
└── province/    # หน้าจังหวัด

components/      # 15 components (Header, Footer, HotelCard, etc.)
composables/     # 16 composables (useAuth, useHotels, useFirestore, etc.)
server/api/      # 54 API endpoints
middleware/      # auth.ts, admin.ts, superadmin.ts
layouts/         # default, admin, backend
scripts/         # Migration scripts จาก MySQL เดิม
```

## ระบบ Role
- `super-admin` - สิทธิ์เต็มระบบ
- `admin` - จัดการ content และ moderation
- `user` - ใช้งานทั่วไป + ลงโรงแรมของตัวเอง

## Firebase Collections
- `hotels` - ที่พัก
- `provinces` - จังหวัด
- `facilities` - สิ่งอำนวยความสะดวก
- `blogs` - บทความ
- `reviews` - รีวิว
- `users` - ข้อมูล user
- `contacts` - ข้อความติดต่อ
- `admins` - รายชื่อ admin

## คำสั่งที่ใช้บ่อย
```bash
pnpm dev          # รัน development server
pnpm build        # build สำหรับ production
pnpm install      # ติดตั้ง dependencies
```

## หมายเหตุสำคัญ
- ภาษา UI เป็นภาษาไทย
- ใช้ Font: Prompt
- Primary color: #FF8E00 (สีส้ม)
- มี migration scripts สำหรับย้ายข้อมูลจาก MySQL เดิม

## ปัญหาที่เคยแก้
- Vercel deploy ใช้ `--no-frozen-lockfile` เพราะ lockfile ไม่ sync

---
*อัปเดตไฟล์นี้เมื่อมีการเปลี่ยนแปลงสำคัญในโปรเจค*
