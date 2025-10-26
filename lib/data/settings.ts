import { createSupabaseClient } from "@/lib/supabase/client";

export interface HeroSettings {
  availability: {
    status: "available" | "unavailable" | "limited";
    label: string;
  };
  experienceYears: number;
  heroText: {
    kicker: string;
    title1: string;
    title2: string;
    subtitle: string;
  };
}

export async function getHeroSettings(): Promise<HeroSettings> {
  const supabase = createSupabaseClient();

  const [availabilityRes, experienceRes, heroTextRes] = await Promise.all([
    supabase.from("site_settings").select("value").eq("key", "hero_availability").single(),
    supabase.from("site_settings").select("value").eq("key", "hero_experience_years").single(),
    supabase.from("site_settings").select("value").eq("key", "hero_text").single(),
  ]);

  return {
    availability: availabilityRes.data?.value || {
      status: "available",
      label: "Available for 1 project",
    },
    experienceYears: experienceRes.data?.value?.years || 3,
    heroText: heroTextRes.data?.value || {
      kicker: "Portfolio",
      title1: "Graphic Designer",
      title2: "Web Developer",
      subtitle: "Thoughtful identities & calm interfaces. Available for select work.",
    },
  };
}

export async function updateHeroSettings(settings: Partial<HeroSettings>): Promise<void> {
  const supabase = createSupabaseClient();

  const updates: Promise<{
    data: unknown;
    error: unknown;
  }>[] = [];

  if (settings.availability) {
    updates.push(
      supabase
        .from("site_settings")
        .update({ value: settings.availability })
        .eq("key", "hero_availability"),
    );
  }

  if (settings.experienceYears !== undefined) {
    updates.push(
      supabase
        .from("site_settings")
        .update({ value: { years: settings.experienceYears } })
        .eq("key", "hero_experience_years"),
    );
  }

  if (settings.heroText) {
    updates.push(
      supabase.from("site_settings").update({ value: settings.heroText }).eq("key", "hero_text"),
    );
  }

  await Promise.all(updates);
}
