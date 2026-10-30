'use client';

import { Sparkles, Award } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const featureImportance = [
  { feature: 'Sulfate', importance: 18.5 },
  { feature: 'pH Level', importance: 15.2 },
  { feature: 'Hardness', importance: 13.8 },
  { feature: 'Chloramines', importance: 12.4 },
  { feature: 'Solids (TDS)', importance: 11.1 },
  { feature: 'Trihalomethanes', importance: 10.3 },
  { feature: 'Conductivity', importance: 7.2 },
  { feature: 'Turbidity', importance: 6.0 },
  { feature: 'Organic Carbon', importance: 5.5 },
];

export default function ModelsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Sparkles className="w-7 h-7 theme-accent-text" />
          Model Architecture & Explainable AI (XAI)
        </h1>
        <p className="text-slate-400 mt-1">
          Explore pipeline performance metrics and underlying feature importance contributions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="theme-card rounded-2xl p-5 border shadow-lg">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Classifier</span>
          <p className="text-xl font-bold theme-accent-text mt-2">XGBoost v1.7</p>
        </div>
        <div className="theme-card rounded-2xl p-5 border shadow-lg">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Accuracy Score</span>
          <p className="text-xl font-bold text-emerald-400 mt-2">79.2%</p>
        </div>
        <div className="theme-card rounded-2xl p-5 border shadow-lg">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">F1-Score</span>
          <p className="text-xl font-bold text-indigo-400 mt-2">0.76</p>
        </div>
        <div className="theme-card rounded-2xl p-5 border shadow-lg">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Imputer</span>
          <p className="text-xl font-bold text-amber-400 mt-2">KNN (k=5)</p>
        </div>
      </div>

      <div className="theme-card rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-4 mb-6">
          <Award className="w-5 h-5 theme-accent-text" />
          <h2 className="font-semibold text-slate-200">Gini Feature Importance Breakdown</h2>
        </div>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={featureImportance} margin={{ left: 30 }}>
              <XAxis type="number" stroke="#94a3b8" unit="%" />
              <YAxis dataKey="feature" type="category" stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Bar dataKey="importance" name="Importance %" fill="#06b6d4" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}