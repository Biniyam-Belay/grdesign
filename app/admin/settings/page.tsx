"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getHeroSettings, updateHeroSettings, type HeroSettings } from "@/lib/data/settings";
import { createSupabaseClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const supabase = createSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [settings, setSettings] = useState<HeroSettings>({
    availability: { status: "available", label: "Available for 1 project" },
    experienceYears: 3,
    heroText: {
      kicker: "Portfolio",
      title1: "Graphic Designer",
      title2: "Web Developer",
      subtitle: "Thoughtful identities & calm interfaces. Available for select work.",
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await getHeroSettings();
      setSettings(data);
    } catch (err) {
      setError("Failed to load settings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateHeroSettings(settings);

      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="text-sm font-medium">Back to Admin</span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-800 font-medium">{success}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-neutral-900">Hero Settings</h1>
            <p className="text-sm text-neutral-600 mt-2">
              Manage your homepage hero section settings
            </p>
          </div>

          <div className="space-y-8">
            {/* Hero Text Section */}
            <div className="space-y-6 pb-8 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">Hero Text Content</h2>

              {/* Kicker Text */}
              <div>
                <label htmlFor="kicker" className="block text-sm font-medium text-neutral-700 mb-2">
                  Kicker Text
                </label>
                <input
                  type="text"
                  id="kicker"
                  value={settings.heroText.kicker}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      heroText: { ...settings.heroText, kicker: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
                  placeholder="Portfolio"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Small uppercase text at the top (e.g., "Portfolio - 2025")
                </p>
              </div>

              {/* Title Line 1 */}
              <div>
                <label htmlFor="title1" className="block text-sm font-medium text-neutral-700 mb-2">
                  Title Line 1
                </label>
                <input
                  type="text"
                  id="title1"
                  value={settings.heroText.title1}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      heroText: { ...settings.heroText, title1: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
                  placeholder="Graphic Designer"
                />
              </div>

              {/* Title Line 2 */}
              <div>
                <label htmlFor="title2" className="block text-sm font-medium text-neutral-700 mb-2">
                  Title Line 2
                </label>
                <input
                  type="text"
                  id="title2"
                  value={settings.heroText.title2}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      heroText: { ...settings.heroText, title2: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
                  placeholder="Web Developer"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label
                  htmlFor="subtitle"
                  className="block text-sm font-medium text-neutral-700 mb-2"
                >
                  Subtitle
                </label>
                <textarea
                  id="subtitle"
                  rows={3}
                  value={settings.heroText.subtitle}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      heroText: { ...settings.heroText, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
                  placeholder="Thoughtful identities & calm interfaces. Available for select work."
                />
              </div>
            </div>

            {/* Experience Years */}
            <div>
              <label htmlFor="years" className="block text-sm font-medium text-neutral-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                id="years"
                min="0"
                max="50"
                value={settings.experienceYears}
                onChange={(e) =>
                  setSettings({ ...settings, experienceYears: parseInt(e.target.value) || 0 })
                }
                className="w-full max-w-xs px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
                placeholder="3"
              />
              <p className="text-xs text-neutral-500 mt-1">Displays in the circular stamp badge</p>
            </div>

            {/* Availability Status */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Availability Status
              </label>
              <div className="flex gap-3">
                {[
                  { value: "available", label: "Available", color: "green" },
                  { value: "limited", label: "Limited", color: "amber" },
                  { value: "unavailable", label: "Unavailable", color: "red" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setSettings({
                        ...settings,
                        availability: {
                          ...settings.availability,
                          status: option.value as "available" | "limited" | "unavailable",
                        },
                      })
                    }
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      settings.availability.status === option.value
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
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
              <label htmlFor="label" className="block text-sm font-medium text-neutral-700 mb-2">
                Availability Label
              </label>
              <input
                type="text"
                id="label"
                value={settings.availability.label}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    availability: { ...settings.availability, label: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
                placeholder="Available for 1 project"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Custom message displayed in the availability badge
              </p>
            </div>

            {/* Preview */}
            <div className="pt-6 border-t border-neutral-200">
              <h3 className="text-sm font-medium text-neutral-700 mb-4">Preview</h3>
              <div className="flex items-start gap-8 p-6 bg-neutral-50 rounded-lg">
                {/* Experience Badge Preview */}
                <div className="relative">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-neutral-300" />
                    <div className="absolute inset-2 rounded-full border border-neutral-200 bg-white" />
                    <div className="relative z-10 text-center">
                      <div className="text-3xl font-bold text-neutral-900 leading-none">
                        {settings.experienceYears}
                      </div>
                      <div className="text-[9px] uppercase tracking-wider text-neutral-500 mt-1">
                        Years
                      </div>
                    </div>
                  </div>
                </div>

                {/* Availability Badge Preview */}
                <div className="px-4 py-2.5 rounded-full border border-neutral-200 bg-white">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-2 w-2 rounded-full ${
                        settings.availability.status === "available"
                          ? "bg-green-500"
                          : settings.availability.status === "limited"
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm font-medium whitespace-nowrap">
                      {settings.availability.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-neutral-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
