import { User, Project } from '../types';

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
    if (raw) return JSON.parse(raw);
    const sess = sessionStorage.getItem(TEACHER_PROFILE_KEY);
    if (sess) return JSON.parse(sess);
  } catch (e) {
    console.error('Error reading teacher profile:', e);
  }
  return PRESET_TEACHER;
};

export const updateTeacherProfile = (profile: Partial<TeacherProfile>): TeacherProfile => {
  const current = getTeacherProfile();
  const updated: TeacherProfile = {
    ...current,
    ...profile,
    pin: profile.pin !== undefined ? String(profile.pin).trim() : current.pin,
    username: profile.username !== undefined ? String(profile.username).trim() : current.username,
    name: profile.name !== undefined ? String(profile.name).trim() : current.name
  };
  localStorage.setItem(TEACHER_PROFILE_KEY, JSON.stringify(updated));
  try {
    sessionStorage.setItem(TEACHER_PROFILE_KEY, JSON.stringify(updated));
  } catch {}
  window.dispatchEvent(new CustomEvent('teacher_profile_updated', { detail: updated }));
  return updated;
};
