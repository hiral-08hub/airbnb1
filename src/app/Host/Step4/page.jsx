"use client";

import React, { useState,useEffect,Suspense } from 'react';
import styled from '@emotion/styled';
import Header from '../Header';
import { useRouter } from 'next/navigation';
function Step4Content() {
  const router = useRouter();
  const [showSpecificLocation, setShowSpecificLocation] = useState(false);
  const [address, setAddress] = useState({
    country: 'India - IN',
    flat: '',
    street: '',
    landmark: '',
    district: '',
    city: '',
    state: '',
    pincode: '',
  });
  const handleNext = () => {
    // 1. અત્યાર સુધીનો જે ડેટા સ્ટોર થયેલો છે તેને મેળવો
    const existingData = JSON.parse(localStorage.getItem('propertyData') || '{}');

    // 2. નવા એડ્રેસ ડેટાને જૂના ડેટા સાથે મર્જ (Merge) કરો
    const updatedData = { 
      ...existingData, 
      ...address // આમાં flat, street, city, state વગેરે બધું આવી જશે
    };

    // 3. અપડેટ થયેલો ડેટા ફરીથી Local Storage માં સેવ કરો
    localStorage.setItem('propertyData', JSON.stringify(updatedData));

    // 4. હવે આગલા સ્ટેપ પર જાઓ
    router.push('/Host/Step6');
};
useEffect(() => {
  const data = localStorage.getItem('propertyData');
  console.log("Current stored data:", JSON.parse(data));
}, []);

  return (
    <PageWrapper>
      <Header /> {/* આ ઉપર ફિક્સ રહેશે */}

      <Container> {/* આ ભાગ સ્ક્રોલ થશે */}
        <FormWrapper>
          <HeaderSection>
            <Title>Confirm your address</Title>
            <SubTitle>Your address is only shared with guests after they've made a reservation.</SubTitle>
          </HeaderSection>

          <InputGroup>
            <SelectWrapper>
              <Label>Country/region</Label>
              <Select value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})}>
                <option>India - IN</option>
                <option>United States - US</option>
              </Select>
            </SelectWrapper>

            <InputWrapper>
              <Label>Flat, house, etc. (if applicable)</Label>
              <Input type="text" value={address.flat} onChange={(e) => setAddress({...address, flat: e.target.value})} />
            </InputWrapper>

            <InputWrapper>
              <Label>Street address</Label>
              <Input type="text" value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} />
            </InputWrapper>

            <InputWrapper>
              <Label>Nearby landmark (if applicable)</Label>
              <Input type="text" placeholder="e.g. Near Apollo Hospital" value={address.landmark} onChange={(e) => setAddress({...address, landmark: e.target.value})} />
            </InputWrapper>

            <InputWrapper>
              <Label>District/locality (if applicable)</Label>
              <Input type="text" value={address.district} onChange={(e) => setAddress({...address, district: e.target.value})} />
            </InputWrapper>

            <InputWrapper>
              <Label>City / town</Label>
              <Input type="text" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
            </InputWrapper>

            <InputWrapper>
              <Label>State / union territory</Label>
              <Input type="text" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} />
            </InputWrapper>

            <InputWrapper className="last">
              <Label>PIN code</Label>
              <Input type="text" value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})} />
            </InputWrapper>
          </InputGroup>

         
        </FormWrapper>
      </Container>

      <Footer> {/* આ નીચે ફિક્સ રહેશે */}
        <div className="progress-container">
          <ProgressLine active /><ProgressLine active /><ProgressLine active /><ProgressLine active />
        </div>
        <div className="controls">
          <button className="back-btn" onClick={() => router.back()}>Back</button>
          <BlackBtn onClick={handleNext}>Next</BlackBtn>
        </div>
      </Footer>
    </PageWrapper>
  );
}
export default function AddressForm() {
    return (
          <Suspense fallback={<div>Loading Step 11...</div>}>
            <Step4Content />
          </Suspense>
        );
}

// --- Styled Components (સ્ક્રોલબાર ફિક્સ સાથે) ---

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; /* આખી સ્ક્રીન ની હાઈટ */
  overflow: hidden; /* આખા પેજ પર સ્ક્રોલબાર નહીં આવે */
`;

const Container = styled.div`
  flex: 1; /* આ બધી વધારાની જગ્યા લઈ લેશે */
  overflow-y: auto; /* માત્ર આ જ ભાગમાં સ્ક્રોલબાર આવશે */
  padding: 40px 20px;
  display: flex;
  justify-content: center;

  /* સ્ક્રોલબાર ની ડિઝાઇન */
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-thumb { background: #dddddd; border-radius: 10px; }
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  padding-bottom: 20px;
`;

const Footer = styled.footer`
  background: white;
  border-top: 1px solid #eee;
  padding: 15px 40px;
  z-index: 10;
  
  .progress-container { display: flex; gap: 8px; margin-bottom: 15px; }
  .controls { display: flex; justify-content: space-between; align-items: center; }
  .back-btn { background: none; border: none; text-decoration: underline; font-weight: 600; cursor: pointer; }
`;

// ... તમારા બાકીના Styled Components (Title, Input, Switch વગેરે) અહીં ચાલુ રહેશે
const HeaderSection = styled.div` margin-bottom: 32px; `;
const Title = styled.h1` font-size: 32px; font-weight: 600; margin-bottom: 8px; `;
const SubTitle = styled.p` color: #717171; font-size: 18px; `;
const InputGroup = styled.div` border: 1px solid #b0b0b0; border-radius: 8px; overflow: hidden; `;
const InputWrapper = styled.div` padding: 12px; border-bottom: 1px solid #b0b0b0; &.last { border-bottom: none; } `;
const Label = styled.label` display: block; font-size: 12px; color: #717171; `;
const Input = styled.input` width: 100%; border: none; outline: none; font-size: 16px; padding-top: 4px; `;
const SelectWrapper = styled(InputWrapper)``;
const Select = styled.select` width: 100%; border: none; outline: none; font-size: 16px; `;
const BlackBtn = styled.button` background: #222; color: white; padding: 12px 30px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; `;
const ProgressLine = styled.div` height: 6px; flex: 1; background: ${props => props.active ? '#222' : '#eee'}; border-radius: 3px; `;
const LocationSection = styled.div` margin-top: 32px; border-top: 1px solid #ebebeb; padding-top: 32px; `;
const ToggleRow = styled.div` display: flex; justify-content: space-between; margin-bottom: 24px; `;
const TextContent = styled.div` flex: 1; `;
const ToggleTitle = styled.h3` font-size: 18px; font-weight: 600; `;
const ToggleSubTitle = styled.p` font-size: 14px; color: #717171; `;
const Switch = styled.div` width: 50px; height: 32px; background: ${props => props.active ? '#222' : '#ccc'}; border-radius: 16px; position: relative; cursor: pointer; `;
const Slider = styled.div` width: 26px; height: 26px; background: white; border-radius: 50%; position: absolute; top: 3px; left: ${props => props.active ? '21px' : '3px'}; transition: 0.2s; `;
const MapPreview = styled.div` width: 100%; height: 250px; background: #eee; border-radius: 12px; position: relative; overflow: hidden; img { width: 100%; height: 100%; object-fit: cover; } `;
const MapOverlay = styled.div` position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 10px 20px; border-radius: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); font-weight: 500; `;