"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Container, Typography, Snackbar, Alert, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AddRounded from "@mui/icons-material/AddRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import { slugify } from "../../utils/slugUtils";
import Header from "../components/headers-navbar/Header";
import Footer from "../components/home/Footer";
import { GraphPlane } from "../components/home/blocks";
import { useUser } from "../context/AuthContext";
import {
  ACCENT,
  BONE,
  Display,
  INK,
  Lede,
  MONO,
  MUTED,
  RULE,
} from "../components/home/editorial";

/**
 * The writing.
 *
 * Rebuilt on the house system: bone ground, hairlines, one accent, no
 * cards with shadows and no gradient-clipped headline. Posts are a ruled
 * list rather than a wall of tiles, because a list can be read down in
 * one pass and tiles cannot.
 *
 * Everything that touched the API is unchanged: the same endpoints, the
 * same admin delete, the same slugs. Only the surface is new.
 */

interface Blog {
  _id: string;
  title: string;
  content: string;
  coverImage?: string;
  media?: string[];
  category?: string;
  tags?: string[];
  author?: { name?: string; _id?: string };
  createdAt?: string;
}

const PAGE = 6;

export default function BlogPage() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  const router = useRouter();
  const { user } = useUser();
  const { data: session } = useSession();
  const isAdmin = user?.admin || false;

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selected, setSelected] = useState("All");
  const [shown, setShown] = useState(PAGE);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/blogs`);
        if (!res.ok) throw new Error("Failed to load the posts");
        const data = await res.json();
        setBlogs(data.blogs || data);
      } catch (err: any) {
        setError(err.message || "Failed to load the posts");
      } finally {
        setLoading(false);
      }
    };

    const loadCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/blogs/categories/list`);
        if (res.ok) setCategories(await res.json());
      } catch {
        // A missing category list is not worth an error message: the
        // filter simply shows All and the posts still read fine.
      }
    };

    load();
    loadCategories();
  }, [API_BASE_URL]);

  // Derived rather than stored. The old page kept a second copy of the
  // list in state and read it one render behind, so the load more button
  // was always deciding on the previous filter.
  const filtered = useMemo(
    () => (selected === "All" ? blogs : blogs.filter((b) => b.category === selected)),
    [blogs, selected]
  );

  useEffect(() => setShown(PAGE), [selected]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      });
      if (!res.ok) throw new Error("Could not delete the post");
      setBlogs((all) => all.filter((b) => b._id !== id));
      setSuccessMessage("Post deleted");
    } catch (err: any) {
      setError(err.message || "Could not delete the post");
    }
  };

  const open = (b: Blog) => router.push(`/blog/${slugify(b.title)}`);

  const when = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : "";

  /** Posts arrive as HTML, so the tags come out before the excerpt does. */
  const excerpt = (html?: string, len = 150) => {
    if (!html) return "";
    const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    return text.length > len ? `${text.slice(0, len).trimEnd()}…` : text;
  };

  const tabs = ["All", ...categories];
  const lead = filtered[0];
  const rest = filtered.slice(1, shown);

  return (
    <Box
      component="main"
      sx={{ minHeight: "100vh", bgcolor: BONE, display: "flex", flexDirection: "column", overflowX: "clip" }}
    >
      <Header />

      <Box sx={{ flex: "1 0 auto", py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          {/* Masthead */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.25fr 1fr" },
              gap: { xs: 3, md: 8 },
              alignItems: "end",
              mb: { xs: 4, md: 6 },
            }}
          >
            <Display>
              Notes on making
              <br />
              decks that hold up.
            </Display>
            <Lede sx={{ pb: 1 }}>
              What we are learning about structure, type and getting a
              presentation out the door. Written by the people building it.
            </Lede>
          </Box>

          {/* The filter, as plain text with a rule under the live one */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: { xs: 2, md: 3 },
              borderBottom: `1px solid ${INK}`,
              pb: 1.5,
              mb: 1,
            }}
          >
            {tabs.map((c) => (
              <Box
                component="button"
                key={c}
                onClick={() => setSelected(c)}
                aria-pressed={c === selected}
                sx={{
                  border: "none",
                  background: "none",
                  p: 0,
                  pb: 0.4,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  color: c === selected ? INK : "#A9A3B4",
                  borderBottom: `2px solid ${c === selected ? ACCENT : "transparent"}`,
                  mb: "-14px",
                  transition: "color 0.15s ease",
                  "&:hover": { color: INK },
                }}
              >
                {c}
              </Box>
            ))}

            {isAdmin && (
              <Box
                component="button"
                onClick={() => router.push("/blog/create")}
                sx={{
                  ml: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  border: `1.5px solid ${INK}`,
                  background: "none",
                  px: 1.75,
                  py: 0.6,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: INK,
                  transition: "background 0.15s ease, color 0.15s ease",
                  "&:hover": { bgcolor: INK, color: "#fff" },
                }}
              >
                <AddRounded sx={{ fontSize: 16 }} />
                New post
              </Box>
            )}
          </Box>

          {loading && (
            <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
              <CircularProgress size={22} sx={{ color: ACCENT }} />
            </Box>
          )}

          {!loading && filtered.length === 0 && (
            <Typography sx={{ py: 8, color: MUTED }}>
              Nothing here yet under {selected === "All" ? "any heading" : selected}.
            </Typography>
          )}

          {/* The lead piece, given the room a lead deserves */}
          {!loading && lead && (
            <Box
              onClick={() => open(lead)}
              role="link"
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 0.9fr" },
                gap: { xs: 2.5, md: 6 },
                alignItems: "center",
                py: { xs: 4, md: 5 },
                borderBottom: `1px solid ${RULE}`,
                cursor: "pointer",
                "&:hover .lead-title": { color: ACCENT },
              }}
            >
              <Box>
                <Box sx={{ display: "flex", gap: 2, alignItems: "baseline", mb: 1.5 }}>
                  <Typography
                    sx={{
                      fontFamily: MONO,
                      fontSize: "0.68rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: ACCENT,
                    }}
                  >
                    {lead.category || "Latest"}
                  </Typography>
                  <Typography sx={{ fontFamily: MONO, fontSize: "0.68rem", color: "#A9A3B4" }}>
                    {when(lead.createdAt)}
                  </Typography>
                </Box>

                <Typography
                  className="lead-title"
                  sx={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: { xs: "1.8rem", md: "2.5rem" },
                    lineHeight: 1.08,
                    letterSpacing: "-0.025em",
                    color: INK,
                    mb: 1.5,
                    transition: "color 0.15s ease",
                  }}
                >
                  {lead.title}
                </Typography>

                <Typography sx={{ fontSize: "1rem", lineHeight: 1.6, color: MUTED, maxWidth: 520 }}>
                  {excerpt(lead.content, 190)}
                </Typography>
              </Box>

              {lead.coverImage && (
                <Box sx={{ position: "relative" }}>
                  <GraphPlane
                    sx={{
                      display: { xs: "none", md: "block" },
                      inset: 0,
                      transform: "translate(18px, 18px)",
                      zIndex: 0,
                    }}
                  />
                  <Box
                    component="img"
                    src={lead.coverImage}
                    alt=""
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      width: "100%",
                      height: "auto",
                      border: `1px solid ${INK}`,
                      display: "block",
                    }}
                  />
                </Box>
              )}
            </Box>
          )}

          {/* Everything else, as a list you read down */}
          {!loading &&
            rest.map((b) => (
              <Box
                key={b._id}
                onClick={() => open(b)}
                role="link"
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "92px 1fr auto" },
                  gap: { xs: 1, sm: 3 },
                  alignItems: "center",
                  py: 2.8,
                  px: 2,
                  mx: -2,
                  borderBottom: `1px solid ${RULE}`,
                  cursor: "pointer",
                  transition: "background 0.12s ease",
                  "&:hover": { bgcolor: "#fff" },
                  "&:hover .row-title": { color: ACCENT },
                }}
              >
                <Typography sx={{ fontFamily: MONO, fontSize: "0.7rem", color: "#A9A3B4" }}>
                  {when(b.createdAt)}
                </Typography>

                <Box>
                  <Typography
                    className="row-title"
                    sx={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: INK,
                      mb: 0.4,
                      transition: "color 0.15s ease",
                    }}
                  >
                    {b.title}
                  </Typography>
                  <Typography sx={{ fontSize: "0.9rem", color: MUTED, lineHeight: 1.55 }}>
                    {excerpt(b.content, 110)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  {b.category && (
                    <Typography
                      sx={{
                        fontFamily: MONO,
                        fontSize: "0.66rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: MUTED,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {b.category}
                    </Typography>
                  )}
                  {isAdmin && (
                    <Box
                      component="button"
                      aria-label="Delete this post"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleDelete(b._id);
                      }}
                      sx={{
                        border: "none",
                        background: "none",
                        p: 0.5,
                        display: "flex",
                        cursor: "pointer",
                        color: "#A9A3B4",
                        "&:hover": { color: "#C0392B" },
                      }}
                    >
                      <DeleteOutlineRounded sx={{ fontSize: 18 }} />
                    </Box>
                  )}
                </Box>
              </Box>
            ))}

          {!loading && filtered.length > shown && (
            <Box
              component="button"
              onClick={() => setShown((n) => n + PAGE)}
              sx={{
                mt: 4,
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                border: `1.5px solid ${INK}`,
                background: "none",
                px: 2.75,
                py: 1.2,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.92rem",
                fontWeight: 600,
                color: INK,
                transition: "background 0.15s ease, color 0.15s ease",
                "&:hover": { bgcolor: ACCENT, borderColor: ACCENT, color: "#fff" },
              }}
            >
              Show {Math.min(PAGE, filtered.length - shown)} more
              <ArrowForwardRounded sx={{ fontSize: 16 }} />
            </Box>
          )}
        </Container>
      </Box>

      <Footer />

      <Snackbar
        open={!!successMessage}
        autoHideDuration={5000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert severity="success" sx={{ borderRadius: 0 }}>
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError("")}>
        <Alert severity="error" sx={{ borderRadius: 0 }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
