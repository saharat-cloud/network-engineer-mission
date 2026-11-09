import { Scenario, MissionInfo } from '../types';

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: 'ห้องปฏิบัติการคอมพิวเตอร์',
    subtitle: 'Computer Laboratory Modernization',
    category: 'การศึกษา (Education)',
    clientName: 'วิทยาลัยเทคโนโลยีการอาชีพ',
    location: 'อาคารเฉลิมพระเกียรติ ชั้น 3',
    budgetEst: 150000,
    icon: 'School',
    situation: 'สถานศึกษาแห่งหนึ่งต้องการปรับปรุงระบบเครือข่ายภายในห้องปฏิบัติการ เนื่องจากมีการเรียนการสอนที่ต้องใช้อินเทอร์เน็ตพร้อมกันจำนวนมาก ปัจจุบันการเชื่อมต่อไม่เสถียรและมีบางจุดที่ไม่สามารถใช้งานเครือข่ายได้',
    requirements: [
      'คอมพิวเตอร์ตั้งโต๊ะ 30 เครื่อง (สายสัญญาณ LAN)',
      'โน้ตบุ๊กครู 2 เครื่อง (รองรับทั้ง LAN และ Wi-Fi)',
      'แท็บเล็ตนักเรียน 25 เครื่อง (รองรับ Wi-Fi ความเร็วสูง)',
      'เครื่องพิมพ์เครือข่าย 1 เครื่อง (Network Printer)',
      'ทุกเครื่องต้องสามารถใช้งานอินเทอร์เน็ตได้พร้อมกันอย่างเสถียร',
      'สามารถส่งงานและสั่งพิมพ์งานผ่านระบบเครือข่ายภายในห้องได้',
      'รองรับการใช้งานพร้อมกันจำนวนมากโดยสปีดไม่ตก'
    ],
    notes: [
      'เน้นการวิเคราะห์ปริมาณ Bandwidth และความเสถียรของ Access Point',
      'พิจารณาการจัดสายสัญญาณและการเลือกใช้ Network Switch ที่เหมาะสม'
    ]
  },
  {
    id: 2,
    title: 'สำนักงานบริษัทสองชั้น',
    subtitle: 'Two-Story Corporate Office',
    category: 'ธุรกิจ/สำนักงาน (Corporate Office)',
    clientName: 'บริษัท ทีแอนด์เอ็น ซินเนอร์ยี่ จำกัด',
    location: 'อาคารพาณิชย์ 2 ชั้น',
    budgetEst: 220000,
    icon: 'Building2',
    situation: 'บริษัทแห่งหนึ่งมีสำนักงาน 2 ชั้น มีพนักงาน 18 คน ต้องการติดตั้งระบบเครือข่ายใหม่เพื่อให้พนักงานสามารถทำงานร่วมกันและใช้งานอุปกรณ์สำนักงานได้อย่างมีประสิทธิภาพและปลอดภัย',
    requirements: [
      'คอมพิวเตอร์ตั้งโต๊ะ 8 เครื่อง (ชั้น 1 และ ชั้น 2)',
      'โน้ตบุ๊ก 10 เครื่อง (เชื่อมต่อ Wi-Fi และสลับใช้งานข้ามชั้น)',
      'เครื่องพิมพ์เครือข่าย 2 เครื่อง (ประจำแต่ละชั้น)',
      'ใช้งานอินเทอร์เน็ตครอบคลุมทั้งสองชั้นอย่างราบรื่น (Seamless Roaming)',
      'แชร์ไฟล์และข้อมูลระหว่างเครื่องภายในองค์กรได้ (File Sharing / NAS)',
      'สั่งพิมพ์เอกสารผ่านเครือข่ายจากทุกอุปกรณ์ที่ได้รับอนุญาต',
      'มีระบบรักษาความปลอดภัยเครือข่ายและระบบตรวจสอบการเข้าถึง',
      'แยกเครือข่ายพนักงานและบุคคลภายนอก (Guest Wi-Fi Isolation)'
    ],
    notes: [
      'พิจารณาการวาง Core/Distribution Switch หรือ Managed Switch และ VLAN',
      'คำนวณตำแหน่งกระจายสัญญาณ Access Point เพื่อไม่ให้อับสัญญาณระหว่างชั้น'
    ]
  },
  {
    id: 3,
    title: 'ร้านกาแฟและพื้นที่ทำงาน',
    subtitle: 'Coffee Shop & Smart Workspace',
    category: 'ร้านค้าบริการ (Hospitality & Retail)',
    clientName: 'Craft & Sip Specialty Cafe',
    location: 'ย่านใจกลางเมือง พื้นที่ร้าน 180 ตร.ม.',
    budgetEst: 180000,
    icon: 'Coffee',
    situation: 'เจ้าของร้านกาแฟต้องการให้บริการอินเทอร์เน็ตแก่ลูกค้า รวมถึงปรับปรุงระบบเครือข่ายสำหรับพนักงานและระบบรักษาความปลอดภัยภายในร้านให้มีเสถียรภาพสูงสุด',
    requirements: [
      'เครื่อง POS (Point of Sale) สำหรับคิดเงิน 2 เครื่อง',
      'กล้องวงจรปิดผ่านเครือข่าย (IP Camera) 6 ตัว พร้อมบันทึกภาพตลอด 24 ชม.',
      'รองรับลูกค้าใช้งานอินเทอร์เน็ตพร้อมกันประมาณ 50 คน',
      'สัญญาณ Wi-Fi ครอบคลุมทั่วทั้งโซนในร้านและโซนระเบียงภายนอก',
      'ระบบคิดเงินและ POS ต้องทำงานได้ต่อเนื่อง ไม่สะดุดแม้ลูกค้าใช้เน็ตหนาแน่น',
      'เจ้าของร้านสามารถตรวจสอบกล้องวงจรปิดผ่านเครือข่ายได้แบบ Real-time',
      'จำกัดความเร็วอินเทอร์เน็ตของลูกค้าได้ (Bandwidth Management / QoS)',
      'กำหนดรหัสผ่านหรือระบบ Captive Portal เข้าใช้งานสำหรับลูกค้า',
      'แยกเครือข่ายลูกค้า (Guest) และระบบภายในร้าน (POS/CCTV/Staff) อย่างเด็ดขาด'
    ],
    notes: [
      'ความปลอดภัยของระบบคิดเงิน POS เป็นหัวใจสำคัญสูงสุด',
      'การจัดสรร Bandwidth และแยก VLAN ป้องกันผู้ใช้ภายนอกสแกนเจอกล้องหรือ POS'
    ]
  },
  {
    id: 4,
    title: 'บ้านพักอาศัยสองหลัง',
    subtitle: 'Dual-Residence Wireless Link',
    category: 'ที่อยู่อาศัย (Residential Link)',
    clientName: 'บ้านคุณสมเกียรติและครอบครัว',
    location: 'ชานเมือง ห่างกัน 250 เมตร',
    budgetEst: 95000,
    icon: 'Home',
    situation: 'เจ้าของบ้านมีบ้านพักอาศัย 2 หลัง ตั้งอยู่ห่างกันประมาณ 250 เมตร ต้องการให้ทั้งสองหลังใช้งานอินเทอร์เน็ตจากจุดเดียวกันได้ โดยไม่ต้องสมัครบริการอินเทอร์เน็ตแยกกันสองสัญญา',
    requirements: [
      'บ้านหลังที่ 1: คอมพิวเตอร์ตั้งโต๊ะ 2 เครื่อง, โน้ตบุ๊ก 2 เครื่อง, สมาร์ทโฟน 4 เครื่อง',
      'บ้านหลังที่ 2: Smart TV 2 เครื่อง (สตรีมมิ่ง 4K), คอมพิวเตอร์ตั้งโต๊ะ 2 เครื่อง, โน้ตบุ๊ก 1 เครื่อง, สมาร์ทโฟน 4 เครื่อง',
      'บ้านหลังที่ 1 เป็นจุดรับอินเทอร์เน็ตไฟเบอร์หลักจากผู้ให้บริการ (ISP Router)',
      'บ้านหลังที่ 2 อยู่ห่างออกไปประมาณ 250 เมตร',
      'Smart TV และคอมพิวเตอร์ทั้งสองหลังต้องเชื่อมต่อได้เสถียร ปิงต่ำ ไม่กระตุก',
      'อุปกรณ์พกพาสามารถใช้งานอินเทอร์เน็ตไร้สายได้ทั่วทั้งสองหลัง',
      'ทั้งสองบ้านใช้งานพร้อมกันได้อย่างต่อเนื่อง',
      'มีสิ่งกีดขวางและสภาพแวดล้อมภายนอกบางส่วนระหว่างบ้านสองหลัง'
    ],
    notes: [
      'พิจารณาทางเลือกการเชื่อมต่อระยะ 250 ม. เช่น Wireless Point-to-Point (PtP) หรือ Fiber Optic',
      'วิเคราะห์ข้อดีข้อเสียเรื่องสภาพอากาศ ความเสถียร และงบประมาณ'
    ]
  },
  {
    id: 5,
    title: 'โรงงานสองอาคาร',
    subtitle: 'Industrial Campus Network',
    category: 'โรงงานอุตสาหกรรม (Industrial Campus)',
    clientName: 'โรงงานผลิตชิ้นส่วนยานยนต์ บริดจ์เทค พาร์ท',
    location: 'เขตนิคมอุตสาหกรรม ระยะห่าง 500 เมตร',
    budgetEst: 350000,
    icon: 'Factory',
    situation: 'โรงงานแห่งหนึ่งมีอาคารสำนักงานและอาคารผลิตแยกจากกัน ระยะห่างประมาณ 500 เมตร ต้องการเชื่อมต่อระบบเครือข่ายเพื่อให้ทำงานร่วมกันได้อย่างมีเสถียรภาพและปลอดภัยจากคลื่นรบกวน',
    requirements: [
      'อาคารสำนักงาน: คอมพิวเตอร์ 12 เครื่อง, โน้ตบุ๊ก 5 เครื่อง',
      'อาคารผลิต: คอมพิวเตอร์ควบคุมงาน (Industrial PC) 8 เครื่อง, กล้องวงจรปิด 8 ตัว',
      'พนักงานทั้งสองอาคารสามารถแลกเปลี่ยนข้อมูลและเข้าถึงระบบ ERP กลางได้',
      'เจ้าหน้าที่สำนักงานสามารถตรวจสอบภาพกล้องวงจรปิดจากอาคารผลิตได้แบบ Real-time',
      'ทั้งสองอาคารสามารถใช้งานอินเทอร์เน็ตได้อย่างรวดเร็วและปลอดภัย',
      'สามารถเดินแนวสายสัญญาณระหว่างอาคารได้ตามมาตรฐานอุตสาหกรรม',
      'ระบบต้องป้องกันสัญญาณรบกวนทางไฟฟ้า (EMI) จากเครื่องจักรในโรงงาน',
      'รองรับการขยายระบบเซนเซอร์ IoT และอุปกรณ์เพิ่มเติมในอนาคต'
    ],
    notes: [
      'ระยะทาง 500 เมตรและการมีสัญญาณรบกวนทำให้ Fiber Optic เป็นทางเลือกที่ควรพิจารณา',
      'ต้องคำนึงถึง Switch ทนอุตสาหกรรม (Industrial Switch) หรือ Rack มาตรฐาน'
    ]
  }
];

export const MISSIONS: MissionInfo[] = [
  {
    id: 1,
    number: '01',
    title: 'วิเคราะห์ความต้องการลูกค้า',
    titleEn: 'Requirement Analysis',
    description: 'ศึกษาโจทย์ปัญหา ถอดรหัสความต้องการอุปกรณ์ จำนวนจุด และข้อจำกัด เพื่อกำหนดขอบเขตระบบ',
    icon: 'Search',
    points: 10
  },
  {
    id: 2,
    number: '02',
    title: 'ออกแบบแผนผังเครือข่าย',
    titleEn: 'Network Topology Design',
    description: 'วาดโครงสร้างสถาปัตยกรรมเครือข่าย วางตำแหน่ง Router, Switch, AP, Server และ Endpoint พร้อมระบุ IP Plan',
    icon: 'GitFork',
    points: 15
  },
  {
    id: 3,
    number: '03',
    title: 'เลือกอุปกรณ์และคำนวณราคา',
    titleEn: 'Equipment Selection & Budget',
    description: 'จัดทำใบเสนอราคา Spec อุปกรณ์ แบรนด์ รุ่น จำนวน ราคาต่อหน่วย ค่าสายสัญญาณ และงบประมาณรวม',
    icon: 'Calculator',
    points: 15
  },
  {
    id: 4,
    number: '04',
    title: 'เตรียมเครื่องมือและวัสดุ',
    titleEn: 'Installation Tools & Materials',
    description: 'จัดเตรียมชุดเครื่องมือช่าง เครื่องมือเข้าหัวสาย คีมย้ำ ตัวทดสอบสัญญาณ และวัสดุสิ้นเปลือง',
    icon: 'Wrench',
    points: 10
  },
  {
    id: 5,
    number: '05',
    title: 'วางแผนการติดตั้ง',
    titleEn: 'Installation Planning',
    description: 'วางแผนขั้นตอนการเข้าหน้างาน 7 เฟส ตั้งแต่สำรวจ เดินท่อร้อยสาย ติดตั้ง Rack เชื่อมต่อ และจัดระเบียบสาย',
    icon: 'CalendarClock',
    points: 10
  },
  {
    id: 6,
    number: '06',
    title: 'ตั้งค่าและทดสอบระบบ',
    titleEn: 'Configuration & Testing',
    description: 'กำหนดตาราง IP Address, DHCP Scope, Static IP, Wi-Fi SSID/Security, VLAN, QoS และทดสอบ Ping/Throughput',
    icon: 'Sliders',
    points: 20
  },
  {
    id: 7,
    number: '07',
    title: 'สรุปและส่งมอบโครงการ',
    titleEn: 'Final Project Submission',
    description: 'รวบรวมหลักฐานและผลงานทุกด่าน สรุปบทวิเคราะห์ นำเสนอโครงการ และส่งมอบรายงานฉบับสมบูรณ์',
    icon: 'Award',
    points: 20
  }
];

export const INITIAL_MISSION_DATA = {
  m1_purpose: '',
  m1_device_types: '',
  m1_device_count: '',
  m1_locations: '',
  m1_constraints: '',
  m1_scalability: '',
  m1_security: '',
  m1_summary: '',
  m1_device_table: [
    { type: 'คอมพิวเตอร์ตั้งโต๊ะ (PC)', count: 0, purpose: 'ใช้งานหลัก/ปฏิบัติการ' },
    { type: 'โน้ตบุ๊ก / เครื่องพกพา', count: 0, purpose: 'ทำงานเคลื่อนที่' },
    { type: 'สมาร์ทโฟน / แท็บเล็ต', count: 0, purpose: 'เชื่อมต่อไร้สาย' },
    { type: 'เครื่องพิมพ์เครือข่าย', count: 0, purpose: 'พิมพ์เอกสารส่วนกลาง' },
    { type: 'กล้องวงจรปิด IP / CCTV', count: 0, purpose: 'รักษาความปลอดภัย' }
  ],
  m2_nodes: [],
  m2_links: [],
  m2_concept_explanation: '',
  m2_uploaded_image_url: '',
  m3_items: [],
  m3_cabling_cost: 0,
  m3_consumables_cost: 0,
  m3_extra_cost: 0,
  m3_customer_budget: 0,
  m3_selection_reason: '',
  m4_tools: [],
  m4_notes: '',
  m4_image_url: '',
  m5_steps: [
    { id: 'step-1', order: 1, phase: '1. สำรวจพื้นที่และตรวจสอบหน้างาน', description: 'สำรวจจุดติดตั้ง จุดร้อยสาย ท่อ ผนัง และตำแหน่งเต้ารับไฟฟ้ารองรับอุปกรณ์', equipment: 'แปลนอาคาร, สายวัด', tools: 'ตลับเมตร, กล้องถ่ายภาพหน้างาน', notes: 'ระวังแนวสายไฟแรงสูง' },
    { id: 'step-2', order: 2, phase: '2. เตรียมอุปกรณ์และ Pre-Configuration', description: 'ตรวจสอบความสมบูรณ์อุปกรณ์ ทดสอบเปิดเครื่อง อัปเกรดเฟิร์มแวร์เบื้องต้น', equipment: 'Router, Switch, Access Points', tools: 'โน้ตบุ๊กช่าง, สาย Console, Patch cord', notes: 'ตั้งค่า IP พื้นฐานก่อนนำขึ้นติดตั้ง' },
    { id: 'step-3', order: 3, phase: '3. ติดตั้งตู้ Rack และจุดยึดอุปกรณ์', description: 'เจาะยึดตู้ Wall-mount Rack ติดตั้งรางไฟ PDU และจัดวางตำแหน่ง Switch/Router', equipment: 'ตู้ Rack, รางปลั๊กไฟ, น็อตยึด', tools: 'สว่านกระแทก, ระดับน้ำ, ไขควง', notes: 'ยึดแน่นหนากับโครงสร้างอาคาร' },
    { id: 'step-4', order: 4, phase: '4. เดินสายสัญญาณและร้อยท่อ', description: 'เดินท่อร้อยสาย PVC/EMT ร้อยสาย LAN UTP Cat6 หรือ Fiber Optic ตามแนวผนังหรือฝ้า', equipment: 'สาย Cat6, ท่อร้อยสาย, กิ๊บรัดสาย', tools: 'เทปดึงสาย (Fish tape), กรรไกรตัดท่อ', notes: 'เว้นระยะห่างจากสายไฟอย่างน้อย 30 ซม.' },
    { id: 'step-5', order: 5, phase: '5. เข้าหัวสายและเชื่อมต่อระบบ', description: 'เข้าหัว RJ45 เข้าหัวตัวเมีย Patch Panel และเชื่อมสาย Patch cord เข้าพอร์ต Switch', equipment: 'หัว RJ45, Patch Panel, Modular Jack', tools: 'คีมย้ำ RJ45, มีดปอกสาย, ตัว Punch down', notes: 'จัดเรียงสีมาตรฐาน TIA/EIA-568B' },
    { id: 'step-6', order: 6, phase: '6. จัดระเบียบสายและติดป้ายกำกับ', description: 'จัดเก็บสายด้วย Velcro tape, ใส่ Cable Management และติด Label กำกับพอร์ตต้นทาง-ปลายทาง', equipment: 'Velcro tape, Label sticker', tools: 'เครื่องพิมพ์ Label หรือ ปากกาเขียนมาร์คเกอร์', notes: 'ระบุหมายเลขห้อง/อุปกรณ์ชัดเจน' },
    { id: 'step-7', order: 7, phase: '7. ตรวจสอบความเรียบร้อยและทำความสะอาด', description: 'ทดสอบการยึดติด ตรวจสอบไฟสถานะ LED บนอุปกรณ์ และทำความสะอาดฝุ่นในพื้นที่ทำงาน', equipment: 'ผ้าไมโครไฟเบอร์', tools: 'เครื่องดูดฝุ่น/แปรงทำความสะอาด', notes: 'ส่งมอบพื้นที่ทำงานสะอาดเรียบร้อย' }
  ],
  m5_safety_notes: '',
  m5_image_url: '',
  m6_ip_configs: [],
  m6_dhcp_enabled: true,
  m6_dhcp_range: '192.168.1.100 - 192.168.1.200',
  m6_static_ips: 'Gateway: 192.168.1.1, Switch: 192.168.1.2, Printer: 192.168.1.50',
  m6_gateway_dns: 'Gateway: 192.168.1.1, Primary DNS: 8.8.8.8, Secondary DNS: 1.1.1.1',
  m6_wifi_ssid: '',
  m6_wifi_pass: '',
  m6_wifi_sec: 'WPA2/WPA3 Personal (AES)',
  m6_wifi_isolation: true,
  m6_vlan_setup: 'VLAN 10: Management, VLAN 20: Staff, VLAN 30: Guest',
  m6_qos_bandwidth: 'Guest Limit: Download 20Mbps / Upload 5Mbps per client',
  m6_testing_method: '1. Ping Test ตรวจสอบ Latency และ Packet Loss\n2. Speedtest & Throughput Test วัดความเร็วเครือข่าย\n3. Port Isolation Test ทดสอบความปลอดภัย Guest Wi-Fi\n4. DHCP Lease Test ตรวจสอบการแจก IP ให้เครื่องลูกข่าย',
  m6_testing_result: '',
  m6_issues_found: '',
  m6_solutions: '',
  m6_post_resolution: '',
  m6_test_evidence_url: '',
  m7_final_concept_summary: '',
  m7_key_challenges: '',
  m7_maintenance_plan: '',
  m7_future_expansion: ''
};

