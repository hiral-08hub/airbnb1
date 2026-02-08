"use client";
import React, { useState } from 'react';
import styled from "@emotion/styled";
import { FaSearch, FaPlus, FaMinus } from 'react-icons/fa';
import { SiAirbnb } from "react-icons/si";
import { useRouter } from 'next/navigation'; // ૧. ઈમ્પો


const Container = styled.div`
  display: flex;
  height: 100vh;
  font-family: 'Circular', -apple-system, system-ui, Roboto, sans-serif;
  color: #222;
`;

// --- Left Side (Calculator Section) ---
const LeftSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 60px;
  text-align: center;
`;

const HeaderNav = styled.div`
  position: absolute;
  top: 30px;
  z-index: 100; /* બટનને ક્લિકેબલ બનાવવા માટે સૌથી મહત્વનું */
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 60px;
`;
const Logo = styled.div`
  color: #ff385c;
  font-size: 32px;
  cursor: pointer;
`;

const GetStartedBtn = styled.button`
  background-color: #e31c5f;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background-color: #bd1e59; }
`;

const Title = styled.h1`
  font-size: 56px;
  font-weight: 700;
  margin: 0;
  line-height: 1.1;
  span { color: #ff385c; }
`;

const SubTitle = styled.div`
  margin-top: 30px;
  font-size: 18px;
  font-weight: 500;
  
  span {
    text-decoration: underline;
    font-weight: 700;
    cursor: pointer;
  }
`;

const EstimateText = styled.p`
  color: #717171;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 5px;
`;

const SliderWrapper = styled.div`
  /* ... અન્ય કોડ ... */
  input[type="range"] {
    width: 100%;
    height: 12px; /* એરબીએનબી જેવી પતલી લાઈન */
    /* background:#ff385c;  <-- આ લાઈન કાઢી નાખો (Delete this) */
    appearance: none;
    background: #ddd; /* ડિફોલ્ટ ગ્રે કલર */
    border-radius: 10px;
    outline: none;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  padding: 15px 25px;
  border-radius: 50px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  margin-top: 20px;

  .icon { color: #ff385c; margin-right: 15px; font-size: 20px; }
  .text { font-weight: 600; font-size: 16px; }
  .details { color: #717171; font-size: 16px; margin-left: 5px; }
`;

// --- Right Side (Map Section) ---
const RightSide = styled.div`
  flex: 1;
  position: relative;
  background: url('https://miro.medium.com/v2/resize:fit:1400/1*q3ZsaP8Pcr6SAlQXwo_Frg.jpeg'); /* Placeholder for Map */
  background-size: cover;
  background-position: center;
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 10px 20px;
  border-radius: 50px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  font-weight: 600;
  cursor: pointer;
`;

const ZoomControls = styled.div`
  position: absolute;
  bottom: 40px;
  right: 40px;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);

  button {
    padding: 12px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 18px;
    color: #717171;
    &:first-child { border-bottom: 1px solid #eee; }
    &:hover { color: #222; }
  }
`;

export default function BecomeHost() {
  const [nights, setNights] = useState(7);
  const pricePerNight = 4055;
  const router = useRouter(); // ૨. ફંક્શનની અંદર રાઉટર ડિફાઈન કરો
  // આ કેલ્ક્યુલેશન પિંક લાઈન કેટલી લાંબી હશે તે નક્કી કરશે
const sliderBackground = {
  background: `linear-gradient(to right, #FF385C 0%, #FF385C ${(nights / 30) * 100}%, #ddd ${(nights / 30) * 100}%, #ddd 100%)`
};
const handleNavigation = (e) => {
    e.preventDefault(); // કોઈપણ ડિફોલ્ટ બિહેવિયર અટકાવવા
    console.log("Button Clicked!"); // ચેક કરવા માટે કે ક્લિક થાય છે કે નહીં
    router.push('/Host/Step1');
  };
   const handleLogoClick = () => {
    // router.push જો કામ ન કરે તો આ વાપરો:
    window.location.href = '/'; 
};

  return (
    <Container>
      <HeaderNav>
      <Logo onClick={handleLogoClick}><SiAirbnb size={34} /></Logo>
       <GetStartedBtn onClick={handleNavigation}>
        Get started
      </GetStartedBtn>
      </HeaderNav>

      <LeftSide>
        <Title>
          Your home could <br /> make <span>₹{(nights * pricePerNight).toLocaleString('en-IN')}</span> <br /> on Airbnb
        </Title>
        
        <SubTitle>
          <span>{nights} nights</span> · ₹{(pricePerNight).toLocaleString('en-IN')}/night
        </SubTitle>
        <EstimateText>Learn how we estimate earnings</EstimateText>

       <SliderWrapper>
  <input 
    type="range" 
    min="1" 
    max="30" 
    value={nights} 
    style={sliderBackground} // અહીં ડાયનેમિક સ્ટાઇલ લાગશે
    onChange={(e) => setNights(parseInt(e.target.value))} 
  />
</SliderWrapper>

        <SearchBar>
          <FaSearch className="icon" />
          <div>
            <span className="text">Map area</span>
            <span className="details">· Entire place · 2 bedrooms</span>
          </div>
        </SearchBar>
      </LeftSide>

      <RightSide>
        <MapOverlay>Explore rates near you</MapOverlay>
        
        <ZoomControls>
          <button><FaPlus /></button>
          <button><FaMinus /></button>
        </ZoomControls>
      </RightSide>
    </Container>
  );
}