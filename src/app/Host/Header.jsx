"use client";
import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { SiAirbnb } from "react-icons/si";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';
import { IoSettingsOutline, IoGlobeOutline, IoHelpCircleOutline } from "react-icons/io5";
import { MdOutlineLibraryBooks, MdOutlinePersonAddAlt1 } from "react-icons/md";
import { HiOutlineHomeModern } from "react-icons/hi2";
import { FiLogOut } from "react-icons/fi";
import axios from 'axios';

export default function Header1({ setIsEditing }) {
    const router = useRouter();
   const searchParams = useSearchParams();
    const pathname = usePathname();
    const menuRef = useRef(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isProfilePage = pathname.includes('/profile');
    const [isHostingMode, setIsHostingMode] = useState(false);
    const activeTab = searchParams.get('tab') || 'today';
    const [isPropertyDetailPage, setIsPropertyDetailPage] = useState(false);
    const [dbUser, setDbUser] = useState({ name: '', photo: null });

    useEffect(() => {
        const fetchProfile = async () => {
            const phone = localStorage.getItem('userPhone');
            if (phone) {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/accounts/get_user_profile/${phone}/`);
                    setDbUser({
                        name: response.data.firstName,
                        photo: response.data.profile_picture
                    });
                } catch (error) {
                    console.error("Header profile fetch error:", error);
                }
            }
        };
        fetchProfile();
    }, []); // પેજ લોડ થતા જ રન થશે


    const toggleHosting = () => {
        setIsHostingMode(!isHostingMode);
        if (!isHostingMode) {
            router.push('/Host/Host_dashboard');
        } else {
            router.push('/');
        }
    };
    useEffect(() => {
        const savedLoginStatus = localStorage.getItem('isLoggedIn');
        const savedUserName = localStorage.getItem('userName');
        const savedPhone = localStorage.getItem('userPhone');
        const isPropertyPage = pathname.includes('/reservation');

        if (savedLoginStatus === 'true' && savedUserName) {
            setIsLoggedIn(true);
            setUserName(savedUserName);
        }

        if (pathname.includes('/Host/Host_dashboard')) {
            setIsHostingMode(true);
        } else {
            setIsHostingMode(false);
        }
        if (pathname.includes('/reservation')) {
            setIsPropertyDetailPage(true);
        } else {
            setIsPropertyDetailPage(false);
        }

        // મેનૂની બહાર ક્લિક કરવાથી મેનૂ બંધ કરવા માટે
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        router.push('/');
    };


    return (
        <HeaderContainer>
            <Logo onClick={() => router.push('/')}>
                <SiAirbnb size={34} />
            </Logo>
            {isHostingMode ? (
                <CenterMenu>
                    <span
                        className={activeTab === 'today' ? 'active' : ''}
                        onClick={() => {
                            setIsEditing(false);
                            router.push('/Host/Host_dashboard?tab=today');
                        }}
                    >
                        Today
                    </span>

                    <span
                        className={activeTab === 'calendar' ? 'active' : ''}
                        onClick={() => router.push('/Host/Host_dashboard?tab=calendar')}
                    >
                        Calendar
                    </span>

                    <span
                        className={activeTab === 'listings' ? 'active' : ''}
                        onClick={() => router.push('/Host/Host_dashboard?tab=listings')}
                    >
                        Listings
                    </span>

                    <span
                        className={activeTab === 'messages' ? 'active' : ''}
                        onClick={() => router.push('/Host/Host_dashboard?tab=messages')}
                    >
                        Messages
                    </span>
                </CenterMenu>
            ) : (
                
                <div style={{ flex: 1 }}></div>
            )}
            <RightSection ref={menuRef}>
                {!isProfilePage && !isHostingMode && (
                    <div className="nav-btns">
                        <NavBtn>Questions?</NavBtn>
                        <NavBtn onClick={() => router.push('/')}>Save & exit</NavBtn>
                    </div>
                )}

                {(isProfilePage || isHostingMode || isPropertyDetailPage) && (
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span onClick={toggleHosting} style={{ fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                            {isHostingMode ? "Switch to travelling" : "Switch to hosting"}
                        </span>

                        <UserMenu onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <span style={{ fontSize: '16px' }}>☰</span>
                            <ProfileCircle
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    router.push('./profile');
                                }}
                                style={{
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#222',
                                    width: '32px', 
                                    height: '32px',
                                    borderRadius: '50%'
                                }}
                            >
                                {dbUser.photo ? (
                                    
                                    <img
                                        src={dbUser.photo}
                                        alt="Profile"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    
                                    userName ? userName.toString().charAt(0).toUpperCase() : 'U'
                                )}
                            </ProfileCircle>
                        </UserMenu>

                        {/* --- Dropdown Menu --- */}
                        {isMenuOpen && (
                            <DropdownMenu>
                                <div className="item"><IoSettingsOutline size={18} /> Account settings</div>
                                <div className="item"><IoGlobeOutline size={18} /> Languages & currency</div>
                                <div className="item"><MdOutlineLibraryBooks size={18} /> Hosting resources</div>
                                <div className="item"><IoHelpCircleOutline size={18} /> Get help</div>
                                <div className="item"><MdOutlinePersonAddAlt1 size={18} /> Find a co-host</div>
                                <div className="item"><HiOutlineHomeModern size={18} /> Create a new listing</div>
                                <div className="item"><MdOutlinePersonAddAlt1 size={18} /> Refer a host</div>
                                <Divider />
                                <div className="item" onClick={handleLogout}><FiLogOut size={18} /> Log out</div>
                            </DropdownMenu>
                        )}
                    </div>
                )}
            </RightSection>
        </HeaderContainer>
    );
}

// Styled Components
const CenterMenu = styled.nav`
    display: flex;
    gap: 25px;
    height: 80px; /* હેડરની જેટલી જ હાઇટ રાખો */
    align-items: center;
    margin: 0 auto; /* સેન્ટરમાં રાખવા માટે */

    span {
        font-size: 14px;
        font-weight: 500;
        color: #717171;
        cursor: pointer;
        height: 100%; /* પૂરી હાઇટ લેશે */
        display: flex;
        align-items: center;
        padding: 0 5px;
        border-bottom: 2px solid transparent; /* ડિફોલ્ટ ટ્રાન્સપરન્ટ લાઇન */
        transition: all 0.2s;
        box-sizing: border-box; /* બોર્ડર હાઇટમાં ગણાય તે માટે */

        &:hover {
            color: #000;
        }
        
        &.active {
            border-bottom: 2px solid #222; /* એક્ટિવ હોય ત્યારે કાળી લાઇન */
            color: #222;
            font-weight: 600;
        }
    }
`;
const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 40px;
    background: white;
    border-bottom: 1px solid #eee;
    height: 80px;
    position: sticky;
    top: 0;
    z-index: 1000;
`;

const RightSection = styled.div`
    display: flex;
    align-items: center;
`;

const UserMenu = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    border: 1px solid #ddd;
    padding: 5px 5px 5px 12px;
    border-radius: 30px;
    cursor: pointer;
    transition: box-shadow 0.2s;
    &:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
`;

const ProfileCircle = styled.div`
    width: 32px;
    height: 32px;
    background: #222;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: 55px;
    right: 0;
    background: white;
    width: 250px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    padding: 10px 0;
    z-index: 1001;

    .item {
        padding: 12px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        color: #222;
        cursor: pointer;
        &:hover { background: #f7f7f7; }
    }
`;

const Divider = styled.div`
    height: 1px;
    background: #eee;
    margin: 8px 0;
`;

const NavBtn = styled.button`
    background: white;
    border: 1px solid #ddd;
    padding: 8px 20px;
    border-radius: 20px;
    font-weight: 600;
    cursor: pointer;
    margin-left: 10px;
    &:hover { border-color: #000; }
`;

const Logo = styled.div` color: #ff385c; cursor: pointer; display: flex; align-items: center; `;