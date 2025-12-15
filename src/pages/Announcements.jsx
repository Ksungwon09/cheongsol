import React, { useEffect, useState } from 'react';
import { getAnnouncements } from '../services/dbService';
import './Announcements.css';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const announcementsList = await getAnnouncements();
        setAnnouncements(announcementsList);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError("공지사항을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="announcements-container">
      <h1>공지사항</h1>
      {loading && <p>로딩 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {announcements.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {announcements.map((announcement) => (
            <li key={announcement.id} className="announcement-item">
              <h3>{announcement.title}</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{announcement.content}</p>
              {announcement.date && <p className="announcement-date">{new Date(announcement.date).toLocaleString()}</p>}
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>등록된 공지사항이 없습니다.</p>
      )}
    </div>
  );
};

export default Announcements;
