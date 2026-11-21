'use client';

import React from 'react';
import { Mountain, Trees, ShieldCheck, Factory, Sprout, Landmark, MapPin, Users } from 'lucide-react';
import { BULOLO_LLGS, DISTRICT_METADATA } from '@shared/types/geography';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold text-bulolo-gold uppercase tracking-wider">
          District Profile & Geography
        </span>
        <h1 className="text-4xl font-black text-bulolo-charcoal tracking-tight">
          About Bulolo District
        </h1>
        <p className="text-base text-bulolo-muted leading-relaxed">
          Bulolo District is situated in the rugged, forested highlands of Morobe Province, Papua New Guinea. Famed for its rich natural resource heritage, extensive forestry plantations, coffee cultivation, and resilient communities, Bulolo represents a vital economic and cultural pillar of the nation.
        </p>
      </div>

      {/* District Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-2xl bg-white border border-bulolo-border space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-bulolo-forest flex items-center justify-center">
            <Trees className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-bulolo-charcoal">Forestry & Timber Heritage</h3>
          <p className="text-xs text-bulolo-muted leading-relaxed">
            Bulolo is home to the Southern Hemisphere&apos;s oldest sustainable pine plantations, managed alongside PNG Forest Products and the PNG National Forestry College, supplying sustainable timber and plywood throughout the Pacific.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-bulolo-border space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-bulolo-gold flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-bulolo-charcoal">Agriculture & Poultry Hub</h3>
          <p className="text-xs text-bulolo-muted leading-relaxed">
            From Zenag in Mumeng supplying poultry and table eggs nationwide to high-altitude Arabica coffee cooperatives in Buang and Watut, agriculture forms the daily livelihood and economic backbone of our rural families.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-bulolo-border space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Mountain className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-bulolo-charcoal">Mining & River Basins</h3>
          <p className="text-xs text-bulolo-muted leading-relaxed">
            From the pioneering gold dredges of the 1930s to modern alluvial small-scale miners along the Watut and Bulolo rivers, the district balances resource development with environmental conservation and community stewardship.
          </p>
        </div>
      </div>

      {/* Local Level Governments Detailed */}
      <div className="space-y-6">
        <div className="border-b border-bulolo-border pb-4">
          <h2 className="text-2xl font-black text-bulolo-charcoal">
            The Four Local Level Governments (LLGs)
          </h2>
          <p className="text-xs text-bulolo-muted mt-1">
            Official administrative jurisdictions comprising Bulolo Open Electorate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BULOLO_LLGS.map((llg) => (
            <div key={llg.id} className="p-6 rounded-2xl bg-white border border-bulolo-border space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-bulolo-charcoal">{llg.name}</h3>
                  <p className="text-xs text-bulolo-forest font-medium">Headquarters: {llg.headquarters}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-bulolo-lightgreen text-bulolo-forest">
                  {llg.wardsCount} Wards
                </span>
              </div>
              <p className="text-xs text-bulolo-muted leading-relaxed">
                {llg.description}
              </p>
              <div>
                <p className="text-xs font-bold text-bulolo-charcoal mb-2">Key Wards & Communities:</p>
                <div className="flex flex-wrap gap-1.5">
                  {llg.defaultWards.map((w, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Governance Charter */}
      <div className="p-8 rounded-3xl bg-bulolo-forest text-white space-y-4 border-2 border-bulolo-gold/40 shadow-lg">
        <div className="flex items-center gap-2 text-bulolo-gold font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Civic Platform Charter & Integrity</span>
        </div>
        <h3 className="text-2xl font-black">Our Commitment to Bulolo Citizens</h3>
        <p className="text-xs text-emerald-100/90 leading-relaxed max-w-3xl">
          Bulolo Connect operates strictly as a civic, administrative, and public service management platform. It does not engage in political campaigning, voter targeting, or partisan profiling. Every resident of Mumeng, Watut, Buang, and Bulolo Urban is entitled to equal, transparent, and dignified access to public assistance, service directories, and verified development records.
        </p>
      </div>
    </div>
  );
}
