"use client";
import React from "react";
import { Box, Card, CardMedia, CardContent, Typography, Grid } from "@mui/material";

interface Blog {
  _id?: string;
  title: string;
  content: string;
  coverImage?: string;
  author?: { name?: string };
  createdAt?: string;
}

interface BlogListProps {
  blogs?: Blog[];
}

const BlogList: React.FC<BlogListProps> = ({ blogs = [] }) => {
  return (
    <Grid container spacing={4}>
      {blogs.map((blog, index) => (
        //<Grid item xs={12} md={6} key={index}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {blog.coverImage && (
              <CardMedia
                component="img"
                height="200"
                image={blog.coverImage}
                alt={blog.title}
              />
            )}
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="div" gutterBottom>
                {blog.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {blog.content.substring(0, 150)}...
              </Typography>
              <Typography variant="caption" color="text.secondary">
                By {blog.author?.name || "Unknown"} | {new Date().toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        //</Grid>
      ))}
    </Grid>
  );
};

export default BlogList;