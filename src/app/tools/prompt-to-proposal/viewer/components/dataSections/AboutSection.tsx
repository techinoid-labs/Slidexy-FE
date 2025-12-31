"use client";
import { Box, Typography, TextField, Divider, Grid } from "@mui/material";

type Props = {
  data: any;
  onChange: (updated: any) => void;
};

export default function AboutSection({ data, onChange }: Props) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">About Company</Typography>
      <Grid item xs={6}>
        <TextField
          label="Company"
          fullWidth
          value={data.company}
          onChange={(e) => onChange({ ...data, company: e.target.value })}
        />
      </Grid>

      <TextField
        label="Company Description"
        fullWidth
        multiline
        rows={4}
        sx={{ mt: 2 }}
        value={data.aboutCompany.description}
        onChange={(e) =>
          onChange({
            ...data,
            aboutCompany: {
              ...data.aboutCompany,
              description: e.target.value,
            },
          })
        }
      />

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {["countriesWorkedWith", "businessesWorkedWith", "startupsSupported", "industriesWorkedWith"].map(
          (key) => (
            <Grid item xs={6} key={key}>
              <TextField
                label={key.replace(/([A-Z])/g, " $1")}
                fullWidth
                value={data.aboutCompany[key]}
                onChange={(e) =>
                  onChange({
                    ...data,
                    aboutCompany: {
                      ...data.aboutCompany,
                      [key]: e.target.value,
                    },
                  })
                }
              />
            </Grid>
          )
        )}
      </Grid>

      <Divider sx={{ my: 3 }} />
    </Box>
  );
}
