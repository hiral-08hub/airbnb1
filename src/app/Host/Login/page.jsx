"use client";
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple, FaEnvelope } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';


const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center; /* આનાથી લોગિન બોક્સ સેન્ટરમાં રહેશે */
  z-index: 2000;
  overflow-y: auto; /* જો બોક્સ મોટું હોય તો સ્ક્રોલ થશે */
  padding: 40px 0;  /* ઉપર-નીચે થોડી જગ્યા રહેશે */
`;

const LoginContainer = styled.div`
  background: white;
  width: 100%;
  max-width: 560px;
  border-radius: 12px;
  position: relative; /* ક્લોઝ આઇકોન માટે */
  margin: auto;      /* સેન્ટરમાં રાખવા માટે મદદરૂપ */
  box-shadow: 0 8px 28px rgba(0,0,0,0.28);
  
  /* બ્રાઉઝરની હાઈટ ઓછી હોય ત્યારે કન્ટેન્ટ કટ ન થાય તે માટે */
  max-height: calc(100vh - 80px); 
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  padding: 24px;
  overflow-y: auto; /* ફક્ત અંદરના ભાગમાં સ્ક્રોલબાર લાવવા માટે */
  
  /* સ્ક્રોલબારને સુંદર બનાવવા માટે (Optional) */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 10px;
  }

  h3 { font-size: 22px; margin-bottom: 24px; font-weight: 600; }
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  
  .close-icon { font-size: 24px; cursor: pointer; }
  h2 { flex: 1; text-align: center; font-size: 16px; font-weight: 800; margin: 0; }
`;


const InputGroup = styled.div`
  border: 1px solid #b0b0b0;
  border-radius: 8px;
  margin-bottom: 15px;

  select {
    width: 100%;
    padding: 18px 12px 5px 12px;
    border: none;
    border-bottom: 1px solid #b0b0b0;
    outline: none;
    font-size: 16px;
    color: #717171;
  }

  input {
    width: 100%;
    padding: 18px 12px;
    border: none;
    outline: none;
    font-size: 16px;
  }
`;

const PrivacyText = styled.p`
  font-size: 12px;
  color: #222;
  margin-bottom: 20px;
  line-height: 1.5;
  a { text-decoration: underline; font-weight: 600; cursor: pointer; }
`;

const MainBtn = styled.button`
  width: 100%;
  background: linear-gradient(to right, #E31C5F 0%, #D70466 100%);
  color: white;
  padding: 14px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  position: relative; 
  z-index: 9999; 
  cursor: pointer;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #717171;
  font-size: 12px;
  &::before, &::after { content: ""; flex: 1; height: 1px; background: #ddd; margin: 0 10px; }
`;

const SocialBtn = styled.button`
  width: 100%;
  background: white;
  border: 1px solid #222;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  position: relative;

  .icon { font-size: 20px; position: absolute; left: 24px; }
  span { width: 100%; text-align: center; }

  &:hover { background: #f7f7f7; }
`;

export default function LoginPage({ onClose, onLoginSuccess, setIsLoggedIn, setUserName }) {
  const router = useRouter();
  // ૧. સ્ટેટ ઉમેરો

  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showSignup, setShowSignup] = useState(false); // Signup modal દેખાડવા માટે
  const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '' });

  const handleContinue = async () => {
    if (phoneNumber.length === 10) {
      try {
        const response = await fetch('http://localhost:8000/api/accounts/check-phone/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone_number: phoneNumber }),
        });

        const data = await response.json();

        if (data.exists) {
          // જૂના અથવા નવા યુઝર માટે એક જ ફોર્મેટ રાખો
          const nameToSave = data.first_name || data.firstName || userData.firstName || "User";

          
          if (data.access) {
        localStorage.setItem('token', data.access); 
    }
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userName', nameToSave); // આલ્ફાબેટ માટે
          localStorage.setItem('userPhone', phoneNumber);
          localStorage.setItem('userId', data.id);

          // આખી ઓબ્જેક્ટ પણ સેવ કરો જેથી Navbar ને વાંધો ન આવે
          localStorage.setItem('user', JSON.stringify({ firstName: nameToSave }));
          // Redux અથવા Header state અપડેટ કરવા માટે
          
          window.location.reload();
          alert("Welcome back");
          onClose();
        } else {
          setShowSignup(true);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    } else {
      setError('Please enter a 10-digit number.');
    }
  }
  // સ્ટેપ ૨: નવો યુઝર ડેટાબેઝમાં સેવ કરવા માટે
  const handleFinalSignup = async () => {


    try {
      const response = await fetch('http://127.0.0.1:8000/api/accounts/complete-signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phoneNumber,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // જૂના અથવા નવા યુઝર માટે એક જ ફોર્મેટ રાખો
        const nameToSave = data.first_name || data.firstName || userData.firstName || "User";

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', nameToSave); // આલ્ફાબેટ માટે
        localStorage.setItem('userPhone', phoneNumber);
        localStorage.setItem('userId', data.id);

        // આખી ઓબ્જેક્ટ પણ સેવ કરો જેથી Navbar ને વાંધો ન આવે
        localStorage.setItem('user', JSON.stringify({ firstName: nameToSave }));
        if (setIsLoggedIn) setIsLoggedIn(true);
        if (setUserName) setUserName(nameToSave);
        if (onClose) onClose();
        //alert("Account Created & Logged In!");
        window.location.reload();
       
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  return (
    <div className="relative">
      {/* મુખ્ય મોડલ ઓવરલે જે બંને ફોર્મ માટે કોમન રહેશે */}
      <ModalOverlay onClick={onClose}>
        <LoginContainer onClick={(e) => e.stopPropagation()}>

          {/* Header: જે showSignup મુજબ નામ બદલશે */}
          <Header>
            <IoCloseOutline
              className="close-icon"
              onClick={showSignup ? () => setShowSignup(false) : onClose}
            />
            <h2>{showSignup ? "Finish signing up" : "Log in or sign up"}</h2>
          </Header>

          <Content>
            {!showSignup ? (
              /* --- લોગિન વિભાગ --- */
              <>
                <h3>Welcome to Airbnb</h3>
                <InputGroup>
                  <select>
                    <option>India (+91)</option>
                    <option>United States (+1)</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={phoneNumber}
                    maxLength={10}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (error) setError("");
                    }}
                  />
                </InputGroup>

                {error && (
                  <p style={{ color: '#ff385c', fontSize: '12px', marginBottom: '15px' }}>
                    ⚠️ {error}
                  </p>
                )}

                <PrivacyText>
                  We’ll call or text you to confirm your number. Standard message and data rates apply. <a>Privacy Policy</a>
                </PrivacyText>

                <MainBtn onClick={handleContinue}>Continue</MainBtn>

                <Divider>or</Divider>
                <SocialBtn><FaFacebook className="icon" color="#1877F2" /> <span>Continue with Facebook</span></SocialBtn>
                <SocialBtn><FcGoogle className="icon" /> <span>Continue with Google</span></SocialBtn>
                <SocialBtn><FaApple className="icon" /> <span>Continue with Apple</span></SocialBtn>
                <SocialBtn><FaEnvelope className="icon" /> <span>Continue with email</span></SocialBtn>
              </>
            ) : (
              /* --- સાઇનઅપ વિભાગ (તમારા કોડ મુજબ) --- */
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden border-gray-400">
                  <input
                    type="text"
                    placeholder="First name"
                    className="w-full p-4 border-b outline-none focus:bg-gray-50 transition-all"
                    onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    className="w-full p-4 border-b outline-none focus:bg-gray-50 transition-all"
                    onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-4 outline-none focus:bg-gray-50 transition-all"
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  />
                </div>

                <p className="text-[12px] text-gray-500 leading-tight">
                  We'll email you trip confirmations and receipts.
                </p>

                <button
                  className="w-full bg-[#FF385C] text-white font-bold py-3 rounded-lg hover:bg-[#E31C5F] transition text-[16px]"
                  onClick={handleFinalSignup}>
                  Agree and continue
                </button>
              </div>
            )}
          </Content>
        </LoginContainer>
      </ModalOverlay>
    </div>
  );
}