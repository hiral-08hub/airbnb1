"use client";
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { MdOutlineHouse, MdOutlineDoorFront, MdOutlineGroups } from 'react-icons/md';
import { SiAirbnb } from "react-icons/si";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: sans-serif;
  color: #222;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 20px 40px;
  .logo { color: #ff385c; cursor: pointer; }
`;

const NavBtn = styled.button`
  background: white;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 10px;
  &:hover { border-color: #000; }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  h2 { font-size: 32px; margin-bottom: 40px; text-align: center; }
`;

const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 600px;
`;

const SelectionCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border: ${props => props.selected ? '2px solid #222' : '1px solid #ddd'};
  background: ${props => props.selected ? '#f7f7f7' : 'white'};
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
  
  &:hover { border-color: #222; }

  .text-content {
    h3 { margin: 0 0 5px 0; font-size: 18px; }
    p { margin: 0; color: #717171; font-size: 14px; }
  }

  .icon { font-size: 32px; color: #222; }
`;

const Footer = styled.footer`
  border-top: 1px solid #eee;
  padding: 15px 40px;
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
  &:hover { background: #000; }
`;
const Logo = styled.div`
  color: #ff385c;
  font-size: 32px;
  cursor: pointer;
`;

const placeTypes = [
  {
    id: 'entire',
    title: 'An entire place',
    description: 'Guests have the whole place to themselves.',
    icon: <MdOutlineHouse />
  },
  {
    id: 'room',
    title: 'A room',
    description: 'Guests have their own room in a home, plus access to shared spaces.',
    icon: <MdOutlineDoorFront />
  },
  {
    id: 'shared',
    title: 'A shared room in a hostel',
    description: 'Guests sleep in a shared room in a professionally managed hostel with staff on-site 24/7.',
    icon: <MdOutlineGroups />
  }
];

export default function StepThree() {
  const [selectedType, setSelectedType] = useState('entire');
  const router = useRouter();
  const handleNext = () => {
    alert("click");
    // 1. Pehla je data store thayo che tene upado
    const existingData = JSON.parse(localStorage.getItem('propertyData') || '{}');

    // 2. Have navo data (Privacy Type) tema add karo
    const updatedData = { 
      ...existingData, 
      room_privacy_type: selectedType // Tamara Django model na field name mujab rakho
    };

    // 3. Local storage ma pacho save karo
    localStorage.setItem('propertyData', JSON.stringify(updatedData));

    // 4. Next page par jao
    router.push('/Host/Step4');
  };
  const handleLogoClick = () => {
    // router.push જો કામ ન કરે તો આ વાપરો:
    window.location.href = '/'; 
};
  return (
    <PageWrapper>
      <Header>
         <Logo onClick={handleLogoClick}><SiAirbnb size={34} /></Logo>
        <div className="nav-btns">
          <NavBtn>Questions?</NavBtn>
          <NavBtn onClick={() => router.push('/Host')}>Save & exit</NavBtn>
        </div>
      </Header>

      <MainContent>
        <h2>What type of place will guests have?</h2>
        <OptionList>
          {placeTypes.map((type) => (
            <SelectionCard 
              key={type.id} 
              selected={selectedType === type.id}
              onClick={() => setSelectedType(type.id)}
            >
              <div className="text-content">
                <h3>{type.title}</h3>
                <p>{type.description}</p>
              </div>
              <div className="icon">{type.icon}</div>
            </SelectionCard>
          ))}
        </OptionList>
      </MainContent>

      <Footer>
        <div className="progress-container">
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
    </PageWrapper>
  );
}