// src/pages/Event.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Search, Filter } from 'lucide-react';

interface EventItem {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  participants: number;
  maxParticipants: number;
  image: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

const Event: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sample data - replace with actual API call
  useEffect(() => {
    const sampleEvents: EventItem[] = [
      {
        id: 1,
        title: 'Senam Merdeka Minggu Pagi',
        description: 'Kegiatan senam bersama untuk memperingati kemerdekaan Indonesia.',
        date: '15 Februari 2025',
        time: '07:00 - 09:00',
        location: 'Lapangan RPTRA Bonti',
        category: 'Olahraga',
        participants: 45,
        maxParticipants: 50,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        status: 'upcoming'
      },
      {
        id: 2,
        title: 'Workshop Kerajinan Tangan',
        description: 'Belajar membuat kerajinan tangan dari barang bekas untuk anak-anak.',
        date: '18 Februari 2025',
        time: '14:00 - 16:00',
        location: 'Ruang Kreatif RPTRA Bonti',
        category: 'Edukasi',
        participants: 20,
        maxParticipants: 25,
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        status: 'upcoming'
      },
      {
        id: 3,
        title: 'Gotong Royong Lingkungan',
        description: 'Kegiatan bersih-bersih lingkungan dan penanaman pohon.',
        date: '22 Februari 2025',
        time: '06:00 - 10:00',
        location: 'Area RPTRA Bonti',
        category: 'Lingkungan',
        participants: 35,
        maxParticipants: 40,
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        status: 'upcoming'
      },
      {
        id: 4,
        title: 'Kelas Memasak Tradisional',
        description: 'Belajar memasak makanan tradisional Indonesia bersama chef lokal.',
        date: '25 Februari 2025',
        time: '09:00 - 12:00',
        location: 'Dapur Umum RPTRA Bonti',
        category: 'Kuliner',
        participants: 15,
        maxParticipants: 20,
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        status: 'upcoming'
      },
      {
        id: 5,
        title: 'Pameran Seni Anak',
        description: 'Pameran hasil karya seni anak-anak dari berbagai sekolah di sekitar.',
        date: '12 Februari 2025',
        time: '10:00 - 17:00',
        location: 'Galeri RPTRA Bonti',
        category: 'Seni',
        participants: 200,
        maxParticipants: 300,
        image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        status: 'completed'
      },
      {
        id: 6,
        title: 'Turnamen Futsal Remaja',
        description: 'Kompetisi futsal untuk remaja usia 13-18 tahun.',
        date: '20 Februari 2025',
        time: '15:00 - 18:00',
        location: 'Lapangan Futsal RPTRA Bonti',
        category: 'Olahraga',
        participants: 80,
        maxParticipants: 96,
        image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        status: 'ongoing'
      }
    ];
    
    setEvents(sampleEvents);
    setFilteredEvents(sampleEvents);
  }, []);

  // Filter events based on search and category
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

  const categories = ['all', 'Olahraga', 'Edukasi', 'Lingkungan', 'Kuliner', 'Seni'];
  const statuses = [
    { value: 'all', label: 'Semua Status' },
    { value: 'upcoming', label: 'Akan Datang' },
    { value: 'ongoing', label: 'Sedang Berlangsung' },
    { value: 'completed', label: 'Selesai' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Akan Datang';
      case 'ongoing':
        return 'Sedang Berlangsung';
      case 'completed':
        return 'Selesai';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Kegiatan RPTRA Bonti
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
              Bergabunglah dengan berbagai kegiatan menarik dan bermanfaat untuk seluruh keluarga
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari kegiatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Semua Kategori' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {filteredEvents.length} Kegiatan Ditemukan
          </h2>
          <p className="text-gray-600">
            Temukan kegiatan yang sesuai dengan minat Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              {/* Event Image */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {getStatusText(event.status)}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <span className="text-xs font-medium text-gray-700">{event.category}</span>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-green-600" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-green-600" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-green-600" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-green-600" />
                    <span>{event.participants}/{event.maxParticipants} peserta</span>
                  </div>
                </div>

                {/* Participation Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Partisipasi</span>
                    <span>{Math.round((event.participants / event.maxParticipants) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                    event.status === 'completed' 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : event.participants >= event.maxParticipants
                      ? 'bg-orange-100 text-orange-800 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                  disabled={event.status === 'completed' || event.participants >= event.maxParticipants}
                >
                  {event.status === 'completed' 
                    ? 'Kegiatan Selesai'
                    : event.participants >= event.maxParticipants
                    ? 'Penuh'
                    : 'Daftar Sekarang'
                  }
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Tidak ada kegiatan ditemukan
              </h3>
              <p className="text-gray-600 mb-6">
                Coba ubah kata kunci pencarian atau filter yang Anda gunakan
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Reset Filter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Event;