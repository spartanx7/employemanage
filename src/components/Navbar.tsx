import React, { useState } from 'react';
import { Sparkles, Plus, LogOut, Edit2, Check, X, ShieldCheck } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'directory' | 'predictor' | 'sql_console';

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
    { id: 'predictor', label: 'Predictor' },
    { id: 'sql_console', label: 'SQL Analytics' }
  ];

  const handleSaveName = () => {
    if (tempName.trim() && onUpdateAdminName) {
      onUpdateAdminName(tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-indigo-100/60 shadow-[0_2px_12px_-4px_rgba(79,70,229,0.03)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-left group cursor-pointer focus-visible:outline-none flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-xs shadow-indigo-500/25 transition-transform group-hover:scale-105 duration-200">
              <span className="font-display font-extrabold text-sm tracking-tight">T</span>
            </div>
            <div>
              <span className="text-lg font-bold font-display tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors block leading-tight">
                TalentPulse
              </span>
              <span className="text-[11px] text-indigo-950/50 block font-medium -mt-0.5 tracking-normal">
                Performance Intelligence
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100/70 rounded-xl border border-slate-200/60">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap cursor-pointer focus-visible:outline-none ${
                  isActive
                    ? 'text-indigo-950 bg-white shadow-xs font-semibold border border-indigo-100/60'
                    : 'text-slate-600 hover:text-indigo-900 hover:bg-white/60 font-medium'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Admin Profile */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenQuickPredict}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50/70 border border-indigo-200/60 rounded-xl hover:bg-indigo-100/80 hover:border-indigo-300 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Simulate</span>
          </button>
          
          <button
            onClick={onOpenAddEmployee}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none shadow-xs shadow-indigo-500/25"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Employee</span>
          </button>

          {adminUser && (
            <div className="hidden sm:flex items-center gap-2 pl-2.5 border-l border-slate-200/70 ml-1">
              {isEditingName ? (
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-indigo-200 shadow-xs">
                  <input
                    type="text"
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    placeholder="Enter name"
                    autoFocus
                    className="text-xs px-2 py-0.5 bg-slate-50 rounded-md text-slate-900 w-32 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1 text-emerald-600 hover:text-emerald-700 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
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
                  className="text-right cursor-pointer group px-2.5 py-1 rounded-xl bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/50 hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-xs font-semibold text-slate-900 block leading-tight group-hover:text-indigo-600">
                      {adminUser.name}
                    </span>
                    <Edit2 className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 opacity-70" />
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <ShieldCheck className="w-2.5 h-2.5 text-indigo-500" />
                    <span className="text-[10px] text-indigo-900/60 font-medium block">
                      Administrator
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={onLogout}
                title="Log Out of Admin Portal"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 border-t border-slate-200/60 bg-slate-50/70">
        <div className="flex items-center gap-1 overflow-x-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/60'
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
