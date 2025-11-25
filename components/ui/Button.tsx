import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  isLoading,
  disabled,
  ...props 
}) => {
  const baseStyle = "font-bold transition-all active:scale-95 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 rounded-full shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-3 text-sm tracking-wide",
    lg: "px-8 py-4 text-base"
  };

  const variants = {
    primary: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white border-none hover:scale-105 hover:shadow-pink-500/30",
    secondary: "bg-white text-slate-800 border-2 border-pink-100 hover:border-pink-300 dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:border-purple-500 hover:bg-pink-50 dark:hover:bg-slate-700",
    danger: "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-red-500/30 hover:shadow-red-500/50",
    ghost: "text-slate-600 hover:bg-pink-100/50 shadow-none hover:shadow-none dark:text-slate-300 dark:hover:bg-purple-900/30",
  };

  return (
    <button 
      className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : children}
    </button>
  );
};