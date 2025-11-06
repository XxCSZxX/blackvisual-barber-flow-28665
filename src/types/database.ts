// Local type definitions for database tables
// These provide type safety while Supabase types are being generated

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  slug: string;
  category: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Barber {
  id: string;
  name: string;
  whatsapp: string;
  photo: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  display_order: number;
  active: boolean;
  created_at: string;
}

export interface DiscountCoupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  active: boolean;
  expires_at: string | null;
  max_uses: number | null;
  current_uses: number;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user' | 'moderator';
  created_at: string;
}
