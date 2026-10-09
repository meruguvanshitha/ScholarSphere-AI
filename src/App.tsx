/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ScholarshipDiscovery } from './components/ScholarshipDiscovery';
import { StudentDashboard } from './components/StudentDashboard';
import { ApplicationTracker } from './components/ApplicationTracker';
import { ScholarshipAssistant } from './components/ScholarshipAssistant';
import { AdminPortal } from './components/AdminPortal';
import { ScholarshipDetailModal } from './components/ScholarshipDetailModal';
import { ComparisonDrawer } from './components/ComparisonDrawer';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { DemoTourModal } from './components/DemoTourModal';
import { MernArchitectureModal } from './components/MernArchitectureModal';
import { Scholarship } from './types';

function MainApp() {
  const { user, profile, switchDemoUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'discovery' | 'dashboard' | 'tracker' | 'assistant' | 'admin'>('home');

  // Modals state
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isDemoTourOpen, setIsDemoTourOpen] = useState<boolean>(false);
  const [isMernArchitectureOpen, setIsMernArchitectureOpen] = useState<boolean>(false);
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  const [advisorScholarshipContext, setAdvisorScholarshipContext] = useState<string | undefined>(undefined);

  const handleToggleCompare = (id: string) => {
    setComparisonList(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 scholarships simultaneously.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleOpenAdvisorFromModal = (scholarshipId: string) => {
    setAdvisorScholarshipContext(scholarshipId);
    setSelectedScholarship(null);
    setActiveTab('assistant');
  };

  const handleSelectScenarioFromTour = async (
    scenario: 'alex_stem' | 'maya_incomplete' | 'david_humanities' | 'admin_eleanor',
    targetTab?: 'dashboard' | 'discovery' | 'admin'
  ) => {
    await switchDemoUser(scenario);
    setIsDemoTourOpen(false);
    if (targetTab) {
      setActiveTab(targetTab);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0F172A] flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Global Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDemoTour={() => setIsDemoTourOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenAuthModal={handleOpenAuth}
        comparisonCount={comparisonList.length}
        onOpenComparison={() => setIsComparisonOpen(true)}
        onOpenMernArchitecture={() => setIsMernArchitectureOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <LandingPage
            onExplore={() => setActiveTab('discovery')}
            onGoToDashboard={() => setActiveTab('dashboard')}
            onOpenDemoTour={() => setIsDemoTourOpen(true)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
        )}

        {activeTab === 'discovery' && (
          <ScholarshipDiscovery
            onOpenDetail={sch => setSelectedScholarship(sch)}
            comparisonList={comparisonList}
            onToggleCompare={handleToggleCompare}
            onOpenComparison={() => setIsComparisonOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <StudentDashboard
            onExplore={() => setActiveTab('discovery')}
            onOpenScholarshipDetail={sch => setSelectedScholarship(sch)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onGoToTracker={() => setActiveTab('tracker')}
            onOpenComparison={() => setIsComparisonOpen(true)}
            comparisonList={comparisonList}
            onToggleCompare={handleToggleCompare}
          />
        )}

        {activeTab === 'tracker' && (
          <ApplicationTracker
            onOpenDetail={sch => setSelectedScholarship(sch)}
            onExplore={() => setActiveTab('discovery')}
          />
        )}

        {activeTab === 'assistant' && (
          <ScholarshipAssistant
            initialScholarshipId={advisorScholarshipContext}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPortal />
        )}
      </main>

      {/* Scholarship Detail & Explainability Modal */}
      {selectedScholarship && (
        <ScholarshipDetailModal
          scholarship={selectedScholarship}
          onClose={() => setSelectedScholarship(null)}
          onOpenAdvisorWithContext={handleOpenAdvisorFromModal}
          isCompared={comparisonList.includes(selectedScholarship._id)}
          onToggleCompare={handleToggleCompare}
        />
      )}

      {/* Side-by-Side Comparison Drawer */}
      {isComparisonOpen && (
        <ComparisonDrawer
          scholarshipIds={comparisonList}
          onClose={() => setIsComparisonOpen(false)}
          onRemove={handleToggleCompare}
          onOpenDetail={sch => {
            setIsComparisonOpen(false);
            setSelectedScholarship(sch);
          }}
        />
      )}

      {/* Multi-Step Onboarding Modal */}
      {isOnboardingOpen && (
        <OnboardingModal
          onClose={() => setIsOnboardingOpen(false)}
          onCompleted={() => {
            setIsOnboardingOpen(false);
            setActiveTab('dashboard');
          }}
        />
      )}

      {/* Authentication Modal */}
      {isAuthModalOpen && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => {
            setIsAuthModalOpen(false);
            setActiveTab('dashboard');
          }}
        />
      )}

      {/* Judge Demo Tour Walkthrough Modal */}
      {isDemoTourOpen && (
        <DemoTourModal
          onClose={() => setIsDemoTourOpen(false)}
          onSelectScenario={handleSelectScenarioFromTour}
        />
      )}

      {/* MERN Architecture Inspection Modal */}
      {isMernArchitectureOpen && (
        <MernArchitectureModal
          onClose={() => setIsMernArchitectureOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
