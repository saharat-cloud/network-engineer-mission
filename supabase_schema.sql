-- ==============================================================================
-- NETWORK ENGINEER MISSION: DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- รองรับระบบการเรียนการสอนรายวิชาระบบเครือข่ายคอมพิวเตอร์
-- ==============================================================================

-- 1. ตารางเก็บข้อมูลโครงการของนักเรียน (Projects Table)
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    scenario_id INTEGER NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    group_name TEXT NOT NULL,
    current_stage INTEGER DEFAULT 1,
    stage_statuses JSONB NOT NULL DEFAULT '{"1":"AVAILABLE","2":"LOCKED","3":"LOCKED","4":"LOCKED","5":"LOCKED","6":"LOCKED","7":"LOCKED"}'::jsonb,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    feedback_history JSONB NOT NULL DEFAULT '{"1":[],"2":[],"3":[],"4":[],"5":[],"6":[],"7":[]}'::jsonb,
    scores JSONB NOT NULL DEFAULT '{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0}'::jsonb,
    total_score INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- Index สำหรับค้นหาตาม student_id และ scenario_id
CREATE INDEX IF NOT EXISTS idx_projects_student_id ON public.projects(student_id);
CREATE INDEX IF NOT EXISTS idx_projects_scenario_id ON public.projects(scenario_id);

-- 2. ฟังก์ชันอัปเดต timestamp อัตโนมัติเมื่อมีการแก้ไขข้อมูล
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_projects_updated_at ON public.projects;
CREATE TRIGGER trigger_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 3. เปิดใช้งาน Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 4. กำหนดนโยบายความปลอดภัย (RLS Policies)
-- ทุกคนสามารถอ่านข้อมูลโครงการได้ (สำหรับครูตรวจงาน และนักเรียนดูความคืบหน้า)
CREATE POLICY "Public Read Access"
ON public.projects FOR SELECT
USING (true);

-- อนุญาตให้นักเรียนและครูสามารถสร้างและแก้ไขโครงการได้
CREATE POLICY "Public Insert Access"
ON public.projects FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public Update Access"
ON public.projects FOR UPDATE
USING (true)
WITH CHECK (true);

-- 5. คำแนะนำสำหรับการตั้งค่า Storage Bucket สำหรับจัดเก็บไฟล์แนบ (Screenshots & Topology Files)
-- ไปที่ Supabase Dashboard -> Storage -> Create New Bucket:
-- 1) Bucket Name: mission-evidence
-- 2) Public Bucket: ON (Checked)

