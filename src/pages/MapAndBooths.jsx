import React, { useEffect, useState } from 'react';
import { getBooths } from '../services/dbService';
import './MapAndBooths.css';

const MapAndBooths = () => {
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooths = async () => {
      try {
        const boothsList = await getBooths();
        setBooths(boothsList);
      } catch (err) {
        console.error("Error fetching booths:", err);
        setError("부스 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooths();
  }, []);

  return (
    <div className="map-booths-container">
      <h1>학교 지도 및 부스 안내</h1>
      <section className="map-section">
        <iframe
          src="/2025학년도 교실배치도.pdf#view=FitH"
          title="학교 지도"
          className="map-pdf"
        ></iframe>
      </section>

      <section className="booth-list-section">
        <h2>부스 목록</h2>
        {loading && <p>로딩 중...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {booths.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {booths.map((booth) => (
              <li key={booth.id} className="booth-item">
                <h3>{booth.name}</h3>
                <p><strong>카테고리:</strong> {booth.category}</p>
                <p><strong>정보:</strong> {booth.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>등록된 부스가 없습니다.</p>
        )}
      </section>
    </div>
  );
};

export default MapAndBooths;
