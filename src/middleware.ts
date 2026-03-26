import { NextRequest, NextResponse } from "next/server";

/**
 * SEO Middleware — Phase 1
 * 1. Redirect www → non-www (301)
 * 2. Strip trailing slashes (301)
 *
 * Only applies to the production domain (slidexy.ai).
 */
export function middleware(request: NextRequest) {
  const { pathname, search, host } = request.nextUrl;

  // --- 1. www → non-www redirect ---
  if (host.startsWith("www.")) {
    const nonWwwHost = host.replace(/^www\./, "");
    const url = request.nextUrl.clone();
    url.host = nonWwwHost;
    return NextResponse.redirect(url, 301);
  }

  // --- 2. Trailing-slash normalization ---
  // Skip the root path "/" and Next.js internals
  if (pathname !== "/" && pathname.endsWith("/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/\/+$/, "");
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|woff|woff2|ttf|eot)).*)",
  ],
};
