"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Container, Typography, CircularProgress, Alert } from "@mui/material";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUser } from "../../context/AuthContext";
import { slugify } from "../../../utils/slugUtils";
import Header from "@/app/components/headers-navbar/Header";
import Footer from "@/app/components/home/Footer";
import BlogDetail from "../../components/blogs/BlogDetail";
import { ACCENT, BONE, INK, MONO, MUTED } from "../../components/home/editorial";

/**
 * One post.
 *
 * The page owns loading, the crumb trail and the admin delete; the
 * reading surface is BlogDetail. Same endpoints and the same slug
 * matching as before, on the house system instead of the old grey card.
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
  updatedAt?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { data: session } = useSession();
  const isAdmin = user?.admin || false;

  const [all, setAll] = useState<Blog[]>([]);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/blogs`);
        if (!res.ok) throw new Error("Could not load the post");
        const data = await res.json();
        const list: Blog[] = data.blogs || data;
        setAll(list);

        const found = list.find((b) => slugify(b.title) === params.slug);
        if (found) setBlog(found);
        else setError("That post does not exist, or it has moved.");
      } catch (err: any) {
        setError(err.message || "Could not load the post");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.slug]);

  // Same category first; if there is nothing in it, fall back to the most
  // recent posts, because an empty Next block is worse than a loose one.
  const related = useMemo(() => {
    if (!blog) return [];
    const sameTopic = all.filter((b) => b.category === blog.category && b._id !== blog._id);
    const pool = sameTopic.length > 0 ? sameTopic : all.filter((b) => b._id !== blog._id);
    return pool.slice(0, 3);
  }, [blog, all]);

  const handleDelete = async () => {
    if (!blog?._id) return;
    if (!confirm("Delete this post? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/blogs/${blog._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      });
      if (!res.ok) throw new Error("Could not delete the post");
      router.push("/blog");
    } catch (err: any) {
      setError(err.message || "Could not delete the post");
    }
  };

  return (
    <Box
      component="main"
      sx={{ minHeight: "100vh", bgcolor: BONE, display: "flex", flexDirection: "column", overflowX: "clip" }}
    >
      <Header />

      <Box sx={{ flex: "1 0 auto" }}>
        <Container maxWidth="md" sx={{ pt: { xs: 2.5, md: 3.5 } }}>
          <Box
            component={Link}
            href="/blog"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              fontFamily: MONO,
              fontSize: "0.66rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: MUTED,
              textDecoration: "none",
              "&:hover": { color: ACCENT },
            }}
          >
            ← Back to writing
          </Box>
        </Container>

        {loading && (
          <Box sx={{ py: 14, display: "flex", justifyContent: "center" }}>
            <CircularProgress size={22} sx={{ color: ACCENT }} />
          </Box>
        )}

        {!loading && error && (
          <Container maxWidth="md" sx={{ py: 10 }}>
            <Alert severity="error" sx={{ borderRadius: 0, mb: 3 }}>
              {error}
            </Alert>
            <Box
              component={Link}
              href="/blog"
              sx={{
                display: "inline-block",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: INK,
                borderBottom: `2px solid ${ACCENT}`,
                pb: 0.3,
                textDecoration: "none",
              }}
            >
              Back to everything we have written
            </Box>
          </Container>
        )}

        {!loading && blog && (
          <BlogDetail
            blog={blog}
            relatedBlogs={related}
            isAdmin={isAdmin}
            onDelete={handleDelete}
          />
        )}
      </Box>

      <Footer />
    </Box>
  );
}
