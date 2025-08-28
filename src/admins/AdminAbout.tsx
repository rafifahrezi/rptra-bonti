import { memo, useState, useEffect, useCallback } from 'react';
import { Save, Edit2, Upload, Plus, X, ChevronDown } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getOrInitDoc } from '../utils/firestoreHelpers';

// Define the AboutData interface
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
interface AboutData {
  title: string;
  subtitle: string;
  mission: {
    title: string;
    description: string;
    image: string;
  };
  vision: {
    title: string;
    description: string;
  };
  values: {
    title: string;
    description: string;
  };
  programs: {
    title: string;
    description: string;
    items: {
      name: string;
      description: string;
    }[];
  };
  facilities: {
    title: string;
    description: string;
    items: {
      name: string;
      description: string;
    }[];
  };
  collaborations: {
    title: string;
    description: string;
    partners: {
      name: string;
      role: string;
    }[];
  };
  operational: {
    title: string;
    hours: {
      senin: string;
      selasa: string;
      rabu: string;
      kamis: string;
      jumat: string;
      sabtu: string;
      minggu: string;
    };
  };
  establishedYear: string;
  establishedText: string;
  lastUpdated: string;
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
      <p className="mt-4 text-gray-600">Memuat data...</p>
    </div>
  </div>
));

// Header Component
const Header = memo(({ onSave, isSaving, onRefresh }: { onSave: () => void; isSaving: boolean; onRefresh: () => void }) => (
  <div className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Halaman About</h1>
          <p className="text-sm text-gray-600 mt-1">Edit informasi tentang RPTRA Bonti</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors flex items-center gap-2"
            aria-label="Refresh data"
          >
            Refresh Data
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            aria-label="Save changes"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  </div>
));

// Reusable Accordion Wrapper Component
const AccordionSection = memo(
  ({ title, children, isOpen, toggleOpen }: {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    toggleOpen: () => void;
  }) => (
    <div className="bg-white rounded-lg shadow">
      <button
        onClick={toggleOpen}
        className="w-full p-6 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${title}`}
      >
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Edit2 className="w-5 h-5" />
          {title}
        </h2>
        <ChevronDown className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        id={`accordion-content-${title}`}
        className={`overflow-hidden transition-max-height duration-300 ease-in-out ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}
      >
        <div className="px-6 pb-6 space-y-4">
          {children}
        </div>
      </div>
    </div>
  )
);

// Hero Section Content
const HeroContent = memo(
  ({ data, updateData }: { data: AboutData; updateData: (field: keyof AboutData, value: string) => void }) => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Judul Utama</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => updateData('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Masukkan judul utama"
          aria-label="Main title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle/Deskripsi</label>
        <textarea
          value={data.subtitle}
          onChange={(e) => updateData('subtitle', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Masukkan deskripsi singkat tentang RPTRA"
          aria-label="Subtitle"
        />
      </div>
    </>
  )
);

// Mission Section Content
const MissionContent = memo(
  ({
    mission,
    updateMission,
    handleImageUpload,
    imagePreview,
    isUploading,
  }: {
    mission: AboutData['mission'];
    updateMission: (field: keyof AboutData['mission'], value: string) => void;
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    imagePreview: string;
    isUploading: boolean;
  }) => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Judul Misi</label>
        <input
          type="text"
          value={mission.title}
          onChange={(e) => updateMission('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Contoh: Misi Kami"
          aria-label="Mission title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Misi</label>
        <textarea
          value={mission.description}
          onChange={(e) => updateMission('description', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Masukkan deskripsi misi RPTRA"
          aria-label="Mission description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Mission</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="mission-image-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="mission-image-upload"
            className={`cursor-pointer flex flex-col items-center gap-2 ${isUploading ? 'opacity-50' : ''}`}
          >
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-600">
              {isUploading ? 'Mengupload...' : 'Upload gambar mission'}
            </span>
          </label>
        </div>
        {imagePreview && (
          <div className="mt-4 relative">
            <img
              src={imagePreview}
              alt="Mission Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs">
              Preview
            </div>
          </div>
        )}
      </div>
    </>
  )
);

// Vision Section Content
const VisionContent = memo(
  ({ vision, updateVision }: { vision: AboutData['vision']; updateVision: (field: keyof AboutData['vision'], value: string) => void }) => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Judul Visi</label>
        <input
          type="text"
          value={vision.title}
          onChange={(e) => updateVision('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Judul Visi"
          aria-label="Vision title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Visi</label>
        <textarea
          value={vision.description}
          onChange={(e) => updateVision('description', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Deskripsi visi"
          aria-label="Vision description"
        />
      </div>
    </>
  )
);

// Values Section Content
const ValuesContent = memo(
  ({ values, updateValues }: { values: AboutData['values']; updateValues: (field: keyof AboutData['values'], value: string) => void }) => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Judul Nilai</label>
        <input
          type="text"
          value={values.title}
          onChange={(e) => updateValues('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Judul Nilai"
          aria-label="Values title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Nilai-Nilai</label>
        <textarea
          value={values.description}
          onChange={(e) => updateValues('description', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Deskripsi nilai-nilai"
          aria-label="Values description"
        />
      </div>
    </>
  )
);

// Programs Section Content
const ProgramsContent = memo(
  ({
    programs,
    updatePrograms,
    addProgramItem,
    removeProgramItem,
    updateProgramItem,
  }: {
    programs: AboutData['programs'];
    updatePrograms: (field: keyof AboutData['programs'], value: string) => void;
    addProgramItem: () => void;
    removeProgramItem: (index: number) => void;
    updateProgramItem: (index: number, field: 'name' | 'description', value: string) => void;
  }) => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Judul Program</label>
        <input
          type="text"
          value={programs.title}
          onChange={(e) => updatePrograms('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Judul Program"
          aria-label="Programs title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Program</label>
        <textarea
          value={programs.description}
          onChange={(e) => updatePrograms('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Deskripsi umum program"
          aria-label="Programs description"
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">Daftar Program</label>
          <button
            type="button"
            onClick={addProgramItem}
            className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 flex items-center gap-1"
            aria-label="Add new program"
          >
            <Plus className="w-4 h-4" />
            Tambah Program
          </button>
        </div>
        {programs.items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-md p-4 relative">
            <button
              type="button"
              onClick={() => removeProgramItem(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              aria-label={`Remove program ${item.name}`}
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
                aria-label={`Program name ${index + 1}`}
              />
              <textarea
                value={item.description}
                onChange={(e) => updateProgramItem(index, 'description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Deskripsi Program"
                aria-label={`Program description ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  )
);

// Facilities Section Content
const FacilitiesContent = memo(
  ({
    facilities,
    updateFacilities,
    addFacilityItem,
    removeFacilityItem,
    updateFacilityItem,
  }: {
    facilities: AboutData['facilities'];
    updateFacilities: (field: keyof AboutData['facilities'], value: string) => void;
    addFacilityItem: () => void;
    removeFacilityItem: (index: number) => void;
    updateFacilityItem: (index: number, field: 'name' | 'description', value: string) => void;
  }) => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Judul Fasilitas</label>
        <input
          type="text"
          value={facilities.title}
          onChange={(e) => updateFacilities('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Judul Fasilitas"
          aria-label="Facilities title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Fasilitas</label>
        <textarea
          value={facilities.description}
          onChange={(e) => updateFacilities('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Deskripsi umum fasilitas"
          aria-label="Facilities description"
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">Daftar Fasilitas</label>
          <button
            type="button"
            onClick={addFacilityItem}
            className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 flex items-center gap-1"
            aria-label="Add new facility"
          >
            <Plus className="w-4 h-4" />
            Tambah Fasilitas
          </button>
        </div>
        {facilities.items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-md p-4 relative">
            <button
              type="button"
              onClick={() => removeFacilityItem(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              aria-label={`Remove facility ${item.name}`}
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
                aria-label={`Facility name ${index + 1}`}
              />
              <textarea
                value={item.description}
                onChange={(e) => updateFacilityItem(index, 'description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Deskripsi Fasilitas"
                aria-label={`Facility description ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  )
);

// Collaborations Section Content
const CollaborationsContent = memo(
  ({
    collaborations,
    updateCollaborations,
    addPartner,
    removePartner,
    updatePartner,
  }: {
    collaborations: AboutData['collaborations'];
    updateCollaborations: (field: keyof AboutData['collaborations'], value: string) => void;
    addPartner: () => void;
    removePartner: (index: number) => void;
    updatePartner: (index: number, field: 'name' | 'role', value: string) => void;
  }) => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Judul Kemitraan</label>
        <input
          type="text"
          value={collaborations.title}
          onChange={(e) => updateCollaborations('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Judul Kemitraan"
          aria-label="Collaborations title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Kemitraan</label>
        <textarea
          value={collaborations.description}
          onChange={(e) => updateCollaborations('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Deskripsi umum kemitraan"
          aria-label="Collaborations description"
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">Daftar Mitra</label>
          <button
            type="button"
            onClick={addPartner}
            className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 flex items-center gap-1"
            aria-label="Add new partner"
          >
            <Plus className="w-4 h-4" />
            Tambah Mitra
          </button>
        </div>
        {collaborations.partners.map((partner, index) => (
          <div key={index} className="border border-gray-200 rounded-md p-4 relative">
            <button
              type="button"
              onClick={() => removePartner(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              aria-label={`Remove partner ${partner.name}`}
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
                aria-label={`Partner name ${index + 1}`}
              />
              <input
                type="text"
                value={partner.role}
                onChange={(e) => updatePartner(index, 'role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Peran/Posisi Mitra"
                aria-label={`Partner role ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  )
);

// Operational Hours Content
// Operational Hours Content
const OperationalHoursContent = memo(
  ({
    operational,
    updateOperational,
  }: {
    operational: AboutData['operational'];
    updateOperational: (field: 'title' | keyof AboutData['operational']['hours'], value: string) => void;
  }) => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
        <input
          type="text"
          value={operational.title}
          onChange={(e) => updateOperational('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Jam Operasional"
          aria-label="Operational hours title"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          {['senin', 'selasa', 'rabu', 'kamis', 'jumat'].map((day) => (
            <div key={day}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
              <input
                type="text"
                value={operational.hours[day]}
                onChange={(e) => updateOperational(day as keyof AboutData['operational']['hours'], e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Contoh: 06:00 - 13:00"
                aria-label={`${day} hours`}
              />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {['sabtu', 'minggu'].map((day) => (
            <div key={day}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
              <input
                type="text"
                value={operational.hours[day]}
                onChange={(e) => updateOperational(day as keyof AboutData['operational']['hours'], e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Contoh: 08:00 - 14:00"
                aria-label={`${day} hours`}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
);

// Established Year Content
const EstablishedYearContent = memo(
  ({ establishedYear, establishedText, updateData }: { establishedYear: string; establishedText: string; updateData: (field: keyof AboutData, value: string) => void }) => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
        <input
          type="text"
          value={establishedYear}
          onChange={(e) => updateData('establishedYear', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="2017"
          aria-label="Established year"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
        <input
          type="text"
          value={establishedText}
          onChange={(e) => updateData('establishedText', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Berdiri Sejak"
          aria-label="Established text"
        />
      </div>
    </div>
  )
);

// Database Info Content
const DatabaseInfoContent = memo(
  ({ lastUpdated }: { lastUpdated: string }) => (
    <div className="space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Collection:</span>
        <span className="font-mono bg-gray-100 px-2 py-1 rounded">about</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Document ID:</span>
        <span className="font-mono bg-gray-100 px-2 py-1 rounded">main</span>
      </div>
      {lastUpdated && (
        <div className="pt-2 border-t">
          <span className="text-gray-600">Terakhir diupdate:</span>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(lastUpdated).toLocaleString('id-ID')}
          </p>
        </div>
      )}
    </div>
  )
);

// Main AboutAdmin Component
const AboutAdmin = () => {
  const [aboutData, setAboutData] = useState<AboutData>(defaultAboutData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [missionImagePreview, setMissionImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState({
    hero: false,
    mission: false,
    vision: false,
    values: false,
    programs: false,
    facilities: false,
    collaborations: false,
    operational: false,
    established: false,
    database: true,
  });

  // Load data from Firebase
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrInitDoc('about', 'main', defaultAboutData);
      setAboutData(data);
      setMissionImagePreview(data.mission?.image || 'data:,');
      setSnackbarMessage('Data berhasil direfresh dari Firebase!');
    } catch (error) {
      console.error('Error loading about data:', error);
      setSnackbarMessage('Gagal merefresh data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Save data to Firebase
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const dataToSave = {
        ...aboutData,
        lastUpdated: new Date().toISOString(),
      };
      const docRef = doc(db, 'about', 'main');
      await setDoc(docRef, dataToSave);
      setSnackbarMessage('Data berhasil disimpan!');
    } catch (error) {
      console.error('Error saving data:', error);
      setSnackbarMessage('Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  }, [aboutData]);

  // Image upload handler
  const handleMissionImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploadingImage(true);
      try {
        // Placeholder for Firebase Storage (using FileReader for now)
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setMissionImagePreview(imageUrl);
          setAboutData((prev) => ({
            ...prev,
            mission: { ...prev.mission, image: imageUrl },
          }));
          setSnackbarMessage('Gambar berhasil diupload!');
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading image:', error);
        setSnackbarMessage('Gagal mengupload gambar.');
      } finally {
        setUploadingImage(false);
      }
    },
    []
  );

  // Update handlers
  const updateData = useCallback((field: keyof AboutData, value: string) => {
    setAboutData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateMission = useCallback((field: keyof AboutData['mission'], value: string) => {
    setAboutData((prev) => ({
      ...prev,
      mission: { ...prev.mission, [field]: value },
    }));
  }, []);

  const updateVision = useCallback((field: keyof AboutData['vision'], value: string) => {
    setAboutData((prev) => ({
      ...prev,
      vision: { ...prev.vision, [field]: value },
    }));
  }, []);

  const updateValues = useCallback((field: keyof AboutData['values'], value: string) => {
    setAboutData((prev) => ({
      ...prev,
      values: { ...prev.values, [field]: value },
    }));
  }, []);

  const updatePrograms = useCallback((field: keyof AboutData['programs'], value: string) => {
    setAboutData((prev) => ({
      ...prev,
      programs: { ...prev.programs, [field]: value },
    }));
  }, []);

  const addProgramItem = useCallback(() => {
    setAboutData((prev) => ({
      ...prev,
      programs: {
        ...prev.programs,
        items: [...prev.programs.items, { name: '', description: '' }],
      },
    }));
  }, []);

  const removeProgramItem = useCallback((index: number) => {
    setAboutData((prev) => ({
      ...prev,
      programs: {
        ...prev.programs,
        items: prev.programs.items.filter((_, i) => i !== index),
      },
    }));
  }, []);

  const updateProgramItem = useCallback((index: number, field: 'name' | 'description', value: string) => {
    setAboutData((prev) => ({
      ...prev,
      programs: {
        ...prev.programs,
        items: prev.programs.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
      },
    }));
  }, []);

  const updateFacilities = useCallback((field: keyof AboutData['facilities'], value: string) => {
    setAboutData((prev) => ({
      ...prev,
      facilities: { ...prev.facilities, [field]: value },
    }));
  }, []);

  const addFacilityItem = useCallback(() => {
    setAboutData((prev) => ({
      ...prev,
      facilities: {
        ...prev.facilities,
        items: [...prev.facilities.items, { name: '', description: '' }],
      },
    }));
  }, []);

  const removeFacilityItem = useCallback((index: number) => {
    setAboutData((prev) => ({
      ...prev,
      facilities: {
        ...prev.facilities,
        items: prev.facilities.items.filter((_, i) => i !== index),
      },
    }));
  }, []);

  const updateFacilityItem = useCallback((index: number, field: 'name' | 'description', value: string) => {
    setAboutData((prev) => ({
      ...prev,
      facilities: {
        ...prev.facilities,
        items: prev.facilities.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
      },
    }));
  }, []);

  const updateCollaborations = useCallback((field: keyof AboutData['collaborations'], value: string) => {
    setAboutData((prev) => ({
      ...prev,
      collaborations: { ...prev.collaborations, [field]: value },
    }));
  }, []);

  const addPartner = useCallback(() => {
    setAboutData((prev) => ({
      ...prev,
      collaborations: {
        ...prev.collaborations,
        partners: [...prev.collaborations.partners, { name: '', role: '' }],
      },
    }));
  }, []);

  const removePartner = useCallback((index: number) => {
    setAboutData((prev) => ({
      ...prev,
      collaborations: {
        ...prev.collaborations,
        partners: prev.collaborations.partners.filter((_, i) => i !== index),
      },
    }));
  }, []);

  const updatePartner = useCallback((index: number, field: 'name' | 'role', value: string) => {
    setAboutData((prev) => ({
      ...prev,
      collaborations: {
        ...prev.collaborations,
        partners: prev.collaborations.partners.map((partner, i) =>
          i === index ? { ...partner, [field]: value } : partner
        ),
      },
    }));
  }, []);

  const updateOperational = useCallback(
    (field: 'title' | keyof AboutData['operational']['hours'], value: string) => {
      setAboutData((prev) => {
        if (field === 'title') {
          return {
            ...prev,
            operational: {
              ...prev.operational,
              title: value,
            },
          };
        }
        return {
          ...prev,
          operational: {
            ...prev.operational,
            hours: { ...prev.operational.hours, [field]: value },
          },
        };
      });
    },
    []
  );

  // Toggle section open/close
  const toggleSection = useCallback((section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  // Snackbar handler for close
  const closeSnackbar = useCallback(() => {
    setSnackbarMessage(null);
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header onSave={handleSave} isSaving={saving} onRefresh={loadData} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <AccordionSection
          title="1. Hero Section"
          isOpen={openSections.hero}
          toggleOpen={() => toggleSection('hero')}
        >
          <HeroContent data={aboutData} updateData={updateData} />
        </AccordionSection>
        <AccordionSection
          title="2. Misi"
          isOpen={openSections.mission}
          toggleOpen={() => toggleSection('mission')}
        >
          <MissionContent
            mission={aboutData.mission}
            updateMission={updateMission}
            handleImageUpload={handleMissionImageUpload}
            imagePreview={missionImagePreview}
            isUploading={uploadingImage}
          />
        </AccordionSection>
        <AccordionSection
          title="3. Visi"
          isOpen={openSections.vision}
          toggleOpen={() => toggleSection('vision')}
        >
          <VisionContent vision={aboutData.vision} updateVision={updateVision} />
        </AccordionSection>
        <AccordionSection
          title="4. Nilai-Nilai"
          isOpen={openSections.values}
          toggleOpen={() => toggleSection('values')}
        >
          <ValuesContent values={aboutData.values} updateValues={updateValues} />
        </AccordionSection>
        <AccordionSection
          title="5. Program"
          isOpen={openSections.programs}
          toggleOpen={() => toggleSection('programs')}
        >
          <ProgramsContent
            programs={aboutData.programs}
            updatePrograms={updatePrograms}
            addProgramItem={addProgramItem}
            removeProgramItem={removeProgramItem}
            updateProgramItem={updateProgramItem}
          />
        </AccordionSection>
        <AccordionSection
          title="6. Fasilitas"
          isOpen={openSections.facilities}
          toggleOpen={() => toggleSection('facilities')}
        >
          <FacilitiesContent
            facilities={aboutData.facilities}
            updateFacilities={updateFacilities}
            addFacilityItem={addFacilityItem}
            removeFacilityItem={removeFacilityItem}
            updateFacilityItem={updateFacilityItem}
          />
        </AccordionSection>
        <AccordionSection
          title="7. Kemitraan"
          isOpen={openSections.collaborations}
          toggleOpen={() => toggleSection('collaborations')}
        >
          <CollaborationsContent
            collaborations={aboutData.collaborations}
            updateCollaborations={updateCollaborations}
            addPartner={addPartner}
            removePartner={removePartner}
            updatePartner={updatePartner}
          />
        </AccordionSection>
        <AccordionSection
          title="8. Jam Operasional"
          isOpen={openSections.operational}
          toggleOpen={() => toggleSection('operational')}
        >
          <OperationalHoursContent operational={aboutData.operational} updateOperational={updateOperational} />
        </AccordionSection>
        <AccordionSection
          title="9. Tahun Berdiri"
          isOpen={openSections.established}
          toggleOpen={() => toggleSection('established')}
        >
          <EstablishedYearContent
            establishedYear={aboutData.establishedYear}
            establishedText={aboutData.establishedText}
            updateData={updateData}
          />
        </AccordionSection>
        <AccordionSection
          title=""
          isOpen={openSections.database}
          toggleOpen={() => toggleSection('database')}
        >
          <DatabaseInfoContent lastUpdated={aboutData.lastUpdated} />
        </AccordionSection>
      </div>
      {snackbarMessage && <Snackbar message={snackbarMessage} onClose={closeSnackbar} />}
    </div>
  );
};

export default AboutAdmin;