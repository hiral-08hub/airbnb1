"use client";

import React, { useState,Suspense } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import Header from '../Header';

// --- Styled Components ---

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  color: #222222;
`;

const Main = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
`;

const ContentBox = styled.div`
  width: 100%;
  max-width: 630px;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const TitleLabel = styled.h1`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #717171;
  font-size: 18px;
  margin-bottom: 24px;
`;

const TextAreaWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: ${props => props.minHeight || '120px'};
  padding: 18px;
  font-size: 18px;
  font-family: inherit;
  border: 1px solid #b0b0b0;
  border-radius: 8px;
  resize: none;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border: 2px solid #222222;
    padding: 17px;
  }
`;

const CharCounter = styled.div`
  margin-top: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #717171;
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
const BackLink = styled.button`
  background: none;
  border: none;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  font-size: 16px;
`;
function Step8Content() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const TITLE_LIMIT = 50;
  const DESC_LIMIT = 500;
  // --- DATA STORE KARVA MATE HANDLE NEXT ---
  const handleNext = () => {
    // 1. Pehla no bacho data (Category, Address, Basics) upado
    const existingData = JSON.parse(localStorage.getItem('propertyData') || '{}');

    // 2. Aa page na Title ane Description merge karo
    const updatedData = { 
      ...existingData, 
      title: title,
      description: description
    };

    // 3. Local storage ma pacho save karo
    localStorage.setItem('propertyData', JSON.stringify(updatedData));

    // 4. Step 9 par jao
    router.push('/Host/Step9');
  };

  const isNextDisabled = title.length === 0 || description.length === 0;

  return (
    <PageContainer>
      <Header />
      
      <Main>
        <ContentBox>
          {/* Title Section */}
          <Section>
            <TitleLabel>Now, let's give your house a title</TitleLabel>
            <Subtitle>Short titles work best. Have fun with it—you can always change it later.</Subtitle>
            <TextAreaWrapper>
              <StyledTextArea
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, TITLE_LIMIT))}
                placeholder="e.g. Modern beach house with a view"
                minHeight="100px"
              />
              <CharCounter>{title.length}/{TITLE_LIMIT}</CharCounter>
            </TextAreaWrapper>
          </Section>

          {/* Description Section */}
          <Section>
            <TitleLabel>Create your description</TitleLabel>
            <Subtitle>Share what makes your place special.</Subtitle>
            <TextAreaWrapper>
              <StyledTextArea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, DESC_LIMIT))}
                placeholder="Make some memories at this unique and family-friendly place."
                minHeight="180px"
              />
              <CharCounter>{description.length}/{DESC_LIMIT}</CharCounter>
            </TextAreaWrapper>
          </Section>
        </ContentBox>
      </Main>

      <Footer>
        <ProgressBarContainer>
          <Progress />
        </ProgressBarContainer>
        <FooterNav>
          <BackLink onClick={() => router.back()}>Back</BackLink>
          <NextButton 
            disabled={isNextDisabled}
            onClick={handleNext} 
          >
            Next
          </NextButton>
        </FooterNav>
      </Footer>
    </PageContainer>
  );
}
export default function DetailsPage() {
   return (
        <Suspense fallback={<div>Loading Step 11...</div>}>
          <Step8Content />
        </Suspense>
      );
}