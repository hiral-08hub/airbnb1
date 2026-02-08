"use client";

import React, {useEffect,useState,Suspense  } from 'react';
import styled from '@emotion/styled';
import { Check } from 'lucide-react';
import Header from '../Header';
import { useRouter } from 'next/navigation';


// --- Styled Components ---

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
`;

const Subtitle = styled.p`
  color: #717171;
  font-size: 18px;
  margin-bottom: 32px;
`;

const DiscountList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DiscountCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid ${props => props.isSelected ? '#222222' : '#ebebeb'};
  background-color: ${props => props.isSelected ? '#f7f7f7' : '#ffffff'};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: #222222;
  }
`;

const DiscountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const PercentageBox = styled.div`
  font-size: 18px;
  font-weight: 700;
  min-width: 45px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #b0b0b0;
  border-radius: 8px;
  padding: 0 8px;
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const DiscountLabel = styled.span`
  font-size: 18px;
  font-weight: 500;
`;

const DiscountDescription = styled.span`
  font-size: 14px;
  color: #717171;
  margin-top: 4px;
`;

const Checkbox = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid ${props => props.isSelected ? '#222222' : '#b0b0b0'};
  background-color: ${props => props.isSelected ? '#222222' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.2s;
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

// --- Component Logic ---
function Step10Content() {
   const [selectedDiscounts, setSelectedDiscounts] = useState(['newListing']);
   const router = useRouter();
   const [isClient, setIsClient] = useState(false);
useEffect(() => {
    setIsClient(true);
  }, []);
  const discounts = [
    {
      id: 'newListing',
      percentage: '20%',
      label: 'New listing promotion',
      description: 'Offer 20% off your first 3 bookings'
    },
    {
      id: 'lastMinute',
      percentage: '9%',
      label: 'Last-minute discount',
      description: 'For stays booked 14 days or less before arrival'
    },
    {
      id: 'weekly',
      percentage: '10%',
      label: 'Weekly discount',
      description: 'For stays of 7 nights or more'
    }
  ];

  const toggleDiscount = (id) => {
    setSelectedDiscounts(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };
  const handleNext = () => {
    
    const existingData = JSON.parse(localStorage.getItem('propertyData') || '{}');

    
    const updatedData = { 
      ...existingData, 
      discounts: selectedDiscounts 
    };

    
    localStorage.setItem('propertyData', JSON.stringify(updatedData));

   
    router.push('/Host/Step11');
};
if (!isClient) return null;
  return (
    <PageContainer>
      <Header />
      
      <Main>
        <ContentBox>
          <Title>Add discounts</Title>
          <Subtitle>Help your place stand out to get booked faster and earn your first reviews.</Subtitle>

          <DiscountList>
            {discounts.map((discount) => {
              const isSelected = selectedDiscounts.includes(discount.id);
              return (
                <DiscountCard 
                  key={discount.id} 
                  isSelected={isSelected}
                  onClick={() => toggleDiscount(discount.id)}
                >
                  <DiscountInfo>
                    <PercentageBox>{discount.percentage}</PercentageBox>
                    <TextContent>
                      <DiscountLabel>{discount.label}</DiscountLabel>
                      <DiscountDescription>{discount.description}</DiscountDescription>
                    </TextContent>
                  </DiscountInfo>
                  <Checkbox isSelected={isSelected}>
                    {isSelected && <Check size={18} strokeWidth={3} />}
                  </Checkbox>
                </DiscountCard>
              );
            })}
          </DiscountList>
        </ContentBox>
      </Main>

      <Footer>
        <ProgressBarContainer>
          <Progress />
        </ProgressBarContainer>
        <FooterNav>
          <BackLink onClick={() => router.back()}>Back</BackLink>
          <NextButton 
            onClick={() => router.push('/Host/Step11')} 
          >
            Next
          </NextButton>
        </FooterNav>
      </Footer>
    </PageContainer>
  );
}
export default function DiscountPage() {
   return (
        <Suspense fallback={<div>Loading Step 11...</div>}>
          <Step10Content />
        </Suspense>
      );
}