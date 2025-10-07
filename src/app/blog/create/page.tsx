// src/app/blog/create/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import StepsHeader from "../../components/headers-navbar/StepsHeader";
import BlogPostForm from "../../components/blogs/BlogPostForm";
import { Container, Alert, Snackbar } from "@mui/material";
import { redirect, useRouter } from "next/navigation";
import { useUser } from "../../context/AuthContext";
import Header from "@/app/components/headers-navbar/Header";

export default function CreateBlogPage() {
  // redirect("/");

  const router = useRouter();
  const { user } = useUser();
  const isAdmin = user?.admin || false;

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      router.push("/blog");
    }
  }, [isAdmin, router]);

  const handleSubmit = async (data: any) => {
    setSuccessMessage("Blog created successfully!");
    setTimeout(() => {
      router.push("/blog");
    }, 1500);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (!isAdmin) return null;

  return (
    <>
      <StepsHeader />
      <Header />
      <Container maxWidth={false} disableGutters sx={{ py: 0 }}>
        <BlogPostForm onSubmit={handleSubmit} onError={handleError} />
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