import React, { useState, useEffect } from 'react';
import { getScheduleImages } from '../services/scheduleService';
import './Schedule.css';

const Schedule = () => {
  const [images, setImages] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const fetchedImages = await getScheduleImages();
        setImages(fetchedImages);
      } catch (error) {
        console.error("Failed to fetch schedule images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="schedule-container">
      <h1>공연 안내</h1>
      <section className="program-section">
        {images.length > 0 ? (
          images.map(image => (
            <img
              key={image.id}
              src={`${API_BASE_URL}${image.image_url}`}
              alt="공연 안내 이미지"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}
            />
          ))
        ) : (
          <p>등록된 공연 안내 이미지가 없습니다.</p>
        )}
      </section>
    </div>
  );
};

export default Schedule;
