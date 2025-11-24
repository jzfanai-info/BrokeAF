import React, { useState } from 'react';
import { Transaction } from '../types';
import { generateFinancialInsights } from '../services/geminiService';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Sparkles, Bot, Info, Wand2 } from 'lucide-react';

export const SmartInsights: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (transactions.length === 0) {
      setInsight("Add some transactions first, bestie! I need data to work my magic. ✨");
      return;
    }
    setLoading(true);
    const result = await generateFinancialInsights(transactions);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center space-y-4 py-8 relative">
        <div className="w-24 h-24 bg-gradient-to-tr from-pink-500 to-violet-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-pink-500/30 animate-float">
           <Wand2 className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white">AI Financial Advisor</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">
          Let Gemini analyze your spending and give you that unfiltered financial tea. ☕️
        </p>
        <div className="pt-4">
          <Button onClick={handleGenerate} isLoading={loading} size="lg" className="w-full md:w-auto min-w-[200px] shadow-xl shadow-pink-500/20">
            <Sparkles size={18} /> Reveal My Insights
          </Button>
        </div>
      </div>

      {insight && (
        <div className="animate-in slide-in-from-bottom-10 duration-500">
          <Card className="p-8 border-2 border-pink-100 dark:border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
            <div className="flex items-center gap-3 mb-6 border-b border-pink-50 dark:border-white/5 pb-4">
              <Bot className="w-6 h-6 text-pink-500" />
              <span className="font-bold text-lg font-display text-slate-800 dark:text-white">The Analysis</span>
            </div>
            <div className="prose dark:prose-invert max-w-none prose-p:font-medium prose-headings:font-display prose-headings:font-black prose-li:font-medium prose-strong:text-pink-600 dark:prose-strong:text-pink-400">
               {insight.split('\n').map((line, i) => {
                 if (line.startsWith('**') || line.startsWith('###')) {
                   return <h4 key={i} className="text-xl font-black mt-6 mb-3 text-slate-800 dark:text-white">{line.replace(/\*/g, '').replace(/#/g, '')}</h4>;
                 }
                 if (line.trim().startsWith('-')) {
                   return <li key={i} className="ml-4 marker:text-pink-500 text-slate-700 dark:text-slate-300 mb-2">{line.replace('-', '')}</li>
                 }
                 return <p key={i} className="leading-relaxed mb-3 text-slate-600 dark:text-slate-300">{line}</p>
               })}
            </div>
          </Card>
        </div>
      )}

      {!insight && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
           {[
             { title: 'Spending Habits', desc: 'See where all that money is actually going.', icon: '🛍️' },
             { title: 'Savings Goals', desc: 'Find extra cash for that dream vacation.', icon: '✈️' },
             { title: 'Real Talk', desc: 'Unbiased advice on your budget limits.', icon: '💬' }
           ].map((item, i) => (
             <Card key={i} className="p-6 bg-white/50 dark:bg-white/5 border-pink-50 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors">
               <div className="text-3xl mb-3">{item.icon}</div>
               <h4 className="font-bold mb-2 font-display text-slate-800 dark:text-white">{item.title}</h4>
               <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
             </Card>
           ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-8">
        <Info size={14} />
        <p>Your data is processed anonymously by AI.</p>
      </div>
    </div>
  );
};