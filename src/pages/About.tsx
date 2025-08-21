import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Heart, Target, Award, MapPin, Clock, Play as Playground, Building2 } from 'lucide-react';

const About: React.FC = () => {
  const { t } = useTranslation();

  const programs = [
    {
      icon: Heart,
      title: 'Literasi Kesehatan',
      description: 'Program edukasi kesehatan untuk keluarga dan distribusi makanan bersubsidi'
    },
    {
      icon: Users,
      title: 'Kegiatan Komunitas',
      description: 'Senam merdeka, jumat curhat, dan berbagai kegiatan sosial komunitas'
    },
    {
      icon: Playground,
      title: 'Program Anak',
      description: 'Kegiatan edukatif dan rekreatif yang mendukung tumbuh kembang anak'
    },
    {
      icon: Building2,
      title: 'Pemberdayaan Masyarakat',
      description: 'Program keterampilan dan pemberdayaan ekonomi masyarakat lokal'
    }
  ];

  const facilities = [
    'Playground anak yang aman dan modern',
    'Ruang pertemuan serbaguna',
    'Taman hijau dan area duduk',
    'Ruang baca dan perpustakaan mini',
    'Fasilitas olahraga outdoor',
    'Area parkir yang memadai',
    'Toilet dan fasilitas kebersihan',
    'Kantin dan area istirahat'
  ];

  const partners = [
    'Pemerintah Kelurahan Kebon Melati',
    'TP PKK Kelurahan Kebon Melati',
    'Dinas Pemberdayaan Masyarakat DKI Jakarta',
    'Organisasi Masyarakat Setempat',
    'Sekolah-sekolah di sekitar wilayah',
    'Puskesmas Kebon Melati'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Ruang Publik Terpadu Ramah Anak yang berkomitmen menciptakan lingkungan 
              aman dan mendukung perkembangan anak di Jakarta Pusat
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('about.mission.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('about.mission.text')}
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Visi</h3>
                    <p className="text-gray-600">
                      Menjadi ruang publik terdepan yang menciptakan generasi anak Indonesia 
                      yang sehat, cerdas, dan berkarakter.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Nilai</h3>
                    <p className="text-gray-600">
                      Keamanan, Pendidikan, Komunitas, Kesehatan, dan Keberlanjutan 
                      sebagai fondasi semua program kami.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.pexels.com/photos/1094072/pexels-photo-1094072.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="RPTRA Kebon Melati"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">2019</div>
                  <div className="text-sm text-gray-600">Berdiri Sejak</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about.programs.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Berbagai program inovatif yang dirancang untuk mendukung perkembangan 
              anak dan pemberdayaan masyarakat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <program.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {program.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('about.facilities.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                RPTRA Kebon Melati dilengkapi dengan berbagai fasilitas modern 
                yang mendukung aktivitas anak dan keluarga.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {facilities.map((facility, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">{facility}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden shadow-md">
                  <img
                    src="https://images.pexels.com/photos/1350560/pexels-photo-1350560.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Playground"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden shadow-md">
                  <img
                    src="https://images.pexels.com/photos/1094081/pexels-photo-1094081.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Reading Area"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden shadow-md">
                  <img
                    src="https://images.pexels.com/photos/1612461/pexels-photo-1612461.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Garden Area"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden shadow-md">
                  <img
                    src="https://images.pexels.com/photos/1094074/pexels-photo-1094074.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Meeting Room"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Mitra & Kolaborator
              </h2>
              <p className="text-lg text-gray-600">
                RPTRA Kebon Melati bekerja sama dengan berbagai pihak untuk 
                memberikan pelayanan terbaik bagi masyarakat
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{partner}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hours & Location */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <Clock className="w-8 h-8 mr-3" />
                <h3 className="text-2xl font-bold">Jam Operasional</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Senin - Minggu</span>
                  <span>06:00 - 22:00 WIB</span>
                </div>
                <div className="flex justify-between">
                  <span>Hari Libur Nasional</span>
                  <span>06:00 - 18:00 WIB</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white border-opacity-20">
                <p className="text-sm opacity-90">
                  *Beberapa fasilitas mungkin memiliki jam operasional berbeda
                </p>
              </div>
            </div>

            <div className="bg-gray-100 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <MapPin className="w-8 h-8 mr-3 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-900">Lokasi</h3>
              </div>
              <div className="space-y-2 text-gray-700">
                <p>Jl. H. Awaludin IV, RT.3/RW.17</p>
                <p>Kebon Melati, Tanah Abang</p>
                <p>Jakarta Pusat 10230</p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-300">
                <p className="text-sm text-gray-600">
                  Mudah diakses dengan transportasi umum. 
                  Dekat dengan stasiun Tanah Abang dan halte TransJakarta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;