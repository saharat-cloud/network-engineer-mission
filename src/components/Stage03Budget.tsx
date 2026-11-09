import React, { useState } from 'react';
import { Project, Scenario, EquipmentItem } from '../types';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Plus, 
  Trash2, 
  Calculator, 
  Coins, 
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface Stage03Props {
  project: Project;
  scenario: Scenario;
  onSave: (data: Partial<Project['data']>) => void;
  onSubmitStage: (data: Partial<Project['data']>) => void;
  onBackToMap: () => void;
}

export const Stage03Budget: React.FC<Stage03Props> = ({
  project,
  scenario,
  onSave,
  onSubmitStage,
  onBackToMap
}) => {
  const currentStatus = project.stageStatuses[3];
  const isReadOnly = currentStatus === 'SUBMITTED' || currentStatus === 'COMPLETED';

  // Items State
  const [items, setItems] = useState<EquipmentItem[]>(
    project.data.m3_items?.length > 0
      ? project.data.m3_items
      : [
          {
            id: 'item-1',
            name: 'Gigabit Managed Switch 24 Ports',
            category: 'Switch',
            brand: 'Cisco / TP-Link',
            model: 'TL-SG1024DE',
            specs: '24-Port Gigabit, 802.1Q VLAN, QoS',
            quantity: 1,
            unitPrice: 3800,
            totalPrice: 3800,
            referenceUrl: 'https://advice.co.th'
          },
          {
            id: 'item-2',
            name: 'Dual-Band Wi-Fi 6 Access Point',
            category: 'Access Point',
            brand: 'Ruijie Reyee',
            model: 'RG-RAP2260(G)',
            specs: 'Wi-Fi 6 1800Mbps, PoE Support',
            quantity: 2,
            unitPrice: 3600,
            totalPrice: 7200,
            referenceUrl: 'https://jib.co.th'
          }
        ]
  );

  const [cablingCost, setCablingCost] = useState<number>(project.data.m3_cabling_cost || 3500);
  const [consumablesCost, setConsumablesCost] = useState<number>(project.data.m3_consumables_cost || 1200);
  const [extraCost, setExtraCost] = useState<number>(project.data.m3_extra_cost || 2000);
  const [customerBudget] = useState<number>(project.data.m3_customer_budget || scenario.budgetEst);
  const [selectionReason, setSelectionReason] = useState<string>(project.data.m3_selection_reason || '');

  // Add Item
  const handleAddItem = () => {
    if (isReadOnly) return;
    const newItem: EquipmentItem = {
      id: `eq_${Date.now()}`,
      name: '',
      category: 'Switch',
      brand: '',
      model: '',
      specs: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      referenceUrl: ''
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (isReadOnly) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof EquipmentItem, value: any) => {
    if (isReadOnly) return;
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            const q = field === 'quantity' ? Number(value) : item.quantity;
            const u = field === 'unitPrice' ? Number(value) : item.unitPrice;
            updated.totalPrice = Math.max(0, q * u);
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Calculations
  const equipmentTotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const grandTotal = equipmentTotal + Number(cablingCost || 0) + Number(consumablesCost || 0) + Number(extraCost || 0);
  const remainingBudget = customerBudget - grandTotal;
  const isOverBudget = remainingBudget < 0;

  const collectData = () => ({
    m3_items: items,
    m3_cabling_cost: cablingCost,
    m3_consumables_cost: consumablesCost,
    m3_extra_cost: extraCost,
    m3_customer_budget: customerBudget,
    m3_selection_reason: selectionReason
  });

  const handleSaveOnly = () => {
    onSave(collectData());
    alert('บันทึกรายการอุปกรณ์และงบประมาณแล้ว');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('กรุณาเพิ่มรายการอุปกรณ์อย่างน้อย 1 รายการ');
      return;
    }
    const hasEmpty = items.some((item) => !item.name.trim() || item.quantity <= 0);
    if (hasEmpty) {
      alert('กรุณากรอกชื่อและจำนวนอุปกรณ์ให้ถูกต้องทุกรายการ');
      return;
    }
    if (!selectionReason.trim()) {
      alert('กรุณากรอกเหตุผลประกอบการเลือกอุปกรณ์');
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
            MISSION 03
          </span>
          <span className="text-sm font-bold text-slate-800">
            เลือกอุปกรณ์และคำนวณราคา (Equipment Selection & Budget)
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

      {/* Budget Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 block">งบประมาณลูกค้าที่ตั้งไว้</span>
          <span className="text-xl font-extrabold text-slate-900 font-mono">
            ฿{customerBudget.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">จากโจทย์ #{scenario.id}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 block">ยอดรวมค่าอุปกรณ์ (BOM)</span>
          <span className="text-xl font-extrabold text-blue-600 font-mono">
            ฿{equipmentTotal.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">จาก {items.length} รายการ</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 block">ยอดรวมทั้งโครงการ (Grand Total)</span>
          <span className="text-xl font-extrabold text-indigo-700 font-mono">
            ฿{grandTotal.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">รวมสาย, อุปกรณ์ & ค่าใช้จ่าย</span>
        </div>

        <div className={`p-4 rounded-2xl border shadow-sm ${
          isOverBudget ? 'bg-rose-50 border-rose-300' : 'bg-emerald-50 border-emerald-300'
        }`}>
          <span className="text-xs font-medium text-slate-600 block">
            {isOverBudget ? '⚠️ งบประมาณเกิน (Over Budget)' : '✓ งบประมาณคงเหลือ (Remaining)'}
          </span>
          <span className={`text-xl font-extrabold font-mono ${
            isOverBudget ? 'text-rose-600' : 'text-emerald-700'
          }`}>
            ฿{Math.abs(remainingBudget).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            {isOverBudget ? 'ต้องพิจารณาปรับลดสเปกหรือจำนวน' : 'อยู่ในเกณฑ์งบประมาณที่กำหนด'}
          </span>
        </div>
      </div>

      {/* Equipment Table Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span>ตารางรายการอุปกรณ์ (Bill of Materials - BOM)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                สูตรคำนวณอัตโนมัติ: ราคารวม = จำนวน × ราคาต่อหน่วย
              </p>
            </div>

            {!isReadOnly && (
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มรายการอุปกรณ์</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 rounded-l-lg min-w-[150px]">ชื่ออุปกรณ์</th>
                  <th className="p-2.5 w-24">หมวดหมู่</th>
                  <th className="p-2.5 w-24">แบรนด์</th>
                  <th className="p-2.5 w-28">รุ่น (Model)</th>
                  <th className="p-2.5 min-w-[140px]">คุณสมบัติเด่น (Specs)</th>
                  <th className="p-2.5 w-20 text-center">จำนวน</th>
                  <th className="p-2.5 w-28 text-right">ราคา/หน่วย (฿)</th>
                  <th className="p-2.5 w-28 text-right">ราคารวม (฿)</th>
                  <th className="p-2.5 min-w-[120px]">URL อ้างอิงราคา</th>
                  {!isReadOnly && <th className="p-2.5 w-12 text-center rounded-r-lg">ลบ</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-2">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={item.name}
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                        placeholder="เช่น 24-Port Gigabit Switch"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        disabled={isReadOnly}
                        value={item.category}
                        onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-xs"
                      >
                        <option value="Router">Router</option>
                        <option value="Switch">Switch</option>
                        <option value="Access Point">Access Point</option>
                        <option value="Cabling">Cabling</option>
                        <option value="Rack">Rack & Cabinet</option>
                        <option value="Server">Server/NAS</option>
                        <option value="Firewall">Firewall</option>
                        <option value="Other">อื่นๆ</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={item.brand}
                        onChange={(e) => handleItemChange(item.id, 'brand', e.target.value)}
                        placeholder="เช่น Cisco"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={item.model}
                        onChange={(e) => handleItemChange(item.id, 'model', e.target.value)}
                        placeholder="เช่น CBS250"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={item.specs}
                        onChange={(e) => handleItemChange(item.id, 'specs', e.target.value)}
                        placeholder="เช่น 24 Ports PoE+"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        disabled={isReadOnly}
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-xs text-center font-mono font-bold"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        disabled={isReadOnly}
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-xs text-right font-mono"
                      />
                    </td>
                    <td className="p-2 text-right font-mono font-bold text-blue-600">
                      ฿{item.totalPrice.toLocaleString()}
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={item.referenceUrl}
                        onChange={(e) => handleItemChange(item.id, 'referenceUrl', e.target.value)}
                        placeholder="https://advice.co.th/..."
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-xs text-slate-500"
                      />
                    </td>
                    {!isReadOnly && (
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
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

        {/* Supplementary Costs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            ค่าใช้จ่ายเพิ่มเติมและวัสดุสิ้นเปลือง
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ค่าสายสัญญาณ (LAN Cat6 / Fiber / ท่อร้อยสาย) (฿):
              </label>
              <input
                type="number"
                min="0"
                disabled={isReadOnly}
                value={cablingCost}
                onChange={(e) => setCablingCost(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ค่าวัสดุสิ้นเปลือง (หัว RJ45, Modular Jack, ปลั๊กไฟ, กิ๊บ) (฿):
              </label>
              <input
                type="number"
                min="0"
                disabled={isReadOnly}
                value={consumablesCost}
                onChange={(e) => setConsumablesCost(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ค่าใช้จ่ายเพิ่มเติม / ค่าสำรองฉุกเฉิน (฿):
              </label>
              <input
                type="number"
                min="0"
                disabled={isReadOnly}
                value={extraCost}
                onChange={(e) => setExtraCost(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Selection Reason */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-2">
          <label className="block text-xs font-bold text-slate-800">
            เหตุผลประกอบการเลือกอุปกรณ์และแนวทางการคุมงบประมาณ *
          </label>
          <textarea
            disabled={isReadOnly}
            rows={4}
            required
            value={selectionReason}
            onChange={(e) => setSelectionReason(e.target.value)}
            placeholder="อธิบายเหตุผลว่าทำไมถึงเลือกรุ่นและแบรนด์นี้ คุ้มค่ากับงบประมาณของลูกค้าอย่างไร และรองรับความต้องการที่วิเคราะห์ไว้ในด่าน 01 อย่างไร..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition disabled:bg-slate-100"
          />
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
                <span>ส่งงานด่าน 03 ให้ครูตรวจ</span>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

