import { FC, memo, useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Share2, X } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
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
  author: string;
  tags: string[];
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
  <div className="max-w-3xl mx-auto p-6 flex items-center justify-center min-h-[50vh]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Memuat detail berita...</p>
    </div>
  </div>
));

// Not Found Component
const NotFoundState = memo(() => (
  <div className="max-w-3xl mx-auto p-6 text-center">
    <p className="text-red-600 font-semibold text-lg">Berita tidak ditemukan atau belum dipublikasikan</p>
    <Link to="/news" className="flex items-center justify-center text-green-600 mt-4 hover:text-green-700 transition-colors">
      <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Berita
    </Link>
  </div>
));

// News Detail Component
const NewsDetail = memo(({ news }: { news: News }) => {
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

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.subtitle,
        url: window.location.href,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.write(window.location.href);
      alert('Link berita telah disalin ke clipboard!');
    }
  }, [news.title, news.subtitle]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <Link to="/news" className="flex items-center text-green-600 hover:text-green-700 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
        </Link>
        <button
          onClick={handleShare}
          className="flex items-center text-green-600 hover:text-green-700 transition-colors"
          aria-label="Bagikan berita"
        >
          <Share2 className="w-4 h-4 mr-1" /> Bagikan
        </button>
      </div>
      <img
        src={news.image || 'https://via.placeholder.com/400x200'}
        alt={news.title}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <Calendar className="w-4 h-4 mr-1" />
        {formatDate(news.createdAt)}
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{news.title}</h1>
      {news.subtitle && <p className="text-gray-600 text-lg mb-4">{news.subtitle}</p>}
      <p className="text-gray-700 leading-relaxed">{news.content}</p>
      {(news.category || news.author || news.tags.length > 0) && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          {news.category && (
            <p className="text-sm text-gray-500">
              <span className="font-medium">Kategori:</span> {news.category}
            </p>
          )}
          {news.author && (
            <p className="text-sm text-gray-500">
              <span className="font-medium">Penulis:</span> {news.author}
            </p>
          )}
          {news.tags.length > 0 && (
            <p className="text-sm text-gray-500">
              <span className="font-medium">Tags:</span> {news.tags.join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

// Main NewsDetailPage Component
const NewsDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  // Fetch news from Firestore
  const fetchNewsDetail = useCallback(async () => {
    if (!id) {
      setSnackbarMessage('ID berita tidak valid.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const newsDoc = doc(db, 'news', id);
      const docSnap = await getDoc(newsDoc);
      if (docSnap.exists()) {
        const newsData = { id: docSnap.id, ...docSnap.data() } as News;
        if (newsData.published) {
          setNews(newsData);
          setSnackbarMessage('Detail berita berhasil dimuat!');
        } else {
          setNews(null);
          setSnackbarMessage('Berita belum dipublikasikan.');
        }
      } else {
        setNews(null);
        setSnackbarMessage('Berita tidak ditemukan.');
      }
    } catch (error) {
      console.error('Error fetching news detail:', error);
      setSnackbarMessage('Gagal memuat detail berita.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchNewsDetail();
  }, [fetchNewsDetail]);

  if (loading) return <LoadingState />;
  if (!news) return <NotFoundState />;

  return (
    <>
      <NewsDetail news={news} />
      {snackbarMessage && <Snackbar message={snackbarMessage} onClose={() => setSnackbarMessage(null)} />}
    </>
  );
};

export default NewsDetailPage;