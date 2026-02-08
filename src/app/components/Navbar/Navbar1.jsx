"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styled from "@emotion/styled";
import { FaGlobe, FaSearch, FaUserCircle } from 'react-icons/fa';
import { SiAirbnb } from "react-icons/si";
import { HiHome } from "react-icons/hi2";
import { MdRoomService } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
gsap.registerPlugin(ScrollTrigger);
import { DateRange } from "react-date-range";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { addDays, format, isSameDay } from "date-fns";
import { Pointer } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import LoginPage from '../../Host/Login/page';
import { usePathname } from 'next/navigation';
import axios from 'axios';

/* --- HeaderWrapper ઉમેરો --- */
const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #fff;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center; /* આનાથી સર્ચબાર હંમેશા સેન્ટરમાં રહેશે */
`;

const Nav = styled.nav`
  width: 100%; /* વિડ્થ 100% કરો */
  height: 80px; 
  padding: 0 80px; 
  display: flex; 
  align-items: center; 
  justify-content: space-between;
  background: #fff;
`;

const SearchBox = styled.div`
  display: flex; 
  align-items: center; 
  background: #fff; 
  border-radius: 40px; 
  border: 1px solid #ddd;
  box-shadow: 0 3px 12px rgba(0,0,0,0.08); 
  width: 850px; 
  padding: 8px; 
  margin: 0 auto 20px auto; 
  z-index: 1001;
  transition: box-shadow 0.2s;
  /* આ લાઈન એનિમેશનને રાઈટ સાઈડ બેન્ડ થવામાં મદદ કરશે */
  transform-origin: center center; 
`;
const Logo = styled.div` display: flex; align-items: center; gap: 8px; font-size: 24px; font-weight: bold; color: #ff385c; cursor: pointer; `;
const Menu = styled.div` display: flex; gap: 32px; `;
const MenuItem = styled.div` display: flex; align-items: center; gap: 8px; font-weight: 500; cursor: pointer; color: #222; `;
const Right = styled.div` display: flex; align-items: center; gap: 20px; `;



const SearchItem = styled.div`
  padding: 10px 32px; flex: 1; border-radius: 32px; cursor: pointer; position: relative;
  background: ${props => props.active ? '#fff' : 'transparent'};
  box-shadow: ${props => props.active ? '0 6px 20px rgba(0,0,0,0.1)' : 'none'};
  &:hover { background: ${props => props.active ? '#fff' : '#f7f7f7'}; }
`;

const Dropdown = styled.div`
  position: absolute; top: 80px; left: 50%; transform: translateX(-50%);
  background: #fff; border-radius: 32px; box-shadow: 0 14px 40px rgba(0,0,0,0.18);
  padding: 32px; z-index: 100;
  min-width:500px;
`;

const TabSwitcher = styled.div`
  display: flex; background: #ebebeb; padding: 4px; border-radius: 30px; 
  width: fit-content; margin: 0 auto 24px;
`;

const TabItem = styled.div`
  padding: 8px 24px; border-radius: 25px; cursor: pointer; font-size: 14px; font-weight: 600;
  background: ${props => props.active ? '#fff' : 'transparent'};
  color: ${props => props.active ? '#000' : '#717171'};
  box-shadow: ${props => props.active ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'};
  transition: all 0.2s;
`;

/* --- MONTHS GRID STYLES --- */
const MonthsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  padding: 10px 0;
`;

const MonthCard = styled.div`
  border: 1px solid ${props => props.selected ? '#222' : '#ddd'};
  background: ${props => props.selected ? '#f7f7f7' : '#fff'};
  padding: 20px 10px;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: #222; }
  
  .icon { font-size: 24px; margin-bottom: 8px; }
  .name { font-size: 14px; font-weight: 600; color: #222; }
`;

const CalendarWrapper = styled.div`
  .rdrCalendarWrapper { color: #222 !important; font-family: inherit; background-color: #fff !important; }
  .rdrDayNumber { 
    background: #ffffff !important; border-radius: 12px !important; margin: 4px;
    height: 40px !important; width: 40px !important; display: flex; align-items: center; 
    justify-content: center; border: 1px solid transparent !important;
  }
  .rdrDayNumber span { color: #222 !important; }
  .rdrInRange { background: #f7f7f7 !important; }
  .rdrStartEdge .rdrDayNumber, .rdrEndEdge .rdrDayNumber, .rdrSelected .rdrDayNumber { 
    background: #ffffff !important; border: 2px solid #222 !important; border-radius: 12px !important; 
  }
`;

const BottomPills = styled.div` display: flex; gap: 8px; justify-content: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; `;
const Pill = styled.button` 
  padding: 10px 20px; border-radius: 30px; border: 1px solid #ddd; background: #fff; 
  font-size: 14px; font-weight: 500; cursor: pointer; 
  &.active { border: 2px solid #222; font-weight: 600; background: #f7f7f7; } 
`;
const GuestRow = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 0; border-bottom: 1px solid #ebebeb;
  &:last-child { border-bottom: none; }
`;

const Counter = styled.div`
  display: flex; align-items: center; gap: 15px;
  button {
    width: 32px; height: 32px; border-radius: 50%; border: 1px solid #b0b0b0;
    background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 20px; color: #717171;
    &:disabled { opacity: 0.3; cursor: not-allowed; }
    &:hover:not(:disabled) { border-color: #222; color: #222; }
  }
  span { min-width: 20px; text-align: center; font-weight: 400; color: #222; }
`;
/* --- DYNAMIC WHEEL STYLES --- */
const WheelWrapper = styled.div`
  display: flex; flex-direction: column; align-items: center; padding: 20px;
  user-select: none;
`;

const WheelContainer = styled.div`
  position: relative; width: 260px; height: 260px; 
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
`;

const StyledSVG = styled.svg`
  transform: rotate(-90deg); width: 100%; height: 100%;
`;

const TrackCircle = styled.circle`
  fill: none; 
  stroke: #f1f1f1; 
  stroke-width: 20; /* 12 માંથી વધારીને 20 કરી */
`;

const ProgressCircle = styled.circle`
  fill: none; 
  stroke: #ff385c; 
  stroke-width: 20; /* અહીં પણ 20 કરી */
  stroke-linecap: round;
  transition: stroke-dashoffset 0.1s ease-out;
`;

const SliderDot = styled.div`
  position: absolute; width: 34px; height: 34px; background: #fff;
  border-radius: 50%; border: 1px solid #ddd; box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  display: flex; align-items: center; justify-content: center;
  cursor: grab; z-index: 10;
  &:active { cursor: grabbing; }
  &::after { content: ''; width: 6px; height: 6px; background: #ddd; border-radius: 50%; }
`;

const CenterContent = styled.div`
  position: absolute; text-align: center; pointer-events: none;
  h1 { font-size: 72px; margin: 0; font-weight: 700; color: #222; }
  p { font-size: 18px; margin: 0; font-weight: 600; color: #222; }
`;
const TickDot = styled.circle`
  fill: #222; /* કાયમી કાળો કલર અથવા #000 */
 
`;
/* --- FLEXIBLE TAB STYLES --- */


const FlexTitle = styled.h3` font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #222; `;

const StayDurationGroup = styled.div` display: flex; gap: 12px; margin-bottom: 40px; `;

const DurationPill = styled.button`
  padding: 10px 24px; border-radius: 30px; border: 1px solid ${props => props.active ? '#222' : '#ddd'};
  background: ${props => props.active ? '#fff' : 'transparent'};
  box-shadow: ${props => props.active ? 'inset 0 0 0 1px #222' : 'none'};
  font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s;
  &:hover { border-color: #222; }
`;

/* --- UPDATED SCROLL STYLES --- */
const FlexibleScrollWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const ScrollContainer = styled.div`
  display: flex; 
  gap: 12px; 
  overflow-x: auto; 
  width: 100%; 
  padding: 10px 5px;
  scroll-behavior: smooth; /* સ્મૂધ સ્ક્રોલિંગ માટે */
  &::-webkit-scrollbar { display: none; } 
  -ms-overflow-style: none; 
  scrollbar-width: none;
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  &:hover { background: #f7f7f7; box-shadow: 0 4px 10px rgba(0,0,0,0.15); }
  &:disabled { display: none; }
  
  &.left { left: -15px; }
  &.right { right: -15px; }
`;

/* Month card size adjusted for 6 items */
const FlexibleMonthCard = styled.div`
  min-width: calc(16.66% - 10px); /* 100% / 6 months */
  height: 120px; 
  border: 2px solid ${props => props.selected ? '#222' : '#eee'};
  border-radius: 16px; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  cursor: pointer; 
  background: #fff; 
  transition: all 0.2s;
  &:hover { border-color: #222; }
  .icon { font-size: 32px; margin-bottom: 8px; color: #717171; }
  .month-name { font-size: 13px; font-weight: 600; color: #222; }
  .year { font-size: 11px; color: #717171; }
`;
const FlexibleWrapper = styled.div`
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  padding: 40px 20px; /* કેલેન્ડર જેવી પેડિંગ */
  text-align: center;
  width: 100%;
  min-height: 400px; /* કેલેન્ડરની અંદાજિત હાઈટ */
  justify-content: center;
`;
const DestinationItem = styled.div`
  display: flex; align-items: center; gap: 16px; padding: 12px;
  border-radius: 12px; cursor: pointer;
  &:hover { background: #f7f7f7; }

  .icon-box {
    width: 48px; height: 48px; border-radius: 12px; background: #f1f1f1;
    display: flex; align-items: center; justify-content: center; font-size: 24px;
    border: 1px solid #eee;
  }
  .text-box {
    .title { font-weight: 600; color: #222; font-size: 14px; }
    .desc { font-size: 13px; color: #717171; }
  }
`;
const UserDropdown = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  width: 250px;
  padding: 8px 0;
  z-index: 2000;
  display: flex;
  flex-direction: column;

  .item {
    padding: 12px 16px;
    font-size: 14px;
    color: #222;
    cursor: pointer;
    
    /* --- આ લાઈન એડ કરો (કોમન CSS) --- */
    display: flex;          
    flex-direction: row;     /* આઈકન અને ટેક્સ્ટને આડી લાઈનમાં રાખશે */
    align-items: center;     /* ઉપર-નીચેથી સેન્ટર કરશે */
    gap: 12px;               /* આઈકન અને ટેક્સ્ટ વચ્ચે જગ્યા રાખશે */
    white-space: nowrap;     /* ટેક્સ્ટને નીચે પડતા રોકશે */

    &:hover {
      background: #f7f7f7;
    }
  }

  .bold {
    font-weight: 600;
  }

  .divider {
    height: 1px;
    background: #eee;
    margin: 8px 0;
  }
`;
/* ---------------- COMPONENT ---------------- */
export default function AirbnbClone() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dbUser, setDbUser] = useState({ name: '', photo: null });
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const searchBoxRef = useRef(null);
  const [openWhen, setOpenWhen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dates");
  const [selectedPill, setSelectedPill] = useState(0);
  const [selectionRange, setSelectionRange] = useState({ startDate: null, endDate: null, key: 'selection' });
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const whenRef = useRef(null);
  const [openWho, setOpenWho] = useState(false);
  const [guests, setGuests] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const savedLoginStatus = localStorage.getItem('isLoggedIn');
    const savedUserName = localStorage.getItem('userName');

    if (savedLoginStatus === 'true' && savedUserName) {
        setIsLoggedIn(true);
        setUserName(savedUserName || "");
    }
}, []);

  useEffect(() => {
    const fetchNavbarData = async () => {
      const phone = localStorage.getItem('userPhone');
      
     
      if (isLoggedIn && phone) {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/accounts/get_user_profile/${phone}/`);
          
          setDbUser({
            name: response.data.firstName,
            photo: response.data.profile_picture
          });
          
         
          if (response.data.firstName) {
            setUserName(response.data.firstName);
            localStorage.setItem('userName', response.data.firstName);
          }
        } catch (error) {
          console.error("Navbar data fetch error:", error);
        }
      }
    };

    fetchNavbarData();
  }, [isLoggedIn]);
 
  const router = useRouter();
  const handleBecomeHost = (path) => {
    router.push(path);
    setIsMenuOpen(false);
  };
  
  
  useEffect(() => {
  
  const isReservationPage = window.location.pathname.includes('reservation');

  const ctx = gsap.context(() => {
   
    if (isReservationPage && !isExpanded) {
      gsap.set(headerRef.current, { height: "80px" });
      gsap.set(".menu-item-exp, .menu-item-ser", { opacity: 0, display: "none" });
      gsap.set(".menu-item-home", { x: -160 });
      gsap.set(searchBoxRef.current, { 
        y: -40, x: -10, width: "300px", height: "45px", margin: 0 
      });
      gsap.set(".full-search", { display: 'none', opacity: 0 });
      gsap.set(".mini-search", { display: 'flex', opacity: 1 });
      
      return; 
    }

   
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "70",
        scrub: true,
        onEnterBack: () => setIsExpanded(false),
      }
    });

    tl.to(headerRef.current, { height: "80px", duration: 1 }, 0);

      tl.to(".menu-item-exp, .menu-item-ser", {
        opacity: 0,
        display: "none",
        duration: 0.2
      }, 0);
     
      tl.to(".menu-item-home", {
        x: -160,
        duration: 1
      }, 0);

      
      tl.to(searchBoxRef.current, {
        y: -40,          
        x: -10,          
        width: "300px",
        height: "45px",
        margin: 0,
        duration: 1,
        ease: "power2.inOut"
      }, 0);

      tl.to(".full-search", { display: 'none', opacity: 0, duration: 0 }, 0.1);
      tl.to(".mini-search", { display: 'flex', opacity: 1, duration: 0.1 }, 0.2);
    });

  
  

  return () => ctx.revert();
}, [isExpanded]);

  const handleMiniSearchClick = (e) => {
    e.stopPropagation();

    setIsExpanded(true);

    const tl = gsap.timeline();

    
    tl.to(headerRef.current, { height: "160px", duration: 0.3 }, 0);

    
    tl.to(".menu-item-home", { x: 0, duration: 0.3 }, 0);
    tl.to(".menu-item-exp, .menu-item-ser", { opacity: 1, display: "flex", duration: 0.3 }, 0);

    
    tl.to(searchBoxRef.current, {
      y: 0,
      x: 0,
      width: "850px",
      height: "66px",
      duration: 0.4,
      ease: "back.out(1.2)"
    }, 0);

    tl.to(".mini-search", { display: 'none', opacity: 0, duration: 0.1 }, 0);
    tl.to(".full-search", { display: 'flex', opacity: 1, duration: 0.2 }, 0.1);

   
    setOpenWhere(true);
  };
 


  const totalGuests = guests.adults + guests.children + guests.infants;
  const whoRef = useRef(null); 
  const updateCount = (type, operation) => {
    setGuests(prev => ({
      ...prev,
      [type]: operation === 'add' ? prev[type] + 1 : Math.max(0, prev[type] - 1)
    }));
  };
  const months = [
    { name: "January", icon: "🗓️" }, { name: "February", icon: "🗓️" },
    { name: "March", icon: "🗓️" }, { name: "April", icon: "🗓️" },
    { name: "May", icon: "🗓️" }, { name: "June", icon: "🗓️" },
    { name: "July", icon: "🗓️" }, { name: "August", icon: "🗓️" },
    { name: "September", icon: "🗓️" }, { name: "October", icon: "🗓️" },
    { name: "November", icon: "🗓️" }, { name: "December", icon: "🗓️" }
  ];

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setSelectionRange({ startDate, endDate: isSameDay(startDate, endDate) ? addDays(startDate, 1) : endDate, key: 'selection' });
    setSelectedPill(0);
  };

  const handlePillClick = (days) => {
    setSelectedPill(days);
    const baseStart = selectionRange.startDate || new Date();
    setSelectionRange({ startDate: baseStart, endDate: addDays(baseStart, days || 1), key: 'selection' });
  };

  useEffect(() => {
    const close = (e) => { if (whenRef.current && !whenRef.current.contains(e.target)) setOpenWhen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);


  const [openWhere, setOpenWhere] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const whereRef = useRef(null);

  const destinations = [
    { id: 1, title: "Nearby", desc: "Find what's around you", icon: "🏙️" },
    { id: 2, title: "Udaipur, Rajasthan", desc: "For its stunning architecture", icon: "🏙️" },
    { id: 3, title: "North Goa, Goa", desc: "Popular beach destination", icon: "🏝️" },
    { id: 4, title: "Mumbai, Maharashtra", desc: "For sights like Gateway of India", icon: "🏢" },
    { id: 5, title: "Jaipur, Rajasthan", desc: "For its stunning architecture", icon: "🕌" },
  ];

  /* --- COMPONENT LOGIC --- */
  const [monthsCount, setMonthsCount] = useState(3); // Default 3 months
  const [angle, setAngle] = useState(90); // 90 degree = 3 months
  const wheelRef = useRef(null);
  const [stayType, setStayType] = useState("Week");
  const [selectedFlexMonths, setSelectedFlexMonths] = useState(["April"]);

  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };
  // Angle calculations mate
  const handleUpdate = (e) => {
    if (e.buttons !== 1) return; 
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let newAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90;
    if (newAngle < 0) newAngle += 360;

    setAngle(newAngle);
    // 360 deg / 12 months = 30 deg per month
    const m = Math.max(1, Math.round(newAngle / 30));
    setMonthsCount(m > 12 ? 12 : m);
  };

  const offset = circumference - (angle / 360) * circumference;
  const dotX = radius * Math.cos((angle - 90) * (Math.PI / 180));
  const dotY = radius * Math.sin((angle - 90) * (Math.PI / 180));
  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);
    if (isMenuOpen) {
      window.addEventListener('click', closeMenu);
    }
    return () => window.removeEventListener('click', closeMenu);
  }, [isMenuOpen]);
  const handleLogoClick = () => {
   
    window.location.href = '/';
  };
 
  const [userName, setUserName] = useState("");
  const [redirectPath, setRedirectPath] = useState(null);


  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName("");
    alert("Logged out successfully");
    router.push('/'); 
  };
  const handleBecomeHostClick = () => {
    if (isLoggedIn) {
      
      router.push('/Host');
    } else {
      
      setRedirectPath('/Host');
      setIsLoginOpen(true);
    }
  };
  const handleLoginSuccess = (name) => {
    setIsLoggedIn(true);
    setUserName(name);
    setIsLoginOpen(false);

    alert(`Welcome back, ${name}!`);

    
    if (redirectPath) {
      router.push(redirectPath);
      setRedirectPath(null); 
    }
  };
  const handleFinalSearch = () => {
    let dateValue = {};
    const adultsCount = guests.adults;
  const childrenCount = guests.children;
  const infantsCount = guests.infants;
  const petsCount = guests.pets;
  const totalVisitorCount = totalGuests;

  if (activeTab === "Dates") {
    
    dateValue = {
      type: "exact",
      startDate: selectionRange.startDate,
      endDate: selectionRange.endDate,
      bufferDays: selectedPill
    };
  } 
  else if (activeTab === "Months") {
   
    dateValue = {
      type: "months_count",
      count: monthsCount
    };
  } 
  else if (activeTab === "Flexible") {
   
    dateValue = {
      type: "flexible",
      stayDuration: stayType, 
      months: selectedFlexMonths 
    };
  }
    if (!selectedLocation.trim()) {
    alert("Please enter a destination");
    return;
  }
  const searchData = {
  location: selectedLocation,
    dateDetails: activeTab === "Dates" ? selectionRange : { activeTab, monthsCount, selectedFlexMonths }, // When સેક્શન
    guestDetails: {
      adults: adultsCount,
      children: childrenCount,
      infants: infantsCount,
      pets: petsCount,
      total: totalVisitorCount
    }
  };
  console.log("Final Search Triggered:", searchData);
  };

  return (
    <>
      <HeaderWrapper ref={headerRef}>
        <Nav>
          <Logo onClick={handleLogoClick}><SiAirbnb size={34} />Airbnb</Logo>
          <Menu ref={menuRef}>
            <MenuItem className="menu-item-home"><HiHome size={22} /> Homes</MenuItem>
            <MenuItem className="menu-item-exp">Experiences</MenuItem>
            <MenuItem className="menu-item-ser"><MdRoomService size={22} /> Services</MenuItem>
          </Menu>
          <Right>
           
            <span
              onClick={handleBecomeHostClick}
              style={{ fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}
            >
              Become a host
            </span>

            {!isLoggedIn && (
              <FaGlobe size={18} style={{ cursor: 'pointer', marginLeft: '10px' }} />
            )}

          
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              style={{
                border: '1px solid #ddd',
                padding: '5px 5px 5px 12px',
                borderRadius: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                position: 'relative',
                marginLeft: '10px',
                backgroundColor: '#fff',
                boxShadow: isMenuOpen ? '0 2px 4px rgba(0,0,0,0.18)' : 'none'
              }}
            >
              <span style={{ fontSize: '16px', color: '#222' }}>☰</span>

              {isLoggedIn && (
                <div
                  onClick={(e) => {
                    e.stopPropagation(); 
                    router.push('/Host/profile');
                  }}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#222',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    overflow: 'hidden'
                  }}
                >
                 
                 {dbUser.photo ? (
            <img 
              src={dbUser.photo} 
              alt="Profile" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            
            dbUser.name ? dbUser.name.charAt(0).toUpperCase() : 'U'
          )}
                </div>
              )}
            </div>


            {isMenuOpen && (
              <UserDropdown onClick={(e) => e.stopPropagation()}>
                {isLoggedIn ? (
                  <>
                  
                    <div
                      key="user-profile"
                      className="item bold"
                      onClick={() => router.push('./Host/profile')}
                    >
                      <span>Profile</span>
                    </div>

                    <div key="user-msg" className="item bold"><span>Messages</span></div>
                    <div key="user-trips" className="item bold"><span>Trips</span></div>
                    <div key="user-wish" className="item bold"><span>Wishlists</span></div>

                    <div className="divider"></div>

                    <div key="user-host" className="item" onClick={() => router.push('/Host')}>
                      <span>Airbnb your home</span>
                    </div>
                    <div key="user-acc" className="item"><span>Account</span></div>

                    <div className="divider"></div>

                    <div key="user-help" className="item"><span>Help Center</span></div>
                    <div key="user-logout" className="item" onClick={handleLogout}>
                      <span>Log out</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="item bold" onClick={() => setIsLoginOpen(true)}>Login</div>
                    <div className="item" onClick={() => setIsLoginOpen(true)}>Sign up</div>
                    <div className="divider"></div>
                    <div className="item" onClick={handleBecomeHostClick}>Airbnb your home</div>
                    <div className="item">Help Center</div>
                  </>
                )}
              </UserDropdown>
            )}
          </Right>
        </Nav>


        

        <SearchBox ref={searchBoxRef} onClick={!isExpanded ? handleMiniSearchClick : undefined} >
       
          <div className="mini-search" style={{
            display: 'none',
    opacity:  0, width: '100%', justifyContent: 'space-around',
            alignItems: 'center', padding: '0 10px', fontSize: '13px', fontWeight: '600',
            cursor: 'pointer',
          }}>
            <span>Anywhere</span>
            <span style={{ color: '#ddd' }}>|</span>
            <span>Any week</span>
            <span style={{ color: '#ddd' }}>|</span>
            <span style={{ color: '#717171', fontWeight: '400' }}>Add guests</span>
            <div style={{ background: '#ff385c', padding: '6px', borderRadius: '50%', color: '#fff' }}>
              <FaSearch size={10} />
            </div>
          </div>
          {/*Where section*/}
          <div className="full-search" style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
            <SearchItem ref={whereRef} onClick={() => { setOpenWhere(!openWhere); setOpenWhen(false); setOpenWho(false); }} active={openWhere}>
              <div style={{ fontSize: '12px', fontWeight: '800' }}>
                Where</div>
              <input
                type="text"
                placeholder="Search destinations"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{
                  fontSize: '14px', border: 'none', background: 'transparent', outline: 'none',
                  color: '#222', width: '100%', padding: 0, marginTop: '2px'
                }}
              />

              {openWhere && (
                <Dropdown onClick={(e) => e.stopPropagation()} style={{ left: 0, transform: 'none', width: '400px', padding: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '12px', paddingLeft: '8px' }}>Suggested destinations</div>

                 
                  {destinations.map((loc,index) => (
                    <DestinationItem
                      key={`dest-${loc.id || index}`}
                      onClick={() => { setSelectedLocation(loc.title); setOpenWhere(false); }}
                    >
                      <div className="icon-box">{loc.icon}</div>
                      <div className="text-box">
                        <div className="title">{loc.title}</div>
                        <div className="desc">{loc.desc}</div>
                      </div>
                    </DestinationItem>
                  ))}
                </Dropdown>
              )}
            </SearchItem>
            <div style={{ width: '1px', height: '32px', background: '#ddd' }}></div>

            {/* --- WHEN SECTION START --- */}
            <SearchItem ref={whenRef} onClick={() => setOpenWhen(!openWhen)} active={openWhen}>
              <div style={{ fontSize: '12px', fontWeight: '800' }}>
                When</div>
              <div style={{ fontSize: '14px', color: (selectionRange.startDate || selectedMonth || selectedFlexMonths.length > 0) ? '#222' : '#717171' }}>
                {activeTab === "Months" && selectedMonth
                  ? `Anytime in ${selectedMonth}`
                  : activeTab === "Flexible"
                    ? (selectedFlexMonths.length > 0
                      ? `${stayType} in ${[...selectedFlexMonths]
                        .sort((a, b) => {
                          const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                          const getName = (val) => monthOrder.includes(val) ? val : (val.includes('-') ? val.split('-')[1] : val);
                          return monthOrder.indexOf(getName(a)) - monthOrder.indexOf(getName(b));
                        })
                        .join(", ")}`
                      : `Any ${stayType.toLowerCase()}`
                    )
                    : (selectionRange.startDate
                      ? `${format(selectionRange.startDate, "MMM d")} - ${format(selectionRange.endDate, "MMM d")}`
                      : "Add dates"
                    )
                }
              </div>

              {openWhen && (
                <Dropdown onClick={(e) => e.stopPropagation()}>
                  <TabSwitcher>
                    <TabItem active={activeTab === "Dates"} onClick={() => setActiveTab("Dates")}>Dates</TabItem>
                    <TabItem active={activeTab === "Months"} onClick={() => setActiveTab("Months")}>Months</TabItem>
                    <TabItem active={activeTab === "Flexible"} onClick={() => setActiveTab("Flexible")}>Flexible</TabItem>
                  </TabSwitcher>

                  {activeTab === "Dates" && (
                    <CalendarWrapper>
                      <DateRange
                        ranges={[selectionRange.startDate ? selectionRange : { startDate: new Date(), endDate: new Date(), key: 'selection' }]}
                        onChange={handleSelect}
                        months={2}
                        direction="horizontal"
                        showDateDisplay={false}
                        rangeColors={["transparent"]}
                        minDate={new Date()}
                      />
                      <BottomPills>
                        {[0, 1, 2, 3, 7].map((d, idx) => (
                          <Pill key={`date-pill-${idx}`} className={selectedPill === d ? "active" : ""} onClick={() => handlePillClick(d)}>
                            {d === 0 ? "Exact dates" : `± ${d} day${d > 1 ? 's' : ''}`}
                          </Pill>
                        ))}
                      </BottomPills>
                    </CalendarWrapper>
                  )}

                  {activeTab === "Months" && (
                    <WheelWrapper>
                      <h2 style={{ fontWeight: 700, marginBottom: '25px' }}>When's your trip?</h2>
                      <WheelContainer ref={wheelRef} onMouseMove={handleUpdate} onMouseDown={handleUpdate}>
                        <StyledSVG viewBox="0 0 250 250">
                          <TrackCircle cx="125" cy="125" r={radius} />
                          {[...Array(12)].map((_, i) => {
                            const tickAngle = (i + 1) * 30;
                            const tx = 125 + radius * Math.cos((tickAngle - 90) * (Math.PI / 180));
                            const ty = 125 + radius * Math.sin((tickAngle - 90) * (Math.PI / 180));
                            return <TickDot key={i} cx={tx} cy={ty} r="5" />;
                          })}
                          <ProgressCircle
                            cx="125" cy="125" r={radius}
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                          />
                        </StyledSVG>
                        <SliderDot style={{ transform: `translate(${dotX}px, ${dotY}px)` }} />
                        <CenterContent>
                          <h1>{monthsCount}</h1>
                          <p>months</p>
                        </CenterContent>
                      </WheelContainer>
                      <div style={{ marginTop: '30px', fontWeight: 600, borderBottom: '2px solid #222' }}>
                        Go anytime in the next {monthsCount} months
                      </div>
                    </WheelWrapper>
                  )}

                  {activeTab === "Flexible" && (
                    <FlexibleWrapper>
                      <FlexTitle>How long would you like to stay?</FlexTitle>
                      <StayDurationGroup>
                        {["Weekend", "Week", "Month"].map((type) => (
                          <DurationPill key={type} active={stayType === type} onClick={() => setStayType(type)}>
                            {type}
                          </DurationPill>
                        ))}
                      </StayDurationGroup>

                      <FlexTitle>When do you want to go?</FlexTitle>
                      <FlexibleScrollWrapper>
                        <NavButton className="left" type="button" onClick={() => scroll('left')}>❮</NavButton>
                        <ScrollContainer ref={scrollRef}>
                          {months.map((m, index) => (
                            <FlexibleMonthCard
                              key={`flex-month-${m.name}-${index}`}
                              selected={selectedFlexMonths.includes(m.name)}
                              onClick={() => {
                                let newSelected;
                                if (selectedFlexMonths.includes(m.name)) {
                                  newSelected = selectedFlexMonths.filter(i => i !== m.name);
                                } else {
                                  newSelected = [...selectedFlexMonths, m.name].sort((a, b) => {
                                    const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                                    return monthOrder.indexOf(a) - monthOrder.indexOf(b);
                                  });
                                }
                                setSelectedFlexMonths(newSelected);
                              }}
                            >
                              <div className="icon">
                                <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="3" y="5" width="26" height="24" rx="3" />
                                  <line x1="3" y1="11" x2="29" y2="11" />
                                  <line x1="9" y1="2" x2="9" y2="8" />
                                  <line x1="23" y1="2" x2="23" y2="8" />
                                </svg>
                              </div>
                              <div className="month-name">{m.name}</div>
                              <div className="year">2026</div>
                            </FlexibleMonthCard>
                          ))}
                        </ScrollContainer>
                        <NavButton className="right" type="button" onClick={() => scroll('right')}>❯</NavButton>
                      </FlexibleScrollWrapper>
                    </FlexibleWrapper>
                  )}
                </Dropdown>
              )}
            </SearchItem>
            {/* --- WHEN SECTION END --- */}

            <div style={{ width: '1px', height: '32px', background: '#ddd' }}></div>

            <SearchItem ref={whoRef} onClick={() => { setOpenWho(!openWho); setOpenWhen(false); }} active={openWho}>
              <div style={{ fontSize: '12px', fontWeight: '800' }}>
                Who
              </div>
              <div style={{ fontSize: '14px', color: totalGuests > 0 ? '#222' : '#717171' }}>
                {totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}${guests.pets > 0 ? `, ${guests.pets} pet${guests.pets > 1 ? 's' : ''}` : ''}` : "Add guests"}
              </div>

              {openWho && (
                <Dropdown onClick={(e) => e.stopPropagation()} style={{ right: 0, left: 'auto', transform: 'none', width: '400px' }}>
                  {[
                    { id: 'adults', label: 'Adults', desc: 'Ages 13 or above' },
                    { id: 'children', label: 'Children', desc: 'Ages 2–12' },
                    { id: 'infants', label: 'Infants', desc: 'Under 2' },
                    { id: 'pets', label: 'Pets', desc: 'Bringing a service animal?', link: true }
                  ].map((item) => (
                    <GuestRow key={`guest-type-${item.id}`}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#222' }}>{item.label}</div>
                        <div style={{ fontSize: '14px', color: '#717171', textDecoration: item.link ? 'underline' : 'none' }}>{item.desc}</div>
                      </div>
                      <Counter>
                        <button onClick={() => updateCount(item.id, 'sub')} disabled={guests[item.id] === 0}>−</button>
                        <span>{guests[item.id]}</span>
                        <button onClick={() => updateCount(item.id, 'add')}>+</button>
                      </Counter>
                    </GuestRow>
                  ))}
                </Dropdown>
              )}
            </SearchItem>

            <div 
            onClick={handleFinalSearch}
            style={{ background: '#ff385c', width: '48px', height: '48px', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px', cursor: 'pointer' }}>
              <FaSearch size={18} />
            </div>

          </div>


        </SearchBox>
      </HeaderWrapper>
      {isLoginOpen && (
        <LoginPage
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          setIsLoggedIn={setIsLoggedIn}
          setUserName={setUserName}
        />
      )}
    </>
  );
}
