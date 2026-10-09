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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-indigo-100/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-slate-900">
            Relational SQL Query Console & Schema Explorer
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span className="font-medium text-indigo-600/80">PostgreSQL & SQLite Compatible</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Zero-Cost Embedded DB</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono tabular-nums font-semibold text-slate-700">{employees.length} Metric Rows</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setActiveSubTab('query')}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'query'
                  ? 'bg-white text-indigo-950 shadow-xs font-semibold border border-indigo-100/60'
                  : 'text-slate-600 hover:text-indigo-900 font-medium'
              }`}
            >
              SQL Query Runner
            </button>
            <button
              onClick={() => setActiveSubTab('schema')}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'schema'
                  ? 'bg-white text-indigo-950 shadow-xs font-semibold border border-indigo-100/60'
                  : 'text-slate-600 hover:text-indigo-900 font-medium'
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
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-900/60 block mb-2">
              HR Analytical Query Templates
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {PREDEFINED_QUERIES.map(q => {
                const isSelected = queryText === q.sql;
                return (
                  <button
                    key={q.id}
                    onClick={() => handleSelectPredefined(q.sql)}
                    className={`p-3 text-left rounded-xl border transition-all cursor-pointer shadow-2xs ${
                      isSelected
                        ? 'border-indigo-600 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs shadow-indigo-500/25'
                        : 'border-indigo-100/70 bg-white hover:border-indigo-200 hover:bg-indigo-50/20 text-slate-700'
                    }`}
                  >
                    <div className={`text-xs font-semibold line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {q.title}
                    </div>
                    <div className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {q.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editor & Execution Panel */}
          <div className="bg-white/95 backdrop-blur-xs rounded-2xl border border-indigo-100/70 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.03)] overflow-hidden">
            <div className="px-5 py-3 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>sqlite&gt; employees_db.sqlite</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunQuery}
                  className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5 focus-visible:outline-none shadow-2xs"
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
              className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-50/40 border-b border-indigo-100/70 focus:outline-none focus:bg-white resize-y transition-colors"
              placeholder="Enter SELECT SQL query..."
            />

            {/* Query Telemetry Bar */}
            <div className="px-5 py-2.5 bg-white flex items-center justify-between text-xs text-slate-500 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span>
                  Returned: <strong className="font-mono tabular-nums text-slate-900 font-semibold">{queryResult.rowCount} rows</strong>
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>
                  Latency: <strong className="font-mono tabular-nums text-slate-900 font-semibold">{queryResult.executionTimeMs} ms</strong>
                </span>
              </div>
              {queryResult.rows.length > 0 && (
                <button
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 cursor-pointer font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              )}
            </div>

            {/* Result Table */}
            {queryResult.error ? (
              <div className="p-6 text-xs font-mono text-rose-600 bg-rose-50/60">
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
                        <th key={col} className="px-4 py-2.5 font-mono capitalize font-semibold">
                          {col.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {queryResult.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                        {queryResult.columns.map(col => {
                          const val = row[col];
                          const isNumber = typeof val === 'number';
                          return (
                            <td
                              key={col}
                              className={`px-4 py-2 text-slate-700 ${
                                isNumber ? 'font-mono tabular-nums text-slate-900 font-medium' : ''
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
        <div className="bg-white/95 backdrop-blur-xs rounded-2xl border border-indigo-100/70 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.03)] overflow-hidden">
          <div className="px-6 py-4 border-b border-indigo-100/60 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-semibold font-display text-slate-900">
                PostgreSQL & SQLite DDL Schema Definition
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Production relational schema with typed constraints, indexes, and foreign keys
              </p>
            </div>
            <button
              onClick={handleCopyDdl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer shadow-2xs"
            >
              {copiedDdl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedDdl ? 'Copied to Clipboard' : 'Copy SQL Schema'}</span>
            </button>
          </div>
          <pre className="p-6 font-mono text-xs text-slate-100 bg-slate-900 overflow-x-auto max-h-[550px] leading-relaxed">
            <code>{SQL_SCHEMA_DDL}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
