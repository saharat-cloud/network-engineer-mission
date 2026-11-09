import React, { useState } from 'react';
import { Project, Scenario } from '../types';
import { 
  ArrowLeft, 
  Send, 
  Award, 
  Printer, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Layers, 
  Calculator, 
  Wrench, 
  CalendarClock, 
  Sliders 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Stage07Props {
  project: Project;
  scenario: Scenario;
  onSave: (data: Partial<Project['data']>) => void;
  onSubmitProject: (data: Partial<Project['data']>) => void;
  onBackToMap: () => void;
}

export const Stage07Final: React.FC<Stage07Props> = ({
  project,
  scenario,
  onSave,
  onSubmitProject,
  onBackToMap
}) => {
  const currentStatus = project.stageStatuses[7];
  const isSubmittedOrDone = currentStatus === 'SUBMITTED' || currentStatus === 'COMPLETED' || project.isCompleted;

  const [conceptSummary, setConceptSummary] = useState<string>(
    project.data.m7_final_concept_summary ||
      'โครงการออกแบบและติดตั้งระบบเครือข่ายนี้ ตอบสนองความต้องการของลูกค้าได้อย่างครอบคลุม ทั้งความเสถียรของสัญญาณ LAN/Wi-Fi, การจัดสรรงบประมาณที่คุ้มค่า, และการวางโครงสร้างความปลอดภัยแบบแยกส่วน'
  );
  const [keyChallenges, setKeyChallenges] = useState<string>(
    project.data.m7_key_challenges ||
      'ความท้าทายหลักคือการคุมงบประมาณให้อยู่ในเกณฑ์ ขณะที่ต้องรองรับปริมาณผู้ใช้หนาแน่น จึงเลือกใช้ Managed Switch และ Wi-Fi 6 AP คุณภาพสูง พร้อมการจัดทำ VLAN'
  );
  const [maintenancePlan, setMaintenancePlan] = useState<string>(
    project.data.m7_maintenance_plan ||
      'แผนการบำรุงรักษา: 1. ตรวจสอบสถานะอุปกรณ์ผ่าน Cloud Dashboard ทุกสัปดาห์ 2. สำรองข้อมูล Config ทุกเดือน 3. อัปเดต Security Firmware ทุกไตรมาส'
  );
  const [futureExpansion, setFutureExpansion] = useState<string>(
    project.data.m7_future_expansion ||
      'ระบบรองรับการขยายตัวในอนาคต โดยสำรองพอร์ต Switch ไว้ 25% และสามารถเพิ่ม Access Point ในจุดอับสัญญาณได้ทันทีโดยไม่ต้องเปลี่ยน Gateway หลัก'
  );

  const [showCelebration, setShowCelebration] = useState(isSubmittedOrDone);

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conceptSummary.trim() || !keyChallenges.trim()) {
      alert('กรุณากรอกสรุปแนวคิดและความท้าทายของโครงการ');
      return;
    }

    // Trigger Confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    setShowCelebration(true);
    onSubmitProject({
      m7_final_concept_summary: conceptSummary,
      m7_key_challenges: keyChallenges,
      m7_maintenance_plan: maintenancePlan,
      m7_future_expansion: futureExpansion,
      m7_submitted_at: new Date().toISOString()
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const equipmentTotal = project.data.m3_items?.reduce((s, i) => s + (i.totalPrice || 0), 0) || 0;
  const projectTotal =
    equipmentTotal +
    Number(project.data.m3_cabling_cost || 0) +
    Number(project.data.m3_consumables_cost || 0) +
    Number(project.data.m3_extra_cost || 0);

  return (
    <div className="space-y-6 py-4">
      {/* Breadcrumb Bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMap}
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-600 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่แผนที่ภารกิจ</span>
          </button>
          <div className="text-xs text-slate-400">/</div>
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
            MISSION 07
          </span>
          <span className="text-sm font-bold text-slate-800">
            สรุปและส่งมอบโครงการ (Final Project Submission)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์รายงาน A4 / Export PDF</span>
          </button>
        </div>
      </div>

      {/* MISSION COMPLETED Celebration Banner */}
      {showCelebration && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 rounded-3xl p-8 text-white text-center space-y-3 shadow-xl animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/20 flex items-center justify-center text-white ring-4 ring-white/30">
            <Award className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            MISSION COMPLETED! ส่งมอบโครงการสำเร็จ
          </h2>
          <p className="text-sm text-emerald-100 max-w-xl mx-auto font-light">
            ยินดีด้วย! ทีม {project.groupName} ได้ผ่านบททดสอบภารกิจนักออกแบบและติดตั้งระบบเครือข่ายครบทั้ง 7 ด่านอย่างสมบูรณ์แบบ
          </p>
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold font-mono">
            คะแนนสะสมรวม: {project.totalScore} / 100 คะแนน
          </div>
        </div>
      )}

      {/* Complete Project Dossier (Printable A4 Style) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12 space-y-8 print:p-0 print:border-none print:shadow-none">
        {/* Report Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600">
              NETWORK DESIGN & INTEGRATION PROPOSAL REPORT
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
              รายงานข้อเสนอโครงการออกแบบและติดตั้งระบบเครือข่าย
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Ref ID: {project.id} • วันที่ส่งมอบ: {new Date().toLocaleDateString('th-TH')}
            </p>
          </div>

          <div className="sm:text-right text-xs space-y-1">
            <div className="font-bold text-slate-900">ผู้จัดทำ (System Integrator):</div>
            <div className="text-blue-700 font-bold text-sm">{project.groupName}</div>
            <div className="text-slate-600">หัวหน้าทีม: {project.studentName} ({project.studentId})</div>
            <div className="text-slate-500">อาจารย์ที่ปรึกษา: อ.กิตติศักดิ์ พูลสวัสดิ์</div>
          </div>
        </div>

        {/* 1. Client & Scenario Overview */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-l-4 border-blue-600 pl-3">
            1. ข้อมูลลูกค้าและความต้องการ (Client Requirement Summary)
          </h2>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-semibold text-slate-700 block">ชื่อลูกค้า / องค์กร:</span>
              <span className="text-slate-900">{scenario.clientName} ({scenario.location})</span>
              <span className="font-semibold text-slate-700 block mt-2">โจทย์ภารกิจ:</span>
              <span className="text-slate-900">{scenario.title} ({scenario.category})</span>
            </div>
            <div>
              <span className="font-semibold text-slate-700 block">งบประมาณที่ลูกค้ากำหนด:</span>
              <span className="font-mono font-bold text-emerald-700 text-sm">
                ฿{scenario.budgetEst.toLocaleString()}
              </span>
              <span className="font-semibold text-slate-700 block mt-2">ขอบเขตงาน:</span>
              <span className="text-slate-600">{scenario.situation}</span>
            </div>
          </div>
        </div>

        {/* 2. Analysis Summary */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-l-4 border-blue-600 pl-3">
            2. ผลการวิเคราะห์ระบบ (Mission 01 Synthesis)
          </h2>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <p><strong>วัตถุประสงค์หลัก:</strong> {project.data.m1_purpose || '-'}</p>
            <p><strong>จำนวนอุปกรณ์ปลายทาง:</strong> {project.data.m1_device_count || '-'}</p>
            <p><strong>ข้อจำกัดและพื้นที่:</strong> {project.data.m1_constraints || '-'}</p>
            <p><strong>นโยบายความปลอดภัย:</strong> {project.data.m1_security || '-'}</p>
            <p><strong>สรุปโครงสร้าง:</strong> {project.data.m1_summary || '-'}</p>
          </div>
        </div>

        {/* 3. Topology Overview */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-l-4 border-blue-600 pl-3">
            3. สถาปัตยกรรมและแผนผังเครือข่าย (Network Topology)
          </h2>
          <p className="text-xs text-slate-600">
            <strong>แนวคิดการเชื่อมต่อ:</strong> {project.data.m2_concept_explanation || '-'}
          </p>
          {project.data.m2_uploaded_image_url ? (
            <div className="border border-slate-200 rounded-xl p-2 bg-slate-50 text-center">
              <img
                src={project.data.m2_uploaded_image_url}
                alt="Topology"
                className="max-h-64 mx-auto rounded-lg"
              />
            </div>
          ) : (
            <div className="bg-slate-900 text-white p-4 rounded-xl text-xs font-mono space-y-1">
              <div className="text-blue-400 font-bold mb-2">สรุปโหนดในแผนผัง:</div>
              {project.data.m2_nodes?.map((n) => (
                <div key={n.id}>
                  • {n.label} [{n.type.toUpperCase()}] ➔ IP: {n.ip || 'DHCP'} ({n.notes || 'Normal'})
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Equipment & Budget */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-l-4 border-blue-600 pl-3">
            4. รายการอุปกรณ์และงบประมาณโครงการ (Bill of Materials & Budget)
          </h2>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="p-2.5">รายการอุปกรณ์</th>
                  <th className="p-2.5">แบรนด์/รุ่น</th>
                  <th className="p-2.5 text-center">จำนวน</th>
                  <th className="p-2.5 text-right">ราคา/หน่วย</th>
                  <th className="p-2.5 text-right">ราคารวม (฿)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {project.data.m3_items?.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2 font-medium">{item.name}</td>
                    <td className="p-2 text-slate-500">{item.brand} {item.model}</td>
                    <td className="p-2 text-center font-mono">{item.quantity}</td>
                    <td className="p-2 text-right font-mono">฿{item.unitPrice.toLocaleString()}</td>
                    <td className="p-2 text-right font-mono font-bold text-slate-800">
                      ฿{item.totalPrice.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50/70">
                  <td colSpan={4} className="p-2 text-right font-semibold">ค่าสายสัญญาณและท่อร้อย:</td>
                  <td className="p-2 text-right font-mono font-bold">
                    ฿{Number(project.data.m3_cabling_cost || 0).toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-slate-50/70">
                  <td colSpan={4} className="p-2 text-right font-semibold">ค่าวัสดุสิ้นเปลือง:</td>
                  <td className="p-2 text-right font-mono font-bold">
                    ฿{Number(project.data.m3_consumables_cost || 0).toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-slate-50/70">
                  <td colSpan={4} className="p-2 text-right font-semibold">ค่าใช้จ่ายเพิ่มเติม:</td>
                  <td className="p-2 text-right font-mono font-bold">
                    ฿{Number(project.data.m3_extra_cost || 0).toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-blue-50 font-bold text-blue-950">
                  <td colSpan={4} className="p-2.5 text-right">ยอดรวมสุทธิทั้งสิ้น (Grand Total):</td>
                  <td className="p-2.5 text-right font-mono text-sm text-blue-700">
                    ฿{projectTotal.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500">
            <strong>เหตุผลการเลือกอุปกรณ์:</strong> {project.data.m3_selection_reason || '-'}
          </p>
        </div>

        {/* 5. Configuration & Testing */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-l-4 border-blue-600 pl-3">
            5. รายละเอียดการตั้งค่าและผลการทดสอบ (Config & Test Summary)
          </h2>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="font-bold text-slate-800 block mb-1">Wi-Fi & Security:</span>
              <div>SSID: {project.data.m6_wifi_ssid || '-'}</div>
              <div>Security: {project.data.m6_wifi_sec || '-'}</div>
              <div>Client Isolation: {project.data.m6_wifi_isolation ? 'Enabled' : 'Disabled'}</div>
            </div>
            <div>
              <span className="font-bold text-slate-800 block mb-1">ผลการทดสอบ Throughput:</span>
              <div className="whitespace-pre-line text-slate-700">
                {project.data.m6_testing_result || 'Ping OK, Throughput Verified'}
              </div>
            </div>
          </div>
        </div>

        {/* 6. Executive Summary & Future Plan Form */}
        <form onSubmit={handleFinalSubmit} className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-l-4 border-blue-600 pl-3">
            6. บทสรุปผู้บริหารและการส่งมอบ (Executive Handover Notes)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                สรุปแนวคิดภาพรวมและความสำเร็จของโครงการ *
              </label>
              <textarea
                rows={3}
                required
                disabled={isSubmittedOrDone}
                value={conceptSummary}
                onChange={(e) => setConceptSummary(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ปัญหาความท้าทายและแนวทางแก้ปัญหา *
              </label>
              <textarea
                rows={3}
                required
                disabled={isSubmittedOrDone}
                value={keyChallenges}
                onChange={(e) => setKeyChallenges(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                แผนการบำรุงรักษาและการสนับสนุนหลังติดตั้ง (SLA & Maintenance)
              </label>
              <textarea
                rows={3}
                disabled={isSubmittedOrDone}
                value={maintenancePlan}
                onChange={(e) => setMaintenancePlan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ข้อเสนอแนะสำหรับการขยายระบบในอนาคต (Scalability Plan)
              </label>
              <textarea
                rows={3}
                disabled={isSubmittedOrDone}
                value={futureExpansion}
                onChange={(e) => setFutureExpansion(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Submission Bar */}
          <div className="no-print pt-6 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBackToMap}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
            >
              กลับหน้าแผนที่
            </button>

            {!isSubmittedOrDone ? (
              <button
                type="submit"
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>ส่งมอบโครงการขั้นสุดท้าย (Final Project Handover)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>โครงการนี้ได้รับการส่งมอบเรียบร้อยแล้ว</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

