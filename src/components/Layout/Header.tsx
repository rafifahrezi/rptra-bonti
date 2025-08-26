import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, MapPin, Phone, Mail } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const navigation = [
    { name: t('Beranda'), href: '/' },
    { name: t('Tentang Kami'), href: '/about' },
    { name: t('Kegiatan'), href: '/events' },
    { name: t('Berita'), href: '/news' },
    { name: t('Galeri'), href: '/gallery' },
    { name: t('Kontak Kami'), href: '/contact' },
  ];

  return (
    <>
      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50 transition-shadow duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo dan Branding */}
          <Link
            to="/"
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity duration-200"
            aria-label="Beranda RPTRA Kebon Melati"
          >
            <img
              src="../images/logo.PNG"
              alt="Logo RPTRA Kebon Melati"
              className="w-20 h-20 sm:w-20 sm:h-20 rounded-full"
            />
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                RPTRA BONTI
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Ruang Publik Terpadu Ramah Anak
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? "text-green-600 font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-green-600"
                    : ""
                }`}
                aria-current={location.pathname === item.href ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-in">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-4 py-2.5 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? "text-green-600 font-semibold bg-green-50"
                    : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
                aria-current={location.pathname === item.href ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
    </>
  );
};

export default Header;