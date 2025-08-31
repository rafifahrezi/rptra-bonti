import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Calendar, Users, TrendingUp, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 1)); // August 2025
  const [viewMode, setViewMode] = useState('month'); // month or list
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Sample data for visitor statistics
  const visitorData = [
    { date: '01 Apr 2024', balita: 4, anak: 28, remaja: 11, dewasa: 11, lansia: 3 },
    { date: '01 Aug 2024', balita: 11, anak: 47, remaja: 23, dewasa: 28, lansia: 5 },
    { date: '01 Dec 2024', balita: 5, anak: 9, remaja: 6, dewasa: 4, lansia: 0 },
    { date: '01 Dec 2024', balita: 5, anak: 28, remaja: 13, dewasa: 15, lansia: 0 },
    { date: '01 Feb 2025', balita: 5, anak: 42, remaja: 42, dewasa: 28, lansia: 6 },
    { date: '01 Jan 2025', balita: 2, anak: 8, remaja: 10, dewasa: 12, lansia: 3 },
    { date: '01 Jul 2024', balita: 6, anak: 62, remaja: 11, dewasa: 34, lansia: 4 },
    { date: '01 Jun 2024', balita: 12, anak: 50, remaja: 24, dewasa: 28, lansia: 3 },
    { date: '01 Jun 2025', balita: 11, anak: 53, remaja: 45, dewasa: 25, lansia: 7 },
    { date: '01 Mar 2024', balita: 10, anak: 35, remaja: 16, dewasa: 35, lansia: 9 },
  ];

  // Statistics cards data
  const stats = [
      { label: 'JUMLAH KUNJUNGAN HARIAN', value: '0', color: 'text-orange-500', icon: Calendar },
      { label: 'JUMLAH KUNJUNGAN MINGGUAN', value: '1641', color: 'text-blue-500', icon: Users },
      { label: 'JUMLAH KUNJUNGAN BULANAN', value: '5005', color: 'text-pink-500', icon: TrendingUp },
      { label: 'JUMLAH KUNJUNGAN TAHUNAN', value: '20919', color: 'text-purple-500', icon: Activity },
  ];

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Previous month's trailing days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isPrevMonth: true
      });
    }
    
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        isPrevMonth: false
      });
    }
    
    // Next month's leading days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        isPrevMonth: false
      });
    }
    
    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const filteredData = visitorData.filter(item =>
    item.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / 10);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin RPTRA Bonti</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Activity Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Kegiatan RPTRA Bonti</h2>
            <p className="text-sm text-gray-500 mt-1">Jadwal Kegiatan RPTRA Bonti</p>
          </div>
          
          <div className="p-6">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Today
                </button>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    viewMode === 'month' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  List
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            {viewMode === 'month' && (
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-700">
                    {day}
                  </div>
                ))}
                {generateCalendarDays().map((dayInfo, index) => (
                  <div
                    key={index}
                    className={`bg-white p-3 min-h-[80px] ${
                      dayInfo.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    <span className="text-sm">{dayInfo.day}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Visitor Data Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Kunjungan RPTRA Bonti</h2>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center text-sm text-gray-600">
                Results: <span className="ml-2 font-semibold">{filteredData.length}</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Tanggal</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Balita</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Anak</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Remaja</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Dewasa</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Lansia</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice((currentPage - 1) * 10, currentPage * 10).map((row, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{row.date}</td>
                      <td className="py-3 px-4 text-center">{row.balita}</td>
                      <td className="py-3 px-4 text-center">{row.anak}</td>
                      <td className="py-3 px-4 text-center">{row.remaja}</td>
                      <td className="py-3 px-4 text-center">{row.dewasa}</td>
                      <td className="py-3 px-4 text-center">{row.lansia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600">
                Showing page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {[1, 2, 3, 4, 5].map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <span className="px-2">...</span>
                <button className="px-3 py-1 hover:bg-gray-100 rounded text-gray-700">
                  51
                </button>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


// ADMIN NIH PANEL NYA //

import { memo, useState, useEffect, useCallback } from 'react';
import {
  Plus, Edit2, Trash2, Save, X, Search, Filter, Calendar, User, Clock, 
  ArrowLeft, ChevronDown, MoreVertical, CheckCircle, AlertCircle, 
  TrendingUp, Users, MapPin, Phone, Mail, FileText, Eye, Download,
  CalendarDays, BarChart3, PieChart, Activity, Target, Zap
} from 'lucide-react';

// Type Definitions
interface VisitData {
  id: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  visitDate: string;
  visitTime: string;
  visitType: 'consultation' | 'therapy' | 'assessment' | 'follow-up' | 'emergency';
  purpose: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
  therapistAssigned: string;
  duration: number; // in minutes
  createdAt: any;
  updatedAt: any;
}

// Toast Component
const Toast = memo(({ message, type = 'success', onClose }: { 
  message: string; 
  type?: 'success' | 'error' | 'warning';
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className={`border rounded-xl p-4 shadow-lg backdrop-blur-sm max-w-sm ${getToastStyles()}`}>
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1">
            <p className="font-medium text-sm">{message}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

// Loading State
const LoadingState = memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
      </div>
      <div className="mt-6 space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">Memuat Analytics</h3>
        <p className="text-gray-500">Menganalisis data kunjungan...</p>
      </div>
    </div>
  </div>
));

// Stats Card
const StatsCard = memo(({ icon: Icon, title, value, description, color, trend }: {
  icon: React.ComponentType<any>;
  title: string;
  value: string | number;
  description: string;
  color: string;
  trend?: { value: string; isPositive: boolean };
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${
          trend.isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendingUp className={`w-3 h-3 ${trend.isPositive ? '' : 'rotate-180'}`} />
          {trend.value}
        </div>
      )}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </div>
));

// Calendar Component
const CalendarView = memo(({ visits, onDateClick }: {
  visits: VisitData[];
  onDateClick: (date: string) => void;
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getVisitsForDate = (day: number) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return visits.filter(visit => visit.visitDate === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Kalender Kunjungan</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronDown className="w-4 h-4 rotate-90" />
          </button>
          <h4 className="text-lg font-medium text-gray-700 min-w-[140px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h4>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {dayNames.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {days.map((day, index) => {
          const visitsForDay = getVisitsForDate(day || 0);
          const isToday = day && 
            new Date().getDate() === day && 
            new Date().getMonth() === currentDate.getMonth() && 
            new Date().getFullYear() === currentDate.getFullYear();
          
          return (
            <div
              key={index}
              className={`min-h-[80px] p-2 border border-gray-100 ${
                day ? 'cursor-pointer hover:bg-gray-50' : 'bg-gray-50'
              } ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
              onClick={() => day && onDateClick(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
            >
              {day && (
                <>
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                    {day}
                  </div>
                  {visitsForDay.length > 0 && (
                    <div className="space-y-1">
                      {visitsForDay.slice(0, 2).map((visit, i) => (
                        <div
                          key={i}
                          className={`text-xs p-1 rounded text-white text-center ${
                            visit.status === 'completed' ? 'bg-green-500' :
                            visit.status === 'scheduled' ? 'bg-blue-500' :
                            visit.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'
                          }`}
                        >
                          {visit.visitTime}
                        </div>
                      ))}
                      {visitsForDay.length > 2 && (
                        <div className="text-xs text-center text-gray-500">
                          +{visitsForDay.length - 2} lainnya
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

// Visit Form Modal
const VisitForm = memo(({
  visitForm,
  setVisitForm,
  onSave,
  onCancel,
  saving,
  isEditing,
}: {
  visitForm: VisitData;
  setVisitForm: (form: Partial<VisitData>) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  isEditing: boolean;
}) => {
  const visitTypes = [
    { value: 'consultation', label: 'Konsultasi', color: 'bg-blue-100 text-blue-800' },
    { value: 'therapy', label: 'Terapi', color: 'bg-green-100 text-green-800' },
    { value: 'assessment', label: 'Asesmen', color: 'bg-purple-100 text-purple-800' },
    { value: 'follow-up', label: 'Follow-up', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'emergency', label: 'Darurat', color: 'bg-red-100 text-red-800' },
  ];

  const therapists = ['Dr. Sarah', 'Dr. Ahmad', 'Dr. Lisa', 'Dr. Budi', 'Dr. Maya'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {isEditing ? 'Edit Data Kunjungan' : 'Tambah Kunjungan Baru'}
              </h2>
              <p className="text-blue-100">Kelola jadwal dan data kunjungan pasien</p>
            </div>
            <button 
              onClick={onCancel} 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Visitor Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Informasi Pengunjung
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
                <input
                  type="text"
                  value={visitForm.visitorName}
                  onChange={(e) => setVisitForm({ visitorName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={visitForm.visitorEmail}
                  onChange={(e) => setVisitForm({ visitorEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                <input
                  type="tel"
                  value={visitForm.visitorPhone}
                  onChange={(e) => setVisitForm({ visitorPhone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Terapis yang Ditugaskan</label>
                <select
                  value={visitForm.therapistAssigned}
                  onChange={(e) => setVisitForm({ therapistAssigned: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Terapis</option>
                  {therapists.map(therapist => (
                    <option key={therapist} value={therapist}>{therapist}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Visit Schedule */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Jadwal Kunjungan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Kunjungan *</label>
                <input
                  type="date"
                  value={visitForm.visitDate}
                  onChange={(e) => setVisitForm({ visitDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Kunjungan *</label>
                <input
                  type="time"
                  value={visitForm.visitTime}
                  onChange={(e) => setVisitForm({ visitTime: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durasi (menit)</label>
                <input
                  type="number"
                  value={visitForm.duration}
                  onChange={(e) => setVisitForm({ duration: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="60"
                  min="15"
                  max="240"
                />
              </div>
            </div>
          </div>

          {/* Visit Details */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Detail Kunjungan
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kunjungan *</label>
                  <select
                    value={visitForm.visitType}
                    onChange={(e) => setVisitForm({ visitType: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Pilih Jenis Kunjungan</option>
                    {visitTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={visitForm.status}
                    onChange={(e) => setVisitForm({ status: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="scheduled">Terjadwal</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                    <option value="no-show">Tidak Hadir</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tujuan Kunjungan *</label>
                <input
                  type="text"
                  value={visitForm.purpose}
                  onChange={(e) => setVisitForm({ purpose: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Deskripsi singkat tujuan kunjungan"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
                <textarea
                  value={visitForm.notes}
                  onChange={(e) => setVisitForm({ notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Catatan tambahan atau informasi penting"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            disabled={saving || !visitForm.visitorName.trim() || !visitForm.visitDate || !visitForm.visitTime}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Menyimpan...' : (isEditing ? 'Update Data' : 'Simpan Data')}
          </button>
        </div>
      </div>
    </div>
  );
});

// Visit Card with Professional Edit/Delete
const VisitCard = memo(({ 
  visit, 
  onEdit, 
  onDelete, 
  formatDateTime 
}: {
  visit: VisitData;
  onEdit: (visit: VisitData) => void;
  onDelete: (id: string) => void;
  formatDateTime: (date: string, time: string) => string;
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'no-show': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-800';
      case 'therapy': return 'bg-green-100 text-green-800';
      case 'assessment': return 'bg-purple-100 text-purple-800';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(visit.status)}`}>
                {visit.status === 'completed' && 'Selesai'}
                {visit.status === 'scheduled' && 'Terjadwal'}
                {visit.status === 'cancelled' && 'Dibatalkan'}
                {visit.status === 'no-show' && 'Tidak Hadir'}
              </span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getTypeColor(visit.visitType)}`}>
                {visit.visitType === 'consultation' && 'Konsultasi'}
                {visit.visitType === 'therapy' && 'Terapi'}
                {visit.visitType === 'assessment' && 'Asesmen'}
                {visit.visitType === 'follow-up' && 'Follow-up'}
                {visit.visitType === 'emergency' && 'Darurat'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{visit.visitorName}</h3>
            <p className="text-gray-600 text-sm mb-2">{visit.purpose}</p>
          </div>
          
          {/* Enhanced Action Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20 min-w-[160px]">
                <button
                  onClick={() => {
                    onEdit(visit);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Data
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${visit.visitorName} - ${formatDateTime(visit.visitDate, visit.visitTime)}`);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Salin Info
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => {
                    onDelete(visit.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus Data
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Visit Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{formatDateTime(visit.visitDate, visit.visitTime)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{visit.duration} menit</span>
          </div>
          {visit.visitorPhone && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{visit.visitorPhone}</span>
            </div>
          )}
          {visit.visitorEmail && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{visit.visitorEmail}</span>
            </div>
          )}
        </div>

        {/* Therapist & Notes */}
        {(visit.therapistAssigned || visit.notes) && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            {visit.therapistAssigned && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  <span className="font-medium">Terapis:</span> {visit.therapistAssigned}
                </span>
              </div>
            )}
            {visit.notes && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Catatan:</p>
                <p className="text-sm text-gray-700 line-clamp-2">{visit.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

// Enhanced Filter Section
const FilterSection = memo(({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  dateRange,
  setDateRange,
  filteredCount,
  totalCount,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
  filteredCount: number;
  totalCount: number;
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-800">Filter & Pencarian</h3>
      <div className="text-sm text-gray-600">
        <span className="font-medium">{filteredCount}</span> dari {totalCount} data
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Search */}
      <div className="lg:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Cari Data</label>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Nama, email, atau tujuan kunjungan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Semua Status</option>
          <option value="scheduled">Terjadwal</option>
          <option value="completed">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
          <option value="no-show">Tidak Hadir</option>
        </select>
      </div>

      {/* Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Jenis</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Semua Jenis</option>
          <option value="consultation">Konsultasi</option>
          <option value="therapy">Terapi</option>
          <option value="assessment">Asesmen</option>
          <option value="follow-up">Follow-up</option>
          <option value="emergency">Darurat</option>
        </select>
      </div>
    </div>

    {/* Date Range */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    {/* Clear Filters */}
    {(searchTerm || filterStatus !== 'all' || filterType !== 'all' || dateRange.start || dateRange.end) && (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => {
            setSearchTerm('');
            setFilterStatus('all');
            setFilterType('all');
            setDateRange({ start: '', end: '' });
          }}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Hapus Semua Filter
        </button>
      </div>
    )}
  </div>
));

// Main AnalyticsManagement Component
const AnalyticsManagement = () => {
  // State Management
  const [visitsList, setVisitsList] = useState<VisitData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<VisitData | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Form State
  const [visitForm, setVisitForm] = useState<VisitData>({
    id: '',
    visitorName: '',
    visitorEmail: '',
    visitorPhone: '',
    visitDate: '',
    visitTime: '',
    visitType: 'consultation',
    purpose: '',
    status: 'scheduled',
    notes: '',
    therapistAssigned: '',
    duration: 60,
    createdAt: null,
    updatedAt: null,
  });

  // Mock Data (Replace with Firebase operations)
  const mockVisits: VisitData[] = [
    {
      id: '1',
      visitorName: 'Ahmad Fauzi',
      visitorEmail: 'ahmad@email.com',
      visitorPhone: '081234567890',
      visitDate: '2025-09-15',
      visitTime: '09:00',
      visitType: 'consultation',
      purpose: 'Konsultasi awal untuk anak dengan keterlambatan bicara',
      status: 'scheduled',
      notes: 'Anak usia 3 tahun, rujukan dari dokter anak',
      therapistAssigned: 'Dr. Sarah',
      duration: 60,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      visitorName: 'Maria Sari',
      visitorEmail: 'maria@email.com',
      visitorPhone: '081234567891',
      visitDate: '2025-09-15',
      visitTime: '10:30',
      visitType: 'therapy',
      purpose: 'Sesi terapi okupasi rutin',
      status: 'completed',
      notes: 'Progress bagus, lanjutkan program terapi',
      therapistAssigned: 'Dr. Ahmad',
      duration: 90,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      visitorName: 'Budi Santoso',
      visitorEmail: 'budi@email.com',
      visitorPhone: '081234567892',
      visitDate: '2025-09-16',
      visitTime: '14:00',
      visitType: 'assessment',
      purpose: 'Asesmen perkembangan anak',
      status: 'scheduled',
      notes: 'Perlu persiapan alat tes khusus',
      therapistAssigned: 'Dr. Lisa',
      duration: 120,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Load data
  const loadVisitsData = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVisitsList(mockVisits);
      setToastMessage({ message: 'Data kunjungan berhasil dimuat!', type: 'success' });
    } catch (error) {
      console.error('Error loading visits:', error);
      setToastMessage({ message: 'Gagal memuat data kunjungan.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVisitsData();
  }, [loadVisitsData]);

  // Calculate Stats
  const stats = {
    total: visitsList.length,
    scheduled: visitsList.filter(v => v.status === 'scheduled').length,
    completed: visitsList.filter(v => v.status === 'completed').length,
    cancelled: visitsList.filter(v => v.status === 'cancelled').length + visitsList.filter(v => v.status === 'no-show').length,
  };

  // Filter visits
  const filteredVisits = visitsList.filter(visit => {
    const matchesSearch = 
      visit.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.visitorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || visit.status === filterStatus;
    const matchesType = filterType === 'all' || visit.visitType === filterType;
    
    const matchesDateRange = (!dateRange.start || visit.visitDate >= dateRange.start) &&
                            (!dateRange.end || visit.visitDate <= dateRange.end);
    
    return matchesSearch && matchesStatus && matchesType && matchesDateRange;
  });

  // Form handlers
  const resetForm = useCallback(() => {
    setVisitForm({
      id: '',
      visitorName: '',
      visitorEmail: '',
      visitorPhone: '',
      visitDate: '',
      visitTime: '',
      visitType: 'consultation',
      purpose: '',
      status: 'scheduled',
      notes: '',
      therapistAssigned: '',
      duration: 60,
      createdAt: null,
      updatedAt: null,
    });
    setEditingVisit(null);
  }, []);

  const openModal = useCallback((visit?: VisitData) => {
    if (visit) {
      setVisitForm(visit);
      setEditingVisit(visit);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  }, [resetForm]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    resetForm();
  }, [resetForm]);

  const handleSave = useCallback(async () => {
    if (!visitForm.visitorName.trim() || !visitForm.visitDate || !visitForm.visitTime) {
      setToastMessage({ message: 'Mohon lengkapi data yang wajib diisi!', type: 'warning' });
      return;
    }

    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingVisit) {
        // Update existing visit
        setVisitsList(prev => prev.map(v => v.id === editingVisit.id ? { ...visitForm, updatedAt: new Date() } : v));
        setToastMessage({ message: 'Data kunjungan berhasil diperbarui!', type: 'success' });
      } else {
        // Add new visit
        const newVisit = { ...visitForm, id: Date.now().toString(), createdAt: new Date(), updatedAt: new Date() };
        setVisitsList(prev => [newVisit, ...prev]);
        setToastMessage({ message: 'Data kunjungan berhasil ditambahkan!', type: 'success' });
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving visit:', error);
      setToastMessage({ message: 'Gagal menyimpan data kunjungan.', type: 'error' });
    } finally {
      setSaving(false);
    }
  }, [visitForm, editingVisit, closeModal]);

  const handleDelete = useCallback(async (visitId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data kunjungan ini?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setVisitsList(prev => prev.filter(v => v.id !== visitId));
        setToastMessage({ message: 'Data kunjungan berhasil dihapus!', type: 'success' });
      } catch (error) {
        console.error('Error deleting visit:', error);
        setToastMessage({ message: 'Gagal menghapus data kunjungan.', type: 'error' });
      }
    }
  }, []);

  const formatDateTime = useCallback((date: string, time: string): string => {
    try {
      const dateObj = new Date(`${date}T${time}`);
      return dateObj.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return `${date} ${time}`;
    }
  }, []);

  const handleCalendarDateClick = useCallback((date: string) => {
    setDateRange({ start: date, end: date });
    setView('list');
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-blue-600 font-medium">Analytics & Kunjungan</span>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex items-center gap-4">
                  <button className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Dashboard
                  </button>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Analytics & Manajemen Kunjungan</h1>
                    <p className="text-blue-100">Monitor dan kelola data kunjungan pasien RPTR</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setView(view === 'list' ? 'calendar' : 'list')}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 backdrop-blur-sm"
                  >
                    {view === 'list' ? <Calendar className="w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
                    {view === 'list' ? 'Tampilan Kalender' : 'Tampilan List'}
                  </button>
                  <button
                    onClick={() => openModal()}
                    className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Kunjungan
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                icon={Users}
                title="Total Kunjungan"
                value={stats.total}
                description="Semua data kunjungan"
                color="bg-blue-500"
                trend={{ value: '+12%', isPositive: true }}
              />
              <StatsCard
                icon={Calendar}
                title="Terjadwal"
                value={stats.scheduled}
                description="Jadwal mendatang"
                color="bg-green-500"
                trend={{ value: '+8%', isPositive: true }}
              />
              <StatsCard
                icon={CheckCircle}
                title="Selesai"
                value={stats.completed}
                description="Kunjungan selesai"
                color="bg-purple-500"
                trend={{ value: '+15%', isPositive: true }}
              />
              <StatsCard
                icon={AlertCircle}
                title="Dibatalkan"
                value={stats.cancelled}
                description="Tidak hadir/batal"
                color="bg-red-500"
                trend={{ value: '-5%', isPositive: true }}
              />
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <FilterSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterType={filterType}
          setFilterType={setFilterType}
          dateRange={dateRange}
          setDateRange={setDateRange}
          filteredCount={filteredVisits.length}
          totalCount={visitsList.length}
        />

        {/* Main Content */}
        {view === 'calendar' ? (
          <CalendarView 
            visits={filteredVisits} 
            onDateClick={handleCalendarDateClick}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* List Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Data Kunjungan</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Menampilkan {filteredVisits.length} dari {visitsList.length} total kunjungan
                </p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button 
                  onClick={loadVisitsData}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Activity className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Visits List */}
            <div className="divide-y divide-gray-100">
              {filteredVisits.length > 0 ? (
                filteredVisits.map((visit) => (
                  <div key={visit.id} className="p-6">
                    <VisitCard
                      visit={visit}
                      onEdit={openModal}
                      onDelete={handleDelete}
                      formatDateTime={formatDateTime}
                    />
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Data Kunjungan</h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm || filterStatus !== 'all' || filterType !== 'all' 
                      ? 'Tidak ada data yang sesuai dengan filter yang dipilih'
                      : 'Mulai tambahkan data kunjungan pertama Anda'
                    }
                  </p>
                  <button
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Kunjungan Baru
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Visit Form Modal */}
        {isModalOpen && (
          <VisitForm
            visitForm={visitForm}
            setVisitForm={(updates) => setVisitForm(prev => ({ ...prev, ...updates }))}
            onSave={handleSave}
            onCancel={closeModal}
            saving={saving}
            isEditing={!!editingVisit}
          />
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <Toast 
            message={toastMessage.message} 
            type={toastMessage.type}
            onClose={() => setToastMessage(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default AnalyticsManagement;