import React from 'react';
import Link from 'next/link';
import { BuloloLogo } from '../ui/BuloloLogo';
import { Phone, Mail, MapPin, Shield, CheckCircle, ExternalLink } from 'lucide-react';
import { BULOLO_LLGS, DISTRICT_METADATA } from '@shared/types/geography';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-bulolo-forest text-white pt-14 pb-8 border-t-4 border-bulolo-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/15">
          {/* Brand & Mandate */}
          <div className="space-y-4">
            <BuloloLogo variant="light" showTagline={true} />
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Bulolo Connect is the official digital civic service and community engagement platform of Bulolo District, Morobe Province, Papua New Guinea. Serving Mumeng, Watut, Buang, and Bulolo Urban.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 text-bulolo-gold text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" />
                Civic & Public Service Platform
              </span>
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="text-sm font-bold text-bulolo-gold uppercase tracking-wider mb-4">
              District Services
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100">
              <li>
                <Link href="/services?category=HEALTHCARE" className="hover:text-white transition-colors">
                  Healthcare & Aid Posts
                </Link>
              </li>
              <li>
                <Link href="/services?category=EDUCATION" className="hover:text-white transition-colors">
                  Schools & Technical Training
                </Link>
              </li>
              <li>
                <Link href="/assistance" className="hover:text-white transition-colors">
                  School Fee & Agriculture Assistance
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-white transition-colors">
                  Submit Citizen Issue / Road Report
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">
                  Verified District Development Projects
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-white transition-colors">
                  Official Public Notices & Meetings
                </Link>
              </li>
            </ul>
          </div>

          {/* LLGs */}
          <div>
            <h4 className="text-sm font-bold text-bulolo-gold uppercase tracking-wider mb-4">
              Local Level Governments
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100">
              {BULOLO_LLGS.map(llg => (
                <li key={llg.id}>
                  <Link href={`/community?llg=${encodeURIComponent(llg.name)}`} className="hover:text-white transition-colors flex items-center justify-between">
                    <span>{llg.name}</span>
                    <span className="text-[10px] text-bulolo-gold font-mono">{llg.wardsCount} Wards</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts & Emergency */}
          <div>
            <h4 className="text-sm font-bold text-bulolo-gold uppercase tracking-wider mb-4">
              District Contacts & Emergency
            </h4>
            <ul className="space-y-3 text-xs text-emerald-100">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-bulolo-gold flex-shrink-0 mt-0.5" />
                <span>Bulolo District Administration Civic Centre, Bulolo Town, Morobe Province, PNG</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-bulolo-gold flex-shrink-0" />
                <span>Police Command: {DISTRICT_METADATA.emergencyNumbers.police}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-bulolo-gold flex-shrink-0" />
                <span>District Hospital: {DISTRICT_METADATA.emergencyNumbers.hospital}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-bulolo-gold flex-shrink-0" />
                <span>info@buloloconnect.gov.pg</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Governance Notice */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-emerald-200/80">
          <p>
            &copy; {new Date().getFullYear()} Bulolo Connect. Built for the citizens of Bulolo District, Morobe Province.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy & Data Protection</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Public Service</Link>
            <span>•</span>
            <Link href="/accessibility" className="hover:text-white transition-colors">Low-Bandwidth Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
