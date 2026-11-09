import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface StudentAccount {
  username: string;
  passwordHash: string; // Plain/hashed for student classroom context
  fullName: string;
  classroom: string;
  createdAt: string;
}

const ACCOUNTS_STORAGE_KEY = 'nem_student_accounts_v1';

export const getStoredAccounts = (): StudentAccount[] => {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read accounts', e);
    return [];
  }
};

export const saveAccountLocally = (account: StudentAccount): void => {
  const accounts = getStoredAccounts();
  const existingIdx = accounts.findIndex((a) => a.username.toLowerCase() === account.username.toLowerCase());
  if (existingIdx !== -1) {
    accounts[existingIdx] = account;
  } else {
    accounts.push(account);
  }
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
};

// Register Account
export const registerStudentAccount = async (
  username: string,
  password: string,
  fullName: string,
  classroom: string
): Promise<{ success: boolean; message?: string }> => {
  const cleanUsername = username.trim().toLowerCase();
  const accounts = getStoredAccounts();

  if (accounts.some((a) => a.username.toLowerCase() === cleanUsername)) {
    return { success: false, message: 'ชื่อผู้ใช้นี้ (Username) ถูกใช้งานแล้ว กรุณาใช้ชื่ออื่น' };
  }

  const newAccount: StudentAccount = {
    username: cleanUsername,
    passwordHash: password.trim(),
    fullName: fullName.trim(),
    classroom: classroom.trim(),
    createdAt: new Date().toISOString()
  };

  saveAccountLocally(newAccount);

  // Sync to Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('student_accounts').upsert({
        username: newAccount.username,
        password: newAccount.passwordHash,
        full_name: newAccount.fullName,
        classroom: newAccount.classroom,
        created_at: newAccount.createdAt
      });
    } catch (err) {
      console.warn('Could not sync student account to Supabase:', err);
    }
  }

  return { success: true };
};

// Login Account
export const authenticateStudent = async (
  username: string,
  password: string
): Promise<{ success: boolean; account?: StudentAccount; message?: string }> => {
  const cleanUsername = username.trim().toLowerCase();
  const cleanPassword = password.trim();

  // Try cloud first if available
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('student_accounts')
        .select('*')
        .eq('username', cleanUsername)
        .eq('password', cleanPassword)
        .maybeSingle();

      if (data && !error) {
        const cloudAcc: StudentAccount = {
          username: data.username,
          passwordHash: data.password,
          fullName: data.full_name,
          classroom: data.classroom,
          createdAt: data.created_at
        };
        saveAccountLocally(cloudAcc);
        return { success: true, account: cloudAcc };
      }
    } catch (e) {
      console.warn('Cloud login check failed, falling back to local');
    }
  }

  // Fallback to local
  const accounts = getStoredAccounts();
  const found = accounts.find(
    (a) => a.username.toLowerCase() === cleanUsername && a.passwordHash === cleanPassword
  );

  if (found) {
    return { success: true, account: found };
  }

  return { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง หรือยังไม่ได้สมัครสมาชิก' };
};
