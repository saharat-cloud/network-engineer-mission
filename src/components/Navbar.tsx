import React, { useState } from 'react';
import { User, Project, ReviewFeedback } from '../types';
import { 
  Network, 
  Shield, 
  ChevronRight, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Lock, 
  Bell, 
  User as UserIcon, 
  Sparkles,
  X,
  ExternalLink
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeProject: Project | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onSwitchUser: () => void;
  onOpenProfile: () => void;
  onSelectProject: (proj: Project) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeProject,
  currentView,
  onNavigate,
  onSwitchUser,
  onOpenProfile
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  // Extract all teacher feedbacks across all stages as notifications
  const notifications: Array<{
    stage: number;
    status: 'APPROVED' | 'REVISION';
    feedback: string;
    score: number;
    reviewedAt: string;
    reviewedBy: string;
  }> = [];

  if (activeProject && currentUser?.role === 'student') {
    Object.entries(activeProject.feedbackHistory || {}).forEach(([stageNum, fbs]) => {
      fbs.forEach((fb) => {
        notifications.push({
          ...fb,
          stage: Number(stageNum)
        });
      });
    });
  }

  // Sort by date descending
  notifications.sort((a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime());

  const hasUnread = notifications.length > 0;

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white shadow-xl border-b border-blue-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:bg-blue-500 group-hover:scale-105 transition-all">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-lg bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent">
                  NETWORK ENGINEER
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-400/30">
                  MISSION
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5">ภารกิจนักออกแบบและติดตั้งระบบเครือข่าย</p>
            </div>
          </div>

          {/* Navigation Items (NO SIDEBAR - Top Bar Only) */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'home' 
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              หน้าแรก
            </button>
            <button
              onClick={() => onNavigate('scenarios')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'scenarios' 
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              โจทย์ลูกค้า
            </button>
            <button
              onClick={() => onNavigate('map')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'map' || currentView.startsWith('stage-')
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>แผนที่ภารกิจ</span>
              {activeProject && (
                <span className="text-[10px] bg-blue-900/80 px-1.5 py-0.5 rounded text-blue-200">
                  ด่าน {activeProject.currentStage}/7
                </span>
              )}
            </button>

            {/* Teacher Nav - ONLY VISIBLE IF CURRENT USER IS TEACHER */}
            {currentUser?.role === 'teacher' && (
              <button
                onClick={() => onNavigate('teacher')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentView === 'teacher'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30' 
                    : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/30 border border-amber-500/30'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>แดชบอร์ดตรวจงาน</span>
              </button>
            )}
          </nav>

          {/* Right Action Widgets (Notification & Profile) */}
          <div className="flex items-center gap-2.5">
            {/* Student Notifications Bell */}
            {currentUser?.role === 'student' && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 rounded-xl transition relative border ${
                    hasUnread 
                      ? 'bg-slate-800 border-amber-500/50 text-amber-300 hover:bg-slate-750' 
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title="การแจ้งเตือนจากครูผู้สอน"
                >
                  <Bell className="w-4 h-4" />
                  {hasUnread && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-4 text-xs z-50 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-amber-400" />
                        <span>การแจ้งเตือนผลการตรวจงาน ({notifications.length})</span>
                      </span>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                      {notifications.length > 0 ? (
                        notifications.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setShowNotifications(false);
                              onNavigate(`stage-${item.stage}`);
                            }}
                            className={`p-3 rounded-xl border cursor-pointer transition space-y-1.5 ${
                              item.status === 'APPROVED'
                                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100 hover:bg-emerald-950/50'
                                : 'bg-rose-950/30 border-rose-500/40 text-rose-100 hover:bg-rose-950/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold flex items-center gap-1 text-[11px]">
                                {item.status === 'APPROVED' ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400">ด่าน {item.stage}: อนุมัติผ่านแล้ว!</span>
                                  </>
                                ) : (
                                  <>
                                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                                    <span className="text-rose-400">ด่าน {item.stage}: ส่งกลับให้แก้ไข</span>
                                  </>
                                )}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(item.reviewedAt).toLocaleDateString('th-TH')}
                              </span>
                            </div>

                            <p className="text-[11px] leading-relaxed text-slate-200 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
                              "{item.feedback}"
                            </p>

                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>ผู้ตรวจ: {item.reviewedBy}</span>
                              {item.score > 0 && (
                                <span className="font-bold text-amber-400 font-mono">
                                  +{item.score} คะแนน
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-slate-500 text-xs">
                          ยังไม่มีการแจ้งเตือนผลการตรวจ
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile Pill */}
            {currentUser && (
              <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-xl p-1">
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-700/80 transition text-left cursor-pointer"
                  title="คลิกเพื่อแก้ไขโปรไฟล์"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm ${
                    currentUser.role === 'teacher' ? 'bg-amber-500 text-slate-950' : 'bg-blue-600 text-white'
                  }`}>
                    {currentUser.nickname ? currentUser.nickname[0] : (currentUser.name ? currentUser.name[0] : 'U')}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>{currentUser.nickname || currentUser.name}</span>
                      {currentUser.alias && (
                        <span className="text-[10px] text-blue-300 font-normal">
                          ({currentUser.alias})
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                      {currentUser.role === 'teacher' ? 'อาจารย์ผู้ตรวจ' : (currentUser.classroom || 'นักเรียน')}
                    </div>
                  </div>
                </button>

                <button
                  onClick={onSwitchUser}
                  title="ออกจากระบบ"
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Global Progress Bar (Always visible at header top for student) */}
        {activeProject && currentUser?.role === 'student' && (
          <div className="py-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-semibold text-white">โครงการ:</span>
              <span className="text-blue-300">{activeProject.groupName}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">โจทย์ #{activeProject.scenarioId}</span>
            </div>

            {/* 7 Stages Progress Indicator */}
            <div className="flex items-center gap-1 sm:gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((stageNum) => {
                const st = activeProject.stageStatuses[stageNum];
                let colorClass = 'bg-slate-700 text-slate-400';

                if (st === 'COMPLETED') {
                  colorClass = 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/50';
                } else if (st === 'SUBMITTED') {
                  colorClass = 'bg-amber-500 text-slate-950 font-bold animate-pulse';
                } else if (st === 'REVISION') {
                  colorClass = 'bg-rose-500 text-white font-bold animate-bounce';
                } else if (st === 'AVAILABLE' || st === 'IN_PROGRESS') {
                  colorClass = 'bg-blue-600 text-white ring-2 ring-blue-400';
                }

                return (
                  <button
                    key={stageNum}
                    onClick={() => {
                      if (st !== 'LOCKED') {
                        onNavigate(`stage-${stageNum}`);
                      }
                    }}
                    disabled={st === 'LOCKED'}
                    className={`flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-semibold transition-all ${colorClass} ${
                      st === 'LOCKED' ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'
                    }`}
                    title={`ด่าน ${stageNum}: ${st}`}
                  >
                    {st === 'COMPLETED' ? '✓' : stageNum}
                  </button>
                );
              })}
              <div className="ml-2 font-medium text-slate-300 text-[11px] font-mono">
                {Math.round(
                  (Object.values(activeProject.stageStatuses).filter((s) => s === 'COMPLETED').length / 7) * 100
                )}%
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
