'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { BULOLO_LLGS } from '@shared/types/geography';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [llg, setLlg] = useState('Mumeng Rural LLG');
  const [ward, setWard] = useState('Ward 01 - Sambio');
  const [village, setVillage] = useState('');
  const [residentialLocation, setResidentialLocation] = useState('');
  const [isDiaspora, setIsDiaspora] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'tpi'>('en');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedLlgData = BULOLO_LLGS.find(l => l.name === llg) || BULOLO_LLGS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName,
          phoneNumber,
          email: email || undefined,
          password,
          llg,
          ward,
          village,
          residentialLocation,
          isDiaspora,
          preferredLanguage
        })
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        router.push('/portal/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-bulolo-border shadow-md space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-bulolo-lightgreen text-bulolo-forest flex items-center justify-center mx-auto">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-bulolo-charcoal">
            Citizen Registration
          </h1>
          <p className="text-xs text-bulolo-muted max-w-md mx-auto">
            Create your official digital citizen account for Bulolo District to track requests, access assistance programmes, and receive verified updates.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-bulolo-gold uppercase tracking-wider">
              1. Personal Details
            </h3>

            <div>
              <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Maria Jerry"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-bulolo-border focus:ring-2 focus:ring-bulolo-forest focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Mobile Phone Number *</label>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +675 7XXXXXXX"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-bulolo-border focus:ring-2 focus:ring-bulolo-forest focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. maria@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-bulolo-border focus:ring-2 focus:ring-bulolo-forest focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Geographic Origins & Location */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-bulolo-gold uppercase tracking-wider">
              2. District Geographic Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Local Level Government (LLG) *</label>
                <select
                  value={llg}
                  onChange={(e) => {
                    setLlg(e.target.value);
                    const l = BULOLO_LLGS.find(b => b.name === e.target.value);
                    if (l && l.defaultWards.length > 0) setWard(l.defaultWards[0]);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-bulolo-border bg-white text-bulolo-charcoal"
                >
                  {BULOLO_LLGS.map(l => (
                    <option key={l.id} value={l.name}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Ward *</label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-bulolo-border bg-white text-bulolo-charcoal"
                >
                  {selectedLlgData.defaultWards.map((w, idx) => (
                    <option key={idx} value={w}>{w}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Village / Community *</label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Patep Village"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-bulolo-border"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Current Residential Location *</label>
                <input
                  type="text"
                  required
                  value={residentialLocation}
                  onChange={(e) => setResidentialLocation(e.target.value)}
                  placeholder="e.g. Zenag Highway junction"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-bulolo-border"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="diaspora"
                checked={isDiaspora}
                onChange={(e) => setIsDiaspora(e.target.checked)}
                className="rounded text-bulolo-forest focus:ring-bulolo-forest"
              />
              <label htmlFor="diaspora" className="text-xs text-bulolo-charcoal cursor-pointer">
                I am originally from Bulolo District but currently reside elsewhere (Diaspora)
              </label>
            </div>
          </div>

          {/* Security & Language */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-bulolo-gold uppercase tracking-wider">
              3. Security & Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-bulolo-border focus:ring-2 focus:ring-bulolo-forest"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-bulolo-border focus:ring-2 focus:ring-bulolo-forest"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Preferred Language</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center text-xs text-bulolo-charcoal cursor-pointer">
                  <input
                    type="radio"
                    name="prefLang"
                    value="en"
                    checked={preferredLanguage === 'en'}
                    onChange={() => setPreferredLanguage('en')}
                    className="mr-2 text-bulolo-forest"
                  />
                  English
                </label>
                <label className="inline-flex items-center text-xs text-bulolo-charcoal cursor-pointer">
                  <input
                    type="radio"
                    name="prefLang"
                    value="tpi"
                    checked={preferredLanguage === 'tpi'}
                    onChange={() => setPreferredLanguage('tpi')}
                    className="mr-2 text-bulolo-forest"
                  />
                  Tok Pisin
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-bulolo-forest hover:bg-bulolo-emerald text-white text-xs sm:text-sm font-bold shadow-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Registering Citizen Account...' : 'Complete Citizen Registration'}
          </button>
        </form>

        <div className="text-center text-xs text-bulolo-muted">
          Already registered?{' '}
          <Link href="/login" className="font-bold text-bulolo-forest hover:underline">
            Sign In to your Account
          </Link>
        </div>
      </div>
    </div>
  );
}
