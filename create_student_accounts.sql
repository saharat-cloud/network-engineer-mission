-- ==============================================================================
-- ตารางเก็บข้อมูลบัญชีผู้ใช้ของนักเรียน (Student Accounts) ใน Supabase
-- คัดลอกคำสั่งทั้งหมดนี้ไปรันใน Supabase -> SQL Editor ได้เลย
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.student_accounts (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    classroom TEXT NOT NULL,
    nickname TEXT DEFAULT '',
    alias TEXT DEFAULT '',
    email TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- เพิ่มคอลัมน์ให้อัตโนมัติหากตารางถูกสร้างไว้ก่อนหน้านี้
ALTER TABLE public.student_accounts ADD COLUMN IF NOT EXISTS nickname TEXT DEFAULT '';
ALTER TABLE public.student_accounts ADD COLUMN IF NOT EXISTS alias TEXT DEFAULT '';
ALTER TABLE public.student_accounts ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '';

-- เปิดใช้งาน RLS (Row Level Security)
ALTER TABLE public.student_accounts ENABLE ROW LEVEL SECURITY;

-- อนุญาตให้นักเรียนและระบบสามารถอ่าน/เขียนได้
DROP POLICY IF EXISTS "Allow Public Access to student_accounts" ON public.student_accounts;
CREATE POLICY "Allow Public Access to student_accounts" 
ON public.student_accounts FOR ALL 
USING (true) 
WITH CHECK (true);
