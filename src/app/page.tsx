"use client";
import AirbnbClone from "./components/Navbar/Navbar1"; // અહીં Navbar1 માંથી ડેટા આવે છે
import PropertySlider from "./components/card/card";

import styled from "@emotion/styled";
import Footer from './components/Footer/page';
const ContentWrapper = styled.div`
  /* Nav (80px) + SearchBox (~100px) = 180px */
  padding-top: 180px; 
  width: 100%;
`;
export default function Home() {
  return (
    <main>
      <AirbnbClone/>
      <ContentWrapper>
        <PropertySlider/>  
      </ContentWrapper>
      <Footer/>
    </main>
   
  );
}