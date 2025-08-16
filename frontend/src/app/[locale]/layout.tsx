import { getMessages } from 'next-intl/server';
import { Inter, Noto_Sans_Hebrew } from 'next/font/google';
import { isRtlLocale } from '@/i18n/config';
import { ClientProviders } from '@/components/providers/ClientProviders';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const notoSansHebrew = Noto_Sans_Hebrew({
  variable: '--font-hebrew',
  subsets: ['hebrew'],
  display: 'swap',
});

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();
  const isRTL = isRtlLocale(locale);
  const fontClass = isRTL 
    ? `${inter.variable} ${notoSansHebrew.variable} font-hebrew`
    : `${inter.variable} font-inter`;

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <head>
        <title>OMNIX AI - Inventory Management</title>
        <meta name="description" content="AI-powered inventory management system" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${fontClass} antialiased`}>
        <ClientProviders locale={locale} messages={messages}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}