import React, { useState } from 'react';
import { Sparkles, Plus, LogOut, Edit2, Check, X } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'predictor' | 'directory' | 'sql_console';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddEmployee: () => void;
  onOpenQuickPredict: () => void;
  adminUser?: { name: string; email: string; role: string } | null;
  onLogout?: () => void;
  onUpdateAdminName?: (newName: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddEmployee,
  onOpenQuickPredict,
  adminUser,
  onLogout,
  onUpdateAdminName
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(adminUser?.name || '');

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'directory', label: 'Employees' },
    { id: 'predictor', label: 'Performance Predictor' },
    { id: 'sql_console', label: 'SQL Analytics' }
  ];

  const handleSaveName = () => {
    if (tempName.trim() && onUpdateAdminName) {
      onUpdateAdminName(tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-left group cursor-pointer focus-visible:outline-none"
          >
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-slate-800 transition-colors">
              TalentPulse
            </span>
            <span className="text-xs text-slate-400 block font-normal -mt-0.5">
              Employee Performance & Predictor
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none ${
                  isActive
                    ? 'text-slate-900 bg-slate-100 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Admin Profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQuickPredict}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Simulate</span>
          </button>
          
          <button
            onClick={onOpenAddEmployee}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Employee</span>
          </button>

          {adminUser && (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 ml-1">
              {isEditingName ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    placeholder="Enter name"
                    autoFocus
                    className="text-xs px-2 py-1 bg-slate-50 border border-slate-300 rounded-md text-slate-900 w-32 focus:bg-white focus:outline-none"
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1 text-emerald-600 hover:text-emerald-800 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => {
                    setTempName(adminUser.name);
                    setIsEditingName(true);
                  }}
                  title="Click to edit Administrator Name"
                  className="text-right cursor-pointer group px-1 py-0.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-slate-900 block leading-tight group-hover:text-indigo-600">
                      {adminUser.name}
                    </span>
                    <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 opacity-60" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    Administrator
                  </span>
                </div>
              )}

              <button
                onClick={onLogout}
                title="Log Out of Admin Portal"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 border-t border-slate-100 bg-slate-50/80">
        <div className="flex items-center gap-1 overflow-x-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer ${
                activeTab === item.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {adminUser && (
          <div className="flex items-center gap-2 ml-2">
            <span className="text-xs font-semibold text-slate-800 truncate max-w-[100px]">
              {adminUser.name}
            </span>
            <button
              onClick={onLogout}
              title="Log Out"
              className="p-1 text-slate-500 hover:text-rose-600 shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
