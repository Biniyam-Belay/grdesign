"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getHeroSettings, updateHeroSettings, type HeroSettings } from "@/lib/data/settings";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/ToastProvider";
import { Save, Key, Settings as SettingsIcon, ImageIcon, Globe } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

export default function SettingsPage() {
  const supabase = createSupabaseClient();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [settings, setSettings] = useState<HeroSettings>({
    availability: { status: "available", label: "Available for 1 project" },
    experienceYears: 3,
    heroText: {
      kicker: "Portfolio",
      title1: "Graphic Designer",
      title2: "Web Developer",
      subtitle: "Thoughtful identities & calm interfaces. Available for select work.",
    },
    mobileSubtitle:
      "Professional designer delivering graphic design, branding, social media content, and web solutions — perfect for agencies, startups, and HR teams hiring top talent.",
    credentials: {
      primary: "Rated Designer • Fast Delivery",
      secondary: "Rated Designer",
      turnaround: "Fast 7-14 Day Turnaround For Long Term Projects",
    },
    trustSignals: ["Quality guarantee", "Same-day response", "Revision-friendly"],
    urgency: {
      text: "Perfect for agencies & startups",
      highlight: "Same-day response",
    },
    limitedCapacity: {
      title: "Limited Capacity",
      slots: "3 project slots",
      period: "this month",
    },
    banner: {
      text: "",
      cta_text: "",
      cta_link: "",
      enabled: false,
    },
    clientLogosText: { tagline: "Trusted By", title: "Proud to work with visionary brands." },
    capabilitiesIntro: {
      tagline: "Capabilities",
      maintext: "We architect complete visual systems",
      subtext: "Merging strategic rigor with relentless art direction.",
    },
    heroBanner: {
      desktopImage: "",
      mobileImage: "",
    },
    contactInfo: {
      email: "biniyam.be.go@gmail.com",
      phone: "+251 911 234 567",
      bookingLink: "https://calendar.app.google/1RTjShD5sgqBmm3K7",
    },
    socialLinks: {
      instagram: "",
      linkedin: "",
      dribbble: "",
      behance: "",
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const loadSettings = useCallback(async () => {
    try {
      const data = await getHeroSettings();
      setSettings(data);
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    setMounted(true);
    loadSettings();
  }, [loadSettings]);

  async function handleSave() {
    try {
      setSaving(true);
      await updateHeroSettings(settings);
      toast.success("Settings saved successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();

    try {
      setChangingPassword(true);

      if (passwordData.newPassword.length < 8) {
        toast.error("New password must be at least 8 characters long");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const user = (await supabase.auth.getUser()).data.user;
      if (!user?.email) {
        toast.error("User not found");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordData.currentPassword,
      });

      if (signInError) {
        toast.error("Current password is incorrect");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (updateError) {
        toast.error(updateError.message);
        return;
      }

      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordSection(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/studio/login";
  };

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0B132B] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#0B132B] font-sans selection:bg-[#FF0033]/20 pb-20">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 -left-20 w-[50vh] h-[50vh] bg-[#0055FF]/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[50vh] h-[50vh] bg-[#FF0033]/5 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#F5F5F0]/80 backdrop-blur-xl border-b border-[#0B132B]/10">
        <div className="mx-auto max-w-8xl px-6 lg:px-12">
          <div className="flex h-[72px] items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/studio"
                className="inline-flex items-baseline gap-0.5 text-xl tracking-tight transition-opacity hover:opacity-80"
              >
                <span className="font-bold text-[#0B132B]">Ilaala</span>
                <span className="font-bold text-[#FF0033]">.Studio</span>
              </Link>
              <div className="hidden md:flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-[#0B132B]/30" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#0B132B]/50 font-bold">
                  Dashboard
                </span>
                <div className="h-1.5 w-1.5 rounded-full bg-[#0B132B]/30" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#FF0033] font-bold">
                  Settings
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/40 rounded-full border border-[#0B132B]/10 hover:bg-white transition-colors cursor-default">
                <div className="h-2 w-2 rounded-full bg-[#FF0033] animate-pulse" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#0B132B]/70">
                  Admin Active
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 group hover:text-[#FF0033] transition-colors p-2"
                title="Sign Out"
              >
                <svg
                  className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-8xl px-6 lg:px-12 py-12 lg:py-16">
        <div
          className={`mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="h-12 w-[3px] bg-gradient-to-b from-[#0B132B] to-[#FF0033]" />
              <h1 className="text-4xl md:text-5xl font-light tracking-[-0.03em] text-[#0B132B]">
                Settings<span className="font-semibold text-[#FF0033]">.</span>
              </h1>
            </div>
            <p className="text-[#0B132B]/50 font-light text-lg ml-5 max-w-2xl">
              Control your website's content and availability status.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#FF0033] hover:bg-[#D50029] hover:shadow-[0_10px_40px_rgba(255,0,51,0.25)] text-white text-[10px] uppercase font-bold tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto hover:-translate-y-0.5"
          >
            <div className="relative">
              <Save className="w-4 h-4" />
              <div className="absolute inset-0 bg-white/20 blur-md rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT COLUMN: Homepage Config (Wider) */}
          <div className="col-span-1 xl:col-span-7 2xl:col-span-8 space-y-6 lg:space-y-8">
            <section className="bg-white/50 backdrop-blur-sm border border-[#0B132B]/10 p-8 lg:p-10 transition-all duration-500 hover:bg-white hover:border-[#0055FF]/30 hover:shadow-[0_20px_60px_-15px_rgba(0,85,255,0.05)]">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-8 w-8 bg-[#0B132B]/5 flex items-center justify-center text-[#0B132B]/60">
                  <SettingsIcon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-medium tracking-tight text-[#0B132B] leading-none">
                    Homepage Settings
                  </h2>
                  <p className="text-xs font-light text-[#0B132B]/50 mt-2 tracking-wide">
                    Control hero section content and availability status.
                  </p>
                </div>
              </div>

              <div className="space-y-10">
                {/* Hero Messaging (Grid inside) */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/70 flex items-center gap-3">
                    <span className="h-[1px] w-4 bg-[#0B132B]/20"></span> Hero Text
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={settings.heroText.kicker}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          heroText: { ...settings.heroText, kicker: e.target.value },
                        })
                      }
                      className="col-span-1 bg-white border border-[#0B132B]/10 px-4 py-3.5 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 focus:ring-1 focus:ring-[#0055FF]/20 transition-all hover:border-[#0B132B]/30"
                      placeholder="Kicker text (e.g. Portfolio)"
                    />
                    <div className="hidden md:block"></div>{" "}
                    {/* Spacer for alignment if desired, or skip */}
                    <input
                      type="text"
                      value={settings.heroText.title1}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          heroText: { ...settings.heroText, title1: e.target.value },
                        })
                      }
                      className="col-span-1 bg-white border border-[#0B132B]/10 px-4 py-3.5 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 focus:ring-1 focus:ring-[#0055FF]/20 transition-all hover:border-[#0B132B]/30"
                      placeholder="Primary Title"
                    />
                    <input
                      type="text"
                      value={settings.heroText.title2}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          heroText: { ...settings.heroText, title2: e.target.value },
                        })
                      }
                      className="col-span-1 bg-white border border-[#0B132B]/10 px-4 py-3.5 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 focus:ring-1 focus:ring-[#0055FF]/20 transition-all hover:border-[#0B132B]/30"
                      placeholder="Secondary Title"
                    />
                    <textarea
                      value={settings.heroText.subtitle}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          heroText: { ...settings.heroText, subtitle: e.target.value },
                        })
                      }
                      rows={2}
                      className="col-span-1 md:col-span-2 bg-white border border-[#0B132B]/10 px-4 py-3.5 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 focus:ring-1 focus:ring-[#0055FF]/20 transition-all resize-none hover:border-[#0B132B]/30"
                      placeholder="Desktop Subtitle"
                    />
                    <textarea
                      value={settings.mobileSubtitle}
                      onChange={(e) => setSettings({ ...settings, mobileSubtitle: e.target.value })}
                      rows={2}
                      className="col-span-1 md:col-span-2 bg-white border border-[#0B132B]/10 px-4 py-3.5 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 focus:ring-1 focus:ring-[#0055FF]/20 transition-all resize-none hover:border-[#0B132B]/30"
                      placeholder="Mobile Viewport Subtitle"
                    />
                  </div>
                </div>

                {/* Performance & Capacity Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 border-t border-[#0B132B]/5">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/70 flex items-center gap-3">
                      <span className="h-[1px] w-4 bg-[#0B132B]/20"></span> Limited Capacity
                    </label>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={settings.limitedCapacity.title}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            limitedCapacity: { ...settings.limitedCapacity, title: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors"
                        placeholder="Status Label (Limited Capacity)"
                      />
                      <input
                        type="text"
                        value={settings.limitedCapacity.slots}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            limitedCapacity: { ...settings.limitedCapacity, slots: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors"
                        placeholder="Slot Count (e.g. 3 project slots)"
                      />
                      <input
                        type="text"
                        value={settings.limitedCapacity.period}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            limitedCapacity: {
                              ...settings.limitedCapacity,
                              period: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors"
                        placeholder="Timeframe (e.g. this month)"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/70 flex items-center gap-3">
                      <span className="h-[1px] w-4 bg-[#0B132B]/20"></span> Credentials
                    </label>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={settings.credentials.primary}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            credentials: { ...settings.credentials, primary: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors"
                        placeholder="Primary Credential"
                      />
                      <input
                        type="text"
                        value={settings.credentials.secondary}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            credentials: { ...settings.credentials, secondary: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors"
                        placeholder="Secondary Badge"
                      />
                      <input
                        type="text"
                        value={settings.credentials.turnaround}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            credentials: { ...settings.credentials, turnaround: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors"
                        placeholder="Turnaround Time"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/70 flex items-center gap-3">
                      <span className="h-[1px] w-4 bg-[#0B132B]/20"></span> Urgency
                    </label>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={settings.urgency.text}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            urgency: { ...settings.urgency, text: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors"
                        placeholder="Urgency Phrase"
                      />
                      <input
                        type="text"
                        value={settings.urgency.highlight}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            urgency: { ...settings.urgency, highlight: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors"
                        placeholder="Highlight Word"
                      />
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/50 block mb-2 mt-4">
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={settings.experienceYears}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              experienceYears: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Signals & Availability (Grid 2-col) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#0B132B]/5">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/70 flex items-center gap-3 mb-3">
                      <span className="h-[1px] w-4 bg-[#0B132B]/20"></span> Trust Signals
                    </label>
                    <textarea
                      value={settings.trustSignals.join("\n")}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          trustSignals: e.target.value.split("\n").map((s) => s.trim()),
                        })
                      }
                      rows={5}
                      className="w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors resize-none leading-relaxed"
                      placeholder="Trust signals (one per line)"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/70 flex items-center gap-3 mb-3">
                      <span className="h-[1px] w-4 bg-[#0B132B]/20"></span> Availability Status
                    </label>
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        value={settings.availability.label}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            availability: { ...settings.availability, label: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors"
                        placeholder="e.g., Available for 1 project"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: "available", label: "Open", hex: "#00E054" },
                          { value: "limited", label: "Lim", hex: "#FFB000" },
                          { value: "unavailable", label: "Closed", hex: "#FF0033" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              setSettings({
                                ...settings,
                                availability: {
                                  ...settings.availability,
                                  status: option.value as "available" | "limited" | "unavailable",
                                },
                              })
                            }
                            className={`
                                 py-3 border transition-all text-[10px] font-bold uppercase tracking-widest flex justify-center items-center gap-2 relative overflow-hidden
                                 ${
                                   settings.availability.status === option.value
                                     ? "border-[#0B132B] bg-[#0B132B] text-white"
                                     : "border-[#0B132B]/10 bg-white/50 text-[#0B132B]/60 hover:bg-white hover:border-[#0B132B]/30"
                                 }
                              `}
                          >
                            <span
                              className="inline-block w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: option.hex }}
                            />
                            <span className="relative z-10">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact & Socials */}
            <section className="bg-white/50 backdrop-blur-sm border border-[#0B132B]/10 p-8 lg:p-10 transition-all duration-500 hover:bg-white hover:border-[#0055FF]/30 hover:shadow-[0_20px_60px_-15px_rgba(0,85,255,0.05)]">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-8 w-8 bg-[#0055FF]/5 flex items-center justify-center text-[#0055FF]">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-medium tracking-tight text-[#0B132B] leading-none">
                    Contact & Socials
                  </h2>
                  <p className="text-xs font-light text-[#0B132B]/50 mt-2 tracking-wide">
                    Manage contact details and social media links displayed on the site.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/70 flex items-center gap-3">
                      <span className="h-[1px] w-4 bg-[#0B132B]/20"></span> Email Address
                    </label>
                    <input
                      type="email"
                      value={settings.contactInfo.email}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contactInfo: { ...settings.contactInfo, email: e.target.value },
                        })
                      }
                      className="w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors"
                      placeholder="hello@example.com"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/70 flex items-center gap-3">
                      <span className="h-[1px] w-4 bg-[#0B132B]/20"></span> Phone Number
                    </label>
                    <input
                      type="text"
                      value={settings.contactInfo.phone}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contactInfo: { ...settings.contactInfo, phone: e.target.value },
                        })
                      }
                      className="w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/70 flex items-center gap-3">
                      <span className="h-[1px] w-4 bg-[#0B132B]/20"></span> Booking / CTA Link
                    </label>
                    <input
                      type="url"
                      value={settings.contactInfo.bookingLink}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contactInfo: { ...settings.contactInfo, bookingLink: e.target.value },
                        })
                      }
                      className="w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors font-mono text-xs"
                      placeholder="https://calendly.com/..."
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-4 border-t border-[#0B132B]/5">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/70 flex items-center gap-3 mb-4">
                    <span className="h-[1px] w-4 bg-[#0B132B]/20"></span> Social Links
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-[#0B132B]/30">
                        IG
                      </span>
                      <input
                        type="url"
                        value={settings.socialLinks.instagram}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            socialLinks: { ...settings.socialLinks, instagram: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#0B132B]/10 pl-12 pr-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-[#0B132B]/30">
                        LI
                      </span>
                      <input
                        type="url"
                        value={settings.socialLinks.linkedin}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#0B132B]/10 pl-12 pr-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-[#0B132B]/30">
                        DR
                      </span>
                      <input
                        type="url"
                        value={settings.socialLinks.dribbble}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            socialLinks: { ...settings.socialLinks, dribbble: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#0B132B]/10 pl-12 pr-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors"
                        placeholder="https://dribbble.com/..."
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-[#0B132B]/30">
                        BE
                      </span>
                      <input
                        type="url"
                        value={settings.socialLinks.behance}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            socialLinks: { ...settings.socialLinks, behance: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#0B132B]/10 pl-12 pr-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors"
                        placeholder="https://behance.net/..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Terminal Access (Security) */}
            <section className="bg-white/50 backdrop-blur-sm border border-[#0B132B]/10 p-8 lg:p-10 transition-all duration-500 hover:bg-white hover:border-[#0B132B]/50 hover:shadow-[0_20px_60px_-15px_rgba(11,19,43,0.1)]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-medium tracking-tight text-[#0B132B] leading-none">
                    Security
                  </h2>
                  <p className="text-xs font-light text-[#0B132B]/50 mt-2 tracking-wide">
                    Manage your account password.
                  </p>
                </div>
                {!showPasswordSection && (
                  <button
                    onClick={() => setShowPasswordSection(true)}
                    className="flex items-center gap-2 px-4 py-2 text-[9px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/60 hover:text-white border border-[#0B132B]/10 hover:bg-[#0B132B] hover:border-[#0B132B] transition-all whitespace-nowrap"
                  >
                    <Key className="w-3.5 h-3.5" /> Change Password
                  </button>
                )}
              </div>

              {showPasswordSection && (
                <form
                  onSubmit={handlePasswordChange}
                  className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500"
                >
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/70 block mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      className="w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0B132B]/80 transition-colors font-mono tracking-widest placeholder:font-sans placeholder:tracking-normal"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/70 block mb-2">
                      New Password (min 8 characters)
                    </label>
                    <input
                      type="password"
                      placeholder="New Password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      className="w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0B132B]/80 transition-colors font-mono tracking-widest placeholder:font-sans placeholder:tracking-normal"
                      required
                      minLength={8}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/70 block mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      className="w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0B132B]/80 transition-colors font-mono tracking-widest placeholder:font-sans placeholder:tracking-normal"
                      required
                      minLength={8}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordSection(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="flex-1 py-3 text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/50 border border-[#0B132B]/10 hover:bg-white hover:text-[#0B132B] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="flex-1 bg-[#0B132B] hover:bg-black text-white py-3 text-[10px] uppercase font-bold tracking-[0.2em] transition-all disabled:opacity-50"
                    >
                      {changingPassword ? "..." : "Update Password"}
                    </button>
                  </div>
                </form>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN: Brand Imagery, Marquee, Terminal (Narrower) */}
          <div className="col-span-1 xl:col-span-5 2xl:col-span-4 space-y-6 lg:space-y-8">
            {/* Hero Brand Imagery */}
            <section className="bg-white/50 backdrop-blur-sm border border-[#0B132B]/10 p-8 lg:p-10 transition-all duration-500 hover:bg-white hover:border-[#FF0033]/30 hover:shadow-[0_20px_60px_-15px_rgba(255,0,51,0.05)]">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-8 w-8 bg-[#FF0033]/5 flex items-center justify-center text-[#FF0033]">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-medium tracking-tight text-[#0B132B] leading-none">
                    Hero Banner Images
                  </h2>
                  <p className="text-xs font-light text-[#0B132B]/50 mt-2 tracking-wide">
                    Upload separate poster images for desktop and mobile views.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/80 flex items-center gap-2">
                      <span className="h-[1px] w-3 bg-[#FF0033]"></span> Desktop Banner
                    </span>
                    <span className="text-[9px] font-mono text-[#0B132B]/40">16:10 | 2.5K</span>
                  </div>
                  <ImageUpload
                    bucket="site-assets"
                    label=""
                    value={settings.heroBanner.desktopImage}
                    onChange={(url) =>
                      setSettings({
                        ...settings,
                        heroBanner: { ...settings.heroBanner, desktopImage: url },
                      })
                    }
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/80 flex items-center gap-2">
                      <span className="h-[1px] w-3 bg-[#FF0033]"></span> Mobile Banner
                    </span>
                    <span className="text-[9px] font-mono text-[#0B132B]/40">9:16 | 1080p</span>
                  </div>
                  <ImageUpload
                    bucket="site-assets"
                    label=""
                    value={settings.heroBanner.mobileImage}
                    onChange={(url) =>
                      setSettings({
                        ...settings,
                        heroBanner: { ...settings.heroBanner, mobileImage: url },
                      })
                    }
                  />
                </div>
              </div>

              <div className="mt-8 p-5 bg-white border border-[#0B132B]/10 flex gap-4 items-start">
                <svg
                  className="w-5 h-5 text-[#0055FF] flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-light text-[#0B132B]/70 leading-relaxed">
                  <span className="font-semibold text-[#0B132B]">Fallback:</span> If no images are
                  uploaded, the hero section will display the default abstract artwork.
                </p>
              </div>
            </section>

            {/* Marquee Ticker */}
            <section className="bg-white/50 backdrop-blur-sm border border-[#0B132B]/10 p-8 lg:p-10 transition-all duration-500 hover:bg-white hover:border-[#0055FF]/30 hover:shadow-[0_20px_60px_-15px_rgba(0,85,255,0.05)]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-medium tracking-tight text-[#0B132B] leading-none line-clamp-1">
                    Sliding Marquee Banner
                  </h2>
                  <p className="text-xs font-light text-[#0B132B]/50 mt-2 tracking-wide">
                    Control the premium scrolling editorial text at the top of the site.
                  </p>
                </div>
                <label className="flex items-center cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.banner.enabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          banner: { ...settings.banner, enabled: e.target.checked },
                        })
                      }
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-[#0B132B]/10 border border-[#0B132B]/20 peer-checked:bg-[#0055FF] peer-checked:border-[#0055FF] transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
                  </div>
                </label>
              </div>
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/80 flex items-center gap-2">
                  <span className="h-[1px] w-3 bg-[#0055FF]"></span> Marquee Phrases
                </span>
                <textarea
                  value={settings.banner.text ? settings.banner.text.replace(/✦/g, "\n") : ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      banner: { ...settings.banner, text: e.target.value },
                    })
                  }
                  rows={5}
                  className="w-full bg-white border border-[#0B132B]/10 px-4 py-4 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors resize-none leading-relaxed"
                  placeholder="Currently taking on 4 new projects this month&#10;Reserve your spot to collaborate with us&#10;Crafting premium digital experiences"
                />
                <p className="text-[10px] font-bold tracking-widest uppercase text-[#0B132B]/40">
                  <span className="text-[#FF0033]">✦</span> Separate phrases by newline.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
