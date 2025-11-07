"use client";

import React, { useEffect, useState } from "react";

interface Template {
  name: string;
  html: string;
}

const ProposalViewer: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = "http://localhost:5000/api/proposal";

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const listRes = await fetch(API_BASE);
        if (!listRes.ok) throw new Error("Failed to load templates list");
        const listData = await listRes.json();

        const templateNames: string[] = listData.templates || [];
        const templatePromises = templateNames.map(async (name) => {
          const res = await fetch(`${API_BASE}/${name}`);
          if (!res.ok) throw new Error(`Failed to load ${name}`);
          const html = await res.text();
          return { name, html };
        });

        const loadedTemplates = await Promise.all(templatePromises);
        setTemplates(loadedTemplates);
      } catch (err: any) {
        console.error("Error fetching templates:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Loading proposal...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <div className="proposal-wrapper">
        {templates.map((template, index) => (
          <div key={template.name} className="a4-container">
            <div
              className="a4-page"
              id={template.name}
              dangerouslySetInnerHTML={{ __html: template.html }}
            />
            {index < templates.length - 1 && <div className="page-separator" />}
          </div>
        ))}
      </div>

      <style jsx>{`
        .proposal-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: #0f1724;
          min-height: 100vh;
          padding: 2rem 0;
          gap: 2rem;
        }

        .a4-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .a4-page {
          width: 210mm;
          min-height: 297mm;
          background: white;
          color: black;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          overflow: hidden;
          padding: 20mm;
          box-sizing: border-box;
          position: relative;
        }

        .page-separator {
          height: 3rem;
          width: 100%;
        }

        .a4-page > * {
          max-width: 100%;
        }

        .a4-page h1,
        .a4-page h2,
        .a4-page h3,
        .a4-page h4,
        .a4-page h5,
        .a4-page h6 {
          color: inherit;
        }

        @media (max-width: 768px) {
          .a4-page {
            width: 95vw;
            min-height: auto;
            padding: 15mm;
          }
        }

        @media (prefers-color-scheme: dark) {
          .a4-page {
            background-color: white;
            color: black;
          }
        }

        @media print {
          body {
            background: white;
          }

          .proposal-wrapper {
            background: white;
            padding: 0;
            gap: 0;
          }

          .a4-container {
            page-break-after: always;
          }

          .a4-page {
            width: 210mm;
            height: 297mm;
            box-shadow: none;
            margin: 0;
            border-radius: 0;
            padding: 20mm;
            page-break-inside: avoid;
          }

          .page-separator {
            display: none;
          }

          .a4-container:last-child {
            page-break-after: auto;
          }
        }
      `}</style>
    </>
  );
};

export default ProposalViewer;