export type Department = 'Engineering' | 'Sales' | 'Product' | 'Operations' | 'Marketing' | 'Customer Success';

export type FlightRiskLevel = 'Low' | 'Medium' | 'High';

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department: Department;
  hire_date: string;
  tenure_months: number;
  salary: number;
  performance_score: number; // 1.00 - 5.00
  projects_completed: number;
  tasks_on_time_pct: number; // 0 - 100%
  avg_weekly_hours: number;
  overtime_hours_month: number;
  peer_review_score: number; // 1.0 - 5.0
  satisfaction_score: number; // 1.0 - 5.0
  training_hours: number;
  certifications_count: number;
  absenteeism_days: number;
  quarterly_kpi_score: number; // 0 - 100
  promotion_ready: boolean;
  flight_risk: FlightRiskLevel;
  competencies: {
    delivery: number;
    teamwork: number;
    efficiency: number;
    leadership: number;
    growth: number;
    consistency: number;
  };
  notes?: string;
}

export type ModelTarget = 'performance_score' | 'promotion_ready' | 'flight_risk';
export type AlgorithmType = 'random_forest' | 'ridge_regression' | 'logistic_regression' | 'gradient_boost';

export interface ModelTrainingConfig {
  target: ModelTarget;
  algorithm: AlgorithmType;
  selectedFeatures: string[];
  trainTestSplit: number; // e.g. 0.8
  regularization: number; // e.g. 0.1
  treeDepth?: number;
}

export interface TrainingResults {
  target: ModelTarget;
  algorithm: AlgorithmType;
  trainedAt: string;
  trainSampleSize: number;
  testSampleSize: number;
  accuracy?: number; // for classification
  f1Score?: number;
  r2Score?: number; // for regression
  mae?: number;
  rmse?: number;
  confusionMatrix?: {
    tp: number;
    fp: number;
    tn: number;
    fn: number;
  };
  featureImportance: {
    feature: string;
    importance: number;
    direction: 'positive' | 'negative';
  }[];
}

export interface PredictionInput {
  tenure_months: number;
  projects_completed: number;
  tasks_on_time_pct: number;
  avg_weekly_hours: number;
  overtime_hours_month: number;
  peer_review_score: number;
  satisfaction_score: number;
  training_hours: number;
  certifications_count: number;
  absenteeism_days: number;
  department: Department;
}

export interface PredictionOutput {
  predictedPerformanceScore: number;
  performanceTier: 'Needs Improvement' | 'Meets Expectations' | 'Exceeds Expectations' | 'Top Performer';
  promotionProbability: number;
  flightRisk: FlightRiskLevel;
  flightRiskScore: number; // 0 - 100%
  primaryDrivers: {
    feature: string;
    impact: number;
    direction: 'positive' | 'negative';
    label: string;
  }[];
  prescriptiveActions: string[];
}

export interface SqlQueryResult {
  columns: string[];
  rows: Record<string, any>[];
  executionTimeMs: number;
  rowCount: number;
  error?: string;
}
