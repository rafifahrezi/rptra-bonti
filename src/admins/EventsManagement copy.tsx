// src/admins/EventsManagement.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase'; // Adjust path as needed
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Search,
  Filter,
  X,
  Save,
  Upload,
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';

// Types
interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  participants: number;
  maxParticipants: number;
  image: string; // This will be the gallery image ID or URL
  status: 'upcoming' | 'ongoing' | 'finished';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  alt: string;
}

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  maxParticipants: number;
  image: string;
  status: 'upcoming' | 'ongoing' | 'finished';
}

interface User {
  uid: string;
  role: 'admin' | 'superadmin';
  email: string;
}

const EventsManagement: React.FC = () => {
  // State Management
  const [events, setEvents] = useState<EventItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Current user - you should get this from your auth context
  const [currentUser] = useState<User>({
    uid: 'admin-uid',
    role: 'admin', // or 'superadmin'
    email: 'admin@example.com'
  });

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Olahraga',
    maxParticipants: 0,
    image: '',
    status: 'upcoming'
  });

  const categories = ['Olahraga', 'Edukasi', 'Lingkungan', 'Kuliner', 'Seni'];
  const statuses = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Sedang Berlangsung' },
    { value: 'finished', label: 'Selesai' }
  ];

  // Check if user has permission
  const hasPermission = () => {
    return currentUser.role === 'admin' || currentUser.role === 'superadmin';
  };

  // Firestore Functions
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, orderBy('createdAt', 'desc'));
      
      // Set up real-time listener
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const eventsData: EventItem[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          eventsData.push({
            id: doc.id,
            ...data,
            // Ensure participants is a number
            participants: data.participants || 0
          } as EventItem);
        });
        setEvents(eventsData);
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Gagal memuat data events');
      setLoading(false);
    }
  };

  const fetchGalleryImages = async () => {
    try {
      const galleryRef = collection(db, 'gallery');
      const q = query(galleryRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const imagesData: GalleryImage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        imagesData.push({
          id: doc.id,
          url: data.mainImage || data.images?.[0]?.url || '',
          title: data.title || '',
          alt: data.title || 'Gallery Image'
        });
      });
      
      setGalleryImages(imagesData);
    } catch (err) {
      console.error('Error fetching gallery images:', err);
    }
  };

  const createEvent = async (eventData: EventFormData) => {
    if (!hasPermission()) {
      throw new Error('Tidak memiliki izin untuk membuat event');
    }

    try {
      setSubmitting(true);
      const eventsRef = collection(db, 'events');
      
      const newEvent = {
        ...eventData,
        participants: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: currentUser.uid
      };

      await addDoc(eventsRef, newEvent);
    } catch (err) {
      console.error('Error creating event:', err);
      throw new Error('Gagal membuat event baru');
    } finally {
      setSubmitting(false);
    }
  };

  const updateEvent = async (eventId: string, eventData: EventFormData) => {
    if (!hasPermission()) {
      throw new Error('Tidak memiliki izin untuk mengupdate event');
    }

    try {
      setSubmitting(true);
      const eventRef = doc(db, 'events', eventId);
      
      const updateData = {
        ...eventData,
        updatedAt: serverTimestamp()
      };

      await updateDoc(eventRef, updateData);
    } catch (err) {
      console.error('Error updating event:', err);
      throw new Error('Gagal mengupdate event');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!hasPermission()) {
      throw new Error('Tidak memiliki izin untuk menghapus event');
    }

    try {
      const eventRef = doc(db, 'events', eventId);
      await deleteDoc(eventRef);
    } catch (err) {
      console.error('Error deleting event:', err);
      throw new Error('Gagal menghapus event');
    }
  };

  // Effects
  useEffect(() => {
    if (!hasPermission()) {
      setError('Anda tidak memiliki izin untuk mengakses halaman ini');
      return;
    }

    const unsubscribe = fetchEvents();
    fetchGalleryImages();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Filter events
  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(event => event.status === selectedStatus);
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, selectedStatus, events]);

  // Form Handlers
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: 'Olahraga',
      maxParticipants: 0,
      image: '',
      status: 'upcoming'
    });
  };

  const openCreateModal = () => {
    if (!hasPermission()) {
      alert('Anda tidak memiliki izin untuk membuat event');
      return;
    }
    resetForm();
    setModalType('create');
    setSelectedEvent(null);
    setShowModal(true);
  };

  const openEditModal = (event: EventItem) => {
    if (!hasPermission()) {
      alert('Anda tidak memiliki izin untuk mengedit event');
      return;
    }
    
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      maxParticipants: event.maxParticipants,
      image: event.image,
      status: event.status
    });
    setModalType('edit');
    setSelectedEvent(event);
    setShowModal(true);
  };

  const openViewModal = (event: EventItem) => {
    setSelectedEvent(event);
    setModalType('view');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    resetForm();
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasPermission()) {
      setError('Anda tidak memiliki izin untuk melakukan aksi ini');
      return;
    }

    try {
      setError(null);
      
      if (modalType === 'create') {
        await createEvent(formData);
      } else if (modalType === 'edit' && selectedEvent) {
        await updateEvent(selectedEvent.id, formData);
      }
      
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  };

  const handleDelete = (id: string) => {
    if (!hasPermission()) {
      alert('Anda tidak memiliki izin untuk menghapus event');
      return;
    }
    setEventToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      await deleteEvent(eventToDelete);
      setEventToDelete(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus event');
    }
  };

  // Helper Functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'finished':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'ongoing':
        return 'Sedang Berlangsung';
      case 'finished':
        return 'Selesai';
      default:
        return status;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (imageId: string) => {
    // If it's already a URL, return as is
    if (imageId.startsWith('http')) {
      return imageId;
    }
    
    // Find image from gallery
    const galleryImage = galleryImages.find(img => img.id === imageId);
    return galleryImage?.url || '/api/placeholder/400/250';
  };

  // Error boundary for permission
  if (!hasPermission()) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-2">Akses Ditolak</h1>
          <p className="text-gray-600 mb-4">
            Anda tidak memiliki izin untuk mengakses halaman manajemen events.
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
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
                Manajemen Kegiatan
              </h1>
              <p className="text-gray-600">
                Kelola semua kegiatan RPTRA Bonti
              </p>
            </div>
          </div>
          {/* Add Button */}
          <button
            onClick={openCreateModal}
            disabled={!hasPermission()}
            className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            Tambah Kegiatan
          </button>
        </div>
        
        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari kegiatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua Kategori</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua Status</option>
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Memuat data events...</span>
          </div>
        </div>
      ) : (
        /* Events Table */
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Kegiatan</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Kategori</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Tanggal & Waktu</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Lokasi</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Peserta</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={getImageUrl(event.image)}
                          alt={event.title}
                          className="w-12 h-12 rounded-lg object-cover mr-4"
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/400/250';
                          }}
                        />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-1">{event.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2">{event.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {event.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {event.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {event.participants}/{event.maxParticipants}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {getStatusText(event.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openViewModal(event)}
                          className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-150"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(event)}
                          disabled={!hasPermission()}
                          className="text-gray-600 hover:text-green-600 p-2 rounded-lg hover:bg-green-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          disabled={!hasPermission()}
                          className="text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEvents.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Tidak ada kegiatan ditemukan</h3>
                <p className="text-sm">Coba ubah kata kunci pencarian atau filter yang digunakan</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {modalType === 'create' ? 'Tambah Kegiatan Baru' : 
                 modalType === 'edit' ? 'Edit Kegiatan' : 'Detail Kegiatan'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalType === 'view' && selectedEvent ? (
              <div className="p-6">
                <div className="mb-6">
                  <img
                    src={getImageUrl(selectedEvent.image)}
                    alt={selectedEvent.title}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/400/250';
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedEvent.title}</h3>
                    <p className="text-gray-600 mb-4">{selectedEvent.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{formatDate(selectedEvent.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{selectedEvent.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{selectedEvent.location}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedEvent.status)}`}>
                        {getStatusText(selectedEvent.status)}
                      </span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-500">Kategori:</span>
                        <span className="ml-2 font-medium">{selectedEvent.category}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Peserta:</span>
                        <span className="ml-2 font-medium">{selectedEvent.participants}/{selectedEvent.maxParticipants}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Dibuat:</span>
                        <span className="ml-2">{selectedEvent.createdAt?.toDate().toLocaleDateString('id-ID')}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Diupdate:</span>
                        <span className="ml-2">{selectedEvent.updatedAt?.toDate().toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6">
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Kegiatan *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Masukkan judul kegiatan"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Masukkan deskripsi kegiatan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waktu *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Masukkan lokasi kegiatan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maksimal Peserta *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.maxParticipants || ''}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Masukkan jumlah maksimal peserta"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'upcoming' | 'ongoing' | 'finished' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {statuses.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar *
                    </label>
                    
                    {/* Gallery Images Selection */}
                    {galleryImages.length > 0 ? (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Pilih dari Gallery:</p>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto border rounded-lg p-2">
                          {galleryImages.map((img) => (
                            <div
                              key={img.id}
                              className={`relative cursor-pointer border-2 rounded-lg overflow-hidden ${
                                formData.image === img.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setFormData({ ...formData, image: img.id })}
                            >
                              <img
                                src={img.url}
                                alt={img.alt}
                                className="w-full h-16 object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/api/placeholder/100/100';
                                }}
                              />
                              {formData.image === img.id && (
                                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {/* URL Input Alternative */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Atau masukkan URL gambar:</p>
                      <input
                        type="url"
                        value={formData.image.startsWith('http') ? formData.image : ''}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    {/* Image Preview */}
                    {formData.image && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <img
                          src={getImageUrl(formData.image)}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/400/200';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200 disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !hasPermission()}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {modalType === 'create' ? 'Menyimpan...' : 'Mengupdate...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {modalType === 'create' ? 'Simpan' : 'Update'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Hapus Kegiatan</h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin menghapus kegiatan ini? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManagement;