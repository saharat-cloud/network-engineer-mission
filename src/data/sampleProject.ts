import { Project, ReviewFeedback } from '../types';

// ==============================================================================
// ตัวอย่างโปรเจคที่ทำสำเร็จครบ 7 ด่าน (ใช้เป็นตัวอย่างให้นักเรียน/ครูดู)
// นักเรียน: บี | Username: bb | Password: 123456
// ==============================================================================

export const SAMPLE_ACCOUNT = {
  username: 'bb',
  password: '123456',
  fullName: 'บี',
  classroom: 'ม.6/1'
};

export const SAMPLE_PROJECT_ID = 'proj_sample_bb';

const T = (day: number, hour = 10) => new Date(Date.UTC(2026, 10, day, hour, 0, 0)).toISOString();
const REVIEWER = 'อาจารย์ผู้ตรวจ';
const PASS = (comment: string) => ({ status: 'PASS' as const, comment });

const fb = (stage: number, score: number, feedback: string, day: number): ReviewFeedback[] => [
  { stage, status: 'APPROVED', feedback, score, reviewedAt: T(day, 14), reviewedBy: REVIEWER, isRead: true }
];

export const buildSampleProject = (): Project => ({
  id: SAMPLE_PROJECT_ID,
  scenarioId: 1,
  studentId: SAMPLE_ACCOUNT.username,
  studentName: SAMPLE_ACCOUNT.fullName,
  groupName: `ห้อง ${SAMPLE_ACCOUNT.classroom} - ${SAMPLE_ACCOUNT.fullName} (ตัวอย่างโปรเจคสำเร็จ)`,
  currentStage: 7,
  stageStatuses: {
    1: 'COMPLETED', 2: 'COMPLETED', 3: 'COMPLETED', 4: 'COMPLETED',
    5: 'COMPLETED', 6: 'COMPLETED', 7: 'COMPLETED'
  },
  scores: { 1: 10, 2: 14, 3: 15, 4: 10, 5: 9, 6: 19, 7: 20 },
  totalScore: 97,
  isCompleted: true,
  createdAt: T(1, 8),
  updatedAt: T(8, 15),
  feedbackHistory: {
    1: fb(1, 10, 'วิเคราะห์ความต้องการครบถ้วนทุกข้อ ตารางอุปกรณ์ชัดเจน ผ่านเต็มคะแนน', 1),
    2: fb(2, 14, 'แผนผังแบบ Star ถูกต้อง แยก VLAN ครู/นักเรียนดีมาก ควรระบุความยาวสายเพิ่มเล็กน้อย', 2),
    3: fb(3, 15, 'เลือกอุปกรณ์เหมาะสม อยู่ในงบประมาณ มีเหตุผลประกอบชัดเจน', 3),
    4: fb(4, 10, 'รายการเครื่องมือครบ มีขั้นตอนการใช้และข้อควรระวังด้านความปลอดภัย', 4),
    5: fb(5, 9, 'ลำดับขั้นตอนดี ควรเพิ่มรายละเอียดการติดป้าย (Labeling) ปลายสาย', 5),
    6: fb(6, 19, 'ตาราง IP, DHCP, Wi-Fi และ VLAN ถูกต้อง ผลทดสอบ Ping/Speed ครบถ้วน', 7),
    7: fb(7, 20, 'สรุปโครงการและแผนบำรุงรักษาดีเยี่ยม พร้อมส่งมอบลูกค้า ยินดีด้วย! 🎉', 8)
  },
  data: {
    // ---------------- Mission 1 ----------------
    m1_purpose:
      'ปรับปรุงเครือข่ายห้องปฏิบัติการคอมพิวเตอร์ให้รองรับการเรียนการสอน 40 เครื่อง ใช้อินเทอร์เน็ตได้เสถียร แชร์เครื่องพิมพ์ และครูควบคุมเครื่องนักเรียนได้',
    m1_device_types: 'Router/Firewall, Core Switch 48 พอร์ต (PoE), Access Point Wi-Fi 6, คอมพิวเตอร์นักเรียน/ครู, เครื่องพิมพ์เครือข่าย, NAS สำหรับเก็บงาน',
    m1_device_count: 'PC นักเรียน 40 เครื่อง, PC ครู 1 เครื่อง, เครื่องพิมพ์ 1 เครื่อง, AP 2 ตัว, NAS 1 เครื่อง รวม 45 จุดเชื่อมต่อ',
    m1_locations: 'โต๊ะคอม 5 แถว แถวละ 8 เครื่อง, โต๊ะครูด้านหน้า, ตู้ Rack 9U ติดผนังหลังห้อง, AP ติดเพดานหน้า-หลังห้อง',
    m1_constraints: 'งบประมาณไม่เกิน 150,000 บาท, ต้องติดตั้งเสร็จในช่วงปิดภาคเรียน 2 สัปดาห์, ห้ามเจาะผนังโครงสร้าง ใช้รางเก็บสายแทน',
    m1_scalability: 'เผื่อพอร์ต Switch ว่าง 20% และสาย LAN สำรองแถวละ 1 จุด รองรับการเพิ่มเครื่องได้อีก 8 เครื่องในอนาคต',
    m1_security: 'แยก VLAN ครู/นักเรียน, ตั้งรหัส Wi-Fi WPA3, เปิด Content Filter บน Firewall, ปิดพอร์ต Switch ที่ไม่ใช้งาน',
    m1_summary:
      'ออกแบบเครือข่าย Star Topology ใช้สาย Cat6 จาก Core Switch ไปทุกโต๊ะ แยก VLAN เพื่อความปลอดภัย มี Wi-Fi 6 สำหรับอุปกรณ์พกพา และ NAS สำหรับเก็บงานนักเรียน',
    m1_device_table: [
      { type: 'Router / Firewall', count: 1, purpose: 'เชื่อมต่ออินเทอร์เน็ตและกรองเนื้อหา' },
      { type: 'Core Switch 48 Port PoE', count: 1, purpose: 'กระจายสัญญาณไปทุกเครื่อง' },
      { type: 'Access Point Wi-Fi 6', count: 2, purpose: 'ให้บริการ Wi-Fi ทั่วห้อง' },
      { type: 'PC นักเรียน', count: 40, purpose: 'ใช้เรียนและปฏิบัติงาน' },
      { type: 'PC ครู', count: 1, purpose: 'ควบคุมการสอน' },
      { type: 'Network Printer', count: 1, purpose: 'พิมพ์งานร่วมกัน' },
      { type: 'NAS 2 Bay', count: 1, purpose: 'เก็บและสำรองไฟล์งาน' }
    ],
    m1_eval: {
      q1: PASS('ชัดเจน'), q2: PASS('ครบถ้วน'), q3: PASS('ถูกต้อง'), q4: PASS('ระบุตำแหน่งดี'),
      q5: PASS('คำนึงถึงข้อจำกัด'), q6: PASS('มีการเผื่อขยาย'), q7: PASS('ความปลอดภัยดีมาก'), q8: PASS('สรุปได้ดี')
    },

    // ---------------- Mission 2 ----------------
    m2_nodes: [
      { id: 'n1', label: 'Internet / ISP', type: 'firewall', ip: 'WAN', x: 380, y: 30 },
      { id: 'n2', label: 'Router Firewall', type: 'router', ip: '192.168.10.1', x: 380, y: 120 },
      { id: 'n3', label: 'Core Switch 48P', type: 'switch', ip: '192.168.10.2', x: 380, y: 220 },
      { id: 'n4', label: 'AP หน้าห้อง', type: 'ap', ip: '192.168.10.11', x: 160, y: 320 },
      { id: 'n5', label: 'AP หลังห้อง', type: 'ap', ip: '192.168.10.12', x: 600, y: 320 },
      { id: 'n6', label: 'PC ครู', type: 'pc', ip: '192.168.10.50', x: 260, y: 400 },
      { id: 'n7', label: 'PC นักเรียน x40', type: 'pc', ip: 'DHCP 192.168.20.x', x: 380, y: 420 },
      { id: 'n8', label: 'Printer', type: 'printer', ip: '192.168.10.60', x: 500, y: 400 },
      { id: 'n9', label: 'NAS', type: 'server', ip: '192.168.10.70', x: 620, y: 220 }
    ],
    m2_links: [
      { id: 'l1', from: 'n1', to: 'n2', type: 'fiber', label: 'FTTx 1Gbps' },
      { id: 'l2', from: 'n2', to: 'n3', type: 'cat6', label: 'Uplink 1G' },
      { id: 'l3', from: 'n3', to: 'n4', type: 'cat6', label: 'PoE' },
      { id: 'l4', from: 'n3', to: 'n5', type: 'cat6', label: 'PoE' },
      { id: 'l5', from: 'n3', to: 'n6', type: 'cat6', label: 'VLAN 10' },
      { id: 'l6', from: 'n3', to: 'n7', type: 'cat6', label: 'VLAN 20' },
      { id: 'l7', from: 'n3', to: 'n8', type: 'cat6', label: 'VLAN 10' },
      { id: 'l8', from: 'n3', to: 'n9', type: 'cat6', label: 'VLAN 10' }
    ],
    m2_concept_explanation:
      'ใช้ Star Topology โดยมี Core Switch เป็นศูนย์กลาง ทุกเครื่องต่อสาย Cat6 ตรงเข้า Switch ทำให้ถ้าสายเส้นใดเสียจะไม่กระทบเครื่องอื่น แบ่ง VLAN 10 (ครู/อุปกรณ์กลาง) และ VLAN 20 (นักเรียน) AP ใช้ไฟ PoE จาก Switch ไม่ต้องเดินปลั๊กเพิ่ม',
    m2_eval: { nodes: PASS('ครบ'), links: PASS('ถูกต้อง'), explanation: PASS('อธิบายดี') },

    // ---------------- Mission 3 ----------------
    m3_items: [
      { id: 'e1', name: 'Router Firewall', category: 'Router', brand: 'MikroTik', model: 'RB5009UG+S+IN', specs: '7x GbE, 1x 2.5G, 1x SFP+', quantity: 1, unitPrice: 8500, totalPrice: 8500, referenceUrl: '' },
      { id: 'e2', name: 'Core Switch 48 Port PoE', category: 'Switch', brand: 'TP-Link', model: 'TL-SG3452P', specs: '48x GbE PoE+, 4x SFP, Managed L2+', quantity: 1, unitPrice: 26900, totalPrice: 26900, referenceUrl: '' },
      { id: 'e3', name: 'Access Point Wi-Fi 6', category: 'Wireless', brand: 'Ubiquiti', model: 'U6+', specs: 'Wi-Fi 6 AX3000, PoE', quantity: 2, unitPrice: 4990, totalPrice: 9980, referenceUrl: '' },
      { id: 'e4', name: 'NAS 2 Bay + HDD 4TB x2', category: 'Server', brand: 'Synology', model: 'DS224+', specs: 'RAID 1, 4TB usable', quantity: 1, unitPrice: 21500, totalPrice: 21500, referenceUrl: '' },
      { id: 'e5', name: 'Network Printer', category: 'Printer', brand: 'Brother', model: 'HL-L2375DW', specs: 'Laser, Duplex, LAN/Wi-Fi', quantity: 1, unitPrice: 6290, totalPrice: 6290, referenceUrl: '' },
      { id: 'e6', name: 'ตู้ Rack 9U + Patch Panel 48P', category: 'Accessory', brand: 'Germany', model: 'G7-60609', specs: 'Wall Rack 9U, PDU', quantity: 1, unitPrice: 7800, totalPrice: 7800, referenceUrl: '' },
      { id: 'e7', name: 'UPS 1500VA', category: 'Power', brand: 'APC', model: 'BX1500MI-MS', specs: '1500VA/900W', quantity: 1, unitPrice: 6200, totalPrice: 6200, referenceUrl: '' }
    ],
    m3_cabling_cost: 18500,
    m3_consumables_cost: 6500,
    m3_extra_cost: 15000,
    m3_customer_budget: 150000,
    m3_selection_reason:
      'เลือก Switch แบบ Managed รองรับ VLAN และ PoE เพื่อจ่ายไฟให้ AP, Router MikroTik ราคาคุ้มค่าทำ Firewall/Content Filter ได้, NAS ทำ RAID 1 ป้องกันข้อมูลหาย รวมทั้งหมด 127,170 บาท เหลืองบสำรอง 22,830 บาท',
    m3_eval: { bom: PASS('ครบ'), budget: PASS('อยู่ในงบ'), reason: PASS('มีเหตุผล') },

    // ---------------- Mission 4 ----------------
    m4_tools: [
      { id: 't1', name: 'คีมเข้าหัว RJ45', category: 'cabling', quantity: 2, purpose: 'เข้าหัวสาย LAN', steps: 'ปอกสาย เรียงสี T568B ตัดให้เสมอ เสียบหัวแล้วบีบให้แน่น' },
      { id: 't2', name: 'เครื่องมือ Punch Down', category: 'cabling', quantity: 1, purpose: 'เข้าสายที่ Patch Panel / Outlet', steps: 'วางสายตามสีบน Keystone แล้วกดตัดด้วย Punch Down' },
      { id: 't3', name: 'Cable Tester', category: 'tester', quantity: 1, purpose: 'ตรวจสอบสายทั้ง 8 เส้น', steps: 'เสียบหัวทั้งสองฝั่ง ดูไฟ 1-8 ติดเรียงตรงกัน' },
      { id: 't4', name: 'สว่านไฟฟ้า + พุก', category: 'general', quantity: 1, purpose: 'ยึดราง/ตู้ Rack', steps: 'วัดระยะ ทำเครื่องหมาย เจาะ ใส่พุก ขันสกรู' },
      { id: 't5', name: 'หัว RJ45 Cat6 + บูท', category: 'consumable', quantity: 120, purpose: 'ใช้เข้าหัวสาย', steps: 'ใส่บูทก่อนเข้าหัวทุกครั้ง' },
      { id: 't6', name: 'แล็ปท็อป + สาย Console', category: 'network', quantity: 1, purpose: 'ตั้งค่า Router/Switch', steps: 'ต่อ Console/Winbox แล้วตั้งค่าตามแผน' }
    ],
    m4_notes: 'สวมแว่นตานิรภัยขณะเจาะ, ตัดไฟก่อนติดตั้งตู้ Rack/UPS, ใช้บันไดที่มั่นคงเมื่อติดตั้ง AP บนเพดาน, เก็บเศษสายและหัว RJ45 ให้เรียบร้อย',
    m4_eval: { tools: PASS('ครบ'), safety: PASS('ดี') },

    // ---------------- Mission 5 ----------------
    m5_steps: [
      { id: 's1', order: 1, phase: 'สำรวจและวางแผน', description: 'สำรวจหน้างาน วัดระยะ ทำแผนเดินสาย', equipment: '-', tools: 'ตลับเมตร, แบบแปลน', notes: 'ถ่ายรูปก่อนเริ่มงาน' },
      { id: 's2', order: 2, phase: 'ติดตั้งตู้ Rack และราง', description: 'ยึดตู้ Rack ติดผนัง ติดรางเก็บสายตามแนวโต๊ะ', equipment: 'ตู้ Rack 9U', tools: 'สว่าน, ระดับน้ำ', notes: 'ตู้สูงจากพื้น 1.5 ม.' },
      { id: 's3', order: 3, phase: 'เดินสาย LAN', description: 'เดินสาย Cat6 45 จุดจาก Rack ไปทุกโต๊ะ', equipment: 'สาย Cat6', tools: 'เทปพันสาย', notes: 'ติดป้ายหมายเลขทุกเส้น' },
      { id: 's4', order: 4, phase: 'เข้าหัวและ Patch Panel', description: 'เข้าหัว RJ45 ฝั่งโต๊ะ และ Punch Down ฝั่ง Patch Panel', equipment: 'Patch Panel', tools: 'คีม, Punch Down', notes: 'มาตรฐาน T568B' },
      { id: 's5', order: 5, phase: 'ทดสอบสาย', description: 'ทดสอบทุกเส้นด้วย Cable Tester บันทึกผล', equipment: '-', tools: 'Cable Tester', notes: 'แก้ไขเส้นที่ไม่ผ่านทันที' },
      { id: 's6', order: 6, phase: 'ติดตั้งอุปกรณ์', description: 'ติดตั้ง Router, Switch, UPS, AP, NAS, Printer', equipment: 'อุปกรณ์ทั้งหมด', tools: 'ไขควง', notes: 'จัดสายในตู้ให้เป็นระเบียบ' },
      { id: 's7', order: 7, phase: 'ตั้งค่าและส่งมอบ', description: 'ตั้งค่า IP/VLAN/Wi-Fi ทดสอบระบบ และส่งมอบเอกสาร', equipment: '-', tools: 'แล็ปท็อป', notes: 'อบรมครูผู้ดูแล' }
    ],
    m5_safety_notes: 'ตัดไฟฟ้าก่อนติดตั้งอุปกรณ์ไฟฟ้า, ทำงานบนที่สูงต้องมีผู้ช่วยจับบันได, จัดพื้นที่ทำงานไม่ให้สายระเกะระกะ',
    m5_eval: { phases: PASS('ครบ 7 เฟส'), safety: PASS('ดี') },

    // ---------------- Mission 6 ----------------
    m6_ip_configs: [
      { id: 'ip1', deviceName: 'Router Firewall', ipAddress: '192.168.10.1', subnetMask: '255.255.255.0', gateway: '-', dns: '8.8.8.8', notes: 'Gateway VLAN 10' },
      { id: 'ip2', deviceName: 'Core Switch', ipAddress: '192.168.10.2', subnetMask: '255.255.255.0', gateway: '192.168.10.1', dns: '192.168.10.1', notes: 'Management' },
      { id: 'ip3', deviceName: 'AP หน้าห้อง', ipAddress: '192.168.10.11', subnetMask: '255.255.255.0', gateway: '192.168.10.1', dns: '192.168.10.1', notes: '' },
      { id: 'ip4', deviceName: 'AP หลังห้อง', ipAddress: '192.168.10.12', subnetMask: '255.255.255.0', gateway: '192.168.10.1', dns: '192.168.10.1', notes: '' },
      { id: 'ip5', deviceName: 'PC ครู', ipAddress: '192.168.10.50', subnetMask: '255.255.255.0', gateway: '192.168.10.1', dns: '192.168.10.1', notes: 'Static' },
      { id: 'ip6', deviceName: 'Printer', ipAddress: '192.168.10.60', subnetMask: '255.255.255.0', gateway: '192.168.10.1', dns: '192.168.10.1', notes: 'Static' },
      { id: 'ip7', deviceName: 'NAS', ipAddress: '192.168.10.70', subnetMask: '255.255.255.0', gateway: '192.168.10.1', dns: '192.168.10.1', notes: 'Static' }
    ],
    m6_dhcp_enabled: true,
    m6_dhcp_range: 'VLAN 20 (นักเรียน): 192.168.20.100 - 192.168.20.200',
    m6_static_ips: 'Router .1, Switch .2, AP .11-.12, PC ครู .50, Printer .60, NAS .70 (VLAN 10)',
    m6_gateway_dns: 'Gateway 192.168.10.1 / 192.168.20.1, DNS 8.8.8.8 และ 1.1.1.1',
    m6_wifi_ssid: 'COM-LAB-WiFi',
    m6_wifi_pass: 'Lab@2026!',
    m6_wifi_sec: 'WPA3-Personal',
    m6_wifi_isolation: true,
    m6_vlan_setup: 'VLAN 10 = ครู/อุปกรณ์กลาง, VLAN 20 = นักเรียน, Trunk port ไป Router, ACL ห้าม VLAN 20 เข้าหน้าจัดการอุปกรณ์',
    m6_qos_bandwidth: 'จำกัดเครื่องนักเรียน 20 Mbps/เครื่อง, ให้ความสำคัญเครื่องครูและ NAS',
    m6_testing_method: 'Ping ทุกเครื่องไป Gateway และ 8.8.8.8, ทดสอบ Speedtest, ทดสอบพิมพ์งานผ่านเครือข่าย, ทดสอบเข้าถึง NAS',
    m6_testing_result: 'Ping สำเร็จ 45/45 เครื่อง (เฉลี่ย 1 ms ภายใน, 12 ms ออกเน็ต), Speedtest 920/890 Mbps, พิมพ์งานและเข้า NAS ได้ทุกเครื่อง',
    m6_issues_found: 'PC แถว 3 เครื่องที่ 5 ได้ IP 169.254.x.x',
    m6_solutions: 'ตรวจพบหัว RJ45 ฝั่งโต๊ะเข้าสายสลับคู่ เข้าหัวใหม่และทดสอบด้วย Cable Tester',
    m6_post_resolution: 'เครื่องได้รับ IP 192.168.20.134 ใช้งานอินเทอร์เน็ตได้ปกติ',
    m6_eval: { ipPlan: PASS('ถูกต้อง'), wifiVlan: PASS('ปลอดภัย'), testing: PASS('ครบถ้วน') },

    // ---------------- Mission 7 ----------------
    m7_final_concept_summary:
      'ส่งมอบเครือข่ายห้องปฏิบัติการคอมพิวเตอร์ 45 จุด แบบ Star Topology สาย Cat6 แยก VLAN ครู/นักเรียน มี Wi-Fi 6 ครอบคลุมทั้งห้อง Firewall กรองเนื้อหา และ NAS RAID 1 ใช้งบ 127,170 บาท จากงบ 150,000 บาท',
    m7_key_challenges: 'การเดินสายโดยไม่เจาะผนังโครงสร้าง แก้โดยใช้รางเก็บสายตามแนวโต๊ะ และปัญหาหัว RJ45 เข้าสายผิด 1 จุดซึ่งแก้ไขแล้ว',
    m7_maintenance_plan: 'ตรวจสอบสายและอุปกรณ์ทุกเดือน, สำรองค่า Config ทุกภาคเรียน, อัปเดต Firmware ทุก 3 เดือน, ทดสอบแบตเตอรี่ UPS ทุก 6 เดือน',
    m7_future_expansion: 'Switch มีพอร์ตว่าง 3 พอร์ตและ SFP 4 ช่อง รองรับเพิ่มเครื่องหรือเชื่อมต่อไฟเบอร์ไปห้องอื่น สามารถเพิ่ม AP ได้อีก 1 ตัว',
    m7_submitted_at: T(8, 9),
    m7_eval: { handover: PASS('ดีเยี่ยม') }
  }
});
