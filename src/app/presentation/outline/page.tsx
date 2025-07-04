"use client";
import React, { useState } from "react";
import { Box, Button, Typography, Paper, IconButton } from "@mui/material";
import OutlineCard from "@/app/components/create-presentation/outline/OutlineCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import GeneralHeader from "@/app/components/create-presentation/outline/General-Header";
import EditMenuCard from "@/app/components/create-presentation/outline/EditMenuCard";
import { useSlides } from "@/app/context/SlidesContext";

// Placeholder SVGs (replace with Figma SVGs as needed)
const sampleImages = [
  "/images/ai-card-img.svg",
  "/images/black-star.svg",
  "/images/blue-star.svg",
  "/images/community-icon.svg",
  "/images/context-image.svg",
];

const initialCards = [
  {
    title: "Personal Portfolio: [Your Name/Professional Title]",
    bullets: [
      "Expert in [Your Core Field]",
      "Results for [Type of Clients]",
      "Committed to growth since [Year]",
    ],
    images: sampleImages,
  },
  { title: "About Me: Driving Impact Through [Key Skill 1] & [Key Skill 2]" },
  { title: "Project Spotlight: [Project Title 1] - [Quantifiable Outcome]" },
  { title: "Impact & Recognition: Testimonials and Awards" },
  { title: "Core Skills & Expertise: Delivering Excellence" },
  { title: "Impact & Recognition: Testimonials and Awards" },
  { title: "Let's Connect: Your Future Collaboration Partner" },
];

const mockDetails = [
  {
    bullets: [
      "Expert in [Your Core Field]",
      "Results for [Type of Clients]",
      "Committed to growth since [Year]",
    ],
    images: sampleImages,
  },
  {
    bullets: [
      "Driven by innovation and results",
      "Skilled in [Skill 1] and [Skill 2]",
      "Passionate about growth",
    ],
    images: sampleImages.slice(0, 3),
  },
  {
    bullets: [
      "Project delivered on time",
      "Exceeded client expectations",
      "Quantifiable outcome: +30% ROI",
    ],
    images: sampleImages.slice(2),
  },
  {
    bullets: [
      "Recognized by industry leaders",
      "Multiple awards for excellence",
      "Positive client testimonials",
    ],
    images: sampleImages,
  },
  {
    bullets: [
      "Expert in core skills",
      "Consistent delivery of excellence",
      "Continuous learning",
    ],
    images: sampleImages.slice(1, 4),
  },
  {
    bullets: [
      "Awarded for outstanding impact",
      "Recognized by peers",
      "Featured in media",
    ],
    images: sampleImages,
  },
  {
    bullets: [
      "Ready to collaborate",
      "Open to new opportunities",
      "Let's connect!",
    ],
    images: sampleImages.slice(0, 2),
  },
];

// --- API response type for future integration ---
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

// Utility to map API response to card data structure
export function mapApiSlidesToCards(apiSlides: SlideApiResponse[]) {
  return apiSlides.map((slide) => ({
    title: slide.slide_title.text,
    bullets: slide.elements
      .filter((el) => el.element_type === "bullet_point")
      .map((el) => el.text),
    images: slide.image_url ? [slide.image_url] : [],
    // You can add more fields as needed
  }));
}

export default function OutlinePage() {
  const { slides } = useSlides();
  const [cards, setCards] = useState(() =>
    slides && slides.length > 0 ? mapApiSlidesToCards(slides) : initialCards
  );
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [editingBulletsIdx, setEditingBulletsIdx] = useState<number | null>(
    null
  );
  const [editingBulletsValue, setEditingBulletsValue] = useState<string>("");

  // Bullets as paragraph editing handlers
  const handleBulletsEditStart = (
    cardIdx: number,
    bullets: string[] | undefined
  ) => {
    setEditingBulletsIdx(cardIdx);
    setEditingBulletsValue((bullets || []).join("\n"));
  };

  const handleBulletsEditChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEditingBulletsValue(e.target.value);
  };

  const handleBulletsEditSave = (cardIdx: number) => {
    setCards((prev) =>
      prev.map((card, i) => {
        if (i !== cardIdx) return card;
        // Always preserve images (even if undefined, fallback to [])
        return {
          ...card,
          bullets: editingBulletsValue
            .split(/\r?\n/)
            .filter((line) => line.trim() !== ""),
          images: "images" in card ? card.images ?? [] : [],
        };
      })
    );
    setEditingBulletsIdx(null);
    setEditingBulletsValue("");
  };

  const handleBulletsEditCancel = () => {
    setEditingBulletsIdx(null);
    setEditingBulletsValue("");
  };
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [editMenuAnchor, setEditMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [editMenuCardIdx, setEditMenuCardIdx] = useState<number | null>(null);

  // Drag and drop handler
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const reordered = Array.from(cards);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setCards(reordered);
    // If expanded card is moved, collapse it
    setExpandedIdx(null);
  };

  // Delete handler
  const handleDelete = (idx: number) => {
    setCards((cards) => cards.filter((_, i) => i !== idx));
    if (expandedIdx === idx) setExpandedIdx(null);
  };

  // Regenerate handler (placeholder)
  const handleRegenerate = () => {
    setCards(initialCards);
    setExpandedIdx(null);
  };

  const handleCardClick = (idx: number) => {
    // If currently editing, do not expand/collapse
    if (editingIdx !== null) return;
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  const handleTitleEditStart = (idx: number, currentTitle: string) => {
    setEditingIdx(idx);
    setEditingTitle(currentTitle);
  };

  const handleTitleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };

  const handleTitleEditSave = (idx: number) => {
    setCards((prev) =>
      prev.map((card, i) =>
        i === idx ? { ...card, title: editingTitle } : card
      )
    );
    setEditingIdx(null);
    setEditingTitle("");
  };

  const handleTitleEditCancel = () => {
    setEditingIdx(null);
    setEditingTitle("");
  };

  const handleEditClick = (
    event: React.MouseEvent<HTMLElement>,
    idx: number
  ) => {
    event.stopPropagation();
    setEditMenuAnchor(event.currentTarget);
    setEditMenuCardIdx(idx);
  };

  const handleEditMenuClose = () => {
    setEditMenuAnchor(null);
    setEditMenuCardIdx(null);
  };

  const handleEditMenuAction = (key: string) => {
    // Handle the action here (e.g., call an API or update state)
    handleEditMenuClose();
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
        {/* Header */}
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
          {/* Hide the star on mobile, show on md+ */}
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
            <Button
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
                "&:hover": {
                  background: "#4A00E0",
                },
              }}
              className="w-full md:w-auto"
            >
              Regenerate Outline
            </Button>
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
        {/* Cards List */}
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
                          onClick={() => handleCardClick(idx)}
                        >
                          <OutlineCard
                            index={idx}
                            title={card.title}
                            onDelete={() => handleDelete(idx)}
                            dragHandleProps={provided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                            expanded={expandedIdx === idx}
                            bullets={cards[idx]?.bullets}
                            images={cards[idx]?.images}
                            onEdit={
                              expandedIdx === idx
                                ? (event) => handleEditClick(event, idx)
                                : undefined
                            }
                            editable={true}
                            isEditing={editingIdx === idx}
                            editingTitle={editingTitle}
                            onTitleEditStart={() =>
                              handleTitleEditStart(idx, card.title)
                            }
                            onTitleEditChange={handleTitleEditChange}
                            onTitleEditSave={() => handleTitleEditSave(idx)}
                            onTitleEditCancel={handleTitleEditCancel}
                            // Bullets paragraph editing props
                            editingBulletsIdx={editingBulletsIdx}
                            editingBulletsValue={editingBulletsValue}
                            onBulletsEditStart={() =>
                              handleBulletsEditStart(idx, cards[idx]?.bullets)
                            }
                            onBulletsEditChange={handleBulletsEditChange}
                            onBulletsEditSave={() => handleBulletsEditSave(idx)}
                            onBulletsEditCancel={handleBulletsEditCancel}
                            // Prevent card close on image click
                            onImageClick={(e) => e.stopPropagation()}
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
      {/* Continue Button - sticky on mobile */}
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
            "&:hover": {
              background: "#4A00E0",
            },
          }}
          className="w-4/5 md:w-[320px]"
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
}
