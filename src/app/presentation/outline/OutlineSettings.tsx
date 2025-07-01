import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
} from "@mui/material";

const OutlineSettings = () => {
  return (
    <Box sx={{ position: "sticky", top: 100 }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        {["Style", "Language", "Goal", "Tone", "Audience"].map((label) => (
          <FormControl fullWidth size="small" sx={{ mb: 2 }} key={label}>
            <InputLabel>{`Choose ${label}`}</InputLabel>
            <Select label={`Choose ${label}`} defaultValue="">
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Option1">Option 1</MenuItem>
            </Select>
          </FormControl>
        ))}

        <Typography sx={{ mb: 1 }}>Length Slider</Typography>
        <Slider defaultValue={50} />
      </Paper>

      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, mb: 3 }}>
        <Typography fontWeight="bold" mb={1}>
          Image Selection
        </Typography>
        <Typography variant="body2">
          Learn expert negotiation tips to close deals effectively.
        </Typography>
      </Paper>

      <Paper elevation={0} sx={{ p: 2, borderRadius: 3 }}>
        <Typography fontWeight="bold" mb={1}>
          Guide
        </Typography>
        <Typography variant="body2">
          Discover the best marketing strategies to showcase your properties.
        </Typography>
      </Paper>
    </Box>
  );
};

export default OutlineSettings;
