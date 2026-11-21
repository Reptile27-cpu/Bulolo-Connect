'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Sprout,
  HeartPulse,
  Users,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  ArrowRight,
  AlertCircle,
  Clock
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { BULOLO_LLGS } from '@shared/types/geography';

export default function AssistancePage() {
  const { user } = useAuth();
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgramme, setSelectedProgramme] = useState<any>(null);

  // Application Form State
  const [statementOfNeed, setStatementOfNeed] = useState('');
  const [requestedAmount, setRequestedAmount] = useState<number | ''>('');
  const [householdReference, setHouseholdReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<any>(null);
  const [submissionError, setSubmissionError] = useState('');

  useEffect(() => {
    apiRequest('/assistance/programmes?onlyOpen=true')
      .then(res => {
        if (res.success) setProgrammes(res.programmes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in or create a citizen account to submit an assistance application.');
      return;
    }

    setSubmitting(true);
    setSubmissionError('');

    try {
      const res = await apiRequest('/assistance/apply', {
        method: 'POST',
        body: JSON.stringify({
          programmeId: selectedProgramme.id,
          statementOfNeed,
          requestedAmount: requestedAmount ? Number(requestedAmount) : undefined,
          householdReference: householdReference || undefined
        })
      });

      if (res.success) {
        setSubmissionSuccess(res);
      }
    } catch (err: any) {
      setSubmissionError(err.message || 'Application failed to submit.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-bold text-bulolo-gold uppercase tracking-wider">
          District Support Programmes
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-bulolo-charcoal tracking-tight">
          Request Public Assistance
        </h1>
        <p className="text-xs sm:text-sm text-bulolo-muted leading-relaxed">
          The Bulolo District Administration facilitates transparent assistance programmes for eligible residents across education, agriculture, emergency healthcare, and youth initiatives.
        </p>
      </div>

      {/* Mandatory Civic Integrity Alert */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Important Administrative Notice:</strong> Submission of an assistance application does not guarantee approval or immediate funds. All applications are assessed against published eligibility criteria by the relevant district sub-committee. Approvals are strictly recorded with an auditable officer decision.
        </div>
      </div>

      {/* Programmes List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-bulolo-muted">
          Loading active assistance programmes...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programmes.map((prog) => (
            <div
              key={prog.id}
              className="p-6 rounded-2xl bg-white border border-bulolo-border hover:border-bulolo-emerald hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-bulolo-lightgreen text-bulolo-forest">
                    {prog.code}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Open
                  </span>
                </div>

                <h3 className="text-base font-bold text-bulolo-charcoal leading-snug">
                  {prog.title}
                </h3>
                <p className="text-xs text-bulolo-muted leading-relaxed">
                  {prog.description}
                </p>

                {prog.maximumGrantAmount && (
                  <p className="text-xs font-semibold text-bulolo-forest">
                    Max Grant Cap: K {prog.maximumGrantAmount.toLocaleString()}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-bulolo-muted">
                  Office: {prog.responsibleOffice}
                </span>
                <button
                  onClick={() => {
                    setSelectedProgramme(prog);
                    setSubmissionSuccess(null);
                    setSubmissionError('');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-bulolo-forest hover:bg-bulolo-emerald text-white text-xs font-bold transition-colors"
                >
                  View & Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application / Programme Details Modal */}
      {selectedProgramme && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-bulolo-border my-8 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono font-bold text-bulolo-forest">{selectedProgramme.code}</span>
                <h3 className="text-xl font-black text-bulolo-charcoal mt-1">{selectedProgramme.title}</h3>
                <p className="text-xs text-bulolo-muted mt-0.5">{selectedProgramme.responsibleOffice}</p>
              </div>
              <button
                onClick={() => setSelectedProgramme(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm"
              >
                ✕ Close
              </button>
            </div>

            {/* Criteria & Documentation */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl text-xs">
              <h4 className="font-bold text-bulolo-charcoal">Eligibility Requirements:</h4>
              <ul className="list-disc list-inside space-y-1 text-bulolo-muted">
                {selectedProgramme.eligibilityCriteria.map((crit: string, i: number) => (
                  <li key={i}>{crit}</li>
                ))}
              </ul>

              <h4 className="font-bold text-bulolo-charcoal pt-2">Required Supporting Documentation:</h4>
              <ul className="list-disc list-inside space-y-1 text-bulolo-muted">
                {selectedProgramme.requiredDocuments.map((doc: string, i: number) => (
                  <li key={i}>{doc}</li>
                ))}
              </ul>
            </div>

            {/* Success View */}
            {submissionSuccess ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-900">Application Successfully Submitted</h4>
                <p className="text-xs text-emerald-800">
                  Your reference application number is: <strong className="font-mono text-sm">{submissionSuccess.applicationNumber}</strong>
                </p>
                <p className="text-[11px] text-emerald-700">
                  You can track the assessment status anytime in your Citizen Dashboard.
                </p>
                <div className="pt-2">
                  <Link
                    href="/portal/dashboard"
                    className="inline-block px-4 py-2 rounded-lg bg-bulolo-forest text-white text-xs font-bold"
                  >
                    Go to Citizen Dashboard
                  </Link>
                </div>
              </div>
            ) : !user ? (
              <div className="p-6 rounded-xl bg-gray-50 text-center space-y-3">
                <p className="text-xs text-bulolo-charcoal font-semibold">
                  You must be signed in with a verified Bulolo Citizen Account to submit an assistance application.
                </p>
                <div className="flex justify-center gap-3">
                  <Link href="/login" className="px-4 py-2 text-xs font-bold rounded-lg border border-bulolo-forest text-bulolo-forest">
                    Sign In
                  </Link>
                  <Link href="/register" className="px-4 py-2 text-xs font-bold rounded-lg bg-bulolo-forest text-white">
                    Create Citizen Account
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div className="p-3 rounded-lg bg-emerald-50/60 text-xs text-emerald-900">
                  Applying as: <strong>{user.fullName}</strong> ({user.accountId}) • Phone: {user.phoneNumber}
                </div>

                <div>
                  <label className="block text-xs font-bold text-bulolo-charcoal mb-1">
                    Requested Grant Amount (PGK / K) (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProgramme.maximumGrantAmount || 10000}
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 2500"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-bulolo-border"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-bulolo-charcoal mb-1">
                    Household Reference Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={householdReference}
                    onChange={(e) => setHouseholdReference(e.target.value)}
                    placeholder="e.g. HHD-2026-0001 (If previously registered)"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-bulolo-border font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-bulolo-charcoal mb-1">
                    Statement of Need & Circumstances (Mandatory)
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={statementOfNeed}
                    onChange={(e) => setStatementOfNeed(e.target.value)}
                    placeholder="Provide a detailed explanation of your family or community circumstances, why assistance is needed, and how the grant will be utilized..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-bulolo-border"
                  />
                </div>

                {submissionError && (
                  <p className="text-xs text-red-600 font-medium">{submissionError}</p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProgramme(null)}
                    className="px-4 py-2 text-xs rounded-lg border border-gray-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 text-xs font-bold rounded-lg bg-bulolo-forest hover:bg-bulolo-emerald text-white disabled:opacity-50"
                  >
                    {submitting ? 'Submitting Application...' : 'Submit Assistance Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
