import React, { useState, useEffect } from 'react';
import { subscribeToCategories, addTransaction, updateTransaction } from '../services/firestoreService';
import { Button } from './ui/Button';
import { CategoryManager } from './CategoryManager';
import { TransactionType, Category, Transaction } from '../types';
import { Plus, Minus, Settings2 } from 'lucide-react';

interface TransactionFormProps {
  userId: string;
  onClose?: () => void;
  initialData?: Transaction | null;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ userId, onClose, initialData }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCatManager, setShowCatManager] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToCategories(userId, (data) => {
      setCategories(data);
    });
    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setDate(initialData.date);
      setNotes(initialData.notes || '');
    }
  }, [initialData]);

  const availableCategories = categories.filter(c => c.type === type || c.name === 'NA');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!amount || !category || !date) {
      setError('Required fields missing.');
      setLoading(false);
      return;
    }

    try {
      if (initialData) {
        await updateTransaction(userId, initialData.id, {
          type,
          amount: parseFloat(amount),
          category,
          date,
          notes
        });
      } else {
        await addTransaction(userId, {
          userId,
          type,
          amount: parseFloat(amount),
          category,
          date,
          notes
        });
      }
      if (!initialData) {
        setAmount('');
        setNotes('');
      }
      if (onClose) onClose();
    } catch (err) {
      setError('Failed to save.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Toggle */}
        <div className="flex p-1.5 bg-slate-100 dark:bg-white/10 rounded-full border border-slate-200 dark:border-white/5">
          <button
            type="button"
            onClick={() => { setType('income'); setCategory(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full transition-all text-sm font-bold ${
              type === 'income' 
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Plus size={16} strokeWidth={3} /> Income
          </button>
          <button
            type="button"
            onClick={() => { setType('expense'); setCategory(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full transition-all text-sm font-bold ${
              type === 'expense' 
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Minus size={16} strokeWidth={3} /> Expense
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-pink-500 uppercase tracking-wider mb-2">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-slate-800 dark:text-white font-bold text-xl">₹</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-white/10 bg-transparent text-3xl font-black focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/30 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 dark:text-white"
              placeholder="0.00"
              autoFocus={!initialData}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <div className="flex justify-between items-center mb-2">
               <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
               <button 
                 type="button" 
                 onClick={() => setShowCatManager(true)}
                 className="text-xs font-bold text-pink-500 hover:text-pink-600 underline"
               >
                 Manage
               </button>
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a0b2e] text-slate-900 dark:text-white text-sm font-bold focus:border-pink-500 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="">Select...</option>
              {availableCategories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-slate-900 text-sm font-bold focus:border-pink-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-medium focus:border-pink-500 focus:outline-none resize-none dark:text-white"
            placeholder="Details..."
          />
        </div>

        {error && <p className="text-white font-bold text-sm bg-red-500 p-3 rounded-xl text-center shadow-lg shadow-red-500/20">{error}</p>}

        <Button type="submit" isLoading={loading} className="w-full py-4 text-base shadow-lg shadow-pink-500/20">
          {initialData ? 'Update Entry' : 'Save Entry'}
        </Button>
      </form>

      {/* Category Management Modal */}
      {showCatManager && (
        <CategoryManager 
          userId={userId} 
          type={type} 
          categories={categories} 
          onClose={() => setShowCatManager(false)} 
        />
      )}
    </>
  );
};