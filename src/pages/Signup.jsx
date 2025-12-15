import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup as signupService } from '../services/authService';
import './Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signupService(username, email, password);
      navigate('/login'); // Redirect to login page after successful signup
    } catch (err) {
      setError(err.message || 'Signup failed. The username or email might already be in use.');
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSignup}>
        <div className="signup-form-group">
          <label htmlFor="username">아이디</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="signup-error">{error}</p>}
        <button type="submit" className="signup-btn">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;
