import { FC } from "react";
import { useParams, Link } from "react-router-dom";
import { newsData } from "./News";
import { Calendar, ArrowLeft } from "lucide-react";

const NewsDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const news = newsData.find((n) => n.id === Number(id));

  if (!news) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-600 font-semibold">Berita tidak ditemukan</p>
        <Link to="/news" className="text-green-600 underline">
          ← Kembali ke Berita
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/news" className="flex items-center text-green-600 mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
      </Link>

      <img
        src={news.image}
        alt={news.title}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />

      <div className="flex items-center text-sm text-gray-500 mb-2">
        <Calendar className="w-4 h-4 mr-1" />
        {news.date}
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-4">{news.title}</h1>
      <p className="text-gray-700 leading-relaxed">{news.content}</p>
    </div>
  );
};

export default NewsDetailPage;
