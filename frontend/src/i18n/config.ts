export const locales = ['en', 'he'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  he: 'עברית',
};

export const rtlLocales: Locale[] = ['he'];

export function isRtlLocale(locale: string): boolean {
  return rtlLocales.includes(locale as Locale);
}