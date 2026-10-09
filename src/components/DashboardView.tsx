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
  Award,
  Users,
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
    <div className="space-y-7">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-100/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-slate-900">
            Workforce Performance Dashboard
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span className="font-medium text-indigo-600/80">Continuous Intelligence</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono tabular-nums font-semibold text-slate-700">
              {employees.length} Total Profiles
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>All Records Synced</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddEmployee}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl transition-all cursor-pointer shadow-xs shadow-indigo-500/25 hover:shadow-indigo-500/35 focus-visible:outline-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* 4 Aesthetic Light Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Headcount */}
        <div className="bg-white/90 backdrop-blur-xs p-5 rounded-2xl border border-indigo-100/80 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.04)] hover:shadow-md hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Active Workforce</span>
            <span className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/70 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-bold font-display font-mono tabular-nums text-slate-900">
            {stats.totalEmployees}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
            <span>Filtered Scope</span>
            <span className="font-semibold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded-md text-[11px] border border-indigo-100/60">
              {selectedDept}
            </span>
          </div>
        </div>

        {/* Metric 2: Average Performance */}
        <div className="bg-white/90 backdrop-blur-xs p-5 rounded-2xl border border-emerald-100/80 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.04)] hover:shadow-md hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Average Performance</span>
            <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/70 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-display font-mono tabular-nums text-slate-900">
              {stats.avgPerf}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 5.00</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
            <span>Target Benchmark</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md text-[11px] border border-emerald-100/60">
              &ge; 4.0 Meets/Exceeds
            </span>
          </div>
        </div>

        {/* Metric 3: On-Time Delivery */}
        <div className="bg-white/90 backdrop-blur-xs p-5 rounded-2xl border border-sky-100/80 shadow-[0_4px_20px_-4px_rgba(14,165,233,0.04)] hover:shadow-md hover:border-sky-200 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Sprint On-Time %</span>
            <span className="w-7 h-7 rounded-xl bg-sky-50 text-sky-600 border border-sky-100/70 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-bold font-display font-mono tabular-nums text-slate-900">
            {stats.avgOnTime}%
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
            <span>Milestones Met</span>
            <span className="font-semibold text-sky-700 bg-sky-50/80 px-2 py-0.5 rounded-md text-[11px] border border-sky-100/60">
              Sprint Delivery
            </span>
          </div>
        </div>

        {/* Metric 4: Risk & Promotion */}
        <div className="bg-white/90 backdrop-blur-xs p-5 rounded-2xl border border-rose-100/80 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.04)] hover:shadow-md hover:border-rose-200 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Attrition Alerts</span>
            <span className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 border border-rose-100/70 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-bold font-display font-mono tabular-nums text-slate-900">
            {stats.highRiskCount}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
            <span>Promotion Pipeline</span>
            <span className="font-semibold text-violet-700 bg-violet-50/80 px-2 py-0.5 rounded-md text-[11px] border border-violet-150/70 font-mono">
              {stats.promotionCount} Candidates
            </span>
          </div>
        </div>
      </div>

      {/* Department Breakdown & Quick Predictor Callout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Overview */}
        <div className="lg:col-span-2 bg-white/95 backdrop-blur-xs p-6 rounded-2xl border border-indigo-100/70 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.03)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold font-display text-slate-900">
                Department Performance Benchmarks
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluation score averages and project throughput by department
              </p>
            </div>
            <button
              onClick={onNavigateToSql}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>SQL Metrics</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            {departmentStats.map(item => {
              const widthPct = Math.min(100, (item.avgScore / 5.0) * 100);
              return (
                <div key={item.dept} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{item.dept}</span>
                    <div className="flex items-center gap-3 text-slate-500 font-mono tabular-nums">
                      <span>{item.headcount} members</span>
                      <span aria-hidden="true" className="text-slate-200">·</span>
                      <span className="font-semibold text-slate-900">{item.avgScore} / 5.00</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-500 rounded-full transition-all duration-500 shadow-2xs shadow-indigo-500/20"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Simulator CTA with Aesthetic Light Palette */}
        <div className="bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/60 p-6 rounded-2xl border border-indigo-150/70 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs shadow-indigo-500/25">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-semibold font-display text-slate-900">
                What-If Predictor
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
              Test how adjustments to work hours, overtime, training hours, or task completion dynamically shift performance ratings and retention probability.
            </p>

            <div className="mt-4 p-3.5 bg-white/90 backdrop-blur-xs rounded-xl border border-indigo-100/70 text-xs text-slate-600 space-y-2 shadow-2xs">
              <div className="flex justify-between items-center">
                <span>Peak Productivity:</span>
                <span className="font-semibold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-100">
                  40 - 44 hrs/wk
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Fatigue Risk Threshold:</span>
                <span className="font-semibold font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] border border-rose-100">
                  &gt; 48 hrs/wk
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToPredictor}
            className="w-full mt-6 py-2.5 px-4 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shadow-indigo-500/25 focus-visible:outline-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-100" />
            <span>Launch What-If Predictor</span>
          </button>
        </div>
      </div>

      {/* Complete Workforce Overview Table showing ALL employees */}
      <div className="bg-white/95 backdrop-blur-xs rounded-2xl border border-indigo-100/70 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.03)] overflow-hidden">
        <div className="px-6 py-4 border-b border-indigo-100/60 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold font-display text-slate-900">
                All Workforce Profiles & Records
              </h2>
              <span className="text-xs font-mono tabular-nums text-slate-500 font-medium">
                ({displayedEmployees.length} of {employees.length} visible)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any row to inspect competencies or use actions to edit and simulate.
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
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-48 shadow-2xs placeholder:text-slate-400 transition-all"
              />
            </div>

            {/* Department Filter Bar */}
            <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl text-xs overflow-x-auto border border-slate-200/60">
              {['All', ...DEPARTMENT_LIST].map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedDept === dept
                      ? 'bg-white text-indigo-950 font-semibold shadow-xs border border-indigo-100/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
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
            <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200/80">
              <tr className="text-slate-600 font-medium">
                <th className="px-5 py-3 font-semibold">Employee</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 text-right font-semibold">Score</th>
                <th className="px-4 py-3 text-right font-semibold">On-Time</th>
                <th className="px-4 py-3 text-right font-semibold">Weekly Hours</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
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
                    className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                  >
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

                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {emp.department}
                    </td>

                    <td className="px-4 py-3 text-right font-mono tabular-nums font-bold text-slate-900">
                      {emp.performance_score.toFixed(2)}
                    </td>

                    <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-700">
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

                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit Profile */}
                        <button
                          onClick={() => onEditEmployee(emp)}
                          title="Edit Profile"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete with confirmation */}
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
