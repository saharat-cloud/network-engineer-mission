import React, { useState } from 'react';
import { Project, Scenario, ToolItem } from '../types';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Plus, 
  Trash2, 
  Wrench, 
  Upload, 
  Layers, 
  CheckCircle2, 
  Image as ImageIcon 
} from 'lucide-react';

interface Stage04Props {
  project: Project;
  scenario: Scenario;
  onSave: (data: Partial<Project['data']>) => void;
  onSubmitStage: (data: Partial<Project['data']>) => void;
  onBackToMap: () => void;
}

export const Stage04Tools: React.FC<Stage04Props> = ({
  project,
  scenario,
  onSave,
  onSubmitStage,
  onBackToMap
}) => {
  const currentStatus = project.stageStatuses[4];
  const isReadOnly = currentStatus === 'SUBMITTED' || currentStatus === 'COMPLETED';

  const defaultTools: ToolItem[] = [
    { id: 't1', name: 'คีมย้ำหัว RJ45 (Crimping Tool)', category: 'network', quantity: 2, purpose: 'เข้าหัวสาย LAN Cat6 มาตรฐาน T568B', steps: 'ปอกสาย เรียงสี ตัดปลายให้เรียบ สอดเข้าหัว RJ45 และบีบย้ำให้แน่น' },
    { id: 't2', name: 'เครื่องทดสอบสายสัญญาณ (Cable Tester)', category: 'tester', quantity: 1, purpose: 'เช็คความต่อเนื่องของสาย LAN ทั้ง 8 เส้น', steps: 'เสียบปลายสายทั้ง 2 ด้าน ตรวจสอบไฟวิ่งตามลำดับพิน 1-8' },
    { id: 't3', name: 'มีดปอกสาย LAN (Stripper)', category: 'network', quantity: 2, purpose: 'ปอกเปลือกนอกสาย UTP โดยไม่ให้ทองแดงด้านในขาด', steps: 'หมุนรอบเปลือกสาย 1-2 รอบ ดึงเปลือกนอกออกอย่างระมัดระวัง' },
    { id: 't4', name: 'สว่านกระแทกไฟฟ้า / ไร้สาย', category: 'general', quantity: 1, purpose: 'เจาะยึดตู้ Rack, รางสายไฟ และจุดยึด Access Point', steps: 'มาร์กจุดเจาะด้วยระดับน้ำ ใส่พุกพลาสติก แล้วขันสกรูกระแทกยึด' },
    { id: 't5', name: 'ระดับน้ำ และตลับเมตร 5 เมตร', category: 'general', quantity: 1, purpose: 'วัดระยะแนวเดินท่อสายและตั้งระดับตู้ Rack ให้ได้ระนาบ', steps: 'ทาบระดับน้ำกับขอบตู้ ตรวจสอบฟองอากาศให้อยู่ตรงกลาง' },
    { id: 't6', name: 'สายรัด Velcro Tape (ตีนตุ๊กแก)', category: 'consumable', quantity: 5, purpose: 'มัดรวบสายสัญญาณ LAN ในตู้ Rack ให้เป็นระเบียบ', steps: 'รวบสายตามกลุ่มพอร์ต รัดให้แน่นพอดี ไม่บีบเค้นสายสัญญาณ' }
  ];

  const [tools, setTools] = useState<ToolItem[]>(
    project.data.m4_tools?.length > 0 ? project.data.m4_tools : defaultTools
  );
  const [notes, setNotes] = useState<string>(project.data.m4_notes || '');
  const [imageUrl, setImageUrl] = useState<string>(project.data.m4_image_url || '');

  const handleAddTool = () => {
    if (isReadOnly) return;
    const newTool: ToolItem = {
      id: `tool_${Date.now()}`,
      name: '',
      category: 'network',
      quantity: 1,
      purpose: '',
      steps: ''
    };
    setTools([...tools, newTool]);
  };

  const handleRemoveTool = (id: string) => {
    if (isReadOnly) return;
    setTools(tools.filter((t) => t.id !== id));
  };

  const handleToolChange = (id: string, field: keyof ToolItem, value: any) => {
    if (isReadOnly) return;
    setTools(tools.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const collectData = () => ({
    m4_tools: tools,
    m4_notes: notes,
    m4_image_url: imageUrl
  });

  const handleSaveOnly = () => {
    onSave(collectData());
    alert('บันทึกรายการเครื่องมือเรียบร้อยแล้ว');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tools.length === 0) {
      alert('กรุณาระบุเครื่องมืออย่างน้อย 1 รายการ');
      return;
    }
    const hasEmpty = tools.some((t) => !t.name.trim() || !t.purpose.trim());
    if (hasEmpty) {
      alert('กรุณากรอกชื่อและวัตถุประสงค์ของเครื่องมือให้ครบถ้วน');
      return;
    }
    onSubmitStage(collectData());
  };

  return (
    <div className="space-y-6 py-4">
      {/* Breadcrumb Bar */}
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
            MISSION 04
          </span>
          <span className="text-sm font-bold text-slate-800">
            เตรียมเครื่องมือและวัสดุ (Installation Tools & Materials)
          </span>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Tools Table */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600" />
                <span>รายการเครื่องมือช่างและวัสดุติดตั้ง ({tools.length} รายการ)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                แบ่งหมวดหมู่: ช่างทั่วไป, ติดตั้งเครือข่าย, ทดสอบสัญญาณ, สายสัญญาณ และวัสดุสิ้นเปลือง
              </p>
            </div>

            {!isReadOnly && (
              <button
                type="button"
                onClick={handleAddTool}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มเครื่องมือ</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold">
                <tr>
                  <th className="p-2.5 rounded-l-lg min-w-[160px]">ชื่อเครื่องมือ / อุปกรณ์ช่าง</th>
                  <th className="p-2.5 w-36">หมวดหมู่</th>
                  <th className="p-2.5 w-20 text-center">จำนวน</th>
                  <th className="p-2.5 min-w-[180px]">วัตถุประสงค์ / หน้าที่การใช้งาน</th>
                  <th className="p-2.5 min-w-[200px]">ขั้นตอนการใช้งาน / ข้อควรระวัง</th>
                  {!isReadOnly && <th className="p-2.5 w-12 text-center rounded-r-lg">ลบ</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tools.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="p-2">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={t.name}
                        onChange={(e) => handleToolChange(t.id, 'name', e.target.value)}
                        placeholder="เช่น คีมย้ำ RJ45"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-medium"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        disabled={isReadOnly}
                        value={t.category}
                        onChange={(e) => handleToolChange(t.id, 'category', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs"
                      >
                        <option value="general">เครื่องมือช่างทั่วไป</option>
                        <option value="network">เครื่องมือติดตั้งเครือข่าย</option>
                        <option value="tester">เครื่องมือทดสอบสัญญาณ</option>
                        <option value="cabling">งานสายสัญญาณ</option>
                        <option value="consumable">วัสดุสิ้นเปลือง</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        disabled={isReadOnly}
                        value={t.quantity}
                        onChange={(e) => handleToolChange(t.id, 'quantity', Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs text-center font-mono font-bold"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={t.purpose}
                        onChange={(e) => handleToolChange(t.id, 'purpose', e.target.value)}
                        placeholder="วัตถุประสงค์การใช้งาน..."
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={t.steps}
                        onChange={(e) => handleToolChange(t.id, 'steps', e.target.value)}
                        placeholder="ขั้นตอนการใช้งาน / ข้อควรระวัง..."
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs"
                      />
                    </td>
                    {!isReadOnly && (
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveTool(t.id)}
                          className="text-slate-400 hover:text-rose-500"
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

        {/* Notes & Safety */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <label className="block text-xs font-bold text-slate-800">
            ข้อควรระวังด้านความปลอดภัยในการใช้เครื่องมือช่างและอุปกรณ์เครือข่าย
          </label>
          <textarea
            disabled={isReadOnly}
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="เช่น สวมแว่นตานิรภัยขณะเจาะผนัง, ตรวจสอบแนวสายไฟก่อนเจาะ, ปิดเบรกเกอร์ไฟฟ้าก่อนติดตั้ง PDU..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition disabled:bg-slate-100"
          />

          <div className="pt-2">
            <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium">
              <Upload className="w-4 h-4 text-slate-500" />
              <span>แนบภาพถ่ายชุดเครื่องมือจริงหรือตัวอย่างเครื่องมือ (Optional)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isReadOnly}
                className="hidden"
              />
            </label>
            {imageUrl && (
              <div className="mt-3">
                <img
                  src={imageUrl}
                  alt="Tools preview"
                  className="max-h-48 rounded-xl border border-slate-200 object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={onBackToMap}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
          >
            กลับหน้าแผนที่
          </button>

          {!isReadOnly && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveOnly}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
              >
                บันทึกแบบร่าง
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>ส่งงานด่าน 04 ให้ครูตรวจ</span>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

