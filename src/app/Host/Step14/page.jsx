"use client";

import React,{Suspense} from 'react';
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
  align-items: flex-start;
  justify-content: center;
  padding: 40px 80px 0 80px;

  @media (max-width: 1024px) {
    flex-direction: column;
    padding: 40px 24px;
    text-align: center;
  }
`;

const TextSection = styled.div`
  flex: 1;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StepLabel = styled.span`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 600;
  line-height: 54px;
  margin-bottom: 24px;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 32px;
    line-height: 36px;
  }
`;

const Description = styled.p`
  font-size: 18px;
  line-height: 24px;
  color: #222222;
`;

const ImageSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-left: 40px;

  @media (max-width: 1024px) {
    padding-left: 0;
    margin-top: 0px;
  }
`;

const Illustration = styled.img`
  width: 100%;
  max-width: 550px;
  max-height: 350px;
  height: auto;
  object-fit: contain;
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

const BackLink = styled.button`
  background: none;
  border: none;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  font-size: 16px;
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

// --- Component ---
function Step14Content() {
   const router = useRouter();

  return (
    <PageContainer>
      <Header />
      
      <Main>
        <TextSection>
          <StepLabel>Step 2</StepLabel>
          <Title>Make Your Place Stand Out</Title>
          <Description>
            in this page ,you'll add some amenities your place offer,plus 5 or more photos.
          </Description>
        </TextSection>

        <ImageSection>
          <Illustration 
            src="/img/home.png" 
            alt="Finish up and publish illustration" 
          />
        </ImageSection>
      </Main>
     <Footer>
        <ProgressBarContainer>
          <Progress />
        </ProgressBarContainer>
        <FooterNav>
          <BackLink onClick={() => router.back()}>Back</BackLink>
          <NextButton 
            onClick={() => router.push('/Host/Step7')} 
          >
            Next
          </NextButton>
        </FooterNav>
      </Footer>
    </PageContainer>
  );
}
export default function FinishUpPage() {
  return (
        <Suspense fallback={<div>Loading Step 11...</div>}>
          <Step14Content />
        </Suspense>
      );
}