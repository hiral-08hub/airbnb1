"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import styled from '@emotion/styled';
import { UserCircle, Briefcase, Users, MessageSquare, Camera } from 'lucide-react';
import Header from '../Header';
import axios from 'axios';

// --- Styled Components ---

const PageContainer = styled.div`
  min-height: 100vh;
  font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  color: #222222;
  background: #ffffff;
`;

const MainContent = styled.main`
  max-width: 1080px;
  margin: 0 auto;
  padding: 48px 24px;
  display: flex;
  gap: 80px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
  }
`;

// --- Left Sidebar ---
const Sidebar = styled.aside`
  width: 280px;
  flex-shrink: 0;
`;

const SidebarTitle = styled.h1`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  background: ${props => props.active ? '#f7f7f7' : 'transparent'};
  font-weight: ${props => props.active ? '600' : '400'};
  margin-bottom: 8px;

  &:hover {
    background: #f7f7f7;
  }
`;

// --- Right Content ---
const ContentArea = styled.section`
  flex: 1;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 600;
`;

const EditButton = styled.button`
  background: #f7f7f7;
  border: 1px solid #222222;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const ProfileCard = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 40px;
`;

const AvatarCircle = styled.div`
  width: 104px;
  height: 104px;
  background: #222222;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const UserName = styled.h3`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const UserRole = styled.span`
  font-size: 14px;
  color: #717171;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid #ebebeb;
`;

const InfoBox = styled.div`
  flex: 1;
`;

const InfoHeading = styled.h4`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const InfoText = styled.p`
  color: #717171;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
`;

const ActionButton = styled.button`
  background: #e31c5f;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`;

const FooterText = styled.div`
  padding-top: 40px;
  border-top: 1px solid #ebebeb;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #222222;
`;

// --- Logic ---

export default function ProfilePage() {
  const [dbuser, setdbUser] = useState({
    name: "Guest",
    initial: "U",
    photo: null // ફોટો માટે નવું ફિલ્ડ
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const phone = localStorage.getItem('userPhone');
      if (!phone) return;

      try {
        // તમારા બેકએન્ડમાંથી યુઝરનો ડેટા લાવો
        const response = await axios.get(`http://127.0.0.1:8000/api/accounts/get_user_profile/${phone}/`);

        const userData = response.data;
        setdbUser({
          firstname: userData.firstName,
          lastname: userData.lastName,
          email:userData.email,
          initial: userData.firstName ? userData.firstName.charAt(0).toUpperCase() : "U",
          photo: userData.profile_picture || null // ડેટાબેઝમાંથી મળેલી ઈમેજ URL
        });

        // LocalStorage ને પણ લેટેસ્ટ ડેટાથી અપડેટ કરી દો
        localStorage.setItem('userName', userData.firstName);
        if (userData.profile_picture) {
          localStorage.setItem('userPhoto', userData.profile_picture);
        }
      } catch (error) {
        console.error("Error fetching user from DB:", error);
      }
    };

    fetchUserData();
    window.addEventListener('storage', fetchUserData);
  }, []);
  const toggleEdit = () => setIsEditing(!isEditing);
  return (
    <PageContainer>
        <Suspense fallback={<div>Loading header...</div>}>
          <Header isProfilePage={true} />
        </Suspense>
      <MainContent>
        {/* Left Sidebar */}
        <Sidebar>
          <SidebarTitle>Profile</SidebarTitle>
          <NavItem active>
            <UserCircle size={24} />
            About me
          </NavItem>
          <NavItem>
            <Briefcase size={24} />
            Past trips
          </NavItem>
          <NavItem>
            <Users size={24} />
            Connections
          </NavItem>
        </Sidebar>

        <ContentArea>
          {isEditing ? (
            /* --- આ એડિટ પ્રોફાઇલ પેજની ડિઝાઇન છે --- */
            <div>
              <SectionHeader>
                <SectionTitle>Edit Profile</SectionTitle>
              </SectionHeader>

              {/* અહીં અગાઉ આપેલી ProfileEditBody ડિઝાઇન મૂકી શકાય */}
              <ProfileEditBody onDone={toggleEdit} user={dbuser} />
            </div>
          ) : (
            /* --- આ તમારો ઓરિજિનલ પ્રોફાઇલ વ્યુ છે --- */
            <>
              <SectionHeader>
                <SectionTitle>About me</SectionTitle>
                {/* Edit બટન પર onClick ઉમેર્યું */}
                <EditButton onClick={toggleEdit}>Edit</EditButton>
              </SectionHeader>

              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                <ProfileCard>
                  <AvatarCircle>
                    {dbuser.photo ? (
                      <img
                        src={dbuser.photo}
                        alt="Profile"
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          // ૧. જો ઈમેજ લિંક ખોટી હોય, તો ફોટોની વેલ્યુ નલ કરી દો
                          setdbUser(prev => ({ ...prev, photo: null }));
                        }}
                      />
                    ) : (
                      // ૨. જો ફોટો ન હોય તો ઈનિશિયલ બતાવો
                      <span style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#fff',
                        textTransform: 'uppercase'
                      }}>
                        {dbuser.initial || "U"}
                      </span>
                    )}
                  </AvatarCircle>
                  <UserName>{dbuser.firstname}</UserName>
                  <UserRole>Guest</UserRole>
                </ProfileCard>

                <InfoBox>
                  <InfoHeading>Complete your profile</InfoHeading>
                  <InfoText>
                    Your Airbnb profile is an important part of every reservation.
                    Create yours to help other hosts and guests get to know you.
                  </InfoText>
                  {/* Get started બટન પર onClick ઉમેર્યું */}
                  <ActionButton onClick={toggleEdit}>Get started</ActionButton>
                </InfoBox>
              </div>

              <FooterText>
                <MessageSquare size={20} />
                Reviews I've written
              </FooterText>
            </>
          )}
        </ContentArea>
      </MainContent>
    </PageContainer>
  );
}
const ProfileEditBody = ({ onDone, user }) => {

  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const fnameRef = useRef(null);
  const lnameRef = useRef(null);
  const emailRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };
  const handleSave = async () => {
    const formData = new FormData();
    
    // ફોન નંબર localStorage માંથી મેળવવો ફરજિયાત છે
    const userPhone = localStorage.getItem('userPhone');
    if (!userPhone) {
        alert("Phone number not found. Please login again.");
        return;
    }

    formData.append('phone_number', userPhone);
    formData.append('first_name', fnameRef.current?.value || "");
    formData.append('Last_name', lnameRef.current?.value || ""); // Django માં 'last_name_input' તરીકે પકડાશે
    formData.append('email', emailRef.current?.value || "");

    if (selectedFile) {
      formData.append('profile_picture', selectedFile);
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/accounts/complete-signup/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 200 || response.status === 201) {
        alert("Profile saved successfully!");

        // LocalStorage અપડેટ કરો
        localStorage.setItem('userName', response.data.user.firstName);
        if (response.data.user.profile_picture) {
          localStorage.setItem('userPhoto', response.data.user.profile_picture);
        }

        onDone();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert(error.response?.data?.error || "Something went wrong!");
    }
  };
 //console.log("Edit Body Props User:", user);
  return (
    <div style={{ padding: '30px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #ddd' }}>
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* ૧. પ્રોફાઇલ પિક્ચર એડિટ સેક્શન */}
        <div style={{ textAlign: 'center', flex: '1', minWidth: '200px' }}>

          {/* હિડન ફાઈલ ઇનપુટ */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept="image/*"
          />

          <div
            onClick={handleImageClick}
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              backgroundColor: '#222', // ડાર્ક બેકગ્રાઉન્ડ
              color: '#ffffff',        // વ્હાઈટ અક્ષર
              cursor: 'pointer',
              margin: '0 auto 15px',
              position: 'relative',
              display: 'flex',         // અક્ષરને સેન્ટરમાં લાવવા માટે
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '50px',        // અક્ષર મોટો કરવા માટે
              fontWeight: 'bold'
            }}
          >
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0'
            }}>
              {preview ? (
                <img src={preview} alt="New" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : user?.photo ? ( // અહીં ?. નો ઉપયોગ કર્યો
                <img src={user.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '50px', fontWeight: 'bold' }}>
                  {user?.initial || "U"}
                </span>
              )}
            </div>
            <div style={{
              position: 'absolute',
              bottom: '5px',
              right: '5px',
              backgroundColor: '#fff',
              borderRadius: '50%',
              padding: '8px',
            }}>
              <Camera size={18} color="#222" />
            </div>
          </div>

          <button
            onClick={handleImageClick} // બટન પર પણ ક્લિક ફંક્શન આપો
            style={{ fontSize: '14px', fontWeight: '600', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none' }}
          >
            Change Photo
          </button>
        </div>

        {/* ૨. ફોર્મ સેક્શન (Name, Number, Email) */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>First Name</label>
            <input
              key={user?.firstname}
              type="text"
              ref={fnameRef}
              defaultValue={user?.firstname}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>Last Name</label>
            <input
              key={user?.lastname}
              type="text"
              ref={lnameRef}
              defaultValue={user?.lastname}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>Email Address</label>
            <input
              type="email"
              ref={emailRef}
              defaultValue={user?.email}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
            />
          </div>
        </div>
      </div>

      <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />

      {/* સેવ બટન્સ */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
        <button
          onClick={onDone}
          style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid #222', fontWeight: '600', cursor: 'pointer', backgroundColor: '#fff' }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          style={{ padding: '12px 24px', borderRadius: '8px', backgroundColor: '#FF385C', color: '#fff', fontWeight: '600', border: 'none', cursor: 'pointer' }}
        >
          Save & Done
        </button>
      </div>
    </div>
  );
};