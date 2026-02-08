import styled from "@emotion/styled";
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation';
import axios from 'axios';



// --- Styled Components (CSS-in-JS) ---

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  /* padding: 40px થી ઘટાડીને 10px અથવા 20px કરી શકાય */
  padding: 10px 24px 40px 24px; 
  font-family: sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-bottom પણ થોડી ઓછી કરી છે જેથી હેડર અને કાર્ડ નજીક આવે */
  margin-bottom: 16px; 
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #222222;
`;

const NavButtons = styled.div`
  display: none;
  gap: 8px;
  @media (min-width: 768px) {
    display: flex;
  }
`;

const RoundButton = styled.button`
  padding: 8px;
  border: 1px solid #dddddd;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  transition: box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

// --- Styled Components માં નીચે મુજબ ફેરફાર કરો ---

const SliderTrack = styled.div`
  display: flex;
  /* 5 કાર્ડ વચ્ચે 16px નો ગેપ રાખવા માટે */
  gap: 16px; 
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 16px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Card = styled.div`
  /* ડેસ્કટોપ પર એકસાથે 5 કાર્ડ બતાવવા માટે */
  flex: 0 0 calc((100% - (16px * 4)) / 5);
  min-width: 0; /* આ પ્રોપર્ટી ઈમેજને કન્ટેનરની બહાર જતી અટકાવશે */
  scroll-snap-align: start;
  cursor: pointer;

  @media (max-width: 1024px) {
    flex: 0 0 calc((100% - (16px * 2)) / 3);
  }
  
  @media (max-width: 640px) {
    flex: 0 0 calc(100% - 40px);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  /* aspect-ratio ને બદલે padding-bottom નો ઉપયોગ કરવો વધુ સ્ટેબલ છે */
  padding-bottom: 100%; 
  overflow: hidden;
  border-radius: 12px;
  background-color: #f3f4f6;
`;

const PropertyImage = styled.img`
  position: absolute; /* Wrapper ની અંદર ફિક્સ કરવા માટે */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* આ પ્રોપર્ટી ફોટાને ખેંચાયા વગર પરફેક્ટ ફિટ કરશે */
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: white;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const HeartButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.1);
  }
`;

const Content = styled.div`
  margin-top: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const PropertyTitle = styled.h3`
  font-weight: 600;
  font-size: 15px;
  color: #222222;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 80%;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
`;

const PriceTag = styled.p`
  font-size: 15px;
  margin-top: 4px;
  color: #717171;
`;




export default function PropertySlider() {
  const scrollRef = useRef(null);
  const [dbProperties, setDbProperties] = useState([]); 
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      try {
     const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/properties/`);
      
      // જો રિસ્પોન્સ ઓકે ના હોય તો એરર ફેંકો
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // ડેટાને JSON માં કન્વર્ટ કરો
      setDbProperties(data); // હવે ડેટા સેટ કરો
      } catch (error) {
        console.error("Fetching error:", error);
      }
    };
    getData();
  }, []);
  const groupedProperties = dbProperties.reduce((acc, property) => {
  const city = property.city || "Other Cities";
  if (!acc[city]) {
    acc[city] = [];
  }
  acc[city].push(property);
  return acc;
}, {});
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };
  const handleCardClick = (property) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
      
      router.push(`/Host/reservation/${property.id}`);
    } else {
     
      alert("Please login to see reservation details");
      
    }
  };

  return (
    <Container>
    {Object.keys(groupedProperties).map((city) => (
      <div key={city} style={{ marginBottom: '40px' }}>
      <Header>
        <Title>Available next month in {city}</Title>
        <NavButtons>
          <RoundButton onClick={() => scroll('left')}>
            <ChevronLeft size={20} />
          </RoundButton>
          <RoundButton onClick={() => scroll('right')}>
            <ChevronRight size={20} />
          </RoundButton>
        </NavButtons>
      </Header>

     <SliderTrack ref={scrollRef}>
 {groupedProperties[city].map((property) => (
    <Card key={property.id} onClick={() => handleCardClick(property)}>
      <ImageWrapper>
       
              <PropertyImage src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${property.img1}`} />

              
        <Badge>Guest favourite</Badge>
       <HeartButton onClick={(e) => {
              e.preventDefault();
             
          }}>
          <Heart size={24} fill="rgba(0,0,0,0.3)" />
        </HeartButton>
      </ImageWrapper>

      <Content>
        <InfoRow>
          <PropertyTitle>{property.title}</PropertyTitle>
          <Rating>
            <Star size={14} fill="currentColor" />
            4.9
          </Rating>
        </InfoRow>
        <PriceTag>
          <b style={{ color: '#222222' }}>₹{property.price_per_night}</b> night
        </PriceTag>
      </Content>
    </Card>
  ))}
</SliderTrack>
</div>
    ))}
    </Container>
  );
}