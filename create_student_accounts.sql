-- ==============================================================================
-- ตารางเก็บข้อมูลบัญชีผู้ใช้ของนักเรียน (Student Accounts)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.student_accounts (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    classroom TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

ALTER TABLE public.student_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow Public Access to student_accounts" 
ON public.student_accounts FOR ALL 
USING (true) 
WITH CHECK (true);

