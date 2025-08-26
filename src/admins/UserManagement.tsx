import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserPlus,
  AlertCircle,
  Save,
  X
} from 'lucide-react';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp type

interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'superadmin';
  isActive: boolean;
  createdAt: Timestamp;
  lastLogin: Timestamp | null;
  createdBy?: string;
  uid?: string;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'superadmin';
}

interface FormErrors {
  email: string;
  password: string;
  confirmPassword: string;
}

const UserManagement: React.FC = () => {
  const { currentUser, adminData } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin'
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Check if current user has permission
  const isSuperAdmin = adminData?.role === 'superadmin';
  const canViewAdmins = adminData?.role === 'superadmin' || adminData?.role === 'admin';

  useEffect(() => {
    if (canViewAdmins) {
      fetchAdmins();
    }
  }, [canViewAdmins]);

  // Fetch all admins from Firestore
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'admins'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const adminsList: AdminUser[] = [];
      querySnapshot.forEach((doc) => {
        adminsList.push({ id: doc.id, ...doc.data() } as AdminUser);
      });

      setAdmins(adminsList);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setError('Gagal memuat data admin');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    let isValid = true;
    const errors: FormErrors = {
      email: '',
      password: '',
      confirmPassword: ''
    };

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email tidak boleh kosong';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format email tidak valid';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password tidak boleh kosong';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password minimal 6 karakter';
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Konfirmasi password tidak boleh kosong';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Password tidak sama';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Create new admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSuperAdmin) {
      setError('Hanya Super Admin yang dapat membuat admin baru');
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Check if email already exists in admins collection
      const q = query(collection(db, 'admins'), where('email', '==', formData.email.toLowerCase().trim()));
      const existingAdmins = await getDocs(q);

      if (!existingAdmins.empty) {
        setError('Email sudah terdaftar sebagai admin');
        setSubmitting(false);
        return;
      }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );

      // Add admin data to Firestore
      const adminData = {
        email: formData.email.toLowerCase().trim(),
        role: formData.role,
        isActive: true,
        createdAt: serverTimestamp(),
        lastLogin: null,
        createdBy: currentUser?.email || 'system',
        uid: userCredential.user.uid
      };

      await addDoc(collection(db, 'admins'), adminData);

      // Reset form and refresh data
      resetForm();
      setSuccess('Admin baru berhasil dibuat!');
      await fetchAdmins();

    } catch (error: any) {
      console.error('Error creating admin:', error);

      let errorMessage = 'Gagal membuat admin baru';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email sudah terdaftar di sistem autentikasi';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password terlalu lemah';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Format email tidak valid';
          break;
        default:
          errorMessage = `Gagal membuat admin: ${error.message}`;
      }

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      role: 'admin'
    });
    setFormErrors({
      email: '',
      password: '',
      confirmPassword: ''
    });
    setShowForm(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // Update admin
  const handleUpdateAdmin = async (admin: AdminUser) => {
    if (!isSuperAdmin) {
      setError('Hanya Super Admin yang dapat membuat admin baru');
      return;
    }
    try {
      const adminRef = doc(db, 'admins', admin.id);
      await updateDoc(adminRef, {
        role: admin.role,
        isActive: admin.isActive,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser?.email || 'system'
      });

      setEditingAdmin(null);
      setSuccess(`Admin ${admin.email} berhasil diperbarui`);
      await fetchAdmins();
    } catch (error) {
      console.error('Error updating admin:', error);
      setError('Gagal memperbarui data admin');
    }
  };

  // Delete admin
  const handleDeleteAdmin = async (adminId: string) => {
    try {
      await deleteDoc(doc(db, 'admins', adminId));
      setShowDeleteConfirm(null);
      setSuccess('Admin berhasil dihapus');
      await fetchAdmins();
    } catch (error) {
      console.error('Error deleting admin:', error);
      setError('Gagal menghapus admin');
    }
  };

  // Format date
  const formatDate = (timestamp: Timestamp | null): string => {
    if (!timestamp) return 'Belum ada data';

    try {
      const date = timestamp.toDate();
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(date);
    } catch (error) {
      return 'Format tidak valid';
    }
  };

  // Filter admins
  const filteredAdmins = admins.filter(admin =>
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
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
                  Manajemen Pengguna Admin
                </h1>
                <p className="text-gray-600">
                  Kelola akun admin dan pengaturan akses sistem
                </p>
              </div>
            </div>
            {/* Add Button - Only for SuperAdmin */}
            {isSuperAdmin && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Tambah Admin
              </button>
            )}
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 flex-1">{error}</span>
            <button
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-green-700 flex-1">{success}</span>
            <button
              onClick={() => setSuccess('')}
              className="text-green-500 hover:text-green-700 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Add Admin Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Tambah Admin Baru
            </h2>

            <form onSubmit={handleCreateAdmin} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email Field */}
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Admin <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${formErrors.email
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                        }`}
                      placeholder="admin@example.com"
                      disabled={submitting}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${formErrors.password
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                        }`}
                      placeholder="Minimal 6 karakter"
                      disabled={submitting}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${formErrors.confirmPassword
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                        }`}
                      placeholder="Ulangi password"
                      disabled={submitting}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Role Field */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    disabled={submitting}
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Membuat Admin...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Buat Admin
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="inline-flex items-center px-6 py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
                >
                  <X className="w-4 h-4 mr-2" />
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Cari berdasarkan email atau role..."
            />
          </div>
        </div>

        {/* Admin List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Daftar Admin ({filteredAdmins.length})
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat data admin...</p>
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm ? 'Tidak ada admin yang sesuai dengan pencarian' : 'Belum ada data admin'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dibuat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Login Terakhir
                    </th>
                    {isSuperAdmin && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-green-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {admin.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {admin.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingAdmin?.id === admin.id ? (
                          <select
                            value={editingAdmin.role}
                            onChange={(e) => setEditingAdmin({
                              ...editingAdmin,
                              role: e.target.value as 'admin' | 'superadmin'
                            })}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="admin">Admin</option>
                            <option value="superadmin">Super Admin</option>
                          </select>
                        ) : (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${admin.role === 'superadmin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                            }`}>
                            {admin.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingAdmin?.id === admin.id ? (
                          <select
                            value={editingAdmin.isActive ? 'active' : 'inactive'}
                            onChange={(e) => setEditingAdmin({
                              ...editingAdmin,
                              isActive: e.target.value === 'active'
                            })}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="active">Aktif</option>
                            <option value="inactive">Nonaktif</option>
                          </select>
                        ) : (
                          <div className="flex items-center">
                            {admin.isActive ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500 mr-2" />
                            )}
                            <span className={`text-sm ${admin.isActive ? 'text-green-700' : 'text-red-700'}`}>
                              {admin.isActive ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(admin.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(admin.lastLogin)}
                      </td>
                      {isSuperAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {editingAdmin?.id === admin.id ? (
                              <>
                                <button
                                  onClick={() => handleUpdateAdmin(editingAdmin)}
                                  className="p-2 rounded-full text-green-600 hover:bg-green-100 transition-colors"
                                  title="Simpan perubahan"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingAdmin(null)}
                                  className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                                  title="Batalkan edit"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => setEditingAdmin(admin)}
                                  className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                                  title="Edit admin"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(admin.id)}
                                  className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                                  title="Hapus admin"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Konfirmasi Hapus</h3>
                  <p className="text-sm text-gray-600">Tindakan ini tidak dapat dibatalkan</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700">
                  Apakah Anda yakin ingin menghapus admin ini? Semua data yang terkait akan hilang.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDeleteAdmin(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Hapus Admin
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;