"use client";
import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Chip,
    Stack,
    IconButton,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Container,
    Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import CodeIcon from "@mui/icons-material/Code";
import LinkIcon from "@mui/icons-material/Link";
import TitleIcon from "@mui/icons-material/Title";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import ImageExtension from '@tiptap/extension-image';
import { useSession } from "next-auth/react";

interface FormData {
    title: string;
    content: string;
    category: string;
    coverImage: string;
    media: string[];
    tags: string[];
}

interface Blog {
  _id: string;
  title: string;
  content: string;
  coverImage?: string;
  media?: string[];
  category?: string;
  tags?: string[];
}

interface BlogPostFormProps {
    onSubmit: (data: any) => void | Promise<void>;
    onError?: (error: string) => void;
    initialData?: Blog;
    isEdit?: boolean;
}

const categories = [
    "Educational",
    "Project Proposal",
    "Brand Awareness",
    "Client Proposal",
    "Financial Analysis",
    "Business Report",
];

const BlogPostForm: React.FC<BlogPostFormProps> = ({ onSubmit, onError, initialData, isEdit = false }) => {
    const [formData, setFormData] = useState<FormData>({
        title: initialData?.title || "",
        content: initialData?.content || "",
        category: initialData?.category || "",
        coverImage: initialData?.coverImage || "",
        media: initialData?.media || [],
        tags: initialData?.tags || [],
    });
    const { data: session } = useSession();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string>(initialData?.coverImage || "");
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [tagInput, setTagInput] = useState("");

    const coverImageInputRef = useRef<HTMLInputElement>(null);
    const mediaInputRef = useRef<HTMLInputElement>(null);
    const inlineImageInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            ImageExtension.configure({
                inline: true,
                allowBase64: true,
            }),
        ],
        content: formData.content,
        onUpdate: ({ editor }) => {
            setFormData(prev => ({ ...prev, content: editor.getHTML() }));
        },
        editorProps: {
            attributes: {
                class: 'focus:outline-none',
            },
        },
        immediatelyRender: false,
    });

    useEffect(() => {
        if (editor && initialData?.content) {
            editor.commands.setContent(initialData.content);
        }
    }, [editor, initialData?.content]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size should be less than 5MB");
            return;
        }

        setCoverImageFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setCoverImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        const validFiles = files.filter(file => {
            if (!file.type.startsWith("image/")) {
                setError("Only image files are allowed");
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError("Each image should be less than 5MB");
                return false;
            }
            return true;
        });

        setMediaFiles((prev) => [...prev, ...validFiles]);
    };

    const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size should be less than 5MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Image = reader.result as string;
            editor?.chain().focus().setImage({ src: base64Image, alt: file.name }).run();
        };
        reader.readAsDataURL(file);

        // Reset input
        if (inlineImageInputRef.current) {
            inlineImageInputRef.current.value = "";
        }
    };

    const handleRemoveMedia = (index: number) => {
        setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const removeCoverImage = () => {
        setCoverImageFile(null);
        setCoverImagePreview("");
        if (coverImageInputRef.current) {
            coverImageInputRef.current.value = "";
        }
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const inputTags = tagInput.split(",").map(t => t.trim()).filter(t => t);
            setFormData(prev => ({ ...prev, tags: [...prev.tags, ...inputTags] }));
            setTagInput("");
        }
    };

    const removeTag = (index: number) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
    };

    const addBold = () => editor?.chain().focus().toggleBold().run();
    const addItalic = () => editor?.chain().focus().toggleItalic().run();
    const addUnderline = () => editor?.chain().focus().toggleUnderline().run();
    const addHeading1 = () => editor?.chain().focus().toggleHeading({ level: 1 }).run();
    const addHeading2 = () => editor?.chain().focus().toggleHeading({ level: 2 }).run();
    const addHeading3 = () => editor?.chain().focus().toggleHeading({ level: 3 }).run();
    const addBulletList = () => editor?.chain().focus().toggleBulletList().run();
    const addOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
    const addCodeBlock = () => editor?.chain().focus().toggleCodeBlock().run();
    const addLink = () => {
        const url = window.prompt('URL');
        if (url) {
            editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    };
    const addImageUrl = () => {
        const url = window.prompt('Image URL');
        if (url) {
            editor?.chain().focus().setImage({ src: url }).run();
        }
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError("Title is required");
            return false;
        }
        if (!formData.content.trim()) {
            setError("Content is required");
            return false;
        }
        if (!formData.category.trim()) {
            setError("Category is required");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!validateForm()) return;

        setLoading(true);

        try {
            const formDataObj = new FormData();
            formDataObj.append("title", formData.title.trim());
            formDataObj.append("content", formData.content.trim());
            formDataObj.append("category", formData.category.trim());

            if (coverImageFile) {
                formDataObj.append("coverImage", coverImageFile);
            }

            mediaFiles.forEach((file) => {
                formDataObj.append("media", file);
            });

            formData.tags.forEach((tag) => {
                formDataObj.append("tags", tag);
            });

            if (isEdit) {
                await onSubmit(formDataObj);
                setSuccess(true);
            } else {
                const token = session?.user?.accessToken ;
                
                const response = await fetch(`${API_BASE_URL}/api/blogs`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formDataObj,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to create blog post");
                }

                const data = await response.json();
                setSuccess(true);

                setFormData({ title: "", content: "", category: "", coverImage: "", media: [], tags: [] });
                setCoverImageFile(null);
                setCoverImagePreview("");
                setMediaFiles([]);
                setTagInput("");
                if (coverImageInputRef.current) coverImageInputRef.current.value = "";
                if (mediaInputRef.current) mediaInputRef.current.value = "";
                editor?.commands.setContent('');

                await onSubmit(data);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred";
            setError(errorMessage);
            if (onError) {
                onError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        if (isEdit && initialData) {
            setFormData({
                title: initialData.title,
                content: initialData.content,
                category: initialData.category || "",
                coverImage: initialData.coverImage || "",
                media: initialData.media || [],
                tags: initialData.tags || [],
            });
            setCoverImagePreview(initialData.coverImage || "");
            editor?.commands.setContent(initialData.content);
        } else {
            setFormData({
                title: "",
                content: "",
                category: "",
                coverImage: "",
                media: [],
                tags: [],
            });
            setCoverImagePreview("");
            editor?.commands.setContent('');
        }
        setCoverImageFile(null);
        setMediaFiles([]);
        setTagInput("");
        setError(null);
        setSuccess(false);
        if (coverImageInputRef.current) coverImageInputRef.current.value = "";
        if (mediaInputRef.current) mediaInputRef.current.value = "";
    };

    return (
        <Box sx={{ py: 4 }}>
            <Container maxWidth={false}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        maxWidth: "1400px",
                        mx: "auto",
                        bgcolor: "background.paper",
                        borderRadius: 3,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                        overflow: "hidden",
                    }}
                >
                    <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: "grey.50" }}>
                        <Typography
                            variant="h4"
                            sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
                        >
                            {isEdit ? "Edit Blog Post" : "Create New Blog Post"}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {isEdit ? "Update your blog post content" : "Share your insights and expertise with our community"}
                        </Typography>
                    </Box>

                    <Box sx={{ p: { xs: 3, md: 5 } }}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                {isEdit ? "Blog post updated successfully!" : "Blog post created successfully!"}
                            </Alert>
                        )}

                        <TextField
                            fullWidth
                            name="title"
                            label="Blog Title"
                            placeholder="Enter an engaging title for your blog post"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            sx={{ mb: 3 }}
                            disabled={loading}
                            variant="outlined"
                        />

                        <FormControl fullWidth sx={{ mb: 3 }} disabled={loading}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="category"
                                value={formData.category}
                                label="Category"
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="">Select Category</MenuItem>
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Paper
                            elevation={0}
                            sx={{
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2,
                                overflow: "hidden",
                                mb: 3,
                            }}
                        >
                            <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", bgcolor: "grey.50" }}>
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    <IconButton size="small" onClick={addBold} title="Bold" disabled={!editor || loading}>
                                        <FormatBoldIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={addItalic} title="Italic" disabled={!editor || loading}>
                                        <FormatItalicIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={addUnderline} title="Underline" disabled={!editor || loading}>
                                        <FormatUnderlinedIcon fontSize="small" />
                                    </IconButton>
                                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />
                                    <IconButton size="small" onClick={addHeading1} title="Heading 1" disabled={!editor || loading}>
                                        <TitleIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={addHeading2} title="Heading 2" disabled={!editor || loading}>
                                        <TitleIcon fontSize="small" sx={{ fontSize: '1rem' }} />
                                    </IconButton>
                                    <IconButton size="small" onClick={addHeading3} title="Heading 3" disabled={!editor || loading}>
                                        <TitleIcon fontSize="small" sx={{ fontSize: '0.875rem' }} />
                                    </IconButton>
                                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />
                                    <IconButton size="small" onClick={() => inlineImageInputRef.current?.click()} title="Upload Image" disabled={!editor || loading}>
                                        <PhotoCameraIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={addImageUrl} title="Insert Image URL" disabled={!editor || loading}>
                                        <ImageIcon fontSize="small" />
                                    </IconButton>
                                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />
                                    <IconButton size="small" onClick={addBulletList} title="Bullet List" disabled={!editor || loading}>
                                        <FormatListBulletedIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={addOrderedList} title="Numbered List" disabled={!editor || loading}>
                                        <FormatListNumberedIcon fontSize="small" />
                                    </IconButton>
                                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />
                                    <IconButton size="small" onClick={addCodeBlock} title="Code Block" disabled={!editor || loading}>
                                        <CodeIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={addLink} title="Link" disabled={!editor || loading}>
                                        <LinkIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </Box>

                            <input
                                ref={inlineImageInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleInlineImageUpload}
                                style={{ display: "none" }}
                            />

                            <Box sx={{ minHeight: '500px', p: 3 }}>
                                <EditorContent editor={editor} />
                            </Box>
                        </Paper>
                        <Typography variant="caption" color="text.secondary">
                            Rich text editor with formatting support. Use the heading buttons for H1, H2, H3. Multiple paragraphs are supported by pressing Enter. Use the upload button to insert local images (as base64) or URL for remote images.
                        </Typography>

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}>
                                Tags
                            </Typography>
                            <TextField
                                fullWidth
                                label="Add tags (comma separated)"
                                placeholder="e.g., AI, Blogging, Tutorial"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                sx={{ mb: 2 }}
                                disabled={loading}
                                variant="outlined"
                            />
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {formData.tags.map((tag, index) => (
                                    <Chip
                                        key={index}
                                        label={tag}
                                        onDelete={() => removeTag(index)}
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                    />
                                ))}
                            </Stack>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                                Press Enter or comma to add tags
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}>
                                Cover Image
                            </Typography>
                            <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2, height: "fit-content" }}>
                                <input
                                    ref={coverImageInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverImageUpload}
                                    style={{ display: "none" }}
                                    id="cover-image-upload"
                                />
                                <label htmlFor="cover-image-upload">
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        component="span"
                                        startIcon={<ImageIcon />}
                                        disabled={loading}
                                        sx={{ mb: 2 }}
                                    >
                                        {coverImagePreview ? "Change Cover Image" : "Upload Cover Image"}
                                    </Button>
                                </label>
                                {coverImagePreview && (
                                    <Box sx={{ position: "relative", mt: 2 }}>
                                        <IconButton
                                            size="small"
                                            onClick={removeCoverImage}
                                            sx={{
                                                position: "absolute",
                                                top: 0,
                                                right: 0,
                                                bgcolor: "background.paper",
                                                zIndex: 1,
                                            }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                        <img
                                            src={coverImagePreview}
                                            alt="Cover preview"
                                            style={{
                                                width: "100%",
                                                height: "200px",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </Box>
                                )}
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                                    Recommended size: 1200x630px
                                </Typography>
                            </Paper>
                        </Box>

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}>
                                Additional Media (Gallery)
                            </Typography>
                            <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2, height: "fit-content" }}>
                                <input
                                    ref={mediaInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleMediaUpload}
                                    style={{ display: "none" }}
                                    id="media-upload"
                                />
                                <label htmlFor="media-upload">
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        component="span"
                                        startIcon={<CloudUploadIcon />}
                                        disabled={loading}
                                        sx={{ mb: 2 }}
                                    >
                                        Upload Images
                                    </Button>
                                </label>
                                {mediaFiles.length > 0 && (
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                                        {mediaFiles.map((file, index) => (
                                            <Chip
                                                key={index}
                                                label={file.name}
                                                onDelete={() => handleRemoveMedia(index)}
                                                deleteIcon={<CloseIcon />}
                                                color="primary"
                                                variant="outlined"
                                                size="small"
                                            />
                                        ))}
                                    </Stack>
                                )}
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                                    Up to 10 images, max 5MB each. These will appear in a gallery below the content.
                                </Typography>
                            </Paper>
                        </Box>

                        <Box sx={{ mt: 5, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={handleReset}
                                disabled={loading}
                                size="large"
                                sx={{ px: 4 }}
                            >
                                Reset
                            </Button>
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={loading}
                                size="large"
                                startIcon={
                                    loading ? (
                                        <CircularProgress size={20} color="inherit" />
                                    ) : (
                                        <CloudUploadIcon />
                                    )
                                }
                                sx={{ px: 4, minWidth: 150 }}
                            >
                                {loading ? (isEdit ? "Updating..." : "Publishing...") : (isEdit ? "Update Blog" : "Publish Blog")}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default BlogPostForm;