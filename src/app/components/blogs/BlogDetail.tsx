"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";
import EditRounded from "@mui/icons-material/EditRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import { slugify } from "../../../utils/slugUtils";
import { ACCENT, INK, MONO, MUTED, RULE } from "../home/editorial";
import { GraphPlane } from "../home/blocks";

/**
 * A post, set as a newspaper page.
 *
 * The rest of the site is a modern document: sans type, left aligned,
 * lots of air. An article is a different artifact and gets different
 * rules, the ones print has used for two centuries because they work:
 *
 *   serif text, because nobody reads 2,000 words of grotesque willingly
 *   a centred masthead under a heavy rule
 *   a kicker, a headline, a standfirst, then a byline between hairlines
 *   a drop cap to start the body, and an end mark to close it
 *   justified setting on a narrow measure, hyphenated
 *   section heads announced by a rule rather than by white space
 *
 * No new webfont is loaded for any of this. Playfair and Source Serif
 * are already in the document for the slide themes, so the page borrows
 * them and costs nothing extra.
 */

const DISPLAY = 'var(--font-playfair), Georgia, "Times New Roman", serif';
const TEXT = 'var(--font-sourceserif), Georgia, "Times New Roman", serif';

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
  updatedAt?: string;
}

interface BlogDetailProps {
  blog: Blog;
  relatedBlogs?: Blog[];
  isAdmin?: boolean;
  onDelete?: () => void;
  /** Kept so older callers still type-check; the palette is shared now. */
  purpleColor?: string;
  purpleLight?: string;
}

const when = (d?: string) =>
  d
    ? new Date(d)
        .toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
        .toUpperCase()
    : "";

const minutes = (html?: string) => {
  if (!html) return 1;
  const words = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
};

/** The opening line of the piece, used as the standfirst under the title. */
const standfirst = (html?: string, max = 200) => {
  if (!html) return "";
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;

  // A whole sentence if one ends in range, otherwise a clean word break.
  const stop = text.lastIndexOf(". ", max);
  if (stop > 60) return text.slice(0, stop + 1);
  const space = text.lastIndexOf(" ", max);
  return `${text.slice(0, space > 60 ? space : max).trimEnd()}…`;
};

const SMALLCAPS = {
  fontFamily: MONO,
  fontSize: "0.66rem",
  letterSpacing: "0.22em",
  textTransform: "uppercase" as const,
};

const BlogDetail: React.FC<BlogDetailProps> = ({ blog, relatedBlogs = [], isAdmin, onDelete }) => {
  const body = useRef<HTMLDivElement>(null);
  const [sections, setSections] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    const el = body.current;
    if (!el) return;
    const heads = Array.from(el.querySelectorAll("h2"));
    setSections(
      heads.map((h, i) => {
        const text = (h.textContent || "").trim();
        const id =
          h.id ||
          `s-${i}-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40)}`;
        h.id = id;
        h.style.scrollMarginTop = "96px";
        return { id, text };
      })
    );
  }, [blog._id, blog.content]);

  return (
    <Box component="article" sx={{ pb: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        {/* Masthead. Heavy rule, then the section, centred. */}
        <Box sx={{ maxWidth: 900, mx: "auto", borderTop: `3px solid ${INK}`, pt: 1.25, mt: { xs: 2, md: 3 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              borderBottom: `1px solid ${INK}`,
              pb: 1.25,
              ...SMALLCAPS,
              color: MUTED,
            }}
          >
            <Box component="span">{blog.category || "Writing"}</Box>
            <Box component="span" sx={{ display: { xs: "none", sm: "block" } }}>
              {when(blog.createdAt)}
            </Box>
          </Box>
        </Box>

        <Box sx={{ maxWidth: 900, mx: "auto", textAlign: "center", pt: { xs: 4, md: 6 } }}>
          <Typography
            component="h1"
            sx={{
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: { xs: "2.2rem", sm: "3rem", md: "3.9rem" },
              lineHeight: 1.03,
              letterSpacing: "-0.015em",
              color: INK,
              maxWidth: 820,
              mx: "auto",
            }}
          >
            {blog.title}
          </Typography>

          <Typography
            sx={{
              fontFamily: TEXT,
              fontStyle: "italic",
              fontSize: { xs: "1.05rem", md: "1.22rem" },
              lineHeight: 1.5,
              color: MUTED,
              maxWidth: 620,
              mx: "auto",
              mt: 2.5,
            }}
          >
            {standfirst(blog.content)}
          </Typography>
        </Box>

        {/* Byline, between hairlines, the way a paper sets it */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: { xs: 1.5, sm: 3 },
            borderTop: `1px solid ${INK}`,
            borderBottom: `1px solid ${INK}`,
            py: 1.4,
            mt: { xs: 3.5, md: 5 },
            maxWidth: 900,
            mx: "auto",
            ...SMALLCAPS,
            color: INK,
          }}
        >
          <Box component="span">By {blog.author?.name || "Slidexy"}</Box>
          <Box component="span" sx={{ color: RULE }}>•</Box>
          <Box component="span" sx={{ color: MUTED }}>{minutes(blog.content)} minute read</Box>
        </Box>

        {isAdmin && (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, mt: 2.5 }}>
            <Box
              component={Link}
              href={`/blog/edit/${blog._id}`}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                border: `1px solid ${INK}`,
                px: 1.5,
                py: 0.45,
                ...SMALLCAPS,
                letterSpacing: "0.14em",
                color: INK,
                textDecoration: "none",
                "&:hover": { bgcolor: INK, color: "#fff" },
              }}
            >
              <EditRounded sx={{ fontSize: 13 }} />
              Edit
            </Box>
            <Box
              component="button"
              onClick={onDelete}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                border: `1px solid ${RULE}`,
                background: "none",
                px: 1.5,
                py: 0.45,
                cursor: "pointer",
                ...SMALLCAPS,
                letterSpacing: "0.14em",
                color: MUTED,
                "&:hover": { borderColor: "#A2301F", color: "#A2301F" },
              }}
            >
              <DeleteOutlineRounded sx={{ fontSize: 13 }} />
              Delete
            </Box>
          </Box>
        )}

        {blog.coverImage && (
          <Box sx={{ maxWidth: 900, mx: "auto", mt: { xs: 4, md: 5.5 } }}>
            <Box sx={{ position: "relative" }}>
              <GraphPlane
                sx={{
                  display: { xs: "none", md: "block" },
                  inset: 0,
                  transform: "translate(20px, 20px)",
                  zIndex: 0,
                }}
              />
              <Box
                component="img"
                src={blog.coverImage}
                alt=""
                sx={{
                  position: "relative",
                  zIndex: 1,
                  width: "100%",
                  height: "auto",
                  display: "block",
                  // Print images sit in a frame, not on a shadow.
                  border: `1px solid ${INK}`,
                }}
              />
            </Box>
            <Box
              sx={{
                borderBottom: `1px solid ${RULE}`,
                pt: { xs: 0.9, md: 3.6 },
                pb: 1.2,
                ...SMALLCAPS,
                color: "#A9A3B4",
              }}
            >
              {blog.category ? `${blog.category} · Slidexy` : "Slidexy"}
            </Box>
          </Box>
        )}

        {/* The spread. Text in the main column, furniture in the rail. */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 272px" },
            gap: { md: 6 },
            maxWidth: 1040,
            mx: "auto",
            mt: { xs: 4, md: 6 },
            alignItems: "start",
          }}
        >
        <Box
          ref={body}
          lang="en"
          sx={{
            fontFamily: TEXT,
            fontSize: "1.14rem",
            lineHeight: 1.66,
            color: "#241E30",
            textAlign: "justify",
            hyphens: "auto",

            "& p": { mb: 2.4 },
            "& p:empty": { display: "none" },
            "& p:has(> br:only-child)": { display: "none" },

            // The opening letter, set the way a feature opens.
            "& > p:first-of-type::first-letter": {
              float: "left",
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: "3.9em",
              lineHeight: 0.82,
              paddingRight: "10px",
              paddingTop: "4px",
              color: INK,
            },

            // Section heads announced by a rule, not by white space.
            "& h2": {
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: "1.72rem",
              lineHeight: 1.18,
              color: INK,
              textAlign: "left",
              borderTop: `1px solid ${INK}`,
              pt: 2.2,
              mt: 5,
              mb: 1.6,
            },
            "& h3": {
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: "1.28rem",
              color: INK,
              textAlign: "left",
              mt: 3.6,
              mb: 1.2,
            },
            "& h4": {
              fontFamily: TEXT,
              fontWeight: 700,
              fontSize: "1.08rem",
              color: INK,
              textAlign: "left",
              mt: 3,
              mb: 1,
            },

            "& ul, & ol": { pl: 3, mb: 2.6, textAlign: "left" },
            "& li": { mb: 0.9 },
            "& li::marker": { color: ACCENT },
            "& a": { color: INK, textDecoration: "underline", textUnderlineOffset: "3px" },
            "& a:hover": { color: ACCENT },
            "& strong": { fontWeight: 700, color: INK },
            "& img": {
              maxWidth: "100%",
              height: "auto",
              display: "block",
              my: 3.5,
              border: `1px solid ${INK}`,
            },
            "& blockquote": {
              m: 0,
              my: 3.5,
              px: 0,
              py: 2,
              borderTop: `1px solid ${INK}`,
              borderBottom: `1px solid ${INK}`,
              fontFamily: DISPLAY,
              fontSize: "1.35rem",
              lineHeight: 1.35,
              textAlign: "center",
              color: INK,
            },
            "& code": {
              fontFamily: MONO,
              fontSize: "0.88em",
              bgcolor: "#EDE9F5",
              px: 0.75,
              py: 0.25,
            },
            "& pre": {
              bgcolor: INK,
              color: "#F3ECFA",
              p: 2.5,
              overflowX: "auto",
              my: 3.5,
              textAlign: "left",
              fontFamily: MONO,
              fontSize: "0.86rem",
              lineHeight: 1.6,
            },
            "& pre code": { bgcolor: "transparent", color: "inherit", p: 0 },
            "& hr": { border: "none", borderTop: `1px solid ${RULE}`, my: 4 },
            "& table": { width: "100%", borderCollapse: "collapse", my: 3.5, fontSize: "0.98rem" },
            "& th, & td": {
              borderBottom: `1px solid ${RULE}`,
              textAlign: "left",
              py: 1.1,
              pr: 2,
            },
            "& th": { fontWeight: 700, color: INK, borderBottom: `1px solid ${INK}` },

            // The end mark, after the last paragraph.
            "& > *:last-child::after": {
              content: '""',
              display: "inline-block",
              width: "0.52em",
              height: "0.52em",
              backgroundColor: INK,
              marginLeft: "0.5em",
              verticalAlign: "baseline",
            },
          }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* The rail. Where you are in the piece, and what it is filed
            under. Sticky, because a contents list you have scrolled past
            is no use to anyone. */}
        <Box
          component="aside"
          sx={{
            display: { xs: "none", md: "block" },
            position: "sticky",
            top: 96,
            borderLeft: `1px solid ${RULE}`,
            pl: 3,
          }}
        >
          {sections.length > 1 && (
            <>
              <Box sx={{ ...SMALLCAPS, color: INK, pb: 1, borderBottom: `1px solid ${INK}` }}>
                In this piece
              </Box>
              <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, mb: 4 }}>
                {sections.map((h, i) => (
                  <Box
                    component="li"
                    key={h.id}
                    sx={{ borderBottom: `1px solid ${RULE}` }}
                  >
                    <Box
                      component="a"
                      href={`#${h.id}`}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "20px 1fr",
                        gap: 1,
                        py: 1.3,
                        textDecoration: "none",
                        fontFamily: TEXT,
                        fontSize: "0.92rem",
                        lineHeight: 1.35,
                        color: MUTED,
                        "&:hover": { color: ACCENT },
                      }}
                    >
                      <Box component="span" sx={{ fontFamily: MONO, fontSize: "0.68rem", pt: "2px" }}>
                        {String(i + 1).padStart(2, "0")}
                      </Box>
                      <Box component="span">{h.text}</Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </>
          )}

          {blog.tags && blog.tags.length > 0 && (
            <>
              <Box sx={{ ...SMALLCAPS, color: INK, pb: 1, borderBottom: `1px solid ${INK}` }}>
                Filed under
              </Box>
              <Box sx={{ pt: 1.5, ...SMALLCAPS, color: MUTED, lineHeight: 2 }}>
                {blog.tags.join(" · ")}
              </Box>
            </>
          )}
        </Box>
        </Box>

        {blog.media && blog.media.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              maxWidth: 660,
              mx: "auto",
              mt: 4,
            }}
          >
            {blog.media.map((src, i) => (
              <Box
                key={i}
                component="img"
                src={src}
                alt=""
                sx={{ width: "100%", display: "block", border: `1px solid ${INK}` }}
              />
            ))}
          </Box>
        )}

        {blog.tags && blog.tags.length > 0 && (
          <Box
            sx={{
              maxWidth: 660,
              mx: "auto",
              mt: 4,
              pt: 1.5,
              borderTop: `1px solid ${RULE}`,
              display: { xs: "block", md: "none" },
              ...SMALLCAPS,
              color: MUTED,
            }}
          >
            Filed under: {blog.tags.join(" · ")}
          </Box>
        )}

        {/* The section index, set in columns like the back page */}
        {relatedBlogs.length > 0 && (
          <Box sx={{ mt: { xs: 7, md: 10 } }}>
            <Box
              sx={{
                borderTop: `3px solid ${INK}`,
                borderBottom: `1px solid ${INK}`,
                py: 1.2,
                textAlign: "center",
                ...SMALLCAPS,
                color: INK,
              }}
            >
              More from this section
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              }}
            >
              {relatedBlogs.map((r, i) => (
                <Box
                  key={r._id}
                  component={Link}
                  href={`/blog/${slugify(r.title)}`}
                  sx={{
                    py: 2.6,
                    px: { sm: 2.5 },
                    pl: { sm: i === 0 ? 0 : 2.5 },
                    borderBottom: `1px solid ${RULE}`,
                    borderRight: {
                      xs: "none",
                      sm: i < relatedBlogs.length - 1 ? `1px solid ${RULE}` : "none",
                    },
                    textDecoration: "none",
                    display: "block",
                    "&:hover .next-title": { color: ACCENT },
                  }}
                >
                  <Typography sx={{ ...SMALLCAPS, color: "#A9A3B4", mb: 1 }}>
                    {r.category || "Writing"}
                  </Typography>
                  <Typography
                    className="next-title"
                    sx={{
                      fontFamily: DISPLAY,
                      fontWeight: 700,
                      fontSize: "1.12rem",
                      lineHeight: 1.22,
                      color: INK,
                      transition: "color 0.15s ease",
                    }}
                  >
                    {r.title}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default BlogDetail;
