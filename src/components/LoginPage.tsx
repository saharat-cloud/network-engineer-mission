import React, { useState } from 'react';
import { User, Project } from '../types';
import { getStoredProjects, createNewProject } from '../services/projectStorage';
import { PRESET_TEACHER } from '../services/authService';
import { 
  Network, 
  GraduationCap, 
  ShieldCheck, 
  KeyRound, 
  ArrowRight, 
  AlertCircle
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: User, project?: Project) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [roleTab, setRoleTab] = useState<'student' | 'teacher'>('student');

  // Student Form Fields: ชื่อจริง-นามสกุล, ห้องเรียน, ชื่อผู้ใช้, รหัสผ่าน
  const [fullName, setFullName] = useState('');
  const [classroom, setClassroom] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Teacher states
  const [teacherUsername, setTeacherUsername] = useState('teacher');
  const [teacherPin, setTeacherPin] = useState('1234');
  const [teacherError, setTeacherError] = useState('');

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !classroom.trim() || !username.trim() || !password.trim()) {
      alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    const trimmedUser = username.trim().toLowerCase();
    const trimmedName = fullName.trim();
    const trimmedClass = classroom.trim();
    const existingProjects = getStoredProjects();

    // Find student's own project by studentId/username
    const myProject = existingProjects.find(
      (p) => p.studentId.toLowerCase() === trimmedUser
    );

    let targetProject: Project;

    if (myProject) {
      targetProject = myProject;
    } else {
      // Default to Scenario 1 if first time, student can also explore all 5 scenarios inside
      targetProject = createNewProject(
        1,
        trimmedUser,
        trimmedName,
        `ห้อง ${trimmedClass} - ${trimmedName}`
      );
    }

    const studentUser: User = {
      id: targetProject.studentId,
      name: targetProject.studentName,
      role: 'student',
      email: `${trimmedUser}@student.local`,
      groupName: targetProject.groupName
    };

    onLoginSuccess(studentUser, targetProject);
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
      setTeacherError('ชื่อผู้ใช้หรือรหัส PIN ไม่ถูกต้อง (ค่าเริ่มต้น: teacher / 1234)');
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
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl backdrop-blur-md">
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
          {/* STUDENT FORM: ชื่อจริง-นามสกุล, ห้องเรียน, ชื่อผู้ใช้, รหัสผ่าน */}
          {roleTab === 'student' && (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ชื่อจริง - นามสกุล *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="เช่น นายชานนท์ มั่นคง"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ห้องเรียน *
                </label>
                <input
                  type="text"
                  required
                  value={classroom}
                  onChange={(e) => setClassroom(e.target.value)}
                  placeholder="เช่น ม.4/1 หรือ ปวช.2 คอมพิวเตอร์"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ชื่อผู้ใช้ (Username) *
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="เช่น std6701 หรือ chanon_m"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  รหัสผ่าน (Password) *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>เข้าสู่ระบบเพื่อทำภารกิจ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TEACHER FORM */}
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
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
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
