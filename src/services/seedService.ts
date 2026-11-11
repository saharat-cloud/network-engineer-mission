import { supabase, isSupabaseConfigured } from './supabaseClient';
import { getStoredProjects, saveProjects, syncProjectToCloud } from './projectStorage';
import { getStoredAccounts, saveAccountLocally } from './accountService';
import { buildSampleProject, SAMPLE_ACCOUNT, SAMPLE_PROJECT_ID } from '../data/sampleProject';

/**
 * Ensure the completed sample project (นักเรียน "บี", bb / 123456) exists
 * locally and in Supabase. Existing data is never overwritten.
 */
export const ensureSampleData = async (): Promise<void> => {
  // ---- Local account ----
  const hasLocalAccount = getStoredAccounts().some(
    (a) => a.username.toLowerCase() === SAMPLE_ACCOUNT.username
  );
  if (!hasLocalAccount) {
    saveAccountLocally({
      username: SAMPLE_ACCOUNT.username,
      passwordHash: SAMPLE_ACCOUNT.password,
      fullName: SAMPLE_ACCOUNT.fullName,
      classroom: SAMPLE_ACCOUNT.classroom,
      nickname: 'บี',
      alias: '',
      email: '',
      createdAt: new Date().toISOString()
    });
  }

  // ---- Local project ----
  const projects = getStoredProjects();
  if (!projects.some((p) => p.id === SAMPLE_PROJECT_ID)) {
    saveProjects([...projects, buildSampleProject()]);
  }

  // ---- Cloud (insert only if missing) ----
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { data: acc } = await supabase
      .from('student_accounts')
      .select('username')
      .eq('username', SAMPLE_ACCOUNT.username)
      .maybeSingle();
    if (!acc) {
      await supabase.from('student_accounts').upsert({
        username: SAMPLE_ACCOUNT.username,
        password: SAMPLE_ACCOUNT.password,
        full_name: SAMPLE_ACCOUNT.fullName,
        classroom: SAMPLE_ACCOUNT.classroom,
        nickname: 'บี',
        alias: '',
        email: ''
      });
    }

    const { data: proj } = await supabase
      .from('projects')
      .select('id')
      .eq('id', SAMPLE_PROJECT_ID)
      .maybeSingle();
    if (!proj) {
      await syncProjectToCloud(buildSampleProject());
    }
  } catch (e) {
    console.warn('Could not seed sample data to cloud', e);
  }
};

