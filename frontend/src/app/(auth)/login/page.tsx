'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Phone, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password })
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);

        // Redirect based on role
        if (res.user.role === 'SUPER_ADMIN' || res.user.role === 'DISTRICT_ADMIN') {
          router.push('/admin/dashboard');
        } else if (res.user.role === 'MP_OFFICE_REP') {
          router.push('/admin/mp-office');
        } else {
          router.push('/portal/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your phone or password.');
    } finally {
      setLoading(false);
    }
  };

  // Quick preset loader for test accounts
  const loadPreset = (type: 'citizen' | 'admin' | 'mp') => {
    if (type === 'citizen') {
      setIdentifier('citizen@bulolo.pg');
      setPassword('BuloloCitizen2026!');
    } else if (type === 'admin') {
      setIdentifier('admin@buloloconnect.gov.pg');
      setPassword('BuloloAdmin2026!');
    } else if (type === 'mp') {
      setIdentifier('mp.office@buloloconnect.gov.pg');
      setPassword('BuloloAdmin2026!');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-bulolo-border shadow-md">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-bulolo-lightgreen text-bulolo-forest flex items-center justify-center mx-auto">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-bulolo-charcoal">Sign In to Bulolo Connect</h2>
          <p className="text-xs text-bulolo-muted">
            Access your citizen dashboard, request tracking, or staff administration.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-bulolo-charcoal mb-1">
              Mobile Phone, Email, or Account ID
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. +675 71234567 or citizen@bulolo.pg"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-bulolo-border focus:ring-2 focus:ring-bulolo-forest focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-bulolo-charcoal mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-bulolo-border focus:ring-2 focus:ring-bulolo-forest focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-bulolo-forest hover:bg-bulolo-emerald text-white text-xs font-bold transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Fast Logins for Testing */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <p className="text-[11px] font-bold text-bulolo-muted uppercase text-center">
            Demo & Evaluation Credentials:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => loadPreset('citizen')}
              className="px-2 py-1.5 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
            >
              Citizen Account
            </button>
            <button
              type="button"
              onClick={() => loadPreset('admin')}
              className="px-2 py-1.5 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
            >
              District Admin
            </button>
            <button
              type="button"
              onClick={() => loadPreset('mp')}
              className="px-2 py-1.5 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
            >
              MP&apos;s Office
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-bulolo-muted">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-bulolo-forest hover:underline">
            Register as a Citizen
          </Link>
        </div>
      </div>
    </div>
  );
}
