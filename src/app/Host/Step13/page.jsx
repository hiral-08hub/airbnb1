"use client";

import React, { useState,Suspense } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import Header from '../Header';


// --- Styled Components ---

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 90vh;
  font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  color: #222222;
`;

const Main = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 24px;
`;

const ContentBox = styled.div`
  width: 100%;
  max-width: 630px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  color: #717171;
  font-size: 18px;
  margin-bottom: 32px;
  
  a {
    color: #222222;
    text-decoration: underline;
    font-weight: 600;
  }
`;

const SelectionCard = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  /* Thick black border if selected, light gray if not */
  border: ${props => props.isSelected ? '2px solid #222222' : '1px solid #ebebeb'};
  background-color: ${props => props.isSelected ? '#f7f7f7' : '#ffffff'};

  &:hover {
    border-color: #222222;
  }
`;

const RadioCircle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid ${props => props.isSelected ? '#222222' : '#b0b0b0'};
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;

  &::after {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #222222;
    display: ${props => props.isSelected ? 'block' : 'none'};
  }
`;

const CardTextContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const OptionLabel = styled.span`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const OptionDescription = styled.span`
  font-size: 14px;
  color: #717171;
  line-height: 1.4;
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


// --- Main Component ---
function Step13Content() {
   const [choice, setChoice] = useState('any'); // Default to 'any' based on screenshot
  const router = useRouter();
  const handleFinish = async () => {
    // 1. Pehla no badho data upado
    const existingData = JSON.parse(localStorage.getItem('propertyData') || '{}');

    // 2. Aa chella page no choice merge karo
    const updatedData = {
      ...existingData,
      first_reservation_choice: choice
    };

    // 3. Local storage ma save karo (Backup mate)
    localStorage.setItem('propertyData', JSON.stringify(updatedData));

    // 4. API CALL LOGIC (Ahi tame Django ne data moklavsho)
    console.log("Final Data to Send:", updatedData);

    // Have Final API Submit function call karo (niche batavyu che)
    await submitToBackend(updatedData);
  };
  const submitToBackend = async (finalData) => {
    const formData = new FormData();
    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId) {
                alert("મહેરબાની કરીને પહેલા લોગિન કરો!");
                return;
            }
    const categoryMap = {
      'Flat/apartment': 'flat',
      'House': 'home',
      'Boat': 'home',
      'Row House': 'row_house'
    };

    const privacyMap = {
      'room': 'private_room',
      'entire_home': 'entire_home',
      'shared_room': 'shared_room'
    };
    // મોડેલના નામ મુજબ મેન્યુઅલી એપેન્ડ કરો
    formData.append('home_type', categoryMap[finalData.category] || 'home');
    formData.append('room_privacy_type', privacyMap[finalData.privacy_type] || 'private_room');

    // Address Fields
    formData.append('country', finalData.country);
    formData.append('city', finalData.city);
    formData.append('state', finalData.state);
    formData.append('district', finalData.district);
    formData.append('pincode', finalData.pincode);
    formData.append('street_name', finalData.street || ''); // street -> street_name
    formData.append('nearby_landmark', finalData.landmark || '');

    // Counts
    formData.append('guest_count', finalData.guests_count);
    formData.append('bedroom_count', finalData.bedrooms_count);
    formData.append('bed_count', finalData.beds_count);
    formData.append('bathroom_count', finalData.bathrooms_count);

    // Title, Desc & Price
    formData.append('title', finalData.title);
    formData.append('description', finalData.description);
    formData.append('price_per_night', finalData.base_price);

    // Discounts (Boolean fields મુજબ)
    formData.append('discount_new_listing', finalData.discounts?.includes('newListing') || false);
    formData.append('discount_weekly', finalData.discounts?.includes('weekly') || false);
    formData.append('discount_last_minute', finalData.discounts?.includes('lastMinute') || false);

    // Booking Settings
    formData.append('approve_first_5', finalData.booking_type === 'approve');
    formData.append('use_instant_book', finalData.booking_type === 'instant');
    formData.append('allowed_to_reserve', finalData.first_reservation_choice);

    console.log("Files to upload:", window.uploadedFiles);

    if (window.uploadedFiles && window.uploadedFiles.length >= 5) {
      formData.append('img1', window.uploadedFiles[0]);
      formData.append('img2', window.uploadedFiles[1]);
      formData.append('img3', window.uploadedFiles[2]);
      formData.append('img4', window.uploadedFiles[3]);
      formData.append('img5', window.uploadedFiles[4]);
    } else {
      alert("કૃપા કરીને 5 ફોટા અપલોડ કરો.");
      return; // જો 5 ફોટા ન હોય તો આગળ ન વધવું
    }
    // Host ID (તમારે લોગિન થયેલા યુઝરની ID મોકલવી પડશે)
    // અત્યારે ટેસ્ટિંગ માટે 1 મોકલી શકાય, પણ પ્રોડક્શનમાં Auth Token વાપરવો
    formData.append('host', currentUserId);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/accounts/properties/create/', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) 
        {alert("Listed Successfully!");
          router.push('/Host_dashboard');
        }
    } catch (err) { console.error(err); }
  };
  return (
    <PageContainer>
      <Header />

      <Main>
        <ContentBox>
          <Title>Choose who to welcome for your first reservation</Title>
          <Subtitle>
            After your first guest anyone can book your place. <a href="#">Learn more</a>
          </Subtitle>

          {/* Option: Any Airbnb Guest */}
          <SelectionCard
            isSelected={choice === 'any'}
            onClick={() => setChoice('any')}
          >
            <RadioCircle isSelected={choice === 'any'} />
            <CardTextContent>
              <OptionLabel>Any Airbnb guest</OptionLabel>
              <OptionDescription>
                Get reservations faster when you welcome anyone from the Airbnb community.
              </OptionDescription>
            </CardTextContent>
          </SelectionCard>

          {/* Option: Experienced Guest */}
          <SelectionCard
            isSelected={choice === 'experienced'}
            onClick={() => setChoice('experienced')}
          >
            <RadioCircle isSelected={choice === 'experienced'} />
            <CardTextContent>
              <OptionLabel>An experienced guest</OptionLabel>
              <OptionDescription>
                For your first guest, welcome someone with a good track record on Airbnb who can offer tips for how to be a great Host.
              </OptionDescription>
            </CardTextContent>
          </SelectionCard>
        </ContentBox>
      </Main>
      <Footer>
        <ProgressBarContainer>
          <Progress />
        </ProgressBarContainer>
        <FooterNav>
          <BackLink onClick={() => router.back()}>Back</BackLink>
          <NextButton
            onClick={handleFinish}
          >
            Finish
          </NextButton>
        </FooterNav>
      </Footer>
    </PageContainer>
  );
}
export default function FirstReservationPage() {
   return (
      <Suspense fallback={<div>Loading Step 11...</div>}>
        <Step13Content />
      </Suspense>
    );
}