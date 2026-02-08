"use client";

import React, { useState, useRef,Suspense } from 'react';
import styled from '@emotion/styled';
import { Image as ImageIcon, Plus, X, Trash2 } from 'lucide-react';
import Header from '../Header';
import { useRouter } from 'next/navigation';

// --- Styled Components ---

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #222222;
`;



const GhostButton = styled.button`
  background: white;
  border: 1px solid #dddddd;
  border-radius: 30px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover { border-color: #000; background: #f7f7f7; }
`;

const Main = styled.main`
  flex-grow: 1;
  max-width: 630px;
  margin: 0 auto;
  padding: 40px 24px;
  width: 100%;
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

const UploadZone = styled.div`
  border: 1px dashed #b0b0b0;
  border-radius: 12px;
  padding: 80px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;
  &:hover { border-color: #222; }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 24px;
`;

const PhotoCard = styled.div`
  position: relative;
  aspect-ratio: 1.5;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ebebeb;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:first-child {
    grid-column: span 2;
    aspect-ratio: 1.8;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  &:hover { background: #f7f7f7; }
`;

const AddMoreCard = styled(UploadZone)`
  aspect-ratio: 1.5;
  padding: 0;
  border-style: dashed;
`;

const Footer = styled.footer`
  margin-top: auto;
  border-top: 1px solid #ebebeb;
`;

const FooterNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 48px;
`;

const NextButton = styled.button`
  background: #222;
  color: white;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  opacity: ${props => props.disabled ? 0.5 : 1};
`;
const BackLink = styled.button`
  background: none;
  border: none;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  font-size: 16px;
`;

// --- Component Logic ---
function Step7Content() {
    const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);
// 1. URL na badle khari Files store karo
const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  
  // Preview mate URL banavo
  const previewUrls = files.map(file => URL.createObjectURL(file));
  setPhotos(prev => [...prev, ...previewUrls]);

  if (!window.uploadedFiles) window.uploadedFiles = [];
  window.uploadedFiles = [...window.uploadedFiles, ...files];
};

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };
 const router = useRouter();
  return (
    <PageContainer>
      <Header/>

      <Main>
        <Title>Add some photos of your house</Title>
        <Subtitle>You'll need 5 photos to get started. You can add more or make changes later.</Subtitle>

        <input 
          type="file" 
          multiple 
          accept="image/*" 
          hidden 
          ref={fileInputRef} 
          onChange={handleFileChange} 
        />

        {photos.length === 0 ? (
          <UploadZone onClick={() => fileInputRef.current.click()}>
            <ImageIcon size={64} strokeWidth={1} />
            <h3 style={{ marginTop: '20px', fontSize: '20px' }}>Drag your photos here</h3>
            <p style={{ color: '#717171', margin: '8px 0 24px' }}>Choose at least 5 photos</p>
            <button style={{ textDecoration: 'underline', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>
              Upload from your device
            </button>
          </UploadZone>
        ) : (
          <PhotoGrid>
            {photos.map((src, index) => (
              <PhotoCard key={index}>
                <img src={src} alt={`Upload ${index}`} />
                <DeleteButton onClick={() => removePhoto(index)}>
                  <Trash2 size={16} />
                </DeleteButton>
              </PhotoCard>
            ))}
            <AddMoreCard onClick={() => fileInputRef.current.click()}>
              <Plus size={32} color="#717171" />
              <p style={{ fontSize: '14px', fontWeight: '600' }}>Add more</p>
            </AddMoreCard>
          </PhotoGrid>
        )}
      </Main>

      <Footer>
        <div style={{ height: '6px', background: '#ebebeb' }}>
          <div style={{ width: '50%', height: '100%', background: '#222' }} />
        </div>
        <FooterNav>
           <BackLink onClick={() => router.back()}>Back</BackLink>
          <NextButton disabled={photos.length < 5}  onClick={() => router.push('/Host/Step8')}>
            Next
          </NextButton>
        </FooterNav>
      </Footer>
    </PageContainer>
  );
}
export default function PhotoUploadPage() {
   return (
        <Suspense fallback={<div>Loading Step 11...</div>}>
          <Step7Content />
        </Suspense>
      );
}