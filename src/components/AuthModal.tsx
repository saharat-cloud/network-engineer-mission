import React, { useState } from 'react';
import { User, Project } from '../types';
import { UserCheck, Shield, GraduationCap, ArrowRight, Sparkles, FolderPlus } from 'lucide-react';
import { getStoredProjects, createNewProject } from '../services/projectStorage';
import { SCENARIOS } from '../data/constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSelectUser: (user: User) => void;
  onSelectProject: (proj: Project) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  onSelectProject
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [groupName, setGroupName] = useState('');
  const [selectedScenarioId, setSelectedScenarioId] = useState<number>(1);

  const existingProjects = getStoredProjects();

  const handleQuickStudentLogin = (proj: Project) => {
    const studentUser: User = {
      id: proj.studentId,
      name: proj.studentName,
      role: 'student',
      email: `${proj.studentId.toLowerCase()}@school.ac.th`,
      groupName: proj.groupName
    };
    onSelectUser(studentUser);
    onSelectProject(proj);
    onClose();
  };

  const handleCreateNewStudentProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentId.trim()) return;

    const newProj = createNewProject(
      selectedScenarioId,
      studentId.trim(),
      studentName.trim(),
      groupName.trim() || `ทีม ${studentName.trim()}`
    );

    const studentUser: User = {
      id: newProj.studentId,
      name: newProj.studentName,
      role: 'student',
      email: `${newProj.studentId.toLowerCase()}@school.ac.th`,
      groupName: newProj.groupName
    };

    onSelectUser(studentUser);
    onSelectProject(newProj);
    onClose();
  };

  const handleTeacherLogin = () => {
    const teacherUser: User = {
      id: 'teacher-01',
      name: 'อ.กิตติศักดิ์ พูลสวัสดิ์',
      role: 'teacher',
      email: 'kittisak.p@school.ac.th'
    };
    onSelectUser(teacherUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl text-white">
        {/* Header Tabs */}
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('student')}
            className={`flex-1 py-4 text-center font-medium flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'student'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span>นักเรียน (Student Portal)</span>
          </button>
          <button
            onClick={() => setActiveTab('teacher')}
            className={`flex-1 py-4 text-center font-medium flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'teacher'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span>ครูผู้สอน (Teacher Portal)</span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'student' ? (
            <div className="space-y-6">
              {/* Existing projects list */}
              {existingProjects.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                    เลือกโครงการที่มีอยู่แล้ว เพื่อทำงานต่อ:
                  </h4>
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {existingProjects.map((proj) => {
                      const completedStages = Object.values(proj.stageStatuses).filter(s => s === 'COMPLETED').length;
                      return (
                        <div
                          key={proj.id}
                          onClick={() => handleQuickStudentLogin(proj)}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 hover:border-blue-500/50 cursor-pointer transition"
                        >
                          <div>
                            <div className="text-sm font-semibold text-white flex items-center gap-2">
                              <span>{proj.groupName}</span>
                              <span className="text-xs text-blue-400 font-normal">({proj.studentName})</span>
                            </div>
                            <div className="text-xs text-slate-400">
                              โจทย์ #{proj.scenarioId} • ความคืบหน้า {completedStages}/7 ด่าน • คะแนนสะสม {proj.totalScore}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs bg-blue-600/20 text-blue-300 px-2.5 py-1 rounded-lg border border-blue-500/30">
                            <span>เข้าทำต่อ</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Create new project form */}
              <div className="border-t border-slate-800 pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <FolderPlus className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-semibold text-white">หรือสร้างโครงการใหม่ (New Mission)</h4>
                </div>
                <form onSubmit={handleCreateNewStudentProject} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">ชื่อ-นามสกุล นักเรียน *</label>
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="เช่น นายชานนท์ มั่นคง"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">รหัสนักเรียน / รหัสกลุ่ม *</label>
                      <input
                        type="text"
                        required
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="เช่น STD-6701"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">ชื่อทีม / บริษัทจำลอง</label>
                    <input
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="เช่น NextGen Network Integration Ltd."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">เลือกโจทย์ลูกค้าเริ่มต้น *</label>
                    <select
                      value={selectedScenarioId}
                      onChange={(e) => setSelectedScenarioId(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      {SCENARIOS.map((sc) => (
                        <option key={sc.id} value={sc.id}>
                          โจทย์ {sc.id}: {sc.title} ({sc.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>เริ่มโครงการและเข้าสู่ Mission 01</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">เข้าสู่ระบบครูผู้สอน / ผู้ตรวจการประเมิน</h3>
                <p className="text-sm text-slate-400 mt-1">
                  ระบบตรวจงาน อนุมัติผ่านด่าน ส่งกลับแก้ไข ให้คะแนนรายด่าน และดูรายงานรวม
                </p>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-left text-xs space-y-1.5 text-slate-300">
                <div className="font-semibold text-amber-400">สิทธิ์สำหรับครูผู้สอน:</div>
                <div>• ตรวจสอบคำตอบ ไฟล์ และแผนผังเครือข่ายของนักเรียนทุกกลุ่ม</div>
                <div>• อนุมัติการผ่านด่านเพื่อปลดล็อกด่านถัดไปให้นักเรียน</div>
                <div>• ส่งงานกลับไปให้นักเรียนแก้ไข พร้อมพิมพ์ข้อเสนอแนะ</div>
                <div>• ประเมินคะแนนตาม Rubric 100 คะแนนเต็ม</div>
              </div>

              <button
                onClick={handleTeacherLogin}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                <UserCheck className="w-5 h-5" />
                <span>เข้าสู่ Teacher Portal (อ.กิตติศักดิ์)</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer close */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

