import React from 'react';
import { Project, MissionStatus } from '../types';
import { MISSIONS, SCENARIOS } from '../data/constants';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Lock, 
  ArrowRight, 
  Search, 
  GitFork, 
  Calculator, 
  Wrench, 
  CalendarClock, 
  Sliders, 
  Award, 
  Sparkles,
  Info,
  RotateCcw
} from 'lucide-react';

interface MissionMapViewProps {
  project: Project;
  onOpenStage: (stageNum: number) => void;
  onRestartProject?: () => void;
}

export const MissionMapView: React.FC<MissionMapViewProps> = ({
  project,
  onOpenStage
}) => {
  const scenario = SCENARIOS.find((s) => s.id === project.scenarioId) || SCENARIOS[0];

  const getMissionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search': return Search;
      case 'GitFork': return GitFork;
      case 'Calculator': return Calculator;
      case 'Wrench': return Wrench;
      case 'CalendarClock': return CalendarClock;
      case 'Sliders': return Sliders;
      case 'Award': return Award;
      default: return Search;
    }
  };

  const getStatusBadge = (status: MissionStatus) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ผ่านแล้ว (COMPLETED)
          </span>
        );
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            รอครูตรวจ (SUBMITTED)
          </span>
        );
      case 'REVISION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300 animate-bounce">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            ต้องแก้ไข (REVISION)
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            กำลังทำ (IN PROGRESS)
          </span>
        );
      case 'AVAILABLE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-300">
            พร้อมทำ (AVAILABLE)
          </span>
        );
      case 'LOCKED':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            ยังไม่ปลดล็อก (LOCKED)
          </span>
        );
    }
  };

  const completedCount = Object.values(project.stageStatuses).filter((s) => s === 'COMPLETED').length;
  const progressPercent = Math.round((completedCount / 7) * 100);

  return (
    <div className="space-y-8 py-4">
      {/* Top Project Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-900/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600/30 text-blue-300 border border-blue-400/30">
                โจทย์ #{scenario.id}: {scenario.category}
              </span>
              <span className="text-xs text-slate-400">
                สร้างเมื่อ: {new Date(project.createdAt).toLocaleDateString('th-TH')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {project.groupName}
            </h1>
            <p className="text-sm text-slate-300">
              หัวหน้าทีม: <span className="font-semibold text-white">{project.studentName}</span> (รหัส: {project.studentId})
            </p>
            <div className="text-xs text-slate-400 bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/60 max-w-2xl">
              <span className="text-blue-400 font-semibold">โจทย์ที่ได้รับ: </span>
              {scenario.title} — {scenario.situation}
            </div>
          </div>

          {/* Progress & Score Widget */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 min-w-[260px] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                ความคืบหน้ารวม
              </span>
              <span className="text-base font-extrabold text-blue-400 font-mono">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-700/80 text-xs">
              <div>
                <span className="text-slate-400 block">ผ่านแล้ว:</span>
                <span className="text-emerald-400 font-bold font-mono">{completedCount} / 7 ด่าน</span>
              </div>
              <div>
                <span className="text-slate-400 block">คะแนนสะสม:</span>
                <span className="text-amber-400 font-bold font-mono">{project.totalScore} / 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Path Flow (Timeline Connected) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>ผังเส้นทางภารกิจ (Mission Timeline)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              คลิกที่ด่านที่เปิดอยู่เพื่อเข้าทำงาน • ด่านถัดไปจะปลดล็อกอัตโนมัติเมื่อครูอนุมัติด่านก่อนหน้า
            </p>
          </div>
        </div>

        {/* Vertical Timeline with Connecting Lines */}
        <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-1 before:bg-slate-200">
          {MISSIONS.map((m) => {
            const status = project.stageStatuses[m.id];
            const Icon = getMissionIcon(m.icon);
            const isLocked = status === 'LOCKED';
            const isCompleted = status === 'COMPLETED';
            const isRevision = status === 'REVISION';
            const isSubmitted = status === 'SUBMITTED';
            const stageScore = project.scores[m.id] || 0;
            const stageFeedback = project.feedbackHistory[m.id]?.slice(-1)[0];

            let nodeBg = 'bg-slate-300 text-slate-600';
            if (isCompleted) nodeBg = 'bg-emerald-500 text-white ring-4 ring-emerald-100';
            else if (isSubmitted) nodeBg = 'bg-amber-500 text-slate-950 font-bold ring-4 ring-amber-100 animate-pulse';
            else if (isRevision) nodeBg = 'bg-rose-500 text-white ring-4 ring-rose-100 animate-bounce';
            else if (!isLocked) nodeBg = 'bg-blue-600 text-white ring-4 ring-blue-100';

            return (
              <div key={m.id} className="relative group">
                {/* Timeline Dot */}
                <div 
                  className={`absolute -left-6 sm:-left-10 mt-5 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all z-10 ${nodeBg}`}
                >
                  {isCompleted ? '✓' : m.number}
                </div>

                {/* Mission Card */}
                <div
                  className={`rounded-2xl p-5 sm:p-6 border transition-all ${
                    isLocked
                      ? 'bg-slate-100/80 border-slate-200/80 opacity-70'
                      : isCompleted
                      ? 'bg-white border-emerald-300 shadow-sm hover:shadow-md'
                      : isRevision
                      ? 'bg-rose-50/40 border-rose-300 shadow-md ring-1 ring-rose-400'
                      : isSubmitted
                      ? 'bg-amber-50/40 border-amber-300 shadow-sm'
                      : 'bg-white border-blue-400/80 shadow-md ring-2 ring-blue-500/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          STAGE {m.number}
                        </span>
                        {getStatusBadge(status)}
                        <span className="text-xs text-slate-500 font-medium">
                          น้ำหนัก {m.points} คะแนน
                        </span>
                        {isCompleted && (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            ได้คะแนน: {stageScore} / {m.points}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {m.title}
                          </h3>
                          <p className="text-xs text-slate-500 font-mono">
                            {m.titleEn}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {m.description}
                      </p>

                      {/* Feedback from teacher preview if exists */}
                      {stageFeedback && (
                        <div className={`mt-3 p-3 rounded-xl border text-xs space-y-1 ${
                          stageFeedback.status === 'APPROVED'
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                            : 'bg-rose-50/90 border-rose-200 text-rose-900'
                        }`}>
                          <div className="font-bold flex items-center justify-between">
                            <span>
                              {stageFeedback.status === 'APPROVED' ? '✓ ความคิดเห็นครูผู้ตรวจ:' : '⚠️ ครูส่งกลับแก้ไข:'}
                            </span>
                            <span className="text-[11px] text-slate-500 font-normal">
                              {stageFeedback.reviewedBy} • {new Date(stageFeedback.reviewedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="font-medium italic">"{stageFeedback.feedback}"</p>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="sm:self-center shrink-0">
                      {isLocked ? (
                        <button
                          disabled
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-200 text-slate-400 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>ต้องผ่านด่านก่อนหน้าก่อน</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenStage(m.id)}
                          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-105 ${
                            isCompleted
                              ? 'bg-slate-800 hover:bg-slate-700 text-white'
                              : isRevision
                              ? 'bg-rose-600 hover:bg-rose-500 text-white'
                              : isSubmitted
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
                              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
                          }`}
                        >
                          <span>{isCompleted ? 'ดูผลงานด่านนี้' : isRevision ? 'แก้ไขงานตามสั่ง' : isSubmitted ? 'ดูงานที่ส่งแล้ว' : 'เข้าทำภารกิจ'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

