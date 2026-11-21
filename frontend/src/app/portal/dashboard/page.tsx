'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  FileText,
  GraduationCap,
  Home,
  Bell,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  PlusCircle,
  ExternalLink,
  Lock,
  Plus
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function CitizenDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'ASSISTANCE' | 'HOUSEHOLD' | 'NOTIFICATIONS'>('REQUESTS');
  const [requests, setRequests] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [household, setHousehold] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Household Edit State
  const [editingHousehold, setEditingHousehold] = useState(false);
  const [headName, setHeadName] = useState('');
  const [headNid, setHeadNid] = useState('');
  const [hLlg, setHLlg] = useState('');
  const [hWard, setHWard] = useState('');
  const [hVillage, setHVillage] = useState('');
  const [hAddress, setHAddress] = useState('');
  const [hSize, setHSize] = useState(1);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadDashboardData();
    }
  }, [user, isLoading]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [reqRes, appRes, houseRes, notifRes] = await Promise.all([
        apiRequest('/requests/my').catch(() => ({ requests: [] })),
        apiRequest('/assistance/my-applications').catch(() => ({ applications: [] })),
        apiRequest('/household/my').catch(() => ({ household: null })),
        apiRequest('/notifications').catch(() => ({ notifications: [] }))
      ]);

      if (reqRes.requests) setRequests(reqRes.requests);
      if (appRes.applications) setApplications(appRes.applications);
      if (houseRes.household) {
        setHousehold(houseRes.household);
        setHeadName(houseRes.household.headOfHouseholdName);
        setHeadNid(houseRes.household.headOfHouseholdNID || '');
        setHLlg(houseRes.household.llg);
        setHWard(houseRes.household.ward);
        setHVillage(houseRes.household.village);
        setHAddress(houseRes.household.residentialAddress);
        setHSize(houseRes.household.householdSize);
        setMembers(houseRes.household.members || []);
      } else {
        setHeadName(user?.fullName || '');
      }
      if (notifRes.notifications) setNotifications(notifRes.notifications);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    setMembers([
      ...members,
      { fullName: '', relationshipToHead: 'Child', gender: 'MALE', isAttendingSchool: false, schoolName: '' }
    ]);
  };

  const handleMemberChange = (index: number, field: string, value: any) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const handleSaveHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiRequest('/household', {
        method: 'POST',
        body: JSON.stringify({
          headOfHouseholdName: headName,
          headOfHouseholdNID: headNid || undefined,
          llg: hLlg || 'Mumeng Rural LLG',
          ward: hWard || 'Ward 01 - Sambio',
          village: hVillage || 'Sambio',
          residentialAddress: hAddress || 'Sambio',
          householdSize: Number(hSize),
          members: members.filter(m => m.fullName.trim() !== '')
        })
      });

      if (res.success) {
        setHousehold(res.household);
        setEditingHousehold(false);
        alert('Household record saved successfully.');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save household profile.');
    }
  };

  if (isLoading || !user) {
    return <div className="py-24 text-center text-xs text-bulolo-muted">Loading Citizen Dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Citizen Profile Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-bulolo-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-bulolo-forest text-white flex items-center justify-center font-black text-2xl">
            {user.fullName.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-bulolo-charcoal">
                {user.fullName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-bulolo-lightgreen text-bulolo-forest">
                Verified Citizen
              </span>
            </div>
            <p className="text-xs text-bulolo-forest font-mono font-bold">
              Account ID: {user.accountId}
            </p>
            <p className="text-xs text-bulolo-muted">
              Mobile: {user.phoneNumber} • Language: {user.preferredLanguage === 'tpi' ? 'Tok Pisin' : 'English'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/report"
            className="px-4 py-2.5 rounded-xl bg-bulolo-forest hover:bg-bulolo-emerald text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Submit New Request
          </Link>
          <Link
            href="/assistance"
            className="px-4 py-2.5 rounded-xl bg-bulolo-gold hover:bg-yellow-400 text-bulolo-charcoal text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <GraduationCap className="w-4 h-4" />
            Apply for Assistance
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-bulolo-border pb-3">
        {[
          { id: 'REQUESTS', label: `My Requests (${requests.length})`, icon: FileText },
          { id: 'ASSISTANCE', label: `My Assistance Applications (${applications.length})`, icon: GraduationCap },
          { id: 'HOUSEHOLD', label: 'Household Profile (Private)', icon: Home },
          { id: 'NOTIFICATIONS', label: `Notifications (${notifications.filter(n => !n.isRead).length})`, icon: Bell }
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-bulolo-forest text-white shadow-xs'
                  : 'bg-white border border-bulolo-border text-bulolo-charcoal hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'REQUESTS' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-bulolo-border space-y-3">
              <FileText className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-bulolo-charcoal">No citizen requests submitted yet.</p>
              <p className="text-xs text-bulolo-muted">Report road washouts, water supply issues, or community priorities.</p>
              <Link href="/report" className="inline-block px-4 py-2 text-xs font-bold rounded-lg bg-bulolo-forest text-white mt-2">
                Submit a Concern
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {requests.map(req => (
                <div key={req.id} className="p-6 rounded-2xl bg-white border border-bulolo-border space-y-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs font-bold text-bulolo-forest">{req.referenceNumber}</span>
                      <h3 className="text-base font-bold text-bulolo-charcoal mt-0.5">{req.subject}</h3>
                      <p className="text-xs text-bulolo-muted">{req.llg} • {req.ward} • {req.village}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-bulolo-lightgreen text-bulolo-forest uppercase">
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-bulolo-charcoal leading-relaxed">{req.description}</p>

                  {req.resolutionSummary && (
                    <div className="p-3 rounded-xl bg-slate-50 text-xs text-bulolo-charcoal border-l-4 border-bulolo-emerald">
                      <strong>District Office Update:</strong> {req.resolutionSummary}
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-100 flex justify-between text-[11px] text-bulolo-muted">
                    <span>Submitted: {new Date(req.createdAt).toLocaleDateString()}</span>
                    <span>Urgency: {req.urgency}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'ASSISTANCE' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-bulolo-border space-y-3">
              <GraduationCap className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-bulolo-charcoal">No assistance applications on record.</p>
              <p className="text-xs text-bulolo-muted">Check currently open school fee subsidies, agriculture, or welfare grants.</p>
              <Link href="/assistance" className="inline-block px-4 py-2 text-xs font-bold rounded-lg bg-bulolo-forest text-white mt-2">
                View Available Programmes
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applications.map(app => (
                <div key={app.id} className="p-6 rounded-2xl bg-white border border-bulolo-border space-y-4 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs font-bold text-bulolo-forest">{app.applicationNumber}</span>
                      <h3 className="text-base font-bold text-bulolo-charcoal mt-0.5">{app.programme?.title}</h3>
                      <p className="text-xs text-bulolo-muted">{app.programme?.responsibleOffice}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'DECLINED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-bulolo-charcoal leading-relaxed">
                    <strong>Statement:</strong> {app.statementOfNeed}
                  </p>

                  {app.decisionReason && (
                    <div className="p-3 rounded-xl bg-slate-50 text-xs border-l-4 border-bulolo-gold">
                      <strong>Sub-Committee Assessment:</strong> {app.decisionReason}
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-100 flex justify-between text-[11px] text-bulolo-muted">
                    <span>Submitted: {new Date(app.createdAt).toLocaleDateString()}</span>
                    {app.requestedAmount && <span>Requested: K {app.requestedAmount.toLocaleString()}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'HOUSEHOLD' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-bulolo-border space-y-6">
          <div className="flex justify-between items-center border-b border-bulolo-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-bulolo-charcoal">Household & Family Information</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  Protected
                </span>
              </div>
              <p className="text-xs text-bulolo-muted">Strictly confidential records used to determine subsidy eligibility and welfare emergency distributions.</p>
            </div>
            {!editingHousehold && (
              <button
                onClick={() => setEditingHousehold(true)}
                className="px-4 py-2 rounded-xl bg-bulolo-forest text-white text-xs font-bold"
              >
                {household ? 'Update Details' : 'Create Household Profile'}
              </button>
            )}
          </div>

          {editingHousehold ? (
            <form onSubmit={handleSaveHousehold} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Head of Household Name</label>
                  <input
                    type="text"
                    required
                    value={headName}
                    onChange={(e) => setHeadName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-bulolo-border"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-bulolo-charcoal mb-1">National ID (NID) (Optional)</label>
                  <input
                    type="text"
                    value={headNid}
                    onChange={(e) => setHeadNid(e.target.value)}
                    placeholder="PNG NID Number"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-bulolo-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-bulolo-charcoal mb-1">LLG</label>
                  <input
                    type="text"
                    required
                    value={hLlg}
                    onChange={(e) => setHLlg(e.target.value)}
                    placeholder="e.g. Mumeng Rural LLG"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-bulolo-border"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Ward</label>
                  <input
                    type="text"
                    required
                    value={hWard}
                    onChange={(e) => setHWard(e.target.value)}
                    placeholder="e.g. Ward 01 - Sambio"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-bulolo-border"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Total Household Size</label>
                  <input
                    type="number"
                    min="1"
                    value={hSize}
                    onChange={(e) => setHSize(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-bulolo-border"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Physical Residential Address</label>
                <input
                  type="text"
                  required
                  value={hAddress}
                  onChange={(e) => setHAddress(e.target.value)}
                  placeholder="e.g. Sambio Valley Road, near church"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-bulolo-border"
                />
              </div>

              {/* Members */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-bulolo-charcoal uppercase">Dependents & Family Members</h4>
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="px-3 py-1 text-xs font-bold rounded-lg border border-bulolo-forest text-bulolo-forest"
                  >
                    + Add Member
                  </button>
                </div>

                {members.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={m.fullName}
                      onChange={(e) => handleMemberChange(idx, 'fullName', e.target.value)}
                      className="px-2 py-1 rounded border border-gray-300"
                    />
                    <select
                      value={m.relationshipToHead}
                      onChange={(e) => handleMemberChange(idx, 'relationshipToHead', e.target.value)}
                      className="px-2 py-1 rounded border border-gray-300 bg-white"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Other">Other</option>
                    </select>
                    <select
                      value={m.gender}
                      onChange={(e) => handleMemberChange(idx, 'gender', e.target.value)}
                      className="px-2 py-1 rounded border border-gray-300 bg-white"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                    <input
                      type="text"
                      placeholder="School name (if attending)"
                      value={m.schoolName || ''}
                      onChange={(e) => handleMemberChange(idx, 'schoolName', e.target.value)}
                      className="px-2 py-1 rounded border border-gray-300"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-bulolo-border">
                <button
                  type="button"
                  onClick={() => setEditingHousehold(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-bulolo-forest text-white"
                >
                  Save Profile
                </button>
              </div>
            </form>
          ) : household ? (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50">
                <div>
                  <span className="text-bulolo-muted">Household Reference:</span>
                  <p className="font-mono font-bold text-bulolo-forest">{household.referenceNumber}</p>
                </div>
                <div>
                  <span className="text-bulolo-muted">Primary Contact:</span>
                  <p className="font-bold text-bulolo-charcoal">{household.headOfHouseholdName}</p>
                </div>
                <div>
                  <span className="text-bulolo-muted">Location:</span>
                  <p className="font-bold text-bulolo-charcoal">{household.village}, {household.llg}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-bulolo-charcoal mb-2">Registered Household Members ({household.members?.length || 0}):</h4>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  {household.members?.map((m: any) => (
                    <div key={m.id} className="p-3 flex justify-between items-center bg-white">
                      <div>
                        <span className="font-bold text-bulolo-charcoal">{m.fullName}</span>
                        <span className="text-bulolo-muted ml-2">({m.relationshipToHead})</span>
                      </div>
                      <span className="text-[11px] text-bulolo-muted">
                        {m.schoolName ? `School: ${m.schoolName}` : 'No school listed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-bulolo-muted space-y-2">
              <p>No household profile registered yet.</p>
              <button
                onClick={() => setEditingHousehold(true)}
                className="px-4 py-2 rounded-xl bg-bulolo-forest text-white font-bold"
              >
                Set Up Household Profile
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'NOTIFICATIONS' && (
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-bulolo-border text-xs text-bulolo-muted">
              No notifications yet.
            </div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className="p-4 rounded-xl bg-white border border-bulolo-border shadow-xs flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-bulolo-charcoal">{n.title}</h4>
                  <p className="text-xs text-bulolo-muted">{n.message}</p>
                  <span className="text-[10px] text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
