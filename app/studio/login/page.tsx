"use client";

import { useState, useEffect } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { SupabaseClient, AuthResponse } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

interface Quote {
  text: string;
  author: string;
}

const fallbackQuotes: Quote[] = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Steve Jobs",
  },
  {
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
  },
  {
    text: "Good design is obvious. Great design is transparent.",
    author: "Joe Sparano",
  },
  {
    text: "Design is intelligence made visible.",
    author: "Alina Wheeler",
  },
  {
    text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.",
    author: "Antoine de Saint-Exupéry",
  },
  {
    text: "Make it simple, but significant.",
    author: "Don Draper",
  },
  {
    text: "Every great design begins with an even better story.",
    author: "Lorinda Mamo",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [quote, setQuote] = useState<Quote>(fallbackQuotes[0]);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    // Fetch quote from API or use fallback
    const fetchQuote = async () => {
      try {
        const response = await fetch(
          "https://api.quotable.io/random?tags=technology,inspirational,success",
        );
        if (response.ok) {
          const data = await response.json();
          setQuote({ text: data.content, author: data.author });
        } else {
          // Use random fallback quote
          const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
          setQuote(randomQuote);
        }
      } catch {
        // Use random fallback quote on error
        const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        setQuote(randomQuote);
      }
    };

    fetchQuote();

    // Initialize Supabase client
    try {
      const client = createSupabaseClient();
      setSupabase(client);

      // Check if already logged in
      client.auth.getSession().then((result: AuthResponse) => {
        if (result.data?.session) {
          router.push("/studio");
        }
      });
    } catch {
      setError("Unable to initialize authentication. Please try again later.");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      setError("Authentication system not ready. Please try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setError("Session was not perspersisted. Please check browser storage permissions.");
        return;
      }

      setTimeout(() => {
        window.location.href = "/studio";
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#F5F5F0] text-[#0B132B] font-sans selection:bg-[#FF0033]/20">
      {/* Left Panel - Login Form */}
      <div className="flex w-full flex-col lg:w-1/2 xl:w-2/5">
        {/* Header */}
        <header className="flex-shrink-0 backdrop-blur-xl bg-[#F5F5F0]/80 border-b border-[#0B132B]/10 shadow-sm relative z-10">
          <div className="px-8 lg:px-12">
            <div className="flex h-[72px] items-center justify-between gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-[#0B132B]/60 hover:text-[#0B132B] transition-all"
              >
                <span className="font-bold text-[#0B132B] tracking-tight">Ilaala</span>
                <span className="font-bold text-[#FF0033]">.Studio</span>
              </Link>
              <div className="h-6 w-px bg-[#0B132B]/10" />
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#FF0033] animate-pulse" />
                <h1 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#0B132B]/70">
                  Admin Login
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Login Form - Centered */}
        <div className="flex flex-1 items-center justify-center px-8 lg:px-12 xl:px-16 py-12 relative z-10">
          <div className="w-full max-w-md">
            <div className="mb-10 flex flex-col items-start">
              <div className="h-10 w-1 bg-[#FF0033] mb-4" />
              <h1 className="text-4xl font-light tracking-[-0.03em] text-[#0B132B] mb-3">
                System Access<span className="font-bold text-[#FF0033]">.</span>
              </h1>
              <p className="text-[#0B132B]/50 font-light text-lg">
                Authenticate to manage the platform.
              </p>
            </div>

            {error && (
              <div className="mb-8 border-l-2 border-[#FF0033] bg-[#FF0033]/5 p-4">
                <p className="text-sm font-medium text-[#FF0033]">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/60 mb-3"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full bg-white/40 border border-[#0B132B]/10 px-4 py-3.5 text-[#0B132B] font-medium placeholder-[#0B132B]/30 focus:border-[#0055FF] focus:bg-white focus:outline-none focus:ring-0 transition-all"
                  placeholder="admin@ilaala.studio"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/60 mb-3"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full bg-white/40 border border-[#0B132B]/10 px-4 py-3.5 pr-12 text-[#0B132B] font-medium placeholder-[#0B132B]/30 focus:border-[#0055FF] focus:bg-white focus:outline-none focus:ring-0 transition-all tracking-[0.2em]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B132B]/40 hover:text-[#0B132B] transition-colors p-2"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative flex items-center justify-center bg-[#0B132B] px-4 py-4 uppercase tracking-[0.2em] text-[11px] font-bold text-white hover:bg-[#FF0033] hover:shadow-[0_10px_30px_rgba(255,0,51,0.25)] focus:outline-none transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  <div className="relative z-10 flex items-center gap-3">
                    {loading ? (
                      <>
                        <div className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Authenticate</span>
                        <svg
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          ></path>
                        </svg>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 lg:p-12 flex-shrink-0 border-t border-[#0B132B]/5">
          <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#0B132B]/30">
            © {new Date().getFullYear()} Ilaala Studio Access
          </p>
        </div>
      </div>

      {/* Right Panel - Immersive Dark Overlay */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden bg-[#0B132B]">
        {/* Abstract Cinematic Glows */}
        <div
          className="absolute top-1/4 -left-20 w-[60vh] h-[60vh] rounded-full bg-[#0055FF]/15 blur-[120px] pointer-events-none animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-1/4 -right-20 w-[60vh] h-[60vh] rounded-full bg-[#FF0033]/15 blur-[120px] pointer-events-none animate-pulse"
          style={{ animationDuration: "12s" }}
        />

        {/* Subtle Grid overlay for texture */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,245,240,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,245,240,.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Quote Content */}
        <div className="relative z-10 flex flex-col justify-end p-12 xl:p-24 h-full text-white">
          <div className="max-w-2xl">
            <div className="h-10 w-1 bg-[#FF0033] mb-8" />
            <blockquote className="space-y-8">
              <p className="text-3xl xl:text-4xl font-light tracking-[-0.03em] leading-[1.3] text-white">
                "{quote.text}"
              </p>
              <footer className="flex items-center gap-4 border-t border-white/10 pt-6">
                <cite className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#0055FF]">
                  {quote.author}
                </cite>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
