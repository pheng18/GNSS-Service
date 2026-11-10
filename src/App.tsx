import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { RepairsView } from './views/RepairsView';
import { ProjectsView } from './views/ProjectsView';
import { CorsView } from './views/CorsView';
import { EquipmentView } from './views/EquipmentView';
import { QuotationsView } from './views/QuotationsView';
import { ProfileView } from './views/ProfileView';
import { testFirestoreConnection } from './firebase';

export const AppContent: React.FC = () => {
  const { user, currentView } = useApp();
  const [quotaExceeded, setQuotaExceeded] = React.useState(false);

  useEffect(() => {
    const handler = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handler);
    return () => window.removeEventListener('gmp-quota-exceeded', handler);
  }, []);

  useEffect(() => {
    testFirestoreConnection().catch((err) => {
      console.warn("Firebase connection test:", err);
    });
  }, []);

  if (!user) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-5 sm:px-6">
        {currentView === 'dashboard' && <DashboardView />}
        {(currentView === 'repairs' || currentView === 'repair_details') && (
          <RepairsView />
        )}
        {(currentView === 'projects' || currentView === 'project_details') && (
          <ProjectsView />
        )}
        {currentView === 'cors' && <CorsView />}
        {currentView === 'equipment' && <EquipmentView />}
        {(currentView === 'quotations' ||
          currentView === 'quotation_details') && <QuotationsView />}
        {currentView === 'profile' && <ProfileView />}
      </main>
      <BottomNav />
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
