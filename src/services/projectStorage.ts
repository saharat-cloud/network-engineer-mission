import { Project, ReviewFeedback, MissionStatus } from '../types';
import { SCENARIOS, INITIAL_MISSION_DATA } from '../data/constants';

// Key for storage
const STORAGE_KEY = 'nem_projects_data_v1';
const CURRENT_PROJECT_ID_KEY = 'nem_active_project_id';
const CURRENT_USER_KEY = 'nem_active_user';

export const getStoredProjects = (): Project[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with sample initial project for immediate testing/demo
      const initialProjects = createSampleProjects();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProjects));
      return initialProjects;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read projects from storage', e);
    return [];
  }
};

export const saveProjects = (projects: Project[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects', e);
  }
};

export const getProjectById = (id: string): Project | undefined => {
  const projects = getStoredProjects();
  return projects.find((p) => p.id === id);
};

export const updateProject = (project: Project): void => {
  const projects = getStoredProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  if (index !== -1) {
    projects[index] = { ...project, updatedAt: new Date().toISOString() };
  } else {
    projects.push({ ...project, updatedAt: new Date().toISOString() });
  }
  saveProjects(projects);
};

export const createNewProject = (
  scenarioId: number,
  studentId: string,
  studentName: string,
  groupName: string
): Project => {
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
  const newProject: Project = {
    id: 'proj_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    scenarioId,
    studentId,
    studentName,
    groupName: groupName || `ทีม ${studentName}`,
    currentStage: 1,
    stageStatuses: {
      1: 'AVAILABLE',
      2: 'LOCKED',
      3: 'LOCKED',
      4: 'LOCKED',
      5: 'LOCKED',
      6: 'LOCKED',
      7: 'LOCKED'
    },
    data: {
      ...INITIAL_MISSION_DATA,
      m3_customer_budget: scenario.budgetEst
    },
    feedbackHistory: {
      1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []
    },
    scores: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0
    },
    totalScore: 0,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const projects = getStoredProjects();
  projects.push(newProject);
  saveProjects(projects);
  setActiveProjectId(newProject.id);
  return newProject;
};

export const getActiveProjectId = (): string | null => {
  return localStorage.getItem(CURRENT_PROJECT_ID_KEY);
};

export const setActiveProjectId = (id: string): void => {
  localStorage.setItem(CURRENT_PROJECT_ID_KEY, id);
};

// Teacher Review Actions
export const approveStage = (
  projectId: string,
  stage: number,
  score: number,
  feedback: string,
  reviewerName: string = 'อ.กิตติศักดิ์ พูลสวัสดิ์'
): Project | undefined => {
  const project = getProjectById(projectId);
  if (!project) return undefined;

  // 1. Mark current stage as COMPLETED
  project.stageStatuses[stage] = 'COMPLETED';
  project.scores[stage] = score;

  // 2. Unlock next stage if exists
  if (stage < 7) {
    if (project.stageStatuses[stage + 1] === 'LOCKED') {
      project.stageStatuses[stage + 1] = 'AVAILABLE';
    }
    project.currentStage = Math.max(project.currentStage, stage + 1);
  } else if (stage === 7) {
    project.isCompleted = true;
  }

  // 3. Recalculate total score
  project.totalScore = Object.values(project.scores).reduce((a, b) => a + (b || 0), 0);

  // 4. Append feedback record
  if (!project.feedbackHistory[stage]) {
    project.feedbackHistory[stage] = [];
  }
  project.feedbackHistory[stage].push({
    stage,
    status: 'APPROVED',
    feedback: feedback || 'งานผ่านเกณฑ์เรียบร้อย อนุญาตให้ไปต่อด่านถัดไปได้ครับ',
    score,
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewerName
  });

  updateProject(project);
  return project;
};

export const requestRevisionStage = (
  projectId: string,
  stage: number,
  feedback: string,
  reviewerName: string = 'อ.กิตติศักดิ์ พูลสวัสดิ์'
): Project | undefined => {
  const project = getProjectById(projectId);
  if (!project) return undefined;

  project.stageStatuses[stage] = 'REVISION';

  if (!project.feedbackHistory[stage]) {
    project.feedbackHistory[stage] = [];
  }
  project.feedbackHistory[stage].push({
    stage,
    status: 'REVISION',
    feedback: feedback || 'กรุณาแก้ไขรายละเอียดเพิ่มเติมตามที่ระบุ แล้วกดส่งงานอีกครั้ง',
    score: 0,
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewerName
  });

  updateProject(project);
  return project;
};

// Sample Demo Data Generator
function createSampleProjects(): Project[] {
  return [
    {
      id: 'demo-proj-01',
      scenarioId: 1,
      studentId: 'STD-6601',
      studentName: 'นายธนกร พรสิริ',
      groupName: 'CyberShield Studio',
      currentStage: 2,
      stageStatuses: {
        1: 'COMPLETED',
        2: 'AVAILABLE',
        3: 'LOCKED',
        4: 'LOCKED',
        5: 'LOCKED',
        6: 'LOCKED',
        7: 'LOCKED'
      },
      data: {
        ...INITIAL_MISSION_DATA,
        m1_purpose: 'ยกระดับห้องแล็บคอมพิวเตอร์ให้รองรับการเรียนการสอนออนไลน์และการสอบพร้อมกัน 57 เครื่องโดยไม่หลุด',
        m1_device_types: 'PC Desktop, Notebook, Tablet, Network Printer, Access Point, Switch, Gateway Router',
        m1_device_count: 'ทั้งหมด 58 อุปกรณ์ปลายทาง (PC 30 + Notebook 2 + Tablet 25 + Printer 1)',
        m1_locations: 'ห้องปฏิบัติการคอมพิวเตอร์ อาคาร 3 พื้นที่ 12 x 8 เมตร ตู้ Rack อยู่หน้าห้องติดโต๊ะอาจารย์',
        m1_constraints: 'งบประมาณจำกัดไม่เกิน 150,000 บาท ห้ามเจาะพื้นอาคาร ต้องเดินรางเก็บสายรอบขอบผนังห้อง',
        m1_scalability: 'เตรียมพอร์ต Switch สแปร์ไว้ 20% และใช้ Wi-Fi 6 AP รองรับ High Density',
        m1_security: 'แยก VLAN อาจารย์กับนักเรียน, กำหนด Client Isolation บน Wi-Fi นักเรียน ป้องกันการแฮกข้อสอบ',
        m1_summary: 'ใช้ Managed Gigabit PoE Switch 48 Ports ร่วมกับ Wi-Fi 6 Ceiling AP 2 ตัว และวาง Router MikroTik สำหรับจัดสรร Bandwidth',
        m1_device_table: [
          { type: 'คอมพิวเตอร์ตั้งโต๊ะ (PC)', count: 30, purpose: 'เครื่องนักเรียนใช้งานโปรแกรมและสอบ' },
          { type: 'โน้ตบุ๊กครูผู้สอน', count: 2, purpose: 'ควบคุมการสอนและฉายสไลด์' },
          { type: 'แท็บเล็ตนักเรียน', count: 25, purpose: 'อ่านเอกสารและตอบคำถามปฏิสัมพันธ์' },
          { type: 'เครื่องพิมพ์เครือข่าย', count: 1, purpose: 'พิมพ์ใบงานและเอกสารรายงาน' }
        ],
        m2_nodes: [
          { id: 'node-isp', label: 'ISP Fiber 1000/500M', type: 'router', ip: 'Public IP', notes: 'Main WAN Connection', x: 260, y: 40 },
          { id: 'node-router', label: 'Core Router (MikroTik)', type: 'router', ip: '192.168.1.1', notes: 'DHCP & NAT Gateway', x: 260, y: 130 },
          { id: 'node-switch', label: 'Managed Switch 48P PoE', type: 'switch', ip: '192.168.1.2', notes: 'Gigabit Backbone', x: 260, y: 230 },
          { id: 'node-ap1', label: 'Wi-Fi 6 AP Zone A', type: 'ap', ip: '192.168.1.10', notes: 'Tablet Coverage', x: 100, y: 340 },
          { id: 'node-ap2', label: 'Wi-Fi 6 AP Zone B', type: 'ap', ip: '192.168.1.11', notes: 'Teacher/Tablet Coverage', x: 420, y: 340 },
          { id: 'node-pc', label: 'Student PCs (30 units)', type: 'pc', ip: '192.168.1.100-130', notes: 'Cat6 Wired LAN', x: 260, y: 360 },
          { id: 'node-print', label: 'Laser Printer', type: 'printer', ip: '192.168.1.50', notes: 'Static IP', x: 450, y: 230 }
        ],
        m2_links: [
          { id: 'l-1', from: 'node-isp', to: 'node-router', type: 'cat6', label: 'WAN 1Gbps' },
          { id: 'l-2', from: 'node-router', to: 'node-switch', type: 'cat6', label: 'Trunk Port' },
          { id: 'l-3', from: 'node-switch', to: 'node-ap1', type: 'cat6', label: 'PoE 802.3at' },
          { id: 'l-4', from: 'node-switch', to: 'node-ap2', type: 'cat6', label: 'PoE 802.3at' },
          { id: 'l-5', from: 'node-switch', to: 'node-pc', type: 'cat6', label: 'Access Ports' },
          { id: 'l-6', from: 'node-switch', to: 'node-print', type: 'cat6', label: 'VLAN 10' }
        ],
        m2_concept_explanation: 'โครงสร้างแบบ Star Topology รวมศูนย์ที่ Managed Switch 48 Port พร้อมต่อพ่วง Access Point สองจุดเพื่อกระจายโหลดแท็บเล็ต 25 เครื่องอย่างทั่วถึง'
      },
      feedbackHistory: {
        1: [
          {
            stage: 1,
            status: 'APPROVED',
            feedback: 'วิเคราะห์ได้ละเอียดตรงตามโจทย์ห้องแล็บ มีการระบุจำนวนอุปกรณ์และข้อจำกัดเรื่องสายชัดเจน ยอดเยี่ยมมากครับ',
            score: 10,
            reviewedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
            reviewedBy: 'อ.กิตติศักดิ์ พูลสวัสดิ์'
          }
        ],
        2: [], 3: [], 4: [], 5: [], 6: [], 7: []
      },
      scores: {
        1: 10, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0
      },
      totalScore: 10,
      isCompleted: false,
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-proj-02',
      scenarioId: 3,
      studentId: 'STD-6602',
      studentName: 'นางสาวพิมพาภรณ์ แสนดี',
      groupName: 'CoffeeNet Solutions',
      currentStage: 3,
      stageStatuses: {
        1: 'COMPLETED',
        2: 'COMPLETED',
        3: 'SUBMITTED',
        4: 'LOCKED',
        5: 'LOCKED',
        6: 'LOCKED',
        7: 'LOCKED'
      },
      data: {
        ...INITIAL_MISSION_DATA,
        m1_purpose: 'ติดตั้งระบบเครือข่ายสำหรับร้านกาแฟ รองรับลูกค้า 50 คน เครื่องคิดเงิน POS และกล้องวงจรปิด',
        m1_device_types: 'POS, CCTV Camera, Smartphone, Laptop, AP, Switch, Router',
        m1_device_count: '60+ อุปกรณ์พร้อมกัน',
        m1_locations: 'ร้านกาแฟ 180 ตร.ม. โซนในห้องแอร์และระเบียงสวน',
        m1_constraints: 'ระบบคิดเงิน POS ห้ามล่ม และลูกค้าห้ามเข้าถึงกล้องวงจรปิด',
        m1_scalability: 'ใช้เราเตอร์จัดการแบนด์วิดท์รายคน',
        m1_security: 'แยก 3 VLAN: POS, CCTV, Guest Wi-Fi',
        m1_summary: 'วางระบบเน็ตเวิร์กที่แบ่งแยกส่วนอย่างเด็ดขาดเพื่อความปลอดภัยสูงสุด',
        m2_concept_explanation: 'ใช้ Multi-SSID และ VLAN แยกทราฟฟิกของ POS ออกจากอินเทอร์เน็ตสาธารณะของลูกค้าโดยสิ้นเชิง',
        m3_items: [
          { id: 'eq-1', name: 'Gigabit Multi-WAN VPN Router', category: 'Router', brand: 'Ruijie / Reyee', model: 'RG-EG305GH-P-E', specs: '5-Port Gigabit, PoE+ 54W, Cloud Managed', quantity: 1, unitPrice: 4200, totalPrice: 4200, referenceUrl: 'https://advice.co.th' },
          { id: 'eq-2', name: 'Ceiling Mount Wi-Fi 6 AP', category: 'Access Point', brand: 'Ruijie', model: 'RG-RAP2260(G)', specs: 'Dual-band Wi-Fi 6, 1775Mbps, 500+ Users', quantity: 2, unitPrice: 3890, totalPrice: 7780, referenceUrl: 'https://jib.co.th' },
          { id: 'eq-3', name: '8-Port Gigabit PoE Switch', category: 'Switch', brand: 'TP-Link', model: 'TL-SG108PE', specs: '8x Gigabit, 4x PoE (64W Budget)', quantity: 1, unitPrice: 2190, totalPrice: 2190, referenceUrl: 'https://shopee.co.th' },
          { id: 'eq-4', name: 'Cat6 UTP Cable (305m)', category: 'Cabling', brand: 'Link', model: 'US-9106', specs: 'Cat6 250MHz Outdoor/Indoor Double Jacket', quantity: 1, unitPrice: 3850, totalPrice: 3850, referenceUrl: 'https://lazada.co.th' },
          { id: 'eq-5', name: 'Wall Mount Rack 6U', category: 'Rack', brand: '19" Germany Export Rack', model: 'G1-60406', specs: 'Depth 40cm, Tempered Glass Door, Fan 4"', quantity: 1, unitPrice: 2200, totalPrice: 2200, referenceUrl: 'https://advice.co.th' }
        ],
        m3_cabling_cost: 2500,
        m3_consumables_cost: 1500,
        m3_extra_cost: 3000,
        m3_customer_budget: 180000,
        m3_selection_reason: 'เลือกใช้อุปกรณ์ Cloud Managed ที่รองรับการบริหารจัดการจากระยะไกล มีฟังก์ชัน Bandwidth Control และ Captive Portal ในตัว'
      },
      feedbackHistory: {
        1: [{ stage: 1, status: 'APPROVED', feedback: 'วิเคราะห์ระบบแยก VLAN ชัดเจนดีมาก', score: 10, reviewedAt: new Date(Date.now() - 3600000 * 30).toISOString(), reviewedBy: 'อ.กิตติศักดิ์ พูลสวัสดิ์' }],
        2: [{ stage: 2, status: 'APPROVED', feedback: 'แผนผังสื่อความหมายดี มีการใส่ IP Plan สอดคล้องกับ VLAN', score: 14, reviewedAt: new Date(Date.now() - 3600000 * 10).toISOString(), reviewedBy: 'อ.กิตติศักดิ์ พูลสวัสดิ์' }],
        3: [], 4: [], 5: [], 6: [], 7: []
      },
      scores: {
        1: 10, 2: 14, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0
      },
      totalScore: 24,
      isCompleted: false,
      createdAt: new Date(Date.now() - 3600000 * 60).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

