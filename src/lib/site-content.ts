import { supabase } from "./supabase";

interface SiteContent {
  [section: string]: Record<string, string>;
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const { data } = await supabase.from("site_content").select("*");
    if (!data) return {};

    const grouped: SiteContent = {};
    for (const entry of data) {
      if (!grouped[entry.section]) grouped[entry.section] = {};
      grouped[entry.section][entry.key] = entry.value;
    }
    return grouped;
  } catch {
    return {};
  }
}

export async function getMenuItems() {
  try {
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .eq("available", true)
      .order("sort_order");
    return data || [];
  } catch {
    return [];
  }
}

export async function getReviews() {
  try {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    return data || [];
  } catch {
    return [];
  }
}

export async function getWeeklySpecials() {
  try {
    const { data } = await supabase
      .from("weekly_specials")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    return data || [];
  } catch {
    return [];
  }
}

export async function getServiceAreas() {
  try {
    const { data } = await supabase
      .from("service_areas")
      .select("*")
      .order("name");
    return data || [];
  } catch {
    return [];
  }
}
