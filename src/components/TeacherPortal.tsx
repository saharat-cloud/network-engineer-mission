import React, { useState } from 'react';
import { Project, Scenario, ReviewFeedback, MissionStatus, ItemEvaluation } from '../types';
import { getStoredProjects, approveStage, requestRevisionStage, updateProject } from '../services/projectStorage';
import { getTeacherProfile, TeacherProfile } from '../services/authService';
import { SCENARIOS, MISSIONS } from '../data/constants';
import { TeacherProfileModal } from './TeacherProfileModal';
import { AddStudentModal } from './AddStudentModal';
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
  Printer, 
  Eye, 
  UserPlus, 
  UserCheck, 
  Bell, 
  Check, 
  X, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

interface TeacherPortalProps {
  onSelectProjectForView: (project: Project) => void;
  onTeacherProfileUpdated?: (updatedTeacher: TeacherProfile) => void;
  teacherProfile?: TeacherProfile;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  onSelectProjectForView,
  onTeacherProfileUpdated,
  teacherProfile: propTeacherProfile
}) => {
  const [projects, setProjects] = useState<Project[]>(getStoredProjects());
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    // Priority: Select project that is SUBMITTED
    const pending = getStoredProjects().find(p => Object.values(p.stageStatuses).some(s => s === 'SUBMITTED'));
    return pending ? pending.id : (getStoredProjects()[0]?.id || '');
  });
  const [selectedStage, setSelectedStage] = useState<number>(1);

  // Tabs for Project List: 'pending' (งานรอตรวจ) | 'all' (ทั้งหมด)
  const [projectFilterTab, setProjectFilterTab] = useState<'pending' | 'all'>('pending');

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [localTeacherProfile, setLocalTeacherProfile] = useState<TeacherProfile>(getTeacherProfile());

  // Active teacher profile (prop has precedence, fallback to local)
  const teacherProfile = propTeacherProfile || localTeacherProfile;

  // Review & Grading Inputs
  const [reviewScore, setReviewScore] = useState<number>(10);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const scenario = SCENARIOS.find((s) => s.id === activeProject?.scenarioId) || SCENARIOS[0];
  const missionInfo = MISSIONS.find((m) => m.id === selectedStage) || MISSIONS[0];

  // Refresh projects from storage
  const reloadProjects = () => {
    setProjects(getStoredProjects());
  };

  // Filter projects
  const pendingProjects = projects.filter((p) =>
    Object.values(p.stageStatuses).some((s) => s === 'SUBMITTED')
  );

  const displayedProjects = projectFilterTab === 'pending' ? pendingProjects : projects;

  // Itemized Evaluation helper for Mission 1
  const handleItemEvalChange = (qKey: string, status: 'PASS' | 'REVISE' | 'FAIL', comment: string) => {
    if (!activeProject) return;
    const currentM1Eval = activeProject.data.m1_eval || {};
    const updatedM1Eval = {
      ...currentM1Eval,
      [qKey]: { status, comment }
    };
    const updatedProj: Project = {
      ...activeProject,
      data: {
        ...activeProject.data,
        m1_eval: updatedM1Eval
      }
    };
    updateProject(updatedProj);
    setProjects(getStoredProjects());
  };

  const handleApprove = () => {
    if (!activeProject) return;
    const maxScore = missionInfo.points;
    const score = Math.min(maxScore, Math.max(0, Number(reviewScore || maxScore)));
    const updated = approveStage(
      activeProject.id,
      selectedStage,
      score,
      reviewComment || 'ผ่านเกณฑ์เรียบร้อย อนุญาตให้ดำเนินงานด่านถัดไป',
      teacherProfile.name
    );
    if (updated) {
      reloadProjects();
      setActionNotice(`✓ อนุมัติผ่านด่าน ${selectedStage} สำเร็จ! ได้รับ ${score}/${maxScore} คะแนน`);
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
      reviewComment,
      teacherProfile.name
    );
    if (updated) {
      reloadProjects();
      setActionNotice(`⚠️ ส่งงานด่าน ${selectedStage} กลับให้นักเรียนแก้ไขเรียบร้อยแล้ว`);
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
      {/* Top Banner with Teacher Profile & Add Student Button */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-amber-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
              <Shield className="w-3.5 h-3.5" />
              <span>TEACHER EVALUATION & CLASSROOM PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ระบบครูตรวจงานและจัดการชั้นเรียน
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              อาจารย์ผู้ตรวจ: <span className="text-amber-400 font-bold">{teacherProfile.name}</span> ({teacherProfile.schoolName})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ เพิ่มนักเรียน</span>
            </button>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>ตั้งค่าโปรไฟล์ครู</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์ใบประเมิน</span>
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
        {/* Left: Project List with Tabs (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            {/* Filter Tabs: Pending vs All */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                onClick={() => setProjectFilterTab('pending')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  projectFilterTab === 'pending'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>งานรอตรวจ ({pendingProjects.length})</span>
              </button>
              <button
                onClick={() => setProjectFilterTab('all')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  projectFilterTab === 'all'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>โครงการทั้งหมด ({projects.length})</span>
              </button>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {displayedProjects.length > 0 ? (
                displayedProjects.map((proj) => {
                  const isSelected = proj.id === selectedProjectId;
                  const completedCount = Object.values(proj.stageStatuses).filter((s) => s === 'COMPLETED').length;
                  const hasPending = Object.values(proj.stageStatuses).some((s) => s === 'SUBMITTED');

                  return (
                    <div
                      key={proj.id}
                      onClick={() => {
                        setSelectedProjectId(proj.id);
                        const pendingStage = Object.entries(proj.stageStatuses).find(([_, st]) => st === 'SUBMITTED');
                        if (pendingStage) {
                          setSelectedStage(Number(pendingStage[0]));
                        } else {
                          setSelectedStage(proj.currentStage);
                        }
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition text-xs space-y-2 ${
                        isSelected
                          ? 'bg-amber-50/60 border-amber-400 shadow-sm ring-2 ring-amber-400/40'
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
                            ส่งงานรอตรวจ
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 pt-2 font-mono">
                        <span>โจทย์ #{proj.scenarioId}</span>
                        <span className="font-semibold text-slate-700">
                          {completedCount}/7 ด่าน • {proj.totalScore} คะแนน
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  {projectFilterTab === 'pending'
                    ? '🎉 ไม่มีงานค้างตรวจในขณะนี้ ทุกกลุ่มผ่านการตรวจหมดแล้ว'
                    : 'ไม่พบรายชื่อโครงการ'}
                </div>
              )}
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

        {/* Right: Inspection, Itemized Review & Grading (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeProject ? (
            <>
              {/* Project Header Bar */}
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
                      นักเรียน: <span className="font-semibold text-slate-800">{activeProject.studentName}</span> (Username: {activeProject.studentId})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectProjectForView(activeProject)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition cursor-pointer"
                      title="เข้าดูแบบหน้าจอนักเรียน"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>เปิดมุมมองนักเรียน (Student View)</span>
                    </button>
                  </div>
                </div>

                {/* 7 Stages Selector Pills */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    เลือกด่านที่ต้องการตรวจสอบรายข้อและให้คะแนน:
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
                          className={`p-2 rounded-xl text-center border transition relative cursor-pointer ${
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
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white animate-ping"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* STAGE DETAILED INSPECTION (มุมมองเดียวกับนักเรียน พร้อมตรวจรายข้อ) */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
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
                      คะแนน: {activeProject.scores[selectedStage] || 0} / {missionInfo.points}
                    </span>
                  </div>
                </div>

                {/* STAGE 01 ITEM-BY-ITEM EVALUATION */}
                {selectedStage === 1 && (
                  <div className="space-y-4 text-xs">
                    <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200 text-slate-700">
                      💡 <strong>โหมดตรวจคำตอบรายข้อ:</strong> ครูสามารถคลิกเลือกสถานะ (ผ่าน / ต้องแก้ไข / ไม่ผ่าน) และพิมพ์คอมเมนต์ในแต่ละข้อได้โดยตรง
                    </div>

                    {/* Question 1 */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">
                          1. วัตถุประสงค์การใช้งานระบบเครือข่ายของลูกค้า:
                        </span>
                        <div className="flex items-center gap-1.5">
                          {(['PASS', 'REVISE', 'FAIL'] as const).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleItemEvalChange('q1', st, activeProject.data.m1_eval?.q1?.comment || '')}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                                activeProject.data.m1_eval?.q1?.status === st
                                  ? st === 'PASS' ? 'bg-emerald-600 text-white' : st === 'REVISE' ? 'bg-amber-500 text-slate-950' : 'bg-rose-600 text-white'
                                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                              }`}
                            >
                              {st === 'PASS' ? '✓ ผ่าน' : st === 'REVISE' ? '⚠️ แก้ไข' : '✕ ไม่ผ่าน'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-900">
                        {activeProject.data.m1_purpose || <span className="text-slate-400 italic">นักเรียนยังไม่ตอบ</span>}
                      </div>
                    </div>

                    {/* Question 2 & 3 */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">
                          2 & 3. ประเภทและจำนวนอุปกรณ์ปลายทาง (Endpoints):
                        </span>
                        <div className="flex items-center gap-1.5">
                          {(['PASS', 'REVISE', 'FAIL'] as const).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleItemEvalChange('q2', st, activeProject.data.m1_eval?.q2?.comment || '')}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                                activeProject.data.m1_eval?.q2?.status === st
                                  ? st === 'PASS' ? 'bg-emerald-600 text-white' : st === 'REVISE' ? 'bg-amber-500 text-slate-950' : 'bg-rose-600 text-white'
                                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                              }`}
                            >
                              {st === 'PASS' ? '✓ ผ่าน' : st === 'REVISE' ? '⚠️ แก้ไข' : '✕ ไม่ผ่าน'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 space-y-1">
                        <div><strong>ประเภท:</strong> {activeProject.data.m1_device_types || '-'}</div>
                        <div><strong>จำนวนรวม:</strong> {activeProject.data.m1_device_count || '-'}</div>
                      </div>
                    </div>

                    {/* Question 4 & 5 */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">
                          4 & 5. พื้นที่ติดตั้งและข้อจำกัด/ระยะทาง:
                        </span>
                        <div className="flex items-center gap-1.5">
                          {(['PASS', 'REVISE', 'FAIL'] as const).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleItemEvalChange('q4', st, activeProject.data.m1_eval?.q4?.comment || '')}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                                activeProject.data.m1_eval?.q4?.status === st
                                  ? st === 'PASS' ? 'bg-emerald-600 text-white' : st === 'REVISE' ? 'bg-amber-500 text-slate-950' : 'bg-rose-600 text-white'
                                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                              }`}
                            >
                              {st === 'PASS' ? '✓ ผ่าน' : st === 'REVISE' ? '⚠️ แก้ไข' : '✕ ไม่ผ่าน'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 space-y-1">
                        <div><strong>จุดติดตั้ง:</strong> {activeProject.data.m1_locations || '-'}</div>
                        <div><strong>ข้อจำกัด:</strong> {activeProject.data.m1_constraints || '-'}</div>
                      </div>
                    </div>

                    {/* Question 6 & 7 */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">
                          6 & 7. ปริมาณการใช้งานและความปลอดภัยเครือข่าย:
                        </span>
                        <div className="flex items-center gap-1.5">
                          {(['PASS', 'REVISE', 'FAIL'] as const).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleItemEvalChange('q6', st, activeProject.data.m1_eval?.q6?.comment || '')}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                                activeProject.data.m1_eval?.q6?.status === st
                                  ? st === 'PASS' ? 'bg-emerald-600 text-white' : st === 'REVISE' ? 'bg-amber-500 text-slate-950' : 'bg-rose-600 text-white'
                                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                              }`}
                            >
                              {st === 'PASS' ? '✓ ผ่าน' : st === 'REVISE' ? '⚠️ แก้ไข' : '✕ ไม่ผ่าน'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 space-y-1">
                        <div><strong>Concurrent/Throughput:</strong> {activeProject.data.m1_scalability || '-'}</div>
                        <div><strong>Security Policies:</strong> {activeProject.data.m1_security || '-'}</div>
                      </div>
                    </div>

                    {/* Question 8 */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">
                          8. สรุปแนวทางการออกแบบเบื้องต้น:
                        </span>
                        <div className="flex items-center gap-1.5">
                          {(['PASS', 'REVISE', 'FAIL'] as const).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleItemEvalChange('q8', st, activeProject.data.m1_eval?.q8?.comment || '')}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                                activeProject.data.m1_eval?.q8?.status === st
                                  ? st === 'PASS' ? 'bg-emerald-600 text-white' : st === 'REVISE' ? 'bg-amber-500 text-slate-950' : 'bg-rose-600 text-white'
                                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                              }`}
                            >
                              {st === 'PASS' ? '✓ ผ่าน' : st === 'REVISE' ? '⚠️ แก้ไข' : '✕ ไม่ผ่าน'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-900">
                        {activeProject.data.m1_summary || <span className="text-slate-400 italic">นักเรียนยังไม่ตอบ</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* STAGE 02 DETAILED INSPECTION */}
                {selectedStage === 2 && (
                  <div className="space-y-3 text-xs">
                    <p><strong>แนวคิดการออกแบบแผนผัง:</strong> {activeProject.data.m2_concept_explanation || '(ยังไม่กรอก)'}</p>
                    {activeProject.data.m2_uploaded_image_url ? (
                      <div>
                        <span className="font-semibold block mb-1">ภาพแผนผังที่นักเรียนแนบ:</span>
                        <img src={activeProject.data.m2_uploaded_image_url} alt="Topology" className="max-h-60 rounded border border-slate-300 mx-auto" />
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-900 text-white rounded-xl font-mono text-[11px] space-y-1">
                        <div className="text-blue-400 font-bold mb-1">อุปกรณ์และโหนดในแผนผัง ({activeProject.data.m2_nodes?.length || 0} โหนด):</div>
                        {activeProject.data.m2_nodes?.map((n) => (
                          <div key={n.id}>• {n.label} [{n.type}] ➔ IP: {n.ip || 'DHCP'} ({n.notes || 'Normal'})</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* STAGE 03 DETAILED INSPECTION */}
                {selectedStage === 3 && (
                  <div className="space-y-3 text-xs">
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 font-bold text-slate-700">
                          <tr>
                            <th className="p-2">ชื่ออุปกรณ์</th>
                            <th className="p-2">แบรนด์/รุ่น</th>
                            <th className="p-2 text-center">จำนวน</th>
                            <th className="p-2 text-right">ราคา/หน่วย</th>
                            <th className="p-2 text-right">ราคารวม</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeProject.data.m3_items?.map((it) => (
                            <tr key={it.id}>
                              <td className="p-2 font-medium">{it.name}</td>
                              <td className="p-2 text-slate-500">{it.brand} {it.model}</td>
                              <td className="p-2 text-center font-mono">{it.quantity}</td>
                              <td className="p-2 text-right font-mono">฿{it.unitPrice.toLocaleString()}</td>
                              <td className="p-2 text-right font-mono font-bold">฿{it.totalPrice.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p><strong>เหตุผลการเลือกอุปกรณ์:</strong> {activeProject.data.m3_selection_reason || '-'}</p>
                  </div>
                )}

                {/* STAGE 04 DETAILED INSPECTION */}
                {selectedStage === 4 && (
                  <div className="space-y-2 text-xs">
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 font-bold text-slate-700">
                          <tr>
                            <th className="p-2">เครื่องมือ</th>
                            <th className="p-2 text-center">จำนวน</th>
                            <th className="p-2">วัตถุประสงค์</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeProject.data.m4_tools?.map((t) => (
                            <tr key={t.id}>
                              <td className="p-2 font-medium">{t.name}</td>
                              <td className="p-2 text-center font-mono">{t.quantity}</td>
                              <td className="p-2">{t.purpose}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p><strong>ความปลอดภัย:</strong> {activeProject.data.m4_notes || '-'}</p>
                  </div>
                )}

                {/* STAGE 05 DETAILED INSPECTION */}
                {selectedStage === 5 && (
                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-slate-800">ขั้นตอนการติดตั้ง 7 เฟสที่นักเรียนวางไว้:</span>
                    <div className="space-y-1.5">
                      {activeProject.data.m5_steps?.map((s) => (
                        <div key={s.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                          <strong>{s.order}. {s.phase}:</strong> {s.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STAGE 06 DETAILED INSPECTION */}
                {selectedStage === 6 && (
                  <div className="space-y-2 text-xs font-mono">
                    <p><strong>SSID Wi-Fi:</strong> {activeProject.data.m6_wifi_ssid || '-'} (Security: {activeProject.data.m6_wifi_sec || '-'})</p>
                    <p><strong>VLAN:</strong> {activeProject.data.m6_vlan_setup || '-'}</p>
                    <p><strong>ผลการทดสอบ:</strong> {activeProject.data.m6_testing_result || '-'}</p>
                    <p><strong>ปัญหา & แก้ไข:</strong> {activeProject.data.m6_issues_found || '-'} ➔ {activeProject.data.m6_solutions || '-'}</p>
                  </div>
                )}

                {/* STAGE 07 DETAILED INSPECTION */}
                {selectedStage === 7 && (
                  <div className="space-y-2 text-xs">
                    <p><strong>สรุปภาพรวมโครงการ:</strong> {activeProject.data.m7_final_concept_summary || '-'}</p>
                    <p><strong>ความท้าทายหลัก:</strong> {activeProject.data.m7_key_challenges || '-'}</p>
                    <p><strong>แผนการบำรุงรักษา:</strong> {activeProject.data.m7_maintenance_plan || '-'}</p>
                  </div>
                )}

                {/* Feedback History Log */}
                {activeProject.feedbackHistory[selectedStage]?.length > 0 && (
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      ประวัติการตรวจด่านนี้ ({activeProject.feedbackHistory[selectedStage].length} ครั้ง):
                    </span>
                    <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1 text-xs">
                      {activeProject.feedbackHistory[selectedStage].map((fb, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-lg border ${
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

              {/* REVIEWER DECISION & COMMENT CONTROL BOX */}
              <div className="bg-white rounded-2xl border-2 border-amber-400 shadow-md p-6 space-y-4">
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
                      คอมเมนต์ข้อเสนอแนะ / แจ้งจุดที่ต้องแก้ไข *:
                    </label>
                    <textarea
                      rows={2}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="พิมพ์ข้อความแจ้งนักเรียน เช่น ตรวจสอบแล้วถูกต้องครบถ้วน หรือ ให้ไปแก้ไขข้อ 4 เพิ่มเติม..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleRequestRevision}
                    className="px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>ส่งกลับไปแก้ไข (Request Revision)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApprove}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/25 flex items-center gap-2 cursor-pointer"
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

      {/* Teacher Profile Settings Modal */}
      <TeacherProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(updated) => {
          setLocalTeacherProfile(updated);
          if (onTeacherProfileUpdated) {
            onTeacherProfileUpdated(updated);
          }
        }}
      />

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onStudentAdded={(newProj) => {
          reloadProjects();
          setSelectedProjectId(newProj.id);
          setActionNotice(`✓ เพิ่มนักเรียน ${newProj.studentName} เข้าสู่ระบบเรียบร้อยแล้ว!`);
          setTimeout(() => setActionNotice(null), 3000);
        }}
      />
    </div>
  );
};
