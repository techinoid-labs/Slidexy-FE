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
  List, // Import List for list format
  ListItem, // Import ListItem for list format
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
    updated: Partial<{
      title: string;
      bullets: string[];
      bulletFormat?: "bullets" | "paragraphs" | "list" | null;
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

  const [aiEditMenuAnchorEl, setAiEditMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [loadingSuggestionsAction, setLoadingSuggestionsAction] =
    React.useState<string | null>(null);
  const [textSuggestions, setTextSuggestions] = React.useState<
    { title: string; bullets: string[] }[]
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

  // FIXED: Moved console.log out of JSX
  React.useEffect(() => {
    console.log("OutlineCard re-rendered. Current imageList state:", imageList);
    console.log(
      "OutlineCard re-rendered. Current previewImage state:",
      previewImage
    );
    // You can add more states here if you suspect they are causing re-renders that clear image states
  }, [
    imageList,
    previewImage,
    expanded,
    showSuggestionsBox,
    aiEditMenuAnchorEl,
  ]);

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
      onClick={() => onToggleExpand?.()} // Keep this as is for now
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
              {/* MODIFIED: Conditional rendering for the main bullets based on currentBulletFormat */}
              {currentBulletFormat === "list" ? (
                <List dense sx={{ listStyleType: "decimal", pl: 2, mt: 0.5 }}>
                  {bullets.map((b, i) => (
                    <ListItem
                      key={i}
                      sx={{ display: "list-item", py: 0, px: 0 }}
                    >
                      <Typography variant="body1" sx={{ fontSize: 16 }}>
                        {b}
                      </Typography>
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
                      {b}
                    </li>
                  ))}
                </ul>
              ) : (
                // Default to paragraphs (including 'paragraphs' and null/undefined)
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
                    <Typography key={i} variant="body1" sx={{ fontSize: 16 }}>
                      {b}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* This is the container for your small images and preview image */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 3,
              // IMPORTANT: Ensure this section has a z-index higher than other floating elements like Menu
              // but not so high that it covers the SuggestionsBox if it's supposed to.
              zIndex: 3, // Increased z-index
              position: "relative", // Needed for z-index to take effect
            }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, flex: 1 }}>
              {imageList.map((src, i) => {
                // FIXED: Moved console.log outside of JSX, before the return of the map callback
                console.log(`Rendering ImageWithClick for index ${i}:`, src);
                return (
                  <Box
                    key={i}
                    // Add a visual cue and ensure clickability of individual image boxes
                    sx={{
                      border: "1px solid transparent", // Default

                      cursor: "pointer",
                      // Ensure images themselves also have a relative z-index if needed
                      position: "relative",
                      zIndex: 1, // Individual images within their flex container
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
                              position: "relative", // For z-index
                              zIndex: 4, // Higher z-index for suggested images
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
              {/* End of imageList.map */}
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
                  position: "relative", // Needed for z-index
                  zIndex: 2, // Ensure preview image is above basic content
                }}
              >
                <Image
                  onClick={(e) => e.stopPropagation()} // Keep this for the preview image
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
              zIndex: 6, // Increased AI icon z-index to be clearly clickable
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
                setShowSuggestionsBox(false); // Close suggestions box when menu closes
                setCurrentSuggestionAction(null); // Reset action on menu close
              }}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "bottom", horizontal: "right" }}
              disablePortal
              sx={{ zIndex: 7 }} // Explicitly set Menu z-index higher than everything else
            >
              {textEditActions.map((action) => (
                <MenuItem
                  key={action.value}
                  onClick={async (e) => {
                    e.stopPropagation();
                    setLoadingSuggestionsAction(action.value);
                    setCurrentSuggestionAction(action.value);

                    // Handle "Regenerate Images" action specifically
                    if (action.value === "regenerateImages") {
                      // Trigger image regeneration for the first image
                      // You might want to adjust which image is regenerated based on your UX needs.
                      // For now, it regenerates the first image in the list.
                      if (imageList.length > 0) {
                        await handleRegenerateImage(0, e); // Call existing image regeneration logic
                      } else {
                        alert("No images available to regenerate.");
                      }
                      setLoadingSuggestionsAction(null); // Stop loading indicator
                      setAiEditMenuAnchorEl(null); // Close the AI menu
                      setCurrentSuggestionAction(null); // Reset action
                      return; // Important: Exit to prevent falling into text suggestion logic
                    }

                    // Original logic for text-based suggestions
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
                      // Don't set aiEditMenuAnchorEl to null here immediately for text suggestions
                      // as the suggestion box will take its position from this anchor.
                      // It will be set to null when the suggestions box closes.
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

          {/* Text Suggestions Box - MODIFIED */}
          {showSuggestionsBox &&
            textSuggestions.length > 0 &&
            aiEditMenuAnchorEl && (
              <Menu
                open={showSuggestionsBox}
                anchorEl={aiEditMenuAnchorEl} // Anchor to the same element as the AI menu
                onClose={() => {
                  setShowSuggestionsBox(false);
                  setTextSuggestions([]);
                  setCurrentSuggestionAction(null);
                  setAiEditMenuAnchorEl(null); // Close the AI menu when suggestions are closed
                }}
                anchorOrigin={{ vertical: "top", horizontal: "right" }} // Align relative to the anchor
                transformOrigin={{ vertical: "bottom", horizontal: "right" }} // Where the menu 'grows' from
                disablePortal
                sx={{ zIndex: 8 }} // HIGHEST Z-INDEX for the suggestions box
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
                      });
                      setShowSuggestionsBox(false);
                      setCurrentSuggestionAction(null);
                      setAiEditMenuAnchorEl(null); // Close the AI menu after applying a suggestion
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        border: "1px solid #ccc",
                        borderRadius: 1,
                        cursor: "pointer",
                        "&:hover": { bgcolor: "#f0f0f0" },
                        width: "100%", // Ensure it takes full width of the MenuItem
                      }}
                    >
                      <Typography fontWeight={600}>{sug.title}</Typography>
                      {/* Conditional Rendering of Bullets in the SUGGESTIONS BOX */}
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
                            color: "#7575775",
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
