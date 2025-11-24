import React, { useEffect, useState, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User, updateProfile } from 'firebase/auth';
import { auth } from './firebase';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Auth } from './components/Auth';
import { TransactionForm } from './components/TransactionForm';
import { subscribeToTransactions, deleteTransaction } from './services/firestoreService';
import { Transaction, AppRoute } from './types';
import { X, Plus, Pencil, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Search, Moon, Sun, Sparkles, Trash2 } from 'lucide-react';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { ConfirmModal } from './components/ui/ConfirmModal';
import { SmartInsights } from './components/SmartInsights';
import { BudgetPlanner } from './components/BudgetPlanner';
import { About } from './components/About';
import { Settings } from './components/Settings';

interface DemoUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
}

const ProtectedRoute: React.FC<React.PropsWithChildren<{ user: User | DemoUser | null; loading: boolean }>> = ({ children, user, loading }) => {
  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-rose-50 dark:bg-[#130b20]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div></div>;
  if (!user) return <Navigate to={AppRoute.LOGIN} />;
  return <>{children}</>;
};

interface LayoutProps {
  user: User | DemoUser;
  onLogout: () => void;
  onAddTransaction: () => void;
}

const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({ children, user, onLogout, onAddTransaction }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <div className="flex flex-col min-h-screen bg-rose-50 dark:bg-[#130b20] text-slate-900 dark:text-rose-50 font-sans transition-colors duration-500">
      <Sidebar 
        user={user}
        onLogout={onLogout} 
        onAddTransaction={onAddTransaction} 
        isDarkMode={darkMode}
        toggleTheme={() => setDarkMode(!darkMode)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Adjusted padding: pt-20 for mobile top bar, pt-24 for desktop top bar, pb-24 for mobile bottom nav */}
        <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full scroll-smooth pt-20 md:pt-24 pb-24 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
};

interface MainContentProps {
  user: User | DemoUser;
  onEditTransaction: (t: Transaction) => void;
  onUpdateUser: (updates: { photoURL?: string; displayName?: string }) => Promise<void>;
}

const ITEMS_PER_PAGE = 15;

const MainContent: React.FC<MainContentProps> = ({ user, onEditTransaction, onUpdateUser }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortKey, setSortKey] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Delete State
  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToTransactions(user.uid, (data) => {
      setTransactions(data);
    });
    return () => unsubscribe();
  }, [user.uid]);

  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, sortKey, sortOrder, searchQuery]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.category.toLowerCase().includes(q) || 
        (t.notes?.toLowerCase() || '').includes(q) ||
        t.amount.toString().includes(q)
      );
    }
    if (startDate) result = result.filter(t => t.date >= startDate);
    if (endDate) result = result.filter(t => t.date <= endDate);
    
    result.sort((a, b) => {
      let valA = sortKey === 'date' ? new Date(a.date).getTime() : a.amount;
      let valB = sortKey === 'date' ? new Date(b.date).getTime() : b.amount;
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
    return result;
  }, [transactions, startDate, endDate, sortKey, sortOrder, searchQuery]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const confirmDelete = async () => {
    if (!txToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(user.uid, txToDelete.id);
      setTxToDelete(null);
    } catch (error) {
      console.error("Failed to delete transaction", error);
      alert("Failed to delete. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Routes>
        <Route path={AppRoute.DASHBOARD} element={<Dashboard transactions={transactions} username={user.displayName?.split(' ')[0] || 'User'} />} />
        <Route path={AppRoute.TRANSACTIONS} element={
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-black text-slate-800 dark:text-white">History</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">Track your spending habits.</p>
                </div>
                
                {/* Filter Toolbar - Optimized for Mobile */}
                <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3 bg-white dark:bg-white/5 p-3 md:p-2 rounded-2xl shadow-sm border border-pink-100 dark:border-white/10">
                  <div className="relative group w-full md:w-auto md:flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm font-medium focus:border-pink-500 focus:outline-none transition-colors dark:text-white"
                    />
                  </div>
                  
                  <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-white/10 mx-1"></div>

                  <div className="flex gap-2 w-full md:w-auto">
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                      className="flex-1 md:flex-none px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm font-medium text-slate-900 dark:text-white focus:border-pink-500 focus:outline-none min-w-0"
                    />
                    <span className="text-slate-400 font-bold self-center">-</span>
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                      className="flex-1 md:flex-none px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm font-medium text-slate-900 dark:text-white focus:border-pink-500 focus:outline-none min-w-0"
                    />
                  </div>
                  
                  <div className="flex gap-2 w-full md:w-auto">
                    <select 
                      value={sortKey} 
                      onChange={(e) => setSortKey(e.target.value as 'date' | 'amount')}
                      className="flex-1 md:flex-none px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm font-bold focus:border-pink-500 focus:outline-none dark:text-white"
                    >
                      <option value="date">Date</option>
                      <option value="amount">Amount</option>
                    </select>
                    <button 
                      onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                      className="p-2.5 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-xl transition-colors border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                    
                      {(startDate || endDate || searchQuery) && (
                        <button 
                          onClick={() => { setStartDate(''); setEndDate(''); setSearchQuery(''); }}
                          className="px-3 py-1 bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-300 ml-auto md:ml-2"
                        >
                          Reset
                        </button>
                      )}
                  </div>
                </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              {paginatedTransactions.length === 0 ? (
                <div className="text-center py-20 bg-white/50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 backdrop-blur-sm">
                  <div className="bg-slate-100 dark:bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="text-slate-400" />
                  </div>
                  <p className="font-bold text-slate-500 dark:text-slate-400">No transactions found.</p>
                  <p className="text-xs text-slate-400 mt-1">Try changing your filters or add a new entry!</p>
                </div>
              ) : (
                paginatedTransactions.map((t, index) => (
                <Card key={t.id} className="p-3 md:p-5 flex justify-between items-center group hover:scale-[1.01] hover:shadow-pink-100/50 dark:hover:shadow-none transition-all duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex items-center gap-3 md:gap-5 flex-1 min-w-0">
                    {/* Icon Container - Smaller on Mobile */}
                    <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-bold text-lg md:text-xl shadow-inner flex-shrink-0 transition-transform group-hover:rotate-6 ${
                      t.type === 'income' 
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-emerald-200 dark:shadow-none' 
                        : 'bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-pink-200 dark:shadow-none'
                    }`}>
                      {t.type === 'income' ? '💰' : '💸'}
                    </div>
                    
                    {/* Text Container - Ensures Truncation */}
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm md:text-lg text-slate-800 dark:text-white truncate font-display">{t.category}</p>
                      <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium truncate">
                        {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} &bull; {t.notes || 'No notes'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-8 flex-shrink-0 pl-2">
                    <span className={`font-black text-sm md:text-xl whitespace-nowrap font-display ${t.type === 'income' ? 'text-emerald-500' : 'text-slate-800 dark:text-white'}`}>
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(0)}
                    </span>
                    
                    <div className="flex gap-1">
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onEditTransaction(t); }}
                        className="p-2 md:p-3 text-slate-400 hover:text-pink-500 dark:hover:text-pink-400 rounded-full hover:bg-pink-50 dark:hover:bg-white/10 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} className="md:w-5 md:h-5" />
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          e.preventDefault();
                          setTxToDelete(t);
                        }}
                        className="p-2 md:p-3 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} className="md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              )))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-8 pb-4">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="rounded-xl"
                  >
                    <ChevronLeft size={16} /> Prev
                  </Button>
                  <span className="text-sm font-bold bg-white dark:bg-white/10 px-4 py-2 rounded-xl border border-slate-100 dark:border-white/5">
                    {currentPage} / {totalPages}
                  </span>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="rounded-xl"
                  >
                    Next <ChevronRight size={16} />
                  </Button>
              </div>
            )}
          </div>
        } />
        <Route path={AppRoute.BUDGET} element={<BudgetPlanner userId={user.uid} transactions={transactions} />} />
        <Route path={AppRoute.INSIGHTS} element={<SmartInsights transactions={transactions} />} />
        <Route path={AppRoute.ABOUT} element={<About />} />
        <Route path={AppRoute.SETTINGS} element={
          <Settings 
            user={user} 
            isDemo={user.uid === 'DEMO_USER'} 
            onUpdateUser={onUpdateUser} 
          />
        } />
        <Route path="*" element={<Navigate to={AppRoute.DASHBOARD} />} />
      </Routes>

      {/* Confirmation Modal for Transaction Deletion */}
      <ConfirmModal 
        isOpen={!!txToDelete}
        onClose={() => setTxToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this entry? This action cannot be undone."
        isLoading={isDeleting}
      />
    </>
  );
};

const Splash: React.FC = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-rose-50 dark:bg-[#130b20] transition-colors duration-500">
    <div className="animate-float">
      <div className="w-24 h-24 bg-gradient-to-tr from-pink-500 to-violet-600 rounded-2xl rotate-3 flex items-center justify-center shadow-2xl shadow-pink-500/40 mb-6">
         <span className="font-display font-black text-5xl text-white">B</span>
      </div>
    </div>
    <h1 className="text-4xl font-display font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-violet-600 animate-pulse-slow">
      BrokeAF
    </h1>
    <p className="text-slate-400 font-medium mt-2 animate-pulse">Loading your vibes...</p>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    // Artificial splash delay for effect
    const timer = setTimeout(() => setShowSplash(false), 2000);
    
    const demoSession = localStorage.getItem('brokeaf_demo_session');
    if (demoSession) {
      setDemoUser(JSON.parse(demoSession));
      setLoading(false);
      return () => clearTimeout(timer);
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleDemoLogin = () => {
    const demo: DemoUser = {
      uid: 'DEMO_USER',
      displayName: 'Guest Bestie',
      email: 'guest@brokeaf.app',
      photoURL: null
    };
    localStorage.setItem('brokeaf_demo_session', JSON.stringify(demo));
    setDemoUser(demo);
  };

  const handleLogout = async () => {
    if (demoUser) {
      localStorage.removeItem('brokeaf_demo_session');
      setDemoUser(null);
    } else {
      await auth.signOut();
    }
  };

  const handleUserUpdate = async (updates: { photoURL?: string; displayName?: string }) => {
    if (demoUser) {
      const updated = { ...demoUser, ...updates };
      setDemoUser(updated);
      localStorage.setItem('brokeaf_demo_session', JSON.stringify(updated));
    } else if (user && auth.currentUser) {
       await updateProfile(auth.currentUser, updates);
       // Force update local state to reflect changes immediately by creating a new reference
       setUser({ ...auth.currentUser }); 
    }
  };

  const openAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (t: Transaction) => {
    setEditingTransaction(t);
    setIsModalOpen(true);
  };

  const currentUser = user || demoUser;

  if (showSplash) return <Splash />;

  return (
    <HashRouter>
      <Routes>
        <Route path={AppRoute.LOGIN} element={!currentUser ? <Auth onDemoLogin={handleDemoLogin} /> : <Navigate to={AppRoute.DASHBOARD} />} />
        <Route path={AppRoute.REGISTER} element={!currentUser ? <Auth isRegister onDemoLogin={handleDemoLogin} /> : <Navigate to={AppRoute.DASHBOARD} />} />
        <Route 
          path="/*" 
          element={
            <ProtectedRoute user={currentUser} loading={loading}>
              {currentUser && (
                <Layout 
                  user={currentUser} 
                  onLogout={handleLogout} 
                  onAddTransaction={openAddModal}
                >
                  <MainContent 
                    user={currentUser} 
                    onEditTransaction={openEditModal} 
                    onUpdateUser={handleUserUpdate}
                  />
                </Layout>
              )}
            </ProtectedRoute>
          } 
        />
      </Routes>

      {/* Global Modal */}
      {isModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-md p-8 relative shadow-2xl border-2 border-white/50 dark:border-white/10">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-pink-500 transition-colors"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
            <h3 className="text-2xl font-display font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
              {editingTransaction ? 'Edit Entry' : 'New Entry'}
            </h3>
            <TransactionForm 
              userId={currentUser.uid} 
              onClose={() => setIsModalOpen(false)} 
              initialData={editingTransaction}
            />
          </Card>
        </div>
      )}
    </HashRouter>
  );
};

export default App;