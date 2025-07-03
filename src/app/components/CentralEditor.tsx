"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  IconButton,
  useMediaQuery,
  useTheme,
  InputBase,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import dynamic from "next/dynamic";

const TextPanel = dynamic(() => import("./TextPanel"), { ssr: false });
const ThemePanel = dynamic(() => import("./Theme"), { ssr: false });

// Sample slides data
const CentralEditor: React.FC = () => {
  const initialSlides = [
  {
    title: "Personal Portfolio: [Your Name/Professional Title]",
    bullets: [
      "Showcasing a proven track record in [Your Core Field/Expertise]",
      "Delivering quantifiable results for [Type of Clients/Organisations]",
      "Focused on strategic growth and operational excellence since [Year of experience]",
    ],
    image: "/images/sample-image.svg",
  },
  {
    title: "Accessibility best practices",
    bullets: ["Use semantic HTML", "Ensure color contrast", "Keyboard navigation"],
    image: "/images/sample-image.svg",
  },
  {
    title: "UX UI guidelines",
    bullets: ["Consistent spacing", "Clear CTAs", "Responsive design"],
    image: "/images/sample-image.svg",
  },
];
  const [slides, setSlides] = useState(initialSlides);
  const [notes, setNotes] = useState("");
  const [selected, setSelected] = useState(0);
  const [slideOrder, setSlideOrder] = useState(initialSlides.map((_, idx) => idx));
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [editing, setEditing] = useState<number | null>(null); // which slide is being edited
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  // Dynamically set maxWidth based on sidebar and screen size
  const cardMaxWidth = isLargeScreen ? 1600 : "100%";
  const notesMaxWidth = isLargeScreen ? 1600 : "100%";
  const slidesMaxWidth = isLargeScreen ? 1600 : "100%";

  // Drag and drop handlers
  const handleDragStart = (idx: number) => setDraggedIdx(idx);
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const newOrder = [...slideOrder];
    const [removed] = newOrder.splice(draggedIdx, 1);
    newOrder.splice(idx, 0, removed);
    setSlideOrder(newOrder);
    setDraggedIdx(idx);
  };
  const handleDragEnd = () => setDraggedIdx(null);

  // Inline editing handlers
  const handleTitleChange = (idx: number, value: string) => {
    setSlides(prev => prev.map((s, i) => i === idx ? { ...s, title: value } : s));
  };
  const handleBulletChange = (slideIdx: number, bulletIdx: number, value: string) => {
    setSlides(prev => prev.map((s, i) => i === slideIdx ? { ...s, bullets: s.bullets.map((b, j) => j === bulletIdx ? value : b) } : s));
  };
  const handleAddBullet = (slideIdx: number) => {
    setSlides(prev => prev.map((s, i) => i === slideIdx ? { ...s, bullets: [...s.bullets, ""] } : s));
  };
  const handleRemoveBullet = (slideIdx: number, bulletIdx: number) => {
    setSlides(prev => prev.map((s, i) => i === slideIdx ? { ...s, bullets: s.bullets.filter((_, j) => j !== bulletIdx) } : s));
  };

  // Add slide
  const handleAddSlide = () => {
    setSlides(prev => [...prev, { title: "New Slide", bullets: [""], image: "/images/sample-image.svg" }]);
    setSlideOrder(prev => [...prev, slides.length]);
  };

  return (
    <Box sx={{ width: "100%", px: 4, pt: 4, display: 'flex', flexDirection: 'row', position: 'relative' }}>
      {/* Main content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
      {/* Top Card: Editable Slide Preview */}
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Card
          sx={{
            borderRadius: 2.5,
            boxShadow: "0 4px 24px 0 rgba(123,74,226,0.08)",
            p: 5,
            mb: 4,
            border: "2px solid #D4CDFF",
            bgcolor: "#F9F9FB",
            minHeight: 520,
            maxWidth: cardMaxWidth,
            width: "100%",
          }}
        >
          {/* Editable Title */}
          <InputBase
            value={slides[0]?.title}
            onChange={e => handleTitleChange(0, e.target.value)}
            onFocus={() => setEditing(0)}
            onBlur={() => setEditing(null)}
            sx={{
              fontWeight: 600,
              fontSize: 32,
              width: '100%',
              mb: 3,
              bgcolor: '#F8F8FA',
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
            placeholder="Slide Title"
          />
          {/* Editable Bullets */}
          <List sx={{ pl: 4, mb: 4, color: "#444", fontSize: 21 }}>
            {slides[0]?.bullets?.map((b, i) => (
              <ListItem key={i} sx={{ py: 0.5, px: 0 }} disableGutters>
                <InputBase
                  value={b}
                  onChange={e => handleBulletChange(0, i, e.target.value)}
                  onFocus={() => setEditing(0)}
                  onBlur={() => setEditing(null)}
                  sx={{ fontSize: 19, width: '90%', bgcolor: '#F8F8FA', borderRadius: 1, px: 1.5, mr: 1 }}
                  placeholder={`Bullet ${i + 1}`}
                />
                <Button size="small" color="error" sx={{ minWidth: 0, px: 1 }} onClick={() => handleRemoveBullet(0, i)}>-</Button>
              </ListItem>
            ))}
            <ListItem sx={{ py: 0.5, px: 0 }} disableGutters>
              <Button size="small" onClick={() => handleAddBullet(0)} sx={{ fontSize: 16, color: '#7B4AE2', textTransform: 'none' }}>+ Add bullet</Button>
            </ListItem>
          </List>
          <Box
            sx={{
              width: "100%",
              borderRadius: 4,
              overflow: "hidden",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-start",
              minHeight: 180,
              pr: 3,
              pt: 2,
            }}
          >
            <img
              src={slides[0]?.image}
              alt="slide preview"
              style={{ width: "200%", maxHeight: 380, objectFit: "cover", borderRadius: 29 }}
            />
          </Box>
        </Card>
      </Box>

        {/* Notes Card */}
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 12px 0 rgba(123,74,226,0.06)",
              p: 4,
              mb: 4,
              bgcolor: "#fff",
              width: "100%",
              maxWidth: notesMaxWidth,
            }}
          >
            <Typography fontWeight={600} fontSize={22} mb={2} color="#444">
              Notes
            </Typography>
            <TextField
              placeholder="Add presenter notes...."
              multiline
              minRows={3}
              maxRows={8}
              fullWidth
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: 18,
                  bgcolor: "#FAFAFA",
                  borderRadius: 2,
                  px: 2.5,
                  py: 1.5,
                },
              }}
            />
          </Card>
        </Box>

        {/* Slides Overview (draggable preview) */}
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: 4,
              boxShadow: "0 2px 12px 0 rgba(123,74,226,0.06)",
              p: 3,
              display: "flex",
              alignItems: "center",
              gap: 3,
              overflowX: "auto",
              mb: 3,
              maxWidth: slidesMaxWidth,
              width: "100%",
              minHeight: 230,
            }}
          >
          {slideOrder.map((slideIdx, idx) => {
            const slide = slides[slideIdx];
            return (
              <Box
                key={slideIdx}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={e => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                onDrop={handleDragEnd}
                sx={{
                  minWidth: 300,
                  minHeight: 100,
                  maxWidth: 200,
                  maxHeight: 160,
                  borderRadius: 2,
                  border: '2px solid #E0E0E0',
                  bgcolor: selected === slideIdx ? '#F3EDFF' : '#FAFAFA',
                  boxShadow: selected === slideIdx ? '0 2px 8px 0 #7B4AE222' : 'none',
                  cursor: 'grab',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  position: 'relative',
                  transition: 'all 0.15s',
                  outline: selected === slideIdx ? '2px solid #7B4AE2' : 'none',
                  mr: 2,
                  pt: 1,
                  pb: 1,
                  opacity: draggedIdx === idx ? 0.5 : 1,
                }}
                onClick={() => { setSelected(slideIdx); }}
              >
                {/* Number at left */}
                <Box sx={{ position: 'absolute', top: 10, left: 19, zIndex: 2 }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#7B4AE2' }}>{idx + 1}</Typography>
                </Box>
                {/* Draggable icon */}
                <Box sx={{ position: 'absolute', top: 100, left: 15, zIndex: 2 }}>
                  <DragIndicatorIcon sx={{ color: '#B0AEB8', fontSize: 20, cursor: 'grab' }} />
                </Box>
                {/* Image preview */}
                <Box
                  sx={{
                    width: 200,
                    height: 100,
                    borderRadius: 1.5,
                    bgcolor: '#FFF',
                    mt: 1,
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #D4CDFF',
                    boxShadow: '0 2px 8px 0 #7B4AE222',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={slide.image}
                    alt={`Slide ${idx + 1} preview`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 1.5 }}
                  />
                </Box>
              </Box>
            );
          })}
            {/* Add Slide Button */}
            <Box
              sx={{
                minWidth: 200,
                minHeight: 170,
                maxWidth: 200,
                maxHeight: 90,
                borderRadius: 2,
                bgcolor: '#F5F5F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2.5px dashed #E0E0E0',
              }}
              onClick={handleAddSlide}
            >
              <IconButton>
                <AddIcon sx={{ fontSize: 32, color: '#B0AEB8' }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
      {/* Right Panel: Show TextPanel when editing a slide, otherwise show ThemePanel */}
      {editing !== null ? (
        <Box sx={{ width: 360, minWidth: 320, maxWidth: 400, bgcolor: '#fff', borderLeft: '1px solid #E0E0E0', height: '100vh', position: 'sticky', top: 0, zIndex: 10 }}>
          <TextPanel sidebarHeight="100vh" />
        </Box>
      ) : (
        <Box sx={{ width: 360, minWidth: 320, maxWidth: 400, bgcolor: '#fff', borderLeft: '1px solid #E0E0E0', height: '100vh', position: 'sticky', top: 0, zIndex: 10 }}>
          <ThemePanel />
        </Box>
      )}
    </Box>
  );
};

export default CentralEditor;
