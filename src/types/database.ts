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
  duration_slots: number;
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

export interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  barber_id: string;
  service_id: string;
  customer_name: string;
  customer_phone: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface BarberTimeSlot {
  id: string;
  barber_id: string;
  time_slot_id: string;
  active: boolean;
  created_at: string;
}
