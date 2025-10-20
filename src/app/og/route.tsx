import { ImageResponse } from "next/og";
export const runtime = "edge";

export async function GET() {
  const baseUrl =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const logoUrl = new URL("/images/logo.jpg", baseUrl).toString();

  const features = [
    "Prompt to Deck",
    "Video to Deck",
    "Web to Deck",
    "Prompt to Template",
    "Text to Infographics",
  ];

  return new ImageResponse(
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
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Background accent */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)",
            top: "-200px",
            right: "-100px",
          }}
        />

        {/* Logo + Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <img
            src={logoUrl}
            alt="Slidexy AI"
            width="64"
            height="64"
            style={{ borderRadius: "10px", display: "flex" }}
          />
          <span
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "#4F46E5",
              letterSpacing: "-0.02em",
            }}
          >
            Slidexy AI
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            fontSize: 32,
            fontWeight: 700,
            color: "#18181B",
            marginBottom: 12,
          }}
        >
          Your Idea, Instantly on Slides
        </div>

        {/* Subheadline */}
        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "#52525B",
            marginBottom: 40,
          }}
        >
          Turn ideas, voice, or prompts into polished slides instantly. powered by AI, styled by designers.        </div>

        {/* Features Grid */}
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
              {/* Check icon */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  background: "#4F46E5",
                  borderRadius: "50%",
                  flexShrink: 0,
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

              {/* Feature text */}
              <span
                style={{
                  fontSize: 19,
                  fontWeight: 600,
                  color: "#18181B",
                }}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Footer tagline */}
        <div
          style={{
            display: "flex",
            fontSize: 18,
            color: "#4F46E5",
            fontWeight: 600,
            marginTop: 40,
          }}
        >
          Work smarter. Design faster. Present better.        </div>

        {/* Footer line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "5px",
            background: "linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)",
          }}
        />
      </div>
    ),
    {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=604800, immutable",
      },
    }
  );
}