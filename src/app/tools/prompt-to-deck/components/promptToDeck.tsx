"use client";

import React, { useRef, useState } from "react";
import { Box, Container, Typography, Alert, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import AttachFileRounded from "@mui/icons-material/AttachFileRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import GenerationOverlay from "@/app/components/shared/GenerationOverlay";
import { useSlides } from "@/app/context/SlidesContext";
import { useTemplateSlides } from "@/app/context/TemplateSlidesContext";
import { useUser } from "@/app/context/AuthContext";
import { ACCENT, INK, MONO } from "@/app/components/home/editorial";

/** The composer sits on a busy field, so it is solid, not glass. */
const GLASS = "#FFFFFF";
const EDGE = "#0F0A19";
const TEXT = "#0F0A19";
const DIM = "#6B6478";
const FAINT = "#A9A3B4";
const LILAC = "#8E2DE2";

/**
 * The composer.
 *
 * One box, and the box is the page. Everything a person came here to do
 * is type a sentence, so the sentence gets the whole surface and the
 * five settings sit in a thin bar along the bottom of it, the way the
 * tools in a text editor sit under the text and not in front of it.
 *
 * Two earlier attempts failed in opposite directions. A tinted panel of
 * rounded dropdowns looked like every other AI tool; a numbered brief
 * with a line per decision was honest but made you read six labels to
 * find the one field that matters. The fix is not more layout, it is
 * less: one thing at full size, the rest at a whisper until wanted.
 */

const GOALS = [
  { value: "", label: "Any purpose" },
  { value: "pitch", label: "A pitch" },
  { value: "education", label: "Teaching" },
  { value: "marketing", label: "Marketing" },
];

const TONES = [
  { value: "", label: "Any voice" },
  { value: "Professional", label: "Professional" },
  { value: "Casual", label: "Plain and casual" },
  { value: "Inspirational", label: "Inspirational" },
];

const STYLES = [
  { value: "", label: "No pictures" },
  { value: "Concept Art", label: "Concept art" },
  { value: "3D Render / CGI", label: "3D render" },
  { value: "Watercolor Illustration", label: "Watercolour" },
  { value: "AI Collage / Mixed Media", label: "Collage" },
  { value: "Digital Painting", label: "Digital painting" },
  { value: "Fantasy / Sci-Fi Style", label: "Fantasy" },
  { value: "Minimal Abstract", label: "Minimal abstract" },
];

const EXAMPLES = [
  "Q3 marketing results for the leadership team",
  "Pitch deck for a healthy snacks subscription box",
  "Onboarding walkthrough for new hires",
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/** A setting in the toolbar: current value, and a plain list to change it. */
function Setting({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <>
      <Box
        component="button"
        type="button"
        onClick={(e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget)}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.4,
          border: "none",
          background: "none",
          px: 0,
          py: 0.5,
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "0.86rem",
          color: value ? TEXT : DIM,
          fontWeight: value ? 600 : 400,
          whiteSpace: "nowrap",
          "&:hover": { color: LILAC },
        }}
      >
        {current.label}
        <ExpandMoreRounded sx={{ fontSize: 16 }} />
      </Box>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 0,
              border: `1px solid ${EDGE}`,
              boxShadow: "0 20px 40px -24px rgba(50,16,104,0.4)",
              mt: 0.5,
              minWidth: 190,
            },
          },
        }}
      >
        {options.map((o) => (
          <MenuItem
            key={o.value || "any"}
            selected={o.value === value}
            onClick={() => {
              onChange(o.value);
              setAnchor(null);
            }}
            sx={{
              fontSize: "0.88rem",
              py: 1,
              "&.Mui-selected": { bgcolor: "transparent", fontWeight: 600, color: LILAC },
              "&.Mui-selected:hover": { bgcolor: "#F6F2FD" },
            }}
          >
            {o.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default function PromptToDeck() {
  const [count, setCount] = useState(7);
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState("");
  const [visualStyle, setVisualStyle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentDetail, setCurrentDetail] = useState("");
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  /** Where we go once the overlay has finished travelling. */
  const [nextRoute, setNextRoute] = useState<string | null>(null);

  const router = useRouter();
  const { setSlides } = useSlides();
  const { setPresentationId } = useTemplateSlides();
  const { user } = useUser();
  const abortControllerRef = useRef<AbortController | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("Tell it what the deck is about first.");
      return;
    }

    setLoading(true);
    setError("");
    setProgress(0);
    setCurrentMessage("");
    setCurrentDetail("");
    setSlides([]);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const formData = new FormData();
    if (selectedFile) {
      formData.append("source", "file");
      formData.append("file", selectedFile);
    } else {
      formData.append("source", "text");
    }
    formData.append("textContent", description);
    formData.append("meta", JSON.stringify({ goal, tone, audience: "" }));
    formData.append("artStyle", visualStyle);
    formData.append("slideCount", count.toString());
    formData.append("userData", JSON.stringify(user));

    try {
      const res = await fetch(`${API_BASE_URL}/generate-slides`, {
        method: "POST",
        headers: { Accept: "text/event-stream" },
        body: formData,
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
              setProgress(100);
              setCurrentMessage(event.message || "Presentation ready!");
              setCurrentDetail(event.detail || "");
              if (event.slides) setSlides(event.slides);
              if (event.presentation_id) {
                setPresentationId(event.presentation_id);
                // Held, not taken. The overlay says when its journey has
                // actually finished; jumping the moment the server said
                // "done" pulled the page out from under a camera that
                // was still halfway across the sheet.
                setNextRoute(`/presentation/outline?pid=${event.presentation_id}`);
              } else {
                setLoading(false);
              }
            }
          } catch {
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

  const cancelGeneration = () => {
    abortControllerRef.current?.abort();
    setLoading(false);
    setProgress(0);
    setCurrentMessage("");
    setCurrentDetail("");
    setNextRoute(null);
  };

  const divider = (
    <Box sx={{ width: "1px", height: 18, bgcolor: "#E4E1EA", display: { xs: "none", sm: "block" } }} />
  );

  return (
    <Box component="section" sx={{ pb: { xs: 7, md: 11 } }}>
      <Container maxWidth="md">
        {/* The box is the page. */}
        <Box
          sx={{
            border: `1.5px solid ${EDGE}`,
            bgcolor: GLASS,
            // It has to hold its own against a moving field behind it.
            boxShadow: "0 40px 80px -36px rgba(50,16,104,0.45)",
            transition: "box-shadow 0.2s ease",
            "&:focus-within": { boxShadow: `6px 6px 0 0 ${ACCENT}` },
          }}
        >
          <Box
            component="textarea"
            autoFocus
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
            }}
            placeholder="What is the deck about?"
            rows={5}
            sx={{
              width: "100%",
              display: "block",
              resize: "none",
              border: "none",
              outline: "none",
              background: "transparent",
              px: { xs: 2.5, md: 3.5 },
              pt: { xs: 2.5, md: 3.5 },
              pb: 2,
              fontFamily: "inherit",
              fontSize: { xs: "1.15rem", md: "1.45rem" },
              lineHeight: 1.45,
              color: TEXT,
              "&::placeholder": { color: FAINT },
            }}
          />

          {/* The settings, along the foot of the box and no louder. */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2 },
              px: { xs: 2, md: 2.75 },
              py: 1.5,
              borderTop: "1px solid #E4E1EA",
            }}
          >
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
              {[
                { s: "−", go: () => setCount((c) => Math.max(3, c - 1)), off: count <= 3 },
                { s: "+", go: () => setCount((c) => Math.min(20, c + 1)), off: count >= 20 },
              ].map((b, i) => (
                <React.Fragment key={b.s}>
                  {i === 1 && (
                    <Typography
                      sx={{ fontFamily: MONO, fontSize: "0.86rem", color: TEXT, minWidth: 58, textAlign: "center" }}
                    >
                      {count} slides
                    </Typography>
                  )}
                  <Box
                    component="button"
                    type="button"
                    onClick={b.go}
                    disabled={b.off}
                    aria-label={i === 0 ? "One slide fewer" : "One slide more"}
                    sx={{
                      width: 24,
                      height: 24,
                      border: "1px solid #E4E1EA",
                      background: "none",
                      cursor: b.off ? "default" : "pointer",
                      fontSize: "0.95rem",
                      lineHeight: 1,
                      color: b.off ? "#D6D1DE" : TEXT,
                      "&:hover": { borderColor: b.off ? "#E4E1EA" : LILAC },
                    }}
                  >
                    {b.s}
                  </Box>
                </React.Fragment>
              ))}
            </Box>

            {divider}
            <Setting options={GOALS} value={goal} onChange={setGoal} />
            {divider}
            <Setting options={TONES} value={tone} onChange={setTone} />
            {divider}
            <Setting options={STYLES} value={visualStyle} onChange={setVisualStyle} />

            {selectedFile ? (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  border: "1px solid #E4E1EA",
                  px: 1,
                  py: 0.4,
                  maxWidth: 190,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: "0.74rem",
                    color: TEXT,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedFile.name}
                </Typography>
                <Box
                  component="button"
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  aria-label="Remove the file"
                  sx={{
                    border: "none",
                    background: "none",
                    p: 0,
                    display: "flex",
                    cursor: "pointer",
                    color: DIM,
                    "&:hover": { color: TEXT },
                  }}
                >
                  <CloseRounded sx={{ fontSize: 14 }} />
                </Box>
              </Box>
            ) : (
              <Box
                component="button"
                type="button"
                onClick={() => fileInput.current?.click()}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  border: "none",
                  background: "none",
                  p: 0,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.86rem",
                  color: DIM,
                  "&:hover": { color: LILAC },
                }}
              >
                <AttachFileRounded sx={{ fontSize: 15 }} />
                Attach
              </Box>
            )}

            <Box
              component="button"
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                ml: { xs: 0, sm: "auto" },
                width: { xs: "100%", sm: "auto" },
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                bgcolor: TEXT,
                color: "#FFFFFF",
                border: "none",
                px: 2.5,
                py: 1.15,
                cursor: loading ? "default" : "pointer",
                fontFamily: "inherit",
                fontSize: "0.92rem",
                fontWeight: 600,
                opacity: loading ? 0.6 : 1,
                transition: "background 0.15s ease",
                "&:hover": { bgcolor: loading ? TEXT : LILAC },
              }}
            >
              {loading ? "Building" : "Build the outline"}
              <ArrowForwardRounded sx={{ fontSize: 16 }} />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              gap: 1.5,
              px: { xs: 2, md: 2.75 },
              py: 1.4,
              borderTop: "1px solid #EFECF4",
            }}
          >
          <Typography
            sx={{
              fontFamily: MONO,
              fontSize: "0.7rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: FAINT,
            }}
          >
            Or try
          </Typography>
          {EXAMPLES.map((ex) => (
            <Box
              component="button"
              type="button"
              key={ex}
              onClick={() => setDescription(ex)}
              sx={{
                border: "none",
                background: "none",
                p: 0,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.86rem",
                color: DIM,
                borderBottom: "1px solid #E4E1EA",
                "&:hover": { color: LILAC, borderBottomColor: LILAC },
              }}
            >
              {ex}
            </Box>
          ))}
          </Box>

          <Box
            component="input"
            ref={fileInput}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.md,.ppt,.pptx"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              e.target.files?.[0] && setSelectedFile(e.target.files[0])
            }
            sx={{ display: "none" }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ borderRadius: 0, mt: 2 }}>
            {error}
          </Alert>
        )}

      </Container>

      <GenerationOverlay
        open={loading}
        progress={progress}
        message={currentMessage}
        detail={currentDetail}
        onCancel={cancelGeneration}
        onArrived={() => {
          if (nextRoute) router.push(nextRoute);
        }}
      />
    </Box>
  );
}
