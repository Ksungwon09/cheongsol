import React, { useState, useEffect } from 'react';
import { addSuggestion, getSuggestionsByCurrentUser } from '../services/suggestionService';
import { getToken } from '../services/authService'; // Import getToken
import { useAuth } from '../hooks/useAuth';
import './Suggestions.css';

const Suggestions = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [mySuggestions, setMySuggestions] = useState([]);
  const [loadingMySuggestions, setLoadingMySuggestions] = useState(true);
  const [errorMySuggestions, setErrorMySuggestions] = useState('');
  const { user } = useAuth(); // token is removed from here

  // Fetch user's suggestions
  useEffect(() => {
    const fetchMySuggestions = async () => {
      const token = getToken(); // Get token directly
      if (!user || !token) {
        setMySuggestions([]);
        setLoadingMySuggestions(false);
        return;
      }
      setLoadingMySuggestions(true);
      setErrorMySuggestions('');
      try {
        const data = await getSuggestionsByCurrentUser();
        setMySuggestions(data);
      } catch (error) {
        console.error('Error fetching user suggestions:', error);
        setErrorMySuggestions('내가 건의한 내용을 불러오는데 실패했습니다.');
      } finally {
        setLoadingMySuggestions(false);
      }
    };

    fetchMySuggestions();
  }, [user]); // Re-fetch when user changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setMessage('제목과 내용을 모두 입력해주세요.');
      return;
    }

    if (!user) {
      setMessage('건의사항을 제출하려면 로그인이 필요합니다.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      await addSuggestion({ title, content });
      setTitle('');
      setContent('');
      setMessage('소중한 의견 감사합니다. 건의사항이 성공적으로 제출되었습니다.');
      // After successful submission, re-fetch suggestions to update the list
      const updatedSuggestions = await getSuggestionsByCurrentUser();
      setMySuggestions(updatedSuggestions);
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      setMessage('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'received':
        return '#f0ad4e'; // Orange
      case 'in_progress':
        return '#5bc0de'; // Blue
      case 'completed':
        return '#5cb85c'; // Green
      default:
        return '#777';
    }
  };

  return (
    <div className="suggestions-container">
      <h1>건의사항</h1>
      <p>축제에 대한 여러분의 소중한 의견을 남겨주세요.</p>
      {user ? (
        <>
          <form onSubmit={handleSubmit} className="suggestion-form">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요..."
              required
              className="suggestion-title-input"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="여기에 건의사항 내용을 입력하세요..."
              rows="10"
              required
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '제출 중...' : '제출'}
            </button>
          </form>
          {message && <p className="submission-message">{message}</p>}

          <h2>내가 건의한 내용</h2>
          {loadingMySuggestions ? (
            <p>내가 건의한 내용을 불러오는 중...</p>
          ) : errorMySuggestions ? (
            <p className="error-message">{errorMySuggestions}</p>
          ) : mySuggestions.length === 0 ? (
            <p>아직 건의한 내용이 없습니다.</p>
          ) : (
            <div className="my-suggestions-list">
              {mySuggestions.map((suggestion) => (
                <div key={suggestion.id} className="suggestion-item">
                  <h3>{suggestion.title}</h3>
                  <p className="suggestion-content">{suggestion.content}</p>
                  <div className="suggestion-meta">
                    <span className="suggestion-date">제출일: {formatDate(suggestion.createdAt)}</span>
                    <span 
                      className="suggestion-status" 
                      style={{ backgroundColor: getStatusColor(suggestion.status) }}
                    >
                      상태: {
                        suggestion.status === 'received' ? '접수됨' :
                        suggestion.status === 'in_progress' ? '진행 중' :
                        suggestion.status === 'completed' ? '완료됨' :
                        suggestion.status
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="login-prompt">
          <p>건의사항을 제출하려면 로그인이 필요합니다.</p>
          {/* Optional: Add a Link to the login page */}
          {/* <Link to="/login">로그인하기</Link> */}
        </div>
      )}
    </div>
  );
};

export default Suggestions;


