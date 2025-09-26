"use client";
import React from "react";
import StepsHeader from "../../components/headers-navbar/StepsHeader";
import BlogPostForm from "../../components/blogs/BlogPostForm";
import { Container, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation"; 
import { useUser } from "../../context/AuthContext";

interface FormData {
  title: string;
  headings: { id: number; text: string }[];
  subheadings: { id: number; text: string }[];
  content: string;
  coverImage: string;
  media: string[];
}

export default function CreateBlogPage() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useUser();
  const isAdmin = user?.admin || false;

  React.useEffect(() => {
    if (!isAdmin) {
      router.push("/blog");
    }
  }, [isAdmin, router]);

  const handleSubmit = (formData: FormData) => {
    // Placeholder for API call (to be implemented later)
    console.log("Form submitted:", formData);
  };

  if (!isAdmin) return null; // Prevent rendering if not admin

  return (
    <>
      <StepsHeader />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h2" gutterBottom>
            Create New Blog Post
          </Typography>
        </Box>
        <BlogPostForm onSubmit={handleSubmit} />
      </Container>
    </>
  );
}