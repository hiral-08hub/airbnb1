"use client";
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { 
  MdOutlineHouse, 
  MdOutlineApartment, 
  MdOutlineCabin, 
  MdOutlineCastle, 
  MdOutlineDirectionsBoat, 
  MdOutlineCoffeeMaker, 
  MdOutlineDirectionsBus 
} from 'react-icons/md';
import { GiBarn, GiFamilyHouse } from 'react-icons/gi';
import { SiAirbnb } from "react-icons/si";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: sans-serif;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 20px 40px;
  .logo { color: #222; cursor: pointer; }
  .nav-btns { display: flex; gap: 10px; }
`;

const NavBtn = styled.button`
  background: white;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  h2 { font-size: 32px; margin-bottom: 30px; font-weight: 600; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  width: 100%;
  max-width: 600px;
`;

const Card = styled.div`
  border: ${props => props.selected ? '2px solid #222' : '1px solid #ddd'};
  background: ${props => props.selected ? '#f7f7f7' : 'white'};
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: 0.2s;
  &:hover { border-color: #222; }
  .icon { font-size: 30px; }
  span { font-weight: 600; font-size: 16px; }
`;

const Footer = styled.footer`
  border-top: 1px solid #eee;
  padding: 15px 40px;
  .progress-bar {
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
`;
const Logo = styled.div`
  color: #ff385c;
  font-size: 32px;
  cursor: pointer;
`;

const categories = [
  { id: 1, label: 'House', icon: <MdOutlineHouse /> },
  { id: 2, label: 'Flat/apartment', icon: <MdOutlineApartment /> },
  { id: 3, label: 'Barn', icon: <GiBarn /> },
  { id: 4, label: 'Bed & breakfast', icon: <MdOutlineCoffeeMaker /> },
  { id: 5, label: 'Boat', icon: <MdOutlineDirectionsBoat /> },
  { id: 6, label: 'Cabin', icon: <MdOutlineCabin /> },
  { id: 7, label: 'Campervan/motorhome', icon: <MdOutlineDirectionsBus /> },
  { id: 8, label: 'Casa particular', icon: <GiFamilyHouse /> },
  { id: 9, label: 'Castle', icon: <MdOutlineCastle /> },
];

export default function StepTwo() {
  const [selected, setSelected] = useState(1);
  const router = useRouter();
  // Next button click thay tyare local storage ma save karo
  const handleNext = () => {
    // Label save karo (jem ke 'House' or 'Barn')
    console.log("clicked next");
    const selectedCategory = categories.find(cat => cat.id === selected)?.label;
    
    // Local storage ma 'propertyData' name no object banavo
    const existingData = JSON.parse(localStorage.getItem('propertyData') || '{}');
    const newData = { ...existingData, category: selectedCategory };
    
    localStorage.setItem('propertyData', JSON.stringify(newData));
    
    // Have Step 3 par jao
    router.push('/Host/Step3');
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
        <h2>Which of these best describes your place?</h2>
        <Grid>
          {categories.map((cat) => (
            <Card 
              key={cat.id} 
              selected={selected === cat.id} 
              onClick={() => setSelected(cat.id)}
            >
              <div className="icon">{cat.icon}</div>
              <span>{cat.label}</span>
            </Card>
          ))}
        </Grid>
      </MainContent>

      <Footer>
        <div className="progress-bar">
          <ProgressLine active />
          <ProgressLine active />
          <ProgressLine />
        </div>
        <div className="controls">
          <button style={{ background: 'none', border: 'none', textDecoration: 'underline', fontWeight: '600', cursor: 'pointer' }} onClick={() => router.back()}>
            Back
          </button>
          <BlackBtn onClick={handleNext}>Next</BlackBtn>
        </div>
      </Footer>
    </PageWrapper>
  );
}