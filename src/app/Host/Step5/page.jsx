"use client";

import React, { useState,Suspense } from 'react';
import styled from '@emotion/styled';
import Header from '../Header';
import { useRouter } from 'next/navigation';

function Step5Content() {
  const [showSpecificLocation, setShowSpecificLocation] = useState(false);
  const [address, setAddress] = useState({
    country: 'India - IN',
    flat: '159',
    street: 'rajkot hwy',
    landmark: '',
    district: 'rajkot',
    city: '',      // આ ઉમેરો
  pincode: '',
  });
    const router = useRouter();
  
    const handleCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          alert(`તમારું લોકેશન: Lat ${position.coords.latitude}, Long ${position.coords.longitude}`);
          // અહીં તમે API કોલ કરીને એડ્રેસ મેળવી શકો છો
        });
      } else {
        alert("તમારા બ્રાઉઝરમાં લોકેશન સપોર્ટ નથી.");
      }
    };

  return (
     <PageWrapper>
        <Header />
    <Container>
      <FormWrapper>
        <HeaderSection>
          <Title>Confirm your address</Title>
          <SubTitle>Your address is only shared with guests after they've made a reservation.</SubTitle>
        </HeaderSection>

        <InputGroup>
          {/* Country Selection */}
          <SelectWrapper>
            <Label>Country/region</Label>
            <Select defaultValue="India - IN">
              <option>India - IN</option>
              <option>United States - US</option>
              <option>United Kingdom - UK</option>
            </Select>
          </SelectWrapper>

          {/* Flat/House Input */}
          <InputWrapper>
            <Label>Flat, house, etc. (if applicable)</Label>
            <Input 
              type="text" 
              value={address.flat} 
              onChange={(e) => setAddress({...address, flat: e.target.value})} 
            />
          </InputWrapper>

          {/* Street Address */}
          <InputWrapper>
            <Label>Street address</Label>
            <Input 
              type="text" 
              value={address.street} 
              onChange={(e) => setAddress({...address, street: e.target.value})} 
            />
          </InputWrapper>

          {/* Landmark */}
          <InputWrapper>
            <Label>Nearby landmark (if applicable)</Label>
            <Input 
              type="text" 
              placeholder="e.g. Near Apollo Hospital"
              onChange={(e) => setAddress({...address, landmark: e.target.value})} 
            />
          </InputWrapper>

          {/* District */}
          <InputWrapper className="last">
            <Label>District/locality (if applicable)</Label>
            <Input 
              type="text" 
              value={address.district} 
              onChange={(e) => setAddress({...address, district: e.target.value})} 
            />
          </InputWrapper>
          <InputWrapper>
    <Label>City / town</Label>
    <Input 
      type="text" 
      value={address.city} 
      onChange={(e) => setAddress({...address, city: e.target.value})} 
    />
  </InputWrapper>
    <InputWrapper>
    <Label>City / town</Label>
    <Input 
      type="text" 
      value={address.city} 
      onChange={(e) => setAddress({...address, city: e.target.value})} 
    />
  </InputWrapper>
    <InputWrapper>
    <Label>City / town</Label>
    <Input 
      type="text" 
      value={address.city} 
      onChange={(e) => setAddress({...address, city: e.target.value})} 
    />
  </InputWrapper>
  

  


  {/* State / Union Territory */}
  <InputWrapper>
    <Label>State / union territory</Label>
    <Input 
      type="text" 
      value={address.state} 
      onChange={(e) => setAddress({...address, state: e.target.value})} 
    />
  </InputWrapper>

  {/* PIN Code */}
  <InputWrapper className="last">
    <Label>PIN code</Label>
    <Input 
      type="text" 
      value={address.pincode} 
      onChange={(e) => setAddress({...address, pincode: e.target.value})} 
    />
  </InputWrapper>
        </InputGroup>
        
      </FormWrapper>
    </Container>
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
          <BlackBtn onClick={() => router.push('/Host/Step6')}>Next</BlackBtn>
        </div>
      </Footer>
    </PageWrapper>
  );
}
export default function AddressForm() {
   return (
             <Suspense fallback={<div>Loading Step 11...</div>}>
               <Step5Content />
             </Suspense>
           );

}

// Styled Components
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
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden; /* આ લાઈન ઉમેરો */
  font-family: sans-serif;
  color: #222;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  background: #fff;
  
  /* સ્ક્રોલબાર માટે આ પ્રોપર્ટીઝ ઉમેરો */
  max-height: calc(100vh - 180px); /* હેડર અને ફૂટરની જગ્યા છોડીને બાકીની હાઈટ */
  overflow-y: auto;               /* જો કન્ટેન્ટ વધે તો જ સ્ક્રોલબાર દેખાશે */
  scrollbar-width: thin;          /* Firefox માટે */
  
  /* સ્ક્રોલબારને સુંદર (Airbnb જેવો) બનાવવા માટે */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
    background: #aaa;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #888;
  }
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #222222;
`;

const SubTitle = styled.p`
  font-size: 18px;
  color: #717171;
`;

const InputGroup = styled.div`
  border: 1px solid #b0b0b0;
  border-radius: 8px;
  overflow: hidden;
`;

const InputWrapper = styled.div`
  position: relative;
  padding: 12px;
  border-bottom: 1px solid #b0b0b0;
  
  &.last {
    border-bottom: none;
  }

  &:focus-within {
    outline: 2px solid #222;
    z-index: 10;
  }
`;

const SelectWrapper = styled(InputWrapper)`
  background: #fff;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  color: #717171;
  margin-bottom: 2px;
`;

const Input = styled.input`
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  color: #222;
  padding: 0;
  background: transparent;

  &::placeholder {
    color: #b0b0b0;
  }
`;

const Select = styled.select`
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  color: #222;
  appearance: none;
  cursor: pointer;
  background: transparent;
`;
const LocationSection = styled.div`
  margin-top: 32px;
  border-top: 1px solid #ebebeb;
  padding-top: 32px;
`;

const ToggleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const ToggleTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  color: #222;
`;

const ToggleSubTitle = styled.p`
  font-size: 14px;
  color: #717171;
  margin-top: 4px;
  a { color: #222; text-decoration: underline; font-weight: 600; }
`;

const MapPreview = styled.div`
  width: 100%;
  height: 250px;
  background: #f7f7f7;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  border: 1px solid #ddd;
  
  img { width: 100%; height: 100%; object-fit: cover; opacity: 0.7; }
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 12px 24px;
  border-radius: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  font-weight: 500;
  z-index: 5;
`;

const Switch = styled.div`
  width: 50px;
  height: 32px;
  background: ${props => props.active ? '#222' : '#ccc'};
  border-radius: 16px;
  position: relative;
  cursor: pointer;
  transition: 0.3s;
`;

const Slider = styled.div`
  width: 26px;
  height: 26px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: ${props => props.active ? '21px' : '3px'};
  transition: 0.3s;
`;
const TextContent = styled.div`
  flex: 1;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;