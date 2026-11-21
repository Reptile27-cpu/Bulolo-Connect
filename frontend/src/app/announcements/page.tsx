'use client';

import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Calendar, User, Search, MapPin } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    apiRequest('/announcements')
      .then(res => {
        if (res.success) setAnnouncements(res.announcements);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = announcements.filter(a => {
    if (selectedCategory === 'ALL') return true;
    return a.category === selectedCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-bold text-bulolo-gold uppercase tracking-wider">
          Official Communications & Notices
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-bulolo-charcoal tracking-tight">
          District Announcements
        </h1>
        <p className="text-xs sm:text-sm text-bulolo-muted leading-relaxed">
          Official public notices, disaster weather advisories, school fee assistance alerts, and community consultation schedules for Bulolo District.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-bulolo-muted">
          Loading official district notices...
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map(a => (
            <div
              key={a.id}
              className={`p-6 sm:p-8 rounded-2xl border transition-all space-y-4 ${
                a.isUrgent
                  ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                  : 'bg-white border-bulolo-border shadow-xs'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                {a.isUrgent && (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-amber-600 text-white">
                    Urgent Notice
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-bulolo-lightgreen text-bulolo-forest">
                  {a.category.replace('_', ' ')}
                </span>
                <span className="text-xs text-bulolo-muted flex items-center gap-1 ml-auto">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(a.publishDate).toLocaleDateString()}
                </span>
              </div>

              <h2 className="text-xl font-bold text-bulolo-charcoal">
                {a.title}
              </h2>

              <p className="text-xs sm:text-sm text-bulolo-charcoal leading-relaxed whitespace-pre-line">
                {a.content}
              </p>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-bulolo-muted">
                <span className="flex items-center gap-1 font-medium">
                  <User className="w-3.5 h-3.5" />
                  Published by: <strong>{a.authorStaffName}</strong>
                </span>
                {a.targetLlg && (
                  <span className="flex items-center gap-1 font-semibold text-bulolo-forest">
                    <MapPin className="w-3.5 h-3.5" />
                    Target: {a.targetLlg}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
