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
  } = props;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [largeImageIdx, setLargeImageIdx] = React.useState<number | null>(null);
  const [loadingImageIndex, setLoadingImageIndex] = React.useState<
    number | null
  >(null);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onTitleEditSave && onTitleEditSave();
    } else if (e.key === "Escape") {
      onTitleEditCancel && onTitleEditCancel();
    }
  };

  const handleRegenerateImage = async (
    imageIndex: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    if (loadingImageIndex !== null) return;
    setLoadingImageIndex(imageIndex);

    const currentSlide = slidesState[slideIndex];
    const imagePrompt = `Generate a high-quality, professional, illustrative image for a presentation slide with the title "${
      currentSlide.slide_title.text
    }". The image should visually represent the core concept of the title and its key points, which are: ${currentSlide.elements
      .map((el: any) => el.text)
      .join(
        ", "
      )}. Focus on clarity and professional aesthetics. DO NOT include any text, labels, words, or captions *within the image itself*.`;

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
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = rect.left;
        const y = rect.bottom + window.scrollY;

        onSetImageSuggestionsBox({
          x,
          y,
          slideIndex,
          imageIndex,
          suggestions: data.imageUrls,
        });
      } else {
        alert("Failed to generate image suggestions.");
      }
    } catch (err) {
      console.error("Regenerate image error:", err);
      alert("An error occurred while generating image suggestions.");
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
        p: 0,
        m: 0,
        cursor: "pointer",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          minHeight: 56,
          bgcolor: "#F2F0FF",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
        }}
      >
        <Box
          {...dragHandleProps}
          sx={{
            color: "#8E2DE2",
            fontWeight: 700,
            fontSize: 20,
            minWidth: 48,
            textAlign: "center",
            pl: 2,
            pr: 1,
            display: "flex",
            alignItems: "center",
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
              fontSize: { xs: 14, sm: 16, md: 18 },
              flex: 1,
              pl: 1,
              display: "flex",
              alignItems: "center",
              cursor: editable ? "pointer" : "default",
            }}
            noWrap
            onClick={
              editable
                ? (e) => {
                    e.stopPropagation();
                    onTitleEditStart && onTitleEditStart();
                  }
                : undefined
            }
            title={title}
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
            bgcolor: "#fff",
            px: { xs: 2, sm: 3 },
            pt: 2,
            pb: 1.5,
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
          }}
        >
          {bullets?.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 20,
                  color: "#757575",
                  fontSize: 16,
                }}
              >
                {bullets.map((b, i) => (
                  <li
                    key={i}
                    onClick={
                      editable
                        ? (e) => {
                            e.stopPropagation();
                            onBulletsEditStart && onBulletsEditStart();
                          }
                        : undefined
                    }
                    style={{ cursor: editable ? "pointer" : "default" }}
                    title={b}
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </Box>
          )}

          {images.length > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                mb: 2,
              }}
            >
              {images.map((src, i) => (
                <span key={i}>
                  <ImageWithClick
                    src={src}
                    alt={`img-${i}`}
                    onShowLarge={() => setLargeImageIdx(i)}
                    onRegenerate={(e) => handleRegenerateImage(i, e)}
                    isLoading={loadingImageIndex === i}
                  />
                </span>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default OutlineCard;
