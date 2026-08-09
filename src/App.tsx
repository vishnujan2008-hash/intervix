import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InterviewProvider, useInterview } from './context/InterviewContext';
import { EngineProvider } from './context/EngineContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Footer } from './components/Footer';
import { SettingsModal } from './components/SettingsModal';
import { DemoController } from './components/DemoController';

import { SplashScreen } from './screens/SplashScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { CandidateSelectionScreen } from './screens/CandidateSelectionScreen';
import { InterviewConfigurationScreen } from './screens/InterviewConfigurationScreen';
import { InterviewSessionScreen } from './screens/InterviewSessionScreen';
import { InterviewSummaryScreen } from './screens/InterviewSummaryScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { NotFoundScreen } from './screens/NotFoundScreen';

import { LayoutDashboard, Mic, Users, History as HistoryIcon, BarChart3 } from 'lucide-react';
import { ScreenRoute } from './types';

const MainContent: React.FC = () => {
  const { currentRoute, navigateTo } = useInterview();

  if (currentRoute === 'splash') {
    return (
      <>
        <DemoController />
        <SplashScreen />
      </>
    );
  }
  if (currentRoute === 'welcome') {
    return (
      <>
        <DemoController />
        <WelcomeScreen />
      </>
    );
  }

  const mobileNavItems: { route: ScreenRoute; label: string; icon: React.ElementType }[] = [
    { route: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { route: 'interview-session', label: 'Session', icon: Mic },
    { route: 'candidate-selection', label: 'Candidates', icon: Users },
    { route: 'history', label: 'History', icon: HistoryIcon },
    { route: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const renderScreen = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'candidate-selection':
        return <CandidateSelectionScreen />;
      case 'interview-config':
        return <InterviewConfigurationScreen />;
      case 'interview-session':
        return <InterviewSessionScreen />;
      case 'interview-summary':
        return <InterviewSummaryScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <NotFoundScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-enterprise-mesh text-white flex flex-col font-sans selection:bg-blue-500/30">
      {/* Top Floating Demo Mode Controller */}
      <DemoController />

      {/* Desktop Left Sidebar (Hidden on mobile) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Container Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        <TopBar />

        {/* Dynamic Screen Area with Framer Motion Route Transitions */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRoute}
              initial={{ opacity: 0, y: 8, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.995 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#050507]/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-2 z-40">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.route;
          return (
            <button
              key={item.route}
              onClick={() => navigateTo(item.route)}
              className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-blue-400 font-bold' : 'text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-mono">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Global Settings Modal */}
      <SettingsModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <InterviewProvider>
      <EngineProvider>
        <MainContent />
      </EngineProvider>
    </InterviewProvider>
  );
};

export default App;
