import satori from "satori";
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  // Load font from local file
  const fontPath = path.join(process.cwd(), "public/fonts/inter/Inter-Regular.ttf");
  const fontData = await readFile(fontPath);

  const features = [
    "Prompt to Deck",
    "Video to Deck",
    "Web to Deck",
    "Prompt to Template",
    "Text to Infographics",
  ];

  const svg = await satori(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          position: "relative",
          fontFamily: "Inter",
        }}
      >
        {/* Logo + Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <img src="https://yourdomain.com/images/logo.jpg" width="64" height="64" style={{ borderRadius: "10px" }} />
          <span style={{ fontSize: 48, fontWeight: 800, color: "#4F46E5" }}>Slidexy AI</span>
        </div>

        <div style={{ fontSize: 32, fontWeight: 700, color: "#18181B", marginBottom: 12 }}>
          Your Idea, Instantly on Slides
        </div>

        <div style={{ fontSize: 20, color: "#52525B", textAlign: "center", marginBottom: 40, maxWidth: "800px" }}>
          Turn ideas, voice, or prompts into polished slides instantly — powered by AI, styled by designers.
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
            maxWidth: "900px",
          }}
        >
          {features.map((feature) => (
            <div
              key={feature}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "white",
                padding: "14px 28px",
                borderRadius: 10,
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                border: "1px solid rgba(79,70,229,0.12)",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  background: "#4F46E5",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span style={{ fontSize: 19, fontWeight: 600, color: "#18181B" }}>{feature}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 18, color: "#4F46E5", fontWeight: 600, marginTop: 40 }}>
          Work smarter. Design faster. Present better.
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });
}
