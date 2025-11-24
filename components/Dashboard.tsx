import React, { useMemo } from 'react';
import { Transaction, FinancialSummary } from '../types';
import { Card } from './ui/Card';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  username: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, username }) => {
  const summary = useMemo<FinancialSummary>(() => {
    return transactions.reduce((acc, curr) => {
      const amt = Number(curr.amount);
      if (curr.type === 'income') {
        acc.totalIncome += amt;
        acc.balance += amt;
      } else {
        acc.totalExpense += amt;
        acc.balance -= amt;
      }
      return acc;
    }, { totalIncome: 0, totalExpense: 0, balance: 0 });
  }, [transactions]);

  const chartData = useMemo(() => {
    const grouped = transactions.reduce((acc: any, curr) => {
      const month = new Date(curr.date).toLocaleDateString('en-US', { month: 'short' });
      if (!acc[month]) acc[month] = { name: month, income: 0, expense: 0 };
      if (curr.type === 'income') acc[month].income += curr.amount;
      else acc[month].expense += curr.amount;
      return acc;
    }, {});
    return Object.values(grouped).reverse();
  }, [transactions]);

  const expenseCategoryData = useMemo(() => {
    const data = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc: any, curr) => {
        if (!acc[curr.category]) acc[curr.category] = 0;
        acc[curr.category] += curr.amount;
        return acc;
      }, {});
    
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  // Vibrant Palette
  const COLORS = ['#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#f43f5e'];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Note */}
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight text-slate-800 dark:text-white">
          Hi, <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">{username}</span>! 👋
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Welcome to BrokeAF. Let's get that bag. 💅</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 bg-gradient-to-br from-pink-500 to-purple-600 text-white border-none shadow-pink-500/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold opacity-80 uppercase tracking-wider mb-1">Total Balance</p>
              <h3 className="text-4xl font-display font-black tracking-tight">
                ₹{summary.balance.toFixed(2)}
              </h3>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-2 py-1 rounded-lg">
            <TrendingUp size={14} /> <span>On track this month</span>
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Income</p>
              <h3 className="text-3xl font-display font-black mt-1 text-emerald-500">
                +₹{summary.totalIncome.toFixed(2)}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
              <ArrowUpRight className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Expenses</p>
              <h3 className="text-3xl font-display font-black mt-1 text-rose-500">
                -₹{summary.totalExpense.toFixed(2)}
              </h3>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-2xl">
              <ArrowDownRight className="w-6 h-6 text-rose-500" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-1 lg:col-span-2 p-8 min-h-[450px]">
          <h4 className="text-xl font-display font-black mb-8 text-slate-800 dark:text-white">Financial Overview</h4>
          <div className="h-[350px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '16px', color: '#1e293b', padding: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontWeight: 600 }}
                  labelStyle={{ fontWeight: 700, color: '#64748b', marginBottom: '8px' }}
                />
                <Area type="monotone" dataKey="income" stroke="#ec4899" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 min-h-[450px]">
          <h4 className="text-xl font-display font-black mb-8 text-slate-800 dark:text-white">Spending Breakdown</h4>
          <div className="h-[300px] w-full min-w-0 relative">
            {expenseCategoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={8}
                  >
                    {expenseCategoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 font-medium bg-slate-50 dark:bg-white/5 rounded-3xl">
                No spending data yet!
              </div>
            )}
            
            {/* Center Text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
               <p className="text-2xl font-black text-slate-800 dark:text-white">₹{summary.totalExpense.toFixed(0)}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
             {expenseCategoryData.slice(0, 4).map((entry: any, index: number) => (
               <div key={index} className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                   <span className="font-bold text-slate-600 dark:text-slate-300">{entry.name}</span>
                 </div>
                 <span className="font-mono font-bold text-slate-500 dark:text-slate-400">₹{entry.value}</span>
               </div>
             ))}
          </div>
        </Card>
      </div>

      <Card className="p-8">
        <h4 className="text-xl font-display font-black mb-6 text-slate-800 dark:text-white">Recent Vibes</h4>
        <div className="space-y-1">
          {transactions.slice(0, 10).map((t) => (
            <div key={t.id} className="flex items-center justify-between py-4 border-b border-slate-50 dark:border-white/5 last:border-0 hover:bg-slate-50/50 dark:hover:bg-white/5 -mx-4 px-4 md:-mx-8 md:px-8 transition-colors">
               <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-sm shrink-0 ${
                     t.type === 'income' 
                     ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' 
                     : 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                  }`}>
                     {t.type === 'income' ? '💰' : '💸'}
                  </div>
                  <div className="flex flex-col min-w-0">
                     <p className="font-bold text-slate-700 dark:text-white text-sm truncate">
                        {t.notes || t.category}
                     </p>
                     <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="whitespace-nowrap">{new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                        <span className="truncate max-w-[100px]">{t.category}</span>
                     </div>
                  </div>
               </div>
               <div className={`font-black text-sm md:text-base ml-4 whitespace-nowrap ${t.type === 'income' ? 'text-emerald-500' : 'text-slate-800 dark:text-white'}`}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
               </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="text-center py-10 text-slate-400 font-medium">No vibes recorded yet.</div>
          )}
        </div>
      </Card>
    </div>
  );
};