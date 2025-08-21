export interface Event {
  id: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  date: string;
  time: string;
  location: string;
  location_en?: string;
  category: 'education' | 'health' | 'recreation' | 'community';
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsPost {
  id: string;
  title: string;
  title_en?: string;
  content: string;
  content_en?: string;
  excerpt: string;
  excerpt_en?: string;
  author: string;
  published_date: string;
  category: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  title_en?: string;
  type: 'image' | 'video';
  url: string;
  thumbnail_url?: string;
  category: 'events' | 'community' | 'facilities';
  description?: string;
  description_en?: string;
  created_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}