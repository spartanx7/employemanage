import React, { useState } from 'react';
import { Employee, SqlQueryResult } from '../types';
import {
  SQL_SCHEMA_DDL,
  PREDEFINED_QUERIES,
  executeSqlQuery
} from '../utils/sqlEngine';
import {
  Database,
  Play,
  Copy,
  Check,
  Download,
  Terminal,
  BookOpen,
  Code2,
  Table as TableIcon
} from 'lucide-react';

interface SqlConsoleViewProps {
  employees: Employee[];
}

export const SqlConsoleView: React.FC<SqlConsoleViewProps> = ({ employees }) => {
  const [activeSubTab, setActiveSubTab] = useState<'query' | 'schema'>('query');
  const [queryText, setQueryText] = useState<string>(PREDEFINED_QUERIES[0].sql);
  const [queryResult, setQueryResult] = useState<SqlQueryResult>(() =>
    executeSqlQuery(PREDEFINED_QUERIES[0].sql, employees)
  );
  const [copiedDdl, setCopiedDdl] = useState<boolean>(false);

  const handleRunQuery = () => {
    const result = executeSqlQuery(queryText, employees);
    setQueryResult(result);
  };

  const handleSelectPredefined = (sql: string) => {
    setQueryText(sql);
    const result = executeSqlQuery(sql, employees);
    setQueryResult(result);
  };

  const handleCopyDdl = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_DDL);
    setCopiedDdl(true);
    setTimeout(() => setCopiedDdl(false), 2500);
  };

  const handleExportCsv = () => {
    if (!queryResult.rows.length) return;
    const headers = queryResult.columns.join(',');
    const csvRows = queryResult.rows.map(row =>
      queryResult.columns.map(col => JSON.stringify(row[col] ?? '')).join(',')
    );
    const blob = new Blob([`${headers}\n${csvRows.join('\n')}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hr_analytics_query_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Relational SQL Query Console & Schema Explorer
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>PostgreSQL & SQLite Compatible</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Cost Embedded DB</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{employees.length} Metric Rows</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveSubTab('query')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeSubTab === 'query'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SQL Query Runner
            </button>
            <button
              onClick={() => setActiveSubTab('schema')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeSubTab === 'schema'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Schema DDL (.sql)
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'query' ? (
        <div className="space-y-6">
          {/* Predefined Analytical Queries Carousel / Grid */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              HR Analytical Query Templates
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {PREDEFINED_QUERIES.map(q => {
                const isSelected = queryText === q.sql;
                return (
                  <button
                    key={q.id}
                    onClick={() => handleSelectPredefined(q.sql)}
                    className={`p-3 text-left rounded-xl border transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className={`text-xs font-semibold line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {q.title}
                    </div>
                    <div className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {q.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editor & Execution Panel */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>sqlite&gt; employees_db.sqlite</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunQuery}
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 focus-visible:outline-none"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Execute SQL</span>
                </button>
              </div>
            </div>

            <textarea
              value={queryText}
              onChange={e => setQueryText(e.target.value)}
              rows={5}
              spellCheck={false}
              className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-50/50 border-b border-slate-200 focus:outline-none focus:bg-white resize-y"
              placeholder="Enter SELECT SQL query..."
            />

            {/* Query Telemetry Bar */}
            <div className="px-5 py-2.5 bg-white flex items-center justify-between text-xs text-slate-500 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span>
                  Returned: <strong className="font-mono tabular-nums text-slate-900">{queryResult.rowCount} rows</strong>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Latency: <strong className="font-mono tabular-nums text-slate-900">{queryResult.executionTimeMs} ms</strong>
                </span>
              </div>
              {queryResult.rows.length > 0 && (
                <button
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 cursor-pointer font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              )}
            </div>

            {/* Result Table */}
            {queryResult.error ? (
              <div className="p-6 text-xs font-mono text-rose-600 bg-rose-50/50">
                {queryResult.error}
              </div>
            ) : queryResult.rows.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-mono">
                Query executed successfully. 0 rows returned matching criteria.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-medium">
                      {queryResult.columns.map(col => (
                        <th key={col} className="px-4 py-2.5 font-mono capitalize">
                          {col.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {queryResult.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        {queryResult.columns.map(col => {
                          const val = row[col];
                          const isNumber = typeof val === 'number';
                          return (
                            <td
                              key={col}
                              className={`px-4 py-2 text-slate-700 ${
                                isNumber ? 'font-mono tabular-nums text-slate-900' : ''
                              }`}
                            >
                              {val === null || val === undefined
                                ? '—'
                                : typeof val === 'boolean'
                                ? val ? 'true' : 'false'
                                : String(val)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Schema & DDL Explorer */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                PostgreSQL & SQLite DDL Schema Definition
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Production relational schema with typed constraints, indexes, and foreign keys
              </p>
            </div>
            <button
              onClick={handleCopyDdl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              {copiedDdl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedDdl ? 'Copied to Clipboard' : 'Copy SQL Schema'}</span>
            </button>
          </div>
          <pre className="p-6 font-mono text-xs text-slate-800 bg-slate-900 text-slate-100 overflow-x-auto max-h-[550px] leading-relaxed">
            <code>{SQL_SCHEMA_DDL}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
