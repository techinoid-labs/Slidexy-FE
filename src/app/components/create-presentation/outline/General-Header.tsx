import Image from "next/image";

export default function Header() {
  return (
    <div
      style={{
        width: "1440px",
        height: "92px",
        display: "flex",
        alignItems: "flex-start",
        position: "relative",
      }}
    >
      <div
        style={{ marginTop: "24px", marginLeft: "180px", width: "fit-content" }}
      >
        <Image
          src="/images/icon.png"
          alt="Slides Logo"
          width={44}
          height={44}
        />
      </div>
    </div>
  );
}
