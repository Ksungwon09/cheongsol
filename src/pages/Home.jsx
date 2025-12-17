import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  // The popup functionality has been temporarily removed 
  // and will be re-implemented with the new backend.

  return (
    <div className="home-container">
      {/* Example of a placeholder for where the popup might go */}
      {/* {isPopupVisible && <Popup announcement={popupAnnouncement} onClose={handleClosePopup} />} */}

      <div className="poster-container">
        <img
          src="/home_poster.jpg"
          alt="축제 포스터"
        />
        <div className="poster-text">
          <div className="title-container">
            <h1 className="main-title">청솔제</h1>
            <h2 className="subtitle">2025</h2>
          </div>
          <h3 className="date">12.18—18</h3>
          <p className="school">상문고등학교 본교</p>
        </div>
      </div>
    </div>
  );
};

export default Home;