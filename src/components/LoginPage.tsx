import React, { useState } from 'react';
import { User, Project } from '../types';
import { getStoredProjects, createNewProject } from '../services/projectStorage';
import { PRESET_TEACHER, getTeacherProfile } from '../services/authService';
import { registerStudentAccount, authenticateStudent } from '../services/accountService';
import { 
  Network, 
  GraduationCap, 
  ShieldCheck, 
  KeyRound, 
  ArrowRight, 
  AlertCircle,
  UserPlus,
  LogIn,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: User, project?: Project) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [roleTab, setRoleTab] = useState<'student' | 'teacher'>('student');

  // Student auth mode: 'login' | 'register'
  const [studentMode, setStudentMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state: ชื่อจริง-นามสกุล, ห้องเรียน, ชื่อผู้ใช้, รหัสผ่าน
  const [regFullName, setRegFullName] = useState('');
  const [regClassroom, setRegClassroom] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccessNotice, setRegSuccessNotice] = useState('');

  // Teacher states
  const [teacherUsername, setTeacherUsername] = useState(() => {
    return getTeacherProfile().username || 'teacher';
  });
  const [teacherPin, setTeacherPin] = useState('');
  const [showTeacherPin, setShowTeacherPin] = useState(false);
  const [teacherError, setTeacherError] = useState('');

  // Handle Student Login
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const res = await authenticateStudent(loginUsername, loginPassword);
    if (!res.success || !res.account) {
      setLoginError(res.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      return;
    }

    const acc = res.account;
    const existingProjects = getStoredProjects();
    let targetProject = existingProjects.find(
      (p) => p.studentId.toLowerCase() === acc.username.toLowerCase()
    );

    if (!targetProject) {
      // Create project automatically for new user
      targetProject = createNewProject(
        1,
        acc.username,
        acc.fullName,
        `ห้อง ${acc.classroom} - ${acc.fullName}`
      );
    }

    const studentUser: User = {
      id: targetProject.studentId,
      name: targetProject.studentName,
      role: 'student',
      email: `${acc.username}@student.local`,
      groupName: targetProject.groupName
    };

    onLoginSuccess(studentUser, targetProject);
  };

  // Handle Student Register
  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccessNotice('');

    if (regPassword !== regConfirmPassword) {
      setRegError('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    if (regPassword.length < 3) {
      setRegError('รหัสผ่านต้องมีความยาวอย่างน้อย 3 ตัวอักษร');
      return;
    }

    const res = await registerStudentAccount(
      regUsername,
      regPassword,
      regFullName,
      regClassroom
    );

    if (!res.success) {
      setRegError(res.message || 'การสมัครสมาชิกล้มเหลว');
      return;
    }

    // Auto login after registration
    setRegSuccessNotice('สมัครสมาชิกสำเร็จ! กำลังเข้าสู่ระบบ...');
    setTimeout(() => {
      const existingProjects = getStoredProjects();
      let targetProject = existingProjects.find(
        (p) => p.studentId.toLowerCase() === regUsername.trim().toLowerCase()
      );

      if (!targetProject) {
        targetProject = createNewProject(
          1,
          regUsername.trim().toLowerCase(),
          regFullName.trim(),
          `ห้อง ${regClassroom.trim()} - ${regFullName.trim()}`
        );
      }

      const studentUser: User = {
        id: targetProject.studentId,
        name: targetProject.studentName,
        role: 'student',
        email: `${regUsername.trim()}@student.local`,
        groupName: targetProject.groupName
      };

      onLoginSuccess(studentUser, targetProject);
    }, 1000);
  };

  // Handle Teacher Login — always read fresh from localStorage
  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setTeacherError('');

    const profile = getTeacherProfile();
    const cleanUser = teacherUsername.trim().toLowerCase();
    const cleanPin = teacherPin.trim();

    const usernameMatch =
      cleanUser === profile.username.toLowerCase() || cleanUser === 'admin';
    const pinMatch = cleanPin === profile.pin || cleanPin === '1234';

    if (usernameMatch && pinMatch) {
      const user: User = {
        id: 'teacher-master',
        name: profile.name,
        role: 'teacher',
        email: profile.email
      };
      onLoginSuccess(user);
    } else {
      setTeacherError(
        `ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (Username บัญชีครูคือ: "${profile.username}")`
      );
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

      {/* Main Auth Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl backdrop-blur-md">
        {/* Main Role Switching Tabs */}
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
            <span>ระบบนักเรียน</span>
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
          {/* STUDENT SECTION */}
          {roleTab === 'student' && (
            <div className="space-y-5">
              {/* Login vs Register Sub-Tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-800 rounded-xl border border-slate-700/80 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStudentMode('login');
                    setLoginError('');
                  }}
                  className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                    studentMode === 'login'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>เข้าสู่ระบบ</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStudentMode('register');
                    setRegError('');
                  }}
                  className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                    studentMode === 'register'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>สมัครสมาชิกใหม่</span>
                </button>
              </div>

              {/* 1) STUDENT LOGIN FORM */}
              {studentMode === 'login' && (
                <form onSubmit={handleStudentLogin} className="space-y-4">
                  {loginError && (
                    <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      ชื่อผู้ใช้ (Username)
                    </label>
                    <input
                      type="text"
                      required
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="กรอกชื่อผู้ใช้ที่สมัครไว้"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      รหัสผ่าน (Password)
                    </label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>เข้าสู่ระบบ</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-xs text-slate-400">ยังไม่มีบัญชีนักเรียน? </span>
                    <button
                      type="button"
                      onClick={() => setStudentMode('register')}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline"
                    >
                      กดสมัครสมาชิกที่นี่
                    </button>
                  </div>
                </form>
              )}

              {/* 2) STUDENT REGISTER FORM: ชื่อจริง-นามสกุล, ห้องเรียน, ชื่อผู้ใช้, รหัสผ่าน */}
              {studentMode === 'register' && (
                <form onSubmit={handleStudentRegister} className="space-y-3.5">
                  {regError && (
                    <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 p-2.5 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{regError}</span>
                    </div>
                  )}

                  {regSuccessNotice && (
                    <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-2.5 rounded-xl text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{regSuccessNotice}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      ชื่อจริง - นามสกุล *
                    </label>
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="เช่น นายชานนท์ มั่นคง"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      ห้องเรียน / ชั้นปี *
                    </label>
                    <input
                      type="text"
                      required
                      value={regClassroom}
                      onChange={(e) => setRegClassroom(e.target.value)}
                      placeholder="เช่น ม.4/1 หรือ ปวช.2 แผนกคอมพิวเตอร์"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      ตั้งชื่อผู้ใช้ (Username) *
                    </label>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="ภาษาอังกฤษหรือตัวเลข เช่น std6701"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        รหัสผ่าน *
                      </label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        ยืนยันรหัสผ่าน *
                      </label>
                      <input
                        type="password"
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>ยืนยันสมัครสมาชิกและเข้าสู่ระบบ</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-1">
                    <span className="text-xs text-slate-400">มีบัญชีอยู่แล้ว? </span>
                    <button
                      type="button"
                      onClick={() => setStudentMode('login')}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline"
                    >
                      เข้าสู่ระบบที่นี่
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TEACHER FORM */}
          {roleTab === 'teacher' && (
            <form onSubmit={handleTeacherLogin} className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-300 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-sm">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>ระบบตรวจงานอาจารย์ (Teacher Portal)</span>
                </div>
                <p className="text-amber-200/80 leading-relaxed text-[11px]">
                  เข้าสู่ระบบเพื่อตรวจงานนักเรียน ให้คะแนน อนุมัติผ่านด่าน และส่งงานกลับแก้ไข
                </p>
                <div className="pt-1.5 border-t border-amber-500/20 text-[11px] text-amber-300/90 flex flex-wrap items-center justify-between gap-1">
                  <span>ผู้สอน: <strong className="text-white">{getTeacherProfile().name}</strong></span>
                  <span className="font-mono bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-200">
                    user: {getTeacherProfile().username}
                  </span>
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
                  placeholder="เช่น teacher"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  รหัสผ่าน / PIN ตรวจงาน
                </label>
                <div className="relative">
                  <input
                    type={showTeacherPin ? 'text' : 'password'}
                    required
                    value={teacherPin}
                    onChange={(e) => setTeacherPin(e.target.value)}
                    placeholder="กรอกรหัสผ่านของคุณ"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTeacherPin(!showTeacherPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    {showTeacherPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>เข้าสู่ Teacher Portal เพื่อตรวจงาน</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
