import React, { useState, useMemo } from 'react';
import { Employee, PredictionInput, PredictionOutput, Department } from '../types';
import { predictPerformance } from '../utils/mlEngine';
import { DEPARTMENT_LIST } from '../data/seedData';
import {
  Sparkles,
  Sliders,
  TrendingUp,
  AlertCircle,
  Award,
  CheckCircle2,
  RefreshCw,
  Save,
  Users
} from 'lucide-react';

interface PredictorViewProps {
  employees: Employee[];
  initialEmployee?: Employee | null;
  onSavePredictionToSql?: (input: PredictionInput, output: PredictionOutput) => void;
}

export const PredictorView: React.FC<PredictorViewProps> = ({
  employees,
  initialEmployee,
  onSavePredictionToSql
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState<string>(initialEmployee?.id || 'custom');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Form input state
  const [inputState, setInputState] = useState<PredictionInput>(() => {
    if (initialEmployee) {
      return {
        tenure_months: initialEmployee.tenure_months,
        projects_completed: initialEmployee.projects_completed,
        tasks_on_time_pct: initialEmployee.tasks_on_time_pct,
        avg_weekly_hours: initialEmployee.avg_weekly_hours,
        overtime_hours_month: initialEmployee.overtime_hours_month,
        peer_review_score: initialEmployee.peer_review_score,
        satisfaction_score: initialEmployee.satisfaction_score,
        training_hours: initialEmployee.training_hours,
        certifications_count: initialEmployee.certifications_count,
        absenteeism_days: initialEmployee.absenteeism_days,
        department: initialEmployee.department
      };
    }
    return {
      tenure_months: 24,
      projects_completed: 12,
      tasks_on_time_pct: 90,
      avg_weekly_hours: 41.5,
      overtime_hours_month: 6,
      peer_review_score: 4.4,
      satisfaction_score: 4.2,
      training_hours: 32,
      certifications_count: 2,
      absenteeism_days: 3,
      department: 'Engineering'
    };
  });

  // Handle employee preset selection
  const handleSelectEmployee = (empId: string) => {
    setSelectedEmpId(empId);
    if (empId === 'custom') return;
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      setInputState({
        tenure_months: emp.tenure_months,
        projects_completed: emp.projects_completed,
        tasks_on_time_pct: emp.tasks_on_time_pct,
        avg_weekly_hours: emp.avg_weekly_hours,
        overtime_hours_month: emp.overtime_hours_month,
        peer_review_score: emp.peer_review_score,
        satisfaction_score: emp.satisfaction_score,
        training_hours: emp.training_hours,
        certifications_count: emp.certifications_count,
        absenteeism_days: emp.absenteeism_days,
        department: emp.department
      });
    }
  };

  // Reset to realistic baseline
  const handleReset = () => {
    setSelectedEmpId('custom');
    setInputState({
      tenure_months: 24,
      projects_completed: 12,
      tasks_on_time_pct: 90,
      avg_weekly_hours: 41.5,
      overtime_hours_month: 6,
      peer_review_score: 4.4,
      satisfaction_score: 4.2,
      training_hours: 32,
      certifications_count: 2,
      absenteeism_days: 3,
      department: 'Engineering'
    });
  };

  // Compute live prediction
  const prediction: PredictionOutput = useMemo(() => {
    return predictPerformance(inputState);
  }, [inputState]);

  // Handle save
  const handleSave = () => {
    if (onSavePredictionToSql) {
      onSavePredictionToSql(inputState, prediction);
      setSaveSuccessMsg('Simulation scenario recorded to SQL ml_predictions table!');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            What-If Performance & Attrition Predictor
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Ridge & Logistic Machine Learning Inferences</span>
            <span aria-hidden="true">·</span>
            <span>Live Local Inference</span>
            <span aria-hidden="true">·</span>
            <span>SHAP Factor Attribution</span>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="empPreset" className="text-xs text-slate-500 whitespace-nowrap">
            Load Profile:
          </label>
          <select
            id="empPreset"
            value={selectedEmpId}
            onChange={e => handleSelectEmployee(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-medium text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="custom">Custom Simulation Profile</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.role})
              </option>
            ))}
          </select>
          <button
            onClick={handleReset}
            title="Reset to default baseline"
            className="p-1.5 text-slate-500 hover:text-slate-900 bg-white border border-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Controls (Sliders), Right Predictive Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-slate-600" />
              <h2 className="text-sm font-semibold text-slate-900">
                Workforce Metrics & Operating Parameters
              </h2>
            </div>
            <span className="text-xs text-slate-400">Continuous Inputs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Department */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-slate-700 flex justify-between">
                <span>Department Track</span>
                <span className="text-slate-400 font-mono text-[11px]">{inputState.department}</span>
              </label>
              <select
                value={inputState.department}
                onChange={e => setInputState({ ...inputState, department: e.target.value as Department })}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                {DEPARTMENT_LIST.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Slider 1: On-Time Task % */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">On-Time Tasks Delivery</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900">
                  {inputState.tasks_on_time_pct}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="1"
                value={inputState.tasks_on_time_pct}
                onChange={e => setInputState({ ...inputState, tasks_on_time_pct: parseFloat(e.target.value) })}
                className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>50%</span>
                <span>80% target</span>
                <span>100%</span>
              </div>
            </div>

            {/* Slider 2: Projects Completed */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">Projects Delivered</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900">
                  {inputState.projects_completed} projects
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={inputState.projects_completed}
                onChange={e => setInputState({ ...inputState, projects_completed: parseInt(e.target.value, 10) })}
                className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1</span>
                <span>15</span>
                <span>30</span>
              </div>
            </div>

            {/* Slider 3: Weekly Work Hours */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">Avg Weekly Work Hours</span>
                <span className={`font-mono tabular-nums font-semibold ${
                  inputState.avg_weekly_hours > 46 ? 'text-rose-600' : 'text-slate-900'
                }`}>
                  {inputState.avg_weekly_hours} hrs/wk
                </span>
              </div>
              <input
                type="range"
                min="32"
                max="60"
                step="0.5"
                value={inputState.avg_weekly_hours}
                onChange={e => setInputState({ ...inputState, avg_weekly_hours: parseFloat(e.target.value) })}
                className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>32h</span>
                <span>40h standard</span>
                <span>60h (burnout)</span>
              </div>
            </div>

            {/* Slider 4: Overtime Hours / Month */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">Overtime Hours / Month</span>
                <span className={`font-mono tabular-nums font-semibold ${
                  inputState.overtime_hours_month > 14 ? 'text-rose-600' : 'text-slate-900'
                }`}>
                  {inputState.overtime_hours_month} hrs/mo
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="1"
                value={inputState.overtime_hours_month}
                onChange={e => setInputState({ ...inputState, overtime_hours_month: parseInt(e.target.value, 10) })}
                className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0h</span>
                <span>12h</span>
                <span>35h</span>
              </div>
            </div>

            {/* Slider 5: Peer Review Score */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">Peer 360 Review Index</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900">
                  {inputState.peer_review_score.toFixed(1)} / 5.0
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={inputState.peer_review_score}
                onChange={e => setInputState({ ...inputState, peer_review_score: parseFloat(e.target.value) })}
                className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1.0</span>
                <span>3.5</span>
                <span>5.0</span>
              </div>
            </div>

            {/* Slider 6: Satisfaction Score */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">Satisfaction & Sentiment</span>
                <span className={`font-mono tabular-nums font-semibold ${
                  inputState.satisfaction_score < 3.0 ? 'text-amber-600' : 'text-slate-900'
                }`}>
                  {inputState.satisfaction_score.toFixed(1)} / 5.0
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={inputState.satisfaction_score}
                onChange={e => setInputState({ ...inputState, satisfaction_score: parseFloat(e.target.value) })}
                className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1.0 (disaffected)</span>
                <span>3.0</span>
                <span>5.0 (engaged)</span>
              </div>
            </div>

            {/* Slider 7: Training Hours */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">Training & Upskilling</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900">
                  {inputState.training_hours} hrs
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="75"
                step="1"
                value={inputState.training_hours}
                onChange={e => setInputState({ ...inputState, training_hours: parseInt(e.target.value, 10) })}
                className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0h</span>
                <span>30h</span>
                <span>75h</span>
              </div>
            </div>

            {/* Slider 8: Tenure Months */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">Tenure (Seniority)</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900">
                  {inputState.tenure_months} months
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                step="1"
                value={inputState.tenure_months}
                onChange={e => setInputState({ ...inputState, tenure_months: parseInt(e.target.value, 10) })}
                className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 mo</span>
                <span>24 mo</span>
                <span>60 mo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Results Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Score Prediction Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Model Prediction
              </span>
              <span className="text-xs font-medium text-slate-700">
                {prediction.performanceTier}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
                {prediction.predictedPerformanceScore.toFixed(2)}
              </span>
              <span className="text-slate-400 font-mono text-sm">/ 5.00</span>
            </div>

            {/* Probability Gauges */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                <span className="text-[11px] text-slate-500 block">Promotion Probability</span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                    {prediction.promotionProbability}%
                  </span>
                  <span className={`text-[11px] font-medium ${
                    prediction.promotionProbability >= 65 ? 'text-emerald-600' : 'text-slate-500'
                  }`}>
                    {prediction.promotionProbability >= 65 ? 'High' : 'Moderate'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                <span className="text-[11px] text-slate-500 block">Attrition / Flight Risk</span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                    {prediction.flightRiskScore}%
                  </span>
                  <span className={`text-[11px] font-medium ${
                    prediction.flightRisk === 'High'
                      ? 'text-rose-600'
                      : prediction.flightRisk === 'Medium'
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  }`}>
                    {prediction.flightRisk}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-5">
              <button
                onClick={handleSave}
                className="w-full py-2 px-3 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Scenario into SQL Database</span>
              </button>
              {saveSuccessMsg && (
                <p className="text-xs text-emerald-600 text-center mt-2 font-medium">
                  {saveSuccessMsg}
                </p>
              )}
            </div>
          </div>

          {/* Explainability Drivers (SHAP Attribution) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              Factor Attribution (SHAP Weights)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              How individual parameters shifted the baseline prediction
            </p>

            <div className="space-y-2.5">
              {prediction.primaryDrivers.map(driver => (
                <div key={driver.feature} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 truncate max-w-[200px]">{driver.label}</span>
                  <span
                    className={`font-mono tabular-nums font-semibold ${
                      driver.direction === 'positive' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {driver.impact > 0 ? `+${driver.impact}` : `${driver.impact}`} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Prescriptive HR Actions */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              Prescriptive Recommendations
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Actionable operational steps calibrated by model output
            </p>

            <div className="space-y-2.5">
              {prediction.prescriptiveActions.map((action, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-900 shrink-0 mt-0.5" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
