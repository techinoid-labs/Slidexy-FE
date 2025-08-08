"use client";

import {
  Box,
  MenuItem,
  Select,
  FormControl,
  useTheme,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

export default function PromptAttributeSelector({
  goal,
  tone,
  audience,
  slideCount,
  setGoal,
  setTone,
  setAudience,
  setSlideCount,
}: {
  goal: string;
  tone: string;
  audience: string;
  slideCount: string;
  setGoal: (val: string) => void;
  setTone: (val: string) => void;
  setAudience: (val: string) => void;
  setSlideCount: (val: string) => void;
}) {
  const theme = useTheme();

  const dropdownStyles = {
    flex: { xs: "1 1 100%", sm: "1 1 0" },
    backgroundColor: "#fff",
    borderRadius: "12px",
    px: 1,
    py: 1,
    fontSize: 9,
    minWidth: 160,
    fontWeight: 400,
    border: `1px solid ${theme.palette.grey[200]}`,
    color: theme.palette.grey[600],
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
    "& .MuiSelect-select": {
      py: 0.2,
    },
    "& .MuiSelect-icon": {
      color: theme.palette.grey[400],
    },
    "& fieldset": {
      border: "none",
    },
  };

  const renderMenuItem = (
    value: string,
    label: string,
    selectedValue: string
  ) => (
    <MenuItem
      key={value}
      value={value}
      sx={{
        fontWeight: value === selectedValue ? 600 : 400,
        color:
          value === selectedValue
            ? theme.palette.secondary.main
            : theme.palette.grey[700],
        display: "flex",
        justifyContent: "space-between",
        py: 1,
        px: 2,
        "&:hover": {
          backgroundColor: theme.palette.secondary.light + "11",
        },
      }}
    >
      <ListItemText sx={{ fontSize: 14, pt: 0.2 }}>{label}</ListItemText>
      {value === selectedValue && (
        <ListItemIcon
          sx={{
            minWidth: 0,
            color: theme.palette.secondary.main,
          }}
        >
          <CheckIcon fontSize="small" />
        </ListItemIcon>
      )}
    </MenuItem>
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 2,
        width: "100%",
        mb: 4,
      }}
    >
      <FormControl fullWidth sx={dropdownStyles}>
        <Select
          value={goal}
          sx={{ fontSize: 14, pt: 0.2 }}
          displayEmpty
          onChange={(e) => setGoal(e.target.value)}
          renderValue={(selected) => selected || "Select Goal"}
        >
          {renderMenuItem("Pitch", "Pitch", goal)}
          {renderMenuItem("Report", "Report", goal)}
          {renderMenuItem("Portfolio", "Portfolio", goal)}
          {renderMenuItem("Lesson", "Lesson", goal)}
          {renderMenuItem("Personal", "Personal", goal)}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={dropdownStyles}>
        <Select
          value={tone}
          sx={{ fontSize: 14, pt: 0.2 }}
          displayEmpty
          onChange={(e) => setTone(e.target.value)}
          renderValue={(selected) => selected || "Select Tone"}
        >
          {renderMenuItem("Minimal", "Minimal", tone)}
          {renderMenuItem("Professional", "Professional", tone)}
          {renderMenuItem("Friendly", "Friendly", tone)}
          {renderMenuItem("Storytelling", "Storytelling", tone)}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={dropdownStyles}>
        <Select
          value={audience}
          sx={{ fontSize: 14, pt: 0.2 }}
          displayEmpty
          onChange={(e) => setAudience(e.target.value)}
          renderValue={(selected) => selected || "Select Audience"}
        >
          {renderMenuItem("General", "General", audience)}
          {renderMenuItem("Student", "Student", audience)}
          {renderMenuItem("Customer", "Customer", audience)}
          {renderMenuItem("Investor", "Investor", audience)}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={dropdownStyles}>
        <Select
          value={slideCount}
          sx={{ fontSize: 14, pt: 0.2 }}
          displayEmpty
          onChange={(e) => setSlideCount(e.target.value)}
          renderValue={(selected) => selected || "No. of Slides"}
        >
          {renderMenuItem("3", "3", slideCount)}
          {renderMenuItem("6", "6", slideCount)}
          {renderMenuItem("12", "12", slideCount)}
        </Select>
      </FormControl>
    </Box>
  );
}
