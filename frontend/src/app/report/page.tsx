'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Hammer,
  Droplet,
  Zap,
  GraduationCap,
  HeartPulse,
  Sprout,
  Users,
  MapPin,
  CheckCircle2,
  Save,
  Send,
  HelpCircle
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { BULOLO_LLGS } from '@shared/types/geography';

const CATEGORIES = [
  { id: 'ROADS_AND_BRIDGES', label: 'Roads & Bridges', icon: Hammer },
  { id: 'WATER_SUPPLY', label: 'Water Supply & Tanks', icon: Droplet },
  { id: 'ELECTRICITY', label: 'Electricity & Solar', icon: Zap },
  { id: 'EDUCATION', label: 'Education & Schools', icon: GraduationCap },
  { id: 'HEALTH', label: 'Health & Aid Posts', icon: HeartPulse },
  { id: 'AGRICULTURE', label: 'Agriculture & Crops', icon: Sprout },
  { id: 'YOUTH_DEVELOPMENT', label: 'Youth Development', icon: Users },
  { id: 'PUBLIC_INFRASTRUCTURE', label: 'Public Infrastructure', icon: Hammer },
  { id: 'LAND_AND_ENVIRONMENT', label: 'Land & Environmental Concerns', icon: AlertCircle },
  { id: 'OTHER', label: 'Other Community Needs', icon: HelpCircle }
];

export default function ReportPage() {
  const { user } = useAuth();

  // Form State
  const [category, setCategory] = useState('ROADS_AND_BRIDGES');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [llg, setLlg] = useState('Mumeng Rural LLG');
  const [ward, setWard] = useState('Ward 01 - Sambio');
  const [village, setVillage] = useState('');
  const [specificLocation, setSpecificLocation] = useState('');
  const [urgency, setUrgency] = useState<'LOW' | 'NORMAL' | 'HIGH' | 'EMERGENCY'>('NORMAL');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<any>(null);
  const [submissionError, setSubmissionError] = useState('');

  // Auto-populate wards on LLG change
  const selectedLlgData = BULOLO_LLGS.find(l => l.name === llg) || BULOLO_LLGS[0];

  useEffect(() => {
    // Check for offline saved draft
    const savedDraft = localStorage.getItem('bulolo_report_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.subject) setSubject(parsed.subject);
        if (parsed.description) setDescription(parsed.description);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.llg) setLlg(parsed.llg);
        if (parsed.village) setVillage(parsed.village);
      } catch (e) {}
    }
  }, []);

  const handleSaveDraft = () => {
    const draft = { category, subject, description, llg, ward, village, specificLocation };
    localStorage.setItem('bulolo_report_draft', JSON.stringify(draft));
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmissionError('');

    try {
      const res = await apiRequest('/requests', {
        method: 'POST',
        body: JSON.stringify({
          category,
          subject,
          description,
          llg,
          ward,
          village,
          specificLocation: specificLocation || undefined,
          urgency,
          isAnonymous,
          contactName: isAnonymous ? undefined : (contactName || user?.fullName),
          contactPhone: isAnonymous ? undefined : (contactPhone || user?.phoneNumber)
        })
      });

      if (res.success) {
        setSubmissionSuccess(res);
        localStorage.removeItem('bulolo_report_draft');
      }
    } catch (err: any) {
      setSubmissionError(err.message || 'Submission failed. Please check connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-bulolo-gold uppercase tracking-wider">
          Citizen Feedback & Issue Reporting
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-bulolo-charcoal tracking-tight">
          Report an Issue or Submit Feedback
        </h1>
        <p className="text-xs sm:text-sm text-bulolo-muted leading-relaxed">
          Notify the Bulolo District Administration regarding broken infrastructure, water shortages, road maintenance needs, or community development priorities.
        </p>
      </div>

      {submissionSuccess ? (
        <div className="p-8 rounded-3xl bg-white border border-bulolo-border shadow-lg text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
          <h2 className="text-2xl font-black text-bulolo-charcoal">Request Successfully Submitted</h2>
          <div className="p-4 rounded-xl bg-bulolo-surface max-w-md mx-auto border border-bulolo-border">
            <p className="text-xs text-bulolo-muted uppercase font-bold">Your Tracking Reference Code:</p>
            <p className="text-2xl font-black text-bulolo-forest font-mono mt-1">
              {submissionSuccess.referenceNumber}
            </p>
          </div>
          <p className="text-xs text-bulolo-muted max-w-md mx-auto leading-relaxed">
            Please write down or screenshot your reference number. You can check the official review and action updates anytime on the homepage without signing in.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => {
                setSubmissionSuccess(null);
                setSubject('');
                setDescription('');
                setVillage('');
              }}
              className="px-5 py-2.5 rounded-xl border border-bulolo-forest text-bulolo-forest text-xs font-bold"
            >
              Submit Another Report
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-bulolo-forest text-white text-xs font-bold"
            >
              Return to Home
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-bulolo-border shadow-sm space-y-6">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-bulolo-charcoal mb-2">
              Select Issue Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all text-xs font-semibold ${
                      isSelected
                        ? 'border-bulolo-forest bg-bulolo-lightgreen/40 text-bulolo-forest'
                        : 'border-bulolo-border hover:bg-slate-50 text-bulolo-charcoal'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-bulolo-charcoal mb-1">
                Subject / Summary Title *
              </label>
              <input
                type="text"
                required
                minLength={5}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Washout on Kumalu River Crossing Bridge Approach"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-bulolo-border focus:ring-2 focus:ring-bulolo-forest focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-bulolo-charcoal mb-1">
                Detailed Description of the Problem / Concern *
              </label>
              <textarea
                required
                rows={5}
                minLength={15}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what occurred, how long it has been an issue, how many households are affected, and any safety hazards..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-bulolo-border focus:ring-2 focus:ring-bulolo-forest focus:outline-none"
              />
            </div>
          </div>

          {/* Location Hierarchy */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold text-bulolo-charcoal mb-1">LLG *</label>
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

            <div>
              <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Village / Community *</label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. Sambio Village"
                className="w-full px-3 py-2 text-xs rounded-xl border border-bulolo-border"
              />
            </div>
          </div>

          {/* Specific landmark and urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Specific Landmark / Location</label>
              <input
                type="text"
                value={specificLocation}
                onChange={(e) => setSpecificLocation(e.target.value)}
                placeholder="e.g. 200m from primary school entrance"
                className="w-full px-3 py-2 text-xs rounded-xl border border-bulolo-border"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Urgency Rating</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-bulolo-border bg-white"
              >
                <option value="LOW">Low (Routine observation)</option>
                <option value="NORMAL">Normal (Needs attention in scheduled maintenance)</option>
                <option value="HIGH">High (Active danger or service cutoff)</option>
                <option value="EMERGENCY">Emergency (Life threatening / urgent road blockage)</option>
              </select>
            </div>
          </div>

          {/* Privacy & Anonymous options */}
          <div className="p-4 rounded-xl bg-slate-50 space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anon"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded text-bulolo-forest focus:ring-bulolo-forest"
              />
              <label htmlFor="anon" className="font-semibold text-bulolo-charcoal cursor-pointer">
                Submit this report anonymously (For public non-personal concerns)
              </label>
            </div>

            {!isAnonymous && !user && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                <div>
                  <label className="block font-bold text-bulolo-charcoal mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-1.5 rounded-lg border border-bulolo-border bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-bulolo-charcoal mb-1">Your Contact Phone</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+675 7XXXXXXX"
                    className="w-full px-3 py-1.5 rounded-lg border border-bulolo-border bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {submissionError && (
            <p className="text-xs text-red-600 font-medium">{submissionError}</p>
          )}

          {/* Form Actions: Save Offline Draft + Submit */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-bulolo-border">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isDraftSaved ? 'Draft Saved to Phone!' : 'Save Offline Draft'}
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-bulolo-forest hover:bg-bulolo-emerald text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting to District...' : 'Submit Citizen Request'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
