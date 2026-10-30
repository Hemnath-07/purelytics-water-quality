'use client';

import { Activity, ShieldCheck, Database, Zap, Cpu } from 'lucide-react';

export default function OverviewPage() {
  const stats = [
    { title: 'Screening Accuracy', value: '79.2%', desc: 'Trained on 3,276 water samples', icon: ShieldCheck },
    { title: 'Pipeline Latency', value: '< 45ms', desc: 'Realtime XGBoost inference', icon: Zap },
    { title: 'Supported Parameters', value: '9 Features', desc: 'pH, Hardness, TDS, Sulfate, etc.', icon: Database },
    { title: 'Model Engine', value: 'XGBoost v1.7', desc: 'With KNN Imputer preprocessing', icon: Cpu },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Activity className="w-7 h-7 theme-accent-text" /> Executive System Overview
        </h1>
        <p className="text-slate-400 mt-1">Key operational metrics and architectural performance parameters.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="theme-card rounded-2xl p-6 border shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-slate-400">{s.title}</span>
                <Icon className="w-5 h-5 theme-accent-text" />
              </div>
              <p className="text-3xl font-extrabold">{s.value}</p>
              <p className="text-xs text-slate-500">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}