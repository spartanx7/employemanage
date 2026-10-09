import React, { useState, useMemo } from 'react';
import { Employee, Department } from '../types';
import { DEPARTMENT_LIST } from '../data/seedData';
import {
  Search,
  Plus,
  ArrowUpDown,
  Sparkles,
  ExternalLink,
  Edit2,
  Trash2,
  Check,
  X
} from 'lucide-react';

interface EmployeeDirectoryViewProps {
  employees: Employee[];
  onSelectEmployee: (emp: Employee) => void;
  onSimulateEmployee: (emp: Employee) => void;
  onEditEmployee: (emp: Employee) => void;
  onDeleteEmployee: (empId: string) => void;
  onOpenAddEmployee: () => void;
}

export const EmployeeDirectoryView: React.FC<EmployeeDirectoryViewProps> = ({
  employees,
  onSelectEmployee,
  onSimulateEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onOpenAddEmployee
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'performance' | 'tenure' | 'hours' | 'name'>('performance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredEmployees = useMemo(() => {
    return employees
      .filter(emp => {
        const matchesSearch =
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
        const matchesRisk = riskFilter === 'All' || emp.flight_risk === riskFilter;

        return matchesSearch && matchesDept && matchesRisk;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'performance') cmp = a.performance_score - b.performance_score;
        else if (sortBy === 'tenure') cmp = a.tenure_months - b.tenure_months;
        else if (sortBy === 'hours') cmp = a.avg_weekly_hours - b.avg_weekly_hours;
        else if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
        return sortOrder === 'desc' ? -cmp : cmp;
      });
  }, [employees, searchTerm, departmentFilter, riskFilter, sortBy, sortOrder]);

  const handleDeleteConfirm = (id: string) => {
    onDeleteEmployee(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-7">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-indigo-100/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-slate-900">
            Employee Profiles & Metrics
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span className="font-medium text-indigo-600/80">Editable Workforce Database</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono tabular-nums font-semibold text-slate-700">
              {filteredEmployees.length} Total Profiles
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Add, Edit or Remove Profiles</span>
          </div>
        </div>

        <button
          onClick={onOpenAddEmployee}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl transition-all cursor-pointer shadow-xs shadow-indigo-500/25 focus-visible:outline-none"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/95 backdrop-blur-xs p-4 rounded-2xl border border-indigo-100/70 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.03)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by employee name, role, or ID..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50/70 border border-slate-200/80 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs placeholder:text-slate-400 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Department filter */}
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200/90 rounded-xl px-3 py-2 text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs transition-all font-medium"
          >
            <option value="All">All Departments</option>
            {DEPARTMENT_LIST.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Risk filter */}
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200/90 rounded-xl px-3 py-2 text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs transition-all font-medium"
          >
            <option value="All">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>

          {/* Sort selection */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="text-xs bg-white border border-slate-200/90 rounded-xl px-3 py-2 text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs transition-all font-medium"
          >
            <option value="performance">Sort: Performance</option>
            <option value="tenure">Sort: Tenure</option>
            <option value="hours">Sort: Work Hours</option>
            <option value="name">Sort: Name</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title="Toggle sort direction"
            className="p-2 text-slate-600 bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* High-Density Data Grid Table */}
      <div className="bg-white/95 backdrop-blur-xs rounded-2xl border border-indigo-100/70 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-medium">
                <th className="px-5 py-3 font-semibold">Employee</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 text-right font-semibold">Performance</th>
                <th className="px-4 py-3 text-right font-semibold">On-Time %</th>
                <th className="px-4 py-3 text-right font-semibold">Weekly & OT</th>
                <th className="px-4 py-3 text-right font-semibold">Satisfaction</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    No employees matching the current filters.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map(emp => (
                  <tr
                    key={emp.id}
                    className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                    onClick={() => onSelectEmployee(emp)}
                  >
                    {/* Name and avatar */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {emp.avatar ? (
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-xl object-cover border border-indigo-100 shadow-2xs"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                            {emp.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {emp.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {emp.id} · {emp.role}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {emp.department}
                    </td>

                    {/* Performance */}
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono tabular-nums font-bold text-slate-900">
                        {emp.performance_score.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">/ 5.00</span>
                    </td>

                    {/* On-Time % */}
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-800">
                      {emp.tasks_on_time_pct}%
                    </td>

                    {/* Workload */}
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-600">
                      <span>{emp.avg_weekly_hours}h/wk</span>
                      {emp.overtime_hours_month > 10 && (
                        <span className="text-[10px] text-rose-600 block font-semibold">+{emp.overtime_hours_month}h OT</span>
                      )}
                    </td>

                    {/* Satisfaction */}
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-700">
                      {emp.satisfaction_score.toFixed(1)} / 5.0
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                          emp.flight_risk === 'High'
                            ? 'bg-rose-50 text-rose-700 border-rose-200/70'
                            : emp.flight_risk === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border-amber-200/70'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                        }`}
                      >
                        {emp.flight_risk} Risk
                      </span>
                      {emp.promotion_ready && (
                        <span className="text-[10px] text-indigo-700 font-semibold block mt-0.5">
                          · Promo Ready
                        </span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit Button */}
                        <button
                          onClick={() => onEditEmployee(emp)}
                          title="Edit Employee Profile"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Predict Button */}
                        <button
                          onClick={() => onSimulateEmployee(emp)}
                          title="Simulate in What-If Predictor"
                          className="p-1.5 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button with inline confirmation */}
                        {deletingId === emp.id ? (
                          <div className="inline-flex items-center gap-1 bg-rose-50 p-0.5 rounded-lg border border-rose-200">
                            <button
                              onClick={() => handleDeleteConfirm(emp.id)}
                              title="Confirm Delete"
                              className="p-1 text-rose-600 hover:text-rose-800 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              title="Cancel"
                              className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeletingId(emp.id)}
                            title="Delete Employee"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
