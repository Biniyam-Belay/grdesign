/**
 * Web Vitals monitoring and reporting
 * Tracks Core Web Vitals: LCP, FID, CLS, FCP, TTFB
 */

export function reportWebVitals(metric: {
  id: string;
  name: string;
  value: number;
  label: "web-vital" | "custom";
  startTime?: number;
}) {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Web Vital] ${metric.name}:`, Math.round(metric.value), "ms");
  }

  // Send to analytics in production
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", metric.name, {
      value: Math.round(metric.value),
      event_category: "Web Vitals",
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Send to Vercel Analytics
  if (typeof window !== "undefined" && "va" in window) {
    const windowWithVa = window as unknown as {
      va?: (action: string, data: Record<string, unknown>) => void;
    };
    if (windowWithVa.va) {
      windowWithVa.va("event", {
        name: metric.name,
        data: {
          value: metric.value,
          id: metric.id,
          label: metric.label,
        },
      });
    }
  }
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: Record<string, unknown>) => void;
  }
}
