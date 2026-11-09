import React from 'react';
import { Scenario, Project } from '../types';
import { SCENARIOS } from '../data/constants';
import { 
  Building2, 
  School, 
  Coffee, 
  Home, 
  Factory, 
  CheckCircle, 
  ArrowRight, 
  Coins, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';

interface ScenariosViewProps {
  activeProject: Project | null;
  onSelectScenario: (scenario: Scenario) => void;
}

export const ScenariosView: React.FC<ScenariosViewProps> = ({
  activeProject,
  onSelectScenario
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'School': return School;
      case 'Building2': return Building2;
      case 'Coffee': return Coffee;
      case 'Home': return Home;
      case 'Factory': return Factory;
      default: return Building2;
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md">
            Customer Scenarios Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            คลังโจทย์ลูกค้าจำลอง (5 สถานการณ์จริง)
          </h1>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            เลือกโจทย์ความต้องการลูกค้าที่ได้รับมอบหมายเพื่อเริ่มภารกิจ 
            <span className="font-semibold text-rose-600 ml-1">
              *หมายเหตุ: แสดงเฉพาะโจทย์ความต้องการจริง ห้ามบอกคำตอบหรือยี่ห้ออุปกรณ์ล่วงหน้า ให้นักเรียนเป็นผู้วิเคราะห์ทั้งหมด
            </span>
          </p>
        </div>
      </div>

      {/* 5 Scenarios Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SCENARIOS.map((sc) => {
          const Icon = getIcon(sc.icon);
          const isSelectedByActive = activeProject?.scenarioId === sc.id;

          return (
            <div
              key={sc.id}
              className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-lg ${
                isSelectedByActive
                  ? 'border-blue-600 ring-2 ring-blue-500/30'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded">
                        โจทย์ที่ {sc.id}
                      </span>
                      <h3 className="font-bold text-slate-900 text-lg mt-0.5 leading-snug">
                        {sc.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-mono">
                  {sc.subtitle}
                </div>

                {/* Client & Budget */}
                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800">ลูกค้า:</span>
                    <span className="truncate">{sc.clientName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800">สถานที่:</span>
                    <span>{sc.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-medium text-slate-800">งบประมาณเบื้องต้น:</span>
                    <span className="font-bold text-amber-600">฿{sc.budgetEst.toLocaleString()}</span>
                  </div>
                </div>

                {/* Situation */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    สถานการณ์ปัญหา:
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50">
                    {sc.situation}
                  </p>
                </div>

                {/* Requirements list */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    ความต้องการของลูกค้า ({sc.requirements.length} ข้อ):
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {sc.requirements.map((req, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                {isSelectedByActive ? (
                  <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>กำลังทำโจทย์ข้อนี้อยู่</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onSelectScenario(sc)}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
                  >
                    <span>เลือกโจทย์ข้อนี้เพื่อทำภารกิจ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

