'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Globe,
  User,
  ShieldCheck,
  FileText,
  AlertCircle,
  HelpCircle,
  FolderKanban,
  Building2,
  Bell,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { BuloloLogo } from '../ui/BuloloLogo';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, logout, isCitizen, isAdmin, isStaff, isMpOffice } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/services', label: t('nav.services') },
    { href: '/assistance', label: t('nav.assistance') },
    { href: '/report', label: t('nav.report') },
    { href: '/community', label: t('nav.community') },
    { href: '/projects', label: t('nav.projects') },
    { href: '/announcements', label: t('nav.announcements') }
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'tpi' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-bulolo-border shadow-xs">
      {/* Top emergency and district bar */}
      <div className="bg-bulolo-forest text-white text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-bulolo-lightgreen font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Morobe Province, Papua New Guinea
          </span>
          <span className="hidden md:inline text-white/50">|</span>
          <span className="hidden md:inline text-white/80">
            Emergency Hotline: <strong className="text-white">+675 474 5222</strong>
          </span>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors text-xs font-medium"
            title="Switch Language / Senisim Tok Ples"
          >
            <Globe className="w-3.5 h-3.5 text-bulolo-gold" />
            <span>{language === 'en' ? 'Tok Pisin' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <BuloloLogo showTagline={true} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-bulolo-forest bg-bulolo-lightgreen/50 font-semibold'
                      : 'text-bulolo-charcoal hover:text-bulolo-emerald hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User actions */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-bulolo-border hover:border-bulolo-forest bg-white text-sm font-medium transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-bulolo-lightgreen text-bulolo-forest flex items-center justify-center font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-bulolo-charcoal leading-tight max-w-[120px] truncate">
                      {user.fullName}
                    </p>
                    <p className="text-[10px] text-bulolo-muted uppercase">{user.role.replace('_', ' ')}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-bulolo-muted" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-bulolo-border py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-bulolo-muted font-medium">Account ID</p>
                      <p className="text-xs font-bold text-bulolo-forest">{user.accountId}</p>
                    </div>

                    {isCitizen && (
                      <Link
                        href="/portal/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-slate-50"
                      >
                        <User className="w-4 h-4 text-bulolo-forest" />
                        Citizen Dashboard
                      </Link>
                    )}

                    {isStaff && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-slate-50"
                      >
                        <ShieldCheck className="w-4 h-4 text-bulolo-emerald" />
                        District Administration
                      </Link>
                    )}

                    {isMpOffice && (
                      <Link
                        href="/admin/mp-office"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-slate-50"
                      >
                        <Building2 className="w-4 h-4 text-bulolo-darkgold" />
                        MP&apos;s Office Oversight
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-sm font-medium text-bulolo-forest hover:text-bulolo-emerald transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-bulolo-forest text-white hover:bg-bulolo-emerald shadow-xs transition-colors"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-bulolo-charcoal hover:bg-gray-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-bulolo-border px-4 pt-2 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-bulolo-charcoal hover:bg-bulolo-lightgreen/40 hover:text-bulolo-forest"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            {user ? (
              <>
                <div className="px-3 py-1">
                  <p className="text-xs text-bulolo-muted">Signed in as</p>
                  <p className="text-sm font-bold text-bulolo-forest">{user.fullName}</p>
                </div>
                {isCitizen && (
                  <Link
                    href="/portal/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg bg-bulolo-lightgreen text-bulolo-forest font-semibold"
                  >
                    Citizen Dashboard
                  </Link>
                )}
                {isStaff && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 font-semibold"
                  >
                    District Administration Portal
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 font-medium"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold rounded-lg border border-bulolo-forest text-bulolo-forest"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold rounded-lg bg-bulolo-forest text-white"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
