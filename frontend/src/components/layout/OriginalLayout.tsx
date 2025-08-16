'use client'
import React from 'react'
import styled from 'styled-components'
import { useState } from 'react'
import { FiMenu, FiX, FiHome, FiPackage, FiTrendingUp, FiBell } from 'react-icons/fi'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LoadingBar } from './LoadingBar'
import { RouteTransition } from './RouteTransition'

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
`

const Sidebar = styled.aside<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  z-index: 20;
  transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
  transition: transform 0.3s ease-in-out;

  @media (min-width: 1024px) {
    position: static;
    transform: translateX(0);
  }
`

const SidebarHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  
  h1 {
    font-size: 20px;
    font-weight: 700;
    color: #2563eb;
    margin: 0;
  }
`

const Navigation = styled.nav`
  padding: 16px 0;
`

const NavItem = styled.div<{ $isActive: boolean }>`
  padding: 12px 24px;
  margin: 0 16px;
  border-radius: 8px;
  transition: background-color 0.2s;
  background-color: ${({ $isActive }) => $isActive ? '#dbeafe' : 'transparent'};
  
  &:hover {
    background-color: #f3f4f6;
  }
  
  a {
    display: flex;
    align-items: center;
    gap: 12px;
    color: ${({ $isActive }) => $isActive ? '#2563eb' : '#374151'};
    font-weight: ${({ $isActive }) => $isActive ? 500 : 400};
    text-decoration: none;
    
    svg {
      flex-shrink: 0;
    }
  }
`

const MainContent = styled.main`
  flex: 1;
  margin-left: 0;
  
  @media (min-width: 1024px) {
    margin-left: 280px;
  }
`

const Header = styled.header`
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
  position: sticky;
  top: 0;
  z-index: 10;
  
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const MobileMenuButton = styled.button`
  display: block;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #6b7280;
  
  @media (min-width: 1024px) {
    display: none;
  }
  
  &:hover {
    color: #111827;
  }
`

const ContentArea = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`

const Overlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  display: ${({ $isVisible }) => ($isVisible ? 'block' : 'none')};
  
  @media (min-width: 1024px) {
    display: none;
  }
`

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'Inventory', href: '/inventory', icon: FiPackage },
  { name: 'Forecasts', href: '/forecasts', icon: FiTrendingUp },
  { name: 'Alerts', href: '/alerts', icon: FiBell },
]

interface LayoutProps {
  children: React.ReactNode
}

export const OriginalLayout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('en')
  const pathname = usePathname()
  
  // Initialize language state on client side and from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('omnix-language') || 'en'
      const docLang = document.documentElement.lang || 'en'
      
      // Use saved language if different from document
      if (savedLang !== docLang) {
        document.documentElement.lang = savedLang
        document.documentElement.dir = savedLang === 'he' ? 'rtl' : 'ltr'
        if (savedLang === 'he') {
          document.body.classList.add('font-hebrew')
          document.body.style.fontFamily = '"Noto Sans Hebrew", system-ui, -apple-system, sans-serif'
        } else {
          document.body.classList.remove('font-hebrew')
          document.body.style.fontFamily = ''
        }
      }
      
      setCurrentLang(savedLang)
    }
  }, [])

  // Simple translation function
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      'en': {
        'dashboard': 'Dashboard',
        'inventory': 'Inventory',
        'forecasts': 'Forecasts',
        'alerts': 'Alerts',
        'language': 'English'
      },
      'he': {
        'dashboard': 'לוח בקרה',
        'inventory': 'מלאי',
        'forecasts': 'תחזיות',
        'alerts': 'התראות',
        'language': 'עברית'
      }
    }
    return translations[currentLang]?.[key] || key
  }

  const translatedNavigation = [
    { name: t('dashboard'), href: '/dashboard', icon: FiHome },
    { name: t('inventory'), href: '/inventory', icon: FiPackage },
    { name: t('forecasts'), href: '/forecasts', icon: FiTrendingUp },
    { name: t('alerts'), href: '/alerts', icon: FiBell },
  ]

  return (
    <LayoutContainer>
      <LoadingBar />      
      <Overlay 
        $isVisible={sidebarOpen} 
        onClick={() => setSidebarOpen(false)} 
        aria-hidden="true"
      />
      
      <Sidebar $isOpen={sidebarOpen} role="navigation" aria-label="Main navigation">
        <SidebarHeader>
          <h1>OMNIX AI</h1>
        </SidebarHeader>
        
        <Navigation>
          {translatedNavigation.map((item) => (
            <NavItem key={item.name} $isActive={pathname === item.href}>
              <Link href={item.href} onClick={() => setSidebarOpen(false)}>
                <item.icon size={20} aria-hidden="true" />
                {item.name}
              </Link>
            </NavItem>
          ))}
        </Navigation>
      </Sidebar>

      <MainContent>
        <Header>
          <MobileMenuButton
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </MobileMenuButton>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => {
                const newLang = currentLang === 'he' ? 'en' : 'he';
                if (typeof window !== 'undefined') {
                  // Save to localStorage first
                  localStorage.setItem('omnix-language', newLang);
                  
                  document.documentElement.lang = newLang;
                  document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr';
                  // Toggle Hebrew font class
                  if (newLang === 'he') {
                    document.body.classList.add('font-hebrew');
                    document.body.style.fontFamily = '"Noto Sans Hebrew", system-ui, -apple-system, sans-serif';
                  } else {
                    document.body.classList.remove('font-hebrew');
                    document.body.style.fontFamily = '';
                  }
                  setCurrentLang(newLang);
                  // Force re-render
                  window.location.reload();
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                color: '#374151',
                transition: 'all 0.2s'
              }}
            >
              🌐 {t('language')}
            </button>
          </div>
        </Header>
        
        <ContentArea>
          <RouteTransition>
            {children}
          </RouteTransition>
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  )
}