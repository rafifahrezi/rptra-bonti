import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  id: {
    translation: {
      // Navigation
      "nav.home": "Beranda",
      "nav.about": "Tentang",
      "nav.events": "Kegiatan",
      "nav.news": "Berita",
      "nav.gallery": "Galeri",
      "nav.contact": "Kontak",
      "nav.admin": "Admin",
      
      // Home Page
      "home.hero.title": "Selamat Datang di RPTRA Kebon Melati",
      "home.hero.subtitle": "Ruang Publik Terpadu Ramah Anak untuk Keluarga Jakarta",
      "home.hero.cta": "Jelajahi Kegiatan",
      "home.about.title": "Tentang RPTRA Bonti",
      "home.about.text": "RPTRA Kebon Melati adalah ruang publik terintegrasi yang dirancang khusus untuk menciptakan lingkungan aman dan ramah anak, mendukung perkembangan anak dan memfasilitasi kegiatan komunitas.",
      "home.events.title": "Kegiatan Terbaru",
      "home.news.title": "Berita & Pengumuman",
      "home.location.title": "Lokasi Kami",
      
      // About Page
      "about.title": "Tentang RPTRA Bonti",
      "about.mission.title": "Misi Kami",
      "about.mission.text": "Menyediakan ruang aman untuk perkembangan anak, meningkatkan literasi kesehatan masyarakat, dan memfasilitasi kegiatan komunitas yang memberdayakan keluarga di Kebon Melati.",
      "about.programs.title": "Program Kami",
      "about.facilities.title": "Fasilitas",
      
      // Events Page
      "events.title": "Kegiatan RPTRA",
      "events.upcoming": "Kegiatan Mendatang",
      "events.past": "Kegiatan Sebelumnya",
      "events.register": "Daftar",
      "events.filter.all": "Semua",
      "events.filter.education": "Pendidikan",
      "events.filter.health": "Kesehatan",
      "events.filter.recreation": "Rekreasi",
      "events.filter.community": "Komunitas",
      
      // Common
      "common.readmore": "Baca Selengkapnya",
      "common.viewall": "Lihat Semua",
      "common.loading": "Memuat...",
      "common.error": "Terjadi kesalahan",
      "common.submit": "Kirim",
      "common.cancel": "Batal",
      "common.save": "Simpan",
      "common.edit": "Edit",
      "common.delete": "Hapus",
    }
  },
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.about": "About",
      "nav.events": "Events",
      "nav.news": "News",
      "nav.gallery": "Gallery",
      "nav.contact": "Contact",
      "nav.admin": "Admin",
      
      // Home Page
      "home.hero.title": "Welcome to RPTRA Kebon Melati",
      "home.hero.subtitle": "Child-Friendly Integrated Public Space for Jakarta Families",
      "home.hero.cta": "Explore Activities",
      "home.about.title": "About RPTRA Bonti",
      "home.about.text": "RPTRA Kebon Melati is an integrated public space designed specifically to create a safe and child-friendly environment, supporting child development and facilitating community activities.",
      "home.events.title": "Latest Events",
      "home.news.title": "News & Announcements",
      "home.location.title": "Our Location",
      
      // About Page
      "about.title": "About RPTRA Bonti",
      "about.mission.title": "Our Mission",
      "about.mission.text": "To provide safe spaces for child development, improve community health literacy, and facilitate community activities that empower families in Kebon Melati.",
      "about.programs.title": "Our Programs",
      "about.facilities.title": "Facilities",
      
      // Events Page
      "events.title": "RPTRA Events",
      "events.upcoming": "Upcoming Events",
      "events.past": "Past Events",
      "events.register": "Register",
      "events.filter.all": "All",
      "events.filter.education": "Education",
      "events.filter.health": "Health",
      "events.filter.recreation": "Recreation",
      "events.filter.community": "Community",
      
      // Common
      "common.readmore": "Read More",
      "common.viewall": "View All",
      "common.loading": "Loading...",
      "common.error": "An error occurred",
      "common.submit": "Submit",
      "common.cancel": "Cancel",
      "common.save": "Save",
      "common.edit": "Edit",
      "common.delete": "Delete",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'id',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;