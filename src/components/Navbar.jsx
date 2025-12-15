import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth(); // Get user and logout from hook
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // This now comes from the useAuth hook
    navigate('/login');
    setIsOpen(false);
  };

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          청솔제
          <span style={{ fontSize: '0.6em', display: 'block', lineHeight: '1' }}>빛나는 우리 뭇별처럼</span>
        </Link>
        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          {/* Using text for icons for simplicity, you can replace with <i> or <svg> */}
          {isOpen ? '✕' : '☰'}
        </div>
        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMobileMenu}>홈</Link>
          </li>
          <li className="nav-item">
            <Link to="/map" className="nav-links" onClick={closeMobileMenu}>지도/부스</Link>
          </li>
          <li className="nav-item">
            <Link to="/schedule" className="nav-links" onClick={closeMobileMenu}>공연 안내</Link>
          </li>
          <li className="nav-item">
            <Link to="/announcements" className="nav-links" onClick={closeMobileMenu}>공지사항</Link>
          </li>
          <li className="nav-item">
            <Link to="/suggestions" className="nav-links" onClick={closeMobileMenu}>건의</Link>
          </li>
          {user ? (
            <>
              {user.isAdmin && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-links" onClick={closeMobileMenu}>관리</Link>
                </li>
              )}
              <li className="nav-item">
                <Link to="/profile" className="nav-links" onClick={closeMobileMenu}>마이페이지</Link>
              </li>
              <li className="nav-item nav-logout-btn-mobile">
                <button onClick={handleLogout} className="nav-links">로그아웃</button>
              </li>
            </>
          ) : (
            <li className="nav-item nav-login-btn-mobile">
              <Link to="/login" className="nav-links" onClick={closeMobileMenu}>로그인</Link>
            </li>
          )}
        </ul>
        {user ? (
          <button onClick={handleLogout} className="nav-logout-btn-desktop">
            로그아웃
          </button>
        ) : (
          <Link to="/login" className="nav-login-btn-desktop">
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
