export type GalleryItem = {
    id: number;
    title: string;
    date: string;
    location: string;
    images: string[];
  };
  
  export const galleryData: GalleryItem[] = [
    {
      id: 1,
      title: "Kegiatan Festival Anak",
      date: "10 Agustus 2025",
      location: "RPTRA Bonti, Jakarta",
      images: [
        "https://images.unsplash.com/photo-1508780709619-79562169bc64",
        "https://images.unsplash.com/photo-1524492449090-1a065f2d7c88",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
      ],
    },
    {
      id: 2,
      title: "Pelatihan Parenting",
      date: "15 Agustus 2025",
      location: "Aula RPTRA Bonti",
      images: [
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
        "https://images.unsplash.com/photo-1533240332313-0db49b459ad6",
      ],
    },
  ];
  