"use client"

import type React from "react"
import { Box, Stack } from "@mui/material"
import { Stage, Layer } from "react-konva"
import SlideRenderer from "./SlideRenderer"
import type { Presentation } from "../types/presentation"

const PresentationViewer: React.FC<{ presentation: Presentation }> = ({ presentation }) => {
  const STAGE_W = 960
  const STAGE_H = 540

  return (
    <Stack spacing={4} sx={{ p: 2 }}>
      {presentation.slides.map((slide) => (
        <Box key={slide.slide_id}>
          <Box
            sx={{
              border: "3px solid #8E2DE2",
              width: STAGE_W,
              height: STAGE_H,
              backgroundColor: "#f5f5f5",
              mx: "auto",
            }}
          >
            <Stage width={STAGE_W} height={STAGE_H}>
              <Layer>
                <SlideRenderer slide={slide} />
              </Layer>
            </Stage>
          </Box>
        </Box>
      ))}

      {/* <Box textAlign="center" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => exportPresentationToPptx(presentation)}
        >
          Export to PPTX
        </Button>
      </Box> */}
    </Stack>
  )
}

export default PresentationViewer
