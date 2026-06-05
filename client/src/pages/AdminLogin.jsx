import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Lock, Mail, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { login, token, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (token) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await login(email, password);
      toast.success('Welcome back, Admin! 🍫');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      console.error('Admin Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password.');
      toast.error('Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-chocolate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-chocolate-900 text-cream px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chocolate-700/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-10 rounded-3xl glass-card border border-gold-500/15 shadow-2xl relative"
        >
          {/* Top Gold Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 rounded-t-3xl" />

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold gold-gradient-text tracking-wide mb-2">
              Aswin
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] text-cream-dark font-medium mb-6">
              Administration Portal
            </p>
            <h2 className="text-xl font-semibold text-cream">Admin Sign In</h2>
            <p className="text-xs text-cream/50 mt-1">Authorized Access Only</p>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
            >
              <ShieldAlert className="flex-shrink-0" size={20} />
              <span className="font-medium">{error}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cream-dark mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-cream/40">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-chocolate-850 border border-chocolate-700/50 focus:border-gold-500/50 text-cream transition-all duration-300 font-medium text-sm"
                  placeholder="admin@aswinbrownies.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cream-dark mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-cream/40">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-12 py-3.5 rounded-xl bg-chocolate-850 border border-chocolate-700/50 focus:border-gold-500/50 text-cream transition-all duration-300 font-medium text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-cream/40 hover:text-gold-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 mt-8 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-600 hover:to-gold-500 text-chocolate-900 font-bold rounded-xl shadow-lg shadow-gold-500/10 hover:shadow-gold-500/25 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 text-base"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-chocolate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In to Dashboard'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
