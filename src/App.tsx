import React, { useState, useEffect } from 'react';
import { User, Project, Scenario } from './types';
import { Navbar } from './components/Navbar';
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
import { AuthModal } from './components/AuthModal';
import { 
  getStoredProjects, 
  getProjectById, 
  updateProject, 
  getActiveProjectId, 
  setActiveProjectId, 
  createNewProject 
} from './services/projectStorage';
import { SCENARIOS } from './data/constants';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Default initial user for instant interaction
    return {
      id: 'STD-6601',
      name: 'นายธนกร พรสิริ',
      role: 'student',
      email: 'thanakorn@school.ac.th',
      groupName: 'CyberShield Studio'
    };
  });

  const [activeProject, setActiveProject] = useState<Project | null>(() => {
    const activeId = getActiveProjectId();
    if (activeId) {
      const found = getProjectById(activeId);
      if (found) return found;
    }
    const all = getStoredProjects();
    return all[0] || null;
  });

  const [currentView, setCurrentView] = useState<string>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Sync active project if changed
  const refreshProject = () => {
    if (activeProject) {
      const fresh = getProjectById(activeProject.id);
      if (fresh) setActiveProject(fresh);
    }
  };

  const handleSelectScenario = (sc: Scenario) => {
    if (currentUser?.role === 'teacher') {
      alert('คุณกำลังอยู่ในบทบาทครู กรุณาสลับเป็นนักเรียนเพื่อสร้างโครงการ');
      setIsAuthModalOpen(true);
      return;
    }

    if (activeProject && activeProject.scenarioId === sc.id) {
      setCurrentView('map');
      return;
    }

    // Create or switch project
    const newProj = createNewProject(
      sc.id,
      currentUser?.id || 'STD-' + Math.floor(1000 + Math.random() * 9000),
      currentUser?.name || 'นักศึกษาผู้เข้าอบรม',
      currentUser?.groupName || `ทีมไอที ${sc.title.split(' ')[0]}`
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
    alert(`ส่งผลงานด่าน ${stageNum} เรียบร้อยแล้ว! ครูผู้สอนจะทำการตรวจสอบและอนุมัติผ่านระบบ`);
    setCurrentView('map');
  };

  const currentScenario = SCENARIOS.find((s) => s.id === activeProject?.scenarioId) || SCENARIOS[0];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Header - Strict NO Sidebar Requirement */}
      <Navbar
        currentUser={currentUser}
        activeProject={activeProject}
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onSwitchUser={() => setIsAuthModalOpen(true)}
        onSelectProject={(proj) => {
          setActiveProject(proj);
          setActiveProjectId(proj.id);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

        {/* Stage 1 */}
        {currentView === 'stage-1' && activeProject && (
          <Stage01Analysis
            project={activeProject}
            scenario={currentScenario}
            onSave={(data) => handleSaveStageData(1, data)}
            onSubmitStage={(data) => handleSubmitStage(1, data)}
            onBackToMap={() => setCurrentView('map')}
          />
        )}

        {/* Stage 2 */}
        {currentView === 'stage-2' && activeProject && (
          <Stage02Topology
            project={activeProject}
            onSave={(data) => handleSaveStageData(2, data)}
            onSubmitStage={(data) => handleSubmitStage(2, data)}
            onBackToMap={() => setCurrentView('map')}
          />
        )}

        {/* Stage 3 */}
        {currentView === 'stage-3' && activeProject && (
          <Stage03Budget
            project={activeProject}
            scenario={currentScenario}
            onSave={(data) => handleSaveStageData(3, data)}
            onSubmitStage={(data) => handleSubmitStage(3, data)}
            onBackToMap={() => setCurrentView('map')}
          />
        )}

        {/* Stage 4 */}
        {currentView === 'stage-4' && activeProject && (
          <Stage04Tools
            project={activeProject}
            scenario={currentScenario}
            onSave={(data) => handleSaveStageData(4, data)}
            onSubmitStage={(data) => handleSubmitStage(4, data)}
            onBackToMap={() => setCurrentView('map')}
          />
        )}

        {/* Stage 5 */}
        {currentView === 'stage-5' && activeProject && (
          <Stage05Planning
            project={activeProject}
            scenario={currentScenario}
            onSave={(data) => handleSaveStageData(5, data)}
            onSubmitStage={(data) => handleSubmitStage(5, data)}
            onBackToMap={() => setCurrentView('map')}
          />
        )}

        {/* Stage 6 */}
        {currentView === 'stage-6' && activeProject && (
          <Stage06Config
            project={activeProject}
            scenario={currentScenario}
            onSave={(data) => handleSaveStageData(6, data)}
            onSubmitStage={(data) => handleSubmitStage(6, data)}
            onBackToMap={() => setCurrentView('map')}
          />
        )}

        {/* Stage 7 */}
        {currentView === 'stage-7' && activeProject && (
          <Stage07Final
            project={activeProject}
            scenario={currentScenario}
            onSave={(data) => handleSaveStageData(7, data)}
            onSubmitProject={(data) => handleSubmitStage(7, data)}
            onBackToMap={() => setCurrentView('map')}
          />
        )}

        {/* Teacher Portal */}
        {currentView === 'teacher' && (
          <TeacherPortal
            onSelectProjectForView={(proj) => {
              setActiveProject(proj);
              setActiveProjectId(proj.id);
              setCurrentView('map');
            }}
          />
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
            Mission-Based Learning & Project-Based Engineering Platform
          </div>
        </div>
      </footer>

      {/* User / Project Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={(user) => setCurrentUser(user)}
        onSelectProject={(proj) => {
          setActiveProject(proj);
          setActiveProjectId(proj.id);
          setCurrentView('map');
        }}
      />
    </div>
  );
};
export default App;

