
"use client";
import { useState, useEffect } from "react";
import type { BackendPresentation } from "../types/presentation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const usePresentation = (presentationId: string) => {
  const [presentation, setPresentation] = useState<BackendPresentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPresentation = async () => {
      // Validate presentationId
      if (!presentationId || presentationId === "unknown") {
        setError("Invalid presentation ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/presentation/${presentationId}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch presentation (status: ${response.status})`);
        }
        const data = await response.json();
        console.log("Fetched presentation:", data);
        setPresentation(data);
      } catch (err) {
        console.error("Error fetching presentation:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        // Only use mock data in development
        if (process.env.NODE_ENV === "development") {
          setPresentation({
            id: presentationId,
            title: "Sample Business Presentation",
            topic: "Business",
            meta: {
              audience: "Business Executives",
              tone: "Sales Pitch",
            },
            slides: [
              // ... mock data
            ],
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPresentation();
  }, [presentationId]);

  return { presentation, loading, error };
};