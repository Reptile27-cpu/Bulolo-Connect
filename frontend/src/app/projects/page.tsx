'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  AlertCircle
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    apiRequest('/projects')
      .then(res => {
        if (res.success) setProjects(res.projects);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter(p => {
    if (selectedStatus === 'ALL') return true;
    return p.status === selectedStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-bold text-bulolo-gold uppercase tracking-wider">
          Infrastructure & Community Investments
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-bulolo-charcoal tracking-tight">
          District Development Projects
        </h1>
        <p className="text-xs sm:text-sm text-bulolo-muted leading-relaxed">
          Monitor verified capital projects across Bulolo District funded by DSIP, Provincial Grants, and development partners. Verified financial figures and dated engineering milestones.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-bulolo-border pb-4">
        {[
          { id: 'ALL', label: 'All Projects' },
          { id: 'UNDER_CONSTRUCTION', label: 'Under Construction' },
          { id: 'APPROVED', label: 'Approved & Procurement' },
          { id: 'COMPLETED', label: 'Completed' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedStatus(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === tab.id
                ? 'bg-bulolo-forest text-white shadow-xs'
                : 'bg-white border border-bulolo-border text-bulolo-charcoal hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-bulolo-muted">
          Loading verified development projects...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-bulolo-border">
          <p className="text-sm font-bold text-bulolo-charcoal">No projects found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(proj => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border border-bulolo-border overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="p-4 bg-gradient-to-r from-bulolo-forest to-emerald-900 text-white space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold bg-white/20 px-2 py-0.5 rounded">
                      {proj.projectCode}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-bulolo-gold text-bulolo-charcoal">
                      {proj.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-base font-bold leading-snug">
                    {proj.title}
                  </h3>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-xs text-bulolo-muted leading-relaxed line-clamp-3">
                    {proj.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-bulolo-charcoal">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-bulolo-forest flex-shrink-0" />
                      <span>{proj.specificLocation} ({proj.llg})</span>
                    </div>
                    <div className="flex items-center gap-2 text-bulolo-muted text-[11px]">
                      <span>Agency: {proj.implementingAgency}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-bulolo-muted font-medium">Physical Progress</span>
                      <span className="font-bold text-bulolo-forest">{proj.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-bulolo-emerald rounded-full transition-all"
                        style={{ width: `${proj.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {proj.isFinanciallyVerified && proj.publishedBudgetKina && (
                    <div className="p-3 rounded-xl bg-bulolo-surface border border-bulolo-border/80 text-xs">
                      <div className="flex justify-between">
                        <span className="text-bulolo-muted">Verified Budget:</span>
                        <strong className="text-bulolo-forest font-mono">
                          K {proj.publishedBudgetKina.toLocaleString()}
                        </strong>
                      </div>
                      <div className="text-[11px] text-bulolo-muted mt-1 truncate">
                        Funded by: {proj.fundingSource}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedProject(proj)}
                  className="w-full py-2 rounded-xl border border-bulolo-forest text-bulolo-forest hover:bg-bulolo-forest hover:text-white text-xs font-bold transition-colors"
                >
                  View Details & Milestones
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-bulolo-border space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono font-bold text-bulolo-forest">{selectedProject.projectCode}</span>
                <h3 className="text-xl font-black text-bulolo-charcoal mt-1">{selectedProject.title}</h3>
                <p className="text-xs text-bulolo-muted">{selectedProject.llg} • {selectedProject.ward}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-bulolo-muted leading-relaxed">
              {selectedProject.description}
            </p>

            <div className="p-4 rounded-xl bg-slate-50 text-xs space-y-2">
              <p><strong>Implementing Agency:</strong> {selectedProject.implementingAgency}</p>
              <p><strong>Contractor:</strong> {selectedProject.contractorName || 'Public Works Unit'}</p>
              <p><strong>Commenced:</strong> {new Date(selectedProject.commencementDate).toLocaleDateString()}</p>
              <p><strong>Target Completion:</strong> {new Date(selectedProject.expectedCompletionDate).toLocaleDateString()}</p>
              {selectedProject.isFinanciallyVerified && (
                <p><strong>Budget / Funding:</strong> K {selectedProject.publishedBudgetKina?.toLocaleString()} ({selectedProject.fundingSource})</p>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedProject(null)}
                className="w-full py-2.5 rounded-xl bg-bulolo-forest text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
