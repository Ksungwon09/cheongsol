import React, { useState, useEffect } from 'react';
import {
  getAnnouncements, addAnnouncement, deleteAnnouncement,
  getBooths, addBooth, deleteBooth,
} from '../services/dbService';
import {
  getSuggestions, updateSuggestionStatus
} from '../services/suggestionService';
import './Admin.css';

const Admin = () => {
  // State
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', isPopup: false });
  const [booths, setBooths] = useState([]);
  const [newBooth, setNewBooth] = useState({ name: '', category: '', description: '' });
  const [suggestions, setSuggestions] = useState([]);

  // Fetch all data
  const fetchAdminData = async () => {
    try {
      setAnnouncements(await getAnnouncements());
      setBooths(await getBooths());
      setSuggestions(await getSuggestions());
    } catch (error) {
      console.error("Failed to fetch admin data", error);
      // Maybe set an error state here to show in the UI
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // --- Handlers for Announcements ---
  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    await addAnnouncement(newAnnouncement);
    setNewAnnouncement({ title: '', content: '', isPopup: false });
    fetchAdminData();
  };

  const handleDeleteAnnouncement = async (id) => {
    await deleteAnnouncement(id);
    fetchAdminData();
  };

  // --- Handlers for Booths ---
  const handleAddBooth = async (e) => {
    e.preventDefault();
    if (!newBooth.name) return;
    await addBooth(newBooth);
    setNewBooth({ name: '', category: '', description: '' });
    fetchAdminData();
  };

  const handleDeleteBooth = async (id) => {
    await deleteBooth(id);
    fetchAdminData();
  };

  // --- Handlers for Suggestions ---
  const handleUpdateSuggestionStatus = async (id, status) => {
    await updateSuggestionStatus(id, status);
    fetchAdminData();
  };

  return (
    <div className="admin-container">
      <h1>관리자 페이지</h1>

      {/* Announcements Management */}
      <div className="admin-section">
        <h2>공지사항 관리</h2>
        <form onSubmit={handleAddAnnouncement} className="admin-form">
          <input type="text" placeholder="제목" value={newAnnouncement.title} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} />
          <textarea placeholder="내용" value={newAnnouncement.content} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })} />
          <label><input type="checkbox" checked={newAnnouncement.isPopup} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, isPopup: e.target.checked })} />팝업</label>
          <button type="submit" className="add-btn">추가</button>
        </form>
        <div className="admin-item-list">
          {announcements.map(ann => (
            <div key={ann.id} className="admin-item">
              <span>{ann.title}</span>
              <button onClick={() => handleDeleteAnnouncement(ann.id)} className="delete-btn">삭제</button>
            </div>
          ))}
        </div>
      </div>

      {/* Booths Management */}
      <div className="admin-section">
        <h2>부스 관리</h2>
        <form onSubmit={handleAddBooth} className="admin-form">
          <input type="text" placeholder="부스명" value={newBooth.name} onChange={(e) => setNewBooth({ ...newBooth, name: e.target.value })} />
          <input type="text" placeholder="카테고리" value={newBooth.category} onChange={(e) => setNewBooth({ ...newBooth, category: e.target.value })} />
          <textarea placeholder="설명" value={newBooth.description} onChange={(e) => setNewBooth({ ...newBooth, description: e.target.value })} />
          <button type="submit" className="add-btn">추가</button>
        </form>
        <div className="admin-item-list">
          {booths.map(booth => (
            <div key={booth.id} className="admin-item">
              <span>{booth.name}</span>
              <button onClick={() => handleDeleteBooth(booth.id)} className="delete-btn">삭제</button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Suggestions View */}
      <div className="admin-section">
        <h2>건의사항 확인</h2>
        <div className="admin-item-list">
          {suggestions.map(suggestion => (
            <div key={suggestion.id} className="admin-item">
              <div className="admin-item-content">
                <p><strong>{suggestion.title}</strong> (from: {suggestion.author})</p>
                <p>{suggestion.content}</p>
                <p><strong>상태:</strong> {suggestion.status}</p>
              </div>
              <div className="suggestion-actions">
                <button onClick={() => handleUpdateSuggestionStatus(suggestion.id, 'received')} className="status-btn">접수</button>
                <button onClick={() => handleUpdateSuggestionStatus(suggestion.id, 'in_progress')} className="status-btn">처리중</button>
                <button onClick={() => handleUpdateSuggestionStatus(suggestion.id, 'completed')} className="status-btn">완료</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
