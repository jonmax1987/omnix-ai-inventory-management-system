'use client'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles } from '@/styles/globals'
import { theme } from '@/styles/theme'
import { AnimationProvider } from '@/context/AnimationContext'
import { NextIntlClientProvider } from 'next-intl'

interface ClientProvidersProps {
  children: React.ReactNode
  locale: string
  messages: any
}

export function ClientProviders({ children, locale, messages }: ClientProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AnimationProvider>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          {children}
        </ThemeProvider>
      </AnimationProvider>
    </NextIntlClientProvider>
  )
}