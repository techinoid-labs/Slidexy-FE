"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import ArticleRounded from "@mui/icons-material/ArticleRounded";
import InsertLinkRounded from "@mui/icons-material/InsertLinkRounded";
import FormatQuoteRounded from "@mui/icons-material/FormatQuoteRounded";
import { analyticsEvent } from "@/lib/gtag";
import { ACCENT, halfBorder, INK, Mark, MONO, MUTED, RULE } from "./editorial";
import DemoCursor from "./DemoCursor";
import { GraphPlane } from "./blocks";
import Gutter, { HERO_GUTTER } from "./Gutter";

/**
 * Hero.
 *
 * Two deliberate choices here.
 *
 * First, no slide screenshots. The templates are still being worked on, and
 * a marketing page that shows output you are mid-way through redesigning
 * ages badly. What it shows instead is the outline, which is real output,
 * is honest, and is the part people actually judge first.
 *
 * Second, the outline is live. Pick a different starting point and the
 * panel rewrites itself. It is the product's actual behaviour in miniature,
 * not an illustration of it.
 */

type Example = {
  key: string;
  icon: React.ReactNode;
  kind: string;
  prompt: string;
  meta: string;
  outline: string[];
};

const EXAMPLES: Example[] = [
  {
    key: "pitch",
    icon: <FormatQuoteRounded />,
    kind: "From a sentence",
    prompt: "Seed pitch for a climate tech startup cutting shipping emissions",
    meta: "12 slides · Investor & Fundraising",
    outline: [
      "Shipping burns a billion tonnes a year",
      "Why the obvious fixes have not worked",
      "What we built, in one diagram",
      "Three pilots, nine months, the numbers",
      "The market, sized honestly",
      "What the round buys",
    ],
  },
  {
    key: "review",
    icon: <ArticleRounded />,
    kind: "From a document",
    prompt: "Q3 board review (uploaded: Q3-performance.pdf)",
    meta: "9 slides · Annual Report",
    outline: [
      "The quarter in one number",
      "Revenue against plan",
      "Where margin moved, and why",
      "Pipeline going into Q4",
      "Two risks worth your attention",
      "What we are asking for",
    ],
  },
  {
    key: "link",
    icon: <InsertLinkRounded />,
    kind: "From a link",
    prompt: "https://example.com/our-2026-research",
    meta: "11 slides · Marketing Strategy",
    outline: [
      "What the research actually found",
      "The claim everyone repeats, tested",
      "Four segments, one surprise",
      "What changed since last year",
      "Where the opportunity sits",
      "What to do on Monday",
    ],
  },
];

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const paused = useRef(false);

  // The demo cursor: which tab it is heading for, a counter bumped on
  // each press so the ring replays, whether a person has taken over, and
  // the measured centre of every tab in the panel's own coordinates.
  const [aim, setAim] = useState(0);
  const [press, setPress] = useState(0);
  const [taken, setTaken] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const resume = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(0);
  const tabs = useRef<(HTMLDivElement | null)[]>([]);
  const [marks, setMarks] = useState<{ x: number; y: number }[]>([]);

  const example = EXAMPLES[active];

  useEffect(() => {
    const measure = () => {
      const box = panel.current?.getBoundingClientRect();
      if (!box) return;
      setMarks(
        tabs.current.map((t) => {
          if (!t) return { x: 0, y: 0 };
          const r = t.getBoundingClientRect();
          return { x: r.left - box.left + r.width * 0.42, y: r.top - box.top + r.height * 0.5 };
        })
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (panel.current) ro.observe(panel.current);
    return () => ro.disconnect();
  }, []);

  // The cursor drives the panel: it travels to the next tab, and the
  // tab only changes once the pointer has actually arrived and pressed.
  // Anyone touching the panel takes the wheel and the pointer leaves.
  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) setAim((i) => (i + 1) % EXAMPLES.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const arrive = () => {
    if (paused.current) return;
    setActive(aim);
    setPress((n) => n + 1);
  };

  // Someone's real pointer is on the panel: stand down.
  const takeOver = () => {
    if (resume.current) clearTimeout(resume.current);
    paused.current = true;
    setTaken(true);
  };

  // They have moved off again. Wait a beat in case they are coming back,
  // then pick up from whichever tab they left showing rather than from
  // wherever the demo had got to.
  const handBack = () => {
    if (resume.current) clearTimeout(resume.current);
    resume.current = setTimeout(() => {
      setAim(activeRef.current);
      paused.current = false;
      setTaken(false);
    }, 1600);
  };

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => () => {
    if (resume.current) clearTimeout(resume.current);
  }, []);

  const go = () => {
    const prompt = inputValue.trim();
    analyticsEvent("get_started_click", { location: "hero", has_prompt: !!prompt });
    router.push(
      prompt
        ? `/tools/prompt-to-deck?prompt=${encodeURIComponent(prompt)}`
        : "/tools/prompt-to-deck"
    );
  };

  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (inputValue.trim()) current.set("prompt", inputValue.trim());
    else current.delete("prompt");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        pt: { xs: 7, md: 10 },
        pb: { xs: 8, md: 9 },
      }}
    >
      {/* Two anchors in the bottom corners, each cropped by the side trim
          and by the foot of the section. They sit in the margin the text
          does not use, so they cannot reach it at any width. */}
      <Gutter items={HERO_GUTTER} />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.08fr 0.92fr" },
            gap: { xs: 6, md: 9 },
            alignItems: "start",
          }}
        >
          {/* ── Left: the pitch and the input ─────────────────────── */}
          <Box>

            <Typography
              sx={{
                fontSize: "1rem",
                lineHeight: 1.55,
                color: MUTED,
                maxWidth: 420,
                mb: 2.25,
              }}
            >
              Outline first, slides after
            </Typography>

            <Typography
              component="h1"
              sx={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: { xs: "2.6rem", sm: "3.4rem", md: "4.15rem" },
                lineHeight: 0.99,
                letterSpacing: "-0.03em",
                color: INK,
                mb: 3,
              }}
            >
              You already know
              <br />
              what to say.
              <Box component="span" sx={{ display: "block", color: ACCENT, fontStyle: "italic" }}>
                We will set it.
              </Box>
            </Typography>

            <Typography
              sx={{
                fontSize: "1.06rem",
                lineHeight: 1.6,
                color: MUTED,
                maxWidth: 480,
                mb: 4,
              }}
            >
              A topic, a document or a link. You get an outline to argue
              with, and a file your client can actually edit.
            </Typography>

            {/* The input, set as a card rather than a search bar */}
            <Box
              sx={{
                ...halfBorder(),
                bgcolor: "#fff",
                display: "flex",
                alignItems: "stretch",
                maxWidth: 560,
                transition: "box-shadow 0.18s ease",
                "&:focus-within": { boxShadow: `5px 5px 0 0 ${ACCENT}` },
              }}
            >
              <Box
                component="input"
                value={inputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && go()}
                placeholder="What is the deck about?"
                sx={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  px: 2.25,
                  py: 2,
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  color: INK,
                  bgcolor: "transparent",
                  "&::placeholder": { color: "#A9A3B4" },
                }}
              />
              <Box
                component="button"
                onClick={go}
                aria-label="Start a deck"
                sx={{
                  border: "none",
                  borderLeft: `1.5px solid ${INK}`,
                  bgcolor: INK,
                  color: "#fff",
                  px: 2.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  transition: "background 0.15s ease",
                  "&:hover": { bgcolor: ACCENT },
                }}
              >
                Start
                <ArrowForwardRounded />
              </Box>
            </Box>

            {/* Two routes in, equally weighted. The input is for people who
                know what they want; the template route is for people who
                want to see the work before they commit a sentence. */}
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 3, mt: 2.5 }}>
              <Link href="/templates" style={{ textDecoration: "none" }}>
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: INK,
                    borderBottom: `2px solid ${ACCENT}`,
                    pb: 0.3,
                    transition: "color 0.15s ease",
                    "&:hover": { color: ACCENT },
                  }}
                >
                  Browse the templates
                  <ArrowForwardRounded sx={{ fontSize: 15 }} />
                </Box>
              </Link>
              <Typography sx={{ fontSize: "0.85rem", color: "#9A94A6" }}>
                No sign up for your first deck.
              </Typography>
            </Box>
          </Box>

          {/* ── Right: live outline ───────────────────────────────── */}
          <Box sx={{ position: "relative" }}>
            {/* Squared paper behind the panel, offset so a band of it
                shows along two edges. Plain rectangle: the cut corner and
                the dissolving teeth before it were both decoration the
                panel did not need. */}
            <GraphPlane
              sx={{
                display: { xs: "none", md: "block" },
                inset: 0,
                transform: "translate(30px, 30px)",
                zIndex: 0,
              }}
            />

            <Box
              ref={panel}
              onPointerEnter={takeOver}
              onPointerLeave={handBack}
              sx={{
                position: "relative",
                zIndex: 1,
                bgcolor: "#fff",
                ...halfBorder(),
                p: { xs: 2.5, md: 3 },
              }}
            >
            {/* Starting points, as a ruled selector */}
            <Box sx={{ display: "flex", borderBottom: `1px solid ${RULE}`, mb: 0 }}>
              {EXAMPLES.map((ex, i) => (
                <Box
                  key={ex.key}
                  ref={(n: HTMLDivElement | null) => {
                    tabs.current[i] = n;
                  }}
                  onClick={() => {
                    takeOver();
                    setActive(i);
                  }}
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.9,
                    pb: 1.4,
                    cursor: "pointer",
                    color: i === active ? INK : "#A9A3B4",
                    borderBottom: `2px solid ${i === active ? ACCENT : "transparent"}`,
                    mb: "-1px",
                    transition: "color 0.15s ease",
                    "&:hover": { color: INK },
                  }}
                >
                  <Box sx={{ fontSize: 14, display: "flex" }}>{ex.icon}</Box>
                  <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                    {ex.kind}
                  </Typography>
                </Box>
              ))}
            </Box>

            <AnimatePresence mode="wait">
              <motion.div
                key={example.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <Box sx={{ pt: 3 }}>
                  <Typography
                    sx={{
                      fontSize: "0.95rem",
                      color: INK,
                      lineHeight: 1.5,
                      mb: 0.75,
                      fontStyle: example.key === "link" ? "normal" : "italic",
                      fontFamily: example.key === "link" ? MONO : "inherit",
                      wordBreak: "break-word",
                    }}
                  >
                    {example.key === "link" ? example.prompt : `"${example.prompt}"`}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: MONO,
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: ACCENT,
                      mb: 2.5,
                    }}
                  >
                    {example.meta}
                  </Typography>

                  <Box sx={{ borderTop: `1px solid ${RULE}` }}>
                    {example.outline.map((line, i) => (
                      <Box
                        key={line}
                        component={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.05 + i * 0.045, duration: 0.2 }}
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "baseline",
                          py: 1.35,
                          borderBottom: `1px solid ${RULE}`,
                        }}
                      >
                        <Typography
                          sx={{ fontFamily: MONO, fontSize: "0.72rem", color: "#B4AEC0", minWidth: 18 }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </Typography>
                        <Typography sx={{ fontSize: "0.95rem", color: INK, lineHeight: 1.45 }}>
                          {line}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Typography sx={{ mt: 2, fontSize: "0.8rem", color: "#9A94A6", lineHeight: 1.5 }}>
                    Edit any line before a single slide gets built.
                  </Typography>
                </Box>
              </motion.div>
              </AnimatePresence>


              {marks.length === EXAMPLES.length && (
                <DemoCursor
                  to={marks[aim]}
                  show={!taken}
                  press={press}
                  onArrive={arrive}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
