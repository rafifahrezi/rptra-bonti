// src/components/Layout/Footer.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, isAdmin, signOut } = useAuth();

  const handleAdminAction = async () => {
    if (currentUser && isAdmin) {
      await signOut();
      return { success: true };
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/images/logo.PNG"
                alt="Logo RPTRA Kebon Melati"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-100"
                onError={(e) => (e.currentTarget.src = "/images/fallback-logo.PNG")}
              />
              <div>
                <h3 className="text-lg font-bold">RPTRA Kebon Melati</h3>
                <p className="text-sm text-gray-400">Ruang Publik Terpadu Ramah Anak</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              RPTRA Kebon Melati adalah ruang publik terintegrasi yang dirancang khusus untuk menciptakan
              lingkungan aman dan ramah anak di Jakarta Pusat.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/rptrabonti" target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-green-400 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-green-400 transition-colors">
                  Kegiatan
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-300 hover:text-green-400 transition-colors">
                  Berita
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-green-400 transition-colors">
                  Galeri
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-green-400 transition-colors">
                  Kontak
                </Link>
              </li>
              {/* <li>
                {currentUser && isAdmin ? (
                  <div className="space-y-1">
                    <Link to="/admin" className="text-green-400 hover:text-green-300 transition-colors block">
                      Dashboard Admin
                    </Link>
                    <button
                      onClick={handleAdminAction}
                      className="text-red-400 hover:text-red-300 transition-colors text-left"
                    >
                      Logout Admin
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="text-gray-300 hover:text-green-400 transition-colors">
                    Login as Admin
                  </Link>
                )}
              </li> */}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">Jl. H. Awaludin IV, RT.3/RW.17</p>
                  <p className="text-gray-300">Kb. Melati, Tanah Abang</p>
                  <p className="text-gray-300">Jakarta Pusat 10230</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">(021) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">info@rptrabonti.id</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 RPTRA Kebon Melati. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
              Kebijakan Privasi
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>

        {/* Admin Status Indicator */}
        {/* {currentUser && isAdmin && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-800 text-green-200">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Logged in as admin: {currentUser.email}
            </div>
          </div>
        )} */}
      </div>
    </footer>
  );
};

export default Footer;