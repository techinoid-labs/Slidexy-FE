"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Input,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface FormData {
  title: string;
  headings: { id: number; text: string }[];
  subheadings: { id: number; text: string }[];
  content: string;
  coverImage: string;
  media: string[];
}

interface BlogPostFormProps {
  onSubmit: (formData: FormData) => void;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ onSubmit }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    headings: [{ id: 1, text: "" }],
    subheadings: [{ id: 1, text: "" }],
    content: "",
    coverImage: "",
    media: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHeadingChange = (id: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      headings: prev.headings.map((h) => (h.id === id ? { ...h, text: value } : h)),
    }));
  };

  const handleSubheadingChange = (id: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      subheadings: prev.subheadings.map((s) => (s.id === id ? { ...s, text: value } : s)),
    }));
  };

  const addHeading = () => {
    setFormData((prev) => ({
      ...prev,
      headings: [...prev.headings, { id: Date.now(), text: "" }],
    }));
  };

  const addSubheading = () => {
    setFormData((prev) => ({
      ...prev,
      subheadings: [...prev.subheadings, { id: Date.now(), text: "" }],
    }));
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const mediaUrls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, media: [...prev.media, ...mediaUrls] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const combinedContent = `
      ${formData.title ? `# ${formData.title}\n\n` : ""}
      ${formData.headings.map((h) => h.text ? `## ${h.text}\n\n` : "").join("")}
      ${formData.subheadings.map((s) => s.text ? `### ${s.text}\n\n` : "").join("")}
      ${formData.content}
    `;
    onSubmit({ ...formData, content: combinedContent });
  };

  return (
    <Card>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ "& > *": { mb: 2 } }}>
          <Typography variant="h6">Blog Details</Typography>
          <TextField
            fullWidth
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">Headings</Typography>
          {formData.headings.map((heading) => (
            <TextField
              key={heading.id}
              fullWidth
              name={`heading-${heading.id}`}
              label="Heading"
              value={heading.text}
              onChange={(e) => handleHeadingChange(heading.id, e.target.value)}
              sx={{ mb: 2 }}
            />
          ))}
          <Button variant="outlined" onClick={addHeading} sx={{ mb: 2 }}>
            Add Heading
          </Button>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">Subheadings</Typography>
          {formData.subheadings.map((subheading) => (
            <TextField
              key={subheading.id}
              fullWidth
              name={`subheading-${subheading.id}`}
              label="Subheading"
              value={subheading.text}
              onChange={(e) => handleSubheadingChange(subheading.id, e.target.value)}
              sx={{ mb: 2 }}
            />
          ))}
          <Button variant="outlined" onClick={addSubheading} sx={{ mb: 2 }}>
            Add Subheading
          </Button>
          <TextField
            fullWidth
            name="content"
            label="Content"
            multiline
            rows={6}
            value={formData.content}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            name="coverImage"
            label="Cover Image URL"
            value={formData.coverImage}
            onChange={handleChange}
          />
          <Input
            type="file"
            inputProps={{ multiple: true }}
            onChange={handleMediaChange}
            sx={{ mb: 2 }}
          />
          {formData.media.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Uploaded Media:</Typography>
              {formData.media.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Media ${index + 1}`}
                  style={{ maxWidth: "100px", marginRight: "10px" }}
                />
              ))}
            </Box>
          )}
          <Button variant="contained" type="submit" color="primary">
            Post Blog
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BlogPostForm;