export interface User {
  id: string;
  name: string;
  role: 'student' | 'teacher';
  email: string;
  groupName?: string;
}

export interface Scenario {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  clientName: string;
  location: string;
  budgetEst: number;
  situation: string;
  requirements: string[];
  notes?: string[];
  icon: string;
}

export type MissionStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'SUBMITTED' | 'REVISION' | 'COMPLETED';

export interface MissionInfo {
  id: number;
  number: string;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  points: number;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  specs: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  referenceUrl: string;
}

export interface ToolItem {
  id: string;
  name: string;
  category: 'general' | 'network' | 'tester' | 'cabling' | 'consumable';
  quantity: number;
  purpose: string;
  steps: string;
}

export interface StepPlanItem {
  id: string;
  order: number;
  phase: string;
  description: string;
  equipment: string;
  tools: string;
  notes: string;
}

export interface IPConfigItem {
  id: string;
  deviceName: string;
  ipAddress: string;
  subnetMask: string;
  gateway: string;
  dns: string;
  notes: string;
}

export interface TopologyNode {
  id: string;
  label: string;
  type: 'router' | 'switch' | 'server' | 'ap' | 'pc' | 'printer' | 'camera' | 'firewall';
  ip?: string;
  notes?: string;
  x: number;
  y: number;
}

export interface TopologyLink {
  id: string;
  from: string;
  to: string;
  type: 'cat6' | 'fiber' | 'wireless';
  label?: string;
}

export interface MissionData {
  // Mission 1: Analysis
  m1_purpose: string;
  m1_device_types: string;
  m1_device_count: string;
  m1_locations: string;
  m1_constraints: string;
  m1_scalability: string;
  m1_security: string;
  m1_summary: string;
  m1_device_table: Array<{ type: string; count: number; purpose: string }>;

  // Mission 2: Topology
  m2_nodes: TopologyNode[];
  m2_links: TopologyLink[];
  m2_concept_explanation: string;
  m2_uploaded_image_url?: string;

  // Mission 3: Equipment & Budget
  m3_items: EquipmentItem[];
  m3_cabling_cost: number;
  m3_consumables_cost: number;
  m3_extra_cost: number;
  m3_customer_budget: number;
  m3_selection_reason: string;

  // Mission 4: Tools & Materials
  m4_tools: ToolItem[];
  m4_notes: string;
  m4_image_url?: string;

  // Mission 5: Installation Plan
  m5_steps: StepPlanItem[];
  m5_safety_notes: string;
  m5_image_url?: string;

  // Mission 6: Config & Test
  m6_ip_configs: IPConfigItem[];
  m6_dhcp_enabled: boolean;
  m6_dhcp_range: string;
  m6_static_ips: string;
  m6_gateway_dns: string;
  m6_wifi_ssid: string;
  m6_wifi_pass: string;
  m6_wifi_sec: string;
  m6_wifi_isolation: boolean;
  m6_vlan_setup: string;
  m6_qos_bandwidth: string;
  m6_testing_method: string;
  m6_testing_result: string;
  m6_issues_found: string;
  m6_solutions: string;
  m6_post_resolution: string;
  m6_test_evidence_url?: string;

  // Mission 7: Final
  m7_final_concept_summary: string;
  m7_key_challenges: string;
  m7_maintenance_plan: string;
  m7_future_expansion: string;
  m7_submitted_at?: string;
}

export interface ReviewFeedback {
  stage: number;
  status: 'APPROVED' | 'REVISION';
  feedback: string;
  score: number;
  reviewedAt: string;
  reviewedBy: string;
}

export interface Project {
  id: string;
  scenarioId: number;
  studentId: string;
  studentName: string;
  groupName: string;
  currentStage: number; // 1 - 7
  stageStatuses: Record<number, MissionStatus>; // { 1: 'IN_PROGRESS', 2: 'LOCKED', ... }
  data: MissionData;
  feedbackHistory: Record<number, ReviewFeedback[]>;
  scores: Record<number, number>; // Stage -> Score
  totalScore: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

