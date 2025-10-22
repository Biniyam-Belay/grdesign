/**
 * Performance monitoring utilities
 * Tracks page load times, component render times, and custom metrics
 */

export class PerformanceMonitor {
  private static marks = new Map<string, number>();

  /**
   * Start timing an operation
   */
  static start(name: string): void {
    if (typeof window === "undefined") return;
    this.marks.set(name, performance.now());
  }

  /**
   * End timing and log the duration
   */
  static end(name: string): number | null {
    if (typeof window === "undefined") return null;

    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`No start mark found for: ${name}`);
      return null;
    }

    const duration = performance.now() - startTime;
    this.marks.delete(name);

    if (process.env.NODE_ENV === "development") {
      console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  /**
   * Measure navigation timing
   */
  static getNavigationTiming() {
    if (typeof window === "undefined") return null;

    const perfData = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    if (!perfData) return null;

    return {
      dns: perfData.domainLookupEnd - perfData.domainLookupStart,
      tcp: perfData.connectEnd - perfData.connectStart,
      request: perfData.responseStart - perfData.requestStart,
      response: perfData.responseEnd - perfData.responseStart,
      dom: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
      load: perfData.loadEventEnd - perfData.loadEventStart,
      total: perfData.loadEventEnd - perfData.fetchStart,
    };
  }

  /**
   * Get resource timing stats
   */
  static getResourceTiming() {
    if (typeof window === "undefined") return null;

    const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    const stats = {
      scripts: 0,
      stylesheets: 0,
      images: 0,
      fonts: 0,
      other: 0,
      totalSize: 0,
      totalDuration: 0,
    };

    resources.forEach((resource) => {
      const type = resource.initiatorType;
      stats.totalDuration += resource.duration;

      if (type === "script") stats.scripts++;
      else if (type === "css") stats.stylesheets++;
      else if (type === "img") stats.images++;
      else if (type === "font") stats.fonts++;
      else stats.other++;

      // Estimate size (if available)
      if (resource.transferSize) {
        stats.totalSize += resource.transferSize;
      }
    });

    return stats;
  }

  /**
   * Log performance summary
   */
  static logSummary(): void {
    if (typeof window === "undefined" || process.env.NODE_ENV !== "development") return;

    console.group("🚀 Performance Summary");

    const nav = this.getNavigationTiming();
    if (nav) {
      console.log("Navigation Timing:");
      console.table(nav);
    }

    const resources = this.getResourceTiming();
    if (resources) {
      console.log("Resource Loading:");
      console.table(resources);
    }

    console.groupEnd();
  }
}

/**
 * Hook to measure component render time
 */
export function usePerformanceMonitor(componentName: string) {
  if (typeof window === "undefined") return;

  PerformanceMonitor.start(`${componentName}-render`);

  // Cleanup on unmount
  return () => {
    PerformanceMonitor.end(`${componentName}-render`);
  };
}
