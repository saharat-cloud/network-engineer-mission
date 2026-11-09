import React, { useState } from 'react';
import { Project, Scenario, StepPlanItem } from '../types';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  CalendarClock, 
  Upload, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface Stage05Props {
  project: Project;
  scenario: Scenario;
  onSave: (data: Partial<Project['data']>) => void;
  onSubmitStage: (data: Partial<Project['data']>) => void;
  onBackToMap: () => void;
}

export const Stage05Planning: React.FC<Stage05Props> = ({
  project,
  scenario,
  onSave,
  onSubmitStage,
  onBackToMap
}) => {
  const currentStatus = project.stageStatuses[5];
  const isReadOnly = currentStatus === 'SUBMITTED' || currentStatus === 'COMPLETED';

  const [steps, setSteps] = useState<StepPlanItem[]>(
    project.data.m5_steps?.length > 0 ? project.data.m5_steps : []
  );
  const [safetyNotes, setSafetyNotes] = useState<string>(project.data.m5_safety_notes || '');
  const [imageUrl, setImageUrl] = useState<string>(project.data.m5_image_url || '');

  const handleAddStep = () => {
    if (isReadOnly) return;
    const newStep: StepPlanItem = {
      id: `step_${Date.now()}`,
      order: steps.length + 1,
      phase: `ขั้นตอนที่ ${steps.length + 1}`,
      description: '',
      equipment: '',
      tools: '',
      notes: ''
    };
    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (id: string) => {
    if (isReadOnly) return;
    const filtered = steps.filter((s) => s.id !== id);
    // re-index order
    const reindexed = filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSteps(reindexed);
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    if (isReadOnly) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;

    const newSteps = [...steps];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIdx];
    newSteps[targetIdx] = temp;

    // re-index
    const reindexed = newSteps.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSteps(reindexed);
  };

  const handleStepChange = (id: string, field: keyof StepPlanItem, value: any) => {
    if (isReadOnly) return;
    setSteps(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
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
    m5_steps: steps,
    m5_safety_notes: safetyNotes,
    m5_image_url: imageUrl
  });

  const handleSaveOnly = () => {
    onSave(collectData());
    alert('บันทึกแผนการติดตั้งเรียบร้อยแล้ว');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (steps.length === 0) {
      alert('กรุณาระบุขั้นตอนการติดตั้งอย่างน้อย 1 ขั้นตอน');
      return;
    }
    const hasEmpty = steps.some((s) => !s.description.trim());
    if (hasEmpty) {
      alert('กรุณากรอกรายละเอียดการทำงานให้ครบทุกขั้นตอน');
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
            MISSION 05
          </span>
          <span className="text-sm font-bold text-slate-800">
            วางแผนการติดตั้ง (Installation Planning)
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

      {/* Step Planning Worksheet */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-blue-600" />
                <span>ลำดับขั้นตอนการเข้าปฏิบัติงานติดตั้งหน้างาน 7 เฟส</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                สามารถสลับลำดับ (เลื่อนขึ้น/ลง) เพิ่มขั้นตอนใหม่ หรือปรับแต่งรายละเอียดให้สอดคล้องกับโจทย์
              </p>
            </div>

            {!isReadOnly && (
              <button
                type="button"
                onClick={handleAddStep}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มขั้นตอนการติดตั้ง</span>
              </button>
            )}
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {steps.map((st, idx) => (
              <div
                key={st.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                      {st.order}
                    </span>
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={st.phase}
                      onChange={(e) => handleStepChange(st.id, 'phase', e.target.value)}
                      placeholder="ชื่อขั้นตอน"
                      className="font-bold text-xs text-slate-800 bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1 min-w-[240px]"
                    />
                  </div>

                  {!isReadOnly && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveStep(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                        title="เลื่อนขึ้น"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveStep(idx, 'down')}
                        disabled={idx === steps.length - 1}
                        className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                        title="เลื่อนลง"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(st.id)}
                        className="p-1 text-slate-400 hover:text-rose-500"
                        title="ลบขั้นตอนนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    รายละเอียดการทำงาน (Action Details):
                  </label>
                  <textarea
                    rows={2}
                    disabled={isReadOnly}
                    value={st.description}
                    onChange={(e) => handleStepChange(st.id, 'description', e.target.value)}
                    placeholder="อธิบายกิจกรรมหลักที่ต้องทำในขั้นตอนนี้..."
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      อุปกรณ์ที่ใช้ (Equipment):
                    </label>
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={st.equipment}
                      onChange={(e) => handleStepChange(st.id, 'equipment', e.target.value)}
                      placeholder="เช่น Switch, AP, Rack..."
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      เครื่องมือที่ใช้ (Tools):
                    </label>
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={st.tools}
                      onChange={(e) => handleStepChange(st.id, 'tools', e.target.value)}
                      placeholder="เช่น สว่าน, คีมย้ำ, ตัวเทสสาย..."
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      หมายเหตุ / มาตรฐานงาน:
                    </label>
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={st.notes}
                      onChange={(e) => handleStepChange(st.id, 'notes', e.target.value)}
                      placeholder="เช่น ตามมาตรฐาน TIA-568B"
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety & Quality Control Plan */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <label className="block text-xs font-bold text-slate-800">
            แผนควบคุมคุณภาพและความปลอดภัยหน้างาน (Safety & QA Checklist)
          </label>
          <textarea
            disabled={isReadOnly}
            rows={3}
            value={safetyNotes}
            onChange={(e) => setSafetyNotes(e.target.value)}
            placeholder="ระบุแนวทางตรวจสอบมาตรฐาน เช่น การทดสอบดึงสายสัญญาณ, การติดฉลากระบุสาย (Labeling), การตรวจสอบระบบระบายความร้อนตู้ Rack..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition disabled:bg-slate-100"
          />

          <div className="pt-2">
            <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium">
              <Upload className="w-4 h-4 text-slate-500" />
              <span>แนบภาพแผนผังการเดินสายหรือ Gantt Chart แผนงาน (Optional)</span>
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
                  alt="Plan preview"
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
                <span>ส่งงานด่าน 05 ให้ครูตรวจ</span>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

