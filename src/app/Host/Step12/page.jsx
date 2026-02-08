"use client";

import React, { useState,Suspense } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { CalendarCheck, Zap } from 'lucide-react';
import Header from '../Header';


// --- Styled Components ---

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 90vh;
  font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  color: #222222;
`;

const Main = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
`;

const ContentBox = styled.div`
  width: 100%;
  max-width: 630px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  color: #717171;
  font-size: 18px;
  margin-bottom: 32px;
  
  a {
    color: #222222;
    text-decoration: underline;
    font-weight: 600;
  }
`;

const OptionCard = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: ${props => props.isSelected ? '2px solid #222222' : '1px solid #ebebeb'};
  background-color: ${props => props.isSelected ? '#f7f7f7' : '#ffffff'};

  &:hover {
    border-color: #222222;
  }
`;

const CardContent = styled.div`
  flex: 1;
  padding-right: 20px;
`;

const OptionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const RecommendedTag = styled.div`
  color: #008489;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const OptionDescription = styled.p`
  font-size: 14px;
  color: #717171;
  line-height: 1.4;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #222222;
`;
const Footer = styled.footer`
  margin-top: auto;
  border-top: 1px solid #ebebeb;
`;

const ProgressBarContainer = styled.div`
  height: 6px;
  background-color: #ebebeb;
`;

const Progress = styled.div`
  width: 75%;
  height: 100%;
  background-color: #222222;
`;

const FooterNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 48px;
  background: white;
`;

const BackLink = styled.button`
  background: none;
  border: none;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  font-size: 16px;
`;

const NextButton = styled.button`
  background-color: #222222;
  color: white;
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  &:hover:not(:disabled) { background-color: #000000; }
`;

// --- Main Component ---
function Step12Content() {
   const [selectedOption, setSelectedOption] = useState('approve');
  const router = useRouter();
  const handleNext = () => {
    // 1. Pehla no badho data upado
    const existingData = JSON.parse(localStorage.getItem('propertyData') || '{}');

    // 2. Aa page nu setting merge karo
    const updatedData = { 
      ...existingData, 
      booking_type: selectedOption // 'approve' athva 'instant' store thase
    };

    // 3. Local storage ma update karo
    localStorage.setItem('propertyData', JSON.stringify(updatedData));

    // 4. Next step par jao
    router.push('/Host/Step13');
};

  return (
    <PageContainer>
      <Header />
      
      <Main>
        <ContentBox>
          <Title>Pick your booking settings</Title>
          <Subtitle>
            You can change this at any time. <a href="#">Learn more</a>
          </Subtitle>

          {/* Option 1: Manual Approval */}
          <OptionCard 
            isSelected={selectedOption === 'approve'} 
            onClick={() => setSelectedOption('approve')}
          >
            <CardContent>
              <OptionTitle>Approve your first 5 bookings</OptionTitle>
              <RecommendedTag>Recommended</RecommendedTag>
              <OptionDescription>
                Start by reviewing reservation requests, then switch to Instant Book so guests can book automatically.
              </OptionDescription>
            </CardContent>
            <IconWrapper>
              <CalendarCheck size={32} strokeWidth={1.5} />
            </IconWrapper>
          </OptionCard>

          {/* Option 2: Instant Book */}
          <OptionCard 
            isSelected={selectedOption === 'instant'} 
            onClick={() => setSelectedOption('instant')}
          >
            <CardContent>
              <OptionTitle>Use Instant Book</OptionTitle>
              <OptionDescription>
                Let guests book automatically.
              </OptionDescription>
            </CardContent>
            <IconWrapper>
              <Zap size={32} strokeWidth={1.5} />
            </IconWrapper>
          </OptionCard>
        </ContentBox>
      </Main>
      <Footer>
        <ProgressBarContainer>
          <Progress />
        </ProgressBarContainer>
        <FooterNav>
          <BackLink onClick={() => router.back()}>Back</BackLink>
          <NextButton 
            onClick={() => router.push('/Host/Step13')} 
          >
            Next
          </NextButton>
        </FooterNav>
      </Footer>

    </PageContainer>
  );
}
export default function BookingSettingsPage() {
  return (
    <Suspense fallback={<div>Loading Step 11...</div>}>
      <Step12Content />
    </Suspense>
  );
}