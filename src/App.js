// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import LandingPage from './pages/LandingPage';


function App() {
  const articles = []; 

  return (
    <Router>
      <Routes>
          <Route path="/" element={<LandingPage articles={articles} />} />
      </Routes>
    </Router>
  );
}

export default App;
