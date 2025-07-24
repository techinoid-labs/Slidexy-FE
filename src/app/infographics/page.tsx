"use client";
import { useEffect, useState } from "react";

export default function InfographicDisplay() {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("infographicData");
    if (stored) {
      const data = JSON.parse(stored);
      setImageUrl(data.imageUrl || "");
    }
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Generated Infographic"
          style={{ maxWidth: "100%", borderRadius: "10px" }}
        />
      ) : (
        <p>No infographic found.</p>
      )}
    </div>
  );
}
