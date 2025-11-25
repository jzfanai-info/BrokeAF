import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className = '', style }) => {
  return (
    <div 
      className={`
      relative overflow-hidden
      bg-white/90 dark:bg-slate-900/60 
      backdrop-blur-sm
      rounded-3xl 
      border border-pink-100 dark:border-white/10
      shadow-xl shadow-pink-100/50 dark:shadow-purple-900/20
      hover:border-pink-300 dark:hover:border-purple-500/50
      transition-all duration-300
      animate-fade-in-up
      ${className}
    `}
      style={style}
    >
      {children}
    </div>
  );
};