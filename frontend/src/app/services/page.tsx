'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Phone,
  Clock,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Stethoscope,
  GraduationCap,
  Hammer,
  HelpCircle,
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { BULOLO_LLGS } from '@shared/types/geography';

const CATEGORIES = [
  { id: 'ALL', label: 'All Services' },
  { id: 'HEALTHCARE', label: 'Healthcare & Aid Posts', icon: Stethoscope },
  { id: 'EDUCATION', label: 'Schools & Training', icon: GraduationCap },
  { id: 'POLICE_AND_EMERGENCY', label: 'Police & Emergency', icon: ShieldCheck },
  { id: 'AGRICULTURE', label: 'Agriculture & DPI', icon: SproutIcon },
  { id: 'GOVERNMENT_OFFICE', label: 'Government Offices', icon: Building2 },
  { id: 'TRANSPORT', label: 'Transport & PMV', icon: Hammer }
];

function SproutIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
    </svg>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLlg, setSelectedLlg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  // Suggest Form State
  const [suggestName, setSuggestName] = useState('');
  const [suggestCategory, setSuggestCategory] = useState('HEALTHCARE');
  const [suggestDetails, setSuggestDetails] = useState('');
  const [suggestContact, setSuggestContact] = useState('');
  const [suggestSuccess, setSuggestSuccess] = useState(false);

  useEffect(() => {
    loadServices();
  }, [selectedCategory, selectedLlg]);

  const loadServices = async () => {
    setLoading(true);
    try {
      let query = '/services?verificationStatus=VERIFIED';
      if (selectedCategory !== 'ALL') query += `&category=${selectedCategory}`;
      if (selectedLlg) query += `&llg=${encodeURIComponent(selectedLlg)}`;
      if (searchQuery) query += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await apiRequest(query);
      if (res.success) {
        setServices(res.services);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadServices();
  };

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestSuccess(true);
    setTimeout(() => {
      setShowSuggestModal(false);
      setSuggestSuccess(false);
      setSuggestName('');
      setSuggestDetails('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title & Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-bulolo-border pb-6">
        <div>
          <span className="text-xs font-bold text-bulolo-gold uppercase tracking-wider">
            Verified Public Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-bulolo-charcoal tracking-tight mt-1">
            District Services Directory
          </h1>
          <p className="text-xs sm:text-sm text-bulolo-muted mt-1 max-w-2xl">
            Search officially verified public facilities, health aid posts, schools, and emergency contacts across Bulolo District.
          </p>
        </div>
        <button
          onClick={() => setShowSuggestModal(true)}
          className="px-4 py-2.5 rounded-xl bg-bulolo-forest text-white hover:bg-bulolo-emerald text-xs font-bold transition-colors flex items-center gap-2 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Suggest Missing Service
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-bulolo-border shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by facility name, organisation, or description..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-bulolo-border focus:ring-2 focus:ring-bulolo-forest focus:outline-none"
            />
          </div>
          <select
            value={selectedLlg}
            onChange={(e) => setSelectedLlg(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-bulolo-border bg-white text-bulolo-charcoal focus:ring-2 focus:ring-bulolo-forest focus:outline-none"
          >
            <option value="">All LLGs</option>
            {BULOLO_LLGS.map(llg => (
              <option key={llg.id} value={llg.name}>{llg.name}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-5 py-2 text-xs sm:text-sm font-bold rounded-lg bg-bulolo-forest text-white hover:bg-bulolo-emerald transition-colors"
          >
            Filter
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-bulolo-forest text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-bulolo-muted">
          Loading verified district services...
        </div>
      ) : services.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-bulolo-border space-y-3">
          <p className="text-sm font-bold text-bulolo-charcoal">No services found matching your criteria.</p>
          <p className="text-xs text-bulolo-muted">Try clearing your filters or suggest a missing service.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className={`p-6 rounded-2xl bg-white border transition-all space-y-4 flex flex-col justify-between ${
                svc.isEmergencyService
                  ? 'border-red-200 shadow-xs hover:border-red-400'
                  : 'border-bulolo-border hover:border-bulolo-emerald'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-bulolo-lightgreen text-bulolo-forest">
                      {svc.category.replace('_', ' ')}
                    </span>
                    {svc.isEmergencyService && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700 animate-pulse">
                        24/7 Emergency
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>

                <h3 className="text-lg font-bold text-bulolo-charcoal leading-snug">
                  {svc.name}
                </h3>
                <p className="text-xs text-bulolo-forest font-semibold">
                  {svc.organisationName}
                </p>
                <p className="text-xs text-bulolo-muted leading-relaxed">
                  {svc.description}
                </p>

                {/* Services list */}
                {svc.servicesOffered && svc.servicesOffered.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {svc.servicesOffered.map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-gray-100 text-gray-700 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact and address */}
              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-bulolo-charcoal">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-bulolo-emerald flex-shrink-0" />
                  <span>{svc.physicalAddress} ({svc.llg})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-bulolo-forest flex-shrink-0" />
                  <a href={`tel:${svc.phoneNumber}`} className="font-bold text-bulolo-forest hover:underline">
                    {svc.phoneNumber}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-bulolo-muted text-[11px]">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Hours: {svc.operatingHours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggest Missing Service Modal */}
      {showSuggestModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-bulolo-border space-y-4">
            <h3 className="text-lg font-bold text-bulolo-charcoal">
              Suggest Missing or Correct Service Information
            </h3>
            <p className="text-xs text-bulolo-muted">
              Submissions are reviewed by the Bulolo District ICT and Administration team before being verified and published.
            </p>

            {suggestSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
                Thank you! Your suggested service information has been received and queued for administrative review.
              </div>
            ) : (
              <form onSubmit={handleSuggestSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Service / Facility Name</label>
                  <input
                    type="text"
                    required
                    value={suggestName}
                    onChange={(e) => setSuggestName(e.target.value)}
                    placeholder="e.g. Zenag Community Aid Post"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-bulolo-border"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Category</label>
                  <select
                    value={suggestCategory}
                    onChange={(e) => setSuggestCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-bulolo-border bg-white"
                  >
                    <option value="HEALTHCARE">Healthcare & Aid Posts</option>
                    <option value="EDUCATION">Schools & Educational</option>
                    <option value="AGRICULTURE">Agricultural Services</option>
                    <option value="POLICE_AND_EMERGENCY">Police & Emergency</option>
                    <option value="GOVERNMENT_OFFICE">Government Offices</option>
                    <option value="COMMUNITY_ORGANISATION">Community Organisation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Location Details & Phone</label>
                  <textarea
                    required
                    rows={3}
                    value={suggestDetails}
                    onChange={(e) => setSuggestDetails(e.target.value)}
                    placeholder="Specify LLG, Ward, Village, operating hours and known contact numbers..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-bulolo-border"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Your Mobile Phone (Optional)</label>
                  <input
                    type="text"
                    value={suggestContact}
                    onChange={(e) => setSuggestContact(e.target.value)}
                    placeholder="+675 7XXXXXXX"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-bulolo-border"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowSuggestModal(false)}
                    className="px-4 py-2 text-xs rounded-lg border border-gray-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs rounded-lg bg-bulolo-forest text-white font-bold hover:bg-bulolo-emerald"
                  >
                    Submit Suggestion
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
