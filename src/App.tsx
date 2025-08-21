import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './lib/i18n';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            {/* Additional routes will be added */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;