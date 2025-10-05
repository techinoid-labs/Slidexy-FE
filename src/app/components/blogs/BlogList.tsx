"use client";
import React from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Link,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ChevronRight,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface Blog {
  _id: string;
  title: string;
  content: string;
  coverImage?: string;
  category?: string;
  author?: { name?: string; _id?: string };
  createdAt?: string;
}

interface BlogListProps {
  blogs: Blog[];
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  purpleColor?: string;
  darkCards?: boolean;
}

const BlogList: React.FC<BlogListProps> = ({
  blogs = [],
  isAdmin = false,
  onDelete,
  purpleColor = "#8E2DE2",
  darkCards = false,
}) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedBlog, setSelectedBlog] = React.useState<string | null>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    blogId: string
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedBlog(blogId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBlog(null);
  };

  const handleEdit = () => {
    if (selectedBlog) {
      router.push(`/blog/edit/${selectedBlog}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedBlog && onDelete) {
      onDelete(selectedBlog);
    }
    handleMenuClose();
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const formatDate = (date?: string) => {
    if (!date) return "Recently";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const purpleGradient = "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)";

  if (blogs.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 12,
          color: "text.secondary",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
          No blog posts yet
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Check back later for new content!
        </Typography>
      </Box>
    );
  }

  const cardBg = darkCards ? "rgba(255,255,255,0.1)" : "white";
  const cardTextColor = darkCards ? "white" : "text.primary";
  const borderColor = darkCards ? "transparent" : "grey.100";
  const chipBg = darkCards ? "rgba(255,255,255,0.2)" : "rgba(142, 45, 226, 0.08)";
  const chipColor = darkCards ? "white" : purpleColor;
  const chipBorder = darkCards ? "transparent" : `rgba(142, 45, 226, 0.2)`;

  return (
    <Box>
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
        {blogs.map((blog) => (
          <Box key={blog._id} sx={{ width: '100%' }}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                borderRadius: 3,
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                border: "1px solid",
                borderColor,
                bgcolor: cardBg,
                color: cardTextColor,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
                  borderColor: purpleColor,
                },
              }}
              onClick={() => router.push(`/blog/${blog._id}`)}
            >
              <Box sx={{ position: "relative", overflow: "hidden" }}>
                {blog.coverImage ? (
                  <CardMedia
                    component="img"
                    height="220"
                    image={blog.coverImage}
                    alt={blog.title}
                    sx={{
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                      filter: darkCards ? "brightness(0.5)" : "none",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 220,
                      background: darkCards ? "rgba(255,255,255,0.1)" : purpleGradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h4" color={cardTextColor} sx={{ opacity: 0.8 }}>
                      {blog.title.charAt(0)}
                    </Typography>
                  </Box>
                )}
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    bgcolor: "rgba(255,255,255,0.95)",
                    color: purpleColor,
                    backdropFilter: "blur(10px)",
                    boxShadow: 2,
                    "&:hover": {
                      bgcolor: "white",
                    },
                  }}
                >
                  <ChevronRight />
                </IconButton>
                {isAdmin && (
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      bgcolor: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(10px)",
                      boxShadow: 2,
                      "&:hover": {
                        bgcolor: "white",
                      },
                    }}
                    onClick={(e) => handleMenuOpen(e, blog._id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                )}
              </Box>

              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  p: 3,
                }}
              >
                {blog.category && (
                  <Chip
                    label={blog.category}
                    size="small"
                    sx={{
                      alignSelf: "flex-start",
                      mb: 2,
                      bgcolor: chipBg,
                      color: chipColor,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      height: 28,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: chipBorder,
                    }}
                  />
                )}

                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    lineHeight: 1.4,
                    mb: 1.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    minHeight: "3.5rem",
                    color : cardTextColor,
                  }}
                >
                  {blog.title}
                </Typography>

                {!darkCards && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      flexGrow: 1,
                      lineHeight: 1.7,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {stripHtml(blog.content)}
                  </Typography>
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: "auto",
                    pt: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ 
                        fontWeight: 600, 
                        color: darkCards ? "white" : purpleColor 
                      }}
                    >
                      {blog.author?.name || "Unknown"}
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ fontSize: "0.7rem", color: darkCards ? "rgba(255,255,255,0.7)" : "text.secondary" }}
                    >
                      {formatDate(blog.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            minWidth: 160,
          },
        }}
      >
        <MenuItem
          onClick={handleEdit}
          sx={{
            py: 1.5,
            "&:hover": { bgcolor: "primary.lighter" },
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1.5 }} />
          Edit Post
        </MenuItem>
        <MenuItem
          onClick={handleDelete}
          sx={{
            py: 1.5,
            color: "error.main",
            "&:hover": { bgcolor: "error.lighter" },
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} />
          Delete Post
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default BlogList;