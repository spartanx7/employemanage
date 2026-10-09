import React from 'react';
import { Employee } from '../types';
import {
  X,
  Sparkles,
  Award,
  Clock,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  onClose: () => void;
  onSimulate: (emp: Employee) => void;
  onEdit?: (emp: Employee) => void;
  onDelete?: (empId: string) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  onClose,
  onSimulate,
  onEdit,
  onDelete
}) => {
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  if (!employee) return null;

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    if (onDelete) {
      onDelete(employee.id);
      onClose();
    }
  };

  const competenciesList = [
    { label: 'Delivery Speed', val: employee.competencies.delivery },
    { label: 'Team Collaboration', val: employee.competencies.teamwork },
    { label: 'Operational Efficiency', val: employee.competencies.efficiency },
    { label: 'Technical Leadership', val: employee.competencies.leadership },
    { label: 'Continuous Growth', val: employee.competencies.growth },
    { label: 'Execution Consistency', val: employee.competencies.consistency }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-xs">
      <div className="bg-white/98 backdrop-blur-md rounded-3xl max-w-2xl w-full border border-indigo-150/70 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-indigo-100/60 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-center gap-4">
            {employee.avatar ? (
              <img
                src={employee.avatar}
                alt={employee.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover border border-indigo-100 shadow-2xs"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-lg font-bold shadow-2xs font-display">
                {employee.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-display text-slate-900">{employee.name}</h2>
                <span className="text-xs font-mono text-slate-400">({employee.id})</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span>{employee.role}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="font-semibold text-slate-700">{employee.department}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Hired {employee.hire_date}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Metric Strip */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3.5 bg-white/90 rounded-2xl border border-indigo-100/70 shadow-2xs">
              <span className="text-[11px] text-slate-500 block font-medium">Performance</span>
              <span className="text-xl font-bold font-display font-mono tabular-nums text-slate-900 mt-1 block">
                {employee.performance_score.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400">/ 5.00 benchmark</span>
            </div>

            <div className="p-3.5 bg-white/90 rounded-2xl border border-sky-100/70 shadow-2xs">
              <span className="text-[11px] text-slate-500 block font-medium">On-Time Tasks</span>
              <span className="text-xl font-bold font-display font-mono tabular-nums text-slate-900 mt-1 block">
                {employee.tasks_on_time_pct}%
              </span>
              <span className="text-[10px] text-slate-400">sprint milestones</span>
            </div>

            <div className="p-3.5 bg-white/90 rounded-2xl border border-violet-100/70 shadow-2xs">
              <span className="text-[11px] text-slate-500 block font-medium">Peer 360 Index</span>
              <span className="text-xl font-bold font-display font-mono tabular-nums text-slate-900 mt-1 block">
                {employee.peer_review_score.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-400">/ 5.0 review</span>
            </div>

            <div className="p-3.5 bg-white/90 rounded-2xl border border-rose-100/70 shadow-2xs">
              <span className="text-[11px] text-slate-500 block font-medium">Flight Risk</span>
              <span
                className={`text-xl font-bold font-display font-mono tabular-nums mt-1 block ${
                  employee.flight_risk === 'High'
                    ? 'text-rose-600'
                    : employee.flight_risk === 'Medium'
                    ? 'text-amber-600'
                    : 'text-emerald-700'
                }`}
              >
                {employee.flight_risk}
              </span>
              <span className="text-[10px] text-slate-400">retention index</span>
            </div>
          </div>

          {/* Competency Evaluation Bars */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-900/60">
              Core Competency Dimensions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {competenciesList.map(comp => (
                <div key={comp.label} className="p-3 bg-slate-50/60 rounded-xl border border-slate-200/70">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-700 font-medium">{comp.label}</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      {comp.val}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full shadow-2xs shadow-indigo-500/20"
                      style={{ width: `${comp.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Metrics Grid */}
          <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-200/70 space-y-2.5">
            <h3 className="text-xs font-semibold font-display text-slate-900">
              Operational Telemetry
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Projects Delivered</span>
                <span className="font-mono tabular-nums font-medium text-slate-900">
                  {employee.projects_completed} initiatives
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Work Hours / Overtime</span>
                <span className="font-mono tabular-nums font-medium text-slate-900">
                  {employee.avg_weekly_hours}h / {employee.overtime_hours_month}h OT
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Skill Development</span>
                <span className="font-mono tabular-nums font-medium text-slate-900">
                  {employee.training_hours} hrs ({employee.certifications_count} certs)
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Annual Absenteeism</span>
                <span className="font-mono tabular-nums font-medium text-slate-900">
                  {employee.absenteeism_days} days
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Tenure Seniority</span>
                <span className="font-mono tabular-nums font-medium text-slate-900">
                  {employee.tenure_months} months
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Annual Base Salary</span>
                <span className="font-mono tabular-nums font-medium text-slate-900">
                  ${employee.salary.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {employee.notes && (
            <div className="text-xs text-slate-600 bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-100/70">
              <strong className="text-slate-900">Review Notes:</strong> {employee.notes}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                confirmDelete
                  ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs'
                  : 'text-rose-600 hover:bg-rose-50 border border-rose-200/80'
              }`}
            >
              {confirmDelete ? 'Confirm Delete?' : 'Delete Employee'}
            </button>
            {confirmDelete && (
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer font-medium"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(employee);
                  onClose();
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer shadow-2xs"
              >
                Edit Profile
              </button>
            )}
            <button
              onClick={() => {
                onSimulate(employee);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl transition-all cursor-pointer shadow-xs shadow-indigo-500/25"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-100" />
              <span>Simulate Predictor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
