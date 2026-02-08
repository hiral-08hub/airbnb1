"use client";

import React, { useState,useEffect,Suspense } from 'react';
import styled from '@emotion/styled';
import { Pencil } from 'lucide-react';
import Header from '../Header';
import { useRouter } from 'next/navigation';

// --- Styled Components ---
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; /* આખી સ્ક્રીનની ઊંચાઈ */
  overflow: hidden; /* પેજને બહારથી સ્ક્રોલ થતું રોકવા માટે */
`;

const MainContent = styled.main`
  flex: 1; /* હેડર અને ફૂટર વચ્ચેની બધી જગ્યા રોકશે */
  overflow-y: auto; /* જો કન્ટેન્ટ વધી જાય તો અંદર સ્ક્રોલબાર આવશે */
  display: flex;
  flex-direction: column;
  align-items: center; /* કન્ટેન્ટને આડું (horizontal) સેન્ટર કરવા માટે */
  padding-top: 0px; /* હેડરથી થોડી જગ્યા રાખવા માટે */
`;
const PricingContainer = styled.div`
  width: 100%;
  max-width: 630px;
  display: flex;
  flex-direction: column;
  gap: 48px;
  margin: 0 auto; /* આ લાઇન ઉમેરવાથી તે આખા પેજની વચ્ચે આવશે */
  padding: 40px 20px; /* થોડું પેડિંગ આપવાથી મોબાઇલમાં સારું દેખાશે */
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Tip = styled.p`
  color: #717171;
  font-size: 18px;
  margin-bottom: 32px;
`;

const PriceDisplayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
`;

const MainPriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
`;

const CurrencySymbol = styled.span`
  font-size: 80px;
  font-weight: 800;
`;

const PriceInput = styled.input`
  font-size: 100px;
  font-weight: 800;
  border: none;
  outline: none;
  width: auto;
  max-width: 450px;
  padding: 0;
  text-align: center;
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const EditIconCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #b0b0b0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #222222;
  cursor: pointer;
`;

const ErrorMessage = styled.div`
  color: #c13515;
  font-size: 14px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
`;

const GuestPriceInfo = styled.div`
  font-size: 18px;
  color: #222222;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  text-decoration: underline;
`;

const SliderSection = styled.div`
  border-top: 1px solid #ebebeb;
  padding-top: 32px;
  margin-top: 12px;
`;

const SliderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const SliderValueBox = styled.div`
  border: 1px solid #b0b0b0;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 20px;
  font-weight: 700;
`;

const RangeInput = styled.input`
  width: 100%;
  height: 4px;
  background: #222222;
  border-radius: 2px;
  appearance: none;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 28px;
    height: 28px;
    background: white;
    border: 1px solid #222222;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  color: #717171;
  font-size: 12px;
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

// --- Logic ---
function Step9Content() {
  const [basePrice, setBasePrice] = useState(2000);
  const [weekendPremium, setWeekendPremium] = useState(15);
  const [isClient, setIsClient] = useState(false);
   const [error, setError] = useState("");
  const totalGuestPrice = Math.round(basePrice + (basePrice * weekendPremium / 100));
   const router = useRouter();

 const MIN_PRICE=900;
 const MAX_PRICE=9000;


  useEffect(() => {
    setIsClient(true);
  }, []);


const handleNext = () => {
    // 1. Check karo ke price barobar che ke nahi
    if (basePrice < MIN_PRICE || basePrice > MAX_PRICE) {
        alert("Please enter a valid price before proceeding.");
        return;
    }

    // 2. Pehla no badho data upado
    const existingData = JSON.parse(localStorage.getItem('propertyData') || '{}');

    // 3. Price related data merge karo
    const updatedData = { 
      ...existingData, 
      base_price: basePrice,
      weekend_premium: weekendPremium,
      total_guest_price: totalGuestPrice // Calculation kareli price
    };

    // 4. Local storage ma save karo
    localStorage.setItem('propertyData', JSON.stringify(updatedData));

    // 5. Have Final Review page athva Next Step par jao
    router.push('/Host/Step10');
};

  if (!isClient) return null;

  return (
  <PageWrapper>
    <Header /> {/* તમારું હેડર અહીં આવશે */}

    <MainContent>
      <PricingContainer>
        {/* Weekday Section */}
        <Section>
          <Title>Now, set a weekday base price</Title>
          <Tip>Tip: ₹2,025. You'll set a weekend price next.</Tip>

          <PriceDisplayWrapper>
            <MainPriceRow>
              <CurrencySymbol>₹</CurrencySymbol>
              <PriceInput 
                type="number" 
               value={totalGuestPrice}
               onChange={(e) => {
                const newPrice = Number(e.target.value);
                setBasePrice(newPrice);
            }}
              />
              <EditIconCircle>
                <Pencil size={18} />
              </EditIconCircle>
            </MainPriceRow>

            {error && <ErrorMessage>● {error}</ErrorMessage>}
            
            <GuestPriceInfo>
              Guest price before taxes ₹{totalGuestPrice .toLocaleString()} <span>⌵</span>
            </GuestPriceInfo>
          </PriceDisplayWrapper>
        </Section>

        {/* Weekend Premium Slider Section */}
        <SliderSection>
          <SliderHeader>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>Weekend premium</h3>
              <p style={{ color: '#717171', fontSize: '14px' }}>Tip: Try 2%</p>
            </div>
            <SliderValueBox>{weekendPremium}%</SliderValueBox>
          </SliderHeader>

          <RangeInput 
            type="range" 
            min="0" 
            max="99" 
            value={weekendPremium} 
            onChange={(e) => setWeekendPremium(e.target.value)} 
          />
          
          <RangeLabels>
            <span>0%</span>
            <span>99%</span>
          </RangeLabels>
        </SliderSection>
      </PricingContainer>
    </MainContent>

      <Footer>
        <ProgressBarContainer>
          <Progress />
        </ProgressBarContainer>
        <FooterNav>
          <BackLink onClick={() => router.back()}>Back</BackLink>
          <NextButton 
           
            onClick={handleNext} 
          >
            Next
          </NextButton>
        </FooterNav>
      </Footer>
  </PageWrapper>
);
}
export default function PricingBlock() {
     return (
          <Suspense fallback={<div>Loading Step 11...</div>}>
            <Step9Content />
          </Suspense>
        );
}