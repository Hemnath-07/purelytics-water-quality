'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';

export default function SimulatorPage() {
  const [params, setParams] = useState({
    ph: 7.0,
    Hardness: 200.0,
    Solids: 20000.0,
    Chloramines: 7.0,
    Sulfate: 300.0,
    Conductivity: 400.0,
    Organic_carbon: 10.0,
    Trihalomethanes: 60.0,
    Turbidity: 4.0,
  });

  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchScore = async () => {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const res = await axios.post(`${apiUrl}/predict`, params);
        setScore(res.data.potability_score);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => { fetchScore(); }, 300);
    return () => clearTimeout(timer);
  }, [params]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <SlidersHorizontal className="w-7 h-7 theme-accent-text" /> What-If Parameter Simulator
        </h1>
        <p className="text-slate-400 mt-1">Adjust chemical parameter sliders in real-time to observe prediction impacts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 theme-card rounded-2xl p-6 space-y-5">
          {Object.entries(params).map(([key, val]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium capitalize text-slate-300">{key.replace('_', ' ')}</span>
                <span className="font-mono theme-accent-text font-bold">{val}</span>
              </div>
              <input
                type="range"
                min={0}
                max={key === 'ph' ? 14 : key === 'Solids' ? 50000 : 1000}
                step={key === 'ph' ? 0.1 : 1}
                value={val}
                onChange={(e) => setParams({ ...params, [key]: parseFloat(e.target.value) })}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                style={{ backgroundColor: 'var(--border-color)' }}
              />
            </div>
          ))}
        </div>

        <div className="lg:col-span-4 theme-card rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xl h-fit">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Simulated Potability Score</span>
          <div className="relative flex items-center justify-center">
            {loading && <RefreshCw className="absolute w-8 h-8 theme-accent-text animate-spin" />}
            <span className={`text-6xl font-extrabold ${loading ? 'opacity-30' : ''}`}>
              {score !== null ? `${score}%` : '--'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}