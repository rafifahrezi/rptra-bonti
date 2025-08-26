import { FC } from "react";
import { useParams, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FiArrowLeft } from "react-icons/fi"; // ✅ import ikon back-left
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { galleryData } from "../data/galleryData";

const GalleryDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const gallery = galleryData.find((item) => item.id === Number(id));

  if (!gallery) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Galeri tidak ditemukan
        </h1>
        <Link to="/gallery" className="text-green-500 hover:underline">
          ← Kembali
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        to="/gallery"
        className="inline-flex items-center gap-2 text-green-500 hover:underline mb-4"
      >
        <FiArrowLeft className="text-lg" /> {/* ✅ ikon back-left */}
        Kembali
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        {gallery.title}
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        📅 {gallery.date} | 📍 {gallery.location}
      </p>

      {/* Swiper Carousel dengan Auto-Slider */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }} // auto-slide tiap 5 detik
        loop={true} // supaya muter terus
        className="rounded-lg mb-6"
      >
        {gallery.images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={img}
              alt={`slide-${idx}`}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <p className="text-gray-700 leading-relaxed">
        Dokumentasi lengkap kegiatan{" "}
        <span className="font-semibold">{gallery.title}</span> yang
        diselenggarakan di{" "}
        <span className="font-semibold">{gallery.location}</span> pada{" "}
        <span className="font-semibold">{gallery.date}</span>.
      </p>
    </div>
  );
};

export default GalleryDetailPage;
