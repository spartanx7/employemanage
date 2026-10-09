import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, ArrowRight, Eye, EyeOff, User } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (adminUser: { name: string; email: string; role: string }) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your name to appear on the Administrator badge.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your admin email address.');
      return;
    }

    if (!password.trim() || password.length < 4) {
      setError('Please enter a password with at least 4 characters.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      onLogin({
        name: name.trim(),
        email: email.trim(),
        role: 'Administrator'
      });
    }, 350);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/70 via-[#F8FAFD] to-violet-50/60 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Decorative ambient light orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Lockup */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white shadow-md shadow-indigo-500/25 mb-4">
            <ShieldCheck className="w-7 h-7 text-indigo-100" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-slate-900">
            TalentPulse Admin Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Sign in to access employee metrics and predictive intelligence
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 sm:px-8 rounded-3xl border border-indigo-100/70 shadow-[0_10px_35px_-5px_rgba(79,70,229,0.07)] space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs text-rose-700 bg-rose-50/80 border border-rose-200/80 rounded-xl">
                {error}
              </div>
            )}

            {/* Administrator Name Field */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Your Full Name <span className="text-slate-400 font-normal">(shown on your Admin Badge)</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full text-xs pl-10 pr-3 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs placeholder:text-slate-400 transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.org"
                  className="w-full text-xs pl-10 pr-3 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs placeholder:text-slate-400 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-10 pr-9 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono shadow-2xs transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-700 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-indigo-500/25 hover:shadow-md hover:shadow-indigo-500/30 focus-visible:outline-none disabled:opacity-50"
            >
              <span>{isLoading ? 'Creating Admin Session...' : 'Sign In as Administrator'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Privacy Note */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Confidential HR Workspace · The name you enter will be displayed across the dashboard as the active Administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
