// @ts-nocheck
import { supabase } from "@/integrations/supabase/client";
import type { Product, Service, Barber, TimeSlot, DiscountCoupon, UserRole } from "@/types/database";

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
