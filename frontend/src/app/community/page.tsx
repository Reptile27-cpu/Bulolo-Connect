'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  MapPin,
  Building,
  Shield,
  Heart,
  ChevronRight,
  Home,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { BULOLO_LLGS } from '@shared/types/geography';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function CommunityPage() {
  const { user } = useAuth();
  const [selectedLlg, setSelectedLlg] = useState<string>(BULOLO_LLGS[0].id);
  const activeLlg = BULOLO_LLGS.find(l => l.id === selectedLlg) || BULOLO_LLGS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-bold text-bulolo-gold uppercase tracking-wider">
          Wards, Villages & Local Communities
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-bulolo-charcoal tracking-tight">
          Our Communities
        </h1>
        <p className="text-xs sm:text-sm text-bulolo-muted leading-relaxed">
          Bulolo District brings together diverse communities across the mountainous ridges of Buang, the river valleys of Watut, the transit hub of Mumeng, and the civic center of Bulolo Urban.
        </p>
      </div>

      {/* Private Household Assistance Banner */}
      <div className="p-6 rounded-3xl bg-white border border-bulolo-border shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-bulolo-lightgreen text-bulolo-forest flex items-center justify-center flex-shrink-0">
            <Home className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-bulolo-charcoal">
                Voluntary Household & Family Registry
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                <Lock className="w-3 h-3 text-emerald-600" />
                100% Confidential
              </span>
            </div>
            <p className="text-xs text-bulolo-muted max-w-2xl leading-relaxed">
              Registered residents can voluntarily maintain a private household profile to streamline educational subsidy applications and emergency welfare support. Protected under strict privacy controls.
            </p>
          </div>
        </div>

        <Link
          href={user ? '/portal/dashboard' : '/login'}
          className="px-5 py-2.5 rounded-xl bg-bulolo-forest hover:bg-bulolo-emerald text-white text-xs font-bold whitespace-nowrap transition-colors flex-shrink-0"
        >
          {user ? 'Manage Household Profile' : 'Sign In to Access'}
        </Link>
      </div>

      {/* LLG Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-bulolo-border pb-4">
        {BULOLO_LLGS.map((l) => (
          <button
            key={l.id}
            onClick={() => setSelectedLlg(l.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedLlg === l.id
                ? 'bg-bulolo-forest text-white shadow-xs'
                : 'bg-white border border-bulolo-border text-bulolo-charcoal hover:bg-slate-50'
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>

      {/* Selected LLG Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: LLG Overview */}
        <div className="p-6 rounded-2xl bg-white border border-bulolo-border space-y-4">
          <div className="flex justify-between items-center">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-bulolo-lightgreen text-bulolo-forest">
              {activeLlg.type} LLG
            </span>
            <span className="text-xs font-mono font-bold text-bulolo-gold">
              {activeLlg.wardsCount} Council Wards
            </span>
          </div>

          <h2 className="text-2xl font-black text-bulolo-charcoal">
            {activeLlg.name}
          </h2>

          <div className="text-xs text-bulolo-charcoal space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-bulolo-forest" />
              <span>Headquarters: <strong>{activeLlg.headquarters}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-bulolo-forest" />
              <span>Administration: LLG Council Chambers</span>
            </div>
          </div>

          <p className="text-xs text-bulolo-muted leading-relaxed pt-2">
            {activeLlg.description}
          </p>
        </div>

        {/* Right Column: Wards & Communities List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border-b border-bulolo-border pb-2 flex justify-between items-center">
            <h3 className="text-base font-bold text-bulolo-charcoal">
              Wards & Key Communities in {activeLlg.name}
            </h3>
            <span className="text-xs text-bulolo-muted">Official Electoral Roster</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeLlg.defaultWards.map((wardName, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white border border-bulolo-border hover:border-bulolo-forest/40 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-bulolo-charcoal">
                    {wardName}
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <p className="text-[11px] text-bulolo-muted">
                  Active Ward Member representation, community peace officers, and aid post connectivity.
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-bulolo-forest">
                  <Link href={`/report?llg=${encodeURIComponent(activeLlg.name)}&ward=${encodeURIComponent(wardName)}`} className="hover:underline">
                    Report issue in this ward →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
