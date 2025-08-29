import { memo, useState, useEffect, useCallback } from 'react';
import {
  Plus, Edit2, Trash2, Save, X, Upload, Search, Filter, Calendar, User, Tag, FileText, ArrowLeft, ChevronDown
} from 'lucide-react';
import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';

// Type Definitions
interface NewsItem {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  category: string;
  author: string;
  featured: boolean;
  published: boolean;
  tags: string[];
  image: string;
  createdAt: any;
  updatedAt: any;
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
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Memuat data berita...</p>
    </div>
  </div>
));

// Header Component
const Header = memo(({ onAddNews }: { onAddNews: () => void }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div className="flex items-center gap-4">
        <Link
          to="/admin"
          className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manajemen Berita Admin</h1>
          <p className="text-gray-600">Tambah, edit, dan kelola semua berita RPTR</p>
        </div>
      </div>
      <button
        onClick={onAddNews}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Tambah Berita Baru
      </button>
    </div>
  </div>
));

// Filter Component
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

// News List Component
const NewsList = memo(
  ({
    newsList,
    onEdit,
    onDelete,
    onRefresh,
    formatDate,
  }: {
    newsList: NewsItem[];
    onEdit: (news: NewsItem) => void;
    onDelete: (id: string) => void;
    onRefresh: () => void;
    formatDate: (timestamp: any) => string;
  }) => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Daftar Berita ({newsList.length})</h2>
        <button
          onClick={onRefresh}
          className="text-green-600 hover:text-green-700 text-sm"
        >
          Refresh Data
        </button>
      </div>
      <div className="divide-y divide-gray-200">
        {newsList.length > 0 ? (
          newsList.map((news) => (
            <div key={news.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{news.title}</h3>
                    <div className="flex gap-2">
                      {news.featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Featured</span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${news.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {news.published ? 'Published' : 'Draft'}
                      </span>
                      {news.category && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{news.category}</span>
                      )}
                    </div>
                  </div>
                  {news.subtitle && <p className="text-gray-600 mb-2">{news.subtitle}</p>}
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{news.content?.substring(0, 150)}...</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {news.author || 'Admin'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(news.createdAt)}
                    </div>
                    {news.tags?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {news.tags.slice(0, 2).join(', ')}
                        {news.tags.length > 2 && ` +${news.tags.length - 2}`}
                      </div>
                    )}
                  </div>
                </div>
                {news.image && (
                  <div className="ml-4 flex-shrink-0">
                    <img src={news.image} alt={news.title} className="w-20 h-20 object-cover rounded-md" />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
  <button
    onClick={() => onEdit(news)}
    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors group"
    title="Edit berita"
  >
    <Edit2 className="w-4 h-4" />
  </button>
  <button
    onClick={() => onDelete(news.id)}
    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors group"
    title="Hapus berita"
  >
    <Trash2 className="w-4 h-4" />
  </button>
</div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Belum ada berita yang tersedia</p>
            <p className="text-sm mt-2">Klik "Tambah Berita Baru" untuk membuat berita pertama</p>
          </div>
        )}
      </div>
    </div>
  )
);

// Accordion Section for Modal
const AccordionSection = memo(
  ({ title, children, isOpen, toggleOpen }: {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    toggleOpen: () => void;
  }) => (
    <div className="bg-gray-50 rounded-lg">
      <button
        onClick={toggleOpen}
        className="w-full p-4 flex justify-between items-center text-left hover:bg-gray-100 transition-colors"
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${title}`}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <ChevronDown className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        id={`accordion-content-${title}`}
        className={`overflow-hidden transition-max-height duration-300 ease-in-out ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
);

// News Form Component
const NewsForm = memo(
  ({
    newsForm,
    setNewsForm,
    imagePreview,
    handleImageUpload,
    uploadingImage,
    addTag,
    removeTag,
    newTag,
    setNewTag,
    categories,
    onSave,
    onCancel,
    saving,
    isEditing,
  }: {
    newsForm: NewsItem;
    setNewsForm: (form: Partial<NewsItem>) => void;
    imagePreview: string;
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    uploadingImage: boolean;
    addTag: () => void;
    removeTag: (tag: string) => void;
    newTag: string;
    setNewTag: (value: string) => void;
    categories: string[];
    onSave: () => void;
    onCancel: () => void;
    saving: boolean;
    isEditing: boolean;
  }) => {
    const [openSections, setOpenSections] = useState({
      basic: true,
      content: true,
      image: true,
      tags: true,
      options: true,
    });

    const toggleSection = (section: keyof typeof openSections) => {
      setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">{isEditing ? 'Edit Berita' : 'Tambah Berita Baru'}</h2>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <AccordionSection title="Informasi Dasar" isOpen={openSections.basic} toggleOpen={() => toggleSection('basic')}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Judul Berita *</label>
                  <input
                    type="text"
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({ title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Masukkan judul berita"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={newsForm.subtitle}
                    onChange={(e) => setNewsForm({ subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Subtitle atau ringkasan singkat"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <select
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Penulis</label>
                  <input
                    type="text"
                    value={newsForm.author}
                    onChange={(e) => setNewsForm({ author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Nama penulis"
                  />
                </div>
              </div>
            </AccordionSection>
            <AccordionSection title="Konten Berita" isOpen={openSections.content} toggleOpen={() => toggleSection('content')}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Konten Berita *</label>
                <textarea
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ content: e.target.value })}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Tulis konten berita di sini..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Karakter: {newsForm.content.length}</p>
              </div>
            </AccordionSection>
            <AccordionSection title="Gambar Berita" isOpen={openSections.image} toggleOpen={() => toggleSection('image')}>
              <div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="news-image-upload"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="news-image-upload"
                    className={`cursor-pointer flex flex-col items-center gap-2 ${uploadingImage ? 'opacity-50' : ''}`}
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {uploadingImage ? 'Mengupload...' : 'Upload gambar berita'}
                    </span>
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-4 relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs">Preview</div>
                  </div>
                )}
              </div>
            </AccordionSection>
            <AccordionSection title="Tags" isOpen={openSections.tags} toggleOpen={() => toggleSection('tags')}>
              <div>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {newsForm.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Tambah tag"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </AccordionSection>
            <AccordionSection title="Opsi" isOpen={openSections.options} toggleOpen={() => toggleSection('options')}>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newsForm.featured}
                    onChange={(e) => setNewsForm({ featured: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Berita Unggulan</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newsForm.published}
                    onChange={(e) => setNewsForm({ published: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Publikasikan</span>
                </label>
              </div>
            </AccordionSection>
          </div>
          <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={onSave}
              disabled={saving || !newsForm.title.trim()}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Menyimpan...' : (isEditing ? 'Update Berita' : 'Simpan Berita')}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

// Main NewsAdmin Component
const NewsAdmin = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [saving, setSaving] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const [newsForm, setNewsForm] = useState<NewsItem>({
    id: '',
    title: '',
    subtitle: '',
    content: '',
    category: '',
    author: '',
    featured: false,
    published: true,
    tags: [],
    image: '',
    createdAt: null,
    updatedAt: null,
  });

  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newTag, setNewTag] = useState('');

  const categories = [
    'Berita Umum',
    'Program Anak',
    'Kegiatan Komunitas',
    'Kesehatan',
    'Pendidikan',
    'Event',
    'Pengumuman',
  ];

  // Load news data
  const loadNewsData = useCallback(async () => {
    setLoading(true);
    try {
      const newsCollection = collection(db, 'news');
      const q = query(newsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const newsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as NewsItem));
      setNewsList(newsData);
      setSnackbarMessage('Data berita berhasil direfresh!');
    } catch (error) {
      console.error('Error loading news:', error);
      setSnackbarMessage('Gagal memuat berita.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNewsData();
  }, [loadNewsData]);

  // Reset form
  const resetForm = useCallback(() => {
    setNewsForm({
      id: '',
      title: '',
      subtitle: '',
      content: '',
      category: '',
      author: '',
      featured: false,
      published: true,
      tags: [],
      image: '',
      createdAt: null,
      updatedAt: null,
    });
    setImagePreview('');
    setEditingNews(null);
    setNewTag('');
  }, []);

  // Open modal
  const openModal = useCallback((news?: NewsItem) => {
    if (news) {
      setNewsForm(news);
      setImagePreview(news.image || '');
      setEditingNews(news);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  }, [resetForm]);

  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    resetForm();
  }, [resetForm]);

  // Handle image upload
  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setImagePreview(imageUrl);
        setNewsForm(prev => ({ ...prev, image: imageUrl }));
        setSnackbarMessage('Gambar berhasil diupload!');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setSnackbarMessage('Gagal mengupload gambar.');
    } finally {
      setUploadingImage(false);
    }
  }, []);

  // Add tag
  const addTag = useCallback(() => {
    if (newTag.trim() && !newsForm.tags.includes(newTag.trim())) {
      setNewsForm(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  }, [newTag, newsForm.tags]);

  // Remove tag
  const removeTag = useCallback((tagToRemove: string) => {
    setNewsForm(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  }, []);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!newsForm.title.trim()) {
      setSnackbarMessage('Judul berita harus diisi!');
      return;
    }

    setSaving(true);
    try {
      const newsData = { ...newsForm, updatedAt: serverTimestamp() };
      if (editingNews) {
        const docRef = doc(db, 'news', editingNews.id);
        await updateDoc(docRef, newsData);
        setSnackbarMessage('Berita berhasil diupdate!');
      } else {
        newsData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'news'), newsData);
        setSnackbarMessage('Berita berhasil dibuat!');
      }
      closeModal();
      loadNewsData();
    } catch (error) {
      console.error('Error saving news:', error);
      setSnackbarMessage('Gagal menyimpan berita.');
    } finally {
      setSaving(false);
    }
  }, [newsForm, editingNews, closeModal, loadNewsData]);

  // Handle delete
  const handleDelete = useCallback(async (newsId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      try {
        await deleteDoc(doc(db, 'news', newsId));
        setSnackbarMessage('Berita berhasil dihapus!');
        loadNewsData();
      } catch (error) {
        console.error('Error deleting news:', error);
        setSnackbarMessage('Gagal menghapus berita.');
      }
    }
  }, [loadNewsData]);

  // Filter news
  const filteredNews = newsList.filter(news => {
    const matchesSearch = news.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || news.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Format date
  const formatDate = useCallback((timestamp: any): string => {
    if (!timestamp) return 'Tidak diketahui';
    let date: Date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else {
      return 'Tidak valid';
    }
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Header onAddNews={() => openModal()} />
        <FilterSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          categories={categories}
        />
        <NewsList
          newsList={filteredNews}
          onEdit={openModal}
          onDelete={handleDelete}
          onRefresh={loadNewsData}
          formatDate={formatDate}
        />
        {isModalOpen && (
          <NewsForm
            newsForm={newsForm}
            setNewsForm={(updates) => setNewsForm(prev => ({ ...prev, ...updates }))}
            imagePreview={imagePreview}
            handleImageUpload={handleImageUpload}
            uploadingImage={uploadingImage}
            addTag={addTag}
            removeTag={removeTag}
            newTag={newTag}
            setNewTag={setNewTag}
            categories={categories}
            onSave={handleSave}
            onCancel={closeModal}
            saving={saving}
            isEditing={!!editingNews}
          />
        )}
        {snackbarMessage && <Snackbar message={snackbarMessage} onClose={() => setSnackbarMessage(null)} />}
      </div>
    </div>
  );
};

export default NewsAdmin;