# NETWORK ENGINEER MISSION
## ภารกิจนักออกแบบและติดตั้งระบบเครือข่าย

เว็บแอปพลิเคชันสำหรับการเรียนการสอนรายวิชาระบบเครือข่ายคอมพิวเตอร์ แบบ **Mission-Based Learning** และ **Stage-Based Progression** 

---

### คุณสมบัติเด่นของระบบ (Key Features)

1. **ไม่มี Sidebar โดยเด็ดขาด (Strict Header Navigation)**:
   - ใช้ Top Navigation Bar ที่แสดงชื่อโครงการ สถานะการล็อกอิน และแถบสเตปด่าน 1-7 แบบ Real-time
2. **ระบบการปลดล็อกด่านตามลำดับ (Stage-Based Progression)**:
   - เริ่มต้นเปิดเฉพาะ Stage 01
   - ด่าน 02-07 จะถูกล็อก (LOCKED) จนกว่าจะส่งงานให้ครู และครูผู้สอนกดอนุมัติ (APPROVE) ผ่านระบบ
3. **5 โจทย์ลูกค้าจำลอง (Real-world Customer Scenarios)**:
   - โจทย์ 1: ห้องปฏิบัติการคอมพิวเตอร์ (Computer Laboratory)
   - โจทย์ 2: สำนักงานบริษัทสองชั้น (Two-Story Corporate Office)
   - โจทย์ 3: ร้านกาแฟและพื้นที่ทำงาน (Specialty Cafe & Smart Workspace)
   - โจทย์ 4: บ้านพักอาศัยสองหลัง (Dual-Residence Wireless Link 250m)
   - โจทย์ 5: โรงงานสองอาคาร (Industrial Campus Network 500m)
   *แสดงเฉพาะความต้องการจริงของลูกค้า ให้นักเรียนเป็นผู้วิเคราะห์ทั้งหมด*
4. **ภารกิจครบ 7 ด่าน (All 7 Interactive Worksheets)**:
   - **Mission 01**: วิเคราะห์ความต้องการลูกค้า (Requirement Analysis & Breakdown Table)
   - **Mission 02**: วาดแผนผังเครือข่าย Interactive (Interactive Topology Designer ลากวางอุปกรณ์, เชื่อมสาย LAN/Wi-Fi, ตั้ง IP, ซูมเข้า-ออก, แนบรูป)
   - **Mission 03**: เลือกอุปกรณ์และคำนวณราคา (Interactive BOM Table คำนวณราคาอัตโนมัติ, แจ้งเตือนงบเกิน/งบคงเหลือ)
   - **Mission 04**: เตรียมเครื่องมือช่างและวัสดุ (Tools & Materials Checklist, ขั้นตอนการใช้, ความปลอดภัย)
   - **Mission 05**: วางแผนการติดตั้ง 7 เฟส (Phase 1-7 Planning, สลับลำดับขั้นตอน, แผนความปลอดภัย)
   - **Mission 06**: ตั้งค่าและทดสอบระบบ (IP Address Table, DHCP Pool, Wi-Fi SSID/Security, VLAN, QoS Bandwidth, ผลทดสอบ Ping/Throughput, การแก้ปัญหา)
   - **Mission 07**: สรุปและส่งมอบโครงการ (Handover Dossier, บทสรุปผู้บริหาร, พิมพ์รายงานแบบฟอร์ม A4 / PDF, Effect แสดง MISSION COMPLETED)
5. **ระบบครูตรวจงาน (Teacher Portal)**:
   - แยกสิทธิ์ครูและนักเรียน
   - ครูสามารถตรวจงานคำตอบ แผนผัง และตาราง BOM ของนักเรียนทุกกลุ่ม
   - อนุมัติผ่านด่าน (Approve) ➔ ปลดล็อกด่านถัดไปให้อัตโนมัติ
   - ส่งงานกลับแก้ไข (Request Revision) ➔ ขึ้นสถานะสีแดงพร้อมแจ้งข้อความความคิดเห็นครูให้นักเรียนเห็น
   - ให้คะแนนตาม Rubric 100 คะแนนเต็ม
   - พิมพ์ใบประเมินผลโครงการ
6. **การจัดเก็บข้อมูลและการเชื่อมต่อ Cloud**:
   - ระบบจัดเก็บใน Local Storage พร้อมทำงานได้ทันทีแบบ Standalone
   - รองรับการเชื่อมต่อกับ Supabase Cloud (PostgreSQL Database & Storage Bucket) ผ่านไฟล์ `.env`

---

### วิธีการรันโปรเจกต์ (Development & Production)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. เริ่มต้น Dev Server
npm run dev

# 3. สั่ง Build สำหรับ Production
npm run build
```

เปิดเบราว์เซอร์ไปที่ `http://localhost:5173` เพื่อเริ่มใช้งาน

