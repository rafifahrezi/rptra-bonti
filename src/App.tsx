// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import './lib/i18n';
// import Header from './components/Layout/Header';
// import Footer from './components/Layout/Footer';
// import Home from './pages/Home';
// import About from './pages/About';

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen flex flex-col">
//         <Header />
//         <main className="flex-grow">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/about" element={<About />} />
//             {/* Additional routes will be added */}
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './lib/i18n';

// Layout Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Page Components
import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';
import Events from './pages/Events';
import AdminAbout from "./admins/AdminAbout";


// Protected Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './admins/AdminDashboard';
import UserManagement from './admins/UserManagement';
import EventsManagement from './admins/EventsManagement';
import GalleryManagement from './admins/GalleryManagement';
import NewsManagement from './admins/NewsManagement';
import AnalyticsManagement from './admins/AnalyticsManagement';

// import About from './pages/About';
import News from './pages/News';
import NewsDetailPage from "./pages/NewsDetailPage";
import GalleryDetailPage from "./pages/GalleryDetailPage";
import GalleryPage from './pages/Gallery';
// import Gallery from './pages/Gallery';
// import Contact from './pages/Contact';

// const News: React.FC = () => (
//   <div className="container mx-auto px-4 py-8">
//     <h1 className="text-3xl font-bold mb-6">Berita</h1>
//     <p>Halaman berita akan segera hadir.</p>
//   </div>
// );


const Contact: React.FC = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-6">Kontak</h1>
    <p>Halaman kontak akan segera hadir.</p>
  </div>
);

const Privacy: React.FC = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-6">Kebijakan Privasi</h1>
    <p>Halaman kebijakan privasi akan segera hadir.</p>
  </div>
);

const Terms: React.FC = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-6">Syarat & Ketentuan</h1>
    <p>Halaman syarat & ketentuan akan segera hadir.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/gallery/:id" element={<GalleryDetailPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <UserManagement  />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin/about"
                element={
                  <ProtectedRoute>
                    <AdminAbout  />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin/gallery"
                element={
                  <ProtectedRoute>
                    <GalleryManagement  />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin/events"
                element={
                  <ProtectedRoute>
                    <EventsManagement  />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin/news"
                element={
                  <ProtectedRoute>
                    <NewsManagement  />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute>
                    <AnalyticsManagement  />
                  </ProtectedRoute>
                }
              />

              {/* 404 Not Found Route */}
              <Route
                path="*"
                element={
                  <div className="container mx-auto px-4 py-8 text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-gray-600 mb-4">Halaman tidak ditemukan</p>
                    <a href="/" className="text-green-600 hover:text-green-800 font-medium">
                      Kembali ke Beranda
                    </a>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;