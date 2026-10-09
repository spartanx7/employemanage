import React, { useState, useEffect } from 'react';
import { Employee, Department, FlightRiskLevel } from '../types';
import { DEPARTMENT_LIST } from '../data/seedData';
import { X, Save, User, Briefcase, TrendingUp, HeartHandshake } from 'lucide-react';

interface EmployeeEditModalProps {
  isOpen: boolean;
  employee: Employee | null; // null means "Add New", non-null means "Edit Existing"
  onClose: () => void;
  onSave: (employeeData: Employee) => void;
}

export const EmployeeEditModal: React.FC<EmployeeEditModalProps> = ({
  isOpen,
  employee,
  onClose,
  onSave
}) => {
  const isEditing = Boolean(employee);

  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    role: '',
    department: 'Engineering',
    email: '',
    salary: 95000,
    tenure_months: 18,
    performance_score: 4.25,
    projects_completed: 12,
    tasks_on_time_pct: 90,
    avg_weekly_hours: 41.5,
    overtime_hours_month: 6,
    peer_review_score: 4.3,
    satisfaction_score: 4.2,
    training_hours: 30,
    certifications_count: 2,
    absenteeism_days: 3,
    notes: ''
  });

  useEffect(() => {
    if (employee) {
      setFormData({ ...employee });
    } else {
      setFormData({
        name: '',
        role: '',
        department: 'Engineering',
        email: '',
        salary: 95000,
        tenure_months: 18,
        performance_score: 4.25,
        projects_completed: 12,
        tasks_on_time_pct: 90,
        avg_weekly_hours: 41.5,
        overtime_hours_month: 6,
        peer_review_score: 4.3,
        satisfaction_score: 4.2,
        training_hours: 30,
        certifications_count: 2,
        absenteeism_days: 3,
        notes: ''
      });
    }
  }, [employee, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.role?.trim()) return;

    const perfScore = parseFloat(Number(formData.performance_score || 4.0).toFixed(2));
    const satScore = parseFloat(Number(formData.satisfaction_score || 4.0).toFixed(1));
    const otHours = Number(formData.overtime_hours_month || 0);
    const tenure = Number(formData.tenure_months || 12);

    // Compute automatic risk and readiness
    let flightRisk: FlightRiskLevel = 'Low';
    if (satScore < 3.0 || otHours > 16) {
      flightRisk = 'High';
    } else if (satScore < 3.6 || otHours > 10) {
      flightRisk = 'Medium';
    }

    const promoReady = perfScore >= 4.4 && tenure >= 18;

    const finalEmployee: Employee = {
      id: employee?.id || `EMP-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim(),
      email: formData.email?.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@company.org`,
      role: formData.role.trim(),
      department: (formData.department as Department) || 'Engineering',
      hire_date: employee?.hire_date || new Date().toISOString().split('T')[0],
      tenure_months: tenure,
      salary: Number(formData.salary) || 90000,
      performance_score: perfScore,
      projects_completed: Number(formData.projects_completed) || 10,
      tasks_on_time_pct: Number(formData.tasks_on_time_pct) || 85,
      avg_weekly_hours: Number(formData.avg_weekly_hours) || 40,
      overtime_hours_month: otHours,
      peer_review_score: parseFloat(Number(formData.peer_review_score || 4.0).toFixed(1)),
      satisfaction_score: satScore,
      training_hours: Number(formData.training_hours) || 20,
      certifications_count: Number(formData.certifications_count) || 1,
      absenteeism_days: Number(formData.absenteeism_days) || 2,
      quarterly_kpi_score: Math.min(100, Math.round(perfScore * 20)),
      promotion_ready: promoReady,
      flight_risk: flightRisk,
      avatar: employee?.avatar,
      competencies: employee?.competencies || {
        delivery: Math.min(99, Math.round(Number(formData.tasks_on_time_pct || 85))),
        teamwork: Math.min(99, Math.round(Number(formData.peer_review_score || 4.0) * 20)),
        efficiency: Math.min(99, Math.round(perfScore * 19)),
        leadership: Math.min(99, Math.round((tenure / 40) * 80 + 20)),
        growth: Math.min(99, Math.round(Number(formData.training_hours || 25) * 2 + 30)),
        consistency: Math.min(99, Math.round(perfScore * 20))
      },
      notes: formData.notes?.trim() || ''
    };

    onSave(finalEmployee);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-xs">
      <div className="bg-white/98 backdrop-blur-md rounded-3xl max-w-2xl w-full border border-indigo-150/70 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-indigo-100/60 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold font-display text-slate-900">
              {isEditing ? `Edit Profile: ${employee?.name}` : 'Add New Employee'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? `Update performance metrics and attributes for ${employee?.id}`
                : 'Enter employee information to record into the database'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
            {/* Section 1: Basic Information */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-indigo-900/60 uppercase tracking-wider block">
                Basic Employee Details
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full text-xs px-3 py-2 bg-slate-50/70 border border-slate-200/90 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs placeholder:text-slate-400 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Job Role / Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role || ''}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Data Engineer"
                    className="w-full text-xs px-3 py-2 bg-slate-50/70 border border-slate-200/90 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs placeholder:text-slate-400 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value as Department })}
                    className="w-full text-xs px-2.5 py-2 bg-slate-50/70 border border-slate-200/90 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs transition-all font-medium"
                  >
                    {DEPARTMENT_LIST.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Annual Salary ($)
                  </label>
                  <input
                    type="number"
                    value={formData.salary || 0}
                    onChange={e => setFormData({ ...formData, salary: parseInt(e.target.value, 10) || 0 })}
                    className="w-full text-xs font-mono px-3 py-2 bg-slate-50/70 border border-slate-200/90 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Tenure (Months)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={formData.tenure_months || 12}
                    onChange={e => setFormData({ ...formData, tenure_months: parseInt(e.target.value, 10) || 1 })}
                    className="w-full text-xs font-mono px-3 py-2 bg-slate-50/70 border border-slate-200/90 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Performance & Productivity Metrics */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="text-xs font-semibold text-indigo-900/60 uppercase tracking-wider block">
                Performance & Operational Metrics
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Performance Score
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1.0"
                    max="5.0"
                    value={formData.performance_score || 4.0}
                    onChange={e => setFormData({ ...formData, performance_score: parseFloat(e.target.value) || 3.0 })}
                    className="w-full text-xs font-mono px-2.5 py-2 bg-stone-50/70 border border-stone-200/80 rounded-xl text-stone-900 font-semibold shadow-2xs"
                  />
                  <span className="text-[10px] text-stone-400 block mt-0.5">Scale: 1.0 - 5.0</span>
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    On-Time Tasks %
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={formData.tasks_on_time_pct || 85}
                    onChange={e => setFormData({ ...formData, tasks_on_time_pct: parseInt(e.target.value, 10) || 80 })}
                    className="w-full text-xs font-mono px-2.5 py-2 bg-stone-50/70 border border-stone-200/80 rounded-xl text-stone-900 shadow-2xs"
                  />
                  <span className="text-[10px] text-stone-400 block mt-0.5">Sprint %</span>
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Projects Delivered
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.projects_completed || 10}
                    onChange={e => setFormData({ ...formData, projects_completed: parseInt(e.target.value, 10) || 0 })}
                    className="w-full text-xs font-mono px-2.5 py-2 bg-stone-50/70 border border-stone-200/80 rounded-xl text-stone-900 shadow-2xs"
                  />
                  <span className="text-[10px] text-stone-400 block mt-0.5">Total completed</span>
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Training Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={formData.training_hours || 25}
                    onChange={e => setFormData({ ...formData, training_hours: parseInt(e.target.value, 10) || 0 })}
                    className="w-full text-xs font-mono px-2.5 py-2 bg-stone-50/70 border border-stone-200/80 rounded-xl text-stone-900 shadow-2xs"
                  />
                  <span className="text-[10px] text-stone-400 block mt-0.5">Skill hours</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Weekly Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="25"
                    max="65"
                    value={formData.avg_weekly_hours || 40}
                    onChange={e => setFormData({ ...formData, avg_weekly_hours: parseFloat(e.target.value) || 40 })}
                    className="w-full text-xs font-mono px-2.5 py-2 bg-stone-50/70 border border-stone-200/80 rounded-xl text-stone-900 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Overtime / Mo
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={formData.overtime_hours_month || 4}
                    onChange={e => setFormData({ ...formData, overtime_hours_month: parseInt(e.target.value, 10) || 0 })}
                    className="w-full text-xs font-mono px-2.5 py-2 bg-stone-50/70 border border-stone-200/80 rounded-xl text-stone-900 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Peer Score (1-5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={formData.peer_review_score || 4.2}
                    onChange={e => setFormData({ ...formData, peer_review_score: parseFloat(e.target.value) || 4.0 })}
                    className="w-full text-xs font-mono px-2.5 py-2 bg-stone-50/70 border border-stone-200/80 rounded-xl text-stone-900 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Satisfaction (1-5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={formData.satisfaction_score || 4.2}
                    onChange={e => setFormData({ ...formData, satisfaction_score: parseFloat(e.target.value) || 4.0 })}
                    className="w-full text-xs font-mono px-2.5 py-2 bg-stone-50/70 border border-stone-200/80 rounded-xl text-stone-900 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Evaluator Notes */}
            <div className="space-y-1.5 pt-3 border-t border-stone-100">
              <label className="text-xs font-medium text-stone-700 block">
                Review & Performance Notes
              </label>
              <textarea
                rows={2}
                value={formData.notes || ''}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add contextual review notes or key strengths..."
                className="w-full text-xs p-2.5 bg-slate-50/70 border border-slate-200/90 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs transition-all"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200/70 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl transition-all cursor-pointer shadow-xs shadow-indigo-500/25"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Save Changes' : 'Create Employee Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
