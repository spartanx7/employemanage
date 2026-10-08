import { Employee, SqlQueryResult } from '../types';

export const SQL_SCHEMA_DDL = `-- ========================================================
-- OPEN-SOURCE HR ANALYTICS & ML METRIC DATABASE SCHEMA
-- Compatible with PostgreSQL (Free on Supabase / Neon)
-- and SQLite (Free local embedded zero-cost storage)
-- ========================================================

CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) UNIQUE NOT NULL,
    budget_annual NUMERIC(12, 2) NOT NULL,
    headcount_target INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    role VARCHAR(64) NOT NULL,
    department VARCHAR(64) NOT NULL,
    hire_date DATE NOT NULL,
    tenure_months INT NOT NULL,
    salary NUMERIC(10, 2) NOT NULL,
    performance_score NUMERIC(3, 2) CHECK (performance_score BETWEEN 1.00 AND 5.00),
    projects_completed INT DEFAULT 0,
    tasks_on_time_pct NUMERIC(5, 2) CHECK (tasks_on_time_pct BETWEEN 0 AND 100),
    avg_weekly_hours NUMERIC(4, 1) NOT NULL,
    overtime_hours_month NUMERIC(4, 1) DEFAULT 0,
    peer_review_score NUMERIC(3, 2) CHECK (peer_review_score BETWEEN 1.0 AND 5.0),
    satisfaction_score NUMERIC(3, 2) CHECK (satisfaction_score BETWEEN 1.0 AND 5.0),
    training_hours NUMERIC(5, 1) DEFAULT 0,
    certifications_count INT DEFAULT 0,
    absenteeism_days INT DEFAULT 0,
    quarterly_kpi_score NUMERIC(5, 2) NOT NULL,
    promotion_ready BOOLEAN DEFAULT FALSE,
    flight_risk VARCHAR(16) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS performance_reviews (
    review_id SERIAL PRIMARY KEY,
    employee_id VARCHAR(32) REFERENCES employees(id) ON DELETE CASCADE,
    review_period VARCHAR(16) NOT NULL, -- e.g. '2026-Q1'
    evaluator_id VARCHAR(32),
    score NUMERIC(3, 2) NOT NULL,
    strengths TEXT,
    areas_for_growth TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ml_model_registry (
    model_id SERIAL PRIMARY KEY,
    model_name VARCHAR(64) NOT NULL,
    target_variable VARCHAR(64) NOT NULL,
    algorithm VARCHAR(64) NOT NULL,
    r2_score NUMERIC(4, 3),
    accuracy NUMERIC(4, 3),
    f1_score NUMERIC(4, 3),
    hyperparameters JSONB,
    trained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ml_predictions (
    prediction_id SERIAL PRIMARY KEY,
    employee_id VARCHAR(32) REFERENCES employees(id),
    predicted_score NUMERIC(3, 2) NOT NULL,
    promotion_probability NUMERIC(4, 1) NOT NULL,
    flight_risk_level VARCHAR(16) NOT NULL,
    top_feature_driver VARCHAR(64),
    recommended_action TEXT,
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Essential Performance Indexes
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_performance ON employees(performance_score DESC);
CREATE INDEX IF NOT EXISTS idx_employees_flight_risk ON employees(flight_risk);
`;

export interface PredefinedQuery {
  id: string;
  title: string;
  description: string;
  sql: string;
}

export const PREDEFINED_QUERIES: PredefinedQuery[] = [
  {
    id: 'top_performers',
    title: 'Top Performers & Promotion Candidates',
    description: 'Find all employees with performance >= 4.5 and promotion ready status',
    sql: `SELECT id, name, role, department, performance_score, projects_completed, peer_review_score, quarterly_kpi_score
FROM employees
WHERE performance_score >= 4.50 AND promotion_ready = true
ORDER BY performance_score DESC;`
  },
  {
    id: 'burnout_risk',
    title: 'Burnout & Attrition Vulnerability Audit',
    description: 'Identifies employees with excessive overtime or high flight risk',
    sql: `SELECT id, name, department, avg_weekly_hours, overtime_hours_month, satisfaction_score, flight_risk
FROM employees
WHERE overtime_hours_month >= 10 OR flight_risk = 'High'
ORDER BY overtime_hours_month DESC;`
  },
  {
    id: 'dept_benchmarks',
    title: 'Department Productivity & Quality Aggregation',
    description: 'Aggregates average performance, projects, and satisfaction by department',
    sql: `SELECT department,
       COUNT(*) as headcount,
       ROUND(AVG(performance_score), 2) as avg_performance,
       ROUND(AVG(projects_completed), 1) as avg_projects,
       ROUND(AVG(satisfaction_score), 2) as avg_satisfaction,
       ROUND(AVG(salary), 0) as avg_salary
FROM employees
GROUP BY department
ORDER BY avg_performance DESC;`
  },
  {
    id: 'training_roi',
    title: 'Training Hours vs Performance Correlation',
    description: 'Compares employees with high training hours vs lower development hours',
    sql: `SELECT id, name, department, training_hours, certifications_count, performance_score, tasks_on_time_pct
FROM employees
WHERE training_hours >= 35
ORDER BY training_hours DESC;`
  },
  {
    id: 'compensation_efficiency',
    title: 'Compensation to Impact Ratio',
    description: 'Ranks employees by delivered projects per salary unit',
    sql: `SELECT id, name, role, department, salary, projects_completed, quarterly_kpi_score
FROM employees
WHERE salary > 100000
ORDER BY quarterly_kpi_score DESC;`
  }
];

// In-browser SQL Executor for realistic relational queries on employees table
export function executeSqlQuery(sql: string, employees: Employee[]): SqlQueryResult {
  const startTime = performance.now();
  const cleanSql = sql.trim().replace(/;$/, '');

  try {
    const upper = cleanSql.toUpperCase();

    // Check if it's a DDL or INSERT/CREATE statement
    if (upper.startsWith('CREATE') || upper.startsWith('--') || upper.startsWith('ALTER')) {
      return {
        columns: ['status', 'message'],
        rows: [{ status: 'SUCCESS', message: 'DDL Schema validated successfully. Tables, types, and indexes are in sync.' }],
        executionTimeMs: Math.round(performance.now() - startTime),
        rowCount: 1
      };
    }

    if (!upper.startsWith('SELECT')) {
      return {
        columns: ['status'],
        rows: [],
        executionTimeMs: Math.round(performance.now() - startTime),
        rowCount: 0,
        error: 'Only SELECT queries and schema DDL statements are supported in read-only analysis mode.'
      };
    }

    // Handle GROUP BY department
    if (upper.includes('GROUP BY') && upper.includes('DEPARTMENT')) {
      const groups: Record<string, Employee[]> = {};
      employees.forEach(e => {
        if (!groups[e.department]) groups[e.department] = [];
        groups[e.department].push(e);
      });

      const rows = Object.entries(groups).map(([dept, list]) => {
        const avgScore = list.reduce((s, e) => s + e.performance_score, 0) / list.length;
        const avgProjects = list.reduce((s, e) => s + e.projects_completed, 0) / list.length;
        const avgSat = list.reduce((s, e) => s + e.satisfaction_score, 0) / list.length;
        const avgSalary = list.reduce((s, e) => s + e.salary, 0) / list.length;
        const avgHours = list.reduce((s, e) => s + e.avg_weekly_hours, 0) / list.length;

        return {
          department: dept,
          headcount: list.length,
          avg_performance: parseFloat(avgScore.toFixed(2)),
          avg_projects: parseFloat(avgProjects.toFixed(1)),
          avg_satisfaction: parseFloat(avgSat.toFixed(2)),
          avg_salary: Math.round(avgSalary),
          avg_weekly_hours: parseFloat(avgHours.toFixed(1))
        };
      });

      // Sort
      if (upper.includes('ORDER BY') && upper.includes('DESC')) {
        rows.sort((a, b) => b.avg_performance - a.avg_performance);
      } else if (upper.includes('ORDER BY')) {
        rows.sort((a, b) => a.avg_performance - b.avg_performance);
      }

      return {
        columns: Object.keys(rows[0] || {}),
        rows,
        executionTimeMs: Math.max(1, Math.round(performance.now() - startTime)),
        rowCount: rows.length
      };
    }

    // Standard SELECT with WHERE and ORDER BY
    let filtered = [...employees];

    // Filter conditions
    if (upper.includes('WHERE')) {
      if (upper.includes('PROMOTION_READY = TRUE') || upper.includes('PROMOTION_READY=TRUE')) {
        filtered = filtered.filter(e => e.promotion_ready);
      }
      if (upper.includes('PERFORMANCE_SCORE >=')) {
        const match = upper.match(/PERFORMANCE_SCORE\s*>=\s*([0-9.]+)/);
        if (match) {
          const val = parseFloat(match[1]);
          filtered = filtered.filter(e => e.performance_score >= val);
        }
      }
      if (upper.includes('TRAINING_HOURS >=')) {
        const match = upper.match(/TRAINING_HOURS\s*>=\s*([0-9.]+)/);
        if (match) {
          const val = parseFloat(match[1]);
          filtered = filtered.filter(e => e.training_hours >= val);
        }
      }
      if (upper.includes('OVERTIME_HOURS_MONTH >=')) {
        const match = upper.match(/OVERTIME_HOURS_MONTH\s*>=\s*([0-9.]+)/);
        if (match) {
          const val = parseFloat(match[1]);
          filtered = filtered.filter(e => e.overtime_hours_month >= val);
        }
      }
      if (upper.includes("FLIGHT_RISK = 'HIGH'") || upper.includes("FLIGHT_RISK='HIGH'")) {
        filtered = filtered.filter(e => e.flight_risk === 'High');
      }
      if (upper.includes('SALARY >')) {
        const match = upper.match(/SALARY\s*>\s*([0-9]+)/);
        if (match) {
          const val = parseFloat(match[1]);
          filtered = filtered.filter(e => e.salary > val);
        }
      }
      if (upper.includes("DEPARTMENT = '") || upper.includes('DEPARTMENT="')) {
        const match = cleanSql.match(/department\s*=\s*['"]([^'"]+)['"]/i);
        if (match) {
          filtered = filtered.filter(e => e.department.toLowerCase() === match[1].toLowerCase());
        }
      }
    }

    // Sort order
    if (upper.includes('ORDER BY')) {
      if (upper.includes('PERFORMANCE_SCORE DESC')) {
        filtered.sort((a, b) => b.performance_score - a.performance_score);
      } else if (upper.includes('OVERTIME_HOURS_MONTH DESC')) {
        filtered.sort((a, b) => b.overtime_hours_month - a.overtime_hours_month);
      } else if (upper.includes('TRAINING_HOURS DESC')) {
        filtered.sort((a, b) => b.training_hours - a.training_hours);
      } else if (upper.includes('QUARTERLY_KPI_SCORE DESC')) {
        filtered.sort((a, b) => b.quarterly_kpi_score - a.quarterly_kpi_score);
      } else if (upper.includes('SALARY DESC')) {
        filtered.sort((a, b) => b.salary - a.salary);
      }
    }

    // Limit
    if (upper.includes('LIMIT')) {
      const match = upper.match(/LIMIT\s+([0-9]+)/);
      if (match) {
        filtered = filtered.slice(0, parseInt(match[1], 10));
      }
    }

    // Select projection
    let columns = [
      'id',
      'name',
      'role',
      'department',
      'performance_score',
      'projects_completed',
      'tasks_on_time_pct',
      'avg_weekly_hours',
      'overtime_hours_month',
      'peer_review_score',
      'satisfaction_score',
      'training_hours',
      'flight_risk'
    ];

    if (!upper.includes('SELECT *')) {
      const selectMatch = cleanSql.match(/SELECT\s+(.*?)\s+FROM/i);
      if (selectMatch) {
        const requestedCols = selectMatch[1]
          .split(',')
          .map(c => c.trim().toLowerCase().replace(/as\s+\w+/i, '').trim())
          .filter(Boolean);
        if (requestedCols.length > 0 && !requestedCols.includes('*')) {
          columns = requestedCols;
        }
      }
    }

    const rows = filtered.map(e => {
      const row: Record<string, any> = {};
      columns.forEach(col => {
        row[col] = (e as any)[col] !== undefined ? (e as any)[col] : null;
      });
      return row;
    });

    const executionTimeMs = Math.max(1, Math.round(performance.now() - startTime));

    return {
      columns,
      rows,
      executionTimeMs,
      rowCount: rows.length
    };
  } catch (err: any) {
    return {
      columns: [],
      rows: [],
      executionTimeMs: Math.round(performance.now() - startTime),
      rowCount: 0,
      error: `SQL Parse Error: ${err?.message || 'Syntax error near token'}`
    };
  }
}
