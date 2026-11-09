import React, { useState } from 'react';
import { Project, Scenario, IPConfigItem } from '../types';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Plus, 
  Trash2, 
  Sliders, 
  Wifi, 
  ShieldCheck, 
  CheckCircle2, 
  Upload, 
  Terminal, 
  Network 
} from 'lucide-react';

interface Stage06Props {
  project: Project;
  scenario: Scenario;
  onSave: (data: Partial<Project['data']>) => void;
  onSubmitStage: (data: Partial<Project['data']>) => void;
  onBackToMap: () => void;
}

export const Stage06Config: React.FC<Stage06Props> = ({
  project,
  scenario,
  onSave,
  onSubmitStage,
  onBackToMap
}) => {
  const currentStatus = project.stageStatuses[6];
  const isReadOnly = currentStatus === 'SUBMITTED' || currentStatus === 'COMPLETED';

  // Section 1: IP Addressing Table
  const defaultIPs: IPConfigItem[] = [
    { id: 'ip1', deviceName: 'ISP Gateway Router', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', gateway: '-', dns: '8.8.8.8, 1.1.1.1', notes: 'WAN & Default Route' },
    { id: 'ip2', deviceName: 'Core Switch PoE 24P', ipAddress: '192.168.1.2', subnetMask: '255.255.255.0', gateway: '192.168.1.1', dns: '8.8.8.8', notes: 'Management IP' },
    { id: 'ip3', deviceName: 'Access Point Zone 1', ipAddress: '192.168.1.10', subnetMask: '255.255.255.0', gateway: '192.168.1.1', dns: '8.8.8.8', notes: 'Static IP' },
    { id: 'ip4', deviceName: 'Access Point Zone 2', ipAddress: '192.168.1.11', subnetMask: '255.255.255.0', gateway: '192.168.1.1', dns: '8.8.8.8', notes: 'Static IP' },
    { id: 'ip5', deviceName: 'Network Laser Printer', ipAddress: '192.168.1.50', subnetMask: '255.255.255.0', gateway: '192.168.1.1', dns: '8.8.8.8', notes: 'Fixed Lease' },
    { id: 'ip6', deviceName: 'DHCP Client Pool (PCs/Mobile)', ipAddress: '192.168.1.100 - 200', subnetMask: '255.255.255.0', gateway: '192.168.1.1', dns: '8.8.8.8', notes: 'Lease Time: 8 Hours' }
  ];

  const [ipConfigs, setIpConfigs] = useState<IPConfigItem[]>(
    project.data.m6_ip_configs?.length > 0 ? project.data.m6_ip_configs : defaultIPs
  );

  // Section 2: DHCP & Network
  const [dhcpEnabled, setDhcpEnabled] = useState<boolean>(project.data.m6_dhcp_enabled ?? true);
  const [dhcpRange, setDhcpRange] = useState<string>(project.data.m6_dhcp_range || '192.168.1.100 - 192.168.1.200');
  const [staticIps, setStaticIps] = useState<string>(project.data.m6_static_ips || 'Gateway: .1, Switch: .2, APs: .10-.11, Printer: .50');
  const [gatewayDns, setGatewayDns] = useState<string>(project.data.m6_gateway_dns || 'Gateway: 192.168.1.1, Primary DNS: 8.8.8.8, Secondary: 1.1.1.1');

  // Section 3: Wi-Fi Setup
  const [wifiSsid, setWifiSsid] = useState<string>(project.data.m6_wifi_ssid || `${scenario.title.split(' ')[0]}_HighSpeed_WiFi`);
  const [wifiPass, setWifiPass] = useState<string>(project.data.m6_wifi_pass || 'SecurePass@2026');
  const [wifiSec, setWifiSec] = useState<string>(project.data.m6_wifi_sec || 'WPA2/WPA3 Personal (AES)');
  const [wifiIsolation, setWifiIsolation] = useState<boolean>(project.data.m6_wifi_isolation ?? true);

  // Section 4: VLAN Setup
  const [vlanSetup, setVlanSetup] = useState<string>(project.data.m6_vlan_setup || 'VLAN 10: Management (192.168.10.0/24)\nVLAN 20: Office/PCs (192.168.20.0/24)\nVLAN 30: Guest/Free Wi-Fi (192.168.30.0/24)');

  // Section 5: Bandwidth & Security
  const [qosBandwidth, setQosBandwidth] = useState<string>(project.data.m6_qos_bandwidth || 'QoS Priority: Voice/Video > POS > Workstation > Guest (Limit Guest at 20Mbps/5Mbps)');

  // Section 6: Testing & Troubleshooting
  const [testingMethod, setTestingMethod] = useState<string>(project.data.m6_testing_method || '');
  const [testingResult, setTestingResult] = useState<string>(project.data.m6_testing_result || '1. Ping Gateway: Latency < 1ms, 0% Loss\n2. Ping Google DNS (8.8.8.8): Latency 12ms\n3. Speedtest Throughput: Download 940Mbps / Upload 480Mbps\n4. DHCP Test: แจก IP ครบทั้ง 30 เครื่อง');
  const [issuesFound, setIssuesFound] = useState<string>(project.data.m6_issues_found || 'พบสาย LAN พอร์ตที่ 14 หัว RJ45 ขาดสัญญาณเส้นที่ 4 ทำให้ความเร็ววิ่งเพียง 100Mbps แทนที่จะเป็น 1000Mbps');
  const [solutions, setSolutions] = useState<string>(project.data.m6_solutions || 'ตัดปลายสายและเข้าหัว RJ45 ใหม่ พร้อมทดสอบด้วย Cable Tester ไฟขึ้นครบ 8 เส้น');
  const [postResolution, setPostResolution] = useState<string>(project.data.m6_post_resolution || 'ความเร็วพอร์ต 14 ปรับเป็น 1Gbps Full Duplex ปกติ ทดสอบ Ping ผ่านเรียบร้อย');
  const [testEvidenceUrl, setTestEvidenceUrl] = useState<string>(project.data.m6_test_evidence_url || '');

  const handleAddIpRow = () => {
    if (isReadOnly) return;
    const newIp: IPConfigItem = {
      id: `ip_${Date.now()}`,
      deviceName: '',
      ipAddress: '',
      subnetMask: '255.255.255.0',
      gateway: '192.168.1.1',
      dns: '8.8.8.8',
      notes: ''
    };
    setIpConfigs([...ipConfigs, newIp]);
  };

  const handleRemoveIpRow = (id: string) => {
    if (isReadOnly) return;
    setIpConfigs(ipConfigs.filter((i) => i.id !== id));
  };

  const handleIpChange = (id: string, field: keyof IPConfigItem, value: string) => {
    if (isReadOnly) return;
    setIpConfigs(ipConfigs.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTestEvidenceUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const collectData = () => ({
    m6_ip_configs: ipConfigs,
    m6_dhcp_enabled: dhcpEnabled,
    m6_dhcp_range: dhcpRange,
    m6_static_ips: staticIps,
    m6_gateway_dns: gatewayDns,
    m6_wifi_ssid: wifiSsid,
    m6_wifi_pass: wifiPass,
    m6_wifi_sec: wifiSec,
    m6_wifi_isolation: wifiIsolation,
    m6_vlan_setup: vlanSetup,
    m6_qos_bandwidth: qosBandwidth,
    m6_testing_method: testingMethod,
    m6_testing_result: testingResult,
    m6_issues_found: issuesFound,
    m6_solutions: solutions,
    m6_post_resolution: postResolution,
    m6_test_evidence_url: testEvidenceUrl
  });

  const handleSaveOnly = () => {
    onSave(collectData());
    alert('บันทึกการตั้งค่าและการทดสอบระบบแล้ว');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wifiSsid.trim() || !testingResult.trim()) {
      alert('กรุณากรอกข้อมูลการตั้งค่า Wi-Fi และผลการทดสอบระบบให้ครบถ้วน');
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
            MISSION 06
          </span>
          <span className="text-sm font-bold text-slate-800">
            ตั้งค่าและทดสอบระบบ (Configuration & Testing)
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: IP Addressing Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Network className="w-4 h-4 text-blue-600" />
                <span>ส่วนที่ 1: ตารางกำหนด IP Address Plan</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                กำหนดหมายเลข IP ให้กับ Router, Switch, Access Point, Printer และ Client Pool
              </p>
            </div>

            {!isReadOnly && (
              <button
                type="button"
                onClick={handleAddIpRow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มโหนด IP</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold">
                <tr>
                  <th className="p-2.5 rounded-l-lg min-w-[150px]">ชื่ออุปกรณ์</th>
                  <th className="p-2.5 min-w-[130px]">IP Address</th>
                  <th className="p-2.5 min-w-[120px]">Subnet Mask</th>
                  <th className="p-2.5 min-w-[120px]">Default Gateway</th>
                  <th className="p-2.5 min-w-[130px]">DNS Server</th>
                  <th className="p-2.5 min-w-[140px]">หมายเหตุ</th>
                  {!isReadOnly && <th className="p-2.5 w-12 text-center rounded-r-lg">ลบ</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ipConfigs.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="p-2">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={row.deviceName}
                        onChange={(e) => handleIpChange(row.id, 'deviceName', e.target.value)}
                        placeholder="ชื่ออุปกรณ์"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-medium"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={row.ipAddress}
                        onChange={(e) => handleIpChange(row.id, 'ipAddress', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-mono font-bold text-blue-600"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={row.subnetMask}
                        onChange={(e) => handleIpChange(row.id, 'subnetMask', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-mono"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={row.gateway}
                        onChange={(e) => handleIpChange(row.id, 'gateway', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-mono"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={row.dns}
                        onChange={(e) => handleIpChange(row.id, 'dns', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-mono"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={row.notes}
                        onChange={(e) => handleIpChange(row.id, 'notes', e.target.value)}
                        placeholder="หมายเหตุ..."
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs"
                      />
                    </td>
                    {!isReadOnly && (
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveIpRow(row.id)}
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

        {/* Section 2: DHCP & Core Setup */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>ส่วนที่ 2: การตั้งค่า DHCP และบริการเครือข่าย</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ช่วงการแจก IP (DHCP Scope Pool):
              </label>
              <input
                type="text"
                disabled={isReadOnly}
                value={dhcpRange}
                onChange={(e) => setDhcpRange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Static IP Reservations (สำรองสำหรับ Server / Printer):
              </label>
              <input
                type="text"
                disabled={isReadOnly}
                value={staticIps}
                onChange={(e) => setStaticIps(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3 & 4: Wi-Fi & VLAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wi-Fi */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Wifi className="w-4 h-4 text-blue-600" />
              <span>ส่วนที่ 3: การตั้งค่าเครือข่ายไร้สาย (Wi-Fi)</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">SSID (ชื่อ Wi-Fi):</label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">รหัสผ่าน (Wi-Fi Password):</label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={wifiPass}
                  onChange={(e) => setWifiPass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ระบบความปลอดภัย (Security Protocol):</label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={wifiSec}
                  onChange={(e) => setWifiSec(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isolation"
                  disabled={isReadOnly}
                  checked={wifiIsolation}
                  onChange={(e) => setWifiIsolation(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isolation" className="text-xs text-slate-700 cursor-pointer">
                  เปิดใช้งาน AP Client Isolation (ห้ามอุปกรณ์ลูกข่ายคุยกันเองเพื่อความปลอดภัย)
                </label>
              </div>
            </div>
          </div>

          {/* VLAN & Bandwidth */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>ส่วนที่ 4 & 5: การแบ่ง VLAN และจัดการแบนด์วิดท์ (QoS)</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  การแบ่ง VLAN และ Network Subnet:
                </label>
                <textarea
                  rows={3}
                  disabled={isReadOnly}
                  value={vlanSetup}
                  onChange={(e) => setVlanSetup(e.target.value)}
                  placeholder="เช่น VLAN 10: Management, VLAN 20: Office..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  นโยบายการจำกัดความเร็วและจัดลำดับความสำคัญ (QoS Policy):
                </label>
                <textarea
                  rows={2}
                  disabled={isReadOnly}
                  value={qosBandwidth}
                  onChange={(e) => setQosBandwidth(e.target.value)}
                  placeholder="เช่น จำกัดความเร็ว Guest ที่ 20/5 Mbps..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Testing & Troubleshooting */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-600" />
            <span>ส่วนที่ 6: การทดสอบระบบและการแก้ปัญหา (Testing & Troubleshooting)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วิธีการทดสอบ (Testing Procedures):
              </label>
              <textarea
                rows={3}
                disabled={isReadOnly}
                value={testingMethod}
                onChange={(e) => setTestingMethod(e.target.value)}
                placeholder="เช่น 1. Ping Test หา Gateway 2. Throughput Speedtest 3. Wi-Fi Roaming Check..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ผลการทดสอบ (Actual Test Results) *:
              </label>
              <textarea
                rows={3}
                required
                disabled={isReadOnly}
                value={testingResult}
                onChange={(e) => setTestingResult(e.target.value)}
                placeholder="ระบุค่าตัวเลขปิง (Latency ms), สปีดที่วัดได้ (Mbps), และความเสถียร..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ปัญหาที่พบระหว่างติดตั้ง (Issue):
              </label>
              <textarea
                rows={2}
                disabled={isReadOnly}
                value={issuesFound}
                onChange={(e) => setIssuesFound(e.target.value)}
                placeholder="ระบุอาการผิดปกติที่เกิดขึ้น..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วิธีแก้ไขปัญหา (Solution):
              </label>
              <textarea
                rows={2}
                disabled={isReadOnly}
                value={solutions}
                onChange={(e) => setSolutions(e.target.value)}
                placeholder="ระบุขั้นตอนการแก้ปัญหาทางเทคนิค..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ผลหลังแก้ไข (Post-Resolution):
              </label>
              <textarea
                rows={2}
                disabled={isReadOnly}
                value={postResolution}
                onChange={(e) => setPostResolution(e.target.value)}
                placeholder="ระบบทำงานปกติ วัดความเร็วได้ตามสเปก..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium">
              <Upload className="w-4 h-4 text-slate-500" />
              <span>แนบภาพหน้าจอผลการทดสอบ (Ping / Speedtest / Router Config Screen)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isReadOnly}
                className="hidden"
              />
            </label>
            {testEvidenceUrl && (
              <div className="mt-3">
                <img
                  src={testEvidenceUrl}
                  alt="Test evidence"
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
                <span>ส่งงานด่าน 06 ให้ครูตรวจ</span>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

