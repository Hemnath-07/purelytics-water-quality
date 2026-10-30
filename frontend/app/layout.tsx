'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Activity, BarChart3, Droplets, Settings, Sliders, Sparkles, X, Check, Sun, Moon } from 'lucide-react';
import './globals.css';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Overview', href: '/overview', icon: Activity },
  { name: 'What-If Simulator', href: '/simulator', icon: Sliders },
  { name: 'Visualizations', href: '/visualizations', icon: BarChart3 },
  { name: 'Model Metrics', href: '/models', icon: Sparkles },
];

const themes = [
  { id: 'default', name: 'Cyber Cyan (Dark)', primary: '#06b6d4' },
  { id: 'light', name: 'Enterprise Light', primary: '#0284c7' },
  { id: 'emerald', name: 'Deep Emerald', primary: '#10b981' },
  { id: 'violet', name: 'Neon Violet', primary: '#a855f7' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('purelytics-theme') || 'default';
    setCurrentTheme(saved);
    document.documentElement.setAttribute('data-theme', saved === 'default' ? '' : saved);
  }, []);

  const changeTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem('purelytics-theme', themeId);
    document.documentElement.setAttribute('data-theme', themeId === 'default' ? '' : themeId);
  };

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-white">
        <header className="sticky top-0 z-40 backdrop-blur-md theme-card px-6 py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 theme-btn-primary rounded-xl shadow-lg">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight theme-accent-text">
                PURELYTICS
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2 px-2 py-0.5 rounded-full bg-slate-800/20 border border-slate-700/30">
                PRO v2.5
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'theme-btn-primary font-bold shadow-md'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/30'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={() => setIsThemeOpen(true)}
              className="p-2.5 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-700/40 transition text-slate-300 shadow-md"
              title="Settings & Themes"
            >
              <Settings className="w-5 h-5 animate-spin-slow" />
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
          {children}
        </main>

        {isThemeOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <div className="w-80 h-full theme-card p-6 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-700/40">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 theme-accent-text" />
                    <h2 className="font-bold text-lg">Theme Studio</h2>
                  </div>
                  <button onClick={() => setIsThemeOpen(false)} className="p-1 rounded-lg hover:bg-slate-800/30">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6 space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Select Accent Palette</label>
                  <div className="space-y-2">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => changeTheme(t.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                          currentTheme === t.id
                            ? 'border-cyan-500 bg-slate-800/40 shadow-md'
                            : 'border-slate-800/60 hover:bg-slate-800/20'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: t.primary }} />
                          <span className="text-sm font-medium">{t.name}</span>
                        </div>
                        {currentTheme === t.id && <Check className="w-4 h-4 theme-accent-text" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 text-center border-t border-slate-700/40 pt-4">
                Purelytics Theme Engine
              </div>
            </div>
          </div>
        )}

        <footer className="border-t border-slate-800/40 theme-card py-6 px-8 text-center text-xs text-slate-500">
          <p className="max-w-2xl mx-auto">
            <span className="font-semibold text-amber-400">DISCLAIMER:</span> Purelytics is an AI screening assistant. Predictions provided do not substitute certified laboratory chemical testing.
          </p>
        </footer>
      </body>
    </html>
  );
}