import { createClient } from '@supabase/supabase-js';

// Environment variables can be configured via .env file:
// VITE_SUPABASE_URL=https://your-project.supabase.co
// VITE_SUPABASE_ANON_KEY=your-anon-key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseUrl.startsWith('https://')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * SQL Schema for Supabase Setup:
 * 
 * -- 1. Projects Table
 * create table if not exists projects (
 *   id text primary key,
 *   scenario_id integer not null,
 *   student_id text not null,
 *   student_name text not null,
 *   group_name text,
 *   current_stage integer default 1,
 *   stage_statuses jsonb not null,
 *   data jsonb not null,
 *   feedback_history jsonb not null,
 *   scores jsonb not null,
 *   total_score integer default 0,
 *   is_completed boolean default false,
 *   created_at timestamp with time zone default timezone('utc'::text, now()),
 *   updated_at timestamp with time zone default timezone('utc'::text, now())
 * );
 * 
 * -- 2. Storage Bucket for Topology & Testing Screenshots
 * -- In Supabase dashboard: Create bucket named 'mission-evidence' (public or signed URLs)
 */

