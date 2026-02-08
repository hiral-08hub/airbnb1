"use client";

import React, { useState,Suspense } from 'react';
import styled from '@emotion/styled';
import { Minus, Plus } from 'lucide-react';
import Header from '../Header';
import { useRouter } from 'next/navigation';
// --- Styled Components ---

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #222222;
`;


const GhostButton = styled.button`
  background: white;
  border: 1px solid #dddddd;
  border-radius: 30px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: #f7f7f7;
    border-color: #000000;
  }
`;

const Main = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
`;

const ContentBox = styled.div`
  width: 100%;
  max-width: 630px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #717171;
  font-size: 18px;
  margin-bottom: 32px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  border-bottom: 1px solid #ebebeb;
`;

const RowLabel = styled.span`
  font-size: 18px;
  color: #222222;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const CircleButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${(props) => (props.disabled ? '#ebebeb' : '#b0b0b0')};
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  color: ${(props) => (props.disabled ? '#ebebeb' : '#717171')};
  transition: border-color 0.2s;

  &:hover:not(:disabled) {
    border-color: #222222;
    color: #222222;
  }
`;

const Value = styled.span`
  width: 20px;
  text-align: center;
  font-size: 16px;
`;



const ProgressBarContainer = styled.div`
  height: 6px;
  background-color: #ebebeb;
  display: flex;
`;

const Progress = styled.div`
  width: 33%;
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


const Footer = styled.footer`
  border-top: 1px solid #eee;
  padding: 15px 40px;
  background: white; /* આ ઉમેરો */
  z-index: 100;      /* આ ઉમેરો */
  
  .progress-container {
    display: flex;
    gap: 8px;
    margin-bottom: 15px;
  }
  .controls { display: flex; justify-content: space-between; align-items: center; }
`;
const ProgressLine = styled.div`
  height: 6px;
  flex: 1;
  background: ${props => props.active ? '#222' : '#eee'};
  border-radius: 3px;
`;

const BlackBtn = styled.button`
  background: #222;
  color: white;
  padding: 12px 30px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  &:disabled { background: #ddd; cursor: not-allowed; }
`;

// --- Main Component ---

const CounterRow = ({ label, value, onUpdate }) => (
  <Row>
    <RowLabel>{label}</RowLabel>
    <Controls>
      <CircleButton onClick={() => onUpdate(-1)} disabled={value === 0}>
        <Minus size={16} />
      </CircleButton>
      <Value>{value}</Value>
      <CircleButton onClick={() => onUpdate(1)}>
        <Plus size={16} />
      </CircleButton>
    </Controls>
  </Row>
);
function Step6Content() {
  const [counts, setCounts] = useState({
    Guests: 4,
    Bedrooms: 1,
    Beds: 1,
    Bathrooms: 1,
  });
   const router = useRouter();

  const handleUpdate = (field, delta) => {
    setCounts((prev) => ({
      ...prev,
      [field]: Math.max(0, prev[field] + delta),
    }));
  };
  const handleNext = () => {
   
    const existingData = JSON.parse(localStorage.getItem('propertyData') || '{}');

    
    const updatedData = { 
      ...existingData, 
      guests_count: counts.Guests,
      bedrooms_count: counts.Bedrooms,
      beds_count: counts.Beds,
      bathrooms_count: counts.Bathrooms
    };

    // 3. Local storage ma save karo
    localStorage.setItem('propertyData', JSON.stringify(updatedData));

    // 4. Next page par jao
    router.push('/Host/Step14');
  };

  return (
    <PageContainer>
         <Header />
      <Main>
        <ContentBox>
          <Title>Share some basics about your place</Title>
          <Subtitle>You'll add more details later, such as bed types.</Subtitle>

          {Object.entries(counts).map(([label, value]) => (
            <CounterRow
              key={label}
              label={label}
              value={value}
              onUpdate={(delta) => handleUpdate(label, delta)}
            />
          ))}
        </ContentBox>
      </Main>

       <Footer>
        <div className="progress-container">
          <ProgressLine active />
          <ProgressLine active />
          <ProgressLine active />
          <ProgressLine active />
        </div>
        <div className="controls">
          <button 
            style={{ background: 'none', border: 'none', textDecoration: 'underline', fontWeight: '600', cursor: 'pointer' }}
            onClick={() => router.back()}
          >
            Back
          </button>
          <BlackBtn onClick={handleNext}>Next</BlackBtn>
        </div>
      </Footer>
    </PageContainer>
  );
}
export default function BasicsPage() {
  return (
               <Suspense fallback={<div>Loading Step 11...</div>}>
                 <Step6Content />
               </Suspense>
             );
}