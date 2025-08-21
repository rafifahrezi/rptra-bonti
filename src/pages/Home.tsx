import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Heart, Book, Activity, ChevronRight, ChevronLeft } from 'lucide-react';
import Button from '../components/common/Button';
import { Event, NewsPost } from '../types';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [latestNews, setLatestNews] = useState<NewsPost[]>([]);

  // Mock data - will be replaced with actual API calls
  const heroSlides = [
    {
      image: 'https://images.pexels.com/photos/1094072/pexels-photo-1094072.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800',
      title: t('home.hero.title'),
      subtitle: t('home.hero.subtitle')
    },
    {
      image: 'https://images.pexels.com/photos/1350560/pexels-photo-1350560.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800',
      title: 'Bermain & Belajar Bersama',
      subtitle: 'Fasilitas playground modern dan ruang edukasi yang aman'
    },
    {
      image: 'https://images.pexels.com/photos/1094081/pexels-photo-1094081.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800',
      title: 'Komunitas yang Peduli',
      subtitle: 'Bergabung dengan kegiatan komunitas yang memberdayakan keluarga'
    }
  ];

  const features = [
    {
      icon: Users,
      title: 'Kegiatan Komunitas',
      description: 'Program reguler seperti senam merdeka, jumat curhat, dan kegiatan sosial lainnya'
    },
    {
      icon: Heart,
      title: 'Literasi Kesehatan',
      description: 'Edukasi kesehatan dan program makanan bersubsidi untuk keluarga'
    },
    {
      icon: Book,
      title: 'Pendidikan Anak',
      description: 'Ruang belajar dan program edukasi yang mendukung perkembangan anak'
    },
    {
      icon: Activity,
      title: 'Fasilitas Rekreasi',
      description: 'Playground, taman, dan area bermain yang aman dan menyenangkan'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mb-8 opacity-90">
                  {slide.subtitle}
                </p>
                <Button size="lg" className="animate-bounce-in">
                  {t('home.hero.cta')}
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('home.about.title')}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {t('home.about.text')}
            </p>
            <Link to="/about">
              <Button variant="outline" size="lg">
                {t('common.readmore')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Events Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{t('home.events.title')}</h2>
            <Link to="/events">
              <Button variant="outline">
                {t('common.viewall')}
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500"></div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>15 Februari 2025</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Senam Merdeka Minggu Pagi
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Kegiatan senam bersama untuk memperingati kemerdekaan Indonesia.
                  </p>
                  <Button size="sm" variant="outline">
                    {t('common.readmore')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              {t('home.location.title')}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-start space-x-3 mb-4">
                    <MapPin className="w-6 h-6 text-green-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Alamat Lengkap</h3>
                      <p className="text-gray-600">
                        Jl. H. Awaludin IV, RT.3/RW.17<br />
                        Kebon Melati, Tanah Abang<br />
                        Jakarta Pusat 10230
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Buka setiap hari: 06:00 - 22:00 WIB</p>
                    <p>Akses transportasi umum tersedia</p>
                  </div>
                </div>
              </div>
              <div className="h-64 bg-gray-300 rounded-lg overflow-hidden">
                {/* Google Maps embed would go here */}
                <div className="w-full h-full bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center">
                  <p className="text-gray-600">Peta Lokasi RPTRA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bergabunglah dengan Komunitas Kami
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Mari bersama-sama menciptakan lingkungan yang lebih baik untuk anak-anak Indonesia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Lihat Kegiatan
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;