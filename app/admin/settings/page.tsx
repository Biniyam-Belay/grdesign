"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getHeroSettings, updateHeroSettings, type HeroSettings } from "@/lib/data/settings";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/ToastProvider";
import { Save, Key, Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  const supabase = createSupabaseClient();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

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
      primary: "Top Rated • Fast Delivery",
      secondary: "Rated Designer",
      turnaround: "Fast 7-14 Day Turnaround",
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
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await getHeroSettings();
      setSettings(data);
    } catch (err) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }

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
    window.location.href = "/admin/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-900 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-neutral-200/50 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-all hover:scale-105"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="font-medium text-sm">Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-neutral-300" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <SettingsIcon className="h-5 w-5 text-white" strokeWidth={1.5} />
                </div>
                <h1 className="text-lg font-semibold text-neutral-900">Settings</h1>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 border border-neutral-300 rounded-xl hover:border-neutral-400 bg-white hover:bg-neutral-50 transition-all duration-200 hover:shadow-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-8">
          {/* Hero Settings */}
          <section className="bg-white rounded-2xl border border-neutral-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Homepage Settings</h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Control hero section content and availability status
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Hero Text */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-neutral-700">Hero Text</label>
                <div className="grid gap-4">
                  <input
                    type="text"
                    value={settings.heroText.title1}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        heroText: { ...settings.heroText, title1: e.target.value },
                      })
                    }
                    className="px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all text-neutral-900"
                    placeholder="Primary title"
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
                    className="px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all text-neutral-900"
                    placeholder="Secondary title"
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
                    className="px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all resize-none text-neutral-900"
                    placeholder="Subtitle"
                  />
                </div>
              </div>

              {/* Experience Years */}
              <div>
                <label className="text-sm font-medium text-neutral-700 block mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={settings.experienceYears}
                  onChange={(e) =>
                    setSettings({ ...settings, experienceYears: parseInt(e.target.value) || 0 })
                  }
                  className="w-32 px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all text-neutral-900"
                />
              </div>

              {/* Availability Status */}
              <div>
                <label className="text-sm font-medium text-neutral-700 block mb-3">
                  Availability Status
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "available", label: "Available", color: "green" },
                    { value: "limited", label: "Limited", color: "amber" },
                    { value: "unavailable", label: "Unavailable", color: "red" },
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
                        px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium
                        ${
                          settings.availability.status === option.value
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-200 hover:border-neutral-300 text-neutral-700"
                        }
                      `}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            option.color === "green"
                              ? "bg-green-500"
                              : option.color === "amber"
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                        />
                        {option.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Label */}
              <div>
                <label className="text-sm font-medium text-neutral-700 block mb-2">
                  Availability Label
                </label>
                <input
                  type="text"
                  value={settings.availability.label}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      availability: { ...settings.availability, label: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all text-neutral-900"
                  placeholder="e.g., Available for 1 project"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-8 pt-6 border-t border-neutral-100">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </section>

          {/* Security Settings */}
          <section className="bg-white rounded-2xl border border-neutral-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Security</h2>
                <p className="text-sm text-neutral-500 mt-1">Manage your account password</p>
              </div>
              {!showPasswordSection && (
                <button
                  onClick={() => setShowPasswordSection(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <Key className="w-4 h-4" />
                  Change Password
                </button>
              )}
            </div>

            {showPasswordSection && (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="text-sm font-medium text-neutral-700 block mb-2"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                    required
                    autoComplete="current-password"
                  />
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="text-sm font-medium text-neutral-700 block mb-2"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-neutral-500 mt-1.5">Minimum 8 characters</p>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-neutral-700 block mb-2"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>

                <div className="flex gap-3 pt-4">
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
                    className="px-4 py-2.5 text-sm font-medium text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <Key className="w-4 h-4" />
                    {changingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
