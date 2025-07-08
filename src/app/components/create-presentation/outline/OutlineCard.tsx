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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import type { Slide } from "@/app/slice/slidesSlice";
import ImageWithClick from "../../ImageWithClick";
import AIicon from "../../../../../public/images/AIcon-08.svg";

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
  onBulletsEditStart?: () => void;
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
    updated: Partial<{ title: string; bullets: string[] }>
  ) => void;
  onToggleExpand?: () => void;
  onEdit?: (event: React.MouseEvent<HTMLElement>) => void;
}

const OutlineCard: React.FC<OutlineCardProps> = (props) => {
  const {
    index,
    title,
    onDelete,
    onEdit,
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
    onSetImageSuggestionsBox,
    slideIndex,
    slidesState,
    isInfographicMode,
    onUpdateSlideImages,
    onUpdateSlide,
    onToggleExpand,
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

  const [aiEditMenuAnchorEl, setAiEditMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [loadingSuggestionsAction, setLoadingSuggestionsAction] =
    React.useState<string | null>(null);
  const [textSuggestions, setTextSuggestions] = React.useState<
    { title: string; bullets: string[] }[]
  >([]);
  const [showSuggestionsBox, setShowSuggestionsBox] = React.useState(false);

  const textEditActions = [
    { label: "Longer", value: "longer" },
    { label: "Shorter", value: "shorter" },
    { label: "Rewrite Slides", value: "rewriteSlide" },
    { label: "Bullets Format", value: "bulletsFormat" },
    { label: "List Format", value: "listFormat" },
    { label: "Regenerate Images", value: "regenerateImages" },
    { label: "New Custom Suggestions", value: "custom" },
  ];

  React.useEffect(() => {
    setImageList(images || []);
  }, [images]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onTitleEditSave?.();
    else if (e.key === "Escape") onTitleEditCancel?.();
  };

  const handleRegenerateImage = async (
    imageIndex: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
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
      onClick={() => onToggleExpand?.()}
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
          sx={{ color: "#A095C6", pr: 2 }}
        >
          <DeleteIcon fontSize="small" />
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
          }}
        >
          {bullets.length > 0 && (
            <ul
              style={{
                paddingLeft: 20,
                margin: 0,
                color: "#757575",
                fontSize: 16,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {bullets.map((b, i) => (
                <li key={i} style={{ listStyle: "disc", paddingRight: 8 }}>
                  {b}
                </li>
              ))}
            </ul>
          )}

          <Box
            sx={{ display: "flex", justifyContent: "space-between", gap: 3 }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, flex: 1 }}>
              {imageList.map((src, i) => (
                <Box key={i}>
                  <ImageWithClick
                    src={src}
                    alt={`img-${i}`}
                    isLoading={loadingImageIndex === i}
                    onPreviewImage={() => setPreviewImage(src)}
                    onRegenerate={(e, closeMenu) => {
                      handleRegenerateImage(i, e).then(closeMenu);
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
              ))}
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
              zIndex: 2,
            }}
            onClick={(e) => {
              e.stopPropagation();
              setAiEditMenuAnchorEl(e.currentTarget);
            }}
          >
            <Image
              src={AIicon}
              alt="AI Edit Icon"
              width={10}
              height={10}
              style={{ width: "100%", height: "100%" }}
            />
          </Box>

          {aiEditMenuAnchorEl && (
            <Menu
              open={!!aiEditMenuAnchorEl}
              anchorEl={aiEditMenuAnchorEl}
              onClose={() => {
                setAiEditMenuAnchorEl(null);
                setLoadingSuggestionsAction(null);
              }}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "bottom", horizontal: "right" }}
              disablePortal
            >
              {textEditActions.map((action) => (
                <MenuItem
                  key={action.value}
                  onClick={async () => {
                    setLoadingSuggestionsAction(action.value);
                    try {
                      const res = await fetch(`${API_BASE_URL}/edit-text`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          title,
                          bullets,
                          action: action.value,
                        }),
                      });
                      const data = await res.json();
                      if (Array.isArray(data.suggestions)) {
                        setTextSuggestions(data.suggestions);
                        setShowSuggestionsBox(true);
                      }
                    } catch (err) {
                      console.error("Suggestion fetch error:", err);
                    } finally {
                      setLoadingSuggestionsAction(null);
                      setAiEditMenuAnchorEl(null);
                    }
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>{action.label}</span>
                    {loadingSuggestionsAction === action.value && (
                      <CircularProgress size={16} color="inherit" />
                    )}
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          )}

          {showSuggestionsBox && textSuggestions.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                bottom: 52,
                right: 8,
                bgcolor: "#fff",
                boxShadow: 3,
                borderRadius: 2,
                zIndex: 5,
                width: 300,
                maxHeight: 240,
                overflowY: "auto",
                p: 1,
              }}
            >
              {textSuggestions.map((sug, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1,
                    mb: 1,
                    border: "1px solid #ccc",
                    borderRadius: 1,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#f0f0f0" },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateSlide?.(slideIndex, {
                      title: sug.title,
                      bullets: sug.bullets,
                    });
                    setShowSuggestionsBox(false);
                  }}
                >
                  <Typography fontWeight={600}>{sug.title}</Typography>
                  <ul style={{ paddingLeft: 16, margin: "4px 0" }}>
                    {sug.bullets.map((b, i) => (
                      <li key={i} style={{ fontSize: 14 }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </Box>
              ))}
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default OutlineCard;
  