import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Image, 
  BarChart3, 
  Shield,
  Clock,
  ArrowRight,
  Check,
  X
} from 'lucide-react';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Timestamp } from 'firebase/firestore';

// Interfaces
interface DashboardItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'purple' | 'orange' | 'pink' | 'green' | 'gray';
  href: string;
  features: string[];
}

interface OperasionalStatus {
  status: boolean;
  updatedAt: Timestamp | null;
  updatedBy: string;
}

interface QuickStat {
  label: string;
  value: string;
  change: string;
  color: string;
}


// Reusable components
const DashboardCard: React.FC<{ item: DashboardItem }> = ({ item }) => {
  const IconComponent = item.icon;
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 border-blue-200',
    purple: 'bg-purple-100 text-purple-600 border-purple-200',
    orange: 'bg-orange-100 text-orange-600 border-orange-200',
    pink: 'bg-pink-100 text-pink-600 border-pink-200',
    green: 'bg-green-100 text-green-600 border-green-200',
    gray: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  return (
    <Link
      to={item.href}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 group border border-gray-100 hover:border-green-200"
    >
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[item.color]} mb-4 group-hover:scale-110 transition-transform`}>
        <IconComponent className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
        {item.title}
      </h3>
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{item.description}</p>
      <ul className="text-xs text-gray-500 space-y-1 mb-4">
        {item.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></div>
            {feature}
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center text-green-600 hover:text-green-800 font-medium text-sm transition-colors group-hover:gap-2">
          Kelola
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </span>
        {item.href === '/admin/users' && (
          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
            Prioritas
          </span>
        )}
      </div>
    </Link>
  );
};

const QuickStatCard: React.FC<{ stat: QuickStat }> = ({ stat }) => (
  <div className="text-center p-4 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
    <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
    <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
    <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full inline-block">
      {stat.change}
    </div>
  </div>
);

const StatusToggle: React.FC<{ status: boolean; onToggle: () => void; loading: boolean }> = ({ status, onToggle, loading }) => (
  <button
    onClick={onToggle}
    disabled={loading}
    className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
      status ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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

// MAIN
const AdminDashboard: React.FC = () => {
  const { currentUser, adminData, signOut, loading: authLoading } = useAuth();
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [operasional, setOperasional] = useState<OperasionalStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setStatusLoading(true);
        const ref = doc(db, 'operasional', 'current');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setOperasional(snap.data() as OperasionalStatus);
        } else {
          // jika doc belum ada, buat default
          await setDoc(ref, {
            status: true,
            updatedAt: serverTimestamp(),
            updatedBy: currentUser?.email || 'system',
          });
          setOperasional({
            status: true,
            updatedAt: null,
            updatedBy: currentUser?.email || 'system',
          });
        }
      } catch (err) {
        console.error('Error fetching status:', err);
        setError('Gagal memuat status operasional');
      } finally {
        setStatusLoading(false);
      }
    };
    if (!authLoading) fetchStatus();
  }, [authLoading, currentUser?.email]);

  // Toggle status
  const handleToggleStatus = async () => {
    if (!operasional || updateLoading) return;

    setUpdateLoading(true);
    try {
      const ref = doc(db, 'operasional', 'current');
      const newStatus = !operasional.status;
      await updateDoc(ref, {
        status: newStatus,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser?.email || 'system',
      });     
      
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Gagal memperbarui status');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSignOut = async () => {
    setSignOutLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setSignOutLoading(false);
    }
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return 'Tidak ada data';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return 'Format tanggal tidak valid';
    }
  };

  const dashboardItems: DashboardItem[] = [
    {
      title: 'Tentang Kami',
      description: 'Kelola halaman About',
      icon: Shield,
      color: 'purple',
      href: '/admin/about',
      features: ['Edit Hero Section', 'Tambah Program', 'Hapus Program'],
    },
    {
      title: 'Manajemen Admin',
      description: 'Kelola pengguna sistem dan izin akses',
      icon: Users,
      color: 'blue',
      href: '/admin/users',
      features: ['Tambah/Edit Pengguna', 'Atur Role & Permission', 'Monitor Aktivitas'],
    },
    {
      title: 'Kegiatan',
      description: 'Tambah dan edit kegiatan',
      icon: Calendar,
      color: 'orange',
      href: '/admin/events',
      features: ['Tambah Kegiatan', 'Publikasi Kegiatan', 'Jadwal Event'],
    },
    {
      title: 'Galeri',
      description: 'Upload dan kelola foto galeri',
      icon: Image,
      color: 'pink',
      href: '/admin/gallery',
      features: ['Upload Foto', 'Organisir Album', 'Optimasi Gambar'],
    },
    {
      title: 'Analitik',
      description: 'Lihat statistik dan laporan website',
      icon: BarChart3,
      color: 'green',
      href: '/admin/analytics',
      features: ['Traffic Report', 'User Analytics', 'Performance Stats'],
    },    
  ];

  const quickStats: QuickStat[] = [
    { label: 'Total Pengunjung', value: '1,234', change: '+12%', color: 'text-blue-600' },
    { label: 'Kegiatan Aktif', value: '8', change: '+2', color: 'text-green-600' },
    { label: 'Berita Terbaru', value: '15', change: '+3', color: 'text-orange-600' },
    { label: 'Foto Galeri', value: '156', change: '+24', color: 'text-pink-600' },
  ];

  if (authLoading || statusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Memuat dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Dashboard Admin RPTRA Kebon Melati
              </h1>
              <p className="text-gray-600">Selamat datang kembali! Kelola sistem RPTRA dengan mudah.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/" className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg">
                Ke Beranda
              </Link>
              <button
                onClick={handleSignOut}
                disabled={signOutLoading}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50"
              >
                {signOutLoading ? 'Keluar...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>

        {/* Admin Info Card + Status */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm p-6 mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <Shield className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1">Status Admin Aktif</h2>
              <p className="text-green-100 mb-2">
                Masuk sebagai:{' '}
                <span className="font-mono bg-white bg-opacity-20 px-2 py-1 rounded">
                  {currentUser?.email || 'Tidak ada email'}
                </span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-green-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Login terakhir: {formatDate(adminData?.lastLogin)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Role: {adminData?.role || 'admin'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operasional Status */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" /> Status Operasional RPTRA
            </h3>
            {error && (
              <div className="bg-red-100 border border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">
                {error}
              </div>
            )}
            <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm">
                  Status saat ini:{' '}
                  <span className={operasional?.status ? 'text-green-100' : 'text-red-100'}>
                    {operasional?.status ? 'Buka' : 'Tutup'}
                  </span>
                </p>
                {operasional?.updatedAt && (
                  <p className="text-xs text-green-100 mt-1">
                    Terakhir diperbarui: {formatDate(operasional.updatedAt)} oleh {operasional.updatedBy}
                  </p>
                )}
              </div>
              <StatusToggle
                status={operasional?.status || false}
                onToggle={handleToggleStatus}
                loading={updateLoading}
              />
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item) => (
            <DashboardCard key={item.title} item={item} />
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Statistik Cepat</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <QuickStatCard key={index} stat={stat} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
