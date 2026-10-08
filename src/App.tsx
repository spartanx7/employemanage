import React, { useState, useEffect } from 'react';
import { Employee, PredictionInput, PredictionOutput } from './types';
import { INITIAL_EMPLOYEES } from './data/seedData';
import { Navbar, ActiveTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { PredictorView } from './components/PredictorView';
import { SqlConsoleView } from './components/SqlConsoleView';
import { EmployeeDirectoryView } from './components/EmployeeDirectoryView';
import { EmployeeDetailModal } from './components/EmployeeDetailModal';
import { EmployeeEditModal } from './components/EmployeeEditModal';
import { AdminLogin } from './components/AdminLogin';

interface AdminUser {
  name: string;
  email: string;
  role: string;
}

export default function App() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('talentpulse_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [inspectedEmployee, setInspectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [predictorEmployee, setPredictorEmployee] = useState<Employee | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (user: AdminUser) => {
    setAdminUser(user);
    try {
      localStorage.setItem('talentpulse_admin_user', JSON.stringify(user));
    } catch {}
    showNotification(`Welcome, ${user.name}!`);
  };

  const handleLogout = () => {
    setAdminUser(null);
    try {
      localStorage.removeItem('talentpulse_admin_user');
    } catch {}
    showNotification('Logged out successfully.');
  };

  const handleUpdateAdminName = (newName: string) => {
    if (!adminUser) return;
    const updated = { ...adminUser, name: newName };
    setAdminUser(updated);
    try {
      localStorage.setItem('talentpulse_admin_user', JSON.stringify(updated));
    } catch {}
    showNotification(`Administrator name updated to ${newName}.`);
  };

  // Handlers for Add, Edit, Delete
  const handleOpenAddEmployee = () => {
    setEditingEmployee(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsEditModalOpen(true);
  };

  const handleSaveEmployee = (empData: Employee) => {
    setEmployees(prev => {
      const exists = prev.some(e => e.id === empData.id);
      if (exists) {
        showNotification(`Profile for ${empData.name} updated successfully.`);
        return prev.map(e => (e.id === empData.id ? empData : e));
      } else {
        showNotification(`Employee ${empData.name} added to database.`);
        return [empData, ...prev];
      }
    });
  };

  const handleDeleteEmployee = (empId: string) => {
    const target = employees.find(e => e.id === empId);
    setEmployees(prev => prev.filter(e => e.id !== empId));
    showNotification(target ? `Removed ${target.name} from records.` : 'Employee removed.');
    if (inspectedEmployee?.id === empId) {
      setInspectedEmployee(null);
    }
  };

  const handleSelectEmployee = (emp: Employee) => {
    setInspectedEmployee(emp);
  };

  const handleSimulateEmployee = (emp: Employee) => {
    setPredictorEmployee(emp);
    setActiveTab('predictor');
  };

  // If user is not logged in as Admin, show the Admin Login page
  if (!adminUser) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {notification}
        </div>
      )}

      {/* Top Bar with Admin Info & Logout */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddEmployee={handleOpenAddEmployee}
        onOpenQuickPredict={() => {
          setPredictorEmployee(null);
          setActiveTab('predictor');
        }}
        adminUser={adminUser}
        onLogout={handleLogout}
        onUpdateAdminName={handleUpdateAdminName}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            employees={employees}
            onSelectEmployee={handleSelectEmployee}
            onEditEmployee={handleOpenEditEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            onOpenAddEmployee={handleOpenAddEmployee}
            onNavigateToPredictor={() => setActiveTab('predictor')}
            onNavigateToSql={() => setActiveTab('sql_console')}
          />
        )}

        {activeTab === 'directory' && (
          <EmployeeDirectoryView
            employees={employees}
            onSelectEmployee={handleSelectEmployee}
            onSimulateEmployee={handleSimulateEmployee}
            onEditEmployee={handleOpenEditEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            onOpenAddEmployee={handleOpenAddEmployee}
          />
        )}

        {activeTab === 'predictor' && (
          <PredictorView
            employees={employees}
            initialEmployee={predictorEmployee}
          />
        )}

        {activeTab === 'sql_console' && (
          <SqlConsoleView employees={employees} />
        )}
      </main>

      {/* Profile Detail Inspector Modal */}
      <EmployeeDetailModal
        employee={inspectedEmployee}
        onClose={() => setInspectedEmployee(null)}
        onSimulate={handleSimulateEmployee}
        onEdit={handleOpenEditEmployee}
        onDelete={handleDeleteEmployee}
      />

      {/* Add / Edit Profile Modal */}
      <EmployeeEditModal
        isOpen={isEditModalOpen}
        employee={editingEmployee}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEmployee}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-800">TalentPulse</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>Employee Performance Analysis & Predictor Platform</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('directory')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Employees
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('predictor')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Predictor
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('sql_console')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              SQL Metrics
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleLogout}
              className="text-rose-600 hover:text-rose-800 transition-colors cursor-pointer font-medium"
            >
              Log Out
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
