"use client";
import React, { useState, useEffect } from 'react';
import Header1 from '../Header.jsx'; 
import styled from '@emotion/styled';
import { useSearchParams, useRouter } from 'next/navigation';

export default function HostingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'today';
    
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); 
    const [isEditing, setIsEditing] = useState(false); 
    const [selectedProperty, setSelectedProperty] = useState(null);

    const handleEditOpen = (item) => {
        setSelectedProperty(item);
        setIsEditing(true);
        window.scrollTo(0, 0); 
    };

    useEffect(() => {
        const fetchData = async () => {
            if (typeof window !== 'undefined') {
                const userPhone = localStorage.getItem('userPhone');
                if (!userPhone) return;
                setLoading(true);
                try {
                    const res = await fetch(`http://127.0.0.1:8000/api/accounts/user-properties/?phone=${userPhone}`);
                    if (res.ok) {
                        const data = await res.json();
                        setListings(data);
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

    return (
        <PageWrapper>
            <Header1 />
            <ContentArea>
                {/* મુખ્ય શરત: જો એડિટિંગ ચાલુ હોય તો માત્ર એડિટર બતાવો */}
                {isEditing ? (
                    <EditorOverlay>
                        <div className="editor-nav">
                            <button onClick={() => setIsEditing(false)} className="close-btn">✕</button>
                            <div className="nav-center">
                                <button className="nav-item active">Your space</button>
                                <button className="nav-item">Arrival guide</button>
                            </div>
                            <button className="settings-btn">⚙</button>
                        </div>

                        <div className="editor-layout">
                            {/* Left Side: Sidebar */}
                            <div className="sidebar">
                                <h1 className="title">Listing editor</h1>
                                
                                <div className="status-alert">
                                    <div className="alert-content">
                                        <span className="dot">●</span>
                                        <div>
                                            <strong>Complete required steps</strong>
                                            <p>Finish these final tasks to publish your listing and start getting booked.</p>
                                        </div>
                                    </div>
                                    <span>❯</span>
                                </div>

                                <div className="menu-card active">
                                    <div className="menu-text">
                                        <h3>Photo tour</h3>
                                        <p>1 bedroom • 1 bed • 1 bath</p>
                                    </div>
                                    <div className="preview-small">
                                        <img src={`http://127.0.0.1:8000${selectedProperty?.img1}`} alt="" />
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Photo Content */}
                            <div className="main-content">
                                <div className="content-header">
                                    <div>
                                        <h2>Photo tour</h2>
                                        <p>Manage photos and add details. Guests will only see your tour if every room has a photo.</p>
                                    </div>
                                    <div className="header-actions">
                                        <button className="action-btn-outline">All photos</button>
                                        <button className="action-btn-plus">+</button>
                                    </div>
                                </div>

                                <div className="photo-grid">
                                    <div className="room-card">
                                        <img src={`http://127.0.0.1:8000${selectedProperty?.img1}`} alt="Living room" />
                                        <div className="room-info">
                                            <h4>Living room</h4>
                                            <p>6 photos</p>
                                        </div>
                                    </div>
                                    <div className="room-card placeholder">
                                        <div className="icon">🛏</div>
                                        <h4>Bedroom</h4>
                                        <p className="add-link">Add photos</p>
                                    </div>
                                    <div className="room-card placeholder">
                                        <div className="icon">🛁</div>
                                        <h4>Full bathroom</h4>
                                        <p className="add-link">Add photos</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </EditorOverlay>
                ) : (
                    /* લિસ્ટિંગ ટેબલ વ્યુ */
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
                )}
            </ContentArea>
        </PageWrapper>
    );
}

// --- CSS STYLES ---
const PageWrapper = styled.div` background: white; min-height: 100vh; font-family: sans-serif; `;
const ContentArea = styled.div` max-width: 1200px; margin: 0 auto; padding: 20px; `;

const EditorOverlay = styled.div`
    .editor-nav {
        display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #eee; margin-bottom: 40px;
        .nav-center { display: flex; background: #f7f7f7; border-radius: 30px; padding: 4px; 
            .nav-item { border: none; padding: 8px 20px; border-radius: 25px; cursor: pointer; background: transparent; font-weight: 500; }
            .nav-item.active { background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        }
        .close-btn, .settings-btn { background: none; border: 1px solid #ddd; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; }
    }

    .editor-layout { display: grid; grid-template-columns: 400px 1fr; gap: 60px; }
    
    .sidebar {
        .title { font-size: 32px; margin-bottom: 30px; }
        .status-alert { border: 1px solid #ddd; border-radius: 12px; padding: 20px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px; cursor: pointer;
            .alert-content { display: flex; gap: 15px; .dot { color: #c13515; } p { font-size: 14px; color: #717171; margin-top: 5px; } }
        }
        .menu-card { border: 1px solid #222; border-radius: 12px; padding: 15px; display: flex; justify-content: space-between; align-items: center;
            h3 { font-size: 16px; } p { font-size: 14px; color: #717171; }
            .preview-small img { width: 60px; height: 60px; border-radius: 8px; object-fit: cover; }
        }
    }

    .main-content {
        .content-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px;
            h2 { font-size: 24px; margin-bottom: 8px; } p { color: #717171; max-width: 450px; line-height: 1.5; }
            .header-actions { display: flex; gap: 10px; 
                .action-btn-outline { background: white; border: 1px solid #222; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
                .action-btn-plus { width: 40px; height: 40px; border-radius: 50%; border: 1px solid #ddd; background: white; cursor: pointer; font-size: 20px; }
            }
        }
        .photo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;
            .room-card { border-radius: 12px; overflow: hidden; img { width: 100%; height: 160px; object-fit: cover; }
                h4 { margin: 10px 0 2px; font-size: 15px; } p { font-size: 13px; color: #717171; }
            }
            .room-card.placeholder { border: 1px solid #ddd; height: 160px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f9f9f9;
                .icon { font-size: 24px; margin-bottom: 10px; } .add-link { text-decoration: underline; cursor: pointer; font-weight: 500; color: #222; }
            }
        }
    }
`;

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
        .status-dot { color: #00a699; margin-right: 5px; }
        .edit-row-btn { background: white; border: 1px solid #222; padding: 6px 15px; border-radius: 8px; font-weight: 600; cursor: pointer; &:hover { background: #f7f7f7; } }
    }
`;