"use client";
import React,{Suspense} from 'react';
import styled from "@emotion/styled";
import { useRouter } from 'next/navigation';
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
  align-items: center;
  padding: 20px 40px;
  
  .buttons {
    display: flex;
    gap: 15px;
  }
`;

const SecondaryBtn = styled.button`
  background: white;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  &:hover { border-color: #222; }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 80px;
  gap: 100px;
`;

const LeftSide = styled.div`
  flex: 1;
  max-width: 500px;
  span { font-weight: 600; font-size: 18px; }
  h1 { font-size: 48px; margin: 15px 0; font-weight: 700; }
  p { font-size: 18px; line-height: 1.5; color: #444; }
`;

const RightSide = styled.div`
  flex: 1;
  img {
    width: 100%;
    max-height:400px;
    max-width: 500px;
  }
`;

const Footer = styled.footer`
  border-top: 1px solid #eee;
  padding: 15px 40px;
  
  .progress-container {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const ProgressBar = styled.div`
  height: 6px;
  flex: 1;
  background: ${props => props.active ? '#222' : '#eee'};
  border-radius: 3px;
`;

const BlackBtn = styled.button`
  background: #222;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`;
const Logo = styled.div`
  color: #ff385c;
  font-size: 32px;
  cursor: pointer;
`;
const Illustration = styled.img`
  width: 100%;
  max-width: 550px;
  height: auto;
  object-fit: contain;
`;
function Step1Content() {
   const router = useRouter();
  const handleLogoClick = () => {
    // router.push જો કામ ન કરે તો આ વાપરો:
    window.location.href = '/'; 
};
  return (
    <PageWrapper>
      {/* Header */}
      <Header>
         <Logo onClick={handleLogoClick}><SiAirbnb size={34} /></Logo>
        <div className="buttons">
          <SecondaryBtn>Questions?</SecondaryBtn>
          <SecondaryBtn onClick={() => router.push('/Host')}>Save & exit</SecondaryBtn>
        </div>
      </Header>

      {/* Content */}
      <MainContent>
        <LeftSide>
          <span>Step 1</span>
          <h1>Tell us about your place</h1>
          <p>
            In this step, we'll ask you which type of property you have and if guests will book the entire place or just a room. Then let us know the location and how many guests can stay.
          </p>
        </LeftSide>
        <RightSide>
          <Illustration 
            src="/img/home.png" 
            alt="Finish up and publish illustration" 
          />
        </RightSide>
      </MainContent>

      {/* Footer */}
      <Footer>
        <div className="progress-container">
          <ProgressBar active />
          <ProgressBar />
          <ProgressBar />
        </div>
        <div className="controls">
         <button 
          style={{ background: 'none', border: 'none', textDecoration: 'underline', fontWeight: '600', cursor: 'pointer' }} 
          onClick={() => router.back()}>
            Back
          </button>
          <BlackBtn onClick={() => router.push('/Host/Step2')}>
             Next
          </BlackBtn>
        </div>
      </Footer>
    </PageWrapper>
  );
}
export default function StepOne() {
   return (
        <Suspense fallback={<div>Loading Step 11...</div>}>
          <Step1Content />
        </Suspense>
      );
}