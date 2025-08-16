'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { AnimatedBox, AnimatedButton, AnimatedCard, AnimatedList, AnimatedSkeleton } from '@/components/ui/AnimatedComponents';
import { useAnimation } from '@/context/AnimationContext';
import { useAnimatedValue } from '@/hooks/useAnimatedValue';

const TestContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Inter, sans-serif;
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
    margin-bottom: 1rem;
  }
`;

const TestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TestCard = styled(AnimatedCard)`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const ControlPanel = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  h3 {
    margin-bottom: 1rem;
    color: #1f2937;
  }
  
  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    
    input {
      margin: 0;
    }
  }
`;

const CounterDisplay = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #059669;
  text-align: center;
  margin: 1rem 0;
`;

export default function AnimationTestPage() {
  const { isAnimationEnabled, prefersReducedMotion, toggleAnimations } = useAnimation();
  const [counter, setCounter] = useState(0);
  const [showSkeletons, setShowSkeletons] = useState(false);
  const animatedCounter = useAnimatedValue(counter, 1000);

  const listItems = [
    'First animated item',
    'Second animated item', 
    'Third animated item',
    'Fourth animated item',
    'Fifth animated item'
  ];

  return (
    <TestContainer>
      <AnimatedBox variant="fade">
        <h1 style={{ marginBottom: '2rem', color: '#1f2937', fontSize: '2rem' }}>
          🎬 OMNIX AI Animation Test Lab
        </h1>
      </AnimatedBox>

      <ControlPanel>
        <h3>Animation Settings</h3>
        <label>
          <input 
            type="checkbox" 
            checked={isAnimationEnabled}
            onChange={toggleAnimations}
          />
          Enable Animations
        </label>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
          System prefers reduced motion: <strong>{prefersReducedMotion ? 'Yes' : 'No'}</strong>
        </p>
      </ControlPanel>

      <Section>
        <AnimatedBox variant="slideUp" delay={0.2}>
          <h2>🎭 Animation Variants</h2>
          <p>Different entrance animations for components</p>
        </AnimatedBox>
        
        <TestGrid>
          <AnimatedBox variant="fade" delay={0.3}>
            <TestCard hoverable={false}>
              <h3>Fade In</h3>
              <p>Simple opacity transition</p>
            </TestCard>
          </AnimatedBox>
          
          <AnimatedBox variant="slideUp" delay={0.4}>
            <TestCard hoverable={false}>
              <h3>Slide Up</h3>
              <p>Slides in from bottom</p>
            </TestCard>
          </AnimatedBox>
          
          <AnimatedBox variant="slideLeft" delay={0.5}>
            <TestCard hoverable={false}>
              <h3>Slide Left</h3>
              <p>Slides in from right</p>
            </TestCard>
          </AnimatedBox>
          
          <AnimatedBox variant="scale" delay={0.6}>
            <TestCard hoverable={false}>
              <h3>Scale</h3>
              <p>Scales in from center</p>
            </TestCard>
          </AnimatedBox>
        </TestGrid>
      </Section>

      <Section>
        <AnimatedBox variant="slideUp" delay={0.7}>
          <h2>🎯 Interactive Elements</h2>
          <p>Buttons and cards with micro-interactions</p>
        </AnimatedBox>
        
        <ButtonGroup>
          <AnimatedButton variant="primary">
            Primary Button
          </AnimatedButton>
          <AnimatedButton variant="secondary">
            Secondary Button  
          </AnimatedButton>
          <AnimatedButton variant="ghost">
            Ghost Button
          </AnimatedButton>
          <AnimatedButton loading>
            Loading Button
          </AnimatedButton>
        </ButtonGroup>

        <TestGrid>
          <TestCard clickable onClick={() => alert('Card clicked!')}>
            <h3>Hoverable Card</h3>
            <p>Hover to see lift effect. Click me!</p>
          </TestCard>
          
          <TestCard>
            <h3>Another Card</h3>
            <p>This card also has hover animations</p>
          </TestCard>
        </TestGrid>
      </Section>

      <Section>
        <AnimatedBox variant="slideUp" delay={0.8}>
          <h2>🔢 Animated Counter</h2>
          <p>Numbers animate smoothly to their target values</p>
        </AnimatedBox>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <CounterDisplay>
            {Math.round(animatedCounter)}
          </CounterDisplay>
          <ButtonGroup style={{ justifyContent: 'center' }}>
            <AnimatedButton onClick={() => setCounter(c => c + 100)}>
              +100
            </AnimatedButton>
            <AnimatedButton onClick={() => setCounter(c => Math.max(0, c - 100))}>
              -100
            </AnimatedButton>
            <AnimatedButton onClick={() => setCounter(Math.floor(Math.random() * 10000))}>
              Random
            </AnimatedButton>
            <AnimatedButton onClick={() => setCounter(0)}>
              Reset
            </AnimatedButton>
          </ButtonGroup>
        </div>
      </Section>

      <Section>
        <AnimatedBox variant="slideUp" delay={0.9}>
          <h2>📋 Staggered List Animation</h2>
          <p>List items animate in sequence</p>
        </AnimatedBox>
        
        <AnimatedList staggerDelay={0.1}>
          {listItems.map((item, index) => (
            <TestCard key={index}>
              <h3>Item {index + 1}</h3>
              <p>{item}</p>
            </TestCard>
          ))}
        </AnimatedList>
      </Section>

      <Section>
        <AnimatedBox variant="slideUp" delay={1.0}>
          <h2>⏳ Loading States</h2>
          <p>Skeleton screens and loading animations</p>
        </AnimatedBox>
        
        <div style={{ marginBottom: '1rem' }}>
          <AnimatedButton onClick={() => setShowSkeletons(!showSkeletons)}>
            {showSkeletons ? 'Hide' : 'Show'} Skeletons
          </AnimatedButton>
        </div>
        
        {showSkeletons && (
          <TestGrid>
            <TestCard hoverable={false}>
              <AnimatedSkeleton height={24} style={{ marginBottom: '0.5rem' }} />
              <AnimatedSkeleton height={16} width="80%" style={{ marginBottom: '0.5rem' }} />
              <AnimatedSkeleton height={16} width="60%" />
            </TestCard>
            <TestCard hoverable={false}>
              <AnimatedSkeleton height={24} style={{ marginBottom: '0.5rem' }} />
              <AnimatedSkeleton height={16} width="70%" style={{ marginBottom: '0.5rem' }} />
              <AnimatedSkeleton height={16} width="90%" />
            </TestCard>
          </TestGrid>
        )}
      </Section>

      <AnimatedBox variant="fade" delay={1.1}>
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          background: '#f0f9ff', 
          borderRadius: '8px',
          border: '1px solid #0ea5e9'
        }}>
          <h2 style={{ color: '#0c4a6e', marginBottom: '1rem' }}>
            🎉 Animation System Ready!
          </h2>
          <p style={{ color: '#075985' }}>
            Core animation setup is complete. All components now support smooth, accessible animations.
          </p>
        </div>
      </AnimatedBox>
    </TestContainer>
  );
}