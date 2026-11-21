'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { DISTRICT_METADATA } from '@shared/types/geography';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-bold text-bulolo-gold uppercase tracking-wider">
          District Offices & Contacts
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-bulolo-charcoal tracking-tight">
          Contact Bulolo District Office
        </h1>
        <p className="text-xs sm:text-sm text-bulolo-muted leading-relaxed">
          Reach the administrative officers, parliamentary electorate desk, or emergency response services in Bulolo District.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-bulolo-border space-y-4">
            <h3 className="text-base font-bold text-bulolo-charcoal">Main Civic Administration</h3>
            <div className="space-y-3 text-xs text-bulolo-charcoal">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-bulolo-forest flex-shrink-0 mt-0.5" />
                <span>Bulolo District Administration Civic Centre, Bulolo Town, Morobe Province</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-bulolo-forest flex-shrink-0" />
                <span>Office: +675 474 5000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-bulolo-forest flex-shrink-0" />
                <span>info@buloloconnect.gov.pg</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-bulolo-forest flex-shrink-0" />
                <span>Monday - Friday: 8:00 AM - 4:06 PM (PNG Standard Time)</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-red-200 space-y-4">
            <h3 className="text-base font-bold text-red-700">Emergency Response Lines</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-bulolo-muted">Bulolo Police Station:</span>
                <strong className="text-red-700 font-bold">{DISTRICT_METADATA.emergencyNumbers.police}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-bulolo-muted">District Hospital Triage:</span>
                <strong className="text-red-700 font-bold">{DISTRICT_METADATA.emergencyNumbers.hospital}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* General Feedback Form */}
        <div className="p-8 rounded-3xl bg-white border border-bulolo-border shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-bulolo-charcoal">Send Feedback or General Inquiries</h3>
          <p className="text-xs text-bulolo-muted">
            For specific infrastructure issues, please use the &quot;Report an Issue&quot; page to receive a formal tracking reference number.
          </p>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <p className="text-sm font-bold text-emerald-900">Message Received</p>
              <p className="text-xs text-emerald-700">Thank you for your feedback. An administrative officer will review your message.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-bulolo-border"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Contact Phone or Email</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-bulolo-border"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-bulolo-charcoal mb-1">Message / Inquiry</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-bulolo-border"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-bulolo-forest hover:bg-bulolo-emerald text-white text-xs font-bold transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
