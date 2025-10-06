"use client";
import React, { useEffect, useState } from "react";
import StepsHeader from "../../../components/headers-navbar/StepsHeader";
import BlogPostForm from "../../../components/blogs/BlogPostForm";
import {
  Container,
  Box,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "../../../context/AuthContext";
import { useSession } from "next-auth/react"; 

interface Blog {
  _id: string;
  title: string;
  content: string;
  coverImage?: string;
  media?: string[];
  category?: string;
}

export default function EditBlogPage() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL|| "http://localhost:5000";
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { data: session } = useSession(); // Add this for token
  const isAdmin = user?.admin || false;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      router.push("/blog");
      return;
    }
    if (params.id) {
      fetchBlog(params.id as string);
    }
  }, [isAdmin, params.id, router]);

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

  const handleSubmit = async (formData: FormData) => {
    // Get token like in BlogPostForm
    const token = session?.user?.accessToken;
    if (!token) {
      setError("Authentication required. Please log in again.");
      router.push("/login"); // Adjust to your login route
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs/${params.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          router.push("/login");
          return;
        }
        const data = await response.json();
        throw new Error(data.error || "Failed to update blog");
      }

      setSuccessMessage("Blog updated successfully!");
      setTimeout(() => {
        router.push(`/blog/${params.id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to update blog");
    }
  };

  if (!isAdmin) return null;

  return (
    <>
      <StepsHeader />
      <Container maxWidth="md" sx={{ py: 4 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : blog ? (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                Edit Blog Post
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Update your blog post content
              </Typography>
            </Box>
            <BlogPostForm
              onSubmit={handleSubmit}
              initialData={blog}
              isEdit={true}
            />
          </>
        ) : (
          <Alert severity="error">Blog not found</Alert>
        )}
      </Container>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </>
  );
}