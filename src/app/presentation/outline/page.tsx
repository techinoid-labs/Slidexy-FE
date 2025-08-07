"use client";
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import OutlineCard from "@/app/components/create-presentation/outline/OutlineCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Image from "next/image";
import EditMenuCard from "@/app/components/create-presentation/outline/EditMenuCard";
import { useSlides } from "@/app/context/SlidesContext";
import { useDispatch } from "react-redux";
import { setSlides } from "@/app/slice/slidesSlice";
import { useRouter } from "next/navigation";
import type { Slide } from "@/app/slice/slidesSlice";
import StepIndicator from "@/app/components/shared/StepIndicator";
import StepsHeader from "@/app/components/shared/StepsHeader";
import { getSlideDimensions } from "@/utils/slideUtils";
import { getSlideDimensions as getMobileSlideDimensions } from "@/utils/slideUtilsmobile";
// const { SLIDE_WIDTH, SLIDE_HEIGHT, LEFT_PADDING, IMAGE_WIDTH, IMAGE_HEIGHT } =
//   getSlideDimensions();
// API response type and map helper
export interface SlideApiResponse {
  slide_id: string;
  slide_title: {
    text: string;
    konva_component: string;
    properties: Record<string, any>;
  };
  image_url?: string;
  image_caption?: string;
  elements: Array<{
    element_type: string;
    text: string;
    konva_component: string;
    properties: Record<string, any>;
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

// Map UI cards back to Redux Slide[] format
// function mapCardsToSlides(cards: any[]): Slide[] {
//   return cards.map((card, index) => ({
//     slide_id: `slide-${index + 1}`,
//     slide_title: {
//       text: card.title,
//       konva_component: "Konva.Text",
//       properties: {
//         fontSize: 32,
//         fontFamily: "Inter",
//         fill: "#333",
//         fontStyle: "bold",
//       },
//     },
//     elements: (card.bullets || []).map((text: string) => ({
//       element_type: "bullet_point",
//       text,
//       konva_component: "Konva.Text",
//       properties: {
//         fontSize: 18,
//         fontFamily: "Inter",
//         fill: "#444",
//         fontStyle: "normal",
//       },
//     })),
//     image_url: card.images?.[0] || null,
//     image_caption: "",
//   }));
// }

function mapCardsToSlides(cards: any[]): Slide[] {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  const { SLIDE_WIDTH, SLIDE_HEIGHT, LEFT_PADDING, IMAGE_WIDTH, IMAGE_HEIGHT } =
    isMobile ? getMobileSlideDimensions() : getSlideDimensions();

  const bulletFontSize = isMobile ? 12 : 18;
  const titleFontSize = isMobile ? 14 : 32;

  return cards.map((card, index) => {
    const bulletElements = (card.bullets || []).map((text: string) => ({
      element_type: "bullet_point",
      text,
      konva_component: "Konva.Text",
      properties: {
        fontSize: bulletFontSize,
        fontFamily: "Inter",
        fill: "#444",
        fontStyle: "normal",
        zIndex: index + 1,
      },
    }));

    const imageElement = card.images?.[0]
      ? [
          {
            element_type: "image",
            konva_component: "Konva.Image",
            properties: {
              imageSrc: card.images[0],
              x: isMobile ? SLIDE_WIDTH - 250 : SLIDE_WIDTH - IMAGE_WIDTH - 20,
              y: isMobile
                ? SLIDE_HEIGHT - 250
                : (SLIDE_HEIGHT - IMAGE_HEIGHT) / 2,
              width: isMobile ? 230 : IMAGE_WIDTH,
              height: isMobile ? 230 : IMAGE_HEIGHT,
              zIndex: 4,
            },
          },
        ]
      : [];

    return {
      slide_id: `slide-${index + 1}`,
      slide_title: {
        text: card.title,
        konva_component: "Konva.Text",
        properties: {
          fontSize: titleFontSize,
          fontFamily: "Inter",
          fill: "#333",
          fontWeight: "bold",
          fontStyle: "bold",
        },
      },
      elements: [...bulletElements, ...imageElement],
      image_url: card.images?.[0] || null,
      image_caption: "",
    };
  });
}

export default function OutlinePage() {
  const { slides }: any = useSlides();
  const slidesState = slides;
  const isInfographicMode = false;
  const dispatch = useDispatch();
  const router = useRouter();
  const [imageSuggestionsBox, setImageSuggestionsBox] = React.useState<{
    slideIndex: number;
    imageIndex: number;
    x: number;
    y: number;
    suggestions: string[];
  } | null>(null);

  const [cards, setCards] = useState(() =>
    slides && slides.length > 0 ? mapApiSlidesToCards(slides) : []
  );
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [editingBulletsIdx, setEditingBulletsIdx] = useState<number | null>(
    null
  );
  const [editingBulletsValue, setEditingBulletsValue] = useState<string>("");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [editMenuAnchor, setEditMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [editMenuCardIdx, setEditMenuCardIdx] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
        i !== idx
          ? c
          : {
              ...c,
              bullets: editingBulletsValue
                .split(/\r?\n/)
                .filter((l) => l.trim() !== ""),
              images: "images" in c ? c.images ?? [] : [],
            }
      );
      // Dispatch updated slides to Redux store
      const mappedSlides = mapCardsToSlides(newCards);
      setTimeout(() => {
        dispatch(setSlides(mappedSlides));
      }, 100);

      return newCards;
    });
    setEditingBulletsIdx(null);
    setEditingBulletsValue("");
  };
  const handleBulletsEditCancel = () => {
    setEditingBulletsIdx(null);
    setEditingBulletsValue("");
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const arr = Array.from(cards);
    const [removed] = arr.splice(result.source.index, 1);
    arr.splice(result.destination.index, 0, removed);
    setCards(arr);
    setExpandedIdx(null);
    // Dispatch updated slides to Redux store
    const mappedSlides = mapCardsToSlides(arr);
    dispatch(setSlides(mappedSlides));
  };

  const handleDelete = (idx: number) => {
    setCards((prev) => {
      const newCards = prev.filter((_, i) => i !== idx);
      // Dispatch updated slides to Redux store
      const mappedSlides = mapCardsToSlides(newCards);
      dispatch(setSlides(mappedSlides));
      return newCards;
    });
    if (expandedIdx === idx) setExpandedIdx(null);
  };

  const handleRegenerate = () => {
    setCards([]);
    setExpandedIdx(null);
    // Dispatch empty slides to Redux store
    dispatch(setSlides([]));
  };

  const handleCardClick = (idx: number) => {
    if (editingIdx !== null) return;
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

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
      // Dispatch updated slides to Redux store
      const mappedSlides = mapCardsToSlides(newCards);
      setTimeout(() => {
        dispatch(setSlides(mappedSlides));
      }, 100);

      return newCards;
    });
    setEditingIdx(null);
    setEditingTitle("");
  };
  const handleTitleEditCancel = () => {
    setEditingIdx(null);
    setEditingTitle("");
  };

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

  const handleContinue = () => {
    const mapped = mapCardsToSlides(cards);
    dispatch(setSlides(mapped));
    console.log("[OutlinePage] Slides sent to Redux:", mapped);
    router.push("/editor");
  };

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
      // Dispatch updated slides to Redux store
      const mappedSlides = mapCardsToSlides(newCards);
      setTimeout(() => {
        dispatch(setSlides(mappedSlides));
      }, 100);

      return newCards;
    });
    if (updated.image_url) {
      setPreviewImage(updated.image_url);
    }
  };

  const handleUpdateSlideImages = (slideIndex: number, newImages: string[]) => {
    setCards((prev) => {
      const newCards = prev.map((card, i) =>
        i === slideIndex ? { ...card, images: [...newImages] } : card
      );
      // Dispatch updated slides to Redux store
      const mappedSlides = mapCardsToSlides(newCards);
      setTimeout(() => {
        dispatch(setSlides(mappedSlides));
      }, 100);

      return newCards;
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "#FBFAFF",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <StepsHeader />
      <Box sx={{ mt: 4 }}>
        <StepIndicator activeStep={1} />
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1440,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: { xs: 1, md: 8, lg: 0 },
        }}
        className="sm:px-4 px-1"
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: { xs: 4, md: 10 },
            pb: { xs: 1, md: 2 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              textAlign: "center",
              color: "#18181B",
              fontSize: { xs: "1.3rem", sm: "2rem", md: "3rem", lg: "3.5rem" },
              mb: { xs: 1.5, md: 2.5 },
              mt: { xs: -2, md: -6 },
            }}
          >
            Review the Outline
          </Typography>
          <Typography
            sx={{
              color: "#757575",
              textAlign: "center",
              mb: { xs: 3, md: 6 },
              maxWidth: { xs: 320, sm: 700 },
              fontSize: { xs: "0.95rem", sm: "1rem", md: "1.15rem" },
            }}
          >
            Enhance and tailor your slide content to deliver a powerful,
            persuasive presentation.
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: { xs: "center", md: "space-between" },
              mb: { xs: 1, md: 2 },
              gap: { xs: 1, md: 2 },
              maxWidth: 1200,
            }}
            className="w-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-2 mb-2"
          >
            <Typography
              sx={{
                fontWeight: 600,
                color: "#18181B",
                fontSize: { xs: "0.98rem", md: "1.15rem" },
                mb: { xs: 1, md: 0 },
                textAlign: { xs: "center", md: "left" },
              }}
              className="text-center md:text-left"
            >
              Personal portfolio outline
            </Typography>
          </Box>
          <Typography
            sx={{
              color: "#757575",
              fontSize: { xs: "0.92rem", md: "0.98rem" },
              mb: { xs: 2, md: 4 },
              maxWidth: 1200,
              width: "100%",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {cards.length} Cards
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            alignItems: "center",
            maxWidth: 1200,
          }}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="outline-cards">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                  }}
                >
                  {cards.map((card, idx) => (
                    <Draggable key={idx} draggableId={String(idx)} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            width: "100%",
                            cursor: "pointer",
                            zIndex: snapshot.isDragging ? 100 : "auto",
                          }}
                        >
                          <OutlineCard
                            index={idx}
                            title={card.title}
                            onDelete={() => handleDelete(idx)}
                            onSetImageSuggestionsBox={setImageSuggestionsBox}
                            dragHandleProps={provided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                            expanded={expandedIdx === idx}
                            bullets={card.bullets}
                            images={card.images}
                            onToggleExpand={() => handleCardClick(idx)}
                            onEdit={
                              expandedIdx === idx
                                ? (e: any) => handleEditClick(e, idx)
                                : undefined
                            }
                            editable
                            isEditing={editingIdx === idx}
                            editingTitle={editingTitle}
                            onTitleEditStart={() =>
                              handleTitleEditStart(idx, card.title)
                            }
                            onTitleEditChange={handleTitleEditChange}
                            onTitleEditSave={() => handleTitleEditSave(idx)}
                            onTitleEditCancel={handleTitleEditCancel}
                            editingBulletsIdx={editingBulletsIdx}
                            editingBulletsValue={editingBulletsValue}
                            onBulletsEditStart={() =>
                              handleBulletsEditStart(idx, card.bullets)
                            }
                            onBulletsEditChange={handleBulletsEditChange}
                            onBulletsEditSave={() => handleBulletsEditSave(idx)}
                            onBulletsEditCancel={handleBulletsEditCancel}
                            slideIndex={idx}
                            slidesState={slidesState}
                            isInfographicMode={isInfographicMode}
                            onUpdateSlideImages={handleUpdateSlideImages}
                            onUpdateSlide={handleUpdateSlide}
                          />
                          {expandedIdx === idx && (
                            <EditMenuCard
                              open={
                                editMenuCardIdx === idx &&
                                Boolean(editMenuAnchor)
                              }
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
          width: "100%",
          display: "flex",
          justifyContent: "center",
          mt: { xs: 4, md: 10 },
          px: { xs: 0.5, md: 0 },
          position: { xs: "sticky", md: "static" },
          bottom: 0,
          zIndex: 10,
          bgcolor: "#FBFAFF",
          pt: { xs: 2, md: 4 },
          pb: { xs: 3, md: 6 },
        }}
        className="w-full flex justify-center items-center"
      >
        <Button
          variant="contained"
          onClick={handleContinue}
          sx={{
            width: { xs: "80%", md: 320 },
            maxWidth: 400,
            borderRadius: "999px",
            py: { xs: 1.2, md: 2.5 },
            fontSize: { xs: "1rem", md: "1.15rem" },
            fontWeight: 600,
            textTransform: "none",
            background:
              "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
            boxShadow: "none",
            "&:hover": { background: "#4A00E0" },
          }}
          className="w-4/5 md:w-[320px]"
        >
          Continue
        </Button>
      </Box>

      {imageSuggestionsBox && (
        <Box
          sx={{
            position: "absolute",
            top: imageSuggestionsBox.y,
            left: imageSuggestionsBox.x,
            zIndex: 1300,
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: 2,
            boxShadow: 3,
            p: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {imageSuggestionsBox.suggestions.map((url, i) => (
            <Box
              key={i}
              sx={{
                width: 120,
                height: 120,
                cursor: "pointer",
                overflow: "hidden",
                borderRadius: 1,
                border: "1px solid #eee",
                "&:hover": { borderColor: "#8E2DE2" },
              }}
              onClick={() => {
                setCards((prev) => {
                  const newCards = prev.map((card, idx) =>
                    idx === imageSuggestionsBox.slideIndex
                      ? {
                          ...card,
                          images: [
                            ...(card.images || []).map((img, j) =>
                              j === imageSuggestionsBox.imageIndex ? url : img
                            ),
                          ],
                        }
                      : card
                  );
                  // Dispatch updated slides to Redux store
                  const mappedSlides = mapCardsToSlides(newCards);
                  dispatch(setSlides(mappedSlides));
                  return newCards;
                });
                setImageSuggestionsBox(null);
              }}
            >
              <Image
                src={url}
                alt={`suggested-${i}`}
                width={120}
                height={120}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
