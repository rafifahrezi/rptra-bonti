import React, { memo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Heart, Book, Activity, ChevronRight, ChevronLeft, Clock } from 'lucide-react';
import Button from '../components/common/Button';
import { doc, onSnapshot, Timestamp, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

// Type Definitions
interface RptraStatus {
  status: boolean;
  updatedAt: Timestamp | null;
  updatedBy: string;
}

interface Visit {
  id: string;
  date: Timestamp;
  balita: number;
  anak: number;
  remaja: number;
  dewasa: number;
  lansia: number;
}

// Hero Slide Type
interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
}

// StatsCard Component
const StatsCard = memo(({ title, value, color = 'green' }: { title: string; value: number; color?: string }) => {
  const colorClasses = {
    green: 'text-green-600',
    purple: 'text-purple-600',
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center border border-gray-100 hover:shadow-lg transition-all duration-200">
      <h3 className="text-lg font-semibold mb-2 text-gray-700 uppercase tracking-wide">{title}</h3>
      <p className={`text-4xl font-bold ${colorClasses[color as keyof typeof colorClasses] || 'text-green-600'}`}>{value}</p>
      <div className="mt-2 text-sm text-gray-500">kunjungan</div>
    </div>
  );
});

// Hero Section Component
const HeroSection = memo(({ heroSlides, t }: { heroSlides: HeroSlide[]; t: any }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev: number) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = useCallback((prev: number) => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  const prevSlide = useCallback((prev: number) => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, [heroSlides.length]);

  return (
    <section className="relative h-[600px] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">{slide.title}</h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">{slide.subtitle}</p>
              <Button size="lg" className="animate-bounce-in">
                {t('home.hero.cta')}
              </Button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() => prevSlide(currentSlide)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => nextSlide(currentSlide)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'}`}
          />
        ))}
      </div>
    </section>
  );
});

// RPTRA Status Section Component
const RptraStatusSection = memo(({ rptraStatus, formatDateOnly }: { rptraStatus: RptraStatus | null; formatDateOnly: (timestamp: Timestamp | null) => string }) => (
  <section className="py-8 bg-gray-50">
    <div className="container mx-auto px-4 text-center">
      {rptraStatus === null ? (
        <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full">Loading status...</span>
      ) : (
        <div className="inline-block px-4 py-2 rounded-full font-semibold bg-white shadow-md">
          <span className={`px-3 py-1 rounded-full ${rptraStatus.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {rptraStatus.status ? 'Sedang Buka' : 'Sedang Tutup'}
          </span>
          <div className="text-sm text-gray-600 mt-1 flex flex-col sm:flex-row gap-2 justify-center items-center">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {formatDateOnly(rptraStatus.updatedAt)}</span>
            <span>oleh {rptraStatus.updatedBy}</span>
          </div>
        </div>
      )}
    </div>
  </section>
));

// About Section Component
const AboutSection = memo(({ t }: { t: any }) => (
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
));

// Features Section Component
const FeaturesSection = memo(({ features }: { features: { icon: any; title: string; description: string }[] }) => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
));

// Events Section Component
const EventsSection = memo(({ t }: { t: any }) => (
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
));

// Visits Section Component
const VisitsSection = memo(({ visits, page, setPage, perPage, totalPages, weeklyVisits, monthlyVisits, yearlyVisits, formatDateOnly }: {
  visits: Visit[];
  page: number;
  setPage: (page: number) => void;
  perPage: number;
  totalPages: number;
  dailyVisits: number;
  weeklyVisits: number;
  monthlyVisits: number;
  yearlyVisits: number;
  formatDateOnly: (timestamp: Timestamp | null) => string;
}) => {
  const paginatedVisits = visits.slice((page - 1) * perPage, page * perPage);

  const calculateTotal = (visit: Visit) => visit.balita + visit.anak + visit.remaja + visit.dewasa + visit.lansia;

  return (
    
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Statistik Kunjungan RPTRA Bonti
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ringkasan data pengunjung berdasarkan kategori usia dan periode waktu
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex justify-center items-center mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            <StatsCard
              title="Mingguan"
              value={weeklyVisits}
              color="purple"
            />
            <StatsCard
              title="Bulanan"
              value={monthlyVisits}
              color="blue"
            />
            <StatsCard
              title="Tahunan"
              value={yearlyVisits}
              color="yellow"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-5 border-b-2 border-gray-100 font-semibold text-gray-700">Tanggal</th>
                  <th className="px-6 py-5 border-b-2 border-gray-100 font-semibold text-gray-700">Balita</th>
                  <th className="px-6 py-5 border-b-2 border-gray-100 font-semibold text-gray-700">Anak</th>
                  <th className="px-6 py-5 border-b-2 border-gray-100 font-semibold text-gray-700">Remaja</th>
                  <th className="px-6 py-5 border-b-2 border-gray-100 font-semibold text-gray-700">Dewasa</th>
                  <th className="px-6 py-5 border-b-2 border-gray-100 font-semibold text-gray-700">Lansia</th>
                  <th className="px-6 py-5 border-b-2 border-gray-100 font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVisits.map((visit) => (
                  <tr
                    key={visit.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 border-b border-gray-100 text-gray-600">{formatDateOnly(visit.date)}</td>
                    <td className="px-6 py-4 border-b border-gray-100 text-gray-600">{visit.balita}</td>
                    <td className="px-6 py-4 border-b border-gray-100 text-gray-600">{visit.anak}</td>
                    <td className="px-6 py-4 border-b border-gray-100 text-gray-600">{visit.remaja}</td>
                    <td className="px-6 py-4 border-b border-gray-100 text-gray-600">{visit.dewasa}</td>
                    <td className="px-6 py-4 border-b border-gray-100 text-gray-600">{visit.lansia}</td>
                    <td className="px-6 py-4 border-b border-gray-100 font-medium text-green-600">
                      {calculateTotal(visit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700 font-medium">
                Halaman <span className="font-bold">{page}</span> dari <span className="font-bold">{totalPages}</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-gray-700 shadow-sm"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium shadow-sm"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// Location Section Component
const LocationSection = memo(({ t }: { t: any }) => (
  <section className="py-16 bg-white">
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
));

// CTA Section Component
const CtaSection = memo(({ t }: { t: any }) => (
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
));

// Main Home Component
const Home: React.FC = () => {
  const { t } = useTranslation();
  const [rptraStatus, setRptraStatus] = useState<RptraStatus | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 5;

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

  // Real-time RPTRA status
  useEffect(() => {
    const statusDocRef = doc(db, 'operasional', 'current');
    const unsubscribe = onSnapshot(statusDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setRptraStatus(docSnap.data() as RptraStatus);
      } else {
        setRptraStatus({ status: false, updatedAt: null, updatedBy: 'system' });
      }
    }, (error) => console.error('Gagal ambil status operasional:', error));

    return () => unsubscribe();
  }, []);

  // Fetch visits from Firestore
  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const q = query(collection(db, 'visits'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const visitsData: Visit[] = querySnapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            date: data.date as Timestamp,
            balita: data.balita || 0,
            anak: data.anak || 0,
            remaja: data.remaja || 0,
            dewasa: data.dewasa || 0,
            lansia: data.lansia || 0,
          };
        });
        setVisits(visitsData);
      } catch (error) {
        console.error('Error fetching visits:', error);
      }
    };
    fetchVisits();
  }, []);

  const formatDateOnly = (timestamp: Timestamp | null) => {
    if (!timestamp) return '-';
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
    }).format(timestamp.toDate());
  };

  // Statistik
  const now = new Date('2025-08-31T23:37:00'); // Updated to 11:37 PM WIB
  const todayStr = now.toISOString().slice(0, 10);
  const currentMonth = todayStr.slice(0, 7);
  const currentYear = todayStr.slice(0, 4);

  const getWeekRange = (date: Date) => {
    const day = date.getDay(); // 0 = Sunday
    const diffToSunday = date.getDate() - day;
    const start = new Date(date);
    start.setDate(diffToSunday);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
  };
  const { start: weekStart, end: weekEnd } = getWeekRange(now);

  const calculateTotal = (visit: Visit) => visit.balita + visit.anak + visit.remaja + visit.dewasa + visit.lansia;

  const dailyVisits = visits
    .filter(v => v.date.toDate().toISOString().slice(0, 10) === todayStr)
    .reduce((sum, v) => sum + calculateTotal(v), 0);

  const weeklyVisits = visits
    .filter(v => {
      const visitDate = v.date.toDate().toISOString().slice(0, 10);
      return visitDate >= weekStart && visitDate <= weekEnd;
    })
    .reduce((sum, v) => sum + calculateTotal(v), 0);

  const monthlyVisits = visits
    .filter(v => v.date.toDate().toISOString().slice(0, 7) === currentMonth)
    .reduce((sum, v) => sum + calculateTotal(v), 0);

  const yearlyVisits = visits
    .filter(v => v.date.toDate().toISOString().slice(0, 4) === currentYear)
    .reduce((sum, v) => sum + calculateTotal(v), 0);

  const totalPages = Math.ceil(visits.length / perPage);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection heroSlides={heroSlides} t={t} />

      {/* RPTRA Status */}
      <RptraStatusSection rptraStatus={rptraStatus} formatDateOnly={formatDateOnly} />

      {/* About Section */}
      <AboutSection t={t} />

      {/* Features Section */}
      <FeaturesSection features={features} />

      {/* Recent Events Section */}
      <EventsSection t={t} />

      {/* Visits Statistics Section */}
      <VisitsSection
        visits={visits}
        page={page}
        setPage={setPage}
        perPage={perPage}
        totalPages={totalPages}
        dailyVisits={dailyVisits}
        weeklyVisits={weeklyVisits}
        monthlyVisits={monthlyVisits}
        yearlyVisits={yearlyVisits}
        formatDateOnly={formatDateOnly}
      />

      {/* Location Section */}
      <LocationSection t={t} />

      {/* CTA Section */}
      <CtaSection t={t} />
    </div>
  );
};

export default Home;