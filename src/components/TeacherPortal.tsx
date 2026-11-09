import React, { useState } from 'react';
import { Project, Scenario, ReviewFeedback, MissionStatus } from '../types';
import { getStoredProjects, approveStage, requestRevisionStage } from '../services/projectStorage';
import { SCENARIOS, MISSIONS } from '../data/constants';
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  User, 
  Folder, 
  ArrowRight, 
  MessageSquare, 
  Star, 
  FileText, 
  ExternalLink,
  Printer,
  ChevronRight,
  Eye
} from 'lucide-react';

interface TeacherPortalProps {
  onSelectProjectForView: (project: Project) => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  onSelectProjectForView
}) => {
  const [projects, setProjects] = useState<Project[]>(getStoredProjects());
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [selectedStage, setSelectedStage] = useState<number>(1);

  // Review Input Form
  const [reviewScore, setReviewScore] = useState<number>(10);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const scenario = SCENARIOS.find((s) => s.id === activeProject?.scenarioId) || SCENARIOS[0];
  const missionInfo = MISSIONS.find((m) => m.id === selectedStage) || MISSIONS[0];

  const handleApprove = () => {
    if (!activeProject) return;
    const maxScore = missionInfo.points;
    const score = Math.min(maxScore, Math.max(0, Number(reviewScore || maxScore)));
    const updated = approveStage(
      activeProject.id,
      selectedStage,
      score,
      reviewComment || 'ผ่านเกณฑ์เรียบร้อย อนุญาตให้ดำเนินงานด่านถัดไป'
    );
    if (updated) {
      setProjects(getStoredProjects());
      setActionNotice(`อนุมัติผ่านด่าน ${selectedStage} สำเร็จ! ได้รับ ${score}/${maxScore} คะแนน`);
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const handleRequestRevision = () => {
    if (!activeProject) return;
    if (!reviewComment.trim()) {
      alert('กรุณาระบุความคิดเห็นและสิ่งที่ต้องการให้นักเรียนแก้ไขก่อนส่งกลับ');
      return;
    }
    const updated = requestRevisionStage(
      activeProject.id,
      selectedStage,
      reviewComment
    );
    if (updated) {
      setProjects(getStoredProjects());
      setActionNotice(`ส่งงานด่าน ${selectedStage} กลับให้นักเรียนแก้ไขเรียบร้อยแล้ว`);
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const getStatusBadge = (status: MissionStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">ผ่านแล้ว (COMPLETED)</span>;
      case 'SUBMITTED':
        return <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-300 animate-pulse">รอตรวจ (SUBMITTED)</span>;
      case 'REVISION':
        return <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded border border-rose-300">ส่งกลับแก้ไข (REVISION)</span>;
      case 'IN_PROGRESS':
        return <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-300">กำลังทำ</span>;
      default:
        return <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded">ล็อก (LOCKED)</span>;
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-amber-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
              <Shield className="w-3.5 h-3.5" />
              <span>TEACHER REVIEW PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ระบบครูตรวจงานและประเมินผลโครงการ
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              ตรวจสอบชิ้นงานรายด่าน • อนุมัติผ่านด่าน • สั่งแก้ไขงาน • ตัดเกรดคะแนน 100 คะแนนเต็ม
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์ใบประเมินผล</span>
            </button>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Project List (3 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                รายชื่อโครงการนักเรียน ({projects.length})
              </span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {projects.map((proj) => {
                const isSelected = proj.id === selectedProjectId;
                const completedCount = Object.values(proj.stageStatuses).filter((s) => s === 'COMPLETED').length;
                const hasPending = Object.values(proj.stageStatuses).some((s) => s === 'SUBMITTED');

                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setSelectedStage(proj.currentStage);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition text-xs space-y-2 ${
                      isSelected
                        ? 'bg-amber-50/50 border-amber-400 shadow-sm ring-1 ring-amber-400'
                        : 'bg-slate-50/80 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {proj.groupName}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          {proj.studentName} ({proj.studentId})
                        </div>
                      </div>
                      {hasPending && (
                        <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full animate-pulse">
                          มีงานรอตรวจ
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 pt-2">
                      <span>โจทย์ #{proj.scenarioId}</span>
                      <span className="font-mono font-semibold text-slate-700">
                        {completedCount}/7 ด่าน • {proj.totalScore} คะแนน
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 100-Point Grading Rubric Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-xs space-y-2.5">
            <span className="font-bold text-slate-900 block border-b pb-2">
              เกณฑ์การประเมิน 100 คะแนนเต็ม (Rubric)
            </span>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>1. วิเคราะห์ความต้องการลูกค้า</span>
                <span className="font-mono font-bold">10 คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>2. ออกแบบแผนผังเครือข่าย</span>
                <span className="font-mono font-bold">15 คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>3. เลือกอุปกรณ์และงบประมาณ</span>
                <span className="font-mono font-bold">15 คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>4. เลือกเครื่องมือและวัสดุ</span>
                <span className="font-mono font-bold">10 คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>5. วางแผนการติดตั้ง</span>
                <span className="font-mono font-bold">10 คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>6. อธิบายการตั้งค่า & ทดสอบ</span>
                <span className="font-mono font-bold">20 คะแนน</span>
              </div>
              <div className="flex justify-between">
                <span>7. สรุปโครงการและการส่งมอบ</span>
                <span className="font-mono font-bold">20 คะแนน</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 border-t pt-1.5">
                <span>รวมทั้งสิ้น</span>
                <span className="font-mono text-amber-600">100 คะแนน</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Stage Detail & Grading Controls (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeProject ? (
            <>
              {/* Project Title Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded">
                      โจทย์ที่ {scenario.id}: {scenario.title}
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                      {activeProject.groupName}
                    </h2>
                    <p className="text-xs text-slate-500">
                      หัวหน้าทีม: {activeProject.studentName} ({activeProject.studentId})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectProjectForView(activeProject)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>เปิดมุมมองนักเรียน (Student View)</span>
                    </button>
                  </div>
                </div>

                {/* 7 Stages Selector Pills */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    เลือกด่านที่ต้องการตรวจสอบและให้คะแนน:
                  </span>
                  <div className="grid grid-cols-7 gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                      const st = activeProject.stageStatuses[num];
                      const isSel = selectedStage === num;
                      const hasSubmitted = st === 'SUBMITTED';

                      return (
                        <button
                          key={num}
                          onClick={() => {
                            setSelectedStage(num);
                            setReviewScore(activeProject.scores[num] || MISSIONS[num - 1].points);
                            setReviewComment('');
                          }}
                          className={`p-2 rounded-xl text-center border transition relative ${
                            isSel
                              ? 'bg-amber-500 text-slate-950 font-extrabold border-amber-600 shadow-md'
                              : st === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : st === 'SUBMITTED'
                              ? 'bg-amber-100 text-amber-900 border-amber-400 animate-pulse'
                              : st === 'REVISION'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}
                        >
                          <div className="text-[10px] uppercase font-mono">Stage</div>
                          <div className="text-sm font-bold">{num}</div>
                          {hasSubmitted && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Stage Submissions Content Preview */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-600">
                      STAGE {missionInfo.number} : {missionInfo.titleEn}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      {missionInfo.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(activeProject.stageStatuses[selectedStage])}
                    <span className="text-xs font-bold text-slate-600">
                      คะแนนปัจจุบัน: {activeProject.scores[selectedStage] || 0} / {missionInfo.points}
                    </span>
                  </div>
                </div>

                {/* Dynamic Content Display based on selectedStage */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-3 max-h-[350px] overflow-y-auto">
                  {selectedStage === 1 && (
                    <div className="space-y-2">
                      <p><strong>วัตถุประสงค์การใช้งาน:</strong> {activeProject.data.m1_purpose || '(ยังไม่กรอก)'}</p>
                      <p><strong>ประเภทและจำนวนอุปกรณ์:</strong> {activeProject.data.m1_device_count || '(ยังไม่กรอก)'}</p>
                      <p><strong>ข้อจำกัดและสภาพแวดล้อม:</strong> {activeProject.data.m1_constraints || '(ยังไม่กรอก)'}</p>
                      <p><strong>ความต้องการด้านความปลอดภัย:</strong> {activeProject.data.m1_security || '(ยังไม่กรอก)'}</p>
                      <p><strong>สรุปแนวทางออกแบบ:</strong> {activeProject.data.m1_summary || '(ยังไม่กรอก)'}</p>
                    </div>
                  )}

                  {selectedStage === 2 && (
                    <div className="space-y-2">
                      <p><strong>แนวคิดการออกแบบแผนผัง:</strong> {activeProject.data.m2_concept_explanation || '(ยังไม่กรอก)'}</p>
                      <p><strong>จำนวนโหนดในแผนผัง:</strong> {activeProject.data.m2_nodes?.length || 0} โหนด, <strong>ลิงก์:</strong> {activeProject.data.m2_links?.length || 0} ลิงก์</p>
                      {activeProject.data.m2_uploaded_image_url && (
                        <div className="mt-2">
                          <span className="font-semibold block mb-1">ภาพแผนผังที่แนบ:</span>
                          <img src={activeProject.data.m2_uploaded_image_url} alt="Topology" className="max-h-48 rounded border border-slate-300" />
                        </div>
                      )}
                    </div>
                  )}

                  {selectedStage === 3 && (
                    <div className="space-y-2">
                      <p><strong>รายการอุปกรณ์ (BOM):</strong> {activeProject.data.m3_items?.length || 0} รายการ</p>
                      <ul className="list-disc pl-5 space-y-0.5">
                        {activeProject.data.m3_items?.map((it) => (
                          <li key={it.id}>
                            {it.name} ({it.brand} {it.model}) - {it.quantity} ตัว x ฿{it.unitPrice.toLocaleString()} = ฿{it.totalPrice.toLocaleString()}
                          </li>
                        ))}
                      </ul>
                      <p><strong>เหตุผลการเลือกอุปกรณ์:</strong> {activeProject.data.m3_selection_reason || '(ยังไม่กรอก)'}</p>
                    </div>
                  )}

                  {selectedStage === 4 && (
                    <div className="space-y-2">
                      <p><strong>เครื่องมือช่างและอุปกรณ์:</strong> {activeProject.data.m4_tools?.length || 0} รายการ</p>
                      <ul className="list-disc pl-5 space-y-0.5">
                        {activeProject.data.m4_tools?.map((t) => (
                          <li key={t.id}>
                            {t.name} ({t.quantity} ชิ้น) - วัตถุประสงค์: {t.purpose}
                          </li>
                        ))}
                      </ul>
                      <p><strong>ข้อควรระวังความปลอดภัย:</strong> {activeProject.data.m4_notes || '-'}</p>
                    </div>
                  )}

                  {selectedStage === 5 && (
                    <div className="space-y-2">
                      <p><strong>ขั้นตอนการติดตั้ง 7 เฟส:</strong> {activeProject.data.m5_steps?.length || 0} ขั้นตอน</p>
                      <div className="space-y-1">
                        {activeProject.data.m5_steps?.map((s) => (
                          <div key={s.id} className="p-1.5 bg-white rounded border border-slate-200">
                            <strong>{s.order}. {s.phase}:</strong> {s.description}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedStage === 6 && (
                    <div className="space-y-2">
                      <p><strong>SSID Wi-Fi:</strong> {activeProject.data.m6_wifi_ssid || '-'} (Security: {activeProject.data.m6_wifi_sec || '-'})</p>
                      <p><strong>VLAN:</strong> {activeProject.data.m6_vlan_setup || '-'}</p>
                      <p><strong>ผลการทดสอบ:</strong> {activeProject.data.m6_testing_result || '-'}</p>
                      <p><strong>ปัญหาและแนวทางแก้ไข:</strong> {activeProject.data.m6_issues_found || '-'} ➔ {activeProject.data.m6_solutions || '-'}</p>
                    </div>
                  )}

                  {selectedStage === 7 && (
                    <div className="space-y-2">
                      <p><strong>สรุปภาพรวมโครงการ:</strong> {activeProject.data.m7_final_concept_summary || '-'}</p>
                      <p><strong>ความท้าทายหลัก:</strong> {activeProject.data.m7_key_challenges || '-'}</p>
                      <p><strong>แผนการบำรุงรักษา:</strong> {activeProject.data.m7_maintenance_plan || '-'}</p>
                    </div>
                  )}
                </div>

                {/* Feedback History Log */}
                {activeProject.feedbackHistory[selectedStage]?.length > 0 && (
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      ประวัติการตรวจด่านนี้ ({activeProject.feedbackHistory[selectedStage].length} ครั้ง):
                    </span>
                    <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                      {activeProject.feedbackHistory[selectedStage].map((fb, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-lg border text-xs ${
                            fb.status === 'APPROVED'
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                              : 'bg-rose-50/60 border-rose-200 text-rose-950'
                          }`}
                        >
                          <div className="flex justify-between font-bold">
                            <span>{fb.status === 'APPROVED' ? '✓ อนุมัติผ่าน' : '⚠️ ส่งกลับแก้ไข'} (คะแนน: {fb.score})</span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              {new Date(fb.reviewedAt).toLocaleString('th-TH')}
                            </span>
                          </div>
                          <p className="mt-0.5">{fb.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reviewer Action Controls Box */}
              <div className="bg-white rounded-2xl border-2 border-amber-400/80 shadow-md p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Star className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900">
                    การตัดสินผลการตรวจและให้คะแนนด่าน {selectedStage}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ให้คะแนน (เต็ม {missionInfo.points}) *:
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={missionInfo.points}
                      value={reviewScore}
                      onChange={(e) => setReviewScore(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-mono font-bold text-center text-amber-700 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ข้อเสนอแนะ / ความคิดเห็นครูผู้ตรวจ *:
                    </label>
                    <textarea
                      rows={2}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="พิมพ์คำแนะนำให้นักเรียน เช่น จุดที่ทำได้ดี หรือข้อที่ต้องแก้ไขเพิ่มเติมก่อนผ่านด่าน..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleRequestRevision}
                    className="px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>ส่งกลับไปแก้ไข (Request Revision)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApprove}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/25 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>อนุมัติผ่านด่าน (Approve & Unlock Next)</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              ไม่พบข้อมูลโครงการ
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

