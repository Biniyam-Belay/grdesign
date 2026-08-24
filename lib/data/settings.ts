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
  clientLogosText: {
    tagline: string;
    title: string;
  };
  capabilitiesIntro: {
    tagline: string;
    maintext: string;
    subtext: string;
  };
  banner: {
    text: string;
    cta_text: string;
    cta_link: string;
    enabled: boolean;
  };
  heroBanner: {
    desktopImage: string;
    mobileImage: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    bookingLink: string;
  };
  socialLinks: {
    instagram: string;
    linkedin: string;
    dribbble: string;
    behance: string;
  };
}

const HERO_SETTINGS_CACHE_KEY = "ilaala.hero-settings-cache.v1";
const HERO_SETTINGS_CACHE_TTL = 1000 * 60 * 60 * 6;

interface HeroSettingsCachePayload {
  timestamp: number;
  data: HeroSettings;
}

let inFlightHeroSettingsPromise: Promise<HeroSettings> | null = null;

function readHeroSettingsCache(allowExpired = false): HeroSettings | null {
  if (typeof window === "undefined") return null;

  try {
    const rawCache = window.localStorage.getItem(HERO_SETTINGS_CACHE_KEY);
    if (!rawCache) return null;

    const parsedCache = JSON.parse(rawCache) as Partial<HeroSettingsCachePayload>;
    if (!parsedCache?.data || typeof parsedCache.timestamp !== "number") return null;

    const isExpired = Date.now() - parsedCache.timestamp > HERO_SETTINGS_CACHE_TTL;
    if (isExpired && !allowExpired) return null;

    return parsedCache.data;
  } catch {
    return null;
  }
}

function writeHeroSettingsCache(settings: HeroSettings): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      HERO_SETTINGS_CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), data: settings }),
    );
  } catch {
    // Ignore storage quota and privacy mode failures.
  }
}

function clearHeroSettingsCache(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(HERO_SETTINGS_CACHE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

export async function getHeroSettings(): Promise<HeroSettings> {
  const cachedSettings = readHeroSettingsCache();
  if (cachedSettings) {
    return cachedSettings;
  }

  if (inFlightHeroSettingsPromise) {
    return inFlightHeroSettingsPromise;
  }

  inFlightHeroSettingsPromise = (async () => {
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
      clientLogosRes,
      capabilitiesIntroRes,
      heroBannerRes,
      contactInfoRes,
      socialLinksRes,
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
      supabase.from("site_settings").select("value").eq("key", "home_client_logos").single(),
      supabase.from("site_settings").select("value").eq("key", "home_capabilities_intro").single(),
      supabase.from("site_settings").select("value").eq("key", "hero_banner_images").single(),
      supabase.from("site_settings").select("value").eq("key", "contact_info").single(),
      supabase.from("site_settings").select("value").eq("key", "social_links").single(),
    ]);

    const settings: HeroSettings = {
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
      clientLogosText: clientLogosRes.data?.value || {
        tagline: "Trusted By",
        title: "Proud to work with visionary brands.",
      },
      capabilitiesIntro: capabilitiesIntroRes.data?.value || {
        tagline: "Capabilities",
        maintext:
          'We architect complete **visual systems**, **digital products**, and **brand narratives** for those who <span class="text-[#FF0033] font-bold">refuse to be ordinary.</span>',
        subtext:
          "Merging strategic rigor with relentless art direction. We deliver cohesive branding and high-performance digital experiences that command attention.",
      },
      banner: bannerRes.data?.value || {
        text: "",
        cta_text: "",
        cta_link: "",
        enabled: false,
      },
      heroBanner: heroBannerRes.data?.value || {
        desktopImage: "",
        mobileImage: "",
      },
      contactInfo: contactInfoRes.data?.value || {
        email: "biniyam.be.go@gmail.com",
        phone: "+251 911 234 567",
        bookingLink: "https://calendar.app.google/1RTjShD5sgqBmm3K7",
      },
      socialLinks: socialLinksRes.data?.value || {
        instagram: "https://www.instagram.com/bini.b.g?igsh=enp4OTM1NDU5YjNj",
        linkedin: "https://www.linkedin.com/in/biniyam-belay-147673270/",
        dribbble: "https://dribbble.com/bini-yam",
        behance: "https://www.behance.net/biniyambelay",
      },
    };

    writeHeroSettingsCache(settings);
    return settings;
  })();

  try {
    return await inFlightHeroSettingsPromise;
  } catch (error) {
    const staleSettings = readHeroSettingsCache(true);
    if (staleSettings) {
      return staleSettings;
    }

    throw error;
  } finally {
    inFlightHeroSettingsPromise = null;
  }
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

  if (settings.clientLogosText) {
    updates.push(
      supabase
        .from("site_settings")
        .upsert(
          { key: "home_client_logos", value: settings.clientLogosText },
          { onConflict: "key" },
        ),
    );
  }

  if (settings.capabilitiesIntro) {
    updates.push(
      supabase
        .from("site_settings")
        .upsert(
          { key: "home_capabilities_intro", value: settings.capabilitiesIntro },
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

  if (settings.heroBanner) {
    updates.push(
      supabase
        .from("site_settings")
        .upsert({ key: "hero_banner_images", value: settings.heroBanner }, { onConflict: "key" }),
    );
  }

  if (settings.contactInfo) {
    updates.push(
      supabase
        .from("site_settings")
        .upsert({ key: "contact_info", value: settings.contactInfo }, { onConflict: "key" }),
    );
  }

  if (settings.socialLinks) {
    updates.push(
      supabase
        .from("site_settings")
        .upsert({ key: "social_links", value: settings.socialLinks }, { onConflict: "key" }),
    );
  }

  const results = await Promise.all(updates);
  results.forEach(({ error }) => {
    if (error) {
      console.error("Error updating settings:", error);
      throw new Error("Failed to update one or more settings.");
    }
  });

  clearHeroSettingsCache();
}
