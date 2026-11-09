import React, { useState } from 'react';
import { User, Project } from '../types';
import { SCENARIOS } from '../data/constants';
import { getStoredProjects, createNewProject } from '../services/projectStorage';
import { PRESET_TEACHER } from '../services/authService';
import { 
  Network, 
  GraduationCap, 
  ShieldCheck, 
  KeyRound, 
  ArrowRight, 
  Sparkles, 
  FolderPlus,
  Lock,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: User, project?: Project) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [roleTab, setRoleTab] = useState<'student' | 'teacher'>('student');

  // Student states
  const [studentMode, setStudentMode] = useState<'existing' | 'new'>('existing');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentId, setNewStudentId] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newScenarioId, setNewScenarioId] = useState<number>(1);

  // Teacher states
  const [teacherUsername, setTeacherUsername] = useState('teacher');
  const [teacherPin, setTeacherPin] = useState('1234');
  const [teacherError, setTeacherError] = useState('');

  const existingProjects = getStoredProjects();

  const handleStudentLoginExisting = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = existingProjects.find((p) => p.id === selectedProjectId);
    if (!proj) {
      alert('กรุณาเลือกโครงการของกลุ่มคุณ');
      return;
    }
    const user: User = {
      id: proj.studentId,
      name: proj.studentName,
      role: 'student',
      email: `${proj.studentId.toLowerCase()}@school.ac.th`,
      groupName: proj.groupName
    };
    onLoginSuccess(user, proj);
  };

  const handleStudentCreateAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentId.trim()) {
      alert('กรุณากรอกชื่อและรหัสนักเรียน');
      return;
    }
    const newProj = createNewProject(
      newScenarioId,
      newStudentId.trim(),
      newStudentName.trim(),
      newGroupName.trim() || `ทีม ${newStudentName.trim()}`
    );
    const user: User = {
      id: newProj.studentId,
      name: newProj.studentName,
      role: 'student',
      email: `${newProj.studentId.toLowerCase()}@school.ac.th`,
      groupName: newProj.groupName
    };
    onLoginSuccess(user, newProj);
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (teacherUsername === PRESET_TEACHER.username || teacherUsername === 'admin') &&
      teacherPin === PRESET_TEACHER.pin
    ) {
      const user: User = {
        id: 'teacher-master',
        name: PRESET_TEACHER.name,
        role: 'teacher',
        email: PRESET_TEACHER.email
      };
      onLoginSuccess(user);
    } else {
      setTeacherError('ชื่อผู้ใช้หรือรหัสผ่าน PIN ไม่ถูกต้อง (ทดลองใช้: teacher / 1234)');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col items-center justify-center p-4">
      {/* Platform Logo */}
      <div className="text-center mb-6 space-y-2 animate-fadeIn">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/30 text-white">
          <Network className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider">
            NETWORK ENGINEER MISSION
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            ระบบฝึกวิเคราะห์ ออกแบบ และติดตั้งระบบเครือข่ายคอมพิวเตอร์
          </p>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl backdrop-blur-md">
        {/* Role Switching Tabs */}
        <div className="grid grid-cols-2 border-b border-slate-800 text-sm font-semibold">
          <button
            onClick={() => setRoleTab('student')}
            className={`py-4 text-center flex items-center justify-center gap-2 transition ${
              roleTab === 'student'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>เข้าสู่ระบบนักเรียน</span>
          </button>

          <button
            onClick={() => setRoleTab('teacher')}
            className={`py-4 text-center flex items-center justify-center gap-2 transition ${
              roleTab === 'teacher'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ระบบครูตรวจงาน (Teacher)</span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* STUDENT LOGIN FORM */}
          {roleTab === 'student' && (
            <div className="space-y-6">
              <div className="flex rounded-xl bg-slate-800/90 p-1 border border-slate-700/80 text-xs">
                <button
                  type="button"
                  onClick={() => setStudentMode('existing')}
                  className={`flex-1 py-2 rounded-lg font-medium transition ${
                    studentMode === 'existing'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  เลือกกลุ่มเดิมเพื่อทำต่อ ({existingProjects.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStudentMode('new')}
                  className={`flex-1 py-2 rounded-lg font-medium transition ${
                    studentMode === 'new'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  + สร้างกลุ่ม/โครงการใหม่
                </button>
              </div>

              {studentMode === 'existing' ? (
                <form onSubmit={handleStudentLoginExisting} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      เลือกชื่อกลุ่ม หรือโครงการที่กำลังทำอยู่:
                    </label>
                    {existingProjects.length > 0 ? (
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {existingProjects.map((p) => {
                          const isSel = selectedProjectId === p.id;
                          const completed = Object.values(p.stageStatuses).filter((s) => s === 'COMPLETED').length;
                          return (
                            <div
                              key={p.id}
                              onClick={() => setSelectedProjectId(p.id)}
                              className={`p-3 rounded-xl border cursor-pointer transition text-xs ${
                                isSel
                                  ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500'
                                  : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-750'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-sm">{p.groupName}</span>
                                <span className="text-[11px] bg-slate-900/80 px-2 py-0.5 rounded text-blue-300 font-mono">
                                  โจทย์ #{p.scenarioId}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-1 text-slate-400 text-[11px]">
                                <span>หัวหน้า: {p.studentName} ({p.studentId})</span>
                                <span className="text-emerald-400 font-semibold font-mono">
                                  {completed}/7 ด่าน • {p.totalScore} คะแนน
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-400 bg-slate-800/40 rounded-xl border border-slate-700">
                        ยังไม่มีโครงการในระบบ กรุณากดแถบ "สร้างกลุ่ม/โครงการใหม่" ด้านบน
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedProjectId}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <span>เข้าสู่หน้าทำภารกิจของกลุ่ม</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleStudentCreateAndLogin} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        ชื่อ-นามสกุล หัวหน้าทีม *
                      </label>
                      <input
                        type="text"
                        required
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        placeholder="เช่น นายชานนท์ มั่นคง"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        รหัสนักศึกษา / รหัสกลุ่ม *
                      </label>
                      <input
                        type="text"
                        required
                        value={newStudentId}
                        onChange={(e) => setNewStudentId(e.target.value)}
                        placeholder="เช่น STD-6701"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      ชื่อกลุ่ม / บริษัทรับเหมาไอทีจำลอง
                    </label>
                    <input
                      type="text"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="เช่น NextGen Network Integration Ltd."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      เลือกโจทย์ลูกค้าที่ได้รับมอบหมาย *
                    </label>
                    <select
                      value={newScenarioId}
                      onChange={(e) => setNewScenarioId(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
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
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>สร้างโครงการและเริ่มภารกิจด่าน 01</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TEACHER LOGIN FORM */}
          {roleTab === 'teacher' && (
            <form onSubmit={handleTeacherLogin} className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>พื้นที่เฉพาะอาจารย์ผู้สอน (Teacher Evaluation Portal)</span>
                </div>
                <p className="text-amber-200/80 leading-relaxed">
                  ล็อกอินเพื่อเข้าสู่ระบบตรวจคำตอบ แผนผัง ตารางราคา อนุมัติผ่านด่าน และตัดคะแนน
                </p>
                <div className="pt-1 text-[11px] text-amber-400 font-mono">
                  รหัสทดสอบ: Username: <strong>teacher</strong> / PIN: <strong>1234</strong>
                </div>
              </div>

              {teacherError && (
                <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{teacherError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ชื่อผู้ใช้งานอาจารย์ (Username)
                </label>
                <input
                  type="text"
                  required
                  value={teacherUsername}
                  onChange={(e) => setTeacherUsername(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  รหัสผ่าน / PIN ตรวจงาน
                </label>
                <input
                  type="password"
                  required
                  value={teacherPin}
                  onChange={(e) => setTeacherPin(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>เข้าสู่ Teacher Portal สำหรับตรวจงาน</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

