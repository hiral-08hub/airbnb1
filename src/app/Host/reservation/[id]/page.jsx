
"use client";
import React, { useState, useEffect,useCallback } from 'react';
import { useParams,useRouter } from 'next/navigation';
import axios from 'axios';
import styled from "@emotion/styled";
import Navbar1 from "../../../components/Navbar/Navbar1";
import Footer1 from "../../../components/Footer/page";
import { format } from 'date-fns'; // તારીખ ફોર્મેટ કરવા માટે
import { DateRange } from 'react-date-range';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Share, Heart } from 'lucide-react';

const ListingDetails = () => {
  const router = useRouter();

    const handleMessageClick = () => {
        router.push('/Host/Host_dashboard');
    };
    const params = useParams(); // URL માંથી ID લેવા માટે
    const id = params.id; 
    const { isLoaded } = useJsApiLoader({
  id: 'google-map-script',
  googleMapsApiKey: "AIzaSyAW3Me7nlD9dhS4nTlNyFbPFR5SM_KrOG0" // તમારી સાચી API Key અહીં નાખો
});
const center = {
  lat: 15.2520,
  lng: 73.9317
};
    
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectionRange, setSelectionRange] = useState({
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection',
});
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // તમારી Django API લિંક
                const response = await axios.get(`http://127.0.0.1:8000/api/Host/reservation/${id}/`);
                console.log("Full Data:", response.data); // અહીં તમને હોસ્ટનો ડેટા પણ દેખાશે
                setProperty(response.data);
                setLoading(false);
               
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        if (id) fetchDetails();
    }, [id]);

    const savebtn = async (propertyId) => {
    try {
        // localStorage માંથી userId લો (જો લોગિન વખતે સેવ કર્યું હોય) 
        // અથવા ટેસ્ટિંગ માટે કોઈ ફિક્સ ID (દા.ત. 1) મોકલો
        const userId = localStorage.getItem('userId') || 1; 

        const response = await axios.post(
            'http://127.0.0.1:8000/api/accounts/wishlist/toggle/', 
            { 
                property_id: propertyId,
                user_id: userId  // સીધું ID મોકલો
            }
            // Headers અહીંથી કાઢી નાખ્યા છે
        );
         if (response.data.message === "Added to wishlist") {
            setIsLiked(true);  // હાર્ટ લાલ થશે
        } else if (response.data.message === "Removed from wishlist") {
            setIsLiked(false); // હાર્ટ પાછું સફેદ/ગ્રે થશે
        }

        console.log(response.data.message);
       
        //alert(response.data.message);
    } catch (error) {
        console.error("Error:", error);
        alert("સેવ કરવામાં ભૂલ આવી.");
    }
};
    if (loading) return <div style={{ padding: '50px' }}>Loading...</div>;
    
    if (!property) return <div style={{ padding: '50px' }}>Property not found! (ID: {id})</div>;
    

 return (
  <>
    <Container>
      <Navbar1 />
      
     {/* --- HEADER --- */}
<header style={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', // અહીં 'center' કરવાથી ટાઇટલ અને બટન્સ એક લાઈનમાં આવશે
  marginTop:'50px',
  marginBottom: '20px', 
  padding: '0 5px' 
}}>
  <Title style={{ 
    fontSize: '26px', 
    fontWeight: '600', 
    color: '#222' 
  }}>
    {property.title || "Rose Meadow Studio flat Madgao"}
  </Title>

  <div style={{ display: 'flex', gap: '15px' }}>
    {/* SHARE BUTTON */}
    <button style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      textDecoration: 'underline',
      padding: '8px',
      borderRadius: '8px',
      transition: 'background 0.2s'
    }} 
    onMouseEnter={(e) => e.target.style.background = '#f7f7f7'}
    onMouseLeave={(e) => e.target.style.background = 'none'}>
      <Share size={16} strokeWidth={2.5} /> Share
    </button>

    {/* SAVE BUTTON */}
    <button 
      onClick={() => savebtn(property.id)}
      style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      textDecoration: 'underline',
      padding: '8px',
      borderRadius: '8px',
      transition: 'background 0.2s'
    }}
    onMouseEnter={(e) => e.target.style.background = '#f7f7f7'}
    onMouseLeave={(e) => e.target.style.background = 'none'}>
      <Heart size={16} strokeWidth={2.5} 
        fill={isLiked ? "#FF385C" :"white"} 
        stroke={isLiked ? "#FF385C" : "#ad4949"} /> Save
    </button>
  </div>
</header>

      {/* --- PHOTO GRID --- */}
      <PhotoGrid style={{ position: 'relative' }}>
        <MainImage src={`http://127.0.0.1:8000${property.img1}`} alt="Main" />
        <SubImage src={`http://127.0.0.1:8000${property.img2}`} alt="Gallery" />
        <SubImage src={`http://127.0.0.1:8000${property.img3}`} alt="Gallery" />
        <SubImage src={`http://127.0.0.1:8000${property.img4}`} alt="Gallery" />
        <SubImage src={`http://127.0.0.1:8000${property.img5}`} alt="Gallery" />
        <button style={{ position: 'absolute', bottom: '24px', right: '24px', padding: '7px 15px', backgroundColor: 'white', border: '1px solid black', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
          ⠿ Show all photos
        </button>
      </PhotoGrid>

      {/* --- MAIN LAYOUT (Content + Sticky Sidebar) --- */}
      <MainLayoutSection style={{ display: 'flex', justifyContent: 'space-between', gap: '40px', marginTop: '32px', position: 'relative', padding: '0 20px' }}>
        
        <div style={{ flex: '2' }}>
          {/* ૧. વિગતો */}
          <section style={{ paddingBottom: '24px', borderBottom: '1px solid #ddd' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '600' }}>{property.home_type || "Private room"}</h2>
            <div>{property.guest_count} guests · {property.bedroom_count} bedroom · {property.bed_count || '1'} bed · {property.bathroom_count} bath</div>
          </section>

          {/* ૨. હોસ્ટ */}
          <section style={{ padding: '24px 0', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden' }}>
              <img src={property.img1 || "https://via.placeholder.com/40"} alt="Host" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontWeight: '600' }}>Hosted by {property.host?.first_name || "Manveer"}</div>
              <div style={{ color: '#717171', fontSize: '14px' }}>10 years hosting</div>
            </div>
          </section>

          {/* ૩. Amenities 
          <section style={{ padding: '48px 0', borderBottom: '1px solid #ddd' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '24px' }}>What this place offers</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>📶 Wifi</div>
              <div>🚗 Free parking</div>
              <div>🐾 Pets allowed</div>
              <div>🌳 Garden</div>
            </div>
          </section>*/}

          {/* ૪. કેલેન્ડર સેક્શન (આના પછી કાર્ડ અટકી જશે) */}
          <CalendarSection>
            <CalendarHeader>
              <h3>{selectionRange.startDate !== selectionRange.endDate ? `${Math.ceil((selectionRange.endDate - selectionRange.startDate) / (1000 * 60 * 60 * 24))} nights in ${property?.city}` : "Select dates"}</h3>
              <p>{format(selectionRange.startDate, "dd MMM")} - {format(selectionRange.endDate, "dd MMM")}</p>
            </CalendarHeader>
            <DateRange
              ranges={[selectionRange]}
              onChange={(item) => setSelectionRange(item.selection)}
              months={2}
              direction="horizontal"
              rangeColors={["#222222"]}
              showDateDisplay={false}
            />
            <CalendarFooter>
              <button onClick={() => setSelectionRange({ startDate: new Date(), endDate: new Date(), key: 'selection' })}>Clear dates</button>
            </CalendarFooter>
          </CalendarSection>
        </div>

        <aside style={{ 
  flex: '0 0 370px',  /* ફિક્સ વિડ્થ આપવી જરૂરી છે જેથી તે ખેંચાય નહીં */
  position: 'sticky', 
  top: '100px', 
  height: 'fit-content',
  marginLeft: '40px' 
}}>
  <BookingCard style={{ 
    border: '1px solid #ddd', 
    borderRadius: '12px', 
    padding: '24px', 
    boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
    background: 'white' 
  }}>
    <div style={{ fontSize: '22px', fontWeight: '600', marginBottom: '24px' }}>
      ₹{property.price_per_night} <span style={{ fontSize: '16px', fontWeight: '400', color: '#717171' }}>/ night</span>
    </div>
    
    {/* ચેક-ઈન / આઉટ બોક્સ (તમારા સ્ક્રીનશોટ મુજબ) */}
    <div style={{ border: '1px solid #717171', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid #717171' }}>
        <div style={{ flex: 1, padding: '10px', borderRight: '1px solid #717171' }}>
          <label style={{ fontSize: '10px', fontWeight: '800' }}>CHECK-IN</label>
          <div style={{ fontSize: '14px' }}>{format(selectionRange.startDate, "MM/dd/yyyy")}</div>
        </div>
        <div style={{ flex: 1, padding: '10px' }}>
          <label style={{ fontSize: '10px', fontWeight: '800' }}>CHECKOUT</label>
          <div style={{ fontSize: '14px' }}>{format(selectionRange.endDate, "MM/dd/yyyy")}</div>
        </div>
      </div>
      <div style={{ padding: '10px' }}>
        <label style={{ fontSize: '10px', fontWeight: '800' }}>GUESTS</label>
        <div style={{ fontSize: '14px' }}>1 guest</div>
      </div>
    </div>

    <ReserveButton style={{
      width: '100%',
      backgroundColor: '#E31C5F',
      color: 'white',
      padding: '14px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer'
    }}>
      Reserve
    </ReserveButton>
    <div style={{ textAlign: 'center', marginTop: '12px', color: '#717171', fontSize: '14px' }}>
      You won't be charged yet
    </div>
  </BookingCard>
  
  <div style={{ textAlign: 'center', marginTop: '20px', textDecoration: 'underline', cursor: 'pointer', color: '#717171', fontSize: '14px' }}>
    🚩 Report this listing
  </div>
</aside>
      </MainLayoutSection>

      {/* --- રીવ્યુ સેક્શન (Full Width & Centered) --- */}
      <ReviewSection style={{ width: '100%', borderTop: '1px solid #ddd', marginTop: '48px', padding: '48px 20px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <ReviewSummary>★ 4.84 · 44 reviews</ReviewSummary>
          <RatingsGrid>
            <RatingItem><h4>Overall rating</h4>{/* Bars here */}</RatingItem>
            <RatingItem><h4>Cleanliness</h4><span>4.8</span><span style={{ fontSize: '24px' }}>🧹</span></RatingItem>
            <RatingItem><h4>Accuracy</h4><span>4.8</span><span style={{ fontSize: '24px' }}>✅</span></RatingItem>
            <RatingItem><h4>Check-in</h4><span>4.9</span><span style={{ fontSize: '24px' }}>🔑</span></RatingItem>
            <RatingItem><h4>Communication</h4><span>4.9</span><span style={{ fontSize: '24px' }}>💬</span></RatingItem>
            <RatingItem><h4>Location</h4><span>4.4</span><span style={{ fontSize: '24px' }}>🗺️</span></RatingItem>
            <RatingItem noBorder><h4>Value</h4><span>4.8</span><span style={{ fontSize: '24px' }}>🏷️</span></RatingItem>
          </RatingsGrid>
        </div>
      </ReviewSection>
      {/* --- Individual User Reviews --- */}
<UserReviewGrid>
  {[
    {
      name: "Alok",
      stay: "New to Airbnb",
      date: "1 week ago",
      text: "Masood bhai is really a great guy, I also from Pauri Garhwal, Uttarakhand stayed here in a bindass way and in garhwali language...",
      img: "https://via.placeholder.com/48"
    },
    {
      name: "Aditya",
      stay: "2 years on Airbnb",
      date: "3 weeks ago",
      text: "The stay was decent. The flat is good enough for two guests. The caretaker, Ismail, was very helpful in ensuring a smooth check-in...",
      img: "https://via.placeholder.com/48"
    },
    {
      name: "Anuradha",
      stay: "4 months on Airbnb",
      date: "November 2025",
      text: "I stayed at SAS Holiday Home in Madgaon, Goa, and had a really good experience! The room was clean, comfortable, and had everything we needed.",
      img: "https://via.placeholder.com/48"
    },
    {
      name: "Praveen Kumar",
      stay: "3 years on Airbnb",
      date: "December 2025",
      text: "SAS Holiday Homes was a cozy and comfortable stay, exactly as described. All the amenities were provided as promised.",
      img: "https://via.placeholder.com/48"
    }
  ].map((review, index) => (
    <IndividualReview key={index}>
      <UserInfo>
        <img src={review.img} alt={review.name} />
        <div>
          <div className="name">{review.name}</div>
          <div className="duration">{review.stay}</div>
        </div>
      </UserInfo>
      
      <div style={{ display: 'flex', gap: '4px', fontSize: '12px' }}>
        <span>★ ★ ★ ★ ★</span>
        <span style={{ fontWeight: '600' }}>· {review.date}</span>
      </div>

      <ReviewText>
        {review.text}
      </ReviewText>
      
      <ShowMoreBtn>Show more {'>'}</ShowMoreBtn>
    </IndividualReview>
  ))}
</UserReviewGrid>

<button style={{ 
  marginTop: '48px', 
  padding: '13px 23px', 
  borderRadius: '8px', 
  border: '1px solid #222', 
  background: 'white', 
  fontWeight: '600', 
  cursor: 'pointer' 
}}>
  Show all 44 reviews
</button>
{/* --- LOCATION SECTION --- */}
<div style={{ maxWidth: '1120px', margin: '48px auto', padding: '0 20px', borderTop: '1px solid #ddd', paddingTop: '48px' }}>
  <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px' }}>Where you’ll be</h2>
  <div style={{ fontSize: '16px', marginBottom: '24px' }}>
    {property.city || "Benaulim"}, Goa, India
  </div>

  {/* Google Map Library નો ઉપયોગ કરીને */}
 <div style={{ width: '100%', height: '480px', borderRadius: '12px', overflow: 'hidden' }}>
    {/* 💡 અહીં isLoaded ચેક હોવો ખૂબ જરૂરી છે */}
    {isLoaded ? (
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={14}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        <Marker position={center} />
      </GoogleMap>
    ) : (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        background: '#f7f7f7', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        Loading Google Maps...
      </div>
    )}
  </div>
  <div>
    <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>{property.city || "Benaulim"}, Goa</h4>
    <p style={{ color: '#222', lineHeight: '24px', maxWidth: '800px' }}>
      The neighborhood is peaceful and located close to the beach. You can find local cafes, 
      grocery stores, and rental services within walking distance.
    </p>
    <button style={{ 
      background: 'none', 
      border: 'none', 
      textDecoration: 'underline', 
      fontWeight: '600', 
      padding: '0', 
      cursor: 'pointer',
      marginTop: '16px' 
    }}>
      Show more {'>'}
    </button>
  </div>
</div>
{/* --- MEET YOUR HOST SECTION --- */}
<HostSection>
  <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '24px' }}>Meet your host</h2>
  
  <div style={{ display: 'flex', gap: '80px', flexWrap: 'wrap' }}>
    
    {/* Host Profile Card */}
    <HostCard style={{ 
  display: 'flex', 
  flexDirection: 'row', 
  alignItems: 'center', 
  gap: '32px', 
  padding: '24px',
  minWidth: '380px' 
}}>
      <div style={{ textAlign: 'center', flex: '1' }}>
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img 
        src={"https://via.placeholder.com/100"} 
        alt="Host" 
        style={{ width: '104px', height: '104px', borderRadius: '50%', objectFit: 'cover' }} 
      />
      <Badge>✓</Badge>
    </div>
    <h3 style={{ fontSize: '32px', fontWeight: '600', margin: '12px 0 4px' }}>
      {property.host?.first_name}
    </h3>
    <div style={{ fontSize: '14px', fontWeight: '600' }}>
      <span>🛡️</span> Superhost
    </div>
   
  </div>

  {/* જમણી બાજુ: વર્ટિકલ સ્ટેટ્સ (Reviews, Rating, Years) */}
  <div style={{ flex: '0.8', display: 'flex', flexDirection: 'column',justifyContent: 'center' }}>
    
    {/* Reviews */}
    <div style={{ paddingBottom: '12px', borderBottom: '1px solid #ddd' }}>
      <div style={{ fontWeight: '800', fontSize: '18px' }}>73</div>
      <div style={{ fontSize: '10px', fontWeight: '600' }}>Reviews</div>
    </div>

    {/* Rating */}
    <div style={{ padding: '12px 0', borderBottom: '1px solid #ddd' }}>
      <div style={{ fontWeight: '800', fontSize: '18px' }}>4.79 ★</div>
      <div style={{ fontSize: '10px', fontWeight: '600' }}>Rating</div>
    </div>

    {/* Years Hosting */}
    <div style={{ paddingTop: '12px' }}>
      <div style={{ fontWeight: '800', fontSize: '18px' }}>3</div>
      <div style={{ fontSize: '10px', fontWeight: '600' }}>Years hosting</div>
    </div>

  </div>
    </HostCard>
   
    

    {/* Host Details Text */}
    <div style={{ flex: 1, minWidth: '300px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>{property.host_name || "Bijo"} is a Superhost</h4>
        <p style={{ color: '#222', fontSize: '16px', lineHeight: '24px' }}>
          Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.
        </p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Host details</h4>
        <div style={{ fontSize: '16px', marginBottom: '4px' }}>Response rate: 80%</div>
        <div style={{ fontSize: '16px' }}>Responds within a few hours</div>
      </div>

      <button 
       onClick={() =>handleMessageClick()}
      style={{  
        padding: '13px 23px', 
        borderRadius: '8px', 
        background: '#222', 
        color: 'white', 
        fontWeight: '600', 
        border: 'none', 
        cursor: 'pointer',
        marginBottom: '24px'
      }}>
        Message host
      </button>

      <div style={{ borderTop: '1px solid #ddd', paddingTop: '16px', display: 'flex', gap: '12px', alignItems: 'center', fontSize: '12px' }}>
        <span style={{ color: '#ff385c', fontSize: '20px' }}>🛡️</span>
        <p>To help protect your payment, always use Airbnb to send money and communicate with hosts.</p>
      </div>
    </div>
  {/* --- HOST DETAILS SECTION (Card ની બરાબર નીચે) --- */}
<div style={{ 
  marginTop: '-80px', 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '16px',
  maxWidth: '380px', // આ વિડ્થ તમારા કાર્ડની વિડ્થ જેટલી જ રાખવી
  width: '100%'
}}>
  
  {/* Row 1: Born in the 80s */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <span style={{ fontSize: '20px' }}>🎈</span>
    <span style={{ fontSize: '16px' }}>Born in the 80s</span>
  </div>

  {/* Row 2: School (આ લાંબી લાઈન છે એટલે અહીં બ્રેક થશે) */}
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
    <span style={{ fontSize: '20px' }}>🎓</span>
    <span style={{ 
      fontSize: '16px', 
      lineHeight: '1.4', 
      wordBreak: 'break-word', // આ પ્રોપર્ટી લાઇન બ્રેક કરશે
      overflowWrap: 'break-word' 
    }}>
      Where I went to school: Rosary High School
    </span>
  </div>

  {/* Row 3: Bio Text */}
  <div style={{ 
    marginTop: '8px', 
    fontSize: '16px', 
    lineHeight: '1.5', 
    color: '#222',
    textAlign: 'left',
    wordWrap: 'break-word' // આનાથી પેરેગ્રાફ વિડ્થની બહાર નહીં જાય
  }}>
    Most ..diligent and service oriented yet amicable in attitude towards community. 
    lives upto commitment in pursuit of discipline
  </div>
  
</div>

  </div>
</HostSection>
<ThingsToKnowSection>
  <div style={{ maxWidth: '1120px', margin: '0 0 10px 0' }}>
    <h2 style={{ fontSize: '22px', fontWeight: '600' }}>Things to know</h2>
  </div>

  <ThingsToKnowGrid>
    {/* Cancellation Policy */}
    <InfoColumn>
      <span style={{ fontSize: '24px' }}>🗓️</span>
      <h4>Cancellation policy</h4>
      <ul>
        <li>Free cancellation before 15 February.</li>
        <li>Cancel before check-in on 20 February for a partial refund.</li>
        <li>Review this host's full policy for details.</li>
      </ul>
      <span className="learn-more">Learn more {'>'}</span>
    </InfoColumn>

    {/* House Rules */}
    <InfoColumn>
      <span style={{ fontSize: '24px' }}>🔑</span>
      <h4>House rules</h4>
      <ul>
        <li>Check-in: 12:00 pm – 8:00 pm</li>
        <li>Checkout before 10:00 am</li>
        <li>3 guests maximum</li>
      </ul>
      <span className="learn-more">Learn more {'>'}</span>
    </InfoColumn>

    {/* Safety & Property */}
    <InfoColumn>
      <span style={{ fontSize: '24px' }}>🛡️</span>
      <h4>Safety & property</h4>
      <ul>
        <li>Carbon monoxide alarm not reported</li>
        <li>Smoke alarm not reported</li>
        <li>Exterior security cameras on property</li>
      </ul>
      <span className="learn-more">Learn more {'>'}</span>
    </InfoColumn>
  </ThingsToKnowGrid>
</ThingsToKnowSection>
   
    </Container>
     <Footer1/>
    </>
  );
};
export default ListingDetails;


const Container = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px 20px;
  font-family: 'Circular', -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 600;
  color: #222222;
  margin-bottom: 8px;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 200px 200px;
  gap: 8px;
  border-radius: 12px;
  overflow: hidden;
  margin: 24px 0;
  position: relative;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: 300px;
  }
`;

const MainImage = styled.img`
  grid-row: span 2;
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  &:hover { filter: brightness(0.9); transition: 0.3s; }
`;

const SubImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  &:hover { filter: brightness(0.9); transition: 0.3s; }
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 80px;
  margin-top: 32px;

  @media (max-width: 950px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const BookingCard = styled.div`
  border: 1px solid rgb(221, 221, 221);
  border-radius: 12px;
  padding: 24px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 16px;
  position: sticky;
  top: 100px;
  height: fit-content;
`;

const ReserveButton = styled.button`
  width: 100%;
  background: linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
  &:active { transform: scale(0.98); }
`;
const CalendarSection = styled.section`
  padding: 48px 0;
  border-top: 1px solid #ddd;
  
  .rdrCalendarWrapper {
    font-family: inherit;
    width: 100% !important;
    background: transparent;
  }

  .rdrMonth {
    width: 320px !important;
    padding: 0 12px 0 0;
  }

  /* સિલેક્ટેડ ડેટનો કલર બ્લેક કરવા માટે (તમારી નવી ડિઝાઇન મુજબ) */
  .rdrDayRetracted {
    background: #222222 !important;
  }
  
  .rdrStartEdge, .rdrEndEdge, .rdrInRange {
    background: #222222 !important;
  }

  .rdrDayToday .rdrDayNumber span:after {
    background: #222222 !important;
  }
`;

const CalendarHeader = styled.div`
  margin-bottom: 24px;
  h3 {
    fontSize: 22px;
    fontWeight: 600;
    margin-bottom: 8px;
  }
  p {
    color: #717171;
    fontSize: 14px;
  }
`;

const CalendarFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  
  button {
    background: none;
    border: none;
    text-decoration: underline;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    padding: 0;
  }
`;
const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  color: #222;

  &:hover {
    background-color: #f7f7f7;
  }
`;
const ReviewSection = styled.section`
  padding: 48px 0;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  margin: 40px auto;
  max-width: 1120px; /* સેન્ટરમાં રાખવા માટે */
`;

const ReviewSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 32px;
`;
const ProgressBar = styled.div`
  width: 100%;
  max-width: 100px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .bar-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 10px;
    color: #717171;
  }

  .line-bg {
    flex: 1;
    height: 4px;
    background: #ddd;
    border-radius: 2px;
    position: relative;
  }

  .line-fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: #222;
    border-radius: 2px;
    width: ${(props) => props.width || '90%'};
  }
`;
const MainLayoutSection = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 80px;
  position: relative;
  max-width: 1120px;
  margin: 0 auto;

  .left-content {
    flex: 2;
  }

  .sidebar {
    flex: 1;
    position: sticky;
    top: 100px;
    height: fit-content; /* આનાથી કાર્ડ કેલેન્ડર પૂરું થતા અટકી જશે */
  }
`;

const FullWidthReviewSection = styled.section`
  width: 100%;
  border-top: 1px solid #ddd;
  margin-top: 40px;
  padding: 48px 0;
`;

const ReviewContainer = styled.div`
  max-width: 1120px;
  margin: 0 auto; /* આ રીવ્યુને સેન્ટરમાં રાખશે */
`;

const RatingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* ૭ કોલમમાં આઈકોન્સ સેટ થશે */
  gap: 20px;
  margin-top: 32px;
`;

const RatingItem = styled.div`
  border-right: 1px solid #ddd;
  padding-right: 10px;
  &:last-child { border-right: none; }
  
  h4 { font-size: 14px; margin-bottom: 8px; }
  .icon { font-size: 24px; margin-top: 10px; }
`;
const UserReviewGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* બે કોલમ લેઆઉટ */
  gap: 40px 80px; /* રો અને કોલમ વચ્ચેની જગ્યા */
  margin-top: 40px;
`;

const IndividualReview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }

  .name {
    font-weight: 600;
    font-size: 16px;
  }

  .duration {
    font-size: 14px;
    color: #717171;
  }
`;

const ReviewText = styled.p`
  line-height: 24px;
  font-size: 16px;
  color: #222;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* ૩ લાઈન પછી ટેક્સ્ટ છુપાઈ જશે */
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ShowMoreBtn = styled.button`
  background: none;
  border: none;
  text-decoration: underline;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  width: fit-content;
`;
const ThingsToKnowSection = styled.section`
  padding: 48px 0;
  border-top: 1px solid #ddd;
  margin-top: 0px;
  width: 100%;
`;

const ThingsToKnowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* ૩ કોલમ લેઆઉટ */
  gap: 40px;
  max-width: 1120px;
  margin: 0 auto;
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  h4 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  li {
    font-size: 14px;
    line-height: 20px;
    color: #222;
  }

  .learn-more {
    font-weight: 600;
    text-decoration: underline;
    cursor: pointer;
    margin-top: 4px;
    display: inline-block;
  }
`;
const HostSection = styled.section`
  padding: 48px 0;
  border-top: 1px solid #ddd;
  max-width: 1120px;
  margin: 0 auto;
`;

const HostCard = styled.div`
  background: #f0efe9; /* તમારા સ્ક્રીનશોટ મુજબ હળવો ગ્રે/બેજ કલર */
  border-radius: 24px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  min-width: 300px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
`;

const Badge = styled.div`
  background: #ff385c;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 12px;
`;