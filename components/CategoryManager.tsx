import React, { useState } from 'react';
import { Category, TransactionType } from '../types';
import { addCategory, deleteCategory } from '../services/firestoreService';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Trash2, Plus, X, AlertTriangle } from 'lucide-react';
import { ConfirmModal } from './ui/ConfirmModal';

interface CategoryManagerProps {
  userId: string;
  type: TransactionType;
  categories: Category[];
  onClose: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ userId, type, categories, onClose }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const currentCategories = categories.filter(c => c.type === type && c.name !== 'NA');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setLoading(true);
    try {
      await addCategory(userId, { name: newCategoryName.trim(), type, isSystem: false });
      setNewCategoryName('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(userId, categoryToDelete.id, categoryToDelete.name);
      setCategoryToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <Card className="w-full max-w-md p-6 relative flex flex-col max-h-[80vh]">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
          
          <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">Manage Categories</h3>
          <p className="text-sm text-gray-500 mb-4 capitalize">{type} Categories</p>

          {/* Add Form */}
          <form onSubmit={handleAdd} className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="New Category Name"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button type="submit" disabled={!newCategoryName.trim()} isLoading={loading}>
              <Plus size={18} />
            </Button>
          </form>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {currentCategories.length === 0 && (
              <p className="text-center text-gray-400 py-4">No custom categories yet.</p>
            )}
            {currentCategories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg group">
                <span className="font-medium text-gray-700 dark:text-gray-200">{cat.name}</span>
                <button 
                  onClick={() => setCategoryToDelete(cat)}
                  className="text-gray-400 hover:text-red-500 p-1 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Delete & set transactions to NA"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
            <div className="flex gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <p>Deleting a category will NOT delete its transactions. They will be marked as "NA".</p>
            </div>
          </div>
        </Card>
      </div>

      <ConfirmModal 
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
        title={`Delete ${categoryToDelete?.name}?`}
        message="All existing transactions for this category will be moved to 'NA'. This action cannot be undone."
      />
    </>
  );
};