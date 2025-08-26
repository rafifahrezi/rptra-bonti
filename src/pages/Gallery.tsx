import { FC } from "react";
import { Link } from "react-router-dom";
import { galleryData } from "../data/galleryData";

const GalleryPage: FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Galeri Kegiatan</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {galleryData.map((item) => (
          <Link
            to={`/gallery/${item.id}`}
            key={item.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={item.images[0]}
              alt={item.title}
              className="h-56 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                {item.title}
              </h2>
              <p className="text-sm text-gray-500">{item.date}</p>
              <p className="text-sm text-gray-500">{item.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
