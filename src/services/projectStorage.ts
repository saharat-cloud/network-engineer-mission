import { Project } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { SCENARIOS, INITIAL_MISSION_DATA } from '../data/constants';

const LOCAL_STORAGE_KEY = 'nem_projects_data_v1';
const CURRENT_PROJECT_ID_KEY = 'nem_active_project_id';

// Read from Local Cache
export const getStoredProjects = (): Project[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read projects from storage', e);
    return [];
  }
};

export const saveProjects = (projects: Project[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects locally', e);
  }
};

// Sync with Supabase (Cloud)
export const syncProjectsFromCloud = async (): Promise<Project[]> => {
  if (!isSupabaseConfigured || !supabase) {
    return getStoredProjects();
  }

  try {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetch error, fallback to local:', error.message);
      return getStoredProjects();
    }

    if (data && data.length > 0) {
      const mapped: Project[] = data.map((row: any) => ({
        id: row.id,
        scenarioId: row.scenario_id,
        studentId: row.student_id,
        studentName: row.student_name,
        groupName: row.group_name,
        currentStage: row.current_stage,
        stageStatuses: row.stage_statuses,
        data: row.data,
        feedbackHistory: row.feedback_history,
        scores: row.scores,
        totalScore: row.total_score,
        isCompleted: row.is_completed,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));

      saveProjects(mapped);
      return mapped;
    }
  } catch (err) {
    console.error('Failed to sync projects from Supabase:', err);
  }

  return getStoredProjects();
};

export const syncProjectToCloud = async (project: Project): Promise<void> => {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    await supabase.from('projects').upsert({
      id: project.id,
      scenario_id: project.scenarioId,
      student_id: project.studentId,
      student_name: project.studentName,
      group_name: project.groupName,
      current_stage: project.currentStage,
      stage_statuses: project.stageStatuses,
      data: project.data,
      feedback_history: project.feedbackHistory,
      scores: project.scores,
      total_score: project.totalScore,
      is_completed: project.isCompleted,
      created_at: project.createdAt,
      updated_at: project.updatedAt
    });
  } catch (err) {
    console.error('Failed to upsert project to Supabase:', err);
  }
};

export const getProjectById = (id: string): Project | undefined => {
  const projects = getStoredProjects();
  return projects.find((p) => p.id === id);
};

export const updateProject = (project: Project): void => {
  const projects = getStoredProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  const updated: Project = { ...project, updatedAt: new Date().toISOString() };

  if (index !== -1) {
    projects[index] = updated;
  } else {
    projects.push(updated);
  }

  saveProjects(projects);
  // Asynchronous cloud sync
  syncProjectToCloud(updated);
};

export const createNewProject = (
  scenarioId: number,
  studentId: string,
  studentName: string,
  groupName: string
): Project => {
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
  const newProject: Project = {
    id: 'proj_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    scenarioId,
    studentId,
    studentName,
    groupName: groupName || `ทีม ${studentName}`,
    currentStage: 1,
    stageStatuses: {
      1: 'AVAILABLE',
      2: 'LOCKED',
      3: 'LOCKED',
      4: 'LOCKED',
      5: 'LOCKED',
      6: 'LOCKED',
      7: 'LOCKED'
    },
    data: {
      ...INITIAL_MISSION_DATA,
      m3_customer_budget: scenario.budgetEst
    },
    feedbackHistory: {
      1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []
    },
    scores: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0
    },
    totalScore: 0,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const projects = getStoredProjects();
  projects.push(newProject);
  saveProjects(projects);
  setActiveProjectId(newProject.id);

  // Sync to Supabase
  syncProjectToCloud(newProject);

  return newProject;
};

export const getActiveProjectId = (): string | null => {
  return localStorage.getItem(CURRENT_PROJECT_ID_KEY);
};

export const setActiveProjectId = (id: string): void => {
  localStorage.setItem(CURRENT_PROJECT_ID_KEY, id);
};

// Teacher Review Actions
export const approveStage = (
  projectId: string,
  stage: number,
  score: number,
  feedback: string,
  reviewerName: string = 'อ.กิตติศักดิ์ พูลสวัสดิ์'
): Project | undefined => {
  const project = getProjectById(projectId);
  if (!project) return undefined;

  project.stageStatuses[stage] = 'COMPLETED';
  project.scores[stage] = score;

  if (stage < 7) {
    if (project.stageStatuses[stage + 1] === 'LOCKED') {
      project.stageStatuses[stage + 1] = 'AVAILABLE';
    }
    project.currentStage = Math.max(project.currentStage, stage + 1);
  } else if (stage === 7) {
    project.isCompleted = true;
  }

  project.totalScore = Object.values(project.scores).reduce((a, b) => a + (b || 0), 0);

  if (!project.feedbackHistory[stage]) {
    project.feedbackHistory[stage] = [];
  }
  project.feedbackHistory[stage].push({
    stage,
    status: 'APPROVED',
    feedback: feedback || 'ผ่านเกณฑ์เรียบร้อย อนุญาตให้ไปต่อด่านถัดไปได้ครับ',
    score,
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewerName
  });

  updateProject(project);
  return project;
};

export const requestRevisionStage = (
  projectId: string,
  stage: number,
  feedback: string,
  reviewerName: string = 'อ.กิตติศักดิ์ พูลสวัสดิ์'
): Project | undefined => {
  const project = getProjectById(projectId);
  if (!project) return undefined;

  project.stageStatuses[stage] = 'REVISION';

  if (!project.feedbackHistory[stage]) {
    project.feedbackHistory[stage] = [];
  }
  project.feedbackHistory[stage].push({
    stage,
    status: 'REVISION',
    feedback: feedback || 'กรุณาแก้ไขรายละเอียดเพิ่มเติมตามที่ระบุ แล้วกดส่งงานอีกครั้ง',
    score: 0,
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewerName
  });

  updateProject(project);
  return project;
};
