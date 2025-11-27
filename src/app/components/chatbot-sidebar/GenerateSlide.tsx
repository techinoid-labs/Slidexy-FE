"use client";

import { useState, useRef, useEffect } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSlides } from "@/app/context/SlidesContext";
import { useTemplateSlides } from "@/app/context/TemplateSlidesContext";
import { useUser } from "@/app/context/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Props {
  topic: string;
  tone?: string;
  style?: string;
}

export default function GenerateSlide({ topic, tone = "Professional", style = "Minimal Abstract" }: Props) {
  const router = useRouter();
  const { setSlides } = useSlides();
  const { setPresentationId } = useTemplateSlides();
  const { user } = useUser();

  const abortControllerRef = useRef<AbortController | null>(null);

  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentDetail, setCurrentDetail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!topic.trim()) {
      setError("Please provide a topic.");
      return;
    }

    const generateSlides = async () => {
      setLoading(true);
      setError("");
      setProgress(0);
      setCurrentMessage("");
      setCurrentDetail("");

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const payload = {
        source: "text",
        textContent: topic,
        meta: { goal: "pitch", tone, audience: "" },
        artStyle: style,
        slideCount: 1,
        userData: user,
      };

      try {
        const res = await fetch(`${API_BASE_URL}/generate-slides`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Something went wrong");
        }
        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";

          for (const part of parts) {
            if (!part.startsWith("data:")) continue;
            const jsonStr = part.replace(/^data:\s*/, "").trim();
            if (!jsonStr || jsonStr === "[DONE]") continue;

            try {
              const event = JSON.parse(jsonStr);
              if (event.percent !== undefined) setProgress(event.percent);
              if (event.message !== undefined) setCurrentMessage(event.message);
              if (event.detail !== undefined) setCurrentDetail(event.detail);

              if (event.error) {
                setError(event.error);
                setLoading(false);
                return;
              }

              if (event.complete) {
                if (event.slides) setSlides(event.slides);
                if (event.presentation_id) {
                  setPresentationId(event.presentation_id);
                  router.push(`/presentation/outline?pid=${event.presentation_id}`);
                }
                setLoading(false);
              }
            } catch (e) {
              console.error("Bad SSE chunk:", jsonStr);
            }
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") setError(err.message || "Network error");
        setLoading(false);
      } finally {
        abortControllerRef.current = null;
      }
    };

    generateSlides();

    return () => abortControllerRef.current?.abort();
  }, [topic, tone, style, user, router, setSlides, setPresentationId]);

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {currentMessage || "Generating slides..."}
      </Typography>
      <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
      {currentDetail && <Typography variant="body2" sx={{ mt: 1 }}>{currentDetail}</Typography>}
    </Box>
  );
}
