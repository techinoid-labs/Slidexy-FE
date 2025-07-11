"use client";
import React from "react";
import {
  Paper,
  IconButton,
  Box,
  Typography,
  Menu,
  MenuItem,
  CircularProgress,
  List,
  ListItem,
  TextField,
  Button,
  Popover,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Import the chevron icon
import ChevronRightIcon from "@mui/icons-material/ChevronRight"; // Import another chevron icon if needed
import Image from "next/image";
import type { Slide } from "@/app/slice/slidesSlice";
import ImageWithClick from "../../ImageWithClick";
import AIicon from "../../../../../public/images/AIcon-08.svg";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import ImageIcon from "@mui/icons-material/Image";
import Grow from "@mui/material/Grow";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


interface OutlineCardProps {
  index: number;
  title: string;
  onDelete: () => void;
  dragHandleProps?: any;
  isDragging?: boolean;
  expanded?: boolean;
  bullets?: string[];
  images?: string[];
  editable?: boolean;
  isEditing?: boolean;
  editingTitle?: string;
  onTitleEditStart?: () => void;
  onTitleEditChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleEditSave?: () => void;
  onTitleEditCancel?: () => void;
  editingBulletsIdx?: number | null;
  editingBulletsValue?: string;
  onBulletsEditStart?: (index: number) => void;
  onBulletsEditChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBulletsEditSave?: () => void;
  onBulletsEditCancel?: () => void;
  slideIndex: number;
  slidesState: Slide[];
  isInfographicMode: boolean;
  onSetImageSuggestionsBox: React.Dispatch<
    React.SetStateAction<{
      slideIndex: number;
      imageIndex: number;
      x: number;
      y: number;
      suggestions: string[];
    } | null>
  >;
  onUpdateSlideImages: (slideIndex: number, images: string[]) => void;
  onUpdateSlide?: (
    slideIndex: number,
    updated: Partial<{
      title: string;
      bullets: string[];
      bulletFormat?: "bullets" | "paragraphs" | "list" | null;
      image_url?: string;
    }> // ADDED bulletFormat
  ) => void;
  onToggleExpand?: () => void;
  onEdit?: (event: React.MouseEvent<HTMLElement>) => void;
  currentBulletFormat?: "bullets" | "paragraphs" | "list" | null; // NEW PROP
}

const OutlineCard: React.FC<OutlineCardProps> = (props) => {
  const {
    index,
    title,
    onDelete,
    dragHandleProps,
    isDragging = false,
    expanded = false,
    bullets = [],
    images = [],
    editable = false,
    isEditing = false,
    editingTitle = "",
    onTitleEditStart,
    onTitleEditChange,
    onTitleEditSave,
    onTitleEditCancel,
    slideIndex,
    slidesState,
    isInfographicMode,
    onUpdateSlideImages,
    onUpdateSlide,
    onToggleExpand,
    currentBulletFormat = "paragraphs", // Destructure with a default
  } = props;

  
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [suggestedImages, setSuggestedImages] = React.useState<{
    imageIndex: number;
    suggestions: string[];
  } | null>(null);

  const [imageList, setImageList] = React.useState<string[]>(images || []);
  const [loadingImageIndex, setLoadingImageIndex] = React.useState<
    number | null
  >(null);

  const [showCustomPromptInput, setShowCustomPromptInput] =
    React.useState(false);
  const [customPromptText, setCustomPromptText] = React.useState("");
  const [customSuggestionsLoading, setCustomSuggestionsLoading] =
    React.useState(false);
  const [customSuggestionsError, setCustomSuggestionsError] =
    React.useState("");

  const [aiEditMenuAnchorEl, setAiEditMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [loadingSuggestionsAction, setLoadingSuggestionsAction] =
    React.useState<string | null>(null);
    const [textSuggestions, setTextSuggestions] = React.useState<
      {
        title: string;
        bullets: string[];
        image?: string;
        imageUrl?: string | null;
      }[]
    >([]);
  const [showSuggestionsBox, setShowSuggestionsBox] = React.useState(false);

  // New state to store the position of the AI icon
  const [aiIconPosition, setAiIconPosition] = React.useState<{
    x: number;
    y: number;
  } | null>(null);

  // NEW STATE: To store the action type that generated the suggestions
  const [currentSuggestionAction, setCurrentSuggestionAction] = React.useState<
    string | null
  >(null);

  const textEditActions = [
    {
      label: "Longer",
      value: "longer",
      icon: <FormatAlignLeftIcon fontSize="small" />,
      subtitle: "Expand the content with additional details",
    },
    {
      label: "Shorter",
      value: "shorter",
      icon: <FormatAlignLeftIcon fontSize="small" />,
      subtitle: "Condense the information for quick reference",
    },
    {
      label: "Rewrite slide",
      value: "rewriteSlide",
      icon: <AutoFixHighIcon fontSize="small" />,
      subtitle: "Regenerate the title and all content outlines of the slide",
    },
    {
      label: "Bullets Format",
      value: "bulletsFormat",
      icon: <FormatListBulletedIcon fontSize="small" />,
      subtitle: "Convert to bullet points for easy reading",
    },
    {
      label: "List Format",
      value: "listFormat",
      icon: <FormatListNumberedIcon fontSize="small" />,
      subtitle: "Convert the content to list view for easy reading",
    },
    {
      label: "Regenerate Images",
      value: "regenerateImages",
      icon: <ImageIcon fontSize="small" />,
      subtitle: "Generate fresh ideas and creative images as per prompt",
    },
    {
      label: "New Custom Suggestions",
      value: "custom",
      icon: <ImageIcon fontSize="small" />,
      subtitle: "Generate fresh ideas and creative content",
    },
  ];

  React.useEffect(() => {
    setImageList(images || []);
  }, [images]);


  const handleGenerateCustomSuggestions = async () => {
    setCustomSuggestionsLoading(true);
    setCustomSuggestionsError("");

    try {
      const res = await fetch(`${API_BASE_URL}/custom-suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          bullets,
          customPrompt: customPromptText,
        }),
      });

      console.log("Custom Suggestion Response:", res.body);

      if (!res.ok) {
        throw new Error("Failed to fetch custom suggestions");
      }

      const data = await res.json();
      setTextSuggestions(data.suggestions); // store suggestions
      setShowSuggestionsBox(true); // 👈 show the suggestion box
      setShowCustomPromptInput(false);
      setCustomPromptText("");
    } catch (err: any) {
      setCustomSuggestionsError(err.message);
    } finally {
      setCustomSuggestionsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onTitleEditSave?.();
    else if (e.key === "Escape") onTitleEditCancel?.();
  };

  const handleRegenerateImage = async (
    imageIndex: number,
    e: React.MouseEvent // Keep this as it is already being passed
  ) => {
    e.stopPropagation(); // Essential to stop propagation here
    if (loadingImageIndex !== null) return;

    setLoadingImageIndex(imageIndex);
    const currentSlide = slidesState[slideIndex];
    const imagePrompt = `Generate a high-quality, professional image for slide titled "${
      currentSlide.slide_title.text
    }" with points: ${currentSlide.elements
      .map((el) => el.text)
      .join(", ")}. No text or labels inside the image.`;

    try {
      const res = await fetch(`${API_BASE_URL}/generate-image-suggestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt,
          count: 3,
          isInfographicMode,
        }),
      });

      const data = await res.json();
      if (data.imageUrls?.length > 0) {
        setSuggestedImages({ imageIndex, suggestions: data.imageUrls });
      } else {
        alert("Failed to generate image suggestions.");
      }
    } catch (err) {
      console.error("Image regeneration error:", err);
      alert("Error generating image suggestions.");
    } finally {
      setLoadingImageIndex(null);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: "20px",
        bgcolor: "#F2F0FF",
        boxShadow: isDragging ? 4 : 0,
        transition: "box-shadow 0.2s",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", minHeight: 56 }}>
        <Box
          {...dragHandleProps}
          sx={{
            color: "#8E2DE2",
            fontWeight: 700,
            fontSize: 20,
            px: 2,
            py: 2,
            display: "flex",
            gap: 1.5,
          }}
        >
          <Image
            src="/images/left-grid.svg"
            alt="Card Icon"
            width={12}
            height={12}
          />
          {index < 9 ? `0${index + 1}` : index + 1}
        </Box>

        {editable && isEditing ? (
          <input
            ref={inputRef}
            value={editingTitle}
            onChange={onTitleEditChange}
            onBlur={onTitleEditSave}
            onKeyDown={handleKeyDown}
            style={{
              fontWeight: 500,
              color: "#18181B",
              fontSize: 16,
              flex: 1,
              textAlign: "left",
              paddingLeft: 8,
              border: "1px solid #8E2DE2",
              borderRadius: 6,
              outline: "none",
              minWidth: 0,
              maxWidth: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <Typography
            sx={{
              fontWeight: 500,
              color: "#18181B",
              fontSize: 16,
              flex: 1,
              pl: 1,
            }}
            noWrap
            title={title}
            onClick={
              editable
                ? (e) => {
                    e.stopPropagation();
                    onTitleEditStart?.();
                  }
                : undefined
            }
          >
            {title}
          </Typography>
        )}

        <IconButton
          onClick={onDelete}
          size="small"
          sx={{ color: "#A095C6", pr: 0 }} // Adjusted padding for spacing with new icon
        >
          <DeleteIcon fontSize="small" />
        </IconButton>

        {/* NEW: Chevron Icon for expand/collapse */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation(); // Prevent the parent Paper's onClick from firing
            onToggleExpand?.();
          }}
          size="small"
          sx={{ color: "#A095C6", pr: 2 }}
          disableRipple
        >
          {expanded ? (
            <ExpandMoreIcon fontSize="small" />
          ) : (
            <ChevronRightIcon fontSize="small" />
          )}
        </IconButton>
      </Box>

      {expanded && (
        <Box
          sx={{
            px: 3,
            pt: 2,
            pb: 2,
            bgcolor: "#fff",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            position: "relative", // Ensure relative positioning for child z-indexing
            zIndex: 1, // Give this section a base z-index
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSuggestedImages(null);
            setShowSuggestionsBox(false);
            setAiEditMenuAnchorEl(null);
            setCurrentSuggestionAction(null);
          }}
        >
          {bullets.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                color: "#757575",
                fontSize: 16,
              }}
            >
              {currentBulletFormat === "list" ? (
                <List dense sx={{ listStyleType: "decimal", pl: 2, mt: 0.5 }}>
                  {bullets.map((b, i) => (
                    <ListItem
                      key={i}
                      sx={{ display: "list-item", py: 0, px: 0 }}
                    >
                      {editable && props.editingBulletsIdx === i ? (
                        <textarea
                          value={props.editingBulletsValue}
                          onChange={props.onBulletsEditChange}
                          onBlur={props.onBulletsEditSave}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              props.onBulletsEditSave?.();
                            } else if (e.key === "Escape") {
                              props.onBulletsEditCancel?.();
                            }
                          }}
                          autoFocus
                          style={{
                            fontSize: 16,
                            padding: "4px",
                            border: "1px solid #ccc",
                            borderRadius: 4,
                            width: "100%",
                          }}
                        />
                      ) : (
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: 16,
                            cursor: editable ? "pointer" : "default",
                          }}
                          onClick={() => {
                            if (editable) props.onBulletsEditStart?.(i);
                          }}
                        >
                          {b}
                        </Typography>
                      )}
                    </ListItem>
                  ))}
                </List>
              ) : currentBulletFormat === "bullets" ? (
                <ul
                  style={{
                    paddingLeft: 16,
                    margin: "4px 0",
                    color: "#757575",
                    fontSize: 16,
                  }}
                >
                  {bullets.map((b, i) => (
                    <li key={i} style={{ listStyle: "disc", paddingRight: 8 }}>
                      {editable && props.editingBulletsIdx === i ? (
                        <textarea
                          value={props.editingBulletsValue}
                          onChange={props.onBulletsEditChange}
                          onBlur={props.onBulletsEditSave}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              props.onBulletsEditSave?.();
                            } else if (e.key === "Escape") {
                              props.onBulletsEditCancel?.();
                            }
                          }}
                          autoFocus
                          style={{
                            fontSize: 16,
                            padding: "4px",
                            border: "1px solid #ccc",
                            borderRadius: 4,
                            width: "100%",
                          }}
                        />
                      ) : (
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: 16,
                            cursor: editable ? "pointer" : "default",
                          }}
                          onClick={() => {
                            if (editable) props.onBulletsEditStart?.(i);
                          }}
                        >
                          {b}
                        </Typography>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    color: "#757575",
                    fontSize: 16,
                  }}
                >
                  {bullets.map((b, i) => (
                    <Box key={i}>
                      {editable && props.editingBulletsIdx === i ? (
                        <textarea
                          value={props.editingBulletsValue}
                          onChange={props.onBulletsEditChange}
                          onBlur={props.onBulletsEditSave}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              props.onBulletsEditSave?.();
                            } else if (e.key === "Escape") {
                              props.onBulletsEditCancel?.();
                            }
                          }}
                          autoFocus
                          style={{
                            fontSize: 16,
                            height: "150px",
                            padding: "4px",
                            border: "1px solid #ccc",
                            borderRadius: 4,
                            width: "100%",
                          }}
                        />
                      ) : (
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: 16,
                            cursor: editable ? "pointer" : "default",
                          }}
                          onClick={() => {
                            if (editable) props.onBulletsEditStart?.(i);
                          }}
                        >
                          {b}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 3,
              zIndex: 3,
              position: "relative",
            }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, flex: 1 }}>
              {imageList.map((src, i) => {
                console.log(`Rendering ImageWithClick for index ${i}:`, src);
                return (
                  <Box
                    key={i}
                    sx={{
                      border: "1px solid transparent", // Default

                      cursor: "pointer",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <ImageWithClick
                      src={src}
                      alt={`img-${i}`}
                      isLoading={loadingImageIndex === i}
                      onPreviewImage={() => {
                        console.log(
                          "ImageWithClick clicked, setting previewImage:",
                          src
                        );
                        setPreviewImage(src);
                      }}
                    />
                    {suggestedImages?.imageIndex === i && (
                      <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                        {suggestedImages.suggestions.map((suggestedSrc, j) => (
                          <Box
                            key={j}
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: 1,
                              overflow: "hidden",
                              cursor: "pointer",
                              border: "1px solid #ccc",
                              position: "relative",
                              zIndex: 4,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              const newImages = [...imageList];
                              newImages[i] = suggestedSrc;
                              setImageList(newImages);
                              onUpdateSlideImages(slideIndex, newImages);
                              setPreviewImage(suggestedSrc);
                              setSuggestedImages(null);
                            }}
                          >
                            <Image
                              src={suggestedSrc}
                              alt={`Suggested ${j}`}
                              width={64}
                              height={64}
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                );
              })}{" "}
            </Box>

            {previewImage && (
              <Box
                sx={{
                  minWidth: 200,
                  maxWidth: 240,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <Image
                  onClick={(e) => e.stopPropagation()}
                  src={previewImage}
                  alt="Preview"
                  width={72}
                  height={72}
                  style={{
                    objectFit: "contain",
                    maxWidth: "100%",
                    borderRadius: 8,
                    position: "relative",
                    bottom: "70px",
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* AI Icon */}
      {expanded && (
        <>
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              width: 36,
              height: 36,
              cursor: "pointer",
              zIndex: 6,
            }}
            onClick={(e) => {
              e.stopPropagation();
              setAiEditMenuAnchorEl(e.currentTarget);
              const rect = e.currentTarget.getBoundingClientRect();
              setAiIconPosition({ x: rect.left, y: rect.top });
            }}
          >
            <Image
              src={AIicon}
              alt="AI Edit Icon"
              width={8}
              height={8}
              style={{ width: "20px", height: "100%" }}
            />
          </Box>

          {aiEditMenuAnchorEl && (
            <Menu
              open={!!aiEditMenuAnchorEl}
              anchorEl={aiEditMenuAnchorEl}
              onClose={() => {
                setAiEditMenuAnchorEl(null);
                setLoadingSuggestionsAction(null);
                setShowSuggestionsBox(false);
                setCurrentSuggestionAction(null);
              }}
              slotProps={{
                paper: {
                  sx: {
                    backgroundColor: "#ffffff",
                  },
                },
                transition: {
                  component: Grow,
                  timeout: 200,
                },
              }}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "bottom", horizontal: "right" }}
              disablePortal
              sx={{ zIndex: 7 }}
            >
              {textEditActions.map((action, idx) => (
                <MenuItem
                  sx={{
                    alignItems: "flex-start",
                    gap: 1.5,
                    px: 2,
                    py: 1.5,
                    borderBottom:
                      idx !== textEditActions.length - 1
                        ? "1px solid #eee"
                        : "none",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#f3f0ff",
                      transform: "scale(1.02)",
                    },
                  }}
                  key={action.value}
                  onClick={async (e) => {
                    e.stopPropagation();
                    setLoadingSuggestionsAction(action.value);
                    setCurrentSuggestionAction(action.value);

                    if (action.value === "custom") {
                      setShowCustomPromptInput(true);
                      setLoadingSuggestionsAction(null);
                      return;
                    }

                    if (action.value === "regenerateImages") {
                      if (imageList.length > 0) {
                        await handleRegenerateImage(0, e);
                      } else {
                        alert("No images available to regenerate.");
                      }
                      setLoadingSuggestionsAction(null);
                      setAiEditMenuAnchorEl(null);
                      setCurrentSuggestionAction(null);
                      return;
                    }

                    try {
                      const res = await fetch(`${API_BASE_URL}/edit-text`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          title,
                          bullets,
                          action: action.value,
                          currentFormat: currentBulletFormat,
                        }),
                      });
                      const data = await res.json();
                      if (Array.isArray(data.suggestions)) {
                        setTextSuggestions(data.suggestions);
                        setShowSuggestionsBox(true);
                      }
                    } catch (err) {
                      console.error("Suggestion fetch error:", err);
                      alert("Error generating suggestions.");
                    } finally {
                      setLoadingSuggestionsAction(null);
                    }
                  }}
                >
                  <Box sx={{ mt: "3px" }}>{action.icon}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      fontWeight={600}
                      fontSize={14}
                      color="text.primary"
                    >
                      {action.label}
                    </Typography>
                    <Typography
                      fontSize={12}
                      color="text.secondary"
                      sx={{ mt: 0.2, lineHeight: 1.4 }}
                    >
                      {action.subtitle}
                    </Typography>
                  </Box>
                  {loadingSuggestionsAction === action.value && (
                    <CircularProgress size={16} color="inherit" />
                  )}
                </MenuItem>
              ))}
            </Menu>
          )}

          <Popover
            open={showCustomPromptInput}
            anchorEl={aiEditMenuAnchorEl}
            onClose={() => setShowCustomPromptInput(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "bottom", horizontal: "right" }}
            disablePortal
            sx={{ zIndex: 9999 }}
          >
            <Box
              sx={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: 2,
                p: 2,
                width: 300,
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Enter Custom Prompt
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={customPromptText}
                onChange={(e) => setCustomPromptText(e.target.value)}
                placeholder="Describe how you'd like to improve this slide..."
              />
              {customSuggestionsError && (
                <Typography variant="body2" color="error" mt={1}>
                  {customSuggestionsError}
                </Typography>
              )}
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  size="small"
                  disabled={
                    customSuggestionsLoading || !customPromptText.trim()
                  }
                  onClick={handleGenerateCustomSuggestions}
                >
                  {customSuggestionsLoading ? "Generating..." : "Generate"}
                </Button>
              </Box>
            </Box>
          </Popover>

          {/* Text Suggestions Box - MODIFIED */}
          {showSuggestionsBox &&
            textSuggestions.length > 0 &&
            aiEditMenuAnchorEl && (
              <Menu
                open={showSuggestionsBox}
                anchorEl={aiEditMenuAnchorEl}
                onClose={() => {
                  setShowSuggestionsBox(false);
                  setTextSuggestions([]);
                  setCurrentSuggestionAction(null);
                  setAiEditMenuAnchorEl(null);
                }}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "bottom", horizontal: "right" }}
                disablePortal
                sx={{ zIndex: 8 }}
              >
                {textSuggestions.map((sug, idx) => (
                  <MenuItem
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();

                      let newBulletFormat:
                        | "bullets"
                        | "paragraphs"
                        | "list"
                        | null = null;

                      if (currentSuggestionAction === "bulletsFormat") {
                        newBulletFormat = "bullets";
                      } else if (currentSuggestionAction === "listFormat") {
                        newBulletFormat = "list";
                      } else if (
                        currentSuggestionAction === "longer" ||
                        currentSuggestionAction === "shorter" ||
                        currentSuggestionAction === "rewriteSlide" ||
                        currentSuggestionAction === "custom"
                      ) {
                        newBulletFormat = "paragraphs";
                      } else {
                        newBulletFormat = currentBulletFormat;
                      }

                      onUpdateSlide?.(slideIndex, {
                        title: sug.title,
                        bullets: sug.bullets,
                        bulletFormat: newBulletFormat,
                        ...(currentSuggestionAction === "custom" && sug.imageUrl
                          ? { image_url: sug.imageUrl }
                          : {}),
                      });


                      if (
                        currentSuggestionAction === "custom" &&
                        sug.imageUrl
                      ) {
                        setPreviewImage(sug.imageUrl);
                        onUpdateSlideImages?.(slideIndex, [sug.imageUrl]); // ✅ FIXED
                      }
                                            
                      setShowSuggestionsBox(false);
                      setCurrentSuggestionAction(null);
                      setAiEditMenuAnchorEl(null);
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        border: "1px solid #ccc",
                        borderRadius: 1,
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      <Typography fontWeight={600}>{sug.title}</Typography>

                      {/* ✅ Render image ONLY for custom suggestions */}
                      {currentSuggestionAction === "custom" && sug.imageUrl && (
                        <Box
                          sx={{
                            mt: 1,
                            mb: 1,
                            borderRadius: 1,
                            overflow: "hidden",
                            border: "1px solid #eee",
                            width: "100%",
                            height: 140,
                          }}
                        >
                          <img
                            src={sug.imageUrl}
                            alt="Suggested visual"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      )}

                      {/* ✅ Bullet Formats */}
                      {currentSuggestionAction === "longer" ||
                      currentSuggestionAction === "shorter" ||
                      currentSuggestionAction === "rewriteSlide" ||
                      currentSuggestionAction === "custom" ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                            mt: 0.5,
                          }}
                        >
                          {sug.bullets.map((b, i) => (
                            <Typography
                              key={i}
                              variant="body2"
                              sx={{ fontSize: 14 }}
                            >
                              {b}
                            </Typography>
                          ))}
                        </Box>
                      ) : currentSuggestionAction === "listFormat" ? (
                        <List
                          dense
                          sx={{ listStyleType: "decimal", pl: 2, mt: 0.5 }}
                        >
                          {sug.bullets.map((b, i) => (
                            <ListItem
                              key={i}
                              sx={{ display: "list-item", py: 0, px: 0 }}
                            >
                              <Typography variant="body2" sx={{ fontSize: 14 }}>
                                {b}
                              </Typography>
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <ul
                          style={{
                            paddingLeft: 16,
                            margin: "4px 0",
                            color: "#757577",
                            fontSize: 14,
                          }}
                        >
                          {sug.bullets.map((b, i) => (
                            <li
                              key={i}
                              style={{ listStyle: "disc", paddingRight: 8 }}
                            >
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            )}
        </>
      )}
    </Paper>
  );
};

export default OutlineCard;
