import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SlidePreviews from '@/app/editor/slidesPreview';

interface HorizontalSlidesCarouselProps {
  slides: any[];
  selectedIndex: number;
  onSelectSlide: (index: number) => void;
  children: React.ReactNode; // The main slide content
  slideWidth: number;
  slideHeight: number;
  thumbnailHeight?: number;
  onAddSlide?: () => void;
  onDeleteSlide?: (index: number) => void;
}

const HorizontalSlidesCarousel: React.FC<HorizontalSlidesCarouselProps> = ({
  slides,
  selectedIndex,
  onSelectSlide,
  children,
  slideWidth,
  slideHeight,
  thumbnailHeight = 80,
  onAddSlide,
  onDeleteSlide,
}) => {
  // Update scroll buttons
  const updateScrollButtons = () => {
    // No longer needed since SlidePreviews handles scrolling
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Main slide view */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflowX: 'auto',
          overflowY: 'hidden',
          background: 'transparent', // keep stage background transparent so Stage visuals show cleanly
          padding: 0,
          borderRadius: 0,
          marginBottom: '12px',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Horizontal thumbnail carousel - using SlidePreviews */}
      <SlidePreviews
        slides={slides}
        slide_width={slideWidth}
        slide_height={slideHeight}
        selectedIndex={selectedIndex}
        onSelect={onSelectSlide}
        onAddSlide={onAddSlide || (() => {})}
        onDeleteSlide={onDeleteSlide || (() => {})}
      />
    </Box>
  );
};

export default HorizontalSlidesCarousel;
