import React, { useState, useRef } from 'react';
import { Project, TopologyNode, TopologyLink } from '../types';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Link2,
  Server,
  Router,
  Wifi,
  Laptop,
  Printer,
  Camera,
  Shield,
  Layers,
  FileText
} from 'lucide-react';

interface Stage02Props {
  project: Project;
  onSave: (data: Partial<Project['data']>) => void;
  onSubmitStage: (data: Partial<Project['data']>) => void;
  onBackToMap: () => void;
}

export const Stage02Topology: React.FC<Stage02Props> = ({
  project,
  onSave,
  onSubmitStage,
  onBackToMap
}) => {
  const currentStatus = project.stageStatuses[2];
  const isReadOnly = currentStatus === 'SUBMITTED' || currentStatus === 'COMPLETED';

  // Canvas State
  const [nodes, setNodes] = useState<TopologyNode[]>(
    project.data.m2_nodes?.length > 0
      ? project.data.m2_nodes
      : [
          { id: 'node-isp', label: 'ISP Fiber Gateway', type: 'router', ip: 'Public IP', notes: 'Main Link', x: 300, y: 50 },
          { id: 'node-core-sw', label: 'Main Switch Gigabit', type: 'switch', ip: '192.168.1.2', notes: 'Core Switch', x: 300, y: 170 },
          { id: 'node-ap', label: 'Ceiling Access Point', type: 'ap', ip: '192.168.1.10', notes: 'Wi-Fi 6', x: 140, y: 290 },
          { id: 'node-pc', label: 'Client PC Group', type: 'pc', ip: '192.168.1.100-150', notes: 'Wired LAN', x: 460, y: 290 }
        ]
  );

  const [links, setLinks] = useState<TopologyLink[]>(
    project.data.m2_links?.length > 0
      ? project.data.m2_links
      : [
          { id: 'l1', from: 'node-isp', to: 'node-core-sw', type: 'cat6', label: 'Gigabit LAN' },
          { id: 'l2', from: 'node-core-sw', to: 'node-ap', type: 'cat6', label: 'PoE Port' },
          { id: 'l3', from: 'node-core-sw', to: 'node-pc', type: 'cat6', label: 'Access LAN' }
        ]
  );

  const [conceptExplanation, setConceptExplanation] = useState(
    project.data.m2_concept_explanation || ''
  );
  const [uploadedImageUrl, setUploadedImageUrl] = useState(
    project.data.m2_uploaded_image_url || ''
  );

  // Selected for editing / connecting
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectSourceId, setConnectSourceId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Add node handler
  const handleAddNode = (type: TopologyNode['type']) => {
    if (isReadOnly) return;
    const newId = `node_${Date.now()}`;
    const labels: Record<TopologyNode['type'], string> = {
      router: 'Router Gateway',
      switch: 'Managed Switch',
      server: 'Application/NAS Server',
      ap: 'Wireless AP',
      pc: 'Workstation PC',
      printer: 'Network Printer',
      camera: 'IP Camera CCTV',
      firewall: 'Hardware Firewall'
    };

    const newNode: TopologyNode = {
      id: newId,
      label: labels[type] || 'Device',
      type,
      ip: '192.168.1.X',
      notes: '',
      x: 250 + Math.random() * 80,
      y: 150 + Math.random() * 80
    };

    setNodes([...nodes, newNode]);
    setSelectedNodeId(newId);
  };

  const handleDeleteNode = (id: string) => {
    if (isReadOnly) return;
    setNodes(nodes.filter((n) => n.id !== id));
    setLinks(links.filter((l) => l.from !== id && l.to !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
    if (connectSourceId === id) setConnectSourceId(null);
  };

  const handleUpdateSelectedNode = (field: keyof TopologyNode, value: string) => {
    if (!selectedNodeId || isReadOnly) return;
    setNodes(
      nodes.map((n) => (n.id === selectedNodeId ? { ...n, [field]: value } : n))
    );
  };

  const handleStartConnect = (id: string) => {
    if (isReadOnly) return;
    if (!connectSourceId) {
      setConnectSourceId(id);
    } else if (connectSourceId === id) {
      setConnectSourceId(null);
    } else {
      // Create link between connectSourceId and id
      const exists = links.some(
        (l) => (l.from === connectSourceId && l.to === id) || (l.from === id && l.to === connectSourceId)
      );
      if (!exists) {
        const newLink: TopologyLink = {
          id: `link_${Date.now()}`,
          from: connectSourceId,
          to: id,
          type: 'cat6',
          label: 'Cat6 LAN'
        };
        setLinks([...links, newLink]);
      }
      setConnectSourceId(null);
    }
  };

  const handleDeleteLink = (linkId: string) => {
    if (isReadOnly) return;
    setLinks(links.filter((l) => l.id !== linkId));
  };

  // Node Dragging on Canvas
  const handleMouseDownNode = (e: React.MouseEvent, id: string) => {
    if (isReadOnly) return;
    e.stopPropagation();
    setDraggingNodeId(id);
    setSelectedNodeId(id);
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (!draggingNodeId || !canvasRef.current || isReadOnly) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(30, Math.min(rect.width - 120, (e.clientX - rect.left) / zoomLevel));
    const y = Math.max(30, Math.min(rect.height - 80, (e.clientY - rect.top) / zoomLevel));

    setNodes(
      nodes.map((n) => (n.id === draggingNodeId ? { ...n, x, y } : n))
    );
  };

  const handleMouseUpCanvas = () => {
    setDraggingNodeId(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const collectData = () => ({
    m2_nodes: nodes,
    m2_links: links,
    m2_concept_explanation: conceptExplanation,
    m2_uploaded_image_url: uploadedImageUrl
  });

  const handleSaveOnly = () => {
    onSave(collectData());
    alert('บันทึกแผนผังเรียบร้อยแล้ว');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nodes.length === 0 && !uploadedImageUrl) {
      alert('กรุณาวาดแผนผังเครือข่ายอย่างน้อย 1 รายการ หรืออัปโหลดไฟล์ภาพแผนผัง');
      return;
    }
    if (!conceptExplanation.trim()) {
      alert('กรุณากรอกคำอธิบายแนวคิดการออกแบบแผนผังเครือข่าย');
      return;
    }
    onSubmitStage(collectData());
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const getNodeIcon = (type: TopologyNode['type']) => {
    switch (type) {
      case 'router': return Router;
      case 'switch': return Layers;
      case 'server': return Server;
      case 'ap': return Wifi;
      case 'pc': return Laptop;
      case 'printer': return Printer;
      case 'camera': return Camera;
      case 'firewall': return Shield;
      default: return Server;
    }
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
            MISSION 02
          </span>
          <span className="text-sm font-bold text-slate-800">
            ออกแบบแผนผังเครือข่าย (Network Topology Design)
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

      {/* Main Designer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Toolbar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>เพิ่มอุปกรณ์ลงแผนผัง</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(
                [
                  ['router', 'Gateway / Router'],
                  ['switch', 'Switch Hub'],
                  ['ap', 'Access Point'],
                  ['firewall', 'Firewall'],
                  ['pc', 'PC / Laptop'],
                  ['server', 'Server / NAS'],
                  ['printer', 'Printer'],
                  ['camera', 'IP Camera']
                ] as const
              ).map(([type, label]) => {
                const Icon = getNodeIcon(type);
                return (
                  <button
                    key={type}
                    disabled={isReadOnly}
                    onClick={() => handleAddNode(type)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1 text-slate-700 transition disabled:opacity-50"
                  >
                    <Icon className="w-4 h-4 text-blue-600" />
                    <span className="text-[11px] font-medium text-center">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Node Attribute Inspector */}
          {selectedNode && (
            <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-md space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900">
                  คุณสมบัติอุปกรณ์ที่เลือก
                </span>
                {!isReadOnly && (
                  <button
                    onClick={() => handleDeleteNode(selectedNode.id)}
                    className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ลบ</span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  ชื่อ / Label อุปกรณ์:
                </label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={selectedNode.label}
                  onChange={(e) => handleUpdateSelectedNode('label', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  IP Address ที่วางแผน:
                </label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={selectedNode.ip || ''}
                  onChange={(e) => handleUpdateSelectedNode('ip', e.target.value)}
                  placeholder="เช่น 192.168.1.1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  หมายเหตุ / VLAN / Port:
                </label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={selectedNode.notes || ''}
                  onChange={(e) => handleUpdateSelectedNode('notes', e.target.value)}
                  placeholder="เช่น VLAN 10, PoE+, Floor 1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>

              {!isReadOnly && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleStartConnect(selectedNode.id)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      connectSourceId === selectedNode.id
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>
                      {connectSourceId === selectedNode.id
                        ? 'กำลังเลือกลิงก์... คลิกที่โหนดปลายทาง'
                        : 'สร้างเส้นเชื่อมต่อ (Connect Link)'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Links list */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>รายการลิงก์เชื่อมต่อ ({links.length})</span>
            </h4>
            <div className="max-h-36 overflow-y-auto space-y-1.5 text-xs pr-1">
              {links.map((link) => {
                const srcNode = nodes.find((n) => n.id === link.from);
                const dstNode = nodes.find((n) => n.id === link.to);
                return (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <span className="truncate max-w-[140px] text-slate-700">
                      {srcNode?.label || 'Node'} ➔ {dstNode?.label || 'Node'}
                    </span>
                    {!isReadOnly && (
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Canvas Area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">
                  พื้นที่วาดแผนผัง (Interactive Topology Canvas)
                </span>
                <span className="text-[11px] text-slate-500">
                  (คลิกลากอุปกรณ์ไปวางตำแหน่งที่ต้องการ)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                  title="ซูมออก"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-semibold text-slate-500 w-12 text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                  title="ซูมเข้า"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SVG Interactive Canvas */}
            <div
              ref={canvasRef}
              onMouseMove={handleMouseMoveCanvas}
              onMouseUp={handleMouseUpCanvas}
              className="relative w-full h-[450px] bg-slate-900 rounded-xl overflow-hidden cursor-crosshair select-none border border-slate-800"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #334155 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            >
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {links.map((link) => {
                  const src = nodes.find((n) => n.id === link.from);
                  const dst = nodes.find((n) => n.id === link.to);
                  if (!src || !dst) return null;

                  const x1 = (src.x + 60) * zoomLevel;
                  const y1 = (src.y + 35) * zoomLevel;
                  const x2 = (dst.x + 60) * zoomLevel;
                  const y2 = (dst.y + 35) * zoomLevel;
                  const midX = (x1 + x2) / 2;
                  const midY = (y1 + y2) / 2;

                  return (
                    <g key={link.id}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeDasharray={link.type === 'wireless' ? '5,5' : 'none'}
                        className="transition-all"
                      />
                      <rect
                        x={midX - 25}
                        y={midY - 9}
                        width="50"
                        height="18"
                        rx="4"
                        fill="#0f172a"
                        stroke="#334155"
                      />
                      <text
                        x={midX}
                        y={midY + 3}
                        fill="#94a3b8"
                        fontSize="9"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {link.label || 'Link'}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Render Nodes */}
              {nodes.map((node) => {
                const Icon = getNodeIcon(node.type);
                const isSelected = selectedNodeId === node.id;
                const isConnectSource = connectSourceId === node.id;

                return (
                  <div
                    key={node.id}
                    onMouseDown={(e) => handleMouseDownNode(e, node.id)}
                    className={`absolute rounded-xl p-2.5 text-white cursor-grab active:cursor-grabbing transition-shadow flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-600 ring-2 ring-white shadow-xl shadow-blue-500/40'
                        : isConnectSource
                        ? 'bg-amber-600 ring-2 ring-amber-300 shadow-xl'
                        : 'bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 shadow-md'
                    }`}
                    style={{
                      left: node.x * zoomLevel,
                      top: node.y * zoomLevel,
                      width: 120 * zoomLevel,
                      minHeight: 70 * zoomLevel,
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: 'top left'
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-4 h-4 text-blue-300 shrink-0" />
                      <span className="text-[11px] font-bold truncate leading-tight">
                        {node.label}
                      </span>
                    </div>

                    <div className="mt-1 font-mono text-[9px] text-blue-200 bg-slate-950/50 px-1.5 py-0.5 rounded truncate">
                      {node.ip || 'No IP'}
                    </div>

                    {node.notes && (
                      <div className="text-[8px] text-slate-300 truncate mt-0.5">
                        {node.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Optional Image Upload or Export */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium">
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>อัปโหลดภาพแผนผังเพิ่มเติม (PNG / JPG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isReadOnly}
                  />
                </label>
                {uploadedImageUrl && (
                  <span className="text-emerald-600 text-xs flex items-center gap-1">
                    ✓ แนบไฟล์ภาพแล้ว
                  </span>
                )}
              </div>
            </div>

            {uploadedImageUrl && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  ตัวอย่างภาพแผนผังที่อัปโหลดแนบ:
                </span>
                <img
                  src={uploadedImageUrl}
                  alt="Uploaded Topology"
                  className="max-h-60 rounded-lg border border-slate-300 object-contain mx-auto"
                />
              </div>
            )}
          </div>

          {/* Explanation Textarea */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              อธิบายแนวคิดการออกแบบแผนผังเครือข่าย (Design Concept & Architecture) *
            </label>
            <textarea
              disabled={isReadOnly}
              rows={4}
              required
              value={conceptExplanation}
              onChange={(e) => setConceptExplanation(e.target.value)}
              placeholder="อธิบายว่าเหตุใดจึงเลือกใช้ Topology แบบนี้ ตำแหน่งการวาง Router, Switch, Access Point, การแบ่งโซนเครือข่าย (Zoning) และทิศทางการไหลของข้อมูล (Traffic Flow)..."
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
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>ส่งงานด่าน 02 ให้ครูตรวจ</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

