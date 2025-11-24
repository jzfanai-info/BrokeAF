import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, FinancialPlan } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { addFinancialPlan, subscribeToPlans, deleteFinancialPlan, updateFinancialPlan } from '../services/firestoreService';
import { Target, TrendingUp, Calendar, PiggyBank, Plus, Trash2, ArrowRight, Pencil } from 'lucide-react';
import { ConfirmModal } from './ui/ConfirmModal';

interface BudgetPlannerProps {
  userId: string;
  transactions: Transaction[];
}

export const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ userId, transactions }) => {
  const [plans, setPlans] = useState<FinancialPlan[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Delete State
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetIncome, setTargetIncome] = useState('');
  const [targetSavings, setTargetSavings] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToPlans(userId, (data) => setPlans(data));
    return () => unsubscribe();
  }, [userId]);

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate || !targetIncome || !targetSavings) return;
    
    setLoading(true);
    try {
      const planData = {
        name,
        startDate,
        endDate,
        targetIncome: parseFloat(targetIncome),
        targetSavings: parseFloat(targetSavings)
      };

      if (editingId) {
        await updateFinancialPlan(userId, editingId, planData);
      } else {
        await addFinancialPlan(userId, { ...planData, userId });
      }
      
      closeForm();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan: FinancialPlan) => {
    setName(plan.name);
    setStartDate(plan.startDate);
    setEndDate(plan.endDate);
    setTargetIncome(plan.targetIncome.toString());
    setTargetSavings(plan.targetSavings.toString());
    setEditingId(plan.id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = async () => {
    if (!planToDelete) return;
    setIsDeleting(true);
    try {
      await deleteFinancialPlan(userId, planToDelete);
      setPlanToDelete(null);
    } catch (error) {
      console.error("Failed to delete plan", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setStartDate('');
    setEndDate('');
    setTargetIncome('');
    setTargetSavings('');
  };

  const calculateProgress = (plan: FinancialPlan) => {
    const relevantTransactions = transactions.filter(t => 
      t.date >= plan.startDate && t.date <= plan.endDate
    );

    const actualIncome = relevantTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const actualExpense = relevantTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const actualSavings = actualIncome - actualExpense;

    return {
      actualIncome,
      actualSavings,
      incomeProgress: Math.min((actualIncome / plan.targetIncome) * 100, 100),
      savingsProgress: Math.min((actualSavings / plan.targetSavings) * 100, 100),
      isSavingsNegative: actualSavings < 0
    };
  };

  return (
    <>
      <div className="space-y-8 animate-fade-in-up pb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-tr from-pink-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-pink-500/30">
              <Target className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-3xl font-display font-black text-slate-800 dark:text-white">Financial Planner</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Set goals, track progress, secure the bag.</p>
            </div>
          </div>
          
          {!isFormOpen && plans.length > 0 && (
            <Button onClick={() => setIsFormOpen(true)} className="hidden md:flex">
              <Plus size={18} /> New Plan
            </Button>
          )}
        </div>

        {/* --- CREATE / EDIT FORM --- */}
        {isFormOpen ? (
          <Card className="p-8 max-w-2xl mx-auto border-2 border-pink-100 dark:border-white/10">
            <h3 className="text-2xl font-black font-display mb-6 text-slate-800 dark:text-white">
              {editingId ? 'Edit Plan' : 'Create New Plan'}
            </h3>
            <form onSubmit={handleSavePlan} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">Plan Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Q4 Savings Push, Summer Vacation"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 font-bold focus:outline-none focus:ring-2 focus:ring-pink-500 dark:text-white"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">Start Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-900 dark:text-slate-900"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">End Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-900 dark:text-slate-900"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-emerald-500">Target Income</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-400 font-bold">₹</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                      value={targetIncome}
                      onChange={e => setTargetIncome(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-purple-500">Target Savings</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-400 font-bold">₹</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                      value={targetSavings}
                      onChange={e => setTargetSavings(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" isLoading={loading} className="flex-1">
                  {editingId ? 'Update Plan' : 'Create Plan'}
                </Button>
                <Button type="button" variant="secondary" onClick={closeForm} className="flex-1">Cancel</Button>
              </div>
            </form>
          </Card>
        ) : (
          <>
            {/* --- EMPTY STATE --- */}
            {plans.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-20 bg-white/50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 backdrop-blur-sm animate-in zoom-in-95">
                <div className="w-20 h-20 bg-gradient-to-tr from-pink-200 to-purple-200 dark:from-pink-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-pink-500" />
                </div>
                <h3 className="text-2xl font-black font-display text-slate-800 dark:text-white mb-2">No Active Plans</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                  Start by creating a financial roadmap. Set your income goals and savings targets for a specific period.
                </p>
                <Button onClick={() => setIsFormOpen(true)} size="lg" className="shadow-xl shadow-pink-500/20">
                  <Plus size={20} /> Create New Plan
                </Button>
              </div>
            )}

            {/* --- PLANS LIST --- */}
            <div className="grid gap-6">
              {plans.map((plan) => {
                const { actualIncome, actualSavings, incomeProgress, savingsProgress, isSavingsNegative } = calculateProgress(plan);
                
                return (
                  <Card key={plan.id} className="p-6 md:p-8 relative overflow-hidden group hover:border-pink-300 dark:hover:border-purple-500 transition-all">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                      <div>
                        <h3 className="text-2xl font-black font-display text-slate-800 dark:text-white">{plan.name}</h3>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">
                          <Calendar size={14} />
                          <span>{new Date(plan.startDate).toLocaleDateString()}</span>
                          <ArrowRight size={14} />
                          <span>{new Date(plan.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(plan)}
                          className="p-2 text-slate-400 hover:text-pink-500 bg-slate-50 dark:bg-white/5 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
                          title="Edit Plan"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setPlanToDelete(plan.id);
                          }}
                          className="p-2 text-slate-400 hover:text-rose-500 bg-slate-50 dark:bg-white/5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                          title="Delete Plan"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Income Progress */}
                      <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="text-emerald-500" size={20} />
                            <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase text-xs tracking-wider">Income Goal</span>
                          </div>
                          <span className="font-black text-emerald-600 dark:text-emerald-300">₹{actualIncome.toFixed(0)} / ₹{plan.targetIncome}</span>
                        </div>
                        <div className="w-full bg-emerald-200/50 dark:bg-emerald-900/30 rounded-full h-3 overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                            style={{ width: `${incomeProgress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Savings Progress */}
                      <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <PiggyBank className="text-purple-500" size={20} />
                            <span className="font-bold text-purple-700 dark:text-purple-400 uppercase text-xs tracking-wider">Savings Target</span>
                          </div>
                          <span className={`font-black ${isSavingsNegative ? 'text-rose-500' : 'text-purple-600 dark:text-purple-300'}`}>
                            ₹{actualSavings.toFixed(0)} / ₹{plan.targetSavings}
                          </span>
                        </div>
                        <div className="w-full bg-purple-200/50 dark:bg-purple-900/30 rounded-full h-3 overflow-hidden">
                          {isSavingsNegative ? (
                            <div className="h-full bg-rose-500 w-full pattern-diagonal opacity-50"></div>
                          ) : (
                            <div 
                              className="h-full bg-purple-500 rounded-full transition-all duration-1000" 
                              style={{ width: `${savingsProgress}%` }}
                            ></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
      
      <ConfirmModal 
        isOpen={!!planToDelete}
        onClose={() => setPlanToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Plan"
        message="Are you sure you want to delete this financial plan? This action cannot be undone."
        isLoading={isDeleting}
      />
    </>
  );
};