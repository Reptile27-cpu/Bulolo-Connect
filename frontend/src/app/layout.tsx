import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import { AuthProvider } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'BULOLO CONNECT — District Digital Services Platform',
  description: 'Official digital civic services, assistance applications, community information, and development project tracking for Bulolo District, Morobe Province, Papua New Guinea.',
  keywords: 'Bulolo, Morobe Province, Papua New Guinea, Mumeng, Watut, Buang, Bulolo Urban, District Services, Public Assistance, School Fees',
  manifest: '/manifest.json',
  themeColor: '#1b4332'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-bulolo-surface font-sans text-bulolo-charcoal antialiased">
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
