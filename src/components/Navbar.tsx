import React from 'react';
import { User, Project } from '../types';
import { Network, UserCheck, Shield, ChevronRight, LogOut, CheckCircle2, Clock, AlertTriangle, Lock } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeProject: Project | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onSwitchUser: () => void;
  onSelectProject: (proj: Project) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeProject,
  currentView,
  onNavigate,
  onSwitchUser
}) => {
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
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentView === 'home' 
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              หน้าแรก
            </button>
            <button
              onClick={() => onNavigate('scenarios')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentView === 'scenarios' 
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              โจทย์ลูกค้า
            </button>
            <button
              onClick={() => onNavigate('map')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
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

            {/* Teacher Portal Nav */}
            <button
              onClick={() => onNavigate('teacher')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentView === 'teacher'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/30' 
                  : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/30 border border-amber-500/30'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>ระบบครูตรวจงาน</span>
            </button>
          </nav>

          {/* User Status / Mode Switcher */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5">
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-blue-400 font-bold text-xs">
                  {currentUser.role === 'teacher' ? 'ครู' : 'นร.'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-medium text-slate-200 flex items-center gap-1">
                    <span>{currentUser.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      currentUser.role === 'teacher' 
                        ? 'bg-amber-400/20 text-amber-300' 
                        : 'bg-emerald-400/20 text-emerald-300'
                    }`}>
                      {currentUser.role === 'teacher' ? 'อาจารย์ผู้สอน' : 'นักเรียน'}
                    </span>
                  </div>
                  {activeProject && currentUser.role === 'student' && (
                    <div className="text-[11px] text-slate-400 truncate max-w-[130px]">
                      {activeProject.groupName}
                    </div>
                  )}
                </div>
                <button
                  onClick={onSwitchUser}
                  title="สลับบัญชีผู้ใช้งาน"
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onSwitchUser}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-md shadow-blue-600/30"
              >
                <UserCheck className="w-4 h-4" />
                <span>เข้าสู่ระบบ</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Progress Bar (Always visible at header top when active project exists) */}
        {activeProject && (
          <div className="py-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-semibold text-white">โครงการ:</span>
              <span className="text-blue-300">{activeProject.groupName}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{activeProject.studentName}</span>
            </div>

            {/* 7 Stages Progress Indicator */}
            <div className="flex items-center gap-1 sm:gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((stageNum) => {
                const st = activeProject.stageStatuses[stageNum];
                let colorClass = 'bg-slate-700 text-slate-400';
                let Icon = Lock;

                if (st === 'COMPLETED') {
                  colorClass = 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/50';
                  Icon = CheckCircle2;
                } else if (st === 'SUBMITTED') {
                  colorClass = 'bg-amber-500 text-slate-950 font-bold animate-pulse';
                  Icon = Clock;
                } else if (st === 'REVISION') {
                  colorClass = 'bg-rose-500 text-white font-bold animate-bounce';
                  Icon = AlertTriangle;
                } else if (st === 'AVAILABLE' || st === 'IN_PROGRESS') {
                  colorClass = 'bg-blue-600 text-white ring-2 ring-blue-400';
                  Icon = ChevronRight;
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
              <div className="ml-2 font-medium text-slate-300 text-[11px]">
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

