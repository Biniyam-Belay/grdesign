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
  mobileSubtitle: string;
  credentials: {
    primary: string;
    secondary: string;
    turnaround: string;
  };
  trustSignals: string[];
  urgency: {
    text: string;
    highlight: string;
  };
  limitedCapacity: {
    title: string;
    slots: string;
    period: string;
  };
}

export async function getHeroSettings(): Promise<HeroSettings> {
  const supabase = createSupabaseClient();

  const [
    availabilityRes,
    experienceRes,
    heroTextRes,
    mobileSubtitleRes,
    credentialsRes,
    trustSignalsRes,
    urgencyRes,
    limitedCapacityRes,
  ] = await Promise.all([
    supabase.from("site_settings").select("value").eq("key", "hero_availability").single(),
    supabase.from("site_settings").select("value").eq("key", "hero_experience_years").single(),
    supabase.from("site_settings").select("value").eq("key", "hero_text").single(),
    supabase.from("site_settings").select("value").eq("key", "hero_mobile_subtitle").single(),
    supabase.from("site_settings").select("value").eq("key", "hero_credentials").single(),
    supabase.from("site_settings").select("value").eq("key", "hero_trust_signals").single(),
    supabase.from("site_settings").select("value").eq("key", "hero_urgency").single(),
    supabase.from("site_settings").select("value").eq("key", "hero_limited_capacity").single(),
  ]);

  return {
    availability: availabilityRes.data?.value || {
      status: "available",
      label: "Available Now on Upwork",
    },
    experienceYears: experienceRes.data?.value?.years || 3,
    heroText: heroTextRes.data?.value || {
      kicker: "Professional Design Services",
      title1: "Hire Expert Designer",
      title2: "That Delivers Results",
      subtitle:
        "Professional graphic designer specializing in branding, social media, and web design — trusted by agencies, startups, and organizations for fast, quality delivery.",
    },
    mobileSubtitle:
      mobileSubtitleRes.data?.value?.text ||
      "Professional designer delivering graphic design, branding, social media content, and web solutions — perfect for agencies, startups, and HR teams hiring top talent.",
    credentials: credentialsRes.data?.value || {
      primary: "Top Rated • Fast Delivery",
      secondary: "Rated Designer",
      turnaround: "Fast 7-14 Day Turnaround",
    },
    trustSignals: trustSignalsRes.data?.value?.items || [
      "Quality guarantee",
      "Same-day response",
      "Revision-friendly",
    ],
    urgency: urgencyRes.data?.value || {
      text: "Perfect for agencies & startups",
      highlight: "Same-day response",
    },
    limitedCapacity: limitedCapacityRes.data?.value || {
      title: "Limited Capacity",
      slots: "3 project slots",
      period: "this month",
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
