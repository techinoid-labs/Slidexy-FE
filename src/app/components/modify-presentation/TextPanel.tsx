import React from "react";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  Typography,
  IconButton,
  Slider,
  InputBase,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import VerticalAlignCenterIcon from "@mui/icons-material/VerticalAlignCenter";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useSlides } from "@/app/context/SlidesContext";
import { setSlides } from "@/app/slice/slidesSlice";
import { useDispatch } from "react-redux";
import { Slide } from "@/app/slice/slidesSlice";

const fontOptions = ["Raleway", "Roboto", "Montserrat"];
const weightOptions = ["Regular", "Semibold", "Bold"];
const textTypeOptions = ["Title", "Headline", "Body"];

interface TextSettingsPanelProps {
  selectedTextId: string | null;
  setSelectedTextId: (id: string | null) => void;
  sidebarHeight?: string | number;
  resetAll?: () => void;
}

const TextSettingsPanel: React.FC<TextSettingsPanelProps> = ({ selectedTextId, setSelectedTextId, sidebarHeight = '100vh', resetAll }) => {
  const dispatch = useDispatch();
  const { slides } = useSlides();

  // Parse selectedTextId
  const parsed = selectedTextId ? selectedTextId.match(/(?:title|el)-(\d+)(?:-(\d+))?/) : null;
  const slideIndex = parsed ? parseInt(parsed[1], 10) : -1;
  const elementIndex = parsed?.[2] ? parseInt(parsed[2], 10) : null;

  // Get the selected text element
  let textObj: any = null;
  if (slideIndex !== -1 && slides[slideIndex]) {
    if (selectedTextId?.startsWith("title")) {
      textObj = slides[slideIndex].slide_title;
    } else if (elementIndex !== null && slides[slideIndex].elements[elementIndex]) {
      textObj = slides[slideIndex].elements[elementIndex];
    }
  }

  // Helper to update text properties
  const updateTextProperty = (prop: string, value: any) => {
    if (slideIndex === -1 || !textObj) return;
    const updatedSlides = structuredClone(slides);
    const updateProps = (props: any) => {
      if (Object.prototype.hasOwnProperty.call(props, prop) || true) {
        (props as any)[prop] = value;
      }
    };
    if (selectedTextId?.startsWith("title")) {
      updateProps(updatedSlides[slideIndex].slide_title.properties);
    } else if (elementIndex !== null) {
      updateProps(updatedSlides[slideIndex].elements[elementIndex].properties);
    }
    dispatch(setSlides(updatedSlides));
  };

  const updateTextContent = (value: string) => {
    if (slideIndex === -1 || !textObj) return;
    const updatedSlides = structuredClone(slides);
    if (selectedTextId?.startsWith("title")) {
      updatedSlides[slideIndex].slide_title.text = value;
    } else if (elementIndex !== null) {
      updatedSlides[slideIndex].elements[elementIndex].text = value;
    }
    dispatch(setSlides(updatedSlides));
  };

  // If no text is selected, render nothing
  if (!textObj) return null;

  // Extract current values
  const {
    fontSize = 24,
    fontFamily = "Arial",
    fill = "#000",
    fontStyle = "normal",
    fontWeight = "normal",
    align = "left",
    opacity = 1,
    verticalAlign = "top",
  } = textObj.properties;

  // Alignment handler
  const handleAlign = (alignValue: string) => {
    updateTextProperty('align', alignValue);
  };

  // Vertical alignment handler
  const handleVerticalAlign = (vertical: string) => {
    updateTextProperty('verticalAlign', vertical);
  };

  // Font weight handler
  const handleFontWeight = (weight: string) => {
    updateTextProperty('fontWeight', weight);
  };

  // Opacity handler
  const handleOpacity = (value: number) => {
    updateTextProperty('opacity', value / 100);
  };

  // Bring Forward/Send Backward
  const bringForward = () => {
    if (slideIndex === -1 || elementIndex === null) return;
    const updatedSlides = structuredClone(slides);
    const elements = updatedSlides[slideIndex].elements;
    if (elementIndex < elements.length - 1) {
      const temp = elements[elementIndex];
      elements[elementIndex] = elements[elementIndex + 1];
      elements[elementIndex + 1] = temp;
      dispatch(setSlides(updatedSlides));
    }
  };

  const sendBackward = () => {
    if (slideIndex === -1 || elementIndex === null) return;
    const updatedSlides = structuredClone(slides);
    const elements = updatedSlides[slideIndex].elements;
    if (elementIndex > 0) {
      const temp = elements[elementIndex];
      elements[elementIndex] = elements[elementIndex - 1];
      elements[elementIndex - 1] = temp;
      dispatch(setSlides(updatedSlides));
    }
  };

  // Reset text element to defaults
  const resetText = () => {
    if (slideIndex === -1 || !textObj) return;
    const updatedSlides = structuredClone(slides);
    const defaultProps = {
      fontSize: 24,
      fontFamily: "Arial",
      fill: "#000",
      fontStyle: "normal",
      fontWeight: "normal",
      align: "left",
      opacity: 1,
      verticalAlign: "top",
      background: "#fff",
    };
    if (selectedTextId?.startsWith("title")) {
      updatedSlides[slideIndex].slide_title.properties = { ...defaultProps };
      // Do not reset text
    } else if (elementIndex !== null) {
      updatedSlides[slideIndex].elements[elementIndex].properties = { ...defaultProps };
      // Do not reset text
    }
    dispatch(setSlides(updatedSlides));
  };

  return (
    <Box
      sx={{
        width: 500,
        bgcolor: '#fff',
        height: sidebarHeight,
        display: 'flex',
        flexDirection: 'column',
        p: 0,
        borderRight: '1px solid #E0E0E0',
      }}
    >
      {/* Tabs */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 2, pb: 1 }}>
        <Box
          sx={{
            bgcolor: '#F5F5F5',
            color: '#222',
            fontWeight: 600,
            borderRadius: 2,
            px: 2.5,
            py: 1,
            fontSize: 15,
            mr: 2,
          }}
        >
          Settings
        </Box>
        <Box sx={{ color: '#888', fontWeight: 500, fontSize: 15, mr: 2, py: 1, cursor: 'pointer' }}>
          Animate
        </Box>
        <Box sx={{ flex: 1 }} />
        <Select
          value={50}
          size="small"
          sx={{ fontSize: 15, bgcolor: '#F5F5F5', borderRadius: 2, width: 70, height: 32 }}
          displayEmpty
          inputProps={{ 'aria-label': 'Percentage' }}
        >
          <MenuItem value={50}>50%</MenuItem>
          <MenuItem value={75}>75%</MenuItem>
          <MenuItem value={100}>100%</MenuItem>
        </Select>
      </Box>
      <Divider sx={{ my: 2 }} />
      {/* Text Section */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>Text</Typography>
          <IconButton size="small"><SettingsIcon /></IconButton>
        </Box>
        <InputBase
          value={textObj.text}
          onChange={e => updateTextContent(e.target.value)}
          fullWidth
          sx={{ mb: 1, borderRadius: 2, bgcolor: '#F8F8FA', fontWeight: 500, fontSize: 15, height: 44, px: 2 }}
        />
        <Select
          value={fontFamily}
          size="small"
          fullWidth
          sx={{ mb: 1, borderRadius: 2, bgcolor: '#F8F8FA', fontWeight: 500, fontSize: 15, height: 44 }}
          onChange={e => updateTextProperty('fontFamily', e.target.value)}
        >
          {fontOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
        </Select>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Select
            value={fontSize}
            size="small"
            sx={{ borderRadius: 2, bgcolor: '#F8F8FA', fontWeight: 500, fontSize: 15, width: 80, height: 44 }}
            onChange={e => updateTextProperty('fontSize', Number(e.target.value))}
          >
            {[16, 18, 20, 24, 28, 32, 36].map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)}
          </Select>
          <Select
            value={fontWeight}
            size="small"
            sx={{ borderRadius: 2, bgcolor: '#F8F8FA', fontWeight: 500, fontSize: 15, width: 120, height: 44 }}
            onChange={e => handleFontWeight(e.target.value)}
          >
            <MenuItem value="normal">Regular</MenuItem>
            <MenuItem value="600">Semibold</MenuItem>
            <MenuItem value="bold">Bold</MenuItem>
          </Select>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <IconButton sx={{ bgcolor: align === 'left' ? '#E0E0E0' : '#F8F8FA', borderRadius: 2, width: 48, height: 48 }} onClick={() => handleAlign('left')}><FormatAlignLeftIcon sx={{ fontSize: 32 }} /></IconButton>
          <IconButton sx={{ bgcolor: align === 'center' ? '#E0E0E0' : '#F8F8FA', borderRadius: 2, width: 48, height: 48 }} onClick={() => handleAlign('center')}><FormatAlignCenterIcon sx={{ fontSize: 32 }} /></IconButton>
          <IconButton sx={{ bgcolor: align === 'right' ? '#E0E0E0' : '#F8F8FA', borderRadius: 2, width: 48, height: 48 }} onClick={() => handleAlign('right')}><FormatAlignRightIcon sx={{ fontSize: 32 }} /></IconButton>
          <IconButton sx={{ bgcolor: align === 'justify' ? '#E0E0E0' : '#F8F8FA', borderRadius: 2, width: 48, height: 48 }} onClick={() => handleAlign('justify')}><FormatAlignJustifyIcon sx={{ fontSize: 32 }} /></IconButton>
         {/* Inner vertical alignment */}
         <Box sx={{ display: 'flex', gap: 1, ml: 2, bgcolor: '#F8F8FA', borderRadius: 2, px: 1 }}>
           <IconButton sx={{ bgcolor: verticalAlign === 'top' ? '#E0E0E0' : 'transparent', borderRadius: 2, width: 38, height: 38 }} onClick={() => handleVerticalAlign('top')}><VerticalAlignTopIcon sx={{ fontSize: 28 }} /></IconButton>
           <IconButton sx={{ bgcolor: verticalAlign === 'middle' ? '#E0E0E0' : 'transparent', borderRadius: 2, width: 38, height: 38 }} onClick={() => handleVerticalAlign('middle')}><VerticalAlignCenterIcon sx={{ fontSize: 28 }} /></IconButton>
           <IconButton sx={{ bgcolor: verticalAlign === 'bottom' ? '#E0E0E0' : 'transparent', borderRadius: 2, width: 38, height: 38 }} onClick={() => handleVerticalAlign('bottom')}><VerticalAlignBottomIcon sx={{ fontSize: 28 }} /></IconButton>
         </Box>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      {/* Color Section */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 1 }}>Color</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: '#6C2CF8',
              border: '1px solid #E0E0E0',
            }}
          />
          <Select
            value={''}
            displayEmpty
            size="small"
            sx={{ flex: 1, bgcolor: '#F5F5F5', borderRadius: 2, height: 40 }}
            inputProps={{ 'aria-label': 'Choose Style' }}
          >
            <MenuItem value={''} disabled>Choose Style</MenuItem>
            <MenuItem value={'style1'}>Style 1</MenuItem>
            <MenuItem value={'style2'}>Style 2</MenuItem>
          </Select>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      {/* Effects Section */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>Effects</Typography>
          <Select
            value={"Opacity"}
            size="small"
            sx={{ fontSize: 15, bgcolor: '#F5F5F5', borderRadius: 2, width: 90, height: 32 }}
            displayEmpty
            inputProps={{ 'aria-label': 'Effect Type' }}
          >
            <MenuItem value={"Opacity"}>Opacity</MenuItem>
          </Select>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Slider value={Math.round(opacity * 100)} onChange={(_, v) => handleOpacity(Number(v))} sx={{ color: '#7B4AE2', flex: 1 }} />
          <InputBase value={`${Math.round(opacity * 100)}%`} sx={{ width: 54, fontWeight: 600, fontSize: 16, bgcolor: '#F8F8FA', borderRadius: 2, px: 1.5, py: 0.5, textAlign: 'center' }} readOnly />
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      {/* Layer Order Section */}
      <Box sx={{ px: 3, mb: 2, display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowUpwardIcon />}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            fontSize: 15,
            bgcolor: '#F8F8FA',
            borderColor: '#E0E0E0',
            color: '#222',
            flex: 1,
            textTransform: 'none',
            '&:hover': { bgcolor: '#F3EDFF', borderColor: '#7B4AE2', color: '#7B4AE2' },
          }}
          onClick={bringForward}
        >
          Bring Forward
        </Button>
        <Button
          variant="outlined"
          startIcon={<ArrowDownwardIcon />}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            fontSize: 15,
            bgcolor: '#F8F8FA',
            borderColor: '#E0E0E0',
            color: '#222',
            flex: 1,
            textTransform: 'none',
            '&:hover': { bgcolor: '#F3EDFF', borderColor: '#7B4AE2', color: '#7B4AE2' },
          }}
          onClick={sendBackward}
        >
          Send Backward
        </Button>
      </Box>
      {/* Reset Button */}
      <Box sx={{ px: 3, pb: 3, pt: 2 }}>
        <Button
          fullWidth
          sx={{
            bgcolor: 'linear-gradient(90deg, #7B4AE2 0%, #5F2EEA 100%)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 18,
            borderRadius: 8,
            py: 1.5,
            textTransform: 'none',
            boxShadow: '0 2px 8px 0 rgba(123,74,226,0.15)',
            background: 'linear-gradient(90deg, #7B4AE2 0%, #5F2EEA 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, #5F2EEA 0%, #7B4AE2 100%)',
            },
          }}
          onClick={() => {
            // Only reset the current slide to its _initialState
            if (slideIndex === -1 || !slides[slideIndex]?._initialState) return;
            const updatedSlides = structuredClone(slides);
            // Don't copy _initialState itself to avoid infinite nesting
            const { _initialState, ...rest } = updatedSlides[slideIndex]._initialState as Slide;
            updatedSlides[slideIndex] = { ...rest, _initialState: updatedSlides[slideIndex]._initialState };
            dispatch(setSlides(updatedSlides));
          }}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default TextSettingsPanel; 