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
  banner: {
    text: string;
    cta_text: string;
    cta_link: string;
    enabled: boolean;
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
    bannerRes,
  ] = await Promise.all([
    supabase.from("site_settings").select("value").eq("key", "hero_availability").single(),
    supabase.from("site_settings").select("value").eq("key", "hero_experience_years").single(),
    supabase.from("site_settings").select("value").eq("key", "hero_text").single(),
    supabase.from("site_settings").select("value").eq("key", "hero_mobile_subtitle").single(),
    supabase.from("site_settings").select("value").eq("key", "hero_credentials").single(),
    supabase.from("site_settings").select("value").eq("key", "hero_trust_signals").single(),
    supabase.from("site_settings").select("value").eq("key", "hero_urgency").single(),
    supabase.from("site_settings").select("value").eq("key", "hero_limited_capacity").single(),
    supabase.from("site_settings").select("value").eq("key", "banner").single(),
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
      primary: "High Quality, Fast Turnaround",
      secondary: "Rated Designer",
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
    banner: bannerRes.data?.value || {
      text: "",
      cta_text: "",
      cta_link: "",
      enabled: false,
    },
  };
}

export async function updateHeroSettings(settings: Partial<HeroSettings>): Promise<void> {
  const supabase = createSupabaseClient();

  const updates: Promise<{ error?: unknown; data?: unknown }>[] = [];

  if (settings.availability) {
    updates.push(
      supabase
        .from("site_settings")
        .upsert({ key: "hero_availability", value: settings.availability }, { onConflict: "key" }),
    );
  }

  if (settings.experienceYears !== undefined) {
    updates.push(
      supabase
        .from("site_settings")
        .upsert(
          { key: "hero_experience_years", value: { years: settings.experienceYears } },
          { onConflict: "key" },
        ),
    );
  }

  if (settings.heroText) {
    updates.push(
      supabase
        .from("site_settings")
        .upsert({ key: "hero_text", value: settings.heroText }, { onConflict: "key" }),
    );
  }

  if (settings.mobileSubtitle) {
    updates.push(
      supabase
        .from("site_settings")
        .upsert(
          { key: "hero_mobile_subtitle", value: { text: settings.mobileSubtitle } },
          { onConflict: "key" },
        ),
    );
  }

  if (settings.credentials) {
    updates.push(
      supabase
        .from("site_settings")
        .upsert({ key: "hero_credentials", value: settings.credentials }, { onConflict: "key" }),
    );
  }

  if (settings.trustSignals) {
    updates.push(
      supabase
        .from("site_settings")
        .upsert(
          { key: "hero_trust_signals", value: { items: settings.trustSignals } },
          { onConflict: "key" },
        ),
    );
  }

  if (settings.urgency) {
    updates.push(
      supabase
        .from("site_settings")
        .upsert({ key: "hero_urgency", value: settings.urgency }, { onConflict: "key" }),
    );
  }

  if (settings.limitedCapacity) {
    updates.push(
      supabase
        .from("site_settings")
        .upsert(
          { key: "hero_limited_capacity", value: settings.limitedCapacity },
          { onConflict: "key" },
        ),
    );
  }

  if (settings.banner) {
    updates.push(
      supabase
        .from("site_settings")
        .upsert({ key: "banner", value: settings.banner }, { onConflict: "key" }),
    );
  }

  const results = await Promise.all(updates);
  results.forEach(({ error }) => {
    if (error) {
      console.error("Error updating settings:", error);
      throw new Error("Failed to update one or more settings.");
    }
  });
}
