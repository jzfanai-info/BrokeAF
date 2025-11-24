import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  isLoading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-sm p-6 relative shadow-2xl border-2 border-white/50 dark:border-white/10">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="text-rose-500" size={24} />
          </div>
          
          <h3 className="text-xl font-display font-black text-slate-800 dark:text-white mb-2">
            {title}
          </h3>
          
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6">
            {message}
          </p>

          <div className="flex gap-3 w-full">
            <Button 
              variant="secondary" 
              onClick={onClose} 
              className="flex-1 rounded-xl"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={onConfirm} 
              className="flex-1 rounded-xl"
              isLoading={isLoading}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};