'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  TrendingUp,
  MapPin,
  FileText,
  Users,
  ShieldCheck,
  Send,
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { BULOLO_LLGS } from '@shared/types/geography';

export default function MpOfficeDashboard() {
  const router = useRouter();
  const { user, isMpOffice, isLoading } = useAuth();

  const [metrics, setMetrics] = useState<any>(null);
  const [requestsByLlg, setRequestsByLlg] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  // Announcement Publisher State
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState('OFFICIAL_NOTICE');
  const [annSummary, setAnnSummary] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annLlg, setAnnLlg] = useState('');
  const [annUrgent, setAnnUrgent] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isMpOffice)) {
      router.push('/login');
      return;
    }

    if (user && isMpOffice) {
      apiRequest('/reports/overview')
        .then(res => {
          if (res.success) {
            setMetrics(res.metrics);
            setRequestsByLlg(res.requestsByLlg);
          }
        })
        .catch(console.error);

      apiRequest('/projects')
        .then(res => res.success && setProjects(res.projects))
        .catch(console.error);
    }
  }, [user, isMpOffice, isLoading]);

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    try {
      const res = await apiRequest('/announcements', {
        method: 'POST',
        body: JSON.stringify({
          title: annTitle,
          category: annCategory,
          summary: annSummary,
          content: annContent,
          targetLlg: annLlg || undefined,
          isUrgent: annUrgent,
          isPublished: true
        })
      });

      if (res.success) {
        setPublishSuccess(true);
        setAnnTitle('');
        setAnnSummary('');
        setAnnContent('');
        setTimeout(() => setPublishSuccess(false), 3000);
      }
    } catch (e: any) {
      alert(e.message || 'Failed to publish announcement.');
    } finally {
      setPublishing(false);
    }
  };

  if (isLoading || !user) {
    return <div className="py-24 text-center text-xs text-bulolo-muted">Loading MP&apos;s Office Dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Executive Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-bulolo-forest to-[#173a2b] text-white shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-bulolo-gold text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-5 h-5" />
          <span>Parliamentary MP&apos;s Office & Electorate Oversight</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">
          Bulolo District Executive Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
          Comprehensive district-wide visibility across all 4 LLGs (Mumeng, Watut, Buang, Bulolo Urban). Monitoring community needs, verified DSIP capital investments, and direct communication to residents.
        </p>
      </div>

      {/* LLG Distribution Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-bulolo-charcoal">
          Citizen Concerns & Requests by Local Level Government
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BULOLO_LLGS.map(llg => {
            const count = requestsByLlg.find(r => r.llg === llg.name)?.count || 0;
            return (
              <div key={llg.id} className="p-5 rounded-2xl bg-white border border-bulolo-border shadow-xs space-y-2">
                <span className="text-[10px] font-mono font-bold text-bulolo-forest">{llg.type} LLG</span>
                <h4 className="text-sm font-bold text-bulolo-charcoal">{llg.name}</h4>
                <div className="pt-2 flex justify-between items-end border-t border-gray-100">
                  <span className="text-xs text-bulolo-muted">Total Requests:</span>
                  <span className="text-xl font-black text-bulolo-forest">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct Electorate Notice Publisher */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-bulolo-border shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5 text-bulolo-forest" />
          <h3 className="text-lg font-bold text-bulolo-charcoal">
            Publish Official Electorate Announcement / Notice
          </h3>
        </div>
        <p className="text-xs text-bulolo-muted">
          Broadcast official parliamentary announcements, community consultation notices, and urgent alerts across Bulolo Connect.
        </p>

        {publishSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
            Announcement successfully published to the district board!
          </div>
        )}

        <form onSubmit={handlePublishAnnouncement} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Notice Headline *</label>
              <input
                type="text"
                required
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                placeholder="e.g. Community Consultation on Rural Feeder Roads"
                className="w-full px-3 py-2 text-xs rounded-xl border border-bulolo-border"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Category</label>
              <select
                value={annCategory}
                onChange={(e) => setAnnCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-bulolo-border bg-white"
              >
                <option value="OFFICIAL_NOTICE">Official Notice</option>
                <option value="COMMUNITY_CONSULTATION">Community Consultation</option>
                <option value="EDUCATIONAL_OPPORTUNITY">Educational Opportunity</option>
                <option value="EMERGENCY_NOTICE">Emergency Notice</option>
                <option value="DISTRICT_UPDATE">District Update</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Target LLG (Optional)</label>
              <select
                value={annLlg}
                onChange={(e) => setAnnLlg(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-bulolo-border bg-white"
              >
                <option value="">District-wide (All 4 LLGs)</option>
                {BULOLO_LLGS.map(l => (
                  <option key={l.id} value={l.name}>{l.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center pt-5">
              <label className="inline-flex items-center text-xs text-bulolo-charcoal cursor-pointer font-bold">
                <input
                  type="checkbox"
                  checked={annUrgent}
                  onChange={(e) => setAnnUrgent(e.target.checked)}
                  className="mr-2 rounded text-red-600 focus:ring-red-500"
                />
                Mark as High Priority / Urgent Notice
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Summary *</label>
            <input
              type="text"
              required
              value={annSummary}
              onChange={(e) => setAnnSummary(e.target.value)}
              placeholder="Brief 1-sentence summary"
              className="w-full px-3 py-2 text-xs rounded-xl border border-bulolo-border"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Full Content *</label>
            <textarea
              required
              rows={4}
              value={annContent}
              onChange={(e) => setAnnContent(e.target.value)}
              placeholder="Provide complete public information..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-bulolo-border"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={publishing}
              className="px-6 py-2.5 rounded-xl bg-bulolo-forest hover:bg-bulolo-emerald text-white text-xs font-bold disabled:opacity-50"
            >
              {publishing ? 'Publishing...' : 'Broadcast to District'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
