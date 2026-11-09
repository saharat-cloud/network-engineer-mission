import { User, Project } from '../types';

export interface AuthSession {
  user: User | null;
  activeProjectId: string | null;
}

const SESSION_KEY = 'nem_active_session_auth';

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

// Demo/Default accounts credentials for instant classroom use
export const PRESET_TEACHER = {
  username: 'teacher',
  pin: '1234',
  name: 'อ.กิตติศักดิ์ พูลสวัสดิ์',
  email: 'kittisak.p@school.ac.th',
  schoolName: 'วิทยาลัยเทคนิค / สถานศึกษา'
};

