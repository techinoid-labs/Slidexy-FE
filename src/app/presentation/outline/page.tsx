"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import OutlineCard from "@/app/components/create-presentation/outline/OutlineCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Image from "next/image";
import EditMenuCard from "@/app/components/create-presentation/outline/EditMenuCard";
import { useSlides } from "@/app/context/SlidesContext";
import { useDispatch } from "react-redux";
import { setSlides } from "@/app/slice/slidesSlice";
import { useSearchParams, useRouter } from "next/navigation";
import StepIndicator from "@/app/components/shared/StepIndicator";
import StepsHeader from "@/app/components/headers-navbar/StepsHeader";
import debounce from "lodash/debounce";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface SlideApiResponse {
  slide_id: string;
  slide_title: { text: string; konva_component: string; properties: Record<string, any> };
  image_url?: string;
  image_caption?: string;
  elements: Array<{
    element_type: string;
    text: string;
    konva_component: string;
    properties: Record<string, any>;
    id?: string;
    element_id?: string;
  }>;
}

function mapApiSlidesToCards(apiSlides: SlideApiResponse[]) {
  return apiSlides.map((slide) => ({
    title: slide.slide_title.text,
    bullets: slide.elements
      .filter((el) => el.element_type === "bullet_point")
      .map((el) => el.text),
    images: slide.image_url ? [slide.image_url] : [],
  }));
}
const uploadImageToS3 = async (base64Image: string): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/upload-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        base64Image,
        filename: `outline-image-${Date.now()}`
      }),
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Image uploaded to S3:', data.imageUrl);
    return data.imageUrl;
  } catch (error) {
    console.error('Failed to upload image to S3:', error);
    return null;
  }
};
export default function OutlinePage() {
  const { slides }: any = useSlides();
  const slidesState = slides || [];
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pid = searchParams.get("pid");

  const [cards, setCards] = useState(() =>
    slidesState.length > 0 ? mapApiSlidesToCards(slidesState) : []
  );
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [editingBulletsIdx, setEditingBulletsIdx] = useState<number | null>(null);
  const [editingBulletsValue, setEditingBulletsValue] = useState<string>("");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [editMenuAnchor, setEditMenuAnchor] = useState<null | HTMLElement>(null);
  const [editMenuCardIdx, setEditMenuCardIdx] = useState<number | null>(null);
  const [imageSuggestionsBox, setImageSuggestionsBox] = useState<{
    slideIndex: number;
    imageIndex: number;
    x: number;
    y: number;
    suggestions: string[];
  } | null>(null);

  // ✅ FIXED: Improved save function with better error handling
  const saveToBackend = async (updatedCards: any[]) => {
    if (!pid || updatedCards.length === 0) return false;

    try {
      const slidesToSave = updatedCards.map((card, index) => {
        const originalSlide = slidesState[index] || {};

        return {
          ...originalSlide,
          slide_title: {
            ...originalSlide.slide_title,
            text: card.title,
          },
          elements: (card.bullets || []).map((text: string, i: number) => ({
            element_type: "bullet_point",
            text,
            konva_component: "Konva.Text",
            id: originalSlide.elements?.[i]?.id || `element-${index}-${i}`,
            element_id: originalSlide.elements?.[i]?.element_id || `element-${index}-${i}`,
            properties: originalSlide.elements?.[i]?.properties || {},
          })),
          image_url: card.images?.[0] || null,
          slide_number: index + 1,
          total_slides: updatedCards.length,
          updated_at: new Date().toISOString(),
        };
      });

      const response = await fetch(`${API_BASE_URL}/api/presentations/${pid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides: slidesToSave }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("✅ Presentation saved successfully:", result);
      
      // ✅ Update Redux store with saved slides
      dispatch(setSlides(slidesToSave));
      
      return true;
    } catch (err) {
      console.error("❌ Failed to save presentation:", err);
      return false;
    }
  };

  // Debounced save (for auto-save during editing)
  const debouncedSave = useCallback(
    debounce(async (updatedCards: any[]) => {
      setIsSaving(true);
      await saveToBackend(updatedCards);
      setIsSaving(false);
    }, 800),
    [pid, slidesState]
  );

  // Fetch presentation on mount
  useEffect(() => {
    if (!pid) {
      setLoading(false);
      return;
    }

    const fetchPresentation = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/presentations/${pid}`);
        const data = await response.json();

        const fetchedSlides = data?.slides || data?.presentation?.slides || [];
        if (fetchedSlides.length > 0) {
          dispatch(setSlides(fetchedSlides));
          setCards(mapApiSlidesToCards(fetchedSlides));
        }
      } catch (error) {
        console.error("Error fetching presentation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPresentation();
  }, [pid, dispatch]);

  // ✅ FIXED: Ensure all changes are saved before navigation
  const handleContinue = async () => {
    setIsSaving(true);
    
    // Cancel any pending debounced saves
    debouncedSave.cancel();
    
    // Perform immediate save
    const success = await saveToBackend(cards);
    
    setIsSaving(false);
    
    if (success) {
      // Navigate to editor after successful save
      router.push(`/editor?pid=${pid}`);
    } else {
      alert("Failed to save changes. Please try again.");
    }
  };

  // Title editing
  const handleTitleEditStart = (idx: number, currentTitle: string) => {
    setEditingIdx(idx);
    setEditingTitle(currentTitle);
  };

  const handleTitleEditChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditingTitle(e.target.value);

  const handleTitleEditSave = (idx: number) => {
    setCards((prev) => {
      const newCards = prev.map((c, i) =>
        i === idx ? { ...c, title: editingTitle } : c
      );
      debouncedSave(newCards);
      return newCards;
    });
    setEditingIdx(null);
    setEditingTitle("");
  };

  const handleTitleEditCancel = () => {
    setEditingIdx(null);
    setEditingTitle("");
  };

  // Bullets editing
  const handleBulletsEditStart = (idx: number, bullets?: string[]) => {
    setEditingBulletsIdx(idx);
    setEditingBulletsValue((bullets || []).join("\n"));
  };

  const handleBulletsEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setEditingBulletsValue(e.target.value);

  const handleBulletsEditSave = (idx: number) => {
    if (!editingBulletsValue.trim()) {
      setEditingBulletsIdx(null);
      setEditingBulletsValue("");
      return;
    }

    setCards((prev) => {
      const newCards = prev.map((c, i) =>
        i === idx
          ? {
              ...c,
              bullets: editingBulletsValue
                .split(/\r?\n/)
                .map((l) => l.trim())
                .filter((l) => l !== ""),
            }
          : c
      );
      debouncedSave(newCards);
      return newCards;
    });

    setEditingBulletsIdx(null);
    setEditingBulletsValue("");
  };

  const handleBulletsEditCancel = () => {
    setEditingBulletsIdx(null);
    setEditingBulletsValue("");
  };

  // Drag & Drop
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    setCards((prev) => {
      const arr = Array.from(prev);
      const [removed] = arr.splice(result.source.index, 1);
      arr.splice(result.destination.index, 0, removed);
      debouncedSave(arr);
      return arr;
    });

    setExpandedIdx(null);
  };

  // Delete
  const handleDelete = (idx: number) => {
    setCards((prev) => {
      const newCards = prev.filter((_, i) => i !== idx);
      debouncedSave(newCards);
      return newCards;
    });
    if (expandedIdx === idx) setExpandedIdx(null);
  };

  // Card expand
  const handleCardClick = (idx: number) => {
    if (editingIdx !== null) return;
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  // Edit menu
  const handleEditClick = (e: React.MouseEvent<HTMLElement>, idx: number) => {
    e.stopPropagation();
    setEditMenuAnchor(e.currentTarget);
    setEditMenuCardIdx(idx);
  };

  const handleEditMenuClose = () => {
    setEditMenuAnchor(null);
    setEditMenuCardIdx(null);
  };

  const handleEditMenuAction = (key: string) => {
    handleEditMenuClose();
  };

  // AI suggestions update
  const handleUpdateSlide = (
    slideIndex: number,
    updated: Partial<{
      title: string;
      bullets: string[];
      bulletFormat?: "bullets" | "paragraphs" | "list" | null;
      image_url?: string;
    }>
  ) => {
    setCards((prev) => {
      const newCards = prev.map((card, i) =>
        i === slideIndex ? { ...card, ...updated } : card
      );
      debouncedSave(newCards);
      return newCards;
    });
  };

  // Image update
  const handleUpdateSlideImages = (slideIndex: number, newImages: string[]) => {
    setCards((prev) => {
      const newCards = prev.map((card, i) =>
        i === slideIndex ? { ...card, images: newImages } : card
      );
      debouncedSave(newCards);
      return newCards;
    });
  };

  // Image suggestions box (from OutlineCard)
  const handleImageSuggestionClick = (url: string) => {
    if (!imageSuggestionsBox) return;

    setCards((prev) => {
      const newCards = prev.map((card, idx) =>
        idx === imageSuggestionsBox.slideIndex
          ? {
              ...card,
              images: card.images.map((img, j) =>
                j === imageSuggestionsBox.imageIndex ? url : img
              ),
            }
          : card
      );
      debouncedSave(newCards);
      return newCards;
    });
    setImageSuggestionsBox(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", width: "100vw", bgcolor: "#FBFAFF", position: "relative", overflowX: "hidden" }}>
      <StepsHeader />
      <Box sx={{ mt: 4 }}>
        <StepIndicator activeStep={1} />
      </Box>

      <Box sx={{ width: "100%", maxWidth: 1440, mx: "auto", px: { xs: 1, md: 8, lg: 0 } }}>
        <Box sx={{ textAlign: "center", pt: { xs: 4, md: 10 }, pb: { xs: 1, md: 2 } }}>
          <Typography variant="h3" sx={{ fontWeight: 700, fontSize: { xs: "1.8rem", md: "3rem" }, mb: 2 }}>
            Review the Outline
          </Typography>
          <Typography sx={{ color: "#757575", mb: 6, maxWidth: 700, mx: "auto" }}>
            Enhance and tailor your slide content to deliver a powerful, persuasive presentation.
          </Typography>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Personal portfolio outline</Typography>
          <Typography sx={{ color: "#757575", mb: 4 }}>{cards.length} Cards</Typography>
          {isSaving && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="caption" color="primary">Saving changes...</Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="outline-cards">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {cards.map((card, idx) => (
                    <Draggable key={idx} draggableId={String(idx)} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            cursor: "pointer",
                            zIndex: snapshot.isDragging ? 100 : "auto",
                          }}
                        >
                          <OutlineCard
                            index={idx}
                            title={card.title}
                            bullets={card.bullets}
                            images={card.images}
                            onDelete={() => handleDelete(idx)}
                            dragHandleProps={provided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                            expanded={expandedIdx === idx}
                            onToggleExpand={() => handleCardClick(idx)}
                            onEdit={expandedIdx === idx ? (e: any) => handleEditClick(e, idx) : undefined}
                            editable
                            isEditing={editingIdx === idx}
                            editingTitle={editingTitle}
                            onTitleEditStart={() => handleTitleEditStart(idx, card.title)}
                            onTitleEditChange={handleTitleEditChange}
                            onTitleEditSave={() => handleTitleEditSave(idx)}
                            onTitleEditCancel={handleTitleEditCancel}
                            editingBulletsIdx={editingBulletsIdx}
                            editingBulletsValue={editingBulletsValue}
                            onBulletsEditStart={() => handleBulletsEditStart(idx, card.bullets)}
                            onBulletsEditChange={handleBulletsEditChange}
                            onBulletsEditSave={() => handleBulletsEditSave(idx)}
                            onBulletsEditCancel={handleBulletsEditCancel}
                            slideIndex={idx}
                            slidesState={slidesState}
                            isInfographicMode={false}
                            onUpdateSlideImages={handleUpdateSlideImages}
                            onUpdateSlide={handleUpdateSlide}
                            onSetImageSuggestionsBox={setImageSuggestionsBox}
                          />
                          {expandedIdx === idx && (
                            <EditMenuCard
                              open={editMenuCardIdx === idx && Boolean(editMenuAnchor)}
                              anchorEl={editMenuAnchor}
                              onClose={handleEditMenuClose}
                              onAction={handleEditMenuAction}
                            />
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      </Box>

      {/* Continue Button */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          bgcolor: "#FBFAFF",
          py: 4,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={handleContinue}
          disabled={isSaving}
          sx={{ width: { xs: "80%", md: 320 }, fontSize: "1.1rem" }}
        >
          {isSaving ? "Saving..." : "Continue"}
        </Button>
      </Box>

      {/* Image Suggestions Popup */}
      {imageSuggestionsBox && (
        <Box
          sx={{
            position: "absolute",
            top: imageSuggestionsBox.y,
            left: imageSuggestionsBox.x,
            zIndex: 1300,
            bgcolor: "white",
            border: "1px solid #ddd",
            borderRadius: 2,
            boxShadow: 3,
            p: 1,
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {imageSuggestionsBox.suggestions.map((url, i) => (
            <Box
              key={i}
              sx={{
                width: 100,
                height: 100,
                cursor: "pointer",
                overflow: "hidden",
                borderRadius: 1,
                border: "2px solid transparent",
                "&:hover": { borderColor: "#8E2DE2" },
              }}
              onClick={() => handleImageSuggestionClick(url)}
            >
              <Image src={url} alt="suggestion" width={100} height={100} style={{ objectFit: "cover" }} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}