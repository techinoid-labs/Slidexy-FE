import type React from "react";
import type { Metadata } from "next";
import {
  Raleway,
  Inter,
  Poppins,
  Space_Grotesk,
  Playfair_Display,
  Source_Serif_4,
  DM_Sans,
  Archivo,
  Outfit,
  Lora,
  Bricolage_Grotesque,
  IBM_Plex_Sans,
  Manrope,
  Work_Sans,
  Figtree,
  Public_Sans,
  Nunito_Sans,
  Karla,
  JetBrains_Mono,
} from "next/font/google";
import Providers from "./provider/Provider";
import { ThemeProvider } from "@/lib/theme-provider";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as ThemeContextProvider } from "./context/ThemeContext";
import "./globals.css";
import SessionWrapper from "@/lib/sessionWrapper";
import { UserProvider } from "./context/AuthContext";


import Script from "next/script";
import AnalyticsTracker from "./components/analytics/AnalyticsTracker";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const GA_CONVERSION_ID = process.env.NEXT_PUBLIC_GA_CONVERSION_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

// Template typefaces.
//
// Slide templates used to name these in their font stacks without anything
// loading them, so every template silently fell back to the same system sans
// and they all looked typographically identical. next/font self-hosts them,
// which also matters for export: html2canvas rasterises the DOM, and a face
// still in flight over the network renders in a fallback at the wrong metrics.
//
// Only the UI face preloads; the rest are fetched when a template asks for
// them, so loading nine families does not cost every page.
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], display: "swap", preload: false, weight: ["400", "500", "600", "700", "800"], variable: "--font-poppins" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-grotesk" });
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-playfair" });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-sourceserif" });
const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-dm" });
const archivo = Archivo({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-archivo" });
const outfit = Outfit({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-outfit" });
const lora = Lora({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-lora" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--font-bricolage" });
// Text faces. Each template pairs a different one with its display face, so
// no two decks read the same — Inter had been doing the body work in seven of
// ten, which is what made them feel like one design.
const plex = IBM_Plex_Sans({ subsets: ["latin"], display: "swap", preload: false, weight: ["400", "500", "600", "700"], variable: "--font-plex" });
const manrope = Manrope({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-manrope" });
const workSans = Work_Sans({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-work" });
const figtree = Figtree({ subsets: ["latin"], display: "swap", variable: "--font-figtree" });
const publicSans = Public_Sans({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-public" });
const nunitoSans = Nunito_Sans({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-nunito" });
const karla = Karla({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-karla" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-mono" });

const fontVars = [
  raleway.variable,
  inter.variable,
  poppins.variable,
  spaceGrotesk.variable,
  playfair.variable,
  sourceSerif.variable,
  dmSans.variable,
  archivo.variable,
  outfit.variable,
  lora.variable,
  bricolage.variable,
  plex.variable,
  manrope.variable,
  workSans.variable,
  figtree.variable,
  publicSans.variable,
  nunitoSans.variable,
  karla.variable,
  jetbrains.variable,
].join(" ");

export const metadata: Metadata = {
  title: {
    default: "SlideXY: Smart AI Tool for Presentations & Pitch Decks",
    template: "%s | SlideXY",
  },
  description:
    "Build impressive presentations with AI assistance. SlideXY delivers ready-to-use slides and pitch decks for startups, sales teams, and educators in seconds.",
  keywords: [
    "smart presentation tool",
    "AI-powered slides",
    "pitch deck automation",
    "presentation AI platform",
    "intelligent slide maker",
    "automated deck design",
    "AI business presentations",
    "rapid pitch creator",
    "professional slide automation",
    "AI content presentations",
    "startup deck tool",
    "AI slide templates",
  ],
  alternates: {
    canonical: "https://slidexy.ai/",
  },
  metadataBase: new URL("https://slidexy.ai"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <head>
        {/* Meta Pixels */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
          async
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}');
  `}
        </Script>

        {/* Google Ads Conversion Tracking */}
        <Script id="google-ads-conversion" strategy="afterInteractive">
          {`
    gtag('event', 'conversion', {
      'send_to': '${GA_CONVERSION_ID}',
      'value': 1.0,
      'currency': 'PKR'
    });
  `}
        </Script>
        {/* Clarity Project Snippet */}
        {CLARITY_ID && (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_ID}");
            `}
          </Script>
        )}

        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-K2HW8LJP');
  `}
        </Script>
      </head>
      <body className={`${figtree.className} slidexy-body`} suppressHydrationWarning>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K2HW8LJP"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ThemeContextProvider>
          <ThemeProvider>
            <CssBaseline />
            <SessionWrapper>
              <UserProvider>
                <Providers>
                  <AnalyticsTracker />
                  {children}
                </Providers>
              </UserProvider>
            </SessionWrapper>
          </ThemeProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
