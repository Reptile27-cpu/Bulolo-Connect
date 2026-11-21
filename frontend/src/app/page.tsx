'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  AlertCircle,
  Stethoscope,
  GraduationCap,
  Hammer,
  Users,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Building,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BULOLO_LLGS, DISTRICT_METADATA } from '@shared/types/geography';
import { apiRequest } from '../lib/api';

export default function HomePage() {
  const { t, language } = useLanguage();
  const [trackRef, setTrackRef] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    // Fetch live announcements, projects, and services
    apiRequest('/announcements')
      .then(res => res.success && setAnnouncements(res.announcements.slice(0, 3)))
      .catch(() => {});

    apiRequest('/projects')
      .then(res => res.success && setProjects(res.projects.slice(0, 3)))
      .catch(() => {});

    apiRequest('/services?isEmergency=true')
      .then(res => res.success && setServices(res.services.slice(0, 4)))
      .catch(() => {});
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackRef.trim()) return;

    setTrackingLoading(true);
    setTrackingError('');
    setTrackingResult(null);

    try {
      const res = await apiRequest(`/requests/track/${encodeURIComponent(trackRef.trim())}`);
      if (res.success && res.tracking) {
        setTrackingResult(res.tracking);
      } else {
        setTrackingError('No request found with this reference code.');
      }
    } catch (err: any) {
      setTrackingError(err.message || 'Reference code not found.');
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* A. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-bulolo-forest to-[#143225] text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Subtle decorative background topography */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        {/* Mountain ridge outline subtle glow */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bulolo-surface to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-bulolo-gold">
              <Sparkles className="w-4 h-4 text-bulolo-gold" />
              <span>Official District Digital Platform • Morobe Province</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              {t('hero.welcome')}
            </h1>

            <p className="text-lg sm:text-xl text-emerald-100/90 leading-relaxed max-w-2xl">
              {t('hero.subtitle')}
            </p>

            {/* Call to Actions */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/services"
                className="px-6 py-3.5 rounded-xl bg-bulolo-gold text-bulolo-charcoal font-bold text-base hover:bg-yellow-400 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                {t('hero.exploreServices')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/report"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-base backdrop-blur-md transition-all flex items-center gap-2"
              >
                {t('hero.submitRequest')}
              </Link>
            </div>
          </div>

          {/* Quick Tracking Box in Hero */}
          <div className="mt-12 max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl shadow-xl">
            <p className="text-xs font-bold text-bulolo-gold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              {t('hero.trackRequest')}
            </p>
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={trackRef}
                onChange={(e) => setTrackRef(e.target.value)}
                placeholder="Enter Reference Number (e.g. REQ-2026-00001)"
                className="flex-1 px-4 py-2.5 rounded-lg bg-white text-bulolo-charcoal placeholder-gray-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-bulolo-gold"
              />
              <button
                type="submit"
                disabled={trackingLoading}
                className="px-5 py-2.5 rounded-lg bg-bulolo-forest hover:bg-bulolo-emerald text-white text-sm font-bold border border-bulolo-gold/50 transition-colors disabled:opacity-50"
              >
                {trackingLoading ? 'Checking...' : 'Track Status'}
              </button>
            </form>

            {/* Tracking Result Banner */}
            {trackingResult && (
              <div className="mt-4 p-4 rounded-xl bg-white text-bulolo-charcoal shadow-md border-l-4 border-bulolo-emerald animate-in fade-in">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-bulolo-forest font-mono">{trackingResult.referenceNumber}</span>
                    <h4 className="text-sm font-bold text-gray-900 mt-0.5">{trackingResult.subject}</h4>
                    <p className="text-xs text-gray-600 mt-1">{trackingResult.description}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase">
                    {trackingResult.status.replace('_', ' ')}
                  </span>
                </div>
                {trackingResult.resolutionSummary && (
                  <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-bulolo-charcoal">
                    <strong>Official Update:</strong> {trackingResult.resolutionSummary}
                  </div>
                )}
              </div>
            )}

            {trackingError && (
              <p className="mt-2 text-xs text-amber-300 font-medium">{trackingError}</p>
            )}
          </div>
        </div>
      </section>

      {/* B. QUICK ACCESS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-black text-bulolo-charcoal tracking-tight">
            {t('quickAccess.title')}
          </h2>
          <p className="text-sm text-bulolo-muted mt-2">
            One single digital gateway connecting citizens, ward communities and the district administration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Apply for Assistance */}
          <Link
            href="/assistance"
            className="group p-6 rounded-2xl bg-white border border-bulolo-border hover:border-bulolo-emerald hover:shadow-lg transition-all space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-bulolo-charcoal group-hover:text-bulolo-forest transition-colors">
                {t('quickAccess.applyAssistance')}
              </h3>
              <p className="text-xs text-bulolo-muted mt-1 leading-relaxed">
                {t('quickAccess.applyAssistanceDesc')}
              </p>
            </div>
            <div className="text-xs font-semibold text-bulolo-forest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Apply online <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* 2. Report Issue */}
          <Link
            href="/report"
            className="group p-6 rounded-2xl bg-white border border-bulolo-border hover:border-bulolo-emerald hover:shadow-lg transition-all space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-bulolo-forest flex items-center justify-center group-hover:scale-105 transition-transform">
              <Hammer className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-bulolo-charcoal group-hover:text-bulolo-forest transition-colors">
                {t('quickAccess.reportIssue')}
              </h3>
              <p className="text-xs text-bulolo-muted mt-1 leading-relaxed">
                {t('quickAccess.reportIssueDesc')}
              </p>
            </div>
            <div className="text-xs font-semibold text-bulolo-forest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Submit concern <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* 3. Find Health Services */}
          <Link
            href="/services?category=HEALTHCARE"
            className="group p-6 rounded-2xl bg-white border border-bulolo-border hover:border-bulolo-emerald hover:shadow-lg transition-all space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-bulolo-charcoal group-hover:text-bulolo-forest transition-colors">
                {t('quickAccess.findHealth')}
              </h3>
              <p className="text-xs text-bulolo-muted mt-1 leading-relaxed">
                {t('quickAccess.findHealthDesc')}
              </p>
            </div>
            <div className="text-xs font-semibold text-bulolo-forest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Find clinics <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* 4. Find Education */}
          <Link
            href="/services?category=EDUCATION"
            className="group p-6 rounded-2xl bg-white border border-bulolo-border hover:border-bulolo-emerald hover:shadow-lg transition-all space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-bulolo-charcoal group-hover:text-bulolo-forest transition-colors">
                {t('quickAccess.findEducation')}
              </h3>
              <p className="text-xs text-bulolo-muted mt-1 leading-relaxed">
                {t('quickAccess.findEducationDesc')}
              </p>
            </div>
            <div className="text-xs font-semibold text-bulolo-forest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              School directory <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* 5. Development Projects */}
          <Link
            href="/projects"
            className="group p-6 rounded-2xl bg-white border border-bulolo-border hover:border-bulolo-emerald hover:shadow-lg transition-all space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-bulolo-charcoal group-hover:text-bulolo-forest transition-colors">
                {t('quickAccess.developmentProjects')}
              </h3>
              <p className="text-xs text-bulolo-muted mt-1 leading-relaxed">
                {t('quickAccess.developmentProjectsDesc')}
              </p>
            </div>
            <div className="text-xs font-semibold text-bulolo-forest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Track progress <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* 6. Community Information */}
          <Link
            href="/community"
            className="group p-6 rounded-2xl bg-white border border-bulolo-border hover:border-bulolo-emerald hover:shadow-lg transition-all space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-bulolo-charcoal group-hover:text-bulolo-forest transition-colors">
                {t('quickAccess.communityVoices')}
              </h3>
              <p className="text-xs text-bulolo-muted mt-1 leading-relaxed">
                {t('quickAccess.communityVoicesDesc')}
              </p>
            </div>
            <div className="text-xs font-semibold text-bulolo-forest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Explore wards <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* C. DISTRICT LLG OVERVIEW */}
      <section className="bg-white py-14 border-y border-bulolo-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-bulolo-gold uppercase tracking-wider">
                Geographic Administration
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-bulolo-charcoal mt-1">
                Bulolo District Local Level Governments
              </h2>
            </div>
            <Link
              href="/community"
              className="text-xs font-bold text-bulolo-forest hover:text-bulolo-emerald flex items-center gap-1"
            >
              View all ward directories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BULOLO_LLGS.map((llg) => (
              <div
                key={llg.id}
                className="p-5 rounded-2xl bg-bulolo-surface border border-bulolo-border hover:border-bulolo-forest/50 transition-all space-y-3"
              >
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white text-bulolo-forest border border-bulolo-border">
                    {llg.type} LLG
                  </span>
                  <span className="text-xs font-mono font-bold text-bulolo-gold">
                    {llg.wardsCount} Wards
                  </span>
                </div>
                <h3 className="text-base font-bold text-bulolo-charcoal">
                  {llg.name}
                </h3>
                <p className="text-xs text-bulolo-muted leading-relaxed line-clamp-3">
                  {llg.description}
                </p>
                <div className="pt-2 border-t border-bulolo-border/60 text-[11px] text-bulolo-charcoal flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-bulolo-emerald" />
                  <span>HQ: <strong>{llg.headquarters}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* D. LATEST ANNOUNCEMENTS & OFFICIAL NOTICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-xs font-bold text-bulolo-gold uppercase tracking-wider">
              Official District Communications
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-bulolo-charcoal mt-1">
              Latest Announcements & Public Notices
            </h2>
          </div>
          <Link
            href="/announcements"
            className="text-xs font-bold text-bulolo-forest hover:underline flex items-center gap-1"
          >
            All Notices <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map((a) => (
            <div
              key={a.id}
              className={`p-6 rounded-2xl border transition-all ${
                a.isUrgent
                  ? 'bg-amber-50/50 border-amber-300'
                  : 'bg-white border-bulolo-border'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {a.isUrgent && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-600 text-white">
                    Urgent Notice
                  </span>
                )}
                <span className="text-[11px] font-semibold text-bulolo-muted uppercase">
                  {a.category.replace('_', ' ')}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-[11px] text-bulolo-muted">
                  {new Date(a.publishDate).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-base font-bold text-bulolo-charcoal mb-2">
                {a.title}
              </h3>
              <p className="text-xs text-bulolo-muted leading-relaxed mb-4">
                {a.summary}
              </p>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[11px] text-bulolo-forest font-medium">
                  By {a.authorStaffName}
                </span>
                <Link
                  href="/announcements"
                  className="font-bold text-bulolo-forest hover:text-bulolo-emerald flex items-center gap-1"
                >
                  Read full notice <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* E. VERIFIED DEVELOPMENT HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-xs font-bold text-bulolo-gold uppercase tracking-wider">
              Transparency & Public Monitoring
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-bulolo-charcoal mt-1">
              Verified Development Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="text-xs font-bold text-bulolo-forest hover:underline flex items-center gap-1"
          >
            All Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-bulolo-border overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="h-40 bg-gradient-to-br from-emerald-800 to-bulolo-forest relative p-4 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/40 backdrop-blur-xs">
                    {p.projectCode}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 uppercase backdrop-blur-xs">
                    {p.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-bulolo-lightgreen font-bold">
                    {p.category.replace('_', ' ')}
                  </span>
                  <p className="text-xs text-white/80">{p.llg}</p>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-bulolo-charcoal leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs text-bulolo-muted mt-2 line-clamp-2">
                    {p.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-bulolo-border">
                  {/* Progress Meter */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-bulolo-muted font-medium">Verified Progress</span>
                      <span className="font-bold text-bulolo-forest">{p.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-bulolo-emerald rounded-full transition-all"
                        style={{ width: `${p.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {p.publishedBudgetKina && (
                    <div className="text-xs text-bulolo-charcoal flex justify-between items-center">
                      <span className="text-bulolo-muted">Published Budget:</span>
                      <strong className="text-bulolo-forest">K {p.publishedBudgetKina.toLocaleString()}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
