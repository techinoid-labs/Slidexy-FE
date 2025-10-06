"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  IconButton,
  Stack,
  Button,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  ArrowUpward,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Blog {
  _id: string;
  title: string;
  content: string;
  coverImage?: string;
  category?: string;
  author: string;
  createdAt?: string;
}

interface BlogDetailProps {
  blog: Blog;
  relatedBlogs?: Blog[];
  purpleColor: string;
  purpleLight: string;
  isAdmin?: boolean;
  onDelete?: () => void;
}

const BlogDetail: React.FC<BlogDetailProps> = ({
  blog,
  relatedBlogs = [],
  purpleColor,
  purpleLight,
  isAdmin = false,
  onDelete,
}) => {
  const router = useRouter();

  const formatDate = (date?: string) => {
    if (!date) return "MM/DD/YYYY";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleEdit = () => {
    router.push(`/blog/edit/${blog._id}`);
  };

  return (
    <Box sx={{ bgcolor: "#FAFBFC" }}>
      {/* Title Section */}
      <Container maxWidth="lg" sx={{ pt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.5rem" },
              lineHeight: 1.2,
              color: "#1a1a2e",
              flex: 1,
            }}
          >
            {blog.title}
          </Typography>

          {/* Admin Actions */}
          {isAdmin && (
            <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
              <IconButton
                onClick={handleEdit}
                sx={{
                  bgcolor: purpleLight,
                  color: purpleColor,
                  "&:hover": {
                    bgcolor: purpleColor,
                    color: "white",
                  },
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={onDelete}
                sx={{
                  bgcolor: "rgba(244, 67, 54, 0.1)",
                  color: "#f44336",
                  "&:hover": {
                    bgcolor: "#f44336",
                    color: "white",
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          )}
        </Box>

        {/* Meta Info */}
        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
          {blog.category && (
            <Chip
              label={blog.category}
              sx={{
                bgcolor: purpleLight,
                color: purpleColor,
                fontWeight: 600,
                fontSize: "0.813rem",
                height: 28,
                borderRadius: 1,
              }}
            />
          )}
          <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
            By Slidexy Content Writing Team
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
            {formatDate(blog.createdAt)}
          </Typography>
        </Stack>
      </Container>

      {/* Cover Image */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Box
          sx={{
            width: "100%",
            height: { xs: 300, md: 400 },
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "#f5f5f5",
          }}
        >
          {blog.coverImage ? (
            <img
              src={blog.coverImage}
              alt={blog.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#e0e0e0",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Brand Identity Image
              </Typography>
            </Box>
          )}
        </Box>
      </Container>

      {/* Article Content */}
      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Box
          sx={{
            "& h1, & h2, & h3, & h4": {
              fontWeight: 700,
              color: "#1a1a2e",
              mb: 3,
            },
            "& h4": {
              fontSize: "1.75rem",
            },
            "& p": {
              lineHeight: 1.8,
              fontSize: "1rem",
              color: "text.primary",
              mb: 2,
            },
            "& img": {
              maxWidth: "100%",
              height: "auto",
              borderRadius: 3,
              my: 4,
            },
          }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </Container>

      {/* Related Blogs Section */}
      {relatedBlogs.length > 0 && (
        <Box sx={{ bgcolor: "white", py: 8 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h5"
              sx={{
                fontWeight: 500,
                fontSize: "2rem",
                mb: 4,
                color: "#1a1a2e",
              }}
            >
              Related to this topic:
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 3,
              }}
            >
              {relatedBlogs.slice(0, 3).map((relatedBlog) => (
                <Box key={relatedBlog._id} sx={{ width: '100%' }}>
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
                    onClick={() => router.push(`/blog/${relatedBlog._id}`)}
                  >
                    <Box sx={{ position: "relative", height: 200 }}>
                      {relatedBlog.coverImage ? (
                        <img
                          src={relatedBlog.coverImage}
                          alt={relatedBlog.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: 280,
                            bgcolor: "#1a1a2e",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 500,
                          }}
                        >
                          <Typography variant="body2" color="white">
                            {relatedBlog.title}
                          </Typography>
                        </Box>
                      )}
                    </Box>
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
                            fontSize: "1.2rem",
                          }}
                        >
                          {relatedBlog.category || "Category"}
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
                          <ArrowUpward
                            sx={{
                              color: purpleColor,
                              fontSize: 18,
                              transform: "rotate(45deg)",
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#1a1a2e",
                          fontWeight: 700,
                          fontSize: "1.125rem",
                          lineHeight: 1.3,
                        }}
                      >
                        {relatedBlog.title}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      )}

      {/* CTA Section */}
      <Box
        sx={{
          background: "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 500,
              fontSize: { xs: "2rem", md: "2.5rem" },
              color: "white",
              mb: 2,
            }}
          >
            Experience the Future First
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.125rem",
              color: "rgba(255,255,255,0.9)",
              mb: 4,
            }}
          >
            Join the waitlist today and let AI-powered innovation reach you before the crowd.
          </Typography>
          <Link href="/waiting-list" passHref>
            <Button
              variant="contained"
              sx={{
                bgcolor: "white",
                color: "#667eea",
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.9)",
                },
              }}
            >
              Get Started
            </Button>
          </Link>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "white", py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: "2rem",
                background: "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              LOGO
            </Typography>
            <Stack direction="row" spacing={4} sx={{ color: "text.secondary" }}>
              {["Templates", "Features", "Reports", "Product", "Blog"].map((link) => (
                <Typography
                  key={link}
                  variant="body2"
                  sx={{
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    "&:hover": { color: purpleColor },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Stack>
            <Stack direction="row" spacing={2}>
              <IconButton size="small" sx={{ color: purpleColor }}>
                <Facebook sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton size="small" sx={{ color: purpleColor }}>
                <Twitter sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton size="small" sx={{ color: purpleColor }}>
                <Instagram sx={{ fontSize: 20 }} />
              </IconButton>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
              Copyright © 2025. All Rights Reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default BlogDetail;