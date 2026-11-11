import { User } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface AuthSession {
  user: User | null;
  activeProjectId: string | null;
}

const SESSION_KEY = 'nem_active_session_auth';
const TEACHER_PROFILE_KEY = 'nem_teacher_profile_v1';

export const getSession = (): AuthSession => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return { user: null, activeProjectId: null };
    return JSON.parse(raw);
  } catch {
    return { user: null, activeProjectId: null };
  }
};

export const setSession = (session: AuthSession): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export interface TeacherProfile {
  username: string;
  pin: string;
  name: string;
  email: string;
  schoolName: string;
}

export const PRESET_TEACHER: TeacherProfile = {
  username: 'teacher',
  pin: '1234',
  name: 'อ.กิตติศักดิ์ พูลสวัสดิ์',
  email: 'kittisak.p@school.ac.th',
  schoolName: 'วิทยาลัยเทคนิค / สถานศึกษา'
};

export const getTeacherProfile = (): TeacherProfile => {
  try {
    const raw = localStorage.getItem(TEACHER_PROFILE_KEY);
    if (raw) return { ...PRESET_TEACHER, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error reading teacher profile:', e);
  }
  return PRESET_TEACHER;
};

const saveTeacherProfileLocally = (profile: TeacherProfile): void => {
  localStorage.setItem(TEACHER_PROFILE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new CustomEvent('teacher_profile_updated', { detail: profile }));
};

// Teacher account is stored in Supabase (student_accounts table, reserved row)
// so the password is the same on every device / browser / port.
export const TEACHER_CLOUD_USERNAME = '__teacher__';

export const fetchTeacherProfileFromCloud = async (): Promise<TeacherProfile | null> => {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('student_accounts')
      .select('*')
      .eq('username', TEACHER_CLOUD_USERNAME)
      .maybeSingle();
    if (error || !data) return null;
    const profile: TeacherProfile = {
      username: data.nickname || PRESET_TEACHER.username,
      pin: data.password || PRESET_TEACHER.pin,
      name: data.full_name || PRESET_TEACHER.name,
      email: data.email || '',
      schoolName: data.classroom || ''
    };
    saveTeacherProfileLocally(profile);
    return profile;
  } catch (e) {
    console.warn('Could not load teacher profile from cloud', e);
    return null;
  }
};

/** Latest teacher profile: cloud first, local fallback */
export const loadTeacherProfile = async (): Promise<TeacherProfile> => {
  return (await fetchTeacherProfileFromCloud()) || getTeacherProfile();
};

export const updateTeacherProfile = async (
  profile: Partial<TeacherProfile>
): Promise<{ profile: TeacherProfile; cloudSaved: boolean }> => {
  const current = getTeacherProfile();
  const updated: TeacherProfile = {
    ...current,
    ...profile,
    pin: profile.pin !== undefined ? String(profile.pin).trim() : current.pin,
    username: profile.username !== undefined ? String(profile.username).trim() : current.username,
    name: profile.name !== undefined ? String(profile.name).trim() : current.name
  };
  saveTeacherProfileLocally(updated);

  let cloudSaved = false;
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('student_accounts').upsert({
        username: TEACHER_CLOUD_USERNAME,
        password: updated.pin,
        full_name: updated.name,
        classroom: updated.schoolName || '-',
        nickname: updated.username,
        alias: 'teacher',
        email: updated.email || ''
      });
      cloudSaved = !error;
      if (error) console.warn('Teacher profile cloud save error:', error.message);
    } catch (e) {
      console.warn('Could not save teacher profile to cloud', e);
    }
  }
  return { profile: updated, cloudSaved };
};
