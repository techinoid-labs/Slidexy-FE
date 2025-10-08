"use client";
import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const AccountSettings: React.FC = () => {
  const [language, setLanguage] = React.useState("English");

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Account Settings
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
        Manage your public and private information
      </Typography>

      <Card
        elevation={0}
        sx={{
          border: "1px solid #eee",
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Profile photo row */}
          {/* <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src="/placeholder-avatar.png"
                sx={{ width: 64, height: 64 }}
              />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                This image must be larger than 96×96 pixels. JPEG, PNG, and SVG
                formats are supported.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              sx={{ borderRadius: 1.2, textTransform: "none" }}
            >
              Edit Profile Photo
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} /> */}

          {/* Email */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Box>
              <Typography fontWeight={600}>Email</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                john.doe@gmail.com
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              sx={{ borderRadius: 1.2, textTransform: "none" }}
            >
              Change
            </Button>
          </Box>

          {/* Password */}
          {/* <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Box>
              <Typography fontWeight={600}>Password</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Not Set
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              sx={{ borderRadius: 1.2, textTransform: "none" }}
            >
              Set Your Password
            </Button>
          </Box> */}

          {/* Close Account */}
          {/* <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Box>
              <Typography fontWeight={600}>Close Account</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Your account will be deleted permanently and can’t be restored.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="error"
              size="small"
              sx={{ borderRadius: 1.2, textTransform: "none" }}
            >
              Close Account
            </Button>
          </Box> */}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AccountSettings;
