import React, { useState, useMemo } from 'react';
import { Employee, Department } from '../types';
import { DEPARTMENT_LIST } from '../data/seedData';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  Search
} from 'lucide-react';

interface DashboardViewProps {
  employees: Employee[];
  onSelectEmployee: (emp: Employee) => void;
  onEditEmployee: (emp: Employee) => void;
  onDeleteEmployee: (empId: string) => void;
  onOpenAddEmployee: () => void;
  onNavigateToPredictor: () => void;
  onNavigateToSql: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  employees,
  onSelectEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onOpenAddEmployee,
  onNavigateToPredictor,
  onNavigateToSql
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filtered employees by department and search query
  const filtered = useMemo(() => {
    return employees.filter(e => {
      const matchDept = selectedDept === 'All' || e.department === selectedDept;
      const matchSearch =
        searchTerm.trim() === '' ||
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDept && matchSearch;
    });
  }, [employees, selectedDept, searchTerm]);

  // Key KPI stats based on filtered selection
  const stats = useMemo(() => {
    const total = filtered.length || 1;
    const avgPerf = filtered.reduce((s, e) => s + e.performance_score, 0) / total;
    const avgOnTime = filtered.reduce((s, e) => s + e.tasks_on_time_pct, 0) / total;
    const promotionCount = filtered.filter(e => e.promotion_ready).length;
    const highRiskCount = filtered.filter(e => e.flight_risk === 'High').length;

    return {
      totalEmployees: filtered.length,
      avgPerf: avgPerf.toFixed(2),
      avgOnTime: Math.round(avgOnTime),
      promotionCount,
      highRiskCount
    };
  }, [filtered]);

  // Department averages
  const departmentStats = useMemo(() => {
    const groups: Record<Department, { count: number; sumScore: number; sumProjects: number }> = {
      Engineering: { count: 0, sumScore: 0, sumProjects: 0 },
      Sales: { count: 0, sumScore: 0, sumProjects: 0 },
      Product: { count: 0, sumScore: 0, sumProjects: 0 },
      Operations: { count: 0, sumScore: 0, sumProjects: 0 },
      Marketing: { count: 0, sumScore: 0, sumProjects: 0 },
      'Customer Success': { count: 0, sumScore: 0, sumProjects: 0 }
    };

    employees.forEach(e => {
      if (groups[e.department]) {
        groups[e.department].count += 1;
        groups[e.department].sumScore += e.performance_score;
        groups[e.department].sumProjects += e.projects_completed;
      }
    });

    return Object.entries(groups)
      .map(([dept, data]) => ({
        dept: dept as Department,
        headcount: data.count,
        avgScore: data.count > 0 ? parseFloat((data.sumScore / data.count).toFixed(2)) : 0,
        avgProjects: data.count > 0 ? parseFloat((data.sumProjects / data.count).toFixed(1)) : 0
      }))
      .filter(d => d.headcount > 0)
      .sort((a, b) => b.avgScore - a.avgScore);
  }, [employees]);

  // Show all matching employees
  const displayedEmployees = filtered;

  const handleDeleteConfirm = (id: string) => {
    onDeleteEmployee(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Workforce Performance Dashboard
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Real-time Metrics</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums font-semibold text-slate-800">
              {employees.length} Total Workforce Profiles
            </span>
            <span aria-hidden="true">·</span>
            <span>All Employees Displayed Below</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddEmployee}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shadow-xs focus-visible:outline-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Headcount */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Workforce Size</span>
            <span className="font-mono tabular-nums text-slate-700">Active</span>
          </div>
          <div className="mt-2 text-3xl font-bold font-mono tabular-nums text-slate-900">
            {stats.totalEmployees}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Department Scope</span>
            <span className="font-medium text-slate-700">{selectedDept}</span>
          </div>
        </div>

        {/* Metric 2: Average Performance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Average Score</span>
            <span className="text-emerald-600 font-medium font-mono tabular-nums">Benchmark &ge; 4.0</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {stats.avgPerf}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 5.00</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Rating Scale</span>
            <span className="font-mono text-slate-700">1.00 - 5.00</span>
          </div>
        </div>

        {/* Metric 3: On-Time Delivery */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>On-Time Delivery</span>
            <span className="text-indigo-600 font-medium font-mono tabular-nums">{stats.avgOnTime}% avg</span>
          </div>
          <div className="mt-2 text-3xl font-bold font-mono tabular-nums text-slate-900">
            {stats.avgOnTime}%
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Milestones Met</span>
            <span className="font-medium text-slate-700">Sprint Tracking</span>
          </div>
        </div>

        {/* Metric 4: Risk & Promotion */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Attrition Risk Alert</span>
            {stats.highRiskCount > 0 ? (
              <span className="text-rose-600 font-medium font-mono tabular-nums">{stats.highRiskCount} cases</span>
            ) : (
              <span className="text-emerald-600 font-medium">Optimal</span>
            )}
          </div>
          <div className="mt-2 text-3xl font-bold font-mono tabular-nums text-slate-900">
            {stats.highRiskCount}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Promotion Candidates</span>
            <span className="font-mono tabular-nums font-semibold text-indigo-700">
              {stats.promotionCount} ready
            </span>
          </div>
        </div>
      </div>

      {/* Department Breakdown & Quick Predictor Callout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Overview */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Department Performance Breakdown
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Composite evaluation scores across business divisions
              </p>
            </div>
            <button
              onClick={onNavigateToSql}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View SQL Metrics</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3.5">
            {departmentStats.map(item => {
              const widthPct = Math.min(100, (item.avgScore / 5.0) * 100);
              return (
                <div key={item.dept} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{item.dept}</span>
                    <div className="flex items-center gap-3 text-slate-500 font-mono tabular-nums">
                      <span>{item.headcount} members</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-slate-900">{item.avgScore} / 5.00</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-900 rounded-full"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Simulator CTA */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-semibold text-slate-900">
                What-If Predictor
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Test how changes to weekly work hours, overtime, training hours, or task completion affect performance rating and attrition probability.
            </p>

            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200/70 text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between">
                <span>Peak Output:</span>
                <strong className="text-slate-900">40 - 44 hrs/wk</strong>
              </div>
              <div className="flex justify-between">
                <span>Fatigue Risk:</span>
                <strong className="text-rose-600">&gt; 48 hrs/wk</strong>
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToPredictor}
            className="w-full mt-6 py-2 px-4 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Launch What-If Predictor</span>
          </button>
        </div>
      </div>

      {/* Complete Workforce Overview Table showing ALL employees */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900">
                All Workforce Profiles & Records
              </h2>
              <span className="text-xs font-mono tabular-nums text-slate-500 font-medium">
                ({displayedEmployees.length} of {employees.length} visible)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete list of all employees in database. Click any row to view full competencies or edit details.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search name, role, ID..."
                className="pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 w-44"
              />
            </div>

            {/* Department Filter Bar */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs overflow-x-auto">
              {['All', ...DEPARTMENT_LIST].map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    selectedDept === dept
                      ? 'bg-white text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
              <tr className="text-slate-600 font-medium">
                <th className="px-5 py-3">Employee</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3 text-right">Score</th>
                <th className="px-4 py-3 text-right">On-Time</th>
                <th className="px-4 py-3 text-right">Hours</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    No employees matching the current search or department filter.
                  </td>
                </tr>
              ) : (
                displayedEmployees.map(emp => (
                  <tr
                    key={emp.id}
                    onClick={() => onSelectEmployee(emp)}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {emp.avatar ? (
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                            {emp.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-slate-800">
                            {emp.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {emp.id} · {emp.role}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {emp.department}
                    </td>

                    <td className="px-4 py-3 text-right font-mono tabular-nums font-bold text-slate-900">
                      {emp.performance_score.toFixed(2)}
                    </td>

                    <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-800">
                      {emp.tasks_on_time_pct}%
                    </td>

                    <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-600">
                      <span>{emp.avg_weekly_hours}h/wk</span>
                      {emp.overtime_hours_month > 10 && (
                        <span className="text-[10px] text-rose-600 block">+{emp.overtime_hours_month}h OT</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium ${
                          emp.flight_risk === 'High'
                            ? 'text-rose-600'
                            : emp.flight_risk === 'Medium'
                            ? 'text-amber-600'
                            : 'text-emerald-700'
                        }`}
                      >
                        {emp.flight_risk} Risk
                      </span>
                      {emp.promotion_ready && (
                        <span className="text-[10px] text-indigo-600 block font-medium">
                          · Promo Ready
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit Profile */}
                        <button
                          onClick={() => onEditEmployee(emp)}
                          title="Edit Profile"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete with confirmation */}
                        {deletingId === emp.id ? (
                          <div className="inline-flex items-center gap-1 bg-rose-50 p-0.5 rounded border border-rose-200">
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
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
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
