import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface AuthProps {
  isRegister?: boolean;
  onDemoLogin?: () => void;
}

export const Auth: React.FC<AuthProps> = ({ isRegister = false, onDemoLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate(AppRoute.DASHBOARD);
    } catch (err: any) {
      if (err.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
        setError('Config Error. Use Demo Mode.');
      } else {
        setError('Invalid credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 dark:bg-[#130b20] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-pink-400/20 blur-[100px] rounded-full animate-pulse-slow"></div>
         <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-500/20 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: '1s'}}></div>
         <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] bg-teal-300/20 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s'}}></div>
      </div>

      <div className="mb-8 text-center relative z-10 animate-float">
        <div className="w-20 h-20 bg-gradient-to-tr from-pink-500 to-violet-600 rounded-2xl rotate-3 flex items-center justify-center shadow-xl shadow-pink-500/40 mx-auto mb-6">
           <span className="font-display font-black text-5xl text-white">B</span>
        </div>
        <h1 className="text-5xl font-display font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-violet-600 dark:from-pink-400 dark:to-violet-400 mb-2">
          BrokeAF
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Make budgeting fabulous again.</p>
      </div>

      <Card className="w-full max-w-sm p-8 border border-white/40 dark:border-white/10 shadow-2xl relative z-10 backdrop-blur-xl bg-white/70 dark:bg-black/40">
        <h2 className="text-2xl font-black mb-6 text-center text-slate-800 dark:text-white font-display">
          {isRegister ? 'Join the Club' : 'Welcome Back'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/30 focus:border-pink-400 transition-all font-medium bg-white/50 dark:bg-white/5 dark:text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/30 focus:border-pink-400 transition-all font-medium bg-white/50 dark:bg-white/5 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/30 focus:border-pink-400 transition-all font-medium bg-white/50 dark:bg-white/5 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="text-white bg-red-500 p-3 rounded-xl text-sm font-bold text-center shadow-lg shadow-red-500/20">{error}</div>}

          <Button type="submit" isLoading={loading} className="w-full py-4 text-lg mt-2">
            {isRegister ? 'Sign Up' : 'Log In'}
          </Button>

          {onDemoLogin && (
            <button
              type="button"
              onClick={onDemoLogin}
              className="w-full py-3 rounded-full border-2 border-slate-100 dark:border-white/10 hover:border-pink-400 text-slate-500 hover:text-pink-500 font-bold transition-all text-sm mt-4 bg-white/50 dark:bg-white/5"
            >
              Take a Look Around (Demo)
            </button>
          )}
        </form>
      </Card>

      <div className="mt-8 text-sm font-medium text-slate-500 dark:text-slate-400 relative z-10">
        {isRegister ? 'Member already?' : "New here?"}{' '}
        <Link 
          to={isRegister ? AppRoute.LOGIN : AppRoute.REGISTER} 
          className="text-pink-600 dark:text-pink-400 font-bold hover:underline"
        >
          {isRegister ? 'Log in' : 'Create account'}
        </Link>
      </div>
    </div>
  );
};