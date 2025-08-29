import { FC, memo, useState, useEffect, useCallback } from 'react';
import { Calendar, Search, Filter, FileText, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

// Type Definitions
interface News {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  createdAt: any;
  image: string;
  published: boolean;
  category: string;
}

// Snackbar Component
const Snackbar = memo(({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 animate-slide-up">
      <span>{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200" aria-label="Close snackbar">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
});

// Loading Component
const LoadingState = memo(() => (
  <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-[50vh]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Memuat berita...</p>
    </div>
  </div>
));

// Empty State Component
const EmptyState = memo(() => (
  <div className="text-center text-gray-500 py-12">
    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
    <p className="text-lg">Belum ada berita yang tersedia.</p>
    <p className="text-sm mt-2">Cek kembali nanti untuk pembaruan terbaru!</p>
  </div>
));

// News Card Component
const NewsCard = memo(({ news }: { news: News }) => {
  const formatDate = useCallback((timestamp: any): string => {
    if (!timestamp) return 'Tidak diketahui';
    let date: Date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else {
      return 'Tidak valid';
    }
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={news.image || 'https://via.placeholder.com/400x200'}
        alt={news.title}
        className="h-48 w-full object-cover"
      />
      <div className="p-4">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar className="w-4 h-4 mr-1" />
          {formatDate(news.createdAt)}
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{news.title}</h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{news.subtitle}</p>
        <Link to={`/news/${news.id}`}>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg">
            Baca Selengkapnya
          </button>
        </Link>
      </div>
    </div>
  );
});

// Filter Section Component
const FilterSection = memo(
  ({
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    categories,
  }: {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    filterCategory: string;
    setFilterCategory: (value: string) => void;
    categories: string[];
  }) => (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berita..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Semua Kategori</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
);

// Header Component
const Header = memo(() => (
  <div className="mb-6">
    <h1 className="text-3xl font-bold text-gray-800">Berita Terbaru</h1>
  </div>
));

// Main NewsPage Component
const NewsPage: FC = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = [
    'Berita Umum',
    'Program Anak',
    'Kegiatan Komunitas',
    'Kesehatan',
    'Pendidikan',
    'Event',
    'Pengumuman',
  ];

  // Fetch news from Firestore
  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const newsCollection = collection(db, 'news');
      const q = query(newsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const newsData = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as News))
        .filter(news => news.published);
      setNewsList(newsData);
      setFilteredNews(newsData);
      setSnackbarMessage('Berita berhasil dimuat!');
    } catch (error) {
      console.error('Error fetching news:', error);
      setSnackbarMessage('Gagal memuat berita.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter news based on search and category
  const filterNews = useCallback(() => {
    const filtered = newsList.filter(news => {
      const matchesSearch =
        news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || news.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredNews(filtered);
  }, [newsList, searchTerm, filterCategory]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    filterNews();
  }, [searchTerm, filterCategory, newsList, filterNews]);

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Header />
      <FilterSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        categories={categories}
      />
      {filteredNews.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
      {snackbarMessage && <Snackbar message={snackbarMessage} onClose={() => setSnackbarMessage(null)} />}
    </div>
  );
};

export default NewsPage;