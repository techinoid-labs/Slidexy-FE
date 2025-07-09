import Image from "next/image";

export default function Header() {
  // Detect if running in a web browser
  const isWeb =
    typeof window !== "undefined" &&
    window?.navigator?.userAgent?.includes("Mozilla");
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1440,
        height: 92,
        display: "flex",
        alignItems: "flex-center",
        position: "relative",
        justifyContent: isWeb ? "flex-start" : "center",
      }}
    >
      <div
        style={{
          marginTop: 24,
          marginLeft: isWeb ? 180 : 0,
          width: isWeb ? "fit-content" : "100vw",
          display: "flex",
          justifyContent: "center",
        }}
        className="header-logo-container"
      >
        <Image
          src="/images/icon.png"
          alt="Slides Logo"
          width={44}
          height={44}
        />
      </div>
      <style jsx>{`
        @media (max-width: 600px) {
          div[style*="height: 92px"] {
            justify-content: center !important;
          }
          .header-logo-container {
            margin-left: 0 !important;
            width: 100vw !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
}
