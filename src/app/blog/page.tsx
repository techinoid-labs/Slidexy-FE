"use client";
import React from "react";
import StepsHeader from "../components/headers-navbar/StepsHeader";
import BlogList from "../components/blogs/BlogList";
import { Container, Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation"; 
import { useUser } from "../context/AuthContext";

export default function BlogPage() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useUser();
  const isAdmin = user?.admin || false;

  return (
    <>
      <StepsHeader />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h2" gutterBottom>
            Blog Posts
          </Typography>
          {isAdmin && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/blog/create")}
            >
              Post Blog
            </Button>
          )}
        </Box>
        <BlogList />
      </Container>
    </>
  );
}
