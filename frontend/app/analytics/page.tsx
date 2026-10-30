'use client';

import { useState } from 'react';
import axios from 'axios';
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, Download, RefreshCw, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function AnalyticsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [batchData, setBatchData] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await axios.post(`${apiUrl}/batch-predict`, formData);

      if (response.data.error) {
        alert(response.data.error);
      } else {
        setBatchData(response.data);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to process batch CSV file. Ensure FastAPI backend is running on http://127.0.0.1:8000.');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!batchData) return;
    const items = batchData.predictions;
    const replacer = (key: string, value: any) => (value === null ? '' : value);
    const header = Object.keys(items[0]);
    const csv = [
      header.join(','),
      ...items.map((row: any) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(',')),
    ].join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'purelytics_batch_predictions.csv';
    a.click();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="w-7 h-7 theme-accent-text" />
          Batch CSV Upload & Dataset Intelligence
        </h1>
        <p className="text-slate-400 mt-1">
          Upload any water quality dataset CSV to execute batch predictions, examine distributions, and download report summaries.
        </p>
      </div>

      <div className="theme-card rounded-2xl p-8 border border-dashed border-slate-700 flex flex-col items-center justify-center text-center shadow-xl">
        <Upload className="w-12 h-12 theme-accent-text mb-3 animate-bounce" />
        <h3 className="text-lg font-semibold text-slate-200">Select or Drag CSV Dataset File</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">Dataset must contain water parameter columns (ph, Hardness, Sulfate, etc.)</p>

        <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="csv-input" />
        
        <div className="flex items-center space-x-3">
          <label htmlFor="csv-input" className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-2.5 rounded-xl border border-slate-700 text-sm font-medium transition">
            {file ? file.name : 'Choose File'}
          </label>

          {file && (
            <button
              onClick={handleUpload}
              disabled={loading}
              className="theme-btn-primary text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition flex items-center gap-2 shadow-lg"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
              {loading ? 'Processing Batch...' : 'Run Batch Analysis'}
            </button>
          )}
        </div>
      </div>

      {batchData && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="theme-card p-5 rounded-2xl border">
              <span className="text-xs font-semibold uppercase text-slate-400">Total Samples</span>
              <p className="text-2xl font-bold text-white mt-1">{batchData.summary.total_samples}</p>
            </div>
            <div className="theme-card p-5 rounded-2xl border">
              <span className="text-xs font-semibold uppercase text-slate-400">Potable Samples</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{batchData.summary.potable_count}</p>
            </div>
            <div className="theme-card p-5 rounded-2xl border">
              <span className="text-xs font-semibold uppercase text-slate-400">Non-Potable Samples</span>
              <p className="text-2xl font-bold text-rose-400 mt-1">{batchData.summary.non_potable_count}</p>
            </div>
            <div className="theme-card p-5 rounded-2xl border">
              <span className="text-xs font-semibold uppercase text-slate-400">Potability Rate</span>
              <p className="text-2xl font-bold theme-accent-text mt-1">{batchData.summary.potability_rate}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="theme-card rounded-2xl p-6">
              <h3 className="font-semibold text-slate-200 mb-4 pb-2 border-b border-slate-800">Batch Potability Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Potable', value: batchData.summary.potable_count },
                        { name: 'Non-Potable', value: batchData.summary.non_potable_count },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#f43f5e" />
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="theme-card rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-slate-200 mb-2">Export Prediction Report</h3>
                <p className="text-xs text-slate-400">Download row-level potability scores and classification tags in standard CSV format.</p>
              </div>
              <button
                onClick={exportCSV}
                className="theme-btn-primary text-slate-950 font-bold py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-lg mt-6"
              >
                <Download className="w-5 h-5" /> Download Prediction CSV Report
              </button>
            </div>
          </div>

          <div className="theme-card rounded-2xl p-6 border overflow-hidden">
            <h3 className="font-semibold text-slate-200 mb-4">Sample Batch Prediction Table (First 50 Rows)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 uppercase text-slate-400 font-semibold border-b border-slate-700">
                  <tr>
                    <th className="p-3">Sample ID</th>
                    <th className="p-3">pH</th>
                    <th className="p-3">Sulfate</th>
                    <th className="p-3">Solids</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {batchData.predictions.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-mono text-slate-400">#{idx + 1}</td>
                      <td className="p-3">{row.ph ?? 'N/A'}</td>
                      <td className="p-3">{row.Sulfate ?? 'N/A'}</td>
                      <td className="p-3">{row.Solids ?? 'N/A'}</td>
                      <td className="p-3 font-bold text-cyan-400">{row.Potability_Score}%</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            row.Potability_Prediction === 1
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {row.Potability_Prediction === 1 ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {row.Status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}