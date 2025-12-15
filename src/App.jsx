import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import MapAndBooths from './pages/MapAndBooths.jsx';
import Schedule from './pages/Schedule.jsx';
import Announcements from './pages/Announcements.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Suggestions from './pages/Suggestions.jsx';
import Admin from './pages/Admin.jsx';
import Profile from './pages/Profile.jsx';
import AdminProtectedRoute from './components/AdminProtectedRoute.jsx';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapAndBooths />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route 
            path="/admin" 
            element={
              <AdminProtectedRoute>
                <Admin />
              </AdminProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
