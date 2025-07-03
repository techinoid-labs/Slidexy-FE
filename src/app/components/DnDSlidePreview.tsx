"use client";

import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Slide {
  title: string;
  image?: string;
}

interface DnDSlidePreviewProps {
  slides: Slide[];
  selected: number;
  setSelected: (idx: number) => void;
  onReorder: (slides: Slide[]) => void;
}

function SortableSlide({ slide, idx, selected, setSelected }: { slide: Slide; idx: number; selected: number; setSelected: (idx: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: idx });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };
  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      sx={{
        minWidth: 90,
        minHeight: 90,
        maxWidth: 90,
        maxHeight: 90,
        borderRadius: 2,
        border: selected === idx ? "2px solid #7B4AE2" : "2px solid #E0E0E0",
        bgcolor: selected === idx ? "#F3EDFF" : "#FAFAFA",
        boxShadow: selected === idx ? "0 2px 8px 0 #7B4AE222" : "none",
        cursor: "grab",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
        transition: "all 0.15s",
        outline: selected === idx ? "2px solid #7B4AE2" : "none",
        mr: 2,
        pt: 1,
        pb: 1,
        userSelect: "none",
      }}
      onClick={() => setSelected(idx)}
    >
      {/* Numbering at top left */}
      <Box sx={{ position: 'absolute', top: 6, left: 8, zIndex: 2 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#7B4AE2' }}>{idx + 1}</Typography>
      </Box>
      {/* Draggable icon below numbering */}
      <Box sx={{ position: 'absolute', top: 24, left: 8, zIndex: 2 }} {...listeners}>
        <DragIndicatorIcon sx={{ color: '#B0AEB8', fontSize: 20, cursor: 'grab' }} />
      </Box>
      {/* Image frame for slide thumbnail */}
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 1.5,
          bgcolor: '#FFF',
          mt: 2.5,
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #D4CDFF',
          boxShadow: '0 2px 8px 0 #7B4AE222',
          overflow: 'hidden',
        }}
      >
        {/* Sample image will be added here later */}
      </Box>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#444', textAlign: 'center', px: 0.5 }} noWrap>
        {slide.title}
      </Typography>
    </Box>
  );
}

export default function DnDSlidePreview({ slides, selected, setSelected, onReorder }: DnDSlidePreviewProps) {
  const [items, setItems] = React.useState(slides.map((_, i) => i));

  React.useEffect(() => {
    setItems(slides.map((_, i) => i));
  }, [slides]);

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      const newSlides = newItems.map(i => slides[i]);
      onReorder(newSlides);
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {items.map((i) => (
            <SortableSlide key={i} slide={slides[i]} idx={i} selected={selected} setSelected={setSelected} />
          ))}
        </Box>
      </SortableContext>
    </DndContext>
  );
}
