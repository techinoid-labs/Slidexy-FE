"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { DeleteOutline, Add } from "@mui/icons-material";

type Props = {
  data: any;
  onChange: (updated: any) => void;
};

export default function KeyFeaturesSection({ data, onChange }: Props) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" fontWeight={600}>
        Key Features
      </Typography>

      <Stack spacing={2} sx={{ mt: 2 }}>
        {data.keyFeaturesOverview.map((f: any, i: number) => (
          <Card
            key={i}
            variant="outlined"
            sx={{
              borderRadius: 2,
              position: "relative",
            }}
          >
            <CardContent>
              <Stack spacing={1.5}>
                <TextField
                  label="Feature"
                  fullWidth
                  value={f.feature}
                  onChange={(e) => {
                    const updated = [...data.keyFeaturesOverview];
                    updated[i].feature = e.target.value;
                    onChange({ ...data, keyFeaturesOverview: updated });
                  }}
                />

                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  minRows={3}
                  value={f.description}
                  onChange={(e) => {
                    const updated = [...data.keyFeaturesOverview];
                    updated[i].description = e.target.value;
                    onChange({ ...data, keyFeaturesOverview: updated });
                  }}
                />
              </Stack>

              <IconButton
                size="small"
                color="error"
                sx={{ position: "absolute", top: 8, right: 8 }}
                onClick={() => {
                  const updated = data.keyFeaturesOverview.filter(
                    (_: any, idx: number) => idx !== i
                  );
                  onChange({ ...data, keyFeaturesOverview: updated });
                }}
              >
                <DeleteOutline />
              </IconButton>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="outlined"
          startIcon={<Add />}
          sx={{ alignSelf: "flex-start" }}
          onClick={() => {
            const updated = [
              ...data.keyFeaturesOverview,
              { feature: "", description: "" },
            ];
            onChange({ ...data, keyFeaturesOverview: updated });
          }}
        >
          Add Feature
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }} />
    </Box>
  );
}
