'use client';

import { useState } from 'react';
import axios from 'axios';
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, RefreshCw, Gauge, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'manual' | 'csv'>('manual');
  
  // Manual Entry State
  const [formData, setFormData] = useState({
    ph: 7.2,
    Hardness: 204.8,
    Solids: 20791.3,
    Chloramines: 7.3,
    Sulfate: 333.3,
    Conductivity: 421.8,
    Organic_carbon: 14.1,
    Trihalomethanes: 66.3,
    Turbidity: 3.96,
  });
  const [manualResult, setManualResult] = useState<any>(null);
  const [loadingManual, setLoadingManual] = useState(false);

  // CSV Upload State
  const [file, setFile] = useState<File | null>(null);
  const [loadingCSV, setLoadingCSV] = useState(false);
  const [csvResult, setCsvResult] = useState<any>(null);

  const handleManualPredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingManual(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await axios.post(`${apiUrl}/predict`, formData);
      setManualResult(response.data);
    } catch (err) {
      alert('Unable to reach prediction server.');
    } finally {
      setLoadingManual(false);
    }
  };

  const handleCSVUpload = async () => {
    if (!file) return;
    setLoadingCSV(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await axios.post(`${apiUrl}/batch-predict`, data);
      if (response.data.error) alert(response.data.error);
      else setCsvResult(response.data);
    } catch (err) {
      alert('Failed to process CSV file.');
    } finally {
      setLoadingCSV(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight theme-accent-text">
          Water Quality Intelligence System
        </h1>
        <p className="text-slate-400 text-sm">
          Run single-sample manual parameter assessments or upload batch CSV datasets for instant ML classification.
        </p>

        {/* Tab Selection Switcher */}
        <div className="inline-flex p-1 rounded-2xl theme-card border mt-4">
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'manual' ? 'theme-btn-primary shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Manual Parameter Entry
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'csv' ? 'theme-btn-primary shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload CSV Dataset
          </button>
        </div>
      </div>

      {activeTab === 'manual' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 theme-card rounded-2xl p-6 shadow-xl">
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
              <Gauge className="w-5 h-5 theme-accent-text" /> Chemical Metrics Entry
            </h2>
            <form onSubmit={handleManualPredict} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(formData).map((key) => (
                <div key={key} className="space-y-1">
                  <label className="text-xs font-medium capitalize text-slate-400">{key.replace('_', ' ')}</label>
                  <input
                    type="number"
                    step="any"
                    name={key}
                    value={(formData as any)[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: parseFloat(e.target.value) || 0 })}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                    style={{ backgroundColor: 'var(--input-bg)' }}
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={loadingManual}
                className="sm:col-span-2 mt-4 w-full theme-btn-primary font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                {loadingManual ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Run Assessment'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5">
            {manualResult ? (
              <div className="theme-card rounded-2xl p-6 shadow-xl h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-700/40">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Verdict</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      manualResult.potable === 1 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {manualResult.status}
                    </span>
                  </div>
                  <div className="text-center py-10">
                    <span className="text-6xl font-extrabold">{manualResult.potability_score}%</span>
                    <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest">Potability Confidence</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 italic p-3 rounded-xl border border-slate-700/30">
                  {manualResult.disclaimer}
                </p>
              </div>
            ) : (
              <div className="theme-card rounded-2xl p-8 border border-dashed text-center h-full flex flex-col items-center justify-center">
                <p className="text-xs text-slate-500">Fill in parameters and click Run Assessment to view prediction details.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="theme-card rounded-2xl p-8 border border-dashed text-center flex flex-col items-center justify-center shadow-xl">
            <Upload className="w-12 h-12 theme-accent-text mb-3 animate-bounce" />
            <h3 className="text-lg font-semibold">Select CSV Water Quality Dataset</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">Ensure columns match required parameters (ph, Sulfate, Solids, etc.)</p>
            <input type="file" accept=".csv" onChange={(e) => e.target.files && setFile(e.target.files[0])} className="hidden" id="csv-file-home" />
            <div className="flex items-center gap-3">
              <label htmlFor="csv-file-home" className="cursor-pointer border px-5 py-2.5 rounded-xl text-sm font-medium">
                {file ? file.name : 'Choose File'}
              </label>
              {file && (
                <button onClick={handleCSVUpload} disabled={loadingCSV} className="theme-btn-primary font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2">
                  {loadingCSV ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
                  {loadingCSV ? 'Analyzing...' : 'Execute Batch Model'}
                </button>
              )}
            </div>
          </div>

          {csvResult && (
            <div className="theme-card rounded-2xl p-6 border space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-xl border">
                  <span className="text-xs text-slate-400 uppercase">Total Samples</span>
                  <p className="text-xl font-bold">{csvResult.summary.total_samples}</p>
                </div>
                <div className="p-4 rounded-xl border">
                  <span className="text-xs text-slate-400 uppercase">Potable</span>
                  <p className="text-xl font-bold text-emerald-400">{csvResult.summary.potable_count}</p>
                </div>
                <div className="p-4 rounded-xl border">
                  <span className="text-xs text-slate-400 uppercase">Non-Potable</span>
                  <p className="text-xl font-bold text-rose-400">{csvResult.summary.non_potable_count}</p>
                </div>
                <div className="p-4 rounded-xl border">
                  <span className="text-xs text-slate-400 uppercase">Potability Rate</span>
                  <p className="text-xl font-bold theme-accent-text">{csvResult.summary.potability_rate}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}