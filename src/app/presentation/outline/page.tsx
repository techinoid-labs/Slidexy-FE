"use client";
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import OutlineCard from "@/app/components/create-presentation/outline/OutlineCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Image from "next/image";
import EditMenuCard from "@/app/components/create-presentation/outline/EditMenuCard";
import GeneralHeader from "@/app/components/create-presentation/outline/General-Header";
import { useSlides } from "@/app/context/SlidesContext";
import { useDispatch } from "react-redux";
import { setSlides } from "@/app/slice/slidesSlice";
import { useRouter } from "next/navigation";
import type { Slide } from "@/app/slice/slidesSlice";

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
function mapCardsToSlides(cards: any[]): Slide[] {
  return cards.map((card, index) => ({
    slide_id: `slide-${index + 1}`,
    slide_title: {
      text: card.title,
      konva_component: "Konva.Text",
      properties: {
        fontSize: 32,
        fontFamily: "Inter",
        fill: "#333",
        fontStyle: "bold",
      },
    },
    elements: (card.bullets || []).map((text: string) => ({
      element_type: "bullet_point",
      text,
      konva_component: "Konva.Text",
      properties: {
        fontSize: 18,
        fontFamily: "Inter",
        fill: "#444",
        fontStyle: "normal",
      },
    })),
    image_url: card.images?.[0] || null,
    image_caption: "",
  }));
}

export default function OutlinePage() {
  const { slides }: any = useSlides();
  const slidesState = slides; // or use a better name if you like
  const isInfographicMode = false; // replace with actual logic if available
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

  const handleBulletsEditStart = (idx: number, bullets?: string[]) => {
    setEditingBulletsIdx(idx);
    setEditingBulletsValue((bullets || []).join("\n"));
  };
  const handleBulletsEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setEditingBulletsValue(e.target.value);
  const handleBulletsEditSave = (idx: number) => {
    setCards((prev) =>
      prev.map((c, i) =>
        i !== idx
          ? c
          : {
              ...c,
              bullets: editingBulletsValue
                .split(/\r?\n/)
                .filter((l) => l.trim() !== ""),
              images: "images" in c ? c.images ?? [] : [],
            }
      )
    );
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
  };

  const handleDelete = (idx: number) => {
    setCards((prev) => prev.filter((_, i) => i !== idx));
    if (expandedIdx === idx) setExpandedIdx(null);
  };

  const handleRegenerate = () => {
    setCards([]);
    setExpandedIdx(null);
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
    setCards((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, title: editingTitle } : c))
    );
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
      <GeneralHeader />
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
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              top: { md: 100 },
              left: { md: 190 },
            }}
          >
            <Image
              src="/images/side-star-dark.svg"
              alt="Icon"
              width={60}
              height={60}
            />
          </Box>
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
            {/* <Button
              onClick={handleRegenerate}
              variant="contained"
              endIcon={
                <Image
                  src="/images/regenerate-outline.svg"
                  alt="regen"
                  width={16}
                  height={16}
                  style={{ minWidth: 16, minHeight: 16 }}
                />
              }
              sx={{
                background:
                  "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
                color: "#fff",
                borderRadius: "999px",
                px: { xs: 2, md: 4 },
                py: { xs: 0.7, md: 1.5 },
                fontWeight: 600,
                fontSize: { xs: "0.92rem", md: "1.1rem" },
                textTransform: "none",
                boxShadow: "0 2px 8px 0 rgba(80, 80, 120, 0.07)",
                minHeight: { xs: 30, md: 44 },
                width: { xs: "100%", md: "auto" },
                maxWidth: 260,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": { background: "#4A00E0" },
              }}
              className="w-full md:w-auto"
            >
              Regenerate Outline
            </Button> */}
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
                                ? (e:any) => handleEditClick(e, idx)
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
                            // ✅ Add this line to fix the error:
                            onUpdateSlideImages={(slideIndex, newImages) => {
                              setCards((prev) =>
                                prev.map((card, i) =>
                                  i === slideIndex
                                    ? { ...card, images: [...newImages] }
                                    : card
                                )
                              );
                            }}
                            onUpdateSlide={(slideIndex, updated) => {
                              setCards((prev) =>
                                prev.map((card, i) =>
                                  i === slideIndex
                                    ? { ...card, ...updated }
                                    : card
                                )
                              );
                            }}
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
                setCards((prev) =>
                  prev.map((card, idx) =>
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
                  )
                );
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
