import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Artist from './pages/Artist';
import Songs from './pages/Songs';
import Albums from './pages/Albums';
import './App.css';


function App() {
  return (
    <Router>
      <div>
        <nav style={{
          background: '#333',
          padding: '10px',
          marginBottom: '20px'
        }}>
          <Link to="/" style={linkStyle}>Artist</Link>
          <Link to="/songs" style={linkStyle}>Songs</Link>
          <Link to="/albums" style={linkStyle}>Albums</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Artist />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/albums" element={<Albums />} />
        </Routes>
      </div>
    </Router>
  );
}

const linkStyle = {
  color: '#fff',
  marginRight: '20px',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '18px'
};

export default App;
