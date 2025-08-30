import { FC, memo, useState, useEffect, useCallback } from 'react';
import {
  Plus, Edit, Trash2, Eye, Upload, X, Search, Calendar, Tag, Check, Loader2, AlertCircle, ChevronDown, ArrowLeft
} from 'lucide-react';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link } from 'react-router-dom';
// import { storage } from "../config/firebase"; 
// import { Link } from 'react-router-dom';

// Type Definitions
interface Image {
  id: string;
  url: string;
  alt: string;
  isMain: boolean;
  fileName?: string;
  size?: number;
}

interface Gallery {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  images: Image[];
  status: 'draft' | 'published' | 'archived';
  views: number;
  createdAt: any;
  updatedAt: any;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  date: string;
  status: 'draft' | 'published' | 'archived';
  images: Image[];
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
      <Loader2 className="animate-spin w-12 h-12 text-blue-500 mx-auto" />
      <p className="mt-4 text-gray-600">Memuat galeri...</p>
    </div>
  </div>
));

// Error Alert Component
const ErrorAlert = memo(({ message, onDismiss }: { message: string; onDismiss?: () => void }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <p className="text-red-800 text-sm">{message}</p>
    </div>
    {onDismiss && (
      <button onClick={onDismiss} className="text-red-400 hover:text-red-600">
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
));

// Empty State Component
const EmptyState = memo(() => (
  <div className="text-center py-12">
    <Tag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
    <p className="text-lg text-gray-500">Belum ada galeri yang tersedia.</p>
    <p className="text-sm text-gray-400 mt-2">Tambahkan galeri baru untuk memulai!</p>
  </div>
));

// Stats Card Component
const StatsCard = memo(({ title, value, color = 'gray' }: { title: string; value: number; color?: string }) => {
  const colorClasses = {
    gray: 'text-gray-900',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    blue: 'text-blue-600',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className={`text-2xl font-bold ${colorClasses[color as keyof typeof colorClasses] || colorClasses.gray}`}>
        {value.toLocaleString()}
      </p>
    </div>
  );
});

// Gallery Card Component
const GalleryCard = memo(
  ({
    gallery,
    onEdit,
    onView,
    onDelete,
    isDeleting = false,
  }: {
    gallery: Gallery;
    onEdit: (gallery: Gallery) => void;
    onView: (gallery: Gallery) => void;
    onDelete: (id: string) => void;
    isDeleting?: boolean;
  }) => {
    const mainImage = gallery.images.find(img => img.isMain) || gallery.images[0];
    const formatDate = (date: string) => new Date(date).toLocaleDateString('id-ID');

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
        <div className="relative">
          {mainImage ? (
            <img src={mainImage.url} alt={gallery.title} className="w-full h-48 object-cover" />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <Tag className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${gallery.status === 'published'
                ? 'bg-green-100/80 text-green-800'
                : gallery.status === 'draft'
                  ? 'bg-yellow-100/80 text-yellow-800'
                  : 'bg-gray-100/80 text-gray-800'
                }`}
            >
              {gallery.status.charAt(0).toUpperCase() + gallery.status.slice(1)}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            {gallery.images.length} foto
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{gallery.title}</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2">
              {gallery.category}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{gallery.description}</p>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(gallery.date)}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {gallery.views} views
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onView(gallery)}
              className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              Lihat
            </button>
            <button
              onClick={() => onEdit(gallery)}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(gallery.id)}
              disabled={isDeleting}
              className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

// Search Filters Component
const SearchFilters = memo(
  ({
    searchTerm,
    onSearchChange,
    filterCategory,
    onCategoryChange,
    filterStatus,
    onStatusChange,
    sortBy,
    onSortChange,
    categories,
  }: {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filterCategory: string;
    onCategoryChange: (value: string) => void;
    filterStatus: string;
    onStatusChange: (value: string) => void;
    sortBy: string;
    onSortChange: (value: string) => void;
    categories: string[];
  }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari galeri..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">Semua Kategori</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="date">Urutkan: Tanggal</option>
            <option value="title">Urutkan: Judul</option>
            <option value="views">Urutkan: Views</option>
            <option value="updated">Urutkan: Update Terakhir</option>
          </select>
        </div>
      </div>
    </div>
  )
);

// Image Upload Zone Component
const ImageUploadZone = memo(
  ({ onUpload, isUploading }: { onUpload: (files: FileList) => void; isUploading: boolean }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => e.target.files && onUpload(e.target.files)}
        className="hidden"
        id="image-upload"
        disabled={isUploading}
      />
      <label htmlFor="image-upload" className="cursor-pointer block">
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
            <p className="text-sm text-gray-600">Mengupload gambar...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-8 h-8 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 font-medium">Klik untuk upload gambar</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF hingga 10MB per file</p>
          </div>
        )}
      </label>
    </div>
  )
);

// Image Grid Component
const ImageGrid = memo(
  ({
    images,
    onRemove,
    onSetMain,
    readOnly = false,
  }: {
    images: Image[];
    onRemove: (id: string) => void;
    onSetMain: (id: string) => void;
    readOnly?: boolean;
  }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.id} className="relative group">
          <img
            src={image.url}
            alt={image.alt}
            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
          />
          {!readOnly && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              {!image.isMain && (
                <button
                  type="button"
                  onClick={() => onSetMain(image.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-700 transition-colors"
                >
                  Set Utama
                </button>
              )}
              <button
                type="button"
                onClick={() => onRemove(image.id)}
                className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {image.isMain && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-medium">
              Utama
            </div>
          )}
        </div>
      ))}
    </div>
  )
);

// Accordion Section Component
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

// Gallery Modal Component
const GalleryModal = memo(
  ({
    isOpen,
    mode,
    gallery,
    onClose,
    onSubmit,
    onImageUpload,
  }: {
    isOpen: boolean;
    mode: 'create' | 'edit' | 'view';
    gallery?: Gallery | null;
    onClose: () => void;
    onSubmit: (data: FormData) => Promise<void>;
    onImageUpload: (files: FileList) => Promise<string[]>; // return array URL hasil upload
  }) => {
    const [formData, setFormData] = useState<FormData>({
      title: '',
      description: '',
      category: '',
      date: '',
      status: 'draft',
      images: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [openSections, setOpenSections] = useState({
      details: true,
      images: true,
    });

    const categories = ['Wedding', 'Corporate', 'Portrait', 'Event', 'Product', 'Landscape'];

    // Load data untuk edit / view
    useEffect(() => {
      if (gallery && (mode === 'edit' || mode === 'view')) {
        setFormData({
          title: gallery.title,
          description: gallery.description,
          category: gallery.category,
          date: gallery.date,
          status: gallery.status,
          images: [...gallery.images],
        });
      } else {
        setFormData({
          title: '',
          description: '',
          category: '',
          date: '',
          status: 'draft',
          images: [],
        });
      }
    }, [gallery, mode]);

    const handleSubmit = useCallback(async () => {
      if (!formData.title.trim() || !formData.category || !formData.date) {
        setSnackbarMessage('Mohon lengkapi semua field yang wajib diisi');
        return;
      }

      try {
        setIsSubmitting(true);
        await onSubmit(formData);
        setSnackbarMessage(mode === 'create' ? 'Galeri berhasil dibuat!' : 'Galeri berhasil diupdate!');
        onClose();
      } catch (error) {
        console.error('Error submitting form:', error);
        setSnackbarMessage('Terjadi kesalahan saat menyimpan galeri');
      } finally {
        setIsSubmitting(false);
      }
    }, [formData, mode, onSubmit, onClose]);

    // ✅ Upload & insert ke formData.images
    const handleImageUpload = useCallback(
      async (files: FileList) => {
        try {
          setIsUploading(true);
          const urls = await onImageUpload(files); // dapat array URL dari Firebase
          const newImages: Image[] = urls.map((url, index) => ({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            url,
            alt: files[index]?.name || `image-${index}`,
            isMain:
              formData.images.length === 0 && index === 0
                ? true
                : false,
          }));

          setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages],
          }));
        } catch (error) {
          console.error('Error uploading images:', error);
          setSnackbarMessage('Terjadi kesalahan saat mengupload gambar');
        } finally {
          setIsUploading(false);
        }
      },
      [onImageUpload, formData.images.length]
    );

    // ✅ Remove image
    const handleRemoveImage = useCallback(
      (imageId: string) => {
        const updatedImages = formData.images.filter(img => img.id !== imageId);
        if (updatedImages.length > 0 && !updatedImages.some(img => img.isMain)) {
          updatedImages[0].isMain = true;
        }
        setFormData(prev => ({ ...prev, images: updatedImages }));
      },
      [formData.images]
    );

    // ✅ Set main image
    const setMainImage = useCallback((imageId: string) => {
      setFormData(prev => ({
        ...prev,
        images: prev.images.map(img => ({
          ...img,
          isMain: img.id === imageId,
        })),
      }));
    }, []);

    const toggleSection = useCallback((section: keyof typeof openSections) => {
      setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    }, []);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="sticky top-0 bg-white p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'create' ? 'Buat Galeri Baru' : mode === 'edit' ? 'Edit Galeri' : 'Lihat Galeri'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {mode === 'view' && gallery ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">{gallery.title}</h3>
                    <p className="text-gray-600 mb-6">{gallery.description}</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <strong>Kategori:</strong>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{gallery.category}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <strong>Tanggal:</strong>
                        <span>{new Date(gallery.date).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <strong>Status:</strong>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${gallery.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : gallery.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {gallery.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <strong>Views:</strong>
                        <span className="font-mono">{gallery.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <strong>Total Gambar:</strong>
                        <span className="font-mono">{gallery.images.length}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Gambar Utama</h4>
                    {gallery.images.find(img => img.isMain) ? (
                      <img
                        src={gallery.images.find(img => img.isMain)!.url}
                        alt="Main"
                        className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Tag className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">
                    Semua Gambar ({formData.images.length})
                  </h4>
                </div>
              </div>
            ) : (
              <>
                <AccordionSection title="Detail Galeri" isOpen={openSections.details} toggleOpen={() => toggleSection('details')}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Judul Galeri <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan judul galeri"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                        required
                      >
                        <option value="">Pilih Kategori</option>
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'archived' })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan deskripsi galeri"
                      />
                    </div>
                  </div>
                </AccordionSection>
                <AccordionSection title="Gambar Galeri" isOpen={openSections.images} toggleOpen={() => toggleSection('images')}>
                  <ImageUploadZone onUpload={handleImageUpload} isUploading={isUploading} />
                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-3">Gambar ({formData.images.length})</h4>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={e => e.target.files && handleImageUpload(e.target.files)}
                        disabled={isUploading || mode === 'view'}
                      />
                      {isUploading && <p>Uploading...</p>}
                      <ImageGrid
                        images={formData.images}
                        onRemove={handleRemoveImage}
                        onSetMain={setMainImage}
                        readOnly={mode === 'view'}
                      />
                    </div>
                  )}
                </AccordionSection>
              </>
            )}
          </div>
          {mode !== 'view' && (
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {isSubmitting ? 'Menyimpan...' : mode === 'create' ? 'Buat Galeri' : 'Simpan Perubahan'}
              </button>
            </div>
          )}
          {snackbarMessage && <Snackbar message={snackbarMessage} onClose={() => setSnackbarMessage(null)} />}
        </div>
      </div>
    );
  }
);

// Main GalleryManagement Component
const GalleryManagement: FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [filteredGalleries, setFilteredGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const categories = ['Wedding', 'Corporate', 'Portrait', 'Event', 'Product', 'Landscape'];

  // Fetch galleries from Firestore
  const fetchGalleries = useCallback(async () => {
    setLoading(true);
    try {
      const galleryCollection = collection(db, 'gallery');
      const q = query(galleryCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const galleryData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Gallery));
      setGalleries(galleryData);
      setFilteredGalleries(galleryData);
      setSnackbarMessage('Galeri berhasil dimuat!');
    } catch (err) {
      console.error('Error fetching galleries:', err);
      setError(err instanceof Error ? err.message : 'Gagal memuat galeri');
      setSnackbarMessage('Gagal memuat galeri');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create or update gallery
  const handleSubmit = useCallback(
    async (data: FormData) => {
      try {
        if (modalMode === 'create') {
          const newGallery = { ...data, views: 0, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
          const docRef = await addDoc(collection(db, 'gallery'), newGallery);
          setGalleries(prev => [{ ...newGallery, id: docRef.id }, ...prev]);
          setFilteredGalleries(prev => [{ ...newGallery, id: docRef.id }, ...prev]);
        } else if (selectedGallery) {
          const docRef = doc(db, 'gallery', selectedGallery.id);
          await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
          setGalleries(prev =>
            prev.map(g => (g.id === selectedGallery.id ? { ...selectedGallery, ...data, id: selectedGallery.id } : g))
          );
          setFilteredGalleries(prev =>
            prev.map(g => (g.id === selectedGallery.id ? { ...selectedGallery, ...data, id: selectedGallery.id } : g))
          );
        }
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : 'Gagal menyimpan galeri');
      }
    },
    [modalMode, selectedGallery]
  );

  // Delete gallery
  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm('Apakah Anda yakin ingin menghapus galeri ini?')) {
        setDeletingId(id);
        try {
          await deleteDoc(doc(db, 'gallery', id));
          setGalleries(prev => prev.filter(g => g.id !== id));
          setFilteredGalleries(prev => prev.filter(g => g.id !== id));
          setSnackbarMessage('Galeri berhasil dihapus!');
        } catch (err) {
          console.error('Error deleting gallery:', err);
          setSnackbarMessage('Gagal menghapus galeri');
        } finally {
          setDeletingId(null);
        }
      }
    },
    []
  );

  // Handle image upload (mocked for Firestore compatibility)
  const handleImageUpload = useCallback(
    async (files: FileList) => {
      if (!selectedGallery) return;

      try {
        setIsUploading(true);

        const uploadedImages: Image[] = [];

        for (const file of Array.from(files)) {
          // 1. Buat reference unik di Firebase Storage
          const storageRef = ref(
            storage,
            `galleries/${selectedGallery.id}/${Date.now()}-${file.name}`
          );

          // 2. Upload file
          await uploadBytes(storageRef, file);

          // 3. Ambil URL download
          const url = await getDownloadURL(storageRef);

          // 4. Simpan ke array
          uploadedImages.push({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            url,
            alt: file.name,
            isMain:
              uploadedImages.length === 0 &&
              !selectedGallery.images.some((img) => img.isMain),
          });
        }

        // 5. Update selectedGallery + galleries + filteredGalleries
        setSelectedGallery((prev) =>
          prev
            ? { ...prev, images: [...prev.images, ...uploadedImages] }
            : ({ images: uploadedImages } as Gallery)
        );

        setGalleries((prev) =>
          prev.map((g) =>
            g.id === selectedGallery.id
              ? { ...g, images: [...g.images, ...uploadedImages] }
              : g
          )
        );

        setFilteredGalleries((prev) =>
          prev.map((g) =>
            g.id === selectedGallery.id
              ? { ...g, images: [...g.images, ...uploadedImages] }
              : g
          )
        );

        setSnackbarMessage("Gambar berhasil diupload");
      } catch (error) {
        console.error("Error uploading images:", error);
        setSnackbarMessage("Terjadi kesalahan saat mengupload gambar");
      } finally {
        setIsUploading(false);
      }
    },
    [selectedGallery]
  );

  // Filter and sort galleries
  const filterAndSortGalleries = useCallback(() => {
    let filtered = galleries.filter(g => {
      const matchesSearch =
        g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || g.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || g.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'views') return b.views - a.views;
      if (sortBy === 'updated') {
        const aTime = a.updatedAt?.toDate ? a.updatedAt.toDate().getTime() : new Date(a.updatedAt).getTime();
        const bTime = b.updatedAt?.toDate ? b.updatedAt.toDate().getTime() : new Date(b.updatedAt).getTime();
        return bTime - aTime;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    setFilteredGalleries(filtered);
  }, [galleries, searchTerm, filterCategory, filterStatus, sortBy]);

  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  useEffect(() => {
    filterAndSortGalleries();
  }, [filterAndSortGalleries]);

  const openModal = useCallback((mode: 'create' | 'edit' | 'view', gallery?: Gallery) => {
    setModalMode(mode);
    setSelectedGallery(gallery || null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedGallery(null);
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorAlert message={error} onDismiss={() => setError(null)} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
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
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Manajemen Galeri
                </h1>
                <p className="text-gray-600">
                  Kelola koleksi galeri foto Anda
                </p>
              </div>
            </div>
            {/* Add Button - Only for SuperAdmin */}
            <button
              onClick={() => openModal('create')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Galeri Baru
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatsCard title="Total Galeri" value={galleries.length} color="blue" />
          <StatsCard
            title="Galeri Published"
            value={galleries.filter(g => g.status === 'published').length}
            color="green"
          />
          <StatsCard
            title="Total Views"
            value={galleries.reduce((sum, g) => sum + g.views, 0)}
            color="yellow"
          />
        </div>

        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterCategory={filterCategory}
          onCategoryChange={setFilterCategory}
          filterStatus={filterStatus}
          onStatusChange={setFilterStatus}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categories={categories}
        />

        {filteredGalleries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGalleries.map(gallery => (
              <GalleryCard
                key={gallery.id}
                gallery={gallery}
                onEdit={() => openModal('edit', gallery)}
                onView={() => openModal('view', gallery)}
                onDelete={handleDelete}
                isDeleting={deletingId === gallery.id}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        <GalleryModal
          isOpen={isModalOpen}
          mode={modalMode}
          gallery={selectedGallery}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onImageUpload={handleImageUpload}
        />

        {snackbarMessage && <Snackbar message={snackbarMessage} onClose={() => setSnackbarMessage(null)} />}
      </div>
    </div>
  );
};

export default GalleryManagement;