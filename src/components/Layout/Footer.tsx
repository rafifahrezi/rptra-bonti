import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="../images/logo.PNG"
                alt="Logo RPTRA Kebon Melati"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-100"
                onError={(e) => (e.currentTarget.src = "/images/fallback-logo.PNG")} // Fallback gambar
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
              <li><a href="/about" className="text-gray-300 hover:text-green-400 transition-colors">Tentang Kami</a></li>
              <li><a href="/events" className="text-gray-300 hover:text-green-400 transition-colors">Kegiatan</a></li>
              <li><a href="/news" className="text-gray-300 hover:text-green-400 transition-colors">Berita</a></li>
              <li><a href="/gallery" className="text-gray-300 hover:text-green-400 transition-colors">Galeri</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-green-400 transition-colors">Kontak</a></li>
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

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 RPTRA Kebon Melati. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Kebijakan Privasi</a>
            <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;