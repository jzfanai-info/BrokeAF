import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Settings, 
  LogOut,
  Plus,
  Moon,
  Sun,
  User as UserIcon,
  ChevronDown,
  Info
} from 'lucide-react';
import { AppRoute } from '../types';

interface UserLike {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

interface NavbarProps {
  user: UserLike;
  onLogout: () => void;
  onAddTransaction: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const navLinks = [
  { icon: LayoutDashboard, label: 'Dash', path: AppRoute.DASHBOARD },
  { icon: Receipt, label: 'History', path: AppRoute.TRANSACTIONS },
  { icon: PieChart, label: 'Budget', path: AppRoute.BUDGET },
  { icon: Info, label: 'About', path: AppRoute.ABOUT },
  { icon: Settings, label: 'Settings', path: AppRoute.SETTINGS },
];

// --- Components ---

const NavItem: React.FC<{ item: typeof navLinks[0], mobile?: boolean }> = ({ item, mobile = false }) => (
  <NavLink
    to={item.path}
    className={({ isActive }) => `
      group relative flex items-center justify-center z-10 transition-all duration-300
      ${mobile ? 'w-full h-14' : 'w-12 h-12'}
    `}
  >
    {({ isActive }) => (
      <item.icon 
        size={mobile ? 24 : 22} 
        strokeWidth={isActive ? 2.5 : 2} 
        className={`relative z-20 transition-all duration-300 ${
          isActive 
            ? 'text-pink-500 scale-110 drop-shadow-sm dark:text-pink-400' 
            : 'text-slate-400 dark:text-slate-500 group-hover:text-pink-400 dark:group-hover:text-pink-300'
        }`}
      />
    )}
  </NavLink>
);

export const Sidebar: React.FC<NavbarProps> = ({ user, onLogout, onAddTransaction, isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await onLogout();
    navigate(AppRoute.LOGIN);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const ProfileDropdown = () => (
    <div className="absolute top-14 right-0 w-56 bg-white/90 dark:bg-[#1a0b2e]/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-pink-500/20 border border-white/20 dark:border-white/10 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Signed in as</p>
        <p className="text-sm font-black text-slate-800 dark:text-white truncate">{user.displayName || 'User'}</p>
      </div>
      <div className="p-1">
        <button 
          onClick={() => { navigate(AppRoute.SETTINGS); setIsProfileOpen(false); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-white/10 hover:text-pink-600 dark:hover:text-pink-400 rounded-xl transition-colors text-left"
        >
          <Settings size={16} /> Settings
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors text-left"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* --- Desktop Navbar (Sticky Top) --- */}
      <nav className="hidden md:flex fixed top-0 left-0 w-full z-40 bg-white/80 dark:bg-[#130b20]/90 backdrop-blur-xl border-b border-pink-100 dark:border-white/5 shadow-sm shadow-pink-500/5 transition-all duration-300 px-8 py-3 items-center justify-between">
        
        {/* Left: Brand Logo */}
        <div 
          onClick={() => navigate(AppRoute.DASHBOARD)} 
          className="flex items-center gap-3 cursor-pointer group w-1/4"
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-violet-600 rounded-xl rotate-3 flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:rotate-6 transition-transform">
             <span className="font-display font-black text-xl text-white">B</span>
          </div>
          <span className="text-xl font-display font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-violet-600 dark:from-pink-400 dark:to-violet-400">
            BrokeAF
          </span>
        </div>

        {/* Center: Navigation Icons Group */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-6 p-1">
             {/* Map first 4 links: Dash, History, Budget, About */}
             {navLinks.slice(0, 4).map((item) => (
               <div key={item.path}>
                 <NavItem item={item} />
               </div>
             ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-3 w-1/4 relative">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-400 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-white/10 transition-all"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            onClick={onAddTransaction}
            className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl shadow-lg shadow-pink-500/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
            title="Add Transaction"
          >
            <Plus size={20} strokeWidth={3} />
          </button>

          {/* Avatar Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={handleProfileClick}
              className="relative group"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-[#130b20] shadow-md hover:shadow-pink-500/30 transition-all">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <UserIcon size={20} className="text-slate-400" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#130b20] rounded-full p-0.5 border border-slate-100 dark:border-white/10">
                <ChevronDown size={10} className="text-slate-400" />
              </div>
            </button>
            
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                <ProfileDropdown />
              </>
            )}
          </div>
        </div>
      </nav>

      {/* --- Mobile View --- */}
      
      {/* Mobile Top Bar (Logo & Secondary Actions) */}
      <div className="md:hidden fixed top-0 left-0 w-full z-40 bg-white/90 dark:bg-[#130b20]/90 backdrop-blur-xl border-b border-pink-50 dark:border-white/5 px-4 py-3 flex items-center justify-between shadow-sm transition-all">
          <div onClick={() => navigate(AppRoute.DASHBOARD)} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-violet-600 rounded-lg flex items-center justify-center shadow-md">
               <span className="font-display font-black text-lg text-white">B</span>
            </div>
            <span className="text-lg font-display font-black tracking-tight text-slate-800 dark:text-white">BrokeAF</span>
          </div>

          <div className="flex items-center gap-3">
             <button 
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-pink-500"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Avatar Dropdown */}
            <div className="relative">
              <button onClick={handleProfileClick} className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
                 {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                    <UserIcon size={16} className="text-slate-400" />
                  </div>
                )}
              </button>
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                  <ProfileDropdown />
                </>
              )}
            </div>
          </div>
      </div>

      {/* Mobile Bottom Bar (Navigation & FAB) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white/90 dark:bg-[#130b20]/90 backdrop-blur-xl border-t border-pink-50 dark:border-white/5 px-2 pb-6 pt-2 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
          <div className="relative grid grid-cols-5 items-end">
             
             {/* 1. Dashboard */}
             <div onClick={() => setIsProfileOpen(false)}>
               <NavItem item={navLinks[0]} mobile /> 
             </div>

             {/* 2. History */}
             <div onClick={() => setIsProfileOpen(false)}>
               <NavItem item={navLinks[1]} mobile />
             </div>

             {/* 3. Center FAB (Empty slot in nav flow, absolute positioned) */}
             <div className="relative flex justify-center -top-6 z-20">
                <button 
                  onClick={onAddTransaction}
                  className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl shadow-xl shadow-pink-500/40 flex items-center justify-center active:scale-95 transition-transform border-4 border-white dark:border-[#130b20]"
                >
                  <Plus size={28} strokeWidth={3} />
                </button>
             </div>

             {/* 4. Budget */}
             <div onClick={() => setIsProfileOpen(false)}>
               <NavItem item={navLinks[2]} mobile />
             </div>

             {/* 5. About (Replaces Insights) */}
             <div onClick={() => setIsProfileOpen(false)}>
               <NavItem item={navLinks[3]} mobile />
             </div>
          </div>
      </div>
    </>
  );
};