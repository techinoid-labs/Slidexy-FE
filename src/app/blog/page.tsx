"use client";
import React, { useEffect, useState } from "react";
import StepsHeader from "../components/headers-navbar/StepsHeader";
import BlogList from "../components/blogs/BlogList";
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import {
  Add as AddIcon,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
} from "@mui/icons-material";
import { redirect, useRouter } from "next/navigation";
import { useUser } from "../context/AuthContext";
import Header from "../components/headers-navbar/Header";
import Footer from "../components/home/Footer";

interface Blog {
  _id: string;
  title: string;
  content: string;
  coverImage?: string;
  media?: string[];
  category?: string;
  author?: { name?: string; _id?: string };
  createdAt?: string;
}

const categories = [
  "All Templates",
  "Educational",
  "Project Proposal",
  "Brand Awareness",
  "Client Proposal",
  "Financial Analysis",
  "Business Report",
];
const darkBg = "rgba(26, 26, 26, 1)";
const lightBg = "white";
const textColor = "rgba(26, 26, 26, 1)";

const tagTypes = [
  { type: "Target Audience", value: "Gen Z & Millennials" },
  { type: "Strategy", value: "Content Marketing Strategy" },
  { type: "Category", value: "Creative Brand Awareness" },
  { type: "Category", value: "Fun Brand Awareness Ideas" },
  { type: "Strategy", value: "Content Marketing Game Plan" },
  { type: "Target Audience", value: "Gen Z and Millennials" },
];

export default function BlogPage() {
  // redirect("/");
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  const router = useRouter();
  const { user } = useUser();
  const isAdmin = user?.admin || false;

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Templates");
  const [showLoadMore, setShowLoadMore] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All Templates") {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(
        blogs.filter((blog) => blog.category === selectedCategory)
      );
    }
    setShowLoadMore(filteredBlogs.length > 6);
  }, [selectedCategory, blogs]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/blogs`);
      if (!response.ok) throw new Error("Failed to fetch blogs");
      const data = await response.json();
      const blogsData = data.blogs || data;
      setBlogs(blogsData);
      setFilteredBlogs(blogsData);
    } catch (err: any) {
      setError(err.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete blog");

      setSuccessMessage("Blog deleted successfully");
      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete blog");
    }
  };

  const purpleColor = "#8E2DE2";
  const purpleGradient =
    "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)";
  const purpleLight = "rgba(142, 45, 226, 0.08)";
  const blackBg = "rgba(26, 26, 26, 1)";
  const lightGray = "#f5f5f5";

  const formatDate = (date?: string) => {
    if (!date) return "MM/DD/YYYY";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getDescription = (content?: string) => {
    if (!content)
      return "Turn any thought into a polished, on-brand presentation — powered by AI, styled by designers.";
    return content.length > 100 ? `${content.substring(0, 100)}...` : content;
  };

  return (
    <>
      {/* <StepsHeader /> */}
      <Header />
      <Box
        sx={{
          bgcolor: "#FAFBFC",
          minHeight: "100vh",
          pt: 8,
          pb: 12,
        }}
      >
        <Container maxWidth="lg">
          {/* Hero Section with Featured Blog */}
          <Box
            sx={{
              textAlign: "center",
              mb: 8,
            }}
          >
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: 500,
                fontColor: "rgba(26, 26, 26, 1)",
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                mb: 2,
                background: "rgba(26, 26, 26, 1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Our Blogs
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                mb: 4,
                maxWidth: 600,
                mx: "auto",
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Turn any thought into a polished, on-brand presentation — powered
              by AI, styled by designers.
            </Typography>
            {isAdmin && (
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => router.push("/blog/create")}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  background: purpleGradient,
                  boxShadow: `0 4px 15px ${purpleLight}`,
                  "&:hover": {
                    boxShadow: `0 6px 20px rgba(142, 45, 226, 0.6)`,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Post Blog
              </Button>
            )}
          </Box>

          {!loading && filteredBlogs.length > 0 && (
            <Box
              sx={{
                mb: 6,
                borderRadius: 4,
                border: "1px solid rgba(246, 246, 246, 1)",
                overflow: "hidden",
                bgcolor: "white",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                },
              }}
              onClick={() => router.push(`/blog/${filteredBlogs[0]._id}`)}
            >
              {/* Top Image */}
              {filteredBlogs[0].coverImage && (
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 270, md: 310 },
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={filteredBlogs[0].coverImage}
                    alt={filteredBlogs[0].title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}

              {/* Content Section */}
              <Box sx={{ p: 3 }}>
                {/* Category + Author + Date */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  {filteredBlogs[0].category && (
                    <Chip
                      label={filteredBlogs[0].category}
                      size="small"
                      sx={{
                        bgcolor: purpleLight,
                        color: purpleColor,
                        fontWeight: 600,
                        borderRadius: "12px",
                        px: 1,
                        mr: 1.5,
                      }}
                    />
                  )}
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontSize: "0.9rem" }}
                  >
                    {formatDate(filteredBlogs[0].createdAt)}
                    {"     "}
                    Slidexy • Content Writing Team
                  </Typography>
                </Box>

                {/* Title */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1.25rem", md: "1.5rem" },
                    lineHeight: 1.4,
                    mb: 1,
                    color: "text.primary",
                  }}
                >
                  {filteredBlogs[0].title}
                </Typography>

                {/* Subtitle + Arrow */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.95rem", flex: 1, pr: 2 }}
                  >
                    Turn any thought into a polished, on-brand presentation —
                    powered by AI, styled by designers.
                  </Typography>
                  <IconButton sx={{ color: purpleColor }}>
                    <ChevronRight />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          )}

          {/* Recent News & Insights Section */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: 500,
                textAlign: "center",
                mb: 6,
                background: "rgba(26, 26, 26, 1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Our Recent News & Insights
            </Typography>

            <Box sx={{ py: 3, mb: 0 }}>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  flexWrap: "nowrap", // keeps them in a single line
                  overflowX: "auto", // scroll horizontally if needed
                  justifyContent: "flex-start",
                  "&::-webkit-scrollbar": { display: "none" }, // hide scrollbar (optional)
                }}
              >
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => setSelectedCategory(category)}
                    clickable
                    sx={{
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      borderRadius: "20px",
                      flexShrink: 0, // prevents shrinking
                      background:
                        selectedCategory === category ? darkBg : lightBg,
                      color:
                        selectedCategory === category ? "white" : textColor,
                      border: "none",
                      boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Cards Grid Section */}
            <Box sx={{ py: 6 }}>
              <Container maxWidth="lg">
                {loading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 8 }}
                  >
                    <CircularProgress sx={{ color: purpleColor }} />
                  </Box>
                ) : error ? (
                  <Alert severity="error" sx={{ maxWidth: 600, mx: "auto" }}>
                    {error}
                  </Alert>
                ) : filteredBlogs.length > 1 ? (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "repeat(1, 1fr)",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                      },
                      gap: 3,
                    }}
                  >
                    {filteredBlogs.slice(1, 7).map((blog, index) => {
                      const currentIndex = index % tagTypes.length;
                      const tags = tagTypes[currentIndex];
                      return (
                        <Box key={blog._id} sx={{ width: "100%" }}>
                          <Box
                            sx={{
                              border: "1px solid #e0e0e0",
                              borderRadius: 3,
                              overflow: "hidden",
                              backgroundColor: "white",
                              transition: "all 0.3s ease",
                              cursor: "pointer",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                              },
                            }}
                            onClick={() => router.push(`/blog/${blog._id}`)}
                          >
                            {/* Image Section */}
                            {blog.coverImage ? (
                              <Box sx={{ position: "relative", height: 200 }}>
                                <img
                                  src={blog.coverImage}
                                  alt={blog.title}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  height: 280,
                                  bgcolor: blackBg,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                }}
                              >
                                <Typography variant="h6">No Image</Typography>
                              </Box>
                            )}

                            {/* Tags Section - Bottom Card */}
                            <Box sx={{ p: 3, bgcolor: "white" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  mb: 1.5,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: purpleColor,
                                    fontWeight: 500,
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {tags.type}
                                </Typography>
                                <Box
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    bgcolor: purpleLight,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <ChevronRight
                                    sx={{
                                      color: purpleColor,
                                      fontSize: 20,
                                      transform: "rotate(-45deg)",
                                    }}
                                  />
                                </Box>
                              </Box>
                              <Typography
                                variant="h6"
                                sx={{
                                  color: textColor,
                                  fontWeight: 600,
                                  fontSize: "1.125rem",
                                  lineHeight: 1.3,
                                }}
                              >
                                {tags.value}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                ) : null}

                {showLoadMore && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                  >
                    <Button
                      variant="outlined"
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        borderColor: purpleColor,
                        color: purpleColor,
                        fontWeight: 600,
                        "&:hover": {
                          borderColor: purpleGradient,
                          background: purpleLight,
                        },
                      }}
                    >
                      Load More
                    </Button>
                  </Box>
                )}
              </Container>
            </Box>
          </Box>

          {/* Related Blogs Section on Light Gray */}
          {filteredBlogs.length > 7 && (
            <Box sx={{ mb: 8, backgroundColor: lightGray, py: 6 }}>
              <Container maxWidth="lg">
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    mb: 4,
                    color: "text.primary",
                    textAlign: "left",
                  }}
                >
                  Related Blogs
                </Typography>
                <BlogList
                  blogs={filteredBlogs.slice(7, 10)}
                  isAdmin={isAdmin}
                  onDelete={handleDelete}
                  purpleColor={purpleColor}
                />
              </Container>
            </Box>
          )}

          {/* Waitlist Section */}
          <Box
            sx={{
              background:
                "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
              borderRadius: 0,
              py: 8,
              textAlign: "center",
              width: "100vw",
              marginLeft: "calc(-50vw + 50%)",
              color: "white",
              mb: 8,
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 500,
                fontSize: { xs: "2rem", md: "2.5rem" },
                mb: 2,
              }}
            >
              Experience the Future First
            </Typography>
            <Typography
              variant="body1"
              sx={{
                noWrap: "normal",
                mb: 8,
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.6,
                opacity: 0.9,
              }}
            >
              Join the waitlist today and let AI-powered innovation reach you
              before the crowd.
            </Typography>
            <Link href="/waiting-list" passHref>
              <Button
                variant="contained"
                sx={{
                  color: "#6412FF",
                  background: "#FFFFFF",
                  borderRadius: "999px",
                  borderColor: "white",
                  px: 3,
                  textTransform: "none",
                  fontWeight: 600,
                  whiteSpace: "nowrap",

                  mt: { xs: 0, md: -10 },
                }}
              >
                Join Waitlist
              </Button>
            </Link>
          </Box>

          {/* Categories/Tags Section */}
          <Box sx={{ mb: 8, textAlign: "center" }}>
            <Container maxWidth="lg">
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                flexWrap="wrap"
              >
                {categories.slice(1).map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    variant="outlined"
                    sx={{
                      color: "rgba(26, 26, 26, 1)",
                      borderColor: "rgba(26, 26, 26, 1)",
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Stack>
            </Container>
          </Box>
        </Container>

        {/* Footer */}
        <Footer />
        {/* SnackBar */}
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
      </Box>
    </>
  );
}
