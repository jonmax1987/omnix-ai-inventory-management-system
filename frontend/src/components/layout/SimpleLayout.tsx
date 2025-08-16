'use client'
import styled from 'styled-components'
import { useState } from 'react'
import { FiMenu, FiX, FiHome, FiPackage, FiTrendingUp, FiBell } from 'react-icons/fi'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'

const LayoutContainer = styled.div<{ $isRTL: boolean }>`
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
  direction: ${({ $isRTL }) => $isRTL ? 'rtl' : 'ltr'};
  text-align: ${({ $isRTL }) => $isRTL ? 'right' : 'left'};
`

const Sidebar = styled.aside<{ $isOpen: boolean; $isRTL: boolean }>`
  position: fixed;
  top: 0;
  ${({ $isRTL }) => $isRTL ? 'right: 0;' : 'left: 0;'}
  height: 100vh;
  width: 280px;
  background-color: white;
  ${({ $isRTL }) => $isRTL ? 'border-left' : 'border-right'}: 1px solid #e5e7eb;
  z-index: 20;
  ${({ $isOpen, $isRTL }) => `transform: translateX(${$isOpen ? '0' : ($isRTL ? '100%' : '-100%')});`}
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

const MainContent = styled.main<{ $sidebarOpen: boolean; $isRTL: boolean }>`
  flex: 1;
  margin-left: 0;
  margin-right: 0;
  
  @media (min-width: 1024px) {
    ${({ $isRTL }) => $isRTL ? 'margin-right: 280px; margin-left: 0;' : 'margin-left: 280px; margin-right: 0;'}
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

interface LayoutProps {
  children: React.ReactNode
}

export const SimpleLayout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const params = useParams()
  const locale = params?.locale as string || 'en'
  const isRTL = locale === 'he'

  // Simple navigation without i18n
  const navigation = [
    { 
      name: isRTL ? 'לוח בקרה' : 'Dashboard', 
      href: `/${locale}/dashboard`, 
      icon: FiHome 
    },
    { 
      name: isRTL ? 'מלאי' : 'Inventory', 
      href: `/${locale}/inventory`, 
      icon: FiPackage 
    },
    { 
      name: isRTL ? 'תחזיות' : 'Forecasts', 
      href: `/${locale}/forecasts`, 
      icon: FiTrendingUp 
    },
    { 
      name: isRTL ? 'התראות' : 'Alerts', 
      href: `/${locale}/alerts`, 
      icon: FiBell 
    },
  ]

  return (
    <LayoutContainer $isRTL={isRTL}>
      <Overlay 
        $isVisible={sidebarOpen} 
        onClick={() => setSidebarOpen(false)} 
        aria-hidden="true"
      />
      
      <Sidebar $isOpen={sidebarOpen} $isRTL={isRTL} role="navigation" aria-label="Main navigation">
        <SidebarHeader>
          <h1>OMNIX AI</h1>
        </SidebarHeader>
        
        <Navigation>
          {navigation.map((item) => (
            <NavItem key={item.name} $isActive={pathname === item.href}>
              <Link href={item.href} onClick={() => setSidebarOpen(false)}>
                <item.icon size={20} aria-hidden="true" />
                {item.name}
              </Link>
            </NavItem>
          ))}
        </Navigation>
      </Sidebar>

      <MainContent $sidebarOpen={sidebarOpen} $isRTL={isRTL}>
        <Header>
          <MobileMenuButton
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </MobileMenuButton>
          
          <div>
            <span style={{ marginRight: '10px' }}>
              {isRTL ? 'שפה:' : 'Language:'}
            </span>
            <a href="/en/dashboard" style={{ marginRight: '10px', color: '#3b82f6' }}>EN</a>
            <a href="/he/dashboard" style={{ color: '#3b82f6' }}>עב</a>
          </div>
        </Header>
        
        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  )
}