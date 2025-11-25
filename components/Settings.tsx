import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { User } from 'firebase/auth';
import { Check, Camera, Sparkles, User as UserIcon } from 'lucide-react';

interface SettingsProps {
  user: User;
  onUpdateUser: (updates: { photoURL?: string; displayName?: string }) => Promise<void>;
}

const AVATAR_SEEDS = [
  'Felix', 'Aneka', 'Zoe', 'Jack', 'Bear', 'Christian', 
  'Milo', 'Saitama', 'Buzz', 'Lola', 'Bella', 'Rocky'
];

export const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(user.photoURL || '');
  const [displayName, setDisplayName] = useState<string>(user.displayName || '');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const getAvatarUrl = (seed: string) => 
    `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdateUser({ 
        photoURL: selectedAvatar,
        displayName: displayName.trim() 
      });
      setSuccessMsg('Profile updated successfully! ✨');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e) {
      console.error(e);
      setSuccessMsg('Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = selectedAvatar !== user.photoURL || displayName !== user.displayName;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up space-y-8">
      <div>
        <h2 className="text-3xl font-display font-black mb-2 text-slate-800 dark:text-white">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your profile and preferences.</p>
      </div>

      <Card className="p-8">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8 border-b border-slate-100 dark:border-white/5 pb-8">
          <div className="relative group shrink-0">
            <div className="w-32 h-32 bg-gradient-to-tr from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center text-5xl font-black shadow-2xl shadow-pink-500/20 border-4 border-white dark:border-white/10 overflow-hidden bg-slate-100 dark:bg-slate-800">
              {selectedAvatar ? (
                <img src={selectedAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{displayName ? displayName[0] : 'U'}</span>
              )}
            </div>
            <div className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full border-4 border-white dark:border-[#130b20]">
              <Camera size={16} />
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1 min-w-0">
            <h3 className="font-black text-2xl font-display text-slate-800 dark:text-white truncate">{user.displayName || 'BrokeAF User'}</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium truncate">{user.email}</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Display Name Input */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <UserIcon size={16} className="text-pink-500" /> Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/30 focus:border-pink-400 transition-all font-medium bg-slate-50 dark:bg-white/5 dark:text-white"
              placeholder="Enter your name"
            />
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-pink-500" /> Choose your Avatar
            </label>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {AVATAR_SEEDS.map((seed) => {
                const url = getAvatarUrl(seed);
                const isSelected = selectedAvatar === url;
                return (
                  <button
                    key={seed}
                    onClick={() => setSelectedAvatar(url)}
                    className={`
                      relative rounded-2xl overflow-hidden aspect-square border-2 transition-all duration-300 group
                      ${isSelected 
                        ? 'border-pink-500 shadow-lg shadow-pink-500/25 scale-105 ring-2 ring-pink-500/20' 
                        : 'border-slate-100 dark:border-white/10 hover:border-pink-300 dark:hover:border-white/30 hover:scale-105'
                      }
                    `}
                  >
                    <img src={url} alt={seed} className="w-full h-full bg-slate-50 dark:bg-white/5" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-pink-500/10 flex items-center justify-center backdrop-blur-[1px]">
                        <div className="bg-pink-500 text-white rounded-full p-1">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
             <p className="text-xs text-slate-400 font-medium">
               Changes are saved to your BrokeAF profile.
             </p>
             <div className="flex items-center gap-4 w-full md:w-auto">
               {successMsg && <span className="text-emerald-500 text-sm font-bold animate-pulse">{successMsg}</span>}
               <Button 
                 onClick={handleSave} 
                 isLoading={loading} 
                 disabled={!hasChanges}
                 className="w-full md:w-auto"
               >
                 Save Changes
               </Button>
             </div>
          </div>
        </div>
      </Card>
      
      <div className="text-center">
        <p className="text-xs font-bold text-slate-300 dark:text-slate-700">App Version 3.3.0</p>
      </div>
    </div>
  );
};