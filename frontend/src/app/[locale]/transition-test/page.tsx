'use client';

import { Layout } from '@/components/layout/Layout';
import { AnimatedBox, AnimatedButton } from '@/components/ui/AnimatedComponents';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const TestContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Section = styled.section`
  margin-bottom: 3rem;
  
  h2 {
    margin-bottom: 1.5rem;
    color: #1f2937;
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  p {
    color: #6b7280;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TestCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
    font-size: 1.1rem;
  }
  
  p {
    margin: 0;
    color: #6b7280;
    font-size: 0.9rem;
  }
`;

const routes = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    description: 'Fade transition - Main dashboard view',
    transitionType: 'Fade'
  },
  {
    name: 'Inventory',
    path: '/inventory',
    description: 'Slide left transition - Inventory management',
    transitionType: 'Slide Left'
  },
  {
    name: 'Forecasts',
    path: '/forecasts',
    description: 'Slide up transition - Forecast analysis',
    transitionType: 'Slide Up'
  },
  {
    name: 'Animation Test',
    path: '/animation-test',
    description: 'Scale transition - Animation showcase',
    transitionType: 'Scale'
  }
];

export default function TransitionTestPage() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Layout>
      <TestContainer>
        <AnimatedBox variant="fade">
          <h1 style={{ marginBottom: '2rem', color: '#1f2937', fontSize: '2rem' }}>
            🚀 Page Transition Test Lab
          </h1>
        </AnimatedBox>

        <Section>
          <AnimatedBox variant="slideUp" delay={0.2}>
            <h2>Route-Based Transitions</h2>
            <p>
              Each route in the application uses a different transition type to provide 
              visual context and smooth navigation. Click the buttons below to test each transition.
            </p>
          </AnimatedBox>
          
          <ButtonGrid>
            {routes.map((route, index) => (
              <AnimatedBox key={route.path} variant="slideUp" delay={0.3 + index * 0.1}>
                <TestCard>
                  <h3>{route.name}</h3>
                  <p>{route.description}</p>
                  <div style={{ marginTop: '1rem' }}>
                    <AnimatedButton 
                      onClick={() => handleNavigation(route.path)}
                      variant="primary"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        fontSize: '0.875rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Go to {route.name} →
                    </AnimatedButton>
                  </div>
                  <small style={{ color: '#9ca3af', marginTop: '0.5rem', display: 'block' }}>
                    Transition: {route.transitionType}
                  </small>
                </TestCard>
              </AnimatedBox>
            ))}
          </ButtonGrid>
        </Section>

        <Section>
          <AnimatedBox variant="slideUp" delay={0.7}>
            <h2>Transition Features</h2>
          </AnimatedBox>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <AnimatedBox variant="slideLeft" delay={0.8}>
              <TestCard>
                <h3>🎬 Smooth Animations</h3>
                <p>All transitions respect user motion preferences and accessibility settings.</p>
              </TestCard>
            </AnimatedBox>
            
            <AnimatedBox variant="scale" delay={0.9}>
              <TestCard>
                <h3>⚡ Loading States</h3>
                <p>Visual loading bar at the top indicates route changes in progress.</p>
              </TestCard>
            </AnimatedBox>
            
            <AnimatedBox variant="fade" delay={1.0}>
              <TestCard>
                <h3>🎯 Route-Specific</h3>
                <p>Different transition types provide visual context for different sections.</p>
              </TestCard>
            </AnimatedBox>
          </div>
        </Section>

        <AnimatedBox variant="slideUp" delay={1.1}>
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            background: '#f0fdf4', 
            borderRadius: '8px',
            border: '1px solid #22c55e',
            marginTop: '2rem'
          }}>
            <h2 style={{ color: '#166534', marginBottom: '1rem' }}>
              🎉 Page Transitions Complete!
            </h2>
            <p style={{ color: '#15803d', margin: 0 }}>
              Route transitions are now active. Navigate between pages to see the smooth animations.
            </p>
          </div>
        </AnimatedBox>
      </TestContainer>
    </Layout>
  );
}