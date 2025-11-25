import React from 'react';
import { Card } from './ui/Card';
import { 
  ShieldAlert, 
  Layers, 
  Code2, 
  GitBranch, 
  Database,
  Lock,
  Heart
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white">Project Documentation</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Overview of the architecture, features, and security considerations for BrokeAF.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Overview */}
        <Card className="p-6 md:col-span-2 border-l-4 border-l-pink-500">
          <div className="flex items-start gap-4">
             <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-2xl">
               <Heart className="w-6 h-6 text-pink-500" fill="currentColor" />
             </div>
             <div>
               <h2 className="text-xl font-bold mb-2 font-display text-slate-900 dark:text-white">System Overview</h2>
               <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                 BrokeAF is a vibrant personal finance dashboard designed to demonstrate modern web application architecture with a focus on UX and aesthetics. 
                 It features real-time data synchronization and a dual-mode data layer (Firebase + LocalStorage).
               </p>
               <div className="mt-4 flex flex-wrap gap-2">
                 <span className="px-2 py-1 bg-slate-100 dark:bg-white/10 rounded text-xs font-mono dark:text-white">v3.1.0</span>
                 <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded text-xs font-mono">Lite Edition</span>
               </div>
             </div>
          </div>
        </Card>

        {/* Functionalities */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-display text-slate-800 dark:text-white">
            <Layers className="w-5 h-5 text-purple-500" /> Core Functionalities
          </h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex gap-2">
              <span className="text-emerald-500">✓</span> 
              <span><strong>Hybrid Auth:</strong> Firebase Authentication with Demo Mode fallback.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500">✓</span> 
              <span><strong>Transaction CRUD:</strong> Create, Read, Update, and Delete financial records.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500">✓</span> 
              <span><strong>Category Management:</strong> Dynamic addition/deletion with cascade updates.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500">✓</span> 
              <span><strong>Advanced Filtering:</strong> Filter by date ranges and sort by amount/date.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500">✓</span> 
              <span><strong>Budget Planning:</strong> Visual progress bars for monthly category limits.</span>
            </li>
          </ul>
        </Card>

        {/* Tech Stack */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-display text-slate-800 dark:text-white">
            <Code2 className="w-5 h-5 text-pink-500" /> Technology Stack
          </h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-1">
              <span>Frontend Framework</span>
              <span className="font-mono text-xs bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded">React 19</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-1">
              <span>Styling</span>
              <span className="font-mono text-xs bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded">Tailwind CSS</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-1">
              <span>Backend / DB</span>
              <span className="font-mono text-xs bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded">Firebase Firestore</span>
            </li>
             <li className="flex justify-between pt-1">
              <span>Design System</span>
              <span className="font-mono text-xs bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded">Custom (Glassmorphism)</span>
            </li>
          </ul>
        </Card>

        {/* Limitations */}
        <Card className="p-6">
           <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-display text-slate-800 dark:text-white">
            <GitBranch className="w-5 h-5 text-amber-500" /> Current Limitations
          </h3>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex gap-2 items-start">
              <span className="text-amber-500 mt-1">•</span>
              <span><strong>Data Export:</strong> CSV/PDF export functionality is currently pending.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-amber-500 mt-1">•</span>
              <span><strong>Demo Persistence:</strong> Data entered in "Demo Mode" is stored in browser LocalStorage.</span>
            </li>
             <li className="flex gap-2 items-start">
              <span className="text-amber-500 mt-1">•</span>
              <span><strong>Recurring Transactions:</strong> Automated recurring entries are currently manual only.</span>
            </li>
          </ul>
        </Card>

        {/* Vulnerabilities & Security */}
        <Card className="p-6">
           <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-display text-slate-800 dark:text-white">
            <ShieldAlert className="w-5 h-5 text-rose-500" /> Vulnerabilities & Security
          </h3>
          <div className="space-y-4 text-sm">
             <div className="bg-rose-50 dark:bg-rose-900/10 p-3 rounded-lg border border-rose-100 dark:border-rose-900/30">
               <h4 className="font-bold text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-2">
                 <Database size={14} /> Firestore Rules
               </h4>
               <p className="text-rose-500 dark:text-rose-300/80 text-xs leading-relaxed">
                 Ensure Firestore security rules are strictly configured to allow <code>read/write</code> access 
                 only to authenticated users.
               </p>
             </div>
          </div>
        </Card>
      </div>

      <div className="text-center pt-6 border-t border-slate-200 dark:border-white/5">
         <p className="text-xs text-slate-400">
           Last Updated: {new Date().toLocaleDateString()} &bull; BrokeAF System Status: Fabulous ✨
         </p>
      </div>
    </div>
  );
};