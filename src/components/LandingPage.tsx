import React from 'react';
import { 
  Network, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Zap, 
  Terminal, 
  Sparkles,
  Server,
  Workflow
} from 'lucide-react';
import { MISSIONS } from '../data/constants';

interface LandingPageProps {
  onStartMission: () => void;
  onExploreScenarios: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartMission,
  onExploreScenarios
}) => {
  const skills = [
    { title: 'วิเคราะห์ระบบ', desc: 'ถอดรหัสความต้องการผู้ใช้ จำนวนโหนด และสเกลระบบ', icon: Layers },
    { title: 'ออกแบบเครือข่าย', desc: 'วางสถาปัตยกรรม LAN/WLAN, Core, Distribution & Access', icon: Network },
    { title: 'เลือกอุปกรณ์จริง', desc: 'เปรียบเทียบสเปก Router, Managed Switch, AP และ Server', icon: Cpu },
    { title: 'คำนวณงบประมาณ', desc: 'จัดทำ BOM (Bill of Materials) และใบเสนอราคามาตรฐาน', icon: Zap },
    { title: 'วางแผนติดตั้ง', desc: 'วางขั้นตอนการทำงาน 7 เฟสหน้างานและความปลอดภัย', icon: Workflow },
    { title: 'ตั้งค่าระบบ', desc: 'วางแผน IP Addressing, Subnet, VLAN, DHCP และ QoS', icon: Terminal },
    { title: 'ทดสอบ & แก้ปัญหา', desc: 'วัดผล Throughput, Latency, Packet Loss และส่งมอบงาน', icon: ShieldCheck }
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-blue-800/40 shadow-2xl p-8 sm:p-14 text-white">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Mission-Based Network Engineering Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            พร้อมรับภารกิจ <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300 bg-clip-text text-transparent">
              ออกแบบระบบเครือข่ายหรือยัง?
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            เปลี่ยนจากการเรียนรู้ทฤษฎี สู่การปฏิบัติจริง ผ่านสถานการณ์จำลองที่คุณต้องคิด วิเคราะห์ 
            ออกแบบ และติดตั้งระบบเครือข่ายด้วยตนเอง รับบทเป็นบริษัทผู้รับเหมาไอที ผ่านบททดสอบ 7 ด่านที่มีครูคอยตรวจและอนุมัติแบบ Real-time
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStartMission}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>เริ่มต้นภารกิจ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreScenarios}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-medium text-sm transition"
            >
              <Server className="w-4 h-4 text-slate-400" />
              <span>ดูโจทย์ลูกค้า 5 รูปแบบ</span>
            </button>
          </div>
        </div>

        {/* Hero Technology Grid Badge */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80 pt-8">
          <div>
            <div className="text-2xl font-bold text-white">7 ด่าน</div>
            <div className="text-xs text-slate-400 mt-0.5">ผ่านทีละขั้นตามลำดับ</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">5 โจทย์จริง</div>
            <div className="text-xs text-slate-400 mt-0.5">โรงเรียน/ออฟฟิศ/คาเฟ่/บ้าน/โรงงาน</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">ระบบครูตรวจ</div>
            <div className="text-xs text-slate-400 mt-0.5">อนุมัติหรือส่งกลับแก้ไข</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">100 คะแนน</div>
            <div className="text-xs text-slate-400 mt-0.5">เกณฑ์ประเมินสมรรถนะครบวงจร</div>
          </div>
        </div>
      </section>

      {/* 7 Missions Overview Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            เส้นทางภารกิจ 7 ด่าน (Mission Progression)
          </h2>
          <p className="text-sm text-slate-600">
            ระบบบังคับทำตามลำดับ ไม่สามารถข้ามด่านได้ ทุกด่านต้องได้รับการตรวจและอนุมัติจากครูก่อน
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MISSIONS.map((m, idx) => (
            <div 
              key={m.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  STAGE {m.number}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {m.points} คะแนน
                </span>
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition mb-1 text-base">
                {m.title}
              </h3>
              <p className="text-xs text-slate-500 font-mono mb-2">
                {m.titleEn}
              </p>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Acquired Section */}
      <section className="bg-slate-100 rounded-3xl p-8 sm:p-10 border border-slate-200">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            ทักษะที่จะได้รับจากการปฏิบัติภารกิจ
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            ครอบคลุมทักษะวิศวกรเครือข่ายตามมาตรฐานสากล ทั้ง Hard Skills และ Project Management
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((s, index) => {
            const Icon = s.icon;
            return (
              <div 
                key={index}
                className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-start gap-3.5 shadow-sm"
              >
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{s.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to action */}
      <section className="text-center py-6">
        <button
          onClick={onStartMission}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-blue-500/25 transition-all hover:scale-105"
        >
          <Sparkles className="w-5 h-5" />
          <span>เข้าร่วมภารกิจและเริ่มออกแบบระบบทันที</span>
        </button>
      </section>
    </div>
  );
};

