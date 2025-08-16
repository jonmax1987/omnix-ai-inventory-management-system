'use client'
import styled from 'styled-components'
import { useState } from 'react'
import { FiMenu, FiX, FiHome, FiPackage, FiTrendingUp, FiBell, FiZap } from 'react-icons/fi'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { LoadingBar } from './LoadingBar'
import { RouteTransition } from './RouteTransition'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'
import { rtlMixin, marginMixin, borderMixin, transformMixin } from '../../utils/rtl'

const LayoutContainer = styled.div<{ $isRTL: boolean }>`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray[50]};
  ${rtlMixin}
`

const Sidebar = styled.aside<{ $isOpen: boolean; $isRTL: boolean }>`
  position: fixed;
  top: 0;
  ${({ $isRTL }) => $isRTL ? 'right: 0;' : 'left: 0;'}
  height: 100vh;
  width: 280px;
  background-color: white;
  ${({ $isRTL }) => $isRTL ? 'border-left' : 'border-right'}: 1px solid ${({ theme }) => theme.colors.gray[200]};
  z-index: 20;
  ${({ $isOpen, $isRTL }) => `transform: translateX(${$isOpen ? '0' : ($isRTL ? '100%' : '-100%')});`}
  transition: transform 0.3s ease-in-out;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    position: static;
    transform: translateX(0);
  }
`

const SidebarHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  
  h1 {
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary[600]};
    margin: 0;
  }
`

const Navigation = styled.nav`
  padding: ${({ theme }) => theme.spacing.md} 0;
`

const NavItem = styled.div<{ $isActive: boolean }>`
  margin: 0 ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  a {
    display: flex;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    color: ${({ $isActive, theme }) => 
      $isActive ? theme.colors.primary[600] : theme.colors.gray[600]};
    background-color: ${({ $isActive, theme }) => 
      $isActive ? theme.colors.primary[50] : 'transparent'};
    text-decoration: none;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    transition: all 0.2s ease-in-out;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray[100]};
      color: ${({ theme }) => theme.colors.gray[900]};
    }
    
    svg {
      margin-right: ${({ theme }) => theme.spacing.sm};
      flex-shrink: 0;
    }
  }
`

const MainContent = styled.main<{ $sidebarOpen: boolean; $isRTL: boolean }>`
  flex: 1;
  margin-left: 0;
  margin-right: 0;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    ${({ $isRTL }) => $isRTL ? 'margin-right: 280px; margin-left: 0;' : 'margin-left: 280px; margin-right: 0;'}
  }
`

const Header = styled.header`
  background-color: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
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
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray[600]};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.gray[900]};
  }
`

const ContentArea = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
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
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'Inventory', href: '/inventory', icon: FiPackage },
  { name: 'Forecasts', href: '/forecasts', icon: FiTrendingUp },
  { name: 'Alerts', href: '/alerts', icon: FiBell },
  { name: 'Transitions', href: '/transition-test', icon: FiZap },
]

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('nav')
  const isRTL = locale === 'he'

  const localizedNavigation = [
    { name: t('dashboard'), href: '/dashboard', icon: FiHome },
    { name: t('inventory'), href: '/inventory', icon: FiPackage },
    { name: t('forecasts'), href: '/forecasts', icon: FiTrendingUp },
    { name: t('notifications'), href: '/alerts', icon: FiBell },
    { name: 'Transitions', href: '/transition-test', icon: FiZap },
  ]

  return (
    <LayoutContainer $isRTL={isRTL} dir={isRTL ? 'rtl' : 'ltr'}>
      <LoadingBar />      
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
          {localizedNavigation.map((item) => (
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
          <LanguageSwitcher />
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              Inventory Management
            </h2>
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