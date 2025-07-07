"use client";
import React from "react";
import { Paper, IconButton, Box, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import type { Slide } from "@/app/slice/slidesSlice";
import ImageWithClick from "../../ImageWithClick";

interface OutlineCardProps {
  index: number;
  title: string;
  onDelete: () => void;
  dragHandleProps?: any;
  isDragging?: boolean;
  expanded?: boolean;
  bullets?: string[];
  images?: string[];
  onEdit?: (event: React.MouseEvent<HTMLElement>) => void;
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
  onSetImageSuggestionsBox: React.Dispatch<
    React.SetStateAction<{
      slideIndex: number;
      imageIndex: number;
      x: number;
      y: number;
      suggestions: string[];
    } | null>
  >;
  slideIndex: number;
  slidesState: Slide[];
  isInfographicMode: boolean;
  onUpdateSlideImages: (slideIndex: number, images: string[]) => void;
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
    onEdit,
    editable = false,
    isEditing = false,
    editingTitle = "",
    onTitleEditStart,
    onTitleEditChange,
    onTitleEditSave,
    onTitleEditCancel,
    editingBulletsIdx,
    editingBulletsValue,
    onBulletsEditStart,
    onBulletsEditChange,
    onBulletsEditSave,
    onBulletsEditCancel,
    onSetImageSuggestionsBox,
    slideIndex,
    slidesState,
    isInfographicMode,
    onUpdateSlideImages,
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/generate-image-suggestions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: imagePrompt,
            count: 3,
            isInfographicMode,
          }),
        }
      );

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
              }}
            >
              {bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}

          <Box
            sx={{ display: "flex", justifyContent: "space-between", gap: 3 }}
          >
            {/* Left: Image list with suggestions */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, flex: 1 }}>
              {imageList.map((src, i) => (
                <Box key={i}>
                  <ImageWithClick
                    src={src}
                    alt={`img-${i}`}
                    onRegenerate={(e) => handleRegenerateImage(i, e)}
                    onPreviewImage={() => setPreviewImage(src)}
                    isLoading={loadingImageIndex === i}
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

            {/* Right: Preview image */}
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
                  src={previewImage}
                  alt="Preview"
                  width={240}
                  height={240}
                  style={{
                    objectFit: "contain",
                    maxWidth: "100%",
                    borderRadius: 8,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#666",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewImage(null);
                  }}
                >
                  Close Preview
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default OutlineCard;
