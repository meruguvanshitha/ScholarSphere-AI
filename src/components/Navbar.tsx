import React, { useState } from 'react';
import {
  GraduationCap,
  Compass,
  LayoutDashboard,
  CheckSquare,
  Bot,
  Shield,
  Layers,
  Database,
  UserCheck,
  ChevronDown,
  LogOut,
  Sparkles,
  Info,
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: 'home' | 'discovery' | 'dashboard' | 'tracker' | 'assistant' | 'admin';
  setActiveTab: (tab: 'home' | 'discovery' | 'dashboard' | 'tracker' | 'assistant' | 'admin') => void;
  onOpenDemoTour: () => void;
  onOpenOnboarding: () => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  comparisonCount: number;
  onOpenComparison: () => void;
  onOpenMernArchitecture: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDemoTour,
  onOpenOnboarding,
  onOpenAuthModal,
  comparisonCount,
  onOpenComparison,
  onOpenMernArchitecture
}) => {
  const { user, profile, dbStatus, switchDemoUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E2DDD5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center space-x-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F172A] to-[#1E293B] text-emerald-400 flex items-center justify-center shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform border border-emerald-500/30">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-lg text-[#0F172A] tracking-tight">
                    Scholar<span className="text-emerald-600">Sphere</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 border border-orange-300">
                    India • ₹ INR
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] hidden sm:block font-medium">
                  Your Potential Deserves Funding
                </p>
              </div>
            </button>
          </div>

          {/* Primary Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('discovery')}
              className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                activeTab === 'discovery'
                  ? 'bg-[#0F172A] text-white shadow-sm'
                  : 'text-[#334155] hover:text-[#0F172A] hover:bg-[#F1ECE4]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore Schemes</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-[#0F172A] text-white shadow-sm'
                  : 'text-[#334155] hover:text-[#0F172A] hover:bg-[#F1ECE4]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                activeTab === 'tracker'
                  ? 'bg-[#0F172A] text-white shadow-sm'
                  : 'text-[#334155] hover:text-[#0F172A] hover:bg-[#F1ECE4]'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab('assistant')}
              className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                activeTab === 'assistant'
                  ? 'bg-[#0F172A] text-white shadow-sm'
                  : 'text-[#334155] hover:text-[#0F172A] hover:bg-[#F1ECE4]'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Advisor</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                activeTab === 'admin'
                  ? 'bg-[#0F172A] text-white shadow-sm'
                  : 'text-[#334155] hover:text-[#0F172A] hover:bg-[#F1ECE4]'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </button>

            {/* MERN Architecture Dedicated Button */}
            <button
              onClick={onOpenMernArchitecture}
              className="px-3 py-2 rounded-lg flex items-center space-x-1.5 text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100/70 bg-emerald-50 border border-emerald-300 font-semibold transition-colors"
              title="Inspect MERN Stack Architecture, Mongoose Schemas & REST APIs"
            >
              <Database className="w-4 h-4 text-emerald-700" />
              <span>MERN Stack</span>
            </button>
          </nav>

          {/* Right Action Tools & User Profile */}
          <div className="flex items-center space-x-2.5">
            {/* Compare Drawer Trigger */}
            {comparisonCount > 0 && (
              <button
                onClick={onOpenComparison}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-teal-50 text-teal-800 border border-teal-300 hover:bg-teal-100 flex items-center space-x-1 transition-all animate-pulse"
                title="Compare Selected Scholarships"
              >
                <Layers className="w-3.5 h-3.5 text-teal-600" />
                <span>Compare ({comparisonCount})</span>
              </button>
            )}

            {/* Judge Tour Button */}
            <button
              onClick={onOpenDemoTour}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors shadow-xs"
              title="Launch Guided Hackathon Walkthrough with 6 Scenarios"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Judge Tour</span>
            </button>

            {/* Database Health Pill (Clickable to open MERN Architecture) */}
            <button
              onClick={onOpenMernArchitecture}
              className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors hover:brightness-95 ${
                dbStatus?.connected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-[#F4EFE6] text-[#475569] border-[#E2DDD5]'
              }`}
              title="Click to view MERN Architecture & Live Database Status"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  dbStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="font-semibold">{dbStatus?.connected ? 'MongoDB Live' : 'Persistent Store'}</span>
            </button>

            {/* Indian Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-[#EFE9DF] text-[#1E293B] hover:bg-[#E5DEC7] border border-[#DDD5C7] flex items-center space-x-1 transition-colors"
                title="Switch between Indian test student personas"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">Personas</span>
                <ChevronDown className="w-3 h-3 text-[#64748B]" />
              </button>

              {showDemoMenu && (
                <div
                  className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-xl border border-[#E2DDD5] py-2 z-50 text-xs"
                  onMouseLeave={() => setShowDemoMenu(false)}
                >
                  <div className="px-3 py-1.5 border-b border-gray-100 font-semibold text-[#0F172A] flex items-center justify-between">
                    <span>Indian Demo Personas</span>
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <button
                    onClick={() => {
                      switchDemoUser('alex_stem'); // mapped to Aarav Sharma
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-[#FDFBF7] flex items-start space-x-2 transition-colors border-b border-gray-50"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-[#0F172A]">Aarav Sharma (Strong Match)</p>
                      <p className="text-[11px] text-gray-500">B.Tech CSE 3rd Yr, 8.8 CGPA, ₹3.5L Income, EWS, Telangana. Qualifies for Reliance &amp; NSP.</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchDemoUser('maya_incomplete'); // mapped to Priya Patel
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-[#FDFBF7] flex items-start space-x-2 transition-colors border-b border-gray-50"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-[#0F172A]">Priya Patel (Needs Confirmation)</p>
                      <p className="text-[11px] text-gray-500">B.Tech IT 2nd Yr, 8.4 CGPA, OBC. Missing Tehsildar Income Certificate. Honest Needs Info outcome.</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchDemoUser('david_humanities'); // mapped to Rahul Verma
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-[#FDFBF7] flex items-start space-x-2 transition-colors border-b border-gray-50"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-[#0F172A]">Rahul Verma (Criteria Mismatch)</p>
                      <p className="text-[11px] text-gray-500">B.A. History, 6.8 CGPA, General, Delhi. Fails B.Tech STEM branch and score cutoff for tech awards.</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchDemoUser('admin_eleanor'); // mapped to Dr. Ramanujam
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-[#FDFBF7] flex items-start space-x-2 transition-colors"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-[#0F172A]">Dr. K. S. Ramanujam (Director of Aid)</p>
                      <p className="text-[11px] text-gray-500">Full Administrator CRUD, state approvals, DigiLocker verification auditing.</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* User Profile / Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[#EFE9DF] transition-colors focus:outline-none border border-transparent hover:border-[#DDD5C7]"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-xs font-semibold text-[#0F172A] leading-tight truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-emerald-700 font-medium capitalize leading-none">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
                </button>

                {showUserMenu && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-[#E2DDD5] py-2 z-50 text-xs"
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-[#0F172A] truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        onOpenOnboarding();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[#334155] hover:bg-[#FDFBF7] flex items-center space-x-2"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                      <span>Edit Student Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenMernArchitecture();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[#334155] hover:bg-[#FDFBF7] flex items-center space-x-2"
                    >
                      <Database className="w-4 h-4 text-emerald-700" />
                      <span>MERN Architecture</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[#334155] hover:bg-[#FDFBF7] flex items-center space-x-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#0F172A]" />
                      <span>Student Dashboard</span>
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg text-[#0F172A] hover:bg-[#EFE9DF] transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-[#E2DDD5] bg-[#FAF7F2] text-xs font-medium">
        <button
          onClick={() => setActiveTab('discovery')}
          className={`px-2 py-1 flex flex-col items-center ${activeTab === 'discovery' ? 'text-emerald-700 font-bold' : 'text-gray-600'}`}
        >
          <Compass className="w-4 h-4" />
          <span>Schemes</span>
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2 py-1 flex flex-col items-center ${activeTab === 'dashboard' ? 'text-emerald-700 font-bold' : 'text-gray-600'}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('tracker')}
          className={`px-2 py-1 flex flex-col items-center ${activeTab === 'tracker' ? 'text-emerald-700 font-bold' : 'text-gray-600'}`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Tracker</span>
        </button>
        <button
          onClick={onOpenMernArchitecture}
          className="px-2 py-1 flex flex-col items-center text-emerald-800 font-bold"
        >
          <Database className="w-4 h-4" />
          <span>MERN</span>
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`px-2 py-1 flex flex-col items-center ${activeTab === 'admin' ? 'text-emerald-700 font-bold' : 'text-gray-600'}`}
        >
          <Shield className="w-4 h-4" />
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
};
