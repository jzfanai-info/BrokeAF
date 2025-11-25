import React from "react";
import { Card } from "./ui/Card";
import {
  ShieldAlert,
  Layers,
  Code2,
  GitBranch,
  Database,
  Lock,
  Heart,
  Sparkles,
  Zap,
} from "lucide-react";

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-14 animate-fade-in-up">
      {/* PAGE HEADER */}
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
          BrokeAF Documentation
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          A stylish financial playground crafted with love, logic, and a little
          chaos.
        </p>
      </div>

      {/* HERO PANEL */}
      <Card className="p-8 border-l-4 border-l-pink-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-start gap-5">
          <div className="p-4 bg-gradient-to-br from-pink-100 to-rose-200 dark:from-pink-900/30 dark:to-rose-900/20 rounded-2xl shadow-inner">
            <Heart className="w-7 h-7 text-pink-500" fill="currentColor" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
              System Overview
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-2 text-sm">
              BrokeAF is a modern personal finance dashboard built for clarity
              and fun. It syncs in real-time using Firebase, supports Demo Mode,
              and brings a polished glass-morphism UI experience to life.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-lg text-xs font-mono dark:text-white">
                v3.3.0
              </span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-lg text-xs font-mono">
                Live Release
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-lg text-xs font-mono">
                Glass UI
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CORE FUNCTIONALITIES */}
        <Card className="p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-display text-slate-800 dark:text-white">
            <Layers className="w-5 h-5 text-purple-500" /> Core Functionalities
          </h3>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex gap-2 items-start">
              <Sparkles className="text-emerald-500 w-4 h-4 mt-1" />
              <span>
                <strong>Hybrid Auth </strong> – Firebase + Demo Mode fallback.
              </span>
            </li>

            <li className="flex gap-2 items-start">
              <Sparkles className="text-emerald-500 w-4 h-4 mt-1" />
              <span>
                <strong>Transaction CRUD</strong> – Fully animated & real-time
                synced.
              </span>
            </li>

            <li className="flex gap-2 items-start">
              <Sparkles className="text-emerald-500 w-4 h-4 mt-1" />
              <span>
                <strong>Category Manager</strong> – Custom categories with
                auto-cascade.
              </span>
            </li>

            <li className="flex gap-2 items-start">
              <Sparkles className="text-emerald-500 w-4 h-4 mt-1" />
              <span>
                <strong>Advanced Filters</strong> – Search, date range, type
                filter, sorting.
              </span>
            </li>

            <li className="flex gap-2 items-start">
              <Sparkles className="text-emerald-500 w-4 h-4 mt-1" />
              <span>
                <strong>Budget Planner</strong> – Animated progress bars &
                insights.
              </span>
            </li>
          </ul>
        </Card>

        {/* TECH STACK */}
        <Card className="p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-display text-slate-800 dark:text-white">
            <Code2 className="w-5 h-5 text-pink-500" /> Technology Stack
          </h3>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
              <span>Frontend</span>
              <span className="font-mono text-xs bg-white/10 dark:bg-white/10 px-2 py-1 rounded">
                React 19 + Vite
              </span>
            </li>

            <li className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
              <span>Styling</span>
              <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded">
                Tailwind CSS
              </span>
            </li>

            <li className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
              <span>Database</span>
              <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded">
                Firebase Firestore
              </span>
            </li>

            <li className="flex justify-between pt-2">
              <span>Design Language</span>
              <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded">
                BrokeAF Glass UI
              </span>
            </li>
          </ul>
        </Card>
      </div>

      {/* STATUS FOOTER */}
      <div className="text-center pt-8 border-t border-slate-200 dark:border-white/5">
        <p className="text-xs text-slate-400">
          Updated on {new Date().toLocaleDateString()} • BrokeAF System Status:
          <span className="mx-1 text-pink-500 font-bold">✨ Fabulous ✨</span>
        </p>
      </div>
    </div>
  );
};
