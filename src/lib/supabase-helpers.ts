// @ts-nocheck
import { supabase } from "@/integrations/supabase/client";
import type { Product, Service, Barber, TimeSlot, DiscountCoupon, UserRole, Booking, BarberTimeSlot } from "@/types/database";

// Helper functions with proper typing to work around empty Supabase types
// These provide type safety while the Supabase types file is being regenerated
// @ts-nocheck is used temporarily until Supabase types are auto-generated

export const getProducts = async (filters?: { active?: boolean; category?: string }) => {
  let query = supabase.from("products").select("*");
  
  if (filters?.active !== undefined) {
    query = query.eq("active", filters.active);
  }
  if (filters?.category) {
    query = query.eq("category", filters.category);
  }
  
  const { data, error } = await query;
  return { data: data as Product[] | null, error };
};

export const getServices = async (filters?: { active?: boolean }) => {
  let query = supabase.from("services").select("*");
  
  if (filters?.active !== undefined) {
    query = query.eq("active", filters.active);
  }
  
  query = query.order("category").order("created_at");
  
  const { data, error } = await query;
  return { data: data as Service[] | null, error };
};

export const getBarbers = async (filters?: { active?: boolean }) => {
  let query = supabase.from("barbers").select("*");
  
  if (filters?.active !== undefined) {
    query = query.eq("active", filters.active);
  }
  
  const { data, error} = await query;
  return { data: data as Barber[] | null, error };
};

export const getTimeSlots = async (filters?: { active?: boolean }) => {
  let query = supabase.from("time_slots").select("*").order("display_order");
  
  if (filters?.active !== undefined) {
    query = query.eq("active", filters.active);
  }
  
  const { data, error } = await query;
  return { data: data as TimeSlot[] | null, error };
};

export const getBarberTimeSlots = async (barberId: string) => {
  const { data, error } = await supabase
    .from("barber_time_slots")
    .select("*, time_slots(*)")
    .eq("barber_id", barberId)
    .eq("active", true);
  
  return { data, error };
};

export const getTimeSlotsForBarber = async (barberId: string) => {
  const { data, error } = await supabase
    .from("barber_time_slots")
    .select("time_slot_id, time_slots(time, display_order)")
    .eq("barber_id", barberId)
    .eq("active", true);
  
  if (data) {
    const slots = data
      .filter((item: any) => item.time_slots)
      .map((item: any) => ({
        time: item.time_slots.time,
        display_order: item.time_slots.display_order
      }))
      .sort((a: any, b: any) => a.display_order - b.display_order);
    return { data: slots, error: null };
  }
  
  return { data: null, error };
};

export const getDiscountCoupon = async (code: string) => {
  const { data, error } = await supabase
    .from("discount_coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("active", true)
    .maybeSingle();
  
  return { data: data as DiscountCoupon | null, error };
};

export const getUserRoles = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", userId);
  
  return { data: data as UserRole[] | null, error };
};

export const createUserRole = async (userId: string, role: 'admin' | 'user') => {
  const { data, error } = await supabase
    .from("user_roles")
    .insert({ user_id: userId, role })
    .select()
    .single();
  
  return { data: data as UserRole | null, error };
};

export const getBookedTimes = async (date: string, barberId?: string) => {
  let query = supabase
    .from("bookings")
    .select("booking_time")
    .eq("booking_date", date)
    .in("status", ["pending", "confirmed"]);
  
  if (barberId) {
    query = query.eq("barber_id", barberId);
  }
  
  const { data, error } = await query;
  return { data: data as Pick<Booking, 'booking_time'>[] | null, error };
};

export const createBooking = async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
  const { data, error } = await supabase
    .from("bookings")
    .insert(booking)
    .select()
    .single();
  
  return { data: data as Booking | null, error };
};
