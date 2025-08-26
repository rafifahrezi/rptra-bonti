import { FC } from "react";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

type News = {
  id: number;
  title: string;
  summary: string;
  content: string;
  date: string;
  image: string;
};

export const newsData: News[] = [
  {
    id: 1,
    title: "RPTRA Bonti Gelar Festival Anak",
    summary:
      "RPTRA Bonti mengadakan festival anak untuk meningkatkan kreativitas dan keceriaan anak-anak di lingkungan sekitar.",
    content:
      "RPTRA Bonti sukses menggelar festival anak dengan berbagai lomba, permainan edukatif, dan kegiatan seni. Acara ini diikuti lebih dari 200 anak dari berbagai RW sekitar...",
    date: "10 Februari 2025",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  },
  {
    id: 2,
    title: "Pelatihan Parenting untuk Warga",
    summary:
      "Pelatihan parenting diberikan kepada orang tua agar lebih memahami tumbuh kembang anak.",
    content:
      "Kegiatan pelatihan parenting berlangsung selama 2 hari dengan menghadirkan narasumber psikolog anak. Peserta mendapat materi seputar pola asuh positif, komunikasi dengan anak...",
    date: "12 Februari 2025",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
  },
  {
    id: 3,
    title: "RPTRA Bonti Raih Penghargaan",
    summary:
      "RPTRA Bonti berhasil meraih penghargaan sebagai ruang publik ramah anak terbaik tingkat kota.",
    content:
      "Penghargaan ini diberikan oleh pemerintah kota atas kontribusi RPTRA Bonti dalam menciptakan ruang ramah anak. Acara penyerahan penghargaan dihadiri oleh wali kota...",
    date: "20 Februari 2025",
    image:
      "https://images.unsplash.com/photo-1508780709619-79562169bc64",
  },
];

const NewsPage: FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Berita Terbaru</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {newsData.map((news) => (
          <div
            key={news.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={news.image}
              alt={news.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Calendar className="w-4 h-4 mr-1" />
                {news.date}
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {news.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {news.summary}
              </p>
              <Link to={`/news/${news.id}`}>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg">
                  Baca Selengkapnya
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
