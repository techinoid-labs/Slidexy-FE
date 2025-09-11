import type React from "react";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Providers from "./provider/Provider";
import { ThemeProvider } from "@/lib/theme-provider";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as ThemeContextProvider } from "./context/ThemeContext";
import "./globals.css";
import SessionWrapper from "@/lib/sessionWrapper";
import { UserProvider } from "./context/AuthContext";
import Script from "next/script";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "Slides - Your Idea, Instantly on Slides",
  description:
    "Turn any thought into a polished, on-brand presentation — powered by AI, styled by designers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={raleway.variable} suppressHydrationWarning>
      <head>
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
            fbq('init', '1661409921482981');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1661409921482981&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body className={raleway.className} suppressHydrationWarning>
        <ThemeContextProvider>
          <ThemeProvider>
            <CssBaseline />
            <SessionWrapper>
              <UserProvider>
                <Providers>{children}</Providers>
              </UserProvider>
            </SessionWrapper>
          </ThemeProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
