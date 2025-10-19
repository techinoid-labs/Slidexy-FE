// // lib/gtag.ts
// export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// // Track page views
// export const pageview = (url: string) => {
//   if (!GA_ID) return;
//   if (typeof window.gtag !== "undefined") {
//     window.gtag("config", GA_ID, {
//       page_path: url,
//     });
//   }
// };

// // Track custom events
// export const analyticsEvent = (
//   action: string,
//   params: Record<string, any> = {}
// ) => {
//   if (!GA_ID) return;
//   if (typeof window.gtag !== "undefined") {
//     window.gtag("event", action, params);
//   }
// };

// lib/gtag.ts
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// Track page views
export const pageview = (url: string) => {
  if (!GA_ID) return;
  if (typeof window.gtag !== "undefined") {
    window.gtag("config", GA_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const analyticsEvent = (
  action: string,
  params: Record<string, any> = {}
) => {
  if (!GA_ID) return;
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", action, params);
  }
};
