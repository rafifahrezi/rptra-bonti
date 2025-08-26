import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Upload,
  X,
  Search,
  Filter,
  Calendar,
  Tag,
} from 'lucide-react';

// Interfaces
interface Image {
  id: number;
  url: string;
  alt: string;
  isMain: boolean;
}

interface Gallery {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  images: Image[];
  status: 'draft' | 'published' | 'archived';
  views: number;
  createdAt: string;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  date: string;
  status: 'draft' | 'published' | 'archived';
  images: Image[];
}

// Components
const GalleryCard: React.FC<{ gallery: Gallery; onEdit: (g: Gallery) => void; onView: (g: Gallery) => void; onDelete: (id: number) => void }> = ({
  gallery,
  onEdit,
  onView,
  onDelete,
}) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    <div className="relative">
      <img
        src={gallery.images.find((img) => img.isMain)?.url || gallery.images[0]?.url}
        alt={gallery.title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-4 right-4 flex gap-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            gallery.status === 'published'
              ? 'bg-green-100 text-green-800'
              : gallery.status === 'draft'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {gallery.status.charAt(0).toUpperCase() + gallery.status.slice(1)}
        </span>
      </div>
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        {gallery.images.length} photos
      </div>
    </div>

    <div className="p-6">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{gallery.title}</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {gallery.category}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{gallery.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {new Date(gallery.date).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {gallery.views} views
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onView(gallery)}
          className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 text-sm"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button
          onClick={() => onEdit(gallery)}
          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 text-sm"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(gallery.id)}
          className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors flex items-center justify-center"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

const StatusToggle: React.FC<{ status: boolean; onToggle: () => void; loading: boolean }> = ({
  status,
  onToggle,
  loading,
}) => (
  <button
    onClick={onToggle}
    disabled={loading}
    className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
      status ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    aria-label={status ? 'Tutup RPTRA' : 'Buka RPTRA'}
  >
    {loading ? (
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
    ) : status ? (
      <>
        <Check className="w-4 h-4 mr-2" /> Buka
      </>
    ) : (
      <>
        <X className="w-4 h-4 mr-2" /> Tutup
      </>
    )}
  </button>
);

const GalleryManagement: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([
    {
      id: 1,
      title: 'Wedding Photography',
      description: 'Beautiful wedding moments captured',
      category: 'Wedding',
      date: '2024-01-15',
      images: [
        { id: 1, url: '/api/placeholder/300/200', alt: 'Wedding 1', isMain: true },
        { id: 2, url: '/api/placeholder/300/200', alt: 'Wedding 2', isMain: false },
        { id: 3, url: '/api/placeholder/300/200', alt: 'Wedding 3', isMain: false },
      ],
      status: 'published',
      views: 245,
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      title: 'Corporate Event',
      description: 'Professional corporate photography',
      category: 'Corporate',
      date: '2024-02-20',
      images: [
        { id: 4, url: '/api/placeholder/300/200', alt: 'Corporate 1', isMain: true },
        { id: 5, url: '/api/placeholder/300/200', alt: 'Corporate 2', isMain: false },
      ],
      status: 'draft',
      views: 89,
      createdAt: '2024-02-20T14:15:00Z',
    },
    {
      id: 3,
      title: 'Portrait Session',
      description: 'Professional portrait photography',
      category: 'Portrait',
      date: '2024-03-10',
      images: [
        { id: 6, url: '/api/placeholder/300/200', alt: 'Portrait 1', isMain: true },
        { id: 7, url: '/api/placeholder/300/200', alt: 'Portrait 2', isMain: false },
        { id: 8, url: '/api/placeholder/300/200', alt: 'Portrait 3', isMain: false },
        { id: 9, url: '/api/placeholder/300/200', alt: 'Portrait 4', isMain: false },
      ],
      status: 'published',
      views: 156,
      createdAt: '2024-03-10T09:45:00Z',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'views'>('date');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    date: '',
    status: 'draft',
    images: [],
  });

  const categories = ['Wedding', 'Corporate', 'Portrait', 'Event', 'Product', 'Landscape'];
  const statuses = ['draft', 'published', 'archived'];

  // Filter and sort galleries
  const filteredGalleries = galleries.filter((gallery) => {
    const matchesSearch =
      gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gallery.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || gallery.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || gallery.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedGalleries = [...filteredGalleries].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'views':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  // Handlers
  const handleCreate = () => {
    setModalMode('create');
    setSelectedGallery(null);
    setFormData({ title: '', description: '', category: '', date: '', status: 'draft', images: [] });
    setShowModal(true);
  };

  const handleEdit = (gallery: Gallery) => {
    setModalMode('edit');
    setSelectedGallery(gallery);
    setFormData({
      title: gallery.title,
      description: gallery.description,
      category: gallery.category,
      date: gallery.date,
      status: gallery.status,
      images: [...gallery.images],
    });
    setShowModal(true);
  };

  const handleView = (gallery: Gallery) => {
    setModalMode('view');
    setSelectedGallery(gallery);
    setShowModal(true);
  };

  const handleDelete = (galleryId: number) => {
    if (window.confirm('Are you sure you want to delete this gallery?')) {
      setGalleries(galleries.filter((g) => g.id !== galleryId));
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.category || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    if (modalMode === 'create') {
      const newGallery: Gallery = {
        id: Date.now(),
        ...formData,
        views: 0,
        createdAt: new Date().toISOString(),
      };
      setGalleries([newGallery, ...galleries]);
    } else if (modalMode === 'edit' && selectedGallery) {
      setGalleries(
        galleries.map((g) =>
          g.id === selectedGallery.id ? { ...selectedGallery, ...formData } : g
        )
      );
    }

    setShowModal(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      url: URL.createObjectURL(file),
      alt: file.name,
      isMain: formData.images.length === 0 && index === 0,
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const handleRemoveImage = (imageId: number) => {
    const updatedImages = formData.images.filter((img) => img.id !== imageId);
    if (updatedImages.length > 0 && !updatedImages.some((img) => img.isMain)) {
      updatedImages[0].isMain = true;
    }

    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  const setMainImage = (imageId: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img) => ({
        ...img,
        isMain: img.id === imageId,
      })),
    }));
  };

  // Stats
  const totalGalleries = galleries.length;
  const publishedCount = galleries.filter((g) => g.status === 'published').length;
  const draftCount = galleries.filter((g) => g.status === 'draft').length;
  const totalViews = galleries.reduce((sum, g) => sum + g.views, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Management</h1>
          <p className="text-gray-600">Manage your photography portfolio galleries</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search galleries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="views">Sort by Views</option>
              </select>
            </div>

            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Gallery
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Galleries</h3>
            <p className="text-2xl font-bold text-gray-900">{totalGalleries}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Published</h3>
            <p className="text-2xl font-bold text-green-600">{publishedCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Drafts</h3>
            <p className="text-2xl font-bold text-yellow-600">{draftCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
            <p className="text-2xl font-bold text-blue-600">{totalViews}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedGalleries.length > 0 ? (
            sortedGalleries.map((gallery) => (
              <GalleryCard
                key={gallery.id}
                gallery={gallery}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="text-center py-12 col-span-full">
              <div className="text-gray-400 mb-4">
                <Tag className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No galleries found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or create a new gallery.</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {modalMode === 'create'
                    ? 'Create Gallery'
                    : modalMode === 'edit'
                    ? 'Edit Gallery'
                    : 'View Gallery'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {modalMode === 'view' && selectedGallery ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{selectedGallery.title}</h3>
                    <p className="text-gray-600 mb-4">{selectedGallery.description}</p>

                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Category:</strong> {selectedGallery.category}
                      </div>
                      <div>
                        <strong>Date:</strong> {new Date(selectedGallery.date).toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Status:</strong>
                        <span
                          className={`ml-2 px-2 py-1 rounded text-xs ${
                            selectedGallery.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : selectedGallery.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {selectedGallery.status}
                        </span>
                      </div>
                      <div>
                        <strong>Views:</strong> {selectedGallery.views}
                      </div>
                      <div>
                        <strong>Total Images:</strong> {selectedGallery.images.length}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Main Image</h4>
                    <img
                      src={selectedGallery.images.find((img) => img.isMain)?.url}
                      alt="Main"
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">All Images ({selectedGallery.images.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedGallery.images.map((image) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-32 object-cover rounded"
                        />
                        {image.isMain && (
                          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
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
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof statuses[number] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter gallery description..."
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="flex flex-col items-center justify-center cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click to upload images</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                    </label>
                  </div>

                  {formData.images.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Uploaded Images ({formData.images.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.url}
                              alt={image.alt}
                              className="w-full h-32 object-cover rounded border"
                            />

                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2">
                              {!image.isMain && (
                                <button
                                  type="button"
                                  onClick={() => setMainImage(image.id)}
                                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                                >
                                  Set Main
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(image.id)}
                                className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {image.isMain && (
                              <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                Main
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {modalMode === 'create' ? 'Create Gallery' : 'Update Gallery'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;   