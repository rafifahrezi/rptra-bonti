import React, { useState, useEffect } from 'react';
import { Save, Edit2, Upload, Plus, X } from 'lucide-react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getOrInitDoc } from "../utils/firestoreHelpers";


const defaultAboutData = {
  title: "About RPTRA Bonti",
  subtitle: "Ruang Publik Terpadu Ramah Anak yang berkomitmen menciptakan lingkungan aman dan mendukung perkembangan anak di Jakarta Pusat",
  mission: { title: "Misi Kami", description: "Menyediakan ruang aman ...", image: "" },
  vision: { title: "Visi", description: "Menjadi ruang publik terdepan ..." },
  values: { title: "Nilai-Nilai", description: "Keamanan, Pendidikan, ..." },
  programs: {
    title: "Program Kami",
    description: "Beragam program yang mendukung perkembangan anak ...",
    items: [
      { name: "Program Pendidikan Anak", description: "Kegiatan belajar ..." },
      { name: "Program Kesehatan Masyarakat", description: "Edukasi kesehatan ..." }
    ]
  },
  facilities: {
    title: "Fasilitas",
    description: "Fasilitas lengkap ...",
    items: [
      { name: "Ruang Bermain Anak", description: "Area bermain ..." },
      { name: "Perpustakaan Mini", description: "Koleksi buku ..." }
    ]
  },
  collaborations: {
    title: "Kemitraan",
    description: "Bekerjasama dengan berbagai pihak ...",
    partners: [
      { name: "Dinas Sosial DKI Jakarta", role: "Pembina dan Pengawas" },
      { name: "Puskesmas Setempat", role: "Partner Kesehatan" }
    ]
  },
  operational: {
    title: "Jam Operasional",
    hours: {
      senin: "06:00 - 13:00",
      selasa: "06:00 - 12:00",
      rabu: "06:00 - 12:00",
      kamis: "06:00 - 12:00",
      jumat: "06:00 - 13:00",
      sabtu: "08:00 - 14:00",
      minggu: "08:00 - 14:00"
    }
  },
  establishedYear: "2017",
  establishedText: "Berdiri Sejak",
  lastUpdated: new Date().toISOString()
};

const AboutAdmin = () => {

  const [aboutData, setAboutData] = useState(defaultAboutData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [missionImagePreview, setMissionImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getOrInitDoc("about", "main", defaultAboutData);
      setAboutData(data);
      setMissionImagePreview(data.mission?.image || "data:,");
    } catch (error) {
      console.error("Error loading about data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Memuat data saat komponen dimuat
  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSave = {
        ...aboutData,
        lastUpdated: new Date().toISOString()
      };

      const docRef = doc(db, 'about', 'main');
      await setDoc(docRef, dataToSave);

      alert('Data berhasil disimpan!');
    } catch (error) {
    } finally {
      setSaving(false);
    }
  };

  // image upload
  const handleMissionImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadingImage(true);
      try {
        // Temporarily using a placeholder - you can integrate with Firebase Storage later
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target.result;
          setMissionImagePreview(imageUrl);
          setAboutData(prev => ({
            ...prev,
            mission: {
              ...prev.mission,
              image: imageUrl
            }
          }));
        };
        reader.readAsDataURL(file);

        alert('Gambar berhasil diupload!');
      } catch (error) {
      } finally {
        setUploadingImage(false);
      }
    }
  };

  // Helper functions for dynamic arrays
  const addProgramItem = () => {
    setAboutData(prev => ({
      ...prev,
      programs: {
        ...prev.programs,
        items: [...prev.programs.items, { name: "", description: "" }]
      }
    }));
  };

  const removeProgramItem = (index) => {
    setAboutData(prev => ({
      ...prev,
      programs: {
        ...prev.programs,
        items: prev.programs.items.filter((_, i) => i !== index)
      }
    }));
  };

  const updateProgramItem = (index, field, value) => {
    setAboutData(prev => ({
      ...prev,
      programs: {
        ...prev.programs,
        items: prev.programs.items.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addFacilityItem = () => {
    setAboutData(prev => ({
      ...prev,
      facilities: {
        ...prev.facilities,
        items: [...prev.facilities.items, { name: "", description: "" }]
      }
    }));
  };

  const removeFacilityItem = (index) => {
    setAboutData(prev => ({
      ...prev,
      facilities: {
        ...prev.facilities,
        items: prev.facilities.items.filter((_, i) => i !== index)
      }
    }));
  };

  const updateFacilityItem = (index, field, value) => {
    setAboutData(prev => ({
      ...prev,
      facilities: {
        ...prev.facilities,
        items: prev.facilities.items.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addPartner = () => {
    setAboutData(prev => ({
      ...prev,
      collaborations: {
        ...prev.collaborations,
        partners: [...prev.collaborations.partners, { name: "", role: "" }]
      }
    }));
  };

  const removePartner = (index) => {
    setAboutData(prev => ({
      ...prev,
      collaborations: {
        ...prev.collaborations,
        partners: prev.collaborations.partners.filter((_, i) => i !== index)
      }
    }));
  };

  const updatePartner = (index, field, value) => {
    setAboutData(prev => ({
      ...prev,
      collaborations: {
        ...prev.collaborations,
        partners: prev.collaborations.partners.map((partner, i) =>
          i === index ? { ...partner, [field]: value } : partner
        )
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kelola Halaman About</h1>
              <p className="text-sm text-gray-600 mt-1">Edit informasi tentang RPTRA Bonti</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Section 1: Hero Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Edit2 className="w-5 h-5" />
              1. Hero Section
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Utama
                </label>
                <input
                  type="text"
                  value={aboutData.title}
                  onChange={(e) => setAboutData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Masukkan judul utama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle/Deskripsi
                </label>
                <textarea
                  value={aboutData.subtitle}
                  onChange={(e) => setAboutData(prev => ({ ...prev, subtitle: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Masukkan deskripsi singkat tentang RPTRA"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Mission Section with Image Upload */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">2. Misi</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Misi
                </label>
                <input
                  type="text"
                  value={aboutData.mission.title}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    mission: { ...prev.mission, title: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Contoh: Misi Kami"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Misi
                </label>
                <textarea
                  value={aboutData.mission.description}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    mission: { ...prev.mission, description: e.target.value }
                  }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Masukkan deskripsi misi RPTRA"
                />
              </div>

              {/* Mission Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gambar Mission
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMissionImageUpload}
                    className="hidden"
                    id="mission-image-upload"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="mission-image-upload"
                    className={`cursor-pointer flex flex-col items-center gap-2 ${uploadingImage ? 'opacity-50' : ''}`}
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {uploadingImage ? 'Mengupload...' : 'Upload gambar mission'}
                    </span>
                  </label>
                </div>

                {missionImagePreview && (
                  <div className="mt-4 relative">
                    <img
                      src={missionImagePreview}
                      alt="Mission Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs">
                      Preview
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Vision */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">3. Visi</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Visi
                </label>
                <input
                  type="text"
                  value={aboutData.vision.title}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    vision: { ...prev.vision, title: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Judul Visi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Visi
                </label>
                <textarea
                  value={aboutData.vision.description}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    vision: { ...prev.vision, description: e.target.value }
                  }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Deskripsi visi"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Values */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">4. Nilai-Nilai</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Nilai
                </label>
                <input
                  type="text"
                  value={aboutData.values.title}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    values: { ...prev.values, title: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Judul Nilai"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Nilai-Nilai
                </label>
                <textarea
                  value={aboutData.values.description}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    values: { ...prev.values, description: e.target.value }
                  }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Deskripsi nilai-nilai"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Programs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">5. Program</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Program
                </label>
                <input
                  type="text"
                  value={aboutData.programs.title}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    programs: { ...prev.programs, title: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Judul Program"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Program
                </label>
                <textarea
                  value={aboutData.programs.description}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    programs: { ...prev.programs, description: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Deskripsi umum program"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Daftar Program
                  </label>
                  <button
                    type="button"
                    onClick={addProgramItem}
                    className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Program
                  </button>
                </div>

                {aboutData.programs.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4 relative">
                    <button
                      type="button"
                      onClick={() => removeProgramItem(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="space-y-3 pr-6">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateProgramItem(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Nama Program"
                      />
                      <textarea
                        value={item.description}
                        onChange={(e) => updateProgramItem(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Deskripsi Program"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 6: Facilities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">6. Fasilitas</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Fasilitas
                </label>
                <input
                  type="text"
                  value={aboutData.facilities.title}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    facilities: { ...prev.facilities, title: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Judul Fasilitas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Fasilitas
                </label>
                <textarea
                  value={aboutData.facilities.description}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    facilities: { ...prev.facilities, description: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Deskripsi umum fasilitas"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Daftar Fasilitas
                  </label>
                  <button
                    type="button"
                    onClick={addFacilityItem}
                    className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Fasilitas
                  </button>
                </div>

                {aboutData.facilities.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4 relative">
                    <button
                      type="button"
                      onClick={() => removeFacilityItem(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="space-y-3 pr-6">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateFacilityItem(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Nama Fasilitas"
                      />
                      <textarea
                        value={item.description}
                        onChange={(e) => updateFacilityItem(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Deskripsi Fasilitas"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 7: Collaborations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">7. Kemitraan</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Kemitraan
                </label>
                <input
                  type="text"
                  value={aboutData.collaborations.title}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    collaborations: { ...prev.collaborations, title: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Judul Kemitraan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Kemitraan
                </label>
                <textarea
                  value={aboutData.collaborations.description}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    collaborations: { ...prev.collaborations, description: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Deskripsi umum kemitraan"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Daftar Mitra
                  </label>
                  <button
                    type="button"
                    onClick={addPartner}
                    className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Mitra
                  </button>
                </div>

                {aboutData.collaborations.partners.map((partner, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4 relative">
                    <button
                      type="button"
                      onClick={() => removePartner(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="space-y-3 pr-6">
                      <input
                        type="text"
                        value={partner.name}
                        onChange={(e) => updatePartner(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Nama Mitra"
                      />
                      <input
                        type="text"
                        value={partner.role}
                        onChange={(e) => updatePartner(index, 'role', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Peran/Posisi Mitra"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 8: Operational Hours */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">8. Jam Operasional</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul
                </label>
                <input
                  type="text"
                  value={aboutData.operational.title}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    operational: { ...prev.operational, title: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Jam Operasional"
                />
              </div>

              {/* Jam Operasional per Hari */}
              <div className="grid grid-cols-2 gap-4">
                {/* Kolom Kiri: Senin - Jumat */}
                <div className="space-y-4">
                  {['senin', 'selasa', 'rabu', 'kamis', 'jumat'].map((day) => (
                    <div key={day}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {day.charAt(0).toUpperCase() + day.slice(1)} {/* Capitalize first letter */}
                      </label>
                      <input
                        type="text"
                        value={aboutData.operational.hours[day]}
                        onChange={(e) => setAboutData(prev => ({
                          ...prev,
                          operational: {
                            ...prev.operational,
                            hours: {
                              ...prev.operational.hours,
                              [day]: e.target.value
                            }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Contoh: 06:00 - 13:00"
                      />
                    </div>
                  ))}
                </div>

                {/* Kolom Kanan: Sabtu - Minggu */}
                <div className="space-y-4">
                  {['sabtu', 'minggu'].map((day) => (
                    <div key={day}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {day.charAt(0).toUpperCase() + day.slice(1)} {/* Capitalize first letter */}
                      </label>
                      <input
                        type="text"
                        value={aboutData.operational.hours[day]}
                        onChange={(e) => setAboutData(prev => ({
                          ...prev,
                          operational: {
                            ...prev.operational,
                            hours: {
                              ...prev.operational.hours,
                              [day]: e.target.value
                            }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Contoh: 08:00 - 14:00"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>




          {/* Section 9: Established Year */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">9. Tahun Berdiri</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun
                </label>
                <input
                  type="text"
                  value={aboutData.establishedYear}
                  onChange={(e) => setAboutData(prev => ({ ...prev, establishedYear: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="2017"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label
                </label>
                <input
                  type="text"
                  value={aboutData.establishedText}
                  onChange={(e) => setAboutData(prev => ({ ...prev, establishedText: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Berdiri Sejak"
                />
              </div>
            </div>
          </div>

          {/* Section 10: Database Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">10. Informasi Database</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Collection:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">about</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Document ID:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">main</span>
              </div>
              {aboutData.lastUpdated && (
                <div className="pt-2 border-t">
                  <span className="text-gray-600">Terakhir diupdate:</span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(aboutData.lastUpdated).toLocaleString('id-ID')}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t">
              <button
                onClick={loadData}
                className="w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-md hover:bg-blue-200 transition-colors"
              >
                Refresh Data dari Firebase
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutAdmin;  