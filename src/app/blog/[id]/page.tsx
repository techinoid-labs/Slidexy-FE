"use client";
import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Box,
  Alert,
  Typography,
  Breadcrumbs,
  Container,
} from "@mui/material";
import { Home as HomeIcon, NavigateNext } from "@mui/icons-material";
import { redirect, useParams, useRouter } from "next/navigation";
import { useUser } from "../../context/AuthContext";
import StepsHeader from "../../components/headers-navbar/StepsHeader";
import BlogDetail from "../../components/blogs/BlogDetail";
import { useSession } from "next-auth/react";
import Header from "@/app/components/headers-navbar/Header";
interface Blog {
  _id: string;
  title: string;
  content: string;
  coverImage?: string;
  media?: string[];
  category?: string;
  author: string;
  createdAt?: string;
  updatedAt?: string;
}
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
export default function BlogDetailPage() {
  redirect("/");
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const isAdmin = user?.admin || false;
  const { data: session } = useSession();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const purpleColor = "#8E2DE2";
  const purpleLight = "rgba(142, 45, 226, 0.08)";

  useEffect(() => {
    fetchAllBlogs();
    if (params.id) {
      fetchBlog(params.id as string);
    }
  }, [params.id]);

  const fetchAllBlogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs`);
      if (!response.ok) throw new Error("Failed to fetch blogs");
      const data = await response.json();
      setAllBlogs(data.blogs || data);
    } catch (err: any) {
      console.error(err);
    }
  };

  const fetchBlog = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`);
      if (!response.ok) throw new Error("Blog not found");
      const data = await response.json();
      setBlog(data);
    } catch (err: any) {
      setError(err.message || "Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (blog && allBlogs.length > 0) {
      const related = allBlogs
        .filter((b) => b.category === blog.category && b._id !== blog._id)
        .slice(0, 3);
      setRelatedBlogs(related);
    }
  }, [blog, allBlogs]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const token = session?.user?.accessToken;
      const response = await fetch(`${API_BASE_URL}/api/blogs/${params.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete blog");

      router.push("/blog");
    } catch (err: any) {
      setError(err.message || "Failed to delete blog");
    }
  };

  if (loading) {
    return (
      <>
        {/* <StepsHeader /> */}
        <Header />
        <Box sx={{ bgcolor: "#FAFBFC", minHeight: "100vh", py: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: purpleColor }} />
          </Box>
        </Box>
      </>
    );
  }

  return (
    <>
      {/* <StepsHeader /> */}
      <Header />

      <Box sx={{ bgcolor: "#FAFBFC", minHeight: "100vh" }}>
        {error ? (
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Alert severity="error">{error}</Alert>
          </Container>
        ) : blog ? (
          <>
            {/* Breadcrumbs */}
            <Container maxWidth="lg" sx={{ pt: 3, pb: 0 }}>
              <Breadcrumbs
                separator={
                  <NavigateNext
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                }
                sx={{ mb: 0 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "text.secondary",
                    cursor: "pointer",
                  }}
                  onClick={() => router.push("/")}
                >
                  <HomeIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    Home
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.875rem",
                    color: "text.secondary",
                    cursor: "pointer",
                  }}
                  onClick={() => router.push("/blog")}
                >
                  Blog
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.875rem", color: "text.primary" }}
                >
                  {blog.title}
                </Typography>
              </Breadcrumbs>
            </Container>

            {/* Blog Detail Component */}
            <BlogDetail
              blog={blog}
              relatedBlogs={relatedBlogs}
              purpleColor={purpleColor}
              purpleLight={purpleLight}
              isAdmin={isAdmin}
              onDelete={handleDelete}
            />
          </>
        ) : null}
      </Box>
    </>
  );
}
