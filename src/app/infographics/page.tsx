"use client";

import { useEffect, useState } from "react";

export default function InfographicsPage() {
  const [infographicData, setInfographicData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("infographicData");
    if (stored) {
      setInfographicData(JSON.parse(stored));
    }
  }, []);

  if (!infographicData) return <div>Loading...</div>;

  return (
    <div>
      <h1>{infographicData.title}</h1>
      {infographicData.sections.map((section: any, idx: number) => (
        <div key={idx}>
          <h2>{section.heading}</h2>
          <p>{section.description}</p>
          <img src={section.image_url} alt={section.heading} />
        </div>
      ))}
      <footer>
        <p>{infographicData.footerText}</p>
      </footer>
    </div>
  );
}
