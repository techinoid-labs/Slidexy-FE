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
  length,
  setGoal,
  setTone,
  setAudience,
  setLength,
}: {
  goal: string;
  tone: string;
  audience: string;
  length: string;
  setGoal: (val: string) => void;
  setTone: (val: string) => void;
  setAudience: (val: string) => void;
  setLength: (val: string) => void;
}) {
  const theme = useTheme();

  const dropdownStyles = {
    flex: { xs: "1 1 100%", sm: "1 1 0" },
    backgroundColor: "#fff",
    borderRadius: "12px",
    px: 2,
    py: 1,
    fontSize: "0.95rem", // << Font size of the select box label (adjust here)
    minWidth: 160,
    fontWeight: 500,
    border: `1px solid ${theme.palette.grey[200]}`,
    color: theme.palette.grey[600], // << Font color inside the select box (adjust here)
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
    "& .MuiSelect-select": {
      py: 1.2,
    },
    "& .MuiSelect-icon": {
      color: theme.palette.grey[400], // << Dropdown arrow color
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
        fontSize: "0.925rem", // << Font size inside dropdown menu items (adjust here)
        color:
          value === selectedValue
            ? theme.palette.secondary.main
            : theme.palette.grey[700], // << Menu text color
        display: "flex",
        justifyContent: "space-between",
        py: 1,
        px: 2,
        "&:hover": {
          backgroundColor: theme.palette.secondary.light + "11",
        },
      }}
    >
      <ListItemText>{label}</ListItemText>
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
          value={length}
          displayEmpty
          onChange={(e) => setLength(e.target.value)}
          renderValue={(selected) => selected || "Length Slider"}
        >
          {renderMenuItem("Short", "Short", length)}
          {renderMenuItem("Medium", "Medium", length)}
          {renderMenuItem("Long", "Long", length)}
        </Select>
      </FormControl>
    </Box>
  );
}
