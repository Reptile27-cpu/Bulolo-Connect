'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  FileText,
  GraduationCap,
  Hammer,
  Users,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Search,
  MessageSquare
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { BULOLO_LLGS } from '@shared/types/geography';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isStaff, isLoading } = useAuth();

  const [metrics, setMetrics] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'ASSISTANCE'>('REQUESTS');

  // Request Status Modal State
  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('ACTION_IN_PROGRESS');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [officialComment, setOfficialComment] = useState('');
  const [updatingReq, setUpdatingReq] = useState(false);

  // Assistance Decision Modal State
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [appDecision, setAppDecision] = useState<'APPROVED' | 'DECLINED'>('APPROVED');
  const [decisionExplanation, setDecisionExplanation] = useState('');
  const [approvedAmount, setApprovedAmount] = useState<number | ''>('');
  const [updatingApp, setUpdatingApp] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isStaff)) {
      router.push('/login');
      return;
    }

    if (user && isStaff) {
      loadAdminData();
    }
  }, [user, isStaff, isLoading]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [overviewRes, reqRes, appRes] = await Promise.all([
        apiRequest('/reports/overview').catch(() => null),
        apiRequest('/requests?limit=50').catch(() => ({ requests: [] })),
        apiRequest('/assistance/applications?limit=50').catch(() => ({ applications: [] }))
      ]);

      if (overviewRes?.success) setMetrics(overviewRes.metrics);
      if (reqRes?.requests) setRequests(reqRes.requests);
      if (appRes?.applications) setApplications(appRes.applications);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReqStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingReq(true);
    try {
      const res = await apiRequest(`/requests/${selectedReq.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: newStatus,
          resolutionSummary: resolutionSummary || undefined,
          officialComment: officialComment || undefined
        })
      });

      if (res.success) {
        setSelectedReq(null);
        setResolutionSummary('');
        setOfficialComment('');
        loadAdminData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update request');
    } finally {
      setUpdatingReq(false);
    }
  };

  const handleAppDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingApp(true);
    try {
      const res = await apiRequest(`/assistance/applications/${selectedApp.id}/decision`, {
        method: 'POST',
        body: JSON.stringify({
          status: appDecision,
          explanation: decisionExplanation,
          amountApproved: approvedAmount ? Number(approvedAmount) : undefined
        })
      });

      if (res.success) {
        setSelectedApp(null);
        setDecisionExplanation('');
        setApprovedAmount('');
        loadAdminData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to record application decision');
    } finally {
      setUpdatingApp(false);
    }
  };

  const handleExportCSV = async (type: 'requests' | 'assistance') => {
    try {
      const token = localStorage.getItem('bulolo_token');
      const res = await fetch(`http://localhost:5000/api/v1/reports/export?type=${type}&format=csv`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulolo_${type}_export.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      alert('Export failed.');
    }
  };

  if (isLoading || !user) {
    return <div className="py-24 text-center text-xs text-bulolo-muted">Authenticating Staff Access...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-bulolo-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-bulolo-forest text-white uppercase tracking-wider">
              Staff Backoffice
            </span>
            <span className="text-xs text-bulolo-muted">Bulolo District Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-bulolo-charcoal mt-1">
            Administration Portal
          </h1>
          <p className="text-xs text-bulolo-muted">
            Managing officer: <strong>{user.fullName}</strong> • Role: <strong>{user.role}</strong>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleExportCSV('requests')}
            className="px-3.5 py-2 rounded-xl border border-bulolo-border bg-white text-bulolo-charcoal hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Export Requests (CSV)
          </button>
          <button
            onClick={() => handleExportCSV('assistance')}
            className="px-3.5 py-2 rounded-xl border border-bulolo-border bg-white text-bulolo-charcoal hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Export Applications (CSV)
          </button>
        </div>
      </div>

      {/* Real Database KPI Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-bulolo-border">
            <p className="text-[11px] font-bold text-bulolo-muted uppercase">Registered Citizens</p>
            <p className="text-2xl font-black text-bulolo-charcoal mt-1">{metrics.totalCitizens}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-bulolo-border">
            <p className="text-[11px] font-bold text-bulolo-muted uppercase">Total Requests</p>
            <p className="text-2xl font-black text-bulolo-forest mt-1">{metrics.totalRequests}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-bulolo-border">
            <p className="text-[11px] font-bold text-amber-700 uppercase">Pending Review</p>
            <p className="text-2xl font-black text-amber-700 mt-1">{metrics.pendingRequests}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-bulolo-border">
            <p className="text-[11px] font-bold text-emerald-700 uppercase">Resolved Cases</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{metrics.resolvedRequests}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-bulolo-border">
            <p className="text-[11px] font-bold text-bulolo-muted uppercase">Assistance Apps</p>
            <p className="text-2xl font-black text-bulolo-charcoal mt-1">{metrics.totalApplications}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-bulolo-border">
            <p className="text-[11px] font-bold text-bulolo-muted uppercase">Active Projects</p>
            <p className="text-2xl font-black text-bulolo-forest mt-1">{metrics.activeProjects}</p>
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-bulolo-border pb-3">
        <button
          onClick={() => setActiveTab('REQUESTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'REQUESTS' ? 'bg-bulolo-forest text-white' : 'bg-white border border-bulolo-border'
          }`}
        >
          Citizen Requests & Issues ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('ASSISTANCE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ASSISTANCE' ? 'bg-bulolo-forest text-white' : 'bg-white border border-bulolo-border'
          }`}
        >
          Assistance Programme Applications ({applications.length})
        </button>
      </div>

      {/* Requests Management Table */}
      {activeTab === 'REQUESTS' && (
        <div className="bg-white rounded-2xl border border-bulolo-border overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-bulolo-muted uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">LLG & Ward</th>
                  <th className="p-4">Urgency</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-bulolo-forest">{req.referenceNumber}</td>
                    <td className="p-4 font-semibold text-bulolo-charcoal max-w-xs truncate">{req.subject}</td>
                    <td className="p-4">{req.category.replace('_', ' ')}</td>
                    <td className="p-4 text-bulolo-muted">{req.llg} ({req.ward})</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        req.urgency === 'HIGH' || req.urgency === 'EMERGENCY' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {req.urgency}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-bulolo-lightgreen text-bulolo-forest uppercase">
                        {req.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setSelectedReq(req);
                          setNewStatus(req.status);
                          setResolutionSummary(req.resolutionSummary || '');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-bulolo-forest text-white text-[11px] font-bold hover:bg-bulolo-emerald transition-colors"
                      >
                        Triage & Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assistance Applications Table */}
      {activeTab === 'ASSISTANCE' && (
        <div className="bg-white rounded-2xl border border-bulolo-border overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-bulolo-muted uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-4">App Ref</th>
                  <th className="p-4">Programme</th>
                  <th className="p-4">Applicant</th>
                  <th className="p-4">LLG</th>
                  <th className="p-4">Requested</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-bulolo-forest">{app.applicationNumber}</td>
                    <td className="p-4 font-semibold text-bulolo-charcoal max-w-xs truncate">{app.programme?.title}</td>
                    <td className="p-4">{app.applicantName}</td>
                    <td className="p-4 text-bulolo-muted">{app.llg}</td>
                    <td className="p-4 font-mono">{app.requestedAmount ? `K ${app.requestedAmount.toLocaleString()}` : 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'DECLINED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setAppDecision('APPROVED');
                          setDecisionExplanation(app.decisionReason || '');
                          setApprovedAmount(app.requestedAmount || '');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-bulolo-forest text-white text-[11px] font-bold hover:bg-bulolo-emerald transition-colors"
                      >
                        Assess & Decide
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Request Update Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-bulolo-border space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-xs font-bold text-bulolo-forest">{selectedReq.referenceNumber}</span>
                <h3 className="text-base font-bold text-bulolo-charcoal">{selectedReq.subject}</h3>
              </div>
              <button onClick={() => setSelectedReq(null)} className="text-gray-400 font-bold">✕</button>
            </div>

            <p className="text-xs text-bulolo-muted bg-slate-50 p-3 rounded-xl">{selectedReq.description}</p>

            <form onSubmit={handleUpdateReqStatus} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-bulolo-border bg-white"
                >
                  <option value="RECEIVED">RECEIVED (Acknowledged by district)</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW (Assessing field priority)</option>
                  <option value="ACTION_IN_PROGRESS">ACTION_IN_PROGRESS (Dispatched machinery / officer)</option>
                  <option value="RESOLVED">RESOLVED (Maintenance completed)</option>
                  <option value="CLOSED">CLOSED (Case concluded)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Resolution Summary / Public Note</label>
                <textarea
                  rows={3}
                  value={resolutionSummary}
                  onChange={(e) => setResolutionSummary(e.target.value)}
                  placeholder="Official action taken visible to the citizen..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-bulolo-border"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingReq}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-bulolo-forest text-white hover:bg-bulolo-emerald"
                >
                  {updatingReq ? 'Saving...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assistance Assessment Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-bulolo-border space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-xs font-bold text-bulolo-forest">{selectedApp.applicationNumber}</span>
                <h3 className="text-base font-bold text-bulolo-charcoal">{selectedApp.programme?.title}</h3>
                <p className="text-xs text-bulolo-muted">Applicant: {selectedApp.applicantName}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 font-bold">✕</button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <p><strong>Statement of Need:</strong> {selectedApp.statementOfNeed}</p>
              {selectedApp.requestedAmount && (
                <p><strong>Requested Amount:</strong> K {selectedApp.requestedAmount.toLocaleString()}</p>
              )}
            </div>

            <form onSubmit={handleAppDecision} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Assessment Decision *</label>
                <select
                  value={appDecision}
                  onChange={(e) => setAppDecision(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-bulolo-border bg-white"
                >
                  <option value="APPROVED">APPROVED (Meets criteria)</option>
                  <option value="DECLINED">DECLINED (Does not meet criteria / funds exhausted)</option>
                </select>
              </div>

              {appDecision === 'APPROVED' && (
                <div>
                  <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Approved Grant Amount (PGK / K)</label>
                  <input
                    type="number"
                    value={approvedAmount}
                    onChange={(e) => setApprovedAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-bulolo-border"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-bulolo-charcoal mb-1">
                  Mandatory Officer Justification *
                </label>
                <textarea
                  required
                  minLength={10}
                  rows={3}
                  value={decisionExplanation}
                  onChange={(e) => setDecisionExplanation(e.target.value)}
                  placeholder="Record clear justification against published programme criteria..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-bulolo-border"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingApp}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-bulolo-forest text-white hover:bg-bulolo-emerald"
                >
                  {updatingApp ? 'Recording...' : 'Record Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
