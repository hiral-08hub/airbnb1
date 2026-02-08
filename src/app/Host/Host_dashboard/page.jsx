"use client";
import React, { useState, useEffect } from 'react';
import Header1 from '../Header.jsx';
import styled from '@emotion/styled';
import { useRouter,useSearchParams } from 'next/navigation';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { Suspense } from 'react'


function DashboardContent() {
    const [reservations, setReservations] = useState([]);
    const [subTab, setSubTab] = useState('today');
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'today';
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [activeSubTab, setActiveSubTab] = useState('photos');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [editingField, setEditingField] = useState(null);



    const handleEditOpen = (item) => {
        setSelectedProperty(item);
        setIsEditing(true);
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        const fetchData = async () => {
           
            if (typeof window !== 'undefined') {
                const userPhone = localStorage.getItem('userPhone');

                if (!userPhone) {
                    
                    console.warn("No phone number found in localStorage");
                    setLoading(false); 
                    return;
                }

                setLoading(true);
                try {
                    if (activeTab === 'today') {
                        
                        const res = await fetch(`http://127.0.0.1:8000/api/accounts/reservations/?phone=${userPhone}`);
                        if (res.ok) {
                            const data = await res.json();
                            setReservations(data);
                        }
                    } else if (activeTab === 'listings') {
                       
                        const res = await fetch(`http://127.0.0.1:8000/api/accounts/user-properties/?phone=${userPhone}`);
                        if (res.ok) {
                            const data = await res.json();
                            setListings(data);
                        }
                    }
                } catch (error) {
                    console.error("Error:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [activeTab]);
    const handleAddressEdit = () => {
       
        console.log("Address edit button clicked!");
        alert("Address Edit Modal/Form khulvu joie.");
    };
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyAW3Me7nlD9dhS4nTlNyFbPFR5SM_KrOG0" 
    });
   
    const coordinates = {
        lat: parseFloat(selectedProperty?.lat) || 22.3039, 
        lng: parseFloat(selectedProperty?.lng) || 70.8022 
    };
    const mapContainerStyle = {
        width: '100%',
        height: '300px',
        borderRadius: '12px'
    };
    const mapOptions = {
        disableDefaultUI: true,
        zoomControl: true,
    };
    const GuestIcons = [
        "👤", "👨‍💼", "👩‍💼", "👨‍🎨", "👩‍🚀", "👨‍🚒", "👩‍🔬", "👨‍💻", "👩‍🏫", "🐫" 
    ];
    return (
        <PageWrapper>
            <Suspense fallback={<div>Loading header...</div>}>
            <Header1 setIsEditing={setIsEditing}/>
            

            <ContentArea>
               
                {isEditing ? (
                    <EditorOverlay>
                        <div className="editor-layout">
                           
                            {!selectedRoom && !editingField && (
                                <div className="sidebar">
                                    <div className="title-container">
                                        <button onClick={() => setIsEditing(false)} className="back-arrow-btn">←</button>
                                        <h1 className="title">Listing editor</h1>
                                    </div>

                                    <div className="editor-nav">
                                        <div className="nav-center">
                                            <button className="nav-item active">Your space</button>
                                            <button className="nav-item">Arrival guide</button>
                                            <button className="settings-btn">⚙</button>
                                        </div>
                                    </div>

                                    <div className="sidebar-scroll-area">
                                        <div className="status-alert">
                                            <div className="alert-content">
                                                <span className="dot">●</span>
                                                <div>
                                                    <strong>Complete required steps</strong>
                                                    <p>Finish these final tasks to publish your listing.</p>
                                                </div>
                                            </div>
                                            <span>❯</span>
                                        </div>

                                        {[
                                            { id: 'photos', title: 'Photo tour', desc: 'Manage your photos' },
                                            { id: 'title', title: 'Title', desc: selectedProperty?.title || "Add a title" },
                                            { id: 'type', title: 'Property type', desc: selectedProperty?.home_type || "House" },
                                            { id: 'location', title: 'Location', desc: selectedProperty?.address || "Rajkot Hwy, Rajkot, Gujarat, India" },
                                            { id: 'pricing', title: 'Pricing', desc: `₹${selectedProperty?.price || "0"} per night` },
                                            { id: 'guests', title: 'Number of guests', desc: `${selectedProperty?.guests || "1"} guests` },
                                            { id: 'description', title: 'Description', desc: selectedProperty?.description || "Make some memories." }
                                        ].map((item) => (
                                            <div
                                                key={item.id}
                                                className={`menu-card ${activeSubTab === item.id ? 'active' : ''}`}
                                                onClick={() => setActiveSubTab(item.id)}
                                            >
                                                {item.id === 'location' ? (
                                                    <div className="sidebar-map-wrapper" style={{ height: '300px', width: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                                                        <div className="map-container" style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                                                            {isLoaded ? (
                                                                <GoogleMap
                                                                    center={coordinates}
                                                                    zoom={15}
                                                                    mapContainerStyle={mapContainerStyle}
                                                                    options={mapOptions}
                                                                >
                                                                   
                                                                    <MarkerF
                                                                        position={coordinates}
                                                                        icon={{
                                                                            url: 'https://cdn-icons-png.flaticon.com/512/619/619153.png',
                                                                            scaledSize: new window.google.maps.Size(40, 40)
                                                                        }}
                                                                    />
                                                                </GoogleMap>
                                                            ) : (
                                                                <div style={{ height: '300px', background: '#f5f5f5' }}>Loading Map...</div>
                                                                
                                                            )}
                                                        </div>

                                                        {/* Address Detail Section */}
                                                        <div
                                                            className="address-info"
                                                            onClick={handleAddressEdit}
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                marginTop: '25px',
                                                                paddingTop: '20px',
                                                                borderTop: '1px solid #ebebeb',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <div>
                                                                <h3 style={{ fontSize: '16px', margin: '0 0 5px 0' }}>Address</h3>
                                                                <p style={{ color: '#717171', margin: 0 }}>
                                                                    {selectedProperty?.address || "Rajkot Hwy"}, {selectedProperty?.city}, {selectedProperty?.state}
                                                                </p>
                                                            </div>
                                                            <span className="arrow-icon" style={{ fontSize: '24px' }}>›</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="menu-text">
                                                            <h3>{item.title}</h3>
                                                            <p className="text-truncate">{item.desc}</p>
                                                        </div>
                                                        <span>❯</span>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                          
                            <div className="main-content">
                                {activeSubTab === 'photos' && (
                                    <div className="photo-section">
                                        {!selectedRoom ? (
                                           
                                            <>
                                                <div className="content-header">
                                                    <div className="header-top-row">
                                                        <h2>Photo tour</h2>
                                                        <div className="header-actions">
                                                            <button className="all-photos-btn">All photos</button>
                                                            <button className="add-btn">+</button>
                                                        </div>
                                                    </div>
                                                    <p>Manage photos and add details. Guests will only see your tour if every room has a photo.</p>
                                                </div>

                                                <div className="photo-grid">
                                                   
                                                    <div className="room-card" onClick={() => setSelectedRoom('living-room')}>
                                                        <img src={`http://127.0.0.1:8000${selectedProperty?.img1}`} alt="Living room" />
                                                        <div className="room-info">
                                                            <h4>Living room</h4>
                                                            <p>6 photos</p>
                                                        </div>
                                                    </div>

                                                   
                                                    <div className="room-card placeholder" onClick={() => setSelectedRoom('bedroom')}>
                                                        <div className="icon-box">🛏️</div>
                                                        <div className="room-info">
                                                            <h4>Bedroom</h4>
                                                            <p className="add-link">Add photos</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="photo-editor-layout">
                                               
                                                <aside className="editor-sidebar-fixed">
                                                    <div className="sidebar-left-arrow">
                                                        <button className="back-arrow-btn" onClick={() => setSelectedRoom(null)}>
                                                            ←
                                                        </button>
                                                    </div>

                                                    <div className="sidebar-menu-content">
                                                        <div className="mini-room-list">
                                                            <div
                                                                className={`room-mini-card ${selectedRoom === 'living-room' ? 'active' : ''}`}
                                                                onClick={() => setSelectedRoom('living-room')}
                                                            >
                                                                <img src={`http://127.0.0.1:8000${selectedProperty?.img1}`} alt="Living room" />
                                                                <p>Living room</p>
                                                            </div>

                                                            <div
                                                                className={`room-mini-card ${selectedRoom === 'bedroom' ? 'active' : ''}`}
                                                                onClick={() => setSelectedRoom('bedroom')}
                                                            >
                                                                <div className="icon-bg">🛏️</div>
                                                                <p>Bedroom</p>
                                                            </div>

                                                            <div
                                                                className={`room-mini-card ${selectedRoom === 'bathroom' ? 'active' : ''}`}
                                                                onClick={() => setSelectedRoom('bathroom')}
                                                            >
                                                                <div className="icon-bg">🛁</div>
                                                                <p>Full bathroom</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </aside>

                                               
                                                <main className="photo-grid-main">
                                                    <div className="grid-header">
                                                        <h1 className="room-title">{selectedRoom === 'living-room' ? 'Living room' : 'Bedroom'}</h1>
                                                        <div className="header-controls">
                                                            <button className="manage-photos-btn">Manage photos</button>
                                                            <button className="add-photo-btn">+</button>
                                                        </div>
                                                    </div>

                                                    <div className="photos-layout">
                                                       
                                                        {[1, 2, 3, 4, 5].map((photo) => (
                                                            <div key={photo} className="photo-card-item">
                                                                <img src={`http://127.0.0.1:8000${selectedProperty?.img1}`} alt="room view" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </main>
                                            </div>
                                        )}
                                    </div>
                                )}
                               
                                {activeSubTab === 'title' && (
                                    <div className="title-edit-section">
                                        <div className="content-header">
                                            <h2>Listing title</h2>
                                            <p>Your listing title should highlight what makes your place special.</p>
                                        </div>

                                        <div className="edit-box">
                                            <textarea
                                                className="title-textarea"
                                                value={selectedProperty?.title || ""}
                                                onChange={(e) => setSelectedProperty({ ...selectedProperty, title: e.target.value })}
                                                maxLength={50}
                                                rows={5}
                                                placeholder="Enter your listing title"
                                            />
                                            <div className="char-count">
                                                {selectedProperty?.title?.length || 0} / 50 characters
                                            </div>
                                        </div>

                                        <div className="footer-actions">
                                            <button
                                                className="cancel-btn"
                                                onClick={() => setActiveSubTab('photos')}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="save-btn"
                                                onClick={() => alert("Title saved!")}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                )}


                                {activeSubTab === 'type' && (
                                    <div className="property-edit-section">
                                        <div className="content-header">
                                            <h2>Property type</h2>
                                        </div>

                                        <div className="edit-form">
                                            
                                            <div className="input-group">
                                                <label>Which is most like your place?</label>
                                                <select
                                                    value={selectedProperty?.category || "House"}
                                                    onChange={(e) => setSelectedProperty({ ...selectedProperty, category: e.target.value })}
                                                >
                                                    <option value="House">House</option>
                                                    <option value="Flat">Flat</option>
                                                    <option value="Guest house">Guest house</option>
                                                    <option value="Hotel">Hotel</option>
                                                </select>
                                            </div>

                                           
                                            <div className="input-group">
                                                <label>Property type</label>
                                                <select
                                                    value={selectedProperty?.home_type || "Home"}
                                                    onChange={(e) => setSelectedProperty({ ...selectedProperty, home_type: e.target.value })}
                                                >
                                                    <option value="Home">Home</option>
                                                    <option value="Cabin">Cabin</option>
                                                    <option value="Villa">Villa</option>
                                                </select>
                                                <p className="helper-text">A home that may stand alone or have shared walls.</p>
                                            </div>

                                            
                                            <div className="input-group">
                                                <label>Listing type</label>
                                                <select>
                                                    <option value="Entire place">Entire place</option>
                                                    <option value="Private room">Private room</option>
                                                    <option value="Shared room">Shared room</option>
                                                </select>
                                                <p className="helper-text">Guests have the whole place to themselves. This usually includes a bedroom, a bathroom and a kitchen.</p>
                                            </div>

                                            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '10px 0' }} />

                                            {/* --- NEW MENU ITEMS FROM SCREENSHOT --- */}

                                           
                                            <div className="counter-row">
                                                <span className="label-text">How many floors in the building?</span>
                                                <div className="counter-controls">
                                                    <button className="cnt-btn">−</button>
                                                    <span className="count-number">1</span>
                                                    <button className="cnt-btn">+</button>
                                                </div>
                                            </div>

                                            <div className="counter-row">
                                                <span>Which floor is the listing on?</span>
                                                <div className="counter-controls">
                                                    <button className="cnt-btn">−</button>
                                                    <span>1</span>
                                                    <button className="cnt-btn">+</button>
                                                </div>
                                            </div>

                                           
                                            <div className="input-group">
                                                <label>Year built</label>
                                                <input type="text" placeholder="Year built" className="simple-input" />
                                            </div>

                                            
                                            <div className="size-group">
                                                <div className="input-group">
                                                    <label>Property size</label>
                                                    <input
                                                        type="number"
                                                        placeholder="Property size"
                                                        className="simple-input"
                                                    />
                                                </div>
                                                <div className="input-group unit-select">
                                                    <label>Unit</label>
                                                    <select>
                                                        <option>sq metres</option>
                                                        <option>sq feet</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="footer-actions">
                                            <button className="cancel-btn" onClick={() => setActiveSubTab('photos')}>Cancel</button>
                                            <button className="save-btn">Save</button>
                                        </div>
                                    </div>
                                )}
                                {activeSubTab === 'location' && (
                                    <div className="description-section-container">
                                        {!editingField ? (
                                            
                                            <div className="property-edit-section">
                                                <div className="content-header">
                                                    <h2>Location</h2>
                                                    <p>Your address is only shared with guests after they’ve booked.</p>
                                                </div>


                                                <div className="edit-form description-menu-list">
                                                   
                                                    <div style={{
                                                        width: '100%',
                                                        height: '200px',
                                                        borderRadius: '12px',
                                                        overflow: 'hidden',
                                                        marginBottom: '20px',
                                                        border: '1px solid #ddd'
                                                    }}>
                                                        {isLoaded ? (
                                                            <GoogleMap
                                                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                                                center={coordinates}
                                                                zoom={15}
                                                                options={{
                                                                    disableDefaultUI: true,
                                                                    zoomControl: true
                                                                }}
                                                            >
                                                                <MarkerF position={coordinates} />
                                                            </GoogleMap>
                                                        ) : (
                                                            <div style={{
                                                                height: '100%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                backgroundColor: '#f7f7f7',
                                                                color: '#717171'
                                                            }}>
                                                                Loading Map...
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div
                                                        className="description-menu-item"
                                                        onClick={() => setEditingField('Address')}
                                                    >
                                                        <div className="menu-item-content">
                                                            <h4>Address</h4>
                                                            <p className="text-truncate">{selectedProperty?.address || "Rajkot Hwy, Rajkot, Gujarat"}</p>
                                                        </div>
                                                        <span className="chevron-icon">›</span>
                                                    </div>
                                                   
                                                </div>
                                            </div>
                                        ) : (
                                           
                                            <div className="photo-editor-layout1">

                                                
                                                <aside className="editor-sidebar-fixed1">
                                                    <div className="back-btn-wrapper">
                                                        <button className="back-circle" onClick={() => setEditingField(null)}>←</button>
                                                        <h4 className="text">Location</h4>
                                                    </div>

                                                    <div className="edit-form description-menu-list">
                                                       
                                                        <div style={{
                                                            width: '100%',
                                                            height: '200px',
                                                            borderRadius: '12px',
                                                            overflow: 'hidden',
                                                            marginBottom: '20px',
                                                            border: '1px solid #ddd'
                                                        }}>
                                                            {isLoaded ? (
                                                                <GoogleMap
                                                                    mapContainerStyle={{ width: '100%', height: '100%' }}
                                                                    center={coordinates}
                                                                    zoom={15}
                                                                    options={{
                                                                        disableDefaultUI: true, 
                                                                        zoomControl: true
                                                                    }}
                                                                >
                                                                    <MarkerF position={coordinates} />
                                                                </GoogleMap>
                                                            ) : (
                                                                <div style={{
                                                                    height: '100%',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    backgroundColor: '#f7f7f7',
                                                                    color: '#717171'
                                                                }}>
                                                                    Loading Map...
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div
                                                            className={`description-menu-item ${editingField === 'Address' ? 'active-item' : ''}`}
                                                            onClick={() => setEditingField('Address')}
                                                        >
                                                            <div className="menu-item-content">
                                                                <h4>Address</h4>
                                                                <p className="text-truncate">{selectedProperty?.address || "Edit your address"}</p>
                                                            </div>
                                                            <span className="chevron-icon">›</span>
                                                        </div>
                                                    </div>
                                                </aside>

                                              
                                                <main className="photo-grid-main"
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        height: '100vh',
                                                        backgroundColor: '#fff',
                                                        flex: 1,
                                                        overflow: 'hidden'
                                                    }}>
                                                    <div className="grid-header" style={{ padding: '0px', borderBottom: '1px solid #eee' }}>
                                                        <h1 className="room-title" style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
                                                            {editingField}
                                                        </h1>
                                                    </div>

                                                    <div className="edit-view-body" style={{
                                                        padding: '0px',
                                                        overflowY: 'scroll',
                                                        flex: 1,                 
                                                        maxHeight: '240px',        
                                                        display: 'block'

                                                    }}>
                                                        <p style={{ color: '#717171', marginBottom: '20px', fontSize: '14px' }}>
                                                            Enter your property’s full address. This will only be shared with confirmed guests.
                                                        </p>

                                                        {/* Address Edit Form */}
                                                        <div style={{ border: '1px solid #b0b0b0', borderRadius: '12px', overflow: 'hidden' }}>
                                                            {[
                                                                { label: "Country/region", value: "India" },
                                                                { label: "Street address", value: selectedProperty?.address || "" },
                                                                { label: "Flat, suite, etc. (Optional)", value: "" },
                                                                { label: "City", value: selectedProperty?.city || "" },
                                                                { label: "State", value: "Gujarat" },
                                                                { label: "PIN code", value: "360001" }
                                                            ].map((item, idx, arr) => (
                                                                <div key={idx} style={{
                                                                    padding: '12px 16px',
                                                                    borderBottom: idx === arr.length - 1 ? 'none' : '1px solid #eee',
                                                                    backgroundColor: '#fff'
                                                                }}>
                                                                    <label style={{ fontSize: '12px', color: '#717171', display: 'block', fontWeight: '500' }}>
                                                                        {item.label}
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder={item.label}
                                                                        defaultValue={item.value}
                                                                        style={{
                                                                            border: 'none',
                                                                            outline: 'none',
                                                                            width: '100%',
                                                                            fontSize: '16px',
                                                                            marginTop: '4px',
                                                                            color: '#222'
                                                                        }}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Footer Buttons */}
                                                    <div className="edit-view-footer" style={{
                                                        borderTop: '1px solid #eee',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        padding: '16px 24px',
                                                        backgroundColor: '#fff',
                                                        flexShrink: 0,        
                                                        marginTop: '5px',   
                                                        width: '100%',
                                                        boxSizing: 'border-box'
                                                    }}>
                                                        <button
                                                            onClick={() => setEditingField(null)}
                                                            style={{
                                                                background: 'none',
                                                                color: '#222',
                                                                textDecoration: 'underline',
                                                                fontWeight: '600',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                fontSize: '14px'
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>

                                                        <button style={{
                                                            background: '#222',
                                                            color: '#fff',
                                                            padding: '10px 24px',
                                                            borderRadius: '8px',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            fontWeight: '600',
                                                            fontSize: '14px'
                                                        }}>
                                                            Save
                                                        </button>
                                                    </div>
                                                </main>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activeSubTab === 'description' && (
                                    <div className="description-section-container">
                                        {!editingField ? (
                                            
                                            <div className="property-edit-section">
                                                <div className="content-header">
                                                    <h2>Description</h2>
                                                    <p>Make some memories at this unique and family-friendly place.</p>
                                                </div>

                                                <div className="edit-form description-menu-list">
                                                    <div
                                                        className="description-menu-item"
                                                        onClick={() => setEditingField('Listing Description')}
                                                    >
                                                        <div className="menu-item-content">
                                                            <h4>Listing description</h4>
                                                            <p className="text-truncate">{selectedProperty?.description || "Make some memories..."}</p>
                                                        </div>
                                                        <span className="chevron-icon">›</span>
                                                    </div>
                                                    <div
                                                        className="description-menu-item"
                                                        onClick={() => setEditingField('Your Property')}
                                                    >
                                                        <div className="menu-item-content">
                                                            <h4>Your Property</h4>
                                                            <p className="text-truncate">{selectedProperty?.description || "Make some memories..."}</p>
                                                        </div>
                                                        <span className="chevron-icon">›</span>
                                                    </div>
                                                    <div
                                                        className="description-menu-item"
                                                        onClick={() => setEditingField('Guest access')}
                                                    >
                                                        <div className="menu-item-content">
                                                            <h4>Guest Access</h4>
                                                            <p className="text-truncate">{selectedProperty?.description || "Make some memories..."}</p>
                                                        </div>
                                                        <span className="chevron-icon">›</span>
                                                    </div>
                                                    <div
                                                        className="description-menu-item"
                                                        onClick={() => setEditingField('Interaction with guest')}
                                                    >
                                                        <div className="menu-item-content">
                                                            <h4>Interaction with guest</h4>
                                                            <p className="text-truncate">{selectedProperty?.description || "Make some memories..."}</p>
                                                        </div>
                                                        <span className="chevron-icon">›</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                           
                                            <div className="photo-editor-layout1">

                                               
                                                <aside className="editor-sidebar-fixed1">
                                                    <div className="back-btn-wrapper">
                                                        <button className="back-circle" onClick={() => setEditingField(null)}>←</button>
                                                        <h4 className="text" >Description</h4>

                                                    </div>

                                                    <div className="edit-form description-menu-list">
                                                        <div
                                                            className="description-menu-item"
                                                            onClick={() => setEditingField('Listing description')}
                                                        >
                                                            <div className="menu-item-content">
                                                                <h4>Listing description</h4>
                                                                <p className="text-truncate">{selectedProperty?.description || "Make some memories..."}</p>
                                                            </div>
                                                            <span className="chevron-icon">›</span>
                                                        </div>
                                                        <div
                                                            className="description-menu-item"
                                                            onClick={() => setEditingField('your property')}
                                                        >
                                                            <div className="menu-item-content">
                                                                <h4>Your Propertyn</h4>
                                                                <p className="text-truncate">{selectedProperty?.description || "Make some memories..."}</p>
                                                            </div>
                                                            <span className="chevron-icon">›</span>
                                                        </div>
                                                        <div
                                                            className="description-menu-item"
                                                            onClick={() => setEditingField('Guest access')}
                                                        >
                                                            <div className="menu-item-content">
                                                                <h4>Guest access</h4>
                                                                <p className="text-truncate">{selectedProperty?.description || "Make some memories..."}</p>
                                                            </div>
                                                            <span className="chevron-icon">›</span>
                                                        </div>
                                                        <div
                                                            className="description-menu-item"
                                                            onClick={() => setEditingField('Interaction with guest')}
                                                        >
                                                            <div className="menu-item-content">
                                                                <h4>Interaction with guest</h4>
                                                                <p className="text-truncate">{selectedProperty?.description || "Make some memories..."}</p>
                                                            </div>
                                                            <span className="chevron-icon">›</span>
                                                        </div>


                                                    </div>
                                                </aside>

                                                
                                                <main className="photo-grid-main">
                                                    <div className="grid-header">
                                                        <h1 className="room-title">{editingField}</h1>
                                                    </div>

                                                    <div className="edit-view-body" style={{ padding: '20px' }}>
                                                        <p className="char-counter" style={{ textAlign: 'right', color: '#717171' }}>
                                                            {selectedProperty?.description?.length || 0}/500 available
                                                        </p>
                                                        <textarea
                                                            className="edit-textarea"
                                                            style={{
                                                                width: '100%',
                                                                height: '150px',
                                                                borderRadius: '12px',
                                                                padding: '15px',
                                                                border: '1px solid #ddd',
                                                                fontSize: '16px'
                                                            }}
                                                            defaultValue={selectedProperty?.description}
                                                        />
                                                    </div>

                                                    <div className="edit-view-footer" style={{

                                                        borderTop: '1px solid #eee',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}>
                                                        <button className="cancel-btn-text" onClick={() => setEditingField(null)} style={{
                                                            background: '#fce8e8',
                                                            color: '#0c0c0c',
                                                            padding: '6px 16px',
                                                            borderRadius: '6px',
                                                            border: 'none',
                                                            fontSize: '14px',
                                                            cursor: 'pointer'
                                                        }}>
                                                            Cancel
                                                        </button>
                                                        <button className="save-black-btn" style={{
                                                            background: '#f5dbdb',
                                                            color: '#0f0c0c',
                                                            padding: '6px 16px',
                                                            borderRadius: '6px',
                                                            border: 'none',
                                                            fontSize: '14px',
                                                            cursor: 'pointer'
                                                        }}>
                                                            Save
                                                        </button>
                                                    </div>
                                                </main>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </EditorOverlay>
                ) : (
                  <div className="dashboard-content-wrapper" style={{ padding: '40px 80px' }}>
                
                {/* TODAY TAB CONTENT */}
                {activeTab === 'today' && (
                    <div className="today-tab">
                        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Today</h1>
                        <p style={{ color: '#717171', fontSize: '18px' }}>Welcome back, Host!</p>
                        
                        <div className="today-stats" style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                            <div style={{ padding: '24px', border: '1px solid #ddd', borderRadius: '12px', flex: 1 }}>
                                <h3>0 arrivals</h3>
                                <p>Checking in today</p>
                            </div>
                            <div style={{ padding: '24px', border: '1px solid #ddd', borderRadius: '12px', flex: 1 }}>
                                <h3>0 checking out</h3>
                                <p>For today and tomorrow</p>
                            </div>
                            <div style={{ padding: '24px', border: '1px solid #ddd', borderRadius: '12px', flex: 1 }}>
                                <h3>0 upcoming</h3>
                                <p>In the next few days</p>
                            </div>
                        </div>
                    </div>
                )}
                 {activeTab === 'calendar' && (
                    <div style={{ padding: '40px' }}>
          <div style={{ marginTop: '50px' }}>
        <h2>January 2026</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
          {Array.from({ length: 31 }).map((_, i) => (
            <div key={i} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px' }}>{i + 1}</div>
              <div style={{ fontWeight: 'bold' }}>₹3,640</div>
            </div>
          ))}
        </div>
      </div>
    </div>
                )}
                 {activeTab === 'listings' && (
                    <ListingContainer>
                        <div className="list-header-main">
                            <h2>Your listing</h2>
                            <div className="header-btns">
                                <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="circle-btn">
                                    {viewMode === 'list' ? '⊞' : '＝'}
                                </button>
                                <button onClick={() => router.push('/Host/Step1')} className="circle-btn">+</button>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="listing-table">
                                <thead>
                                    <tr>
                                        <th>LISTING</th>
                                        <th>TYPE</th>
                                        <th>LOCATION</th>
                                        <th>STATUS</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listings.map((item) => (
                                        <tr key={item.id}>
                                            <td className="item-name">
                                                <img src={`http://127.0.0.1:8000${item.img1}`} alt="" />
                                                {item.title}
                                            </td>
                                            <td>{item.home_type}</td>
                                            <td>{item.city}</td>
                                            <td><span className="status-dot">●</span> Active</td>
                                            <td>
                                                <button className="edit-row-btn" onClick={() => handleEditOpen(item)}>Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </ListingContainer>
                )}</div>
            )}
            </ContentArea>
            </Suspense>
        </PageWrapper>
    );

}

export default function HostingPage() {
    return (
       
        <Suspense fallback={<div style={{ padding: '20px' }}>Loading Dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
    
}



// --- CSS STYLES ---
const itemStyle = { display: 'flex', alignItems: 'center', padding: '24px 0', borderBottom: '1px solid #ebebeb', cursor: 'pointer' };
const labelStyle = { fontSize: '18px', fontWeight: '500', marginBottom: '4px' };
const subtextStyle = { color: '#717171', fontSize: '14px' };
const linkStyle = { color: '#222', textDecoration: 'underline', fontWeight: '600' };
const chevronStyle = { fontSize: '24px', color: '#222' };
const PageWrapper = styled.div` background: white; min-height: 100vh; font-family: sans-serif; `;
const ContentArea = styled.div` max-width: 1200px; margin: 0 auto; padding: 20px; `;
const EditorOverlay = styled.div`
  /* Layout */
  .editor-layout {
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 40px;
    height: 100vh;
  }

  /* Navigation */
  .editor-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
    margin-bottom: 40px;

    .nav-center {
      display: flex;
      background: #f7f7f7;
      border-radius: 30px;
      padding: 4px;

      .nav-item {
        border: none;
        padding: 8px 20px;
        border-radius: 25px;
        cursor: pointer;
        background: transparent;
        font-weight: 500;
        
        &.active {
          background: white;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
 /* Sidebar Container */
.sidebar {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 40px); 
    position: sticky;
    top: 20px;
    width: 350px; 
}

/* સાઇડબારનો અંદરનો ભાગ જ્યાં કાર્ડ્સ છે */
.sidebar-scroll-area {
    flex: 1;
    overflow-y: auto !important; 
    overflow-x: hidden;
    padding-right: 10px;
    
  
   scrollbar-width: thin;
    scrollbar-color: #201616 transparent; 
}


.sidebar-scroll-area::-webkit-scrollbar {
   width: 6px;
}

.sidebar-scroll-area::-webkit-scrollbar-track {
    background: transparent;
}

.sidebar-scroll-area::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 10px;
}

.sidebar-scroll-area::-webkit-scrollbar-thumb:hover {
    background-color: #bbb;
}

/* Sidebar Items */
.menu-card {
    border: 1px solid #f0e9e9;
    border-radius: 12px;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    margin-bottom: 12px;
    transition: all 0.2s;
}

.menu-card:hover {
    border: 1px solid #222 !important;
    background-color: #f7f7f7;
}

.menu-card.active {
    border: 2px solid #222 !important;
}
  /* Status Alert */
  .status-alert {
    border: 1px solid #ddd;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 25px;
    cursor: pointer;

    .alert-content {
      display: flex;
      gap: 15px;
      .dot { color: #c13515; font-size: 12px; }
      p { font-size: 14px; color: #717171; margin-top: 5px; }
    }
  }

  /* Back Button & Title */
  .title-container {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 25px;

    .title { font-size: 32px; font-weight: 600; margin: 0; }
    .back-arrow-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      &:hover { background: #f7f7f7; }
    }
  } 

.main-content {
    flex: 1;
    height: calc(100vh - 80px); 
    overflow-y: auto; 
    padding-right: 10px;
    scrollbar-width: none;
    
    -ms-overflow-style: none;
}


.main-content::-webkit-scrollbar {
    width: 6px;
}

.main-content::-webkit-scrollbar-track {
    background: transparent;
}

.main-content::-webkit-scrollbar-thumb {
    background: #dddddd; 
    border-radius: 10px;
}

.main-content::-webkit-scrollbar {
    display: none;
}

.main-content::-webkit-scrollbar-thumb:hover {
    background: #b0b0b0;
}
    /* Header for Sections */
    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      
      h2 { font-size: 24px; font-weight: 600; margin-bottom: 8px; }
      p { color: #717171; max-width: 450px; line-height: 1.5; font-size: 16px; }

      .header-actions {
        display: flex;
        gap: 10px;
        
        .action-btn-outline { 
          background: white; 
          border: 1px solid #222; 
          padding: 8px 16px; 
          border-radius: 8px; 
          font-weight: 600; 
          cursor: pointer; 
          &:hover { background: #f7f7f7; }
        }
        
        .action-btn-plus { 
          width: 40px; 
          height: 40px; 
          border-radius: 50%; 
          border: 1px solid #ddd; 
          background: white; 
          cursor: pointer; 
          font-size: 20px; 
          display: flex;
          align-items: center;
          justify-content: center;
          &:hover { border-color: #222; }
        }
      }
    }

.photo-section {
    width: 100%;
    padding: 20px;
   margin-left: 60px;
   box-sizing: border-box;
}


.content-header {
   display: flex;
    flex-direction: column; 
    gap: 8px;
    margin-bottom: 30px;
    max-width: 1100px;
    align-items: flex-start; 
}

.content-header h2 {
   font-size: 32px;
    font-weight: 600;
    margin: 0; 
}

.content-header p {
  font-size: 16px;
    color: #717171;
    margin: 0;
    max-width: 600px;
}
}


.photo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 4fr));
    gap: 24px;
    width: 100%;
}


.room-card {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.room-card:hover {
    transform: translateY(-5px);
}


.room-card img, 
.room-card.placeholder .icon-box {
    width: 100%;
    aspect-ratio: 1 / 1; 
    border-radius: 16px;
    object-fit: cover;
}

.room-card.placeholder .icon-box {
    background-color: #F7F7F7;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
    border: none;
}


.room-info {
    margin-top: 12px;
    text-align: center; 
}

.room-info h4 {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
    color: #222;
}

.room-info p {
    font-size: 14px;
    color: #717171;
    margin-top: 4px;
}

.add-link {
    text-decoration: underline;
    font-weight: 600;
    color: #222;
}

.header-top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    gap:320px;
}

.header-top-row h2 {
    font-size: 32px;
    font-weight: 600;
    margin: 0;
}


.content-header p {
    font-size: 16px;
    color: #717171;
    margin: 0;
    width: 80%;
}


.header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
}


.all-photos-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #f7f7f7;
    border: 1px solid #dddddd;
    padding: 8px 16px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.all-photos-btn:hover {
    background-color: #ebebeb;
}


.add-btn {
    width: 40px;
    height: 40px;
    background-color: #f7f7f7;
    border: 1px solid #dddddd;
    border-radius: 50%;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
}

.add-btn:hover {
    background-color: #ebebeb;
}
 .title-edit-section {
   
    display: flex;
    flex-direction: column;
    justify-content: center; /* Vertically center */
    align-items: center;     /* Horizontally center */
    
   
    height: 100%;            
    min-height: 80vh;        
    
    margin: 0 auto;
    width: 100%;
    max-width: 600px;       
    padding: 40px;

    .content-header {
      width: 100%;
      text-align: left;   
      margin-bottom: 24px;
      
      h2 { font-size: 26px; margin-bottom: 12px; }
      p { font-size: 16px; color: #717171; }
    }

    .edit-box {
      width: 100%;
      
      .title-textarea {
        width: 100%;
        padding: 24px;
        font-size: 18px;
        border: 1px solid #b0b0b0;
        border-radius: 12px;
        resize: none;
        font-family: inherit;
        
        &:focus {
          border: 2px solid #222;
          outline: none;
        }
      }

      .char-count {
        margin-top: 10px;
        font-size: 12px;
        font-weight: 600;
        color: #717171;
      }
    }

    .footer-actions {
      width: 100%;
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #ebebeb;
      padding-top: 20px;

      .cancel-btn {
        background: none;
        border: none;
        text-decoration: underline;
        font-weight: 600;
        cursor: pointer;
        font-size: 16px;
      }

      .save-btn {
        background: #222;
        color: white;
        padding: 14px 24px;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
          background: #000;
        }
      }
    }
  }
.photo-editor-layout {
    display: flex;
     position: fixed;
    width: 100vw;
    height: 100vh;
    background: #ffffff;
    position: fixed;
    top: 80px;
    left: 0;
    z-index: 9999;
}
/* મુખ્ય સાઈડબાર કન્ટેનર */
.editor-sidebar-fixed {
    display: flex;
    width: 250px;     
    height: 100vh;
    border-right: 1px solid #ddd;
    background: #fff;
    padding: 0;
    gap: 0;             
    margin-left:40px;
}

.sidebar-left-arrow {
    width: 50px;        
    display: flex;
    flex-direction: column;
    align-items: center;   
    justify-content: flex-start; 
    padding-top: 25px;     
    padding-left: 50px;}

 .back-arrow-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #222;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
}

.back-arrow-btn:hover {
    background: #f7f7f7;
}
.sidebar-menu-content {
    flex: 1;
    padding: 20px 0;     
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
}

.mini-room-list {
    width: 100%;
}


.room-mini-card {
    margin-bottom: 25px;
    cursor: pointer;
    text-align: center;
    width: 100%;
}

.room-mini-card img, 
.room-mini-card .icon-bg {
    width: 85px;
    height: 85px;
    border-radius: 12px;
    object-fit: cover;
    background: #f7f7f7;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    border: 2px solid transparent;
}

.room-mini-card.active img, 
.room-mini-card.active .icon-bg {
    border: 2px solid #222;
}

.room-mini-card p {
    font-size: 14px;
    margin-top: 8px;
    color: #222;
    font-weight: 400;
}


.photo-grid-main {
  flex: 1;
  padding: 100px 10%; 
  overflow-y: auto;
  margin-left:90px;
}
  .edit-view-body p{
  font-size:20px; 
  }
   .edit-view-body{
    height:50px;

   }
  
.edit-view-footer{
    padding-bottom:180px;
}


  .edit-view-body p{
  font-size:20px; 
  }
   .edit-view-body{
    height:20px;

   }
  
.edit-view-footer{
    padding-bottom:280px;
}
.grid-header {
  display: flex;
 justify-content: space-between;
  align-items: center;
  width: 500px;
  margin: 0 auto 10px;
}

.room-title {
  font-size: 26px;
  font-weight: 600;
  order: 1;
  color:#222222;
  
}

.header-controls {
  display: flex;
  gap: 15px;
  order: 2;
}

.manage-photos-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-weight: 500;
  color:#222222;
}

.add-photo-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  font-size: 20px;
}


.photos-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
  gap: 10px; 
  width: 500px;
  max-width: 1000px; 
  margin: 0 auto;
}

.photo-card-item img {
  width: 150px;
  aspect-ratio: 1 / 1; 
  border-radius: 8px;
  object-fit: cover;
} 
  
/* Property Type Edit Section */
  .property-edit-section {
    display: flex;
    flex-direction: column;
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
    width: 100%;

    .content-header {
      margin-bottom: 30px;
      h2 { font-size: 24px; font-weight: 600; }
    }

    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 25px;

      /* Input & Select Groups */
      .input-group {
        display: flex;
        flex-direction: column;
        gap: 8px;

        label {
          font-size: 16px;
          font-weight: 600;
          color: #222;
        }

        select, .simple-input {
          padding: 12px 15px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 16px;
          font-family: inherit;
          background-color: white;
          &:focus {
            border: 2px solid #222;
            outline: none;
            padding: 11px 14px; 
          }
        }

        .helper-text {
          font-size: 14px;
          color: #717171;
          line-height: 1.4;
        }
      }

      /* Counter Rows (Floors) */
      .counter-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;

        span { font-size: 16px; color: #222; }

        .counter-controls {
          display: flex;
          align-items: center;
          gap: 15px;

          .cnt-btn {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 1px solid #b0b0b0;
            background: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transition: border-color 0.2s;
            &:hover { border-color: #222; color: #000; }
          }

          .count-number {
            font-size: 16px;
            min-width: 20px;
            text-align: center;
          }
        }
      }

      /* Property Size & Unit (Inline Group) */
      .size-group {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 15px;
        
        .unit-select select {
          width: 100%;
        }
      }
    }

    /* Footer Buttons */
    .footer-actions {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .cancel-btn {
        background: none;
        border: none;
        text-decoration: underline;
        font-weight: 600;
        cursor: pointer;
        font-size: 16px;
      }

      .save-btn {
        background: #222;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        &:hover { background: #000; }
      }
    }
  }
/* Pricing Section Specific Styles */
  .property-edit-section {
    
    .pricing-header {
      margin-bottom: 40px;
    }

    .price-input-container {
      background: #f7f7f7;
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 30px;

      .input-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        label { font-size: 18px; font-weight: 600; }

        .smart-pricing-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          span { font-size: 14px; font-weight: 600; }
        }
      }

      /* Big Price Box */
      .price-box {
        display: flex;
        align-items: center;
        background: white;
        border: 1px solid #b0b0b0;
        border-radius: 8px;
        padding: 10px 20px;
        
        .currency { font-size: 24px; font-weight: 600; margin-right: 8px; }
        
        input {
          border: none;
          font-size: 32px;
          font-weight: 700;
          width: 100%;
          outline: none;
          color: #222;
          &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
            -webkit-appearance: none;
          }
        }
        
        &:focus-within {
          border: 2px solid #222;
          padding: 9px 19px;
        }
      }
    }

    /* Small Price Box for Weekend */
    .price-box-small {
      display: flex;
      align-items: center;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 8px 15px;
      margin-top: 10px;
      width: fit-content;

      .currency { font-weight: 600; margin-right: 5px; }
      input { border: none; outline: none; font-size: 16px; width: 80px; }
      
      .delete-btn {
        background: none;
        border: none;
        cursor: pointer;
        margin-left: 10px;
        padding: 5px;
        color: #000000;
        &:hover { 
        opacity: 0.7;
        color:black; }
      }
    }

    /* Discounts Section */
    .discounts-section {
      margin-top: 20px;
      h4 { font-size: 18px; margin-bottom: 8px; }
      p { color: #717171; font-size: 14px; margin-bottom: 15px; }

      .discount-val {
        font-weight: 600;
        color: #222;
        border-bottom: 1px dashed #b0b0b0;
      }
    }

    /* Toggle Switch CSS */
    .switch {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 24px;

      input { opacity: 0; width: 0; height: 0; }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: #474646;
        transition: .4s;
        border-radius: 24px;

        &:before {
          position: absolute;
          content: "";
          height: 18px; width: 18px;
          left: 3px; bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
      }

      input:checked + .slider { background-color: #222; }
      input:checked + .slider:before { transform: translateX(24px); }
    }
  }
/* મુખ્ય કન્ટેનર જે બધું સેન્ટર કરશે */
.guest-selection-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 50px 20px;
    width: 100%;
    min-height: 450px; 
}


.visualizer-box {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 110px;
    max-width: 480px;
    margin-bottom: 25px;
    flex-wrap: nowrap;
    overflow: hidden; 
    
    gap: 4px;        
    width: 100%;
}

.guest-avatar-anim {
    font-size: 15px; 
    display: inline-block;
    animation: bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}


.guest-display-title {
    font-size: 24px;
    color: #484848;
    font-weight: 400;
    max-width: 450px;
    margin-bottom: 45px;
    line-height: 1.3;
}

/* કાઉન્ટર સેક્શન */
.counter-interface {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 50px;
}

.big-guest-number {
    font-size: 100px; 
    font-weight: 600;
    color: #222;
    min-width: 110px;
    line-height: 1;
    user-select: none;
}


.round-control-btn {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: 1px solid #b0b0b0;
    background: white;
    color: #717171;
    font-size: 22px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.round-control-btn:hover:not(:disabled) {
    border-color: #222;
    color: #222;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.round-control-btn:disabled {
    opacity: 0.2;
    cursor: not-allowed;
}

/* એનિમેશન */
@keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}
/* Description Layout */

.is-editing-mode ~ .editor-sidebar-fixed, 
.is-editing-mode .left-sidebar-container { 
    display: none; 
}

.photo-editor-layout1 {
    display: flex;
    position: fixed;
   height: calc(100vh - 80px);
    background: white;
    font-size:30px;
    top: 80px;
    left: 70px;
    right: 0;
    bottom: 0;
    z-index: 9900;

.back-btn-wrapper {
    display: flex;           
    flex-direction: row;     
    align-items: center;      
    gap: 15px;                
    width: 100%;
    margin-bottom: 25px;
    padding-left: 5px;       
}

.back-circle {
    background: none;
    border: none;
    font-size: 24px;        
    cursor: pointer;
    color: #222;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: background 0.2s;
    
}

.back-circle:hover {
    background: #f7f7f7;     
}
.text{
    width:400px;
}

.header-text {
    margin: 0;              
    font-size: 22px;         
    font-weight: 600;
    color: #222;
}
.description-layout {
    display: flex;
    width: 100%;
    height: 100vh;
    background: #fff;
    transition: all 0.3s ease;
}

/* ડાબી પેનલ હવે 50% જગ્યા લેશે */
.description-left-panel {
    width: 50%;
    padding: 40px;
    border-right: 1px solid #ebebeb;
}

/* જમણી પેનલ એડિટ ફોર્મ માટે */
.description-right-panel {
    width: 50%;
    padding: 40px;
    background: #fff;
    display: flex;
    flex-direction: column;
}

.description-menu-item.active {
    background: #f7f7f7;
    border: 1px solid #222;
}

.edit-textarea {
    width: 100%;
    height: 250px;
    border: 1px solid #b0b0b0;
    border-radius: 12px;
    padding: 15px;
    font-size: 16px;
    resize: none;
    margin-top: 10px;
}

.edit-view-footer {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    border-top: 1px solid #ebebeb;
}

.save-black-btn {
    background: #222;
    color: #fff;
    padding: 10px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
}
.photo-grid-main {
    flex: 1;
    margin-top:30px;
    height: 100vh;
    padding: 30px 30px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    max-width: 800px;
}


.description-header h2 {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 30px;
    color: #222;
}

/* Menu List Container */
.description-menu-list {
    display: flex;
    flex-direction: column;
}

/* Individual Menu Item */
.description-menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 0;
    border-bottom: 1px solid #ebebeb;
    cursor: pointer;
    transition: background 0.2s ease;
}

.description-menu-item:hover {
    background-color: #f7f7f7;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 8px;
}

/* Text Content within Menu */
.menu-item-content h4 {
    font-size: 16px;
    font-weight: 500;
    color: #222;
    margin-bottom: 4px;
}

.menu-item-content p {
    font-size: 14px;
    color: #717171;
    line-height: 1.4;
    margin: 0;
}

/* Chevron Icon */
.chevron-icon {
    font-size: 24px;
    color: #222;
    font-weight: 300;
}

/* Responsive adjust for description header */
.description-header p {
    color: #717171;
    font-size: 14px;
    display: none; /* description.png મુજબ હેડિંગ મોટું છે, સબટેક્સ્ટ ઓપ્શનલ છે */
}
//Location
/* લોકેશન કાર્ડ માટે સ્પેશિયલ સ્ટાઇલ */
.location-card {
    cursor: pointer;
    display: block !important; /* ફ્લેક્સમાંથી બ્લોક કરો જેથી મેપ આખી જગ્યા લે */
}

.menu-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

/* મેપ કન્ટેનર */
.sidebar-map-wrapper {
    margin-top: 10px;
}

.sidebar-map-preview {
    width: 100%;
    height: 150px; /* આ પ્રોપર્ટી હોવી જરૂરી છે */
    background-color: #e5e3df; /* મેપ લોડ ન થાય ત્યાં સુધી ગ્રે કલર */
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    margin-bottom: 10px;
}

.map-bg-img {
    width: 100%;
    height: 100%;
}

.map-pin-black {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #222222;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* એડ્રેસ ટેક્સ્ટ */
.location-address-text {
    font-size: 14px;
    color: #717171 !important;
    white-space: normal !important; /* એડ્રેસ આખું દેખાવા દો */
    line-height: 1.4;
}
.chevron-arrow {
    color: #222;
    font-size: 18px;
}
`;
const lightbulbStyle = {
    width: '40px',
    height: '40px',
    backgroundColor: '#F7F7F7',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px'
};

const ListingContainer = styled.div`
    .list-header-main { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;
        .header-btns { display: flex; gap: 10px; .circle-btn { width: 40px; height: 40px; border-radius: 50%; border: 1px solid #ddd; background: #fff; cursor: pointer; font-size: 18px; } }
    }
    .listing-table { width: 100%; border-collapse: collapse; 
        th { text-align: left; padding: 15px; border-bottom: 1px solid #eee; color: #717171; font-size: 12px; }
        td { padding: 15px; border-bottom: 1px solid #eee; font-size: 14px; }
        .item-name { display: flex; align-items: center; gap: 15px; font-weight: 500; 
            img { width: 60px; height: 40px; border-radius: 6px; object-fit: cover; }
        }
        .status-dot { color: #00a699; margin-right: 1px; }
        .edit-row-btn { background: white; border: 1px solid #222; padding: 6px 15px; border-radius: 8px; font-weight: 600; cursor: pointer; &:hover { background: #f7f7f7; } }
    }
`;


const DashboardBody = styled.div` display: flex; flex-direction: column; align-items: center; `;

const WelcomeSection = styled.div` width: 100%; margin-bottom: 30px; h1 { font-size: 32px; font-weight: 600; } `;

const InfoCard = styled.div` width: 100%; max-width: 600px; padding: 24px; border: 1px solid #ddd; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; `;

const ListingSection = styled.div`
    .listing-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; h2 { font-size: 24px; font-weight: 600; } }
    .listing-actions { display: flex; gap: 10px; }
    .add-btn { width: 40px; height: 40px; border-radius: 50%; border: 1px solid #ddd; background: white; cursor: pointer; font-size: 20px; }
    .icon-btn { width: 40px; height: 40px; border-radius: 50%; border: 1px solid #ddd; background: white; cursor: pointer; }
`;

const ListingCard = styled.div`
    width: 320px;
    .image-container { position: relative; border-radius: 12px; overflow: hidden; img { width: 100%; height: 200px; object-fit: cover; } }
    .badge { position: absolute; top: 12px; left: 12px; background: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
`;
const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'transform 0.2s ease-in-out',
    cursor: 'pointer',
};

const imageWrapperStyle = {
    position: 'relative',
    width: '100%',
    paddingTop: '95%', // આનાથી ઈમેજ હંમેશા સ્ક્વેર (Square) રહેશે
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#f7f7f7',
};

const imageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
};

const badgeStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#222',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const titleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#222',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '80%',
};

const subtitleStyle = {
    fontSize: '14px',
    color: '#717171',
    margin: '2px 0',
};

const priceStyle = {
    fontSize: '16px',
    fontWeight: '700',
    color: '#222',
};

const ratingStyle = {
    fontSize: '14px',
    color: '#222',
    fontWeight: '400',
};


const DashboardContainer = styled.div` display: flex; flex-direction: column; gap: 40px; `;

const InfoBanner = styled.div`
    display: flex; justify-content: space-between; align-items: center;
    padding: 24px; border: 1px solid #ddd; border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    .banner-content { display: flex; gap: 16px; align-items: center; }
    .icon-wrapper { width: 48px; height: 48px; background: #f7f7f7; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    h3 { font-size: 16px; font-weight: 600; margin: 0; }
    p { font-size: 14px; color: #717171; margin: 4px 0 0; }
    .banner-arrow { font-size: 20px; color: #717171; }
`;

const SubNav = styled.div`
    display: flex; 
    gap: 8px;
    justify-content: center; /* આ લાઈન બટન્સને સેન્ટરમાં લાવશે */
    margin: 20px 0; /* ઉપર અને નીચે થોડી જગ્યા રાખવા માટે */
    
    button {
        padding: 10px 24px; 
        border-radius: 24px; 
        border: 1px solid #ddd;
        background: #fff; 
        cursor: pointer; 
        font-weight: 600; 
        font-size: 14px;
        transition: 0.2s;
        
        /* એક્ટિવ ટેબ બ્લેક દેખાવી જોઈએ */
        &.active { 
            background: #222; 
            color: #fff; 
            border-color: #222; 
        }
        
        &:hover:not(.active) { 
            border-color: #222; 
        }
    }
`;

const ReservationSection = styled.div` width: 100%; `;

const ResList = styled.div`
    .res-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .text-link { background: none; border: none; text-decoration: underline; font-weight: 600; cursor: pointer; }
    .res-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
`;

const ResCard = styled.div`
    padding: 20px; border: 1px solid #ddd; border-radius: 12px;
    .status { font-size: 12px; font-weight: 700; color: #717171; text-transform: uppercase; }
    h4 { font-size: 18px; margin: 12px 0 4px; }
    p { font-size: 14px; color: #222; margin-bottom: 12px; }
    .property-name { font-size: 14px; color: #717171; border-top: 1px solid #eee; padding-top: 12px; }
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;      /* આ હોરિઝોન્ટલી સેન્ટર કરશે */
    justify-content: center;   /* આ વર્ટિકલી સેન્ટર કરશે */
    text-align: center;
    padding: 80px 20px;       /* ઉપર-નીચે થોડી જગ્યા માટે */
    width: 100%;

    img {
        width: 140px;         /* તમારી ડિઝાઈન મુજબ સાઈઝ એડજસ્ટ કરી છે */
        margin-bottom: 24px;
        opacity: 0.9;
    }

    h2 {
        font-size: 26px;      /* pro_deshboard.png મુજબ મોટી હેડિંગ */
        font-weight: 600;
        margin-bottom: 8px;
        color: #222;
    }

    p {
        font-size: 16px;
        color: #717171;       /* ગ્રે કલર ટેક્સ્ટ માટે */
        max-width: 400px;     /* ટેક્સ્ટ લાઈન બહુ લાંબી ન થાય તે માટે */
    }
`;
const containerStyle = {
    width: '100%',
    height: '250px',
    borderRadius: '12px'
};

const addressRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #ebebeb', cursor: 'pointer' };
const adjustBtnStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: 'bold',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    zIndex: 10
};
const formRowStyle = {
    padding: '12px 16px',
    borderBottom: '1px solid #b0b0b0',
    display: 'flex',
    flexDirection: 'column'
};
const inputStyle = {
    border: 'none',
    fontSize: '16px',
    color: '#222',
    outline: 'none',
    padding: '0',
    width: '100%'
};
