import React, { useState, useEffect } from 'react';
import { User, Project, Scenario } from './types';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';
import { ScenariosView } from './components/ScenariosView';
import { MissionMapView } from './components/MissionMapView';
import { Stage01Analysis } from './components/Stage01Analysis';
import { Stage02Topology } from './components/Stage02Topology';
import { Stage03Budget } from './components/Stage03Budget';
import { Stage04Tools } from './components/Stage04Tools';
import { Stage05Planning } from './components/Stage05Planning';
import { Stage06Config } from './components/Stage06Config';
import { Stage07Final } from './components/Stage07Final';
import { TeacherPortal } from './components/TeacherPortal';
import { ProfileModal } from './components/ProfileModal';
import { TeacherProfileModal } from './components/TeacherProfileModal';
import { UpdateNotificationBanner } from './components/UpdateNotificationBanner';
import { 
  getStoredProjects, 
  getProjectById, 
  updateProject, 
  setActiveProjectId, 
  createNewProject,
  syncProjectsFromCloud
} from './services/projectStorage';
import { getSession, setSession, clearSession, getTeacherProfile, TeacherProfile } from './services/authService';
import { SCENARIOS } from './data/constants';

export const App: React.FC = () => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return getSession().user;
  });

  const [activeProject, setActiveProject] = useState<Project | null>(() => {
    const sess = getSession();
    if (sess.activeProjectId) {
      const p = getProjectById(sess.activeProjectId);
      if (p) return p;
    }
    const all = getStoredProjects();
    return all[0] || null;
  });

  const [currentView, setCurrentView] = useState<string>('home');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isTeacherProfileModalOpen, setIsTeacherProfileModalOpen] = useState(false);

  // Bottom Center Update Notification Banner State
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [updateBannerMessage, setUpdateBannerMessage] = useState('มีการอัปเดตข้อมูลหรือผลตรวจใหม่');

  // Keep session in sync
  useEffect(() => {
    setSession({
      user: currentUser,
      activeProjectId: activeProject?.id || null
    });
  }, [currentUser, activeProject]);

  // Periodic polling & cross-tab storage detection for changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nem_projects_data_v1' || e.key === 'nem_teacher_profile_v1') {
        setShowUpdateBanner(true);
        setUpdateBannerMessage('ตรวจพบการเปลี่ยนแปลงข้อมูลจากเซิร์ฟเวอร์หรือหน้าต่างอื่น');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also poll cloud/local state every 10 seconds to check for new approvals or submissions
    const interval = setInterval(async () => {
      if (activeProject && currentUser?.role === 'student') {
        const fresh = getProjectById(activeProject.id);
        if (fresh && fresh.updatedAt !== activeProject.updatedAt) {
          setShowUpdateBanner(true);
          const lastFeedback = Object.values(fresh.feedbackHistory).flat().slice(-1)[0];
          if (lastFeedback) {
            setUpdateBannerMessage(`อาจารย์ตรวจงานด่าน ${lastFeedback.stage} แล้ว (${lastFeedback.status === 'APPROVED' ? 'ผ่านแล้ว' : 'ส่งกลับแก้ไข'})`);
          } else {
            setUpdateBannerMessage('ข้อมูลภารกิจได้รับการอัปเดต');
          }
        }
      }
    }, 8000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [activeProject, currentUser]);

  const handleRefreshData = () => {
    window.location.reload();
  };

  const handleLoginSuccess = (user: User, proj?: Project) => {
    setCurrentUser(user);
    if (user.role === 'teacher') {
      setCurrentView('teacher');
    } else {
      if (proj) {
        setActiveProject(proj);
        setActiveProjectId(proj.id);
      }
      setCurrentView('map');
    }
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setCurrentView('home');
  };

  const handleTeacherProfileUpdated = (updatedTeacher: TeacherProfile) => {
    if (currentUser && currentUser.role === 'teacher') {
      const updatedUser: User = {
        ...currentUser,
        name: updatedTeacher.name,
        email: updatedTeacher.email
      };
      setCurrentUser(updatedUser);
      setSession({
        user: updatedUser,
        activeProjectId: null
      });
    }
  };

  const handleSelectScenario = (sc: Scenario) => {
    if (currentUser?.role === 'teacher') {
      alert('คุณกำลังอยู่ในบทบาทครูผู้สอน');
      return;
    }

    if (activeProject && activeProject.scenarioId === sc.id) {
      setCurrentView('map');
      return;
    }

    const newProj = createNewProject(
      sc.id,
      currentUser?.id || 'STD-' + Math.floor(1000 + Math.random() * 9000),
      currentUser?.name || 'นักศึกษาผู้เข้าอบรม',
      currentUser?.groupName || `ทีม ${sc.title.split(' ')[0]}`
    );
    setActiveProject(newProj);
    setCurrentView('stage-1');
  };

  const handleSaveStageData = (stageNum: number, partialData: Partial<Project['data']>) => {
    if (!activeProject) return;
    const updated: Project = {
      ...activeProject,
      data: { ...activeProject.data, ...partialData },
      stageStatuses: {
        ...activeProject.stageStatuses,
        [stageNum]: activeProject.stageStatuses[stageNum] === 'LOCKED' ? 'IN_PROGRESS' : activeProject.stageStatuses[stageNum]
      }
    };
    updateProject(updated);
    setActiveProject(updated);
  };

  const handleSubmitStage = (stageNum: number, partialData: Partial<Project['data']>) => {
    if (!activeProject) return;
    const updated: Project = {
      ...activeProject,
      data: { ...activeProject.data, ...partialData },
      stageStatuses: {
        ...activeProject.stageStatuses,
        [stageNum]: 'SUBMITTED' // Await teacher approval
      }
    };
    updateProject(updated);
    setActiveProject(updated);
    alert(`ส่งผลงานด่าน ${stageNum} เรียบร้อยแล้ว! งานจะถูกส่งต่อไปยัง Teacher Portal เพื่อให้อาจารย์ตรวจสอบ`);
    setCurrentView('map');
  };

  // IF NOT LOGGED IN -> FORCE LOGIN SCREEN FIRST
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const currentScenario = SCENARIOS.find((s) => s.id === activeProject?.scenarioId) || SCENARIOS[0];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <Navbar
        currentUser={currentUser}
        activeProject={currentUser.role === 'student' ? activeProject : null}
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'teacher' && currentUser.role !== 'teacher') {
            return;
          }
          setCurrentView(view);
        }}
        onSwitchUser={handleLogout}
        onOpenProfile={() => {
          if (currentUser.role === 'teacher') {
            setIsTeacherProfileModalOpen(true);
          } else {
            setIsProfileModalOpen(true);
          }
        }}
        onSelectProject={(proj) => {
          setActiveProject(proj);
          setActiveProjectId(proj.id);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TEACHER EXCLUSIVE VIEW */}
        {currentUser.role === 'teacher' ? (
          <TeacherPortal
            onSelectProjectForView={(proj) => {
              setActiveProject(proj);
              setActiveProjectId(proj.id);
              setCurrentView('map');
            }}
            onTeacherProfileUpdated={handleTeacherProfileUpdated}
          />
        ) : (
          /* STUDENT EXCLUSIVE VIEWS */
          <>
            {currentView === 'home' && (
              <LandingPage
                onStartMission={() => {
                  if (activeProject) setCurrentView('map');
                  else setCurrentView('scenarios');
                }}
                onExploreScenarios={() => setCurrentView('scenarios')}
              />
            )}

            {currentView === 'scenarios' && (
              <ScenariosView
                activeProject={activeProject}
                onSelectScenario={handleSelectScenario}
              />
            )}

            {currentView === 'map' && activeProject && (
              <MissionMapView
                project={activeProject}
                onOpenStage={(stageNum) => setCurrentView(`stage-${stageNum}`)}
              />
            )}

            {currentView === 'stage-1' && activeProject && (
              <Stage01Analysis
                project={activeProject}
                scenario={currentScenario}
                onSave={(data) => handleSaveStageData(1, data)}
                onSubmitStage={(data) => handleSubmitStage(1, data)}
                onBackToMap={() => setCurrentView('map')}
              />
            )}

            {currentView === 'stage-2' && activeProject && (
              <Stage02Topology
                project={activeProject}
                onSave={(data) => handleSaveStageData(2, data)}
                onSubmitStage={(data) => handleSubmitStage(2, data)}
                onBackToMap={() => setCurrentView('map')}
              />
            )}

            {currentView === 'stage-3' && activeProject && (
              <Stage03Budget
                project={activeProject}
                scenario={currentScenario}
                onSave={(data) => handleSaveStageData(3, data)}
                onSubmitStage={(data) => handleSubmitStage(3, data)}
                onBackToMap={() => setCurrentView('map')}
              />
            )}

            {currentView === 'stage-4' && activeProject && (
              <Stage04Tools
                project={activeProject}
                scenario={currentScenario}
                onSave={(data) => handleSaveStageData(4, data)}
                onSubmitStage={(data) => handleSubmitStage(4, data)}
                onBackToMap={() => setCurrentView('map')}
              />
            )}

            {currentView === 'stage-5' && activeProject && (
              <Stage05Planning
                project={activeProject}
                scenario={currentScenario}
                onSave={(data) => handleSaveStageData(5, data)}
                onSubmitStage={(data) => handleSubmitStage(5, data)}
                onBackToMap={() => setCurrentView('map')}
              />
            )}

            {currentView === 'stage-6' && activeProject && (
              <Stage06Config
                project={activeProject}
                scenario={currentScenario}
                onSave={(data) => handleSaveStageData(6, data)}
                onSubmitStage={(data) => handleSubmitStage(6, data)}
                onBackToMap={() => setCurrentView('map')}
              />
            )}

            {currentView === 'stage-7' && activeProject && (
              <Stage07Final
                project={activeProject}
                scenario={currentScenario}
                onSave={(data) => handleSaveStageData(7, data)}
                onSubmitProject={(data) => handleSubmitStage(7, data)}
                onBackToMap={() => setCurrentView('map')}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">NETWORK ENGINEER MISSION</span>
            <span>• ระบบแพลตฟอร์มฝึกวิเคราะห์ ออกแบบ และติดตั้งระบบเครือข่ายคอมพิวเตอร์</span>
          </div>
          <div className="text-slate-500">
            {currentUser.role === 'teacher' ? `🔒 กำลังทำงานในโหมด: อาจารย์ผู้ตรวจ (${currentUser.name})` : `👤 กำลังทำงานในโหมด: นักเรียน (${currentUser.nickname || currentUser.name})`}
          </div>
        </div>
      </footer>

      {/* Student Profile Settings Modal */}
      {currentUser.role === 'student' && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={currentUser}
          activeProject={activeProject}
          onUpdateUser={(updated) => setCurrentUser(updated)}
        />
      )}

      {/* Teacher Profile Settings Modal */}
      {currentUser.role === 'teacher' && (
        <TeacherProfileModal
          isOpen={isTeacherProfileModalOpen}
          onClose={() => setIsTeacherProfileModalOpen(false)}
          onProfileUpdated={handleTeacherProfileUpdated}
        />
      )}

      {/* Floating Bottom Center Update Notification Banner */}
      <UpdateNotificationBanner
        show={showUpdateBanner}
        message={updateBannerMessage}
        onRefresh={handleRefreshData}
        onDismiss={() => setShowUpdateBanner(false)}
      />
    </div>
  );
};

export default App;
