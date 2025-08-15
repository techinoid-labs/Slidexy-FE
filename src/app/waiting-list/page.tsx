'use client'
import { Box, Stack, Typography, Button, Chip, InputBase, Paper } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function WaitingList() {
 
  
    const [email, setEmail] = React.useState("");

    return (
      <Box sx={{ backgroundColor: "#f9f6ff" }}>
        {/* Header Section */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }} // stack on small screens
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          sx={{
            p: { xs: 4, sm: 6, md: "60px" }, // adaptive padding
            gap: { xs: 3, sm: 0 },
          }}
        >
          <Box>
            <Image
              src="/images/Logo.svg"
              alt="Slides Logo"
              width={118}
              height={36}
            />
          </Box>

          <Stack
            direction="row"
            spacing={3}
            justifyContent={{ xs: "flex-start", sm: "center" }}
            alignItems="center"
            sx={{ mb: { xs: 0, sm: 3 } }}
          >
            {[
              { src: "/images/facebook-icon.svg", alt: "Facebook" },
              { src: "/images/x-icon.svg", alt: "Twitter" },
              { src: "/images/instagram.svg", alt: "Instagram" },
            ].map((icon, idx) => (
              <Link key={idx} href="#">
                <Box
                  component="img"
                  src={icon.src}
                  alt={icon.alt}
                  sx={{ width: 14, height: 14, display: "block" }}
                />
              </Link>
            ))}
          </Stack>
        </Box>

        {/* Content Section */}
        <Box sx={{ backgroundColor: "#f9f6ff", py: { xs: 6, md: 10 } }}>
          <Box
            sx={{
              maxWidth: "1300px",
              mx: "auto",
              borderRadius: "30px",
              backgroundColor: "white",
              px: { xs: 3, sm: 4, md: 10 },
              py: { xs: 4, sm: 6, md: 8 },
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems="center"
              spacing={{ xs: 4, md: 6 }}
            >
              {/* Left Column - Text */}
              <Stack spacing={3} flex={1}>
                <Typography
                  variant="h4"
                  fontWeight={600}
                  sx={{
                    fontSize: { xs: "24px", sm: "28px", md: "36px" },
                    lineHeight: 1.2,
                  }}
                >
                  Generate Slides Instantly with Slidexy AI
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    maxWidth: "580px",
                    fontSize: { xs: "16px", md: "18px" },
                    color: "text.secondary",
                  }}
                >
                  You can enjoy the above benefits and so much more in one
                  platform. Click the button below to join waitlist
                </Typography>

                <Button
                  variant="contained"
                  sx={{
                    width: "fit-content",
                    px: { xs: "20px", md: "28px" },
                    py: { xs: "10px", md: "12px" },
                    textTransform: "none",
                    fontSize: { xs: "14px", md: "16px" },
                    fontWeight: 500,
                    borderRadius: "30px",
                    background: "white",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                    color: "#4A00E0",
                  }}
                >
                  Join Waitlist
                  <Box
                    component="img"
                    src="/images/forwardArrow.svg"
                    alt="Arrow Right"
                    sx={{ width: 16, height: 16, ml: 1 }}
                  />
                </Button>
              </Stack>

              {/* Right Column - Image */}
              <Box
                sx={{
                  display: "inline-block",
                  backgroundColor: "#642cd6",
                  borderRadius: "24px",
                  paddingTop: "17px",
                  paddingLeft: "24px",
                  maxWidth: { xs: "100%", md: "auto" }, // responsive width
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "20px",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src="/images/PresentationPreview.svg"
                    alt="Waiting List Illustration"
                    width={600}
                    height={400}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </Box>
              </Box>
            </Stack>
          </Box>
        </Box>

        {/* Footer Section  */}

        <Box sx={{ pb: "30px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: { xs: 2, md: 7 },
              mb: 2,
            }}
          >
            <Box
              display="inline-flex"
              alignItems="center"
              sx={{
                px: 1.5,
                py: 0.7,
                fontSize: { xs: "0.8rem", md: "0.95rem" },
                borderRadius: "600px",
                color: "#4A00E0",
              }}
            >
              <Image
                src="/images/side-star-purple.svg"
                alt="Icon"
                width={18}
                height={18}
                style={{ marginRight: "6px" }}
              />
              <Typography
                component="span"
                sx={{
                  fontSize: "inherit",
                  fontWeight: 500,
                  lineHeight: 1.2,
                }}
              >
                COMING SOON
              </Typography>
            </Box>
          </Box>
          {/* Main Heading */}
          <Box sx={{ textAlign: "center", mt: 1, mb: 2, zIndex: 100 }}>
            <Typography
              variant="h1"
              noWrap
              sx={{
                fontSize: { xs: 30, md: 50, lg: 50 },
                fontWeight: 550,
                mb: 4,
                lineHeight: 1.3,
                color: "#000000",
                whiteSpace: { xs: "normal", md: "nowrap" },
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Unleash Your Imagination. <br />{" "}
              <Typography
                component="span"
                variant="inherit"
                sx={{ color: "#000000" }}
                fontWeight={300}
              >
                Create Without Limits.
              </Typography>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                mx: "auto",
                lineHeight: 1.3,
                fontSize: { xs: "16px", md: "16px" },
                fontWeight: 400,
                textAlign: "center", // Ensure text is centered
              }}
            >
              <span>
                The tool artists, designers, and dreamers have been waiting for{" "}
              </span>
              <Box
                component="span"
                sx={{
                  display: { xs: "block", md: "inline" },
                }}
              >
                powered by AI, styled by designers.
              </Box>
            </Typography>
          </Box>

          <Box
            component="form"
            sx={{
              width: "100%",
              maxWidth: 560,
              mx: "auto",
              px: { xs: 2, sm: 0 },
              paddingBottom: "40px",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: { xs: 1, sm: 1.5 },
                py: { xs: 0.5, sm: 0.75 },
                borderRadius: "40px",
                border: "1px solid",
                borderColor: "#E6E6EB",
                bgcolor: "#fff",
              }}
            >
              <InputBase
                type="email"
                placeholder="Type email address here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                inputProps={{ "aria-label": "email address", required: true }}
                sx={{
                  flex: 1,
                  fontSize: { xs: 14, sm: 16 },
                  px: { xs: 1, sm: 1.5 },
                }}
              />

              <Button
                variant="contained"
                sx={{
                  width: "fit-content",
                  px: { xs: "20px", md: "20px" },
                  py: { xs: "14px", md: "14px" },
                  textTransform: "none",
                  fontSize: { xs: "14px", md: "16px" },
                  fontWeight: 500,
                  borderRadius: "30px",
                  background: "#8E2DE2",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                  color: "white",
                }}
              >
                Join the Wishlist
                <Box
                  component="img"
                  src="/images/whiteArrow.svg"
                  alt="Arrow Right"
                  sx={{ width: 16, height: 16, ml: 1 }}
                />
              </Button>
            </Paper>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
            }}
          >
            {[
              "/images/Ellipse5.svg",
              "/images/Ellipse6.svg",
              "/images/Ellipse7.svg",
            ].map((image) => (
              <Box
                key={image}
                component="img"
                src={image} // replace with your own paths
                alt={`Sample ${image}`}
                sx={{
                  width: 25,
                  objectFit: "cover",
                  borderRadius: 3.75,
                }}
              />
            ))}

            <Typography
              variant="h5"
              sx={{ fontSize: "16px", fontWeight: "400px", color: "#6D6D6D" }}
            >
              Trusted by 10k+ people
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={3}
            justifyContent={{ xs: "flex-start", sm: "center" }}
            alignItems="center"
            marginTop={5}
          >
            {[
              { src: "/images/facebook-icon.svg", alt: "Facebook" },
              { src: "/images/x-icon.svg", alt: "Twitter" },
              { src: "/images/instagram.svg", alt: "Instagram" },
            ].map((icon, idx) => (
              <Link key={idx} href="#">
                <Box
                  component="img"
                  src={icon.src}
                  alt={icon.alt}
                  sx={{ width: 14, height: 14, display: "block" }}
                />
              </Link>
            ))}
          </Stack>
        </Box>
      </Box>
    );
}
