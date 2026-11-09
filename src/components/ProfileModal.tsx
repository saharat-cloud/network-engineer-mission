import React, { useState } from 'react';
import { User, Project } from '../types';
import { updateStudentProfile, getStoredAccounts } from '../services/accountService';
import { updateProject } from '../services/projectStorage';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  Save, 
  CheckCircle2, 
  Sparkles, 
  X, 
  BadgeCheck, 
  School,
  Smile
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  activeProject: Project | null;
  onUpdateUser: (updatedUser: User) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  activeProject,
  onUpdateUser
}) => {
  if (!isOpen) return null;

  const accounts = getStoredAccounts();
  const currentAcc = accounts.find((a) => a.username.toLowerCase() === currentUser.id.toLowerCase());

  const [fullName, setFullName] = useState(currentUser.name || '');
  const [nickname, setNickname] = useState(currentUser.nickname || currentAcc?.nickname || '');
  const [alias, setAlias] = useState(currentUser.alias || currentAcc?.alias || '');
  const [email, setEmail] = useState(currentUser.email || currentAcc?.email || '');
  const [classroom, setClassroom] = useState(currentUser.classroom || currentAcc?.classroom || '');
  const [password, setPassword] = useState(currentAcc?.passwordHash || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedAccount = await updateStudentProfile(currentUser.id, {
      fullName: fullName.trim(),
      nickname: nickname.trim(),
      alias: alias.trim(),
      email: email.trim(),
      classroom: classroom.trim(),
      passwordHash: password.trim()
    });

    const updatedUser: User = {
      ...currentUser,
      name: fullName.trim(),
      nickname: nickname.trim(),
      alias: alias.trim(),
      email: email.trim(),
      classroom: classroom.trim()
    };

    onUpdateUser(updatedUser);

    // Also update project studentName if exists
    if (activeProject) {
      const updatedProj: Project = {
        ...activeProject,
        studentName: fullName.trim()
      };
      updateProject(updatedProj);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">โปรไฟล์และการตั้งค่าบัญชี</h3>
              <p className="text-[11px] text-slate-400">แก้ไขข้อมูลส่วนตัว ฉายา และรหัสผ่าน</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>บันทึกการเปลี่ยนแปลงโปรไฟล์สำเร็จเรียบร้อย!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ชื่อจริง - นามสกุล *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ชื่อเล่น (Nickname)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="เช่น บาส, พลอย, นนท์"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ฉายา / ตำแหน่งในทีม (Alias / Role)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="เช่น Lead Network Architect, Hacker"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ห้องเรียน / ชั้นปี
              </label>
              <input
                type="text"
                value={classroom}
                onChange={(e) => setClassroom(e.target.value)}
                placeholder="เช่น ม.4/1, ปวช.2"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              อีเมลติดต่อ (Email)
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@school.ac.th"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              รหัสผ่านใหม่ (Password)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านที่ต้องการเปลี่ยน"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              ชื่อผู้ใช้ (Username): <strong>{currentUser.id}</strong> (ไม่สามารถเปลี่ยนชื่อผู้ใช้ได้)
            </p>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>บันทึกการตั้งค่า</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

