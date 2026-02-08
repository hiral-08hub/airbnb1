"use client";
import React from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';

;


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
  &:disabled { background: #ddd; cursor: not-allowed; }
`;

export default function Footer() {
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
          <BlackBtn onClick={() => router.push('/Host/Step5')}>Next</BlackBtn>
        </div>
      </Footer>
  );
}