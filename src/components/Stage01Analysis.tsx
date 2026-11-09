import React, { useState } from 'react';
import { Project, Scenario } from '../types';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  AlertCircle, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

interface Stage01Props {
  project: Project;
  scenario: Scenario;
  onSave: (data: Partial<Project['data']>) => void;
  onSubmitStage: (data: Partial<Project['data']>) => void;
  onBackToMap: () => void;
}

export const Stage01Analysis: React.FC<Stage01Props> = ({
  project,
  scenario,
  onSave,
  onSubmitStage,
  onBackToMap
}) => {
  const currentStatus = project.stageStatuses[1];
  const isReadOnly = currentStatus === 'SUBMITTED' || currentStatus === 'COMPLETED';

  // Form local state
  const [purpose, setPurpose] = useState(project.data.m1_purpose || '');
  const [deviceTypes, setDeviceTypes] = useState(project.data.m1_device_types || '');
  const [deviceCount, setDeviceCount] = useState(project.data.m1_device_count || '');
  const [locations, setLocations] = useState(project.data.m1_locations || '');
  const [constraints, setConstraints] = useState(project.data.m1_constraints || '');
  const [scalability, setScalability] = useState(project.data.m1_scalability || '');
  const [security, setSecurity] = useState(project.data.m1_security || '');
  const [summary, setSummary] = useState(project.data.m1_summary || '');
  const [deviceTable, setDeviceTable] = useState(
    project.data.m1_device_table?.length > 0 
      ? project.data.m1_device_table 
      : [
          { type: 'คอมพิวเตอร์ตั้งโต๊ะ (PC)', count: 0, purpose: 'ใช้งานหลัก' },
          { type: 'โน้ตบุ๊ก / แล็ปท็อป', count: 0, purpose: 'เชื่อมต่อเคลื่อนที่' },
          { type: 'สมาร์ทโฟน / แท็บเล็ต', count: 0, purpose: 'เชื่อมต่อไร้สาย' },
          { type: 'เครื่องพิมพ์เครือข่าย', count: 0, purpose: 'พิมพ์งาน' }
        ]
  );

  const [savedNotice, setSavedNotice] = useState(false);

  const handleAddTableRow = () => {
    setDeviceTable([...deviceTable, { type: '', count: 1, purpose: '' }]);
  };

  const handleRemoveTableRow = (index: number) => {
    setDeviceTable(deviceTable.filter((_, i) => i !== index));
  };

  const handleTableChange = (index: number, field: string, val: any) => {
    const updated = [...deviceTable];
    updated[index] = { ...updated[index], [field]: val };
    setDeviceTable(updated);
  };

  const collectData = () => ({
    m1_purpose: purpose,
    m1_device_types: deviceTypes,
    m1_device_count: deviceCount,
    m1_locations: locations,
    m1_constraints: constraints,
    m1_scalability: scalability,
    m1_security: security,
    m1_summary: summary,
    m1_device_table: deviceTable
  });

  const handleSaveOnly = () => {
    onSave(collectData());
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim() || !deviceCount.trim() || !summary.trim()) {
      alert('กรุณากรอกข้อมูลการวิเคราะห์ให้ครบถ้วนก่อนส่งงานให้ครูตรวจ');
      return;
    }
    onSubmitStage(collectData());
  };

  const latestFeedback = project.feedbackHistory[1]?.slice(-1)[0];

  return (
    <div className="space-y-6 py-4">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMap}
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-600 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่แผนที่ภารกิจ</span>
          </button>
          <div className="text-xs text-slate-400">/</div>
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
            MISSION 01
          </span>
          <span className="text-sm font-bold text-slate-800">
            วิเคราะห์ความต้องการลูกค้า (Requirement Analysis)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {savedNotice && (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>บันทึกแบบร่างสำเร็จ</span>
            </span>
          )}
          {!isReadOnly && (
            <button
              type="button"
              onClick={handleSaveOnly}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกแบบร่าง</span>
            </button>
          )}
        </div>
      </div>

      {/* Teacher Feedback Banner if in REVISION */}
      {currentStatus === 'REVISION' && latestFeedback && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 text-rose-950 space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-700">
            <AlertCircle className="w-4 h-4" />
            <span>คำแนะนำจากครูผู้สอนให้แก้ไขงาน:</span>
          </div>
          <p className="text-xs font-medium pl-6">{latestFeedback.feedback}</p>
        </div>
      )}

      {/* Submitted Status Notice */}
      {currentStatus === 'SUBMITTED' && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-amber-900 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 animate-spin" />
          <div className="text-xs">
            <span className="font-bold">ส่งงานด่าน 01 เรียบร้อยแล้ว! </span>
            กำลังรอครูผู้สอนตรวจสอบและอนุมัติ เมื่อครูอนุมัติแล้วระบบจะปลดล็อกด่าน 02 ให้อัตโนมัติ
          </div>
        </div>
      )}

      {/* Customer Scenario Reminder Box */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 text-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            โจทย์ที่ได้รับ: {scenario.title} ({scenario.category})
          </span>
          <span className="text-xs font-medium text-slate-500">
            งบประมาณตั้งต้น: ฿{scenario.budgetEst.toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-light">
          {scenario.situation}
        </p>
        <div className="pt-1">
          <span className="text-xs font-semibold text-slate-800">รายการความต้องการ: </span>
          <span className="text-xs text-slate-600">
            {scenario.requirements.join(' • ')}
          </span>
        </div>
      </div>

      {/* Form Worksheet */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>แบบฟอร์มวิเคราะห์ 8 ข้อกำหนดทางเทคนิค</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ตอบคำถามให้ครอบคลุมเพื่อใช้เป็นฐานข้อมูลในการเลือกอุปกรณ์ในด่านถัดไป
            </p>
          </div>

          {/* Question 1 */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              1. ลูกค้าต้องการใช้งานระบบเครือข่ายเพื่อวัตถุประสงค์ใดบ้าง? *
            </label>
            <textarea
              disabled={isReadOnly}
              rows={3}
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="เช่น เพื่อเชื่อมต่อคอมพิวเตอร์ 30 เครื่องในห้องแล็บ ให้เข้าถึงอินเทอร์เน็ตความเร็วสูง แชร์เอกสาร และพิมพ์งานผ่านระบบเครือข่าย..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>

          {/* Question 2 & 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                2. มีอุปกรณ์ปลายทาง (Endpoints) ประเภทใดบ้าง? *
              </label>
              <textarea
                disabled={isReadOnly}
                rows={3}
                required
                value={deviceTypes}
                onChange={(e) => setDeviceTypes(e.target.value)}
                placeholder="เช่น PC ตั้งโต๊ะ, โน้ตบุ๊กครู, แท็บเล็ตนักเรียน, Network Printer..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                3. จำนวนอุปกรณ์ทั้งหมดเท่าไร? (ทั้งแบบมีสายและไร้สาย) *
              </label>
              <textarea
                disabled={isReadOnly}
                rows={3}
                required
                value={deviceCount}
                onChange={(e) => setDeviceCount(e.target.value)}
                placeholder="เช่น รวมทั้งหมด 58 อุปกรณ์ (PC LAN 30 เครื่อง, แท็บเล็ต Wi-Fi 25 เครื่อง, โน้ตบุ๊ก 2 เครื่อง, เครื่องพิมพ์ 1 เครื่อง)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Interactive Endpoint Summary Table */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                ตารางสรุปอุปกรณ์ปลายทาง (Endpoint Device Breakdown)
              </span>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={handleAddTableRow}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-sm"
                >
                  <Plus className="w-3 h-3" />
                  <span>เพิ่มแถว</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-200/70 text-slate-700 font-semibold">
                  <tr>
                    <th className="p-2 rounded-l-lg">ประเภทอุปกรณ์</th>
                    <th className="p-2 w-28">จำนวน (เครื่อง)</th>
                    <th className="p-2">วัตถุประสงค์การใช้งาน</th>
                    {!isReadOnly && <th className="p-2 w-12 text-center rounded-r-lg">ลบ</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {deviceTable.map((row, idx) => (
                    <tr key={idx} className="bg-white">
                      <td className="p-2">
                        <input
                          type="text"
                          disabled={isReadOnly}
                          value={row.type}
                          onChange={(e) => handleTableChange(idx, 'type', e.target.value)}
                          placeholder="ชื่ออุปกรณ์"
                          className="w-full bg-transparent border-0 p-1 focus:ring-1 focus:ring-blue-500 rounded text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="0"
                          disabled={isReadOnly}
                          value={row.count}
                          onChange={(e) => handleTableChange(idx, 'count', Number(e.target.value))}
                          className="w-full bg-transparent border-0 p-1 focus:ring-1 focus:ring-blue-500 rounded text-xs font-mono font-bold"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          disabled={isReadOnly}
                          value={row.purpose}
                          onChange={(e) => handleTableChange(idx, 'purpose', e.target.value)}
                          placeholder="เช่น ใช้งานประมวลผล / เชื่อมต่อ Wi-Fi"
                          className="w-full bg-transparent border-0 p-1 focus:ring-1 focus:ring-blue-500 rounded text-xs"
                        />
                      </td>
                      {!isReadOnly && (
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveTableRow(idx)}
                            className="text-slate-400 hover:text-rose-500 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Question 4 & 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                4. มีพื้นที่ติดตั้งกี่จุด และสภาพแวดล้อมทางกายภาพเป็นอย่างไร? *
              </label>
              <textarea
                disabled={isReadOnly}
                rows={3}
                required
                value={locations}
                onChange={(e) => setLocations(e.target.value)}
                placeholder="เช่น พื้นที่ 1 ห้องขนาด 8x12 เมตร ตู้แร็คอยู่ที่มุมหน้าห้องข้างโต๊ะผู้สอน มีเต้ารับไฟฟ้า 4 จุดรอบห้อง..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                5. มีระยะทางหรือข้อจำกัดด้านสถานที่/สภาพแวดล้อมอะไรบ้าง? *
              </label>
              <textarea
                disabled={isReadOnly}
                rows={3}
                required
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="เช่น ข้อจำกัดเรื่องการเจาะผนังอาคาร, คลื่นรบกวน, ระยะห่างระหว่างอาคาร หรือความร้อนสะสม..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Question 6 & 7 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                6. ระบบต้องรองรับปริมาณการใช้งาน (Throughput/Concurrent) อย่างไร? *
              </label>
              <textarea
                disabled={isReadOnly}
                rows={3}
                required
                value={scalability}
                onChange={(e) => setScalability(e.target.value)}
                placeholder="เช่น ต้องรองรับนักเรียนสอบพร้อมกัน 50+ คน สปีดไม่ดรอป จัดสรรแบนด์วิดท์ต่อเครื่องอย่างเป็นธรรม..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                7. มีความต้องการด้านความปลอดภัยของเครือข่ายอะไรบ้าง? *
              </label>
              <textarea
                disabled={isReadOnly}
                rows={3}
                required
                value={security}
                onChange={(e) => setSecurity(e.target.value)}
                placeholder="เช่น การแยก VLAN ระหว่างอาจารย์กับนักเรียน, ระบบ Isolated Guest Wi-Fi, การกำหนดรหัสผ่าน WPA3..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Question 8 */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              8. สรุปแนวทางการออกแบบเบื้องต้น และโครงสร้างที่ควรจะเป็น *
            </label>
            <textarea
              disabled={isReadOnly}
              rows={4}
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="สรุปแนวคิดของทีมว่าระบบนี้ควรใช้ Topology แบบใด มีจุดศูนย์กลางที่ไหน และเตรียมตัวส่งต่อไปยังด่านที่ 2 (วาดแผนผัง) อย่างไร..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition disabled:bg-slate-100"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={onBackToMap}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
          >
            ยกเลิก / กลับหน้าแผนที่
          </button>

          {!isReadOnly ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveOnly}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
              >
                บันทึกแบบร่างไว้ก่อน
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>ส่งงานด่าน 01 ให้ครูตรวจ</span>
              </button>
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-medium">
              งานอยู่ในสถานะ {currentStatus} ไม่สามารถแก้ไขได้ขณะรอผลตรวจหรือผ่านแล้ว
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

