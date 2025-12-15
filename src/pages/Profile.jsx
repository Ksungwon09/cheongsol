import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { deleteUser } from '../services/authService';
import './Profile.css';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        await deleteUser();
        logout();
        alert('계정이 성공적으로 삭제되었습니다.');
        navigate('/');
      } catch (error) {
        alert(`계정 삭제에 실패했습니다: ${error.message}`);
      }
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <h1>프로필</h1>
        <p>로그인 후 이용 가능합니다.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>프로필</h1>
      <div className="profile-info">
        <p><strong>이름:</strong> {user.username}</p>
        <p><strong>이메일:</strong> {user.email}</p>
      </div>
      <button onClick={handleDeleteAccount} className="delete-account-btn">
        계정 탈퇴
      </button>
    </div>
  );
}

export default Profile;
