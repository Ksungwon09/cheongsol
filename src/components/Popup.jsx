import React from 'react';
import './Popup.css';

const Popup = ({ announcement, onClose }) => {
  if (!announcement) {
    return null;
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>&times;</button>
        <h2>{announcement.title}</h2>
        <p style={{ whiteSpace: 'pre-wrap' }}>{announcement.content}</p>
      </div>
    </div>
  );
};

export default Popup;
